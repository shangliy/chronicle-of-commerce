/* 中洲纪年 · 手绘风主要地标立体模型（原创 SVG，西北光源）
 * 圆柱塔、锥顶、穹顶、坡顶房、多面岩体、树、光晕等基本体组合成微缩模型。
 * 仅在 ME_STYLE === "paint" 时替换 ME_ICON 中的主要地标。
 */
(function () {
  if (window.ME_STYLE !== "paint") return;
  const NS = "http://www.w3.org/2000/svg";
  const f = (n) => +(+n).toFixed(2);
  const MAT = {
    white: ["#ffffff", "#eceae2", "#b9b4a6", "#76715f", "#f7f5ef"],
    stone: ["#ece4d2", "#cbc0a8", "#958a72", "#5a5242", "#e2dac6"],
    dark: ["#6a5e62", "#3e3438", "#241c20", "#0c080a", "#544a4e"],
    rock: ["#c4bcac", "#9a9282", "#6a6456", "#36322a", "#b4ac9c"],
    gold: ["#fff4b0", "#ecc444", "#b08420", "#5e400c", "#fae07a"],
    wood: ["#d4a46a", "#a87a42", "#7a5228", "#44290f", "#c09058"],
    green: ["#a6d86a", "#6aa83a", "#447624", "#203e10", "#8cc456"],
    dgreen: ["#6a9a48", "#3e6e2a", "#264a1a", "#10240a", "#5a8a3e"],
    blue: ["#9abcf4", "#4a7ad0", "#2a4a9a", "#14244e", "#78a0e8"],
    red: ["#f48a68", "#c83a2a", "#8a2018", "#420c06", "#e46a4c"],
    pale: ["#f0fff2", "#b8e0c4", "#6e9e84", "#26463a", "#d8f4e0"],
    thatch: ["#f0d48a", "#cca450", "#94702e", "#54400f", "#e2c070"],
    sand: ["#f4e2b0", "#d8bc80", "#a8884a", "#5e4a20", "#eedaa2"],
    silver: ["#ffffff", "#e0e4ea", "#a8b0bc", "#5e6672", "#f2f4f8"],
    water: ["#bfe6f4", "#5aa8cc", "#2a6a94", "#123a56", "#8ccbe6"],
  };
  let G = `<radialGradient id="m-shd"><stop offset="0" stop-color="#1a0e04" stop-opacity=".55"/><stop offset=".6" stop-color="#1a0e04" stop-opacity=".28"/><stop offset="1" stop-color="#1a0e04" stop-opacity="0"/></radialGradient>
<radialGradient id="m-glow-o"><stop offset="0" stop-color="#fff2b0"/><stop offset=".3" stop-color="#ff9a2a" stop-opacity=".85"/><stop offset="1" stop-color="#ff4a00" stop-opacity="0"/></radialGradient>
<radialGradient id="m-glow-g"><stop offset="0" stop-color="#f0fff0"/><stop offset=".35" stop-color="#7affb0" stop-opacity=".7"/><stop offset="1" stop-color="#2aff8a" stop-opacity="0"/></radialGradient>
<radialGradient id="m-glow-w"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#fff2c0" stop-opacity=".75"/><stop offset="1" stop-color="#ffe080" stop-opacity="0"/></radialGradient>
<radialGradient id="m-glow-s"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#d8ecff" stop-opacity=".7"/><stop offset="1" stop-color="#a8d0ff" stop-opacity="0"/></radialGradient>
<linearGradient id="m-fall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8f6ff"/><stop offset=".6" stop-color="#9ccfe8"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<linearGradient id="m-lava" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0a0"/><stop offset=".4" stop-color="#ff8a1a"/><stop offset="1" stop-color="#a01a00"/></linearGradient>`;
  for (const [k, c] of Object.entries(MAT)) {
    G += `<linearGradient id="m-${k}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c[0]}"/><stop offset=".32" stop-color="${c[1]}"/><stop offset=".72" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[3]}"/></linearGradient>`;
    G += `<radialGradient id="m-s-${k}" cx=".36" cy=".3" r=".78"><stop offset="0" stop-color="${c[0]}"/><stop offset=".45" stop-color="${c[1]}"/><stop offset=".82" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[3]}"/></radialGradient>`;
  }
  function defs() {
    if (document.getElementById("mdl-defs")) return;
    const s = document.createElementNS(NS, "svg"); s.id = "mdl-defs"; s.setAttribute("width", "0"); s.setAttribute("height", "0"); s.setAttribute("aria-hidden", "true");
    s.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    s.innerHTML = "<defs>" + G + "</defs>"; (document.body || document.documentElement).appendChild(s);
  }
  const EDGE = 'stroke="rgba(26,16,8,.6)" stroke-width=".3" stroke-linejoin="round"';
  // ——基本体——
  const shd = (x, y, rx, ry = rx * 0.34) => `<ellipse cx="${f(x + rx * 0.16)}" cy="${f(y + ry * 0.3)}" rx="${f(rx)}" ry="${f(ry)}" fill="url(#m-shd)"/>`;
  const path = (d, fill, x = EDGE) => `<path d="${d}" fill="${fill}" ${x}/>`;
  function cyl(x, y, r, h, m, o = {}) {
    const ry = r * 0.32, c = MAT[m];
    let s = path(`M${f(x - r)},${f(y - h)}V${f(y)}A${f(r)},${f(ry)} 0 0 0 ${f(x + r)},${f(y)}V${f(y - h)}Z`, `url(#m-${m})`);
    s += `<ellipse cx="${f(x)}" cy="${f(y - h)}" rx="${f(r)}" ry="${f(ry)}" fill="${c[4]}" ${EDGE}/>`;
    if (o.band) s += path(`M${f(x - r)},${f(y - h + 1.1)}A${f(r)},${f(ry)} 0 0 0 ${f(x + r)},${f(y - h + 1.1)}`, "none", 'stroke="rgba(30,20,10,.35)" stroke-width=".35"');
    if (o.cren) {
      const n = Math.max(4, Math.round(r * 1.3)), cw = Math.min(1.1, (Math.PI * r) / n / 1.8);
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI, px = x - r * Math.cos(a), py = y - h + ry * Math.sin(a), sh = i / n;
        s += `<rect x="${f(px - cw / 2)}" y="${f(py - 1.1)}" width="${f(cw)}" height="1.2" fill="${sh < 0.4 ? c[1] : sh < 0.75 ? c[2] : c[3]}" ${EDGE}/>`;
      }
    }
    if (o.win) {
      const n = o.win;
      for (let i = 0; i < n; i++) {
        const a = ((i + 0.5) / n) * Math.PI * 0.8 + Math.PI * 0.1, px = x - r * Math.cos(a) * 0.86, py = y - h * (o.wy || 0.55) + ry * Math.sin(a);
        s += `<rect x="${f(px - 0.3)}" y="${f(py - 0.7)}" width=".6" height="1.2" rx=".3" fill="${o.lit ? "#ffd27a" : "#2a1e16"}"/>`;
      }
    }
    return s;
  }
  const cone = (x, y, r, h, m) => path(`M${f(x - r)},${f(y)}A${f(r)},${f(r * 0.32)} 0 0 0 ${f(x + r)},${f(y)}L${f(x)},${f(y - h)}Z`, `url(#m-${m})`) + path(`M${f(x - r * 0.35)},${f(y + r * 0.2)}L${f(x)},${f(y - h)}`, "none", 'stroke="rgba(255,255,255,.35)" stroke-width=".3"');
  const dome = (x, y, r, m, ry = r * 0.9) => path(`M${f(x - r)},${f(y)}A${f(r)},${f(ry)} 0 0 1 ${f(x + r)},${f(y)}A${f(r)},${f(r * 0.32)} 0 0 1 ${f(x - r)},${f(y)}Z`, `url(#m-s-${m})`);
  function box(x, y, w, h, d, m) { // 正面 + 东侧面（暗）+ 顶面
    const c = MAT[m], a = x - w / 2, b = x + w / 2, dx = d * 0.62, dy = d * 0.38;
    return path(`M${f(b)},${f(y)}L${f(b + dx)},${f(y - dy)}V${f(y - h - dy)}L${f(b)},${f(y - h)}Z`, c[3]) +
      path(`M${f(a)},${f(y - h)}H${f(b)}L${f(b + dx)},${f(y - h - dy)}H${f(a + dx)}Z`, c[4]) +
      path(`M${f(a)},${f(y)}H${f(b)}V${f(y - h)}H${f(a)}Z`, `url(#m-${m})`);
  }
  function gable(x, y, w, h, d, m, roof, rh = w * 0.45) { // 坡顶房，屋脊沿纵深
    const c = MAT[roof], a = x - w / 2, b = x + w / 2, dx = d * 0.62, dy = d * 0.38;
    return box(x, y, w, h, d, m) +
      path(`M${f(x)},${f(y - h - rh)}L${f(b)},${f(y - h)}L${f(b + dx)},${f(y - h - dy)}L${f(x + dx)},${f(y - h - rh - dy)}Z`, c[2]) +
      path(`M${f(a)},${f(y - h)}L${f(x)},${f(y - h - rh)}L${f(b)},${f(y - h)}Z`, `url(#m-${roof})`) +
      path(`M${f(x)},${f(y - h - rh)}L${f(x + dx)},${f(y - h - rh - dy)}`, "none", `stroke="${c[0]}" stroke-width=".35"`);
  }
  function crag(x, y, w, h, m, lean = -0.2) { // 两面受光的岩峰
    const c = MAT[m], tx = x + w * lean, mx = x + w * 0.12;
    return path(`M${f(x - w)},${f(y)}L${f(tx)},${f(y - h)}L${f(mx)},${f(y)}Z`, c[1]) +
      path(`M${f(tx)},${f(y - h)}L${f(x + w)},${f(y)}L${f(mx)},${f(y)}Z`, c[3]) +
      path(`M${f(tx)},${f(y - h)}L${f(x - w * 0.5)},${f(y - h * 0.35)}L${f(x - w * 0.25)},${f(y - h * 0.4)}Z`, c[0], "") +
      path(`M${f(tx)},${f(y - h)}L${f(x + w * 0.45)},${f(y - h * 0.3)}L${f(mx + w * 0.15)},${f(y - h * 0.25)}Z`, c[2], "");
  }
  const snowcap = (x, y, w, h, lean = -0.2) => { const tx = x + w * lean; return path(`M${f(tx)},${f(y - h)}L${f(tx - w * 0.32)},${f(y - h * 0.7)}L${f(tx - w * 0.12)},${f(y - h * 0.76)}L${f(tx + w * 0.02)},${f(y - h * 0.64)}L${f(tx + w * 0.3)},${f(y - h * 0.72)}Z`, "#fbfbf6", ""); };
  const hill = (x, y, rx, h, m) => path(`M${f(x - rx)},${f(y)}C${f(x - rx * 0.7)},${f(y - h * 1.05)} ${f(x + rx * 0.5)},${f(y - h * 1.15)} ${f(x + rx)},${f(y)}A${f(rx)},${f(rx * 0.3)} 0 0 1 ${f(x - rx)},${f(y)}Z`, `url(#m-s-${m})`);
  const tree = (x, y, r, m = "green", tr = "wood") => path(`M${f(x - r * 0.15)},${f(y)}V${f(y - r * 1.2)}H${f(x + r * 0.15)}V${f(y)}Z`, `url(#m-${tr})`, "") + `<circle cx="${f(x)}" cy="${f(y - r * 1.5)}" r="${f(r)}" fill="url(#m-s-${m})" ${EDGE}/>`;
  const pine = (x, y, h, m = "dgreen") => path(`M${f(x - h * 0.3)},${f(y)}L${f(x)},${f(y - h)}L${f(x + h * 0.3)},${f(y)}Z`, `url(#m-${m})`);
  const glow = (x, y, r, k = "o") => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#m-glow-${k})" class="mglow"/>`;
  const flag = (x, y, c, h = 6) => `<path d="M${f(x)},${f(y)}V${f(y - h)}" stroke="#2a1a10" stroke-width=".5"/><path class="h3flag" d="M${f(x)},${f(y - h)}q2.6,-1 5,0q-.9,1.4 0,2.8q-2.4,-1 -5,0z" fill="${c}" stroke="#2a1a10" stroke-width=".3"/>`;
  const water = (x, y, rx, ry = rx * 0.3) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="url(#m-s-water)" ${EDGE}/><ellipse cx="${f(x - rx * 0.25)}" cy="${f(y - ry * 0.2)}" rx="${f(rx * 0.4)}" ry="${f(ry * 0.25)}" fill="rgba(255,255,255,.35)"/>`;
  const slab = (rx, ry, m, t = 1.6) => shd(0, 3.6, rx + 2, ry + 1.4) + path(`M${-rx},3V${3 + t}A${rx},${ry} 0 0 0 ${rx},${3 + t}V3Z`, `url(#m-${m})`) + `<ellipse cx="0" cy="3" rx="${rx}" ry="${ry}" fill="url(#m-s-${m})" ${EDGE}/>`;
  const smoke = (x, y, d = 0) => `<g class="h3smoke"${d ? ` style="animation-delay:${d}s"` : ""}><circle cx="${f(x)}" cy="${f(y)}" r="1.5" fill="#cfcac0" opacity=".7"/><circle cx="${f(x + 1.5)}" cy="${f(y - 2.6)}" r="2.1" fill="#cfcac0" opacity=".5"/><circle cx="${f(x + 0.4)}" cy="${f(y - 5.4)}" r="2.7" fill="#cfcac0" opacity=".3"/></g>`;
  const arch = (x, y, w, h, c = "#1a120c") => path(`M${f(x - w / 2)},${f(y)}V${f(y - h + w / 2)}A${f(w / 2)},${f(w / 2)} 0 0 1 ${f(x + w / 2)},${f(y - h + w / 2)}V${f(y)}Z`, c, "");
  function wallArc(rx, ry, y, h, m, front) { // 环形城墙的前半/后半
    const c = MAT[m];
    if (!front) return path(`M${-rx},${y}A${rx},${ry} 0 0 1 ${rx},${y}V${y - h}A${rx},${ry} 0 0 0 ${-rx},${y - h}Z`, c[2]) + path(`M${-rx},${y - h}A${rx},${ry} 0 0 1 ${rx},${y - h}`, "none", `stroke="${c[4]}" stroke-width="1"`);
    return path(`M${-rx},${y - h}V${y}A${rx},${ry} 0 0 0 ${rx},${y}V${y - h}A${rx},${ry} 0 0 1 ${-rx},${y - h}Z`, `url(#m-${m})`) + path(`M${-rx},${y - h}A${rx},${ry} 0 0 0 ${rx},${y - h}`, "none", `stroke="${c[4]}" stroke-width=".9"`);
  }

  // ——模型——
  const M = {
    minastirith() { // 七层白城 + 船头巨岩 + 白塔
      let s = shd(0, 4, 19, 6) + crag(10, 4, 11, 30, "rock", 0.15) + snowcap(10, 4, 11, 30, 0.15);
      for (let i = 0; i < 7; i++) s += cyl(-1, 4 - i * 3.6, 15.5 - i * 1.95, 3.6, "white", { cren: 1, win: i < 5 ? 5 - Math.floor(i / 2) : 0, wy: 0.45 });
      s += path("M-1,-21L-4.2,4.6L-1,6.4L1.4,4.4Z", "url(#m-white)") + path("M-1,-21L1.4,4.4L-1,6.4Z", MAT.white[2]);
      s += cyl(-1, -21.2, 1.7, 13, "white", { band: 1 }) + cone(-1, -34.2, 1.9, 4.4, "silver") + glow(-1, -37.6, 2.2, "w");
      s += arch(-1, 4.9, 2.4, 3.2) + tree(-4.6, -21.6, 1.1, "silver", "white") + flag(-1, -38, "#ffffff", 4);
      return s;
    },
    baraddur() { // 黑塔 + 魔眼
      let s = shd(0, 4, 17, 6) + slab(15, 4.6, "dark", 2);
      s += path("M-15,4.6L-9,3.4M6,5.4L12,3.6M-4,6.2L1,4.8", "none", 'stroke="#ff7a1a" stroke-width=".6"');
      s += box(0, 3, 16, 7, 6, "dark") + box(0, -4, 12, 8, 5, "dark") + box(0, -12, 8.4, 10, 4, "dark") + box(0, -22, 5.6, 8, 3, "dark");
      [[-8, -4], [8, -4], [-6, -12], [6, -12], [-4.2, -22], [4.2, -22]].forEach(([x, y]) => (s += path(`M${x - 1.2},${y}L${x},${y - 4}L${x + 1.2},${y}Z`, "url(#m-dark)")));
      s += path("M-2.8,-30L-4.4,-37L-1.2,-31ZM2.8,-30L4.4,-37L1.2,-31Z", "url(#m-dark)");
      for (let i = 0; i < 4; i++) s += `<rect x="${-5 + i * 3.3}" y="${-1 - (i % 2) * 7}" width=".6" height="1.2" fill="#ff8a2a"/>`;
      s += arch(0, 3, 3, 4, "#ff6a1a") + glow(0, -32.6, 7.5) + `<ellipse class="meye" cx="0" cy="-32.6" rx="2.6" ry="1.5" fill="#ffb02a" stroke="#ff5a00" stroke-width=".4"/><ellipse cx="0" cy="-32.6" rx=".45" ry="1.3" fill="#1a0400"/>`;
      return s;
    },
    isengard() { // 环墙 + 欧散克
      let s = shd(0, 4, 18, 6) + wallArc(15, 5, 3, 3, "rock", false) + `<ellipse cx="0" cy="3" rx="13.6" ry="4.2" fill="url(#m-s-dgreen)"/>`;
      s += path("M-3.4,3L-2.6,-24L0,-27L0,4.4Z", "url(#m-dark)") + path("M0,-27L2.6,-24L3.4,3L0,4.4Z", MAT.dark[3]);
      s += path("M-2.6,-24L-4.2,-33L-1.4,-26ZM2.6,-24L4.2,-33L1.4,-26ZM-.8,-26.6L-1.2,-34.6L.8,-26.6ZM.6,-26.6L1.6,-31.4L1.2,-26Z", "url(#m-dark)");
      s += `<rect x="-.8" y="-14" width=".6" height="1.3" fill="#ffd27a"/><rect x="-1.4" y="-6" width=".6" height="1.3" fill="#ffd27a"/>` + smoke(6, -2) + smoke(-8, 0);
      s += wallArc(15, 5, 3, 3, "rock", true) + arch(0, 7.6, 2.4, 2.6);
      return s;
    },
    rivendell() { // 峡谷、瀑布、精灵楼阁
      let s = shd(0, 4, 18, 6) + crag(-11, 4, 9, 22, "rock", 0.1) + crag(12, 4, 9, 24, "rock", -0.1);
      s += path("M-3,-14Q-1,-4 -2.4,4H2.4Q1,-4 3,-14Z", "url(#m-fall)", "") + water(0, 5, 6, 1.6);
      s += pine(-15, 4, 9) + pine(16, 4, 10) + tree(-7, 3.4, 2.4, "dgreen") + tree(8, 3.6, 2.2, "dgreen");
      s += gable(-7.6, -2, 6, 4, 3, "white", "blue", 2.8) + gable(7.4, 1, 6.4, 4, 3, "white", "blue", 3) + cyl(4, -4, 1.4, 9, "white", { win: 2 }) + cone(4, -13, 1.8, 4.6, "blue");
      s += path("M-4.6,-3.4Q0,-6 4.6,-3.4", "none", 'stroke="#f4f2ea" stroke-width="1"') + `<circle cx="0" cy="-11" r="5" fill="url(#m-glow-w)" opacity=".5"/>`;
      return s;
    },
    lorien() { // 金叶巨树与弗来特
      let s = shd(0, 4, 17, 6);
      const T = (x, y, r, h) => path(`M${x - 0.9},${y}C${x - 0.6},${y - h * 0.5} ${x - 0.4},${y - h * 0.8} ${x},${y - h}C${x + 0.4},${y - h * 0.8} ${x + 0.8},${y - h * 0.5} ${x + 1},${y}Z`, "url(#m-silver)") + `<circle cx="${x}" cy="${y - h - r * 0.4}" r="${r}" fill="url(#m-s-gold)" ${EDGE}/>` + `<circle cx="${x - r * 0.7}" cy="${y - h + r * 0.3}" r="${r * 0.6}" fill="url(#m-s-gold)" ${EDGE}/>` + `<circle cx="${x + r * 0.75}" cy="${y - h + r * 0.25}" r="${r * 0.62}" fill="url(#m-s-gold)" ${EDGE}/>`;
      s += T(-9, 3, 5, 12) + T(9, 3.4, 5.4, 13) + T(0, 4.6, 7, 21);
      s += path("M-5,-15H5L6,-14H-6Z", "url(#m-silver)") + glow(0, -16, 3.4, "s") + glow(-6, -8, 1.6, "s") + glow(6, -10, 1.6, "s");
      return s;
    },
    erebor() { // 孤山与山门
      let s = shd(0, 4, 19, 6) + crag(-8, 4, 10, 18, "rock", 0.3) + crag(1, 4, 16, 32, "rock", -0.05) + snowcap(1, 4, 16, 32, -0.05) + crag(11, 4, 8, 15, "rock", -0.3);
      s += box(0.6, 4, 8, 7, 1.4, "stone") + arch(0.6, 4, 3.6, 5.4, "#2a1a10") + glow(0.6, 1, 3.4) + cyl(-3.6, 4, 0.9, 8, "stone") + cyl(4.8, 4, 0.9, 8, "stone");
      s += path("M0.6,4.6Q2,7 0,9", "none", 'stroke="#5aa0d0" stroke-width="1.1"') + flag(0.6, -3, "#c8941a", 4);
      return s;
    },
    moria() { // 都林之门
      let s = shd(0, 4, 18, 6) + crag(-6, 4, 12, 22, "rock", 0.2) + crag(5, 4, 13, 26, "rock", -0.1) + snowcap(5, 4, 13, 26, -0.1);
      s += path("M-5,4V-5A5,5 0 0 1 5,-5V4Z", "#3a3632", "") + path("M-4,4V-5A4,4 0 0 1 4,-5V4M0,4V-9M-4,-5L4,-5", "none", 'stroke="#e8f4ff" stroke-width=".4"') + `<circle cx="0" cy="-6" r="1" fill="none" stroke="#e8f4ff" stroke-width=".4"/>` + glow(0, -5, 5, "s");
      s += tree(-8, 4, 2.2, "dgreen") + tree(8.4, 4.2, 2.2, "dgreen") + water(0, 6.8, 10, 1.8);
      return s;
    },
    edoras() { // 青丘与金殿
      let s = shd(0, 4, 18, 6) + hill(0, 4, 16, 14, "green");
      s += path("M-14,3.6Q-8,-9 0,-9.6Q8,-9 14,3.6", "none", 'stroke="#7a5228" stroke-width=".6" stroke-dasharray=".8 .6"');
      s += gable(-8, 0.6, 3.6, 2.4, 2, "wood", "thatch", 1.8) + gable(8, 1, 3.6, 2.4, 2, "wood", "thatch", 1.8) + gable(-4, -4, 3.4, 2.2, 2, "wood", "thatch", 1.6) + gable(5, -4, 3.4, 2.2, 2, "wood", "thatch", 1.6);
      s += gable(0, -9.4, 7.6, 4, 5, "wood", "gold", 4.4) + path("M-1.2,-9.4V-11.6H1.2V-9.4Z", "#2a1a10", "") + glow(0, -15, 3, "w") + flag(-3.8, -13.8, "#2e7a2a", 4) + flag(3.8, -13.8, "#2e7a2a", 4);
      return s;
    },
    helmsdeep() { // 深谷要塞
      let s = shd(0, 4, 18, 6) + crag(-12, 4, 8, 24, "rock", 0.25) + crag(12, 4, 9, 26, "rock", -0.2);
      s += box(3, 3, 14, 5, 2, "stone") + path("M-4,-2.4H10", "none", 'stroke="#ece4d2" stroke-width=".5" stroke-dasharray="1 .7"');
      s += path("M-12,4L-9,-6L-3,-8L-1,4Z", "url(#m-rock)") + cyl(-6, -6, 3.6, 9, "stone", { cren: 1, win: 3 }) + cyl(-6, -15, 1.6, 5, "stone", { cren: 1 }) + flag(-6, -21, "#2e7a2a", 4);
      s += arch(7, 3, 1.6, 2.6) + path("M7,4V9", "none", 'stroke="#5aa0d0" stroke-width=".8"');
      return s;
    },
    hobbiton() { // 小丘、圆门、风车
      let s = shd(0, 4, 18, 6) + hill(-2, 4, 14, 12, "green") + hill(9, 4.6, 7, 6, "green");
      const door = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#5a3a20" ${EDGE}/><circle cx="${x}" cy="${y}" r="${r * 0.78}" fill="${c}"/><circle cx="${x + r * 0.25}" cy="${y}" r=".25" fill="#e8c040"/>`;
      s += door(-4, 0.6, 2.4, "#3a8a3a") + door(5, 2, 1.6, "#c8a040") + door(9, 3, 1.3, "#c84a2a") + `<circle cx="-8.4" cy="-1" r=".9" fill="#ffe8a0"/><circle cx="0" cy="-1.2" r=".9" fill="#ffe8a0"/>`;
      s += cyl(-1.6, -8.6, 0.7, 2.4, "stone") + smoke(-1.4, -12);
      s += tree(-1, -9, 3.6, "green") + path("M-15,4.4H-7M-14,2.6V4.6M-11,2.6V4.6M-8,2.6V4.6", "none", 'stroke="#7a5228" stroke-width=".55"');
      s += cyl(13, 3, 1.6, 7, "stone", { win: 1 }) + cone(13, -4, 2.2, 3, "thatch") + `<g class="h3mill" style="transform-origin:13px -4px"><path d="M13,-4L13,-11M13,-4L20,-4M13,-4L13,3M13,-4L6,-4" stroke="#6a4a2a" stroke-width=".7"/></g>`;
      return s;
    },
    osgiliath() { // 大河上的石桥与穹顶
      let s = shd(0, 4, 18, 6) + `<path d="M-17,5Q0,1 17,5Q0,8 -17,5Z" fill="url(#m-water)"/>`;
      s += box(0, 2.6, 28, 3.4, 2, "stone");
      for (let i = -3; i <= 3; i++) s += arch(i * 4, 2.6, 2.4, 2.2, "#24546e");
      s += box(-8, -1, 6, 6, 4, "stone") + dome(-7.4, -7.4, 3.4, "stone") + cyl(7, -0.8, 2.6, 8, "stone", { win: 2 }) + path("M4.4,-8.8L5.4,-11L6.6,-9.4L7.8,-12L9.6,-8.8Z", MAT.stone[2]) + box(1, -1, 4, 4, 3, "stone");
      return s;
    },
    minasmorgul() { // 幽绿死城
      let s = shd(0, 4, 17, 6) + crag(-11, 4, 7, 18, "dark", 0.2) + crag(12, 4, 8, 20, "dark", -0.2);
      s += box(0, 3, 15, 6, 3, "pale") + cyl(0, -2, 3.4, 18, "pale", { win: 4, lit: 0 }) + path("M-3.4,-20L0,-26L3.4,-20Z", "url(#m-pale)");
      s += glow(0, -24, 6, "g") + glow(0, 0, 4, "g") + arch(0, 3, 2.6, 3.6, "#9affb0") + `<g class="mrot"><path d="M-2.4,-25L2.4,-25M0,-27.4V-22.6" stroke="#e0ffe8" stroke-width=".35"/></g>`;
      return s;
    },
    dolguldur() {
      let s = shd(0, 4, 17, 6) + hill(0, 4, 14, 8, "dark");
      s += pine(-12, 4, 11) + pine(-8, 5, 9) + pine(12, 4, 12) + pine(8, 5, 9);
      s += box(0, -2, 8, 6, 3, "dark") + cyl(0, -6, 2.2, 14, "dark", { win: 2, lit: 1 }) + path("M-2.2,-20L0,-25L2.2,-20Z", "url(#m-dark)") + glow(0, -12, 3) + `<ellipse cx="0" cy="2" rx="16" ry="3" fill="rgba(160,170,150,.35)"/>`;
      return s;
    },
    morannon() { // 黑门与獠牙塔
      let s = shd(0, 4, 19, 6) + crag(-14, 4, 7, 20, "dark", 0.3) + crag(14, 4, 7, 20, "dark", -0.3);
      s += box(0, 4, 20, 9, 2, "dark") + path("M-4,4V-3.6H4V4Z", "#100808", "") + path("M0,4V-3.6M-4,-.4H4", "none", 'stroke="#5a4a44" stroke-width=".4"');
      s += cyl(-10, 4, 2.6, 18, "dark", { cren: 1, win: 2, lit: 1 }) + cyl(10, 4, 2.6, 18, "dark", { cren: 1, win: 2, lit: 1 }) + glow(-10, -8, 2.4) + glow(10, -8, 2.4);
      return s;
    },
    orodruin() { // 火山
      let s = shd(0, 4, 18, 6) + path("M-16,4L-4,-20H4L16,4Z", "url(#m-dark)") + path("M0,-20H4L16,4H2Z", MAT.dark[3]);
      s += `<ellipse cx="0" cy="-20" rx="4" ry="1.2" fill="url(#m-lava)"/>` + path("M1,-19.4Q3,-12 1,-6Q-1,0 2,4", "none", 'stroke="url(#m-lava)" stroke-width="1.2"') + path("M-1.6,-19Q-5,-10 -9,-2", "none", 'stroke="#ff7a1a" stroke-width=".7"');
      s += glow(0, -21, 7) + path("M-3,6L-1,-9H1.6L-0.2,6Z", "#ff9a3a", "") + smoke(0, -26, 0) + smoke(3, -30, -1.5);
      return s;
    },
    angband() { // 桑戈洛锥姆三峰
      let s = shd(0, 4, 19, 6) + crag(-9, 4, 8, 22, "dark", 0.1) + crag(9, 4, 8, 24, "dark", -0.1) + crag(0, 4, 10, 34, "dark", 0);
      s += arch(0, 4, 5, 7, "#ff5a10") + glow(0, 0, 6) + smoke(-9, -22) + smoke(0, -36) + smoke(9, -26) + path("M-8,4L-4,-2M6,4L3,-4", "none", 'stroke="#ff7a1a" stroke-width=".6"');
      return s;
    },
    mithlond() { // 灰港：白塔、码头、天鹅船
      let s = shd(0, 4, 18, 6) + water(4, 5, 14, 3.4);
      s += box(-6, 3, 12, 3, 3, "stone") + cyl(-9, 0, 2.2, 14, "white", { win: 3 }) + cone(-9, -14, 2.6, 6, "blue") + cyl(-3, 0, 1.8, 9, "white", { win: 2 }) + cone(-3, -9, 2.2, 4.6, "blue");
      s += path("M3,4H15L13,6.6H5Z", "url(#m-white)") + path("M14.6,4Q17.6,1 16,-1.4", "none", 'stroke="#f4f2ea" stroke-width=".9"') + path("M8.6,4V-8", "none", 'stroke="#6a5a4a" stroke-width=".5"') + path("M9,-7.6Q14,-3 9,2Z", "url(#m-silver)") + glow(-9, -17, 3, "s");
      return s;
    },
    gondolin() { // 环山中的白城
      let s = shd(0, 4, 19, 6) + crag(-14, 4, 6, 14, "rock", 0.3) + crag(14, 4, 6, 15, "rock", -0.3) + hill(0, 4, 13, 7, "green");
      for (let i = 0; i < 3; i++) s += cyl(0, 2 - i * 3.4, 11 - i * 3, 3.4, "white", { cren: 1, win: 4 - i });
      [[-7, -3, 1.2, 7], [7, -3, 1.2, 7], [-3.4, -7, 1, 8], [3.4, -7, 1, 8]].forEach(([x, y, r, h]) => (s += cyl(x, y, r, h, "white") + cone(x, y - h, r * 1.3, 3, "gold")));
      s += cyl(0, -8.2, 1.8, 16, "white", { band: 1, win: 2 }) + cone(0, -24.2, 2.2, 5, "gold") + glow(0, -27, 3, "w") + flag(0, -29, "#2a6ad0", 4);
      return s;
    },
    tirion() { // 图纳丘上的明登塔
      let s = shd(0, 4, 18, 6) + hill(0, 4, 16, 12, "green") + cyl(0, -6, 7, 3, "white", { cren: 1, win: 5 });
      s += gable(-6, -8, 3, 2.4, 2, "white", "blue", 1.6) + gable(6, -8, 3, 2.4, 2, "white", "blue", 1.6) + path("M-12,3Q-6,-2 -4,-6", "none", 'stroke="#f4f2ea" stroke-width=".9"');
      s += cyl(0, -9, 1.6, 22, "white", { band: 1, win: 2 }) + cone(0, -31, 2, 4, "silver") + glow(0, -34, 5, "w");
      return s;
    },
    menegroth() { // 千石窟：林中岩丘与石桥
      let s = shd(0, 4, 18, 6) + crag(0, 4, 13, 16, "rock", -0.1) + tree(-11, 4, 3, "dgreen") + tree(11.6, 4, 3.2, "dgreen") + tree(-6, -9, 2.2, "dgreen") + tree(6, -8, 2.2, "dgreen");
      s += arch(0, 4, 5, 7, "#2a1a10") + glow(0, 1, 3, "w") + cyl(-3.2, 4, 0.7, 7, "stone") + cyl(3.2, 4, 0.7, 7, "stone") + path("M-6,7.4Q0,4.6 6,7.4", "none", 'stroke="#d8d0bc" stroke-width="1.1"') + water(0, 8, 9, 1.4);
      return s;
    },
    armenelos() { // 努门诺尔王城：白城与神庙穹顶
      let s = shd(0, 4, 18, 6) + slab(15, 4.6, "stone");
      s += cyl(0, 2, 12, 3, "white", { cren: 1, win: 6 }) + box(-7, -1, 4, 4, 3, "white") + box(7, -1, 4, 4, 3, "white") + cyl(0, -1, 5, 6, "white", { win: 4 });
      s += dome(0, -7, 5.4, "gold") + cyl(0, -12, 0.6, 3, "gold") + cyl(-9, -1, 1.2, 10, "white") + cone(-9, -11, 1.5, 3, "blue") + cyl(9, -1, 1.2, 10, "white") + cone(9, -11, 1.5, 3, "blue") + flag(0, -15, "#c8a030", 4);
      return s;
    },
    bree() { // 山脚小镇、茅草屋、跃马客栈
      let s = shd(0, 4, 18, 6) + hill(4, 3, 14, 9, "green") + path("M-16,4.4Q0,0 16,4.4", "none", 'stroke="#3e6e2a" stroke-width="1.6"');
      s += gable(-8, 3, 5, 3, 3, "wood", "thatch", 2.6) + gable(8, 2, 4.4, 2.6, 3, "wood", "thatch", 2.4) + gable(2, -3, 4.4, 2.6, 3, "wood", "thatch", 2.4);
      s += gable(-1, 4, 9, 5, 4, "stone", "thatch", 3.6) + `<rect x="-3" y="0" width="1" height="1.4" fill="#ffd27a"/><rect x="0.6" y="0" width="1" height="1.4" fill="#ffd27a"/>` + path("M-1.6,4V2.2H.4V4Z", "#4a2a14", "") + cyl(2.4, -4, 0.6, 3, "stone") + smoke(2.6, -8);
      return s;
    },
    weathertop() { // 风云顶残塔
      let s = shd(0, 4, 17, 6) + hill(0, 4, 15, 16, "dgreen") + crag(0, -6, 6, 10, "rock", 0);
      s += cyl(0, -13, 4.4, 3, "stone", { cren: 1 }) + path("M-4.4,-16L-3.4,-19L-2.4,-17L-1,-20L0,-16Z", MAT.stone[1]) + path("M1,-16L2.6,-18.6L4.4,-16Z", MAT.stone[2]) + glow(0, -16, 2.4);
      return s;
    },
    umbar() {
      let s = shd(0, 4, 18, 6) + water(5, 5, 13, 3.2) + box(-6, 3, 12, 4, 3, "sand") + dome(-8, -1, 3, "red") + cyl(-2, -1, 1.4, 10, "sand", { win: 2 }) + cone(-2, -11, 1.7, 3, "red");
      s += path("M4,4H14L12,6.6H6Z", "url(#m-dark)") + path("M9,4V-8", "none", 'stroke="#3a2a1a" stroke-width=".5"') + path("M9.4,-7.6Q14,-3 9.4,2Z", "url(#m-red)") + flag(-2, -14, "#7a1a5a", 4);
      return s;
    },
    esgaroth() { // 长湖镇
      let s = shd(0, 4, 18, 6) + water(0, 4, 17, 4.4);
      for (let x = -11; x <= 11; x += 2.2) s += path(`M${x},2V6`, "none", 'stroke="#4a3018" stroke-width=".45"');
      s += box(0, 2, 22, 1, 3, "wood") + gable(-7, 1, 4.4, 3, 3, "wood", "red", 2.4) + gable(0, 0.4, 6, 4, 4, "wood", "wood", 3.4) + gable(7, 1, 4.4, 3, 3, "wood", "red", 2.4) + smoke(0, -9);
      return s;
    },
    himring() { // 寒冷山丘上的堡垒
      let s = shd(0, 4, 17, 6) + crag(0, 4, 14, 14, "rock", 0) + snowcap(0, 4, 14, 14, 0) + cyl(0, -10, 4.6, 6, "stone", { cren: 1, win: 3 }) + cyl(0, -16, 2, 7, "stone", { cren: 1 }) + flag(0, -24, "#c83a2a", 4);
      return s;
    },
    pelargir() {
      let s = shd(0, 4, 18, 6) + water(5, 5, 13, 3.2) + box(-6, 3, 12, 4, 3, "stone") + cyl(-9, -1, 2, 9, "white", { cren: 1, win: 2 }) + cyl(-3, -1, 1.6, 6, "white", { cren: 1 });
      s += path("M4,4H14L12,6.6H6Z", "url(#m-wood)") + path("M9,4V-8", "none", 'stroke="#3a2a1a" stroke-width=".5"') + path("M9.4,-7.6Q14,-3 9.4,2Z", "url(#m-white)") + flag(-9, -12, "#1a1a2a", 4);
      return s;
    },
    dolamroth() {
      let s = shd(0, 4, 18, 6) + water(6, 5.4, 12, 2.8) + crag(-4, 4, 12, 12, "rock", 0.1) + cyl(-4, -6, 4, 4, "white", { cren: 1, win: 3 }) + cyl(-4, -10, 1.8, 10, "white", { win: 1 }) + cone(-4, -20, 2.2, 4, "blue");
      return s + path("M8,4H15L13.6,6H9Z", "url(#m-white)") + path("M11.4,4V-4", "none", 'stroke="#3a2a1a" stroke-width=".45"') + path("M11.8,-3.6Q15,-1 11.8,2Z", "url(#m-blue)") + flag(-4, -24, "#2a5ab0", 4);
    },
    avallone() {
      let s = shd(0, 4, 17, 6) + water(0, 5, 16, 3.6) + hill(0, 4.4, 11, 8, "green") + cyl(0, -3, 1.6, 15, "white", { win: 2 }) + cone(0, -18, 2, 4, "silver") + glow(0, -20, 3.4, "s");
      return s + tree(-6, 2, 2, "green") + tree(6, 2.4, 2, "green");
    },
  };
  M.nargothrond = () => shd(0, 4, 18, 6) + crag(0, 4, 15, 17, "sand", 0.08) + water(0, 7, 13, 2.2) + arch(-5, 4, 3.2, 5.4, "#1e120a") + arch(0, 4, 4.2, 6.8, "#1e120a") + arch(5, 4, 3.2, 5.4, "#1e120a") + glow(0, 1.4, 3.2) + path("M-4,7.5Q0,4 4,7.5", "none", 'stroke="#d8c8a8" stroke-width="1.2"');
  M.thranduil = () => shd(0, 4, 18, 6) + crag(2, 4, 12, 14, "rock", -0.1) + tree(-10, 4, 3.4, "dgreen") + tree(-6, 1, 3, "green") + tree(9, 3, 3.2, "dgreen") + tree(5, -7, 2.5, "gold") + arch(1, 4, 4.4, 6, "#24180c") + glow(1, 1.5, 3) + water(-2, 7.2, 10, 1.6) + path("M-5,6.8Q1,4.2 6,6.8", "none", 'stroke="#c8a870" stroke-width="1.1"');
  M.alqualonde = () => shd(0, 4, 18, 6) + water(2, 5, 15, 3.8) + crag(-8, 4, 7, 15, "white", 0.2) + path("M-7,4Q-2,-6 4,4", "none", 'stroke="#eef2f6" stroke-width="2.4"') + cyl(-2, 2, 1.6, 11, "white", { win: 2 }) + cone(-2, -9, 2, 3.5, "silver") + glow(-2, -11, 3, "s") + path("M3,4.2Q6,6 10,4.2L11,1Q10,-1 9,1L9,3Q6,2 3,4.2Z", "url(#m-white)") + path("M7,3.5V-3L10,1Z", "url(#m-silver)");
  M.sirionhavens = M.mithlond; M.belegost = M.erebor; M.nogrod = M.erebor;
  M.dale = () => shd(0, 4, 17, 6) + hill(0, 4, 14, 8, "green") + gable(-6, 3, 5, 3.4, 3, "stone", "red", 2.8) + gable(5, 3, 5, 3.4, 3, "stone", "blue", 2.8) + cyl(0, 2, 2.2, 11, "stone", { cren: 1, win: 2 }) + cone(0, -9, 2.6, 4.2, "gold") + flag(0, -14, "#2a6a8a", 4);
  M.ciritungol = () => shd(0, 4, 16, 6) + crag(-6, 4, 7, 20, "dark", 0.15) + crag(6, 4, 7, 18, "dark", -0.15) + cyl(0, -4, 3.2, 11, "dark", { cren: 1, win: 2, lit: 1 }) + cone(0, -15, 2.4, 5, "dark") + glow(0, -10, 2.5, "g");
  M.henneth = () => shd(0, 4, 17, 6) + crag(0, 4, 13, 15, "rock", 0.05) + tree(-9, 3, 2.6, "green") + tree(9, 3, 2.6, "green") + arch(0, 2, 3.6, 6, "#1a2830") + path("M-2.2,-4Q-1,0 -2,4.5H2Q1,0 2.2,-4Z", "url(#m-fall)", "") + water(0, 5.8, 9, 2);
  M.taniquetil = () => shd(0, 4, 20, 7) + crag(0, 4, 16, 26, "white", 0) + snowcap(0, 4, 16, 26, 0) + cyl(0, -19, 3.6, 4, "white", { win: 3 }) + dome(0, -23, 3.8, "gold") + glow(0, -25, 6, "w");
  M.formenos = () => shd(0, 4, 17, 6) + crag(0, 4, 14, 13, "rock", 0) + cyl(0, -6, 6, 4, "stone", { cren: 1 }) + cyl(-4, -9, 1.8, 7, "stone", { cren: 1 }) + cyl(4, -9, 1.8, 7, "stone", { cren: 1 }) + cyl(0, -10, 2.2, 9, "dark", { cren: 1 }) + glow(0, -14, 3.2, "s");
  M.cairandros = () => shd(0, 4, 18, 6) + water(0, 4.5, 16, 4) + path("M-11,4L-6,-3L6,-3L12,4L6,5.5L-6,5.5Z", "url(#m-rock)") + cyl(-2, -1, 3.2, 6, "white", { cren: 1, win: 2 }) + path("M6,-3L13,0L6,3Z", "url(#m-white)") + flag(-2, -8, "#eef2f6", 4);
  M.annuminas = () => { let s = shd(0, 4, 18, 6) + water(4, 5.4, 13, 2.6) + box(-3, 3, 16, 4, 3, "stone") + cyl(-7, -1, 2.4, 11, "white", { cren: 1, win: 3 }) + cyl(1, -1, 2, 8, "white", { cren: 1, win: 2 }) + cone(1, -9, 2.4, 4, "blue"); return s + flag(-7, -15, "#2a5ab0", 4); };
  M.fornost = () => shd(0, 4, 18, 6) + hill(0, 4, 15, 9, "green") + cyl(0, -4, 9, 3, "stone", { cren: 1, win: 4 }) + cyl(-4, -7, 1.8, 8, "stone", { cren: 1 }) + cyl(4, -7, 2.2, 10, "stone", { cren: 1, win: 2 }) + flag(4, -18, "#2a5ab0", 4);
  M.eithel = () => shd(0, 4, 17, 6) + crag(-10, 4, 7, 16, "rock", 0.2) + path("M-4,-6Q-2,-1 -3,4H1Q0,-1 2,-6Z", "url(#m-fall)", "") + cyl(6, 2, 4, 6, "white", { cren: 1, win: 3 }) + cyl(6, -4, 1.6, 10, "white", { win: 1 }) + cone(6, -14, 2, 4, "blue") + water(-1, 5.4, 6, 1.4);
  M.carndum = () => shd(0, 4, 18, 6) + crag(-8, 4, 9, 20, "dark", 0.2) + crag(8, 4, 9, 22, "dark", -0.2) + snowcap(8, 4, 9, 22, -0.2) + box(0, 4, 10, 8, 2, "dark") + arch(0, 4, 3, 4.4, "#ff6a1a") + cyl(0, -4, 2, 10, "dark", { cren: 1, win: 1, lit: 1 }) + glow(0, -8, 2.4);
  M.erech = () => shd(0, 4, 16, 5.5) + hill(0, 4, 13, 10, "dgreen") + glow(0, -8, 6.5, "g") + `<circle cx="0" cy="-8.2" r="4.4" fill="url(#m-dark)" stroke="#7effd4" stroke-width=".45"/><ellipse cx="-1.4" cy="-9.8" rx="1.6" ry=".9" fill="rgba(220,255,240,.28)" transform="rotate(-25 -1.4 -9.8)"/>` + path("M-8,2L-7.5,-3M8,2L7.5,-3M-5,3.2L-4.8,-1.5M5,3.2L4.8,-1.5", "none", 'stroke="#6a7a72" stroke-width=".8"');
  M.dunharrow = () => shd(0, 4, 17, 6) + crag(-7, 4, 9, 20, "rock", 0.15) + crag(7, 4, 9, 22, "rock", -0.15) + path("M-10,4L6,0L-6,-4L5,-8L0,-11", "none", 'stroke="#d8ccb0" stroke-width="1.1"') + arch(0, -10, 3.2, 5, "#0d0a08") + glow(0, -12, 3.2, "g") + `<circle cx="-8" cy="2" r="1.4" fill="#8a8274"/><circle cx="7" cy="-1" r="1.4" fill="#8a8274"/>`;
  M.amonhen = () => shd(0, 4, 17, 6) + hill(0, 4, 14, 12, "dgreen") + tree(-9, 3, 2.4, "dgreen") + tree(9, 3, 2.4, "dgreen") + slab(5.5, 1.8, "stone", 1.2) + cyl(-3.2, -7.5, 0.7, 4.5, "stone") + cyl(3.2, -7.5, 0.7, 4.5, "stone") + box(0, -8, 4.4, 3.2, 1.4, "stone") + path("M-5,-12H5L4,-13.4H-4Z", "url(#m-stone)");
  M.eregion = () => shd(0, 4, 18, 6) + hill(0, 4, 14, 8, "green") + cyl(0, 1, 7.5, 3.2, "white", { cren: 1, win: 4 }) + dome(0, -2.2, 4.8, "silver") + cyl(-6, 1, 1.5, 10, "white", { win: 2 }) + cone(-6, -9, 1.9, 3.6, "blue") + cyl(6, 1, 1.5, 10, "white", { win: 2 }) + cone(6, -9, 1.9, 3.6, "blue") + glow(0, -7, 3.8, "s");
  M.twotrees = () => shd(0, 4, 20, 6.5) + hill(0, 4, 16, 9, "green") + glow(-5, -13, 7, "s") + glow(5, -13, 7, "w") + tree(-5, -2, 5.2, "silver", "white") + tree(5, -2, 5.4, "gold", "wood") + dome(0, 1, 3.6, "gold");
  M.tharbad = () => shd(0, 4, 18, 6) + `<path d="M-16,4.5Q0,1 16,4.5Q0,7.5 -16,4.5Z" fill="url(#m-water)"/>` + box(-9, 2.5, 9, 3.2, 1.8, "stone") + box(9, 2.5, 9, 3.2, 1.8, "stone") + arch(-8, 2.5, 2.6, 2.2, "#24546e") + arch(8, 2.5, 2.6, 2.2, "#24546e") + cyl(-11, -0.5, 2, 5, "stone", { cren: 1 });
  M.bywater = () => shd(0, 4, 16, 5.5) + hill(-3, 4, 11, 8, "green") + water(5, 4.8, 8, 2.2) + gable(-3, 2.5, 6.5, 3.8, 3, "wood", "thatch", 2.8) + `<circle cx="-3" cy="1" r="1.4" fill="#3a8a3a"/>` + smoke(-1, -4.5);
  M.buckland = () => shd(0, 4, 16, 5.5) + water(-9, 4.5, 5, 2.5) + hill(2, 4, 12, 10, "green") + `<circle cx="0" cy="0.5" r="2" fill="#c8a040" stroke="#5a3a20" stroke-width=".4"/><circle cx="5" cy="1.5" r="1.5" fill="#3a8a3a" stroke="#5a3a20" stroke-width=".4"/><circle cx="2" cy="-3.5" r="1.4" fill="#ffe8a0"/>` + tree(9, 3, 2.4, "dgreen");
  M.azanulbizar = () => shd(0, 4, 17, 6) + crag(-8, 4, 8, 16, "rock", 0.2) + water(2, 4.5, 10, 2.8) + `<circle cx="2" cy="4.5" r="5" fill="none" stroke="#fff8c8" stroke-width=".5" stroke-dasharray=".8 1.6"/>` + cyl(-5, 3, 0.9, 7, "stone");
  M.celebrantfield = () => shd(0, 4, 16, 5.5) + hill(0, 4, 14, 6, "green") + water(-6, 5, 8, 2) + flag(0, 1, "#2e7a2a", 9) + flag(4, 2, "#c89a2e", 7);
  M.gollumcave = () => shd(0, 4, 17, 6) + crag(0, 4, 14, 18, "dark", 0.05) + arch(0, 4, 8, 7, "#0a0c10") + water(0, 4.5, 6, 1.5) + `<circle cx="1.5" cy="4" r="1.1" fill="none" stroke="#ffd84a" stroke-width=".6"/>` + glow(1.5, 4, 2.5, "w");
  M.carrock = () => shd(0, 4, 17, 6) + water(0, 4.5, 15, 3.8) + path("M-7,4L-5,-9H5L7,4Z", "url(#m-rock)") + path("M0,4V-9", "none", 'stroke="#ece4d2" stroke-width=".7" stroke-dasharray=".9 .7"');
  M.gladden = () => shd(0, 4, 17, 5.5) + water(0, 4, 14, 3.4) + path("M-9,4v-5M-7,4.5v-4M7,4v-5M9,4.5v-4", "none", 'stroke="#4a6a32" stroke-width=".8"') + `<circle cx="-8" cy="-1.5" r="1.1" fill="#f4c430"/><circle cx="8" cy="-1.5" r="1.1" fill="#f4c430"/><circle cx="0" cy="4" r="1.3" fill="none" stroke="#ffd84a" stroke-width=".65"/>` + glow(0, 4, 3, "w");
  M.deadmarshes = () => shd(0, 4, 17, 5.5) + `<ellipse cx="0" cy="3.5" rx="14" ry="3.8" fill="#263228"/>` + glow(-6, 1, 2.4, "g") + glow(1, 0, 2.8, "g") + glow(7, 1.5, 2.2, "g") + `<circle cx="-6" cy="1" r=".8" fill="#d8ffe8"/><circle cx="1" cy="0" r=".9" fill="#d8ffe8"/><circle cx="7" cy="1.5" r=".8" fill="#d8ffe8"/>`;
  M.dagorlad = () => shd(0, 4, 16, 5.5) + `<ellipse cx="0" cy="3.5" rx="14" ry="3.6" fill="#4a382c"/>` + path("M-6,3L-3,-5M4,3L1,-5", "none", 'stroke="#8a7a6a" stroke-width=".9"') + flag(-1, 2, "#8a2a1a", 7);
  M.losgar = () => shd(0, 4, 17, 5.5) + water(3, 4.5, 12, 3) + crag(-8, 4, 7, 12, "rock", 0.2) + path("M-1,4H8L6.5,6H0.5Z", "url(#m-white)") + glow(3, 1, 4.5) + smoke(3, -4, 0);
  M.nanelmoth = () => shd(0, 4, 17, 6) + tree(-6, 4, 4.2, "dgreen") + tree(6, 4, 4.2, "dgreen") + tree(0, 3, 5, "dgreen") + glow(0, -4, 3.5, "s");
  M.cabed = () => shd(0, 4, 17, 6) + crag(-8, 4, 7, 16, "rock", 0.25) + crag(8, 4, 7, 16, "rock", -0.25) + `<path d="M-3,5.5L-1,-2H1L3,5.5Z" fill="url(#m-water)"/>` + cyl(-5, -8, 1, 3.5, "stone");
  M.tolgalen = () => shd(0, 4, 17, 5.5) + water(0, 4, 15, 3.8) + hill(0, 3.8, 9, 6, "green") + tree(-3, 2, 2.6, "green") + tree(3, 2, 2.6, "gold") + glow(0, -2, 3.5, "w");
  M.andunie = () => shd(0, 4, 17, 6) + water(-4, 5, 12, 3) + box(5, 3, 10, 3.5, 2.5, "white") + cyl(8, -0.5, 1.8, 10, "white", { win: 2 }) + cone(8, -10.5, 2.2, 3.6, "blue") + path("M-10,4H-2L-3.5,6H-8.5Z", "url(#m-white)") + path("M-6,4V-5", "none", 'stroke="#6a5a4a" stroke-width=".5"') + path("M-5.6,-4.6Q-1,-1 -5.6,2.2Z", "url(#m-silver)");

  const base = window.ME_ICON;
  window.ME_ICON = (p) => { const m = M[p.id]; if (!m) return base(p); defs(); return `<g class="mdl">${m()}<rect class="mbox" x="-14" y="-34" width="28" height="40" fill="none" stroke="none"/></g>`; };
  window.ME_MODELS = M;
})();
