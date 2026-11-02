/* 中洲纪年 · 人物插画（原创矢量半身像，由人物的 look 参数生成；背景按出身配一幅小场景）
 * window.PORTRAIT(c) → <svg viewBox="0 0 200 250">…</svg>
 */
window.PORTRAIT = (function () {
  const INK = "#2a1a10";
  let uid = 0;
  const cache = {};
  /* —— 颜色工具 —— */
  function hx(c) { c = (c || "#888").replace("#", ""); if (c.length === 3) c = c.split("").map((x) => x + x).join(""); return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16)); }
  function mix(a, b, k) { const A = hx(a), B = hx(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join(""); }
  const dk = (c, k = 0.3) => mix(c, "#000000", k), lt = (c, k = 0.3) => mix(c, "#ffffff", k);
  const P = (d, f, extra = "") => `<path d="${d}" fill="${f}" ${extra}/>`;
  const S = (d, c, w, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  function rnd(seed) { let s = 0; for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

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

  function sky(id, a, b, c) { return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".62" stop-color="${b}"/><stop offset="1" stop-color="${c || b}"/></linearGradient>`; }
  function stars(r, n, y1, col = "#fff8e0") { let s = ""; for (let i = 0; i < n; i++) { const x = r() * 200, y = r() * y1, z = 0.4 + r() * 1.1; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${z.toFixed(2)}" fill="${col}" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`; } return s; }
  function hills(y, amp, col, r, n = 5) { let d = `M-5,${y}`; for (let i = 0; i <= n; i++) { const x = (i / n) * 210 - 5; d += ` Q${(x - 210 / n / 2).toFixed(1)},${(y - amp * (0.4 + r())).toFixed(1)} ${x.toFixed(1)},${(y - r() * amp * 0.3).toFixed(1)}`; } return P(d + " L205,260 L-5,260 Z", col); }
  function peaks(y, col, r, n = 6, h = 50, snow) { let s = ""; for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 220 - 10, hh = h * (0.55 + r() * 0.6), w = 26 + r() * 22; s += P(`M${x - w},${y} L${x},${y - hh} L${x + w},${y} Z`, col); if (snow) s += P(`M${x - w * 0.28},${y - hh * 0.72} L${x},${y - hh} L${x + w * 0.28},${y - hh * 0.72} L${x + w * 0.1},${y - hh * 0.66} L${x - w * 0.06},${y - hh * 0.74} Z`, snow); } return s; }
  function tree(x, y, h, trunk, leaf, r) { let s = S(`M${x},${y} L${x},${y - h}`, trunk, 2.4); for (let i = 0; i < 5; i++) s += `<circle cx="${(x + (r() - 0.5) * h * 0.5).toFixed(1)}" cy="${(y - h + (r() - 0.3) * h * 0.4).toFixed(1)}" r="${(h * (0.16 + r() * 0.12)).toFixed(1)}" fill="${leaf}" opacity=".9"/>`; return s; }
  function tower(x, y, w, h, col, top = "spire") { let s = P(`M${x - w / 2},${y} L${x - w / 2 * 0.8},${y - h} L${x + w / 2 * 0.8},${y - h} L${x + w / 2},${y} Z`, col); if (top === "spire") s += P(`M${x - w * 0.42},${y - h} L${x},${y - h - w * 1.3} L${x + w * 0.42},${y - h} Z`, col); if (top === "spikes") s += P(`M${x - w * 0.5},${y - h} L${x - w * 0.45},${y - h - w * 0.9} L${x - w * 0.15},${y - h - w * 0.3} L${x},${y - h - w * 1.4} L${x + w * 0.15},${y - h - w * 0.3} L${x + w * 0.45},${y - h - w * 0.9} L${x + w * 0.5},${y - h} Z`, col); return s; }

  function scene(k, u, r) {
    let d = "", g = "";
    switch (k) {
      case "shire":
        d = sky(u + "s", "#f6d28a", "#fbeec4");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/><circle cx="160" cy="58" r="20" fill="#fff4c8" opacity=".9"/>`;
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
        d = sky(u + "s", "#fff3c0", "#d6e6f2", "#e8f0f4") + `<radialGradient id="${u}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
        g = `<rect width="200" height="250" fill="url(#${u}s)"/><circle cx="34" cy="70" r="40" fill="#f8e070" opacity=".35"/><circle cx="166" cy="70" r="40" fill="#e8f0ff" opacity=".55"/>`;
        g += tree(34, 150, 70, "#9a8a6a", "#f8d860", r) + tree(166, 150, 70, "#b8c0c8", "#e0ecff", r);
        g += P("M60,170 Q100,110 140,170 Z", "#d8dce4") + tower(100, 128, 8, 26, "#f4f6fa") + tower(86, 140, 7, 14, "#eef0f4") + tower(114, 140, 7, 14, "#eef0f4");
        g += hills(178, 18, "#c8d4b0", r);
        break;
      case "forest":
        d = sky(u + "s", "#0e1c36", "#2a4a5a", "#1c3428");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + stars(r, 50, 120) + `<path d="M156,36 a14,14 0 1 0 8,24 a11,11 0 1 1 -8,-24 z" fill="#f4f0d8"/>`;
        for (let i = 0; i < 8; i++) { const x = 6 + i * 27 + r() * 8, w = 4 + r() * 3; g += P(`M${x - w},250 L${x - w * 0.6},${20 + r() * 40} L${x + w * 0.6},${20 + r() * 40} L${x + w},250 Z`, i % 2 ? "#4a5e66" : "#6a7c80", 'opacity=".75"'); }
        for (let i = 0; i < 30; i++) g += `<circle cx="${(r() * 200).toFixed(1)}" cy="${(r() * 140).toFixed(1)}" r="${(3 + r() * 6).toFixed(1)}" fill="#2a5040" opacity=".55"/>`;
        for (let i = 0; i < 12; i++) g += `<circle cx="${(r() * 200).toFixed(1)}" cy="${(90 + r() * 140).toFixed(1)}" r="1.2" fill="#d8ffb0" opacity=".85"/>`;
        break;
      case "lorien":
        d = sky(u + "s", "#f8e8a8", "#c8d088", "#6a8a4a");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>`;
        for (let i = 0; i < 6; i++) { const x = 10 + i * 36 + r() * 8; g += P(`M${x - 6},250 L${x - 3},0 L${x + 3},0 L${x + 6},250 Z`, "#d8d8c8") + S(`M${x - 2},${60 + i * 9} Q${x + 8},${50 + i * 9} ${x + 20},${56 + i * 9}`, "#c8c8b8", 2); }
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
        g = `<rect width="200" height="250" fill="url(#${u}s)"/><circle cx="150" cy="52" r="10" fill="#fff8d8"/><path d="M146,32 l4,-10 l4,10 l10,4 l-10,4 l-4,10 l-4,-10 l-10,-4 z" fill="#fff" opacity=".85"/>`;
        g += `<rect y="150" width="200" height="100" fill="#3a6a8a"/>`;
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
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + peaks(150, "#a8b0b8", r, 7, 50, "#f4f8ff") + hills(168, 22, "#c8b060", r) + hills(200, 16, "#b09a48", r);
        g += `<g transform="translate(160,152)"><path d="M-18,6 Q0,-22 18,6 Z" fill="#9a8a48"/><path d="M-10,-6 L0,-14 L10,-6 L10,0 L-10,0 Z" fill="#e8b830" stroke="#7a5a1a" stroke-width=".6"/></g>`;
        g += `<g transform="translate(30,200)">${S("M0,0 L0,-70", "#5a4a3a", 1.6)}<path d="M0,-70 L28,-66 L28,-38 L0,-42 Z" fill="#2e6a3a"/><path d="M8,-46 l4,-12 l4,6 l4,-6 l-2,12 z" fill="#f4f0e8"/></g>`;
        for (let i = 0; i < 20; i++) { const x = r() * 200, y = 190 + r() * 55; g += S(`M${x},${y} l-2,-7 M${x},${y} l2,-8`, "#8a7a30", 0.8); }
        break;
      case "dale":
        d = sky(u + "s", "#b8c8d8", "#e8dcc8");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + P("M30,150 L100,40 L170,150 Z", "#8a8a8a") + P("M86,62 L100,40 L114,62 L106,58 L100,64 Z", "#f4f6fa");
        g += `<rect y="150" width="200" height="100" fill="#6a8aa0"/>`;
        for (let i = 0; i < 6; i++) g += S(`M${r() * 160},${160 + i * 14} h${20 + r() * 30}`, "#c8dae8", 1, 'opacity=".6"');
        g += `<g fill="#8a6a4a" stroke="#4a3a2a" stroke-width=".6">${[20, 44, 150, 174].map((x) => `<path d="M${x - 10},176 L${x - 10},162 L${x},154 L${x + 10},162 L${x + 10},176 Z"/>`).join("")}</g>` + S("M0,178 L200,178", "#4a3a2a", 1.4);
        break;
      case "wild":
        d = sky(u + "s", "#c8e0d0", "#8ab080", "#3a5a3a");
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>` + peaks(130, "#7a9088", r, 5, 60, "#e8f0f0");
        for (let i = 0; i < 9; i++) g += tree(r() * 200, 160 + r() * 80, 50 + r() * 50, "#5a4028", r() > 0.5 ? "#3a6a3a" : "#4a7a3a", r);
        for (let i = 0; i < 5; i++) { const x = 20 + r() * 160, y = 40 + r() * 40; g += S(`M${x - 4},${y} q4,-3 4,0 q0,-3 4,0`, "#2a2a2a", 0.8); }
        break;
      case "dwarf":
        d = `<radialGradient id="${u}s" cx=".5" cy=".95" r=".9"><stop offset="0" stop-color="#e88a3a"/><stop offset=".35" stop-color="#5a3a2a"/><stop offset="1" stop-color="#1a1416"/></radialGradient>`;
        g = `<rect width="200" height="250" fill="url(#${u}s)"/>`;
        for (const x of [18, 182]) g += `<rect x="${x - 10}" y="0" width="20" height="250" fill="#3a3234"/><rect x="${x - 14}" y="40" width="28" height="8" fill="#4a4244"/><rect x="${x - 14}" y="200" width="28" height="8" fill="#4a4244"/>` + S(`M${x - 4},70 L${x + 4},84 L${x - 4},98 M${x},110 l0,20 m-5,-14 l10,0`, "#c8a050", 1, 'opacity=".6"');
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
  function hairBack(L, h) {
    if (L.hs === "long" || L.hs === "longs") return P("M66,112 C60,72 82,58 100,58 C118,58 140,72 134,112 C138,150 142,190 150,236 L50,236 C58,190 62,150 66,112 Z", h) + S("M72,130 C70,170 66,200 62,230 M128,130 C130,170 134,200 138,230", dk(h, 0.25), 1.2);
    if (L.hs === "curly" || !L.hs) return "";
    return "";
  }
  function hairFront(L, h) {
    const hd = dk(h, 0.28);
    switch (L.hs) {
      case "bald": return P("M70,116 C68,104 70,98 73,96 L75,118 Z", h) + P("M130,116 C132,104 130,98 127,96 L125,118 Z", h);
      case "curly": { let s = ""; const pts = [[72, 104], [76, 88], [86, 78], [100, 74], [114, 78], [124, 88], [128, 104], [80, 96], [94, 84], [108, 84], [120, 96], [70, 118], [130, 118]]; pts.forEach(([x, y], i) => (s += `<circle cx="${x}" cy="${y}" r="${i > 10 ? 7 : 9.5}" fill="${h}" stroke="${hd}" stroke-width=".8"/>` + S(`M${x - 4},${y + 1} q4,-5 8,0`, hd, 0.8))); return s; }
      case "long": case "longs":
        return P("M68,118 C62,80 82,64 100,64 C118,64 138,80 132,118 C128,96 118,84 102,82 L100,86 L98,82 C82,84 72,96 68,118 Z", h) + P("M68,108 C62,140 66,176 58,206 L72,202 C76,176 74,140 76,112 Z", h) + P("M132,108 C138,140 134,176 142,206 L128,202 C124,176 126,140 124,112 Z", h) + S("M100,66 L100,84 M84,72 C76,82 72,96 70,112 M116,72 C124,82 128,96 130,112 M66,130 C66,160 64,180 62,198 M134,130 C134,160 136,180 138,198", hd, 0.9);
      default:
        return P("M70,116 C64,82 82,66 100,66 C120,66 138,80 130,116 C126,100 120,92 110,90 C104,96 94,96 88,88 C80,94 74,102 70,116 Z", h) + S("M88,72 C84,80 82,86 86,90 M104,70 C110,76 112,84 110,90 M120,78 C124,86 126,96 128,106", hd, 0.9);
    }
  }
  function beard(L, h) {
    const c = L.bc || h, cd = dk(c, 0.25);
    if (L.b === "short") return P("M72,118 C72,146 86,162 100,164 C114,162 128,146 128,118 C122,136 112,142 100,142 C88,142 78,136 72,118 Z", c) + P("M86,136 Q100,128 114,136 Q108,140 100,138 Q92,140 86,136 Z", c, `stroke="${cd}" stroke-width=".6"`);
    if (L.b === "long" || L.b === "braid") {
      let s = P("M70,116 C68,160 80,200 100,226 C120,200 132,160 130,116 C124,136 112,142 100,142 C88,142 76,136 70,116 Z", c) + S("M84,148 C84,176 90,196 96,214 M100,146 L100,222 M116,148 C116,176 110,196 104,214 M76,134 C78,160 84,180 90,200 M124,134 C122,160 116,180 110,200", cd, 0.8);
      s += P("M84,136 Q100,126 116,136 Q122,142 126,150 Q112,138 100,140 Q88,138 74,150 Q78,142 84,136 Z", c, `stroke="${cd}" stroke-width=".6"`);
      if (L.b === "braid") s += [86, 114].map((x) => `${S(`M${x},150 L${x},212`, cd, 6)}${S(`M${x},150 L${x},212`, c, 4.4)}${[166, 182, 198].map((y) => `<rect x="${x - 3.6}" y="${y}" width="7.2" height="3" rx="1" fill="#c8a040"/>`).join("")}`).join("");
      return s;
    }
    return "";
  }
  function hat(L, u) {
    const hc = L.hc || L.c || "#6a6a6a", hd = dk(hc, 0.3);
    switch (L.hat) {
      case "wizard": return P("M38,92 Q100,74 162,92 Q100,104 38,92 Z", hc, `stroke="${hd}" stroke-width="1"`) + P("M70,88 Q86,50 104,24 Q118,4 142,2 Q122,14 116,32 Q112,60 130,88 Z", hc, `stroke="${hd}" stroke-width="1"`) + S("M74,84 Q100,90 128,84", hd, 2.2) + S("M100,30 Q96,60 98,84", hd, 0.7, 'opacity=".5"');
      case "tall": return P("M50,90 Q100,76 150,90 Q100,100 50,90 Z", hc) + P("M72,88 L76,30 Q100,22 124,30 L128,88 Z", hc, `stroke="${hd}" stroke-width="1"`) + `<rect x="74" y="74" width="52" height="8" fill="#e8c040"/>` + S("M120,34 Q150,10 140,-6", "#3a8a5a", 3) + S("M126,28 Q144,16 146,4", "#5aa070", 1.4);
      case "crown": return P("M74,88 L72,60 L82,74 L90,54 L100,70 L110,54 L118,74 L128,60 L126,88 Z", hc, `stroke="${hd}" stroke-width="1"`) + [82, 100, 118].map((x) => `<circle cx="${x}" cy="82" r="2.6" fill="${L.gem || "#e04040"}"/>`).join("") + `<circle cx="90" cy="54" r="2" fill="${hc}"/><circle cx="110" cy="54" r="2" fill="${hc}"/><circle cx="100" cy="70" r="2" fill="#fff" opacity=".5"/>`;
      case "circlet": return S("M70,98 Q100,86 130,98", hc, 2.6) + `<path d="M100,86 l4,6 l-4,6 l-4,-6 z" fill="${L.gem || "#bfe8ff"}" stroke="${hd}" stroke-width=".6"/><circle cx="100" cy="92" r="7" fill="${L.gem || "#bfe8ff"}" opacity=".25"/>`;
      case "helm": return P("M64,118 C60,72 80,58 100,58 C120,58 140,72 136,118 L126,118 L126,100 L74,100 L74,118 Z", hc, `stroke="${hd}" stroke-width="1.2"`) + P("M96,98 L104,98 L102,124 L98,124 Z", hc, `stroke="${hd}" stroke-width=".8"`) + S("M100,58 L100,98", hd, 1) + S("M68,96 Q100,88 132,96", lt(hc, 0.4), 1.4) + `<ellipse cx="86" cy="74" rx="8" ry="4" fill="#fff" opacity=".25"/>` + (L.plume ? P("M100,60 Q76,36 50,58 Q62,44 76,46 Q60,54 54,74 Q72,52 100,64 Z", L.plume) : "") + (L.wing ? P("M64,90 Q44,70 46,50 Q56,70 70,80 Z M136,90 Q156,70 154,50 Q144,70 130,80 Z", "#f0f0f0") : "");
      case "hood": return P("M58,124 C52,70 78,52 100,52 C122,52 148,70 142,124 C140,100 128,80 100,78 C72,80 60,100 58,124 Z", hc, `stroke="${hd}" stroke-width="1"`) + S("M62,118 C66,94 80,82 100,80 C120,82 134,94 138,118", hd, 1.2);
      case "darkhelm": return P("M62,124 C56,72 78,56 100,56 C122,56 144,72 138,124 L130,140 L124,104 L76,104 L70,140 Z", hc, `stroke="#000" stroke-width="1"`) + P("M76,60 L70,34 L84,56 Z M124,60 L130,34 L116,56 Z M96,56 L100,30 L104,56 Z", hc) + P("M76,104 L124,104 L120,112 L80,112 Z", dk(hc, 0.4)) + S("M74,92 L126,92", "#6a6060", 1, 'opacity=".6"');
      default: return "";
    }
  }
  function item(L, front) {
    const it = L.it, ic = L.ic;
    if (!front) switch (it) {
      case "sword": return P("M34,196 L56,130 L60,132 L40,198 Z", ic || "#d8dde2", `stroke="#6a6a6a" stroke-width=".6"`) + S("M44,126 L70,138", "#8a6a2a", 5) + S("M60,126 L66,110", "#5a3a1a", 4.5) + `<circle cx="67" cy="107" r="4" fill="#c8a040"/>`;
      case "bow": return S("M150,30 Q192,120 152,236", "#7a5a2a", 4.5) + S("M150,30 L152,236", "#e8e0c8", 0.8) + S("M34,140 L60,40 M38,140 L66,44 M30,138 L54,40", "#7a5a2a", 1.5) + `<path d="M56,40 l4,-8 l3,9 z M62,44 l5,-8 l2,10 z M50,40 l3,-9 l4,8 z" fill="#e8e8e8"/>`;
      case "axe": return S("M148,236 L142,60", "#6a4a2a", 4) + P("M140,64 Q176,52 174,96 Q160,84 144,92 Z", "#c0c6cc", `stroke="#555" stroke-width="1"`) + S("M146,66 Q166,62 168,84", "#fff", 0.8, 'opacity=".5"');
      case "spear": return S("M156,250 L156,26", "#6a4a2a", 3) + P("M156,0 L163,28 L149,28 Z", ic || "#d8dde2", `stroke="#666" stroke-width=".6"`) + P("M151,32 L161,32 L156,42 Z", "#8a2a1a");
      case "staff": return S("M160,250 L160,40", "#6a4a2a", 5) + S("M160,40 Q148,28 156,16 Q168,20 166,34 Q162,30 160,40", "#6a4a2a", 3) + `<circle cx="158" cy="28" r="7" fill="${ic || "#ddd"}"/><circle cx="158" cy="28" r="16" fill="${ic || "#fff"}" opacity=".25"/>`;
      case "pack": return P("M30,250 L36,180 Q40,170 60,172 L60,250 Z", "#8a6a3a", `stroke="${INK}" stroke-width=".8"`) + `<ellipse cx="44" cy="174" rx="18" ry="6" fill="#6a8a4a"/>`;
      case "harp": return P("M148,250 L150,170 Q172,150 182,176 L172,250 Z", "none", `stroke="#c8a040" stroke-width="3.5"`) + S("M156,180 L156,250 M162,174 L162,250 M168,170 L168,250 M174,176 L174,250", "#f0e8c0", 0.6);
      default: return "";
    }
    switch (it) {
      case "star": return `<circle cx="100" cy="222" r="26" fill="${ic || "#fffbe0"}" opacity=".25"/><circle cx="100" cy="222" r="14" fill="${ic || "#fffbe0"}" opacity=".45"/><path d="M100,208 L104,218 L114,222 L104,226 L100,236 L96,226 L86,222 L96,218 Z" fill="#fff"/>` + P("M74,250 Q76,226 90,224 L94,236 L82,250 Z M126,250 Q124,226 110,224 L106,236 L118,250 Z", L.s || "#f4d6b8", `stroke="${INK}" stroke-width=".6"`);
      case "pipe": return S("M108,142 L130,150", "#6a4a2a", 3) + P("M128,140 L138,140 L137,154 L129,154 Z", "#6a4a2a") + `<g fill="none" stroke="#e8e8e8" stroke-width="2" opacity=".55"><circle cx="140" cy="124" r="5"/><circle cx="148" cy="106" r="7"/><circle cx="160" cy="84" r="9"/></g>`;
      case "shield": return `<circle cx="56" cy="214" r="34" fill="${ic || "#7a2a1a"}" stroke="#d8dde2" stroke-width="4"/><circle cx="56" cy="214" r="8" fill="#d8dde2"/><circle cx="56" cy="214" r="24" fill="none" stroke="${dk(ic || "#7a2a1a", 0.3)}" stroke-width="1.2"/>`;
      case "ring": return S("M86,176 Q100,206 114,176", "#c8a040", 0.9) + `<circle cx="100" cy="204" r="9" fill="#ffe080" opacity=".3"/><circle cx="100" cy="204" r="4.6" fill="none" stroke="#f0c030" stroke-width="2.2"/>`;
      case "pack": return S("M76,180 L70,250 M124,180 L130,250", "#6a4a2a", 4);
      default: return "";
    }
  }
  function body(L, k) {
    const c = L.c || "#6b4a2a", t = L.t || "#c8b48a", s = L.s || "#f4d6b8";
    const W = L.wide ? 88 : k === "hob" ? 70 : 76, cd = dk(c, 0.3), armor = L.hat === "helm" || L.hat === "darkhelm";
    let o = P(`M${100 - W},252 C${100 - W},206 ${100 - W + 16},184 76,176 L124,176 C${100 + W - 16},184 ${100 + W},206 ${100 + W},252 Z`, c, `stroke="${cd}" stroke-width="1.2"`);
    o += S(`M${100 - W + 14},250 C${100 - W + 16},226 ${100 - W + 22},206 ${100 - W + 34},194 M${100 + W - 14},250 C${100 + W - 16},226 ${100 + W - 22},206 ${100 + W - 34},194`, cd, 1.2);
    o += P("M80,176 L100,236 L120,176 Z", armor ? "#9aa0a8" : t, `stroke="${dk(armor ? "#9aa0a8" : t, 0.3)}" stroke-width=".8"`);
    if (armor) for (let y = 184; y < 232; y += 7) o += S(`M${84 + (y - 176) * 0.3},${y} ${Array.from({ length: 6 }, (_, i) => `q2,3 4,0`).join(" ")}`, "#6a7078", 0.6);
    else o += S("M92,186 L100,204 L108,186", dk(t, 0.25), 0.8);
    if (armor) o += P(`M${100 - W + 4},214 C${100 - W + 4},192 ${100 - W + 24},178 76,178 L82,198 C70,200 ${100 - W + 16},206 ${100 - W + 4},214 Z`, L.hc || "#8a8a8a", `stroke="#2a2a2a" stroke-width=".8"`) + P(`M${100 + W - 4},214 C${100 + W - 4},192 ${100 + W - 24},178 124,178 L118,198 C130,200 ${100 + W - 16},206 ${100 + W - 4},214 Z`, L.hc || "#8a8a8a", `stroke="#2a2a2a" stroke-width=".8"`);
    o += `<circle cx="80" cy="180" r="5" fill="#d8b040" stroke="#7a5a10" stroke-width="1"/><circle cx="120" cy="180" r="5" fill="#d8b040" stroke="#7a5a10" stroke-width="1"/>` + S("M85,180 Q100,186 115,180", "#d8b040", 1);
    if (k === "elf") o += `<path d="M80,174 q-3,6 0,12 q3,-6 0,-12z" fill="#7ab060" stroke="#3a6a2a" stroke-width=".6"/>`;
    o += P("M88,150 L112,150 L114,180 Q100,188 86,180 Z", s) + P("M88,156 Q100,164 112,156 L112,164 Q100,170 88,164 Z", dk(s, 0.15), 'opacity=".6"');
    return o;
  }
  function head(L, k) {
    const s = L.s || "#f4d6b8", sd = dk(s, 0.18), h = L.h || "#4a3a2a", eye = L.eye || EYE[k] || "#4a3a2a";
    const fw = k === "hob" ? 30 : L.wide || k === "dwarf" ? 30 : k === "elf" ? 25 : 27, chin = k === "elf" ? 152 : k === "hob" ? 150 : 154;
    let o = "";
    // 耳
    if (L.ear && k !== "hob") o += P(`M${100 - fw + 2},108 Q${100 - fw - 14},94 ${100 - fw - 18},80 Q${100 - fw - 8},104 ${100 - fw + 2},124 Z`, s, `stroke="${sd}" stroke-width="1"`) + P(`M${100 + fw - 2},108 Q${100 + fw + 14},94 ${100 + fw + 18},80 Q${100 + fw + 8},104 ${100 + fw - 2},124 Z`, s, `stroke="${sd}" stroke-width="1"`);
    else if (L.ear) o += P(`M${100 - fw + 2},106 Q${100 - fw - 10},98 ${100 - fw - 9},88 Q${100 - fw - 6},112 ${100 - fw + 2},124 Z`, s, `stroke="${sd}" stroke-width="1"`) + P(`M${100 + fw - 2},106 Q${100 + fw + 10},98 ${100 + fw + 9},88 Q${100 + fw + 6},112 ${100 + fw - 2},124 Z`, s, `stroke="${sd}" stroke-width="1"`);
    else o += `<ellipse cx="${100 - fw}" cy="116" rx="5" ry="8" fill="${s}" stroke="${sd}" stroke-width="1"/><ellipse cx="${100 + fw}" cy="116" rx="5" ry="8" fill="${s}" stroke="${sd}" stroke-width="1"/>`;
    // 脸
    o += P(`M${100 - fw},110 C${100 - fw},84 ${100 - fw + 12},74 100,74 C${100 + fw - 12},74 ${100 + fw},84 ${100 + fw},110 C${100 + fw},134 ${100 + fw - 12},${chin - 2} 100,${chin} C${100 - fw + 12},${chin - 2} ${100 - fw},134 ${100 - fw},110 Z`, s, `stroke="${sd}" stroke-width="1"`);
    o += P(`M${100 + fw - 8},100 C${100 + fw},118 ${100 + fw - 4},134 ${100 + 8},${chin - 2} C${100 + fw - 4},134 ${100 + fw - 2},120 ${100 + fw - 8},100 Z`, sd, 'opacity=".35"');
    // 眉眼
    const bc = dk(L.bc && L.b ? L.bc : h, 0.15), ey = 112;
    if (k === "dark") o += S(`M74,${ey - 14} L94,${ey - 7}`, "#1a1a1a", 3.4) + S(`M126,${ey - 14} L106,${ey - 7}`, "#1a1a1a", 3.4);
    else o += S(`M${84 - 8},${ey - 10} Q84,${ey - 14} ${84 + 8},${ey - 10}`, bc, k === "dwarf" || L.b ? 3 : 2) + S(`M${116 - 8},${ey - 10} Q116,${ey - 14} ${116 + 8},${ey - 10}`, bc, k === "dwarf" || L.b ? 3 : 2);
    [84, 116].forEach((x) => {
      o += P(`M${x - 8},${ey} Q${x},${ey - 7} ${x + 8},${ey} Q${x},${ey + 5} ${x - 8},${ey} Z`, "#fbf8f0") + `<circle cx="${x}" cy="${ey - 0.5}" r="3.7" fill="${eye}"/><circle cx="${x}" cy="${ey - 0.5}" r="1.7" fill="#120a06"/><circle cx="${x + 1.3}" cy="${ey - 1.8}" r="1" fill="#fff"/>` + S(`M${x - 8.5},${ey} Q${x},${ey - 8} ${x + 8.5},${ey}`, INK, 1.3);
    });
    if (L.eye === "#c02010") o += `<circle cx="84" cy="${ey}" r="7" fill="#ff3010" opacity=".25"/><circle cx="116" cy="${ey}" r="7" fill="#ff3010" opacity=".25"/>`;
    // 鼻口
    o += S(`M100,${ey + 4} Q97,${ey + 16} 100,${ey + 19} Q103,${ey + 20} 106,${ey + 17}`, dk(s, 0.35), 1.1);
    if (k === "dark") o += S(`M88,${ey + 30} Q100,${ey + 25} 112,${ey + 30}`, "#2a0a0a", 2.4) + `<path d="M90,${ey + 29} l2,-6 l2,5 z M110,${ey + 29} l-2,-6 l-2,5 z" fill="#f0e8c8"/>`;
    else if (!L.b) o += S(`M92,${ey + 28} Q100,${ey + 32} 108,${ey + 28}`, "#9a4a3a", 1.6) + `<ellipse cx="78" cy="${ey + 16}" rx="6" ry="3.5" fill="#ff8a7a" opacity=".22"/><ellipse cx="122" cy="${ey + 16}" rx="6" ry="3.5" fill="#ff8a7a" opacity=".22"/>`;
    return o;
  }
  function flowers(L) { if (!L.fl) return ""; return [[74, 96], [80, 86], [124, 92]].map(([x, y]) => `<g transform="translate(${x},${y})">${[0, 72, 144, 216, 288].map((a) => `<ellipse rx="2.2" ry="4" cy="-3" fill="#fff" transform="rotate(${a})"/>`).join("")}<circle r="1.6" fill="#f0d040"/></g>`).join(""); }

  function humanoid(c, L) {
    const k = c.r, h = L.h || "#4a3a2a";
    let back = item(L, false) + hairBack(L, h);
    if (L.hat === "hood") back += P("M52,250 L56,130 C52,70 78,50 100,50 C122,50 148,70 144,130 L148,250 Z", dk(L.hc || L.c || "#555", 0.15));
    if (L.hat === "wizard" && L.hs !== "long") back += P("M68,104 C64,150 66,190 60,230 L140,230 C134,190 136,150 132,104 Z", L.bc || h);
    let o = back + body(L, k) + head(L, k);
    o += hairFront(L, h) + beard(L, h) + flowers(L) + hat(L) + item(L, true);
    return o;
  }

  /* —— 特殊造型 —— */
  function special(c, L, u) {
    switch (L.sp) {
      case "gollum": return P("M60,252 C62,210 76,186 100,182 C124,186 138,210 140,252 Z", "#b8b8a0", `stroke="#6a6a58" stroke-width="1"`) + S("M86,200 Q100,206 114,200 M84,214 Q100,220 116,214", "#8a8a74", 1) + P("M90,170 L110,170 L112,186 L88,186 Z", "#c8c8b0") +
        P("M58,112 C58,70 78,58 100,58 C122,58 142,70 142,112 C142,146 122,170 100,172 C78,170 58,146 58,112 Z", "#c8c8b0", `stroke="#8a8a74" stroke-width="1.2"`) + P("M58,104 Q38,92 34,74 Q48,96 60,118 Z M142,104 Q162,92 166,74 Q152,96 140,118 Z", "#c0c0a8", `stroke="#8a8a74" stroke-width="1"`) +
        `<ellipse cx="80" cy="112" rx="16" ry="14" fill="#e8f0f4"/><ellipse cx="120" cy="112" rx="16" ry="14" fill="#e8f0f4"/><circle cx="82" cy="113" r="9" fill="#5a9ab8"/><circle cx="118" cy="113" r="9" fill="#5a9ab8"/><circle cx="82" cy="113" r="5" fill="#0a1418"/><circle cx="118" cy="113" r="5" fill="#0a1418"/><circle cx="85" cy="109" r="2.4" fill="#fff"/><circle cx="121" cy="109" r="2.4" fill="#fff"/>` +
        S("M88,150 Q100,156 112,150", "#5a5a48", 1.6) + `<rect x="94" y="150" width="4" height="4" fill="#f4f0d8"/><rect x="103" y="150" width="4" height="4" fill="#f4f0d8"/>` + S("M90,62 Q84,50 80,46 M100,58 Q102,46 98,40 M110,62 Q116,52 124,50", "#3a3a30", 1);
      case "wraith": return P("M40,252 C44,180 60,120 66,84 C70,50 86,34 100,30 C114,34 130,50 134,84 C140,120 156,180 160,252 Z", "#121214", `stroke="#2a2a30" stroke-width="1"`) + S("M70,140 C66,190 62,220 58,250 M130,140 C134,190 138,220 142,250 M100,170 L100,250", "#2a2a30", 1.2) +
        P("M76,124 C74,84 86,64 100,62 C114,64 126,84 124,124 C116,134 84,134 76,124 Z", "#000") + `<ellipse cx="90" cy="104" rx="3" ry="1.6" fill="#c8e0ff" opacity=".7"/><ellipse cx="110" cy="104" rx="3" ry="1.6" fill="#c8e0ff" opacity=".7"/><ellipse cx="100" cy="104" rx="30" ry="22" fill="#6a8ab8" opacity=".08"/>` +
        (L.crown ? P("M76,66 L74,34 L84,52 L92,28 L100,48 L108,28 L116,52 L126,34 L124,66 Q100,58 76,66 Z", "#9aa0a8", `stroke="#3a3a40" stroke-width="1"`) + `<ellipse cx="100" cy="46" rx="34" ry="20" fill="#c8e0ff" opacity=".12"/>` : "") +
        S("M148,250 L162,120", "#9aa0a8", 3.5) + S("M152,140 L172,146", "#3a3a40", 4) + `<path d="M162,120 l-1,-12 l4,10 z" fill="#d8dde2"/>`;
      case "sauron": return P("M30,252 C34,196 56,170 84,164 L116,164 C144,170 166,196 170,252 Z", "#1a1616", `stroke="#3a3030" stroke-width="1.2"`) +
        P("M36,206 C34,180 56,162 82,160 L84,184 C66,186 48,194 36,206 Z M164,206 C166,180 144,162 118,160 L116,184 C134,186 152,194 164,206 Z", "#2a2424", `stroke="#5a4a40" stroke-width="1"`) + S("M40,196 L30,176 M50,186 L44,164 M160,196 L170,176 M150,186 L156,164", "#2a2424", 4) +
        P("M64,140 C58,80 78,50 100,48 C122,50 142,80 136,140 L120,164 L80,164 Z", "#1e1a1a", `stroke="#4a4040" stroke-width="1.2"`) + P("M72,64 L60,18 L84,52 Z M128,64 L140,18 L116,52 Z M92,50 L100,8 L108,50 Z M82,54 L76,24 L92,48 Z M118,54 L124,24 L108,48 Z", "#1e1a1a", `stroke="#4a4040" stroke-width=".8"`) +
        P("M76,104 L124,104 L118,116 L82,116 Z", "#000") + `<ellipse cx="90" cy="110" rx="6" ry="2.4" fill="#ff6a10"/><ellipse cx="110" cy="110" rx="6" ry="2.4" fill="#ff6a10"/><ellipse cx="100" cy="110" rx="30" ry="12" fill="#ff4a10" opacity=".18"/>` + S("M100,120 L100,160 M86,124 L86,154 M114,124 L114,154", "#3a3030", 1.4) +
        `<circle cx="150" cy="232" r="9" fill="#ffd040" opacity=".3"/><circle cx="150" cy="232" r="4.5" fill="none" stroke="#f0c030" stroke-width="2.4"/>`;
      case "eye": return `<ellipse cx="100" cy="120" rx="96" ry="44" fill="#ff7a10" opacity=".25"/><path d="M8,120 Q100,40 192,120 Q100,200 8,120 Z" fill="#ff8a20"/><path d="M28,120 Q100,60 172,120 Q100,180 28,120 Z" fill="#ffc040"/><path d="M50,120 Q100,82 150,120 Q100,158 50,120 Z" fill="#ff6a10"/><ellipse cx="100" cy="120" rx="7" ry="36" fill="#140400"/>` + S("M8,120 Q100,40 192,120 Q100,200 8,120", "#5a1a00", 2) + Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * 6.28; return S(`M${100 + Math.cos(a) * 100},${120 + Math.sin(a) * 50} l${Math.cos(a) * 18},${Math.sin(a) * 12}`, "#ff9030", 3, 'opacity=".5"'); }).join("") + tower(100, 252, 60, 70, "#0c0606", "spikes");
      case "morgoth": return P("M14,252 C18,186 52,160 86,152 L114,152 C148,160 182,186 186,252 Z", "#0e0c0e", `stroke="#2a262a" stroke-width="1.4"`) + P("M24,212 C22,176 56,152 84,150 L86,178 C62,182 40,192 24,212 Z M176,212 C178,176 144,152 116,150 L114,178 C138,182 160,192 176,212 Z", "#1a1618", `stroke="#3a3438" stroke-width="1"`) +
        P("M68,134 C62,78 82,54 100,52 C118,54 138,78 132,134 L116,154 L84,154 Z", "#1a1618", `stroke="#3a3438" stroke-width="1"`) + `<ellipse cx="88" cy="104" rx="5" ry="2" fill="#ff5010"/><ellipse cx="112" cy="104" rx="5" ry="2" fill="#ff5010"/>` +
        P("M64,74 L62,36 L76,58 L86,30 L100,54 L114,30 L124,58 L138,36 L136,74 Q100,62 64,74 Z", "#2a2a2e", `stroke="#5a5a60" stroke-width="1"`) + [78, 100, 122].map((x) => `<circle cx="${x}" cy="66" r="9" fill="#fffbe0" opacity=".25"/><path d="M${x},58 l3,6 l6,2 l-6,2 l-3,6 l-3,-6 l-6,-2 l6,-2 z" fill="#fffbe0"/>`).join("") +
        S("M36,250 L28,140", "#2a2a2e", 6) + P("M10,110 L44,108 L46,146 L12,150 Z", "#2a2a2e", `stroke="#5a5a60" stroke-width="1"`) + S("M14,120 L42,118 M14,134 L42,132", "#5a5a60", 1.4);
      case "balrog": { let s = ""; for (let i = 0; i < 18; i++) { const x = 30 + i * 8, h = 60 + Math.sin(i * 1.7) * 30; s += P(`M${x - 8},200 Q${x},${200 - h} ${x + 4},${200 - h - 20} Q${x + 6},${200 - h} ${x + 10},200 Z`, i % 2 ? "#ff7a20" : "#ffb040", 'opacity=".75"'); }
        return P("M0,110 Q40,40 90,90 L80,150 Q40,120 0,150 Z M200,110 Q160,40 110,90 L120,150 Q160,120 200,150 Z", "#140c0c", 'opacity=".92"') + s + P("M40,252 C44,190 66,160 100,156 C134,160 156,190 160,252 Z", "#2a1410", `stroke="#ff6a10" stroke-width="1.2"`) + S("M70,190 L84,240 M130,190 L116,240 M100,170 L100,250", "#ff7020", 1.6, 'opacity=".7"') +
          P("M70,130 C66,90 82,70 100,70 C118,70 134,90 130,130 C124,152 112,160 100,160 C88,160 76,152 70,130 Z", "#2a1410", `stroke="#ff6a10" stroke-width="1"`) + P("M74,92 Q48,74 46,40 Q60,70 80,80 Z M126,92 Q152,74 154,40 Q140,70 120,80 Z", "#3a2a24") +
          `<ellipse cx="88" cy="114" rx="7" ry="3.4" fill="#ffe060"/><ellipse cx="112" cy="114" rx="7" ry="3.4" fill="#ffe060"/>` + S("M86,140 Q100,150 114,140", "#ffb040", 2) + S("M168,250 Q150,190 176,150 Q190,130 180,110", "#ff9030", 2.4) + S("M150,250 L164,140", "#3a2a24", 4) + P("M156,150 L176,120 L172,160 Z", "#ffa030"); }
      case "dragon": { const c1 = L.c || "#b0342a", c2 = L.c2 || "#e0a040", cd = dk(c1, 0.35);
        return P("M-10,250 C10,190 40,160 70,150 C60,190 64,220 80,250 Z", cd) + P("M150,40 Q200,20 210,80 L210,170 Q180,120 150,110 Z", dk(c1, 0.5), 'opacity=".9"') + S("M156,50 L196,120 M170,44 L206,100 M150,70 L188,150", dk(c1, 0.65), 1.4) +
          P("M40,250 C40,200 60,170 86,150 L120,170 C110,200 104,224 108,250 Z", c1, `stroke="${cd}" stroke-width="1.2"`) + Array.from({ length: 6 }, (_, i) => S(`M${60 + i * 6},${236 - i * 12} q6,4 12,0`, c2, 1.4)).join("") +
          P("M60,118 C58,92 78,70 106,70 C130,70 150,84 164,104 L186,126 Q192,136 182,140 L150,146 Q130,160 104,162 C80,162 62,144 60,118 Z", c1, `stroke="${cd}" stroke-width="1.4"`) +
          P("M150,146 L182,140 Q170,152 150,154 Z", dk(c1, 0.2)) + Array.from({ length: 5 }, (_, i) => `<path d="M${156 + i * 6},140 l2,6 l2,-6 z" fill="#f4f0e0"/>`).join("") +
          P("M76,80 Q52,40 30,30 Q60,52 70,92 Z M98,72 Q88,30 70,10 Q100,36 108,72 Z", c2, `stroke="${cd}" stroke-width="1"`) + `<ellipse cx="116" cy="102" rx="10" ry="6" fill="#ffe040"/><ellipse cx="116" cy="102" rx="2.2" ry="5.6" fill="#140400"/>` + `<circle cx="178" cy="128" r="1.6" fill="#140400"/>` +
          Array.from({ length: 10 }, (_, i) => S(`M${70 + (i % 5) * 14},${120 + Math.floor(i / 5) * 14} q6,5 12,0`, cd, 0.9)).join("") + `<path d="M190,138 q10,-6 16,2 q-8,-2 -12,4" fill="#ff8a20" opacity=".8"/>`; }
      case "spider": { let legs = ""; [[-1, 0], [1, 0]].forEach(([sx]) => [0, 1, 2, 3].forEach((i) => { const y = 120 + i * 18; legs += S(`M${100 + sx * 30},${y} Q${100 + sx * (70 + i * 8)},${y - 60 + i * 10} ${100 + sx * (96 - i * 4)},${y + 40 + i * 20}`, "#1a1a1e", 5); }));
        return legs + `<ellipse cx="100" cy="196" rx="62" ry="56" fill="#141418" stroke="#3a3a44" stroke-width="1.2"/>` + S("M70,180 Q100,200 130,180 M76,210 Q100,226 124,210", "#3a3a44", 1.2) + `<ellipse cx="100" cy="124" rx="36" ry="30" fill="#1e1e24" stroke="#3a3a44" stroke-width="1"/>` +
          [[86, 116, 5], [114, 116, 5], [94, 106, 3.4], [106, 106, 3.4], [78, 126, 2.6], [122, 126, 2.6], [90, 128, 2.2], [110, 128, 2.2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#9ae060"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.3}" fill="#fff"/>`).join("") + P("M90,146 Q86,160 92,166 L96,148 Z M110,146 Q114,160 108,166 L104,148 Z", "#c8c8b0"); }
      case "ent": return P("M40,252 C44,200 56,170 70,150 L130,150 C144,170 156,200 160,252 Z", "#6a5038", `stroke="#3a2a1a" stroke-width="1.4"`) + S("M66,170 C64,200 60,230 58,250 M88,160 C86,200 86,230 84,250 M112,160 C114,200 114,230 116,250 M134,170 C136,200 140,230 142,250", "#4a3624", 1.6) +
        P("M64,120 C60,70 76,40 100,38 C124,40 140,70 136,120 C134,148 120,164 100,166 C80,164 66,148 64,120 Z", "#7a5c40", `stroke="#3a2a1a" stroke-width="1.4"`) + S("M76,70 C74,100 76,130 80,150 M124,70 C126,100 124,130 120,150 M100,44 L100,70", "#5a4230", 1.2) +
        `<ellipse cx="86" cy="104" rx="7" ry="5" fill="#2a1a0a"/><ellipse cx="114" cy="104" rx="7" ry="5" fill="#2a1a0a"/><circle cx="86" cy="104" r="3.2" fill="#a8c860"/><circle cx="114" cy="104" r="3.2" fill="#a8c860"/>` + S("M76,94 Q86,88 96,94 M104,94 Q114,88 124,94", "#3a2a1a", 3) +
        P("M74,128 C72,160 82,200 100,214 C118,200 128,160 126,128 C116,140 84,140 74,128 Z", "#5a7a3a") + S("M86,140 L88,196 M100,142 L100,208 M114,140 L112,196", "#3a5a2a", 1) +
        Array.from({ length: 22 }, (_, i) => `<ellipse cx="${(70 + (i * 37) % 64).toFixed(0)}" cy="${(30 + (i * 13) % 30).toFixed(0)}" rx="6" ry="3" fill="${i % 2 ? "#5a8a3a" : "#7aa04a"}" transform="rotate(${(i * 47) % 180} ${(70 + (i * 37) % 64).toFixed(0)} ${(30 + (i * 13) % 30).toFixed(0)})"/>`).join("") + S("M64,72 Q40,50 30,30 M40,52 L28,50 M136,72 Q160,50 170,30 M160,52 L172,50", "#6a5038", 4);
    }
    return "";
  }

  function frame(u, k) {
    const gold = k === "dark" ? "#8a6a5a" : "#c8a050";
    return `<rect x="3" y="3" width="194" height="244" rx="10" fill="none" stroke="${gold}" stroke-width="3"/><rect x="8" y="8" width="184" height="234" rx="7" fill="none" stroke="${gold}" stroke-width=".8" opacity=".7"/>` +
      [[8, 8, 0], [192, 8, 90], [192, 242, 180], [8, 242, 270]].map(([x, y, a]) => `<g transform="translate(${x},${y}) rotate(${a})">${S("M0,18 Q0,0 18,0 M4,24 Q4,4 24,4", gold, 1.4)}<circle cx="6" cy="6" r="2.4" fill="${gold}"/></g>`).join("");
  }

  return function (c) {
    if (!c) return "";
    if (cache[c.id]) return cache[c.id];
    const u = "pt" + uid++, L = c.look || {}, r = rnd(c.id), sk = SC[c.id] || RACE_SC[c.r] || "gondor", sc = scene(sk, u, r);
    const fig = L.sp ? special(c, L, u) : humanoid(c, L);
    const svg = `<svg class="portrait" viewBox="0 0 200 250" role="img" aria-label="${c.n}"><defs>${sc.defs}<radialGradient id="${u}v" cx=".5" cy=".42" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient><clipPath id="${u}c"><rect x="3" y="3" width="194" height="244" rx="10"/></clipPath></defs>` +
      `<g clip-path="url(#${u}c)">${sc.g}<g class="pt-fig">${fig}</g><rect width="200" height="250" fill="url(#${u}v)"/></g>${frame(u, c.r)}</svg>`;
    return (cache[c.id] = svg);
  };
})();
