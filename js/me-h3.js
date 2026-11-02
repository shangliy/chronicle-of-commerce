/* 中洲纪年 · “英雄”风格（向经典回合制奇幻策略游戏的冒险地图致敬，全部为原创绘制）
 * 风格由 middle-earth.html 头部脚本写入 window.ME_STYLE（"h3" 默认 / "parch" 羊皮纸）。
 * 提供：canvas 生成的地形贴图、地形区块、城镇插画、地图上的宝物与建筑、英雄属性。
 */
(function () {
  if (window.ME_STYLE !== "h3") return;

  /* ——随机数—— */
  let s0 = 1; const rnd = () => ((s0 = (s0 * 16807) % 2147483647) - 1) / 2147483646;
  const R = (a, b) => a + (b - a) * rnd(), pick = (a) => a[Math.floor(rnd() * a.length)];

  /* ======================= 地形贴图 ======================= */
  const S = 384;
  function mk(sd, base, draw) {
    s0 = sd; const c = document.createElement("canvas"); c.width = c.height = S;
    const g = c.getContext("2d"); g.fillStyle = base; g.fillRect(0, 0, S, S); draw(g); return c.toDataURL("image/jpeg", 0.86);
  }
  // 在四周重复绘制，保证贴图无缝
  function W(g, x, y, m, fn) {
    for (const dx of [0, -S, S]) for (const dy of [0, -S, S]) {
      if ((dx === -S && x < S - m) || (dx === S && x > m) || (dy === -S && y < S - m) || (dy === S && y > m)) continue;
      g.save(); g.translate(x + dx, y + dy); fn(g); g.restore();
    }
  }
  function blobs(g, n, cols, r0, r1, al) {
    for (let i = 0; i < n; i++) {
      const x = R(0, S), y = R(0, S), rx = R(r0, r1), ry = rx * R(0.5, 1), a = R(0, 3.14), c = pick(cols);
      W(g, x, y, r1 + 2, (g) => { g.globalAlpha = al; g.fillStyle = c; g.beginPath(); g.ellipse(0, 0, rx, ry, a, 0, 6.29); g.fill(); });
    }
    g.globalAlpha = 1;
  }
  function tufts(g, n, dark, light, h = 6) {
    for (let i = 0; i < n; i++) {
      const x = R(0, S), y = R(0, S), hh = R(h * 0.5, h);
      W(g, x, y, 10, (g) => {
        g.lineWidth = 1.3; g.lineCap = "round";
        [[-2, -1.4], [0, 0], [2, 1.4]].forEach(([ox, lean], k) => { g.strokeStyle = k === 1 ? light : dark; g.beginPath(); g.moveTo(ox, 0); g.quadraticCurveTo(ox + lean, -hh * 0.6, ox + lean * 1.6, -hh); g.stroke(); });
      });
    }
  }
  function dots(g, n, cols, r) { for (let i = 0; i < n; i++) { const x = R(0, S), y = R(0, S), c = pick(cols); W(g, x, y, 4, (g) => { g.fillStyle = c; g.beginPath(); g.arc(0, 0, R(r * 0.6, r), 0, 6.29); g.fill(); }); } }
  function stones(g, n, col, sh, hi, r0, r1) {
    for (let i = 0; i < n; i++) {
      const x = R(0, S), y = R(0, S), r = R(r0, r1), k = Math.floor(R(5, 8)), pts = [];
      for (let j = 0; j < k; j++) { const a = (j / k) * 6.283, rr = r * R(0.7, 1.1); pts.push([Math.cos(a) * rr, Math.sin(a) * rr * 0.7]); }
      W(g, x, y, r1 + 3, (g) => {
        g.fillStyle = "rgba(0,0,0,.28)"; g.beginPath(); pts.forEach(([a, b], j) => (j ? g.lineTo(a + 1.5, b + 1.5) : g.moveTo(a + 1.5, b + 1.5))); g.fill();
        g.fillStyle = col; g.beginPath(); pts.forEach(([a, b], j) => (j ? g.lineTo(a, b) : g.moveTo(a, b))); g.fill();
        g.fillStyle = sh; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let j = 0; j <= k / 2; j++) g.lineTo(pts[j][0], pts[j][1]); g.fill();
        g.fillStyle = hi; g.beginPath(); g.ellipse(-r * 0.25, -r * 0.25, r * 0.35, r * 0.2, -0.5, 0, 6.29); g.fill();
      });
    }
  }
  function arcs(g, n, col, w, len, al = 1) {
    for (let i = 0; i < n; i++) {
      const x = R(0, S), y = R(0, S), l = R(len * 0.5, len);
      W(g, x, y, l + 3, (g) => { g.globalAlpha = al; g.strokeStyle = col; g.lineWidth = w; g.lineCap = "round"; g.beginPath(); g.moveTo(-l, 0); g.quadraticCurveTo(0, -l * 0.35, l, 0); g.stroke(); });
    }
    g.globalAlpha = 1;
  }
  function cracks(g, n, glow) {
    for (let i = 0; i < n; i++) {
      let x = R(0, S), y = R(0, S); const pts = [[0, 0]]; let a = R(0, 6.28), px = 0, py = 0;
      for (let k = 0; k < 9; k++) { a += R(-0.9, 0.9); px += Math.cos(a) * R(4, 10); py += Math.sin(a) * R(4, 10); pts.push([px, py]); }
      W(g, x, y, 80, (g) => {
        [[4.5, "rgba(120,20,6,.55)"], [2, glow ? "#ff6a14" : "#6a4a40"], [0.7, glow ? "#ffd25a" : "#8a6a5a"]].forEach(([w, c]) => {
          g.strokeStyle = c; g.lineWidth = w; g.lineJoin = g.lineCap = "round"; g.beginPath(); pts.forEach(([a, b], j) => (j ? g.lineTo(a, b) : g.moveTo(a, b))); g.stroke();
        });
      });
    }
  }
  function puddles(g, n) {
    for (let i = 0; i < n; i++) {
      const x = R(0, S), y = R(0, S), rx = R(6, 17), ry = rx * R(0.35, 0.6);
      W(g, x, y, 20, (g) => {
        g.fillStyle = "#5e7a54"; g.beginPath(); g.ellipse(0, 0, rx + 2, ry + 1.6, 0, 0, 6.29); g.fill();
        g.fillStyle = "#26402f"; g.beginPath(); g.ellipse(0, 0, rx, ry, 0, 0, 6.29); g.fill();
        g.fillStyle = "rgba(160,200,190,.45)"; g.beginPath(); g.ellipse(-rx * 0.3, -ry * 0.3, rx * 0.4, ry * 0.2, 0, 0, 6.29); g.fill();
      });
    }
  }
  const TX = {};
  function textures() {
    TX.grass = mk(11, "#4b8a2c", (g) => { blobs(g, 700, ["#3f7a25", "#56962f", "#4f8f2b", "#62a338", "#43802a"], 8, 26, 0.32); blobs(g, 2600, ["#3a7022", "#5c9c34", "#6aa83e"], 1.5, 4, 0.5); tufts(g, 650, "#2d5e17", "#86c252"); dots(g, 46, ["#f4e86a", "#ffffff", "#f0a0c0"], 1.6); });
    TX.aman = mk(12, "#5aa83b", (g) => { blobs(g, 700, ["#6cb848", "#4f9a33", "#7cc050", "#a8c048"], 8, 26, 0.32); blobs(g, 2400, ["#4a9030", "#8cc858", "#c8c060"], 1.5, 4, 0.5); tufts(g, 500, "#3a7a22", "#a8e070"); dots(g, 160, ["#ffffff", "#f4e070", "#f0b0d0", "#c8e0ff"], 1.8); });
    TX.dry = mk(13, "#7d7442", (g) => { blobs(g, 700, ["#6e6638", "#8c8250", "#9a8c58", "#706a3a"], 8, 26, 0.32); blobs(g, 2400, ["#5e5830", "#a09460"], 1.5, 4, 0.5); tufts(g, 450, "#4e4a28", "#b0a468", 5); });
    TX.dirt = mk(14, "#8b6b3f", (g) => { blobs(g, 700, ["#7a5c34", "#9b7a4a", "#a8875a", "#80603a"], 8, 26, 0.35); blobs(g, 2200, ["#6a4e2c", "#b09060"], 1.5, 4, 0.5); stones(g, 160, "#8a7458", "#5e4a34", "rgba(255,240,200,.35)", 1.6, 3.6); });
    TX.rough = mk(15, "#857759", (g) => { blobs(g, 600, ["#76694c", "#948668", "#9e9070", "#6e6248"], 8, 26, 0.35); blobs(g, 2000, ["#5e543e", "#b0a284"], 1.5, 4, 0.5); stones(g, 150, "#9a9288", "#5e584e", "rgba(255,255,240,.45)", 3, 8); });
    TX.sand = mk(16, "#d9bd78", (g) => { blobs(g, 600, ["#cfb06a", "#e4ca88", "#c8a660", "#e8d090"], 8, 26, 0.35); arcs(g, 420, "#b8964e", 1.4, 9, 0.55); arcs(g, 300, "#f2dea4", 1, 7, 0.7); dots(g, 120, ["#a88648"], 1); });
    TX.snow = mk(17, "#e4ebf1", (g) => { blobs(g, 600, ["#d2dce6", "#f2f6fa", "#c8d4e0", "#ffffff"], 8, 26, 0.4); arcs(g, 260, "#b0c0d4", 1.6, 10, 0.6); arcs(g, 200, "#ffffff", 1.2, 8, 0.9); dots(g, 60, ["#a8b8cc"], 1.2); });
    TX.swamp = mk(18, "#4c5f30", (g) => { blobs(g, 600, ["#3f5228", "#5a6e38", "#465a2e", "#55683a"], 8, 26, 0.38); puddles(g, 46); tufts(g, 520, "#2a3a18", "#7a9a4a", 8); dots(g, 50, ["#6a3a1a"], 1.6); });
    TX.lava = mk(19, "#352725", (g) => { blobs(g, 700, ["#281c1a", "#43322e", "#4e3a33", "#2e2220"], 8, 26, 0.45); stones(g, 90, "#3e3230", "#1e1614", "rgba(255,140,80,.25)", 2.4, 6); cracks(g, 46, true); });
    TX.ash = mk(20, "#4a403c", (g) => { blobs(g, 700, ["#3e3532", "#5a4e48", "#544842", "#36302c"], 8, 26, 0.45); stones(g, 110, "#5a504a", "#2e2826", "rgba(255,240,220,.25)", 2, 5); cracks(g, 14, true); cracks(g, 26, false); });
    TX.water = mk(21, "#1c5d90", (g) => { blobs(g, 500, ["#1a5486", "#226aa2", "#1d6299", "#2a74ad"], 12, 34, 0.35); arcs(g, 300, "#4f93c8", 1.8, 8, 0.8); arcs(g, 180, "#9ccbec", 1, 5, 0.8); dots(g, 50, ["#d8f0ff"], 1.1); });
    TX.shallow = mk(22, "#3a86b4", (g) => { blobs(g, 500, ["#3a7eaa", "#4a96c2", "#2f78a6"], 12, 30, 0.35); arcs(g, 260, "#7ab8dc", 1.6, 7, 0.8); arcs(g, 160, "#c4e6f6", 1, 5, 0.9); });
    return Object.entries(TX).map(([k, u]) => { const w = k === "water" ? 150 : 104; return `<pattern id="tx-${k}" patternUnits="userSpaceOnUse" width="${w}" height="${w}"><image href="${u}" width="${w}" height="${w}" preserveAspectRatio="none"/></pattern>`; }).join("");
  }

  /* ——地形区块（会被裁进陆地之内）——  t: 贴图  clip: me 中洲 / bel 贝烈瑞安德 */
  const BIOMES = [
    { t: "snow", clip: "me", pts: [[40, -140], [1040, -140], [1040, 30], [930, 46], [820, 40], [700, 58], [600, 44], [500, 60], [420, 40], [320, 62], [220, 70], [120, 58], [40, 64]] },
    { t: "snow", clip: "bel", pts: [[-720, -140], [260, -140], [260, -76], [60, -70], [-120, -64], [-400, -72], [-720, -60]] },
    { t: "ash", clip: "bel", pts: [[-360, -140], [-170, -140], [-160, -40], [-230, -20], [-330, -26], [-370, -60]] },
    { t: "lava", clip: "me", pts: [[728, 506], [800, 492], [870, 470], [936, 492], [944, 560], [930, 640], [860, 652], [780, 640], [738, 618], [728, 562]] },
    { t: "ash", clip: "me", pts: [[700, 470], [740, 466], [780, 470], [790, 494], [740, 506], [704, 498]] },
    { t: "sand", clip: "me", pts: [[580, 668], [700, 660], [820, 648], [1040, 630], [1040, 820], [540, 820], [560, 740]] },
    { t: "dry", clip: "me", pts: [[900, 300], [1040, 290], [1040, 480], [960, 480], [910, 440]] },
    { t: "dry", clip: "me", pts: [[636, 388], [700, 384], [716, 420], [690, 440], [640, 430]] },
    { t: "dirt", clip: "me", pts: [[440, 380], [500, 384], [508, 430], [470, 446], [436, 420]] },
    { t: "dry", clip: "me", pts: [[440, 60], [560, 70], [600, 110], [520, 130], [430, 110]] }
  ];

  /* ======================= 城镇插画 ======================= */
  const INK = "#1e140a";
  const P = (d, f, s = INK, w = 0.6, x = "") => `<path d="${d}" fill="${f}" stroke="${s}" stroke-width="${w}" stroke-linejoin="round" ${x}/>`;
  const Rc = (x, y, w, h, f, s = INK, sw = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="${s}" stroke-width="${sw}"/>`;
  const Ci = (x, y, r, f, s = INK, w = 0.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" stroke="${s}" stroke-width="${w}"/>`;
  const E = (x, y, rx, ry, f, o = 1) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" opacity="${o}"/>`;
  const FLAG = { elf: "#2a62d8", man: "#d02a22", dwarf: "#e08a1a", hob: "#2f9a34", dark: "#7a2aa0", site: "#8a8270", ring: "#e0b020", war: "#d02a22" };
  const flag = (x, y, c, h = 8) => `<path d="M${x},${y}V${y - h}" stroke="${INK}" stroke-width=".7"/><path class="h3flag" d="M${x},${y - h}q3,-1.2 6,0q-1,1.6 0,3.2q-3,-1.2 -6,0z" fill="${c}" stroke="${INK}" stroke-width=".4"/>`;
  const plate = (rx, ry, c, c2) => E(0, 3.4, rx + 1.2, ry + 0.8, "rgba(0,0,0,.32)") + E(0, 3, rx, ry, c) + E(-rx * 0.15, 2.4, rx * 0.7, ry * 0.55, c2, 0.7);
  // 圆塔：x 中心、底 y、宽 w、高 h；墙亮/暗、屋顶亮/暗
  function tw(x, y, w, h, wl, wd, rl, rd, roof = "cone") {
    const l = x - w / 2, r = x + w / 2, t = y - h;
    let s = P(`M${l},${y}V${t}H${r}V${y}Z`, wl) + P(`M${x + w * 0.1},${y}V${t}H${r}V${y}Z`, wd, "none", 0);
    s += Rc(x - 0.5, t + h * 0.3, 1, 1.8, "#20140c", "none", 0);
    if (roof === "cone") s += P(`M${l - 0.8},${t}L${x},${t - w * 1.5}L${r + 0.8},${t}Z`, rl) + P(`M${x},${t - w * 1.5}L${r + 0.8},${t}H${x + w * 0.1}Z`, rd, "none", 0);
    else if (roof === "dome") s += P(`M${l - 0.4},${t}Q${x},${t - w * 1.3} ${r + 0.4},${t}Z`, rl) + P(`M${x},${t - w * 0.66}Q${r},${t - w * 0.5} ${r + 0.4},${t}H${x}Z`, rd, "none", 0);
    else if (roof === "cren") { for (let i = 0; i < 3; i++) s += Rc(l + i * (w / 2.5), t - 1.4, w / 5, 1.4, wl, INK, 0.4); }
    else if (roof === "spike") s += P(`M${l},${t}L${l - 0.6},${t - w * 0.9}L${x - w * 0.15},${t - w * 0.4}L${x},${t - w * 1.8}L${x + w * 0.15},${t - w * 0.4}L${r + 0.6},${t - w * 0.9}L${r},${t}Z`, rl, "#000", 0.5);
    return s;
  }
  function wall(x0, x1, y, h, wl, wd) { let s = P(`M${x0},${y}V${y - h}H${x1}V${y}Z`, wl) + P(`M${(x0 + x1) / 2 + 2},${y}V${y - h}H${x1}V${y}Z`, wd, "none", 0); for (let x = x0; x < x1 - 0.5; x += 2.2) s += Rc(x, y - h - 1.3, 1.2, 1.3, wl, INK, 0.35); return s; }
  const gate = (x, y, w, h, c = "#2a180c") => P(`M${x - w / 2},${y}V${y - h + w / 2}Q${x},${y - h - w * 0.2} ${x + w / 2},${y - h + w / 2}V${y}Z`, c, INK, 0.5) + P(`M${x - w / 4},${y}V${y - h + 1}M${x + w / 4},${y}V${y - h + 1}`, "none", "#6a4a2a", 0.35);
  const tree = (x, y, r, c = "#2f6a22", hi = "#5a9a38") => E(x + 0.8, y + 0.6, r, r * 0.7, "rgba(0,0,0,.3)") + Ci(x, y - r * 0.6, r, c, "#10280a", 0.45) + Ci(x - r * 0.3, y - r * 0.95, r * 0.5, hi, "none", 0);
  const pine = (x, y, h, c = "#24521c") => P(`M${x - h * 0.32},${y}L${x},${y - h}L${x + h * 0.32},${y}Z`, c, "#0c200a", 0.45) + P(`M${x},${y - h}L${x + h * 0.32},${y}H${x}Z`, "rgba(0,0,0,.25)", "none", 0);
  const glow = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity=".45" class="h3glow"/>`;
  const smoke = (x, y) => `<g class="h3smoke"><circle cx="${x}" cy="${y}" r="1.4" fill="#d8d8d0" opacity=".7"/><circle cx="${x + 1.4}" cy="${y - 2.4}" r="1.9" fill="#d8d8d0" opacity=".5"/><circle cx="${x + 0.4}" cy="${y - 5}" r="2.4" fill="#d8d8d0" opacity=".3"/></g>`;

  const STONE = ["#e0d8c8", "#a8a090"], RED = ["#c83a2a", "#7a2016"], BLUE = ["#4a7ad0", "#26408a"], WHITE = ["#f4f6f8", "#c0c8d4"], BLACK = ["#3a3036", "#16101a"];
  const KIND = {
    man: (c = FLAG.man) => plate(14, 4.6, "#9a7a4a", "#b89868") + tw(-8, 0, 4.6, 12, ...STONE, ...RED) + tw(8, 0, 4.6, 12, ...STONE, ...RED) + tw(0, -3, 6.4, 13, ...STONE, ...RED) + wall(-10, 10, 3, 6, ...STONE) + gate(0, 3, 4, 5) + flag(0, -20.6, c),
    elf: (c = FLAG.elf) => plate(13, 4.4, "#5a8a34", "#7aaa48") + tree(-10, 3, 3.4) + tree(10.5, 3, 3) + tw(-5, 2, 3.4, 13, ...WHITE, ...BLUE) + tw(5, 2, 3.4, 11, ...WHITE, ...BLUE) + tw(0, 2, 4.4, 18, ...WHITE, ...BLUE) + `<circle cx="0" cy="-22.6" r=".9" fill="#ffd84a"/>` + P("M-7,3.4Q0,1.6 7,3.4", "#e8ecf0") + flag(0, -23, c, 6),
    dwarf: (c = FLAG.dwarf) => plate(14, 4.6, "#7a7266", "#9a9286") + P("M-14,3L-8,-10L-3,-7L2,-15L7,-9L10,-11L14,3Z", "#8a7e6e") + P("M2,-15L7,-9L10,-11L14,3H2Z", "#5e5448", "none", 0) + P("M-8,-10L-6,-6M2,-15L1,-10", "none", "#c8bca8", 0.6) +
      Rc(-4.4, -7, 8.8, 10, "#6a6052") + P("M-3.4,3V-3Q0,-7 3.4,-3V3Z", "#e8a83a", INK, 0.5) + glow(0, -1, 4.2, "#ffc040") + P("M0,-6V3", "none", "#8a5a1a", 0.5) + Rc(-6.4, -6, 1.6, 9, "#a89c88") + Rc(4.8, -6, 1.6, 9, "#a89c88") + flag(8, -9, c),
    hob: (c = FLAG.hob) => plate(14, 4.6, "#6a9a3a", "#8aba52") + P("M-13,3Q-11,-9 0,-10Q11,-9 13,3Z", "#5a9a34") + P("M0,-10Q11,-9 13,3H2Q4,-4 0,-10Z", "#3f7a24", "none", 0) + P("M-12,-1Q-6,-4 0,-4Q6,-4 12,-1", "none", "#86c252", 0.6) +
      Ci(-3, -0.4, 3.4, "#3a6a2a") + Ci(-3, -0.4, 2.5, "#e8c040") + Ci(-2.2, -0.4, 0.4, INK, "none") + Ci(4.6, -1.8, 1.5, "#f8e8a0") + Ci(8.4, 0, 1.2, "#f8e8a0") + Rc(5, -10.4, 1.8, 3.6, "#a06a40") + smoke(6, -12) + P("M-13,4.2H-6M-12,2.6V4.6M-9,2.6V4.6M-6.2,2.6V4.6", "none", "#8a5a30", 0.6) + flag(-8, -6, c, 6),
    dark: (c = FLAG.dark) => plate(14, 4.6, "#3a2422", "#5a2a20") + P("M-11,4L-6,2.4M6,4.4L11,2.6M-2,4.6L3,3.6", "none", "#ff6a1a", 0.6) + tw(-8, 1, 4, 12, ...BLACK, ...BLACK, "spike") + tw(8, 1, 4, 11, ...BLACK, ...BLACK, "spike") + tw(0, 0, 6, 17, ...BLACK, ...BLACK, "spike") +
      wall(-9, 9, 3, 5, "#2e262a", "#14101a") + gate(0, 3, 4, 4.4, "#ff6a1a") + glow(0, -9, 4, "#ff4a10") + Rc(-0.8, -10, 1.6, 2, "#ff8a2a", "none", 0) + flag(0, -22.4, c),
    site: () => plate(9, 3.4, "#8a7a5a", "#a8986e") + P("M-2.4,3L-1.8,-11L0,-13.6L1.8,-11L2.4,3Z", "#b0a898") + P("M0,-13.6L1.8,-11L2.4,3H0Z", "#787060", "none", 0) + P("M-1,-8H1M-1,-5H1", "none", "#4a6aa0", 0.6) + P("M-7,3L-6,0L-4.6,3ZM4.6,3L6,-0.6L7.4,3Z", "#8a8274"),
    ruin: () => plate(11, 3.8, "#7a6e58", "#968a70") + P("M-8,3V-5L-6.6,-7L-5.4,-4.6L-4.4,-6V3Z", "#a8a090") + P("M3,3V-9L4.4,-7.6L5.6,-10L7,-8V3Z", "#a8a090") + P("M5,3V-9L7,-8V3Z", "#6e685c", "none", 0) + P("M-3,3.4L-1,1.6L1,3.4ZM-10,3.6L-8.6,2.4L-7.6,3.6Z", "#8e8678") + P("M-4,3V-1H2V3", "none", INK, 0.5)
  };
  const SPECIAL = {
    twotrees: () => "",
    minastirith: () => { let s = plate(16, 5, "#9a8e78", "#b8ac94") + P("M8,3L14,-18L17,3Z", "#a89c84") + P("M14,-18L17,3H14Z", "#6e6454", "none", 0); [[13, 0], [11, -4.4], [9, -8.8], [7, -13.2], [5, -17.6]].forEach(([w, y]) => (s += wall(-w, w - 1, y + 3, 4.4, ...WHITE))); return s + tw(0, -15, 2.4, 10, ...WHITE, "#f4f6f8", "#c0c8d4", "cren") + flag(0, -26.4, "#f0f0f0") + gate(0, 3, 3.6, 3.6); },
    baraddur: () => plate(14, 4.6, "#2a1a18", "#4a2018") + P("M-10,4L-6,2.6M6,4.4L11,2.8", "none", "#ff6a1a", 0.6) + P("M-6,3L-4.4,-16L-7,-21L-3,-20L-2.4,-28L0,-32L2.4,-28L3,-20L7,-21L4.4,-16L6,3Z", "#2a2228", "#000", 0.6) + P("M0,-32L2.4,-28L3,-20L7,-21L4.4,-16L6,3H0Z", "#120c10", "none", 0) + glow(0, -25, 7, "#ff4a10") + P("M-3,-25Q0,-28.4 3,-25Q0,-21.6 -3,-25Z", "#ff8a1a", "#ffe08a", 0.5) + P("M0,-26.6V-23.4", "none", "#000", 1),
    isengard: () => E(0, 3.4, 15, 5.6, "rgba(0,0,0,.3)") + E(0, 3, 14, 5, "#8a8478") + E(0, 3, 11, 3.6, "#5a6a3a") + P("M-2.6,4L-2,-18L-4,-22L-1,-21L0,-26L1,-21L4,-22L2,-18L2.6,4Z", "#2a262c", "#000", 0.6) + P("M0,-26L1,-21L4,-22L2,-18L2.6,4H0Z", "#121014", "none", 0) + flag(0, -26, "#e8e8e8", 5),
    rivendell: () => plate(14, 4.4, "#5a8a34", "#7aaa48") + P("M-14,3L-9,-14L-5,3ZM6,3L10,-15L14,3Z", "#8a8070") + P("M-7,-12Q-5,-4 -6,3", "none", "#bfe6ff", 1.6) + tw(0, 3, 5, 9, ...WHITE, "#6a9a5a", "#3a6a3a", "dome") + tw(-3.6, 0, 3, 5, ...WHITE, "#6a9a5a", "#3a6a3a", "dome") + tree(10, 3.4, 2.6) + flag(0, -14, FLAG.elf, 5),
    lorien: () => plate(13, 4.4, "#7a9a3a", "#a8b848") + Rc(-0.9, -6, 1.8, 9, "#d8d0b8") + Ci(0, -13, 8, "#e0b430", "#7a5a10", 0.5) + Ci(-3, -15, 4, "#f4d860", "none", 0) + Ci(-7, -6, 4.4, "#d4a428", "#7a5a10", 0.5) + Ci(7, -6.4, 4.4, "#e8c040", "#7a5a10", 0.5) + glow(0, -10, 10, "#ffe08a") + P("M-4,-8H4", "none", "#8a6a2a", 0.6),
    erebor: () => plate(15, 4.8, "#7a7266", "#9a9286") + P("M-15,3L-6,-14L0,-20L6,-14L15,3Z", "#958a78") + P("M0,-20L6,-14L15,3H0Z", "#5e5448", "none", 0) + P("M-3,-16L-6,-14L-3,-11", "none", "#e8e8f0", 0.8) + P("M-3.4,3V-3Q0,-7.4 3.4,-3V3Z", "#e8a83a", INK, 0.5) + glow(0, -1, 4.6, "#ffc040") + Rc(-7, -6, 2, 9, "#b0a490") + Rc(5, -6, 2, 9, "#b0a490") + flag(9, -8, FLAG.dwarf),
    moria: () => plate(14, 4.6, "#6a6a66", "#8a8a84") + P("M-14,3L-5,-15L0,-11L6,-17L14,3Z", "#86847c") + P("M6,-17L14,3H2Z", "#56544e", "none", 0) + P("M-4,3V-3Q0,-9 4,-3V3Z", "#14161e", "#c8e0ff", 0.8) + `<circle cx="0" cy="-4.4" r=".8" fill="#e8f4ff" class="h3glow"/>` + P("M-2.6,-1.4H2.6M-3,-6.4L0,-8.4L3,-6.4", "none", "#c8e0ff", 0.4) + flag(9, -9, FLAG.dwarf),
    edoras: () => plate(14, 4.6, "#6a9a3a", "#8aba52") + P("M-13,3Q-8,-8 0,-8Q8,-8 13,3Z", "#7aa848") + P("M-6,-6V-11H6V-6Z", "#c8963a") + P("M-7.4,-11L0,-16L7.4,-11Z", "#f0c040") + P("M0,-16L7.4,-11H0Z", "#b08420", "none", 0) + P("M-7.4,-11L-9,-12.6M7.4,-11L9,-12.6", "none", INK, 0.7) + Rc(-1, -9.4, 2, 3.4, "#4a2e1a", "none") + flag(-8, -4, "#2f8a3a"),
    helmsdeep: () => plate(14, 4.6, "#8a7e68", "#a89a80") + P("M-14,3L-8,-14L-3,3ZM3,3L9,-15L14,3Z", "#958a78") + wall(-6, 6, 3, 6, ...STONE) + tw(5, 2, 4.6, 13, ...STONE, "#a8a090", "#6a645a", "cren") + flag(5, -12.6, "#2f8a3a"),
    hobbiton: () => KIND.hob() + `<g class="h3mill">${P("M10.4,-15.6L10.4,-7.6", "none", "#6a4a2a", 0.8)}${P("M10.4,-15.6m-5,0h10M10.4,-15.6m0,-5v10", "none", "#f0e8d0", 1.2)}</g>`,
    osgiliath: () => plate(15, 4.6, "#5a8ab0", "#7aa8c8") + P("M-15,3Q-7.5,-3 0,3Q7.5,-3 15,3", "#d4ccb8") + P("M-16,4H16", "none", "#3a86c4", 1.6) + tw(-7, 0, 3.6, 7, ...STONE, ...RED) + P("M2,-1A4,4 0 0 1 10,-1Z", "#e8e0cc") + Rc(2, -1, 8, 3, "#e0d8c4") + flag(6, -5, FLAG.man),
    minasmorgul: () => plate(13, 4.4, "#3a4238", "#4a5a48") + P("M-13,3L-7,-10L-3,3ZM3,3L8,-11L13,3Z", "#4a5248") + tw(0, 3, 5, 15, "#c8e8c0", "#7a9a78", "#3a5a3a", "#203a20", "cone") + glow(0, -8, 7, "#7aff9a") + Rc(-0.8, -9, 1.6, 2, "#bfffcf", "none") + flag(0, -19.6, FLAG.dark, 5),
    dolguldur: () => plate(13, 4.4, "#3a3a2a", "#4a4a34") + pine(-9, 3, 9, "#1c3a18") + pine(10, 3, 8, "#1c3a18") + tw(0, 1, 5, 12, ...BLACK, ...BLACK, "spike") + glow(0, -6, 5, "#8a4ac0") + flag(0, -19.4, FLAG.dark, 5),
    orodruin: () => E(0, 3.4, 15, 5, "rgba(0,0,0,.35)") + P("M-15,3L-4,-14H4L15,3Z", "#4a3632") + P("M0,-14H4L15,3H2Z", "#241a18", "none", 0) + P("M-4,-14Q0,-17 4,-14Z", "#ff8a1a", "#ffd25a", 0.5) + P("M-1,-14Q-3,-6 -6,3M2,-14Q4,-7 3,3", "none", "#ff5a14", 1.1) + glow(0, -15, 6, "#ff4a10") + smoke(0, -18),
    angband: () => plate(15, 5, "#2a1a18", "#4a2018") + P("M-15,3L-10,-12L-6,-6L-2,-20L2,-8L6,-16L10,-6L15,3Z", "#3a3034", "#000", 0.6) + P("M-2,-20L2,-8L6,-16L10,-6L15,3H0Z", "#16101a", "none", 0) + P("M-3,3V-2Q0,-5 3,-2V3Z", "#ff6a1a") + glow(0, -1, 4, "#ff4a10") + smoke(-2, -22) + smoke(6, -18),
    mithlond: () => plate(13, 4.4, "#5a8ab0", "#7aa8c8") + tw(-4, 1, 3.4, 12, ...WHITE, ...BLUE) + tw(3, 1, 3, 9, ...WHITE, ...BLUE) + P("M5,4H14L12,6.4H7Z", "#e8e0d0") + P("M9.4,4V-4L13,2Z", "#ffffff") + flag(-4, -16, FLAG.elf, 5),
    umbar: () => plate(14, 4.6, "#c8a860", "#e0c480") + tw(-6, 1, 4, 10, "#e0c890", "#a88a50", "#5a2a5a", "#3a1a3a", "dome") + wall(-9, 3, 3, 5, "#e0c890", "#a88a50") + P("M4,4H14L12,6.4H6Z", "#5a3a2a") + P("M8.4,4V-5L12.4,1.6Z", "#3a2a2a") + flag(-6, -15, "#2a2a2a"),
    gondolin: () => { let s = plate(15, 5, "#7a9a5a", "#9aba72"); [[12, 0], [9, -4], [6, -8]].forEach(([w, y]) => (s += wall(-w, w, y + 3, 4, ...WHITE))); return s + tw(0, -9, 3, 10, ...WHITE, "#ffd84a", "#c09020") + flag(0, -24, FLAG.elf, 5); },
    tirion: () => plate(14, 4.6, "#6ab048", "#8ac860") + P("M-14,3Q0,-10 14,3Z", "#7aaa50") + tw(0, -3, 4, 20, ...WHITE, "#ffffff", "#c8d4e0", "cone") + tw(-6, 0, 3, 10, ...WHITE, ...BLUE) + tw(6, 0, 3, 9, ...WHITE, ...BLUE) + glow(0, -30, 3, "#ffffff"),
    menegroth: () => plate(14, 4.6, "#4a7a2e", "#6a9a42") + P("M-13,3Q-10,-11 0,-12Q10,-11 13,3Z", "#8a8070") + P("M0,-12Q10,-11 13,3H0Z", "#5e564a", "none", 0) + tree(-11, 3, 3) + tree(11, 3, 3) + P("M-4,3V-2Q0,-7 4,-2V3Z", "#2a1a10") + glow(0, 0, 3.4, "#ffe08a") + Rc(-5.4, -3, 1.2, 6, "#e8e0d0") + Rc(4.2, -3, 1.2, 6, "#e8e0d0") + flag(0, -12, FLAG.elf, 5),
    esgaroth: () => E(0, 3, 15, 5, "#3a86c4") + E(0, 2.6, 11, 3.2, "#5aa0d0") + P("M-11,4V1M-7,4V1M-3,4V1M1,4V1M5,4V1M9,4V1", "none", INK, 0.6) + P("M-10,1V-4H-2V1Z", "#b08a58") + P("M-11,-4L-6,-8L-1,-4Z", "#7a3a2a") + P("M0,1V-3H8V1Z", "#b08a58") + P("M-1,-3L4,-7L9,-3Z", "#7a3a2a") + flag(4, -7, FLAG.man, 5)
  };
  SPECIAL.nargothrond = SPECIAL.menegroth; SPECIAL.thranduil = SPECIAL.menegroth; SPECIAL.belegost = SPECIAL.erebor; SPECIAL.nogrod = SPECIAL.erebor; SPECIAL.carndum = SPECIAL.angband;
  SPECIAL.alqualonde = SPECIAL.mithlond; SPECIAL.dale = () => KIND.man(); SPECIAL.annuminas = () => KIND.man(FLAG.elf); SPECIAL.armenelos = () => KIND.man("#2a9ab0"); SPECIAL.andunie = () => KIND.man("#2a9ab0");
  SPECIAL.pelargir = () => KIND.man() + P("M10,5H18L16,7.4H12Z", "#e8e0d0") + P("M14,5V-3L17.4,3Z", "#ffffff");
  SPECIAL.dolamroth = () => KIND.man("#3a6ad0");
  const base = window.ME_ICON;
  const icon = (p) => {
    const f = SPECIAL[p.id]; if (f) return f();
    if (p.k === "site" && /废墟|战场|之战/.test(p.n)) return KIND.ruin();
    return (KIND[p.k] || KIND.site)();
  };
  window.ME_ICON = (p) => icon(p) ?? base(p);

  /* ======================= 冒险地图上的物件 ======================= */
  const OBJ = {
    gold: () => E(0, 0.4, 5, 1.6, "rgba(0,0,0,.3)") + P("M-4.4,0Q-4,-3 0,-3.6Q4,-3 4.4,0Z", "#e8b020", "#7a5008", 0.5) + Ci(-2, -2.4, 1.1, "#ffe070", "#9a6a10", 0.3) + Ci(1, -3.2, 1.1, "#ffd040", "#9a6a10", 0.3) + Ci(2.6, -1.4, 1.1, "#ffe070", "#9a6a10", 0.3) + `<circle cx="-.6" cy="-3.4" r=".6" fill="#fff" class="h3spark"/>`,
    wood: () => E(0, 0.6, 5.4, 1.6, "rgba(0,0,0,.3)") + [[-2.6, -1.2], [2.6, -1.2], [0, -3.4]].map(([x, y]) => Rc(x - 2.6, y - 1.1, 5.2, 2.2, "#8a5a2a", INK, 0.4) + Ci(x + 2.6, y, 1.1, "#d8a868", INK, 0.35)).join(""),
    ore: () => E(0, 0.6, 5.4, 1.6, "rgba(0,0,0,.3)") + P("M-5,0L-3.4,-3L-0.6,-3.6L1,-1.6L3.6,-3L5,0Z", "#8a8a8e", INK, 0.5) + P("M-0.6,-3.6L1,-1.6L3.6,-3L5,0H0Z", "#5e5e64", "none", 0) + Ci(-2.6, -2, 0.6, "#c8c8cc", "none"),
    gems: () => E(0, 0.6, 5, 1.4, "rgba(0,0,0,.3)") + P("M-4,0L-3,-3L-1.6,0Z", "#e83a3a", INK, 0.35) + P("M-1.4,0L0,-4.4L1.4,0Z", "#3ac0e8", INK, 0.35) + P("M1.6,0L3,-3L4.2,0Z", "#4ae05a", INK, 0.35) + `<circle cx="0" cy="-3.4" r=".6" fill="#fff" class="h3spark"/>`,
    crystal: () => E(0, 0.6, 4.6, 1.4, "rgba(0,0,0,.3)") + P("M-3,0L-2,-5L-0.6,0ZM-1,0L0.6,-7L2,0ZM1.4,0L3,-4L3.8,0Z", "#e85a7a", "#6a1a2a", 0.4) + P("M0.6,-7L2,0H0.6Z", "#a83a5a", "none", 0) + `<circle cx=".4" cy="-5.6" r=".6" fill="#fff" class="h3spark"/>`,
    chest: () => E(0, 0.6, 4.6, 1.4, "rgba(0,0,0,.3)") + Rc(-3.6, -3.4, 7.2, 3.8, "#8a5a2a", INK, 0.5) + P("M-3.6,-3.4Q0,-6 3.6,-3.4Z", "#a06a34", INK, 0.5) + P("M-3.6,-2.6H3.6", "none", "#e0b030", 0.8) + Rc(-0.7, -3, 1.4, 1.6, "#ffd040", INK, 0.3),
    fire: () => P("M-3,0L3,-1.4M-3,-1.4L3,0", "none", "#6a4020", 1.2) + `<path class="bc-f" d="M-2,-0.6Q-2.4,-3.4 0,-6Q2.4,-3.4 2,-0.6Z" fill="#ff8a1a"/><path class="bc-f" d="M-1,-0.8Q-1,-2.6 0,-4Q1,-2.6 1,-0.8Z" fill="#ffe060"/>`,
    mill: () => E(0, 0.8, 5, 1.6, "rgba(0,0,0,.3)") + P("M-3,0L-2,-9H2L3,0Z", "#e8dcc0", INK, 0.5) + P("M0,-9H2L3,0H0Z", "#b8a888", "none", 0) + P("M-2.6,-9L0,-11.4L2.6,-9Z", "#a03a2a", INK, 0.4) + `<g class="h3mill" transform="translate(0,-8.6)">${P("M-5.6,0H5.6M0,-5.6V5.6", "none", "#5a3a1a", 0.7)}${P("M0,0L-1.2,-5.6H0ZM0,0L5.6,-1.2V0ZM0,0L1.2,5.6H0ZM0,0L-5.6,1.2V0Z", "#f4ecd8", INK, 0.3)}</g>`,
    well: () => E(0, 0.6, 4.6, 1.4, "rgba(0,0,0,.3)") + P("M-3,0V-2.4H3V0Z", "#a8a090", INK, 0.5) + E(0, -2.4, 3, 0.9, "#3a86c4") + P("M-2.6,-2.4V-6.6M2.6,-2.4V-6.6", "none", "#6a4a2a", 0.6) + P("M-3.6,-6.4L0,-8.6L3.6,-6.4Z", "#a03a2a", INK, 0.4) + `<circle cx="0" cy="-2.6" r=".7" fill="#bfe8ff" class="h3spark"/>`,
    shrine: () => E(0, 0.6, 5, 1.4, "rgba(0,0,0,.3)") + Rc(-4, -1, 8, 1.2, "#d8d0c0", INK, 0.4) + [-3, -1, 1, 3].map((x) => Rc(x - 0.5, -6, 1, 5, "#ece6d8", INK, 0.3)).join("") + P("M-4.4,-6L0,-8.6L4.4,-6Z", "#d8d0c0", INK, 0.4) + glow(0, -3.4, 2.4, "#a8d0ff"),
    sign: () => P("M0,0V-6", "none", "#5a3a1a", 0.8) + P("M-3.6,-6.4H2.4L3.6,-5.4L2.4,-4.4H-3.6Z", "#c89a5a", INK, 0.4),
    mine: () => E(0, 1, 7, 2, "rgba(0,0,0,.3)") + P("M-7,0L-4,-6L0,-8L4,-5L7,0Z", "#7a6e5e", INK, 0.5) + P("M0,-8L4,-5L7,0H1Z", "#544a3e", "none", 0) + P("M-2.4,0V-3Q0,-5 2.4,-3V0Z", "#14100c", INK, 0.4) + P("M-6,1.2L-2,0.2M-6,0L-2.4,-0.6", "none", "#6a4a2a", 0.4) + flag(4.6, -4.6, "#8a8270", 5),
    sawmill: () => E(0, 1, 7, 2, "rgba(0,0,0,.3)") + P("M-5,0V-4H3V0Z", "#a8783a", INK, 0.5) + P("M-6,-4L-1,-7.4L4,-4Z", "#6a4a2a", INK, 0.4) + Rc(3.4, -1.6, 4, 1.6, "#8a5a2a", INK, 0.3) + Ci(7.4, -0.8, 0.8, "#d8a868", INK, 0.3) + `<circle cx="-2" cy="-2" r="1.3" fill="#c8c8cc" stroke="${INK}" stroke-width=".3"/>`,
    tent: () => E(0, 0.6, 5, 1.4, "rgba(0,0,0,.3)") + P("M-4.4,0L0,-6L4.4,0Z", "#d8c8a0", INK, 0.5) + P("M0,-6L4.4,0H0Z", "#a8987a", "none", 0) + P("M-1,0L0,-3L1,0Z", "#3a2a1a", "none", 0) + flag(0, -6, "#8a8270", 3.4),
    bones: () => P("M-3,0L3,-1.4M-3,-1.4L3,0", "none", "#ece4d0", 0.8) + Ci(-3.4, -2.2, 1.2, "#ece4d0", INK, 0.3) + Ci(-3.6, -2.4, 0.3, INK, "none")
  };
  // 权重：普通物件
  const MIX = [["gold", 13], ["wood", 10], ["ore", 9], ["gems", 6], ["crystal", 5], ["chest", 15], ["fire", 6], ["mill", 4], ["well", 4], ["shrine", 4], ["sign", 6], ["tent", 4], ["bones", 3]];
  const MIXT = MIX.reduce((a, [, w]) => a + w, 0);
  const pickObj = (r) => { let x = r * MIXT; for (const [k, w] of MIX) { if ((x -= w) < 0) return k; } return "gold"; };

  /* ======================= 英雄属性 ======================= */
  const CLS = {
    wizard: ["巫师", [1, 1, 3, 3]], knight: ["骑士", [3, 3, 1, 1]], ranger: ["游侠", [3, 2, 1, 1.4]], warrior: ["战士", [3, 3.4, 0.6, 0.6]],
    hob: ["冒险者", [1.2, 2, 0.8, 1.6]], dark: ["术士", [2, 1.4, 3, 2.4]], sage: ["贤者", [1, 1.4, 2.4, 3.4]], bard: ["吟游诗人", [1.2, 1.2, 2, 2.6]], lord: ["领主", [2.4, 2.6, 1.4, 2]]
  };
  function heroClass(c) {
    const l = c.look || {};
    if (c.r === "dark") return "dark";
    if (l.hat === "wizard" || l.it === "staff") return "wizard";
    if (l.it === "harp" || l.it === "pipe") return "bard";
    if (c.r === "hob") return "hob";
    if (l.it === "bow") return "ranger";
    if (l.it === "axe" || c.r === "dwarf") return "warrior";
    if (l.it === "star" || l.it === "ring" || (!l.it && c.r === "elf")) return "sage";
    if (l.hat === "crown" || l.hat === "circlet") return "lord";
    return "knight";
  }
  function hash(s) { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }
  function stats(c, n) { // n: { battles, journeys, chapters }
    const k = heroClass(c), [name, wt] = CLS[k], h = hash(c.id);
    const lvl = Math.max(1, Math.min(40, 2 + n.battles * 3 + n.journeys * 2 + n.chapters + (h % 4)));
    const tot = 4 + lvl * 0.9, sw = wt.reduce((a, b) => a + b, 0);
    const v = wt.map((w, i) => Math.max(0, Math.round((tot * w) / sw + (((h >> (i * 3)) & 7) - 3) * 0.5)));
    return { k, cls: name, lvl, atk: v[0], def: v[1], pow: v[2], kno: v[3], morale: ((h >> 5) % 3) + (c.r === "hob" ? 1 : 0), luck: ((h >> 9) % 3) + (c.r === "hob" ? 2 : 0) };
  }
  const ICON = {
    atk: `<svg viewBox="0 0 24 24"><path d="M4,20L15,9L16,4L20,8L15,9" fill="#d8dce4" stroke="#1e140a" stroke-width="1.2"/><path d="M3,17L7,21M5,19L2,22" stroke="#7a4a20" stroke-width="2.2"/><path d="M6,15L9,18" stroke="#e0b030" stroke-width="2"/></svg>`,
    def: `<svg viewBox="0 0 24 24"><path d="M12,2L20,5V11Q20,18 12,22Q4,18 4,11V5Z" fill="#3a6ad0" stroke="#1e140a" stroke-width="1.2"/><path d="M12,4V20M6,9H18" stroke="#e0b030" stroke-width="1.6"/></svg>`,
    pow: `<svg viewBox="0 0 24 24"><path d="M12,2Q17,8 15,12Q19,10 18,15Q17,21 12,22Q6,21 6,15Q6,10 10,8Q9,12 12,12Q9,6 12,2Z" fill="#ff7a1a" stroke="#7a1a08" stroke-width="1"/><path d="M12,13Q14,16 12,20Q10,16 12,13Z" fill="#ffe060"/></svg>`,
    kno: `<svg viewBox="0 0 24 24"><path d="M3,5Q8,3 12,6Q16,3 21,5V19Q16,17 12,20Q8,17 3,19Z" fill="#ece0c0" stroke="#1e140a" stroke-width="1.2"/><path d="M12,6V20" stroke="#1e140a" stroke-width="1"/><path d="M5,9H10M5,12H10M14,9H19M14,12H19" stroke="#7a6040" stroke-width=".9"/></svg>`
  };

  window.ME_H3 = { textures, BIOMES, OBJ, pickObj, FLAG, stats, ICON, plate };
})();
