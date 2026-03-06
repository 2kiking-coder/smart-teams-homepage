"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin/contact";

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user, pass }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      setErr(t || "로그인 실패");
      return;
    }

    router.replace(next);
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: 420, border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>관리자 로그인</h1>
        <p style={{ color: "#6b7280", marginBottom: 16 }}>관리자 페이지 접근을 위해 로그인하세요.</p>

        {err && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: 10, borderRadius: 10, marginBottom: 12 }}>
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#374151" }}>아이디</span>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="admin"
              style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px" }}
              required
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#374151" }}>비밀번호</span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="****"
              style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px" }}
              required
            />
          </label>

          <button
            type="submit"
            style={{
              marginTop: 8,
              background: "#2563eb",
              color: "white",
              border: 0,
              borderRadius: 10,
              padding: "10px 12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            로그인
          </button>
        </form>
      </div>
    </main>
  );
}
