import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const DATA_PATH = path.join(process.cwd(), "data", "cases.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "cases");

function readCases() {
  if (!fs.existsSync(DATA_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8") || "[]");
}

function writeCases(data: any) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    const formData = await req.formData();
    const company = String(formData.get("company") || "").trim();
    const file = formData.get("logo") as File | null;

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "수정할 항목 ID가 없습니다." },
        { status: 400 }
      );
    }

    if (!company) {
      return NextResponse.json(
        { ok: false, message: "회사명을 입력하세요." },
        { status: 400 }
      );
    }

    const cases = readCases();
    const index = cases.findIndex((item: any) => item.id === id);

    if (index === -1) {
      return NextResponse.json(
        { ok: false, message: "수정할 도입사례를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    let logoPath = cases[index].logo;

    if (file && typeof file !== "string" && file.size > 0) {
      ensureUploadDir();

      const ext = path.extname(file.name) || ".png";
      const safeCompany = company.replace(/[^\w가-힣-]/g, "_");
      const fileName = `${Date.now()}_${safeCompany}${ext}`;
      const savePath = path.join(UPLOAD_DIR, fileName);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(savePath, buffer);

      if (cases[index].logo) {
        const oldPath = path.join(
          process.cwd(),
          "public",
          cases[index].logo.replace(/^\/+/, "")
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      logoPath = `/uploads/cases/${fileName}`;
    }

    cases[index] = {
      ...cases[index],
      company,
      logo: logoPath,
      updatedAt: new Date().toISOString(),
    };

    writeCases(cases);

    return NextResponse.redirect(new URL("/admin/cases", req.url), 303);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, message: "수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}