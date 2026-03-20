"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCasesNewPage() {
  const router = useRouter();

  const [company, setCompany] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("선택된 파일 없음");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFileName("선택된 파일 없음");
      setLogoFile(null);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setFileName(file.name);
    setLogoFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!company.trim()) {
      alert("회사명을 입력하세요.");
      return;
    }

    if (!logoFile) {
      alert("로고 파일을 선택하세요.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("company", company);
      formData.append("logo", logoFile);

      const res = await fetch("/api/admin/cases/create", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok || !result.ok) {
        alert(result.message || "저장에 실패했습니다.");
        return;
      }

      alert("도입사례가 저장되었습니다.");
      router.push("/admin/cases");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pb-10 pt-28">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">도입사례 등록</h1>
          <p className="mt-2 text-slate-600">회사명과 로고를 등록합니다.</p>
        </div>

        <Link
          href="/admin/cases"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          목록으로
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              회사명
            </label>
            <input
              type="text"
              placeholder="회사명을 입력하세요"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              회사 로고
            </label>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <label className="flex cursor-pointer items-center gap-4">
                <span className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800">
                  파일 선택
                </span>
                <span className="text-sm text-slate-500">{fileName}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              PNG, JPG, WEBP, SVG 파일 업로드 가능
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <div className="mb-3 text-sm font-bold text-slate-700">로고 미리보기</div>

            <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-slate-200 bg-white">
              {previewUrl ? (
                <div className="relative flex h-20 w-44 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <Image
                    src={previewUrl}
                    alt="로고 미리보기"
                    fill
                    unoptimized
                    className="object-contain p-3"
                  />
                </div>
              ) : (
                <div className="text-sm text-slate-400">선택한 로고가 여기에 표시됩니다.</div>
              )}
            </div>

            {company ? (
              <div className="mt-4 text-center text-base font-bold text-slate-900">
                {company}
              </div>
            ) : null}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "저장 중..." : "저장"}
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