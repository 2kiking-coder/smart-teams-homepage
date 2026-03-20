import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_PATH = path.join(DATA_DIR, "cases.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "cases");

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, "[]", "utf-8");
}

function readCases() {
  ensureDirs();
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  try {
    const json = JSON.parse(raw || "[]");
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

function writeCases(data: unknown) {
  ensureDirs();
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(req: Request) {
  try {
    ensureDirs();

    const formData = await req.formData();
    const company = String(formData.get("company") || "").trim();
    const file = formData.get("logo") as File | null;

    if (!company) {
      return NextResponse.json(
        { ok: false, message: "회사명을 입력하세요." },
        { status: 400 }
      );
    }

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { ok: false, message: "로고 파일을 선택하세요." },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name) || ".png";
    const safeCompany = company.replace(/[^\w가-힣-]/g, "_");
    const fileName = `${Date.now()}_${safeCompany}${ext}`;
    const savePath = path.join(UPLOAD_DIR, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(savePath, buffer);

    const cases = readCases();
    const nextId =
      cases.length > 0 ? Math.max(...cases.map((item: any) => item.id || 0)) + 1 : 1;

    const newItem = {
      id: nextId,
      company,
      logo: `/uploads/cases/${fileName}`,
      createdAt: new Date().toISOString(),
    };

    cases.push(newItem);
    writeCases(cases);

    return NextResponse.json({
      ok: true,
      message: "도입사례가 등록되었습니다.",
      item: newItem,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, message: "저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}