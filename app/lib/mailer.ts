// app/lib/mailer.ts
import nodemailer from "nodemailer";

type ContactPayload = {
  company?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  createdAt?: string;
  ip?: string;
  ua?: string;
};

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function sendContactEmail(payload: ContactPayload) {
  const host = mustEnv("SMTP_HOST");
  const port = Number(mustEnv("SMTP_PORT"));
  const user = mustEnv("SMTP_USER");
  const pass = mustEnv("SMTP_PASS");

  const toAdmin = mustEnv("CONTACT_NOTIFY_TO");
  const from = process.env.CONTACT_FROM || user;
  const subjectPrefix = process.env.CONTACT_SUBJECT_PREFIX || "[SMART TEAMS]";

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const createdAt = payload.createdAt || new Date().toISOString();

  // -----------------------------
  // (1) 관리자 알림 메일 (기존)
  // -----------------------------
  const subjectAdmin = `${subjectPrefix} 도입문의 접수 - ${payload.company || "회사명 없음"} / ${payload.name || "담당자 없음"}`;

  const textAdmin = [
    `도입문의가 접수되었습니다.`,
    ``,
    `회사: ${payload.company || ""}`,
    `담당자: ${payload.name || ""}`,
    `이메일: ${payload.email || ""}`,
    `연락처: ${payload.phone || ""}`,
    `내용:`,
    `${payload.message || ""}`,
    ``,
    `접수시각: ${createdAt}`,
    payload.ip ? `IP: ${payload.ip}` : "",
    payload.ua ? `UA: ${payload.ua}` : "",
  ].filter(Boolean).join("\n");

  const htmlAdmin = `
  <div style="font-family:Arial,sans-serif;line-height:1.5">
    <h2 style="margin:0 0 12px">도입문의가 접수되었습니다</h2>
    <table style="border-collapse:collapse;width:100%;max-width:720px">
      <tr><td style="padding:8px;border:1px solid #ddd;width:140px;background:#fafafa">회사</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(payload.company || "")}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#fafafa">담당자</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(payload.name || "")}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#fafafa">이메일</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(payload.email || "")}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#fafafa">연락처</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(payload.phone || "")}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#fafafa">문의내용</td><td style="padding:8px;border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(payload.message || "")}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#fafafa">접수시각</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(createdAt)}</td></tr>
    </table>
    <p style="margin:12px 0 0;color:#666;font-size:12px">
      ${payload.ip ? `IP: ${escapeHtml(payload.ip)}<br/>` : ""}
      ${payload.ua ? `UA: ${escapeHtml(payload.ua)}` : ""}
    </p>
  </div>
  `;

  await transporter.sendMail({
    from,                 // master@tourt2l.com 권장
    to: toAdmin,          // 관리자
    subject: subjectAdmin,
    text: textAdmin,
    html: htmlAdmin,
    replyTo: payload.email || undefined,  // 관리자가 답장하면 고객에게
  });

  // -----------------------------
  // (2) 고객 자동 회신 메일 (추가)
  // -----------------------------
  const customerEmail = (payload.email || "").trim();
  if (customerEmail) {
    const subjectCustomer = `${subjectPrefix} 도입문의 접수 완료 안내`;

    const textCustomer = [
      `${payload.name || "고객"}님, 안녕하세요.`,
      ``,
      `SMART TEAMS에 도입문의를 남겨주셔서 감사합니다.`,
      `문의가 정상적으로 접수되었습니다.`,
      `담당자가 확인 후 빠르게 연락드리겠습니다.`,
      ``,
      `- 접수 정보 -`,
      `회사: ${payload.company || ""}`,
      `담당자: ${payload.name || ""}`,
      `연락처: ${payload.phone || ""}`,
      `문의내용:`,
      `${payload.message || ""}`,
      ``,
      `접수시각: ${createdAt}`,
      ``,
      `※ 본 메일은 발신전용입니다. 추가 문의는 본 메일에 회신하지 말고, 홈페이지 문의를 이용해주세요.`,
    ].join("\n");

    const htmlCustomer = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:720px">
        <h2 style="margin:0 0 12px">도입문의가 접수되었습니다</h2>
        <p style="margin:0 0 14px">${escapeHtml(payload.name || "고객")}님, 안녕하세요.<br/>
        SMART TEAMS에 도입문의를 남겨주셔서 감사합니다.<br/>
        문의가 정상적으로 접수되었으며, 담당자가 확인 후 연락드리겠습니다.</p>

        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:14px;background:#fafafa">
          <div><b>회사</b>: ${escapeHtml(payload.company || "")}</div>
          <div><b>담당자</b>: ${escapeHtml(payload.name || "")}</div>
          <div><b>연락처</b>: ${escapeHtml(payload.phone || "")}</div>
          <div style="margin-top:10px"><b>문의내용</b><br/>
            <div style="white-space:pre-wrap">${escapeHtml(payload.message || "")}</div>
          </div>
          <div style="margin-top:10px;color:#6b7280;font-size:12px">접수시각: ${escapeHtml(createdAt)}</div>
        </div>

        <p style="margin:12px 0 0;color:#6b7280;font-size:12px">
          ※ 본 메일은 발신전용입니다. 추가 문의는 홈페이지 문의를 이용해주세요.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from,               // 여기서도 같은 발신자 유지(인증된 계정)
      to: customerEmail,  // 고객
      subject: subjectCustomer,
      text: textCustomer,
      html: htmlCustomer,
      // 고객이 회신하면 운영팀 메일로 가게 하고 싶으면:
      replyTo: toAdmin,
    });
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
