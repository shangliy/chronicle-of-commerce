/* 中洲纪年 · 人物插画（原创矢量半身像，由人物的 look 参数生成；背景按出身配一幅小场景）
 * window.PORTRAIT(c) → <svg viewBox="0 0 200 250">…</svg>
 * 绘法：主光来自左上（渐变 + 柔化阴影），右侧按场景打一道轮廓光，背景做景深虚化与空气透视，
 *       整幅叠画布颗粒与暗角。所有造型都是程序拼出来的，不复刻任何既有形象。
 */
window.PORTRAIT = (function () {
  const INK = "#2a1a10";
  let uid = 0;
  const cache = {};
  /* —— 颜色工具 —— */
  function hx(c) { c = (c || "#888").replace("#", ""); if (c.length === 3) c = c.split("").map((x) => x + x).join(""); return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16)); }
  function mix(a, b, k) { const A = hx(a), B = hx(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join(""); }
  const dk = (c, k = 0.3) => mix(c, "#000000", k), lt = (c, k = 0.3) => mix(c, "#ffffff", k);
  const hi = (c, k = 0.3) => mix(c, "#fff1cf", k), sh = (c, k = 0.3) => mix(c, "#1b1222", k); // 暖高光 / 冷阴影
  const P = (d, f, extra = "") => `<path d="${d}" fill="${f}" ${extra}/>`;
  const S = (d, c, w, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const E = (x, y, rx, ry, f, extra = "") => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${extra}/>`;
  function rnd(seed) { let s = 0; for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  /* —— 材质：每幅肖像一个上下文，按需登记渐变并返回 url(#…) —— */
  function ctx(u) {
    const D = []; let n = 0; const id = () => u + "g" + n++;
    const lin = (stops, x1 = 0, y1 = 0, x2 = 1, y2 = 0.35) => { const i = id(); D.push(`<linearGradient id="${i}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`); return `url(#${i})`; };
    const rad = (stops, cx = 0.38, cy = 0.3, r = 0.8) => { const i = id(); D.push(`<radialGradient id="${i}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</radialGradient>`); return `url(#${i})`; };
    return {
      D, id,
      skin: (c) => rad([[0, hi(c, 0.12)], [0.42, c], [1, sh(c, 0.44)]]),
      cloth: (c) => lin([[0, hi(c, 0.2)], [0.42, c], [1, sh(c, 0.42)]]),
      metal: (c) => lin([[0, sh(c, 0.45)], [0.2, hi(c, 0.45)], [0.36, c], [0.6, sh(c, 0.5)], [0.78, hi(c, 0.25)], [1, sh(c, 0.6)]], 0, 0, 1, 0.5),
      hair: (c) => lin([[0, hi(c, 0.22)], [0.4, c], [1, sh(c, 0.45)]], 0.2, 0, 0.6, 1),
      gem: (c) => rad([[0, lt(c, 0.7)], [0.4, c], [1, dk(c, 0.55)]], 0.35, 0.3, 0.7),
      gold: () => lin([[0, "#6a4a12"], [0.25, "#f3d77a"], [0.5, "#c99a2e"], [0.75, "#f6e3a0"], [1, "#7a5a16"]], 0, 0, 1, 0.6),
      iris: (c) => rad([[0, lt(c, 0.45)], [0.6, c], [1, dk(c, 0.6)]], 0.45, 0.4, 0.6),
      soft: (sd = 2.2) => { const i = id(); D.push(`<filter id="${i}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); return `filter="url(#${i})"`; }
    };
  }
  // 布料褶皱：一组深浅相间的曲线
  function folds(paths, c, w = 1.6) { return paths.map((d) => S(d, sh(c, 0.5), w, 'opacity=".5"') + S(d, hi(c, 0.45), w * 0.6, 'opacity=".45" transform="translate(2.2,0)"')).join(""); }

  /* —— 场景 —— */
  const SCENE = {
    shire: ["frodo", "sam", "merry", "pippin", "bilbo", "marcho"],
    cave: ["gollum"],
    aman: ["finwe", "feanor", "fingolfin"],
    forest: ["thingol", "luthien", "melian", "thranduil", "legolas", "oropher"],
    lorien: ["galadriel"],
    rivendell: ["elrond", "arwen"],
    sea: ["earendil", "elwing", "cirdan", "elros", "pharazon", "elendil", "gilgalad", "tuor", "imrahil"],
    gondolin: ["turgon", "idril"],
    north: ["maedhros", "fingon", "hurin", "huor", "beor", "beren", "turin", "finrod"],
    gondor: ["isildur", "anarion", "aragorn", "boromir", "faramir", "denethor"],
    rohan: ["eorl", "theoden", "eomer", "eowyn", "erkenbrand", "gamling"],
    dale: ["bard"],
    wild: ["beorn", "radagast", "tom", "treebeard"],
    dwarf: ["durin", "thrain", "thorin", "gimli", "dain", "azaghal"],
    wizard: ["gandalf", "gandalfw"],
    isengard: ["saruman"],
    mordor: ["sauron", "eye", "witchking", "nazgul", "mouth", "gothmog", "bolg"],
    lair: ["shelob"],
    angband: ["morgoth", "balrog", "glaurung"],
    hoard: ["smaug"],
  };
  const SC = {}; Object.entries(SCENE).forEach(([k, l]) => l.forEach((id) => (SC[id] = k)));
  const RACE_SC = { hob: "shire", elf: "forest", man: "gondor", dwarf: "dwarf", maia: "wizard", dark: "mordor" };
  // 每个场景的轮廓光与空气色
  const RIM = { shire: "#ffe9a0", cave: "#9fd8e8", aman: "#ffffff", forest: "#b8ffd0", lorien: "#fff2a8", rivendell: "#ffe2c0", sea: "#eaf8ff", gondolin: "#ffffff", north: "#ffb080", gondor: "#fff4e0", rohan: "#ffe8a0", dale: "#dce9ff", wild: "#d8ffc0", dwarf: "#ffb060", wizard: "#b8ccff", isengard: "#d0d0d0", mordor: "#ff8a40", lair: "#a8c8d8", angband: "#ff7a30", hoard: "#ffd868" };
  const HAZE = { shire: "#fbeec4", cave: "#0a1418", aman: "#f4f6ff", forest: "#15302a", lorien: "#f0e0a0", rivendell: "#8aa0a8", sea: "#dceef4", gondolin: "#e8f0f8", north: "#2a2028", gondor: "#e8e4dc", rohan: "#f0dca8", dale: "#d8dce4", wild: "#6a8a66", dwarf: "#2a1c16", wizard: "#2a2a4a", isengard: "#4a4a48", mordor: "#2a0c08", lair: "#101018", angband: "#3a1008", hoard: "#4a2c12" };

  function sky(id, a, b, c) { return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".62" stop-color="${b}"/><stop offset="1" stop-color="${c || b}"/></linearGradient>`; }
  function stars(r, n, y1, col = "#fff8e0") { let s = ""; for (let i = 0; i < n; i++) { const x = r() * 200, y = r() * y1, z = 0.4 + r() * 1.1; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${z.toFixed(2)}" fill="${col}" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`; } return s; }
  function hills(y, amp, col, r, n = 5) { let d = `M-5,${y}`; for (let i = 0; i <= n; i++) { const x = (i / n) * 210 - 5; d += ` Q${(x - 210 / n / 2).toFixed(1)},${(y - amp * (0.4 + r())).toFixed(1)} ${x.toFixed(1)},${(y - r() * amp * 0.3).toFixed(1)}`; } return P(d + " L205,260 L-5,260 Z", col); }
  function peaks(y, col, r, n = 6, h = 50, snow) { let s = ""; for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 220 - 10, hh = h * (0.55 + r() * 0.6), w = 26 + r() * 22; s += P(`M${x - w},${y} L${x},${y - hh} L${x + w},${y} Z`, col) + P(`M${x},${y - hh} L${x + w},${y} L${x + w * 0.3},${y} Z`, dk(col, 0.25), 'opacity=".8"'); if (snow) s += P(`M${x - w * 0.28},${y - hh * 0.72} L${x},${y - hh} L${x + w * 0.28},${y - hh * 0.72} L${x + w * 0.1},${y - hh * 0.66} L${x - w * 0.06},${y - hh * 0.74} Z`, snow); } return s; }
  function tree(x, y, h, trunk, leaf, r) { let s = S(`M${x},${y} L${x},${y - h}`, trunk, 2.4); for (let i = 0; i < 5; i++) s += `<circle cx="${(x + (r() - 0.5) * h * 0.5).toFixed(1)}" cy="${(y - h + (r() - 0.3) * h * 0.4).toFixed(1)}" r="${(h * (0.16 + r() * 0.12)).toFixed(1)}" fill="${i % 2 ? dk(leaf, 0.2) : leaf}" opacity=".9"/>`; return s; }
  function tower(x, y, w, h, col, top = "spire") { let s = P(`M${x - w / 2},${y} L${x - w / 2 * 0.8},${y - h} L${x + w / 2 * 0.8},${y - h} L${x + w / 2},${y} Z`, col) + P(`M${x},${y} L${x + w / 2 * 0.8},${y - h} L${x + w / 2},${y} Z`, dk(col, 0.22)); if (top === "spire") s += P(`M${x - w * 0.42},${y - h} L${x},${y - h - w * 1.3} L${x + w * 0.42},${y - h} Z`, col); if (top === "spikes") s += P(`M${x - w * 0.5},${y - h} L${x - w * 0.45},${y - h - w * 0.9} L${x - w * 0.15},${y - h - w * 0.3} L${x},${y - h - w * 1.4} L${x + w * 0.15},${y - h - w * 0.3} L${x + w * 0.45},${y - h - w * 0.9} L${x + w * 0.5},${y - h} Z`, col); return s; }
  function rays(x, y, col, n = 7, op = 0.14) { let s = ""; for (let i = 0; i < n; i++) { const a = -1.2 + (i / (n - 1)) * 1.1 + Math.PI / 2; s += P(`M${x},${y} L${(x + Math.cos(a - 0.05) * 320).toFixed(0)},${(y + Math.sin(a - 0.05) * 320).toFixed(0)} L${(x + Math.cos(a + 0.05) * 320).toFixed(0)},${(y + Math.sin(a + 0.05) * 320).toFixed(0)} Z`, col, `opacity="${op}"`); } return s; }

  function scene(k, u, r) {
    let d = "", g = "";
    switch (k) {
      case "shire":
        d = sky(u + "s", "#f3c97c", "#fbeec4");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/><circle cx="160" cy="58" r="20" fill="#fff4c8" opacity=".9"/><circle cx="160" cy="58" r="40" fill="#fff4c8" opacity=".25"/>` + rays(160, 58, "#fff6d0", 6, 0.12);
        g += hills(150, 40, "#9cb867", r) + hills(175, 30, "#7ea050", r);
        g += `<g transform="translate(26,148)"><path d="M-22,10 Q0,-30 22,10 Z" fill="#6c8c3c"/><circle r="11" cy="2" fill="#2f6a3a" stroke="#6a4a22" stroke-width="2.5"/><circle cx="3" cy="3" r="1.4" fill="#e8c040"/>${S("M-9,2 L9,2 M0,-9 L0,13", "#24502c", 0.8)}${S("M14,-14 l0,-10", "#7a6a5a", 3)}<path d="M14,-26 q-6,-8 2,-14 q-5,-7 4,-12" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/></g>`;
        g += `<g transform="translate(176,160)"><path d="M-20,10 Q0,-26 20,10 Z" fill="#6c8c3c"/><circle r="8" cy="4" fill="#c8a040" stroke="#6a4a22" stroke-width="2"/></g>`;
        for (let i = 0; i < 26; i++) g += `<circle cx="${(r() * 200).toFixed(1)}" cy="${(185 + r() * 60).toFixed(1)}" r="1.6" fill="${["#f0e080", "#f8f8f0", "#e88a8a", "#c8a8e8"][i % 4]}"/>`;
        break;
      case "cave":
        d = `<radialGradient id="${u}s" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#3a4a48"/><stop offset="1" stop-color="#070a0c"/></radialGradient>`;
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>`;
        for (let i = 0; i < 9; i++) { const x = r() * 200, l = 20 + r() * 40; g += P(`M${x - 7},0 L${x},${l} L${x + 7},0 Z`, "#1a2224"); }
        g += `<ellipse cx="100" cy="230" rx="120" ry="26" fill="#0e1a20"/><ellipse cx="100" cy="228" rx="80" ry="10" fill="#4a7a8a" opacity=".25"/><circle cx="40" cy="222" r="3" fill="#cfe8ef" opacity=".5"/>`;
        break;
      case "aman":
        d = sky(u + "s", "#fff3c0", "#d6e6f2", "#e8f0f4");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/><circle cx="34" cy="70" r="40" fill="#f8e070" opacity=".35"/><circle cx="166" cy="70" r="40" fill="#e8f0ff" opacity=".55"/>` + rays(34, 70, "#fff6c0", 7, 0.1) + rays(166, 70, "#ffffff", 7, 0.1);
        g += tree(34, 150, 70, "#9a8a6a", "#f8d860", r) + tree(166, 150, 70, "#b8c0c8", "#e0ecff", r);
        g += P("M60,170 Q100,110 140,170 Z", "#d8dce4") + tower(100, 128, 8, 26, "#f4f6fa") + tower(86, 140, 7, 14, "#eef0f4") + tower(114, 140, 7, 14, "#eef0f4");
        g += hills(178, 18, "#c8d4b0", r);
        break;
      case "forest":
        d = sky(u + "s", "#0e1c36", "#2a4a5a", "#1c3428");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + stars(r, 50, 120) + `<path d="M156,36 a14,14 0 1 0 8,24 a11,11 0 1 1 -8,-24 z" fill="#f4f0d8"/>`;
        for (let i = 0; i < 8; i++) { const x = 6 + i * 27 + r() * 8, w = 4 + r() * 3; g += P(`M${x - w},250 L${x - w * 0.6},${20 + r() * 40} L${x + w * 0.6},${20 + r() * 40} L${x + w},250 Z`, i % 2 ? "#4a5e66" : "#6a7c80", 'opacity=".75"'); }
        for (let i = 0; i < 30; i++) g += `<circle cx="${(r() * 200).toFixed(1)}" cy="${(r() * 140).toFixed(1)}" r="${(3 + r() * 6).toFixed(1)}" fill="#2a5040" opacity=".55"/>`;
        g += rays(156, 36, "#c8e8d8", 5, 0.07);
        for (let i = 0; i < 12; i++) g += `<circle cx="${(r() * 200).toFixed(1)}" cy="${(90 + r() * 140).toFixed(1)}" r="1.2" fill="#d8ffb0" opacity=".85"/>`;
        break;
      case "lorien":
        d = sky(u + "s", "#f8e8a8", "#c8d088", "#6a8a4a");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + rays(100, -20, "#fff8d0", 8, 0.13);
        for (let i = 0; i < 6; i++) { const x = 10 + i * 36 + r() * 8; g += P(`M${x - 6},250 L${x - 3},0 L${x + 3},0 L${x + 6},250 Z`, "#d8d8c8") + P(`M${x},250 L${x + 3},0 L${x + 6},250 Z`, "#b8b8a8") + S(`M${x - 2},${60 + i * 9} Q${x + 8},${50 + i * 9} ${x + 20},${56 + i * 9}`, "#c8c8b8", 2); }
        for (let i = 0; i < 70; i++) g += `<ellipse cx="${(r() * 200).toFixed(1)}" cy="${(r() * 130).toFixed(1)}" rx="3" ry="1.4" fill="${r() > 0.5 ? "#e8b830" : "#f6d860"}" transform="rotate(${(r() * 180).toFixed(0)} 0 0)" opacity=".8"/>`;
        g += `<ellipse cx="100" cy="186" rx="80" ry="10" fill="#fff8d0" opacity=".25"/>`;
        break;
      case "rivendell":
        d = sky(u + "s", "#e8c8a0", "#9ab0b8", "#5a7a6a");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + P("M-5,250 L-5,40 Q30,60 46,130 L56,250 Z", "#6a7a6a") + P("M205,250 L205,30 Q170,60 156,130 L146,250 Z", "#5a6a5a");
        g += `<path d="M30,60 Q34,120 40,170" stroke="#eef6ff" stroke-width="4" fill="none" opacity=".75"/><path d="M172,50 Q168,120 160,170" stroke="#eef6ff" stroke-width="5" fill="none" opacity=".75"/>`;
        g += `<g fill="#e8e0d0" stroke="#8a7a6a" stroke-width=".6"><path d="M50,170 L50,150 L62,140 L74,150 L74,170 Z"/><path d="M126,170 L126,146 L140,134 L154,146 L154,170 Z"/></g>` + hills(190, 20, "#4a6a4a", r);
        break;
      case "sea":
        d = sky(u + "s", "#9ec8e8", "#e8f0f0", "#3a6a8a");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/><circle cx="150" cy="52" r="10" fill="#fff8d8"/><path d="M146,32 l4,-10 l4,10 l10,4 l-10,4 l-4,10 l-4,-10 l-10,-4 z" fill="#fff" opacity=".85"/>` + rays(150, 52, "#ffffff", 6, 0.1);
        g += `<rect y="150" width="200" height="100" fill="#3a6a8a"/><rect y="150" width="200" height="30" fill="#5a8aa8" opacity=".6"/>`;
        for (let i = 0; i < 9; i++) g += S(`M${-10 + r() * 30},${158 + i * 10} q8,-5 16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0`, "#bcd8e8", 1, 'opacity=".55"');
        g += `<g transform="translate(36,150)"><path d="M-14,0 L14,0 L10,7 L-10,7 Z" fill="#e8e0d0"/><path d="M0,-2 L0,-30 L-12,-6 Z" fill="#f8f8f0"/><path d="M1,-28 L13,-6 L1,-4 Z" fill="#e8ecf0"/><path d="M14,0 q4,-4 6,-8" stroke="#e8e0d0" stroke-width="1.6" fill="none"/></g>`;
        g += `<g transform="translate(176,146)"><path d="M-6,0 L6,0 L4,3 L-4,3 Z" fill="#e8e0d0"/><path d="M0,-1 L0,-14 L-6,-2 Z" fill="#f8f8f0"/></g>`;
        break;
      case "gondolin":
        d = sky(u + "s", "#a8c8e8", "#e8f0f8");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + peaks(170, "#8a98a8", r, 7, 90, "#f4f8ff");
        g += P("M40,175 Q100,130 160,175 Z", "#c8d4b8") + tower(100, 140, 10, 34, "#ffffff") + tower(80, 150, 8, 18, "#f4f6fa") + tower(120, 150, 8, 18, "#f4f6fa") + tower(64, 160, 6, 10, "#eef0f4", "") + tower(136, 160, 6, 10, "#eef0f4", "");
        g += hills(190, 14, "#9ab088", r);
        break;
      case "north":
        d = sky(u + "s", "#2a2030", "#8a4a3a", "#3a3430");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + peaks(160, "#1e1a1e", r, 5, 110);
        g += P("M80,160 L92,40 L100,20 L108,40 L120,160 Z", "#151215") + `<ellipse cx="100" cy="26" rx="22" ry="8" fill="#5a4a4a" opacity=".55"/><ellipse cx="88" cy="12" rx="26" ry="9" fill="#4a3a3a" opacity=".45"/>`;
        for (let i = 0; i < 18; i++) g += `<circle cx="${(r() * 200).toFixed(1)}" cy="${(80 + r() * 150).toFixed(1)}" r="${(0.8 + r()).toFixed(1)}" fill="#ffb060" opacity=".7"/>`;
        g += hills(186, 20, "#3a3a30", r) + `<g transform="translate(30,170)">${S("M0,0 L0,-46", "#4a3a2a", 1.6)}<path d="M0,-46 L26,-40 L0,-32 Z" fill="#2a4a8a"/><circle cx="9" cy="-39" r="2.5" fill="#e8d080"/></g>`;
        break;
      case "gondor":
        d = sky(u + "s", "#c8d8e8", "#f0e8d8");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + peaks(170, "#9aa0a8", r, 6, 80, "#f8f8fc");
        g += `<g fill="#f4f2ec" stroke="#b8b0a0" stroke-width=".7">`;
        for (let i = 0; i < 5; i++) g += `<rect x="${130 + i * 5}" y="${170 - (i + 1) * 9}" width="${70 - i * 10}" height="9"/>`;
        g += `</g>` + P("M177,125 L179,98 L181,125 Z", "#ffffff") + hills(192, 18, "#8a9a6a", r);
        g += `<g transform="translate(24,190)">${S("M0,0 L0,-64", "#5a4a3a", 1.6)}<path d="M0,-64 L0,-26 L22,-30 L22,-60 Z" fill="#1a1a1a"/><g transform="translate(11,-44)">${S("M0,8 L0,-8 M-6,-2 L0,-8 L6,-2 M-5,3 L0,-2 L5,3", "#f0f0f0", 1.1)}<circle cy="-11" r="1" fill="#fff"/><circle cx="-4" cy="-10" r=".8" fill="#fff"/><circle cx="4" cy="-10" r=".8" fill="#fff"/></g></g>`;
        break;
      case "rohan":
        d = sky(u + "s", "#a8c0d8", "#f6e2b0");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + rays(40, 10, "#fff2c0", 6, 0.1) + peaks(150, "#a8b0b8", r, 7, 50, "#f4f8ff") + hills(168, 22, "#c8b060", r) + hills(200, 16, "#b09a48", r);
        g += `<g transform="translate(160,152)"><path d="M-18,6 Q0,-22 18,6 Z" fill="#9a8a48"/><path d="M-10,-6 L0,-14 L10,-6 L10,0 L-10,0 Z" fill="#e8b830" stroke="#7a5a1a" stroke-width=".6"/></g>`;
        g += `<g transform="translate(30,200)">${S("M0,0 L0,-70", "#5a4a3a", 1.6)}<path d="M0,-70 L28,-66 L28,-38 L0,-42 Z" fill="#2e6a3a"/><path d="M8,-46 l4,-12 l4,6 l4,-6 l-2,12 z" fill="#f4f0e8"/></g>`;
        for (let i = 0; i < 20; i++) { const x = r() * 200, y = 190 + r() * 55; g += S(`M${x},${y} l-2,-7 M${x},${y} l2,-8`, "#8a7a30", 0.8); }
        break;
      case "dale":
        d = sky(u + "s", "#b8c8d8", "#e8dcc8");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + P("M30,150 L100,40 L170,150 Z", "#8a8a8a") + P("M100,40 L170,150 L120,150 Z", "#6a6a6a") + P("M86,62 L100,40 L114,62 L106,58 L100,64 Z", "#f4f6fa");
        g += `<rect y="150" width="200" height="100" fill="#6a8aa0"/>`;
        for (let i = 0; i < 6; i++) g += S(`M${r() * 160},${160 + i * 14} h${20 + r() * 30}`, "#c8dae8", 1, 'opacity=".6"');
        g += `<g fill="#8a6a4a" stroke="#4a3a2a" stroke-width=".6">${[20, 44, 150, 174].map((x) => `<path d="M${x - 10},176 L${x - 10},162 L${x},154 L${x + 10},162 L${x + 10},176 Z"/>`).join("")}</g>` + S("M0,178 L200,178", "#4a3a2a", 1.4);
        break;
      case "wild":
        d = sky(u + "s", "#c8e0d0", "#8ab080", "#3a5a3a");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + peaks(130, "#7a9088", r, 5, 60, "#e8f0f0") + rays(30, 0, "#f0ffe0", 6, 0.1);
        for (let i = 0; i < 9; i++) g += tree(r() * 200, 160 + r() * 80, 50 + r() * 50, "#5a4028", r() > 0.5 ? "#3a6a3a" : "#4a7a3a", r);
        for (let i = 0; i < 5; i++) { const x = 20 + r() * 160, y = 40 + r() * 40; g += S(`M${x - 4},${y} q4,-3 4,0 q0,-3 4,0`, "#2a2a2a", 0.8); }
        break;
      case "dwarf":
        d = `<radialGradient id="${u}s" cx=".5" cy=".95" r=".9"><stop offset="0" stop-color="#e88a3a"/><stop offset=".35" stop-color="#5a3a2a"/><stop offset="1" stop-color="#1a1416"/></radialGradient>`;
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>`;
        for (const x of [18, 182]) g += `<rect x="${x - 10}" y="0" width="20" height="250" fill="#3a3234"/><rect x="${x - 4}" y="0" width="6" height="250" fill="#524a4c"/><rect x="${x - 14}" y="40" width="28" height="8" fill="#4a4244"/><rect x="${x - 14}" y="200" width="28" height="8" fill="#4a4244"/>` + S(`M${x - 4},70 L${x + 4},84 L${x - 4},98 M${x},110 l0,20 m-5,-14 l10,0`, "#c8a050", 1, 'opacity=".6"');
        g += S("M30,250 L30,60 Q100,-10 170,60 L170,250", "#4a4244", 6) + S("M40,250 L40,66 Q100,8 160,66 L160,250", "#2a2426", 2);
        for (let i = 0; i < 14; i++) g += `<circle cx="${(60 + r() * 80).toFixed(1)}" cy="${(170 + r() * 70).toFixed(1)}" r="${(0.7 + r()).toFixed(1)}" fill="#ffd080"/>`;
        break;
      case "wizard":
        d = sky(u + "s", "#141a3a", "#3a3a6a", "#5a4a6a");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + stars(r, 70, 170) + S("M-10,70 Q60,30 120,60 T220,40", "#7ae0c0", 10, 'opacity=".18"') + S("M-10,90 Q70,50 130,80 T220,60", "#a08ae8", 8, 'opacity=".15"');
        g += peaks(190, "#22223a", r, 5, 60) + hills(205, 10, "#1a1a2a", r);
        break;
      case "isengard":
        d = sky(u + "s", "#3a3a40", "#8a8478", "#2a2a2a");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + peaks(170, "#3a3a3e", r, 6, 60);
        g += P("M146,175 L148,40 L140,20 L152,30 L156,12 L160,30 L172,20 L164,40 L166,175 Z", "#151515") + `<circle cx="156" cy="90" r="2" fill="#e05030"/>`;
        for (let i = 0; i < 5; i++) g += `<ellipse cx="${(30 + r() * 140).toFixed(0)}" cy="${(140 + r() * 30).toFixed(0)}" rx="${(10 + r() * 14).toFixed(0)}" ry="5" fill="#5a5a5a" opacity=".5"/>`;
        g += hills(195, 10, "#2a2826", r);
        break;
      case "mordor":
        d = sky(u + "s", "#140808", "#6a1a10", "#2a0e0a");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + peaks(170, "#1a0e0c", r, 6, 70);
        g += tower(158, 172, 22, 120, "#0c0606", "spikes") + `<ellipse cx="158" cy="38" rx="9" ry="5" fill="#ff6a1a"/><ellipse cx="158" cy="38" rx="2" ry="4.5" fill="#1a0400"/><ellipse cx="158" cy="38" rx="18" ry="10" fill="#ff4a10" opacity=".25"/>`;
        g += P("M18,175 L46,110 L74,175 Z", "#140a08") + `<path d="M46,110 q-6,-14 4,-22 q-8,-10 6,-18" fill="none" stroke="#6a4a40" stroke-width="5" opacity=".5"/><path d="M40,116 L46,110 L52,116" fill="#ff7020"/>`;
        for (let i = 0; i < 24; i++) g += `<circle cx="${(r() * 200).toFixed(1)}" cy="${(r() * 240).toFixed(1)}" r="${(0.6 + r()).toFixed(1)}" fill="#ff9040" opacity="${(0.4 + r() * 0.5).toFixed(2)}"/>`;
        break;
      case "lair":
        d = `<radialGradient id="${u}s" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#2a2a3a"/><stop offset="1" stop-color="#050508"/></radialGradient>`;
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>`;
        for (let i = 0; i < 14; i++) { const a = r() * 6.28, x = 100 + Math.cos(a) * 140, y = 110 + Math.sin(a) * 140; g += S(`M100,110 L${x.toFixed(0)},${y.toFixed(0)}`, "#c8c8d8", 0.4, 'opacity=".4"'); }
        for (let k = 1; k < 7; k++) { let d2 = ""; for (let i = 0; i <= 14; i++) { const a = (i / 14) * 6.28, rr = k * 20 + (i % 2) * 3; d2 += (i ? "L" : "M") + (100 + Math.cos(a) * rr).toFixed(0) + "," + (110 + Math.sin(a) * rr).toFixed(0); } g += S(d2, "#c8c8d8", 0.4, 'opacity=".35"'); }
        break;
      case "angband":
        d = sky(u + "s", "#0a0606", "#3a0a08", "#7a2a10");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>`;
        g += P("M20,200 L50,60 L64,90 L80,20 L96,80 L110,40 L130,110 L150,50 L184,200 Z", "#0e0808") + `<ellipse cx="100" cy="30" rx="90" ry="18" fill="#2a1a1a" opacity=".7"/>`;
        g += `<rect y="200" width="200" height="50" fill="#ff5a10" opacity=".35"/>`;
        for (let i = 0; i < 30; i++) g += `<circle cx="${(r() * 200).toFixed(1)}" cy="${(120 + r() * 130).toFixed(1)}" r="${(0.7 + r() * 1.3).toFixed(1)}" fill="#ffa040" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`;
        break;
      case "hoard":
        d = `<radialGradient id="${u}s" cx=".5" cy=".9" r=".9"><stop offset="0" stop-color="#e8a838"/><stop offset=".45" stop-color="#5a3a1a"/><stop offset="1" stop-color="#140c08"/></radialGradient>`;
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>`;
        for (let i = 0; i < 140; i++) { const x = r() * 200, y = 170 + r() * 80 - Math.abs(x - 100) * -0.1; g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.2 + r() * 2.2).toFixed(1)}" fill="${r() > 0.3 ? "#f0c040" : "#c08020"}" stroke="#8a5a10" stroke-width=".3"/>`; }
        g += `<g transform="translate(36,186)"><path d="M-8,0 L8,0 L6,-10 L-6,-10 Z" fill="#e0b030" stroke="#7a5010" stroke-width=".6"/><ellipse cy="-10" rx="7" ry="2" fill="#f8d860"/></g><circle cx="166" cy="200" r="5" fill="#fff8e8" opacity=".9"/><circle cx="166" cy="200" r="11" fill="#fff" opacity=".2"/>`;
        break;
    }
    return { defs: d, g };
  }

  /* —— 人像各部分 —— */
  const EYE = { elf: "#3a6aa0", hob: "#5a7a3a", man: "#5a4a2a", dwarf: "#4a3420", maia: "#4a5a7a", dark: "#c02010" };
  function hairBack(L, h, X) {
    if (L.hs === "long" || L.hs === "longs") {
      const f = X.hair(h);
      return P("M66,112 C60,72 82,58 100,58 C118,58 140,72 134,112 C138,150 142,190 150,236 L50,236 C58,190 62,150 66,112 Z", f) +
        S("M72,130 C70,170 66,200 62,230 M128,130 C130,170 134,200 138,230 M80,140 C78,180 76,205 72,232 M120,140 C122,180 124,205 128,232", sh(h, 0.5), 1.1, 'opacity=".6"') +
        S("M76,136 C74,172 72,200 68,228 M124,136 C126,172 128,200 132,228", hi(h, 0.5), 0.8, 'opacity=".5"');
    }
    return "";
  }
  function hairFront(L, h, X) {
    const hd = sh(h, 0.5), hl = hi(h, 0.55), f = X.hair(h), soft = X.soft(1.6);
    switch (L.hs) {
      case "bald": return P("M70,116 C68,104 70,98 73,96 L75,118 Z", f) + P("M130,116 C132,104 130,98 127,96 L125,118 Z", f);
      case "curly": {
        let s = ""; const pts = [[72, 104], [76, 88], [86, 78], [100, 74], [114, 78], [124, 88], [128, 104], [80, 96], [94, 84], [108, 84], [120, 96], [70, 118], [130, 118]];
        const cg = X.id(); X.D.push(`<radialGradient id="${cg}" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="${hi(h, 0.4)}"/><stop offset=".55" stop-color="${h}"/><stop offset="1" stop-color="${sh(h, 0.55)}"/></radialGradient>`);
        pts.forEach(([x, y], i) => (s += `<circle cx="${x}" cy="${y}" r="${i > 10 ? 7 : 9.5}" fill="url(#${cg})" stroke="${hd}" stroke-width=".6"/>` + S(`M${x - 4},${y + 1} q4,-5 8,0`, hd, 0.8, 'opacity=".7"') + S(`M${x - 3},${y - 3} q2,-2 4,-1`, hl, 0.7, 'opacity=".6"')));
        return s;
      }
      case "long": case "longs":
        return P("M68,118 C62,80 82,64 100,64 C118,64 138,80 132,118 C128,96 118,84 102,82 L100,86 L98,82 C82,84 72,96 68,118 Z", f) + P("M68,108 C62,140 66,176 58,206 L72,202 C76,176 74,140 76,112 Z", f) + P("M132,108 C138,140 134,176 142,206 L128,202 C124,176 126,140 124,112 Z", f) +
          S("M100,66 L100,84 M84,72 C76,82 72,96 70,112 M116,72 C124,82 128,96 130,112 M66,130 C66,160 64,180 62,198 M134,130 C134,160 136,180 138,198 M92,68 C86,76 82,88 80,104 M108,68 C114,76 118,88 120,104", hd, 0.9, 'opacity=".65"') +
          S("M94,70 C88,78 84,90 82,102 M112,70 C118,78 122,90 124,102 M70,128 C70,156 68,176 66,196 M130,128 C130,156 132,176 134,196", hl, 0.8, 'opacity=".55"') +
          E(86, 78, 12, 5, hl, `opacity=".3" ${soft} transform="rotate(-28 86 78)"`);
      default:
        return P("M70,116 C64,82 82,66 100,66 C120,66 138,80 130,116 C126,100 120,92 110,90 C104,96 94,96 88,88 C80,94 74,102 70,116 Z", f) +
          S("M88,72 C84,80 82,86 86,90 M104,70 C110,76 112,84 110,90 M120,78 C124,86 126,96 128,106 M78,82 C74,90 72,100 72,110 M96,69 C94,76 92,82 92,88", hd, 0.9, 'opacity=".65"') +
          S("M82,78 C78,86 76,94 76,104 M100,68 C104,74 106,80 106,86 M114,74 C118,80 120,88 122,96", hl, 0.8, 'opacity=".55"') +
          E(88, 76, 11, 4.5, hl, `opacity=".32" ${soft} transform="rotate(-25 88 76)"`);
    }
  }
  function beard(L, h, X) {
    const c = L.bc || h, cd = sh(c, 0.5), cl = hi(c, 0.5), f = X.hair(c);
    if (L.b === "short") return P("M72,118 C72,146 86,162 100,164 C114,162 128,146 128,118 C122,136 112,142 100,142 C88,142 78,136 72,118 Z", f) +
      S("M80,134 C82,146 90,154 98,158 M120,134 C118,146 110,154 102,158 M88,146 C92,152 96,156 100,158", cd, 0.8, 'opacity=".6"') + S("M84,138 C86,148 92,154 98,156", cl, 0.7, 'opacity=".5"') +
      P("M86,136 Q100,128 114,136 Q108,140 100,138 Q92,140 86,136 Z", f, `stroke="${cd}" stroke-width=".6"`);
    if (L.b === "long" || L.b === "braid") {
      let s = P("M70,116 C68,160 80,200 100,226 C120,200 132,160 130,116 C124,136 112,142 100,142 C88,142 76,136 70,116 Z", f) +
        S("M84,148 C84,176 90,196 96,214 M100,146 L100,222 M116,148 C116,176 110,196 104,214 M76,134 C78,160 84,180 90,200 M124,134 C122,160 116,180 110,200 M92,150 C90,176 94,196 98,212 M108,150 C110,176 106,196 102,212", cd, 0.8, 'opacity=".6"') +
        S("M80,140 C80,166 86,186 92,206 M96,150 C94,176 96,196 99,214 M120,140 C120,166 114,186 108,206", cl, 0.7, 'opacity=".5"');
      s += P("M84,136 Q100,126 116,136 Q122,142 126,150 Q112,138 100,140 Q88,138 74,150 Q78,142 84,136 Z", f, `stroke="${cd}" stroke-width=".6"`);
      if (L.b === "braid") s += [86, 114].map((x) => `${S(`M${x},150 L${x},212`, cd, 6)}${S(`M${x},150 L${x},212`, c, 4.4)}${S(`M${x - 1.6},154 l3.2,6 l-3.2,6 l3.2,6 l-3.2,6 l3.2,6 l-3.2,6 l3.2,6 l-3.2,6`, cd, 0.9, 'opacity=".6"')}${[166, 182, 198].map((y) => `<rect x="${x - 3.6}" y="${y}" width="7.2" height="3" rx="1" fill="${X.gold()}" stroke="#5a3a0a" stroke-width=".4"/>`).join("")}`).join("");
      return s;
    }
    return "";
  }
  function hat(L, X) {
    const hc = L.hc || L.c || "#6a6a6a", hd = sh(hc, 0.5), hl = hi(hc, 0.5), soft = X.soft(1.8);
    switch (L.hat) {
      case "wizard": { const f = X.cloth(hc); return P("M38,92 Q100,74 162,92 Q100,104 38,92 Z", f, `stroke="${hd}" stroke-width="1"`) + P("M70,88 Q86,50 104,24 Q118,4 142,2 Q122,14 116,32 Q112,60 130,88 Z", f, `stroke="${hd}" stroke-width="1"`) + folds(["M100,30 Q96,60 98,84", "M110,40 Q106,64 112,84"], hc, 1.4) + S("M74,84 Q100,90 128,84", hd, 2.6) + S("M76,86 Q100,92 126,86", "#5a4a2a", 1.2, 'opacity=".5"') + E(88, 70, 6, 14, hl, `opacity=".25" ${soft} transform="rotate(-20 88 70)"`); }
      case "tall": { const f = X.cloth(hc); return P("M50,90 Q100,76 150,90 Q100,100 50,90 Z", f) + P("M72,88 L76,30 Q100,22 124,30 L128,88 Z", f, `stroke="${hd}" stroke-width="1"`) + E(84, 58, 5, 22, hl, `opacity=".3" ${soft}`) + `<rect x="74" y="74" width="52" height="8" fill="${X.gold()}" stroke="#5a3a0a" stroke-width=".5"/>` + S("M120,34 Q150,10 140,-6", "#3a8a5a", 3) + S("M126,28 Q144,16 146,4", "#5aa070", 1.4); }
      case "crown": { const f = X.metal(hc); return P("M74,88 L72,60 L82,74 L90,54 L100,70 L110,54 L118,74 L128,60 L126,88 Z", f, `stroke="${hd}" stroke-width="1"`) + S("M76,86 L124,86", hl, 1.2, 'opacity=".7"') + [82, 100, 118].map((x) => `<circle cx="${x}" cy="82" r="2.8" fill="${X.gem(L.gem || "#e04040")}" stroke="${hd}" stroke-width=".4"/><circle cx="${x - 0.8}" cy="81.2" r=".8" fill="#fff" opacity=".9"/>`).join("") + `<circle cx="90" cy="54" r="2" fill="${f}"/><circle cx="110" cy="54" r="2" fill="${f}"/><circle cx="100" cy="70" r="2" fill="#fff" opacity=".6"/>`; }
      case "circlet": return S("M70,98 Q100,86 130,98", X.metal(hc), 2.8) + S("M72,97 Q100,85 128,97", hl, 0.6, 'opacity=".7"') + `<path d="M100,86 l4,6 l-4,6 l-4,-6 z" fill="${X.gem(L.gem || "#bfe8ff")}" stroke="${hd}" stroke-width=".6"/><circle cx="99" cy="90.5" r=".9" fill="#fff"/><circle cx="100" cy="92" r="7" fill="${L.gem || "#bfe8ff"}" opacity=".25"/>`;
      case "helm": { const f = X.metal(hc); return P("M64,118 C60,72 80,58 100,58 C120,58 140,72 136,118 L126,118 L126,100 L74,100 L74,118 Z", f, `stroke="${hd}" stroke-width="1.2"`) + P("M96,98 L104,98 L102,124 L98,124 Z", f, `stroke="${hd}" stroke-width=".8"`) + S("M100,58 L100,98", hd, 1) + S("M98.5,60 L98.5,96", hl, 0.7, 'opacity=".7"') + S("M68,96 Q100,88 132,96", hl, 1.6, 'opacity=".8"') + S("M68,100 Q100,92 132,100", hd, 0.8) + E(84, 74, 8, 4.5, "#fff", `opacity=".3" ${soft} transform="rotate(-30 84 74)"`) + [72, 100, 128].map((x) => `<circle cx="${x}" cy="97" r="1.3" fill="${hl}" stroke="${hd}" stroke-width=".4"/>`).join("") + (L.plume ? P("M100,60 Q76,36 50,58 Q62,44 76,46 Q60,54 54,74 Q72,52 100,64 Z", X.cloth(L.plume)) + S("M96,62 Q74,48 58,56 M92,64 Q72,56 60,70", sh(L.plume, 0.3), 0.8, 'opacity=".5"') : "") + (L.wing ? P("M64,90 Q44,70 46,50 Q56,70 70,80 Z M136,90 Q156,70 154,50 Q144,70 130,80 Z", "#f0f0f0") + S("M60,78 Q50,66 48,56 M140,78 Q150,66 152,56", "#c8c8c8", 0.8) : ""); }
      case "hood": { const f = X.cloth(hc); return P("M58,124 C52,70 78,52 100,52 C122,52 148,70 142,124 C140,100 128,80 100,78 C72,80 60,100 58,124 Z", f, `stroke="${hd}" stroke-width="1"`) + folds(["M64,118 C66,96 76,84 88,80", "M136,118 C134,96 124,84 112,80"], hc, 1.4) + S("M62,118 C66,94 80,82 100,80 C120,82 134,94 138,118", hd, 1.6) + S("M60,118 C64,92 78,78 100,76 C122,78 136,92 140,118", sh(hc, 0.75), 3, `opacity=".45" ${soft}`); }
      case "darkhelm": { const f = X.metal(hc); return P("M62,124 C56,72 78,56 100,56 C122,56 144,72 138,124 L130,140 L124,104 L76,104 L70,140 Z", f, `stroke="#000" stroke-width="1"`) + P("M76,60 L70,34 L84,56 Z M124,60 L130,34 L116,56 Z M96,56 L100,30 L104,56 Z", f, `stroke="#000" stroke-width=".6"`) + P("M76,104 L124,104 L120,112 L80,112 Z", dk(hc, 0.5)) + S("M74,92 L126,92", "#6a6060", 1, 'opacity=".6"') + S("M66,80 Q70,66 82,60", hl, 1, 'opacity=".5"') + [78, 88, 112, 122].map((x) => `<circle cx="${x}" cy="94" r="1.2" fill="#8a8080"/>`).join(""); }
      default: return "";
    }
  }
  function item(L, front, X) {
    const it = L.it, ic = L.ic;
    if (!front) switch (it) {
      case "sword": return P("M34,196 L56,130 L60,132 L40,198 Z", X.metal(ic || "#d8dde2"), `stroke="#3a3a3a" stroke-width=".6"`) + S("M38,194 L58,132", hi(ic || "#d8dde2", 0.6), 0.5, 'opacity=".8"') + S("M44,126 L70,138", X.gold(), 5) + S("M60,126 L66,110", "#3a2412", 4.5) + S("M61,124 L62,121 M62.5,119 L63.5,116 M64,114 L65,111", "#7a5a3a", 1, 'opacity=".7"') + `<circle cx="67" cy="107" r="4" fill="${X.gold()}" stroke="#5a3a0a" stroke-width=".5"/><circle cx="66" cy="106" r="1.2" fill="#fff" opacity=".7"/>`;
      case "bow": return S("M150,30 Q192,120 152,236", "#4a3418", 5) + S("M150,30 Q192,120 152,236", "#8a6a3a", 3) + S("M151,34 Q188,120 153,232", hi("#8a6a3a", 0.5), 0.8, 'opacity=".6"') + S("M150,30 L152,236", "#e8e0c8", 0.8) + S("M34,140 L60,40 M38,140 L66,44 M30,138 L54,40", "#7a5a2a", 1.5) + `<path d="M56,40 l4,-8 l3,9 z M62,44 l5,-8 l2,10 z M50,40 l3,-9 l4,8 z" fill="#e8e8e8" stroke="#666" stroke-width=".3"/>`;
      case "axe": return S("M148,236 L142,60", "#4a3418", 5) + S("M148,236 L142,60", "#7a5a2a", 3.2) + S("M146,230 L141,66", hi("#7a5a2a", 0.4), 0.7, 'opacity=".5"') + P("M140,64 Q176,52 174,96 Q160,84 144,92 Z", X.metal("#c0c6cc"), `stroke="#333" stroke-width="1"`) + S("M146,66 Q166,62 168,84", "#fff", 1, 'opacity=".7"') + S("M172,94 Q160,86 146,90", "#fff", 0.6, 'opacity=".5"');
      case "spear": return S("M156,250 L156,26", "#4a3418", 4) + S("M156,250 L156,26", "#7a5a2a", 2.6) + S("M155,246 L155,30", hi("#7a5a2a", 0.4), 0.7, 'opacity=".5"') + P("M156,0 L163,28 L149,28 Z", X.metal(ic || "#d8dde2"), `stroke="#444" stroke-width=".6"`) + S("M156,2 L156,26", "#fff", 0.6, 'opacity=".7"') + P("M151,32 L161,32 L156,42 Z", "#8a2a1a") + `<rect x="152" y="27" width="8" height="4" fill="${X.gold()}"/>`;
      case "staff": return S("M160,250 L160,40", "#3a2412", 6) + S("M160,250 L160,40", "#6a4a2a", 4.4) + S("M159,246 Q157,180 159,120 Q161,80 159,44", hi("#6a4a2a", 0.4), 0.9, 'opacity=".55"') + S("M160,40 Q148,28 156,16 Q168,20 166,34 Q162,30 160,40", "#6a4a2a", 3) + `<circle cx="158" cy="28" r="7" fill="${X.gem(ic || "#ddd")}"/><circle cx="156" cy="26" r="2" fill="#fff" opacity=".85"/><circle cx="158" cy="28" r="16" fill="${ic || "#fff"}" opacity=".25"/><circle cx="158" cy="28" r="26" fill="${ic || "#fff"}" opacity=".1"/>`;
      case "pack": return P("M30,250 L36,180 Q40,170 60,172 L60,250 Z", X.cloth("#8a6a3a"), `stroke="${INK}" stroke-width=".8"`) + `<ellipse cx="44" cy="174" rx="18" ry="6" fill="#6a8a4a"/>` + S("M38,200 L58,202 M36,222 L58,224", "#5a4020", 1.2, 'opacity=".6"') + `<rect x="46" y="196" width="4" height="8" rx="1" fill="${X.gold()}"/>`;
      case "harp": return P("M148,250 L150,170 Q172,150 182,176 L172,250 Z", "none", `stroke="${X.gold()}" stroke-width="4"`) + S("M150,172 Q170,154 180,176", hi("#c8a040", 0.5), 1, 'opacity=".7"') + S("M156,180 L156,250 M162,174 L162,250 M168,170 L168,250 M174,176 L174,250", "#f0e8c0", 0.6);
      default: return "";
    }
    switch (it) {
      case "star": return `<circle cx="100" cy="222" r="26" fill="${ic || "#fffbe0"}" opacity=".25"/><circle cx="100" cy="222" r="14" fill="${ic || "#fffbe0"}" opacity=".45"/><path d="M100,208 L104,218 L114,222 L104,226 L100,236 L96,226 L86,222 L96,218 Z" fill="#fff"/>` + P("M74,250 Q76,226 90,224 L94,236 L82,250 Z M126,250 Q124,226 110,224 L106,236 L118,250 Z", X.skin(L.s || "#f4d6b8"), `stroke="${sh(L.s || "#f4d6b8", 0.4)}" stroke-width=".6"`);
      case "pipe": return S("M108,142 L130,150", "#4a3018", 3.4) + S("M108,142 L130,150", "#7a5030", 2) + P("M128,140 L138,140 L137,154 L129,154 Z", "#5a3a1a") + S("M130,142 L130,152", hi("#5a3a1a", 0.4), 0.8, 'opacity=".6"') + `<g fill="none" stroke="#e8e8e8" stroke-width="2" opacity=".55"><circle cx="140" cy="124" r="5"/><circle cx="148" cy="106" r="7"/><circle cx="160" cy="84" r="9"/></g>`;
      case "shield": { const sc = ic || "#7a2a1a"; return `<circle cx="56" cy="214" r="34" fill="${X.metal("#c8ccd2")}" stroke="#3a3a3a" stroke-width="1"/><circle cx="56" cy="214" r="29" fill="${X.cloth(sc)}" stroke="${sh(sc, 0.5)}" stroke-width="1"/><circle cx="56" cy="214" r="8" fill="${X.metal("#d8dde2")}" stroke="#444" stroke-width=".6"/><circle cx="54" cy="212" r="2.4" fill="#fff" opacity=".7"/><circle cx="56" cy="214" r="22" fill="none" stroke="${X.gold()}" stroke-width="1.6"/>` + [0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${(56 + Math.cos(a * Math.PI / 180) * 31.5).toFixed(1)}" cy="${(214 + Math.sin(a * Math.PI / 180) * 31.5).toFixed(1)}" r="1.2" fill="#eee"/>`).join(""); }
      case "ring": return S("M86,176 Q100,206 114,176", "#c8a040", 0.9) + `<circle cx="100" cy="204" r="9" fill="#ffe080" opacity=".3"/><circle cx="100" cy="204" r="4.6" fill="none" stroke="${X.gold()}" stroke-width="2.4"/>`;
      case "pack": return S("M76,180 L70,250 M124,180 L130,250", "#4a3018", 5) + S("M76,180 L70,250 M124,180 L130,250", "#6a4a2a", 3.2) + `<rect x="70" y="208" width="8" height="5" rx="1" fill="${X.gold()}"/>`;
      default: return "";
    }
  }
  function body(L, k, X) {
    const c = L.c || "#6b4a2a", t = L.t || "#c8b48a", s = L.s || "#f4d6b8";
    const W = L.wide ? 88 : k === "hob" ? 70 : 76, cd = sh(c, 0.55), armor = L.hat === "helm" || L.hat === "darkhelm", soft = X.soft(2.4), softB = X.soft(3.5);
    const cf = X.cloth(c);
    // 脖子
    let o = P("M86,146 L114,146 L116,178 Q100,188 84,178 Z", X.skin(s)) + P("M86,146 Q100,164 114,146 L114,162 Q100,170 86,162 Z", sh(s, 0.5), `opacity=".55" ${soft}`) + S("M107,152 Q109,166 107,176", hi(s, 0.4), 1.2, 'opacity=".5"') + S("M94,152 Q93,166 94,176", hi(s, 0.3), 0.9, 'opacity=".35"');
    // 斗篷/外衣
    o += P(`M${100 - W},252 C${100 - W},206 ${100 - W + 16},184 76,176 L124,176 C${100 + W - 16},184 ${100 + W},206 ${100 + W},252 Z`, cf, `stroke="${cd}" stroke-width="1.2"`);
    o += folds([`M${100 - W + 14},250 C${100 - W + 16},226 ${100 - W + 22},206 ${100 - W + 34},194`, `M${100 + W - 14},250 C${100 + W - 16},226 ${100 + W - 22},206 ${100 + W - 34},194`, `M${100 - W + 30},252 C${100 - W + 30},230 ${100 - W + 34},212 ${100 - W + 44},200`, `M${100 + W - 30},252 C${100 + W - 30},230 ${100 + W - 34},212 ${100 + W - 44},200`, `M${100 - W + 4},250 C${100 - W + 4},234 ${100 - W + 8},220 ${100 - W + 20},206`], c, 1.6);
    o += E(100 - W + 30, 200, 16, 9, hi(c, 0.5), `opacity=".35" ${softB} transform="rotate(-35 ${100 - W + 30} 200)"`); // 左肩受光
    o += P(`M${100 + W - 40},190 C${100 + W - 20},200 ${100 + W - 6},222 ${100 + W - 4},252 L${100 + W},252 L${100 + W},206 Z`, sh(c, 0.6), `opacity=".4" ${softB}`); // 右侧暗
    // 内衣 / 胸甲
    if (armor) {
      const mc = L.hc || "#9aa0a8", mf = X.metal(mc);
      const pat = X.id(); X.D.push(`<pattern id="${pat}" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="${dk(mc, 0.45)}"/><path d="M0,3 q1.5,-2.5 3,0 q1.5,2.5 3,0" fill="none" stroke="${lt(mc, 0.25)}" stroke-width=".7"/><path d="M0,6 q1.5,-2.5 3,0 q1.5,2.5 3,0" fill="none" stroke="${lt(mc, 0.1)}" stroke-width=".7"/></pattern>`);
      o += P("M80,176 L100,236 L120,176 Z", `url(#${pat})`, `stroke="${dk(mc, 0.6)}" stroke-width=".8"`); // 锁子甲
      o += P("M84,186 L100,232 L116,186 Q100,194 84,186 Z", mf, `stroke="${dk(mc, 0.6)}" stroke-width=".8"`) + S("M100,194 L100,228", hi(mc, 0.6), 1, 'opacity=".7"') + S("M88,192 Q100,200 112,192", hi(mc, 0.5), 0.8, 'opacity=".6"') + [90, 100, 110].map((x) => `<circle cx="${x}" cy="${196 + Math.abs(x - 100) * -0.3 + 2}" r="1" fill="${hi(mc, 0.6)}"/>`).join("");
      // 肩甲
      const pl = (sx) => { const a = sx > 0 ? 100 + W - 4 : 100 - W + 4, b = sx > 0 ? 100 + W - 24 : 100 - W + 24, cc = sx > 0 ? 124 : 76, dd = sx > 0 ? 118 : 82, ee = sx > 0 ? 130 : 70, ff = sx > 0 ? 100 + W - 16 : 100 - W + 16;
        return P(`M${a},214 C${a},192 ${b},178 ${cc},178 L${dd},198 C${ee},200 ${ff},206 ${a},214 Z`, mf, `stroke="${dk(mc, 0.6)}" stroke-width=".9"`) + P(`M${a},210 C${a},198 ${b + (sx > 0 ? -2 : 2)},188 ${cc + (sx > 0 ? -4 : 4)},186`, "none", `stroke="${hi(mc, 0.6)}" stroke-width="1.1" opacity=".6"`) + P(`M${a},214 C${a},204 ${b},196 ${dd},198`, "none", `stroke="${dk(mc, 0.5)}" stroke-width=".8"`) + [0.3, 0.6].map((q) => `<circle cx="${(a + (cc - a) * q).toFixed(1)}" cy="${(206 - 16 * q).toFixed(1)}" r="1.2" fill="${X.gold()}" stroke="#3a2a0a" stroke-width=".3"/>`).join(""); };
      o += pl(-1) + pl(1);
    } else {
      const tf = X.cloth(t);
      o += P("M80,176 L100,236 L120,176 Z", tf, `stroke="${sh(t, 0.5)}" stroke-width=".8"`) + S("M92,186 L100,204 L108,186", sh(t, 0.45), 0.8, 'opacity=".7"') + S("M100,206 L100,232", sh(t, 0.4), 0.7, 'opacity=".5"');
      // 身份装饰
      if (k === "elf") o += S("M80,176 L100,236 L120,176", X.gold(), 1.4) + S("M84,182 q3,4 0,8 q-3,4 0,8 M116,182 q-3,4 0,8 q3,4 0,8", "#e8d080", 0.7, 'opacity=".8"') + `<path d="M100,232 l-3,-5 l3,-2 l3,2 z" fill="#e8d080"/>`; // 金线绣边
      else if (k === "hob") o += [196, 208, 220].map((y) => `<circle cx="100" cy="${y}" r="1.8" fill="${X.gold()}" stroke="#5a3a0a" stroke-width=".4"/>`).join("") + S("M86,178 Q100,190 114,178", mix(t, "#9a3a2a", 0.5), 3.2) + S("M88,180 Q100,190 112,180", hi(mix(t, "#9a3a2a", 0.5), 0.4), 0.8, 'opacity=".6"'); // 马甲纽扣与围巾
      else if (k === "dwarf") o += S("M82,190 L118,190 M84,200 L116,200", "#5a4020", 3) + S("M82,190 L118,190 M84,200 L116,200", "#7a5a30", 1.8) + `<rect x="96" y="187" width="8" height="6" rx="1" fill="${X.gold()}" stroke="#3a2a0a" stroke-width=".4"/>` + [86, 90, 110, 114].map((x) => `<circle cx="${x}" cy="200" r="1.1" fill="${hi("#8a8a8a", 0.5)}"/>`).join(""); // 皮带与铆钉
      else if (k === "man" || k === "maia") o += S(`M${100 - W + 30},190 L112,236`, "#3a2412", 4.4) + S(`M${100 - W + 30},190 L112,236`, "#5a3a1a", 3) + S(`M${100 - W + 31},189 L111,234`, hi("#5a3a1a", 0.4), 0.7, 'opacity=".5"') + `<rect x="94" y="208" width="7" height="6" rx="1" fill="${X.metal("#9aa0a8")}" stroke="#333" stroke-width=".4" transform="rotate(50 97 211)"/>`; // 斜挎皮带
    }
    // 领下阴影
    o += E(100, 186, 22, 7, sh(c, 0.7), `opacity=".45" ${softB}`);
    // 领扣 / 胸针
    o += `<circle cx="80" cy="180" r="5.2" fill="${X.gold()}" stroke="#5a3a0a" stroke-width=".8"/><circle cx="120" cy="180" r="5.2" fill="${X.gold()}" stroke="#5a3a0a" stroke-width=".8"/><circle cx="78.6" cy="178.6" r="1.4" fill="#fff" opacity=".75"/><circle cx="118.6" cy="178.6" r="1.4" fill="#fff" opacity=".75"/>` + S("M85,180 Q100,186 115,180", X.gold(), 1.4) + S("M85,179.4 Q100,185.4 115,179.4", "#f6e3a0", 0.4, 'opacity=".7"');
    if (k === "elf") o += `<path d="M80,174 q-3,6 0,12 q3,-6 0,-12z" fill="#7ab060" stroke="#3a6a2a" stroke-width=".6"/><path d="M80,176 q-1.5,4 0,8" fill="none" stroke="#c8f0a0" stroke-width=".5"/>`;
    return o;
  }
  function head(L, k, X) {
    const s = L.s || "#f4d6b8", sd = sh(s, 0.4), h = L.h || "#4a3a2a", eye = L.eye || EYE[k] || "#4a3a2a";
    const fw = k === "hob" ? 30 : L.wide || k === "dwarf" ? 30 : k === "elf" ? 25 : 27, chin = k === "elf" ? 154 : k === "hob" ? 151 : 156;
    const sf = X.skin(s), soft = X.soft(2.2), soft2 = X.soft(1.3);
    let o = "";
    // 耳
    if (L.ear && k !== "hob") o += P(`M${100 - fw + 2},108 Q${100 - fw - 14},94 ${100 - fw - 18},80 Q${100 - fw - 8},104 ${100 - fw + 2},124 Z`, sf, `stroke="${sd}" stroke-width=".9"`) + P(`M${100 + fw - 2},108 Q${100 + fw + 14},94 ${100 + fw + 18},80 Q${100 + fw + 8},104 ${100 + fw - 2},124 Z`, sf, `stroke="${sd}" stroke-width=".9"`) + S(`M${100 - fw - 2},110 Q${100 - fw - 10},98 ${100 - fw - 12},88 M${100 + fw + 2},110 Q${100 + fw + 10},98 ${100 + fw + 12},88`, sd, 0.8, 'opacity=".6"');
    else if (L.ear) o += P(`M${100 - fw + 2},110 Q${100 - fw - 9},106 ${100 - fw - 9},98 Q${100 - fw - 5},116 ${100 - fw + 2},126 Z`, sf, `stroke="${sd}" stroke-width=".9"`) + P(`M${100 + fw - 2},110 Q${100 + fw + 9},106 ${100 + fw + 9},98 Q${100 + fw + 5},116 ${100 + fw - 2},126 Z`, sf, `stroke="${sd}" stroke-width=".9"`);
    else o += E(100 - fw, 116, 5, 8, sf, `stroke="${sd}" stroke-width=".9"`) + E(100 + fw, 116, 5, 8, sf, `stroke="${sd}" stroke-width=".9"`) + S(`M${100 - fw - 1},112 q-2,4 0,8 M${100 + fw + 1},112 q2,4 0,8`, sd, 0.7, 'opacity=".6"');
    // 脸
    o += P(`M${100 - fw},110 C${100 - fw},84 ${100 - fw + 12},74 100,74 C${100 + fw - 12},74 ${100 + fw},84 ${100 + fw},110 C${100 + fw + 1},130 ${100 + fw - 10},${chin - 3} 100,${chin} C${100 - fw + 10},${chin - 3} ${100 - fw - 1},130 ${100 - fw},110 Z`, sf, `stroke="${sd}" stroke-width=".9"`);
    // 体积：右侧暗部、眼窝、额头与颧骨高光、下巴阴影
    o += P(`M${100 + fw - 10},92 C${100 + fw + 2},110 ${100 + fw - 2},134 ${100 + 6},${chin - 2} C${100 + fw - 6},134 ${100 + fw - 4},118 ${100 + fw - 10},92 Z`, sh(s, 0.55), `opacity=".5" ${soft}`) + P(`M${100 - fw + 2},128 C${100 - fw + 8},${chin - 2} ${100 + fw - 8},${chin - 2} ${100 + fw - 2},128 C${100 + fw - 8},${chin - 10} ${100 - fw + 8},${chin - 10} ${100 - fw + 2},128 Z`, sh(s, 0.5), `opacity=".3" ${soft}`);
    o += E(84, 106, 10, 5, sh(s, 0.5), `opacity=".22" ${soft}`) + E(116, 106, 10, 5, sh(s, 0.5), `opacity=".28" ${soft}`);
    o += E(92, 90, 12, 6, hi(s, 0.55), `opacity=".38" ${soft}`) + E(82, 124, 7, 4, hi(s, 0.5), `opacity=".35" ${soft}`) + E(100, chin - 8, 9, 3, sh(s, 0.5), `opacity=".25" ${soft}`);
    // 眉
    const bc = sh(L.bc && L.b ? L.bc : h, 0.25), ey = 112, bw = k === "dwarf" || L.b ? 3.6 : 2.6;
    if (k === "dark") o += P(`M72,${ey - 15} L94,${ey - 8} L94,${ey - 5} L72,${ey - 11} Z M128,${ey - 15} L106,${ey - 8} L106,${ey - 5} L128,${ey - 11} Z`, "#1a1a1a");
    else o += P(`M${84 - 9},${ey - 9} Q84,${ey - 14 - bw} ${84 + 9},${ey - 9} Q84,${ey - 11 - bw / 2} ${84 - 9},${ey - 9} Z`, bc) + P(`M${116 - 9},${ey - 9} Q116,${ey - 14 - bw} ${116 + 9},${ey - 9} Q116,${ey - 11 - bw / 2} ${116 - 9},${ey - 9} Z`, bc);
    // 眼
    const scl = X.id(); X.D.push(`<linearGradient id="${scl}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8b0a8"/><stop offset=".45" stop-color="#fbf8f0"/></linearGradient>`);
    const ir = X.iris(eye);
    [84, 116].forEach((x) => {
      o += P(`M${x - 6.6},${ey} Q${x},${ey - 5.8} ${x + 6.6},${ey} Q${x},${ey + 4} ${x - 6.6},${ey} Z`, `url(#${scl})`) +
        `<circle cx="${x}" cy="${ey - 0.5}" r="3.2" fill="${ir}"/><circle cx="${x}" cy="${ey - 0.5}" r="1.5" fill="#0c0806"/><circle cx="${x + 1.2}" cy="${ey - 2}" r=".95" fill="#fff"/><circle cx="${x - 1.4}" cy="${ey + 0.8}" r=".5" fill="#fff" opacity=".6"/>` +
        S(`M${x - 7},${ey} Q${x},${ey - 6.8} ${x + 7},${ey}`, INK, 1.4) + S(`M${x - 6},${ey + 0.5} Q${x},${ey + 4.4} ${x + 6.5},${ey + 0.2}`, sh(s, 0.5), 0.6, 'opacity=".7"') +
        S(`M${x - 8.5},${ey - 3} Q${x},${ey - 10} ${x + 9},${ey - 3.5}`, sh(s, 0.4), 0.7, 'opacity=".45"') + S(`M${x + 7},${ey - 1} l2,-1.5 M${x + 5.5},${ey - 2.5} l1.5,-1.5`, INK, 0.8);
    });
    if (L.eye === "#c02010") o += `<circle cx="84" cy="${ey}" r="7" fill="#ff3010" opacity=".25"/><circle cx="116" cy="${ey}" r="7" fill="#ff3010" opacity=".25"/>`;
    // 鼻
    o += P(`M100,${ey + 2} C103,${ey + 10} 106,${ey + 16} 104,${ey + 20} C102,${ey + 22} 98,${ey + 21} 97,${ey + 19} L100,${ey + 14} Z`, sh(s, 0.5), `opacity=".38" ${soft2}`);
    o += S(`M98,${ey + 2} Q97,${ey + 12} 98,${ey + 17}`, hi(s, 0.6), 1.4, `opacity=".45" ${soft2}`);
    o += S(`M100,${ey + 4} Q97,${ey + 16} 100,${ey + 19} Q103,${ey + 20} 106,${ey + 17}`, sh(s, 0.55), 1.1) + S(`M94,${ey + 19} q2,2 4,0.5 M102,${ey + 19.5} q2,1.5 4,-0.5`, sh(s, 0.6), 0.9, 'opacity=".8"') + E(99, ey + 16, 1.6, 1, hi(s, 0.7), 'opacity=".5"');
    // 口
    if (k === "dark") o += S(`M88,${ey + 30} Q100,${ey + 25} 112,${ey + 30}`, "#2a0a0a", 2.4) + `<path d="M90,${ey + 29} l2,-6 l2,5 z M110,${ey + 29} l-2,-6 l-2,5 z" fill="#f0e8c8"/>`;
    else if (!L.b) {
      const lip = mix(s, "#9a3a3a", 0.42), lip2 = mix(s, "#c05050", 0.3);
      o += P(`M92,${ey + 27} Q96,${ey + 24.5} 100,${ey + 26} Q104,${ey + 24.5} 108,${ey + 27} Q100,${ey + 29} 92,${ey + 27} Z`, lip) + P(`M93,${ey + 28} Q100,${ey + 33.5} 107,${ey + 28} Q100,${ey + 30} 93,${ey + 28} Z`, lip2) + S(`M92.5,${ey + 27.2} Q100,${ey + 29.5} 107.5,${ey + 27.2}`, sh(lip, 0.5), 0.8) + E(100, ey + 30.5, 2.2, 0.8, "#fff", 'opacity=".35"') + E(100, ey + 36, 6, 2, sh(s, 0.5), `opacity=".25" ${soft2}`);
      o += E(78, ey + 16, 6, 3.5, "#ff8a7a", `opacity=".2" ${soft}`) + E(122, ey + 16, 6, 3.5, "#ff8a7a", `opacity=".16" ${soft}`);
    } else o += S(`M94,${ey + 27} Q100,${ey + 29} 106,${ey + 27}`, sh(s, 0.6), 1);
    return o;
  }
  function flowers(L) { if (!L.fl) return ""; return [[74, 96], [80, 86], [124, 92]].map(([x, y]) => `<g transform="translate(${x},${y})">${[0, 72, 144, 216, 288].map((a) => `<ellipse rx="2.2" ry="4" cy="-3" fill="#fff" transform="rotate(${a})"/>`).join("")}<circle r="1.6" fill="#f0d040"/></g>`).join(""); }

  function humanoid(c, L, X) {
    const k = c.r, h = L.h || "#4a3a2a";
    let back = item(L, false, X) + hairBack(L, h, X);
    if (L.hat === "hood") back += P("M52,250 L56,130 C52,70 78,50 100,50 C122,50 148,70 144,130 L148,250 Z", X.cloth(dk(L.hc || L.c || "#555", 0.15))) + folds(["M60,240 C60,190 62,150 66,120", "M140,240 C140,190 138,150 134,120"], L.hc || L.c || "#555", 1.6);
    if (L.hat === "wizard" && L.hs !== "long") back += P("M68,104 C64,150 66,190 60,230 L140,230 C134,190 136,150 132,104 Z", X.hair(L.bc || h)) + S("M72,130 C70,170 68,200 64,226 M128,130 C130,170 132,200 136,226", sh(L.bc || h, 0.5), 1, 'opacity=".6"');
    let o = back + `<g transform="translate(0,-5)">${body(L, k, X)}</g>` + head(L, k, X);
    o += hairFront(L, h, X) + beard(L, h, X) + flowers(L) + hat(L, X) + item(L, true, X);
    return o;
  }

  /* —— 特殊造型 —— */
  function special(c, L, u, X) {
    switch (L.sp) {
      case "gollum": { const sk = X.skin("#c8c8b0"); return P("M60,252 C62,210 76,186 100,182 C124,186 138,210 140,252 Z", X.skin("#b8b8a0"), `stroke="#6a6a58" stroke-width="1"`) + S("M86,200 Q100,206 114,200 M84,214 Q100,220 116,214 M82,228 Q100,234 118,228", "#8a8a74", 1) + P("M90,170 L110,170 L112,186 L88,186 Z", sk) +
        P("M58,112 C58,70 78,58 100,58 C122,58 142,70 142,112 C142,146 122,170 100,172 C78,170 58,146 58,112 Z", sk, `stroke="#8a8a74" stroke-width="1.2"`) + P("M58,104 Q38,92 34,74 Q48,96 60,118 Z M142,104 Q162,92 166,74 Q152,96 140,118 Z", X.skin("#c0c0a8"), `stroke="#8a8a74" stroke-width="1"`) +
        P("M124,80 C140,100 138,140 118,166 C132,146 134,110 124,80 Z", "#6a6a58", `opacity=".4" ${X.soft(2.5)}`) + E(90, 86, 14, 7, "#f0f0e0", `opacity=".35" ${X.soft(2.5)}`) +
        `<ellipse cx="80" cy="112" rx="16" ry="14" fill="#e8f0f4"/><ellipse cx="120" cy="112" rx="16" ry="14" fill="#e8f0f4"/><circle cx="82" cy="113" r="9" fill="${X.iris("#5a9ab8")}"/><circle cx="118" cy="113" r="9" fill="${X.iris("#5a9ab8")}"/><circle cx="82" cy="113" r="5" fill="#0a1418"/><circle cx="118" cy="113" r="5" fill="#0a1418"/><circle cx="85" cy="109" r="2.4" fill="#fff"/><circle cx="121" cy="109" r="2.4" fill="#fff"/>` + S("M64,112 Q80,96 96,112 M104,112 Q120,96 136,112", "#8a8a74", 1.4) +
        S("M88,150 Q100,156 112,150", "#5a5a48", 1.6) + `<rect x="94" y="150" width="4" height="4" fill="#f4f0d8"/><rect x="103" y="150" width="4" height="4" fill="#f4f0d8"/>` + S("M90,62 Q84,50 80,46 M100,58 Q102,46 98,40 M110,62 Q116,52 124,50 M94,60 Q92,50 88,44", "#3a3a30", 1); }
      case "wraith": { const cf = X.cloth("#1a1618"); return P("M40,252 C44,180 60,120 66,84 C70,50 86,34 100,30 C114,34 130,50 134,84 C140,120 156,180 160,252 Z", cf, `stroke="#2a2a30" stroke-width="1"`) + folds(["M70,140 C66,190 62,220 58,250", "M130,140 C134,190 138,220 142,250", "M100,170 L100,250", "M84,150 C82,190 80,220 78,250", "M116,150 C118,190 120,220 122,250"], "#1a1618", 1.6) +
        P("M76,124 C74,84 86,64 100,62 C114,64 126,84 124,124 C116,134 84,134 76,124 Z", "#000") + `<ellipse cx="90" cy="104" rx="3" ry="1.6" fill="#c8e0ff" opacity=".7"/><ellipse cx="110" cy="104" rx="3" ry="1.6" fill="#c8e0ff" opacity=".7"/><ellipse cx="100" cy="104" rx="30" ry="22" fill="#6a8ab8" opacity=".08"/>` +
        (L.crown ? P("M76,66 L74,34 L84,52 L92,28 L100,48 L108,28 L116,52 L126,34 L124,66 Q100,58 76,66 Z", X.metal("#8a9098"), `stroke="#3a3a40" stroke-width="1"`) + `<ellipse cx="100" cy="46" rx="34" ry="20" fill="#c8e0ff" opacity=".12"/>` : "") +
        S("M148,250 L162,120", X.metal("#9aa0a8"), 3.5) + S("M152,140 L172,146", "#3a3a40", 4) + `<path d="M162,120 l-1,-12 l4,10 z" fill="#d8dde2"/>`; }
      case "sauron": { const cf = X.metal("#2a2224"); return P("M30,252 C34,196 56,170 84,164 L116,164 C144,170 166,196 170,252 Z", X.cloth("#1a1616"), `stroke="#3a3030" stroke-width="1.2"`) + folds(["M60,200 C56,220 52,236 50,250", "M140,200 C144,220 148,236 150,250", "M100,176 L100,250"], "#1a1616", 1.6) +
        P("M36,206 C34,180 56,162 82,160 L84,184 C66,186 48,194 36,206 Z M164,206 C166,180 144,162 118,160 L116,184 C134,186 152,194 164,206 Z", cf, `stroke="#5a4a40" stroke-width="1"`) + S("M40,196 L30,176 M50,186 L44,164 M160,196 L170,176 M150,186 L156,164", "#2a2424", 4) + S("M40,200 C44,186 56,176 70,172", "#6a5a50", 1, 'opacity=".6"') +
        P("M64,140 C58,80 78,50 100,48 C122,50 142,80 136,140 L120,164 L80,164 Z", cf, `stroke="#4a4040" stroke-width="1.2"`) + P("M72,64 L60,18 L84,52 Z M128,64 L140,18 L116,52 Z M92,50 L100,8 L108,50 Z M82,54 L76,24 L92,48 Z M118,54 L124,24 L108,48 Z", cf, `stroke="#4a4040" stroke-width=".8"`) + S("M70,100 C72,80 80,64 92,56", "#7a6a60", 1, 'opacity=".5"') +
        P("M76,104 L124,104 L118,116 L82,116 Z", "#000") + `<ellipse cx="90" cy="110" rx="6" ry="2.4" fill="#ff6a10"/><ellipse cx="110" cy="110" rx="6" ry="2.4" fill="#ff6a10"/><ellipse cx="100" cy="110" rx="30" ry="12" fill="#ff4a10" opacity=".18"/>` + S("M100,120 L100,160 M86,124 L86,154 M114,124 L114,154", "#3a3030", 1.4) +
        `<circle cx="150" cy="232" r="9" fill="#ffd040" opacity=".3"/><circle cx="150" cy="232" r="4.5" fill="none" stroke="${X.gold()}" stroke-width="2.4"/>`; }
      case "eye": return `<ellipse cx="100" cy="120" rx="96" ry="44" fill="#ff7a10" opacity=".25"/><path d="M8,120 Q100,40 192,120 Q100,200 8,120 Z" fill="#ff8a20"/><path d="M28,120 Q100,60 172,120 Q100,180 28,120 Z" fill="#ffc040"/><path d="M50,120 Q100,82 150,120 Q100,158 50,120 Z" fill="#ff6a10"/><ellipse cx="100" cy="120" rx="7" ry="36" fill="#140400"/>` + S("M8,120 Q100,40 192,120 Q100,200 8,120", "#5a1a00", 2) + Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * 6.28; return S(`M${100 + Math.cos(a) * 100},${120 + Math.sin(a) * 50} l${Math.cos(a) * 18},${Math.sin(a) * 12}`, "#ff9030", 3, 'opacity=".5"'); }).join("") + tower(100, 252, 60, 70, "#0c0606", "spikes");
      case "morgoth": { const mf = X.metal("#22202a"); return P("M14,252 C18,186 52,160 86,152 L114,152 C148,160 182,186 186,252 Z", X.cloth("#0e0c0e"), `stroke="#2a262a" stroke-width="1.4"`) + folds(["M50,200 C44,220 40,236 38,250", "M150,200 C156,220 160,236 162,250", "M100,164 L100,250"], "#1a1620", 1.8) + P("M24,212 C22,176 56,152 84,150 L86,178 C62,182 40,192 24,212 Z M176,212 C178,176 144,152 116,150 L114,178 C138,182 160,192 176,212 Z", mf, `stroke="#3a3438" stroke-width="1"`) + S("M28,206 C34,186 54,170 76,166", "#6a6470", 1, 'opacity=".6"') +
        P("M68,134 C62,78 82,54 100,52 C118,54 138,78 132,134 L116,154 L84,154 Z", mf, `stroke="#3a3438" stroke-width="1"`) + S("M72,110 C72,86 82,66 94,58", "#7a7480", 1, 'opacity=".5"') + `<ellipse cx="88" cy="104" rx="5" ry="2" fill="#ff5010"/><ellipse cx="112" cy="104" rx="5" ry="2" fill="#ff5010"/>` +
        P("M64,74 L62,36 L76,58 L86,30 L100,54 L114,30 L124,58 L138,36 L136,74 Q100,62 64,74 Z", X.metal("#2a2a2e"), `stroke="#5a5a60" stroke-width="1"`) + [78, 100, 122].map((x) => `<circle cx="${x}" cy="66" r="9" fill="#fffbe0" opacity=".25"/><path d="M${x},58 l3,6 l6,2 l-6,2 l-3,6 l-3,-6 l-6,-2 l6,-2 z" fill="#fffbe0"/>`).join("") +
        S("M36,250 L28,140", "#2a2a2e", 6) + P("M10,110 L44,108 L46,146 L12,150 Z", X.metal("#2a2a2e"), `stroke="#5a5a60" stroke-width="1"`) + S("M14,120 L42,118 M14,134 L42,132", "#5a5a60", 1.4); }
      case "balrog": { let s = ""; for (let i = 0; i < 18; i++) { const x = 30 + i * 8, h = 60 + Math.sin(i * 1.7) * 30; s += P(`M${x - 8},200 Q${x},${200 - h} ${x + 4},${200 - h - 20} Q${x + 6},${200 - h} ${x + 10},200 Z`, i % 2 ? "#ff7a20" : "#ffb040", 'opacity=".75"'); }
        const bf = X.skin("#2a1410");
        return P("M0,110 Q40,40 90,90 L80,150 Q40,120 0,150 Z M200,110 Q160,40 110,90 L120,150 Q160,120 200,150 Z", "#140c0c", 'opacity=".92"') + S("M20,120 Q50,80 84,96 M180,120 Q150,80 116,96", "#3a2424", 1.2, 'opacity=".7"') + s + P("M40,252 C44,190 66,160 100,156 C134,160 156,190 160,252 Z", bf, `stroke="#ff6a10" stroke-width="1.2"`) + S("M70,190 L84,240 M130,190 L116,240 M100,170 L100,250 M56,210 L66,250 M144,210 L134,250", "#ff7020", 1.6, 'opacity=".7"') +
          P("M70,130 C66,90 82,70 100,70 C118,70 134,90 130,130 C124,152 112,160 100,160 C88,160 76,152 70,130 Z", bf, `stroke="#ff6a10" stroke-width="1"`) + P("M74,92 Q48,74 46,40 Q60,70 80,80 Z M126,92 Q152,74 154,40 Q140,70 120,80 Z", X.skin("#3a2a24")) +
          `<ellipse cx="88" cy="114" rx="7" ry="3.4" fill="#ffe060"/><ellipse cx="112" cy="114" rx="7" ry="3.4" fill="#ffe060"/>` + S("M86,140 Q100,150 114,140", "#ffb040", 2) + S("M168,250 Q150,190 176,150 Q190,130 180,110", "#ff9030", 2.4) + S("M150,250 L164,140", "#3a2a24", 4) + P("M156,150 L176,120 L172,160 Z", "#ffa030"); }
      case "dragon": { const c1 = L.c || "#b0342a", c2 = L.c2 || "#e0a040", cd = sh(c1, 0.5), bf = X.skin(c1);
        return P("M-10,250 C10,190 40,160 70,150 C60,190 64,220 80,250 Z", X.cloth(cd)) + P("M150,40 Q200,20 210,80 L210,170 Q180,120 150,110 Z", X.cloth(dk(c1, 0.5)), 'opacity=".9"') + S("M156,50 L196,120 M170,44 L206,100 M150,70 L188,150", dk(c1, 0.65), 1.4) +
          P("M40,250 C40,200 60,170 86,150 L120,170 C110,200 104,224 108,250 Z", bf, `stroke="${cd}" stroke-width="1.2"`) + Array.from({ length: 6 }, (_, i) => S(`M${60 + i * 6},${236 - i * 12} q6,4 12,0`, c2, 1.4)).join("") + Array.from({ length: 8 }, (_, i) => S(`M${44 + i * 4},${248 - i * 10} q10,-3 20,0`, cd, 0.8, 'opacity=".5"')).join("") +
          P("M60,118 C58,92 78,70 106,70 C130,70 150,84 164,104 L186,126 Q192,136 182,140 L150,146 Q130,160 104,162 C80,162 62,144 60,118 Z", bf, `stroke="${cd}" stroke-width="1.4"`) + E(96, 88, 16, 8, hi(c1, 0.5), `opacity=".35" ${X.soft(2.5)}`) +
          P("M150,146 L182,140 Q170,152 150,154 Z", dk(c1, 0.2)) + Array.from({ length: 5 }, (_, i) => `<path d="M${156 + i * 6},140 l2,6 l2,-6 z" fill="#f4f0e0"/>`).join("") +
          P("M76,80 Q52,40 30,30 Q60,52 70,92 Z M98,72 Q88,30 70,10 Q100,36 108,72 Z", X.cloth(c2), `stroke="${cd}" stroke-width="1"`) + `<ellipse cx="116" cy="102" rx="10" ry="6" fill="${X.iris("#ffe040")}"/><ellipse cx="116" cy="102" rx="2.2" ry="5.6" fill="#140400"/><circle cx="112" cy="99" r="1.4" fill="#fff" opacity=".8"/>` + `<circle cx="178" cy="128" r="1.6" fill="#140400"/>` +
          Array.from({ length: 14 }, (_, i) => S(`M${66 + (i % 7) * 12},${116 + Math.floor(i / 7) * 14} q6,5 12,0`, cd, 0.9, 'opacity=".7"')).join("") + `<path d="M190,138 q10,-6 16,2 q-8,-2 -12,4" fill="#ff8a20" opacity=".8"/>`; }
      case "spider": { let legs = ""; [[-1, 0], [1, 0]].forEach(([sx]) => [0, 1, 2, 3].forEach((i) => { const y = 120 + i * 18; legs += S(`M${100 + sx * 30},${y} Q${100 + sx * (70 + i * 8)},${y - 60 + i * 10} ${100 + sx * (96 - i * 4)},${y + 40 + i * 20}`, "#1a1a1e", 5) + S(`M${100 + sx * 30},${y} Q${100 + sx * (70 + i * 8)},${y - 60 + i * 10} ${100 + sx * (96 - i * 4)},${y + 40 + i * 20}`, "#4a4a56", 1.2, 'opacity=".5" transform="translate(-1,-1.5)"'); }));
        return legs + `<ellipse cx="100" cy="196" rx="62" ry="56" fill="${X.skin("#1c1c22")}" stroke="#3a3a44" stroke-width="1.2"/>` + S("M70,180 Q100,200 130,180 M76,210 Q100,226 124,210", "#3a3a44", 1.2) + E(80, 170, 18, 10, "#5a5a68", `opacity=".35" ${X.soft(3)}`) + `<ellipse cx="100" cy="124" rx="36" ry="30" fill="${X.skin("#24242c")}" stroke="#3a3a44" stroke-width="1"/>` +
          [[86, 116, 5], [114, 116, 5], [94, 106, 3.4], [106, 106, 3.4], [78, 126, 2.6], [122, 126, 2.6], [90, 128, 2.2], [110, 128, 2.2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${X.iris("#9ae060")}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.3}" fill="#fff"/>`).join("") + P("M90,146 Q86,160 92,166 L96,148 Z M110,146 Q114,160 108,166 L104,148 Z", "#c8c8b0"); }
      case "ent": { const bark = X.cloth("#6a5038"); return P("M40,252 C44,200 56,170 70,150 L130,150 C144,170 156,200 160,252 Z", bark, `stroke="#3a2a1a" stroke-width="1.4"`) + S("M66,170 C64,200 60,230 58,250 M88,160 C86,200 86,230 84,250 M112,160 C114,200 114,230 116,250 M134,170 C136,200 140,230 142,250", "#4a3624", 1.6) + S("M76,176 C74,200 72,230 70,250 M100,160 C100,200 100,230 100,250 M124,176 C126,200 128,230 130,250", hi("#6a5038", 0.4), 1, 'opacity=".5"') +
        P("M64,120 C60,70 76,40 100,38 C124,40 140,70 136,120 C134,148 120,164 100,166 C80,164 66,148 64,120 Z", X.skin("#7a5c40"), `stroke="#3a2a1a" stroke-width="1.4"`) + S("M76,70 C74,100 76,130 80,150 M124,70 C126,100 124,130 120,150 M100,44 L100,70 M88,60 C84,90 86,120 90,140 M112,60 C116,90 114,120 110,140", "#5a4230", 1.2) +
        `<ellipse cx="86" cy="104" rx="7" ry="5" fill="#2a1a0a"/><ellipse cx="114" cy="104" rx="7" ry="5" fill="#2a1a0a"/><circle cx="86" cy="104" r="3.2" fill="${X.iris("#a8c860")}"/><circle cx="114" cy="104" r="3.2" fill="${X.iris("#a8c860")}"/><circle cx="85" cy="103" r="1" fill="#fff"/><circle cx="113" cy="103" r="1" fill="#fff"/>` + S("M76,94 Q86,88 96,94 M104,94 Q114,88 124,94", "#3a2a1a", 3) +
        P("M74,128 C72,160 82,200 100,214 C118,200 128,160 126,128 C116,140 84,140 74,128 Z", X.cloth("#5a7a3a")) + S("M86,140 L88,196 M100,142 L100,208 M114,140 L112,196 M80,136 L84,180 M120,136 L116,180", "#3a5a2a", 1) +
        Array.from({ length: 22 }, (_, i) => `<ellipse cx="${(70 + (i * 37) % 64).toFixed(0)}" cy="${(30 + (i * 13) % 30).toFixed(0)}" rx="6" ry="3" fill="${i % 2 ? "#5a8a3a" : "#7aa04a"}" transform="rotate(${(i * 47) % 180} ${(70 + (i * 37) % 64).toFixed(0)} ${(30 + (i * 13) % 30).toFixed(0)})"/>`).join("") + S("M64,72 Q40,50 30,30 M40,52 L28,50 M136,72 Q160,50 170,30 M160,52 L172,50", "#6a5038", 4); }
    }
    return "";
  }

  function frame(u, k) {
    const gold = k === "dark" ? "#8a6a5a" : "#c8a050", g2 = k === "dark" ? "#5a4438" : "#8a6a2a";
    return `<rect x="3" y="3" width="194" height="244" rx="10" fill="none" stroke="${g2}" stroke-width="4.5"/><rect x="3" y="3" width="194" height="244" rx="10" fill="none" stroke="${gold}" stroke-width="2.4"/><rect x="8" y="8" width="184" height="234" rx="7" fill="none" stroke="${gold}" stroke-width=".8" opacity=".7"/><rect x="8" y="8" width="184" height="234" rx="7" fill="none" stroke="#000" stroke-width="2" opacity=".25"/>` +
      [[8, 8, 0], [192, 8, 90], [192, 242, 180], [8, 242, 270]].map(([x, y, a]) => `<g transform="translate(${x},${y}) rotate(${a})">${S("M0,18 Q0,0 18,0 M4,24 Q4,4 24,4", gold, 1.4)}<circle cx="6" cy="6" r="2.4" fill="${gold}"/><circle cx="5.3" cy="5.3" r=".8" fill="#fff" opacity=".7"/></g>`).join("");
  }

  // 每次插入页面都换一套新 id（同一人物可能同时出现在人物墙、传记卡、首秀卡上，id 重复会让 mask/filter 引用失效）
  const fresh = (tpl) => tpl.replace(/§/g, "pt" + uid++ + "_");
  return function (c) {
    if (!c) return "";
    if (cache[c.id]) return fresh(cache[c.id]);
    const u = "§", L = c.look || {}, r = rnd(c.id), sk = SC[c.id] || RACE_SC[c.r] || "gondor", sc = scene(sk, u, r), X = ctx(u);
    const fig = L.sp ? special(c, L, u, X) : humanoid(c, L, X);
    const rim = RIM[sk] || "#ffffff", haze = HAZE[sk] || "#ffffff";
    const defs = `<defs>${sc.defs}${X.D.join("")}` +
      `<filter id="${u}dof" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.1"/></filter>` +
      `<linearGradient id="${u}hz" x1="0" y1="0" x2="0" y2="1"><stop offset=".3" stop-color="${haze}" stop-opacity="0"/><stop offset="1" stop-color="${haze}" stop-opacity=".55"/></linearGradient>` +
      `<filter id="${u}fx" x="-20%" y="-12%" width="140%" height="130%"><feOffset in="SourceAlpha" dx="-3.2" dy="-1.4" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="e"/><feGaussianBlur in="e" stdDeviation=".7" result="eb"/><feFlood flood-color="${rim}" flood-opacity=".9" result="rc"/><feComposite in="rc" in2="eb" operator="in" result="rim"/><feGaussianBlur in="SourceAlpha" stdDeviation="5" result="sb"/><feOffset in="sb" dx="5" dy="7" result="so"/><feFlood flood-color="#000" flood-opacity=".5" result="sc"/><feComposite in="sc" in2="so" operator="in" result="shd"/><feMerge><feMergeNode in="shd"/><feMergeNode in="SourceGraphic"/><feMergeNode in="rim"/></feMerge></filter>` +
      `<filter id="${u}wh" x="0" y="0" width="100%" height="100%"><feFlood flood-color="#fff" result="f"/><feComposite in="f" in2="SourceAlpha" operator="in"/></filter>` +
      `<mask id="${u}m" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="250"><g filter="url(#${u}wh)"><use href="#${u}f"/></g></mask>` +
      `<radialGradient id="${u}key" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(48,58) scale(150 190)"><stop offset="0" stop-color="#fff5d8" stop-opacity=".22"/><stop offset=".5" stop-color="#fff5d8" stop-opacity=".04"/><stop offset="1" stop-color="#fff5d8" stop-opacity="0"/></radialGradient>` +
      `<linearGradient id="${u}shd" x1="0" y1="0" x2="1" y2="1"><stop offset=".35" stop-color="#1b1222" stop-opacity="0"/><stop offset="1" stop-color="#1b1222" stop-opacity=".55"/></linearGradient>` +
      `<filter id="${u}gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${uid % 7}" stitchTiles="stitch" result="t"/><feColorMatrix in="t" type="matrix" values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .4  0 0 0 1 0"/></filter>` +
      `<filter id="${u}pa" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="2" seed="${(uid * 3) % 11}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter>` +
      `<radialGradient id="${u}v" cx=".5" cy=".42" r=".75"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient><clipPath id="${u}c"><rect x="3" y="3" width="194" height="244" rx="10"/></clipPath></defs>`;
    const svg = `<svg class="portrait" viewBox="0 0 200 250" role="img" aria-label="${c.n}">${defs}` +
      `<g clip-path="url(#${u}c)"><g filter="url(#${u}pa)"><g filter="url(#${u}dof)">${sc.g}</g><rect width="200" height="250" fill="url(#${u}hz)"/>` +
      `<g id="${u}f" class="pt-fig" filter="url(#${u}fx)">${fig}</g>` +
      `<g mask="url(#${u}m)"><rect width="200" height="250" fill="url(#${u}key)" style="mix-blend-mode:soft-light"/><rect width="200" height="250" fill="url(#${u}key)" opacity=".1"/><rect width="200" height="250" fill="url(#${u}shd)" style="mix-blend-mode:multiply"/></g></g>` +
      `<rect width="200" height="250" filter="url(#${u}gr)" opacity=".12" style="mix-blend-mode:overlay"/><rect width="200" height="250" fill="url(#${u}v)"/></g>${frame(u, c.r)}</svg>`;
    cache[c.id] = svg;
    return fresh(svg);
  };
})();
