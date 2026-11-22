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

  /* FAQ 知识库：本地即时回答，口径与后端 system prompt 一致。
     命中即答（零延迟、不消耗 AI 额度）；未命中才走 AI，再不行降级人工。
     kw = 跨语言关键词（小写子串），a = 六语答案。 */
  var KB = [
    {
      id: "manufacturer",
      kw: ["manufacturer", "are you a factory", "own factory", "factory direct", "factory", "工厂", "厂家", "制造商", "제조사", "공장", "생산", "производитель", "завод", "hersteller", "fabrik", "مصنع", "تصنعون"],
      a: {
        en: "ALLOYTI is an independent sourcing and export partner based in Baoji, working with partner mills — we are not the factory itself. We handle product selection, quality coordination and export delivery. Certifications belong to those mills, not to ALLOYTI, and availability is confirmed per order.",
        zh: "ALLOYTI 是位于宝鸡的独立采购与出口合作伙伴，与合作工厂协作——我们本身不是工厂。我们负责选品、质量协调和出口交付。认证属于合作工厂，不属于 ALLOYTI；供货按订单确认。",
        ko: "ALLOYTI는 바오지에 있는 독립 조달·수출 파트너로 협력 공장들과 함께 일합니다 — 공장 자체는 아닙니다. 제품 선정, 품질 조율 및 수출 배송을 담당합니다. 인증은 해당 공장에 속하며 ALLOYTI의 것이 아니고, 공급 여부는 주문별로 확인됩니다.",
        ar: "ALLOYTI شريك مستقل للتوريد والتصدير مقره باوجي، ويعمل مع مصانع شريكة — نحن لسنا المصنع نفسه. نتولى اختيار المنتجات وتنسيق الجودة والتسليم للتصدير. الشهادات تخص تلك المصانع وليس ALLOYTI، ويتم تأكيد التوفر لكل طلب.",
        ru: "ALLOYTI — независимый партнёр по закупкам и экспорту в Баоцзи, работающий с заводами-партнёрами; мы не являемся самим заводом. Мы занимаемся подбором продукции, координацией качества и экспортной доставкой. Сертификаты принадлежат тем заводам, а не ALLOYTI; наличие подтверждается по заказу.",
        de: "ALLOYTI ist ein unabhängiger Beschaffungs- und Exporthandler in Baoji und arbeitet mit Partnerwerken zusammen — wir sind nicht das Werk selbst. Wir übernehmen Produktauswahl, Qualitätskoordination und Exportlieferung. Zertifikate gehören diesen Werken, nicht ALLOYTI; die Verfügbarkeit wird pro Auftrag bestätigt."
      }
    },
    {
      id: "cert",
      kw: ["certificate", "certification", "certified", "iso 9001", "iso9001", "as9100", "ped", "认证", "证书", "인증", "인증서", "сертификат", "zertifikat", "zertifizierung", "شهادة", "شهادات", "اعتماد"],
      a: {
        en: "The mills we work with can provide ISO 9001, AS9100 and PED certification where applicable. These certificates belong to the partner mills, not to ALLOYTI. Tell us the standard you need and we'll confirm documentation per order.",
        zh: "我们合作的工厂可按需要提供 ISO 9001、AS9100 和 PED 认证。这些证书属于合作工厂，不属于 ALLOYTI。请告知所需标准，我们会按订单确认可供文件。",
        ko: "협력 공장은 해당되는 경우 ISO 9001, AS9100, PED 인증을 제공할 수 있습니다. 이 인증들은 협력 공장에 속하며 ALLOYTI의 것이 아닙니다. 필요한 표준을 알려주시면 주문별로 서류를 확인해 드립니다.",
        ar: "يمكن للمصانع التي نعمل معها توفير شهادات ISO 9001 وAS9100 وPED حسب الاقتضاء. هذه الشهادات تخص المصانع الشريكة وليس ALLOYTI. أخبرنا بالمعيار المطلوب وسنؤكد الوثائق لكل طلب.",
        ru: "Заводы-партнёры могут предоставить сертификаты ISO 9001, AS9100 и PED, где это применимо. Эти сертификаты принадлежат заводам, а не ALLOYTI. Сообщите нужный стандарт — мы подтвердим документы по заказу.",
        de: "Die Werke, mit denen wir zusammenarbeiten, können – wo zutreffend – ISO 9001-, AS9100- und PED-Zertifikate bereitstellen. Diese Zertifikate gehören den Partnerwerken, nicht ALLOYTI. Nennen Sie uns den gewünschten Standard – wir bestätigen die Dokumente pro Auftrag."
      }
    },
    {
      id: "moq",
      kw: ["moq", "minimum order", "min order", "起订量", "最小订购", "最低起订", "최소주문", "최소 주문", "минимальный заказ", "мин заказ", "mindestbestell", "الحد الأدنى للطلب", "الحد الادنى", "حد ادنى"],
      a: {
        en: "MOQ is 50 kg for stock items and 500 kg for custom / non-standard items (negotiable). Exact availability is confirmed per order — please send your grade, size and quantity for a quick check.",
        zh: "现货产品起订量为 50 kg；定制/非标产品为 500 kg，可协商。具体是否有货按订单确认——发来牌号、规格和数量即可快速核对。",
        ko: "재고 품목의 최소 주문량은 50kg이며, 맞춤/비표준 품목은 500kg입니다(협상 가능). 정확한 재고는 주문별로 확인됩니다. 등급, 규격, 수량을 보내주시면 빠르게 확인해 드립니다.",
        ar: "الحد الأدنى للطلب 50 كجم للمنتجات المتوفرة و500 كجم للمنتجات المخصصة/غير القياسية (قابل للتفاوض). يتم تأكيد التوفر لكل طلب على حدة — أرسل الدرجة والمواصفات والكمية للتحقق السريع.",
        ru: "Минимальный заказ: 50 кг для позиций в наличии и 500 кг для индивидуальных/нестандартных изделий (обсуждается). Наличие подтверждается по каждому заказу — пришлите марку, размер и количество.",
        de: "Die Mindestbestellmenge beträgt 50 kg für Lagervare und 500 kg für Sonder-/Nichtstandardware (verhandelbar). Die Verfügbarkeit wird pro Auftrag bestätigt — senden Sie Legierung, Abmessungen und Menge zur schnellen Prüfung."
      }
    },
    {
      id: "leadtime",
      kw: ["lead time", "leadtime", "delivery time", "delivery date", "shipping time", "how long", "交期", "交货期", "交付时间", "납기", "배송 기간", "срок поставки", "сроки", "lieferzeit", "مدة التسليم", "وقت التسليم"],
      a: {
        en: "Lead time is about 20 days for made-to-order items. Stock items can be faster — the exact schedule is confirmed per order. For a firm delivery date, please send your RFQ to sales@alloyti.com.",
        zh: "定制产品交期约 20 天；现货产品可能更快，确切交期按订单确认。如需确认排产，请把询价发到 sales@alloyti.com。",
        ko: "주문 제작 품목의 납기는 약 20일입니다. 재고 품목은 더 빠를 수 있으며 정확한 납기는 주문별로 확인됩니다. 일정을 확정하려면 sales@alloyti.com으로 문의해 주세요.",
        ar: "مدة التسليم حوالي 20 يوماً للمنتجات المصنعة حسب الطلب، وقد تكون المنتجات المتوفرة أسرع. يتم تأكيد المدة لكل طلب على حدة. للتأكد من الجدول أرسل طلب عرض السعر إلى sales@alloyti.com.",
        ru: "Срок поставки для изделий на заказ — около 20 дней; позиции в наличии могут быть быстрее. Точный срок подтверждается по заказу. Для точного графика отправьте запрос на sales@alloyti.com.",
        de: "Die Lieferzeit beträgt für Sonderanfertigungen etwa 20 Tage; Lagervare kann schneller sein. Die genaue Lieferzeit wird pro Auftrag bestätigt. Für einen verbindlichen Termin senden Sie Ihre Anfrage an sales@alloyti.com."
      }
    },
    {
      id: "quote",
      kw: ["quote", "quotation", "rfq", "price", "pricing", "cost", "报价", "价格", "价钱", "询价", "견적", "가격", "цена", "расчёт", "preis", "angebot", "سعر", "عرض سعر"],
      a: {
        en: "For a quote, please send the grade, product form, size, quantity and destination to sales@alloyti.com or WhatsApp +86 185 2328 3306. We'll come back with availability and terms within one business day.",
        zh: "询价请提供牌号、产品形态、规格、数量和目的地，发到 sales@alloyti.com 或 WhatsApp +86 185 2328 3306。我们会在一个工作日内回复可供情况和条款。",
        ko: "견적을 위해 등급, 제품 형태, 규격, 수량, 목적지를 sales@alloyti.com 또는 WhatsApp +86 185 2328 3306으로 보내주세요. 영업일 기준 1일 내에 공급 여부와 조건을 회신합니다.",
        ar: "للحصول على عرض سعر، أرسل الدرجة وشكل المنتج والمواصفات والكمية والوجهة إلى sales@alloyti.com أو واتساب +86 185 2328 3306. نرد خلال يوم عمل واحد بتأكيد التوفر والشروط.",
        ru: "Для расчёта отправьте марку, форму изделия, размеры, количество и пункт назначения на sales@alloyti.com или в WhatsApp +86 185 2328 3306. Мы ответим в течение одного рабочего дня.",
        de: "Für ein Angebot senden Sie bitte Legierung, Produktform, Abmessungen, Menge und Bestimmungsort an sales@alloyti.com oder WhatsApp +86 185 2328 3306. Wir melden uns innerhalb eines Werktags mit Verfügbarkeit und Konditionen."
      }
    },
    {
      id: "grades",
      kw: ["grade", "alloy", "材质", "牌号", "型号", "등급", "합금", "марка", "сплав", "legierung", "درجة", "درجات", "سبائك", "ti-6al", "ta1", "ta2", "tc4", "gr.5", "gr5"],
      a: {
        en: "We supply commercially pure titanium (Gr.1–Gr.4 / TA1, TA2) and alloys such as Gr.5 Ti-6Al-4V (TC4), TA15 and TC11, to ASTM/AMS/GB standards. Which grade and application do you need?",
        zh: "我们供应工业纯钛（Gr.1–Gr.4 / TA1、TA2）以及 Gr.5 Ti-6Al-4V（TC4）、TA15、TC11 等合金，符合 ASTM/AMS/GB 标准。您需要哪种牌号、用在什么场景？",
        ko: "상업용 순티타늄(Gr.1–Gr.4 / TA1, TA2)과 Gr.5 Ti-6Al-4V(TC4), TA15, TC11 등의 합금을 ASTM/AMS/GB 규격으로 공급합니다. 어떤 등급과 용도가 필요하신가요?",
        ar: "نورد التيتانيوم التجاري النقي (Gr.1–Gr.4 / TA1, TA2) وسبائك مثل Gr.5 Ti-6Al-4V (TC4) وTA15 وTC11 وفق معايير ASTM/AMS/GB. ما الدرجة والتطبيق المطلوب؟",
        ru: "Поставляем технически чистый титан (Gr.1–Gr.4 / TA1, TA2) и сплавы, например Gr.5 Ti-6Al-4V (TC4), TA15, TC11, по стандартам ASTM/AMS/GB. Какая марка и область применения вам нужны?",
        de: "Wir liefern handelsreines Titan (Gr.1–Gr.4 / TA1, TA2) sowie Legierungen wie Gr.5 Ti-6Al-4V (TC4), TA15 und TC11 nach ASTM/AMS/GB. Welche Legierung und Anwendung benötigen Sie?"
      }
    },
    {
      id: "products",
      kw: ["product", "supply", "产品线", "产品", "品类", "제품", "공급", "продукц", "поставля", "produkt", "liefern", "منتج", "منتجات", "نورد", "水杯", "保温杯", "cup", "bottle", "生活用品", "생활용품", "повседневн"],
      a: {
        en: "We cover six product lines: titanium plate/sheet & coil, bar/rod/wire, tube/pipe & fittings, fasteners, forgings, and titanium daily goods such as cups and bottles.",
        zh: "我们有六大产品线：钛板/板卷、钛棒/丝、钛管/管件、钛紧固件、钛锻件，以及钛制生活用品（如水杯、保温瓶）。",
        ko: "여섯 제품군을 다룹니다: 티타늄 판/코일, 봉/선재, 관/피팅, 체결부품, 단조품, 그리고 컵·병 등 티타늄 생활용품.",
        ar: "نغطي ستة خطوط إنتاج: ألواح/لفائف التيتانيوم، القضبان/الأسلاك، الأنابيب/التوصيلات، المثبتات، المطروقات، ومنتجات التيتانيوم اليومية مثل الأكواب والقوارير.",
        ru: "Мы работаем с шестью группами продукции: титановые листы/рулоны, прутки/проволока, трубы/фитинги, крепёж, поковки и титановые изделия повседневного назначения (стаканы, бутылки).",
        de: "Wir decken sechs Produktlinien ab: Titanplatten/-bleche & -coils, Stäbe/Drähte, Rohre/Formstücke, Verbindungselemente, Schmiedestücke sowie Titan-Alltagsprodukte wie Becher und Flaschen."
      }
    },
    {
      id: "payment",
      kw: ["payment", "pay terms", "付款", "支付方式", "结算", "결제", "지불", "оплат", "условия", "zahlung", "bedingungen", "دفع", "شروط الدفع"],
      a: {
        en: "Terms are FOB, CIF or EXW. Payment is 30% T/T deposit, with the balance of 70% before shipment or against a copy of the bill of lading.",
        zh: "贸易条款为 FOB、CIF 或 EXW。付款方式为 30% T/T 定金，余款 70% 发货前支付或见提单副本支付。",
        ko: "거래 조건은 FOB, CIF, EXW입니다. 결제는 30% T/T 선금 + 70% 선적 전 또는 선하증권 사본 확인 후 잔금입니다.",
        ar: "الشروط التجارية FOB أو CIF أو EXW. الدفع 30% تحويل مقدماً و70% قبل الشحن أو مقابل نسخة من بوليصة الشحن.",
        ru: "Условия: FOB, CIF или EXW. Оплата: 30% аванса T/T и 70% перед отгрузкой или против копии коносамента.",
        de: "Handelsbedingungen: FOB, CIF oder EXW. Zahlung: 30% T/T-Anzahlung, Rest 70% vor Verschiffung oder gegen Kopie des Frachtbriefs."
      }
    },
    {
      id: "contact",
      kw: ["contact", "email", "phone", "whatsapp", "address", "location", "联系", "联系方式", "邮箱", "电话", "地址", "연락", "이메일", "전화", "주소", "контакт", "почта", "телефон", "адрес", "kontakt", "e-mail", "telefon", "adresse", "اتصال", "بريد", "هاتف", "عنوان"],
      a: {
        en: "You can reach us at sales@alloyti.com or WhatsApp / phone +86 185 2328 3306. Our office is on High-tech Avenue, Baoji, Shaanxi, China.",
        zh: "可以通过 sales@alloyti.com 或 WhatsApp/电话 +86 185 2328 3306 联系我们。办公室位于中国陕西省宝鸡市高新大道。",
        ko: "sales@alloyti.com 또는 WhatsApp/전화 +86 185 2328 3306으로 연락해 주세요. 사무실은 중국 산시성 바오지 하이테크 대로에 있습니다.",
        ar: "يمكنك التواصل معنا على sales@alloyti.com أو واتساب/هاتف +86 185 2328 3306. مكتبنا في شارع التقنية العالية، باوجي، شنشي، الصين.",
        ru: "Наши контакты: sales@alloyti.com, WhatsApp/телефон +86 185 2328 3306. Офис: проспект Хайтек, Баоцзи, провинция Шэньси, Китай.",
        de: "Sie erreichen uns unter sales@alloyti.com oder WhatsApp/Telefon +86 185 2328 3306. Unser Büro liegt an der High-tech Avenue, Baoji, Shaanxi, China."
      }
    },
    {
      id: "sample",
      kw: ["sample", "样品", "试样", "샘플", "образец", "muster", "عينة"],
      a: {
        en: "Sample policy depends on the item and is confirmed per order. Please tell us the grade, size and quantity you need and the sales team will confirm the options.",
        zh: "样品政策视产品而定，按订单确认。请告知所需牌号、规格和数量，销售团队会确认可行的方案。",
        ko: "샘플 정책은 제품에 따라 다르며 주문별로 확인됩니다. 필요한 등급, 규격, 수량을 알려주시면 영업팀에서 옵션을 확인해 드립니다.",
        ar: "تختلف سياسة العينات حسب المنتج ويتم تأكيدها لكل طلب. أخبرنا بالدرجة والمواصفات والكمية ليؤكد فريق المبيعات الخيارات المتاحة.",
        ru: "Условия по образцам зависят от изделия и подтверждаются по заказу. Сообщите марку, размеры и количество — отдел продаж уточнит варианты.",
        de: "Die Musterregelung hängt vom Artikel ab und wird pro Auftrag bestätigt. Bitte nennen Sie Legierung, Abmessungen und Menge – unser Vertrieb klärt die Optionen."
      }
    }
  ];

  function matchKB(text) {
    var s = String(text || "").toLowerCase().replace(/\s+/g, " ");
    var hits = [];
    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].kw.length; j++) {
        if (s.indexOf(KB[i].kw[j]) > -1) { hits.push(KB[i].id); break; }
      }
      if (hits.length >= 2) break;
    }
    return hits;
  }

  function kbText(ids) {
    var out = [];
    ids.forEach(function (id) {
      var item = null;
      for (var i = 0; i < KB.length; i++) { if (KB[i].id === id) { item = KB[i]; break; } }
      if (item) out.push(item.a[lang] || item.a.en);
    });
    return out.join("\n\n");
  }

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
    addMsg(text, "me");
    input.value = "";

    // 1) 本地 FAQ 命中：即时回答，零延迟、零额度消耗、口径可控
    var hits = matchKB(text);
    if (hits.length) {
      var answer = kbText(hits);
      addMsg(answer, "bot");
      history.push({ role: "user", content: text.slice(0, 500) });
      history.push({ role: "assistant", content: answer.slice(0, 500) });
      if (history.length > 8) history = history.slice(-8);
      return;
    }

    // 2) 已降级且 FAQ 未命中：给人工渠道
    if (degraded) { addMsg(t.fallback, "bot"); addLinks(); return; }

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
        // 后端合规自检拦截：用预置合规答案替换，不把违规内容交给用户
        if (d.error === "noncompliant") {
          addMsg(kbText(["manufacturer"]), "bot");
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
