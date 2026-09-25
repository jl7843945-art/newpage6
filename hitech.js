/* =========================================================
   HUD · 首页背景动画（仅 index.html 加载）
   粒子网格网络（漂浮节点 + 邻近连线 + 数据光点）
   纯装饰，不影响内容与功能；遵守 prefers-reduced-motion
   ========================================================= */
(function () {
  "use strict";
  var canvas = document.getElementById("meshCanvas");
  if (!canvas || !canvas.getContext) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ctx = canvas.getContext("2d");
  var nodes = [], packets = [], w = 0, h = 0, dpr = 1, raf = 0;

  function resize() {
    var host = canvas.parentElement;
    var r = host ? host.getBoundingClientRect() : { width: 800, height: 600 };
    w = Math.max(1, r.width); h = Math.max(1, r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    var count = Math.round(Math.min(90, (w * h) / 16000));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
        big: Math.random() < 0.12
      });
    }
  }

  function step() {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
    }
    for (var p = packets.length - 1; p >= 0; p--) {
      var pk = packets[p];
      pk.t += 0.012;
      if (pk.t >= 1) { packets.splice(p, 1); continue; }
      var a = nodes[pk.a], b = nodes[pk.b];
      if (!a || !b) { packets.splice(p, 1); continue; }
      pk.x = a.x + (b.x - a.x) * pk.t;
      pk.y = a.y + (b.y - a.y) * pk.t;
    }
    if (!reduce && Math.random() < 0.02 && packets.length < 10) {
      var i2 = Math.floor(Math.random() * nodes.length);
      var j = Math.floor(Math.random() * nodes.length);
      if (i2 !== j) packets.push({ a: i2, b: j, t: 0 });
    }
  }

  function draw() {
    step();
    ctx.clearRect(0, 0, w, h);
    var LINK = Math.min(150, Math.max(110, w / 9));
    // 连线
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          var al = (1 - d / LINK) * 0.22;
          ctx.strokeStyle = "rgba(0,229,255," + al.toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    // 数据光点
    for (var k = 0; k < packets.length; k++) {
      var pk = packets[k];
      ctx.beginPath();
      ctx.fillStyle = "rgba(120,230,255," + (0.9 * (1 - Math.abs(pk.t - 0.5) * 2)).toFixed(3) + ")";
      ctx.arc(pk.x, pk.y, 2.2, 0, Math.PI * 2); ctx.fill();
    }
    // 节点
    for (var m = 0; m < nodes.length; m++) {
      var n = nodes[m];
      ctx.beginPath();
      ctx.fillStyle = n.big ? "rgba(124,92,255,.9)" : "rgba(150,235,255,.7)";
      ctx.arc(n.x, n.y, n.big ? n.r * 1.6 : n.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduce) raf = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    if (reduce) { step(); draw(); }   // 静态一帧，仍有网络质感
    else { draw(); }
    window.addEventListener("resize", function () {
      resize();
      if (reduce) { step(); draw(); }
    });
  }

  try { start(); } catch (e) { /* 静默降级 */ }
})();

/* =========================================================
   三体·水滴核心 3D：镜面水滴（旋转体网格）+ 空间环绕光球 + 环绕立体品牌字
   软件 3D：透视投影 + 画家算法深度排序 + Lambert/Blinn-Phong/Fresnel
   品牌字 ALLOYTI 沿圆柱面环绕水滴：切向透视压缩 + 逐字挤出立体侧壁 + 深度明暗
   遵守 prefers-reduced-motion（静态一帧）
   ========================================================= */
