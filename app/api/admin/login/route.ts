import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = String(body?.user ?? "").trim();
    const pass = String(body?.pass ?? "").trim();

    const adminUser = String(process.env.ADMIN_USER ?? "admin").trim();
    const adminPass = String(
      process.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASS ?? ""
    ).trim();

    if (!user || !pass) {
      return NextResponse.json(
        { ok: false, error: "아이디/비밀번호를 입력하세요." },
        { status: 400 }
      );
    }

    if (!adminPass) {
      return NextResponse.json(
        { ok: false, error: "서버 관리자 비밀번호가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    if (user !== adminUser || pass !== adminPass) {
      return NextResponse.json(
        { ok: false, error: "아이디 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ ok: true });

    // X-Forwarded-Proto 헤더로 실제 프로토콜 확인 (IIS 리버스 프록시 대응)
    const forwardedProto = req.headers.get("x-forwarded-proto");
    const isHttps = forwardedProto === "https";

    res.cookies.set("admin_auth", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps,
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}