// components/Footer.tsx
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05070b]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left */}
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/t2l-logo.png" alt="T2L" className="h-9 w-9 rounded-xl" />
            <div>
              <div className="text-base font-extrabold tracking-wide text-white">SMART TEAMS · T2L</div>
              <div className="mt-1 text-sm text-white/60">Microsoft 365 연동 Enterprise 플랫폼</div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
                기업 업무를 하나의 플랫폼으로 통합하고 운영 효율과 보안을 동시에 제공합니다.
              </p>
            </div>
          </div>

          {/* Middle */}
          <div className="md:pl-10">
            <div className="text-sm font-semibold text-white">바로가기</div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-white">
                  홈
                </Link>
              </li>
              <li>
                <a
                  href="https://t2l.co.kr/Source/Client/Info/C_INFO_INFOMATION.aspx"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  회사소개
                </a>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  주요기능
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  도입문의
                </Link>
              </li>
              <li>
                <a
                  href="https://t2l.smart-teams.co.kr:20003/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  테스트계정
                </a>
              </li>
            </ul>
          </div>

          {/* Right */}
          <div>
            <div className="text-sm font-semibold text-white">문의</div>
            <p className="mt-4 text-sm text-white/60">
              도입 상담이 필요하시면 언제든 문의해주세요.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#0b1119] hover:bg-white/90"
              >
                도입 문의
              </Link>
              <a
                href="https://t2l.smart-teams.co.kr:20003/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500"
              >
                테스트계정
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-2 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
            <div>© 2026 T2L Co., Ltd. All rights reserved.</div>
            <div>SMART TEAMS · Enterprise Platform</div>
          </div>
        </div>
      </div>
    </footer>
  );
}