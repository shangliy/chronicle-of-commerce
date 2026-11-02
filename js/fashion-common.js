/* 風尚誌 · 两个版本（滚动版 fashion.js、翻页版 fashion-book.js）共用的线描图标与廓形 */
window.FASHION = (() => {
  // —— 线描图标（只画物件，不复刻商标） ——
  const ICONS = {
    jersey: `<path d="M17 8l-9 6 4 7 4-2v21h16V19l4 2 4-7-9-6c-1 3-4 5-7 5s-6-2-7-5z"/><path d="M16 24h16M16 29h16M16 34h16"/>`,
    no5: `<rect x="19" y="6" width="10" height="6" rx="1"/><rect x="11" y="14" width="26" height="28" rx="2"/><rect x="16" y="22" width="16" height="11"/><text x="24" y="30.5" text-anchor="middle" font-size="7" font-family="Bodoni Moda, serif" stroke="none" fill="currentColor">N°5</text>`,
    tweed: `<rect x="8" y="8" width="32" height="32"/><path d="M8 16h32M8 24h32M8 32h32M16 8v32M24 8v32M32 8v32" stroke-dasharray="3 2"/>`,
    pearls: `<path d="M10 10c0 18 6 28 14 28s14-10 14-28" fill="none" stroke-dasharray="0.1 5.2" stroke-linecap="round" stroke-width="4"/><circle cx="24" cy="40" r="3"/>`,
    camellia: `<circle cx="24" cy="24" r="4"/><path d="M24 20c-3-6 3-12 0-12s3 6 0 12zM28 24c6-3 12 3 12 0s-6 3-12 0zM24 28c3 6-3 12 0 12s-3-6 0-12zM20 24c-6 3-12-3-12 0s6-3 12 0z"/><circle cx="24" cy="24" r="10"/><circle cx="24" cy="24" r="15"/>`,
    lbd: `<path d="M19 6v6l-3 6 3 2-7 22h24l-7-22 3-2-3-6V6"/><path d="M19 12h10"/>`,
    bw: `<circle cx="24" cy="24" r="15"/><path d="M24 9a15 15 0 0 1 0 30z" fill="currentColor"/>`,
    suit: `<path d="M16 7l-8 5v30h32V12l-8-5"/><path d="M16 7l8 14 8-14M24 21v21"/><path d="M12 30h7v5h-7zM29 30h7v5h-7z"/><path d="M8 42h32" stroke-dasharray="1.5 1.5"/>`,
    bag: `<path d="M14 18c0-10 20-10 20 0" stroke-dasharray="2 1.4"/><rect x="8" y="18" width="32" height="22" rx="2"/><path d="M8 26l10 14M18 18l16 22M28 18l12 16M40 26L30 40M30 18L14 40M20 18L8 34" opacity=".55"/><rect x="21" y="23" width="6" height="4" fill="currentColor"/>`,
    shoes: `<path d="M6 34c6 0 10-2 14-8l6-6c2 0 4 2 4 4l-2 6 12 4c2 1 2 4 0 4H8c-2 0-2-4-2-4z"/><path d="M34 34c2 1 2 4 0 4h6c2 0 2-3 0-4z" fill="currentColor"/><path d="M8 38l2 6M26 24l-14-6"/>`
  };
  const icon = (id, cls = "") => `<svg class="ico ${cls}" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">${ICONS[id] || `<circle cx="24" cy="24" r="14"/>`}</svg>`;
  // —— 廓形：同样 12 个点，便于 CSS d: path() 形变 ——
  const silPath = (s) => {
    const L = (x, y) => `${x} ${y}`, R = (x, y) => `${60 - x} ${y}`;
    return `M27 18L${L(s.s, 21)}L${L(s.a, 30)}L${L(s.w, s.wy)}L${L(s.h, s.hy)}L${L(s.m, s.my)}L${R(s.m, s.my)}L${R(s.h, s.hy)}L${R(s.w, s.wy)}L${R(s.a, 30)}L${R(s.s, 21)}L33 18Z`;
  };

  return { ICONS, icon, silPath };
})();
