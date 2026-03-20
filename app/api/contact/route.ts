// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { sendContactEmail } from "@/app/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json(
      { ok: true, items: rows },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "문의 목록 조회 실패" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));

    const company = String(body.company ?? "").trim();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!company || !name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "필수값 누락 (company/name/email/message)" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";

    const ua = req.headers.get("user-agent") || "";
    const createdAt = new Date();
    const since = new Date(createdAt.getTime() - 30_000);

    const dup = await prisma.contact.findFirst({
      where: {
        email,
        message,
        createdAt: { gte: since },
      },
      select: { id: true },
    });

    if (dup) {
      return NextResponse.json(
        { ok: false, error: "중복 문의로 판단되어 차단되었습니다(30초 이내 동일 내용)." },
        { status: 429, headers: { "Cache-Control": "no-store" } }
      );
    }

    const saved = await prisma.contact.create({
      data: {
        company,
        name,
        email,
        phone,
        message,
        createdAt,
        ip,
        userAgent: ua,
      },
    });

    let mailOk = false;
    let mailError = "";

    try {
      await sendContactEmail({
        company,
        name,
        email,
        phone,
        message,
        createdAt: createdAt.toISOString(),
        ip,
        ua,
      });
      mailOk = true;
    } catch (e: any) {
      mailError = e?.message || String(e);
    }

    return NextResponse.json(
      {
        ok: true,
        id: String(saved.id),
        createdAt: createdAt.toISOString(),
        mailOk,
        mailError,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "문의 저장 실패" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}