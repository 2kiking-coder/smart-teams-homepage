import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";

type CaseItem = {
  id: number;
  company: string;
  logo?: string | null;
};

function readCases(): CaseItem[] {
  const filePath = path.join(process.cwd(), "data", "cases.json");

  if (!fs.existsSync(filePath)) return [];

  const data = fs.readFileSync(filePath, "utf-8");

  try {
    const json = JSON.parse(data || "[]");
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

function LogoCard({ company, logo }: { company: string; logo?: string | null }) {
  const logoSrc = logo && logo.trim() ? logo : "/images/default-logo.png";

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6d5bd0] hover:shadow-lg active:scale-[0.98] md:p-5">
      <div className="flex h-24 items-center justify-center rounded-xl bg-white p-3 md:h-28 md:p-4">
        <div className="relative h-16 w-full md:h-20">
          <Image
            src={logoSrc}
            alt={`${company} 로고`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain"
          />
        </div>
      </div>

      <div className="mt-3 text-center md:mt-4">
        <div className="text-[15px] font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-[#5646c7] md:text-base">
          {company}
        </div>
      </div>
    </div>
  );
}

export default function CasesPage() {
  const cases = readCases();

  return (
    <main className="mx-auto max-w-7xl px-5 pt-24 pb-16 md:px-6 md:pt-20 md:pb-20">
      <section className="mb-10 text-center md:mb-12">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-500 shadow-sm md:text-xs">
          함께하는 고객사
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          도입사례
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
          Smart Teams를 도입한 주요 고객사를 소개합니다.
        </p>
      </section>

      {cases.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-16 text-center text-slate-400 shadow-sm">
          등록된 도입사례가 없습니다.
        </div>
      ) : (
        <>
          <section className="mb-5 md:mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              주요 구축 고객사
            </h2>
            <p className="mt-1 text-sm text-slate-500 md:text-base">
              현재 {cases.length}개 업체가 Smart Teams와 함께하고 있습니다.
            </p>
          </section>

          <section className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {cases.map((item) => (
              <LogoCard
                key={item.id}
                company={item.company}
                logo={item.logo}
              />
            ))}
          </section>

          <section className="mt-12 rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#f8f7ff] to-white px-6 py-10 text-center shadow-sm md:mt-16 md:px-10 md:py-14">
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              우리 회사도 Smart Teams로 업무 혁신을 시작해보세요
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              업종에 맞는 그룹웨어 구축 상담을 받아보세요.
              협업, 운영, 승인, 게시판, 자원관리 등 필요한 기능을 맞춤형으로 제안해드립니다.
            </p>

            <div className="mt-6 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#6d5bd0] px-6 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg hover:opacity-95"
              >
                도입 문의
              </Link>
            </div>
          </section>
        </>
      )}
    </main>
  );
}