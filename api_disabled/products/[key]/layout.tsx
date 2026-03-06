// app/products/[key]/layout.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ModuleKey = "approval" | "expense" | "resource" | "board" | "portal" | "mobile";

const MODULE_META: Record<
  ModuleKey,
  { title: string; desc: string; keywords: string[] }
> = {
  approval: {
    title: "전자결재",
    desc: "양식 자유도 · 결재 대시보드 · 유연한 프로세스 지원. Teams 기반 전자결재로 의사결정 속도를 높이세요.",
    keywords: ["전자결재", "결재", "워크플로우", "승인", "Teams 전자결재"],
  },
  expense: {
    title: "경비처리",
    desc: "법인카드/영수증/정산 자동화로 처리 시간을 단축. 규정 기반 비용관리와 투명한 정산을 지원합니다.",
    keywords: ["경비처리", "법인카드", "영수증", "정산", "비용관리"],
  },
  resource: {
    title: "자원예약",
    desc: "회의실·차량·장비 예약을 한 화면으로. 충돌 방지와 사용현황 통계로 운영 품질을 높입니다.",
    keywords: ["자원예약", "회의실 예약", "차량 예약", "장비 예약", "캘린더"],
  },
  board: {
    title: "게시판",
    desc: "공지/자료/프로젝트 게시판으로 정보 공유 표준화. 권한 기반 운영과 검색/정리로 효율을 높입니다.",
    keywords: ["게시판", "공지", "자료", "FAQ", "권한관리", "검색"],
  },
  portal: {
    title: "포탈",
    desc: "업무의 시작을 한 화면으로. 모듈 진입과 알림을 통합하고 개인화 위젯으로 효율을 강화합니다.",
    keywords: ["포탈", "업무 포털", "알림", "위젯", "통합"],
  },
  mobile: {
    title: "모바일",
    desc: "시공간 제약을 넘는 모바일 오피스. PC와 동일한 업무 경험, 즉각 대응, 현장 중심 업무 지원.",
    keywords: ["모바일", "모바일 오피스", "현장업무", "즉각 대응", "UX"],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;
  const k = key as ModuleKey;

  const m = MODULE_META[k];
  if (!m) return notFound();

  const title = `${m.title} | SMART TEAMS | 티투엘(T2L) AI연구소`;
  const description =
    `${m.desc} ` +
    "Microsoft 365(Teams) 기반 단일 업무 플랫폼 SMART TEAMS. MetaPort/MetaKPort(METAKPORT) 디지털 전환 경험 기반 구축·운영 지원.";

  return {
    title,
    description,
    keywords: [
      "티투엘",
      "T2L",
      "AI연구소",
      "SMART TEAMS",
      "Microsoft 365",
      "Teams",
      "SSO",
      "메타포트",
      "MetaPort",
      "메타케이포트",
      "MetaKPort",
      "METAKPORT",
      ...m.keywords,
    ],
    alternates: {
      canonical: `/products/${k}`,
    },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: `/products/${k}`,
      siteName: "SMART TEAMS",
      title,
      description,
      images: [
        {
          url: "/screens/og.png",
          width: 1200,
          height: 630,
          alt: `SMART TEAMS | ${m.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/screens/og.png"],
    },
    robots: { index: true, follow: true },
  };
}

export default function ProductKeyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}