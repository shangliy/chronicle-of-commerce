/* 店报工坊：表单 → 家族版引擎的数据文件（SITE / ERAS / EVENTS / STORIES / FAMILY / IMAGES）
   不依赖后端：草稿与照片存在 localStorage，预览走 shop.html?draft=1，下载 .js 文件即可上线。 */
(() => {
  const $ = (id) => document.getElementById(id);
  const esc = (s = "") => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const PALETTE = ["#8a5a2b", "#2f5d8a", "#9e2a1f", "#a07a2c", "#4e7a3a", "#6b2a4a", "#2b2b2b"];
  const QUESTIONS = ["哪一年、在哪里开始的？第一天是什么样子？", "第一个客户、第一笔像样的收入是怎么来的？", "最难的一年发生了什么，怎么撑过来的？", "哪一次转折让店变成了今天的样子？", "今天的店是什么样子，接下来想做什么？"];
  /* 内置时代背景（号外）。img 指向样板图库里已有的图，没有图的只显示年份 */
  const BG = [
    { year: 1978, place: "北京", title: "改革开放", text: "十一届三中全会召开，个体经济重新被允许。此后几年，街边的第一批小店陆续开张。" },
    { year: 1980, place: "深圳", title: "经济特区", text: "深圳、珠海、汕头、厦门设立经济特区，“下海”第一次成为一个动词。" },
    { year: 1984, place: "北京", title: "公司元年", text: "联想、海尔、万科都在这一年创办。后来的人把 1984 叫作“中国公司元年”。" },
    { year: 1992, place: "深圳", img: "1992年邓小平植树 3471.jpg", title: "南方谈话", text: "邓小平南巡。那一年全国个体工商户大增，很多老字号的第二代，就是在这一年开出了自己的门面。" },
    { year: 1997, place: "香港", title: "香港回归", text: "港货、港式茶餐厅与粤语流行曲，在此后十年深刻影响了内地小店的审美与菜单。" },
    { year: 2001, place: "多哈", title: "加入世贸", text: "中国加入 WTO。外贸订单涌向沿海城镇，许多家庭作坊第一次接到了海外的单子。" },
    { year: 2003, place: "杭州", img: "TaobaoCity Alibaba Xixi Park.jpg", title: "淘宝上线", text: "非典那一年，淘宝网在杭州上线。十年后，它会把无数小店的货卖到从没来过本地的人手里。" },
    { year: 2008, place: "北京", img: "2008 Summer Olympics opening ceremony - Fireworks.jpg", title: "北京奥运", text: "奥运年，“国货”“国礼”成为送礼的新讲究，老字号与手工艺品迎来一波生客。" },
    { year: 2011, place: "深圳", img: "China Jinan Lady with phone 5196971.jpg", title: "微信上线", text: "微信诞生。此后十年，中国小店最重要的收银台和会客厅，都搬进了这个绿色图标里。" },
    { year: 2013, place: "杭州", title: "扫码付款", text: "余额宝上线，扫码支付开始铺进街边小店，收银台上的二维码取代了找零的抽屉。" },
    { year: 2016, place: "杭州", img: "G20 2016 leaders.jpg", title: "直播元年", text: "G20 在杭州召开的这一年，淘宝直播、快手、抖音相继起步，“边看边买”成了新的赶集。" },
    { year: 2019, place: "全国", title: "国潮兴起", text: "老字号联名、国风包装、城市文创走红，“讲自己的故事”第一次成为小店的生意经。" },
    { year: 2020, place: "武汉", img: "Wuhan Metro requests passengers to wear masks throughout their journeys during COVID-19 pandemic.jpg", title: "疫情", text: "门店关了几十天，游客消失了一整年。能活下来的小店，几乎都在那一年学会了对着手机说话。" },
    { year: 2023, place: "全国", title: "线下回来了", text: "“特种兵旅游”“City Walk”走红，年轻人重新走进街巷里的小店，寻找有故事的招牌。" },
    { year: 2025, place: "全国", title: "AI 进店", text: "AI 帮小店写文案、修照片、做账目。讲清楚“我是谁”的店，第一次有了不花钱的编辑部。" }
  ];
  const SAMPLE = { SITE: window.SITE, ERAS: window.ERAS, EVENTS: window.EVENTS, STORIES: window.STORIES, FAMILY: window.FAMILY, IMAGES: window.IMAGES || {} };
  const SAMPLE_URL = "https://shangliy.github.io/chronicle-of-commerce/shop.html";

  /* ---------- 状态 ---------- */
  const uid = () => "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const newStep = () => ({ year: "", place: "", chapter: "", title: "", text: "", lesson: "", img: "", cta: { on: false, label: "", price: "", link: "", note: "" } });
  const newPerson = () => ({ id: uid(), name: "", born: "", died: "", parent: "", note: "" });
  const blank = () => ({ title: "", en: "", min: "", max: "", price: "", slug: "", end: "", chapters: "创业史", bg: true, steps: [], people: [], cta: { label: "", note: "", price: "", link: "", wechat: "", go: "" }, card: { url: "", slogan: "", tag: "创刊号" } });
  let F = blank(), UP = {};
  try {
    const f = JSON.parse(localStorage.getItem("cc_form") || "null"), u = JSON.parse(localStorage.getItem("cc_up") || "null");
    if (f && f.steps) F = Object.assign(blank(), f, { cta: Object.assign(blank().cta, f.cta), card: Object.assign(blank().card, f.card) });
    if (u) UP = u;
  } catch (e) {}
  if (!F.steps.length) while (F.steps.length < 5) F.steps.push(newStep());

  const get = (o, path) => path.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
  const set = (o, path, v) => { const ks = path.split("."), last = ks.pop(); const t = ks.reduce((a, k) => (a[k] ?? (a[k] = {})), o); t[last] = v; };
  const chapters = () => (F.chapters || "").split(/[、,，;；/\s]+/).map((s) => s.trim()).filter(Boolean);

  let saveT = 0;
  function dirty() {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try { localStorage.setItem("cc_form", JSON.stringify(F)); localStorage.setItem("cc_up", JSON.stringify(UP)); }
      catch (e) { status("浏览器存储空间不够，照片太多或太大；草稿可能没有保存。", "err"); }
    }, 400);
  }
  function status(msg, cls = "") { const el = $("status"); el.textContent = msg; el.className = "status small " + cls; }

  /* ---------- 顶层字段 ---------- */
  document.querySelectorAll("[data-k]").forEach((el) => {
    el.addEventListener("input", () => {
      set(F, el.dataset.k, el.type === "checkbox" ? el.checked : el.value);
      dirty();
      if (el.dataset.k === "chapters") renderSteps();
      if (el.dataset.k.startsWith("cta.")) renderTicket();
    });
  });
  function fillTop() {
    document.querySelectorAll("[data-k]").forEach((el) => { const v = get(F, el.dataset.k); if (el.type === "checkbox") el.checked = !!v; else el.value = v ?? ""; });
    renderTicket();
  }
  function renderTicket() {
    const c = F.cta, has = c.label || c.link || c.wechat;
    $("tkPreview").innerHTML = has ? ticket(c) : `<span class="muted small">填上商品名或链接，这里会出现票根。</span>`;
  }
  /* 与 app.js 里的 ticket 相同的标记，预览用 */
  function ticket(c) {
    const wx = c.wechat ? `<span class="tk-wx">微信 <b>${esc(c.wechat)}</b> <button class="link" type="button">复制</button></span>` : "";
    return `<div class="ticket"><span class="tk-l"><span class="tk-k">入手同款</span><b>${esc(c.label || "")}</b>${c.note ? `<i>${esc(c.note)}</i>` : ""}${wx}</span>
      <span class="tk-r">${c.price ? `<span class="tk-price">${esc(c.price)}</span>` : ""}<span class="tk-go">${esc(c.go || (c.link ? "立即入手 ›" : "到店品鉴"))}</span></span></div>`;
  }

  /* ---------- 照片 ---------- */
  function fileToImage(file) {
    return new Promise((res, rej) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 1200, k = Math.min(1, MAX / Math.max(img.width, img.height));
        const cv = document.createElement("canvas"); cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url);
        res({ src: cv.toDataURL("image/jpeg", 0.82), w: cv.width, h: cv.height, artist: "店主供图", license: "自有版权", page: "#" });
      };
      img.onerror = rej; img.src = url;
    });
  }
  function urlToImage(url) {
    return new Promise((res) => {
      const img = new Image();
      img.onload = () => res({ src: url, w: img.naturalWidth || 4, h: img.naturalHeight || 3, artist: "店主供图", license: "", page: url });
      img.onerror = () => res({ src: url, w: 4, h: 3, artist: "店主供图", license: "", page: url });
      img.referrerPolicy = "no-referrer"; img.src = url;
    });
  }
  const imgOf = (name) => (name && (UP[name] || SAMPLE.IMAGES[name])) || null;

  /* ---------- 各站 ---------- */
  function renderSteps() {
    const box = $("steps"), chs = chapters();
    box.innerHTML = "";
    F.steps.forEach((st, i) => {
      const n = $("tplStep").content.firstElementChild.cloneNode(true);
      n.querySelector(".step-no").textContent = i + 1;
      const sel = n.querySelector("[data-s=chapter]");
      sel.innerHTML = chs.map((c) => `<option>${esc(c)}</option>`).join("");
      if (!chs.includes(st.chapter)) st.chapter = chs[0] || "";
      if (QUESTIONS[i] && !st.text) n.querySelector("[data-s=text]").placeholder = QUESTIONS[i];
      const ctaBox = n.querySelector(".step-cta"), thumb = n.querySelector(".thumb");
      const showThumb = () => { const m = imgOf(st.img); thumb.style.backgroundImage = m ? `url("${m.src}")` : ""; thumb.title = st.img || ""; };
      showThumb();
      ctaBox.hidden = !st.cta.on;
      n.querySelectorAll("[data-s]").forEach((el) => {
        const k = el.dataset.s;
        if (k === "file") { el.addEventListener("change", async () => { const f = el.files[0]; if (!f) return; try { const m = await fileToImage(f); const name = "up_" + Date.now().toString(36) + ".jpg"; UP[name] = m; st.img = name; showThumb(); dirty(); status("照片已存入草稿。"); } catch (e) { status("这张照片读不出来，换一张试试。", "err"); } }); return; }
        if (k === "imgurl") {
          el.value = st.img && !st.img.startsWith("up_") && UP[st.img] ? UP[st.img].src : "";
          let t; el.addEventListener("input", () => { clearTimeout(t); t = setTimeout(async () => { const u = el.value.trim(); if (!/^https?:\/\//.test(u)) return; const name = "url_" + u.replace(/[^a-z0-9]/gi, "").slice(-40); UP[name] = await urlToImage(u); st.img = name; showThumb(); dirty(); }, 600); });
          return;
        }
        if (el.type === "checkbox") el.checked = !!get(st, k); else el.value = get(st, k) ?? "";
        el.addEventListener("input", () => { set(st, k, el.type === "checkbox" ? el.checked : el.value); if (k === "cta.on") ctaBox.hidden = !st.cta.on; dirty(); });
      });
      n.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => {
        const a = b.dataset.act;
        if (a === "pick") n.querySelector("[data-s=file]").click();
        if (a === "del") { F.steps.splice(i, 1); renderSteps(); dirty(); }
        if (a === "up" && i > 0) { [F.steps[i - 1], F.steps[i]] = [F.steps[i], F.steps[i - 1]]; renderSteps(); dirty(); }
        if (a === "down" && i < F.steps.length - 1) { [F.steps[i + 1], F.steps[i]] = [F.steps[i], F.steps[i + 1]]; renderSteps(); dirty(); }
      }));
      box.appendChild(n);
    });
  }
  $("addStep").addEventListener("click", () => { F.steps.push(newStep()); renderSteps(); dirty(); $("steps").lastElementChild.querySelector("input").focus(); });

  /* ---------- 家谱 ---------- */
  function renderPeople() {
    const box = $("people");
    box.innerHTML = "";
    F.people.forEach((p, i) => {
      const n = $("tplPerson").content.firstElementChild.cloneNode(true);
      const sel = n.querySelector("[data-p=parent]");
      sel.innerHTML = `<option value="">（第一代）</option>` + F.people.filter((q) => q.id !== p.id && q.name).map((q) => `<option value="${q.id}">${esc(q.name)} 的孩子</option>`).join("");
      n.querySelectorAll("[data-p]").forEach((el) => { el.value = p[el.dataset.p] ?? ""; el.addEventListener("input", () => { p[el.dataset.p] = el.value; dirty(); }); el.addEventListener("change", () => { if (el.dataset.p === "name") renderPeople(); }); });
      n.querySelector("[data-act=del]").addEventListener("click", () => { F.people.splice(i, 1); F.people.forEach((q) => { if (q.parent === p.id) q.parent = ""; }); renderPeople(); dirty(); });
      box.appendChild(n);
    });
  }
  $("addPerson").addEventListener("click", () => { F.people.push(newPerson()); renderPeople(); dirty(); });

  /* ---------- 表单 → 引擎数据 ---------- */
  function buildData() {
    const title = (F.title || "").trim() || "我的店报";
    const steps = F.steps.filter((s) => +s.year && (s.title || s.text).trim()).map((s) => ({ ...s, year: +s.year })).sort((a, b) => a.year - b.year);
    const years = steps.map((s) => s.year);
    const min = +F.min || (years.length ? Math.min(...years) : 2000), max = Math.max(+F.max || new Date().getFullYear(), ...years);
    let chs = chapters(); if (!chs.length) chs = ["店史"];
    const STORIES = chs.map((c, i) => {
      const ss = steps.filter((s) => (s.chapter || chs[0]) === c);
      if (!ss.length) return null;
      return {
        id: "c" + i, title: c, subtitle: `${ss[0].year}—${ss.at(-1).year} · ${ss.length} 站`, tags: [], color: PALETTE[i % PALETTE.length],
        steps: ss.map((s) => {
          const o = { year: s.year, place: (s.place || "").trim() || title, img: imgOf(s.img) ? s.img : null, title: (s.title || "").trim() || `${s.year} 年`, text: (s.text || "").trim() };
          if ((s.lesson || "").trim()) o.lesson = s.lesson.trim();
          if (s.cta && s.cta.on && (s.cta.label || s.cta.link)) o.cta = { label: s.cta.label, price: s.cta.price, link: s.cta.link, note: s.cta.note };
          return o;
        })
      };
    }).filter(Boolean);
    if (!STORIES.length) STORIES.push({ id: "c0", title: chs[0], subtitle: "还没有内容", tags: [], color: PALETTE[0], steps: [{ year: min, place: title, img: null, title: "第一站", text: "在工坊里填上第一个问题，这里就会出现你的故事。" }] });
    /* 时代：章节按时间先后排开时用章节分段，否则按时间等分 */
    const firsts = STORIES.map((s) => s.steps[0].year);
    let ERAS;
    if (STORIES.length > 1 && firsts.every((y, i) => !i || y > firsts[i - 1])) ERAS = STORIES.map((s, i) => ({ start: i ? firsts[i] : min, end: i < STORIES.length - 1 ? firsts[i + 1] : max + 1, name: s.title, color: s.color, desc: s.subtitle }));
    else {
      const names = max - min < 10 ? ["起步", "今天"] : ["起步", "成长", "今天"], span = (max + 1 - min) / names.length;
      ERAS = names.map((nm, i) => ({ start: Math.round(min + span * i), end: i === names.length - 1 ? max + 1 : Math.round(min + span * (i + 1)), name: nm, color: PALETTE[i % PALETTE.length], desc: "" }));
    }
    let EVENTS = F.bg ? BG.filter((e) => e.year >= min && e.year <= max).map((e) => ({ ...e, img: e.img && imgOf(e.img) ? e.img : null })) : [];
    while (EVENTS.length > 9) EVENTS = EVENTS.filter((_, i) => i % 2 === 0 || i === EVENTS.length - 1);
    const FAMILY = F.people.filter((p) => p.name.trim() && +p.born).map((p) => { const o = { id: p.id, name: p.name.trim(), born: +p.born, branch: STORIES[0].id, note: p.note || "" }; if (p.parent) o.parent = p.parent; if (+p.died) o.died = +p.died; return o; });
    const IMAGES = {};
    [...STORIES.flatMap((s) => s.steps), ...EVENTS].forEach((s) => { if (s.img && imgOf(s.img)) IMAGES[s.img] = imgOf(s.img); });
    const range = max - min, stepY = range > 60 ? 20 : range > 25 ? 10 : 5;
    const ticks = [min]; for (let y = Math.ceil((min + 1) / stepY) * stepY; y < max; y += stepY) ticks.push(y); if (max - ticks.at(-1) < stepY / 2) ticks.pop(); ticks.push(max);
    const cta = F.cta.label || F.cta.link || F.cta.wechat ? { ...F.cta } : undefined;
    const SITE = {
      name: title, title, en: (F.en || "").trim(), period: `${min} — ${max}`, price: (F.price || "").trim() || "定价：一句好故事", kicker: "商海时报 · 店报", masthead: title,
      min, max, gamma: 1, ticks, minorTicks: [], play: `播放${title}`, replay: "↺ 重看一遍", eventLane: "时代背景",
      empty: ["故事还没开始", "请按“播放”，从第一年看起。"], end: (F.end || "").trim() || `${title}，谢谢你翻到这里。`, quiz: [min, max],
      colophon: `本报由「店报工坊」生成 · 照片由店主提供${EVENTS.some((e) => e.img) ? "，时代背景图片来自 Wikimedia Commons（作者与许可见图注）" : ""}`, cta
    };
    return { SITE, ERAS, EVENTS, STORIES, FAMILY, IMAGES };
  }

  /* ---------- 引擎数据 → 表单（载入样板 / 导入完整数据） ---------- */
  function fromData(d) {
    const S = d.SITE || {};
    F = blank();
    F.title = S.title || S.name || ""; F.en = S.en || ""; F.min = S.min || ""; F.max = S.max || ""; F.price = S.price || ""; F.end = S.end || ""; F.slug = "";
    F.chapters = (d.STORIES || []).map((s) => s.title.split(/[：:]/)[0]).join("、");
    const chs = chapters();
    (d.STORIES || []).forEach((s, i) => s.steps.forEach((st) => {
      F.steps.push({ year: st.year, place: st.place || "", chapter: chs[i], title: st.title || "", text: st.text || "", lesson: st.lesson || "", img: st.img || "", cta: { on: !!st.cta, label: st.cta?.label || "", price: st.cta?.price || "", link: st.cta?.link || "", note: st.cta?.note || "" } });
      if (st.img && (d.IMAGES || SAMPLE.IMAGES)[st.img]) UP[st.img] = (d.IMAGES || SAMPLE.IMAGES)[st.img];
    }));
    (d.FAMILY || []).forEach((p) => F.people.push({ id: p.id, name: p.name, born: p.born, died: p.died || "", parent: p.parent || "", note: p.note || "" }));
    if (S.cta) F.cta = Object.assign(blank().cta, S.cta);
    F.card.url = SAMPLE_URL; F.card.slogan = "扫码穿越四十年，看这泡茶从哪里来";
  }

  /* ---------- 动作 ---------- */
  $("preview").addEventListener("click", () => {
    const data = buildData();
    try { localStorage.setItem("cc_draft", JSON.stringify(data)); }
    catch (e) { status("草稿太大，浏览器存不下（照片过多）。先减少几张照片，或改用图片网址。", "err"); return; }
    window.open("shop.html?draft=1", "cc_preview");
    status("已在新标签页打开预览；改完再点一次就会刷新。", "ok");
  });

  const js = (k, v) => `window.${k} = ${JSON.stringify(v, null, 1)};\n`;
  function dl(name, text) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/javascript" })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
  $("download").addEventListener("click", () => {
    const d = buildData(), slug = (F.slug || "").trim() || "myshop";
    dl(`family-${slug}.js`, `/* ${d.SITE.title} · 由店报工坊生成。放到 js/ 目录，访问 shop.html?d=${slug} */\n` + js("SITE", d.SITE) + js("ERAS", d.ERAS) + js("EVENTS", d.EVENTS) + js("STORIES", d.STORIES) + js("FAMILY", d.FAMILY));
    setTimeout(() => dl(`family-${slug}-images.js`, `/* ${d.SITE.title} · 图片表（含店主上传的照片） */\n` + js("IMAGES", d.IMAGES)), 300);
    status(`已下载 family-${slug}.js 和 family-${slug}-images.js，放进 js/ 目录即可。`, "ok");
  });

  $("aiPrompt").addEventListener("click", async () => {
    const lines = F.steps.filter((s) => (s.title || s.text || s.year)).map((s, i) => `第${i + 1}站（${s.year || "年份？"} · ${s.place || "地点？"}${s.chapter ? " · " + s.chapter : ""}）：${s.title || ""} ${s.text || ""}${s.lesson ? "（启示：" + s.lesson + "）" : ""}`);
    const prompt = `你是一位老报纸的编辑，擅长把小店的口述史写成有年代感的报刊段落。下面是一家小店店主的口述，请整理成一份「店报」的数据。

要求：
1. 每一站扩写成 80–150 字的报刊正文：有具体的人、物、场景和当年的时代氛围（城市、行业、社会大事），但只写确有其事或店主提到的事，不要编造数字和荣誉；
2. 每一站配一句 20 字以内的「商业启示」，像一句能贴在墙上的话；
3. 给每一站一个 6–12 字的标题；地点、年份照抄店主的；
4. 如果店主填了章节，保留；没填就按内容分成 1–3 个章节（如：手艺、门店、上网）；
5. 只输出一个 JSON，不要任何别的文字。格式：
{"title":"店名（2–6字）","en":"英文名","price":"报头右耳一句话（像老报纸的“定价：…”）","end":"播完全部故事后的一句结语","chapters":"章节1、章节2","steps":[{"year":1984,"place":"地点","chapter":"章节1","title":"标题","text":"正文","lesson":"启示"}],"cta":{"label":"推荐商品名","note":"一句说明","price":"价格文案"}}

店主口述：
店名：${F.title || "（未填）"}${F.en ? " / " + F.en : ""}
开张：${F.min || "？"} 年，讲到 ${F.max || new Date().getFullYear()} 年
章节：${F.chapters || "（未填）"}
${lines.join("\n")}
招牌商品：${F.cta.label || "（未填）"} ${F.cta.price || ""} ${F.cta.note || ""}`;
    try { await navigator.clipboard.writeText(prompt); status("提示词已复制。粘贴到任何 AI 对话框，再把它回复的 JSON 用「导入」贴回来。", "ok"); }
    catch (e) { openDlg("复制这段提示词", prompt, false); }
  });

  function openDlg(title, text, importing) {
    $("dlgTitle").textContent = title; $("dlgText").value = text; $("dlgOk").hidden = !importing; $("dlgHint").hidden = !importing;
    $("dlg").showModal();
  }
  $("aiImport").addEventListener("click", () => openDlg("导入 AI 返回的内容", "", true));
  $("dlg").addEventListener("close", () => {
    if ($("dlg").returnValue !== "ok") return;
    const t = $("dlgText").value, a = t.indexOf("{"), b = t.lastIndexOf("}");
    let d; try { d = JSON.parse(t.slice(a, b + 1)); } catch (e) { status("没找到合法的 JSON，检查一下是否整段复制了。", "err"); return; }
    if (d.STORIES) { fromData(d); }
    else {
      ["title", "en", "price", "end", "chapters"].forEach((k) => { if (typeof d[k] === "string" && d[k]) F[k] = d[k]; });
      if (d.cta) Object.assign(F.cta, Object.fromEntries(Object.entries(d.cta).filter(([, v]) => typeof v === "string")));
      if (Array.isArray(d.steps)) {
        const old = F.steps.slice();
        F.steps = d.steps.map((s, i) => {
          const prev = old.find((o) => +o.year === +s.year && (o.title === s.title || !o.title)) || old[i] || newStep();
          return { ...newStep(), ...prev, year: s.year ?? prev.year, place: s.place ?? prev.place, chapter: s.chapter ?? prev.chapter, title: s.title ?? prev.title, text: s.text ?? prev.text, lesson: s.lesson ?? prev.lesson };
        });
      }
    }
    fillTop(); renderSteps(); renderPeople(); dirty();
    status("已导入。看一眼各站内容，照片和票根都保留着。", "ok");
  });

  $("loadSample").addEventListener("click", () => {
    if (F.steps.some((s) => s.title || s.text) && !confirm("会覆盖你现在填的内容，继续？")) return;
    fromData(SAMPLE); F.slug = "shanhai";
    fillTop(); renderSteps(); renderPeople(); dirty(); drawCard();
    status("已载入样板《山海茶事》。改成你的店，就是你的店报。", "ok");
  });
  $("clearAll").addEventListener("click", () => {
    if (!confirm("清空全部内容和照片？")) return;
    F = blank(); UP = {}; while (F.steps.length < 5) F.steps.push(newStep());
    fillTop(); renderSteps(); renderPeople(); dirty(); status("已清空。");
  });

  /* ---------- 扫码立牌 ---------- */
  async function drawCard() {
    const cv = $("card"), g = cv.getContext("2d"), W = cv.width, H = cv.height;
    const title = (F.title || "我的店报").trim(), en = (F.en || "").trim(), url = (F.card.url || "").trim() || SAMPLE_URL;
    const slogan = (F.card.slogan || "").trim() || "扫码翻阅这家店的故事", tag = (F.card.tag || "").trim() || "创刊号";
    try { await Promise.all([document.fonts.load('400 120px "Ma Shan Zheng"'), document.fonts.load('400 40px "UnifrakturMaguntia"'), document.fonts.load('900 40px "Noto Serif SC"')]); } catch (e) {}
    const paper = "#f3ebd7", ink = "#1e1a15", red = "#9e2a1f", ink2 = "#5d5244";
    g.fillStyle = paper; g.fillRect(0, 0, W, H);
    /* 纸纹 */
    for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(90,60,20,${Math.random() * 0.06})`; g.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
    g.strokeStyle = ink; g.lineWidth = 3; g.strokeRect(36, 36, W - 72, H - 72); g.lineWidth = 1.5; g.strokeRect(48, 48, W - 96, H - 96);
    g.textAlign = "center"; g.fillStyle = ink2; g.font = '600 24px "Noto Serif SC"';
    g.fillText("商 海 时 报 · 店 报", W / 2, 120);
    g.strokeStyle = ink; g.lineWidth = 1.5; g.beginPath(); g.moveTo(120, 146); g.lineTo(W - 120, 146); g.stroke();
    g.fillStyle = ink; g.font = `400 ${title.length > 5 ? 120 : 150}px "Ma Shan Zheng", "Noto Serif SC", serif`; g.fillText(title, W / 2, 310);
    if (en) { g.fillStyle = ink2; g.font = '400 44px "UnifrakturMaguntia", serif'; g.fillText(en, W / 2, 372); }
    g.lineWidth = 4; g.beginPath(); g.moveTo(120, 410); g.lineTo(W - 120, 410); g.stroke(); g.lineWidth = 1.5; g.beginPath(); g.moveTo(120, 420); g.lineTo(W - 120, 420); g.stroke();
    /* 二维码 */
    try {
      const qr = qrcode(0, "M"); qr.addData(url); qr.make();
      const n = qr.getModuleCount(), size = 520, cell = size / n, x0 = (W - size) / 2, y0 = 480;
      g.fillStyle = "#fff"; g.fillRect(x0 - 24, y0 - 24, size + 48, size + 48);
      g.strokeStyle = ink; g.lineWidth = 2; g.strokeRect(x0 - 24, y0 - 24, size + 48, size + 48);
      g.fillStyle = ink;
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) g.fillRect(Math.round(x0 + c * cell), Math.round(y0 + r * cell), Math.ceil(cell), Math.ceil(cell));
    } catch (e) { g.fillStyle = red; g.font = '600 28px "Noto Serif SC"'; g.fillText("二维码生成失败：网址太长或库未加载", W / 2, 740); }
    /* 角标 */
    g.save(); g.translate(W - 150, 190); g.rotate(-0.22); g.strokeStyle = red; g.lineWidth = 4; g.strokeRect(-70, -34, 140, 68); g.fillStyle = red; g.font = '900 34px "Noto Serif SC"'; g.fillText(tag, 0, 12); g.restore();
    g.fillStyle = ink; g.font = '900 46px "Noto Serif SC"'; g.fillText("扫 码 翻 阅", W / 2, 1110);
    g.fillStyle = ink2; g.font = '400 30px "Noto Serif SC"';
    const wrap = (s, max) => { const out = []; let cur = ""; for (const ch of s) { cur += ch; if (cur.length >= max) { out.push(cur); cur = ""; } } if (cur) out.push(cur); return out; };
    wrap(slogan, 22).forEach((l, i) => g.fillText(l, W / 2, 1170 + i * 44));
    g.strokeStyle = ink; g.lineWidth = 1.5; g.beginPath(); g.moveTo(120, 1330); g.lineTo(W - 120, 1330); g.stroke();
    g.fillStyle = ink2; g.font = '400 24px "Noto Serif SC"';
    g.fillText(`${F.min || ""}${F.min ? " — " : ""}${F.max || new Date().getFullYear()} · ${(F.price || "一份可以翻页的店报").trim()}`, W / 2, 1380);
    g.font = '400 20px "Noto Serif SC"'; g.fillText(url.replace(/^https?:\/\//, "").slice(0, 60), W / 2, 1420);
  }
  $("drawCard").addEventListener("click", drawCard);
  $("dlCard").addEventListener("click", async () => { await drawCard(); const a = document.createElement("a"); a.download = `${(F.slug || "shop")}-card.png`; a.href = $("card").toDataURL("image/png"); a.click(); });
  ["card.url", "card.slogan", "card.tag", "title", "en"].forEach((k) => { const el = document.querySelector(`[data-k="${k}"]`); let t; el.addEventListener("input", () => { clearTimeout(t); t = setTimeout(drawCard, 500); }); });

  /* ---------- 启动 ---------- */
  fillTop(); renderSteps(); renderPeople(); drawCard();
})();
