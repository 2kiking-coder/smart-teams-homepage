// app/products/[key]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type ModuleKey = "approval" | "expense" | "resource" | "board" | "portal" | "mobile";

type Module = {
  key: ModuleKey;
  labelNo: string;
  tag: string;
  title: string;
  sub: string;
  image: string;
  accent: string;
  accentSoft: string;
  points: { no: number; title: string; desc: string }[];
};

const MODULES: Module[] = [
  {
    key: "approval",
    labelNo: "01",
    tag: "Workflow",
    title: "전자결재",
    sub: "의사결정 프로세스를 표준화하고 결재 현황을 한눈에",
    image: "/screens/approval.png",
    accent: "#6366F1",
    accentSoft: "rgba(99,102,241,0.12)",
    points: [
      { no: 1, title: "워크플로우 표준화", desc: "기업별 결재 라인 및 양식을 디지털화하여 업무 프로세스를 정리" },
      { no: 2, title: "실시간 이력 추적", desc: "기안부터 최종 승인까지 진행 현황을 실시간으로 가시화" },
      { no: 3, title: "결재 데이터 자산화", desc: "모든 승인 문서를 DB화하여 즉각적인 이력 조회 가능" },
      { no: 4, title: "기간계/ERP 연동 지원", desc: "기간계 및 ERP 시스템 Interface를 통해 최적의 결재 시스템 구축" },
    ],
  },
  {
    key: "expense",
    labelNo: "02",
    tag: "Finance",
    title: "경비처리",
    sub: "지출·증빙·정산을 한 흐름으로 — 투명한 비용 관리와 빠른 결산",
    image: "/screens/expense.png",
    accent: "#10B981",
    accentSoft: "rgba(16,185,129,0.12)",
    points: [
      { no: 1, title: "간편한 지출 등록", desc: "항목/프로젝트 기준으로 지출을 빠르게 입력" },
      { no: 2, title: "증빙 관리", desc: "영수증/증빙을 체계적으로 첨부·보관" },
      { no: 3, title: "승인 프로세스 연동", desc: "정책 기반 승인으로 통제 강화" },
      { no: 4, title: "정산/리포트 자동화", desc: "월별·부서별 리포트로 결산 시간을 단축" },
    ],
  },
  {
    key: "resource",
    labelNo: "03",
    tag: "Schedule",
    title: "자원예약",
    sub: "회의실·차량·장비 예약을 한 화면으로 — 충돌 방지와 사용현황 관리",
    image: "/screens/resource.png",
    accent: "#3B82F6",
    accentSoft: "rgba(59,130,246,0.12)",
    points: [
      { no: 1, title: "자원별 캘린더", desc: "회의실/차량/장비 등 자원별 캘린더 제공" },
      { no: 2, title: "중복 예약 방지", desc: "예약 충돌 자동 차단으로 운영 품질 향상" },
      { no: 3, title: "승인/권한 관리", desc: "자원별 승인 정책 및 권한 기반 예약 제어" },
      { no: 4, title: "사용 현황 통계", desc: "이용률/피크시간 등 운영 지표를 통계로 제공" },
    ],
  },
  {
    key: "board",
    labelNo: "04",
    tag: "Knowledge",
    title: "게시판",
    sub: "공지·자료·커뮤니케이션을 한 곳에 — 팀 단위 정보 공유 강화",
    image: "/screens/board.png",
    accent: "#F59E0B",
    accentSoft: "rgba(245,158,11,0.14)",
    points: [
      { no: 1, title: "공지/자료 공유", desc: "팀 공지, 문서, 템플릿을 표준화하여 공유" },
      { no: 2, title: "권한 기반 접근", desc: "조직/부서/프로젝트별 열람·작성 권한 설정" },
      { no: 3, title: "검색/태그", desc: "태그/키워드 검색으로 필요한 정보를 빠르게 찾기" },
      { no: 4, title: "감사/이력", desc: "게시글 수정 이력 및 열람 기록을 남겨 관리" },
    ],
  },
  {
    key: "portal",
    labelNo: "05",
    tag: "Hub",
    title: "포탈",
    sub: "업무 포털을 하나로 — 링크/시스템/콘텐츠를 한 화면에 집약",
    image: "/screens/portal.png",
    accent: "#06B6D4",
    accentSoft: "rgba(6,182,212,0.12)",
    points: [
      { no: 1, title: "업무 포털 통합", desc: "자주 쓰는 시스템/링크를 한 화면에서 빠르게 접근" },
      { no: 2, title: "권한 기반 메뉴", desc: "부서/역할별 맞춤 포털 메뉴 자동 구성" },
      { no: 3, title: "콘텐츠 허브", desc: "공지·문서·규정·가이드를 한곳에서 빠르게 탐색" },
      { no: 4, title: "M365/Teams 연동", desc: "Teams 중심 업무환경과 자연스럽게 연결" },
    ],
  },
  {
    key: "mobile",
    labelNo: "06",
    tag: "Mobile",
    title: "모바일",
    sub: "시공간 제약을 넘는 유연한 업무 처리 — 내 손 안의 모바일 오피스",
    image: "/screens/mobile.png",
    accent: "#06B6D4",
    accentSoft: "rgba(6,182,212,0.12)",
    points: [
      { no: 1, title: "PC와 동일한 업무 보장", desc: "현장에서도 동일한 업무 흐름으로 처리 품질 유지" },
      { no: 2, title: "즉각적인 대응 체계", desc: "중요 알림·공지·결재를 실시간으로 확인하고 빠른 피드백" },
      { no: 3, title: "모바일 접근성 최적화", desc: "작은 화면에서도 가독성 높고 조작이 간편한 직관적 UX" },
      { no: 4, title: "현장 중심의 업무 지원", desc: "현장에서 즉시 확인·기록으로 업무 효율을 극대화" },
    ],
  },
];

