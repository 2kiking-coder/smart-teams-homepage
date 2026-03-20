import fs from "fs";
import path from "path";
import Link from "next/link";

function readCases() {
  const filePath = path.join(process.cwd(), "data", "cases.json");

  if (!fs.existsSync(filePath)) return [];

  const data = fs.readFileSync(filePath, "utf-8");

  try {
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cases = readCases();
  const item = cases.find((x: any) => String(x.id) === String(id));

  if (!item) {
    return (
      <main className="mx-auto max-w-3xl px-6 pb-10 pt-28">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            대상을 찾을 수 없습니다.
          </h1>
          <p className="mt-2 text-slate-600">
            이미 삭제되었거나 잘못된 주소입니다.
          </p>

          <Link
            href="/admin/cases"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            목록으로
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 pb-10 pt-28">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">도입사례 수정</h1>
          <p className="mt-2 text-slate-600">회사명과 로고를 수정합니다.</p>
        </div>

        <Link
          href="/admin/cases"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          목록으로
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form
          action={`/api/admin/cases/update?id=${item.id}`}
          method="post"
          encType="multipart/form-data"
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              회사명
            </label>
            <input
              type="text"
              name="company"
              defaultValue={item.company}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              현재 로고
            </label>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex h-20 w-36 items-center justify-center overflow-hidden rounded-md border bg-white p-2">
                <img
                  src={item.logo}
                  alt={item.company}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              새 로고 파일
            </label>
            <input
              type="file"
              name="logo"
              accept=".png,.jpg,.jpeg,.webp,.svg"
              className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            />
            <p className="mt-2 text-xs text-slate-500">
              새 파일을 선택하면 기존 로고를 교체합니다. 선택하지 않으면 현재 로고를 유지합니다.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              저장
            </button>

            <Link
              href="/admin/cases"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}