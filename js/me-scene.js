/* 中洲纪年 · 关键时刻的场景画
 * window.ME_SCENE(m, figs) → <svg viewBox="0 0 1200 520">…</svg>
 *   m.mood 决定天色与粒子，m.art 决定远景/中景，figs = 人物 Q 版 id（引用地图里的 #chb-<id> 符号），站在地面线上。
 * 全部是原创矢量示意画。
 */
window.ME_SCENE = (function () {
  const W = 1200, H = 520;
  const BIG = { morgoth: 1.6, balrog: 1.45, smaug: 1.5, glaurung: 1.4, treebeard: 1.4, shelob: 1.3, sauron: 1.3, witchking: 1.15, eye: 1.3 };
  const MOOD = {
    fire:  { sky: ["#1a0703", "#5a160a", "#c4521e"], fog: "#ff9a40", land: "#1c0c08", p: "ember" },
    dark:  { sky: ["#0a0910", "#241e30", "#4d4060"], fog: "#9a84c0", land: "#08070b", p: "dust" },
    light: { sky: ["#f3e2a8", "#fbf0cc", "#fffaea"], fog: "#fff6d0", land: "#6d6040", p: "mote" },
    sea:   { sky: ["#0c2433", "#2f5f73", "#9cc2c6"], fog: "#d8eef0", land: "#0f2a36", p: "spray" },
    storm: { sky: ["#101319", "#262b35", "#4b5260"], fog: "#9aa4b4", land: "#11141a", p: "rain" },
    dawn:  { sky: ["#251d3a", "#7a4a5c", "#f0a060"], fog: "#ffd29a", land: "#21182a", p: "mote" },
    night: { sky: ["#03050f", "#0c1430", "#1d2c52"], fog: "#7c93c8", land: "#060914", p: "star" },
    gold:  { sky: ["#2e2008", "#7a5a1c", "#e6bb5a"], fog: "#ffe39a", land: "#2a1c08", p: "mote" },
    blood: { sky: ["#150303", "#4a0d08", "#8c2412"], fog: "#e05030", land: "#140505", p: "ember" },
    ice:   { sky: ["#9fb6c6", "#cfdde6", "#f2f6f8"], fog: "#ffffff", land: "#5b6f7c", p: "snow" },
  };
  // 每种场景：画法 + 人物站位（地面 y 与 x 范围）
  const ART = {
    bridge: (c) => ({ gy: 330, x0: 380, x1: 820, s:
      `<path d="M0 520V250L120 260L200 300L300 330L330 520Z" fill="${c.land}"/><path d="M1200 520V240L1080 262L980 300L880 330L860 520Z" fill="${c.land}"/>
       <ellipse cx="600" cy="560" rx="420" ry="190" fill="url(#gFog)" opacity=".9"/><g transform="translate(150 200) scale(.75 .62)">${flames(c)}</g>
       <path d="M300 330Q600 300 900 330L900 338Q600 312 300 338Z" fill="${c.land}"/>
       ${col(70, 80, 360, c.land)}${col(1100, 80, 360, c.land)}${col(190, 40, 260, c.land, .7)}${col(1000, 40, 260, c.land, .7)}` }),
    gate: (c) => ({ gy: 470, x0: 160, x1: 1040, s:
      `<path d="M0 300L220 120L360 260L600 150L840 260L980 110L1200 300V520H0Z" fill="${c.land}" opacity=".55"/>
       <rect x="420" y="170" width="90" height="300" fill="${c.land}"/><rect x="690" y="170" width="90" height="300" fill="${c.land}"/>
       <rect x="500" y="250" width="200" height="220" fill="${c.land}" opacity=".9"/><path d="M520 470V300H680V470" fill="none" stroke="${c.fog}" stroke-opacity=".25" stroke-width="3"/>
       ${teeth(420, 170, 90, c.land)}${teeth(690, 170, 90, c.land)}<rect x="0" y="470" width="1200" height="50" fill="${c.land}"/>` }),
    tower: (c) => ({ gy: 470, x0: 160, x1: 1040, s:
      `<path d="M0 380Q300 330 600 360T1200 350V520H0Z" fill="${c.land}" opacity=".6"/>
       <path d="M560 470L572 120L548 70L590 96L600 40L610 96L652 70L628 120L640 470Z" fill="${c.land}"/>
       <rect x="0" y="470" width="1200" height="50" fill="${c.land}"/>` }),
    mountain: (c) => ({ gy: 470, x0: 140, x1: 1060, s:
      `<path d="M0 420L180 300L300 360L470 190L540 140L610 150L700 210L860 330L1000 280L1200 400V520H0Z" fill="${c.land}"/>
       <path d="M540 140Q575 120 610 150" stroke="#ff7a2a" stroke-width="6" fill="none"/><path d="M575 140Q560 230 520 300" stroke="#ff5a1a" stroke-width="3" fill="none" opacity=".8"/>
       <ellipse cx="575" cy="120" rx="80" ry="40" fill="#ff6a20" opacity=".25"/><rect x="0" y="470" width="1200" height="50" fill="${c.land}"/>` }),
    sea: (c) => ({ gy: 460, x0: 200, x1: 1000, s:
      `${waves(360, c)}<path d="M0 450Q200 430 420 455T820 450T1200 448V520H0Z" fill="${c.land}"/>` }),
    ship: (c) => ({ gy: 470, x0: 120, x1: 460, s:
      `${waves(380, c)}<g transform="translate(760 330)"><path d="M-150 40Q0 90 150 40L130 70Q0 110-130 70Z" fill="${c.land}"/><path d="M0 40V-170" stroke="${c.land}" stroke-width="7"/>
       <path d="M6-160Q90-90 10 20Z" fill="#f2efe6" opacity=".9"/><path d="M-6-150Q-80-80-6 20Z" fill="#e8e2d2" opacity=".75"/><circle cx="0" cy="-185" r="9" fill="#fff8d0"/></g>
       <path d="M0 470Q300 440 600 470T1200 466V520H0Z" fill="${c.land}"/>` }),
    throne: (c) => ({ gy: 460, x0: 220, x1: 980, s:
      `${[140, 300, 900, 1060].map((x) => `<rect x="${x - 26}" y="60" width="52" height="400" fill="${c.land}" opacity=".85"/>`).join("")}
       <path d="M520 460V190L600 120L680 190V460Z" fill="${c.land}"/><rect x="0" y="460" width="1200" height="60" fill="${c.land}"/>
       <path d="M300 460L600 330L900 460" fill="${c.fog}" opacity=".08"/>` }),
    cave: (c) => ({ gy: 450, x0: 300, x1: 900, s:
      `<rect width="1200" height="520" fill="${c.land}" opacity=".7"/><path d="M180 520Q160 200 600 130Q1040 200 1020 520Z" fill="#000" opacity=".55"/>
       <ellipse cx="600" cy="460" rx="300" ry="30" fill="${c.fog}" opacity=".12"/>
       <path d="M0 0H1200V90Q900 150 600 110T0 120Z" fill="${c.land}"/>${[250, 380, 520, 700, 860, 980].map((x, i) => `<path d="M${x} ${100 + (i % 3) * 10}l14 ${50 + (i % 2) * 40}l14 -${50 + (i % 2) * 40}Z" fill="${c.land}"/>`).join("")}
       <rect x="0" y="450" width="1200" height="70" fill="${c.land}"/>` }),
    field: (c) => ({ gy: 450, x0: 140, x1: 1060, s:
      `<path d="M0 360Q300 330 600 350T1200 340V520H0Z" fill="${c.land}" opacity=".45"/>
       ${spears(c)}<path d="M0 450Q300 420 600 440T1200 430V520H0Z" fill="${c.land}"/>` }),
    forest: (c) => ({ gy: 460, x0: 260, x1: 940, s:
      `${trees(0, 380, 26, c.land, .5)}${trees(-20, 440, 14, c.land, 1)}<rect x="0" y="460" width="1200" height="60" fill="${c.land}"/>` }),
    fire: (c) => ({ gy: 460, x0: 200, x1: 1000, s:
      `${flames(c)}<rect x="0" y="460" width="1200" height="60" fill="${c.land}"/>` }),
    ring: (c) => ({ gy: 470, x0: 120, x1: 1080, s:
      `<circle cx="600" cy="230" r="120" fill="none" stroke="#f0c050" stroke-width="22"/><circle cx="600" cy="230" r="120" fill="none" stroke="#fff3b0" stroke-width="4" opacity=".7"/>
       <circle cx="600" cy="230" r="190" fill="url(#gFog)" opacity=".55"/><path d="M0 470Q600 430 1200 470V520H0Z" fill="${c.land}"/>` }),
    wall: (c) => ({ gy: 470, x0: 120, x1: 1080, s:
      `<path d="M0 270L240 300L300 210L420 230L470 300H1200V520H0Z" fill="${c.land}" opacity=".55"/>
       <rect x="250" y="200" width="140" height="270" fill="${c.land}"/>${teeth(250, 200, 140, c.land)}
       <rect x="380" y="300" width="820" height="60" fill="${c.land}"/>${teeth(380, 300, 820, c.land)}<rect x="0" y="470" width="1200" height="50" fill="${c.land}"/>` }),
    river: (c) => ({ gy: 470, x0: 140, x1: 1060, s:
      `<path d="M0 330L260 250L420 320L620 230L860 310L1200 240V520H0Z" fill="${c.land}" opacity=".5"/>
       <path d="M480 520Q560 420 600 360T640 300" stroke="${c.fog}" stroke-width="60" fill="none" opacity=".35"/>
       <path d="M0 470Q300 450 520 470L700 470Q900 450 1200 470V520H0Z" fill="${c.land}"/>` }),
  };
  function col(x, w, h, f, o = 1) { return `<path d="M${x - w / 2} 520V${520 - h}L${x - w / 2 + 6} ${500 - h}H${x + w / 2 - 6}L${x + w / 2} ${520 - h}V520Z" fill="${f}" opacity="${o}"/>`; }
  function teeth(x, y, w, f) { let s = ""; for (let i = 0; i < w; i += 22) s += `<rect x="${x + i}" y="${y - 14}" width="12" height="14" fill="${f}"/>`; return s; }
  function waves(y, c) { let s = ""; for (let r = 0; r < 6; r++) { const yy = y + r * 18; s += `<path d="M0 ${yy}${Array.from({ length: 13 }, (_, i) => `Q${i * 100 + 50} ${yy - 8} ${i * 100 + 100} ${yy}`).join("")}" stroke="${c.fog}" stroke-opacity="${0.35 - r * 0.04}" fill="none" stroke-width="2"/>`; } return `<rect y="${y - 6}" width="1200" height="${520 - y}" fill="${c.land}" opacity=".5"/>` + s; }
  function spears(c) { let s = ""; for (let i = 0; i < 46; i++) { const x = 20 + i * 26 + ((i * 37) % 11), h = 60 + ((i * 53) % 40); s += `<path d="M${x} 440V${440 - h}" stroke="${c.land}" stroke-width="3"/><path d="M${x - 4} ${444 - h}L${x} ${430 - h}L${x + 4} ${444 - h}Z" fill="${c.land}"/>`; if (i % 9 === 4) s += `<path d="M${x} ${440 - h}h34l-8 10l8 10h-34" fill="${c.fog}" opacity=".6"/>`; } return s; }
  function trees(dx, y, n, f, o) { let s = ""; for (let i = 0; i < n; i++) { const x = dx + (i * 1200) / (n - 1), h = 140 + ((i * 71) % 90), w = 40 + ((i * 29) % 30); s += `<path d="M${x} ${y - h}L${x + w} ${y}H${x - w}Z" fill="${f}" opacity="${o}"/>`; } return s; }
  function flames(c) { let s = ""; for (let i = 0; i < 16; i++) { const x = i * 80 + 20, h = 120 + ((i * 47) % 120); s += `<path d="M${x - 40} 470Q${x - 30} ${470 - h * 0.6} ${x} ${470 - h}Q${x + 30} ${470 - h * 0.6} ${x + 40} 470Z" fill="#ff${(60 + (i % 4) * 30).toString(16)}20" opacity=".55" class="sc-fl" style="animation-delay:${-i * 0.23}s"/>`; } return s; }
  function particles(kind, c) {
    let s = ""; const N = { ember: 40, dust: 24, mote: 30, spray: 26, rain: 70, star: 70, snow: 60 }[kind] || 0;
    for (let i = 0; i < N; i++) {
      const x = (i * 263) % W, y = (i * 151) % H, d = ((i * 7) % 10) / 2, du = 4 + ((i * 13) % 7);
      if (kind === "star") s += `<circle cx="${x}" cy="${(y * 0.6) | 0}" r="${0.6 + (i % 3) * 0.5}" fill="#fff" class="sc-tw" style="animation-delay:-${d}s"/>`;
      else if (kind === "rain") s += `<path d="M${x} ${y}l-10 26" stroke="#c8d2e0" stroke-opacity=".35" class="sc-rain" style="animation-delay:-${d / 5}s;animation-duration:${0.5 + (i % 4) * 0.1}s"/>`;
      else s += `<circle cx="${x}" cy="${y}" r="${kind === "snow" ? 2.2 : kind === "ember" ? 1.8 : 1.4}" fill="${kind === "ember" ? "#ffb050" : kind === "snow" ? "#fff" : c.fog}" class="sc-p sc-${kind}" style="animation-delay:-${d}s;animation-duration:${du}s" opacity=".8"/>`;
    }
    return s;
  }
  return function (m, figs) {
    const c = MOOD[m.mood] || MOOD.dark, a = (ART[m.art] || ART.field)(c);
    const u = "sc" + Math.random().toString(36).slice(2, 7);
    const n = figs.length, sc = n > 2 ? 2.4 : 3;
    const gap = n > 1 ? Math.min(260, (a.x1 - a.x0) / (n - 1)) : 0, cx0 = (a.x0 + a.x1) / 2 - (gap * (n - 1)) / 2;
    const fig = figs.map((id, i) => {
      const x = n > 1 ? cx0 + i * gap : (a.x0 + a.x1) / 2, flip = n > 1 && i >= n / 2 ? -1 : 1, k = BIG[id] || 1;
      return `<g class="sc-fig" style="animation-delay:${0.5 + i * 0.25}s"><ellipse cx="${x}" cy="${a.gy + 4}" rx="${22 * sc}" ry="${5 * sc}" fill="#000" opacity=".35"/>` +
        `<use href="#chb-${id}" transform="translate(${x} ${a.gy}) scale(${sc * k * flip} ${sc * k})"/></g>`;
    }).join("");
    const s = a.s.replace(/url\(#gFog\)/g, `url(#${u}f)`);
    return `<svg class="scene" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
      <linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.sky[0]}"/><stop offset=".6" stop-color="${c.sky[1]}"/><stop offset="1" stop-color="${c.sky[2]}"/></linearGradient>
      <radialGradient id="${u}f"><stop offset="0" stop-color="${c.fog}" stop-opacity=".9"/><stop offset="1" stop-color="${c.fog}" stop-opacity="0"/></radialGradient>
      <radialGradient id="${u}v" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#${u}s)"/><ellipse cx="600" cy="${a.gy - 60}" rx="520" ry="200" fill="url(#${u}f)" opacity=".35" class="sc-glow"/>
      <g class="sc-far">${particles(c.p === "rain" || c.p === "star" ? c.p : "", c)}</g>
      <g class="sc-mid">${s}</g>${fig}<g class="sc-near">${c.p !== "rain" && c.p !== "star" ? particles(c.p, c) : ""}</g>
      <rect width="${W}" height="${H}" fill="url(#${u}v)"/></svg>`;
  };
})();
