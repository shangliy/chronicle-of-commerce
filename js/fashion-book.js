/* 風尚誌 · 翻页版：同一份 MAG 数据，排成一本左右翻页的杂志。
   排版：封面 → 目录 / 冷开场 → 全篇之问 → 每一幕一个跨页（左图右题）→ 每一章“左页大图 + 右页正文”，
   正文按页面实际高度自动分页（旁白、人物卡、猜一猜、证物、影片、数字、引语依次流进去）→ 尾声 → 衣橱 → 影像 → 符号 → 封底。
   宽屏是双页跨页（3D 翻页），窄屏是单页。窗口尺寸一变就重新排版，并停在原来那一页。
   翻页：← → 键、空格、点页面左右两侧、手机上左右滑、底部拖动页码条。 */
(() => {
  const MAG = window.MAG, IMAGES = window.IMAGES || {};
  if (!MAG) return;
  const { icon, silPath } = window.FASHION;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const CH = MAG.chapters, ERAS = MAG.eras, CODES = MAG.codes;
  const CAST = MAG.cast || {}, LOGOS = MAG.logos || {}, LOOKS = MAG.looks || {}, VIDEOS = MAG.videos || {}, CAP = MAG.captions || {};
  const NUM = "零一二三四五六七八九十";
  const ACTS = (MAG.acts || []).map((a, k) => ({ ...a, no: k + 1 }));
  const actAt = {};
  CH.forEach((c, i) => { const a = ACTS.find((x) => x.from === c.year); if (a && !Object.values(actAt).includes(a)) actAt[i] = a; });
  const actOf = (i) => { let a = ACTS[0]; for (let k = 0; k <= i; k++) if (actAt[k]) a = actAt[k]; return a; };
  const firstOf = {};
  CH.forEach((c, i) => { if (!(c.year in firstOf)) firstOf[c.year] = i; });
  const chOfYear = (y) => (y in firstOf ? firstOf[y] : CH.reduce((b, c, k) => (c.year <= y ? k : b), 0));
  const eraOf = (y) => ERAS.reduce((a, e) => (y >= e.start ? e : a), ERAS[0]);
  const silOf = (y) => (MAG.silhouettes || []).reduce((a, s) => (y >= s.y ? s : a), null);
  const codeById = Object.fromEntries(CODES.map((c) => [c.id, c]));
  const unlockAt = {};
  CH.forEach((c, i) => (c.codes || []).forEach((id) => { if (!(id in unlockAt)) unlockAt[id] = i; }));
  const lookCh = {};
  CH.forEach((c, i) => (c.looks || []).forEach((id) => { if (!(id in lookCh)) lookCh[id] = i; }));

  const pic = (name, { cls = "", alt, eager = false } = {}) => {
    const m = IMAGES[name];
    return m ? `<img${cls ? ` class="${cls}"` : ""} src="${esc(m.src)}" width="${m.w}" height="${m.h}" alt="${esc(alt ?? CAP[name] ?? "")}" ${eager ? "" : `loading="lazy"`} decoding="async" referrerpolicy="no-referrer" draggable="false">` : "";
  };
  const credit = (name) => {
    const m = IMAGES[name];
    return m ? `<a href="${esc(m.page)}" target="_blank" rel="noopener">${esc(m.artist || "Wikimedia Commons")} · ${esc(m.license)}</a>` : "";
  };
  const chunk = (arr, n) => arr.reduce((o, x, i) => (i % n ? o[o.length - 1].push(x) : o.push([x]), o), []);

  // —— 积木：每一块都是一个可以整体放进页面的单元 ——
  let pollN = 0;
  const seenCast = new Set();
  const say = (b) => {
    if (typeof b === "string") b = b.startsWith("问：") ? { t: b.slice(2), ask: true } : { t: b };
    if (b.cast) {
      const p = CAST[b.cast];
      if (!p || seenCast.has(b.cast)) return "";
      seenCast.add(b.cast);
      const face = p.img && IMAGES[p.img] ? pic(p.img, { alt: p.name }) : `<span class="ini">${esc(p.name.slice(0, 1))}</span>`;
      return `<div class="b-cast"><div class="cf">${face}</div><div><span>登场</span><b>${esc(p.name)}</b><em>${esc(p.role)}</em>${p.note ? `<p>${esc(p.note)}</p>` : ""}</div></div>`;
    }
    if (b.poll) {
      return `<div class="b-guess" data-answer="${b.poll.answer}" data-poll="${pollN++}"><span>猜一猜</span><b>${esc(b.poll.q)}</b>
        <div class="opts">${b.poll.options.map((o, k) => `<button data-opt="${k}">${esc(o)}</button>`).join("")}</div><small>选一个，再翻页</small></div>`;
    }
    const echo = b.echo ? `<button class="echo" data-echo="${b.echo}" title="翻回 ${b.echo} 年">↩ ${b.echo}</button>` : "";
    const code = b.code ? `<button class="b-code" data-code="${b.code}" title="${esc(codeById[b.code]?.name)}">${icon(b.code)}</button>` : "";
    return `<p class="b-say${b.ask ? " ask" : ""}${b.echo ? " is-echo" : ""}">${echo}${esc(b.t)}${code}</p>`;
  };
  const lookCard = (id) => {
    const l = LOOKS[id];
    if (!l || !IMAGES[l.img]) return "";
    return `<button class="lk" data-look="${id}"><span class="lk-img">${pic(l.img, { alt: l.name })}</span><span class="lk-tx"><em>${l.y}</em><b>${esc(l.name)}</b><small>${esc(l.where || "")}</small></span></button>`;
  };
  const looksBlock = (ids, kick = "证物") => {
    const html = ids.map(lookCard).join("");
    return html ? `<div class="b-looks n${ids.length}"><div class="b-kick"><span>${kick}</span><i></i></div><div class="grid">${html}</div></div>` : "";
  };
  const vidBlock = (key) => {
    const v = VIDEOS[key];
    return v ? `<div class="b-vid" data-yt="${esc(v.yt)}"><button class="play" aria-label="播放：${esc(v.t)}"><img src="https://i.ytimg.com/vi/${encodeURIComponent(v.yt)}/hqdefault.jpg" alt="" loading="lazy" referrerpolicy="no-referrer" draggable="false"><i></i></button>
      <div class="meta"><span>CHANEL 官方影片</span><b>${esc(v.t)}</b>${v.note ? `<em>${esc(v.note)}</em>` : ""}</div></div>` : "";
  };
  const logoImg = (id) => { const g = LOGOS[id]; return g && IMAGES[g.img] ? pic(g.img, { alt: g.name }) : `<b>${esc(g?.name || id)}</b>`; };
  const logosBlock = (ids) => ids?.length ? `<div class="b-logos"><span>本章出场</span>${ids.map((id) => `<i title="${esc(LOGOS[id]?.name || id)}">${logoImg(id)}</i>`).join("")}</div>` : "";

  // 填空页（双页模式里，为了让每章都从左页开始）：一页品牌符号“广告”
  let fillN = 0;
  const filler = () => {
    const c = CODES[fillN++ % CODES.length];
    return { key: `fill-${fillN}`, bleed: true, cls: "pg-ad", filler: true,
      body: `<button class="ad" data-code="${c.id}">${icon(c.id)}<span>品牌符号 · ${esc(c.when)}</span><b>${esc(c.name)}</b><p>${esc(c.desc)}</p></button>` };
  };

  // —— 排版：把一串积木流进若干页 ——
  const measure = $("#measure");
  const wrap = (p, i) => {
    const no = i > 0 && !p.noNum ? `<footer class="pg-no">${i}</footer>` : "";
    const inner = p.bleed ? p.body : `<header class="folio"><span>${esc(p.head || MAG.title)}</span><b>${esc(p.headR || "")}</b></header><div class="flow">${p.body}</div>`;
    return `<div class="page ${p.cls || ""}${p.dark ? " dark" : ""}" style="--accent:${p.accent || "#a8843d"}">${inner}${no}</div>`;
  };
  // floatFrom：从这个下标起的积木（证物、影片、数字……）可以往前补空——放不下时，先找后面能塞进本页的小块
  const flow = (blocks, base, floatFrom = Infinity) => {
    const out = [];
    measure.innerHTML = wrap({ ...base, body: "" }, 1);
    const box = $(".flow", measure);
    let cur = [];
    const over = () => box.scrollHeight > box.clientHeight + 1;
    const q = blocks.map((h, i) => ({ h, fl: i >= floatFrom })).filter((b) => b.h);
    while (q.length) {
      const b = q.shift();
      box.insertAdjacentHTML("beforeend", b.h);
      if (over() && cur.length) {
        box.lastElementChild.remove();
        if (b.fl) {
          for (let j = 0; j < q.length; j++) {
            box.insertAdjacentHTML("beforeend", q[j].h);
            if (over()) box.lastElementChild.remove();
            else { cur.push(q[j].h); q.splice(j--, 1); }
          }
        }
        out.push(cur);
        cur = [];
        box.innerHTML = b.h;
      }
      cur.push(b.h);
    }
    if (cur.length) out.push(cur);
    return out.map((bs, n) => ({ ...base, key: `${base.key}-${n}`, body: bs.join(""), headR: n ? `${base.headR || ""}（续）` : base.headR }));
  };

  // —— 整本书的页面清单 ——
  let mode = "spread", P = [], chStart = [], actStart = {}, finStart = 0;
  const buildPages = () => {
    seenCast.clear(); pollN = 0; fillN = 0;
    P = []; chStart = []; actStart = {};
    const spread = mode === "spread";
    const toLeft = () => { if (spread && P.length % 2 === 0) P.push(filler()); };
    const cv = MAG.cover;

    P.push({ key: "cover", bleed: true, cls: "pg-cover", noNum: true, body: `
      <div class="cv-photo">${pic(cv.img, { eager: true })}</div>
      <div class="cv-mast"><b>${esc(MAG.titleEn)}</b><span>${esc(MAG.title)} · ${esc(MAG.issue)}</span></div>
      <ul class="cv-lines">${MAG.coverlines.map((l, i) => `<li><b>${String(i + 1).padStart(2, "0")}</b>${esc(l)}</li>`).join("")}</ul>
      <div class="cv-feature">${MAG.logo && IMAGES[MAG.logo.img] ? `<div class="cv-logo">${pic(MAG.logo.img, { eager: true, alt: MAG.brand })}</div>` : ""}
        <span>${esc(cv.kicker)}</span><h1>${esc(cv.name)}</h1><p>${esc(cv.line)}</p><em class="cv-hint">翻开 →</em></div>` });
    // 目录（页码在全部排好之后回填）
    P.push({ key: "toc", bleed: true, cls: "pg-toc", body: `
      <div class="toc-in"><span class="kick">Sommaire</span><h2>目录</h2>
        <ol>${ACTS.map((a) => `<li><button data-goto="act-${a.no}"><em>第${NUM[a.no]}幕</em><b>${esc(a.title)}</b><i>{{act-${a.no}}}</i></button></li>`).join("")}
        <li><button data-goto="fin"><em>尾声</em><b>${esc(MAG.question || "答案")}</b><i>{{fin}}</i></button></li></ol>
        <p class="toc-note">${CH.length} 个场景 · ${Object.keys(LOOKS).length} 件证物 · ${Object.keys(VIDEOS).length} 段 CHANEL 官方影片<br>← → 翻页 · 点页面两侧 · 手机上左右滑</p></div>` });
    P.push(...flow([...(MAG.cold || []).map(say)], { key: "cold", cls: "pg-cold", dark: true, accent: "#d9c08a", head: "冷开场", headR: "1954" }));
    if (MAG.question) {
      const S = MAG.stake;
      P.push({ key: "q", bleed: true, cls: "pg-q", dark: true, accent: "#d9c08a", body: `<div class="q-in"><span class="kick">全篇之问</span><h2>${esc(MAG.question)}</h2>
        ${S ? `<div class="q-stake"><span>${esc(S.label)}</span>${S.points.map((p) => `<div><b>${p.y}</b><i style="--v:${p.v}"></i><em>?</em></div>`).join("")}</div>` : ""}
        <p>带着这个问题，从 ${CH[0].year} 年读起。</p></div>` });
    }
    CH.forEach((c, i) => {
      const era = eraOf(c.year), act = actOf(i), dark = era.tone === "dark";
      const base = { accent: era.accent, dark };
      if (actAt[i]) {
        const a = actAt[i], ch = CH.map((x, k) => ({ x, k })).filter(({ k }) => actOf(k) === a);
        toLeft();
        actStart[a.no] = P.length;
        P.push({ key: `act-${a.no}-L`, bleed: true, cls: `pg-actL${a.img && IMAGES[a.img] ? " has-img" : ""}`, ...base, body: `
          ${a.img && IMAGES[a.img] ? `<div class="bg">${pic(a.img)}</div>` : ""}<div class="actL-no"><span>Acte</span><b>${a.no}</b></div>` });
        P.push({ key: `act-${a.no}-R`, bleed: true, cls: "pg-actR", ...base, body: `
          <div class="actR-in"><span class="kick">第${NUM[a.no]}幕</span><h2>${esc(a.title)}</h2>${a.hook ? `<p>${esc(a.hook)}</p>` : ""}
          <ol>${ch.map(({ x, k }) => `<li><button data-goto="ch-${k}"><em>${x.year}</em><b>${esc(x.title)}</b><i>{{ch-${k}}}</i></button></li>`).join("")}</ol></div>` });
      }
      toLeft();
      chStart[i] = P.length;
      const img = c.img && IMAGES[c.img];
      if (img) {
        P.push({ key: `ch-${i}-pic`, bleed: true, cls: "pg-pic", ...base, ch: i, body: `
          <figure class="pic"><div class="pic-img">${pic(c.img)}</div>
            <figcaption><em>${c.year}</em><span>${esc(c.place)}</span><small>${esc(CAP[c.img] || "")}</small><small class="cr">${credit(c.img)}</small></figcaption></figure>` });
      } else {
        const sil = silOf(c.year);
        P.push({ key: `ch-${i}-pic`, bleed: true, cls: "pg-typo", ...base, ch: i, body: `
          <div class="typo"><span class="fr">${esc(era.fr)}</span><em>${c.year}</em>
          ${sil ? `<svg viewBox="0 0 60 122" aria-hidden="true"><circle cx="30" cy="10" r="6"/><path d="${silPath(sil)}"/></svg><small>${esc(sil.name)}</small>` : ""}
          <span class="pl">${esc(c.place)}</span></div>` });
      }
      const beats = (c.beats || []).map(say);
      const extras = [];
      chunk(c.looks || [], 4).forEach((ids, k) => extras.push(looksBlock(ids, k ? "证物（续）" : "证物")));
      extras.push(logosBlock(c.logos));
      [].concat(c.video || []).forEach((v) => extras.push(vidBlock(v)));
      if (c.stat) extras.push(`<div class="b-stat"><b>${esc(c.stat.n)}</b><span>${esc(c.stat.l)}</span></div>`);
      if (c.quote) extras.push(`<blockquote class="b-quote"><p>${esc(c.quote.t)}</p><cite>—— ${esc(c.quote.by)}</cite></blockquote>`);
      (c.codes || []).filter((id) => unlockAt[id] === i).forEach((id) => extras.push(`<button class="b-unlock" data-code="${id}">${icon(id)}<span>新符号诞生</span><b>${esc(codeById[id].name)}</b></button>`));
      if (c.lesson) extras.push(`<p class="b-lesson"><span>启示</span>${esc(c.lesson)}</p>`);
      const head = `<header class="b-head"><span>${esc(c.place)}${c.scene ? ` · ${esc(c.scene)}` : ""}</span><h2>${esc(c.title)}</h2></header>`;
      P.push(...flow([head, ...beats, ...extras], { key: `ch-${i}`, cls: "pg-text", ...base, ch: i, head: `${c.year} · ${era.name}`, headR: `第${NUM[act.no]}幕 · ${act.title}` }, 1 + beats.length));
    });

    // —— 尾声 ——
    toLeft();
    finStart = P.length;
    const S = MAG.stake;
    const stakeBlock = S ? `<div class="b-stake">${S.points.map((p) => `<div><b>${p.v}%</b><em>${p.y}</em><span>${esc(p.l)}</span></div>`).join("")}</div>` : "";
    P.push(...flow([`<header class="b-head"><span>尾声</span><h2>${esc(MAG.question || "")}</h2></header>`, stakeBlock, ...(MAG.ending || []).slice(1).map(say)],
      { key: "fin", cls: "pg-text pg-end", dark: true, accent: "#d9c08a", head: "尾声", headR: "Épilogue" }));
    const lookIds = Object.keys(LOOKS).filter((id) => IMAGES[LOOKS[id].img]).sort((a, b) => LOOKS[a].y - LOOKS[b].y);
    const per = mode === "spread" ? 6 : 6;
    toLeft();
    chunk(lookIds, per).forEach((ids, k, all) => P.push({ key: `ward-${k}`, cls: "pg-ward", head: "Le Vestiaire · 一百年的衣橱", headR: `${LOOKS[ids[0]].y} — ${LOOKS[ids.at(-1)].y} · ${k + 1}/${all.length}`,
      body: `<div class="ward">${ids.map(lookCard).join("")}</div>` }));
    chunk(Object.keys(VIDEOS), 4).forEach((ks, k) => P.push({ key: `film-${k}`, cls: "pg-films", dark: true, accent: "#d9c08a", head: "Les Films · 影像", headR: "CHANEL 官方 YouTube 频道",
      body: `<div class="films">${ks.map(vidBlock).join("")}</div>` }));
    chunk(CODES, 5).forEach((cs, k) => P.push({ key: `codes-${k}`, cls: "pg-codes", head: `${MAG.brand} · 符号词典`, headR: `${CODES.length} 个符号，组成一个品牌`,
      body: `<div class="codes">${cs.map((c) => `<button data-code="${c.id}">${icon(c.id)}<b>${esc(c.name)}</b><em>${esc(c.when)}</em><p>${esc(c.desc)}</p></button>`).join("")}</div>` }));
    if (Object.keys(LOGOS).length) P.push({ key: "logos", cls: "pg-logos", head: "Dramatis Personae · 出场的名字", headR: "",
      body: `<div class="lw">${Object.keys(LOGOS).map((id) => `<i>${logoImg(id)}</i>`).join("")}</div><p class="note">品牌标识来自维基共享资源，仅用于新闻与评论性引用，商标归各自所有者。图片均为 Wikimedia Commons 上的自由授权作品，点击图片说明可查看作者与许可。</p>` });
    // 封底放在左页（合上的书）
    if (spread && P.length % 2 === 0) P.push(filler());
    P.push({ key: "back", bleed: true, cls: "pg-back", dark: true, noNum: true, body: `
      <div class="back-in">${MAG.logo && IMAGES[MAG.logo.img] ? `<div class="cv-logo">${pic(MAG.logo.img, { alt: MAG.brand })}</div>` : ""}
        <b>${esc(MAG.titleEn)}</b><span>${esc(MAG.title)} · ${esc(MAG.issue)}</span>
        <p>想换一种读法？<a href="fashion.html">滚动版 · 带侧边衣橱时间线</a></p>
        <p><a href="index.html">商海时报</a> · <a href="family.html">罗斯柴尔德家报</a></p>
        <button data-goto="cover">↺ 回到封面</button></div>` });
    // 回填页码
    const fill = (html) => html.replace(/\{\{act-(\d+)\}\}/g, (_, n) => actStart[n] ?? "").replace(/\{\{ch-(\d+)\}\}/g, (_, n) => chStart[n] ?? "").replace("{{fin}}", finStart);
    P.forEach((p) => { p.body = fill(p.body); });
  };

  // —— 装订：双页模式下每一叶纸正面是右页、背面是下一个左页；单页模式下每页一叶 ——
  const book = $("#book"), stage = $("#stage");
  let leaves = [], f = 0, NL = 0;
  const DUR = 900;
  const bind = () => {
    const spread = mode === "spread";
    NL = spread ? Math.ceil(P.length / 2) : P.length;
    const html = [];
    for (let k = 0; k < NL; k++) {
      const fi = spread ? 2 * k : k, bi = spread ? 2 * k + 1 : -1;
      html.push(`<div class="leaf" data-k="${k}"><div class="face front" data-p="${fi}">${wrap(P[fi], fi)}</div><div class="face back" data-p="${bi}">${P[bi] ? wrap(P[bi], bi) : `<div class="page pg-blank"></div>`}</div></div>`);
    }
    book.innerHTML = html.join("");
    book.classList.toggle("single", !spread);
    leaves = $$(".leaf", book);
  };
  const pageOfF = (x) => (mode === "spread" ? Math.max(0, Math.min(P.length - 1, 2 * x)) : x);
  const fOfPage = (p) => (mode === "spread" ? Math.ceil(p / 2) : p);
  const visiblePages = () => (mode === "spread" ? [2 * f - 1, 2 * f].filter((p) => p >= 0 && p < P.length) : [f]);

  let hideT = 0;
  const layout = (from, animate) => {
    const lo = Math.min(from, f), hi = Math.max(from, f);
    leaves.forEach((el, k) => {
      const flipped = k < f, changed = (k >= lo && k < hi);
      el.classList.toggle("flipped", flipped);
      el.style.transitionDelay = animate && changed ? `${Math.abs(k - (f > from ? lo : hi - 1)) * 70}ms` : "0ms";
      el.style.zIndex = changed && animate ? 1000 + (f > from ? k : NL - k) : flipped ? k + 1 : NL - k;
      const near = mode === "spread" ? k >= lo - 1 && k <= hi : k >= lo - 1 && k <= hi;
      el.classList.toggle("off", !near);
      if (changed && animate) { el.classList.remove("turning"); void el.offsetWidth; el.classList.add("turning"); }
    });
    clearTimeout(hideT);
    hideT = setTimeout(() => leaves.forEach((el, k) => {
      el.classList.remove("turning");
      el.style.transitionDelay = "0ms";
      el.style.zIndex = k < f ? k + 1 : NL - k;
      const keep = mode === "spread" ? k >= f - 1 && k <= f : k === f;
      el.classList.toggle("off", !keep);
    }), animate ? DUR + (hi - lo) * 70 + 50 : 0);
    // 双页模式：合上时（封面 / 封底）把书挪到中间
    book.style.setProperty("--shift", mode === "spread" ? (f === 0 ? -1 : f >= NL ? 1 : 0) : 0);
    stopVideos();
    syncUI();
  };
  const goF = (x, animate = true) => {
    x = Math.max(0, Math.min(mode === "spread" ? NL : NL - 1, x));
    if (x === f && leaves.length && !animate) return layout(f, false);
    const from = f;
    f = x;
    const far = Math.abs(x - from) > 8;
    if (far) { book.classList.add("jump"); requestAnimationFrame(() => requestAnimationFrame(() => book.classList.remove("jump"))); }
    layout(from, animate && !far && !matchMedia("(prefers-reduced-motion: reduce)").matches);
  };
  const goPage = (p, animate = true) => goF(fOfPage(p), animate);
  const next = () => goF(f + 1);
  const prev = () => goF(f - 1);

  const stopVideos = () => {
    const vis = new Set(visiblePages());
    $$(".b-vid.playing", book).forEach((v) => {
      const p = +v.closest(".face").dataset.p;
      if (vis.has(p)) return;
      const yt = v.dataset.yt, ifr = v.querySelector("iframe");
      ifr?.replaceWith(Object.assign(document.createElement("button"), { className: "play", innerHTML: `<img src="https://i.ytimg.com/vi/${encodeURIComponent(yt)}/hqdefault.jpg" alt="" referrerpolicy="no-referrer"><i></i>` }));
      v.classList.remove("playing");
    });
  };

  // —— 底部页码条 ——
  const range = $("#scrub"), pgLabel = $("#pgLabel"), ticks = $("#ticks"), tip = $("#scrubTip");
  const labelOf = (p) => {
    const pg = P[p];
    if (!pg) return "";
    if (pg.ch != null) return `${CH[pg.ch].year} · ${CH[pg.ch].title}`;
    if (pg.key.startsWith("act-")) { const a = ACTS[+pg.key.split("-")[1] - 1]; return `第${NUM[a.no]}幕 · ${a.title}`; }
    return ({ cover: "封面", toc: "目录", q: "全篇之问", back: "封底" })[pg.key] || (pg.key.startsWith("cold") ? "冷开场" : pg.key.startsWith("fin") ? "尾声" : pg.key.startsWith("ward") ? "衣橱" : pg.key.startsWith("film") ? "影像" : pg.key.startsWith("codes") ? "符号词典" : pg.key.startsWith("logos") ? "出场的名字" : "品牌符号");
  };
  const renderTicks = () => {
    range.max = P.length - 1;
    ticks.innerHTML = ACTS.map((a) => `<button style="left:${(actStart[a.no] / (P.length - 1)) * 100}%" data-goto="act-${a.no}" title="第${NUM[a.no]}幕 · ${esc(a.title)}">${NUM[a.no]}</button>`).join("")
      + `<button style="left:${(finStart / (P.length - 1)) * 100}%" data-goto="fin" title="尾声">终</button>`;
  };
  const syncUI = () => {
    const vis = visiblePages(), p = vis.at(-1) ?? 0;
    range.value = p;
    range.style.setProperty("--v", `${(p / Math.max(1, P.length - 1)) * 100}%`);
    pgLabel.innerHTML = `<b>${vis.map((x) => (x === 0 ? "封面" : x)).join("–")}</b><span>/ ${P.length - 1}</span><em>${esc(labelOf(vis.find((x) => P[x]?.ch != null) ?? p))}</em>`;
    const pg = P[vis.find((x) => P[x]?.ch != null) ?? p];
    document.documentElement.style.setProperty("--accent", pg?.accent || "#a8843d");
    $("#prevBtn").disabled = f <= 0;
    $("#nextBtn").disabled = f >= (mode === "spread" ? NL : NL - 1);
    const ch = pg?.ch;
    if (booted) history.replaceState(null, "", ch != null ? `?year=${CH[ch].year}${ch !== firstOf[CH[ch].year] ? `&n=${ch - firstOf[CH[ch].year] + 1}` : ""}` : `?p=${p}`);
  };
  range.addEventListener("input", () => {
    const p = +range.value;
    tip.textContent = `${p} · ${labelOf(p)}`;
    tip.style.left = `${(p / Math.max(1, P.length - 1)) * 100}%`;
    tip.hidden = false;
  });
  range.addEventListener("change", () => { tip.hidden = true; goPage(+range.value); });

  // —— 尺寸：宽屏双页，窄屏单页 ——
  const size = () => {
    const vw = innerWidth, vh = innerHeight;
    const spread = vw >= 900 && vw > vh * 1.1;
    const top = vw < 600 ? 40 : 48, bottom = vw < 600 ? 58 : 66;
    const availH = vh - top - bottom - (spread ? 24 : 8), availW = vw - (spread ? 140 : 12);
    let ph, pw;
    if (spread) { ph = Math.min(availH, (availW / 2) / 0.7); pw = Math.round(ph * 0.7); ph = Math.round(ph); }
    else { pw = Math.round(Math.min(availW, availH * 0.78)); ph = Math.round(Math.min(availH, pw / 0.56)); }
    return { mode: spread ? "spread" : "single", pw, ph };
  };
  let dims = null, booted = false;
  const render = (keepKey) => {
    const d = size();
    dims = d;
    mode = d.mode;
    document.documentElement.style.setProperty("--pw", `${d.pw}px`);
    document.documentElement.style.setProperty("--ph", `${d.ph}px`);
    document.body.dataset.mode = mode;
    buildPages();
    bind();
    renderTicks();
    let p = 0;
    if (keepKey) {
      p = P.findIndex((x) => x.key === keepKey);
      if (p < 0) { const m = /^ch-(\d+)/.exec(keepKey); p = m ? chStart[+m[1]] : 0; }
    }
    f = fOfPage(Math.max(0, p));
    layout(f, false);
  };
  const curKey = () => { const vis = visiblePages(); return P[vis.at(-1)]?.key || P[vis[0]]?.key; };
  let rT = 0;
  addEventListener("resize", () => {
    clearTimeout(rT);
    rT = setTimeout(() => { const d = size(); if (!dims || d.mode !== dims.mode || Math.abs(d.ph - dims.ph) > 8 || Math.abs(d.pw - dims.pw) > 8) render(curKey()); }, 250);
  });

  // —— 交互 ——
  const goto = (t) => {
    if (t === "cover") return goPage(0);
    if (t === "fin") return goPage(finStart);
    const m = /^(act|ch)-(\d+)$/.exec(t);
    if (m) goPage(m[1] === "act" ? actStart[m[2]] : chStart[m[2]]);
  };
  const modal = $("#modal");
  const closeModal = () => { modal.hidden = true; modal.classList.remove("wide"); };
  const openModal = (html, wide = false) => { $("#modalBody").innerHTML = html; modal.classList.toggle("wide", wide); modal.hidden = false; $(".modal-x").focus(); };
  const openCode = (id) => {
    const c = codeById[id];
    const chs = CH.map((ch, i) => ({ ch, i })).filter(({ ch }) => (ch.codes || []).includes(id));
    openModal(`<div class="m-ico">${icon(id, "big")}</div><span class="m-kick">品牌符号 · ${esc(c.when)}</span><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p>
      ${chs.length ? `<div class="m-links">${chs.map(({ ch, i }) => `<button data-goto="ch-${i}">${ch.year} · ${esc(ch.title)} · 第 ${chStart[i]} 页 ›</button>`).join("")}</div>` : ""}`);
  };
  const openLook = (id) => {
    const l = LOOKS[id], at = id in lookCh ? lookCh[id] : chOfYear(l.y);
    openModal(`<figure class="m-look">${pic(l.img, { eager: true, alt: l.name })}<figcaption><span class="m-kick">${l.y} · ${esc(l.where || "")}</span><h3>${esc(l.name)}</h3><small>${credit(l.img)}</small>
      <button class="m-goto" data-goto="ch-${at}">翻到这一章：${CH[at].year} · ${esc(CH[at].title)} · 第 ${chStart[at]} 页 ›</button></figcaption></figure>`, true);
  };
  const playVid = (box) => {
    const btn = box.querySelector(".play");
    if (!btn) return;
    const fr = document.createElement("iframe");
    fr.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(box.dataset.yt)}?autoplay=1&rel=0&playsinline=1`;
    fr.title = box.querySelector(".meta b")?.textContent || "CHANEL";
    fr.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    fr.allowFullscreen = true;
    fr.referrerPolicy = "strict-origin-when-cross-origin";
    btn.replaceWith(fr);
    box.classList.add("playing");
  };
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!modal.hidden) {
      const g = t.closest("#modalBody [data-goto]");
      if (g) { closeModal(); goto(g.dataset.goto); }
      else if (t === modal || t.closest(".modal-x")) closeModal();
      return;
    }
    if (suppressClick) return;
    const o = t.closest(".b-guess [data-opt]");
    if (o) {
      const g = o.closest(".b-guess");
      if (g.classList.contains("done")) return;
      const k = +o.dataset.opt, ans = +g.dataset.answer;
      g.classList.add("done");
      $$("[data-opt]", g).forEach((x, j) => x.classList.add(j === ans ? "right" : j === k ? "wrong" : "dim"));
      g.querySelector("small").textContent = k === ans ? "猜对了，翻页 →" : `答案是「${o.parentNode.children[ans].textContent}」，翻页 →`;
      return;
    }
    const v = t.closest(".b-vid .play");
    if (v) return playVid(v.closest(".b-vid"));
    const lk = t.closest("[data-look]");
    if (lk) return openLook(lk.dataset.look);
    const c = t.closest("[data-code]");
    if (c) return openCode(c.dataset.code);
    const ec = t.closest("[data-echo]");
    if (ec) return goPage(chStart[chOfYear(+ec.dataset.echo)]);
    const gt = t.closest("[data-goto]");
    if (gt) return goto(gt.dataset.goto);
    if (t.closest("a, button, iframe, input, .b-vid")) return;
    // 点页面：左页往回，右页往前（单页模式：左三分之一往回）
    const face = t.closest(".face");
    if (!face) return;
    if (mode === "spread") face.classList.contains("back") ? prev() : next();
    else (e.clientX - book.getBoundingClientRect().left < book.offsetWidth * 0.3 ? prev() : next());
  });
  $("#prevBtn").addEventListener("click", prev);
  $("#nextBtn").addEventListener("click", next);
  $("#tocBtn").addEventListener("click", () => goPage(1));
  document.addEventListener("keydown", (e) => {
    if (!modal.hidden) { if (e.key === "Escape") closeModal(); return; }
    if (e.target.closest?.("input:not([type=range]), textarea")) return;
    if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); next(); }
    else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === "Home") goF(0);
    else if (e.key === "End") goPage(P.length - 1);
  });
  // 手机：左右滑
  let sx = 0, sy = 0, st = 0, suppressClick = false;
  stage.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; st = Date.now(); });
  stage.addEventListener("pointerup", (e) => {
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - st < 800) {
      dx < 0 ? next() : prev();
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 50);
    }
  });
  // 触控板 / 滚轮横向滑动也能翻
  let wheelLock = 0;
  stage.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) < 30 || Math.abs(e.deltaX) < Math.abs(e.deltaY) || Date.now() < wheelLock) return;
    wheelLock = Date.now() + 700;
    e.deltaX > 0 ? next() : prev();
  }, { passive: true });

  // —— 启动：等字体到位再量尺寸排版；支持 ?year=1955 / ?p=12 ——
  const boot = () => {
    render();
    const q = new URLSearchParams(location.search);
    const y = +q.get("year"), n = +q.get("n") || 1, p = +q.get("p");
    if (y) goPage(chStart[Math.min(CH.length - 1, chOfYear(y) + n - 1)] ?? 0, false);
    else if (p) goPage(p, false);
    document.body.classList.add("ready");
    setTimeout(() => { booted = true; }, 300);
  };
  (document.fonts?.ready || Promise.resolve()).then(() => setTimeout(boot, 50));
})();
