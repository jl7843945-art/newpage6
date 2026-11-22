/* ALLOYTI AI chat widget — self-contained, no external CSS/JS dependency. */
(function () {
  "use strict";
  if (window.__alloytiChatLoaded) return;
  window.__alloytiChatLoaded = true;

  var LANGS = ["zh", "en", "ko", "ar", "ru", "de"];
  var lang = document.documentElement.getAttribute("data-static-lang");
  if (LANGS.indexOf(lang) < 0) lang = "en";
  var isRTL = lang === "ar";

  var T = {
    en: {
      label: "Open AI chat", title: "Ask ALLOYTI", status: "Typically replies instantly",
      welcome: "Hi! I'm the ALLOYTI assistant. Ask me about titanium grades, specs, MOQ, lead time or certifications.",
      quick: ["MOQ & lead time?", "Which grades?", "Are you a manufacturer?", "How do I get a quote?"],
      placeholder: "Type your question...", send: "Send", close: "Close chat",
      fallback: "The AI assistant is not available right now. Please reach our sales team directly — we reply within one business day.",
      wa: "Chat on WhatsApp", mail: "Email sales", retry: "Retry",
      err: "Connection error. Please try again or contact us on WhatsApp.", typing: "Assistant is typing"
    },
    zh: {
      label: "打开 AI 客服", title: "咨询 ALLOYTI", status: "通常即时回复",
      welcome: "您好！我是 ALLOYTI 客服助手。可以问我钛合金牌号、规格、起订量、交期或认证等问题。",
      quick: ["起订量和交期？", "有哪些牌号？", "你们是工厂吗？", "如何获取报价？"],
      placeholder: "输入您的问题…", send: "发送", close: "关闭聊天",
      fallback: "AI 助手暂时不可用。请直接联系我们的销售团队——我们会在一个工作日内回复。",
      wa: "WhatsApp 咨询", mail: "发邮件", retry: "重试",
      err: "连接出错，请重试或通过 WhatsApp 联系我们。", typing: "助手正在输入"
    },
    ko: {
      label: "AI 채팅 열기", title: "ALLOYTI 문의", status: "보통 즉시 답변",
      welcome: "안녕하세요! ALLOYTI 어시스턴트입니다. 티타늄 등급, 사양, 최소 주문량, 납기 또는 인증에 대해 물어보세요.",
      quick: ["최소 주문량과 납기는?", "어떤 등급이 있나요?", "제조사인가요?", "견적은 어떻게 받나요?"],
      placeholder: "질문을 입력하세요...", send: "보내기", close: "채팅 닫기",
      fallback: "AI 어시스턴트를 현재 사용할 수 없습니다. 영업팀에 직접 문의해 주세요 — 영업일 기준 1일 내 답변드립니다.",
      wa: "WhatsApp 상담", mail: "이메일 보내기", retry: "다시 시도",
      err: "연결 오류입니다. 다시 시도하거나 WhatsApp으로 문의해 주세요.", typing: "답변 작성 중"
    },
    ar: {
      label: "فتح محادثة الذكاء الاصطناعي", title: "اسأل ALLOYTI", status: "الرد عادةً فوري",
      welcome: "مرحباً! أنا مساعد ALLOYTI. اسألني عن درجات التيتانيوم والمواصفات والحد الأدنى للطلب ومدة التسليم أو الشهادات.",
      quick: ["الحد الأدنى للطلب والتسليم؟", "ما الدرجات المتوفرة؟", "هل أنتم مصنع؟", "كيف أحصل على عرض سعر؟"],
      placeholder: "اكتب سؤالك...", send: "إرسال", close: "إغلاق المحادثة",
      fallback: "مساعد الذكاء الاصطناعي غير متاح حالياً. يرجى التواصل مع فريق المبيعات مباشرة — نرد خلال يوم عمل واحد.",
      wa: "الدردشة على واتساب", mail: "راسلنا بالبريد", retry: "إعادة المحاولة",
      err: "خطأ في الاتصال. يرجى المحاولة مجدداً أو التواصل عبر واتساب.", typing: "المساعد يكتب"
    },
    ru: {
      label: "Открыть чат с ИИ", title: "Спросить ALLOYTI", status: "Отвечаем обычно сразу",
      welcome: "Здравствуйте! Я помощник ALLOYTI. Спросите о марках титана, спецификациях, минимальном заказе, сроках поставки или сертификатах.",
      quick: ["Минимальный заказ и сроки?", "Какие марки есть?", "Вы производитель?", "Как получить коммерческое предложение?"],
      placeholder: "Введите ваш вопрос...", send: "Отправить", close: "Закрыть чат",
      fallback: "ИИ-помощник сейчас недоступен. Пожалуйста, свяжитесь с отделом продаж напрямую — мы отвечаем в течение одного рабочего дня.",
      wa: "Написать в WhatsApp", mail: "Написать на почту", retry: "Повторить",
      err: "Ошибка соединения. Попробуйте ещё раз или напишите в WhatsApp.", typing: "Помощник печатает"
    },
    de: {
      label: "KI-Chat öffnen", title: "ALLOYTI fragen", status: "Antwort meist sofort",
      welcome: "Hallo! Ich bin der ALLOYTI-Assistent. Fragen Sie nach Titanlegierungen, Spezifikationen, Mindestbestellmenge, Lieferzeit oder Zertifizierungen.",
      quick: ["MOQ & Lieferzeit?", "Welche Legierungen?", "Sind Sie ein Hersteller?", "Wie erhalte ich ein Angebot?"],
      placeholder: "Schreiben Sie Ihre Frage...", send: "Senden", close: "Chat schließen",
      fallback: "Der KI-Assistent ist gerade nicht verfügbar. Bitte kontaktieren Sie unser Vertriebsteam direkt — wir antworten innerhalb eines Werktags.",
      wa: "Auf WhatsApp chatten", mail: "E-Mail senden", retry: "Erneut versuchen",
      err: "Verbindungsfehler. Bitte versuchen Sie es erneut oder kontaktieren Sie uns über WhatsApp.", typing: "Assistent schreibt"
    }
  };

  var t = T[lang] || T.en;
  var WA = "https://wa.me/8618523283306";
  var MAIL = "mailto:sales@alloyti.com";

  function css() {
    return [
      "#acChat{position:fixed;z-index:70;display:flex;flex-direction:column;align-items:flex-end;font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#0d1b24}",
      "#acChat.ac-rtl{align-items:flex-start}",
      "#acFab{width:54px;height:54px;border-radius:50%;border:0;cursor:pointer;background:#0a6c7d;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 22px rgba(6,20,42,.28);transition:transform .18s ease,box-shadow .18s ease}",
      "#acFab:hover{transform:translateY(-2px);box-shadow:0 12px 26px rgba(6,20,42,.34)}",
      "#acFab svg{width:27px;height:27px;fill:none;stroke:#fff;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}",
      "#acFab .ac-badge{position:absolute;top:0;right:0;width:14px;height:14px;background:#25d366;border:2px solid #fff;border-radius:50%}",
      "#acPanel{width:360px;max-width:calc(100vw - 28px);height:470px;max-height:calc(100vh - 120px);background:#fff;border:1px solid #dfe7ec;border-radius:14px;box-shadow:0 18px 50px rgba(6,20,42,.22);display:none;flex-direction:column;overflow:hidden;margin-bottom:14px}",
      "#acPanel.ac-open{display:flex}",
      "#acHead{background:#0a6c7d;color:#fff;padding:14px 16px;display:flex;align-items:center;gap:11px;flex:0 0 auto}",
      "#acHead .ac-ic{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;font-weight:700;letter-spacing:.04em;font-size:12px;flex:0 0 auto}",
      "#acHead .ac-tt{flex:1;min-width:0}",
      "#acHead .ac-name{font-weight:700;font-size:15px;line-height:1.2}",
      "#acHead .ac-sub{font-size:11.5px;opacity:.86;margin-top:2px}",
      "#acClose{border:0;background:transparent;color:#fff;cursor:pointer;padding:5px;line-height:0;border-radius:6px}",
      "#acClose:hover{background:rgba(255,255,255,.16)}",
      "#acBody{flex:1;overflow-y:auto;padding:14px 14px 6px;background:#f7fafb;overscroll-behavior:contain}",
      ".ac-msg{max-width:86%;padding:9px 12px;border-radius:12px;margin-bottom:9px;white-space:pre-wrap;word-wrap:break-word;font-size:13.5px;box-shadow:0 1px 2px rgba(6,20,42,.05)}",
      ".ac-msg.ac-bot{background:#fff;border:1px solid #e6edf1;border-bottom-left-radius:3px}",
      ".ac-msg.ac-me{background:#e3f2f4;border:1px solid #cfe6ea;border-bottom-right-radius:3px;margin-left:auto}",
      ".ac-rtl .ac-msg.ac-bot{border-bottom-left-radius:12px;border-bottom-right-radius:3px}",
      ".ac-rtl .ac-msg.ac-me{margin-left:0;margin-right:auto;border-bottom-right-radius:12px;border-bottom-left-radius:3px}",
      ".ac-quick{display:flex;flex-wrap:wrap;gap:6px;margin:2px 0 10px}",
      ".ac-quick button{border:1px solid #bcd9de;background:#fff;color:#0a6c7d;border-radius:999px;padding:6px 10px;font-size:12px;cursor:pointer}",
      ".ac-quick button:hover{background:#eaf5f6}",
      ".ac-typing{display:inline-flex;gap:4px;align-items:center;height:16px}",
      ".ac-typing i{width:6px;height:6px;border-radius:50%;background:#7aa7ae;animation:acBlink 1.1s infinite ease-in-out}",
      ".ac-typing i:nth-child(2){animation-delay:.18s}.ac-typing i:nth-child(3){animation-delay:.36s}",
      "@keyframes acBlink{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}",
      ".ac-links{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}",
      ".ac-links a{display:inline-block;padding:8px 12px;border-radius:8px;font-size:12.5px;font-weight:600;text-decoration:none}",
      ".ac-links .ac-wa{background:#25d366;color:#fff}",
      ".ac-links .ac-mail{background:#0a6c7d;color:#fff}",
      "#acFoot{border-top:1px solid #e6edf1;padding:10px;background:#fff;flex:0 0 auto}",
      "#acForm{display:flex;gap:8px;align-items:center}",
      "#acInput{flex:1;min-width:0;border:1px solid #d4e0e6;border-radius:9px;padding:10px 11px;font:inherit;font-size:13.5px;outline:none;background:#fff;color:#0d1b24}",
      "#acInput:focus{border-color:#0a6c7d;box-shadow:0 0 0 3px rgba(10,108,125,.12)}",
      "#acSend{border:0;background:#0a6c7d;color:#fff;border-radius:9px;padding:10px 14px;font:inherit;font-weight:600;cursor:pointer;flex:0 0 auto}",
      "#acSend:disabled{opacity:.55;cursor:default}",
      "#acFoot .ac-legal{font-size:10.5px;color:#7d909c;margin:7px 2px 0;line-height:1.4}",
      ".ac-rtl #acInput,.ac-rtl #acSend{text-align:right}",
      "@media(max-width:640px){#acChat{bottom:12px;right:12px}.ac-rtl#acChat{right:auto;left:12px}#acPanel{height:430px;max-height:calc(100vh - 96px)}}",
      "@media print{#acChat{display:none}}"
    ].join("\n");
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var host = el("div", isRTL ? "ac-rtl" : "");
  host.id = "acChat";
  var style = document.createElement("style");
  style.textContent = css();
  host.appendChild(style);

  var panel = el("div", "");
  panel.id = "acPanel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", t.title);

  var head = el("div", "");
  head.id = "acHead";
  var ico = el("div", "ac-ic", "AT");
  var tt = el("div", "ac-tt");
  tt.appendChild(el("div", "ac-name", t.title));
  tt.appendChild(el("div", "ac-sub", t.status));
  var close = el("button", "", "\u00d7");
  close.id = "acClose";
  close.setAttribute("aria-label", t.close);
  head.appendChild(ico); head.appendChild(tt); head.appendChild(close);

  var body = el("div", "");
  body.id = "acBody";
  var foot = el("div", "");
  foot.id = "acFoot";
  var form = el("form", "");
  form.id = "acForm";
  var input = el("input", "");
  input.id = "acInput";
  input.type = "text";
  input.setAttribute("placeholder", t.placeholder);
  input.setAttribute("aria-label", t.placeholder);
  input.autocomplete = "off";
  var send = el("button", "ac-send", t.send);
  send.id = "acSend";
  send.type = "submit";
  form.appendChild(input); form.appendChild(send);
  foot.appendChild(form);
  foot.appendChild(el("div", "ac-legal", "ALLOYTI \u2014 sourcing partner. Availability confirmed per order."));

  panel.appendChild(head); panel.appendChild(body); panel.appendChild(foot);

  var fab = el("button", "");
  fab.id = "acFab";
  fab.setAttribute("aria-label", t.label);
  fab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l1.9-5.2A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 10.5h7M8.5 13.5h4.5"/></svg>';

  host.appendChild(panel);
  host.appendChild(fab);
  document.body.appendChild(host);

  // 位置：WhatsApp 浮按钮上方，避免重叠
  function place() {
    var small = window.innerWidth <= 640;
    var bottom = small ? 74 : 84;
    host.style.bottom = bottom + "px";
    if (isRTL) { host.style.left = small ? "14px" : "18px"; host.style.right = "auto"; }
    else { host.style.right = small ? "14px" : "18px"; host.style.left = "auto"; }
  }
  place();
  window.addEventListener("resize", place);

  var history = [];
  var busy = false;
  var degraded = false;

  function addMsg(text, who) {
    var m = el("div", "ac-msg " + (who === "me" ? "ac-me" : "ac-bot"), text);
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  }

  function addLinks() {
    var wrap = el("div", "ac-links");
    var a = el("a", "ac-wa", t.wa);
    a.href = WA; a.target = "_blank"; a.rel = "noopener noreferrer";
    var b = el("a", "ac-mail", t.mail);
    b.href = MAIL;
    wrap.appendChild(a); wrap.appendChild(b);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function showQuick() {
    var q = el("div", "ac-quick");
    t.quick.forEach(function (label) {
      var b = el("button", "", label);
      b.type = "button";
      b.addEventListener("click", function () { ask(label); });
      q.appendChild(b);
    });
    body.appendChild(q);
    body.scrollTop = body.scrollHeight;
  }

  function setSending(on) {
    busy = on;
    send.disabled = on;
    input.disabled = on;
  }

  function ask(text) {
    text = String(text || "").trim();
    if (!text || busy) return;
    if (degraded) { addMsg(text, "me"); input.value = ""; return; }
    addMsg(text, "me");
    input.value = "";
    history.push({ role: "user", content: text.slice(0, 500) });
    if (history.length > 8) history = history.slice(-8);
    setSending(true);
    var typing = el("div", "ac-msg ac-bot");
    typing.innerHTML = '<span class="ac-typing" aria-label="' + t.typing + '"><i></i><i></i><i></i></span>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    var ctl = (typeof AbortController !== "undefined") ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 30000);

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history, lang: lang }),
      signal: ctl ? ctl.signal : undefined
    })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: "bad_response" }; }).then(function (d) { return { status: r.status, data: d }; }); })
      .then(function (res) {
        clearTimeout(timer);
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        var d = res.data || {};
        if (res.status === 503 && d.error === "not_configured") {
          degraded = true;
          addMsg(t.fallback, "bot");
          addLinks();
          return;
        }
        if (d.ok && d.reply) {
          addMsg(d.reply, "bot");
          history.push({ role: "assistant", content: d.reply });
          if (history.length > 8) history = history.slice(-8);
          return;
        }
        degraded = true;
        addMsg(t.err, "bot");
        addLinks();
      })
      .catch(function () {
        clearTimeout(timer);
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        degraded = true;
        addMsg(t.err, "bot");
        addLinks();
      })
      .then(function () { setSending(false); });
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
  close.addEventListener("click", function () {
    panel.classList.remove("ac-open");
    fab.setAttribute("aria-label", t.label);
  });
  fab.addEventListener("click", function () {
    var open = panel.classList.toggle("ac-open");
    if (open) { input.focus(); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("ac-open")) panel.classList.remove("ac-open");
  });

  addMsg(t.welcome, "bot");
  showQuick();
})();
