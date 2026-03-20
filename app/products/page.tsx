// app/products/page.tsx
import Image from "next/image";
import Link from "next/link";

type ModuleKey = "approval" | "expense" | "resource" | "board" | "portal" | "mobile";

type Module = {
  no: string;
  key: ModuleKey;
  label: string;
  title: string;
  desc: string;
  points: string[];
  image: string;
  accent: string;
  accentSoft: string;
};

const MODULES: Module[] = [
  {
    no: "01",
    key: "approval",
    label: "Workflow",
    title: "전자결재",
    desc: "의사결정 프로세스를 표준화하고 결재 현황을 한눈에 확인합니다.",
    points: ["결재 워크플로우", "현황 대시보드", "지연 알림/추적"],
    image: "/screens/approval.png",
    accent: "#6366F1",
    accentSoft: "rgba(99,102,241,0.10)",
  },
  {
    no: "02",
    key: "expense",
    label: "Finance",
    title: "경비처리",
    desc: "법인카드·영수증·정산 자동화로 처리 시간을 단축합니다.",
    points: ["법인카드 연동", "영수증 첨부/정산", "규정 기반 검증"],
    image: "/screens/expense.png",
    accent: "#10B981",
    accentSoft: "rgba(16,185,129,0.10)",
  },
  {
    no: "03",
    key: "resource",
    label: "Schedule",
    title: "자원예약",
    desc: "회의실·차량·장비 예약과 충돌 방지를 한 번에 관리합니다.",
    points: ["자원별 캘린더", "중복 예약 방지", "이용 현황 통계"],
    image: "/screens/resource.png",
    accent: "#3B82F6",
    accentSoft: "rgba(59,130,246,0.10)",
  },
  {
    no: "04",
    key: "board",
    label: "Knowledge",
    title: "게시판",
    desc: "공지/자료/업무 공유를 체계화하고 검색성을 높입니다.",
    points: ["공지/자료 게시", "권한 기반 공개 범위", "통합 검색/태그"],
    image: "/screens/board.png",
    accent: "#F59E0B",
    accentSoft: "rgba(245,158,11,0.10)",
  },
  {
    no: "05",
    key: "portal",
    label: "Hub",
    title: "포탈",
    desc: "업무에 필요한 링크·시스템·문서를 한 화면에 모읍니다.",
    points: ["업무 포탈 구성", "SSO/권한 연동", "맞춤 위젯"],
    image: "/screens/portal.png",
    accent: "#8B5CF6",
    accentSoft: "rgba(139,92,246,0.10)",
  },
  {
    no: "06",
    key: "mobile",
    label: "Mobile",
    title: "모바일",
    desc: "현장/외근에서도 승인·조회·알림까지 끊김 없이 처리합니다.",
    points: ["PC와 동일한 업무 보장", "즉각적인 대응 체계", "현장 중심 업무 지원"],
    image: "/screens/mobile.png",
    accent: "#06B6D4",
    accentSoft: "rgba(6,182,212,0.10)",
  },
];

function ModuleCard({ m }: { m: Module }) {
  return (
    <div
      style={
        {
          ["--accent" as any]: m.accent,
          ["--accentSoft" as any]: m.accentSoft,
        } as React.CSSProperties
      }
      className="group relative overflow-hidden rounded-3xl border border-[color:color-mix(in_srgb,var(--accent)_18%,#e2e8f0)] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="pointer-events-none absolute inset-0 bg-[var(--accentSoft)] opacity-0 transition group-hover:opacity-100" />
      <div className="relative h-1 w-full bg-[var(--accent)]" />

      <div className="relative p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-extrabold text-white transition group-hover:brightness-95">
            {m.no}
          </span>

          <span className="inline-flex items-center rounded-full border border-[var(--accent)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--accent)] transition group-hover:bg-white">
            {m.label}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900">{m.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.desc}</p>

        <div className="mt-5 rounded-2xl border border-[color:color-mix(in_srgb,var(--accent)_20%,#e2e8f0)] bg-white p-3 transition">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Image
              src={m.image}
              alt={`${m.title} 화면`}
              fill
              className="object-contain transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>

        <ul className="mt-5 space-y-2 text-sm text-slate-700">
          {m.points.map((t) => (
            <li key={t} className="flex items-start gap-2">
              <span className="mt-[7px] h-2 w-2 flex-none rounded-full bg-[var(--accent)]" />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-slate-400">※ 실제 구축 범위/정책에 따라 구성 가능합니다.</p>

        <div className="mt-6 flex items-center justify-end">
          <Link
            href={`/products/${m.key}`}
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-bold text-white transition group-hover:brightness-95"
          >
            상세 보기 <span className="ml-1" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-28 md:pt-32">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.28em] text-slate-500">SMART TEAMS</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">주요 기능</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            필요한 모듈만 선택 도입 후 단계적으로 확장할 수 있습니다. (권한/감사/운영 체계 포함)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            홈으로
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
          >
            도입 상담 요청
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <ModuleCard key={m.key} m={m} />
        ))}
      </div>
    </section>
  );
}