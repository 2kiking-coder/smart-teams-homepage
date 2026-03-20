// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  metadataBase: new URL("https://groupwaret2l.co.kr"),

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
        url: "/screens/og.png",
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
    images: ["/screens/og.png"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-white text-slate-900">
        <ScrollToTop />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>

      <GoogleAnalytics gaId="G-HT6YT7MKEE" />
    </html>
  );
}