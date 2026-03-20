import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const DATA_PATH = path.join(process.cwd(), "data", "cases.json");
const UPLOAD_DIR = path.join(process.cwd(), "public");

function readCases() {
  if (!fs.existsSync(DATA_PATH)) return [];
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  try {
    const json = JSON.parse(raw || "[]");
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

function writeCases(data: unknown) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "삭제할 ID가 없습니다." },
        { status: 400 }
      );
    }

    const cases = readCases();
    const target = cases.find((item: any) => item.id === id);

    if (!target) {
      return NextResponse.json(
        { ok: false, message: "대상을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const filtered = cases.filter((item: any) => item.id !== id);
    writeCases(filtered);

    if (target.logo) {
      const filePath = path.join(UPLOAD_DIR, target.logo.replace(/^\//, ""));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, message: "삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}