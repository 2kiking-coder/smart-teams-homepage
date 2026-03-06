import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 프로젝트 루트 기준으로 data 파일 위치를 맞추세요
    // 예: app/contact/data/contact-submissions.jsonl 이런 구조면 아래처럼:
    const filePath = path.join(process.cwd(), "app", "contact", "data", "contact-submissions.jsonl");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ ok: true, items: [] });
    }

    const raw = fs.readFileSync(filePath, "utf-8").trim();
    if (!raw) return NextResponse.json({ ok: true, items: [] });

    // jsonl: 한 줄에 JSON 하나
    const items = raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));

    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "Failed to read contact submissions" },
      { status: 500 }
    );
  }
}
