import Link from "next/link";
import fs from "fs";
import path from "path";
import Image from "next/image";

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

function AdminLogoBox({
  company,
  logo,
}: {
  company: string;
  logo?: string | null;
}) {
  const logoSrc = logo && logo.trim() ? logo : "/images/default-logo.png";

  return (
    <div className="flex h-14 w-28 items-center justify-center overflow-hidden rounded-md border bg-white p-2">
      <div className="relative h-10 w-full">
        <Image
          src={logoSrc}
          alt={company}
          fill
          sizes="112px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default function AdminCasesPage() {
  const cases = readCases();

  return (
    <main className="mx-auto max-w-6xl px-6 pb-10 pt-28">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">도입사례 관리</h1>
          <p className="mt-2 text-slate-600">
            회사명과 로고를 등록하고 관리합니다.
          </p>
        </div>

        <Link
          href="/admin/cases/new"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-white"
        >
          + 도입사례 등록
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="grid grid-cols-12 border-b bg-slate-50 px-5 py-3 text-sm font-semibold">
          <div className="col-span-2">번호</div>
          <div className="col-span-6">회사명</div>
          <div className="col-span-4">관리</div>
        </div>

        {cases.map((item: CaseItem, index: number) => (
          <div
            key={item.id}
            className="grid min-h-[88px] grid-cols-12 items-center border-b px-5 py-4"
          >
            <div className="col-span-2 text-slate-700">{index + 1}</div>

            <div className="col-span-6">
              <div className="flex items-center gap-4">
                <AdminLogoBox company={item.company} logo={item.logo} />
                <span className="text-base font-medium text-slate-800">
                  {item.company}
                </span>
              </div>
            </div>

            <div className="col-span-4 flex gap-2">
              <Link
                href={`/admin/cases/${item.id}/edit`}
                className="rounded border px-3 py-1"
              >
                수정
              </Link>

              <form action={`/api/admin/cases/delete?id=${item.id}`} method="post">
                <button className="rounded border px-3 py-1 text-red-500">
                  삭제
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}