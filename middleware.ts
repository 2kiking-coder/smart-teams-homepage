import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Smart Teams Admin"' },
  });
}

export function middleware(req: NextRequest) {
  // /admin 이하만 보호
  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASS || "";

  // 비번 비어있으면 무조건 차단(운영 안전)
  if (!pass) return unauthorized();

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  const base64 = auth.slice("Basic ".length);
  let decoded = "";
  try {
    decoded = Buffer.from(base64, "base64").toString("utf-8");
  } catch {
    return unauthorized();
  }

  const [u, p] = decoded.split(":");
  if (u === user && p === pass) return NextResponse.next();
  return unauthorized();
}

export const config = {
  matcher: ["/admin/:path*"],
};