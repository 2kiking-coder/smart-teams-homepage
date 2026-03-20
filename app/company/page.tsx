export default function CompanyPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pt-24 pb-14 md:pt-28">
      <h1 className="text-4xl font-extrabold">회사소개</h1>
      <p className="mt-4 text-gray-600">
        서비스 운영, 보안, 지원 체계 등 신뢰 포인트를 소개합니다.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          ["실적", "다수 고객사 구축/운영"],
          ["보안", "권한/감사로그/접근통제"],
          ["지원", "운영/교육/CS 체계"],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl border bg-white p-6">
            <div className="font-bold">{t}</div>
            <div className="mt-2 text-sm text-gray-600">{d}</div>
          </div>
        ))}
      </div>
    </main>
  );
}