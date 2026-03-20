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
  privacyAgreed: boolean;
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
  const initialForm: FormState = {
    company: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    modules: [],
    m365: "unsure",
    privacyAgreed: false,
  };

  const initialTouched: Record<keyof FormState, boolean> = {
    company: false,
    name: false,
    email: false,
    phone: false,
    message: false,
    modules: false,
    m365: false,
    privacyAgreed: false,
  };

  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] =
    useState<Record<keyof FormState, boolean>>(initialTouched);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};

    if (form.company.trim().length < 2) {
      e.company = "회사명은 2자 이상 입력해 주세요.";
    }
    if (form.name.trim().length < 2) {
      e.name = "담당자명은 2자 이상 입력해 주세요.";
    }
    if (!isEmail(form.email.trim())) {
      e.email = "이메일 형식을 확인해 주세요.";
    }
    if (form.message.trim().length < 5) {
      e.message = "문의 내용은 5자 이상 입력해 주세요.";
    }
    if (!form.privacyAgreed) {
      e.privacyAgreed = "개인정보 수집·이용에 동의해 주세요.";
    }

    return e;
  }, [form]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  function resetForm() {
    setForm(initialForm);
    setTouched(initialTouched);
    setSubmitAttempted(false);
  }

  function markTouched<K extends keyof FormState>(key: K) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function onChangeText(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value } as FormState));
  }

  function toggleModule(key: string) {
    setForm((prev) => {
      const exists = prev.modules.includes(key);
      return {
        ...prev,
        modules: exists
          ? prev.modules.filter((x) => x !== key)
          : [...prev.modules, key],
      };
    });
  }

  function showError(field: keyof FormState) {
    return (submitAttempted || touched[field]) && !!errors[field];
  }

  const errorList = useMemo(() => {
    const map: Record<keyof FormState, string> = {
      company: "회사명",
      name: "담당자",
      email: "이메일",
      phone: "연락처",
      message: "문의 내용",
      modules: "관심 모듈",
      m365: "Microsoft 365",
      privacyAgreed: "개인정보 동의",
    };

    return (Object.keys(errors) as (keyof FormState)[]).map((key) => ({
      field: key,
      label: map[key],
      msg: errors[key]!,
    }));
  }, [errors]);

  function scrollToFirstError() {
    if (errorList.length === 0) return;

    const first = errorList[0].field;
    const el = document.querySelector(
      `[data-field="${first}"]`
    ) as HTMLElement | null;

    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    (el?.querySelector("input,textarea") as HTMLElement | null)?.focus?.();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerMsg(null);
    setSubmitAttempted(true);

    setTouched({
      company: true,
      name: true,
      email: true,
      phone: true,
      message: true,
      modules: true,
      m365: true,
      privacyAgreed: true,
    });

    if (!isValid) {
      scrollToFirstError();
      return;
    }

    try {
      setSubmitting(true);

      const payloadToSend = {
        company: form.company,
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        modules: form.modules,
        m365: form.m365,
        privacyAgreed: form.privacyAgreed,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToSend),
      });

      const contentType = res.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await res.json()
        : { ok: false, error: await res.text() };

      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || `API failed: ${res.status}`);
      }

      if (payload.mailOk === false) {
        const failMsg = payload.mailError
          ? "문의는 저장되었습니다. 다만 이메일 발송은 실패했습니다. (" +
            payload.mailError +
            ")"
          : "문의는 저장되었습니다. 다만 이메일 발송은 실패했습니다.";

        setServerMsg(failMsg);
        alert("문의는 저장되었습니다. 다만 이메일 발송은 실패했습니다.");
      } else {
        setServerMsg("문의가 정상 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");
        alert("문의가 정상 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");
      }

      resetForm();
    } catch (err: any) {
      const msg = err?.message || "문의 접수 중 오류가 발생했습니다.";
      setServerMsg("오류: " + msg);
      alert("오류: " + msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
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

      <section className="mx-auto min-h-[calc(100vh-72px)] max-w-6xl px-6 pb-10 pt-24 md:pt-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-slate-500">
              SMART TEAMS · 도입문의
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              상담/데모 요청
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              도입 범위(모듈), 인원, Microsoft 365 사용 여부 등을 남겨주시면
              맞춤 데모/견적을 안내드립니다.
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

        {serverMsg && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 backdrop-blur">
            {serverMsg}
          </div>
        )}

       <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-[0_10px_40px_rgba(2,6,23,0.06)] backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                <span className="text-sm font-black">☎</span>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  연락처 정보
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  아래 항목을 포함해 주시면 더 빠르게 안내드릴 수 있습니다.
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {[
                { t: "회사명 / 담당자", d: "기본 연락 정보" },
                {
                  t: "필요 모듈",
                  d: "전자결재 · 경비 · 자원예약 · 게시판 · 포탈 · 모바일",
                },
                { t: "도입 시기 / 인원", d: "희망 일정 및 사용자 규모" },
                {
                  t: "Microsoft 365 / 개인정보 동의",
                  d: "Teams/SSO 연동 범위 확인 및 문의 접수를 위한 필수 동의",
                },
              ].map((x) => (
                <div
                  key={x.t}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5"
                >
                  <p className="text-sm font-bold text-slate-900">{x.t}</p>
                  <p className="mt-1 text-xs text-slate-600">{x.d}</p>
                </div>
              ))}

              <div className="rounded-2xl border border-slate-200 bg-white p-2.5">
                <p className="text-xs text-slate-600">
                  제출하신 정보는 상담 목적을 위해서만 사용됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-[0_10px_40px_rgba(2,6,23,0.06)] backdrop-blur">
            <form onSubmit={onSubmit} className="space-y-3.5">
              <div data-field="company">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  회사명
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
                    "mt-2 h-10 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition focus:ring-4",
                    showError("company")
                      ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
                      : "border-slate-200 focus:border-indigo-300 focus:ring-indigo-100",
                  ].join(" ")}
                />
                {showError("company") && (
                  <p className="mt-1 text-xs text-rose-600">{errors.company}</p>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div data-field="name">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    담당자
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
                      "mt-2 h-10 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition focus:ring-4",
                      showError("name")
                        ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
                        : "border-slate-200 focus:border-indigo-300 focus:ring-indigo-100",
                    ].join(" ")}
                  />
                  {showError("name") && (
                    <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
                  )}
                </div>

                <div data-field="phone">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    연락처
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
                    className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div data-field="email">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  이메일
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
                    "mt-2 h-10 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition focus:ring-4",
                    showError("email")
                      ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
                      : "border-slate-200 focus:border-indigo-300 focus:ring-indigo-100",
                  ].join(" ")}
                />
                {showError("email") && (
                  <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
                )}
              </div>

              <div data-field="modules">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    관심 모듈
                  </label>
                  <span className="text-[11px] text-slate-500">선택</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {MODULE_OPTIONS.map((m) => {
                    const active = form.modules.includes(m.key);
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => toggleModule(m.key)}
                        className={[
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                          active
                            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "h-2 w-2 rounded-full",
                            active ? "bg-indigo-500" : "bg-slate-300",
                          ].join(" ")}
                        />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div data-field="m365">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Microsoft 365 사용 여부
                  </label>
                  <span className="text-[11px] text-slate-500">선택</span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { v: "yes" as const, label: "사용중" },
                    { v: "no" as const, label: "미사용" },
                    { v: "unsure" as const, label: "미정" },
                  ].map((x) => {
                    const active = form.m365 === x.v;
                    return (
                      <button
                        key={x.v}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, m365: x.v }))}
                        className={[
                          "h-10 rounded-2xl border text-xs font-bold transition",
                          active
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

              <div data-field="message">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  문의 내용
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
                  rows={3}
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

              <div
                data-field="privacyAgreed"
                className={[
                  "rounded-2xl border p-3 transition",
                  showError("privacyAgreed")
                    ? "border-rose-300 bg-rose-50"
                    : "border-slate-200 bg-slate-50",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-extrabold text-slate-900">
                    개인정보 수집 및 이용 동의
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-extrabold text-slate-600">
                    필수
                  </span>
                </div>

                <div className="mt-2 h-24 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 text-xs leading-6 text-slate-600">
                  <p className="font-bold text-slate-800">정보 제공 동의서</p>
                  <p className="mt-2">
                    “티투엘(주)”(이하 ‘회사’라고 함)는 고객님의 개인정보를 매우 중요시하며,
                    [개인정보보호법]을 준수하고 있습니다. 본 개인정보처리방침은 고객님들께서
                    제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며 개인정보보호를 위해
                    어떠한 조치가 취해지고 있는지 알려드립니다. 회사는 개인정보보호처리방침을
                    개정하는 경우 웹사이트(또는 개별공지)를 통하여 고지할 것입니다.
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">1. 개인정보의 수집에 대한 동의</p>
                  <p className="mt-1">
                    회사는 고객님의 개인정보 수집과 관련하여 회사의 개인정보보호정책 또는 이용약관의
                    내용에 대해 「동의합니다」 또는 「동의하지 않습니다」를 선택할 수 있는 절차를
                    마련하여 고객님이 「동의합니다」를 체크하시면 개인정보 수집에 대해 동의한 것으로
                    봅니다.
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">2. 수집하는 개인정보의 항목 및 수집방법</p>
                  <p className="mt-1">
                    회사의 사업과 관련하여 정보 요청 시 필수적으로 필요한 개인정보를 얻고 있으며 이 외에
                    선택 항목에 대해서는 정보 제공 여부를 고객님께서 선택하실 수 있습니다. 고객님의
                    자발적 개인정보 등록(회사명, 부서, 이름, E-Mail, 연락처) 외에 서버의 로그파일이나
                    쿠키 등을 이용하여 개인의 방문 및 이용내역을 수집합니다.
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">3. 개인정보의 수집 및 이용목적</p>
                  <p className="mt-1">
                    수집한 개인정보는 고객관리 및 서비스의 관리, 마케팅 및 제품정보의 제공, 세미나 등의
                    이벤트 초대와 제공, 고객의 서비스 이용에 대한 통계 등의 목적을 위해 활용합니다.
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">4. 개인정보의 보유·이용기간 및 폐기</p>
                  <p className="mt-1">
                    고객님의 개인정보는 회사가 고객님께 제품 및 세미나 정보 등의 서비스를 제공하기 위하여
                    지속적으로 보유합니다. 고객님께서 개인정보 삭제를 요청한 경우 개인정보는 즉시
                    파기되며, 어떤 이유나 방법으로도 재생되거나 이용할 수 없도록 처리됩니다. 개인정보
                    수집목적이 달성된 경우 파기를 원칙으로 하고 있으나, 관련 법령에 따라 보유할 수
                    있습니다.
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">5. 이용자 및 법정대리인의 권리와 그 행사방법</p>
                  <p className="mt-1">
                    이용자 및 법정대리인은 개인정보와 관련하여 전화, 서면 등을 이용하여 개인정보 열람,
                    정정, 삭제, 처리정지 등의 권리를 행사할 수 있습니다.
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">6. 개인정보의 제3자 제공</p>
                  <p className="mt-1">
                    회사는 고객 본인의 동의 없이 개인정보를 다른 개인이나 기업, 기관과 공유하지 않는 것을
                    원칙으로 합니다. 다만 고객님의 사전 동의를 얻은 경우 또는 법령에 따라 필요한 경우에는
                    예외로 합니다.
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">7. 개인정보 처리의 위탁</p>
                  <p className="mt-1">
                    회사는 고객님들의 동의 없이 개인정보 취급을 외부 업체에 위탁하지 않습니다. 향후
                    서비스 향상 및 보다 질 높은 서비스 제공을 위해 외부 전문업체에 위탁하여 운영하게 될
                    경우, 위탁 업무 내용에 대해 고객님들께 통지하고 필요한 경우 사전 동의를 받도록
                    하겠습니다.
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">8. 개인정보 보호담당자</p>
                  <p className="mt-1">
                    이름 : 이기왕 / 연락처 : 02-786-2471 / 이메일 : tour@t2l.com
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">9. 개인정보의 안전성 확보조치</p>
                  <p className="mt-1">
                    고객님께서 제공하신 모든 정보는 방화벽 등 보안장비에 의해 안전하게 보호되고 있습니다.
                    또한 개인정보를 처리하는 인원을 최소한으로 제한하고 정기적인 교육과 비밀번호 갱신을
                    통해 개인정보가 유출되지 않도록 관리하고 있습니다.
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">10. 정책 변경에 따른 공지의무</p>
                  <p className="mt-1">
                    이 개인정보처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및
                    수정이 있을 시에는 변경되는 개인정보처리방침을 시행하기 최소 7일 전에 웹사이트 등에
                    내용을 공지하도록 하겠습니다.
                  </p>

                  <p className="mt-2">
                    공고일자 : 2026년 3월 1일
                    <br />
                    시행일자 : 2026년 3월 1일
                  </p>
                </div>

                <label className="mt-3 flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.privacyAgreed}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        privacyAgreed: e.target.checked,
                      }))
                    }
                    onBlur={() => markTouched("privacyAgreed")}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">
                    개인정보 수집·이용에 동의합니다. <b>(필수)</b>
                  </span>
                </label>

                {showError("privacyAgreed") && (
                  <p className="mt-2 text-xs text-rose-600">{errors.privacyAgreed}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={[
                  "inline-flex h-11 w-full items-center justify-center rounded-2xl px-6 text-sm font-extrabold shadow-sm transition",
                  submitting
                    ? "bg-slate-200 text-slate-500"
                    : form.privacyAgreed
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-slate-200 text-slate-500 hover:bg-slate-300",
                ].join(" ")}
                title={!form.privacyAgreed ? "개인정보 수집·이용 동의가 필요합니다." : ""}
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