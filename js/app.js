/* 商海时报 · 主程序（原生 JS，无构建步骤） */
(() => {
  const { ERAS, EVENTS, STORIES, IMAGES = {}, CAPTIONS = {} } = window;
  const $ = (id) => document.getElementById(id);
  const esc = (s = "") => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrow = () => innerWidth <= 860;
  /* 站点配置：主报用默认值，家族版在数据文件里写 window.SITE 覆盖 */
  const SITE = Object.assign({
    min: 1300, max: 2026, gamma: 1.6,
    ticks: [1300, 1500, 1600, 1700, 1800, 1850, 1900, 1950, 2000, 2026], minorTicks: [1500, 1700, 1850, 1950, 2000],
    play: "播放七百年", replay: "↺ 重看七百年", eventLane: "编年大事",
    empty: ["商海尚未起潮", "请按“播放七百年”，看第一则故事登场。"],
    end: "七百年商海，至此暂告一段落。", quiz: [1300, 2026]
  }, window.SITE || {});
  const MIN_YEAR = SITE.min, MAX_YEAR = SITE.max;

  /* 店报：报头、刊尾与购买卡都可以由数据文件里的 SITE 决定（shop.html 用） */
  const setText = (id, v) => { const el = $(id); if (el && v != null) el.textContent = v; };
  if (SITE.title) { setText("mhTitle", SITE.title); document.title = SITE.title + (SITE.en ? " · " + SITE.en : ""); }
  setText("mhEn", SITE.en); setText("mhPeriod", SITE.period); setText("mhPrice", SITE.price); setText("mhKicker", SITE.kicker); setText("colophon", SITE.colophon);
  /* 复古票根：购买 / 引流卡。cta = { label, note, price, link, wechat } */
  function ticket(c, kicker = "入手同款") {
    if (!c || !(c.label || c.link || c.wechat)) return "";
    const wx = c.wechat ? `<span class="tk-wx">微信 <b>${esc(c.wechat)}</b> <button class="link" type="button" data-copy="${esc(c.wechat)}">复制</button></span>` : "";
    const lTag = c.link ? "a" : "span", href = c.link ? ` href="${esc(c.link)}" target="_blank" rel="noopener"` : "";
    const rCopy = !c.link && c.wechat ? ` data-copy="${esc(c.wechat)}"` : "";
    const rTag = c.link ? "a" : "span";
    const goTxt = c.go || (c.link ? "立即入手 ›" : c.wechat ? "复制微信 ›" : "到店品鉴");
    return `<div class="ticket"><${lTag} class="tk-l"${href}><span class="tk-k">${esc(c.kicker || kicker)}</span><b>${esc(c.label || "")}</b>${c.note ? `<i>${esc(c.note)}</i>` : ""}${wx}</${lTag}>
      <${rTag} class="tk-r"${href}${rCopy}>${c.price ? `<span class="tk-price">${esc(c.price)}</span>` : ""}<span class="tk-go">${esc(goTxt)}</span></${rTag}></div>`;
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const target = b.querySelector(".tk-go") || b;
    navigator.clipboard?.writeText(b.dataset.copy).then(() => { const t = target.textContent; target.textContent = "已复制"; setTimeout(() => (target.textContent = t), 1500); });
  }, true);
  if (SITE.cta && $("shopcard")) $("shopcard").innerHTML = `<h3>本店 <small>读完故事，带一份走</small></h3>${ticket(SITE.cta, SITE.cta.kicker || "本报推荐")}`;

  const storyById = Object.fromEntries(STORIES.map((s) => [s.id, s]));
  const eraOf = (y) => ERAS.find((e) => y >= e.start && y < e.end) || ERAS[ERAS.length - 1];

  /* ---------- 图片 ---------- */
  function isContain(name) {
    const m = IMAGES[name];
    if (!m) return false;
    const r = m.h / m.w;
    return /\.(png|webp|svg)$/i.test(name) || r > 1.55 || r < 0.45;
  }
  function pic(name, { contain = false, cls = "", fallback = "" } = {}) {
    const m = name && IMAGES[name];
    if (!m) return `<div class="halftone noimg ${cls}">${esc(fallback)}</div>`;
    return `<div class="halftone ${contain ? "contain" : ""} ${cls}"><img src="${esc(m.src)}" alt="${esc(CAPTIONS[name] || "")}" loading="lazy" referrerpolicy="no-referrer"></div>`;
  }
  function credit(name, fallback = "") {
    const m = name && IMAGES[name];
    if (!m) return "";
    const who = m.artist && m.artist.length < 60 ? m.artist : "Wikimedia Commons";
    const parts = [`图：${esc(who)}`];
    if (m.license) parts.push(esc(m.license));
    if (m.page && m.page !== "#") parts.push(`<a href="${esc(m.page)}" target="_blank" rel="noopener">来源</a>`);
    const cap = CAPTIONS[name] || fallback;
    return `${esc(cap)}<span class="credit">${parts.join(" · ")}</span>`;
  }

  /* ---------- 日期（中文数字） ---------- */
  const CN = "〇一二三四五六七八九";
  const cnNum = (n) => (n <= 10 ? ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][n] : n < 20 ? "十" + CN[n % 10] : CN[Math.floor(n / 10)] + "十" + (n % 10 ? CN[n % 10] : ""));
  const d = new Date();
  $("today").textContent = `${String(d.getFullYear()).split("").map((c) => CN[c]).join("")}年${cnNum(d.getMonth() + 1)}月${cnNum(d.getDate())}日 星期${"日一二三四五六"[d.getDay()]}`;

  /* 所有条目（编年大事 + 故事各站），按年份排序 */
  const ALL = [
    ...EVENTS.map((e) => ({ ...e, key: `e:${e.year}`, from: "号外", color: "var(--red)" })),
    ...STORIES.flatMap((s) => s.steps.map((st, i) => ({ ...st, key: `s:${s.id}:${i}`, from: s.title, color: s.color })))
  ].sort((a, b) => a.year - b.year);
  const byKey = Object.fromEntries(ALL.map((x) => [x.key, x]));

  /* ================= 头版 ================= */
  const pagesOf = (s) => s.steps.length + 2;
  $("storyCount").textContent = STORIES.length;
  $("pageCount").textContent = STORIES.reduce((a, s) => a + pagesOf(s) * 2, 0);
  $("front").classList.add("paper");

  /* 头版随时光机年份重排：每一年都是一期报纸 */
  const latestStep = (s, Y) => { let k = -1; s.steps.forEach((st, i) => { if (st.year <= Y) k = i; }); return k; };
  const F = { sig: {}, n: -1 };

  // 时间之河：所有带图条目按年份排开，复制一份实现无缝循环；未来的照片蒙尘待显影
  const flow = ALL.filter((x) => IMAGES[x.img]);
  const riverItems = flow.length ? flow : ALL;
  const frames = riverItems.map((x, i) => `<div class="frame" data-key="${x.key}" data-y="${x.year}" style="--r:${((i * 37) % 7) - 3}deg">${pic(x.img, { fallback: x.year })}<div class="y">${x.year}</div><div class="t">${esc(x.title)}</div></div>`).join("");
  const halfRiver = frames.repeat(Math.max(1, Math.ceil(10 / Math.max(1, riverItems.length))));
  $("river").innerHTML = halfRiver + halfRiver;
  const riverFrames = [...$("river").children];
  // 时间之河不在屏幕里时暂停漂移动画，省下合成开销
  new IntersectionObserver(([en]) => $("river").parentElement.classList.toggle("idle", !en.isIntersecting)).observe($("river").parentElement);

  function reprint(el, sig, id) {
    if (F.sig[id] === sig) return false;
    const first = F.sig[id] === undefined;
    F.sig[id] = sig;
    if (!first) { el.classList.remove("reprint"); void el.offsetWidth; el.classList.add("reprint"); }
    return true;
  }

  function renderFront(Y) {
    const era = eraOf(Y), eraIdx = ERAS.indexOf(era);
    $("edition").textContent = `${Y} 年版 · ${era.name}`;
    $("front").style.setProperty("--sepia", (0.62 - eraIdx * 0.055).toFixed(2));

    // —— 各故事在 Y 年的状态 ——
    const st = STORIES.map((s) => {
      const k = latestStep(s, Y);
      return { s, k, step: s.steps[k], state: k < 0 ? "future" : k === s.steps.length - 1 && Y > s.steps[k].year ? "done" : "live" };
    });
    const started = st.filter((x) => x.k >= 0).sort((a, b) => b.step.year - a.step.year || b.k - a.k);
    const future = st.filter((x) => x.k < 0).sort((a, b) => a.s.steps[0].year - b.s.steps[0].year);

    // —— 头条：最近一次更新的故事 ——
    const L = started.find((x) => x.state === "live") || started[0];
    if (!L) {
      if (reprint($("lead"), "none", "lead")) $("lead").innerHTML = `<div class="noimg halftone">${Y}</div><div><span class="kicker">本报筹备中</span><h2>${esc(SITE.empty[0])}</h2><p class="deck">${esc(SITE.empty[1])}</p></div>`;
    } else {
      const { s, k, step } = L;
      const img = IMAGES[step.img] ? step.img : s.steps.slice(0, k + 1).reverse().find((x) => IMAGES[x.img])?.img;
      const recent = s.steps.slice(Math.max(0, k - 3), k + 1).reverse();
      if (reprint($("lead"), `${s.id}:${k}:${Y - step.year <= 3}`, "lead")) {
        $("lead").dataset.key = `s:${s.id}:${k}`;
        $("lead").innerHTML = `
          ${pic(img, { contain: isContain(img) })}
          <div>
            <span class="kicker">${Y - step.year <= 3 ? "头条 · 最新消息" : "头条 · 连载中"}</span>
            <p class="lead-series">${esc(s.title)} · 第 ${k + 1} / ${s.steps.length} 站</p>
            <h2>${esc(step.title)}</h2>
            <p class="deck">【${esc(step.place)}电】${step.year} 年 · ${esc(s.subtitle)}</p>
            <div class="body">
              ${recent.map((x, i) => `<p class="${i ? "prev" : /^[“"「《（(]/.test(x.text) ? "" : "dropcap"}">${i ? `<b>前情 · ${x.year}</b> ` : ""}${esc(x.text)}</p>`).join("")}
              ${step.lesson ? `<p class="lesson">${esc(step.lesson)}</p>` : ""}
            </div>
            <div class="progress" style="--c:${s.color}"><i style="width:${((k + 1) / s.steps.length) * 100}%"></i></div>
            <span class="more">翻开这一页 ›</span>
          </div>`;
      }
    }

    // —— 各版：其他故事（进行中 / 完结 / 未刊） ——
    const others = [...started.filter((x) => x !== L), ...future];
    const sigAll = others.map((x) => `${x.s.id}:${x.k}:${x.state}`).join("|");
    if (F.sig.storiesOrder !== sigAll) {
      const prevSig = { ...F.sig };
      F.sig.storiesOrder = sigAll;
      $("stories").innerHTML = others.map(({ s, k, step, state }) => {
        const head = `<div class="tags">${s.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>`;
        if (state === "future") {
          const img = s.steps.find((x) => IMAGES[x.img] && !isContain(x.img))?.img;
          return `<article class="story future" data-id="${s.id}" data-s="${s.id}">
            ${pic(img)}${head}
            <span class="badge">未刊 · ${s.steps[0].year} 年开篇</span>
            <h3>${esc(s.title)}</h3>
            <p class="deck">${esc(s.subtitle)}</p>
            <p>还要再等 <b class="wait" data-y0="${s.steps[0].year}">${s.steps[0].year - Y}</b> 年，第一则消息将从${esc(s.steps[0].place)}传来。</p>
          </article>`;
        }
        const img = IMAGES[step.img] ? step.img : s.steps.slice(0, k + 1).reverse().find((x) => IMAGES[x.img])?.img;
        return `<article class="story ${state}" data-key="s:${s.id}:${k}" data-s="${s.id}">
          ${pic(img, { contain: isContain(img) })}${head}
          <span class="badge">${state === "done" ? `完结 · 共 ${s.steps.length} 站` : `连载 · 第 ${k + 1} / ${s.steps.length} 站`}</span>
          <h3>${esc(s.title)}</h3>
          <p class="deck">${step.year} · ${esc(step.place)} · ${esc(step.title)}</p>
          <p>${esc(step.text)}</p>
          <div class="progress" style="--c:${s.color}"><i style="width:${((k + 1) / s.steps.length) * 100}%"></i></div>
        </article>`;
      }).join("");
      // 只给状态变化了的那几栏“重新上墨”
      [...$("stories").children].forEach((el) => {
        const x = others.find((o) => o.s.id === el.dataset.s);
        const sig = `${x.k}:${x.state}`;
        if (prevSig["st:" + x.s.id] !== undefined && prevSig["st:" + x.s.id] !== sig) el.classList.add("reprint");
        F.sig["st:" + x.s.id] = sig;
      });
    }

    // —— 编年简讯：截至 Y 年，最新在上 ——
    const past = EVENTS.filter((e) => e.year <= Y).sort((a, b) => b.year - a.year);
    const next = ALL.find((x) => x.year > Y);
    if (reprint($("brief"), `${past.length}:${next?.key}`, "brief")) {
      $("brief").innerHTML = `<h3>${esc(SITE.eventLane)} <small>截至 ${Y} 年</small></h3>` +
        (past.length ? past.slice(0, 9).map((e, i) => `
          <div class="brief-item${i === 0 && Y - e.year <= 3 ? " fresh" : ""}" data-event="${e.year}">
            ${pic(e.img)}
            <div><span class="y">${e.year} · ${esc(e.place)}</span><b>${esc(e.title)}</b><p>${esc(e.text)}</p></div>
          </div>`).join("") : `<p class="muted small">世界大事尚未发生。</p>`) +
        (past.length > 9 ? `<p class="muted small">……更早的 ${past.length - 9} 则见合订本</p>` : "") +
        (next ? `<div class="teaser"><span>下期预告</span><b>${next.year} 年</b> · ${esc(next.place)}<br><small>${esc(next.from)}有新消息，敬请期待</small></div>` : `<div class="teaser"><span>终刊</span>${esc(SITE.end)}</div>`);
    }

    $("stories").querySelectorAll(".wait").forEach((w) => (w.textContent = w.dataset.y0 - Y));
    riverFrames.forEach((f) => f.classList.toggle("future", +f.dataset.y > Y));
  }

  $("front").addEventListener("click", (e) => {
    if (e.target.closest("#machine, #results, .ticket")) return;
    const fk = e.target.closest(".lead[data-key], .story[data-key]");
    if (fk) return openKey(fk.dataset.key);
    const st = e.target.closest("[data-id]");
    if (st) return openStory(st.dataset.id, 0);
    const ev = e.target.closest("[data-event]");
    if (ev) return openEvent(+ev.dataset.event);
    const fr = e.target.closest("[data-key]");
    if (fr) openKey(fr.dataset.key);
  });
  function openKey(key) {
    const [t, a, b] = key.split(":");
    if (t === "e") openEvent(+a);
    else openStory(a, +b + 1);
  }

  /* ================= 时光机：动画历史变迁 ================= */
  const M = { year: MIN_YEAR, playing: false, speed: 1, hold: 0, last: 0, era: null, desk: [], nodes: new Map() };
  const GAMMA = SITE.gamma; // 非线性标尺：早期稀疏压缩、近代密集展开
  const xOf = (y) => Math.pow((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR), GAMMA) * 100;
  const yOf = (pct) => MIN_YEAR + Math.pow(Math.min(1, Math.max(0, pct)), 1 / GAMMA) * (MAX_YEAR - MIN_YEAR);

  function buildMachine() {
    $("mEras").innerHTML = ERAS.map((e) => {
      const a = xOf(Math.max(e.start, MIN_YEAR)), b = xOf(Math.min(e.end, MAX_YEAR));
      return `<button class="m-band" data-year="${e.start}" style="left:${a}%;width:${b - a}%;--c:${e.color}" title="${e.start}—${e.end} ${esc(e.name)}"><span>${esc(e.name)}</span></button>`;
    }).join("");
    const lanes = [
      { label: SITE.eventLane, color: "var(--red)", items: ALL.filter((x) => x.key.startsWith("e:")) },
      ...STORIES.map((s) => ({ label: s.title.split(/[：:]/)[0], color: s.color, items: ALL.filter((x) => x.key.startsWith(`s:${s.id}:`)) }))
    ];
    $("mLanes").innerHTML = lanes.map((l) => {
      const a = xOf(l.items[0].year), b = xOf(l.items.at(-1).year);
      return `<div class="m-lane" style="--c:${l.color}">
        <span class="m-lab">${esc(l.label)}</span>
        <i class="m-line" style="left:${a}%;width:${b - a}%"><i class="m-fill" data-a="${l.items[0].year}" data-b="${l.items.at(-1).year}"></i></i>
        ${l.items.map((x) => `<button class="m-dot" data-key="${x.key}" data-y="${x.year}" style="left:${xOf(x.year)}%" data-tip="${x.year} · ${esc(x.title)}"></button>`).join("")}
      </div>`;
    }).join("");
    $("mTicks").innerHTML = SITE.ticks.map((y) => `<span class="${SITE.minorTicks.includes(y) ? "minor" : ""}" style="left:${xOf(y)}%">${y}</span>`).join("");
    M.dots = [...$("mLanes").querySelectorAll(".m-dot")];
    M.fills = [...$("mLanes").querySelectorAll(".m-fill")];
  }

  function deskTarget(y) {
    const past = ALL.filter((x) => x.year <= y);
    return past.slice(-4).reverse(); // 最新的在最前
  }

  function renderDesk(animate) {
    const target = deskTarget(M.year);
    const keys = target.map((x) => x.key);
    // 移除已离开桌面的剪报
    for (const [k, node] of M.nodes) {
      if (!keys.includes(k)) {
        M.nodes.delete(k);
        node.classList.add("leave");
        setTimeout(() => node.remove(), 500);
      }
    }
    target.forEach((x, i) => {
      let node = M.nodes.get(x.key);
      if (!node) {
        node = document.createElement("div");
        node.className = "d-card paper";
        node.dataset.key = x.key;
        node.innerHTML = `<div class="d-in${animate && i === 0 ? " enter" : ""}" style="--c:${x.color}">
          ${pic(x.img, { contain: isContain(x.img), fallback: x.year })}
          <div class="d-meta"><b>${x.year}</b> · ${esc(x.place)} · <span>${esc(x.from)}</span></div>
          <h4>${esc(x.title)}</h4>
          <p>${esc(x.text)}</p>
        </div>`;
        $("mDesk").appendChild(node);
        M.nodes.set(x.key, node);
      }
      const rot = ((x.year * 7) % 9) - 4;
      node.style.zIndex = 10 - i;
      node.style.transform = `translate(${-i * 26}px, ${i * 14}px) rotate(${i ? rot : 0}deg) scale(${1 - i * 0.07})`;
      node.style.opacity = i > 2 ? 0.55 : 1;
      node.classList.toggle("top", i === 0);
    });
    $("mEmpty").hidden = target.length > 0;
  }

  function setYear(y, { animate = false } = {}) {
    M.year = Math.max(MIN_YEAR, Math.min(MAX_YEAR, y));
    const Y = Math.floor(M.year);
    $("mYear").textContent = Y;
    M.mini.textContent = Y;
    const era = eraOf(Y);
    if (era !== M.era) {
      $("machine").style.setProperty("--era", era.color);
      $("mEra").textContent = `${era.start}—${era.end} · ${era.name}`;
      $("mDesc").textContent = era.desc;
      [...$("mEras").children].forEach((b) => b.classList.toggle("on", +b.dataset.year === era.start));
      if (animate && M.era) stamp(era.name);
      M.era = era;
    }
    $("mHead").style.left = xOf(M.year) + "%";
    M.dots.forEach((dt) => dt.classList.toggle("lit", +dt.dataset.y <= Y));
    M.fills.forEach((f) => {
      const a = +f.dataset.a, b = +f.dataset.b;
      const p = b === a ? (Y >= a ? 1 : 0) : (xOf(Math.min(Math.max(M.year, a), b)) - xOf(a)) / (xOf(b) - xOf(a));
      f.style.transform = `scaleX(${Math.max(0, Math.min(1, p))})`; // 用 transform 代替 width，避免每帧重排
    });
    const k = deskTarget(Y).map((x) => x.key).join();
    if (k !== M.deskKey) { M.deskKey = k; renderDesk(animate); }
    const n = ALL.filter((x) => x.year <= Y).length;
    if (n !== F.n || F.y !== Y && !M.playing) { F.n = n; F.y = Y; renderFront(Y); }
    if (window.onYear) window.onYear(M.year, { animate, playing: M.playing });
  }

  function stamp(text) {
    const s = $("mStamp");
    s.innerHTML = `<small>时代更替</small>${esc(text)}`;
    s.classList.remove("go"); void s.offsetWidth; s.classList.add("go");
  }

  function tick(t) {
    if (!M.playing) return;
    const dt = Math.min(0.1, (t - (M.last || t)) / 1000);
    M.last = t;
    if (M.hold > 0) { M.hold -= dt * 1000; }
    else {
      const next = ALL.find((x) => x.year > Math.floor(M.year));
      const gap = next ? next.year - M.year : 99;
      const rate = (gap > 12 ? 45 : gap > 4 ? 14 : 6) * M.speed; // 空白年代快进，事件密集处放慢
      let ny = M.year + rate * dt;
      if (next && ny >= next.year) { ny = next.year; M.hold = 1100 / M.speed; }
      setYear(ny, { animate: true });
      if (M.year >= MAX_YEAR) { pauseMachine(); return; }
    }
    requestAnimationFrame(tick);
  }
  function playMachine() {
    if (M.year >= MAX_YEAR) setYear(MIN_YEAR);
    M.playing = true; M.last = 0;
    $("mPlay").textContent = "❚❚ 暂停";
    M.miniPlay.textContent = "❚❚";
    requestAnimationFrame(tick);
  }
  function pauseMachine() {
    M.playing = false;
    $("mPlay").textContent = M.year >= MAX_YEAR ? SITE.replay : "▶ 继续播放";
    M.miniPlay.textContent = M.year >= MAX_YEAR ? "↺" : "▶";
  }

  buildMachine();
  // 迷你控制条：时间轴停靠到底部时显示年份与播放键
  $("mAxis").insertAdjacentHTML("afterbegin", `<div class="m-mini"><b id="mMini"></b><button id="mMiniPlay" title="播放 / 暂停（空格）">▶</button></div>`);
  M.mini = $("mMini"); M.miniPlay = $("mMiniPlay");
  M.miniPlay.onclick = (e) => { e.stopPropagation(); M.playing ? pauseMachine() : playMachine(); };
  $("mPlay").textContent = "▶ " + SITE.play;
  setYear(MIN_YEAR);

  // 下滑离开时光机后，时间轴缩成细条，停靠在屏幕最下方
  const dockIO = new IntersectionObserver(([en]) => {
    const dock = !en.isIntersecting && en.boundingClientRect.bottom < 0;
    if (dock === document.body.classList.contains("docked")) return;
    if (dock) $("machine").style.setProperty("--axisH", $("mAxis").offsetHeight + "px");
    document.body.classList.toggle("docked", dock);
  });
  dockIO.observe($("machine"));
  $("mPlay").onclick = () => (M.playing ? pauseMachine() : playMachine());
  $("mSpeed").onclick = () => {
    M.speed = M.speed >= 4 ? 1 : M.speed * 2;
    $("mSpeed").textContent = M.speed + "×";
  };
  $("mDesk").addEventListener("click", (e) => {
    const c = e.target.closest(".d-card");
    if (c) { pauseMachine(); openKey(c.dataset.key); }
  });
  $("mEras").addEventListener("click", (e) => {
    const b = e.target.closest(".m-band");
    if (b) { pauseMachine(); setYear(+b.dataset.year, { animate: true }); }
  });
  // 拖动标尺穿越时间
  const axis = $("mAxis");
  let dragging = false;
  const yearFromEvent = (e) => {
    const r = $("mLanes").getBoundingClientRect();
    return yOf((e.clientX - r.left) / r.width);
  };
  axis.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".m-dot, .m-band, .m-mini")) return;
    dragging = true;
    axis.setPointerCapture(e.pointerId);
    pauseMachine();
    setYear(yearFromEvent(e));
  });
  axis.addEventListener("pointermove", (e) => { if (dragging) setYear(yearFromEvent(e)); });
  axis.addEventListener("pointerup", () => { dragging = false; });
  axis.addEventListener("click", (e) => {
    const dot = e.target.closest(".m-dot");
    if (dot) { pauseMachine(); setYear(+dot.dataset.y); openKey(dot.dataset.key); }
  });
  axis.addEventListener("pointerover", (e) => {
    const dot = e.target.closest(".m-dot");
    // 停靠状态下不做悬停预览：否则鼠标划过就会让整版重排
    if (dot && !M.playing && !dragging && !document.body.classList.contains("docked")) setYear(+dot.dataset.y);
  });
  $("machine").addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault(); e.stopPropagation();
      pauseMachine();
      const Y = Math.floor(M.year);
      const t = e.key === "ArrowRight" ? ALL.find((x) => x.year > Y) : ALL.slice().reverse().find((x) => x.year < Y);
      if (t) setYear(t.year, { animate: true });
    }
  });

  /* ================= 翻页阅读 ================= */
  const state = { story: null, pg: 0, anim: false, playing: null };
  ["pL", "pR"].forEach((id) => $(id).classList.add("paper"));

  function runhead(s, pg, side) {
    const st = s.steps[pg - 1];
    const year = st ? st.year : pg === 0 ? s.steps[0].year : s.steps.at(-1).year;
    return side === "L"
      ? `<div class="runhead"><span>${esc(SITE.masthead || "商海時報")}</span><span>${esc(s.title)}</span></div>`
      : `<div class="runhead"><span>${year} 年</span><span>${esc(eraOf(year).name)}</span></div>`;
  }
  const folio = (pg, side) => `<div class="folio">— 第 ${pg * 2 + (side === "L" ? 1 : 2)} 页 —</div>`;

  function leftHTML(s, pg) {
    const n = pagesOf(s);
    let inner;
    if (pg === 0) {
      const imgs = s.steps.map((x) => x.img).filter((x) => IMAGES[x]).slice(0, 7);
      inner = imgs.length
        ? `<div class="mosaic mosaic-${imgs.length}">${imgs.map((x) => pic(x)).join("")}</div>`
        : `<div class="frontispiece"><div class="fp-in"><span class="fp-k">${esc(SITE.masthead || SITE.title || "商海時報")}</span><div class="fp-yrs">${s.steps[0].year} — ${s.steps.at(-1).year}</div><h3>${esc(s.title)}</h3><p>${esc(s.subtitle)}</p><div class="fp-stamps">${s.steps.slice(0, 6).map((x) => `<span><b>${x.year}</b> ${esc(x.place)}</span>`).join("")}</div></div></div>`;
    } else if (pg === n - 1) {
      const ls = s.steps.filter((x) => x.lesson);
      inner = `<div class="article"><span class="kicker">本期启示</span><h2>从这门生意里学到的</h2>
        <ol class="lessons">${ls.map((x) => `<li>${esc(x.lesson)} <span class="muted small">（${x.year} · ${esc(x.title)}）</span></li>`).join("")}</ol></div>`;
    } else {
      const st = s.steps[pg - 1];
      inner = `<figure class="plate" style="margin:0">
        <div class="yearstamp">${st.year}</div>
        ${pic(st.img, { contain: isContain(st.img), fallback: st.year })}
        <figcaption>${credit(st.img, `${st.place} · ${st.year} — ${st.title}`) || `<span class="credit">${esc(st.place)} · ${st.year}</span>`}</figcaption>
      </figure>`;
    }
    return runhead(s, pg, "L") + inner + folio(pg, "L");
  }

  function rightHTML(s, pg) {
    const n = pagesOf(s);
    let inner;
    if (pg === 0) {
      inner = `<div class="article cover">
        <span class="kicker">专题 · ${s.steps[0].year}—${s.steps.at(-1).year}</span>
        <h2>${esc(s.title)}</h2>
        <p class="deck">${esc(s.subtitle)}</p>
        <div>${s.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        ${ticket(s.cta, "本期同款")}
        <ul class="toc">${s.steps.map((x, i) => `<li data-go="${i + 1}"><span class="y">${x.year}</span>${esc(x.title)}<span class="pg">${esc(x.place)}</span></li>`).join("")}</ul>
      </div>`;
    } else if (pg === n - 1) {
      const nx = STORIES[(STORIES.indexOf(s) + 1) % STORIES.length];
      const img = nx.steps.find((x) => IMAGES[x.img] && !isContain(x.img))?.img;
      inner = `<div class="article"><span class="kicker">下期预告</span>
        <div class="next-issue" data-next="${nx.id}">
          ${pic(img)}
          <h3 style="margin:4px 0;font-size:24px">${esc(nx.title)}</h3>
          <p class="muted" style="margin:0">${esc(nx.subtitle)}</p>
          <span class="more">翻开下一期 ›</span>
        </div>
        ${ticket(s.cta || SITE.cta, "读完带一份走")}
        <p class="muted small" style="margin-top:14px">或 <button class="link" data-home>返回头版</button> 看看其他故事。</p>
      </div>`;
    } else {
      const st = s.steps[pg - 1];
      inner = `<div class="article">
        <div class="dl">【${esc(st.place)}电】${st.year} 年</div>
        <h2>${esc(st.title)}</h2>
        <p class="body${/^[“"「《（(]/.test(st.text) ? "" : " dropcap"}">${esc(st.text)}</p>
        ${st.lesson ? `<blockquote>${esc(st.lesson)}</blockquote>` : ""}
        ${ticket(st.cta)}
        <div class="seq">第 ${pg} / ${s.steps.length} 站${s.steps[pg] ? ` · 下一站：${s.steps[pg].year} ${esc(s.steps[pg].place)}` : ""}</div>
        ${sameTime(s, st)}
      </div>`;
    }
    return runhead(s, pg, "R") + inner + folio(pg, "R");
  }

  // 同一时期：其他故事 / 编年大事里年份最接近的几条，展示同时代的商业图景
  function sameTime(s, st) {
    const near = ALL.filter((x) => !x.key.startsWith(`s:${s.id}:`) && Math.abs(x.year - st.year) <= 25)
      .sort((a, b) => Math.abs(a.year - st.year) - Math.abs(b.year - st.year)).slice(0, 4)
      .sort((a, b) => a.year - b.year);
    if (!near.length) return "";
    return `<div class="sametime"><h5>同一时期 · 世界商业</h5><ul>${near.map((x) => `<li data-key="${x.key}" style="--c:${x.color}">
      ${pic(x.img, { fallback: x.year })}<div><b>${x.year}</b> ${esc(x.title)}<small>${esc(x.place)} · ${esc(x.from)}</small></div></li>`).join("")}</ul></div>`;
  }

  const yearAt = (s, pg) => (pg === 0 ? s.steps[0].year : (s.steps[pg - 1] || s.steps.at(-1)).year);

  function buildFilm(s) {
    const n = pagesOf(s);
    const items = Array.from({ length: n }, (_, pg) => {
      if (pg === 0) return { img: s.steps.find((x) => IMAGES[x.img])?.img, y: "封面", t: s.title };
      if (pg === n - 1) return { img: s.steps.slice().reverse().find((x) => IMAGES[x.img])?.img, y: "封底", t: "本期启示" };
      const st = s.steps[pg - 1];
      return { img: st.img, y: st.year, t: st.title };
    });
    $("film").innerHTML = items.map((x, pg) => `<div class="frame" data-go="${pg}">${pic(x.img, { fallback: x.y })}<div class="y">${x.y}</div><div class="t">${esc(x.t)}</div></div>`).join("");
    const y0 = s.steps[0].year, y1 = s.steps.at(-1).year;
    const pad = Math.max(2, Math.round((y1 - y0) * 0.04));
    state.range = [y0 - pad, y1 + pad];
    const pct = (y) => ((y - state.range[0]) / (state.range[1] - state.range[0])) * 100;
    $("ruler").innerHTML = `<div class="band"></div>` +
      [...new Set(s.steps.map((x) => x.year))].map((y) => `<i style="left:${pct(y)}%" title="${y}"></i>`).join("") +
      `<span class="lb" style="left:${pct(y0)}%">${y0}</span><span class="lb" style="left:${pct(y1)}%">${y1}</span>` +
      `<div class="cursor" id="cursor"></div>`;
  }

  function updateChrome() {
    const s = storyById[state.story], pg = state.pg, n = pagesOf(s);
    const y = yearAt(s, pg);
    $("rTitle").textContent = s.title;
    $("rEra").textContent = `${y} 年 · ${eraOf(y).name}`;
    $("rPage").textContent = `第 ${pg + 1} / ${n} 帖`;
    $("prev").disabled = pg === 0;
    $("next").disabled = pg === n - 1;
    const pct = ((y - state.range[0]) / (state.range[1] - state.range[0])) * 100;
    $("cursor").style.left = pct + "%";
    $("cursor").textContent = y;
    const frames = [...$("film").children];
    frames.forEach((f, i) => f.classList.toggle("on", i === pg));
    const cur = frames[pg];
    if (cur) {
      const win = $("film").parentElement.clientWidth;
      $("film").style.transform = `translateX(${Math.round(win / 2 - (cur.offsetLeft + cur.offsetWidth / 2))}px)`;
    }
    syncUrl();
  }

  function openStory(id, pg = 0) {
    const s = storyById[id];
    if (!s) return;
    stopPlay();
    pauseMachine();
    closeModal();
    state.story = id;
    state.pg = Math.max(0, Math.min(pagesOf(s) - 1, pg));
    $("front").hidden = true;
    $("reader").hidden = false;
    scrollTo(0, 0);
    buildFilm(s);
    $("pL").innerHTML = leftHTML(s, state.pg);
    $("pR").innerHTML = rightHTML(s, state.pg);
    requestAnimationFrame(updateChrome);
  }

  function go(n) {
    const s = storyById[state.story];
    n = Math.max(0, Math.min(pagesOf(s) - 1, n));
    if (n === state.pg || state.anim) return;
    const dir = n > state.pg ? 1 : -1;
    const oldL = $("pL").innerHTML, oldR = $("pR").innerHTML;
    const L = leftHTML(s, n), R = rightHTML(s, n);
    state.pg = n;
    updateChrome();
    if (narrow() || reduceMotion) {
      $("pL").innerHTML = L; $("pR").innerHTML = R;
      const b = $("book"); b.classList.remove("swap"); void b.offsetWidth; b.classList.add("swap");
      if (narrow()) scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    state.anim = true;
    const leaf = document.createElement("div");
    leaf.className = "leaf " + (dir > 0 ? "next" : "prev");
    if (dir > 0) {
      leaf.innerHTML = `<div class="face front page right paper">${oldR}</div><div class="face back page left paper">${L}</div>`;
      $("pR").innerHTML = R;
    } else {
      leaf.innerHTML = `<div class="face front page left paper">${oldL}</div><div class="face back page right paper">${R}</div>`;
      $("pL").innerHTML = L;
    }
    $("book").appendChild(leaf);
    const done = () => {
      if (!leaf.isConnected) return;
      if (dir > 0) $("pL").innerHTML = L; else $("pR").innerHTML = R;
      leaf.remove();
      state.anim = false;
    };
    leaf.addEventListener("animationend", (e) => { if (e.target === leaf) done(); });
    setTimeout(done, 1400); // 兜底：动画事件丢失时也能解锁
  }

  $("prev").onclick = () => { stopPlay(); go(state.pg - 1); };
  $("next").onclick = () => { stopPlay(); go(state.pg + 1); };
  $("home").onclick = goHome;
  $("film").addEventListener("click", (e) => { const f = e.target.closest("[data-go]"); if (f) { stopPlay(); go(+f.dataset.go); } });
  $("book").addEventListener("click", (e) => {
    const t = e.target.closest("[data-go]"); if (t) return go(+t.dataset.go);
    const k = e.target.closest("[data-key]"); if (k) return openKey(k.dataset.key);
    const nx = e.target.closest("[data-next]"); if (nx) return openStory(nx.dataset.next, 0);
    if (e.target.closest("[data-home]")) return goHome();
    // 点击右半页翻下一页，左半页翻上一页
    if (e.target.closest("a, button, .ticket")) return;
    const r = $("book").getBoundingClientRect();
    if (!narrow()) { stopPlay(); go(state.pg + (e.clientX > r.left + r.width / 2 ? 1 : -1)); }
  });
  $("play").onclick = () => (state.playing ? stopPlay() : startPlay());
  $("tone").onclick = () => {
    document.body.classList.toggle("color");
    $("tone").textContent = document.body.classList.contains("color") ? "原图色彩" : "旧报色调";
  };

  function startPlay() {
    const s = storyById[state.story];
    if (state.pg >= pagesOf(s) - 1) go(0);
    $("play").textContent = "❚❚ 暂停";
    state.playing = setInterval(() => {
      if (state.pg >= pagesOf(s) - 1) return stopPlay();
      go(state.pg + 1);
    }, 5000);
  }
  function stopPlay() {
    clearInterval(state.playing);
    state.playing = null;
    $("play").textContent = "▶ 自动翻页";
  }
  function goHome() {
    stopPlay();
    state.story = null;
    $("reader").hidden = true;
    $("front").hidden = false;
    syncUrl();
  }

  // 触屏左右滑动翻页
  let touchX = null;
  $("book").addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  $("book").addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX; touchX = null;
    if (Math.abs(dx) > 60) { stopPlay(); go(state.pg + (dx < 0 ? 1 : -1)); }
  });

  /* ================= 号外（编年大事） ================= */
  const evSorted = EVENTS.slice().sort((a, b) => a.year - b.year);
  function openEvent(year) {
    const i = evSorted.findIndex((e) => e.year === year);
    if (i < 0) return;
    pauseMachine();
    const e = evSorted[i], pv = evSorted[i - 1], nx = evSorted[i + 1];
    showModal(`
      <div class="extra">号外</div>
      <div class="dl muted">【${esc(e.place)}电】${e.year} 年 · ${esc(eraOf(e.year).name)}</div>
      <h2>${esc(e.title)}</h2>
      ${pic(e.img, { contain: isContain(e.img) })}
      <p class="small muted" style="margin:0">${credit(e.img)}</p>
      <p class="dropcap">${esc(e.text)}</p>
      <div style="display:flex;justify-content:space-between;gap:12px">
        ${pv ? `<button class="link" data-ev="${pv.year}">‹ ${pv.year} ${esc(pv.title)}</button>` : "<span></span>"}
        ${nx ? `<button class="link" data-ev="${nx.year}">${nx.year} ${esc(nx.title)} ›</button>` : ""}
      </div>`, `event=${e.year}`);
  }

  /* ================= 看图猜年份 ================= */
  const QUIZ_N = 5, QMID = Math.round((SITE.quiz[0] + SITE.quiz[1]) / 2);
  function startQuiz() {
    pauseMachine();
    let pool = ALL.filter((x) => IMAGES[x.img]);
    if (pool.length < 3) pool = ALL.slice();
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    state.quiz = { qs: pool.slice(0, QUIZ_N), i: 0, score: 0 };
    if (!state.quiz.qs.length) return;
    quizQuestion();
  }
  function quizQuestion() {
    const q = state.quiz, it = q.qs[q.i];
    showModal(`<div class="quiz">
      <div class="extra">看图猜年份</div>
      <div class="muted small">第 ${q.i + 1} / ${q.qs.length} 题 · 得分 ${q.score}</div>
      <h2>${esc(it.title)}</h2>
      ${pic(it.img, { contain: isContain(it.img), fallback: "？" })}
      <p class="muted small" style="margin:0">地点：${esc(it.place)} · 出自：${esc(it.from)}</p>
      <div class="guess" id="gz">${QMID}</div>
      <input type="range" id="gr" min="${SITE.quiz[0]}" max="${SITE.quiz[1]}" value="${QMID}" />
      <div class="row"><span class="muted small">${SITE.quiz[0]}</span><button class="go" id="gok">落笔</button><span class="muted small">${SITE.quiz[1]}</span></div>
      <p id="gres"></p>
    </div>`);
    $("gr").oninput = () => ($("gz").textContent = $("gr").value);
    $("gok").onclick = () => {
      const g = +$("gr").value, diff = Math.abs(g - it.year);
      const pts = Math.max(0, Math.round(100 * (1 - diff / Math.max(20, Math.round((SITE.quiz[1] - SITE.quiz[0]) / 12)))));
      q.score += pts;
      $("gr").disabled = true;
      $("gres").innerHTML = `答案：<b style="color:var(--red)">${it.year}</b> 年，相差 ${diff} 年 · +${pts} 分<br><span class="muted">${esc(it.text)}</span>`;
      const last = q.i === q.qs.length - 1;
      $("gok").textContent = last ? "看结果 ›" : "下一题 ›";
      $("gok").onclick = () => {
        if (!last) { q.i++; return quizQuestion(); }
        const max = q.qs.length * 100;
        const rank = q.score >= max * 0.8 ? "商业史学家" : q.score >= max * 0.55 ? "资深主笔" : q.score >= max * 0.3 ? "见习记者" : "报童";
        showModal(`<div class="quiz" style="text-align:center"><div class="extra">成绩揭晓</div>
          <div class="guess">${q.score} / ${max}</div><h2>本报授予您：${rank}</h2>
          <button class="go" id="again">再来一局</button></div>`);
        $("again").onclick = startQuiz;
      };
    };
  }
  $("quizBtn").onclick = startQuiz;

  /* ---------- 弹窗 ---------- */
  $("modal").querySelector(".clip").classList.add("paper");
  function showModal(html, hash) {
    $("mBody").innerHTML = html;
    $("modal").hidden = false;
    state.modalHash = hash || null;
    syncUrl();
  }
  function closeModal() {
    $("modal").hidden = true;
    state.modalHash = null;
    syncUrl();
  }
  $("mClose").onclick = closeModal;
  $("modal").addEventListener("click", (e) => {
    if (e.target === $("modal")) return closeModal();
    const b = e.target.closest("[data-ev]");
    if (b) openEvent(+b.dataset.ev);
  });

  /* ---------- 检索 ---------- */
  let hits = [], hitOn = -1;
  $("q").addEventListener("input", () => {
    const q = $("q").value.trim().toLowerCase();
    if (!q) { $("results").hidden = true; return; }
    const has = (t) => t != null && String(t).toLowerCase().includes(q);
    hits = [
      ...STORIES.filter((s) => has(s.title) || has(s.subtitle) || s.tags.some(has)).map((s) => ({ label: s.title, note: "专题", act: () => openStory(s.id, 0) })),
      ...ALL.filter((x) => has(x.title) || has(x.text) || has(x.place) || has(x.year))
        .map((x) => ({ label: `${x.year} ${x.title}`, note: `${x.place} · ${x.from}`, act: () => openKey(x.key) }))
    ].slice(0, 16);
    hitOn = -1;
    $("results").innerHTML = hits.length ? hits.map((h, j) => `<li data-j="${j}">${esc(h.label)}<small>${esc(h.note)}</small></li>`).join("") : "<li>本报暂无相关报道</li>";
    $("results").hidden = false;
  });
  $("q").addEventListener("keydown", (e) => {
    if ($("results").hidden || !hits.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      hitOn = (hitOn + (e.key === "ArrowDown" ? 1 : -1) + hits.length) % hits.length;
      [...$("results").children].forEach((li, j) => li.classList.toggle("on", j === hitOn));
    } else if (e.key === "Enter") pick(hits[Math.max(0, hitOn)]);
  });
  $("results").addEventListener("click", (e) => { e.stopPropagation(); const li = e.target.closest("li[data-j]"); if (li) pick(hits[+li.dataset.j]); });
  function pick(h) { if (!h) return; $("results").hidden = true; $("q").value = ""; h.act(); }
  document.addEventListener("click", (e) => { if (!e.target.closest(".search")) $("results").hidden = true; });

  /* ---------- 键盘 / URL / 尺寸 ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" && e.target.type !== "range") return;
    if (e.key === "Escape") { if (!$("modal").hidden) closeModal(); else if (state.story) goHome(); return; }
    if (!$("modal").hidden) return;
    if (!state.story) {
      if (e.key === " " && e.target === document.body) { e.preventDefault(); M.playing ? pauseMachine() : playMachine(); }
      return;
    }
    if (e.key === "ArrowRight") { e.preventDefault(); stopPlay(); go(state.pg + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); stopPlay(); go(state.pg - 1); }
    else if (e.key === " ") { e.preventDefault(); state.playing ? stopPlay() : startPlay(); }
  });

  let booted = false;
  function syncUrl() {
    if (!booted) return;
    const p = new URLSearchParams();
    const cur = new URLSearchParams(location.search);
    ["d", "draft"].forEach((k) => { if (cur.has(k)) p.set(k, cur.get(k)); });
    if (state.story) { p.set("story", state.story); p.set("page", state.pg); }
    if (state.modalHash) { const [k, v] = state.modalHash.split("="); p.set(k, v); }
    const qs = p.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }
  addEventListener("resize", () => { if (state.story) updateChrome(); });

  const params = new URLSearchParams(location.search);
  if (params.has("year")) setYear(+params.get("year") || MIN_YEAR);
  if (storyById[params.get("story")]) openStory(params.get("story"), +params.get("page") || 0);
  if (params.get("event")) openEvent(+params.get("event"));
  booted = true;
  // 供扩展模块（如家谱）调用
  window.APP = { esc, pic, credit, isContain, showModal, closeModal, pauseMachine, setYear, openKey, ticket, year: () => M.year, eraOf };
  syncUrl();
  // 首次进入头版自动播放一段历史变迁
  if (!state.story && !params.has("year") && !params.get("event") && !reduceMotion) setTimeout(() => { if (!M.playing && M.year === MIN_YEAR && !state.story) playMachine(); }, 1200);
})();