(function () {
  "use strict";
  var canvas = document.getElementById("dropletCanvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  var w = 0, h = 0, dpr = 1, PX = 40, cx = 0, cy = 0;
  var CAM = 8;   /* 相机距离（世界单位） */

  function norm3(x, y, z) { var l = Math.sqrt(x * x + y * y + z * z) || 1; return { x: x / l, y: y / l, z: z / l }; }

  /* ---------- 水滴旋转体（单位半径 R=1） ---------- */
  var RINGS = 26, SEGS = 32;
  var DROP = 1.30;          /* 水滴体积放大系数（相对原始半径/高度） */
  var profR = new Float64Array(RINGS + 1), profY = new Float64Array(RINGS + 1);
  var profNR = new Float64Array(RINGS + 1), profNY = new Float64Array(RINGS + 1);
  var COS = new Float64Array(SEGS + 1), SIN = new Float64Array(SEGS + 1);
  (function buildProfile() {
    var i;
    for (i = 0; i <= RINGS; i++) {
      var s = i / RINGS, phi = Math.PI * s;
      profR[i] = DROP * Math.sin(phi) * Math.pow(Math.sin(phi / 2), 0.8);
      profY[i] = DROP * (-1.80 + 2.95 * Math.pow(s, 1.35));
    }
    for (i = 0; i <= RINGS; i++) {
      var i0 = i > 0 ? i - 1 : 0, i1 = i < RINGS ? i + 1 : RINGS;
      var dr = profR[i1] - profR[i0], dy = profY[i1] - profY[i0];
      var len = Math.sqrt(dr * dr + dy * dy) || 1;
      profNR[i] = dy / len;      /* 外法线径向分量 */
      profNY[i] = -dr / len;     /* 外法线竖直分量 */
    }
    for (i = 0; i <= SEGS; i++) {
      var th = i / SEGS * Math.PI * 2;
      COS[i] = Math.cos(th); SIN[i] = Math.sin(th);
    }
  })();

  var NV = (RINGS + 1) * (SEGS + 1);
  var sxA = new Float64Array(NV), syA = new Float64Array(NV), zA = new Float64Array(NV);
  var nxA = new Float64Array(NV), nyA = new Float64Array(NV), nzA = new Float64Array(NV);
  var NQ = RINGS * SEGS;
  var qz = new Float64Array(NQ);
  var qnx = new Float64Array(NQ), qny = new Float64Array(NQ), qnz = new Float64Array(NQ);
  var zAll = null;   /* 尺寸在 ORBITS / BRAND 定义后确定（面片 + 光球 + 品牌字） */
  var sortIdx = [];

  /* ---------- 环绕光球轨道（a=轨道半径，inc=倾角，node=方位，w=角速度，r=球半径） ---------- */
  var ORBITS = [
    { a: 1.95, inc: 0.30, node: 0.35, w: 0.62, ph: 0.5, r: 0.190, col: "150,245,255" },
    { a: 2.25, inc: -0.52, node: 1.15, w: 0.44, ph: 2.3, r: 0.155, col: "176,140,255" },
    { a: 1.72, inc: 1.02, node: 2.40, w: 0.78, ph: 4.1, r: 0.130, col: "205,250,255" },
    { a: 2.35, inc: 0.86, node: 3.60, w: 0.33, ph: 5.2, r: 0.150, col: "140,235,255" },
    { a: 2.05, inc: -0.18, node: 5.00, w: 0.55, ph: 1.4, r: 0.115, col: "186,150,255" }
  ];
  var orbP = [];
  for (var oi = 0; oi < ORBITS.length; oi++) orbP.push({ x: 0, y: 0, z: 0 });

  /* ---------- 环绕水滴的立体品牌字（圆柱面环绕 + 透视压缩 + 空间遮挡） ---------- */
  var BRAND = "ALLOYTI", NL = BRAND.length;
  var RING = {
    a: 1.44,        /* 环绕半径（世界单位；水滴放大后最大半径 ≈1.04） */
    inc: 0.12,      /* 环面自身倾角 */
    y: -0.30,       /* 环心高度：水滴腰部 */
    w: 0.34,        /* 公转角速度 rad/s（约 18s 一圈） */
    fs: 0.70,       /* 字号（世界单位） */
    font: "800 ",
    stack: '"Segoe UI",Roboto,Arial,sans-serif'
  };
  var RCI = Math.cos(RING.inc), RSI = Math.sin(RING.inc);
  var ringP = [];
  for (var bi = 0; bi < NL; bi++) ringP.push({ x: 0, y: 0, z: 0, th: 0 });

  zAll = new Float64Array(NQ + ORBITS.length + NL);
  var OFF_ORB = NQ, OFF_TXT = NQ + ORBITS.length;

  /* ---------- 光照（世界空间；相机位于 -z 方向） ---------- */
  var L1 = norm3(-0.50, 0.74, -0.44);      /* 主光：青白，左上前方 */
  var L2 = norm3(0.78, -0.24, 0.36);       /* 补光：紫，右下后方 */
  var Hv = norm3(L1.x, L1.y, L1.z - 1);    /* 半程向量（视线 ≈ -z） */

  function resize() {
    var host = canvas.parentElement;
    var r = host ? host.getBoundingClientRect() : { width: 300, height: 300 };
    w = Math.max(1, r.width); h = Math.max(1, r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var S = Math.min(w, h);
    PX = S * 0.115;
    cx = w / 2; cy = h * 0.54;
  }

  function orbitXYZ(o, th, ct, st) {
    var x = o.a * Math.cos(th), z0 = o.a * Math.sin(th);
    var cn = Math.cos(o.node), sn = Math.sin(o.node);
    var x1 = x * cn + z0 * sn, z1 = -x * sn + z0 * cn;
    var ci = Math.cos(o.inc), si = Math.sin(o.inc);
    var y1 = -z1 * si, z2 = z1 * ci;
    return { x: x1, y: y1 * ct - z2 * st, z: y1 * st + z2 * ct };
  }

  function proj(p) {
    var k = CAM / (CAM + p.z);
    return { x: cx + p.x * k * PX, y: cy + p.y * k * PX, k: k };
  }

  /* 轨道轨迹：远侧先画（在水滴之后被遮挡），近侧后画 */
  function drawOrbitTrace(o, ct, st, nearSide) {
    var STEPS = 72, prevP = null, prevNear = false;
    for (var i = 0; i <= STEPS; i++) {
      var p = orbitXYZ(o, (i / STEPS) * Math.PI * 2, ct, st);
      var near = p.z < 0;
      if (prevP && near === prevNear && near === nearSide) {
        var q1 = proj(prevP), q2 = proj(p);
        var front = Math.max(0, Math.min(1, (-p.z / o.a + 1) * 0.5));
        ctx.strokeStyle = "rgba(120,225,255," + (0.045 + 0.15 * front).toFixed(3) + ")";
        ctx.lineWidth = Math.max(0.6, 0.9 * q1.k);
        ctx.beginPath(); ctx.moveTo(q1.x, q1.y); ctx.lineTo(q2.x, q2.y); ctx.stroke();
      }
      prevP = p; prevNear = near;
    }
  }

  function drawSphere(p, o, t) {
    var k = CAM / (CAM + p.z);
    var X = cx + p.x * k * PX, Y = cy + p.y * k * PX;
    var rr = o.r * PX * k;
    var front = Math.max(0, Math.min(1, (-p.z / o.a + 1) * 0.5));  /* 1 = 最近 */
    var a = 0.30 + 0.62 * front;
    var pulse = 0.9 + 0.12 * Math.sin(t * 2.1 + o.ph);
    var rg = 3.0 * rr * pulse;
    var g = ctx.createRadialGradient(X, Y, 0, X, Y, rg);
    g.addColorStop(0, "rgba(255,255,255," + (0.92 * a).toFixed(3) + ")");
    g.addColorStop(0.16, "rgba(" + o.col + "," + (0.80 * a).toFixed(3) + ")");
    g.addColorStop(0.42, "rgba(" + o.col + "," + (0.24 * a).toFixed(3) + ")");
    g.addColorStop(1, "rgba(" + o.col + ",0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(X, Y, rg, 0, 6.28318); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255," + (0.85 * a).toFixed(3) + ")";
    ctx.beginPath(); ctx.arc(X, Y, rr * 0.40, 0, 6.28318); ctx.fill();
  }

  /* 品牌字环绕轨迹：远侧先画、近侧后画，与光球轨道同一套遮挡规则 */
  function drawRingTrace(ct, st, nearSide) {
    var STEPS = 96, prev = null, prevNear = false;
    for (var i = 0; i <= STEPS; i++) {
      var th = (i / STEPS) * Math.PI * 2;
      var z0 = RING.a * Math.sin(th);
      var y1 = -z0 * RSI, z2 = z0 * RCI;
      var p = {
        x: RING.a * Math.cos(th),
        y: RING.y + y1 * ct - z2 * st,
        z: y1 * st + z2 * ct
      };
      var near = p.z < 0;
      if (prev && near === prevNear && near === nearSide) {
        var q1 = proj(prev), q2 = proj(p);
        var front = Math.max(0, Math.min(1, (-p.z / RING.a + 1) * 0.5));
        ctx.strokeStyle = "rgba(0,229,255," + (0.030 + 0.075 * front).toFixed(3) + ")";
        ctx.lineWidth = Math.max(0.5, 0.8 * q1.k);
        ctx.beginPath(); ctx.moveTo(q1.x, q1.y); ctx.lineTo(q2.x, q2.y); ctx.stroke();
      }
      prev = p; prevNear = near;
    }
  }

  /* 单个立体字母：切向透视压缩 + 挤出侧壁 + 白青渐变正面 + 深度明暗 */
  function drawLetter(li) {
    var p = ringP[li];
    var k = CAM / (CAM + p.z);
    var X = cx + p.x * k * PX, Y = cy + p.y * k * PX;
    var front = Math.max(0, Math.min(1, (-p.z / RING.a + 1) * 0.5));   /* 1 = 最近 */
    var hSc = 0.30 + 0.70 * Math.abs(Math.sin(p.th));                  /* 圆柱面切向压缩 */
    var fs = RING.fs * PX * k;
    var a = 0.26 + 0.74 * front;
    var ch = BRAND.charAt(li);

    ctx.save();
    ctx.translate(X, Y);
    ctx.scale(hSc, 1);
    ctx.font = RING.font + fs.toFixed(2) + "px " + RING.stack;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    /* 立体侧壁：向右下逐层挤出（与场景主光方向一致） */
    var dep = fs * 0.060;
    ctx.fillStyle = "rgba(6,26,46," + (0.62 * a).toFixed(3) + ")";
    for (var s = 5; s >= 1; s--) ctx.fillText(ch, dep * s * 0.55, dep * s);

    /* 正面：白 → 青渐变 + 青色辉光 */
    var g = ctx.createLinearGradient(0, -fs * 0.42, 0, fs * 0.42);
    g.addColorStop(0, "rgba(255,255,255," + a.toFixed(3) + ")");
    g.addColorStop(0.52, "rgba(222,248,255," + a.toFixed(3) + ")");
    g.addColorStop(1, "rgba(96,224,255," + (a * 0.95).toFixed(3) + ")");
    ctx.fillStyle = g;
    ctx.shadowColor = "rgba(0,229,255," + (0.55 + 0.45 * front).toFixed(3) + ")";
    ctx.shadowBlur = fs * (0.18 + 0.30 * front);
    ctx.fillText(ch, 0, 0);

    ctx.restore();
  }

  function quadPoint(id, ox, oy) {
    var dx = sxA[id] - ox, dy = syA[id] - oy;
    var l = Math.sqrt(dx * dx + dy * dy) || 1;
    ctx.lineTo(sxA[id] + dx / l * 0.6, syA[id] + dy / l * 0.6);  /* 微外扩消除接缝 */
  }

  function drawQuad(qi) {
    var r0 = (qi / SEGS) | 0, c0 = qi - r0 * SEGS;
    var a = r0 * (SEGS + 1) + c0, b = a + 1, c = (r0 + 1) * (SEGS + 1) + c0 + 1, d = c - 1;
    var nx = qnx[qi], ny = qny[qi], nz = qnz[qi];

    var d1 = nx * L1.x + ny * L1.y + nz * L1.z; if (d1 < 0) d1 = 0;          /* 漫反射·主光 */
    var d2 = nx * L2.x + ny * L2.y + nz * L2.z; if (d2 < 0) d2 = 0;          /* 漫反射·补光 */
    var nh = nx * Hv.x + ny * Hv.y + nz * Hv.z;
    var sp = nh > 0 ? Math.pow(nh, 42) : 0;                                   /* 镜面高光 */
    var fv = nz < 0 ? -nz : 0;                                                /* 菲涅尔边缘光 */
    var fres = Math.pow(1 - fv, 3);

    var r = 7 + d1 * 34 + d2 * 78 + sp * 255 + fres * 70;
    var g = 28 + d1 * 138 + d2 * 58 + sp * 255 + fres * 190;
    var bl = 50 + d1 * 178 + d2 * 168 + sp * 255 + fres * 215;
    if (r > 255) r = 255; if (g > 255) g = 255; if (bl > 255) bl = 255;
    ctx.fillStyle = "rgb(" + (r | 0) + "," + (g | 0) + "," + (bl | 0) + ")";

    var ox = (sxA[a] + sxA[b] + sxA[c] + sxA[d]) * 0.25;
    var oy = (syA[a] + syA[b] + syA[c] + syA[d]) * 0.25;
    ctx.beginPath();
    quadPoint(a, ox, oy); quadPoint(b, ox, oy); quadPoint(c, ox, oy); quadPoint(d, ox, oy);
    ctx.closePath();
    ctx.fill();
  }

  function cmp(a, b) { return zAll[b] - zAll[a]; }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);

    var ay = t * 0.55;                                /* 水滴自转 */
    var tilt = -0.30 + Math.sin(t * 0.17) * 0.06;     /* 视角俯仰漂移 */
    var squash = 1 + Math.sin(t * 1.1) * 0.03;        /* 液态呼吸微形变 */
    var caY = Math.cos(ay), saY = Math.sin(ay);
    var ct = Math.cos(tilt), st = Math.sin(tilt);
    var inv = 1 / squash;

    /* --- 顶点变换（自转 → 俯仰 → 透视投影） --- */
    for (var i = 0; i <= RINGS; i++) {
      var pr = profR[i], py = profY[i] * squash, nr = profNR[i], nvy = profNY[i] * inv;
      for (var j = 0; j <= SEGS; j++) {
        var cj = COS[j], sj = SIN[j];
        var x1 = pr * cj, z1 = pr * sj;
        var X = x1 * caY + z1 * saY, Z0 = -x1 * saY + z1 * caY;
        var Y2 = py * ct - Z0 * st, Z2 = py * st + Z0 * ct;
        var k = CAM / (CAM + Z2);
        var id = i * (SEGS + 1) + j;
        sxA[id] = cx + X * k * PX; syA[id] = cy + Y2 * k * PX; zA[id] = Z2;

        var nx1 = nr * cj, nz1 = nr * sj;
        var NX = nx1 * caY + nz1 * saY, NZ0 = -nx1 * saY + nz1 * caY;
        nxA[id] = NX; nyA[id] = nvy * ct - NZ0 * st; nzA[id] = nvy * st + NZ0 * ct;
      }
    }

    /* --- 面片深度与法线 --- */
    for (var qi = 0; qi < NQ; qi++) {
      var r0 = (qi / SEGS) | 0, c0 = qi - r0 * SEGS;
      var va = r0 * (SEGS + 1) + c0, vb = va + 1, vc = (r0 + 1) * (SEGS + 1) + c0 + 1, vd = vc - 1;
      qz[qi] = (zA[va] + zA[vb] + zA[vc] + zA[vd]) * 0.25;
      var mx = (nxA[va] + nxA[vb] + nxA[vc] + nxA[vd]) * 0.25;
      var my = (nyA[va] + nyA[vb] + nyA[vc] + nyA[vd]) * 0.25;
      var mz = (nzA[va] + nzA[vb] + nzA[vc] + nzA[vd]) * 0.25;
      var ml = Math.sqrt(mx * mx + my * my + mz * mz) || 1;
      qnx[qi] = mx / ml; qny[qi] = my / ml; qnz[qi] = mz / ml;
    }

    /* --- 中心氛围辉光（随水滴体积同步放大） --- */
    var gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, PX * 2.75);
    gg.addColorStop(0, "rgba(0,229,255,.16)");
    gg.addColorStop(0.55, "rgba(124,92,255,.07)");
    gg.addColorStop(1, "rgba(0,229,255,0)");
    ctx.fillStyle = gg;
    ctx.beginPath(); ctx.arc(cx, cy, PX * 2.75, 0, 6.28318); ctx.fill();

    /* --- 轨道远侧轨迹 --- */
    for (var o1 = 0; o1 < ORBITS.length; o1++) drawOrbitTrace(ORBITS[o1], ct, st, false);

    /* --- 品牌字环带远侧轨迹 --- */
    drawRingTrace(ct, st, false);

    /* --- 光球当前位置 --- */
    for (var o2 = 0; o2 < ORBITS.length; o2++) {
      orbP[o2] = orbitXYZ(ORBITS[o2], ORBITS[o2].ph + t * ORBITS[o2].w, ct, st);
    }

    /* --- 品牌字当前位置（沿圆柱面公转） --- */
    for (var b1 = 0; b1 < NL; b1++) {
      var th = RING.w * t + (b1 / NL) * Math.PI * 2;
      var z0 = RING.a * Math.sin(th);
      var y1 = -z0 * RSI, z2 = z0 * RCI;
      var LP = ringP[b1];
      LP.x = RING.a * Math.cos(th);
      LP.y = RING.y + y1 * ct - z2 * st;
      LP.z = y1 * st + z2 * ct;
      LP.th = th;
    }

    /* --- 画家算法：远 → 近（水滴面片 / 光球 / 品牌字统一排序，实现真实前后遮挡） --- */
    var n = 0;
    for (var q2 = 0; q2 < NQ; q2++) { zAll[n] = qz[q2]; n++; }
    for (var o3 = 0; o3 < ORBITS.length; o3++) { zAll[n] = orbP[o3].z; n++; }
    for (var b2 = 0; b2 < NL; b2++) { zAll[n] = ringP[b2].z; n++; }
    sortIdx.length = n;
    for (var s3 = 0; s3 < n; s3++) sortIdx[s3] = s3;
    sortIdx.sort(cmp);
    for (var k2 = 0; k2 < n; k2++) {
      var id2 = sortIdx[k2];
      if (id2 < OFF_ORB) drawQuad(id2);
      else if (id2 < OFF_TXT) drawSphere(orbP[id2 - OFF_ORB], ORBITS[id2 - OFF_ORB], t);
      else drawLetter(id2 - OFF_TXT);
    }

    /* --- 品牌字环带近侧轨迹 --- */
    drawRingTrace(ct, st, true);

    /* --- 轨道近侧轨迹 --- */
    for (var o4 = 0; o4 < ORBITS.length; o4++) drawOrbitTrace(ORBITS[o4], ct, st, true);
  }

  function start() {
    resize();
    if (reduce) { draw(1.6); }
    else {
      var t0 = null;   /* 统一使用 rAF 时间戳，避免与 Date.now 基准混用 */
      (function loop(now) {
        var ms = (typeof now === "number") ? now : Date.now();
        if (t0 === null) t0 = ms;
        draw((ms - t0) / 1000);
        requestAnimationFrame(loop);
      })();
    }
    window.addEventListener("resize", function () { resize(); if (reduce) draw(1.6); });
  }
  try { start(); } catch (e) { /* 静默降级 */ }
})();
