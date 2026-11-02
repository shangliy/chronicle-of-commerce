/* 風尚誌 · 引导式品牌故事
   封面 → 冷开场（抛出全篇之问）→ 五幕正片 → 尾声（回答开篇之问 · 衣橱 · 影像 · 符号词典）。
   正片：左栏固定（大号年份、时代、廓形、主线指标、掌舵人、品牌符号）；右栏每一年是一个场景：
   场景句 + 标题 → 逐句浮现的旁白（人物登场卡、猜一猜、回响穿插其中）→ 整幅图 → 证物条 / 出场品牌 / 官方影片。
   每件事只讲一次：年份只在左栏，问题只在开场与尾声，幕名只在幕间页。
   内容来自 window.MAG，图片元数据来自 window.IMAGES。 */
(() => {
  const MAG = window.MAG, IMAGES = window.IMAGES || {};
  if (!MAG) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const CH = MAG.chapters, ERAS = MAG.eras, CODES = MAG.codes, DIRS = MAG.directors || [];
  const CAST = MAG.cast || {}, LOGOS = MAG.logos || {}, LOOKS = MAG.looks || {}, VIDEOS = MAG.videos || {};
  const CAP = MAG.captions || {};
  const MIN = CH[0].year, MAX = Math.max(CH.at(-1).year, new Date().getFullYear());
  const QY = +new URLSearchParams(location.search).get("year");
  const codeById = Object.fromEntries(CODES.map((c) => [c.id, c]));
  const unlockAt = {};
  CH.forEach((c, i) => (c.codes || []).forEach((id) => { if (!(id in unlockAt)) unlockAt[id] = i; }));
  const eraOf = (y) => ERAS.reduce((a, e) => (y >= e.start ? e : a), ERAS[0]);
  const dirOf = (y) => DIRS.find((d) => y >= d.from && (d.to == null || y < d.to)) || null;
  const silOf = (y) => (MAG.silhouettes || []).reduce((a, s) => (y >= s.y ? s : a), null);
  const pct = (y) => ((y - MIN) / (MAX - MIN)) * 100;
  const NUM = "零一二三四五六七八九十";
  // 版本开关（在 html 里设 window.FASHION_MODE）：rewind 倒叙，从最新一章读回最早；mono 黑白底色；runway 秀场照排成 T 台大图
  const MODE = window.FASHION_MODE || {}, R = !!MODE.rewind;
  const ORD = CH.map((_, i) => i);
  if (R) ORD.reverse();
  const posOf = {};
  ORD.forEach((i, p) => (posOf[i] = p));
  if (MODE.mono) document.body.classList.add("mono");
  if (R) document.body.classList.add("rewind");
  // 倒叙叙事层（MAG.rewind）：按章节标题覆盖 beats、补章末的“倒带”问题，按幕号覆盖幕头导语
  const RW = (R && MAG.rewind) || {};
  const rwOf = (c) => (RW.ch || {})[c.title] || {};
  const ACTS = (MAG.acts || []).map((a, k) => ({ ...a, no: k + 1, hook: (RW.acts || {})[k + 1] || a.hook }));
  // 同一年可以有好几章：幕间页只放在第一章前，章节锚点加序号；回响 / 深链跳到这一年的第一章
  const actAt = {};
  CH.forEach((c, i) => { const a = ACTS.find((x) => x.from === c.year); if (a && !Object.values(actAt).includes(a)) actAt[i] = a; });
  if (R) {
    const starts = Object.keys(actAt).map(Number).sort((a, b) => a - b), rev = {};
    starts.forEach((s, k) => (rev[(starts[k + 1] ?? CH.length) - 1] = actAt[s]));
    Object.keys(actAt).forEach((k) => delete actAt[k]);
    Object.assign(actAt, rev);
  }
  const firstOf = {};
  CH.forEach((c, i) => { if (!(c.year in firstOf)) firstOf[c.year] = i; });
  const anchor = CH.map((c, i) => (firstOf[c.year] === i ? `y${c.year}` : `y${c.year}-${i - firstOf[c.year] + 1}`));
  const chOfYear = (y) => (y in firstOf ? firstOf[y] : CH.reduce((b, c, k) => (c.year <= y ? k : b), 0));
  // 每件证物归到哪一章：章节里列了就归那一章，否则按年份归
  const lookCh = {};
  CH.forEach((c, i) => (c.looks || []).forEach((id) => { if (!(id in lookCh)) lookCh[id] = i; }));
  Object.keys(LOOKS).forEach((id) => { if (!(id in lookCh)) lookCh[id] = CH.reduce((b, c, k) => (c.year <= LOOKS[id].y ? k : b), 0); });

  const { icon, silPath } = window.FASHION;

  const pic = (name, { eager = false, cls = "", alt } = {}) => {
    const m = IMAGES[name];
    return m ? `<img${cls ? ` class="${cls}"` : ""} src="${esc(m.src)}" width="${m.w}" height="${m.h}" alt="${esc(alt ?? CAP[name] ?? "")}" ${eager ? "" : `loading="lazy"`} decoding="async" referrerpolicy="no-referrer">` : "";
  };
  const credit = (name) => {
    const m = IMAGES[name];
    return m ? `<a href="${esc(m.page)}" target="_blank" rel="noopener">${esc(m.artist || "Wikimedia Commons")} · ${esc(m.license)}</a>` : "";
  };
  const ytPoster = (id) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;

  // —— 一句旁白 / 设问 / 登场 / 猜一猜 / 回响 ——
  let pollN = 0;
  const seenCast = new Set();
  const castCard = (id) => {
    const p = CAST[id];
    if (!p || seenCast.has(id)) return "";
    seenCast.add(id);
    const face = p.img && IMAGES[p.img] ? pic(p.img, { alt: p.name }) : `<span class="cast-ini">${esc(p.name.slice(0, 1))}</span>`;
    return `<div class="cast line"><div class="cast-face">${face}</div><div class="cast-tx"><span>登场</span><b>${esc(p.name)}</b><em>${esc(p.role)}</em>${p.note ? `<p>${esc(p.note)}</p>` : ""}</div></div>`;
  };
  const line = (b) => {
    if (typeof b === "string") b = b.startsWith("问：") ? { t: b.slice(2), ask: true } : { t: b };
    if (b.cast) return castCard(b.cast);
    const code = b.code ? ` data-pulse="${b.code}"` : "";
    if (b.poll) {
      const id = pollN++;
      return `<div class="guess line" data-poll="${id}" data-answer="${b.poll.answer}"${code}>
        <span class="g-kick">猜一猜</span><b>${esc(b.poll.q)}</b>
        <div class="g-opts">${b.poll.options.map((o, k) => `<button data-opt="${k}">${esc(o)}</button>`).join("")}</div>
        <small>选一个再往下读</small></div>`;
    }
    if (b.echo) return `<p class="line say echo"${code}><button class="echo-to" data-echo="${b.echo}" title="${R ? "往下翻到" : "回到"} ${b.echo} 年">${R ? "↓" : "↩"} ${b.echo}</button>${esc(b.t)}</p>`;
    return `<p class="line ${b.ask ? "ask" : "say"}"${code}>${esc(b.t)}</p>`;
  };
  const lines = (arr = []) => arr.map(line).join("");
  const isAsk = (b) => typeof b === "string" && b.startsWith("问：");

  // —— 积木：证物条、出场品牌、影片 ——
  const lookCard = (id, cls = "") => {
    const l = LOOKS[id];
    if (!l || !IMAGES[l.img]) return "";
    return `<button class="look ${cls}" data-look="${id}"><span class="look-img">${pic(l.img, { alt: l.name })}</span><span class="look-tx"><em>${l.y}</em><b>${esc(l.name)}</b><small>${esc(l.where || "")}</small></span></button>`;
  };
  const strip = (ids = []) => {
    const html = ids.map((id) => lookCard(id)).join("");
    return html ? `<div class="looks line"><div class="looks-h"><span>证物</span><i></i><b>${ids.length} 件</b></div><div class="looks-row">${html}</div></div>` : "";
  };
  // T 台：秀场照与红毯照排成一排高大的竖幅
  const catwalk = (ids = []) => {
    const html = ids.filter((id) => LOOKS[id] && IMAGES[LOOKS[id].img]).map((id, k) => { const l = LOOKS[id];
      return `<button class="cw" data-look="${id}" style="--k:${k}">${pic(l.img, { alt: l.name })}<span><em>${l.y}</em><b>${esc(l.name)}</b><small>${esc(l.where || "")}</small></span></button>`; }).join("");
    return html ? `<div class="catwalk line"><div class="looks-h"><span>Le Défilé</span><i></i><b>秀场内外 · ${ids.length} 张</b></div><div class="cw-row">${html}</div></div>` : "";
  };
  const looksOf = (ids = []) => MODE.runway ? catwalk(ids.filter((id) => LOOKS[id]?.runway)) + strip(ids.filter((id) => !LOOKS[id]?.runway)) : strip(ids);
  const logoImg = (id) => { const g = LOGOS[id]; return g && IMAGES[g.img] ? pic(g.img, { cls: "logo-img", alt: g.name }) : `<b class="logo-tx">${esc(g?.name || id)}</b>`; };
  const logoRow = (ids = []) => ids.length ? `<div class="logos line"><span>本章出场</span>${ids.map((id) => `<span class="logo" title="${esc(LOGOS[id]?.name || id)}">${logoImg(id)}</span>`).join("")}</div>` : "";
  const vid = (key, cls = "") => {
    const v = VIDEOS[key];
    if (!v) return "";
    return `<div class="vid ${cls}" data-yt="${esc(v.yt)}"><button class="vid-play" aria-label="播放：${esc(v.t)}"><img src="${ytPoster(v.yt)}" alt="" loading="lazy" referrerpolicy="no-referrer"><i aria-hidden="true"></i></button>
      <div class="vid-meta"><span>CHANEL 官方影片</span><b>${esc(v.t)}</b>${v.note ? `<em>${esc(v.note)}</em>` : ""}</div></div>`;
  };

  // —— 封面 ——
  document.title = `${MAG.title} · ${MAG.brand}特辑`;
  const logoTop = MAG.logo && IMAGES[MAG.logo.img] ? pic(MAG.logo.img, { eager: true, cls: "tb-logo", alt: MAG.brand }) : `<b>${esc(MAG.titleEn)}</b>`;
  $("#tbTitle").innerHTML = logoTop;
  $("#tbIssue").textContent = MAG.issue;
  const cv = MODE.coverImg && IMAGES[MODE.coverImg] ? { ...MAG.cover, img: MODE.coverImg } : MAG.cover;
  const words = [...(MAG.cold || []), ...(MAG.ending || []), ...CH.flatMap((c) => c.beats || [])].reduce((n, b) => n + (typeof b === "string" ? b : b.t || b.poll?.q || "").length, 0);
  $("#cover").innerHTML = `
    <div class="cv-photo">${pic(cv.img, { eager: true })}</div>
    <div class="cv-mast"><span class="cv-en">${esc(MAG.titleEn)}</span><span class="cv-cn">${esc(MAG.title)} · ${esc(MAG.issue)}</span></div>
    <ul class="cv-lines">${MAG.coverlines.map((l, i) => `<li style="--i:${i}"><b>${String(i + 1).padStart(2, "0")}</b>${esc(l)}</li>`).join("")}</ul>
    <div class="cv-feature">
      ${MAG.logo && IMAGES[MAG.logo.img] ? `<div class="cv-logo">${pic(MAG.logo.img, { eager: true, alt: MAG.brand })}</div>` : ""}
      <span class="cv-kick">${esc(cv.kicker)}</span>
      <h1>${esc(cv.name)}</h1>
      <p>${esc(cv.line)}</p>
      <a class="cv-start" href="#prologue"><i>↓</i><span>开始阅读<small>${ACTS.length} 幕 · 约 ${Math.max(5, Math.round(words / 400))} 分钟 · ${Object.keys(VIDEOS).length} 段官方影片</small></span></a>
    </div>
    <small class="cv-credit">${credit(cv.img)}</small>`;

  // —— 冷开场 ——
  $("#prologue").innerHTML = `<div class="pr-in">${lines(R && MAG.coldRewind ? MAG.coldRewind : MAG.cold)}
    ${MAG.question ? `<h2 class="pr-q line">${esc(MAG.question)}</h2><p class="pr-hint line">${R ? `带着这个问题，从 ${CH.at(-1).year} 年倒着读回 ${MIN} 年。` : `带着这个问题，从 ${MIN} 年读起。`}</p>` : ""}</div>`;

  // —— 左栏 ——
  const S = MAG.stake;
  const sil0 = silOf(MIN);
  $("#rail").innerHTML = `
    <div class="r-era"><span id="rEraFr"></span><b id="rEra"></b></div>
    <div class="r-year" id="rYear">${CH[ORD[0]].year}</div>
    <div class="r-row">
      ${sil0 ? `<figure class="r-sil"><svg viewBox="0 0 60 122" aria-hidden="true"><circle cx="30" cy="10" r="6"/><path id="rSilPath" d="${silPath(sil0)}"/><path class="r-sil-ground" d="M4 120h52"/></svg><figcaption id="rSilName">${esc(sil0.name)}</figcaption></figure>` : ""}
      <div class="r-facts">
        ${S ? `<div class="r-stake"><span>${esc(S.label)}</span><b id="rStake">—</b><div class="r-meter"><i id="rMeter"></i></div><small id="rStakeL"></small></div>` : ""}
        <div class="r-dir"><span>掌舵人</span><b id="rDir"></b>
          <div class="r-ribbon">${DIRS.map((d) => { const a = Math.max(d.from, MIN), to = d.to ?? MAX; return `<i data-d="${esc(d.name)}" style="left:${pct(a)}%;width:${pct(to) - pct(a)}%" title="${esc(d.name)} ${d.from}–${d.to ?? "今"}"></i>`; }).join("")}<em id="rRibbonNow"></em></div>
        </div>
      </div>
    </div>
    <div class="r-codes-h"><span>品牌符号</span><b id="rCount"></b></div>
    <div class="r-codes" id="rCodes">${CODES.map((c) => `<button class="code" data-code="${c.id}" title="${esc(c.name)} · ${esc(c.when)}">${icon(c.id)}<span>${esc(c.name)}</span></button>`).join("")}</div>`;

  // —— 正片：幕间页 → 场景 ——
  $("#chapters").innerHTML = ORD.map((i, pos) => {
    const c = CH[i];
    const act = actAt[i];
    const head = act ? `<section class="act ${act.img && IMAGES[act.img] ? "has-img" : "quilt"}" id="act-${act.no}" data-act="${act.no}" data-i="${i}">
        ${act.img && IMAGES[act.img] ? `<div class="act-bg">${pic(act.img)}</div>` : ""}
        <div class="act-tx"><span class="act-no">第${NUM[act.no] || act.no}幕</span><h2>${esc(act.title)}</h2>${act.hook ? `<p>${esc(act.hook)}</p>` : ""}</div></section>` : "";
    const beats = rwOf(c).beats || c.beats || [];
    const out = rwOf(c).out, next = CH[ORD[pos + 1]];
    let k = beats.length >= 4 ? Math.ceil(beats.length / 2) : beats.length;
    while (k < beats.length && (isAsk(beats[k - 1]) || beats[k - 1]?.cast)) k++;
    const img = c.img && IMAGES[c.img];
    const portrait = img && img.h > img.w * 1.05;
    const media = img
      ? `<figure class="ch-fig ${portrait ? "tall" : "wide"}"><div class="ch-frame">${pic(c.img)}</div><figcaption>${esc(CAP[c.img] || "")}<span>${credit(c.img)}</span></figcaption></figure>`
      : "";
    return `${head}<article class="ch ${pos % 2 ? "alt" : ""} ${img ? "" : "no-img"}" data-i="${i}" id="${anchor[i]}">
      <header class="ch-head line"><span class="ch-scene">${esc(c.place)}${c.scene ? ` · ${esc(c.scene)}` : ""}</span><h2>${esc(c.title)}</h2></header>
      <div class="ch-beats">${lines(beats.slice(0, k))}</div>
      ${media}
      ${k < beats.length ? `<div class="ch-beats">${lines(beats.slice(k))}</div>` : ""}
      ${looksOf(c.looks)}
      ${logoRow(c.logos)}
      ${[].concat(c.video || []).map((v) => vid(v, "line")).join("")}
      <div class="ch-extra">
        ${c.stat ? `<div class="ch-stat line"><b>${esc(c.stat.n)}</b><span>${esc(c.stat.l)}</span></div>` : ""}
        ${c.quote ? `<blockquote class="line"><p>${esc(c.quote.t)}</p><cite>—— ${esc(c.quote.by)}</cite></blockquote>` : ""}
        ${(c.codes || []).filter((id) => unlockAt[id] === i).map((id) => `<button class="ch-unlock line" data-code="${id}">${icon(id)}<span>${R ? "符号的源头" : "新符号诞生"}</span><b>${esc(codeById[id].name)}</b></button>`).join("")}
        ${c.lesson ? `<p class="ch-lesson line"><span>启示</span>${esc(c.lesson)}</p>` : ""}
      </div>
      ${out && next ? `<p class="rw-out line"><button class="rw-to" data-next="${ORD[pos + 1]}" title="往下翻到 ${next.year} 年 · ${esc(next.title)}">◂◂ ${next.year}</button><span>${esc(out)}</span></p>` : ""}
    </article>`;
  }).join("");

  // —— 尾声：答案 · 衣橱 · 影像 · 出场品牌 · 符号词典 ——
  const lookIds = Object.keys(LOOKS).filter((id) => IMAGES[LOOKS[id].img]).sort((a, b) => (R ? -1 : 1) * (LOOKS[a].y - LOOKS[b].y));
  const logoYear = {};
  CH.forEach((c) => (c.logos || []).forEach((id) => { if (!(id in logoYear)) logoYear[id] = c.year; }));
  $("#finale").innerHTML = `
    <div class="fn-answer">
      <span class="act-no">尾声</span>
      ${S ? `<div class="fn-stake">${(R ? [...S.points].reverse() : S.points).map((p) => `<div class="line"><b>${p.v}%</b><em>${p.y}</em><span>${esc(p.l)}</span></div>`).join("")}</div>` : ""}
      ${lines(RW.ending || MAG.ending)}
    </div>
    ${lookIds.length ? `<div class="fn-wardrobe">
      <div class="fn-head"><span>Le Vestiaire</span><h2>一百年的衣橱</h2><p>故事里出现过的 ${lookIds.length} 件证物，按年份挂好。横向滑动，点开看大图。</p></div>
      <div class="wardrobe" tabindex="0">${lookIds.map((id) => lookCard(id, "big")).join("")}</div></div>` : ""}
    ${Object.keys(VIDEOS).length ? `<div class="fn-films"><div class="fn-head"><span>Les Films</span><h2>影像</h2><p>全部来自 CHANEL 官方 YouTube 频道，点击才会加载。</p></div>
      <div class="films">${Object.keys(VIDEOS).map((k) => vid(k, "small")).join("")}</div></div>` : ""}
    ${Object.keys(LOGOS).length ? `<div class="fn-logos"><div class="fn-head"><span>Dramatis Personae</span><h2>出场的名字</h2></div>
      <div class="logo-wall">${Object.keys(LOGOS).map((id) => `<button class="lw" data-echo="${logoYear[id] || MIN}">${logoImg(id)}<em>${logoYear[id] ? `${logoYear[id]} 年登场` : ""}</em></button>`).join("")}</div>
      <p class="fn-note">品牌标识来自维基共享资源，仅用于新闻与评论性引用，商标归各自所有者。</p></div>` : ""}
    <div class="fn-head"><span>${esc(MAG.brand)} · 符号词典</span><h2>${CODES.length} 个符号，组成一个品牌</h2>
      <p>一个时装品牌真正的资产，不是某一季的衣服，而是这些反复出现、一眼就能认出的符号。</p></div>
    <div class="fn-grid">${CODES.map((c) => `<button class="fn-card" data-code="${c.id}">${icon(c.id)}<b>${esc(c.name)}</b><em>${esc(c.when)}</em><p>${esc(c.desc)}</p></button>`).join("")}</div>
    <div class="fn-foot"><a href="#cover">↑ 回到封面</a><span>还想看：${R ? `<a href="fashion.html">正序彩色版</a>` : `<a href="fashion-noir.html">倒叙黑白版</a>`} · <a href="fashion-book.html">翻页杂志版</a> · <a href="index.html">商海时报</a> · <a href="family.html">罗斯柴尔德家报</a></span></div>`;

  // —— 右栏：竖直的时间线 + 每个阶段的产品。读到哪里，哪一段放大；往后的还是灰的 ——
  const lookIds2 = Object.keys(LOOKS).filter((id) => IMAGES[LOOKS[id].img]);
  const byCh = CH.map(() => []);
  lookIds2.forEach((id) => byCh[lookCh[id]].push(id));
  byCh.forEach((a) => a.sort((x, y) => LOOKS[x].y - LOOKS[y].y));
  const thumb = (id) => `<button class="sp-look" data-look="${id}" title="${LOOKS[id].y} · ${esc(LOOKS[id].name)}">${pic(LOOKS[id].img, { alt: LOOKS[id].name })}</button>`;
  $("#spine").innerHTML = `
    <div class="sp-head"><span>Le Vestiaire</span><b>衣橱，随时间</b><em id="spCount">0 / ${lookIds2.length}</em></div>
    <div class="sp-scroll" id="spScroll"><div class="sp-track"><i class="sp-line"></i><i class="sp-fill" id="spFill"></i>
      ${ORD.map((i) => CH[i]).map((c, p) => { const i = ORD[p]; return `${actAt[i] ? `<button class="sp-act" data-go="${i}"><span>第${NUM[actAt[i].no] || actAt[i].no}幕</span><b>${esc(actAt[i].title)}</b></button>` : ""}
        <div class="sp-ch${byCh[i].length ? "" : " bare"}" data-i="${i}" style="--c:${eraOf(c.year).accent}">
          <button class="sp-y" data-go="${i}"><em>${c.year}</em><span>${esc(c.title)}</span></button>
          ${byCh[i].length ? `<div class="sp-looks">${byCh[i].map(thumb).join("")}</div>` : ""}
        </div>`; }).join("")}
      <button class="sp-act sp-end" data-to="finale"><span>尾声</span><b>一百年的衣橱</b></button>
    </div></div>`;
  const spCh = $$("#spine .sp-ch"), spScroll = $("#spScroll");
  const spineAt = (i) => {
    const p = posOf[i];
    spCh.forEach((el, k) => { el.classList.toggle("cur", k === p); el.classList.toggle("past", k < p); });
    const el = spCh[p];
    if (!el) return;
    $("#spFill").style.height = `${el.offsetTop + 14}px`;
    $("#spCount").textContent = `${(R ? byCh.slice(i) : byCh.slice(0, i + 1)).reduce((n, a) => n + a.length, 0)} / ${lookIds2.length}`;
    // 只滚右栏自己，不动页面
    requestAnimationFrame(() => spScroll.scrollTo({ top: Math.max(0, el.offsetTop - spScroll.clientHeight * 0.32), behavior: booted ? "smooth" : "auto" }));
  };
  $("#spine").addEventListener("click", (e) => {
    const g = e.target.closest("[data-go]"), f = e.target.closest("[data-to]");
    if (g) { e.stopPropagation(); go(+g.dataset.go); document.body.classList.remove("spine-open"); }
    else if (f) { e.stopPropagation(); document.getElementById(f.dataset.to)?.scrollIntoView({ behavior: "smooth", block: "start" }); document.body.classList.remove("spine-open"); }
  });
  $("#spToggle")?.addEventListener("click", () => document.body.classList.toggle("spine-open"));

  // —— 阅读状态 ——
  const yEl = $("#rYear"), chapters = $$(".ch"), codeEls = $$("#rCodes .code");
  let cur = -1, shown = CH[ORD[0]].year, tween = 0, booted = false;
  const tweenYear = (to) => {
    cancelAnimationFrame(tween);
    const from = shown, t0 = performance.now(), dur = Math.min(900, 250 + Math.abs(to - from) * 12);
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      shown = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      yEl.textContent = shown;
      if (k < 1) tween = requestAnimationFrame(step);
    };
    tween = requestAnimationFrame(step);
  };
  const stakeAt = (y) => S && S.points.reduce((a, p) => (y >= p.y ? p : a), null);
  let lastStake, lastSil;
  const silEl = $("#rSilPath");
  const activate = (i) => {
    if (i === cur) return;
    const prev = cur;
    cur = i;
    const c = CH[i], era = eraOf(c.year), d = dirOf(c.year);
    tweenYear(c.year);
    yEl.classList.remove("flip"); void yEl.offsetWidth; yEl.classList.add("flip");
    $("#rEra").textContent = era.name;
    $("#rEraFr").textContent = era.fr;
    $("#rDir").textContent = d ? d.name : "—";
    $("#rRibbonNow").style.left = pct(c.year) + "%";
    $$(".r-ribbon i").forEach((n) => n.classList.toggle("on", !!d && n.dataset.d === d.name));
    // 黑白版：按幕交替黑底 / 白底，强调色只剩黑与白
    const tone = MODE.mono ? (ACTS.reduce((n, x) => (c.year >= x.from ? x.no : n), 1) % 2 ? "light" : "dark") : era.tone || "light";
    document.body.dataset.tone = tone;
    document.documentElement.style.setProperty("--accent", MODE.mono ? (tone === "dark" ? "#f4f4f4" : "#111") : era.accent || "#a8843d");
    const sil = silOf(c.year);
    if (silEl && sil && sil !== lastSil) {
      const p = silPath(sil);
      silEl.setAttribute("d", p);
      silEl.style.d = `path("${p}")`;
      $("#rSilName").textContent = sil.name;
      lastSil = sil;
    }
    if (S) {
      const p = stakeAt(c.year);
      $("#rStake").textContent = p ? `${p.v}%` : "—";
      $("#rStakeL").textContent = p ? p.l : "还没有自己的生意";
      $("#rMeter").style.transform = `scaleX(${p ? p.v / 100 : 0})`;
      if (p !== lastStake && lastStake !== undefined) { const r = $(".r-stake"); r.classList.remove("hit"); void r.offsetWidth; r.classList.add("hit"); }
      lastStake = p;
    }
    let n = 0;
    codeEls.forEach((el) => {
      const at = unlockAt[el.dataset.code], on = at != null && at <= i;
      if (on) n++;
      if (on && !el.classList.contains("on") && prev >= 0 && at > prev) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
      el.classList.toggle("on", on);
    });
    $("#rCount").textContent = `${n} / ${CODES.length}`;
    chapters.forEach((el) => el.classList.toggle("active", +el.dataset.i === i));
    spineAt(i);
    if (booted) history.replaceState(null, "", `?year=${c.year}`);
  };
  const pulse = (id) => $$(`#rCodes [data-code="${id}"]`).forEach((el) => { el.classList.remove("speak"); void el.offsetWidth; el.classList.add("speak"); });

  // —— 观察器：章节激活 / 逐句浮现 / 读到某句点亮符号 ——
  const io = new IntersectionObserver((ents) => ents.forEach((e) => e.isIntersecting && activate(+e.target.dataset.i)), { rootMargin: "-48% 0px -48% 0px" });
  $$(".ch, .act").forEach((el) => io.observe(el));
  activate(ORD[0]);
  const reveal = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    reveal.unobserve(e.target);
    if (e.target.dataset.pulse) setTimeout(() => pulse(e.target.dataset.pulse), 350);
  }), { rootMargin: "0px 0px -15% 0px", threshold: 0.05 });
  $$(".line, .ch-fig, .fn-card, .act").forEach((el) => reveal.observe(el));
  new IntersectionObserver(([e]) => document.body.classList.toggle("reading", !e.isIntersecting && e.boundingClientRect.top < 0), { rootMargin: "-60px 0px 0px 0px" }).observe($("#cover"));

  // —— 键盘：j / k 上下一章 ——
  function go(i, smooth = true) { return chapters[posOf[i]]?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }); }
  document.addEventListener("keydown", (e) => {
    if (!$("#modal").hidden) { if (e.key === "Escape") closeModal(); return; }
    if (e.target.closest("input, textarea")) return;
    const p = posOf[cur];
    if (e.key === "j") go(ORD[Math.min(CH.length - 1, p + 1)]);
    else if (e.key === "k") go(ORD[Math.max(0, p - 1)]);
  });

  // —— 弹层：符号详情 / 证物大图 ——
  const modal = $("#modal");
  const closeModal = () => { modal.hidden = true; modal.classList.remove("wide"); document.body.classList.remove("modal-open"); };
  const openModal = (html, wide = false) => {
    $("#modalBody").innerHTML = html;
    modal.classList.toggle("wide", wide);
    modal.hidden = false;
    document.body.classList.add("modal-open");
    $(".modal-x").focus();
  };
  const openCode = (id) => {
    const c = codeById[id], at = unlockAt[id];
    const chs = CH.map((ch, i) => ({ ch, i })).filter(({ ch }) => (ch.codes || []).includes(id));
    openModal(`
      <div class="m-ico">${icon(id, "big")}</div>
      <span class="m-kick">品牌符号 · ${esc(c.when)}</span>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.desc)}</p>
      ${chs.length ? `<div class="m-links">${chs.map(({ ch, i }) => `<button data-go="${i}">${ch.year} · ${esc(ch.title)} ›</button>`).join("")}</div>` : ""}
      ${at != null && at > cur ? `<p class="m-note">这一章你还没读到，它出现在 ${CH[at].year} 年。</p>` : ""}`);
  };
  const openLook = (id) => {
    const l = LOOKS[id], at = chOfYear(l.y);
    openModal(`<figure class="m-look">${pic(l.img, { eager: true, alt: l.name })}
      <figcaption><span class="m-kick">${l.y} · ${esc(l.where || "")}</span><h3>${esc(l.name)}</h3><small>${credit(l.img)}</small>
      <button class="m-goto" data-go="${at}">读这一段：${CH[at].year} · ${esc(CH[at].title)} ›</button></figcaption></figure>`, true);
  };
  const playVid = (box) => {
    const id = box.dataset.yt, btn = box.querySelector(".vid-play");
    if (!btn) return;
    const f = document.createElement("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`;
    f.title = box.querySelector(".vid-meta b")?.textContent || "CHANEL";
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    f.referrerPolicy = "strict-origin-when-cross-origin";
    btn.replaceWith(f);
    box.classList.add("playing");
  };
  document.addEventListener("click", (e) => {
    const t = e.target;
    const o = t.closest(".guess [data-opt]");
    if (o) {
      const g = o.closest(".guess");
      if (g.classList.contains("done")) return;
      const k = +o.dataset.opt, ans = +g.dataset.answer;
      g.classList.add("done");
      $$("[data-opt]", g).forEach((x, j) => x.classList.add(j === ans ? "right" : j === k ? "wrong" : "dim"));
      g.querySelector("small").textContent = k === ans ? "猜对了，往下读 ↓" : `答案是「${o.parentNode.children[ans].textContent}」，往下读 ↓`;
      return;
    }
    const v = t.closest(".vid-play");
    if (v) return playVid(v.closest(".vid"));
    const lk = t.closest("[data-look]");
    if (lk) return openLook(lk.dataset.look);
    const c = t.closest("[data-code]");
    if (c) return openCode(c.dataset.code);
    const nx = t.closest("[data-next]");
    if (nx) return go(+nx.dataset.next);
    const ec = t.closest("[data-echo]");
    if (ec) return go(chOfYear(+ec.dataset.echo));
    if (t === modal || t.closest(".modal-x")) return closeModal();
    const g = t.closest("#modalBody [data-go]");
    if (g) { closeModal(); go(+g.dataset.go); }
  });

  // 衣橱：竖向滚轮也能横向滑
  const wd = $(".wardrobe");
  wd?.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = wd.scrollWidth - wd.clientWidth;
    if ((e.deltaY > 0 && wd.scrollLeft < max - 1) || (e.deltaY < 0 && wd.scrollLeft > 0)) { e.preventDefault(); wd.scrollLeft += e.deltaY; }
  }, { passive: false });

  // —— 分享链接：?year=1955 ——
  if (QY) requestAnimationFrame(() => go(chOfYear(QY), false));
  setTimeout(() => { booted = true; }, 800);
})();
