import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_PATH = path.join(process.cwd(), "app", "contact", "data", "contact-status.json");

function readStatusFile(): Record<string, "PENDING" | "DONE"> {
  try {
    if (!fs.existsSync(STATUS_PATH)) return {};
    const txt = fs.readFileSync(STATUS_PATH, "utf-8");
    const json = JSON.parse(txt || "{}");
    return json && typeof json === "object" ? json : {};
  } catch {
    return {};
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const take = Math.min(parseInt(url.searchParams.get("take") || "200", 10), 500);
    const skip = Math.max(parseInt(url.searchParams.get("skip") || "0", 10), 0);

    const [rows, total] = await Promise.all([
      prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        take,
        skip,
        select: {
          id: true,
          company: true,
          name: true,
          email: true,
          phone: true,
          message: true,
          ip: true,
          userAgent: true,
          createdAt: true,
        },
      }),
      prisma.contact.count(),
    ]);

    const status = readStatusFile();

    const items = rows.map((r) => ({
      id: String(r.id),
      company: r.company ?? "",
      name: r.name ?? "",
      email: r.email ?? "",
      phone: r.phone ?? "",
      message: r.message ?? "",
      createdAt: r.createdAt.toISOString(),
      ip: r.ip ?? "",
      ua: r.userAgent ?? "",
    }));

    return NextResponse.json(
      { ok: true, total, items, status },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "조회 실패" },
      { status: 500 }
    );
  }
}