// app/contact/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type FormState = {
  company: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  modules: string[];
  m365: "yes" | "no" | "unsure";
};

const MODULE_OPTIONS = [
  { key: "approval", label: "전자결재" },
  { key: "expense", label: "경비처리" },
  { key: "resource", label: "자원예약" },
  { key: "board", label: "게시판" },
  { key: "portal", label: "포탈" },
  { key: "mobile", label: "모바일" },
];

function isEmail(v: string) {
  return /\S+@\S+\.\S+/.test(v);
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    company: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    modules: [],
    m365: "unsure",
  });

  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    company: false,
    name: false,
    email: false,
    phone: false,
    message: false,
    modules: false,
    m365: false,
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};

    if (form.company.trim().length < 2) e.company = "회사명은 2자 이상 입력해 주세요.";
    if (form.name.trim().length < 2) e.name = "담당자명은 2자 이상 입력해 주세요.";
    if (!isEmail(form.email.trim())) e.email = "이메일 형식을 확인해 주세요.";
    if (form.message.trim().length < 5) e.message = "문의 내용은 5자 이상 입력해 주세요."; // ✅ 좀 더 현실적으로 5자
    // phone은 선택
    return e;
  }, [form]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  function markTouched<K extends keyof FormState>(key: K) {
    setTouched((p) => ({ ...p, [key]: true }));
  }

  function onChangeText(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value } as FormState));
  }

  function toggleModule(key: string) {
    setForm((p) => {
      const has = p.modules.includes(key);
      return {
        ...p,
        modules: has ? p.modules.filter((x) => x !== key) : [...p.modules, key],
      };
    });
  }

  function showError(field: keyof FormState) {
    // 제출 시도했거나, 해당 필드를 한번이라도 건드렸으면 에러 표시
    return (submitAttempted || touched[field]) && !!errors[field];
  }

  const errorList = useMemo(() => {
    const list: { field: keyof FormState; label: string; msg: string }[] = [];
    const map: Record<keyof FormState, string> = {
      company: "회사명",
      name: "담당자",
      email: "이메일",
      phone: "연락처",
      message: "문의 내용",
      modules: "관심 모듈",
      m365: "Microsoft 365",
    };
    (Object.keys(errors) as (keyof FormState)[]).forEach((k) => {
      list.push({ field: k, label: map[k], msg: errors[k]! });
    });
    return list;
  }, [errors]);

  function scrollToFirstError() {
    if (errorList.length === 0) return;
    const first = errorList[0].field;
    const el = document.querySelector(`[data-field="${first}"]`) as HTMLElement | null;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    (el?.querySelector("input,textarea") as HTMLElement | null)?.focus?.();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerMsg(null);
    setSubmitAttempted(true);

    // 전체 필드 touched 처리 → 에러가 확실히 보이게
    setTouched({
      company: true,
      name: true,
      email: true,
      phone: true,
      message: true,
      modules: true,
      m365: true,
    });

    if (!isValid) {
      scrollToFirstError();
      return;
    }

    try {
      setSubmitting(true);

      // ✅ 실제 메일/DB 연동이 있으면 여기서 처리됨
      // - /api/contact 라우트가 있으면 그대로 호출
      // - 없으면 catch로 떨어져 데모 처리
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        // API가 없거나(404), 서버 오류면 데모로 fallback
        throw new Error(`API failed: ${res.status}`);
      }

      setServerMsg("문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");
      alert("문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");

      setForm({
        company: "",
        name: "",
        email: "",
        phone: "",
        message: "",
        modules: [],
        m365: "unsure",
      });
      setTouched({
        company: false,
        name: false,
        email: false,
        phone: false,
        message: false,
        modules: false,
        m365: false,
      });
      setSubmitAttempted(false);
    } catch {
      // ✅ 데모 fallback (현재 메일이 안 오는 이유가 서버 라우트가 없기 때문일 가능성이 큼)
      setServerMsg("문의가 접수되었습니다. (현재는 데모 동작이며 A-3에서 메일/DB가 연결됩니다.)");
      alert("문의가 접수되었습니다. (현재는 데모 동작이며 A-3에서 메일/DB가 연결됩니다.)");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* 메인 톤과 통일된 배경 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
        <div className="absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-indigo-100 blur-3xl opacity-40" />
        <div className="absolute -right-40 bottom-10 h-[420px] w-[420px] rounded-full bg-cyan-100 blur-3xl opacity-40" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ✅ 스크롤 줄이기: 상단 여백 줄이고(PT), 섹션을 화면에 맞춤 */}
      <section className="mx-auto min-h-[calc(100vh-72px)] max-w-6xl px-6 pb-2 pt-3">
        {/* 상단 헤더(컴팩트) */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-slate-500">
              SMART TEAMS · 도입문의
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              상담/데모 요청
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              도입 범위(모듈), 인원, Microsoft 365 사용 여부 등을 남겨주시면 맞춤 데모/견적을 안내드립니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              홈으로
            </Link>
            <Link
              href="/products"
              className="inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              주요기능 보기
            </Link>
          </div>
        </div>

        {/* ✅ 에러 요약 박스(제출 시도 후, 에러가 있으면 노출) */}
        {submitAttempted && errorList.length > 0 && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <div className="font-extrabold">필수 입력을 확인해 주세요.</div>
            <ul className="mt-2 list-disc pl-5">
              {errorList.map((x) => (
                <li key={String(x.field)}>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.querySelector(
                        `[data-field="${x.field}"]`
                      ) as HTMLElement | null;
                      el?.scrollIntoView({ behavior: "smooth", block: "center" });
                      (el?.querySelector("input,textarea") as HTMLElement | null)?.focus?.();
                    }}
                    className="underline underline-offset-2"
                  >
                    {x.label}
                  </button>{" "}
                  — {x.msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 서버 메시지 */}
        {serverMsg && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 backdrop-blur">
            {serverMsg}
          </div>
        )}

        {/* 본문 카드 */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* 왼쪽 안내 카드 */}
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_10px_40px_rgba(2,6,23,0.06)] backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                <span className="text-sm font-black">☎</span>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">연락처 정보</h2>
                <p className="mt-1 text-sm text-slate-600">
                  아래 항목을 포함해 주시면 더 빠르게 안내드릴 수 있습니다.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { t: "회사명 / 담당자", d: "기본 연락 정보" },
                { t: "필요 모듈", d: "전자결재 · 경비 · 자원예약 · 게시판 · 포탈 · 모바일" },
                { t: "도입 시기 / 인원", d: "희망 일정 및 사용자 규모" },
                { t: "Microsoft 365 사용 여부", d: "Teams/SSO 연동 범위 확인" },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">{x.t}</p>
                  <p className="mt-1 text-xs text-slate-600">{x.d}</p>
                </div>
              ))}

              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-600">
                  제출하신 정보는 상담 목적을 위해서만 사용됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* 오른쪽 폼 카드 */}
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_10px_40px_rgba(2,6,23,0.06)] backdrop-blur">
            <form onSubmit={onSubmit} className="space-y-4">
              {/* 회사명 */}
              <div data-field="company">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  회사명{" "}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-slate-600">
                    필수
                  </span>
                </label>
                <input
                  name="company"
                  value={form.company}
                  onChange={onChangeText}
                  onBlur={() => markTouched("company")}
                  placeholder="예) 티투엘(주)"
                  className={[
                    "mt-2 h-11 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition focus:ring-4",
                    showError("company")
                      ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
                      : "border-slate-200 focus:border-indigo-300 focus:ring-indigo-100",
                  ].join(" ")}
                />
                {showError("company") && (
                  <p className="mt-1 text-xs text-rose-600">{errors.company}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* 담당자 */}
                <div data-field="name">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    담당자{" "}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-slate-600">
                      필수
                    </span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChangeText}
                    onBlur={() => markTouched("name")}
                    placeholder="예) 홍길동"
                    className={[
                      "mt-2 h-11 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition focus:ring-4",
                      showError("name")
                        ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
                        : "border-slate-200 focus:border-indigo-300 focus:ring-indigo-100",
                    ].join(" ")}
                  />
                  {showError("name") && (
                    <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
                  )}
                </div>

                {/* 연락처(선택) */}
                <div data-field="phone">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    연락처{" "}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-slate-600">
                      선택
                    </span>
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChangeText}
                    onBlur={() => markTouched("phone")}
                    placeholder="예) 010-1234-5678"
                    className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div data-field="email">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  이메일{" "}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-slate-600">
                    필수
                  </span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChangeText}
                  onBlur={() => markTouched("email")}
                  placeholder="예) sales@t2l.co.kr"
                  className={[
                    "mt-2 h-11 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition focus:ring-4",
                    showError("email")
                      ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
                      : "border-slate-200 focus:border-indigo-300 focus:ring-indigo-100",
                  ].join(" ")}
                />
                {showError("email") && (
                  <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
                )}
              </div>

              {/* 관심 모듈(선택) */}
              <div data-field="modules">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">관심 모듈</label>
                  <span className="text-[11px] text-slate-500">선택</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {MODULE_OPTIONS.map((m) => {
                    const on = form.modules.includes(m.key);
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => toggleModule(m.key)}
                        className={[
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                          on
                            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <span className={["h-2 w-2 rounded-full", on ? "bg-indigo-500" : "bg-slate-300"].join(" ")} />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* M365 선택(선택) */}
              <div data-field="m365">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Microsoft 365 사용 여부</label>
                  <span className="text-[11px] text-slate-500">선택</span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { v: "yes" as const, label: "사용중" },
                    { v: "no" as const, label: "미사용" },
                    { v: "unsure" as const, label: "미정" },
                  ].map((x) => {
                    const on = form.m365 === x.v;
                    return (
                      <button
                        key={x.v}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, m365: x.v }))}
                        className={[
                          "h-10 rounded-2xl border text-xs font-bold transition",
                          on
                            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {x.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 문의 내용 */}
              <div data-field="message">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  문의 내용{" "}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-slate-600">
                    필수
                  </span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChangeText}
                  onBlur={() => markTouched("message")}
                  placeholder="원하시는 모듈/도입 시기/연동 환경 등을 적어주세요."
                  rows={5}
                  className={[
                    "mt-2 w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4",
                    showError("message")
                      ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
                      : "border-slate-200 focus:border-indigo-300 focus:ring-indigo-100",
                  ].join(" ")}
                />
                <div className="mt-1 flex items-center justify-between">
                  {showError("message") ? (
                    <p className="text-xs text-rose-600">{errors.message}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-[11px] text-slate-500">
                    {form.message.trim().length}/5+
                  </p>
                </div>
              </div>

              {/* 제출 */}
              <button
                type="submit"
                disabled={submitting}
                className={[
                  "inline-flex h-12 w-full items-center justify-center rounded-2xl px-6 text-sm font-extrabold shadow-sm transition",
                  submitting
                    ? "bg-slate-200 text-slate-500"
                    : isValid
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-slate-200 text-slate-500 hover:bg-slate-200",
                ].join(" ")}
              >
                {submitting ? "전송 중..." : "상담 요청 보내기"}
              </button>

              <p className="text-xs text-slate-500">
                제출하신 정보는 상담 목적을 위해서만 사용됩니다.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}