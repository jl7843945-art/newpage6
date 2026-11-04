/* =========================================================
   ALLOYTI — 交互逻辑（多语言版）
   5 语种：zh / en / ar(RTL) / ru / de
   产品/应用/消费类/流程数据渲染 + 弹窗 + 移动端菜单 + 滚动揭示 + 语言切换
   数据为示例占位，请按实际业务替换；图片素材上线前请替换为自有授权素材。
   ========================================================= */
(function () {
  "use strict";

  /* ================= 语言 ================= */
  const LANGS = ["zh", "en", "ar", "ru", "de"];
  let lang = "en";
  try {
    const saved = localStorage.getItem("ts-lang");
    if (saved && LANGS.includes(saved)) lang = saved;
  } catch (e) { /* ignore */ }
  try {
    // ?lang=xx 优先于 localStorage：可分享指定语言的链接
    const q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.includes(q)) lang = q;
  } catch (e) { /* ignore */ }

  /* ================= 多语言词典 ================= */
  const I18N = {
    zh: {
      meta: { title: "ALLOYTI｜钛及钛合金采购、供应与技术支持", desc: "ALLOYTI 专注钛及钛合金的采购、供应与技术支持，供应钛板、钛棒、钛管、钛锻件及钛加工件，覆盖 TA1、TC4、TA15 等牌号，符合 ASTM、GB、AMS 标准，支持定制加工与出口交付。" },
      ui: { skip: "跳到主要内容", navAria: "主导航", openNav: "打开导航", brandTag: "钛材供应 · TITANIUM", slogan: "以钛为材，以技为芯", closeDialog: "关闭产品详情", metricsAria: "企业能力数据", langLabel: "切换语言", viewMore: "查看详情", backTop: "返回顶部 ↑", bottomTag: "TITANIUM · ASTM / DIN / ISO · 按订单确认", dialogContact: "整理产品需求", footTitle: "把材料要求，落实到每一次交付。", footLink: "查看质量与服务" },
      nav: { home: "首页", products: "产品中心", showcase: "合作工厂", quality: "质量与服务", about: "关于我们", faq: "常见问题", contact: "联系我们" },
      hero: { h1a: "钛合金：性能、牌号与应用", h1b: "", intro: "钛合金以约 4.5 g/cm³ 的低密度与高比强度著称，兼具优异的耐腐蚀性、耐热性与生物相容性，是航空航天、海洋工程、医疗与新能源领域的关键结构材料。ALLOYTI 供应 TA1/TA2 工业纯钛及 TC4（Ti-6Al-4V）、TA15、TC11 等牌号的板材、棒材、管材、锻件与紧固件，符合 ASTM、GB、AMS 标准，支持定制加工与出口交付。", btn1: "浏览产品中心", btn2: "获取询价支持", nodes: ["牌号", "ASTM", "ISO", "DIN"], metrics: ["大产品分类", "种常用钛牌号", "类执行标准体系", "小时询价响应"] },
      products: { title: "五大产品分类", intro: "五个重点产品分类覆盖常见工业采购需求。点击产品卡片可查看牌号、执行标准与供应形态说明。", items: {
        sheet: { title: "钛板 / 钛卷", en: "TITANIUM SHEET & PLATE", desc: "用于化工设备、换热器、海洋工程及一般工业。厚度、宽度、长度与表面处理按订单确认。" },
        bar: { title: "钛棒 / 钛丝", en: "TITANIUM BAR & ROD", desc: "圆棒与定尺料，用于机加工零件、紧固件坯料及耐蚀部件。尺寸与公差在供货前确认。" },
        tube: { title: "钛管 / 钛管件", en: "TITANIUM TUBE & PIPE", desc: "用于换热、流体输送及腐蚀工况——无缝或焊接钛管，壁厚与所需检验按询价确认。" },
        fasteners: { title: "钛材紧固件", en: "TITANIUM FASTENERS", desc: "用于轻量化与耐蚀连接。螺栓、螺母、螺钉及垫圈等可按 DIN、ISO 或 ASME 要求指定头部形式、螺纹与长度。" },
        forgings: { title: "钛锻件 / 加工件", en: "TITANIUM FORGINGS", desc: "钛饼、钛环、方块及按图纸加工的零件，用于航空结构、能源装备与耐蚀承压部件。外形尺寸、热处理状态与检测要求在订单前逐项确认。" }
      } },
      specLabels: { grade: "常用牌号", standard: "执行标准", form: "供应形态", use: "典型应用" },
      promise: { titleA: "从材料确认到出货文件，", titleB: "每一步", titleC: "都清晰可核对。", p1: "我们从牌号、规格和执行标准开始确认，并将检测资料与订单逐项对应，让跨境采购过程更清楚、更容易跟进。", p2: "基于实际可确认的供应方案、明确的文件要求和及时沟通，为客户提供持续的工业材料采购支持。", link: "了解订单服务" },
      showcase: { title: "合作工厂实拍", intro: "从校直、车削到检测与仓储，记录钛材加工与交付各环节的真实现场。", note: "以上图片为我们合作的工厂与仓储现场实拍。", items: {
        straighten: { title: "管棒校直", desc: "校直设备现场作业，保证棒材与管材直线度符合交付公差。" },
        discs: { title: "饼环件库房", desc: "钛饼、钛环批量仓储，规格齐全、库存可查。" },
        inspect: { title: "尺寸检测", desc: "管棒逐支测量直径与公差，出货前逐项核对。" },
        lathe: { title: "车削加工", desc: "按图纸车加工棒材与锻件，表面光洁度与公差可控。" },
        heat: { title: "热处理设备", desc: "加热与处理产线，保障材料组织与性能状态。" }
      } },
      about: { title: "专注钛及钛合金的<br>采购、供应与技术支持。", p: "在航空航天、海洋工程、医疗与新能源领域，钛合金集强度、耐蚀、轻量化与生物相容性于一身。ALLOYTI 专注钛及钛合金的采购、供应与技术支持，覆盖 TA1、TC4、TA15 等主流牌号，提供板材、棒材、管材及精密锻件一站式解决方案，符合 ASTM、GB、AMS 等国内外标准。产品远销北美、欧洲、中东及东南亚。我们不只供材料，更提供选型建议、工艺支持与快速响应。", link: "启动一次项目沟通", points: [
        { t: "按订单确认规格", d: "牌号、标准、尺寸与文件要求在订单前逐项确认。" },
        { t: "材质证书可约定", d: "可按需约定 EN 10204 材质证书与必要的第三方检验。" },
        { t: "跨境文件支持", d: "协助梳理装箱单、单证与目的地合规所需材料。" },
        { t: "保密与及时沟通", d: "项目资料按需保密，关键节点主动同步进度。" }
      ] },
      quality: { title: "从需求确认，<br>到交付跟进。", p: "围绕牌号、规格、标准及文件要求进行确认，并协调供应方、检验机构、包装与物流信息，按订单约定核对交付内容。", link: "咨询订单服务", steps: [
        { t: "需求确认", d: "核对牌号、标准、规格、数量、工况与目标交期。" },
        { t: "供应核实", d: "与供应方确认可得性、供货状态与特殊要求。" },
        { t: "文件与检验", d: "提前约定材质证书与必要的第三方检验。" },
        { t: "交付跟进", d: "跟踪包装、标识、单证与发运节点。" }
      ] },
      checklist: { title: "询价信息越完整，<br>对接越准确。", p: "以下信息有助于我们更快给出可确认的供应与文件方案。检验与文件范围以双方确认的订单为准。", items: ["产品与牌号、执行标准", "规格、数量及图纸（如有）", "介质、温度、压力等工况条件", "表面、长度、尺寸公差与包装", "供应商出具的材质证书与所需试验", "目的地、目标交期与贸易单证"] },
      contact: { title: "有项目需求？<br>从规格开始沟通。", intro: "不必等全部信息齐备。告诉我们产品形态、牌号、规格及交付目的地，我们会先梳理需要确认的问题。", cardLabel: "询价建议包含", cardItems: ["产品与牌号、执行标准", "规格、数量及图纸（如有）", "文件要求、目的地和目标交期"], small: "具体供应与文件范围以双方确认为准" },
form: { title: "发送询价需求", note: "先填写带 * 的必填项即可，我们会据此梳理需要进一步确认的问题。", company: "公司名称", name: "联系人 *", email: "电子邮箱 *", country: "国家 / 地区", product: "产品形态 *", grade: "牌号", spec: "规格、数量与尺寸公差", dest: "目的地与目标交期", message: "工况、文件要求及补充说明", file: "图纸附件（可选，≤5MB）", consent: "我同意 ALLOYTI 处理上述联系信息，用于回复本次询盘。", submit: "发送询盘", privacy: "所填信息仅用于本次询盘沟通，不用于其他用途。", productOptions: ["钛板 / 钛卷", "钛棒 / 钛丝", "钛管 / 钛管件", "钛材紧固件", "钛锻件", "钛加工件", "其他 / 来图定制"] },
            footer: { brandDesc: "专注钛及钛合金采购、供应与技术支持——板材、棒材、管材及精密锻件一站式供应，符合 ASTM、GB、AMS 标准，远销北美、欧洲、中东及东南亚。", colProducts: "产品", colAbout: "关于", colContact: "联系" }
    },

    en: {
      meta: { title: "Titanium Supply Partner & Supplier — Plate, Bar, Tube | ALLOYTI", desc: "ALLOYTI supplies titanium plate, bar, tube, fasteners and precision forgings in TA1, TC4 (Gr.5) and TA15 — to ASTM, GB and AMS standards, sourced from audited mills." },
      ui: { skip: "Skip to main content", navAria: "Main navigation", openNav: "Open navigation", brandTag: "TITANIUM SUPPLY", slogan: "Built on Titanium. Driven by Technology.", closeDialog: "Close product details", metricsAria: "Company capability figures", langLabel: "Switch language", viewMore: "View details", backTop: "Back to top ↑", bottomTag: "TITANIUM · ASTM / DIN / ISO · Confirmed per order", dialogContact: "Outline your requirement", footTitle: "Turning material requirements into every delivery.", footLink: "See Quality & Service" },
      nav: { home: "Home", products: "Products", showcase: "Sourcing", quality: "Quality & Service", about: "About", faq: "FAQ", contact: "Contact" },
      hero: { h1a: "Titanium Alloys: Properties, Grades & Applications", h1b: "", intro: "Titanium alloys combine low density (about 4.5 g/cm³) with high specific strength, excellent corrosion and heat resistance, and biocompatibility — key structural materials for aerospace, marine engineering, medical and new-energy applications. ALLOYTI supplies commercially pure titanium TA1/TA2 and alloys such as TC4 (Ti-6Al-4V), TA15 and TC11 in plate, bar, tube, forgings and fasteners, to ASTM, GB and AMS standards, with made-to-order processing and export delivery.", btn1: "Browse Titanium Products", btn2: "Request a Quotation", nodes: ["Grade", "ASTM", "ISO", "DIN"], metrics: ["Product categories", "Titanium grades", "Standard systems", "h quotation response"] },
      products: { title: "Five Product Categories", intro: "Five key categories covering common industrial sourcing needs. Click a product card to view grades, standards and supply forms.", items: {
        sheet: { title: "Titanium Sheet & Plate", en: "TITANIUM SHEET & PLATE", desc: "For chemical equipment, heat exchangers, marine and general industry. Thickness, width, length and surface finish confirmed per order." },
        bar: { title: "Titanium Bar & Rod", en: "TITANIUM BAR & ROD", desc: "Round bar and cut lengths for machined parts, fastener blanks and corrosion-resistant components. Dimensions and tolerances confirmed before supply." },
        tube: { title: "Titanium Tube & Pipe", en: "TITANIUM TUBE & PIPE", desc: "For heat exchange, fluid transport and corrosive service — seamless or welded tube, wall thickness and inspection confirmed per inquiry." },
        fasteners: { title: "Titanium Fasteners", en: "TITANIUM FASTENERS", desc: "For lightweight, corrosion-resistant joints. Bolts, nuts, screws and washers with head style, thread and length per DIN, ISO or ASME." },
        forgings: { title: "Titanium Forgings & Machined Parts", en: "TITANIUM FORGINGS", desc: "Forged discs, rings, blocks and parts machined to drawing for aerospace structures, energy equipment and corrosion-resistant pressure parts. Dimensions, heat-treatment condition and inspection are confirmed before order." }
      } },
      specLabels: { grade: "Common grades", standard: "Standards", form: "Supply forms", use: "Typical uses" },
      promise: { titleA: "From material confirmation to shipping documents, ", titleB: "every step", titleC: " is verifiable.", p1: "We start from grade, dimensions and applicable standards, matching test records item by item with your order — making cross-border purchasing clearer and easier to follow.", p2: "With supply options you can actually confirm, clear document requirements and timely communication, we provide ongoing industrial material sourcing support.", link: "About our order service" },
      showcase: { title: "Partner Mills We Work With", intro: "From straightening and turning to inspection and warehousing — real shots of each stage of titanium processing and delivery.", note: "Photos above are taken at the mills and warehouses we work with.", items: {
        straighten: { title: "Bar & Tube Straightening", desc: "Straightening line keeps straightness within delivery tolerances." },
        discs: { title: "Disc & Ring Inventory", desc: "Bulk storage of titanium discs and rings — wide size range, stock available." },
        inspect: { title: "Dimensional Inspection", desc: "Each bar and tube measured for diameter and tolerance before shipment." },
        lathe: { title: "Turning & Machining", desc: "Lathe machining of bars and forgings to drawing, with controlled finish and tolerance." },
        heat: { title: "Heat Treatment", desc: "Heating and treatment lines ensure the required microstructure and delivery condition." }
      } },
      about: { title: "Titanium &amp; titanium alloys:<br>sourcing, supply and technical support.", p: "Across aerospace, marine engineering, medical and new-energy applications, titanium alloys combine strength, corrosion resistance, light weight and biocompatibility. ALLOYTI focuses on the sourcing, supply and technical support of titanium and titanium alloys, covering mainstream grades such as TA1, TC4 and TA15, and delivers one-stop solutions in plate, bar, tube and precision forgings to ASTM, GB and AMS standards. Our products are exported to North America, Europe, the Middle East and Southeast Asia. We supply more than material — we provide grade selection advice, process support and fast response.", link: "Start a project conversation", points: [
        { t: "Specs confirmed per order", d: "Grades, standards, dimensions and document needs are confirmed item by item before ordering." },
        { t: "Mill certificates on request", d: "EN 10204 certificates and third-party inspection can be arranged as needed." },
        { t: "Cross-border document support", d: "Support for packing lists, shipping documents and destination compliance." },
        { t: "Confidential & responsive", d: "Project information kept confidential, with proactive updates at key milestones." }
      ] },
      quality: { title: "From requirement confirmation<br>to delivery follow-up.", p: "We confirm grades, dimensions, standards and document requirements, then coordinate suppliers, inspection bodies, packing and logistics — verifying delivery content against the order.", link: "Ask about order service", steps: [
        { t: "Requirement Confirmation", d: "Grades, standards, dimensions, quantity, service conditions and target delivery." },
        { t: "Supply Verification", d: "Availability, supply condition and special requirements confirmed with the supplier." },
        { t: "Documents & Inspection", d: "Mill certificates and any third-party inspection agreed in advance." },
        { t: "Delivery Follow-up", d: "Packing, marking, shipping documents and dispatch milestones tracked." }
      ] },
      checklist: { title: "The more complete your inquiry,<br>the more accurate our response.", p: "The following helps us respond faster with confirmable supply and document plans. Inspection and document scope follow the agreed order.", items: ["Product, grade and standard", "Dimensions, quantity and drawings (if any)", "Media, temperature, pressure and service conditions", "Surface, length, tolerances and packing", "Mill certificates and required tests from the supplier", "Destination, target delivery and trade documents"] },
      contact: { title: "Have a project?<br>Start with specifications.", intro: "No need to wait until everything is final. Tell us the product form, grade, dimensions and destination — we'll map out what needs confirming first.", cardLabel: "Include in your inquiry", cardItems: ["Product, grade and standard", "Dimensions, quantity and drawings (if any)", "Document needs, destination and target delivery"], small: "Actual supply and document scope subject to mutual confirmation" },
form: { title: "Send an enquiry", note: "Fill in the essentials marked with * — we will come back with what still needs confirming.", company: "Company", name: "Contact person *", email: "Email *", country: "Country / Region", product: "Product form *", grade: "Grade", spec: "Size, quantity and tolerance", dest: "Destination & target lead time", message: "Service conditions & document requirements", file: "Drawing (optional, ≤5MB)", consent: "I agree that ALLOYTI may use the contact details above to respond to this enquiry.", submit: "Send enquiry", privacy: "The details submitted are used only to handle this enquiry.", productOptions: ["Titanium sheet / coil", "Titanium bar / wire", "Titanium tube / pipe", "Titanium fasteners", "Titanium forgings", "Machined titanium parts", "Other / built to drawing"] },
            footer: { brandDesc: "Titanium and titanium alloy sourcing, supply and technical support — plate, bar, tube and precision forgings in one stop, to ASTM, GB and AMS standards, exported to North America, Europe, the Middle East and Southeast Asia.", colProducts: "Products", colAbout: "Company", colContact: "Contact" }
    },

    ar: {
      meta: { title: "ALLOYTI｜توريد التيتانيوم وسبائكه", desc: "تورّد ALLOYTI التيتانيوم وسبائكه: ألواح وقضبان وأنابيب ومطروقات دقيقة بمعايير ASTM وGB وAMS من مصانع مُدقَّقة." },
      ui: { skip: "الانتقال إلى المحتوى الرئيسي", navAria: "التنقل الرئيسي", openNav: "فتح القائمة", brandTag: "توريد التيتانيوم", slogan: "التيتانيوم مادتنا، والتقنية جوهرنا", closeDialog: "إغلاق تفاصيل المنتج", metricsAria: "مؤشرات قدرات الشركة", langLabel: "تغيير اللغة", viewMore: "عرض التفاصيل", backTop: "العودة إلى الأعلى ↑", bottomTag: "تيتانيوم · ASTM / DIN / ISO · تأكيد لكل طلب", dialogContact: "حدّد متطلباتك", footTitle: "نحوّل متطلبات المواد إلى كل عملية تسليم.", footLink: "اطّلع على الجودة والخدمة" },
      nav: { home: "الرئيسية", products: "المنتجات", showcase: "موردونا", quality: "الجودة والخدمة", about: "من نحن", faq: "الأسئلة الشائعة", contact: "اتصل بنا" },
      hero: { h1a: "سبائك التيتانيوم: الخواص والدرجات والتطبيقات", h1b: "", intro: "تجمع سبائك التيتانيوم بين الكثافة المنخفضة (نحو 4.5 جم/سم³) والمقاومة النوعية العالية ومقاومة التآكل والحرارة الممتازة والتوافق الحيوي — وهي مواد إنشائية أساسية لتطبيقات الطيران والفضاء والهندسة البحرية والطب والطاقة الجديدة. تورّد ALLOYTI التيتانيوم النقي صناعياً TA1/TA2 وسبائك مثل TC4 (Ti-6Al-4V) وTA15 وTC11 على شكل ألواح وقضبان وأنابيب ومطروقات ووصلات تثبيت وفق معايير ASTM وGB وAMS، مع توريد حسب الطلب وتسليم للتصدير.", btn1: "تصفّح المنتجات", btn2: "اطلب دعم عرض السعر", nodes: ["الدرجة", "ASTM", "ISO", "DIN"], metrics: ["فئات منتجات", "درجات تيتانيوم", "أنظمة معايير", "ساعة للاستجابة"] },
      products: { title: "خمس فئات من المنتجات", intro: "خمس فئات رئيسية تغطي احتياجات التوريد الصناعية الشائعة. انقر على بطاقة المنتج لعرض الدرجات والمعايير وأشكال التوريد.", items: {
        sheet: { title: "ألواح ولفائف التيتانيوم", en: "TITANIUM SHEET & PLATE", desc: "لمعدات الكيماويات والمبادلات الحرارية والتطبيقات البحرية والصناعة العامة. تُؤكد السماكة والعرض والطول والتشطيب السطحي لكل طلب." },
        bar: { title: "قضبان وأسلاك التيتانيوم", en: "TITANIUM BAR & ROD", desc: "قضبان مستديرة وأطوال مقطوعة للأجزاء المشغولة وفراغات المثبتات والمكونات المقاومة للتآكل. تُؤكد الأبعاد والتفاوتات قبل التوريد." },
        tube: { title: "أنابيب وتجهيزات التيتانيوم", en: "TITANIUM TUBE & PIPE", desc: "للتبادل الحراري ونقل السوائل وظروف التآكل — أنابيب بدون درزة أو ملحومة، وتُؤكد سماكة الجدار والفحوصات حسب الاستفسار." },
        fasteners: { title: "مثبتات التيتانيوم", en: "TITANIUM FASTENERS", desc: "للوصلات خفيفة الوزن المقاومة للتآكل. براغٍ وصواميل وبراغي ملولبة وحلقات وفق DIN أو ISO أو ASME مع تحديد شكل الرأس واللولب والطول." },
        forgings: { title: "مطروقات التيتانيوم والأجزاء المشغولة", en: "TITANIUM FORGINGS", desc: "أقراص وحلقات وقوالب مطروقة وأجزاء مشغولة حسب الرسم، لاستخدامات الإنشاءات الفضائية ومعدات الطاقة وأجزاء الضغط المقاومة للتآكل. تُؤكد الأبعاد وحالة المعالجة الحرارية ومتطلبات الفحص قبل الطلب." }
      } },
      specLabels: { grade: "الدرجات الشائعة", standard: "المعايير", form: "أشكال التوريد", use: "تطبيقات نموذجية" },
      promise: { titleA: "من تأكيد المادة إلى مستندات الشحن، ", titleB: "كل خطوة", titleC: " قابلة للتحقق بوضوح.", p1: "نبدأ من الدرجة والأبعاد والمعايير المطبقة، ونطابق سجلات الفحص بندًا بندًا مع طلبك — ليكون الشراء للخليج والشرق الأوسط أوضح وأسهل متابعة.", p2: "من خلال خيارات توريد قابلة للتأكيد فعليًا، ومتطلبات مستندات واضحة، وتواصل في الوقت المناسب، نوفر دعمًا مستمرًا لتوريد المواد الصناعية.", link: "اعرف المزيد عن خدمة الطلبات" },
      showcase: { title: "صور من المصانع الشريكة", intro: "من التقويم والخراطة إلى الفحص والتخزين — صور حقيقية لمراحل معالجة التيتانيوم وتسليمه.", note: "الصور أعلاه ملتقطة في المصانع والصوامع التي نتعامل معها.", items: {
        straighten: { title: "تقويم القضبان والأنابيب", desc: "خط تقويم يحافظ على الاستقامة ضمن حدود التفاوت المطلوبة للتسليم." },
        discs: { title: "مخزون الأقراص والحلقات", desc: "تخزين بالجملة لأقراص وحلقات التيتانيوم — مقاسات واسعة ومخزون جاهز." },
        inspect: { title: "فحص الأبعاد", desc: "قياس كل قضيب وأنبوب للقطر والتفاوت قبل الشحن." },
        lathe: { title: "الخراطة والتشغيل", desc: "تشغيل القضبان والمطروقات وفق الرسومات بسطح وتفاوت مضبوطين." },
        heat: { title: "المعالجة الحرارية", desc: "خطوط التسخين والمعالجة تضمن البنية والأداء المطلوبين للمادة." }
      } },
      about: { title: "التيتانيوم وسبائكه:<br>التوريد والإمداد والدعم الفني.", p: "في قطاعات الطيران والفضاء والهندسة البحرية والطب والطاقة الجديدة، تجمع سبائك التيتانيوم بين القوة ومقاومة التآكل وخفة الوزن والتوافق الحيوي. تركّز ALLOYTI على توريد ودعم التيتانيوم وسبائكه، وتغطي الدرجات الرئيسية مثل TA1 وTC4 وTA15، وتقدّم حلولاً متكاملة من الألواح والقضبان والأنابيب والمطروقات الدقيقة وفق معايير ASTM وGB وAMS. تُصدَّر منتجاتنا إلى أمريكا الشمالية وأوروبا والشرق الأوسط وجنوب شرق آسيا. نحن لا نورّد المادة فحسب، بل نقدّم مشورة اختيار الدرجة ودعمًا فنيًا واستجابة سريعة.", link: "ابدأ محادثة مشروع", points: [
        { t: "مواصفات مؤكدة لكل طلب", d: "تُؤكد الدرجات والمعايير والأبعاد ومتطلبات المستندات بندًا بندًا قبل الطلب." },
        { t: "شهادات مواد حسب الطلب", d: "يمكن ترتيب شهادات EN 10204 والفحص من طرف ثالث حسب الحاجة." },
        { t: "دعم مستندات العبور الحدودي", d: "دعم في قوائم التعبئة ومستندات الشحن ومتطلبات الامتثال في بلد الوجهة." },
        { t: "سرية وتواصل في الوقت المناسب", d: "تُحفظ سرية بيانات المشروع مع تحديثات استباقية في المحطات الرئيسية." }
      ] },
      quality: { title: "من تأكيد المتطلبات<br>إلى متابعة التسليم.", p: "نؤكد الدرجات والأبعاد والمعايير ومتطلبات المستندات، ثم ننسّق بين الموردين وجهات الفحص والتغليف والخدمات اللوجستية — ونتحقق من التسليم وفق الطلب.", link: "اسأل عن خدمة الطلبات", steps: [
        { t: "تأكيد المتطلبات", d: "التحقق من الدرجات والمعايير والأبعاد والكمية وظروف التشغيل وموعد التسليم." },
        { t: "التحقق من التوريد", d: "تأكيد التوفر وحالة التوريد والمتطلبات الخاصة مع المورّد." },
        { t: "المستندات والفحص", d: "الاتفاق المسبق على شهادات المواد والفحص من طرف ثالث عند الحاجة." },
        { t: "متابعة التسليم", d: "متابعة التغليف والوسم ومستندات الشحن ومواعيد الإرسال." }
      ] },
      checklist: { title: "كلما كانت معلومات الاستفسار أكمل،<br>كان التواصل أدق.", p: "تساعدنا المعلومات التالية على الرد أسرع بخطط توريد ومستندات قابلة للتأكيد. يحدد نطاق الفحص والمستندات وفق الطلب المتفق عليه.", items: ["المنتج والدرجة والمعيار", "الأبعاد والكمية والرسومات (إن وجدت)", "الوسط ودرجة الحرارة والضغط وظروف التشغيل", "التشطيب السطحي والطول والتفاوتات والتغليف", "شهادات المواد والفحوصات المطلوبة من المورّد", "الوجهة وموعد التسليم ومستندات التجارة"] },
      contact: { title: "لديك مشروع؟<br>ابدأ من المواصفات.", intro: "لا داعي لانتظار اكتمال كل المعلومات. أخبرنا بشكل المنتج والدرجة والأبعاد ووجهة التسليم، وسنحدد ما يجب تأكيده أولًا.", cardLabel: "يُفضّل أن يتضمن الاستفسار", cardItems: ["المنتج والدرجة والمعيار", "الأبعاد والكمية والرسومات (إن وجدت)", "متطلبات المستندات والوجهة وموعد التسليم"], small: "نطاق التوريد والمستندات الفعلي يخضع للاتفاق المتبادل" },
form: { title: "إرسال طلب عرض سعر", note: "املأ الحقول المطلوبة (*) فقط، وسنعود إليك بما يحتاج إلى تأكيد إضافي.", company: "اسم الشركة", name: "الشخص المسؤول *", email: "البريد الإلكتروني *", country: "الدولة / المنطقة", product: "شكل المنتج *", grade: "الدرجة", spec: "المقاس والكمية والتفاوت", dest: "جهة التسليم والمهلة المطلوبة", message: "ظروف التشغيل ومتطلبات المستندات", file: "مرفق الرسم (اختياري، ≤5 ميغابايت)", consent: "أوافق على أن يعالج ALLOYTI بيانات الاتصال أعلاه للرد على هذا الطلب.", submit: "إرسال الطلب", privacy: "تُستخدم البيانات المقدَّمة فقط للتعامل مع هذا الطلب.", productOptions: ["ألواح / لفائف تيتانيوم", "قضبان / أسلاك تيتانيوم", "أنابيب ومواسير تيتانيوم", "مثبتات تيتانيوم", "مطروقات تيتانيوم", "أجزاء تيتانيوم مشغَّلة", "أخرى / حسب الرسم"] },
            footer: { brandDesc: "التوريد والإمداد والدعم الفني للتيتانيوم وسبائكه — ألواح وقضبان وأنابيب ومطروقات دقيقة وفق معايير ASTM وGB وAMS، مصدَّرة إلى أمريكا الشمالية وأوروبا والشرق الأوسط وجنوب شرق آسيا.", colProducts: "المنتجات", colAbout: "الشركة", colContact: "اتصل بنا" }
    },

    ru: {
      meta: { title: "ALLOYTI｜Поставка и обработка титана", desc: "ALLOYTI поставляет титан и его сплавы: листы, прутки, трубы и точные поковки по ASTM, GB и AMS с заводов-партнёров." },
      ui: { skip: "Перейти к основному содержанию", navAria: "Основная навигация", openNav: "Открыть меню", brandTag: "ПОСТАВКИ ТИТАНА", slogan: "Титан как материал. Технология как ядро.", closeDialog: "Закрыть описание", metricsAria: "Показатели компании", langLabel: "Сменить язык", viewMore: "Подробнее", backTop: "Наверх ↑", bottomTag: "ТИТАН · ASTM / DIN / ISO · подтверждается заказом", dialogContact: "Сформулировать запрос", footTitle: "Требования к материалу — в каждой поставке.", footLink: "Качество и сервис" },
      nav: { home: "Главная", products: "Продукция", showcase: "Поставки", quality: "Качество и сервис", about: "О нас", faq: "Вопросы и ответы", contact: "Контакты" },
      hero: { h1a: "Титановые сплавы: свойства, марки и применение", h1b: "", intro: "Титановые сплавы сочетают низкую плотность (около 4,5 г/см³) с высокой удельной прочностью, отличной коррозионной стойкостью, жаропрочностью и биосовместимостью — это ключевые конструкционные материалы для авиакосмической отрасли, морской техники, медицины и новой энергетики. ALLOYTI поставляет технически чистый титан TA1/TA2 и сплавы TC4 (Ti-6Al-4V), TA15 и TC11 в виде плит, прутков, труб, поковок и крепежа по стандартам ASTM, GB и AMS, с обработкой под заказ и экспортной поставкой.", btn1: "Смотреть продукцию", btn2: "Запросить расчёт", nodes: ["Марка", "ASTM", "ISO", "DIN"], metrics: ["категорий продукции", "марок титана", "систем стандартов", "ч на ответ"] },
      products: { title: "Пять категорий продукции", intro: "Пять ключевых категорий для типовых промышленных закупок. Нажмите на карточку, чтобы увидеть марки, стандарты и формы поставки.", items: {
        sheet: { title: "Титановые листы и рулоны", en: "TITANIUM SHEET & PLATE", desc: "Для химического оборудования, теплообменников, морской и общей промышленности. Толщина, ширина, длина и отделка подтверждаются по заказу." },
        bar: { title: "Титановые прутки и проволока", en: "TITANIUM BAR & ROD", desc: "Круглые прутки и мерные длины для обрабатываемых деталей, заготовок крепежа и коррозионностойких узлов. Размеры и допуски — до поставки." },
        tube: { title: "Титановые трубы и фитинги", en: "TITANIUM TUBE & PIPE", desc: "Для теплообмена, транспортировки жидкостей и коррозионных сред — бесшовные или сварные трубы; толщина стенки и объём контроля по запросу." },
        fasteners: { title: "Титановый крепёж", en: "TITANIUM FASTENERS", desc: "Для лёгких коррозионностойких соединений. Болты, гайки, винты и шайбы; форма головки, резьба и длина по DIN, ISO или ASME." },
        forgings: { title: "Титановые поковки и обработанные детали", en: "TITANIUM FORGINGS", desc: "Кованые диски, кольца, бруски и детали по чертежу для авиационных конструкций, энергетического оборудования и коррозионностойких деталей под давлением. Размеры, состояние термообработки и объём контроля подтверждаются до заказа." }
      } },
      specLabels: { grade: "Марки", standard: "Стандарты", form: "Формы поставки", use: "Применение" },
      promise: { titleA: "От подтверждения материала до отгрузочных документов — ", titleB: "каждый шаг", titleC: " прозрачен и проверяем.", p1: "Мы начинаем с марки, размеров и применимых стандартов и сопоставляем протоколы испытаний с заказом по пунктам — трансграничные закупки становятся прозрачнее и легче в сопровождении.", p2: "Подтверждаемые варианты поставки, чёткие требования к документам и своевременная коммуникация — постоянная поддержка промышленных закупок.", link: "Подробнее об обслуживании заказов" },
      showcase: { title: "Фото партнёрских заводов", intro: "От правки и токарной обработки до контроля и хранения — реальные фото этапов обработки и поставки титана.", note: "Фото сделаны на заводах-партнёрах и их складах.", items: {
        straighten: { title: "Правка прутков и труб", desc: "Линия правки обеспечивает прямолинейность в пределах допусков поставки." },
        discs: { title: "Склад дисков и колец", desc: "Массовое хранение титановых дисков и колец — широкий размерный ряд, товарные запасы." },
        inspect: { title: "Контроль размеров", desc: "Каждый пруток и труба измеряются по диаметру и допускам перед отгрузкой." },
        lathe: { title: "Токарная обработка", desc: "Обработка прутков и поковок по чертежам с контролем чистоты и допусков." },
        heat: { title: "Термообработка", desc: "Линии нагрева и обработки обеспечивают требуемую структуру и свойства материала." }
      } },
      about: { title: "Титан и титановые сплавы:<br>закупка, поставка и техническая поддержка.", p: "В авиации и космосе, морской технике, медицине и новой энергетике титановые сплавы сочетают прочность, коррозионную стойкость, малый вес и биосовместимость. ALLOYTI специализируется на закупке, поставке и технической поддержке титана и его сплавов, охватывая основные марки TA1, TC4 и TA15, и поставляет комплексные решения — листы, прутки, трубы и точные поковки — по стандартам ASTM, GB и AMS. Продукция экспортируется в Северную Америку, Европу, на Ближний Восток и в Юго-Восточную Азию. Мы поставляем не только материал, но и рекомендации по выбору марок, технологическую поддержку и быстрый отклик.", link: "Обсудить проект", points: [
        { t: "Спецификации по заказу", d: "Марки, стандарты, размеры и документы согласуются по пунктам до заказа." },
        { t: "Сертификаты по запросу", d: "По запросу организуем сертификаты EN 10204 и независимый контроль." },
        { t: "Внешнеторговые документы", d: "Помощь с упаковочными листами, транспортными документами и требованиями страны назначения." },
        { t: "Конфиденциальность и связь", d: "Конфиденциальность данных проекта и проактивные обновления на ключевых этапах." }
      ] },
      quality: { title: "От подтверждения требований<br>до сопровождения поставки.", p: "Подтверждаем марки, размеры, стандарты и требования к документам, координируем поставщиков, инспекцию, упаковку и логистику, сверяем поставку с заказом.", link: "Спросить об обслуживании заказов", steps: [
        { t: "Подтверждение требований", d: "Марки, стандарты, размеры, количество, условия эксплуатации и срок поставки." },
        { t: "Проверка поставки", d: "Доступность, состояние поставки и особые требования — с поставщиком." },
        { t: "Документы и инспекция", d: "Сертификаты и независимый контроль согласовываются заранее." },
        { t: "Сопровождение поставки", d: "Упаковка, маркировка, документы и этапы отгрузки." }
      ] },
      checklist: { title: "Чем полнее запрос,<br>тем точнее ответ.", p: "Эта информация помогает быстрее подготовить подтверждаемый план поставки и документов. Объём контроля и документов — согласно согласованному заказу.", items: ["Продукция, марка, стандарт", "Размеры, количество, чертежи (при наличии)", "Среда, температура, давление и условия эксплуатации", "Поверхность, длина, допуски и упаковка", "Сертификаты и требуемые испытания от поставщика", "Направление поставки, срок и товаросопроводительные документы"] },
      contact: { title: "Есть проект?<br>Начните со спецификаций.", intro: "Не ждите полной ясности. Сообщите форму продукции, марку, размеры и место поставки — мы определим, что нужно уточнить.", cardLabel: "Включите в запрос", cardItems: ["Продукция, марка, стандарт", "Размеры, количество, чертежи (при наличии)", "Документы, направление поставки и срок"], small: "Фактический объём поставки и документов — по взаимному согласованию" },
form: { title: "Отправить запрос", note: "Заполните поля со звёздочкой — мы вернёмся с уточняющими вопросами.", company: "Компания", name: "Контактное лицо *", email: "Электронная почта *", country: "Страна / регион", product: "Вид продукции *", grade: "Марка", spec: "Размер, количество и допуски", dest: "Пункт назначения и желаемый срок", message: "Условия эксплуатации и требования к документам", file: "Чертёж (необязательно, ≤5 МБ)", consent: "Я согласен, что ALLOYTI будет использовать эти контактные данные для ответа на запрос.", submit: "Отправить запрос", privacy: "Данные используются только для работы с этим запросом.", productOptions: ["Лист / рулон титана", "Пруток / проволока титана", "Трубы и трубки титана", "Крепёж из титана", "Поковки титана", "Механически обработанные детали", "Прочее / по чертежу"] },
            footer: { brandDesc: "закупка, поставка и техническая поддержка титана и его сплавов — листы, прутки, трубы и точные поковки по стандартам ASTM, GB и AMS, экспорт в Северную Америку, Европу, на Ближний Восток и в Юго-Восточную Азию.", colProducts: "Продукция", colAbout: "Компания", colContact: "Контакты" }
    },

    de: {
      meta: { title: "ALLOYTI｜Titanlieferung und Bearbeitung", desc: "ALLOYTI liefert Titan und Titanlegierungen: Bleche, Stangen, Rohre und Präzisionsschmiedestücke nach ASTM, GB und AMS von Partnerwerken." },
      ui: { skip: "Zum Hauptinhalt springen", navAria: "Hauptnavigation", openNav: "Navigation öffnen", brandTag: "TITAN-LIEFERUNG", slogan: "Titan als Werkstoff. Technologie als Kern.", closeDialog: "Produktdetails schließen", metricsAria: "Unternehmenskennzahlen", langLabel: "Sprache wechseln", viewMore: "Details ansehen", backTop: "Nach oben ↑", bottomTag: "TITAN · ASTM / DIN / ISO · auftragsbezogen bestätigt", dialogContact: "Bedarf formulieren", footTitle: "Materialanforderungen in jeder Lieferung umsetzen.", footLink: "Qualität & Service ansehen" },
      nav: { home: "Start", products: "Produkte", showcase: "Lieferung", quality: "Qualität & Service", about: "Über uns", faq: "FAQ", contact: "Kontakt" },
      hero: { h1a: "Titanlegierungen: Eigenschaften, Güten & Anwendungen", h1b: "", intro: "Titanlegierungen verbinden geringe Dichte (ca. 4,5 g/cm³) mit hoher spezifischer Festigkeit, ausgezeichneter Korrosions- und Warmbeständigkeit sowie Biokompatibilität — Schlüsselwerkstoffe für Luft- und Raumfahrt, Meerestechnik, Medizintechnik und neue Energien. ALLOYTI liefert Reintitan TA1/TA2 sowie Legierungen wie TC4 (Ti-6Al-4V), TA15 und TC11 als Bleche, Stangen, Rohre, Schmiedestücke und Verbindungselemente nach ASTM, GB und AMS — mit Bearbeitung nach Zeichnung und Exportlieferung.", btn1: "Produkte ansehen", btn2: "Angebot anfragen", nodes: ["Güte", "ASTM", "ISO", "DIN"], metrics: ["Produktkategorien", "Titan-Güten", "Normsysteme", "Std. Angebotsantwort"] },
      products: { title: "Fünf Produktkategorien", intro: "Fünf Kernkategorien für typische Industriebedarfe. Klicken Sie auf eine Produktkarte für Güten, Normen und Lieferformen.", items: {
        sheet: { title: "Titanblech & Platten", en: "TITANIUM SHEET & PLATE", desc: "Für Chemieanlagen, Wärmeübertrager, Meerestechnik und allgemeine Industrie. Dicke, Breite, Länge und Oberflächenausführung auftragsbezogen." },
        bar: { title: "Titanstangen & -draht", en: "TITANIUM BAR & ROD", desc: "Rundstangen und Zuschnittslängen für bearbeitete Teile, Befestigungsrohlinge und korrosionsbeständige Komponenten. Maße und Toleranzen werden vor Lieferung bestätigt." },
        tube: { title: "Titanrohre & Formstücke", en: "TITANIUM TUBE & PIPE", desc: "Für Wärmeübertragung, Fluidtransport und korrosive Medien — nahtlose oder geschweißte Rohre; Wanddicke und Prüfumfang anfragebezogen." },
        fasteners: { title: "Titan-Befestigungsteile", en: "TITANIUM FASTENERS", desc: "Für leichte, korrosionsbeständige Verbindungen. Schrauben, Muttern und Unterlegscheiben mit Kopfform, Gewinde und Länge nach DIN, ISO oder ASME." },
        forgings: { title: "Titan-Schmiedestücke & zerspante Teile", en: "TITANIUM FORGINGS", desc: "Geschmiedete Scheiben, Ringe, Blöcke und nach Zeichnung bearbeitete Teile für Luftfahrtstrukturen, Energieanlagen und korrosionsbeständige Druckteile. Maße, Wärmebehandlungszustand und Prüfanforderungen werden vor Auftrag bestätigt." }
      } },
      specLabels: { grade: "Übliche Güten", standard: "Normen", form: "Lieferformen", use: "Typische Anwendungen" },
      promise: { titleA: "Von der Materialbestätigung bis zu den Versandunterlagen ist ", titleB: "jeder Schritt", titleC: " nachvollziehbar.", p1: "Wir beginnen mit Güte, Maßen und anwendbaren Normen und ordnen Prüfunterlagen Posten für Posten Ihrer Bestellung zu — grenzüberschreitender Einkauf wird klarer und leichter nachverfolgbar.", p2: "Mit tatsächlich bestätigbaren Beschaffungsoptionen, klaren Dokumentanforderungen und zeitnaher Kommunikation unterstützen wir Ihren Materialeinkauf laufend.", link: "Mehr zum Bestellservice" },
      showcase: { title: "Einblicke in Partnerwerke", intro: "Von Richt- und Drehbearbeitung bis Prüfung und Lager — echte Aufnahmen aller Schritte der Titanverarbeitung und Lieferung.", note: "Die obigen Fotos entstanden an den Werken und Lagern unserer Partner.", items: {
        straighten: { title: "Richten von Stangen & Rohren", desc: "Richtlinie hält die Geradheit innerhalb der Liefertoleranzen." },
        discs: { title: "Scheiben- & Ringlager", desc: "Massenlagerung von Titanscheiben und -ringen — viele Maße, Lagerbestand verfügbar." },
        inspect: { title: "Maßprüfung", desc: "Jede Stange und jedes Rohr wird vor dem Versand auf Durchmesser und Toleranz geprüft." },
        lathe: { title: "Drehbearbeitung", desc: "Drehen von Stangen und Schmiedeteilen nach Zeichnung mit kontrollierter Oberfläche und Toleranz." },
        heat: { title: "Wärmebehandlung", desc: "Heiz- und Behandlungslinien sichern das erforderliche Gefüge und den Lieferzustand." }
      } },
      about: { title: "Titan und Titanlegierungen:<br>Beschaffung, Lieferung und technische Unterstützung.", p: "In Luft- und Raumfahrt, Meerestechnik, Medizintechnik und neuer Energietechnik vereinen Titanlegierungen Festigkeit, Korrosionsbeständigkeit, geringes Gewicht und Biokompatibilität. ALLOYTI konzentriert sich auf Beschaffung, Lieferung und technische Unterstützung von Titan und Titanlegierungen, deckt die gängigen Güten TA1, TC4 und TA15 ab und liefert Komplettlösungen aus Blech, Stangen, Rohren und Präzisionsschmiedestücken nach ASTM, GB und AMS. Unsere Produkte werden nach Nordamerika, Europa, in den Nahen Osten und nach Südostasien exportiert. Wir liefern nicht nur Material, sondern auch Auslegungsberatung, verfahrenstechnische Unterstützung und schnelle Reaktion.", link: "Projektgespräch starten", points: [
        { t: "Spezifikationen je Auftrag", d: "Güten, Normen, Maße und Dokumente werden vor Bestellung einzeln bestätigt." },
        { t: "Werkszeugnisse vereinbar", d: "EN 10204-Zeugnisse und Drittprüfung lassen sich nach Bedarf vereinbaren." },
        { t: "Unterstützung beim Export", d: "Hilfe bei Packlisten, Versanddokumenten und Zielland-Anforderungen." },
        { t: "Vertraulich & reaktionsschnell", d: "Vertraulicher Umgang mit Projektinformationen und proaktive Updates an Meilensteinen." }
      ] },
      quality: { title: "Von der Anforderungsbestätigung<br>bis zur Lieferverfolgung.", p: "Wir bestätigen Güten, Maße, Normen und Dokumentanforderungen, koordinieren Lieferanten, Prüfinstitute, Verpackung und Logistik und gleichen die Lieferung mit der Bestellung ab.", link: "Bestellservice erfragen", steps: [
        { t: "Anforderungsbestätigung", d: "Güten, Normen, Maße, Menge, Einsatzbedingungen und Liefertatum." },
        { t: "Lieferantenprüfung", d: "Verfügbarkeit, Lieferzustand und Sonderanforderungen mit dem Lieferanten klären." },
        { t: "Dokumente & Prüfung", d: "Werkszeugnisse und erforderliche Drittprüfung vorab vereinbaren." },
        { t: "Lieferverfolgung", d: "Verpackung, Kennzeichnung, Versanddokumente und Versandtermine verfolgen." }
      ] },
      checklist: { title: "Je vollständiger die Anfrage,<br>desto genauer die Antwort.", p: "Diese Angaben helfen uns, schneller einen bestätigbaren Liefer- und Dokumentplan zu erstellen. Prüf- und Dokumentumfang richten sich nach der vereinbarten Bestellung.", items: ["Produkt, Güte und Norm", "Maße, Menge und Zeichnungen (falls vorhanden)", "Medium, Temperatur, Druck und Einsatzbedingungen", "Oberfläche, Länge, Toleranzen und Verpackung", "Werkszeugnisse und erforderliche Prüfungen", "Zielland, Liefertermin und Handelsdokumente"] },
      contact: { title: "Ein Projekt?<br>Starten Sie mit den Spezifikationen.", intro: "Sie müssen nicht alles im Detail wissen. Nennen Sie uns Produktform, Güte, Maße und Zielland — wir klären, was zu bestätigen ist.", cardLabel: "In die Anfrage aufnehmen", cardItems: ["Produkt, Güte und Norm", "Maße, Menge und Zeichnungen (falls vorhanden)", "Dokumente, Zielland und Liefertermin"], small: "Tatsächlicher Liefer- und Dokumentumfang nach beidseitiger Bestätigung" },
form: { title: "Anfrage senden", note: "Bitte zuerst die mit * markierten Felder ausfüllen — wir melden uns mit den dann nötigen Rückfragen.", company: "Unternehmen", name: "Ansprechpartner *", email: "E-Mail *", country: "Land / Region", product: "Produktform *", grade: "Güte", spec: "Abmessung, Menge und Toleranz", dest: "Bestimmungsort & Wunschtermin", message: "Einsatzbedingungen & Dokumentenanforderungen", file: "Zeichnung (optional, ≤5 MB)", consent: "Ich stimme zu, dass ALLOYTI die oben genannten Kontaktdaten zur Bearbeitung dieser Anfrage nutzt.", submit: "Anfrage senden", privacy: "Die Angaben werden ausschließlich zur Bearbeitung dieser Anfrage verwendet.", productOptions: ["Titanblech / -coil", "Titanstange / -draht", "Titanrohre & Formteile", "Titan-Befestigungsteile", "Titan-Schmiedeteile", "Zerspante Titan-Teile", "Sonstiges / nach Zeichnung"] },
            footer: { brandDesc: "Beschaffung, Lieferung und technische Unterstützung von Titan und Titanlegierungen — Bleche, Stangen, Rohre, Verbindungselemente und Präzisionsschmiedestücke nach ASTM, GB und AMS, exportiert nach Nordamerika, Europa, in den Nahen Osten und nach Südostasien.", colProducts: "Produkte", colAbout: "Unternehmen", colContact: "Kontakt" }
    }
  };

  const L = () => I18N[lang];
  const tv = (v) => (v && typeof v === "object") ? (v[lang] ?? v.zh) : v;

  /* ================= 语言无关数据（文本走 I18N） ================= */
  const PRODUCTS = [
    { key: "sheet", index: "01 / 05", img: "assets/titanium-plate-astm-b265.webp", w: 900, h: 900, tags: ["Gr.1", "Gr.2", "Gr.5"],
      specs: [
        { label: "grade", v: "Gr.1 / Gr.2 / Gr.5" },
        { label: "standard", v: "ASTM B265" },
        { label: "form", v: { zh: "板材 / 卷板 / 定尺剪切", en: "Sheet / Coil / Cut-to-size", ar: "ألواح / لفائف / قص بالمقاس", ru: "Листы / рулоны / резка в размер", de: "Blech / Coil / Zuschnitt" } },
        { label: "use", v: { zh: "容器、管板、衬里、结构件", en: "Vessels, tube sheets, linings, structural parts", ar: "أوعية، ألواح أنابيب، تبطين، أجزاء إنشائية", ru: "Сосуды, трубные решётки, футеровка, несущие детали", de: "Behälter, Rohrböden, Auskleidungen, Konstruktionsteile" } }
      ] },
    { key: "bar", index: "02 / 05", img: "assets/titanium-bar-astm-b348.webp", w: 497, h: 439, tags: ["Gr.2", "Gr.5", "Gr.7"],
      specs: [
        { label: "grade", v: "Gr.2 / Gr.5 / Gr.7" },
        { label: "standard", v: "ASTM B348" },
        { label: "form", v: { zh: "圆棒 / 定尺 / 车光", en: "Round bar / Cut length / Peeled", ar: "قضبان مستديرة / أطوال مقطوعة / مصقولة", ru: "Пруток / мерная длина / обточка", de: "Rundstange / Zuschnitt / abgestreift" } },
        { label: "use", v: { zh: "轴类、机加工件、连接件", en: "Shafts, machined parts, connectors", ar: "أعمدة، أجزاء مشغولة، وصلات", ru: "Валы, обработанные детали, соединители", de: "Wellen, Drehteile, Verbinder" } }
      ] },
    { key: "tube", index: "03 / 05", img: "assets/titanium-fittings-astm-b363.webp", w: 1200, h: 726, tags: ["Gr.1", "Gr.2", "Gr.7"],
      specs: [
        { label: "grade", v: "Gr.1 / Gr.2 / Gr.7" },
        { label: "standard", v: "ASTM B338 / B861 / B862" },
        { label: "form", v: { zh: "无缝 / 焊接 / 定尺", en: "Seamless / Welded / Cut length", ar: "بدون درزة / ملحوم / بالمقاس", ru: "Бесшовные / сварные / мерные", de: "Nahtlos / geschweißt / Längen" } },
        { label: "use", v: { zh: "换热器、冷凝器、工艺管道", en: "Heat exchangers, condensers, process piping", ar: "مبادلات حرارية، مكثفات، أنابيب عمليات", ru: "Теплообменники, конденсаторы, технологические трубопроводы", de: "Wärmeübertrager, Kondensatoren, Prozessleitungen" } }
      ] },
    { key: "fasteners", index: "04 / 05", img: "assets/titanium-fasteners-din-iso.webp", w: 1400, h: 471, tags: ["Gr.2", "Gr.5"],
      specs: [
        { label: "grade", v: "Gr.2 / Gr.5" },
        { label: "standard", v: "DIN / ISO / ASME" },
        { label: "form", v: { zh: "螺栓 / 螺母 / 螺钉 / 垫圈", en: "Bolts / Nuts / Screws / Washers", ar: "براغٍ / صواميل / براغي ملولبة / حلقات", ru: "Болты / гайки / винты / шайбы", de: "Schrauben / Muttern / Schrauben / Scheiben" } },
        { label: "use", v: { zh: "设备连接、海洋工程、轻量化装配", en: "Equipment joints, marine, lightweight assembly", ar: "وصلات معدات، أعمال بحرية، تجميع خفيف", ru: "Соединения оборудования, морские сооружения, лёгкие сборки", de: "Anlagenverbindungen, Meerestechnik, Leichtbau" } }
      ] },
    { key: "forgings", index: "05 / 05", img: "assets/titanium-forgings-astm-b381.webp", w: 900, h: 900, tags: ["TC4", "TA15"],
      specs: [
        { label: "grade", v: "TC4 / TA15 / TC11" },
        { label: "standard", v: "ASTM B381" },
        { label: "form", v: { zh: "饼 / 环 / 块 / 按图加工", en: "Discs / Rings / Blocks / Machined to drawing", ar: "أقراص / حلقات / قوالب / تصنيع حسب الرسم", ru: "Диски / кольца / бруски / обработка по чертежу", de: "Scheiben / Ringe / Blöcke / nach Zeichnung" } },
        { label: "use", v: { zh: "航空结构件、能源装备、耐蚀承压件", en: "Aerospace structural parts, energy equipment, corrosion-resistant pressure parts", ar: "أجزاء إنشائية فضائية، معدات طاقة، أجزاء ضغط مقاومة للتآكل", ru: "Авиационные детали, энергетическое оборудование, коррозионностойкие детали под давлением", de: "Luftfahrtstrukturteile, Energieanlagen, korrosionsbeständige Druckteile" } }
      ] }
  ];

  const SHOWCASE = [
    { key: "straighten", code: "P·01", img: "assets/factory-straightening.webp" },
    { key: "discs", code: "P·02", img: "assets/factory-disc-warehouse.webp" },
    { key: "inspect", code: "P·03", img: "assets/factory-inspection.webp" },
    { key: "lathe", code: "P·04", img: "assets/factory-lathe.webp" },
    { key: "heat", code: "P·05", img: "assets/factory-heat-treatment.webp" }
  ];

  const METRIC_NUMS = [5, 7, 3, 24];

  /* ================= 渲染函数 ================= */
  function renderProducts() {
    const P = L().products;
    const gridEl = document.getElementById("productGrid");
    if (!gridEl) return;
    gridEl.innerHTML = PRODUCTS.map((p) => {
      const it = P.items[p.key];
      return `<article class="product-card" data-key="${p.key}" tabindex="0" role="button" aria-label="${L().ui.viewMore}: ${it.title}">
      <div class="product-media"><img src="${p.img}" alt="${it.title} — titanium mill product" width="${p.w}" height="${p.h}" loading="lazy"></div>
      <span class="product-index">${p.index}</span>
      <div class="product-body">
        <h3>${it.title}</h3>
        <div class="product-tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        <p>${it.desc}</p>
        <span class="product-more">${L().ui.viewMore} <span aria-hidden="true">→</span></span>
      </div>
    </article>`;
    }).join("");
  }

  function renderShowcase() {
    const S = L().showcase;
    const scEl = document.getElementById("showcaseGrid");
    if (!scEl) return;
    scEl.innerHTML = SHOWCASE.map((a) => {
      const it = S.items[a.key];
      return `<div class="app-card">
      <img src="${a.img}" alt="${it.title} — titanium production site" loading="lazy" width="1200" height="800">
      <div class="app-text"><span class="app-code">${a.code}</span><h3>${it.title}</h3><p>${it.desc}</p></div>
    </div>`;
    }).join("");
  }

  function renderQuality() {
    const qEl = document.getElementById("qualityList");
    if (!qEl) return;
    qEl.innerHTML = L().quality.steps.map((q) =>
      `<li><h3>${q.t}</h3><p>${q.d}</p></li>`).join("");
  }

  function renderChecklist() {
    const cEl = document.getElementById("checklistItems");
    if (!cEl) return;
    cEl.innerHTML = L().checklist.items.map((c) =>
      `<li>${c}</li>`).join("");
  }

  function renderAbout() {
    const aEl = document.getElementById("aboutPoints");
    if (!aEl) return;
    aEl.innerHTML = L().about.points.map((p) =>
      `<li><h3>${p.t}</h3><p>${p.d}</p></li>`).join("");
  }

  function renderMetrics() {
    const M = L().hero.metrics;
    const mEl = document.getElementById("heroMetrics");
    if (!mEl) return;
    mEl.innerHTML = METRIC_NUMS.map((n, i) =>
      `<div class="metric"><b data-to="${n}">0</b><span>${M[i]}</span></div>`).join("");
  }

  /* ================= 静态 data-i18n 填充 ================= */
  function renderStatic() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const path = el.getAttribute("data-i18n").split(".");
      let v = L();
      for (const k of path) { v = v ? v[k] : undefined; }
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const path = el.getAttribute("data-i18n-html").split(".");
      let v = L();
      for (const k of path) { v = v ? v[k] : undefined; }
      if (typeof v === "string") el.innerHTML = v;
    });
    // aria / 属性类翻译
    const aria = (id, val) => { const el = document.getElementById(id); if (el) el.setAttribute("aria-label", val); };
    aria("menuToggle", L().ui.openNav);
    aria("dialogClose", L().ui.closeDialog);
    aria("heroMetrics", L().ui.metricsAria);
    const lt = document.getElementById("langToggle");
    if (lt) lt.setAttribute("aria-label", L().ui.langLabel);
    const navEl = document.querySelector("nav.nav");
    if (navEl) navEl.setAttribute("aria-label", L().ui.navAria);
    // 仅首页用词典覆写 title / description，子页面保留各自英文 SEO 文案
    if (document.body && document.body.dataset.dynTitle === "1") document.title = L().meta.title;
    const md = document.querySelector('meta[name="description"][data-i18n-desc]');
    if (md) md.setAttribute("content", L().meta.desc);
  }

  /* ================= 页面正文多语言 =================
     子页面静态英文文案（data-i18n="sNNN"）的译文按语言分包在 i18n/<lang>.js，
     由 <head> 引导脚本按当前语言只加载一份；英文页不加载任何词典（HTML 原文即可）。
     HTML 中保留英文原文，爬虫 / 禁用 JS 时始终可读英文。 */
  function applyPageI18N() {
    const dict = (window.ALLOYTI_PAGE_I18N && window.ALLOYTI_PAGE_I18N[lang]) || {};
    if (!Object.keys(dict).length) return;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      // 页面正文词条为 sNNN，与 UI 词典的路径式 key（如 nav.home）区分
      if (!/^s\d{3}$/.test(key)) return;
      const v = dict[key];
      if (typeof v === "string" && v) el.textContent = v;
    });
  }

  function applyLang(next) {
    // 正文词典按语言分包：目标语言包未加载时带 ?lang= 重载（仅切换语言才触发，避免死循环）
    if (next !== lang && !(window.ALLOYTI_PAGE_I18N && window.ALLOYTI_PAGE_I18N[next])) {
      try { localStorage.setItem("ts-lang", next); } catch (e) { /* ignore */ }
      try { sessionStorage.setItem("ts-scroll", String(window.pageYOffset || 0)); } catch (e) { /* ignore */ }
      const u = new URL(location.href);
      u.searchParams.set("lang", next);
      location.replace(u.toString());
      return;
    }
    lang = next;
    try { localStorage.setItem("ts-lang", lang); } catch (e) { /* ignore */ }
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    syncLangUI();
    const formLangEl = document.getElementById("formLang");
    if (formLangEl) formLangEl.value = lang;
    renderStatic();
    applyPageI18N();
    renderProducts();
    renderShowcase();
    renderQuality();
    renderChecklist();
    renderAbout();
    renderMetrics();
    // 译文已全部注入，解除 <head> 脚本设置的暂隐，正式显示翻译后的正文
    document.documentElement.classList.remove("lang-pending");
  }

  /* ================= 语言切换器（自定义下拉面板） ================= */
  const LANG_CODE = { en: "EN", zh: "中文", ar: "AR", ru: "RU", de: "DE" };
  const langSwitch = document.getElementById("langSwitch");
  const langToggle = document.getElementById("langToggle");
  const langMenu = document.getElementById("langMenu");
  const langCode = document.getElementById("langCode");
  function syncLangUI() {
    if (langCode) langCode.textContent = LANG_CODE[lang] || lang.toUpperCase();
    if (langMenu) langMenu.querySelectorAll("li[data-lang]").forEach((li) => {
      const on = li.getAttribute("data-lang") === lang;
      li.classList.toggle("is-active", on);
      li.setAttribute("aria-selected", on ? "true" : "false");
    });
    closeLangMenu();
  }
  function openLangMenu() {
    if (!langMenu) return;
    langMenu.classList.add("open");
    if (langToggle) langToggle.setAttribute("aria-expanded", "true");
  }
  function closeLangMenu() {
    if (!langMenu) return;
    langMenu.classList.remove("open");
    if (langToggle) langToggle.setAttribute("aria-expanded", "false");
  }
  if (langToggle && langMenu) {
    langToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      langMenu.classList.contains("open") ? closeLangMenu() : openLangMenu();
    });
    langMenu.querySelectorAll("li[data-lang]").forEach((li) => {
      li.addEventListener("click", () => applyLang(li.getAttribute("data-lang")));
    });
    document.addEventListener("click", (e) => {
      if (langSwitch && !langSwitch.contains(e.target)) closeLangMenu();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLangMenu(); });
  }

  /* ================= 产品弹窗 ================= */
  const dialog = document.getElementById("productDialog");
  const dialogMedia = document.getElementById("dialogMedia");
  const dIndex = document.getElementById("dialogIndex");
  const dTitle = document.getElementById("dialogTitle");
  const dEn = document.getElementById("dialogEn");
  const dDesc = document.getElementById("dialogDesc");
  const dSpecs = document.getElementById("dialogSpecs");
  const dContact = document.getElementById("dialogContact");

  function openProduct(key) {
    const p = PRODUCTS.find((x) => x.key === key);
    if (!p) return;
    const it = L().products.items[p.key];
    const SL = L().specLabels;
    dialogMedia.innerHTML = `<img src="${p.img}" alt="${it.title}">`;
    dIndex.textContent = p.index;
    dTitle.textContent = it.title;
    dEn.textContent = it.en;
    dDesc.textContent = it.desc;
    dSpecs.innerHTML = p.specs.map((s) =>
      `<div><dt>${SL[s.label]}</dt><dd>${tv(s.v)}</dd></div>`).join("");
    dContact.childNodes[0].textContent = L().ui.dialogContact + " ";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }
  function closeProduct() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  const productGrid = document.getElementById("productGrid");
  if (productGrid) productGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    if (card) openProduct(card.dataset.key);
  });
  if (productGrid) productGrid.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const card = e.target.closest(".product-card");
      if (card) { e.preventDefault(); openProduct(card.dataset.key); }
    }
  });
  const dcEl = document.getElementById("dialogClose");
  if (dcEl) dcEl.addEventListener("click", closeProduct);
  if (dialog) {
    dialog.addEventListener("click", (e) => { if (e.target === dialog) closeProduct(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && dialog.open) closeProduct(); });
  }

  /* ================= 页脚产品链接：打开对应弹窗 ================= */
  document.querySelectorAll("[data-scroll]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const key = a.dataset.scroll;
      if (PRODUCTS.some((p) => p.key === key)) {
        e.preventDefault();
        closeMobileMenu();
        document.getElementById("products").scrollIntoView({ behavior: "smooth" });
        setTimeout(() => openProduct(key), 360);
      }
    });
  });

  /* ================= 移动端菜单 ================= */
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("primaryNav");
  function closeMobileMenu() {
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobileMenu));

  /* ================= 头部滚动态 ================= */
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10 || document.body.dataset.lightHeader === "1");
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ================= 滚动揭示 ================= */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
    /* 兜底：任何环境（含 RTL/无头/旧内核）下 IO 未触发也不得让内容停留为不可见 */
    setTimeout(() => { reveals.forEach((el) => el.classList.add("in")); io.disconnect(); }, 2000);
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ================= Hero 数字动画 ================= */
  function animateMetrics() {
    document.querySelectorAll("#heroMetrics b[data-to]").forEach((b) => {
      const to = parseInt(b.dataset.to, 10);
      let cur = 0;
      const step = Math.max(1, Math.round(to / 30));
      const timer = setInterval(() => {
        cur += step;
        if (cur >= to) { cur = to; clearInterval(timer); }
        b.textContent = cur;
      }, 28);
    });
  }
  const heroMetrics = document.getElementById("heroMetrics");
  if (heroMetrics && "IntersectionObserver" in window) {
    const mo = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { animateMetrics(); mo.disconnect(); } });
    }, { threshold: 0.4 });
    mo.observe(heroMetrics);
  } else {
    animateMetrics();
  }

  /* ================= 询盘表单 ================= */
  /* 表单端点：填入 Formspree（https://formspree.io/f/xxxxxxx）或任意可接收 multipart/form-data 的地址即自动启用。
     留空 / 占位符时，表单改为打开本地邮件客户端并预填内容，避免询盘静默丢失。 */
  const FORM_ENDPOINT = "https://formsubmit.co/ajax/sales@alloyti.com"; // 留空则回到「邮件兜底」模式
  /* FormSubmit 源站 2026-11-04 起全线 522（Cloudflare 回源超时，owner_action_required），
     激活邮件根本发不出来。暂将其从发送链中摘除，等其恢复把下面的开关改回 true 即可。 */
  const FORM_ENDPOINT_ENABLED = false;
  const WEB3FORMS_KEY = ""; // 在 web3forms.com 用邮箱免费领取 access key 后填到这里；填了则优先走它
  const SALES_EMAIL = "sales@alloyti.com";

  const FORM_MSG = {
    zh: {
      sending: "正在发送…",
      ok: "✓ 询盘已发送，我们会在一个工作日内回复。",
      fallback: "已生成询价邮件，请在邮件客户端中点击发送。若未自动弹出，请直接发至 " + SALES_EMAIL + "。",
      fail: "✕ 发送失败，请直接发邮件至 " + SALES_EMAIL + "，我们会立即跟进。",
      copied: "询价内容已复制到剪贴板。请在邮件客户端中点击发送；若没有弹出邮件窗口，请把内容粘贴到网页邮箱并发送至 " + SALES_EMAIL + "。",
      fileNote: "（图纸请在邮件中手动附加）"
    },
    en: {
      sending: "Sending…",
      ok: "✓ Enquiry sent — we will reply within one business day.",
      fallback: "An enquiry email has been prepared — please press Send in your mail app. If nothing opened, email " + SALES_EMAIL + " directly.",
      fail: "✕ Sending failed. Please email " + SALES_EMAIL + " directly and we will follow up right away.",
      copied: "Enquiry details copied to your clipboard. Press Send in your mail app — or paste them into webmail and send to " + SALES_EMAIL + ".",
      fileNote: " (please attach your drawing to the email)"
    },
    ar: {
      sending: "جارٍ الإرسال…",
      ok: "✓ تم إرسال الاستفسار — سنرد خلال يوم عمل واحد.",
      fallback: "تم تجهيز رسالة استفسار — يرجى الضغط على إرسال في تطبيق البريد. إذا لم يفتح شيء، راسلنا مباشرة على " + SALES_EMAIL + ".",
      fail: "✕ فشل الإرسال. يرجى مراسلتنا مباشرة على " + SALES_EMAIL + " وسنتابع فورًا.",
      copied: "تم نسخ تفاصيل الاستفسار. اضغط إرسال في تطبيق البريد — أو الصقها في بريد الويب وأرسلها إلى " + SALES_EMAIL + ".",
      fileNote: " (يرجى إرفاق الرسم بالبريد)"
    },
    ru: {
      sending: "Отправка…",
      ok: "✓ Запрос отправлен — ответим в течение одного рабочего дня.",
      fallback: "Письмо-запрос подготовлено — нажмите «Отправить» в почтовой программе. Если окно не открылось, напишите на " + SALES_EMAIL + ".",
      fail: "✕ Не удалось отправить. Напишите напрямую на " + SALES_EMAIL + ", мы ответим сразу.",
      copied: "Данные запроса скопированы. Нажмите «Отправить» в почтовой программе — или вставьте их в веб-почту и отправьте на " + SALES_EMAIL + ".",
      fileNote: " (чертёж приложите к письму вручную)"
    },
    de: {
      sending: "Wird gesendet…",
      ok: "✓ Anfrage gesendet — wir antworten innerhalb eines Werktags.",
      fallback: "Eine Anfrage-E-Mail wurde vorbereitet — bitte im Mailprogramm auf Senden klicken. Falls sich nichts öffnet, schreiben Sie direkt an " + SALES_EMAIL + ".",
      fail: "✕ Senden fehlgeschlagen. Bitte direkt an " + SALES_EMAIL + " schreiben, wir melden uns umgehend.",
      copied: "Anfragedaten in die Zwischenablage kopiert. Im Mailprogramm auf Senden klicken — oder in Webmail einfügen und an " + SALES_EMAIL + " senden.",
      fileNote: " (Zeichnung bitte manuell anhängen)"
    }
  };

  const inqForm = document.getElementById("inquiryForm");
  const startTs = document.getElementById("startTs");
  const formLang = document.getElementById("formLang");

  function stampForm() { if (startTs) startTs.value = Math.floor(Date.now() / 1000); }
  stampForm();

  if (inqForm) {
    formLang.value = lang;

    // 解析端点：显式配置优先，其次读取 action；占位符视为未配置
    let endpoint = (FORM_ENDPOINT || inqForm.getAttribute("action") || "").trim();
    if (!/^https?:\/\//.test(endpoint) || /X{6,}/.test(endpoint)) {
      endpoint = "";
    } else if (/formsubmit\.co\/ajax\//.test(endpoint)) {
      // 无 JS 时退化为原生 multipart 提交（FormSubmit 支持附件）
      inqForm.setAttribute("action", endpoint.replace("/ajax/", "/"));
      inqForm.setAttribute("enctype", "multipart/form-data");
      [["_captcha", "false"], ["_template", "table"]].forEach(function (pair) {
        if (!inqForm.elements[pair[0]]) {
          const i = document.createElement("input");
          i.type = "hidden"; i.name = pair[0]; i.value = pair[1];
          inqForm.appendChild(i);
        }
      });
    } else {
      inqForm.setAttribute("action", endpoint);
    }

    // 停留过久（超过服务端 2 小时窗口）时重新打时间戳，避免被误判为过期
    inqForm.addEventListener("focusin", () => {
      const now = Math.floor(Date.now() / 1000);
      if (now - Number(startTs.value || 0) > 6000) stampForm();
    });

    const formStatus = document.getElementById("formStatus");
    const msg = FORM_MSG[lang] || FORM_MSG.en;

    function val(name) {
      const el = inqForm.elements[name];
      return el && typeof el.value === "string" ? el.value.trim() : "";
    }

    // AJAX 提交用的 JSON 负载（仅文本字段 + FormSubmit 控制字段）
    function payload() {
      const out = { _subject: "New ALLOYTI titanium enquiry", _template: "table", _captcha: "false", _honey: "" };
      const fd = new FormData(inqForm);
      fd.forEach(function (v, k) { if (typeof v === "string" && k !== "website") out[k] = v; });
      out._replyto = out.email || "";
      return out;
    }

    // 兜底通道：把表单内容拼成一封预填邮件，并复制一份到剪贴板（网页邮箱用户可直接粘贴）
    function composeBody() {
      const fileEl = inqForm.elements["drawing"];
      const fileName = fileEl && fileEl.files && fileEl.files[0] ? fileEl.files[0].name : "";
      const subject = "Titanium enquiry — " + (val("product") || "general");
      const lines = [
        "Subject: " + subject,
        "",
        "Product form: " + val("product"),
        "Grade: " + val("grade"),
        "Company: " + val("company"),
        "Contact: " + val("name"),
        "Email: " + val("email"),
        "Country / Region: " + val("country"),
        "Size / quantity / tolerance: " + val("spec"),
        "Destination & target lead time: " + val("dest"),
        "Service conditions & documents: " + val("message"),
        "Page language: " + lang
      ];
      if (fileName) lines.push("Drawing to attach: " + fileName + " " + msg.fileNote);
      return lines.filter(function (l) { return l.indexOf(": ") === l.length - 2 ? false : true; }).join("\r\n").slice(0, 1800);
    }

    function openMailFallback() {
      const body = composeBody();
      const subject = "Titanium enquiry — " + (val("product") || "general");
      function launch(text) {
        try { window.location.href = "mailto:" + SALES_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text); }
        catch (e) { /* ignore */ }
      }
      function plain() {
        if (formStatus) { formStatus.className = "form-status is-warn"; formStatus.textContent = msg.fallback; }
        launch(body);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(body).then(function () {
          if (formStatus) { formStatus.className = "form-status is-warn"; formStatus.textContent = msg.copied; }
          launch(body);
        }).catch(plain);
      } else {
        plain();
      }
    }

    // FormSubmit 的 AJAX 接口不收附件：有图纸时走隐藏 iframe 的原生 multipart 提交
    function submitWithAttachment(btn) {
      let sink = document.getElementById("fsSink");
      if (!sink) {
        sink = document.createElement("iframe");
        sink.id = "fsSink"; sink.name = "fsSink";
        sink.style.cssText = "display:none;width:0;height:0;border:0";
        sink.setAttribute("aria-hidden", "true");
        document.body.appendChild(sink);
      }
      inqForm.setAttribute("target", "fsSink");
      inqForm.setAttribute("action", endpoint.replace("/ajax/", "/"));
      inqForm.setAttribute("method", "post");
      inqForm.setAttribute("enctype", "multipart/form-data");
      if (btn) btn.disabled = true;
      if (formStatus) { formStatus.className = "form-status is-loading"; formStatus.textContent = msg.sending; }
      HTMLFormElement.prototype.submit.call(inqForm);
      window.setTimeout(function () {
        if (formStatus) { formStatus.className = "form-status is-ok"; formStatus.textContent = msg.ok; }
        inqForm.reset();
        inqForm.removeAttribute("target");
        stampForm();
        if (btn) btn.disabled = false;
      }, 2500);
    }

    inqForm.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (!inqForm.reportValidity()) return;
      // 蜜罐字段：机器人填写则静默丢弃
      if (val("website")) { inqForm.reset(); return; }

      formLang.value = lang;
      stampForm();

      const btn = inqForm.querySelector('button[type="submit"]');

      const fileEl = inqForm.elements["drawing"];
      const hasFile = !!(fileEl && fileEl.files && fileEl.files[0]);

      // 服务商容灾链：Web3Forms（若配置 key）→ FormSubmit → 邮件兜底
      const providers = [];
      if (WEB3FORMS_KEY) providers.push("web3forms");
      if (endpoint && FORM_ENDPOINT_ENABLED) providers.push("formsubmit");
      if (!providers.length) { openMailFallback(); return; }

      if (btn) btn.disabled = true;
      if (formStatus) { formStatus.className = "form-status is-loading"; formStatus.textContent = msg.sending; }

      async function postJSON(url, body, timeoutMs) {
        const ctrl = new AbortController();
        const timer = window.setTimeout(function () { ctrl.abort(); }, timeoutMs || 12000);
        try {
          return await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: body,
            signal: ctrl.signal
          });
        } finally { window.clearTimeout(timer); }
      }

      let sent = false;
      for (const provider of providers) {
        try {
          if (provider === "web3forms") {
            // Web3Forms：multipart 直传，天然支持附件
            const fd = new FormData(inqForm);
            fd.set("access_key", WEB3FORMS_KEY);
            fd.set("subject", "New ALLOYTI titanium enquiry");
            fd.set("from_name", "ALLOYTI Website");
            fd.set("botcheck", "");
            const res = await fetch("https://api.web3forms.com/submit", {
              method: "POST", body: fd, headers: { Accept: "application/json" }
            });
            let data = null; try { data = await res.json(); } catch (e) { data = null; }
            if (!res.ok || !data || data.success !== true) throw new Error("web3forms HTTP " + res.status);
          } else {
            const isFormSubmit = /formsubmit\.co/.test(endpoint);
            // 带附件：FormSubmit AJAX 不支持文件，改走原生 multipart（隐藏 iframe）
            if (hasFile && isFormSubmit) { submitWithAttachment(btn); return; }
            let res;
            if (isFormSubmit) {
              res = await postJSON(endpoint, JSON.stringify(payload()), 12000);
            } else {
              const ctrl = new AbortController();
              const timer = window.setTimeout(function () { ctrl.abort(); }, 12000);
              try {
                res = await fetch(endpoint, {
                  method: "POST",
                  body: new FormData(inqForm),
                  headers: { Accept: "application/json" },
                  signal: ctrl.signal
                });
              } finally { window.clearTimeout(timer); }
            }
            let data = null;
            try { data = await res.json(); } catch (e) { data = null; }
            if (!res.ok) throw new Error("HTTP " + res.status);
            if (data && (data.success === "false" || data.success === false)) throw new Error(data.message || "rejected");
          }
          sent = true;
          break;
        } catch (err) { /* 换下一个服务商 */ }
      }

      if (sent) {
        if (formStatus) { formStatus.className = "form-status is-ok"; formStatus.textContent = msg.ok; }
        inqForm.reset();
        stampForm();
      } else {
        openMailFallback();
      }
      if (btn) btn.disabled = false;
    });
  }

  /* ================= 页脚年份 ================= */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ================= 初始化语言 ================= */
  applyLang(lang);

  // 语言切换引发重载后，恢复原来的滚动位置
  try {
    const keepY = sessionStorage.getItem("ts-scroll");
    if (keepY !== null) {
      sessionStorage.removeItem("ts-scroll");
      const y = parseInt(keepY, 10) || 0;
      if (y > 0) requestAnimationFrame(function () { window.scrollTo(0, y); });
    }
  } catch (e) { /* ignore */ }
})();
