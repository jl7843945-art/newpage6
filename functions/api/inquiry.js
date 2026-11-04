/**
 * POST /api/inquiry — Cloudflare Pages Function
 *
 * 接收网站询盘表单（multipart/form-data，可带图纸），通过 Resend 发到销售邮箱。
 *
 * 需要在 Cloudflare Pages 项目里配置的环境变量：
 *   RESEND_API_KEY   必填，Resend 控制台创建的 API Key（Sending access 即可）
 *   INQUIRY_TO       选填，收件邮箱，默认 sales@alloyti.com（多个用英文逗号分隔）
 *   INQUIRY_FROM     选填，发件人，默认 "ALLOYTI Website <onboarding@resend.dev>"
 *                    域名验证通过后改成 "ALLOYTI Website <website@send.alloyti.com>"
 *
 * 未配置 RESEND_API_KEY 时返回 503 + {ok:false,error:"not_configured"}，
 * 前端据此自动降级到邮件客户端。
 */

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 与页面标注的 ≤5MB 保持一致
const MAX_TOTAL_BYTES = 8 * 1024 * 1024;
const ALLOWED_EXT = ["pdf", "jpg", "jpeg", "png", "xls", "xlsx", "dwg", "dxf"];

const PRODUCT_LABELS = {
  "titanium-sheet-coil": "Titanium plate / sheet",
  "titanium-bar-wire": "Titanium bar / rod",
  "titanium-tube": "Titanium tube / pipe",
  "titanium-fasteners": "Titanium fasteners",
  "titanium-forgings": "Titanium forgings",
  "titanium-machined-parts": "Machined titanium parts",
  "other-to-drawing": "Other / built to drawing",
};

const FIELD_LABELS = {
  company: "Company",
  name: "Contact person",
  email: "Email",
  country: "Country / region",
  product: "Product form",
  grade: "Grade",
  spec: "Size, quantity and tolerance",
  dest: "Destination & target lead time",
  message: "Service conditions & document requirements",
};

export async function onRequestPost(context) {
  const { request, env } = context;

  let form;
  try {
    form = await request.formData();
  } catch (e) {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  const get = (k) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  // 蜜罐：机器人填了就当作成功，静默丢弃
  if (get("website")) return json({ ok: true });

  // 时间戳：正常用户至少停留 2 秒、不超过 3 小时
  const now = Math.floor(Date.now() / 1000);
  const started = parseInt(get("start_ts"), 10);
  if (!started || now - started < 2 || now - started > 10800) {
    return json({ ok: false, error: "expired" }, 400);
  }

  if (get("consent") !== "1") return json({ ok: false, error: "consent" }, 400);

  const name = get("name").slice(0, 120);
  const email = get("email").slice(0, 200);
  const productKey = get("product");
  if (!name || !isEmail(email) || !productKey) {
    return json({ ok: false, error: "invalid_fields" }, 400);
  }

  const lang = (get("lang") || get("page_lang") || "en").slice(0, 5);
  const product = PRODUCT_LABELS[productKey] || productKey;

  // 附件
  const attachments = [];
  const file = form.get("drawing");
  if (file && typeof file === "object" && typeof file.arrayBuffer === "function" && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) return json({ ok: false, error: "file_too_large" }, 413);
    const fname = safeName(file.name || "drawing");
    const ext = (fname.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) return json({ ok: false, error: "file_type" }, 415);
    attachments.push({
      filename: fname,
      content: toBase64(await file.arrayBuffer()),
      content_type: file.type || "application/octet-stream",
    });
  }

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: "not_configured" }, 503);
  }

  const to = (env.INQUIRY_TO || "sales@alloyti.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = env.INQUIRY_FROM || "ALLOYTI Website <onboarding@resend.dev>";

  const rows = Object.keys(FIELD_LABELS)
    .map((k) => [FIELD_LABELS[k], k === "product" ? product : get(k)])
    .filter(([, v]) => v);
  rows.push(["Page language", lang]);
  rows.push(["Received", new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC"]);
  if (request.headers.get("CF-IPCountry")) rows.push(["Sender country (edge)", request.headers.get("CF-IPCountry")]);

  const subject = `Titanium enquiry — ${product} — ${name}` +
    (get("company") ? ` (${get("company")})` : "");

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    (attachments.length ? `\n\nAttachment: ${attachments[0].filename}` : "");

  const html = renderEmail(rows, email, attachments[0] && attachments[0].filename);

  const payload = {
    from,
    to,
    subject,
    reply_to: email,
    html,
    text,
  };
  if (attachments.length) payload.attachments = attachments;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("resend_failed", res.status, detail.slice(0, 500));
    return json({ ok: false, error: "send_failed" }, 502);
  }

  // 无 JS 的原生提交：给出可读的确认页
  if ((request.headers.get("Accept") || "").includes("text/html")) {
    return new Response(thanksPage(name), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  return json({ ok: true });
}

export async function onRequestGet() {
  return json({ ok: false, error: "method_not_allowed" }, 405);
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { Allow: "POST" } });
}

/* ---------- helpers ---------- */

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(s);
}

function safeName(n) {
  return n.replace(/[\\/\r\n"]/g, "_").slice(0, 120);
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

function renderEmail(rows, replyEmail, fileName) {
  const body = rows
    .map(
      ([k, v]) => `<tr>
  <td style="padding:8px 14px 8px 0;vertical-align:top;color:#5b7386;font:600 12px/1.5 Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap">${esc(k)}</td>
  <td style="padding:8px 0;vertical-align:top;color:#0d1b24;font:15px/1.6 Arial,sans-serif">${esc(v).replace(/\n/g, "<br>")}</td>
</tr>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#f2f5f7">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dfe7ec;border-radius:10px">
  <tr><td style="padding:22px 26px;border-bottom:1px solid #eef2f5">
    <div style="font:700 13px/1 Arial,sans-serif;letter-spacing:.22em;color:#0a6c7d">ALLOYTI</div>
    <div style="font:600 19px/1.4 Arial,sans-serif;color:#0d1b24;margin-top:8px">New website enquiry</div>
  </td></tr>
  <tr><td style="padding:10px 26px 4px">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${body}</table>
  </td></tr>
  <tr><td style="padding:14px 26px 24px">
    <div style="font:13px/1.6 Arial,sans-serif;color:#5b7386">Reply directly to this email — it goes to ${esc(replyEmail)}.</div>
    ${fileName ? `<div style="font:13px/1.6 Arial,sans-serif;color:#5b7386;margin-top:6px">Attachment: ${esc(fileName)}</div>` : ""}
  </td></tr>
</table>
</body></html>`;
}

function thanksPage(name) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Enquiry sent — ALLOYTI</title>
<style>body{margin:0;background:#04101b;color:#dbe9f2;font:16px/1.65 -apple-system,Segoe UI,Arial,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center}
.box{max-width:520px;padding:36px;border:1px solid rgba(0,229,255,.25);border-radius:12px;background:rgba(8,20,33,.7)}
h1{font-size:1.4rem;margin:0 0 12px;color:#fff}p{margin:0 0 16px;color:#9db4c4}
a{color:#37f4ff}</style></head>
<body><div class="box"><h1>Enquiry sent</h1>
<p>Thank you${name ? `, ${esc(name)}` : ""} — we have received your enquiry and will reply within one business day.</p>
<p><a href="/">Back to alloyti.com</a></p></div></body></html>`;
}
