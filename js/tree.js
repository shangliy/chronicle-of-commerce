/* 家谱：随时光机年份生长的家族树（需要 window.FAMILY；由 app.js 的 window.onYear 驱动） */
(() => {
  const FAMILY = window.FAMILY, A = window.APP, root = document.getElementById("tree");
  if (!A || !root) return;
  if (!FAMILY || !FAMILY.length) { root.hidden = true; return; }
  root.hidden = false;
  const { esc } = A;
  const IMAGES = window.IMAGES || {};
  const storyColor = Object.fromEntries((window.STORIES || []).map((s) => [s.id, s.color]));
  const storyTitle = Object.fromEntries((window.STORIES || []).map((s) => [s.id, s.title]));
  const byId = Object.fromEntries(FAMILY.map((p) => [p.id, { ...p, kids: [] }]));
  const people = Object.values(byId);
  people.forEach((p) => p.parent && byId[p.parent] && byId[p.parent].kids.push(p));
  const roots = people.filter((p) => !p.parent || !byId[p.parent]);

  // —— 布局：代数 = 行，叶子按深度优先排成列，父辈居中于子女之上 ——
  let col = 0;
  (function place(list, g) {
    list.sort((a, b) => a.born - b.born).forEach((p) => {
      p.gen = g;
      if (p.kids.length) { place(p.kids, g + 1); p.x = (p.kids[0].x + p.kids.at(-1).x) / 2; }
      else p.x = col++;
    });
  })(roots, 0);
  const cols = Math.max(1, col), gens = Math.max(...people.map((p) => p.gen)) + 1;
  const ROW = 106, TOP = 34, W = 1000;
  const X = (p) => ((p.x + 0.5) / cols) * W, Y = (p) => TOP + p.gen * ROW;
  const H = TOP + (gens - 1) * ROW + 70;
  const GEN = "一二三四五六七八九十";

  const edges = people.filter((p) => p.parent && byId[p.parent]).map((p) => {
    const q = byId[p.parent], x1 = X(q), y1 = Y(q) + 61, x2 = X(p), y2 = Y(p) - 24, mid = Y(q) + 74;
    const dx = x2 - x1, r = Math.min(8, Math.abs(dx) / 2), s = Math.sign(dx);
    const d = r < 1 ? `M${x1} ${y1} V${y2}` : `M${x1} ${y1} V${mid - r} Q${x1} ${mid} ${x1 + s * r} ${mid} H${x2 - s * r} Q${x2} ${mid} ${x2} ${mid + r} V${y2}`;
    return `<path data-c="${p.id}" pathLength="1" style="--c:${storyColor[p.branch] || "var(--ink)"}" d="${d}"/>`;
  }).join("");

  root.innerHTML = `
    <div class="t-head">
      <span class="kicker">家谱 · 随时间生长</span>
      <b id="tStat"></b>
      <span class="t-legend">${(window.STORIES || []).filter((s) => people.some((p) => p.branch === s.id)).map((s) => `<i style="--c:${s.color}"></i>${esc(s.title.split(/[：:]/)[0])}`).join("")}</span>
    </div>
    <div class="t-scroll"><div class="t-canvas" style="height:${H}px">
      ${Array.from({ length: gens }, (_, g) => `<span class="t-gen" style="top:${TOP + g * ROW - 8}px">第${GEN[g] || g + 1}代</span>`).join("")}
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${edges}</svg>
      ${people.map((p) => {
        const m = p.img && IMAGES[p.img];
        return `<button class="t-p" data-p="${p.id}" style="left:${(X(p) / W) * 100}%;top:${Y(p)}px;--c:${storyColor[p.branch] || "var(--ink)"}" title="${esc(p.name)}">
          <span class="t-face">${m ? `<img src="${esc(m.src)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : `<em>${esc(p.name[0])}</em>`}</span>
          <span class="t-name">${esc(p.name)}</span>
          <span class="t-yrs">${p.born}–${p.died ?? ""}</span>
        </button>`;
      }).join("")}
    </div></div>`;

  const nodes = Object.fromEntries([...root.querySelectorAll(".t-p")].map((n) => [n.dataset.p, n]));
  const paths = [...root.querySelectorAll("path")];
  let lastSig = "";

  window.onYear = (y, { animate } = {}) => {
    const Y = Math.floor(y);
    const sig = people.map((p) => (Y < p.born ? 0 : p.died && Y >= p.died ? 2 : 1)).join("") + (animate ? "a" : "");
    if (sig === lastSig) return;
    lastSig = sig;
    let alive = 0, maxGen = -1;
    people.forEach((p) => {
      const n = nodes[p.id], born = Y >= p.born, dead = born && p.died && Y >= p.died;
      if (born && !dead) alive++;
      if (born) maxGen = Math.max(maxGen, p.gen);
      const was = n.dataset.s;
      const s = !born ? "unborn" : dead ? "dead" : "alive";
      if (was !== s) {
        n.dataset.s = s;
        n.classList.toggle("unborn", !born);
        n.classList.toggle("dead", !!dead);
        if (animate && was === "unborn" && s === "alive") { n.classList.remove("newborn"); void n.offsetWidth; n.classList.add("newborn"); }
      }
    });
    paths.forEach((pa) => pa.classList.toggle("on", Y >= byId[pa.dataset.c].born));
    document.getElementById("tStat").textContent = maxGen < 0 ? `${Y} 年 · 家族尚未诞生` : `${Y} 年 · 在世 ${alive} 人 · 已传 ${GEN[maxGen] || maxGen + 1} 代`;
  };
  window.onYear(A.year());
  const sc = root.querySelector(".t-scroll");
  requestAnimationFrame(() => { sc.scrollLeft = (sc.scrollWidth - sc.clientWidth) / 2; });

  // —— 人物小传 ——
  root.addEventListener("click", (e) => {
    const b = e.target.closest(".t-p");
    if (!b) return;
    const p = byId[b.dataset.p];
    A.pauseMachine();
    const kids = p.kids.map((k) => k.name).join("、");
    A.showModal(`
      <div class="extra">人物</div>
      <div class="dl muted">${p.born}—${p.died ?? "今"} · 第${GEN[p.gen] || p.gen + 1}代 · ${esc(storyTitle[p.branch] || "")}</div>
      <h2>${esc(p.name)}</h2>
      ${p.img && IMAGES[p.img] ? `${A.pic(p.img, { contain: true })}<p class="small muted" style="margin:0">${A.credit(p.img)}</p>` : ""}
      <p class="dropcap">${esc(p.note || "")}</p>
      ${p.parent ? `<p class="small">上一辈：${esc(byId[p.parent].name)}${kids ? ` · 下一辈（本报收录）：${esc(kids)}` : ""}</p>` : kids ? `<p class="small">下一辈：${esc(kids)}</p>` : ""}
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <button class="link" data-jump="${p.born}">时光机跳到 ${p.born} 年 ›</button>
        ${storyTitle[p.branch] ? `<button class="link" data-story="${p.branch}">翻阅「${esc(storyTitle[p.branch])}」›</button>` : ""}
      </div>`);
  });
  document.getElementById("modal").addEventListener("click", (e) => {
    const j = e.target.closest("[data-jump]"), s = e.target.closest("[data-story]");
    if (j) { A.closeModal(); A.setYear(+j.dataset.jump, { animate: true }); document.getElementById("machine").scrollIntoView({ behavior: "smooth", block: "start" }); }
    else if (s) A.openKey(`s:${s.dataset.story}:-1`);
  });
})();
