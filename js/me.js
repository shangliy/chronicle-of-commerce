/* 中洲纪年 · 引擎：地图 + 时光机 + 编年 + 传说 + 战役 */
(function () {
  "use strict";
  const W = window.WORLD, D = window.ME, BATTLES = window.ME_BATTLES || [];
  const CH = window.ME_CHARS || { CHARS: [], HEROES: {}, RACES: [] }, CB = window.CHIBI;
  const CI = {}; CH.CHARS.forEach((c) => (CI[c.id] = c));
  const RACE = Object.fromEntries(CH.RACES);
  const NS = "http://www.w3.org/2000/svg";
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function el(tag, attrs = {}, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  const EN = window.ME_LANG === "en";
  const H3 = window.ME_STYLE === "h3" ? window.ME_H3 : null;
  const tr = (s) => (EN && window.ME_UI && window.ME_UI[s]) || s;
  const dot = (...a) => a.filter(Boolean).join(" · ");
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  /* ——曲线工具—— */
  function cr(pts, closed) { // Catmull-Rom → 三次贝塞尔
    const n = pts.length; if (n < 2) return "";
    const P = (i) => (closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)]);
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]},${p2[1]}`;
    }
    return d + (closed ? "Z" : "");
  }
  function sample(pts, step) { // 沿折线等距取点（先用 CR 加密）
    const dense = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let s = 0; s < 1; s += 0.1) {
        const t = s, t2 = t * t, t3 = t2 * t;
        dense.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
      }
    }
    dense.push(pts[pts.length - 1]);
    const out = [dense[0]]; let acc = 0;
    for (let i = 1; i < dense.length; i++) {
      const dx = dense[i][0] - dense[i - 1][0], dy = dense[i][1] - dense[i - 1][1], L = Math.hypot(dx, dy); acc += L;
      if (acc >= step) { out.push([dense[i][0], dense[i][1], Math.atan2(dy, dx)]); acc = 0; }
    }
    return out;
  }
  function inPoly(x, y, pts) { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; }

  /* ——时间标尺：按纪元分段加权—— */
  const ERAS = D.ERAS; const WT = ERAS.reduce((s, e) => s + e.w, 0); let acc = 0;
  ERAS.forEach((e) => { e.p0 = acc / WT; acc += e.w; e.p1 = acc / WT; });
  const T0 = ERAS[0].a, T1 = ERAS[ERAS.length - 1].b;
  const eraOf = (t) => ERAS.find((e) => t >= e.a && t < e.b) || (t < T0 ? ERAS[0] : ERAS[ERAS.length - 1]);
  const posOf = (t) => { const e = eraOf(t); return clamp(e.p0 + ((t - e.a) / (e.b - e.a)) * (e.p1 - e.p0), 0, 1); };
  const tAt = (p) => { p = clamp(p, 0, 1); const e = ERAS.find((x) => p >= x.p0 && p <= x.p1) || ERAS[ERAS.length - 1]; return e.a + ((p - e.p0) / (e.p1 - e.p0)) * (e.b - e.a); };
  function age(t) {
    if (t < 0) return { n: EN ? "YT" : "双树纪", y: null };
    if (t < 591) return { n: tr("第一纪元"), y: Math.max(1, Math.floor(t)), off: 0 };
    if (t < 4032) return { n: tr("第二纪元"), y: Math.floor(t - 590), off: 590 };
    if (t < 7053) return { n: tr("第三纪元"), y: Math.floor(t - 4031), off: 4031 };
    return { n: tr("第四纪元"), y: Math.floor(t - 7052), off: 7052 };
  }
  function md(t) { const f = (t - Math.floor(t)) * 365.25, m = Math.min(12, Math.floor(f / 30.44) + 1), d = Math.min(30, Math.floor(f - (m - 1) * 30.44) + 1); return [m, d]; }
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmt(t, withDay) {
    const a = age(t); if (a.y == null) return a.n;
    if (EN) { let s = `${a.n} ${a.y}`; if (withDay) { const [m, d] = md(t); s += `, ${d} ${MON[m - 1]}`; } return s; }
    let s = `${a.n} ${a.y} 年`;
    if (withDay) { const [m, d] = md(t); s += ` ${m} 月 ${d} 日`; }
    return s;
  }
  const fine = (t) => { const e = eraOf(t).id; return e === "war" || e === "hobbit"; };
  const hasDay = (t) => Math.abs(t - Math.round(t)) > 1e-6 && t > 6900;

  /* ——地点索引—— */
  const P = {}; D.PLACES.forEach((p) => (P[p.id] = p));
  const xy = (at) => (Array.isArray(at) ? at : P[at] ? [P[at].x, P[at].y] : [400, 300]);
  const placeName = (at) => (typeof at === "string" && P[at] ? P[at].n : "");

  /* ======================= 地图 ======================= */
  const svg = $("#map"); const [BX, BY, BW, BH] = W.box;
  const cam = { x: 80, y: -80, w: 940 };
  let cw = 1, ch = 1;
  const L = {};
  function chibiDefs() {
    if (!CB) return "";
    let s = CH.CHARS.map((c) => `<g id="chb-${c.id}">${CB(c.look)}</g>`).join("");
    if (CI.aragorn) s += `<g id="chb-elessar">${CB({ ...CI.aragorn.look, hat: "crown", hc: "#e8ecf0", c: "#1a1a2e", t: "#c8c8d8", it: "sword", ic: "#e8f4ff" })}</g>`;
    Object.entries(CH.SOLDIERS || {}).forEach(([k, look]) => (s += `<g id="chb-sol-${k}">${CB(look)}</g>`));
    return s + `<g id="chb-horse">${CB.horse()}</g><g id="chb-hull">${CB.hull}</g><g id="chb-sail">${CB.sail}</g>`;
  }
  const DECO = window.ME_DECO || {};
  function scatter(poly, d, sd) { // 多边形内均匀撒点
    seed = sd; const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const n = Math.round((x1 - x0) * (y1 - y0) * d), out = [];
    for (let i = 0; i < n * 4 && out.length < n; i++) { const x = lerp(x0, x1, rnd()), y = lerp(y0, y1, rnd()); if (inPoly(x, y, poly)) out.push([x, y]); }
    return out.sort((a, b) => a[1] - b[1]);
  }
  const f1 = (v) => v.toFixed(1);
  function seaDeco() {
    const g = el("g", { class: "sea-deco" }, svg); let d = ""; seed = 99;
    for (let i = 0; i < 1100; i++) { const x = lerp(BX, BX + BW, rnd()), y = lerp(BY, BY + BH, rnd()), w = 3 + rnd() * 3; d += `M${f1(x)},${f1(y)}q${f1(w / 2)},${f1(-w / 2.6)} ${f1(w)},0t${f1(w)},0`; }
    el("path", { d, class: "wave" }, g);
    (DECO.SEA || []).forEach((o, i) => {
      const gg = el("g", { class: "sea-o sea-" + o.k, transform: `translate(${o.x},${o.y}) scale(${(o.flip ? -1 : 1) * o.s},${o.s})` }, g);
      if (o.from != null) { gg.dataset.from = o.from; gg.dataset.to = o.to; }
      gg.innerHTML = SEA_ART[o.k] || "";
      gg.style.animationDelay = -i * 1.3 + "s";
    });
  }
  const SEA_ART = {
    ship: `<g class="bobsea"><path d="M-12,0L12,0L8,5H-8Z" fill="#8a6a4a" stroke="#3a2a1a" stroke-width=".7"/><path d="M0,0V-16" stroke="#3a2a1a" stroke-width=".8"/><path d="M0.6,-15Q8,-10 0.6,-3Z" fill="#f2ead6" stroke="#3a2a1a" stroke-width=".6"/><path d="M-0.6,-13Q-6,-9 -0.6,-4Z" fill="#e8dcc0" stroke="#3a2a1a" stroke-width=".5"/><path d="M0,-16L4,-17.4L0,-18.4" fill="#a03a2a"/><path d="M-16,6q3,-2 6,0t6,0M8,6q3,-2 6,0" fill="none" stroke="#7f8f88" stroke-width=".7"/></g>`,
    serpent: `<g class="bobsea"><path d="M-22,2Q-18,-8 -12,2Q-6,-8 0,2Q6,-8 12,2" fill="none" stroke="#4a6a5a" stroke-width="3" stroke-linecap="round"/><path d="M12,2Q15,-8 20,-8Q25,-8 24,-4L19,-3" fill="#5a7a6a" stroke="#2a3a32" stroke-width=".8"/><circle cx="21" cy="-6.4" r=".8" fill="#e8e0a0"/><path d="M-12,-3l-1,-3l2,1M0,-3l-1,-3l2,1" fill="none" stroke="#2a3a32" stroke-width=".7"/><path d="M-26,4q4,-2 8,0t8,0t8,0t8,0t8,0" fill="none" stroke="#7f8f88" stroke-width=".7"/></g>`,
    whirl: `<path d="M0,0m-8,0a8,5 0 1,1 16,0a6,3.6 0 1,1 -12,0a4,2.4 0 1,1 8,0a2,1.2 0 1,1 -4,0" fill="none" stroke="#7f8f88" stroke-width=".8"/>`,
    whale: `<g class="bobsea"><path d="M-14,0Q-12,-8 0,-8Q12,-8 14,0Z" fill="#6a7a80" stroke="#2a3a40" stroke-width=".7"/><path d="M14,0L20,-5L19,2Z" fill="#6a7a80" stroke="#2a3a40" stroke-width=".7"/><circle cx="-8" cy="-4" r=".8" fill="#1a1a1a"/><path d="M-6,-9Q-8,-14 -10,-13M-6,-9Q-4,-14 -2,-13" fill="none" stroke="#9fb4ba" stroke-width=".8"/></g>`
  };
  function texture(list, cls, draw, sd) {
    list.forEach((a, i) => {
      const g = el("g", { class: "tx " + cls + (a.ash ? " ash" : a.sand ? " sand" : a.dead ? " dead" : a.rock ? " rock" : "") }, a.fa ? L.bel : L.ter); let d = "";
      scatter(a.pts, a.d, sd + i * 31).forEach(([x, y]) => (d += draw(x, y, a)));
      el("path", { d }, g);
      if (a.from != null) { g.dataset.from = a.from; L.timed.push(g); }
      if (a.n && cls !== "grass") { const lg = el("g", { class: "lbl tx-l", transform: `translate(${f1(centroid(a.pts)[0])},${f1(centroid(a.pts)[1] + 2)})` }, a.fa ? L.bel : L.ter); const s2 = el("g", { class: "sc" }, lg); s2.style.setProperty("--fs", 8); el("text", { class: "lbl-n it" }, s2).textContent = a.n; }
    });
  }
  function terrainDeco() {
    L.timed = L.timed || [];
    texture(DECO.HILLS || [], "hills", (x, y, a) => a.rock ? `M${f1(x - 3)},${f1(y)}l1.6,-3.4l1.8,1.2l1.4,-2.6l1.8,4.8z` : `M${f1(x - 4.5)},${f1(y)}q4.5,-6 9,0M${f1(x - 1.6)},${f1(y - 1.4)}l1.2,1.2M${f1(x + 0.6)},${f1(y - 2.2)}l1.4,1.6`, 11);
    texture(DECO.MARSH || [], "marsh", (x, y) => `M${f1(x - 3)},${f1(y)}h6M${f1(x - 1)},${f1(y)}v-3M${f1(x + 0.6)},${f1(y)}v-2.2M${f1(x + 1.8)},${f1(y)}l1,-2`, 21);
    texture(DECO.WASTE || [], "waste", (x, y, a) => a.sand ? `M${f1(x - 3)},${f1(y)}q3,-2 6,0` : `M${f1(x)},${f1(y)}h.6`, 31);
    texture(DECO.GRASS || [], "grass", (x, y) => `M${f1(x - 1.2)},${f1(y)}l-.8,-2M${f1(x)},${f1(y)}v-2.6M${f1(x + 1.2)},${f1(y)}l.8,-2`, 41);
    const F = DECO.FIELDS; if (F) {
      const g = el("g", { class: "fields" }, L.ter); seed = 5;
      for (let i = 0; i < F.n; i++) { const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()), x = F.cx + Math.cos(a) * r * F.rx, y = F.cy + Math.sin(a) * r * F.ry, w = 2.2 + rnd() * 2.6, h = 1.6 + rnd() * 1.8;
        el("rect", { x: f1(x - w / 2), y: f1(y - h / 2), width: f1(w), height: f1(h), class: "fld f" + (i % 4), transform: `rotate(${Math.round(rnd() * 50 - 25)} ${f1(x)} ${f1(y)})` }, g); }
      g.dataset.from = 4031 + 1601; L.timed.push(g);
    }
  }
  function roadsDeco() {
    L.roads = el("g", { class: "roads" }, L.ter);
    (DECO.ROADS || []).forEach((r) => {
      const d = cr(r.pts), g = r.fa ? L.bel : L.roads;
      el("path", { d, class: "road-b" }, g); el("path", { d, class: "road" }, g);
    });
    (DECO.BRIDGES || []).forEach(([x, y, a]) => el("path", { d: "M-3.4,-1.4Q0,-3.4 3.4,-1.4M-3.4,1.4Q0,3.4 3.4,1.4", class: "bridge", transform: `translate(${x},${y}) rotate(${a})` }, L.roads));
    (DECO.BEACONS || []).forEach(([x, y], i) => { const g = el("g", { class: "beacon", transform: `translate(${x},${y})` }, L.roads); el("path", { d: "M-1.6,0L0,-2.6L1.6,0Z", class: "bc-b" }, g); el("path", { d: "M-1,-2.6Q0,-6 1,-2.6Z", class: "bc-f", style: `animation-delay:-${i * 0.3}s` }, g); });
  }
  /* ======== “英雄”风格（ME_STYLE=h3）：地形区块、森林、冒险物件、骑马英雄、小地图 ======== */
  let MM = null;
  function rough(pts, amp, sd) { // 把多边形边缘加密并抖动，变成自然的地形边界
    seed = sd; const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], L2 = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L2 / 7));
      const nx = -(b[1] - a[1]) / (L2 || 1), ny = (b[0] - a[0]) / (L2 || 1);
      for (let k = 0; k < n; k++) { const t = k / n, j = (rnd() - 0.5) * 2 * amp; out.push([+(lerp(a[0], b[0], t) + nx * j).toFixed(1), +(lerp(a[1], b[1], t) + ny * j).toFixed(1)]); }
    }
    return cr(out, true);
  }
  function biomes(k, parent) {
    const g = el("g", { class: "biomes", "clip-path": `url(#clip-${k})` }, parent), fa = k === "bel";
    const list = [...H3.BIOMES.filter((b) => b.clip === k)];
    const D2 = DECO, mine = (a) => !!a.fa === fa;
    (D2.MARSH || []).filter(mine).forEach((a) => list.push({ t: "swamp", pts: a.pts, a: 5 }));
    (D2.WASTE || []).filter(mine).forEach((a) => list.push({ t: a.ash ? (fa ? "ash" : "lava") : a.sand ? "sand" : "dry", pts: a.pts, from: a.from, a: 6 }));
    (D2.HILLS || []).filter(mine).filter((a) => a.rock).forEach((a) => list.push({ t: "rough", pts: a.pts, a: 4 }));
    L.timed = L.timed || [];
    list.forEach((b, i) => {
      const p = el("path", { d: rough(b.pts, b.a || 9, 300 + i * 17 + (fa ? 1000 : 0)), class: "biome b-" + b.t, fill: `url(#tx-${b.t})` }, g);
      if (b.from != null) { p.dataset.from = b.from; L.timed.push(p); }
    });
  }
  function h3Forest(f, g, x0, x1, y0, y1, n) {
    const dk = /mirkwood|oldforest|fangorn|taur|nanelmoth/.test(f.id), pineP = f.gold ? 0 : dk ? 0.55 : (y0 + y1) / 2 < 220 ? 0.45 : 0.2;
    const root = el("g", { class: "h3f" + (dk ? " dk" : "") + (f.gold ? " gold" : "") }, g);
    el("path", { d: rough(f.pts, 4, f.pts.length * 7 + 3), class: "h3f-floor" }, root);
    const N = Math.round(n * 2.4), T2 = [];
    for (let i = 0; i < N * 3 && T2.length < N; i++) { const x = lerp(x0, x1, rnd()), y = lerp(y0, y1, rnd()); if (inPoly(x, y, f.pts)) T2.push([x, y, 2.3 + rnd() * 1.5, rnd() < pineP]); }
    T2.sort((a, b) => a[1] - b[1]);
    const BAND = 10; let b0 = -1e9, P = null;
    const flush = () => { if (!P) return; ["sh", "cr", "hi", "pl", "ps"].forEach((k) => P[k] && el("path", { d: P[k], class: "h3f-" + k }, root)); };
    T2.forEach(([x, y, r, pine]) => {
      if (y - b0 > BAND) { flush(); P = { sh: "", cr: "", hi: "", pl: "", ps: "" }; b0 = y; }
      P.sh += `M${f1(x - r * 0.4)},${f1(y + 0.4)}a${f1(r * 1.1)},${f1(r * 0.45)} 0 1,0 ${f1(r * 2.2)},0a${f1(r * 1.1)},${f1(r * 0.45)} 0 1,0 ${f1(-r * 2.2)},0z`;
      if (pine) { const h = r * 2.7, w = r * 0.95; P.pl += `M${f1(x - w)},${f1(y)}L${f1(x)},${f1(y - h)}L${f1(x)},${f1(y)}z`; P.ps += `M${f1(x)},${f1(y - h)}L${f1(x + w)},${f1(y)}L${f1(x)},${f1(y)}z`; }
      else { const cy = y - r * 0.85; P.cr += `M${f1(x - r)},${f1(cy)}a${f1(r)},${f1(r)} 0 1,1 ${f1(2 * r)},0a${f1(r)},${f1(r)} 0 1,1 ${f1(-2 * r)},0z`; const hr = r * 0.46; P.hi += `M${f1(x - r * 0.3 - hr)},${f1(cy - r * 0.32)}a${f1(hr)},${f1(hr)} 0 1,1 ${f1(2 * hr)},0a${f1(hr)},${f1(hr)} 0 1,1 ${f1(-2 * hr)},0z`; }
    });
    flush();
  }
  function advObjects() {
    const pl = D.PLACES.filter((p) => !p.aman), MS = [], RS = [];
    W.mountains.filter((m) => !m.aman).forEach((m) => sample(m.pts, 6).forEach((q) => MS.push([q[0], q[1], m.h, q[2], !!m.fa])));
    W.rivers.forEach((r) => sample(r.pts, 4).forEach((q) => RS.push(q)));
    [["me", W.land.me, 120, L.ter, false], ["bel", W.land.beleriand, 44, L.bel, true]].forEach(([k, land, want, parent, fa]) => {
      const g = el("g", { class: "advo" }, parent), occ = [];
      const FO = W.forests.filter((f) => !!f.fa === fa).map((f) => f.pts), LK = W.lakes.map((l) => l.pts);
      const ok = (x, y, mtn = true) => inPoly(x, y, land) && !FO.some((p) => inPoly(x, y, p)) && !LK.some((p) => inPoly(x, y, p)) && !(H3.BIOMES[0] && y < (fa ? -70 : 40)) &&
        pl.every((p) => Math.hypot(p.x - x, p.y - y) > 18) && RS.every((q) => Math.hypot(q[0] - x, q[1] - y) > 4) &&
        (!mtn || MS.every((q) => Math.hypot(q[0] - x, q[1] - y) > q[2] * 1.15 + 3)) && occ.every((o) => Math.hypot(o[0] - x, o[1] - y) > 22);
      const put = (x, y, kind) => { occ.push([x, y]); const a = el("g", { class: "ao", transform: `translate(${f1(x)},${f1(y)})` }, g); el("g", { class: "aoi" }, a).innerHTML = H3.OBJ[kind](); };
      seed = fa ? 777 : 333;
      const ms = MS.filter((q) => q[4] === fa);
      for (let i = 0, c = 0; i < 400 && c < (fa ? 5 : 14); i++) { const q = ms[Math.floor(rnd() * ms.length)]; if (!q) break; const s2 = rnd() < 0.5 ? 1 : -1, d = q[2] * 1.1 + 6, x = q[0] + Math.cos(q[3] + Math.PI / 2) * d * s2, y = q[1] + Math.sin(q[3] + Math.PI / 2) * d * s2; if (ok(x, y, false) && MS.every((m) => Math.hypot(m[0] - x, m[1] - y) > m[2] * 0.9)) { put(x, y, "mine"); c++; } }
      const fv = W.forests.filter((f) => !!f.fa === fa).flatMap((f) => { const [cx, cy] = centroid(f.pts); return f.pts.map(([x, y]) => { const dd = Math.hypot(x - cx, y - cy) || 1; return [x + ((x - cx) / dd) * 8, y + ((y - cy) / dd) * 8]; }); });
      for (let i = 0, c = 0; i < 200 && c < (fa ? 4 : 10); i++) { const q = fv[Math.floor(rnd() * fv.length)]; if (q && ok(q[0], q[1])) { put(q[0], q[1], "sawmill"); c++; } }
      const xs = land.map((p) => p[0]), ys = land.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      for (let i = 0, c = 0; i < 6000 && c < want; i++) { const x = lerp(x0, x1, rnd()), y = lerp(y0, y1, rnd()); if (ok(x, y)) { put(x, y, H3.pickObj(rnd())); c++; } }
    });
  }
  function h3Cluster(j, who, mode) {
    const ride = mode === "ride", rows = [];
    who.slice(1).forEach((id, i) => (rows[Math.floor(i / 4)] ||= []).push([id, i]));
    const fig = (id, d) => `<g class="bob" style="animation-delay:-${d.toFixed(2)}s">` + (ride ? `<use href="#chb-horse" transform="scale(.8)"/><use href="#chb-${id}" transform="translate(0,-8) scale(.82)"/>` : `<use href="#chb-${id}" transform="scale(.82)"/>`) + `</g>`;
    let h = `<g class="flip">`;
    rows.reverse().forEach((row) => row.forEach(([id, i]) => { const c = i % 4, r = Math.floor(i / 4), x = -19 - c * (ride ? 13 : 10) - r * 5, y = -r * 9 + (c % 2) * 1.6; h += `<g transform="translate(${f1(x)},${f1(y)}) scale(.64)">${fig(id, ((i * 7) % 10) * 0.06)}</g>`; }));
    h += `<path d="M-7,-2V-36" stroke="#3a2a1a" stroke-width="1.2"/><path class="h3flag" d="M-7,-36h12l-3,4.4 3,4.4h-12z" fill="${j.c}" stroke="#1e140a" stroke-width=".55"/>` +
      `<g class="bob"><use href="#chb-horse" transform="scale(.8)"/><use href="#chb-${who[0]}" transform="translate(0,-8) scale(.82)"/></g></g>`;
    j.cl.innerHTML = h; j.lab.setAttribute("y", 24);
  }
  function buildMini() {
    const box = $("#mini"); if (!box) return;
    const s = document.createElementNS(NS, "svg"); s.setAttribute("viewBox", W.box.join(" ")); s.setAttribute("preserveAspectRatio", "xMidYMid meet"); box.appendChild(s);
    el("rect", { x: BX, y: BY, width: BW, height: BH, class: "mm-sea" }, s);
    MM = { s };
    MM.bel = el("g", {}, s); el("path", { d: cr(W.land.beleriand, true), class: "mm-land" }, MM.bel);
    el("path", { d: cr(W.land.me, true), class: "mm-land" }, s);
    const N = W.numenor; MM.nu = el("g", {}, s); el("circle", { cx: N.cx, cy: N.cy, r: N.r * 0.75, class: "mm-land" }, MM.nu);
    MM.aman = el("g", {}, s); el("path", { d: cr(W.land.aman, true), class: "mm-land mm-aman" }, MM.aman);
    [["snow", "me"], ["lava", "me"], ["sand", "me"]].forEach(([t]) => H3.BIOMES.filter((b) => b.t === t && b.clip === "me").forEach((b) => el("path", { d: cr(b.pts, true), class: "mm-b mm-" + t, "clip-path": "url(#mm-clip)" }, s)));
    el("path", { d: cr(W.land.me, true) }, el("clipPath", { id: "mm-clip" }, s));
    D.PLACES.filter((p) => !p.minor).forEach((p) => { p.mm = el("rect", { x: p.x - 9, y: p.y - 9, width: 18, height: 18, fill: H3.FLAG[p.k] || "#888", class: "mm-p" }, p.aman ? MM.aman : p.fa ? MM.bel : s); });
    MM.vp = el("rect", { class: "mm-vp" }, s);
    const go = (e, fly) => { const m = s.getScreenCTM(); if (!m) return; const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()); userMoved = Date.now(); if (fly) flyTo(pt.x, pt.y, cam.w, 600); else { cancelAnimationFrame(flyRaf); const hh = (cam.w * ch) / cw; cam.x = pt.x - cam.w / 2; cam.y = pt.y - hh / 2; applyCam(); } };
    let drag = false;
    s.addEventListener("pointerdown", (e) => { drag = true; s.setPointerCapture(e.pointerId); go(e, true); e.stopPropagation(); });
    s.addEventListener("pointermove", (e) => drag && go(e, false));
    s.addEventListener("pointerup", () => (drag = false));
  }
  function statsHtml(c, nb, nj) {
    const st = H3.stats(c, { battles: nb, journeys: nj, chapters: (((window.ME_BIO || {})[c.id] || {}).chapters || []).length });
    return `<div class="h3-stats"><div class="h3-lv"><b>${tr("等级")} ${st.lvl}</b> · ${esc(tr(st.cls))}</div><div class="h3-row">${[["atk", "攻击"], ["def", "防御"], ["pow", "力量"], ["kno", "知识"]].map(([k, n]) => `<div class="h3-st"><i>${H3.ICON[k]}</i><small>${tr(n)}</small><b>${st[k]}</b></div>`).join("")}</div></div>`;
  }
  function buildMap() {
    const defs = el("defs", {}, svg);
    defs.innerHTML = `
      <filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.2  0 0 0 0.22 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      <filter id="blur6"><feGaussianBlur stdDeviation="6"/></filter>
      <filter id="gold" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      ${["elf", "man", "dwarf", "dark", "rohan"].map((c) => `<radialGradient id="rg-${c}"><stop offset="0" class="rg-${c}" stop-opacity=".55"/><stop offset=".75" class="rg-${c}" stop-opacity=".22"/><stop offset="1" class="rg-${c}" stop-opacity="0"/></radialGradient>`).join("")}
      <linearGradient id="beam" x1="1" x2="0" y1="0" y2="0"><stop offset="0" stop-color="#ff8a20" stop-opacity=".9"/><stop offset="1" stop-color="#ff5a10" stop-opacity="0"/></linearGradient>
      ${chibiDefs()}
      <pattern id="seaHatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)"><path d="M0 7h6" class="sea-h"/></pattern>
      ${H3 ? H3.textures() : ""}`;
    el("rect", { x: BX, y: BY, width: BW, height: BH, class: "sea" }, svg);
    el("rect", { x: BX, y: BY, width: BW, height: BH, fill: "url(#seaHatch)", opacity: 0.5, class: "sea-hatch" }, svg);
    seaDeco();
    const landD = cr(W.land.me, true), belD0 = cr(W.land.beleriand, true);
    if (H3) [["me", landD], ["bel", belD0]].forEach(([k, d]) => el("path", { d }, el("clipPath", { id: "clip-" + k }, defs)));
    L.coast = el("g", { class: "coast" }, svg);
    [16, 10, 5].forEach((w, i) => el("path", { d: landD, class: "ripple r" + i, "stroke-width": w }, L.coast));
    if (H3) el("path", { d: landD, class: "beach" }, svg);
    el("path", { d: landD, class: "land" }, svg);
    if (H3) biomes("me", svg);
    // 贝烈瑞安德（第一纪元）
    L.bel = el("g", { class: "bel era-layer" }, svg);
    const belD = belD0;
    [16, 10, 5].forEach((w, i) => el("path", { d: belD, class: "ripple r" + i, "stroke-width": w }, L.bel));
    if (H3) el("path", { d: belD, class: "beach" }, L.bel);
    el("path", { d: belD, class: "land" }, L.bel);
    if (H3) biomes("bel", L.bel);
    el("path", { d: cr(W.land.balar, true), class: "land coastline" }, L.bel);
    el("path", { d: belD, class: "coastline" }, L.bel);
    el("path", { d: landD, class: "coastline" }, svg);
    // 努门诺尔
    L.nu = el("g", { class: "nu era-layer" }, svg);
    const N = W.numenor, star = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? N.r * 0.42 : N.r; star.push([+(N.cx + Math.cos(a) * r).toFixed(1), +(N.cy + Math.sin(a) * r).toFixed(1)]); }
    const nuD = cr(star, true);
    [12, 6].forEach((w, i) => el("path", { d: nuD, class: "ripple r" + (i + 1), "stroke-width": w }, L.nu));
    if (H3) el("path", { d: nuD, class: "beach" }, L.nu);
    el("path", { d: nuD, class: "land coastline" }, L.nu);
    // 阿门洲（不死之地）
    L.aman = el("g", { class: "aman era-layer" }, svg);
    const amD = cr(W.land.aman, true), erD = cr(W.land.eressea, true);
    [16, 10, 5].forEach((w, i) => { el("path", { d: amD, class: "ripple r" + i, "stroke-width": w }, L.aman); el("path", { d: erD, class: "ripple r" + i, "stroke-width": w * 0.7 }, L.aman); });
    if (H3) { el("path", { d: amD, class: "beach" }, L.aman); el("path", { d: erD, class: "beach" }, L.aman); }
    el("path", { d: amD, class: "land aman-land coastline" }, L.aman);
    el("path", { d: erD, class: "land aman-land coastline" }, L.aman);
    // 冰峡（赫尔卡拉克瑟）
    el("path", { d: cr(W.land.ice, true), class: "ice" }, L.bel);
    { let d = ""; seed = 41; for (let i = 0; i < 60; i++) { const x = lerp(-900, -695, rnd()), y = lerp(-118, -72, rnd()); if (inPoly(x, y, W.land.ice)) d += `M${x.toFixed(1)},${y.toFixed(1)}l${(4 + rnd() * 5).toFixed(1)},${(-2 - rnd() * 3).toFixed(1)}`; } el("path", { d, class: "ice-h" }, L.bel); }
    // 双圣树
    { const tp = D.PLACES.find((q) => q.id === "twotrees"); L.trees = el("g", { class: "trees2", transform: `translate(${tp.x},${tp.y - 4}) scale(1.6)` }, L.aman);
      el("circle", { cx: -14, cy: -6, r: 26, class: "tglow tel" }, L.trees); el("circle", { cx: 14, cy: -6, r: 26, class: "tglow tla" }, L.trees);
      [[-12, "tel"], [12, "tla"]].forEach(([x, c]) => { el("path", { d: `M${x},4L${x},-10`, class: "ttrunk" }, L.trees); el("circle", { cx: x, cy: -14, r: 7, class: "tcrown " + c }, L.trees); }); }
    L.veil = el("g", { class: "veil-l", transform: "translate(-1060,560)" }, L.aman);
    { const s2 = el("g", { class: "sc" }, L.veil); el("text", { class: "veil-n" }, s2).textContent = tr("已移出世界之圈 · 唯有精灵的船走笔直航道"); el("text", { class: "veil-en", y: 13 }, s2).textContent = "REMOVED FROM THE CIRCLES OF THE WORLD · SA 3319"; }
    el("rect", { x: BX, y: BY, width: BW, height: BH, filter: "url(#paper)", class: "paper", "pointer-events": "none" }, svg);
    // 湖
    L.ter = el("g", { class: "terrain" }, svg);
    W.lakes.forEach((lk) => { const d = cr(lk.pts, true); el("path", { d, class: "lake" }, L.ter); el("path", { d, class: "lake-in" }, L.ter); });
    terrainDeco();
    // 森林
    W.forests.forEach((f) => {
      const g = f.fa ? L.bel : L.ter; let d = ""; seed = f.pts.length * 131 + 7;
      const xs = f.pts.map((p) => p[0]), ys = f.pts.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const n = Math.round((x1 - x0) * (y1 - y0) * f.d);
      const trees = [];
      for (let i = 0; i < n * 3 && trees.length < n; i++) { const x = lerp(x0, x1, rnd()), y = lerp(y0, y1, rnd()); if (inPoly(x, y, f.pts)) trees.push([x, y]); }
      if (H3) return h3Forest(f, g, x0, x1, y0, y1, n);
      trees.sort((a, b) => a[1] - b[1]).forEach(([x, y]) => { const r = 2.2 + rnd() * 1.2; d += `M${(x - r).toFixed(1)},${y.toFixed(1)}a${r.toFixed(1)},${(r * 1.1).toFixed(1)} 0 1,1 ${(2 * r).toFixed(1)},0z`; });
      el("path", { d, class: "trees-sh", transform: "translate(1.1,1.3)" }, g);
      el("path", { d, class: "trees" + (f.gold ? " gold" : "") }, g);
    });
    // 河
    const RN = (DECO.RIVER_N || {});
    W.rivers.forEach((r) => {
      const g = r.fa ? L.bel : L.ter, sp = sample(r.pts, 3), n = 7;
      for (let i = 0; i < n; i++) {
        const a = Math.floor((i * (sp.length - 1)) / n), b = Math.floor(((i + 1) * (sp.length - 1)) / n);
        if (b <= a) continue;
        el("path", { d: "M" + sp.slice(a, b + 1).map((q) => q[0].toFixed(1) + "," + q[1].toFixed(1)).join("L"), class: "river", "stroke-width": (r.w * (0.38 + 0.62 * ((i + 1) / n))).toFixed(2) }, g);
      }
      const nm = r.n || RN[r.id];
      if (nm) {
        const pid = "rv-" + r.id; el("path", { id: pid, d: cr(r.pts), fill: "none", stroke: "none" }, g);
        const t = el("text", { class: "rv-n", dy: -3 }, g), tp = el("textPath", { href: "#" + pid, startOffset: "38%" }, t); tp.textContent = nm;
      }
    });
    roadsDeco();
    // 山
    W.mountains.forEach((m) => {
      const g = el("g", { class: "mts" + (m.dark ? " dark" : "") }, m.fa ? L.bel : m.aman ? L.aman : L.ter); seed = m.pts.length * 977 + Math.round(m.h * 13);
      if (H3) { const bd = cr(m.pts); el("path", { d: bd, class: "mt-base", "stroke-width": (m.h * 2.1).toFixed(1) }, g); el("path", { d: bd, class: "mt-base2", "stroke-width": (m.h * 1.3).toFixed(1) }, g); }
      const sp = sample(m.pts, m.h * 0.62);
      const peaks = [];
      sp.forEach(([x, y]) => { for (let k = 0; k < (m.h > 11 ? 2 : 1); k++) { const ox = (rnd() - 0.5) * m.h * 0.6, oy = (rnd() - 0.5) * m.h * 0.7 + k * m.h * 0.35; peaks.push([x + ox, y + oy, m.h * (0.75 + rnd() * 0.5)]); } });
      peaks.sort((a, b) => a[1] - b[1]).forEach(([x, y, h]) => {
        const w = h * 0.62;
        el("path", { d: `M${(x - w).toFixed(1)},${y.toFixed(1)}L${(x - w * 0.1).toFixed(1)},${(y - h).toFixed(1)}L${(x + w).toFixed(1)},${y.toFixed(1)}`, class: "mt" }, g);
        el("path", { d: `M${(x - w * 0.1).toFixed(1)},${(y - h).toFixed(1)}L${(x + w).toFixed(1)},${y.toFixed(1)}L${(x + w * 0.12).toFixed(1)},${y.toFixed(1)}Z`, class: "mt-s" }, g);
        if (h > 13 && !m.dark) el("path", { d: `M${(x - w * 0.36).toFixed(1)},${(y - h * 0.62).toFixed(1)}L${(x - w * 0.1).toFixed(1)},${(y - h).toFixed(1)}L${(x + w * 0.3).toFixed(1)},${(y - h * 0.6).toFixed(1)}L${(x + w * 0.05).toFixed(1)},${(y - h * 0.7).toFixed(1)}L${(x - w * 0.14).toFixed(1)},${(y - h * 0.58).toFixed(1)}Z`, class: "mt-snow" }, g);
        el("path", { d: `M${(x + w * 0.05).toFixed(1)},${(y - h * 0.75).toFixed(1)}L${(x + w * 0.4).toFixed(1)},${(y - h * 0.15).toFixed(1)}M${(x + w * 0.25).toFixed(1)},${(y - h * 0.6).toFixed(1)}L${(x + w * 0.62).toFixed(1)},${(y - h * 0.05).toFixed(1)}`, class: "mt-h" }, g);
      });
    });
    W.peaks.forEach((p) => {
      const g = el("g", { class: "peak" + (p.fire ? " fire" : "") }, p.nu ? L.nu : p.aman ? L.aman : L.ter), w = p.h * 0.7;
      el("path", { d: `M${p.x - w},${p.y}L${p.x - 2},${p.y - p.h}L${p.x + 2},${p.y - p.h}L${p.x + w},${p.y}Z`, class: "mt big" }, g);
      if (p.fire) el("circle", { cx: p.x, cy: p.y - p.h, r: 3, class: "ember" }, g);
    });
    if (H3) advObjects();
    // 国度
    L.realms = el("g", { class: "realms" }, svg);
    D.REALMS.forEach((r) => {
      const g = el("g", { class: "realm" + (r.soft ? " soft" : "") }, L.realms);
      el("circle", { cx: r.x, cy: r.y, r: r.r, fill: `url(#rg-${r.c})` }, g);
      const tx = el("text", { x: r.x, y: r.y - r.r * 0.55, class: "realm-n c-" + r.c }, g); tx.textContent = r.n;
      r.g = g;
    });
    // 区域名
    L.labels = el("g", { class: "labels" }, svg);
    W.labels.forEach((lb) => {
      const g = el("g", { class: "lbl" + (lb.sea ? " sea-l" : ""), transform: `translate(${lb.x},${lb.y})` }, lb.fa ? L.bel : lb.aman ? L.aman : L.labels);
      const s = el("g", { class: "sc" }, g); s.style.setProperty("--fs", lb.s);
      const t1 = el("text", { class: "lbl-n" }, s); t1.textContent = lb.n;
      const t2 = el("text", { class: "lbl-en", y: 1.05 * lb.s }, s); t2.textContent = lb.en;
      lb.g = g;
    });
    W.mountains.filter((m) => m.n).forEach((m) => {
      const mid = m.pts[Math.floor(m.pts.length / 2)];
      const g = el("g", { class: "lbl mt-l", transform: `translate(${mid[0] + 16},${mid[1] + 4})` }, m.fa ? L.bel : m.aman ? L.aman : L.labels);
      const s = el("g", { class: "sc" }, g); s.style.setProperty("--fs", 9);
      el("text", { class: "lbl-n it" }, s).textContent = m.n;
    });
    W.edges.forEach((e) => {
      const g = el("g", { class: "edge", transform: `translate(${e.x},${e.y})` }, svg);
      const s = el("g", { class: "sc" }, g);
      el("text", { class: "edge-n", "text-anchor": e.side === "w" ? "start" : "end" }, s).textContent = e.n;
      el("text", { class: "edge-en", y: 13, "text-anchor": e.side === "w" ? "start" : "end" }, s).textContent = e.en;
    });
    lifeDeco(); momentDeco();
    // 旅程
    L.jr = el("g", { class: "journeys" }, svg);
    JR.forEach((j) => {
      j.path = el("path", { class: "jpath" + (j.mig ? " mig" : ""), stroke: j.c, "vector-effect": "non-scaling-stroke" }, L.jr);
    });
    JR.forEach((j) => {
      j.mk = el("g", { class: "jmk", "data-j": j.id }, L.jr);
      const s = el("g", { class: "sc" }, j.mk);
      j.cl = el("g", { class: "jcl" }, s);
      j.lab = el("text", { y: 14, class: "jname", fill: j.c, "text-anchor": "middle" }, s); j.lab.textContent = j.n;
      j.mk.addEventListener("click", (ev) => { ev.stopPropagation(); showJourney(j); });
    });
    // 地点
    L.pl = el("g", { class: "places" }, svg);
    D.PLACES.forEach((p) => {
      const g = el("g", { class: `pl k-${p.k}${p.minor ? " minor" : ""}`, transform: `translate(${p.x},${p.y})`, "data-id": p.id }, L.pl);
      const s = el("g", { class: "sc" }, g);
      const ic = el("g", { class: "ic2" }, s); ic.innerHTML = window.ME_ICON ? window.ME_ICON(p) : `<circle r="3" class="ic"/>`;
      el("path", { d: "M-5,-5L5,5", class: "ruinx" }, s);
      p.tx = el("text", { y: 3.5, class: "pl-n" + (p.k === "site" ? " st" : "") }, s); p.tx.textContent = p.n;
      p.g = g;
      g.addEventListener("click", (ev) => { ev.stopPropagation(); showPlace(p); });
    });
    // 常驻人物
    L.res = el("g", { class: "residents" }, svg);
    CH.CHARS.forEach((c) => (c.homes || []).forEach(([at, from, to, hn], k) => {
      const [x, y] = xy(at), g = el("g", { class: "res", "data-c": c.id, transform: `translate(${x},${y})` }, L.res), s = el("g", { class: "sc" }, g);
      const inner = el("g", { class: "res-i" }, s);
      inner.innerHTML = `<g class="bob2" style="animation-delay:-${(RES.length * 0.37) % 3}s"><use href="#chb-${c.homeLook && k === c.homes.length - 1 ? c.homeLook : c.id}" transform="scale(.62)"/></g><text class="res-n" y="10" text-anchor="middle">${esc(c.n)}</text>`;
      el("title", {}, g).textContent = c.n + " · " + (hn || placeName(at));
      g.addEventListener("click", (ev) => { ev.stopPropagation(); showChar(c.id); });
      RES.push({ c, x, y, from, to, g, inner, key: String(at), tf: "" });
    }));
    // 至尊戒
    L.ring = el("g", { class: "ring" }, svg);
    const rs = el("g", { class: "sc" }, L.ring);
    el("circle", { r: 9, class: "ring-glow", filter: "url(#gold)" }, rs);
    el("circle", { r: 4.2, class: "ring-o" }, rs);
    el("text", { x: 10, y: 14, class: "ring-n" }, rs).textContent = tr("至尊戒");
    L.won = el("g", { class: "wonders" }, svg);
    (LIFE.WONDERS || []).forEach((o) => lifeItem(o, L.won, "won k-" + o.k));
    L.fx = el("g", { class: "fx" }, svg);
  }
  /* ——地标、生灵、奇观—— */
  const LIFE = window.ME_LIFE || {};
  L.tw = [];
  function lifeItem(o, parent, cls) {
    const g = el("g", { class: cls, transform: `translate(${o.x},${o.y})` }, parent);
    const s = el("g", { class: "sc" }, g), z = el("g", { class: "lz" }, s);
    const inner = el("g", { class: "li" + (o.fly ? " drift" : ""), transform: `scale(${(o.s || 1) * (o.flip ? -1 : 1)},${o.s || 1})` }, z);
    if (o.fly) inner.style.animationDuration = (o.d || 60) + "s";
    inner.style.animationDelay = `-${(rnd() * 20).toFixed(1)}s`;
    inner.innerHTML = (LIFE.ART || {})[o.k] || "";
    if (o.from != null || o.to != null) { g.dataset.from = o.from ?? -1e9; g.dataset.to = o.to ?? 1e9; L.tw.push(g); }
    if (o.n) el("title", {}, g).textContent = o.n;
    return g;
  }
  /* ——关键时刻—— */
  const MO = (window.ME_MOMENTS || []).slice().sort((a, b) => a.t - b.t);
  const MOI = {}; MO.forEach((m, i) => (MOI[m.id] = i));
  const moSpan = (m) => (m.t > 6900 ? 0.12 : m.t > 4000 ? 40 : 60); // 地图上的✦标记持续多久
  function momentDeco() {
    L.mo = el("g", { class: "moments" }, svg);
    MO.forEach((m) => {
      const [x, y] = xy(m.at);
      const g = el("g", { class: "mo-mk off", transform: `translate(${x},${y - 4})` }, L.mo); m.g = g;
      const sc = el("g", { class: "sc" }, g);
      sc.innerHTML = `<circle class="mo-halo" r="13"/><path d="M0-11L2.6-2.6L11 0L2.6 2.6L0 11L-2.6 2.6L-11 0L-2.6-2.6Z"/><circle r="2.2" fill="#fff8d8"/>`;
      el("title", {}, g).textContent = "✦ " + m.h;
      g.addEventListener("click", (ev) => { ev.stopPropagation(); openMoment(m.id); });
    });
  }
  function lifeDeco() {
    L.life = el("g", { class: "life" }, svg);
    (LIFE.LIFE || []).forEach((o) => lifeItem(o, L.life, "lf k-" + o.k));
    L.lm = el("g", { class: "landmarks" }, svg);
    (LIFE.LANDMARKS || []).forEach((m) => {
      const g = lifeItem(m, L.lm, "lm k-" + m.k);
      el("text", { class: "lm-n", y: 16, "text-anchor": "middle" }, g.firstChild).textContent = m.n;
      g.addEventListener("click", (ev) => { ev.stopPropagation(); openCard(`<div class="pc-k">${tr("地标 · 典故")}</div><h3>${esc(m.n)}</h3><p>${esc(m.d)}</p>`); pulse(m.x, m.y); });
    });
  }

  /* ——旅程解析—— */
  const JR = D.JOURNEYS.map((j) => ({ ...j, P: j.pts.map(([at, t, g]) => { const [x, y] = xy(at); return { x, y, t, gap: g === "gap", m: g === "ship" || g === "ride" ? g : null }; }) }));
  const RES = [];
  function whoAt(j, t) { let w = j.who || []; (j.whoAt || []).forEach(([t0, l]) => { if (t >= t0) w = l; }); return w; }
  function joinT(j, id) { if ((j.who || []).includes(id)) return j.P[0].t; const w = (j.whoAt || []).find(([, l]) => l.includes(id)); return w ? w[0] : j.P[0].t; }
  function renderCluster(j, who, mode) {
    const key = who.join() + "|" + mode; if (j.key === key) return; j.key = key;
    if (!who.length || !CB) { j.cl.innerHTML = `<circle r="4.5" fill="${j.c}" class="jdot"/>`; return; }
    if (H3 && mode !== "ship") return h3Cluster(j, who, mode);
    const n = who.length, two = n > 4, per = two ? Math.ceil(n / 2) : n, gap = mode === "ride" ? 32 : 21;
    const S = 0.82; let h = "";
    if (mode === "ship") { const sx = Math.max(0.85, (per * gap + 26) / 62); h += `<use href="#chb-sail" transform="translate(-2,2) scale(.85)"/>`; j.hullTf = `translate(0,3) scale(${sx.toFixed(2)},.8)`; }
    const rows = two ? [who.slice(0, per), who.slice(per)] : [who];
    rows.forEach((row, ri) => row.forEach((id, i) => {
      const x = (i - (row.length - 1) / 2) * gap + (two && ri ? gap / 2 : 0), y = two && ri === 0 ? -13 : 0;
      const d = ((j.id.length * 7 + ri * 3 + i) * 0.13) % 0.6;
      h += `<g transform="translate(${x.toFixed(1)},${y})"><g class="bob" style="animation-delay:-${d.toFixed(2)}s"><g class="flip">` +
        (mode === "ride" ? `<use href="#chb-horse" transform="scale(.8)"/><use href="#chb-${id}" transform="translate(0,-8) scale(${S})"/>` : `<use href="#chb-${id}" transform="scale(${S})"/>`) + `</g></g></g>`;
    }));
    if (mode === "ship") h += `<use href="#chb-hull" transform="${j.hullTf}"/>`;
    j.cl.innerHTML = h; j.lab.setAttribute("y", mode === "ride" ? 24 : 15);
  }
  const RING = []; D.RING.forEach((r) => { if (typeof r === "string") { const j = JR.find((x) => x.id === r.slice(1)); j.P.forEach((p) => RING.push({ ...p, gap: false })); } else { const [x, y] = xy(r[0]); RING.push({ x, y, t: r[1] }); } });
  RING.sort((a, b) => a.t - b.t);
  const RING_END = RING[RING.length - 1].t;
  function at(P, t) { // 当前位置与已走过的路径
    if (t < P[0].t) return null;
    let d = `M${P[0].x},${P[0].y}`, pos = [P[0].x, P[0].y], hidden = false, seg = P.length - 1;
    for (let i = 1; i < P.length; i++) {
      const a = P[i - 1], b = P[i];
      if (t >= b.t) { d += `${b.gap ? "M" : "L"}${b.x},${b.y}`; pos = [b.x, b.y]; hidden = false; continue; }
      const k = (t - a.t) / Math.max(1e-9, b.t - a.t);
      pos = [lerp(a.x, b.x, k), lerp(a.y, b.y, k)]; seg = i;
      if (b.gap) hidden = true; else d += `L${pos[0].toFixed(1)},${pos[1].toFixed(1)}`;
      break;
    }
    return { d, pos, hidden, seg, done: t >= P[P.length - 1].t };
  }

  /* ——随时间更新地图—— */
  let T = D.EVENTS[0].t;
  const visible = (p, t) => (t >= (p.from ?? -1e9) && t < (p.to ?? 1e9)) || (p.again && t >= p.again[0] && t < p.again[1]);
  function updateMap() {
    const t = T;
    L.bel.classList.toggle("gone", t >= 587.5);
    L.nu.classList.toggle("gone", t < 622 || t >= 3909.3);
    L.roads.classList.toggle("off", t < 591); L.timed.forEach((g) => g.classList.toggle("off", t < +g.dataset.from));
    L.tw.forEach((g) => g.classList.toggle("off", t < +g.dataset.from || t >= +g.dataset.to));
    svg.querySelectorAll(".sea-o[data-from]").forEach((g) => g.classList.toggle("off", t < +g.dataset.from || t >= +g.dataset.to));
    const veiled = t >= 3909.3; L.aman.classList.toggle("veiled", veiled);
    if (MM) { MM.bel.classList.toggle("gone", t >= 587.5); MM.nu.classList.toggle("gone", t < 622 || t >= 3909.3); MM.aman.classList.toggle("veiled", veiled); }
    L.trees.classList.toggle("dead", t >= -40);
    W.labels.forEach((lb) => lb.g && lb.g.classList.toggle("off", (lb.from != null && t < lb.from) || (lb.ta && t < 591)));
    D.REALMS.forEach((r) => r.g.classList.toggle("on", t >= r.from && t < r.to));
    D.PLACES.forEach((p) => {
      const v = visible(p, t); p.g.classList.toggle("off", !v);
      if (p.mm) p.mm.style.display = v ? "" : "none";
      if (p.aman) p.g.classList.toggle("veiled", veiled);
      if (!v) return;
      const ruin = p.ruin != null && t >= p.ruin && !(p.rebuilt && t >= p.rebuilt);
      const dark = p.darkAt != null && t >= p.darkAt && !(p.lightAt && t >= p.lightAt);
      p.g.classList.toggle("ruin", ruin); p.g.classList.toggle("dk", dark);
      let n = p.n; (p.names || []).forEach(([nt, nn]) => { if (t >= nt) n = nn; });
      const label = n + (ruin ? tr("（废墟）") : "");
      if (p.tx.textContent !== label) p.tx.textContent = label;
    });
    const away = new Set();
    JR.forEach((j) => {
      const r = at(j.P, t), end = j.P[j.P.length - 1].t, span = Math.max(0.4, (end - j.P[0].t) * 0.6);
      const on = r && t <= end + span, mk = on && !r.done && !r.hidden;
      j.path.style.display = on ? "" : "none"; j.mk.style.display = mk ? "" : "none"; j.vis = mk;
      if (!on) return;
      j.path.setAttribute("d", r.d); j.path.classList.toggle("done", r.done);
      if (!mk) return;
      const who = whoAt(j, t); who.forEach((id) => away.add(id)); j.curWho = who; j.curPos = r.pos;
      const a = j.P[r.seg - 1] || j.P[0], b = j.P[r.seg], moving = Math.hypot(b.x - a.x, b.y - a.y) > 0.5;
      renderCluster(j, who, moving ? b.m || j.mode || "" : "");
      j.mk.classList.toggle("still", !moving);
      if (moving && Math.abs(b.x - a.x) > 0.5) j.mk.classList.toggle("left", b.x < a.x);
      j.mk.setAttribute("transform", `translate(${r.pos[0].toFixed(1)},${r.pos[1].toFixed(1)})`);
    });
    const groups = {};
    RES.forEach((r) => { const v = t >= r.from && t < r.to && !away.has(r.c.id); r.vis = v; r.g.style.display = v ? "" : "none"; if (v) (groups[r.key] ||= []).push(r); });
    Object.values(groups).forEach((list) => list.forEach((r, i) => {
      const n = list.length, per = Math.min(n, 4), row = Math.floor(i / 4), col = i % 4, cnt = Math.min(per, n - row * 4);
      const tf = `translate(${((col - (cnt - 1) / 2) * 17).toFixed(1)},${-6 - row * 28})`;
      if (r.tf !== tf) { r.inner.setAttribute("transform", tf); r.tf = tf; }
    }));
    debutCheck(t, away);
    MO.forEach((m) => m.g && m.g.classList.toggle("off", !(t >= m.t - 1e-6 && t < m.t + moSpan(m))));
    const rr = t >= RING[0].t && t < RING_END ? at(RING, t) : null;
    L.ring.style.display = rr ? "" : "none";
    if (rr) L.ring.setAttribute("transform", `translate(${rr.pos[0].toFixed(1)},${(rr.pos[1] - 1).toFixed(1)})`);
    schedDc();
  }

  /* ——镜头—— */
  function applyCam() {
    const r = svg.getBoundingClientRect(); cw = r.width || 1; ch = r.height || 1;
    const h = (cam.w * ch) / cw;
    svg.setAttribute("viewBox", `${cam.x.toFixed(2)} ${cam.y.toFixed(2)} ${cam.w.toFixed(2)} ${h.toFixed(2)}`);
    const k = cam.w / cw; svg.style.setProperty("--k", k.toFixed(4));
    svg.style.setProperty("--icz", clamp(640 / cam.w, 0.8, 2.4).toFixed(3));
    svg.classList.toggle("far", cam.w > 1150); svg.classList.toggle("near", cam.w < 620);
    scaleBar(k); schedDc();
    if (MM) { MM.vp.setAttribute("x", cam.x.toFixed(1)); MM.vp.setAttribute("y", cam.y.toFixed(1)); MM.vp.setAttribute("width", cam.w.toFixed(1)); MM.vp.setAttribute("height", h.toFixed(1)); }
  }
  /* ——标签避让：按重要性逐个放置，和已放置的文字重叠就先隐藏，放大后再出现—— */
  let dcAt = 0, dcTimer = 0;
  function schedDc() { if (!dcTimer) dcTimer = setTimeout(declutter, Math.max(30, 220 - (performance.now() - dcAt))); }
  function declutter() {
    dcAt = performance.now(); dcTimer = 0;
    const U = [], add = (sel, pri) => svg.querySelectorAll(sel).forEach((n) => U.push({ n, pri: typeof pri === "function" ? pri(n) : pri }));
    add(".pl-n", (n) => (n.closest(".minor") || n.classList.contains("st") ? 4 : 1));
    add(".ring-n", 1.5);
    add(".realm-n", 2);
    add(".edge > .sc", 2.5);
    add(".lbl:not(.mt-l):not(.tx-l) > .sc", 3);
    add(".lm-n", 5);
    add(".tx-l > .sc, .mt-l > .sc", 6);
    add(".rv-n", 7);
    add(".jname", 8);
    const vw = innerWidth, vh = innerHeight, placed = [], seen = [], pad = 1.5;
    const inView = (r) => r.width >= 1 && r.right > 0 && r.left < vw && r.bottom > 0 && r.top < vh;
    const hits = (r) => placed.some((q) => r.left < q.right - pad && r.right > q.left + pad && r.top < q.bottom - pad && r.bottom > q.top + pad);
    // 地点图标本身也是障碍
    svg.querySelectorAll(".pl:not(.off) .ic2").forEach((ic) => { const r = ic.getBoundingClientRect(); if (inView(r)) placed.push(r); });
    U.forEach((u) => {
      u.r = u.n.closest(".off,.gone,.realm:not(.on),.veiled") ? null : u.n.getBoundingClientRect();
      if (u.r && !inView(u.r)) u.r = null;
      u.h = u.r ? u.r.height : 0;
      if (u.r && u.n.classList.contains("pl-n")) { // 记下图标中心，算出“放右边”的原始位置
        const ic = u.n.parentNode.querySelector(".ic2").getBoundingClientRect(); u.cx = (ic.left + ic.right) / 2;
        if (u.n.classList.contains("lf")) u.r = new DOMRect(2 * u.cx - u.r.right, u.r.top, u.r.width, u.r.height);
      }
    });
    U.sort((a, b) => a.pri - b.pri || b.h - a.h);
    U.forEach((u) => {
      if (!u.r) { u.n.classList.remove("dc"); return; }
      let r = u.r, lf = false;
      const txt = (u.n.textContent || "").replace(/（废墟）| \(ruins\)/, "").trim();
      let hit = hits(r);
      if (hit && u.cx != null) { const r2 = new DOMRect(2 * u.cx - r.right, r.top, r.width, r.height); if (!hits(r2)) { r = r2; lf = true; hit = false; } }
      const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
      if (!hit && txt) hit = seen.some((q) => q.t === txt && Math.hypot(q.x - cx, q.y - cy) < 160);
      u.n.classList.toggle("dc", hit);
      if (u.cx != null) u.n.classList.toggle("lf", lf);
      if (!hit) { placed.push(r); if (txt) seen.push({ t: txt, x: cx, y: cy }); }
    });
  }
  function scaleBar(k) { // 100 里格 ≈ 125 地图单位
    const sb = document.getElementById("scalebar"); if (!sb) return;
    let lg = 100; while (lg > 10 && (lg * 1.25) / k > 150) lg /= 2;
    if ((lg * 1.25) / k < 40) lg *= 2;
    const px = (lg * 1.25) / k;
    sb.querySelector("i").style.width = px.toFixed(0) + "px";
    sb.querySelector("b").textContent = EN ? `${lg} leagues ≈ ${Math.round(lg * 3)} miles` : `${lg} 里格 ≈ ${Math.round(lg * 4.8)} 公里`;
  }
  let flyRaf = 0, userMoved = 0;
  function flyTo(x, y, w, ms = 1300) { // (x,y) 为目标中心
    cancelAnimationFrame(flyRaf);
    w = clamp(w, 180, BW);
    const h = (w * ch) / cw, s = { ...cam }, e = { x: x - w / 2, y: y - h / 2, w };
    const t0 = performance.now();
    const step = (now) => { const k = ease(clamp((now - t0) / ms, 0, 1)); cam.x = lerp(s.x, e.x, k); cam.y = lerp(s.y, e.y, k); cam.w = lerp(s.w, e.w, k); applyCam(); if (k < 1) flyRaf = requestAnimationFrame(step); };
    flyRaf = requestAnimationFrame(step);
  }
  const flyBox = ([x, y, w]) => { const h = (w * ch) / cw; flyTo(x + w / 2, y + Math.min(h, w * 0.75) / 2 + (h > w * 0.75 ? 0 : 0), w); };
  function zoomAt(f, sx, sy) {
    const nw = clamp(cam.w * f, 180, BW), px = cam.x + (sx / cw) * cam.w, py = cam.y + (sy / cw) * cam.w;
    cam.x = px - (sx / cw) * nw; cam.y = py - (sy / cw) * nw; cam.w = nw; applyCam();
  }
  function bindPan() {
    let drag = null; const pts = new Map();
    svg.addEventListener("wheel", (e) => { e.preventDefault(); cancelAnimationFrame(flyRaf); userMoved = Date.now(); const r = svg.getBoundingClientRect(); zoomAt(Math.exp(e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    svg.addEventListener("pointerdown", (e) => { pts.set(e.pointerId, [e.clientX, e.clientY]); if (pts.size === 1) drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false }; cancelAnimationFrame(flyRaf); });
    svg.addEventListener("pointermove", (e) => {
      if (!pts.has(e.pointerId)) return;
      const prev = pts.get(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pts.size === 2) { const [a, b] = [...pts.values()], [pa] = [prev]; const other = [...pts.entries()].find(([id]) => id !== e.pointerId)[1]; const d0 = Math.hypot(pa[0] - other[0], pa[1] - other[1]), d1 = Math.hypot(a[0] - b[0], a[1] - b[1]); const r = svg.getBoundingClientRect(); if (d0 > 0) zoomAt(d0 / d1, (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top); drag = null; userMoved = Date.now(); return; }
      if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) { drag.moved = true; svg.setPointerCapture?.(e.pointerId); }
      if (drag.moved) { cam.x = drag.cx - (dx / cw) * cam.w; cam.y = drag.cy - (dy / cw) * cam.w; applyCam(); userMoved = Date.now(); }
    });
    const up = (e) => { pts.delete(e.pointerId); if (!pts.size) drag = null; };
    svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
    $("#zin").onclick = () => zoomAt(0.7, cw / 2, ch / 2); $("#zout").onclick = () => zoomAt(1.4, cw / 2, ch / 2);
    $("#zfit").onclick = () => flyBox(eraOf(T).cam);
    addEventListener("resize", () => applyCam());
  }

  /* ——脉冲与地名卡—— */
  function pulse(x, y, cls = "") {
    const g = el("g", { class: "pulse " + cls, transform: `translate(${x},${y})` }, L.fx);
    const s = el("g", { class: "sc" }, g); el("circle", { r: 10 }, s); el("circle", { r: 10, class: "p2" }, s);
    setTimeout(() => g.remove(), 2600);
  }
  function showPlace(p) {
    const evs = D.EVENTS.filter((e) => e.at === p.id);
    const kind = tr({ elf: "精灵", man: "人类", dwarf: "矮人", hob: "霍比特人", dark: "黑暗势力", site: "地标" }[p.k]);
    openCard(`<div class="pc-k">${esc(dot(kind, p.en))}</div><h3>${esc(p.tx.textContent)}</h3>` + (evs.length ? `<ul class="pc-ev">${evs.map((e) => `<li data-t="${e.t}"><b>${esc(fmt(e.t, hasDay(e.t)))}</b>${esc(e.h)}</li>`).join("")}</ul>` : `<p class="muted">${tr("这里在编年里还没有专门的记载。")}</p>`));
    pulse(p.x, p.y);
  }
  function openCard(html) { const c = $("#card"); c.innerHTML = `<button class="x" aria-label="${tr("关闭")}">×</button>` + html; c.hidden = false; }
  $("#card").addEventListener("click", (e) => { if (e.target.closest(".x")) return ($("#card").hidden = true);
    const bm = e.target.closest(".bio-more"); if (bm) { const open = bm.closest(".bio").classList.toggle("open"); bm.textContent = open ? tr("收起 ▴") : tr("展开完整传记 ▾"); return; }
    const fo = e.target.closest("[data-follow]"); if (fo) return followJ(fo.dataset.follow);
    const ho = e.target.closest("[data-home]"); if (ho) { pause(); setT(+ho.dataset.home + 1e-4); const a = ho.dataset.at, [x, y] = a.includes(",") ? a.split(",").map(Number) : xy(a); flyTo(x, y, fine(T) ? 420 : 640); userMoved = Date.now(); pulse(x, y, "k-ring"); return; } const li = e.target.closest("[data-t]"); if (li) { const ev = D.EVENTS.find((x) => x.t === +li.dataset.t); if (ev) goEvent(ev); } });

  /* ======================= 时光机 ======================= */
  const tm = $("#tm"), track = $("#tmTrack"), thumb = $("#tmThumb");
  function buildTM() {
    $("#tmBands").innerHTML = ERAS.map((e) => `<button class="band" style="left:${e.p0 * 100}%;width:${(e.p1 - e.p0) * 100}%;--c:${e.col}" data-era="${e.id}" title="${esc(dot(e.n, e.en))}"><span>${esc(e.sn || e.n)}</span></button>`).join("");
    $("#tmTicks").innerHTML = D.EVENTS.map((e, i) => `<i class="tick k-${e.k}${e.b ? " b" : ""}" style="left:${(posOf(e.t) * 100).toFixed(3)}%" data-i="${i}" title="${esc(fmt(e.t, hasDay(e.t)) + " · " + e.h)}"></i>`).join("");
    $("#tmBands").addEventListener("click", (e) => { const b = e.target.closest("[data-era]"); if (!b) return; const er = ERAS.find((x) => x.id === b.dataset.era); setT(er.a + (er.id === "trees" ? 1 : 0.001), true); flyBox(er.cam); });
    $("#tmTicks").addEventListener("click", (e) => { const k = e.target.closest(".tick"); if (k) goEvent(D.EVENTS[+k.dataset.i]); });
    let dragging = false;
    const fromX = (cx) => { const r = track.getBoundingClientRect(); return tAt((cx - r.left) / r.width); };
    track.addEventListener("pointerdown", (e) => { if (e.target.closest(".tick")) return; dragging = true; track.setPointerCapture(e.pointerId); pause(); setT(fromX(e.clientX), true); });
    track.addEventListener("pointermove", (e) => { const r = track.getBoundingClientRect(); const t = tAt((e.clientX - r.left) / r.width); $("#tmHover").textContent = fmt(t, fine(t)); $("#tmHover").style.left = clamp(e.clientX - r.left, 40, r.width - 40) + "px"; if (dragging) setT(t, true); });
    track.addEventListener("pointerleave", () => ($("#tmHover").textContent = ""));
    track.addEventListener("pointerup", () => (dragging = false));
    $("#tmPlay").onclick = () => (playing ? pause() : play());
    $("#tmSpeed").onclick = () => { speed = speed === 1 ? 2 : speed === 2 ? 4 : 1; $("#tmSpeed").textContent = speed + "×"; };
    $("#tmPrev").onclick = () => stepEvent(-1); $("#tmNext").onclick = () => stepEvent(1);
  }
  let lastEra = null, lastEvIdx = -1;
  function setT(t, user) {
    const T_ = T; T = clamp(t, T0, T1 - 0.001);
    if (playing && !user && moAuto && !follow) { const m = MO.find((x) => x.t > T_ + 1e-9 && x.t <= T + 1e-9); if (m) { T = m.t; setTimeout(() => openMoment(m.id, true), 0); } }
    thumb.style.left = posOf(T) * 100 + "%"; $("#tmFill").style.width = posOf(T) * 100 + "%";
    const e = eraOf(T);
    $("#tmDate").textContent = fmt(T, fine(T)); $("#tmEra").textContent = dot(e.n, e.en);
    if (H3) { const [mo, dd] = md(T); if (age(T).y == null) $("#tmCal").textContent = ""; else { const wk = Math.min(4, Math.ceil(dd / 7)), dy = ((dd - 1) % 7) + 1; $("#tmCal").textContent = EN ? `Month ${mo} · Week ${wk} · Day ${dy}` : `第${mo}月 · 第${wk}周 · 第${dy}天`; } }
    tm.style.setProperty("--era", e.col); document.body.dataset.era = e.id;
    $$(".band").forEach((b) => b.classList.toggle("cur", b.dataset.era === e.id));
    if (lastEra && lastEra !== e.id && !reading && Date.now() - userMoved > 2500) flyBox(e.cam);
    if (lastEra !== e.id) onEra(e);
    lastEra = e.id;
    // 越过的事件：播放时弹出
    let idx = -1; D.EVENTS.forEach((ev, i) => { if (ev.t <= T + 1e-6) idx = i; });
    if (idx !== lastEvIdx) { if ((playing || follow) && idx > lastEvIdx && idx >= 0) toast(D.EVENTS[idx]); lastEvIdx = idx; markChron(idx); }
    $$(".tick").forEach((k, i) => k.classList.toggle("past", i <= idx));
    updateMap();
  }
  function onEra(e) {
    if (e.id === "fa" && lastEra === "trees") flash(tr("日月初升 · 第一纪元"));
    if (e.id === "sa" && lastEra === "fa") flash(tr("贝烈瑞安德沉入大海 · 第二纪元"));
    if (e.id === "ta" && lastEra === "sa") flash(tr("索隆败亡 · 第三纪元"));
    if (e.id === "fo" && lastEra === "war") flash(tr("精灵西渡 · 第四纪元"));
  }
  function flash(s) { const f = $("#eraFlash"); f.textContent = s; f.classList.remove("on"); void f.offsetWidth; f.classList.add("on"); }
  let playing = false, speed = 1, raf = 0, last = 0;
  /* ——人物走得慢一点：任何一支队伍在屏幕上每秒最多走约 5% 宽—— */
  function capMove(t, nt, dt) {
    if (nt <= t) return nt;
    let m = 0;
    for (const j of JR) {
      const a = j.P[0].t, b = j.P[j.P.length - 1].t; if (nt < a || t > b) continue;
      const t0 = Math.max(t, a), t1 = Math.min(nt, b);
      if (j.P.some((q) => q.gap && q.t > t0 && q.t <= t1)) continue;
      const r0 = at(j.P, t0), r1 = at(j.P, t1); if (!r0 || !r1 || r0.hidden || r1.hidden) continue;
      m = Math.max(m, Math.hypot(r1.pos[0] - r0.pos[0], r1.pos[1] - r0.pos[1]));
    }
    const lim = cam.w * 0.05 * dt * speed;
    return m > lim ? t + ((nt - t) * lim) / m : nt;
  }
  /* ——人物登场：第一次出现时弹出插画，几秒后淡去—— */
  let FIRST = null;
  function firstTimes() {
    FIRST = {};
    RES.forEach((r) => { if (FIRST[r.c.id] == null || r.from < FIRST[r.c.id]) FIRST[r.c.id] = r.from; });
    JR.forEach((j) => [...(j.who || []), ...(j.whoAt || []).flatMap(([, l]) => l)].forEach((id) => { const jt = joinT(j, id); if (FIRST[id] == null || jt < FIRST[id]) FIRST[id] = jt; }));
  }
  const seen = new Set(); let debutQ = [], debutOn = 0;
  const slowK = () => (debutOn ? 0.35 : 1);
  function debutCheck(t, away) {
    const vis = new Set(); RES.forEach((r) => r.vis && vis.add(r.c.id)); away.forEach((id) => vis.add(id));
    if (!FIRST) firstTimes();
    for (const id in FIRST) if (t < FIRST[id] - 1e-6) seen.delete(id);
    vis.forEach((id) => {
      if (seen.has(id)) return; seen.add(id);
      if ((playing || follow) && !debutQ.includes(id)) debutQ.push(id);
    });
    if (debutQ.length > 6) debutQ = debutQ.slice(-6);
    pumpDebut();
  }
  function pumpDebut() {
    const box = $("#debut"); if (!box) return;
    while (debutQ.length && box.children.length < (innerWidth <= 860 ? 1 : 2)) {
      const id = debutQ.shift(), c = CI[id]; if (!c) continue;
      const w = whereIs(id); if (w) pulse(w[0], w[1], "k-" + (c.r === "dark" ? "dark" : "ring"));
      const d = document.createElement("button"); d.className = "debut r-" + c.r; d.dataset.c = id;
      d.innerHTML = `<span class="db-pt">${PT(c)}</span><span class="db-tx"><small>${tr("登场")} · ${esc(RACE[c.r] || "")}</small><b>${esc(c.n)}</b><i>${esc(c.en)}</i><em>${esc(EN ? (c.bio || "").split(/(?<=\.)\s/)[0] : (c.bio || "").split("。")[0] + "。")}</em></span>`;
      box.appendChild(d); debutOn++;
      const hold = debutQ.length > 2 ? 3200 : 4600;
      setTimeout(() => d.classList.add("out"), hold);
      setTimeout(() => { d.remove(); debutOn = Math.max(0, debutOn - 1); pumpDebut(); }, hold + 1300);
    }
  }
  const DUR = 240; // 1× 下整条时间轴约 4 分钟
  function play() {
    endFollow();
    if (T >= T1 - 0.01) setT(T0);
    playing = true; $("#tmPlay").classList.add("on"); $("#tmPlay").setAttribute("aria-label", tr("暂停")); last = performance.now();
    const step = (now) => { if (!playing) return; const dt = Math.min(0.1, (now - last) / 1000); last = now; const p = posOf(T) + (dt * speed * slowK()) / DUR; if (p >= 1) { setT(T1 - 0.001); return pause(); } setT(capMove(T, tAt(p), dt)); raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  }
  function pause() { endFollow(); playing = false; cancelAnimationFrame(raf); $("#tmPlay").classList.remove("on"); $("#tmPlay").setAttribute("aria-label", tr("播放")); }
  function stepEvent(dir) {
    pause(); const i = D.EVENTS.findIndex((e) => e.t > T + 1e-6);
    const cur = i < 0 ? D.EVENTS.length - 1 : i - 1;
    const n = clamp(dir > 0 ? (i < 0 ? D.EVENTS.length - 1 : i) : cur - (Math.abs(D.EVENTS[Math.max(0, cur)].t - T) < 1e-6 ? 1 : 0), 0, D.EVENTS.length - 1);
    goEvent(D.EVENTS[n]);
  }
  /* ——跟随一段旅程：慢放 + 镜头跟着小人走—— */
  let follow = null;
  function followJ(id) {
    const j = JR.find((x) => x.id === id); if (!j) return;
    pause(); $("#card").hidden = true;
    const t0 = j.P[0].t, t1 = j.P[j.P.length - 1].t, xs = j.P.map((p) => p.x), ys = j.P.map((p) => p.y);
    const bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
    const f = { j, t1, rate: (t1 - t0) / clamp(j.P.length * 3.6, 22, 54), w: clamp(Math.max(bw, (bh * cw) / ch) * 0.6, 320, 900) };
    setT(t0 + 1e-6); flyTo(j.P[0].x, j.P[0].y, f.w, 900); f.mv = userMoved = Date.now(); follow = f;
    $("#tmPlay").classList.add("on"); document.body.classList.add("following");
    const fb = $("#follow"); fb.hidden = false; fb.innerHTML = `<span>${tr("跟随")}</span><b style="color:${j.c}">${esc(j.n)}</b><button aria-label="${tr("停止跟随")}">×</button>`;
    setTimeout(() => { if (follow !== f) return; last = performance.now(); raf = requestAnimationFrame(fstep); }, 900);
  }
  function fstep(now) {
    const f = follow; if (!f) return;
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    const nt = capMove(T, T + dt * f.rate * speed * slowK(), dt);
    if (nt >= f.t1) { setT(f.t1 - 1e-6); return pause(); }
    setT(nt);
    const r = at(f.j.P, T);
    if (r && (userMoved === f.mv || Date.now() - userMoved > 3000)) {
      const h = (cam.w * ch) / cw; cam.x += (r.pos[0] - cam.w / 2 - cam.x) * 0.06; cam.y += (r.pos[1] - h / 2 - cam.y) * 0.06; cam.w += (f.w - cam.w) * 0.03; applyCam();
    }
    raf = requestAnimationFrame(fstep);
  }
  function endFollow() { if (!follow) return; follow = null; cancelAnimationFrame(raf); document.body.classList.remove("following"); $("#follow").hidden = true; $("#tmPlay").classList.remove("on"); }

  /* ——人物卡 / 旅程卡—— */
  const PT = (c) => (window.PORTRAIT ? window.PORTRAIT(c) : "");
  const chSvg = (id, cls = "") => `<svg class="${cls}" viewBox="-24 -68 48 74" aria-hidden="true"><use href="#chb-${id}"/></svg>`;
  function charJourneys(id) { return JR.filter((j) => (j.who || []).includes(id) || (j.whoAt || []).some(([, l]) => l.includes(id))); }
  function whereIs(id) {
    const j = JR.find((x) => x.vis && x.curWho.includes(id)); if (j) return j.curPos;
    const r = RES.find((x) => x.vis && x.c.id === id); return r ? [r.x, r.y] : null;
  }
  function showChar(id, jump) {
    const c = CI[id]; if (!c) return;
    const js = charJourneys(id);
    if (jump && !whereIs(id)) {
      const opts = [...(c.homes || []).map((h) => h[1] + 1e-4), ...js.map((j) => joinT(j, id) + 1e-4)].sort((a, b) => a - b);
      if (opts.length) { pause(); setT(opts[0]); }
    }
    const w = whereIs(id);
    if (w && jump) { flyTo(w[0], w[1], fine(T) ? 420 : 640); userMoved = Date.now(); }
    if (w) pulse(w[0], w[1], "k-" + (c.r === "dark" ? "dark" : "ring"));
    const inB = (b) => b.units.some((u) => [...(CH.HEROES[b.id + "." + u.id] || []), ...((CH.TROOPS || {})[b.id + "." + u.id]?.lead || [])].includes(id));
    const bs = BATTLES.filter(inB).sort((a, b) => a.t - b.t);
    const homes = (c.homes || []).map(([at, from, to, hn]) => `<li data-home="${from}" data-at="${Array.isArray(at) ? at.join(",") : at}"><b>${esc(fmt(from))} — ${esc(fmt(to))}</b>${esc(hn || placeName(at))}</li>`).join("");
    openCard(`<div class="cc"><div class="cc-pt">${PT(c)}</div><div><div class="pc-k">${esc(dot(RACE[c.r], c.en))}</div><h3>${esc(c.n)}</h3></div></div>` + (H3 ? statsHtml(c, bs.length, js.length) : "") + `<p class="cc-bio">${esc(c.bio)}</p>` + bioHtml(id) +
      (homes ? `<h5 class="cc-h">${tr("居所")}</h5><ul class="pc-ev">${homes}</ul>` : "") +
      (bs.length ? `<h5 class="cc-h">${tr("参战")}</h5><div class="cc-js">${bs.map((x) => `<button class="go-b" data-b="${x.id}" style="--c:#8a2a1a">⚔ ${esc(x.n)}<small>${esc(x.age)}</small></button>`).join("")}</div>` : "") +
      (js.length ? `<h5 class="cc-h">${tr("足迹 · 点一下跟着走")}</h5><div class="cc-js">${js.map((j) => `<button data-follow="${j.id}" style="--c:${j.c}">▶ ${esc(j.n)}<small>${esc(fmt(j.P[0].t, hasDay(j.P[0].t)))}</small></button>`).join("")}</div>` : ""));
  }
  function bioHtml(id) {
    const b = (window.ME_BIO || {})[id]; if (!b) return "";
    return `<div class="bio">` +
      (b.line ? `<blockquote class="bio-q">“${esc(b.line)}”</blockquote>` : "") +
      `<dl class="bio-m">${b.alias ? `<dt>${tr("称号")}</dt><dd>${esc(b.alias)}</dd>` : ""}${b.life ? `<dt>${tr("生平")}</dt><dd>${esc(b.life)}</dd>` : ""}${b.kin ? `<dt>${tr("亲族")}</dt><dd>${esc(b.kin)}</dd>` : ""}</dl>` +
      `<h5 class="cc-h">${tr("传记")}</h5><ol class="bio-ch">${(b.chapters || []).map(([h, tx], i) => `<li${i > 1 ? ' class="fold"' : ""}><b>${esc(h)}</b><p>${esc(tx)}</p></li>`).join("")}</ol>` +
      ((b.chapters || []).length > 2 ? `<button class="bio-more">${tr("展开完整传记 ▾")}</button>` : "") +
      (b.fate ? `<p class="bio-f"><b>${tr("结局")}</b>${esc(b.fate)}</p>` : "") + `</div>`;
  }
  function showJourney(j) {
    const who = j.curWho || whoAt(j, T);
    openCard(`<div class="pc-k">${tr(j.mig ? "迁徙" : "旅程")} · ${esc(fmt(j.P[0].t, hasDay(j.P[0].t)))} — ${esc(fmt(j.P[j.P.length - 1].t, hasDay(j.P[j.P.length - 1].t)))}</div><h3>${esc(j.n)}</h3>
      <div class="cc-who">${who.map((id) => `<button data-c="${id}">${chSvg(id)}<span>${esc(CI[id]?.n || id)}</span></button>`).join("")}</div>
      <button class="cc-follow" data-follow="${j.id}" style="--c:${j.c}">▶ ${tr("从头跟随这段路")}</button>`);
  }

  let toastTimer = 0;
  function toast(ev) {
    const t = $("#toast");
    t.innerHTML = `<div class="ts-d">${esc(fmt(ev.t, hasDay(ev.t)))}${ev.at && placeName(ev.at) ? " · " + esc(placeName(ev.at)) : ""}</div><b>${esc(ev.h)}</b><p>${esc(ev.p)}</p>${ev.b ? `<button class="go-b" data-b="${ev.b}">⚔ ${tr("身临战场")}</button>` : ""}`;
    t.className = "toast on k-" + ev.k; clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("on"), Math.max(4500, ev.p.length * 70) / speed);
    const [x, y] = xy(ev.at); pulse(x, y, "k-" + ev.k);
  }
  function goEvent(ev, keepCam) {
    pause(); setT(ev.t + 1e-7); const [x, y] = xy(ev.at);
    if (!keepCam) { const z = ev.t < 591 ? 700 : ev.t < 4032 && x < 100 ? 900 : eraOf(ev.t).id === "war" ? 460 : 620; flyTo(x, y, z); userMoved = Date.now(); }
    pulse(x, y, "k-" + ev.k); toast(ev);
    const li = $(`#chron li[data-i="${D.EVENTS.indexOf(ev)}"]`); if (li && panelTab === "chron") li.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  /* ======================= 侧栏：编年 / 传说 / 战役 ======================= */
  let panelTab = "chron", reading = null;
  const KIND = Object.fromEntries(Object.entries({ elf: "精灵", man: "人类", dwarf: "矮人", hob: "霍比特", dark: "暗影", ring: "魔戒", war: "战争" }).map(([k, v]) => [k, tr(v)]));
  function buildPanel() {
    $("#tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) setTab(b.dataset.tab); });
    // 编年
    let html = "", cur = null;
    D.EVENTS.forEach((e, i) => {
      const er = eraOf(e.t);
      if (er.id !== cur) { html += `${cur ? "</ul>" : ""}<h4 class="ch-era" style="--c:${er.col}">${esc(er.n)}<small>${esc(er.en)}</small></h4><ul>`; cur = er.id; }
      html += `<li class="k-${e.k}" data-i="${i}"><span class="d">${esc(fmt(e.t, hasDay(e.t)).replace(/^(第.纪元|FA|SA|TA|FoA) /, ""))}</span><b>${esc(e.h)}</b>${e.b ? `<button class="mini go-b" data-b="${e.b}" title="${tr("身临战场")}">⚔</button>` : ""}${e.l ? `<button class="mini go-l" data-l="${e.l}" title="${tr("读传说")}">❧</button>` : ""}${(() => { const m = MO.find((m) => Math.abs(m.t - e.t) < (e.t > 6900 ? 0.006 : 0.6) && (m.at === e.at || e.t > 6900)); return m ? `<button class="mini go-m" data-mo="${m.id}" title="${tr("关键时刻")}">✦</button>` : ""; })()}</li>`;
    });
    $("#chron").innerHTML = html + "</ul>";
    $("#chron").addEventListener("click", (e) => { if (e.target.closest(".mini")) return; const li = e.target.closest("li[data-i]"); if (li) goEvent(D.EVENTS[+li.dataset.i]); });
    // 传说
    $("#legends").innerHTML = `<p class="hint">${tr("每个传说是一段引导式阅读：点“下一段”，地图会飞到故事发生的地方，时间也会拨到那一年。")}</p>` + D.LEGENDS.map((l) => `<button class="lg-card" data-l="${l.id}"><span class="lg-y">${esc(fmt(l.beats[0].t).replace(/ \d+( 年)?$/, ""))}</span><b>${esc(l.n)}</b><i>${esc(l.en)}</i><span class="lg-s">${esc(l.sub)}</span><span class="lg-n">${l.beats.length} ${tr("段")}</span></button>`).join("") +
      (MO.length ? `<h4 class="ch-race mo-h">✦ ${tr("关键时刻")}</h4><p class="hint">${tr("那些被反复讲述的瞬间。播放时间轴走到这里会自动停下，也可以直接点开。")}</p><div class="mo-list">${MO.map((m) => `<button class="mo-card" data-mo="${m.id}"><span class="mo-y">${esc(fmt(m.t, hasDay(m.t)))}</span><b>${esc(m.h)}</b>${m.line ? `<i>${esc(m.line)}</i>` : ""}</button>`).join("")}</div>` : "");
    // 人物
    $("#chars").innerHTML = `<p class="hint">${tr("中洲的 {n} 位人物。点一个人，地图会跳到他出现的年代和地点；在人物卡里点“足迹”，就能跟着他走完那段路。地图上走动的小队就是正在旅行的人。").replace("{n}", CH.CHARS.length)}</p>` +
      CH.RACES.map(([r, n]) => `<h4 class="ch-race">${esc(n)}</h4><div class="cgrid">${CH.CHARS.filter((c) => c.r === r).map((c) => `<button class="cbtn" data-c="${c.id}" data-jump="1"><span class="cb-pt">${PT(c)}</span><b>${esc(c.n)}</b></button>`).join("")}</div>`).join("");
    // 战役
    $("#battles").innerHTML = `<p class="hint">${tr("选一场战役进入战场：分阶段推演兵力移动，你会以一个普通人的视角经历它。")}</p>` + [...BATTLES].sort((a, b) => a.t - b.t).map((b) => `<button class="bt-card" data-b="${b.id}"><span class="bt-y">${esc(b.age)}</span><b>${esc(b.n)}</b><i>${esc(b.en)}</i><span class="bt-s"><em class="w">${esc(b.sides.w)}</em> ${tr("对")} <em class="e">${esc(b.sides.e)}</em></span><span class="bt-go">${tr("进入战场 ▸")}</span></button>`).join("");
    document.addEventListener("click", (e) => {
      const mo = e.target.closest("[data-mo]"); if (mo) { e.preventDefault(); if (mo.dataset.mo) { if (innerWidth <= 860) document.body.classList.remove("panel-open"); openMoment(mo.dataset.mo); } return; }
      const b = e.target.closest("[data-b]"); if (b && b.dataset.b) { e.preventDefault(); closeMoment(); return openBattle(b.dataset.b); }
      const l = e.target.closest(".go-l,.lg-card,.mo-lg"); if (l) { closeMoment(); setTab("legends"); return openLegend(l.dataset.l, 0); }
      const c = e.target.closest("button[data-c]"); if (c) { closeMoment(); if (innerWidth <= 860 && c.dataset.jump) document.body.classList.remove("panel-open"); return showChar(c.dataset.c, !!c.dataset.jump); }
    });
    $("#reader").addEventListener("click", (e) => {
      if (e.target.closest(".rd-back")) return closeLegend();
      const n = e.target.closest("[data-beat]"); if (n) return openLegend(reading.id, +n.dataset.beat);
    });
  }
  function setTab(t) { panelTab = t; $$("#tabs [data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === t)); $$(".pane").forEach((p) => (p.hidden = p.dataset.pane !== t)); if (t !== "legends") closeLegend(); document.body.classList.add("panel-open"); if (t === "chron") setTimeout(() => $("#chron li.cur")?.scrollIntoView({ block: "center" }), 60); }
  function markChron(idx) { $$("#chron li").forEach((li) => { const i = +li.dataset.i; li.classList.toggle("past", i < idx); li.classList.toggle("cur", i === idx); }); }

  let moAuto = true; try { moAuto = localStorage.getItem("me-mo-auto") !== "0"; } catch (e) {}
  let moCur = null;
  function openMoment(id, fromPlay) {
    const i = MOI[id]; if (i == null) return; const m = MO[i];
    const wasPlaying = fromPlay || (moCur && moCur.resume);
    pause(); moCur = { id, resume: !!wasPlaying };
    if (Math.abs(T - m.t) > 1e-6) setT(m.t + 1e-7);
    const [x, y] = xy(m.at); flyTo(x, y, m.t > 6900 ? 260 : 520, 1600); pulse(x, y, "k-ring"); userMoved = Date.now();
    const who = (m.who || []).filter((w) => CI[w]);
    const lg = m.legend && D.LEGENDS.find((l) => l.id === m.legend);
    const box = $("#moment"); box.hidden = false; box.classList.remove("on"); void box.offsetWidth; box.classList.add("on");
    box.innerHTML = `<div class="mo-in" role="dialog" aria-modal="true" aria-label="${esc(m.h)}">
      <button class="mo-x" aria-label="${tr("关闭")}">×</button>
      <div class="mo-art">${window.ME_SCENE ? window.ME_SCENE(m, who) : ""}
        <div class="mo-cap"><span class="mo-k">✦ ${tr("关键时刻")} · ${esc(dot(fmt(m.t, hasDay(m.t)), placeName(m.at)))}</span><h2>${esc(m.h)}</h2></div></div>
      <div class="mo-body">
        ${m.line ? `<blockquote class="mo-line"><p>${esc(m.line)}</p>${m.by ? `<cite>—— ${esc(m.by)}</cite>` : ""}</blockquote>` : ""}
        ${who.length ? `<div class="mo-who">${who.map((w) => `<button class="mo-pt" data-c="${w}"><span>${PT(CI[w])}</span><b>${esc(CI[w].n)}</b></button>`).join("")}</div>` : ""}
        <div class="mo-text">${(m.scene || []).map((p, k) => `<p style="animation-delay:${0.9 + k * 0.5}s">${esc(p)}</p>`).join("")}</div>
        <div class="mo-nav">
          <button class="mo-go" data-mo="${i > 0 ? MO[i - 1].id : ""}" ${i > 0 ? "" : "disabled"}>‹ ${tr("上一个时刻")}</button>
          ${lg ? `<button class="mo-lg" data-l="${lg.id}">❧ ${esc(lg.n)}</button>` : ""}
          ${moCur.resume ? `<button class="pri mo-play">${tr("继续 ▸")}</button>` : `<button class="pri mo-go" data-mo="${i < MO.length - 1 ? MO[i + 1].id : ""}" ${i < MO.length - 1 ? "" : "disabled"}>${tr("下一个时刻")} ›</button>`}
        </div>
        <label class="mo-auto"><input type="checkbox" ${moAuto ? "checked" : ""}/> ${tr("播放时遇到关键时刻自动停下")}</label>
      </div></div>`;
    box.querySelector(".mo-in").scrollTop = 0;
    history.replaceState(null, "", `#m=${id}`);
  }
  function closeMoment(resume) {
    const box = $("#moment"); if (box.hidden) return;
    const r = resume && moCur && moCur.resume; box.hidden = true; box.innerHTML = ""; moCur = null;
    if (r) play();
  }
  function openLegend(id, k) {
    const lg = D.LEGENDS.find((l) => l.id === id); if (!lg) return;
    pause(); reading = { id, k }; const b = lg.beats[k];
    $("#legends").hidden = true; const r = $("#reader"); r.hidden = false;
    r.innerHTML = `<button class="rd-back">← ${tr("全部传说")}</button><div class="rd-head"><i>${esc(lg.en)}</i><h3>${esc(lg.n)}</h3><p>${esc(lg.sub)}</p></div>
      <ol class="rd-dots">${lg.beats.map((x, i) => `<li><button data-beat="${i}" class="${i === k ? "on" : i < k ? "past" : ""}" title="${esc(x.h)}"></button></li>`).join("")}</ol>
      <article class="rd-beat" key="${k}"><div class="rd-d">${esc(fmt(b.t, hasDay(b.t)))}${placeName(b.at) ? " · " + esc(placeName(b.at)) : ""}</div><h4>${esc(b.h)}</h4><p>${esc(b.p)}</p></article>
      <div class="rd-nav">${k > 0 ? `<button data-beat="${k - 1}">‹ ${tr("上一段")}</button>` : "<span></span>"}<span class="rd-k">${k + 1} / ${lg.beats.length}</span>${k < lg.beats.length - 1 ? `<button class="pri" data-beat="${k + 1}">${tr("下一段")} ›</button>` : `<button class="pri rd-back">${tr("读完了 · 回到列表")}</button>`}</div>
      ${(() => { const near = (m) => { let bi = -1, bd = 1e9; lg.beats.forEach((x, j) => { const d = Math.abs(x.t - m.t) + (x.at === m.at ? 0 : m.t > 6900 ? 0.004 : 3); if (d < bd) { bd = d; bi = j; } }); return bd < (m.t > 6900 ? 0.03 : 30) ? bi : -1; }; const ms = MO.filter((m) => m.legend === id && near(m) === k); return ms.map((m) => `<button class="go-m wide" data-mo="${m.id}">✦ ${tr("关键时刻")}${EN ? ": " : "："}${esc(m.h)}</button>`).join(""); })()}
      ${(() => { const bs = BATTLES.filter((x) => Math.abs(x.t - b.t) < 0.05); return bs.length ? `<button class="go-b wide" data-b="${bs[0].id}">⚔ ${tr("身临")}${esc(bs[0].n)}</button>` : ""; })()}`;
    setT(b.t + 1e-7); const [x, y] = xy(b.at); flyTo(x, y, b.z || 700); pulse(x, y, "k-ring"); userMoved = Date.now();
    history.replaceState(null, "", `#l=${id}&k=${k}`);
  }
  function closeLegend() { reading = null; $("#reader").hidden = true; $("#legends").hidden = false; }

  /* ======================= 战役 ======================= */
  const B = { el: $("#battle"), svg: $("#bsvg"), cur: null, k: -1, cam: { x: 0, y: 0, w: 1000 }, raf: 0, auto: false, timer: 0 };
  const SIDEC = { w: "w", e: "e", n: "n" };
  function openBattle(id) {
    const b = BATTLES.find((x) => x.id === id); if (!b) return;
    pause(); B.cur = b; B.k = -1; B.el.hidden = false; document.body.classList.add("in-battle");
    const s = B.svg; s.innerHTML = "";
    s.setAttribute("viewBox", "0 0 1000 600"); B.cam = { x: 0, y: 0, w: 1000 };
    const defs = el("defs", {}, s);
    defs.innerHTML = `<pattern id="bp-w" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" class="bpw"/><circle cx="4" cy="4" r="1.3" class="bpd"/></pattern>
      <pattern id="bp-e" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" class="bpe"/><path d="M2 2l4 4M6 2l-4 4" class="bpd"/></pattern>
      <pattern id="bp-n" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" class="bpn"/></pattern>
      <filter id="bblur"><feGaussianBlur stdDeviation="14"/></filter>
      <radialGradient id="bglow"><stop offset="0" stop-color="#ffb347" stop-opacity=".9"/><stop offset=".5" stop-color="#ff5a1f" stop-opacity=".35"/><stop offset="1" stop-color="#ff5a1f" stop-opacity="0"/></radialGradient>
      <marker id="bah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="bah"/></marker>`;
    const scene = el("g", { class: "scene" }, s);
    b.terrain.forEach((tr) => {
      if (tr.k === "poly") { el("path", { d: tr.pts.length <= 4 ? "M" + tr.pts.join("L") + "Z" : cr(tr.pts, true), class: "bt-" + tr.f }, scene); if (tr.f === "cliff" || tr.f === "dark") { seed = tr.pts.length * 31; const g = el("g", { class: "bt-hatch" + (tr.f === "dark" ? " dk" : "") }, scene); const xs = tr.pts.map((p) => p[0]), ys = tr.pts.map((p) => p[1]); for (let i = 0; i < 160; i++) { const x = lerp(Math.min(...xs), Math.max(...xs), rnd()), y = lerp(Math.min(...ys), Math.max(...ys), rnd()); if (inPoly(x, y, tr.pts)) el("path", { d: `M${x - 7},${y + 5}L${x},${y - 6}L${x + 7},${y + 5}` }, g); } } if (tr.f === "marsh") { const g = el("g", { class: "bt-reeds" }, scene); seed = 99; const xs = tr.pts.map((p) => p[0]), ys = tr.pts.map((p) => p[1]); for (let i = 0; i < 90; i++) { const x = lerp(Math.min(...xs), Math.max(...xs), rnd()), y = lerp(Math.min(...ys), Math.max(...ys), rnd()); if (inPoly(x, y, tr.pts)) el("path", { d: `M${x - 5},${y}h10M${x - 2},${y - 4}v4M${x + 2},${y - 3}v3` }, g); } } }
      else if (tr.k === "line") el("path", { d: cr(tr.pts), class: "bl-" + tr.s }, scene);
      else if (tr.k === "tower") { const g = el("g", { class: "b-tower", transform: `translate(${tr.x},${tr.y})` }, scene); el("circle", { r: tr.r }, g); el("circle", { r: tr.r * 0.45, class: "in" }, g); }
      else if (tr.k === "city") { const g = el("g", { class: "b-city", transform: `translate(${tr.x},${tr.y})` }, scene); for (let i = 7; i >= 1; i--) el("path", { d: `M0,${-tr.r * i / 7}A${tr.r * i / 7},${tr.r * i / 7} 0 0,1 0,${tr.r * i / 7}`, class: "tier" }, g); el("path", { d: `M0,-6L${tr.r * 0.95},0L0,6Z`, class: "prow" }, g); }
      else if (tr.k === "gate") { const g = el("g", { class: "b-gate", transform: `translate(${tr.x},${tr.y})` }, scene); el("rect", { x: -9, y: -6, width: 18, height: 12 }, g); }
      else if (tr.k === "peak") { const g = el("g", { class: "b-peak" + (tr.fire ? " fire" : ""), transform: `translate(${tr.x},${tr.y})` }, scene); el("path", { d: `M${-tr.h},${tr.h * 0.5}L-6,${-tr.h * 0.5}L6,${-tr.h * 0.5}L${tr.h},${tr.h * 0.5}Z` }, g); }
      if (tr.n) { const c = tr.k === "poly" ? centroid(tr.pts) : tr.k === "line" ? tr.pts[Math.floor(tr.pts.length / 2)] : [tr.x, tr.y + (tr.r || tr.h || 10) + 14]; el("text", { x: c[0], y: c[1], class: "b-tn" + (tr.k === "line" ? " ln" : "") }, scene).textContent = tr.n; }
      if (tr.k === "label") el("text", { x: tr.x, y: tr.y, class: "b-tn lb" }, scene).textContent = tr.n;
    });
    B.arrows = el("g", { class: "b-arrows" }, scene);
    B.units = {};
    const ug = el("g", { class: "b-units" }, scene);
    b.units.forEach((u) => {
      const g = el("g", { class: `bu s-${SIDEC[u.side]} u-${u.kind}` }, ug);
      const w = u.w || 24, h = u.h || 24;
      const hs = u.kind === "hero" && CB ? CH.HEROES[b.id + "." + u.id] : null;
      if (hs) { el("ellipse", { rx: 8 + hs.length * 9, ry: 5, cy: 8, class: "hb hb-sh" }, g); hs.forEach((id, i) => { const gg = el("g", { transform: `translate(${((i - (hs.length - 1) / 2) * 20).toFixed(1)},8)` }, g), bb = el("g", { class: "bob", style: `animation-delay:-${i * 0.2}s` }, gg); el("use", { href: "#chb-" + id, transform: "scale(.8)" }, bb); }); }
      else if (u.kind === "hero") { el("circle", { r: 7, class: "hb" }, g); el("path", { d: "M0,-7V-22L12,-18L0,-14", class: "flag" }, g); }
      else if (u.kind === "nazgul") { el("path", { d: "M-18,-4Q-8,-12 0,0Q8,-12 18,-4Q8,-6 0,6Q-8,-6 -18,-4Z", class: "naz" }, g); }
      else if (u.kind === "eagle") { for (let i = 0; i < 5; i++) el("path", { d: `M${-w / 2 + i * (w / 4) - 10},${(i % 2) * 10 - 4}q10,-10 10,0q0,-10 10,0`, class: "eag" }, g); }
      else if (u.kind === "ship") { for (let i = 0; i < 4; i++) el("path", { d: `M-12,${-h / 2 + i * (h / 4)}h24l-5,8h-14z M0,${-h / 2 + i * (h / 4)}v-12l9,8z`, class: "shp" }, g); }
      else if (u.kind === "forest") { seed = 5; for (let i = 0; i < 60; i++) el("circle", { cx: (rnd() - 0.5) * w, cy: (rnd() - 0.5) * h, r: 6 + rnd() * 6, class: "hu" }, g); }
      else if (u.kind === "troll") { el("rect", { x: -11, y: -11, width: 22, height: 22, class: "blk tr" }, g); el("path", { d: "M-6,-6L6,6M6,-6L-6,6", class: "tri" }, g); }
      else if (u.kind === "beast") { el("ellipse", { rx: w / 2, ry: h / 2, class: "blk" }, g); for (let i = 0; i < 3; i++) el("circle", { cx: (i - 1) * w / 3.5, r: Math.min(w, h) / 6, class: "bst" }, g); }
      else { el("rect", { x: -w / 2, y: -h / 2, width: w, height: h, rx: 2, class: "blk" }, g); if (u.kind === "cav") el("path", { d: `M${-w / 2 + 4},${-4}l6,4l-6,4M${-w / 2 + 12},${-4}l6,4l-6,4`, class: "chev" }, g); if (u.kind === "arc" || u.kind === "elf") el("path", { d: `M${-w / 2 + 2},${h / 2 + 4}h${w - 4}`, class: "arcl" }, g); }
      const tp = !hs && CB && CH.TROOPS ? CH.TROOPS[b.id + "." + u.id] : null;
      let top = hs ? -42 : u.kind === "hero" ? -26 : -(u.h || 24) / 2 - 6;
      if (tp) top = troops(g, u, tp, w, h, top);
      const tx = el("text", { y: top, class: "bu-n" }, g); tx.textContent = u.n;
      B.units[u.id] = { u, g, x: u.x, y: u.y, o: u.o ?? 1 };
      place(B.units[u.id], true);
    });
    B.fx = el("g", { class: "b-fx" }, s);
    $("#bTitle").textContent = b.n; $("#bEn").textContent = dot(b.en, b.age);
    renderIntro(b);
    history.replaceState(null, "", "#b=" + id);
    sound.bed("wind");
  }
  /* 部队里画满 Q 版士兵；带队人物站在最前面 */
  function troops(g, u, tp, w, h, top) {
    g.classList.add("has-sol");
    const cav = u.kind === "cav", big = tp.s === "troll";
    if (tp.s && !["nazgul", "eagle", "beast", "ship"].includes(u.kind)) {
      const sw = big ? 26 : cav ? 22 : 13, sh = big ? 30 : cav ? 22 : 17;
      const cols = Math.max(1, Math.min(14, Math.floor(w / sw))), rows = Math.max(1, Math.min(6, Math.floor(h / sh)));
      const sc = big ? 0.5 : cav ? 0.42 : 0.4, step = Math.max(1, Math.ceil((cols * rows) / 48));
      const sg = el("g", { class: "sol" }, g); let k = 0;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        if (k++ % step) continue;
        const x = (c - (cols - 1) / 2) * (w / cols) + (r % 2 ? 3 : 0), y = (r - (rows - 1) / 2) * (h / rows) + sh * 0.45;
        const gg = el("g", { transform: `translate(${x.toFixed(1)},${y.toFixed(1)})` }, sg);
        const bb = el("g", { class: "bob", style: `animation-delay:-${((r * 7 + c * 3) % 10) / 10}s` }, gg);
        if (cav) { el("use", { href: "#chb-horse", transform: `scale(${sc * 0.95})` }, bb); el("use", { href: "#chb-sol-" + tp.s, transform: `translate(0,${-8 * sc}) scale(${sc})` }, bb); }
        else el("use", { href: "#chb-sol-" + tp.s, transform: `scale(${sc})` }, bb);
      }
    } else if (["troll", "beast", "nazgul", "hero"].includes(u.kind) && tp.lead) g.classList.add("lead-only");
    if (tp.lead) {
      const n = tp.lead.length, y0 = tp.s ? -h / 2 - 2 : 10, lg = el("g", { class: "lead" }, g);
      el("ellipse", { rx: 8 + n * 9, ry: 5, cy: y0, class: "hb hb-sh" }, lg);
      tp.lead.forEach((id, i) => {
        const gg = el("g", { transform: `translate(${((i - (n - 1) / 2) * 20).toFixed(1)},${y0})` }, lg), bb = el("g", { class: "bob", style: `animation-delay:-${i * 0.2}s` }, gg);
        if (cav && tp.s) el("use", { href: "#chb-horse", transform: "scale(.66)" }, bb);
        el("use", { href: "#chb-" + id, transform: cav && tp.s ? "translate(0,-7) scale(.72)" : "scale(.78)" }, bb);
      });
      top = y0 - (cav && tp.s ? 46 : 40);
    } else if (tp.s) top = -h / 2 - 4;
    return top;
  }
  function centroid(pts) { let x = 0, y = 0; pts.forEach((p) => { x += p[0]; y += p[1]; }); return [x / pts.length, y / pts.length]; }
  function place(U, instant) { U.g.style.transition = instant ? "none" : ""; U.g.style.transform = `translate(${U.x}px,${U.y}px)`; U.g.style.opacity = U.o; }
  function renderIntro(b) {
    $("#bText").innerHTML = `<div class="b-intro"><p class="b-lead">${esc(b.intro)}</p>
      <dl class="b-forces"><dt class="w">${esc(b.sides.w)}</dt><dd>${esc(b.forces.w)}</dd><dt class="e">${esc(b.sides.e)}</dt><dd>${esc(b.forces.e)}</dd></dl>
      <div class="b-you"><span>${tr("你")}</span>${esc(b.you)}</div>
      <button class="pri b-start" data-bk="0">${tr("进入战场 ▸")}</button></div>`;
    $("#bDots").innerHTML = b.phases.map((p, i) => `<button data-bk="${i}" title="${esc(p.h)}"></button>`).join("");
    $("#bK").textContent = ""; setFx([]); camB([0, 0, 1000]);
  }
  function phase(k) {
    const b = B.cur; if (!b) return; k = clamp(k, 0, b.phases.length - 1);
    // 回放到第 k 阶段：从初始状态依次应用
    const prevPos = {}; Object.values(B.units).forEach((U) => (prevPos[U.u.id] = [U.x, U.y, U.o]));
    Object.values(B.units).forEach((U) => { U.x = U.u.x; U.y = U.u.y; U.o = U.u.o ?? 1; });
    for (let i = 0; i <= k; i++) Object.entries(b.phases[i].set || {}).forEach(([id, v]) => { const U = B.units[id]; if (!U) return; if (Array.isArray(v)) { U.x = v[0]; U.y = v[1]; } else { if (v.x != null) U.x = v.x; if (v.y != null) U.y = v.y; if (v.o != null) U.o = v.o; } });
    B.arrows.innerHTML = "";
    Object.values(B.units).forEach((U) => { const [px, py, po] = prevPos[U.u.id]; if (k === B.k + 1 && po > 0.2 && U.o > 0.2 && Math.hypot(U.x - px, U.y - py) > 24) el("path", { d: `M${px},${py}L${U.x},${U.y}`, class: "mv s-" + U.u.side, "marker-end": "url(#bah)" }, B.arrows); place(U); });
    B.k = k; const p = b.phases[k];
    camB(p.cam || [0, 0, 1000]); setFx(p.fx || []);
    if (p.sfx) sound.fx(p.sfx);
    sound.bed((p.fx || []).includes("rain") ? "rain" : "wind");
    $$("#bDots button").forEach((d, i) => { d.classList.toggle("on", i === k); d.classList.toggle("past", i < k); });
    $("#bK").textContent = EN ? `Act ${k + 1} of ${b.phases.length}` : `第 ${k + 1} 幕 / 共 ${b.phases.length} 幕`;
    const last = k === b.phases.length - 1;
    $("#bText").innerHTML = `<article class="b-ph"><div class="b-time">${esc(p.time)}</div><h3>${esc(p.h)}</h3><p>${esc(p.p)}</p><div class="b-you"><span>${tr("你")}</span>${esc(p.you)}</div>
      ${last ? `<div class="b-out"><b>${tr("结局")}</b>${esc(b.outcome)}</div>` : ""}</article>
      <div class="b-nav">${k > 0 ? `<button data-bk="${k - 1}">‹ ${tr("上一幕")}</button>` : `<button data-bk="intro">‹ ${tr("序")}</button>`}${last ? `<button class="pri b-close">${tr("回到地图 ▸")}</button>` : `<button class="pri" data-bk="${k + 1}">${tr("下一幕")} ›</button>`}</div>`;
    if (B.auto) { clearTimeout(B.timer); if (!last) B.timer = setTimeout(() => phase(B.k + 1), Math.max(9000, (p.p.length + p.you.length) * 85)); }
  }
  function camB([x, y, w]) {
    cancelAnimationFrame(B.raf); const s = { ...B.cam }, e = { x, y, w }, t0 = performance.now(), ms = 1600;
    const step = (now) => { const k = ease(clamp((now - t0) / ms, 0, 1)); B.cam = { x: lerp(s.x, e.x, k), y: lerp(s.y, e.y, k), w: lerp(s.w, e.w, k) }; B.svg.setAttribute("viewBox", `${B.cam.x} ${B.cam.y} ${B.cam.w} ${B.cam.w * 0.6}`); B.svg.style.setProperty("--bk", (B.cam.w / 1000).toFixed(3)); if (k < 1) B.raf = requestAnimationFrame(step); };
    B.raf = requestAnimationFrame(step);
  }
  function setFx(list) {
    const ov = $("#bOverlay"); ov.className = "b-overlay " + list.filter((f) => !f.includes(":")).map((f) => "fx-" + f).join(" ");
    B.el.classList.toggle("quake", list.includes("quake")); if (list.includes("quake")) setTimeout(() => B.el.classList.remove("quake"), 1400);
    B.fx.innerHTML = "";
    list.filter((f) => f.includes(":")).forEach((f) => {
      const [kind, arg] = f.split(":");
      if (kind === "fire" || kind === "glow") { const [x, y] = arg.split(",").map(Number); const g = el("g", { class: "b-" + kind, transform: `translate(${x},${y})` }, B.fx); el("circle", { r: kind === "glow" ? 90 : 40, fill: "url(#bglow)" }, g); if (kind === "fire") for (let i = 0; i < 6; i++) el("circle", { r: 4 + i, cx: (i - 3) * 6, cy: -i * 3, class: "fl", style: `animation-delay:${i * 0.17}s` }, g); }
      if (kind === "arrows" || kind === "clash") {
        const [a, b2] = arg.split(kind === "arrows" ? ">" : ","); const A = B.units[a], Bb = B.units[b2]; if (!A || !Bb) return;
        if (kind === "arrows") for (let i = 0; i < 9; i++) { const ox = (i - 4) * 9, p = el("path", { d: `M${A.x + ox},${A.y}Q${(A.x + Bb.x) / 2 + ox},${Math.min(A.y, Bb.y) - 80} ${Bb.x + ox * 1.6},${Bb.y}`, class: "volley", style: `animation-delay:${(i * 0.13).toFixed(2)}s` }, B.fx); p.setAttribute("pathLength", 100); }
        else { const mx = (A.x + Bb.x) / 2, my = (A.y + Bb.y) / 2; for (let i = 0; i < 7; i++) el("path", { d: "M-5,0L5,0M0,-5L0,5M-3.5,-3.5L3.5,3.5M3.5,-3.5L-3.5,3.5", class: "spark", transform: `translate(${mx + (rnd() - 0.5) * 50},${my + (rnd() - 0.5) * 40})`, style: `animation-delay:${(rnd() * 1.5).toFixed(2)}s` }, B.fx); }
      }
    });
  }
  function closeBattle() { B.el.hidden = true; document.body.classList.remove("in-battle"); clearTimeout(B.timer); sound.stop(); const b = B.cur; B.cur = null; history.replaceState(null, "", "#"); if (b) { setT(b.t + 1e-7); const [x, y] = xy(b.at); flyTo(x, y, 600); } }
  B.el.addEventListener("click", (e) => {
    if (e.target.closest(".b-close")) return closeBattle();
    const k = e.target.closest("[data-bk]"); if (k && !e.target.closest("#bAuto")) { clearTimeout(B.timer); return k.dataset.bk === "intro" ? (B.k = -1, renderIntro(B.cur)) : phase(+k.dataset.bk); }
    if (e.target.closest("#bAuto")) { B.auto = !B.auto; $("#bAuto").classList.toggle("on", B.auto); if (B.auto) phase(B.k + 1); else clearTimeout(B.timer); }
    if (e.target.closest("#bSound")) { sound.toggle(); $("#bSound").classList.toggle("on", sound.on); $("#bSound").textContent = sound.on ? tr("声音 开") : tr("声音 关"); if (sound.on && B.k >= 0) sound.bed((B.cur.phases[B.k].fx || []).includes("rain") ? "rain" : "wind"); }
  });

  /* ——合成音效（Web Audio，默认关闭）—— */
  const sound = (() => {
    let ctx = null, master = null, bedNode = null, bedKind = "", on = false;
    const noise = () => { const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = ctx.createBufferSource(); s.buffer = b; s.loop = true; return s; };
    const env = (g, a, peak, r, t0 = ctx.currentTime) => { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + r); };
    function init() { if (ctx) return; ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination); }
    function bed(kind) {
      if (!on || kind === bedKind) return; init(); bedKind = kind;
      if (bedNode) { const n = bedNode; n.g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5); setTimeout(() => n.s.stop(), 1600); }
      const s = noise(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = kind === "rain" ? "highpass" : "lowpass"; f.frequency.value = kind === "rain" ? 1400 : 380; g.gain.value = 0;
      s.connect(f).connect(g).connect(master); s.start(); g.gain.linearRampToValueAtTime(kind === "rain" ? 0.16 : 0.22, ctx.currentTime + 2);
      bedNode = { s, g };
    }
    function fx(kind) {
      if (!on) return; init(); const t = ctx.currentTime;
      if (kind === "horn") { [110, 165, 220].forEach((fq, i) => { const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain(); o.type = "sawtooth"; o.frequency.setValueAtTime(fq * 0.97, t); o.frequency.linearRampToValueAtTime(fq, t + 0.6); f.type = "lowpass"; f.frequency.value = 900; o.connect(f).connect(g).connect(master); env(g, 0.8, i ? 0.05 : 0.12, 3.2); o.start(t); o.stop(t + 4.2); }); }
      else if (kind === "drums") { for (let i = 0; i < 8; i++) { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(90, t + i * 0.9); o.frequency.exponentialRampToValueAtTime(40, t + i * 0.9 + 0.4); o.connect(g).connect(master); env(g, 0.01, 0.5, 0.5, t + i * 0.9); o.start(t + i * 0.9); o.stop(t + i * 0.9 + 0.6); } }
      else if (kind === "thunder" || kind === "boom") { const s = noise(), f = ctx.createBiquadFilter(), g = ctx.createGain(); f.type = "lowpass"; f.frequency.value = kind === "boom" ? 220 : 500; s.connect(f).connect(g).connect(master); env(g, 0.05, 0.9, kind === "boom" ? 2.2 : 3); s.start(t); s.stop(t + 3.5); }
      else if (kind === "clash") { for (let i = 0; i < 10; i++) { const s = noise(), f = ctx.createBiquadFilter(), g = ctx.createGain(), at = t + Math.random() * 3; f.type = "bandpass"; f.frequency.value = 2500 + Math.random() * 2500; f.Q.value = 8; s.connect(f).connect(g).connect(master); env(g, 0.005, 0.35, 0.18, at); s.start(at); s.stop(at + 0.3); } }
      else if (kind === "eagle") { [0, 1.1].forEach((d) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(2400, t + d); o.frequency.exponentialRampToValueAtTime(1300, t + d + 0.7); o.connect(g).connect(master); env(g, 0.04, 0.08, 0.7, t + d); o.start(t + d); o.stop(t + d + 0.9); }); }
    }
    return { get on() { return on; }, toggle() { on = !on; if (on) { init(); ctx.resume(); } else this.stop(true); }, bed, fx, stop(keepOff) { if (bedNode && ctx) { bedNode.g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5); const n = bedNode; setTimeout(() => n.s.stop(), 600); } bedNode = null; bedKind = ""; } };
  })();

  /* ======================= 启动 ======================= */
  function start(mode) {
    $("#intro").classList.add("gone"); setTimeout(() => ($("#intro").hidden = true), 900);
    if (mode === "begin") { setT(T0 + 1); flyBox(ERAS[0].cam); setTimeout(play, 900); }
    else if (mode === "war") { const ev = D.EVENTS.find((e) => (e.h0 || e.h) === "离开袋底洞"); setT(ev.t); flyBox(eraOf(ev.t).cam); setTab("legends"); openLegend("ring", 0); }
    else if (mode === "battle") { setTab("battles"); }
  }
  function init() {
    buildMap(); if (H3) buildMini(); applyCam(); buildTM(); buildPanel(); bindPan();
    setT(T0 + 1); flyBox(ERAS[0].cam, 0);
    const c = ERAS[0].cam; cam.x = c[0]; cam.y = c[1]; cam.w = c[2]; applyCam();
    $("#intro").addEventListener("click", (e) => { const b = e.target.closest("[data-start]"); if (b) start(b.dataset.start); });
    $("#panelToggle").onclick = () => document.body.classList.toggle("panel-open");
    $("#bClose").onclick = closeBattle;
    $("#moment").addEventListener("click", (e) => {
      if (e.target.closest(".mo-x") || e.target === e.currentTarget) return closeMoment(false);
      if (e.target.closest(".mo-play")) return closeMoment(true);
      const cb = e.target.closest(".mo-auto input"); if (cb) { moAuto = cb.checked; try { localStorage.setItem("me-mo-auto", moAuto ? "1" : "0"); } catch (x) {} }
    });
    $("#follow").onclick = (e) => { if (e.target.closest("button")) pause(); };
    document.addEventListener("keydown", (e) => {
      if (e.target.closest("input,textarea")) return;
      if (!$("#moment").hidden) { if (e.key === "Escape") closeMoment(false); if (e.key === " " || e.key === "Enter") { e.preventDefault(); closeMoment(true); } if (e.key === "ArrowRight" || e.key === "ArrowLeft") { const i = MOI[moCur.id] + (e.key === "ArrowRight" ? 1 : -1); if (MO[i]) openMoment(MO[i].id); } return; }
      if (!B.el.hidden) { if (e.key === "Escape") closeBattle(); if (e.key === "ArrowRight") phase(B.k + 1); if (e.key === "ArrowLeft") B.k > 0 && phase(B.k - 1); return; }
      if (e.key === " ") { e.preventDefault(); playing ? pause() : play(); }
      if (e.key === "ArrowRight") stepEvent(1); if (e.key === "ArrowLeft") stepEvent(-1);
    });
    // 深链接：#t= / #l=&k= / #b=
    const h = new URLSearchParams(location.hash.slice(1));
    if ([...h.keys()].length) { $("#intro").hidden = true; }
    if (h.get("t")) { setT(+h.get("t")); flyBox(eraOf(T).cam); }
    if (h.get("l")) { setTab("legends"); openLegend(h.get("l"), +(h.get("k") || 0)); }
    if (h.get("b")) openBattle(h.get("b"));
    if (h.get("m")) openMoment(h.get("m"));
    if (h.get("c")) { setTab("chars"); showChar(h.get("c"), true); }
    if (h.get("f")) followJ(h.get("f"));
    window.__ME = { openMoment, closeMoment, MO, setT, flyTo, openBattle, phase, openLegend, play, pause, followJ, showChar, setTab, get T() { return T; }, get follow() { return !!follow; }, cam, posOf, tAt, fmt, JR, RES };
  }
  init();
})();
