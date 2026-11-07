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
    ghost: { sky: ["#030b09", "#0b241e", "#18483b"], fog: "#66f0c2", land: "#06120f", p: "mote" },
  };
  // 每种场景：画法 + 人物站位（地面 y 与 x 范围）
  const ART = {
    bridge: (c) => ({ gy: 330, x0: 380, x1: 820, s:
      `<path d="M0 160L200 90L460 140L740 80L1000 130L1200 150V0H0Z" fill="${c.land}" opacity=".45"/>
       ${col(190, 44, 340, c.land, .55)}${col(1010, 44, 340, c.land, .55)}${col(340, 32, 280, c.land, .35)}${col(860, 32, 280, c.land, .35)}
       <path d="M0 520V240L110 252L210 296L305 330L335 520Z" fill="${c.land}"/><path d="M1200 520V235L1090 256L990 296L895 330L865 520Z" fill="${c.land}"/>
       <ellipse cx="600" cy="540" rx="440" ry="210" fill="url(#gFog)" opacity=".92"/><g transform="translate(150 200) scale(.75 .62)">${flames(c)}</g>
       <path d="M295 330Q600 296 905 330L905 344Q600 314 295 344Z" fill="${c.land}" stroke="${c.fog}" stroke-opacity=".35" stroke-width="1.5"/>
       <path d="M320 520Q440 350 600 338Q760 350 880 520" fill="none" stroke="${c.land}" stroke-width="18" opacity=".7"/>
       ${col(70, 86, 400, c.land)}${col(1130, 86, 400, c.land)}` }),
    gate: (c) => ({ gy: 470, x0: 160, x1: 1040, s:
      `<path d="M0 320L180 150L330 250L520 110L680 180L860 95L1030 230L1200 170V520H0Z" fill="${c.land}" opacity=".38"/>
       <path d="M0 370L240 230L420 310L780 300L980 210L1200 350V520H0Z" fill="${c.land}" opacity=".65"/>
       <rect x="260" y="290" width="680" height="180" fill="${c.land}" opacity=".85"/>${teeth(260, 290, 680, c.land)}
       <path d="M410 470L424 155H516L526 470Z" fill="${c.land}"/><path d="M674 470L684 155H776L790 470Z" fill="${c.land}"/>
       ${teeth(422, 155, 96, c.land)}${teeth(682, 155, 96, c.land)}
       <rect x="510" y="235" width="180" height="235" fill="${c.land}"/>${teeth(510, 235, 180, c.land)}
       <path d="M538 470V320Q600 265 662 320V470Z" fill="#050406" stroke="${c.fog}" stroke-opacity=".35" stroke-width="2.5"/>
       <path d="M600 282V470M538 355H662M538 410H662" stroke="${c.land}" stroke-width="3" opacity=".85"/>
       <rect x="0" y="470" width="1200" height="50" fill="${c.land}"/>` }),
    tower: (c) => ({ gy: 470, x0: 160, x1: 1040, s:
      `<path d="M0 350L220 220L410 310L640 240L890 190L1200 330V520H0Z" fill="${c.land}" opacity=".35"/>
       <path d="M0 400Q300 340 600 370T1200 355V520H0Z" fill="${c.land}" opacity=".68"/>
       <circle cx="600" cy="150" r="110" fill="url(#gFog)" opacity=".45"/>
       <path d="M542 470L558 290L548 280L566 140L544 72L588 102L600 36L612 102L656 72L634 140L652 280L642 290L658 470Z" fill="${c.land}"/>
       <path d="M582 470V120M618 470V120" stroke="${c.fog}" stroke-opacity=".16" stroke-width="1.5"/>
       <ellipse cx="600" cy="78" rx="14" ry="6" fill="${c.fog}" opacity=".75"/>
       <rect x="0" y="470" width="1200" height="50" fill="${c.land}"/>` }),
    mountain: (c) => ({ gy: 470, x0: 140, x1: 1060, s:
      `<path d="M0 380L190 250L350 320L560 180L810 290L1020 210L1200 340V520H0Z" fill="${c.land}" opacity=".42"/>
       <ellipse cx="575" cy="115" rx="140" ry="65" fill="#ff6a20" opacity=".32"/>
       <path d="M510 140Q460 60 360 20Q520 10 640 15Q760 40 640 145Z" fill="#1a100e" opacity=".65"/>
       <path d="M0 430L180 305L310 365L475 185L542 135L612 145L705 210L860 335L1010 280L1200 405V520H0Z" fill="${c.land}"/>
       <path d="M542 135Q577 118 612 145" stroke="#ff9a3a" stroke-width="7" fill="none"/>
       <path d="M575 136Q560 225 515 310Q485 375 430 440" stroke="#ff5a1a" stroke-width="4.5" fill="none" opacity=".85"/>
       <path d="M590 142Q615 220 655 290" stroke="#ff7a2a" stroke-width="2.5" fill="none" opacity=".7"/>
       <rect x="0" y="470" width="1200" height="50" fill="${c.land}"/>` }),
    sea: (c) => ({ gy: 460, x0: 200, x1: 1000, s:
      `<circle cx="600" cy="240" r="85" fill="${c.fog}" opacity=".22"/><circle cx="600" cy="240" r="46" fill="${c.fog}" opacity=".45"/>
       <path d="M0 355L160 310L340 345L510 330L780 350L990 300L1200 355Z" fill="${c.land}" opacity=".4"/>
       ${waves(355, c)}
       <path d="M0 450Q200 426 420 455T820 448T1200 445V520H0Z" fill="${c.land}"/>` }),
    ship: (c) => ({ gy: 470, x0: 120, x1: 480, s:
      `<circle cx="880" cy="175" r="70" fill="${c.fog}" opacity=".28"/>
       ${waves(375, c)}
       <g transform="translate(770 332)">
         <path d="M-165 36Q-185 8-168-18Q-155-32-145-18Q-152 8-135 38Q0 82 145 34Q168 12 182-22Q192-4 172 28L138 68Q0 106-135 68Z" fill="${c.land}"/>
         <path d="M-125 48Q0 82 125 46" stroke="${c.fog}" stroke-opacity=".35" stroke-width="2" fill="none"/>
         <path d="M0 42V-175" stroke="${c.land}" stroke-width="6.5"/>
         <path d="M6-165Q108-92 14 24Q-4-40 6-165Z" fill="#f7f3e6" opacity=".92"/>
         <path d="M-6-152Q-92-82-8 24Q4-36-6-152Z" fill="#e8e0cc" opacity=".78"/>
         <circle cx="0" cy="-186" r="16" fill="${c.fog}" opacity=".35"/><circle cx="0" cy="-186" r="7" fill="#fffbe0"/>
       </g>
       <path d="M0 468Q280 436 580 468T1200 464V520H0Z" fill="${c.land}"/>` }),
    throne: (c) => ({ gy: 460, x0: 220, x1: 980, s:
      `<path d="M120 460V80Q360 10 600 80Q840 10 1080 80V460" fill="none" stroke="${c.land}" stroke-width="18" opacity=".4"/>
       <path d="M360 0L490 460H710L840 0Z" fill="url(#gFog)" opacity=".18"/>
       ${[130, 290, 910, 1070].map((x) => col(x, 54, 460, c.land, .88)).join("")}
       <path d="M430 460L460 415H740L770 460Z" fill="${c.land}"/>
       <path d="M475 415L495 380H705L725 415Z" fill="${c.land}" stroke="${c.fog}" stroke-opacity=".22"/>
       <path d="M535 380V180L565 145L600 98L635 145L665 180V380Z" fill="${c.land}" stroke="${c.fog}" stroke-opacity=".28" stroke-width="1.5"/>
       <circle cx="600" cy="165" r="18" fill="none" stroke="${c.fog}" stroke-opacity=".35" stroke-width="2"/>
       <rect x="0" y="460" width="1200" height="60" fill="${c.land}"/>` }),
    cave: (c) => ({ gy: 450, x0: 280, x1: 920, s:
      `<rect width="1200" height="520" fill="${c.land}" opacity=".78"/>
       <path d="M140 520Q130 170 600 110Q1070 170 1060 520Z" fill="#020204" opacity=".68"/>
       <ellipse cx="600" cy="452" rx="340" ry="34" fill="${c.fog}" opacity=".16"/>
       <ellipse cx="600" cy="462" rx="220" ry="16" fill="${c.fog}" opacity=".25"/>
       <path d="M0 0H1200V95Q920 155 600 112T0 125Z" fill="${c.land}"/>
       <path d="M0 520V110L190 210L150 370L230 450H0ZM1200 520V110L1010 220L1050 365L970 450H1200Z" fill="${c.land}"/>
       ${[220, 330, 460, 580, 710, 830, 950].map((x, i) => `<path d="M${x} ${95 + (i % 3) * 12}l${12 + (i % 2) * 6} ${65 + (i % 3) * 32}l${12 + (i % 2) * 6} -${65 + (i % 3) * 32}Z" fill="${c.land}"/>`).join("")}
       <rect x="0" y="450" width="1200" height="70" fill="${c.land}"/>` }),
    field: (c) => ({ gy: 450, x0: 140, x1: 1060, s:
      `<path d="M0 320L210 245L450 305L720 230L980 295L1200 250V520H0Z" fill="${c.land}" opacity=".28"/>
       <path d="M0 365Q300 330 600 352T1200 340V520H0Z" fill="${c.land}" opacity=".52"/>
       ${spears(c)}
       <path d="M0 450Q300 422 600 442T1200 432V520H0Z" fill="${c.land}"/>` }),
    forest: (c) => ({ gy: 460, x0: 240, x1: 960, s:
      `<g opacity=".16" fill="${c.fog}"><polygon points="280,0 420,460 520,460 340,0"/><polygon points="560,0 720,460 830,460 630,0"/><polygon points="820,0 980,460 1060,460 870,0"/></g>
       ${trees(10, 395, 28, c.land, .38)}${trees(-15, 430, 18, c.land, .68)}${trees(-30, 462, 12, c.land, 1)}
       <rect x="0" y="460" width="1200" height="60" fill="${c.land}"/>` }),
    fire: (c) => ({ gy: 460, x0: 200, x1: 1000, s:
      `<path d="M0 350L200 230L430 310L690 200L940 290L1200 220V520H0Z" fill="${c.land}" opacity=".45"/>
       ${flames(c)}
       <path d="M0 460L260 448L540 462L860 446L1200 460V520H0Z" fill="${c.land}"/>
       <path d="M180 475Q420 462 620 482T1040 472" stroke="#ff7a20" stroke-width="3" fill="none" opacity=".65"/>` }),
    ring: (c) => ({ gy: 470, x0: 120, x1: 1080, s:
      `<path d="M0 370L240 280L510 350L820 270L1200 360V520H0Z" fill="${c.land}" opacity=".38"/>
       <circle cx="600" cy="225" r="210" fill="url(#gFog)" opacity=".6"/>
       <circle cx="600" cy="225" r="126" fill="none" stroke="#c88218" stroke-width="28" opacity=".85"/>
       <circle cx="600" cy="225" r="126" fill="none" stroke="#f5cb5c" stroke-width="20"/>
       <circle cx="600" cy="225" r="118" fill="none" stroke="#fff6b8" stroke-width="3" opacity=".8"/>
       <circle cx="600" cy="225" r="126" fill="none" stroke="#fffae0" stroke-width="2.5" stroke-dasharray="5 9 12 7 4 11" opacity=".85"/>
       <path d="M0 470Q600 426 1200 470V520H0Z" fill="${c.land}"/>` }),
    wall: (c) => ({ gy: 470, x0: 120, x1: 1080, s:
      `<path d="M0 245L190 140L390 230L640 120L910 220L1200 160V520H0Z" fill="${c.land}" opacity=".38"/>
       <path d="M0 290L240 310L300 210L420 230L470 305H1200V520H0Z" fill="${c.land}" opacity=".62"/>
       <rect x="235" y="185" width="155" height="285" fill="${c.land}"/>${teeth(235, 185, 155, c.land)}
       <path d="M295 185L302 95L312 75L322 95L329 185Z" fill="${c.land}"/>
       <rect x="380" y="295" width="820" height="175" fill="${c.land}"/>${teeth(380, 295, 820, c.land)}
       <path d="M390 335H1190" stroke="${c.fog}" stroke-opacity=".2" stroke-width="2"/>
       <path d="M560 470Q610 385 660 470Z" fill="#050508" opacity=".75"/>
       <rect x="0" y="470" width="1200" height="50" fill="${c.land}"/>` }),
    river: (c) => ({ gy: 470, x0: 140, x1: 1060, s:
      `<path d="M0 320L240 220L430 305L620 205L860 295L1060 210L1200 265V520H0Z" fill="${c.land}" opacity=".45"/>
       <path d="M460 225L472 150L490 125L505 155L512 225ZM690 225L698 150L715 125L732 155L740 225Z" fill="${c.land}" opacity=".75"/>
       <path d="M430 520Q530 415 585 350T615 265L645 265Q635 315 665 365T790 520Z" fill="${c.fog}" opacity=".38"/>
       <path d="M490 500Q565 420 605 355M550 510Q605 430 630 355" stroke="${c.fog}" stroke-width="2" fill="none" opacity=".55"/>
       <path d="M0 470Q280 446 500 470L720 470Q920 446 1200 470V520H0Z" fill="${c.land}"/>` }),
    erech: (c) => ({ gy: 458, x0: 220, x1: 980, s:
      `<path d="M0 320L170 140L360 260L600 95L840 250L1030 130L1200 310V520H0Z" fill="${c.land}" opacity=".45"/>
       <path d="M555 260L600 155L645 260Z" fill="#020605" stroke="${c.fog}" stroke-opacity=".35" stroke-width="1.5"/>
       <ellipse cx="600" cy="365" rx="380" ry="95" fill="url(#gFog)" opacity=".55"/>
       ${Array.from({ length: 34 }, (_, i) => { const x = 90 + i * 31 + (i % 3) * 5, h = 78 + (i % 5) * 16; return `<path d="M${x} 445L${x - 2} ${445 - h}" stroke="${c.fog}" stroke-opacity=".42" stroke-width="2"/><path d="M${x - 5} ${448 - h}L${x - 2} ${432 - h}L${x + 1} ${448 - h}Z" fill="${c.fog}" opacity=".6"/>`; }).join("")}
       <path d="M0 462Q320 420 600 408Q880 420 1200 462V520H0Z" fill="${c.land}"/>
       <ellipse cx="600" cy="378" rx="68" ry="62" fill="#050807" stroke="${c.fog}" stroke-opacity=".55" stroke-width="2.2"/>
       <ellipse cx="580" cy="356" rx="24" ry="14" fill="${c.fog}" opacity=".18" transform="rotate(-25 580 356)"/>` }),
  };
  function col(x, w, h, f, o = 1) {
    const hw = w / 2, y0 = 520 - h;
    return `<g fill="${f}" opacity="${o}"><path d="M${x - hw - 8} 520L${x - hw} 496V${y0 + 18}L${x - hw - 10} ${y0}H${x + hw + 10}L${x + hw} ${y0 + 18}V496L${x + hw + 8} 520Z"/><path d="M${x - hw * 0.45} ${y0 + 24}V492M${x + hw * 0.45} ${y0 + 24}V492" stroke="#000" stroke-opacity=".28" stroke-width="2.5"/></g>`;
  }
  function teeth(x, y, w, f) { let s = ""; for (let i = 0; i < w - 8; i += 22) s += `<rect x="${x + i}" y="${y - 14}" width="13" height="15" fill="${f}"/>`; return s; }
  function waves(y, c) { let s = ""; for (let r = 0; r < 7; r++) { const yy = y + r * 16; s += `<path d="M0 ${yy}${Array.from({ length: 13 }, (_, i) => `Q${i * 100 + 50} ${yy - 7 - (r % 2) * 3} ${i * 100 + 100} ${yy}`).join("")}" stroke="${c.fog}" stroke-opacity="${(0.38 - r * 0.045).toFixed(2)}" fill="none" stroke-width="${1.5 + r * 0.2}"/>`; } return `<rect y="${y - 6}" width="1200" height="${520 - y}" fill="${c.land}" opacity=".55"/>` + s; }
  function spears(c) { let s = ""; for (let i = 0; i < 48; i++) { const x = 18 + i * 25 + ((i * 37) % 11), h = 62 + ((i * 53) % 46), tilt = ((i * 19) % 7) - 3; s += `<path d="M${x} 442L${x + tilt} ${442 - h}" stroke="${c.land}" stroke-width="2.6"/><path d="M${x + tilt - 3.5} ${446 - h}L${x + tilt} ${430 - h}L${x + tilt + 3.5} ${446 - h}Z" fill="${c.land}"/>`; if (i % 8 === 3) s += `<path d="M${x + tilt} ${442 - h}q18 4 36-2l-9 11l9 10q-18 4-36-2Z" fill="${c.fog}" opacity=".65"/>`; } return s; }
  function trees(dx, y, n, f, o) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const x = dx + (i * 1240) / (n - 1), h = 145 + ((i * 71) % 95), w = 38 + ((i * 29) % 28);
      s += `<g fill="${f}" opacity="${o}"><rect x="${x - 4}" y="${y - h * 0.25}" width="8" height="${h * 0.28}"/><path d="M${x} ${y - h}L${x + w * 0.65} ${y - h * 0.52}H${x - w * 0.65}Z"/><path d="M${x} ${y - h * 0.78}L${x + w * 0.85} ${y - h * 0.32}H${x - w * 0.85}Z"/><path d="M${x} ${y - h * 0.55}L${x + w} ${y - h * 0.12}H${x - w}Z"/></g>`;
    }
    return s;
  }
  function flames(c) { let s = ""; for (let i = 0; i < 18; i++) { const x = i * 70 + 15, h = 125 + ((i * 47) % 130); s += `<path d="M${x - 44} 470Q${x - 28} ${470 - h * 0.6} ${x} ${470 - h}Q${x + 28} ${470 - h * 0.6} ${x + 44} 470Z" fill="#ff${(55 + (i % 5) * 28).toString(16)}18" opacity=".58" class="sc-fl" style="animation-delay:${-i * 0.21}s"/><path d="M${x - 22} 470Q${x - 12} ${470 - h * 0.45} ${x} ${470 - h * 0.72}Q${x + 12} ${470 - h * 0.45} ${x + 22} 470Z" fill="#ffd86a" opacity=".38" class="sc-fl" style="animation-delay:${-i * 0.17}s"/>`; } return s; }
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
    const fg = `<path d="M0 520V380L48 415L86 465L150 495L240 520ZM1200 520V370L1145 410L1105 460L1035 492L950 520Z" fill="#050304" opacity=".68"/>` +
      `<path d="M${a.x0 - 40} ${a.gy}Q600 ${a.gy - 6} ${a.x1 + 40} ${a.gy}" stroke="${c.fog}" stroke-opacity=".28" stroke-width="2" fill="none"/>`;
    return `<svg class="scene" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
      <linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.sky[0]}"/><stop offset=".6" stop-color="${c.sky[1]}"/><stop offset="1" stop-color="${c.sky[2]}"/></linearGradient>
      <radialGradient id="${u}f"><stop offset="0" stop-color="${c.fog}" stop-opacity=".9"/><stop offset="1" stop-color="${c.fog}" stop-opacity="0"/></radialGradient>
      <radialGradient id="${u}v" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".72"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#${u}s)"/><ellipse cx="600" cy="${a.gy - 60}" rx="520" ry="200" fill="url(#${u}f)" opacity=".38" class="sc-glow"/>
      <g class="sc-far">${particles(c.p === "rain" || c.p === "star" ? c.p : "", c)}</g>
      <g class="sc-mid">${s}</g>${fig}<g class="sc-near">${fg}${c.p !== "rain" && c.p !== "star" ? particles(c.p, c) : ""}</g>
      <rect width="${W}" height="${H}" fill="url(#${u}v)"/>
      <rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="4" fill="none" stroke="${c.fog}" stroke-opacity=".16" stroke-width="1"/></svg>`;
  };
})();
