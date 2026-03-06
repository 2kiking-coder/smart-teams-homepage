// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type ModuleKey = "approval" | "expense" | "resource" | "board" | "portal" | "mobile";

const MODULES: {
  key: ModuleKey;
  no: string;
  label: string;
  title: string;
  desc: string;
  image: string; // public/screens/...
  bullets: string[];
  color: string; // ✅ 모듈 컬러
}[] = [
  {
    key: "approval",
    no: "01",
    label: "전자결재",
    title: "전자결재",
    desc: "양식 자유도 · 결재 대시보드 · 유연한 프로세스 지원",
    image: "/screens/approval.png",
    bullets: ["기안/결재/합의/회람", "결재 현황 대시보드", "지연 결재 알림/추적"],
    color: "#6d5bd0",
  },
  {
    key: "expense",
    no: "02",
    label: "경비처리",
    title: "경비",
    desc: "법인카드/영수증/정산 자동화로 처리 시간을 단축",
    image: "/screens/expense.png",
    bullets: ["법인카드 연동", "영수증 첨부/정산", "지출 규정 기반 승인"],
    color: "#10b981",
  },
  {
    key: "resource",
    no: "03",
    label: "자원 예약 관리",
    title: "자원예약",
    desc: "회의실/차량/장비 예약과 충돌 방지",
    image: "/screens/resource.png",
    bullets: ["자원별 캘린더", "중복 예약 방지", "사용 현황 통계"],
    color: "#3b82f6",
  },
  {
    key: "board",
    no: "04",
    label: "게시판",
    title: "게시판",
    desc: "공지/자료/프로젝트 게시판으로 정보 공유 표준화",
    image: "/screens/board.png",
    bullets: ["공지/자료/FAQ", "권한 기반 열람", "첨부/검색/카테고리"],
    color: "#f59e0b",
  },
  {
    key: "portal",
    no: "05",
    label: "포탈",
    title: "포탈",
    desc: "업무의 시작을 한 화면으로 — 모듈 진입과 알림을 통합",
    image: "/screens/portal.png",
    bullets: ["모듈 바로가기", "알림/공지 요약", "개인화 위젯"],
    color: "#6366f1",
  },
  {
    key: "mobile",
    no: "06",
    label: "모바일",
    title: "모바일",
    desc: "시공간 제약 없는 업무 처리 — 내 손 안의 모바일 오피스",
    image: "/screens/mobile.png",
    bullets: ["PC 동일 업무 보장", "실시간 알림/즉시 대응", "모바일 UX 최적화"],
    color: "#06b6d4",
  },
];

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function HomePage() {
  const [active, setActive] = useState<ModuleKey>("approval");

  const activeModule = useMemo(
    () => MODULES.find((m) => m.key === active) ?? MODULES[0],
    [active]
  );

  return (
    <main className="bg-white text-slate-900">
      {/* =========================
          1) HERO
         ========================= */}
      <section className="relative min-h-[720px] w-full overflow-hidden">
        <Image
          src="/screens/hero-hex.png"
          alt="Smart Teams Hero"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#ece8f6]" />

        <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-6 py-16">
          <div className="grid w-full items-start gap-10 md:grid-cols-12">
            {/* Left copy */}
            <div className="md:col-span-7 text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-0.5 text-sm text-white/90 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                전자결재·경비·자원예약을 Microsoft 365 그대로
              </div>

              <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
                TEAMS 하나로
                <br />
                완성되는 업무
              </h1>

              <p className="mt-6 max-w-xl text-lg text-white/85">
                표준 모듈로 빠르게 구축하고, 운영까지 안정적으로. Microsoft 365/SSO 연동 기반의
                엔터프라이즈 업무 플랫폼입니다.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-extrabold text-slate-950 hover:bg-white/90"
                >
                  도입 문의하기
                </Link>
                <a
                  href="#hero-below"
                  className="inline-flex rounded-full border border-white/40 bg-transparent px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
                >
                  서비스 소개 보기
                </a>
              </div>
            </div>

            {/* Right decor */}
            <div className="relative hidden md:block md:col-span-5">
              <div className="absolute -right-10 -top-12 h-[520px] w-[520px] rounded-full bg-indigo-500/15 blur-3xl" />
              <div className="absolute right-10 top-12 h-24 w-24 rounded-full border border-white/20 bg-white/10 backdrop-blur" />
              <div className="absolute right-44 top-44 h-32 w-32 rounded-full border border-white/20 bg-white/10 backdrop-blur" />
              <div className="absolute right-24 bottom-10 h-28 w-28 rounded-full border border-white/20 bg-white/10 backdrop-blur" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          2) HERO BELOW (M365)
         ========================= */}
      <section id="hero-below" className="bg-[#ece8f6] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              흩어진 업무와 데이터, 치솟는 비용
            </div>
            <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              <span className="text-[#6d5bd0]">SMART TEAMS</span>가 M365 팀즈 기반의 단일 플랫폼으로
              연결합니다.
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.10)]">
            <div className="relative aspect-[16/7] w-full">
              <Image
                src="/screens/m365-connect.png"
                alt="M365 연결 개요"
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          3) MODULES
          ✅ 왼쪽 높이 줄이기: 버튼 2열 grid
          ✅ 오른쪽 컬러 변경: activeModule.color 사용
         ========================= */}
      <section id="modules" className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-12 items-stretch">
            {/* Left */}
            <div className="md:col-span-4 md:flex md:flex-col md:justify-center">
              <div className="text-sm font-extrabold text-slate-500">SMART TEAMS 솔루션</div>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Teams의 솔루션을 통해 높은
                <br />
                효율성을 추구하세요!
              </h2>

              {/* ✅ 2열로 변경해서 높이 줄임 */}
              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:min-h-[260px]">
                {MODULES.map((m) => {
                  const on = m.key === active;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setActive(m.key)}
                      className={[
                        "flex w-full items-center gap-3 rounded-2xl px-4 py-1.5 text-left transition border",
                        "border-black/10 bg-white hover:bg-slate-50",
                      ].join(" ")}
                      style={
                        on
                          ? {
                              borderColor: hexToRgba(m.color, 0.35),
                              backgroundColor: hexToRgba(m.color, 0.10),
                            }
                          : undefined
                      }
                    >
                      <span
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold"
                        style={{
                          backgroundColor: on ? m.color : "rgb(241 245 249)",
                          color: on ? "white" : "rgb(51 65 85)",
                        }}
                      >
                        {m.no}
                      </span>
                      <div className="font-bold text-slate-900 whitespace-nowrap">{m.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right */}
            <div className="md:col-span-8">
              <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.10)]">
                <div className="grid md:grid-cols-12">
                  {/* Center image */}
                  <div className="md:col-span-8 bg-slate-50 p-4">
                    <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
                      <div className="p-4">
                        <div className="relative w-full aspect-[16/9] rounded-2xl border border-black/10 bg-white overflow-hidden">
                          <Image
                            src={activeModule.image}
                            alt={activeModule.title}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 60vw"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ✅ Purple panel → activeModule.color */}
                  <div
                    className="md:col-span-4 text-white flex flex-col"
                    style={{ backgroundColor: activeModule.color }}
                  >
                    <div className="p-7 md:p-8">
                      <div className="text-xs font-semibold tracking-widest text-white/80">
                        SMART TEAMS 모듈
                      </div>

                      <div className="mt-3 text-3xl font-extrabold tracking-tight">
                        {activeModule.title}
                      </div>

                      <div className="mt-4 text-sm font-semibold text-white/90 leading-relaxed">
                        {activeModule.desc}
                      </div>

                      <div className="mt-6 grid gap-3 text-sm text-white/90">
                        {activeModule.bullets.map((b) => (
                          <div key={b} className="flex items-start gap-2">
                            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-white/80" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8">
                        <Link
  href={`/products/${activeModule.key}`}
  className="inline-flex items-center justify-center rounded-full border border-white/60 px-9 py-3 text-sm font-extrabold text-white hover:bg-white/10"
>
  VIEW
</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm text-slate-500">
                ※ 화면은 예시이며 실제 구축 범위/정책에 따라 UI·기능은 맞춤 구성됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          4) CTA
         ========================= */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-black/10 bg-white p-10 md:flex-row md:items-center">
            <div>
              <div className="text-sm font-extrabold text-slate-500">Why SMART TEAMS</div>
              <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                엔터프라이즈 운영 기준으로 설계
              </div>
              <div className="mt-3 text-slate-600">
                권한/감사/운영을 기본 내장하고, 모듈별 도입을 단계적으로 확장할 수 있습니다.
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/contact"
                className="inline-flex rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-extrabold text-white hover:bg-indigo-500"
              >
                무료 상담 신청
              </Link>
              <a
                href="https://t2l.smart-teams.co.kr:20003/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-extrabold text-slate-900 hover:bg-slate-50"
              >
                테스트계정
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}