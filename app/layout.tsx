// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  metadataBase: new URL("https://groupwaret2l.co.kr"), // ✅ 배포 도메인으로 변경 가능 (임시면 vercel 도메인)
  title: "SMART TEAMS | 티투엘(T2L) AI연구소 | Microsoft 365 기반 업무 플랫폼",
  description:
    "티투엘(T2L) AI연구소의 SMART TEAMS — 전자결재·경비·자원예약·게시판·포탈·모바일을 Teams 기반으로 연결하는 단일 업무 플랫폼. MetaPort/MetaKPort(METAKPORT) 디지털 전환 경험 기반 구축·운영 지원.",
  keywords: [
    "티투엘",
    "T2L",
    "AI연구소",
    "스마트팀즈",
    "SMART TEAMS",
    "전자결재",
    "경비처리",
    "자원예약",
    "게시판",
    "포탈",
    "모바일 오피스",
    "Microsoft 365",
    "Teams",
    "SSO",
    "그룹웨어",
    "업무 플랫폼",
    "메타포트",
    "MetaPort",
    "메타K포트",
    "MetaKPort",
    "METAKPORT",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "SMART TEAMS",
    title: "SMART TEAMS | 티투엘(T2L) AI연구소 | Microsoft 365 기반 업무 플랫폼",
    description:
      "티투엘(T2L) AI연구소의 SMART TEAMS — 전자결재·경비·자원예약·게시판·포탈·모바일을 Teams 기반으로 연결하는 단일 업무 플랫폼. MetaPort/MetaKPort(METAKPORT) 디지털 전환 경험 기반 구축·운영 지원.",
    images: [
      {
        url: "/screens/og.png", // ✅ public/screens/og.png
        width: 1200,
        height: 630,
        alt: "SMART TEAMS | T2L AI Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SMART TEAMS | 티투엘(T2L) AI연구소",
    description:
      "전자결재·경비·자원예약·게시판·포탈·모바일을 Teams 기반으로 연결하는 단일 업무 플랫폼. MetaPort/MetaKPort(METAKPORT) 경험 기반.",
    images: ["/screens/og.png"], // ✅ public/screens/og.png
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-slate-900">
        {/* 라우트 바뀔 때마다 최상단으로 */}
        <ScrollToTop />

        <Header />

        {/* Header 높이만큼 아래로 (현재 프로젝트에서 유지 중인 값) */}
        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}