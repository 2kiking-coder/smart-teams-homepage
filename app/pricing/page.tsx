import Link from "next/link";

const FACTORS = [
  {
    no: "01",
    title: "사용자 규모",
    desc: "도입 인원 수와 조직 규모에 따라 라이선스 및 운영 구성이 달라집니다.",
    badge: "bg-violet-50 text-violet-600",
    line: "bg-violet-500",
    border: "hover:border-violet-500",
    glow: "hover:shadow-[0_10px_30px_rgba(139,92,246,0.16)]",
  },
  {
    no: "02",
    title: "기능 구성",
    desc: "전자결재, 게시판, 자원관리, 협업 기능 등 선택한 모듈에 따라 범위가 결정됩니다.",
    badge: "bg-indigo-50 text-indigo-600",
    line: "bg-indigo-500",
    border: "hover:border-indigo-500",
    glow: "hover:shadow-[0_10px_30px_rgba(99,102,241,0.16)]",
  },
  {
    no: "03",
    title: "구축 방식",
    desc: "클라우드형 또는 온프레미스형 등 기업 환경에 맞는 구축 방식에 따라 비용이 달라집니다.",
    badge: "bg-fuchsia-50 text-fuchsia-600",
    line: "bg-fuchsia-500",
    border: "hover:border-fuchsia-500",
    glow: "hover:shadow-[0_10px_30px_rgba(192,38,211,0.16)]",
  },
  {
    no: "04",
    title: "커스터마이징",
    desc: "기업 업무 프로세스에 맞춘 화면, 권한, 승인 체계, 연동 범위에 따라 견적이 산정됩니다.",
    badge: "bg-purple-50 text-purple-600",
    line: "bg-purple-500",
    border: "hover:border-purple-500",
    glow: "hover:shadow-[0_10px_30px_rgba(147,51,234,0.16)]",
  },
  {
    no: "05",
    title: "유지보수 범위",
    desc: "운영 지원, 장애 대응, 기능 개선 등 유지보수 수준에 따라 비용 구조가 달라집니다.",
    badge: "bg-sky-50 text-sky-600",
    line: "bg-sky-500",
    border: "hover:border-sky-500",
    glow: "hover:shadow-[0_10px_30px_rgba(14,165,233,0.16)]",
  },
  {
    no: "06",
    title: "추가 연동",
    desc: "기존 시스템, 그룹웨어, ERP, 메일, Microsoft 365 등 외부 시스템 연동 여부를 반영합니다.",
    badge: "bg-blue-50 text-blue-600",
    line: "bg-blue-500",
    border: "hover:border-blue-500",
    glow: "hover:shadow-[0_10px_30px_rgba(59,130,246,0.16)]",
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pt-24 pb-16 md:px-6 md:pt-20 md:pb-20">
      <section className="mb-12 text-center">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-500 shadow-sm md:text-xs">
          맞춤 견적 안내
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          도입비용
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          기업 규모와 운영 환경에 따라 맞춤 견적을 제공합니다.
          Smart Teams는 정형화된 요금제가 아닌 맞춤 구축 방식으로 제안됩니다.
        </p>
      </section>

      <section className="mb-12 rounded-[30px] border border-slate-200 bg-white px-6 py-8 shadow-sm md:px-8 md:py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            비용은 어떻게 결정되나요?
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500 md:text-base">
            Smart Teams 도입비용은 기업의 운영 구조와 필요한 기능 범위에 따라 달라집니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FACTORS.map((item) => (
            <div
              key={item.no}
              className={[
                "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300",
                "hover:-translate-y-1",
                item.border,
                item.glow,
              ].join(" ")}
            >
              <div className={`absolute inset-x-0 top-0 h-1 ${item.line}`} />

              <div
                className={[
                  "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                  item.badge,
                ].join(" ")}
              >
                {item.no}
              </div>

              <h3 className="text-lg font-bold tracking-tight text-slate-900">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 grid gap-5 md:grid-cols-2">
        <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#faf8ff] to-white px-7 py-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-400 hover:shadow-[0_12px_36px_rgba(109,91,208,0.14)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-violet-500" />

          <div className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold tracking-wide text-violet-600">
            도입 방식
          </div>

          <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            기업 환경에 맞는 유연한 구축
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
            클라우드형, 온프레미스형, 단계별 확장형 등 다양한 방식으로 제안이 가능합니다.
          </p>

          <div className="mt-5 text-sm font-medium text-violet-600">
            클라우드 · 온프레미스 · 단계별 확장 지원
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#f7fbff] to-white px-7 py-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:shadow-[0_12px_36px_rgba(14,165,233,0.14)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-sky-500" />

          <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold tracking-wide text-sky-600">
            상담 안내
          </div>

          <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            예산 수준에 맞는 방향 제안
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
            현재 운영 환경과 필요한 기능을 알려주시면 도입 범위와 예산에 맞는 방향을 안내해드립니다.
          </p>

          <div className="mt-5 text-sm font-medium text-sky-600">
            현재 환경 분석 → 범위 제안 → 맞춤 견적 안내
          </div>
        </div>
      </section>

      <section className="mb-12 text-center">
        <p className="text-sm text-slate-600 md:text-base">
          이미 다양한 기업들이 Smart Teams를 도입했습니다
        </p>

        <div className="mt-5 flex justify-center">
          <Link
            href="/cases"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#cfc7ff] bg-white px-5 text-sm font-semibold text-[#5b4bc4] shadow-sm transition hover:-translate-y-0.5 hover:border-[#6d5bd0] hover:shadow-md"
          >
            <span>도입사례 보기</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      <section className="group rounded-[30px] border border-slate-200 bg-gradient-to-br from-[#f8f7ff] to-white px-6 py-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6d5bd0] hover:shadow-lg md:px-10 md:py-14">
        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          우리 회사도 Smart Teams로 업무 혁신을 시작해보세요
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
          업종에 맞는 그룹웨어 구축 상담을 받아보세요. 협업, 운영, 승인,
          게시판, 자원관리 등 필요한 기능을 맞춤형으로 제안해드립니다.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#6d5bd0] px-6 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg hover:opacity-95"
          >
            무료 상담 신청
          </Link>
        </div>
      </section>
    </main>
  );
}