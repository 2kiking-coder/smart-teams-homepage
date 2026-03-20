import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const auth = req.cookies.get("admin_auth")?.value;

    if (auth !== "1") {
      // IIS 리버스 프록시 뒤에서도 올바른 호스트/프로토콜로 리다이렉트
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = "";
      loginUrl.searchParams.set("next", pathname + search);

      // IIS가 SSL 종료 후 HTTP로 전달하는 경우 프로토콜 보정
      const forwardedProto = req.headers.get("x-forwarded-proto");
      if (forwardedProto) {
        loginUrl.protocol = forwardedProto + ":";
      }

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};