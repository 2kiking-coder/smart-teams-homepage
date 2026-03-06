import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_FILE = path.join(process.cwd(), "app", "contact", "data", "contact-status.json");

type AdminStatus = "PENDING" | "DONE";
type StatusMap = Record<string, AdminStatus>;

async function readStatus(): Promise<StatusMap> {
  try {
    const raw = await fs.readFile(STATUS_FILE, "utf-8");
    const obj = JSON.parse(raw);
    return (obj && typeof obj === "object") ? obj : {};
  } catch {
    return {};
  }
}

async function writeStatus(map: StatusMap) {
  await fs.mkdir(path.dirname(STATUS_FILE), { recursive: true });
  await fs.writeFile(STATUS_FILE, JSON.stringify(map, null, 2), "utf-8");
}

function normalize(v: any): AdminStatus | null {
  if (v === "PENDING" || v === "DONE") return v;
  const s = String(v || "").toUpperCase();
  if (s === "PENDING" || s === "DONE") return s as AdminStatus;
  return null;
}

export async function PATCH(req: Request) {
  const { updates } = await req.json();

  if (!updates || typeof updates !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const cur = await readStatus();

  for (const [id, st] of Object.entries(updates)) {
    const ns = normalize(st);
    if (ns) cur[id] = ns;
  }

  await writeStatus(cur);

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
