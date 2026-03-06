// app/admin/contact/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";

type ContactItem = {
  id: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  ip?: string;
  ua?: string;
};

type Status = "PENDING" | "DONE";
type StatusMap = Record<string, Status>;

function fmtKST(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  } catch {
    return iso;
  }
}

export default function AdminContactPage() {
  const [items, setItems] = useState<ContactItem[]>([]);
  const [status, setStatus] = useState<StatusMap>({});
  const [dirty, setDirty] = useState<Record<string, Status>>({});
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [editMode, setEditMode] = useState(false);

  async function safeJson(res: Response) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(text?.slice(0, 200) || "Invalid JSON response");
    }
  }

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/contact/list", { cache: "no-store" });
      const data = await safeJson(res);
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Load failed");

      setItems(Array.isArray(data.items) ? data.items : []);
      setStatus(data.status || {});
      setDirty({});
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!Object.keys(dirty).length) return;

    setLoading(true);
    setErr("");

    const updates = { ...dirty };

    try {
      const res = await fetch("/api/admin/contact/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
        cache: "no-store",
      });

      const data = await safeJson(res);
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Save failed");

      setStatus((prev) => ({ ...prev, ...updates }));
      setDirty({});
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  function toggleRow(id: string) {
    if (!editMode) return;
    if (loading) return;

    const current = dirty[id] ?? status[id] ?? "PENDING";
    const next: Status = current === "PENDING" ? "DONE" : "PENDING";
    setDirty((p) => ({ ...p, [id]: next }));
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const getSt = (id: string) => dirty[id] ?? status[id] ?? "PENDING";

    const list = items.map((it) => ({ ...it, _st: getSt(it.id) }));

    if (!qq) return list;

    return list.filter((it: any) => {
      const hay = [
        it.company,
        it.name,
        it.email,
        it.phone,
        it.message,
        it._st === "PENDING" ? "미처리" : "처리",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(qq);
    });
  }, [items, status, dirty, q]);

  const counts = useMemo(() => {
    const getSt = (id: string) => dirty[id] ?? status[id] ?? "PENDING";
    let pending = 0;
    let done = 0;
    for (const it of items) {
      if (getSt(it.id) === "PENDING") pending++;
      else done++;
    }
    return { total: items.length, pending, done };
  }, [items, status, dirty]);

  const dirtyCount = Object.keys(dirty).length;

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 16px" }}>
      <section
        style={{
          border: "1px solid #111827",
          borderRadius: 16,
          padding: 28,
          background: "white",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>관리자 · 도입문의</h1>
            <p style={{ margin: "8px 0 0", color: "#374151" }}>
              저장된 문의 목록을 확인합니다. (API: <b>/api/contact</b>)
            </p>
            <p style={{ margin: "10px 0 0", color: "#111827", fontWeight: 700 }}>
              전체 {counts.total} · 미처리 {counts.pending} · 처리 {counts.done}
              {dirtyCount ? <span style={{ color: "#2563EB" }}> · 변경 {dirtyCount}</span> : null}
            </p>
            <p style={{ margin: "6px 0 0", color: "#6B7280", fontSize: 12 }}>
              모드: <b>{editMode ? "편집중" : "잠금"}</b>
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <button
              onClick={load}
              disabled={loading}
              style={{
                height: 40,
                padding: "0 14px",
                borderRadius: 10,
                border: "1px solid #111827",
                background: "white",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              새로고침
            </button>

            <button
              onClick={() => setEditMode((v) => !v)}
              disabled={loading}
              style={{
                height: 40,
                padding: "0 14px",
                borderRadius: 10,
                border: "1px solid #111827",
                background: editMode ? "#111827" : "white",
                color: editMode ? "white" : "#111827",
                fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              title={editMode ? "상태 변경이 가능합니다" : "잠금 상태: 클릭해도 상태가 바뀌지 않습니다"}
            >
              {editMode ? "편집중" : "잠금"}
            </button>

            <button
              onClick={save}
              disabled={loading || dirtyCount === 0}
              style={{
                height: 40,
                padding: "0 14px",
                borderRadius: 10,
                border: "1px solid #2563EB",
                background: dirtyCount === 0 ? "#93C5FD" : "#2563EB",
                color: "white",
                fontWeight: 800,
                cursor: loading || dirtyCount === 0 ? "not-allowed" : "pointer",
                opacity: loading ? 0.8 : 1,
              }}
              title={dirtyCount === 0 ? "변경사항이 없습니다" : "상태 저장"}
            >
              저장
            </button>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="검색: 회사명/담당자/이메일/연락처/내용"
            style={{
              width: "100%",
              height: 44,
              borderRadius: 10,
              border: "1px solid #111827",
              padding: "0 14px",
              outline: "none",
            }}
          />
          {err ? (
            <div style={{ marginTop: 10, color: "#DC2626", fontWeight: 700 }}>오류: {err}</div>
          ) : null}
        </div>

        <div
          style={{
            marginTop: 18,
            border: "1px solid #111827",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#F9FAFB" }}>
              <tr>
                {["시간", "회사", "담당자", "이메일", "연락처", "문의", "상태"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 12px",
                      fontSize: 13,
                      borderBottom: "1px solid #111827",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 18, color: "#6B7280" }}>
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((it: any) => {
                  const st: Status = it._st;
                  const isPending = st === "PENDING";
                  const label = isPending ? "미처리" : "처리";
                  const pillBg = isPending ? "#FEF3C7" : "#D1FAE5";
                  const pillBd = isPending ? "#F59E0B" : "#10B981";

                  const disabled = !editMode || loading;

                  return (
                    <tr key={it.id}>
                      <td style={{ padding: "12px 12px", borderBottom: "1px solid #E5E7EB" }}>
                        {fmtKST(it.createdAt)}
                      </td>
                      <td style={{ padding: "12px 12px", borderBottom: "1px solid #E5E7EB" }}>
                        {it.company}
                      </td>
                      <td style={{ padding: "12px 12px", borderBottom: "1px solid #E5E7EB" }}>
                        {it.name}
                      </td>
                      <td style={{ padding: "12px 12px", borderBottom: "1px solid #E5E7EB" }}>
                        {it.email}
                      </td>
                      <td style={{ padding: "12px 12px", borderBottom: "1px solid #E5E7EB" }}>
                        {it.phone}
                      </td>
                      <td style={{ padding: "12px 12px", borderBottom: "1px solid #E5E7EB" }}>
                        <div style={{ fontWeight: 700 }}>{it.message}</div>
                      </td>
                      <td style={{ padding: "12px 12px", borderBottom: "1px solid #E5E7EB" }}>
                        <button
                          onClick={() => toggleRow(it.id)}
                          disabled={disabled}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 999,
                            border: `1px solid ${pillBd}`,
                            background: pillBg,
                            fontWeight: 900,
                            cursor: disabled ? "not-allowed" : "pointer",
                            opacity: disabled ? 0.65 : 1,
                          }}
                          title={
                            editMode
                              ? "클릭하면 미처리/처리 토글됩니다"
                              : "잠금 상태입니다. 우측 상단에서 '편집중'으로 바꾸세요"
                          }
                        >
                          {label}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 10, color: "#6B7280", fontSize: 12 }}>
          상태는 서버 파일(<b>app/contact/data/contact-status.json</b>)에 저장됩니다.
        </div>
      </section>
    </main>
  );
}