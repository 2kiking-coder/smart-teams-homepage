"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

const NAV: NavItem[] = [
  { label: "회사소개", href: "https://t2l.co.kr/Source/Client/Info/C_INFO_INFOMATION.aspx", external: true },
  { label: "주요기능", href: "/products" },
  { label: "도입문의", href: "/contact" },
  { label: "T2L", href: "https://t2l.co.kr", external: true },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = useCallback(
    (href: string) => {
      setMobileOpen(false);
      router.push(href);

      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      });
    },
    [router]
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#3f4349] text-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Left: Brand */}
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="text-[#ff3b30]">T2L</span>
            <span className="whitespace-nowrap">SMART TEAMS</span>
          </Link>

          <span className="hidden md:inline text-sm text-white/70">
            Microsoft 365 연동 (Enterprise)
          </span>
        </div>

        {/* Desktop Nav */}
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
                  className="text-sm font-semibold text-white/90 transition hover:text-white"
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => go("/contact")}
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-extrabold text-slate-900 transition hover:bg-white/90"
          >
            도입 문의
          </button>

          <a
            href="https://t2l.smart-teams.co.kr:20003/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#6d5bd0] px-4 py-2 text-sm font-extrabold text-white transition hover:opacity-90"
          >
            테스트계정
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          aria-label="모바일 메뉴 열기"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/5 md:hidden"
        >
          <span className="sr-only">메뉴</span>
          <div className="flex flex-col gap-1.5">
            <span
              className={[
                "block h-0.5 w-5 bg-white transition-transform duration-200",
                mobileOpen ? "translate-y-2 rotate-45" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block h-0.5 w-5 bg-white transition-opacity duration-200",
                mobileOpen ? "opacity-0" : "opacity-100",
              ].join(" ")}
            />
            <span
              className={[
                "block h-0.5 w-5 bg-white transition-transform duration-200",
                mobileOpen ? "-translate-y-2 -rotate-45" : "",
              ].join(" ")}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#3f4349] md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
              MENU
            </div>

            <nav className="flex flex-col">
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
                      onClick={() => setMobileOpen(false)}
                      className="border-b border-white/10 py-3 text-sm font-semibold text-white/90"
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
                      "border-b border-white/10 py-3 text-left text-sm font-semibold transition",
                      active ? "text-white" : "text-white/85 hover:text-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => go("/contact")}
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-extrabold text-slate-900"
              >
                도입 문의
              </button>

              <a
                href="https://t2l.smart-teams.co.kr:20003/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-[#6d5bd0] px-4 py-3 text-sm font-extrabold text-white"
              >
                테스트계정
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}