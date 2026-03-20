import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const DATA_PATH = path.join(process.cwd(), "data", "cases.json");

function readCases() {
  if (!fs.existsSync(DATA_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8") || "[]");
}

function writeCases(data: any) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

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
        { ok: false, message: "삭제 대상 없음" },
        { status: 404 }
      );
    }

    // 👉 파일 삭제 로직
    if (target.logo) {
      const filePath = path.join(
        process.cwd(),
        "public",
        target.logo.replace(/^\/+/, "")
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 👉 데이터 삭제
    const newCases = cases.filter((item: any) => item.id !== id);
    writeCases(newCases);

    return NextResponse.redirect(new URL("/admin/cases", req.url), 303);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, message: "삭제 중 오류 발생" },
      { status: 500 }
    );
  }
}