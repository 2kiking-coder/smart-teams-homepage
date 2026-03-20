"use client";

import Link from "next/link";

export default function HeroMobileOptimized() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071a2f]">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.02]"
        style={{ backgroundImage: "url('/screens/hero-hex.png')" }}
      />

      {/* 상단 오버레이 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,12,22,0.42),rgba(4,12,24,0.56),rgba(4,12,24,0.74))]" />

      {/* 중앙 비네트 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.12)_44%,rgba(0,0,0,0.28)_100%)]" />

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-7xl items-center px-5 pb-10 pt-24 sm:px-6 md:min-h-[760px] md:px-10 md:pt-28 lg:px-16">
        <div className="w-full max-w-[360px] sm:max-w-[430px] md:max-w-[720px]">
          {/* 배지 */}
          <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-medium leading-4 text-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-sm sm:text-xs">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span className="truncate">
              전자결재·경비·자원예약을 Microsoft 365 그대로
            </span>
          </div>

          {/* 타이틀 */}
          <h1 className="text-[40px] font-extrabold leading-[1.08] tracking-[-0.04em] text-white sm:text-[48px] md:text-[64px] lg:text-[76px]">
            TEAMS 하나로
            <br />
            완성되는 업무
          </h1>

          {/* 설명 */}
          <p className="mt-5 max-w-[340px] text-[15px] leading-7 text-white/88 sm:max-w-[380px] sm:text-base sm:leading-7 md:mt-6 md:max-w-[620px] md:text-[20px] md:leading-9">
            표준 모듈로 빠르게 구축하고, 운영까지 안정적으로
            <br className="hidden md:block" />
            Microsoft 365/SSO 연동 기반의 엔터프라이즈 업무 플랫폼입니다.
          </p>

          {/* 버튼 */}
          <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:mt-8">
            <Link
              href="/contact"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-100 sm:w-auto md:h-14 md:px-8 md:text-base"
            >
              도입 문의하기
            </Link>

            <Link
              href="/company"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/35 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/10 sm:w-auto md:h-14 md:px-8 md:text-base"
            >
              서비스 소개 보기
            </Link>
          </div>
        </div>
      </div>

      {/* 하단 페이드 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#071a2f] to-transparent" />
    </section>
  );
}