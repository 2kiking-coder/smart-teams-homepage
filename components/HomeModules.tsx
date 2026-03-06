"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type ModuleKey = "approval" | "expense" | "resource" | "board" | "portal";

const MODULES: {
  key: ModuleKey;
  step: string;
  label: string;
  title: string;
  desc: string;
  image: string;
  bullets: string[];
}[] = [
  {
    key: "approval",
    step: "01",
    label: "전자결재",
    title: "전자결재",
    desc: "양식 자유도 · 결재 대시보드 · 유연한 프로세스 지원",
    image: "/screens/approval.png",
    bullets: ["기안/결재/합의/회람", "결재 현황 대시보드", "지연 결재 알림/추적"],
  },
  {
    key: "expense",
    step: "02",
    label: "경비처리",
    title: "경비",
    desc: "법인카드/영수증/정산 자동화로 처리 시간을 단축",
    image: "/screens/expense.png",
    bullets: ["법인카드 연동", "영수증 첨부/정산", "지출 규정 기반 승인"],
  },
  {
    key: "resource",
    step: "03",
    label: "자원 예약 관리",
    title: "자원예약",
    desc: "회의실/차량/장비 예약과 충돌 방지",
    image: "/screens/resource.png",
    bullets: ["자원별 캘린더", "중복 예약 방지", "사용 현황 통계"],
  },
  {
    key: "board",
    step: "04",
    label: "게시판",
    title: "게시판",
    desc: "공지/자료/프로젝트 게시판으로 정보 공유 표준화",
    image: "/screens/board.png",
    bullets: ["공지/자료/FAQ", "권한 기반 열람", "첨부/검색/카테고리"],
  },
  {
    key: "portal",
    step: "05",
    label: "포탈",
    title: "포탈",
    desc: "업무의 시작을 한 화면으로 — 모듈 진입과 알림을 통합",
    image: "/screens/portal.png",
    bullets: ["모듈 바로가기", "알림/공지 요약", "개인화 위젯"],
  },
];

export default function HomeModules() {
  const [active, setActive] = useState<ModuleKey>("approval");

  const m = useMemo(() => MODULES.find((x) => x.key === active) ?? MODULES[0], [active]);
  const isPortal = m.key === "portal";

  return (
    <section id="modules" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          {/* Left */}
          <div className="md:col-span-4">
            <div className="text-xs font-semibold tracking-widest text-[#6A5AE0]">
              SMART TEAMS 솔루션
            </div>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
              주요 기능
            </h2>

            <div className="mt-8 grid gap-4">
              {MODULES.map((x) => {
                const on = x.key === active;
                return (
                  <button
                    key={x.key}
                    onClick={() => setActive(x.key)}
                    className={[
                      "flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition",
                      on
                        ? "border-[#6A5AE0] bg-[#6A5AE0]/10 shadow-sm"
                        : "border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-extrabold",
                        on ? "bg-[#6A5AE0] text-white" : "bg-neutral-100 text-neutral-600",
                      ].join(" ")}
                    >
                      {x.step}
                    </span>
                    <span className="font-semibold text-slate-900">{x.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel */}
          <div className="md:col-span-8">
            <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.12)]">
              <div className="grid md:grid-cols-2">
                {/* image */}
                <div className="p-8">
                  <div
                    className={[
                      "relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50",
                      isPortal ? "h-[360px] md:h-[440px]" : "h-[300px] md:h-[360px]",
                    ].join(" ")}
                  >
                    <Image
                      src={m.image}
                      alt={m.title}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* purple */}
                <div className="bg-[#6A5AE0] p-10 text-white">
                  <div className="text-xs font-semibold tracking-widest text-white/80">
                    SMART TEAMS 모듈
                  </div>
                  <div className="mt-3 text-4xl font-extrabold tracking-tight">{m.title}</div>
                  <div className="mt-6 text-base font-semibold text-white/90">{m.desc}</div>

                  <div className="mt-8 grid gap-3 text-sm text-white/90">
                    {m.bullets.map((b) => (
                      <div key={b} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-white/80" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10">
                    <Link
                      href="/products"
                      className="inline-flex items-center justify-center rounded-full border border-white/60 px-10 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                    >
                      VIEW
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs text-neutral-500">
              ※ 화면은 예시이며 실제 구축 범위/정책에 따라 UI·기능은 맞춤 구성됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}