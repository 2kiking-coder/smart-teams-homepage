"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

const NAV: NavItem[] = [
  { label: "회사소개", href: "https://t2l.co.kr/Source/Client/Info/C_INFO_INFOMATION.aspx", external: true },
  // ✅ 핵심: 주요기능은 스크롤(#) 말고 "페이지 이동"
  { label: "주요기능", href: "/products" },
  { label: "도입문의", href: "/contact" },
  { label: "T2L", href: "https://t2l.co.kr", external: true },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const go = useCallback(
    (href: string) => {
      router.push(href);
      // ✅ 어떤 상황에서도 "페이지 상단"으로
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      });
    },
    [router]
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-[#3f4349] text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="text-[#ff3b30]">T2L</span>
            <span>SMART TEAMS</span>
          </Link>
          <span className="hidden md:inline text-sm text-white/70">
            Microsoft 365 연동 (Enterprise)
          </span>
        </div>

        {/* Center: Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => {
            const active =
              !item.external &&
              (pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href)));

            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-white/90 hover:text-white"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => go(item.href)}
                className={[
                  "text-sm font-semibold transition",
                  active ? "text-white" : "text-white/85 hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => go("/contact")}
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-white/90"
          >
            도입 문의
          </button>
          <a
            href="https://t2l.smart-teams.co.kr:20003/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#6d5bd0] px-4 py-2 text-sm font-extrabold text-white hover:opacity-90"
          >
            테스트계정
          </a>
        </div>
      </div>
    </header>
  );
}