const MODULE_BY_KEY = new Map<ModuleKey, Module>(MODULES.map((m) => [m.key, m]));

const ALIAS: Record<string, ModuleKey> = {
  approval: "approval",
  approvals: "approval",
  appr: "approval",
  "전자결재": "approval",

  expense: "expense",
  expenses: "expense",
  exp: "expense",
  "경비처리": "expense",
  "경비": "expense",

  resource: "resource",
  resources: "resource",
  reservation: "resource",
  booking: "resource",
  schedule: "resource",
  "자원예약": "resource",

  board: "board",
  boards: "board",
  notice: "board",
  "게시판": "board",

  portal: "portal",
  portals: "portal",
  hub: "portal",
  "포탈": "portal",
  "포털": "portal",

  mobile: "mobile",
  m: "mobile",
  "모바일": "mobile",
};

function normalizeKey(raw: string): ModuleKey | null {
  const k = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/_/g, "-")
    .replace(/\/+/g, "");

  if (ALIAS[k]) return ALIAS[k];
  if (MODULE_BY_KEY.has(k as ModuleKey)) return k as ModuleKey;
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;
  const canonicalKey = normalizeKey(key);
  if (!canonicalKey) return {};

  const m = MODULE_BY_KEY.get(canonicalKey);
  if (!m) return {};

  const title = `SMART TEAMS | ${m.title} - Microsoft 365 기반 업무 플랫폼`;
  const description = `SMART TEAMS ${m.title}: ${m.sub} (Teams/Microsoft 365 연동 Enterprise 업무 플랫폼)`;

  return {
    title,
    description,
    alternates: { canonical: `/products/${m.key}` },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url: `/products/${m.key}`,
      siteName: "SMART TEAMS",
      title,
      description,
      images: [{ url: m.image, width: 1200, height: 630, alt: `SMART TEAMS | ${m.title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [m.image],
    },
  };
}

function ModuleChips({
  currentKey,
  modules,
}: {
  currentKey: ModuleKey;
  modules: Pick<Module, "key" | "title" | "accent" | "accentSoft">[];
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      {modules.map((m) => {
        const active = m.key === currentKey;

        return (
          <Link
            key={m.key}
            href={`/products/${m.key}`}
            style={
              {
                ["--accent" as any]: m.accent,
                ["--accentSoft" as any]: m.accentSoft,
              } as React.CSSProperties
            }
            className={[
              "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)]",
              active
                ? "border-transparent bg-[var(--accent)] text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-900 hover:border-[var(--accent)] hover:bg-[var(--accentSoft)] hover:text-slate-900",
            ].join(" ")}
          >
            {m.title}
          </Link>
        );
      })}
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const canonicalKey = normalizeKey(key);
  if (!canonicalKey) notFound();

  const m = MODULE_BY_KEY.get(canonicalKey);
  if (!m) notFound();

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-6xl px-6 pb-14 pt-28 md:pt-32">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-slate-500">SMART TEAMS</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              {m.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{m.sub}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              도입 문의
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              목록으로
            </Link>
          </div>
        </div>

        <div
          style={
            {
              ["--accent" as any]: m.accent,
              ["--accentSoft" as any]: m.accentSoft,
            } as React.CSSProperties
          }
          className="mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_-55px_rgba(15,23,42,0.35)]"
        >
          <div className="h-[3px] w-full bg-[var(--accent)]" />

          <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2 md:p-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-white shadow-sm">
                <Image
                  src={m.image}
                  alt={`${m.title} 화면`}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <p className="mt-4 text-xs text-slate-500">
                ※ 화면은 예시이며 실제 구축 범위/정책에 따라 UI·기능은 맞춤 구성됩니다.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-[var(--accentSoft)] px-3 py-1 text-xs font-bold text-slate-900">
                  SMART TEAMS 모듈
                </span>
                <span className="text-sm font-semibold text-slate-800">{m.title}</span>
              </div>

              <div className="mt-5 space-y-4">
                {m.points.map((p) => (
                  <div
                    key={p.no}
                    className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accentSoft)] hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-extrabold text-white transition group-hover:scale-105">
                      {p.no}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{p.title}</div>
                      <div className="mt-1 text-sm leading-relaxed text-slate-600">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  상담 요청하기
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  다른 모듈 보기
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white px-6 pb-7 md:px-8">
            <ModuleChips
              currentKey={m.key}
              modules={MODULES.map(({ key, title, accent, accentSoft }) => ({
                key,
                title,
                accent,
                accentSoft,
              }))}
            />
          </div>
        </div>
      </section>
    </div>
  );
}