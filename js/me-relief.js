/* 中洲纪年 · 手绘风山体浮雕（原创程序生成）
 * 每条山脉/孤峰：脊状分形噪声高度场 → 西北光照晕渲 → 岩色/雪顶/阴影着色 → 半透明位图，
 * 以 <image> 贴在 SVG 里。为不阻塞首屏，按帧逐个生成。
 */
(function () {
  const PX = 3; // 每个地图单位的像素数
  const H32 = (i, j) => { let n = (i * 374761393 + j * 668265263) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967296; };
  const sm = (t) => t * t * (3 - 2 * t);
  function noise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
    const a = H32(xi, yi), b = H32(xi + 1, yi), c = H32(xi, yi + 1), d = H32(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  }
  // 脊状多重分形：刃脊 + 支脉
  function ridged(x, y, oct = 5) {
    let s = 0, amp = 0.55, f = 1, w = 1;
    for (let o = 0; o < oct; o++) {
      let n = 1 - Math.abs(noise(x * f + o * 17.3, y * f - o * 9.1) * 2 - 1); n *= n;
      n *= w; w = Math.min(1, n * 1.6);
      s += n * amp; amp *= 0.5; f *= 2.03;
    }
    return s;
  }
  // Catmull-Rom 加密
  function dense(pts) {
    if (pts.length < 3) return pts;
    const o = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let k = 0; k < 6; k++) {
        const t = k / 6, t2 = t * t, t3 = t2 * t;
        o.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)));
      }
    }
    o.push(pts[pts.length - 1]); return o;
  }
  // 到折线的距离 + 沿线弧长 u + 有符号横向距离 v
  function segDist(px, py, P) {
    let best = 1e9, bu = 0, bs = 1, acc = 0;
    for (let i = 0; i < P.length - 1; i++) {
      const [ax, ay] = P[i], [bx, by] = P[i + 1], dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1, L = Math.sqrt(L2);
      const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L2)), ex = ax + dx * t - px, ey = ay + dy * t - py, d = ex * ex + ey * ey;
      if (d < best) { best = d; bu = acc + t * L; bs = (dx * (py - ay) - dy * (px - ax)) > 0 ? 1 : -1; }
      acc += L;
    }
    const dd = Math.sqrt(best); return [dd, bu, dd * bs];
  }
  const PAL = {
    norm: { hi: [206, 202, 188], mid: [124, 118, 102], lo: [44, 42, 36], foot: [86, 96, 58], snow: [246, 246, 240], snowAt: 0.7 },
    aman: { hi: [226, 224, 214], mid: [146, 142, 130], lo: [56, 56, 54], foot: [100, 118, 72], snow: [255, 255, 252], snowAt: 0.6 },
    dark: { hi: [140, 124, 114], mid: [78, 66, 60], lo: [18, 12, 10], foot: [58, 48, 42], snow: null },
    fire: { hi: [150, 112, 92], mid: [86, 58, 46], lo: [24, 12, 8], foot: [60, 44, 36], snow: null }
  };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  // spec: {pts:[[x,y]...], h, kind:'norm'|'aman'|'dark'|'fire', peak:bool}
  function bbox(spec) {
    const pad = spec.peak ? spec.h * 1.25 : spec.h * 2.3;
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    spec.pts.forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); });
    return { x: x0 - pad, y: y0 - pad * (spec.peak ? 1.25 : 1), w: x1 - x0 + pad * 2, h: y1 - y0 + pad * (spec.peak ? 2.15 : 2) };
  }
  function* renderG(spec, bb) {
    const W = Math.ceil(bb.w * PX), Hh = Math.ceil(bb.h * PX), P = spec.peak ? spec.pts : dense(spec.pts), h = spec.h;
    const R = spec.peak ? h * 1.15 : h * 1.7, f0 = 1 / (h * (spec.peak ? 0.4 : 0.42));
    const HM = new Float32Array(W * Hh), BA = new Float32Array(W * Hh), RG = new Float32Array(W * Hh);
    // 粗网格（每地图单位一格）预算距离/弧长/横距，像素处双线性插值
    let GW = 0, GD = null, GU = null, GV = null;
    if (!spec.peak) {
      GW = Math.ceil(bb.w) + 2; const GH = Math.ceil(bb.h) + 2; GD = new Float32Array(GW * GH); GU = new Float32Array(GW * GH); GV = new Float32Array(GW * GH);
      for (let gj = 0; gj < GH; gj++) for (let gi = 0; gi < GW; gi++) { const q = segDist(bb.x + gi, bb.y + gj, P), o = gj * GW + gi; GD[o] = q[0]; GU[o] = q[1]; GV[o] = q[2]; }
    }
    const bil = (A, gx, gy) => { const i0 = gx | 0, j0 = gy | 0, fx = gx - i0, fy = gy - j0, o = j0 * GW + i0; return A[o] * (1 - fx) * (1 - fy) + A[o + 1] * fx * (1 - fy) + A[o + GW] * (1 - fx) * fy + A[o + GW + 1] * fx * fy; };
    for (let j = 0; j < Hh; j++) { if (j % 24 === 23) yield; for (let i = 0; i < W; i++) {
      const x = bb.x + (i + 0.5) / PX, y = bb.y + (j + 0.5) / PX;
      let d, r;
      if (spec.peak) { d = Math.hypot((x - P[0][0]) * 0.9, (y - P[0][1] + h * 0.35) * 1.15); r = ridged(x * f0, y * f0); }
      else {
        const gx = x - bb.x, gy = y - bb.y; d = bil(GD, gx, gy); if (d > R * 1.5) continue;
        // 沿线高频、横向低频 → 脊线垂直于主脊，像山脉的支脉
        const u = bil(GU, gx, gy) * f0, v = bil(GV, gx, gy) * f0;
        r = 0.6 * ridged(u * 1.7 + 0.75 * noise(v * 0.9, u * 0.5), v * 0.55, 4) + 0.45 * ridged(x * f0 * 1.9 + 7, y * f0 * 1.9, 3);
      }
      const rr = R * (0.6 + 0.5 * noise(x * f0 * 0.3 + 50, y * f0 * 0.3) + 0.4 * noise(x * f0 * 1.1 - 20, y * f0 * 1.1));
      let b = 1 - d / rr; if (b <= 0) continue;
      if (spec.peak) { b = sm(Math.min(1, b)); HM[j * W + i] = Math.pow(b, 1.15) * (0.75 + 0.55 * r); }
      else { const spine = Math.pow(Math.max(0, 1 - d / (rr * 0.85)), 1.6); b = sm(Math.min(1, b * 2.4)); HM[j * W + i] = b * (0.1 + 0.75 * r) * (0.55 + 0.45 * spine) + spine * 0.55; }
      BA[j * W + i] = b; RG[j * W + i] = r;
    } }
    const cv = document.createElement("canvas"); cv.width = W; cv.height = Hh;
    const ctx = cv.getContext("2d"), im = ctx.createImageData(W, Hh), D = im.data, pal = PAL[spec.kind] || PAL.norm;
    const k = h * 0.6 * PX * 0.5, Lx = -0.62, Ly = -0.55, Lz = 0.56;
    for (let j = 1; j < Hh - 1; j++) for (let i = 1; i < W - 1; i++) {
      const o = j * W + i, b = BA[o]; if (!b) continue;
      const Hv = HM[o], nx = -(HM[o + 1] - HM[o - 1]) * k, ny = -(HM[o + W] - HM[o - W]) * k, nl = Math.sqrt(nx * nx + ny * ny + 1);
      let s = (nx * Lx + ny * Ly + Lz) / nl; s = Math.max(0, Math.min(1, s * 1.25 - 0.08));
      let c = s < 0.5 ? mix(pal.lo, pal.mid, s * 2) : mix(pal.mid, pal.hi, (s - 0.5) * 2);
      if (pal.snow) { const sn = Math.max(0, Math.min(1, (Hv - pal.snowAt) * 4)) * Math.min(1, s * 1.3); c = mix(c, s > 0.55 ? pal.snow : [196, 204, 214], sn * (s > 0.55 ? 0.95 : 0.4)); }
      const foot = Math.max(1 - Math.min(1, Hv / 0.42), 1 - Math.min(1, RG[o] / 0.4)); c = mix(c, pal.foot, foot * 0.7);
      const g = (H32(i * 7 + 3, j * 13 + 1) - 0.5) * 14; // 颗粒
      D[o * 4] = c[0] + g; D[o * 4 + 1] = c[1] + g; D[o * 4 + 2] = c[2] + g;
      D[o * 4 + 3] = 255 * Math.min(1, b * 1.5) * (0.45 + 0.55 * Math.min(1, Hv * 2.2));
    }
    ctx.putImageData(im, 0, 0);
    return cv;
  }
  function render(spec, bb) { const g = renderG(spec, bb); let r; while (!(r = g.next()).done); return r.value; }
  const Q = []; let busy = false, cur = null;
  function pump() {
    if (!Q.length && !cur) { busy = false; return; }
    busy = true;
    const t0 = performance.now();
    while (performance.now() - t0 < 14) {
      if (!cur) { if (!Q.length) break; const q = Q.shift(); cur = { ...q, g: renderG(q.spec, q.bb) }; }
      const r = cur.g.next();
      if (r.done) { const img = cur.img; r.value.toBlob((bl) => { if (bl) img.setAttribute("href", URL.createObjectURL(bl)); }); cur = null; }
    }
    requestAnimationFrame(pump);
  }
  // 返回 bbox，并在空闲时把位图填进 img
  function place(spec, img) {
    const bb = bbox(spec);
    img.setAttribute("x", bb.x.toFixed(1)); img.setAttribute("y", bb.y.toFixed(1));
    img.setAttribute("width", bb.w.toFixed(1)); img.setAttribute("height", bb.h.toFixed(1));
    img.setAttribute("preserveAspectRatio", "none");
    Q.push({ spec, img, bb }); if (!busy) requestAnimationFrame(pump);
    return bb;
  }
  window.ME_RELIEF = { place, render, bbox };
})();
