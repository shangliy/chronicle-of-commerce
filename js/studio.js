/* 店报工坊：表单 → 家族版引擎的数据文件（SITE / ERAS / EVENTS / STORIES / FAMILY / IMAGES / CAPTIONS）
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
  const SAMPLE = { SITE: window.SITE, ERAS: window.ERAS, EVENTS: window.EVENTS, STORIES: window.STORIES, FAMILY: window.FAMILY, IMAGES: window.IMAGES || {}, CAPTIONS: window.CAPTIONS || {} };
  const SAMPLE_URL = "https://shangliy.github.io/chronicle-of-commerce/shop.html";

  /* 行业快速样板：咖啡馆、手作店 */
  const PRESETS = {
    coffee: {
      title: "街角焙豆", en: "Corner Roast Chronicle", min: 2014, max: 2026, price: "定价：一杯手冲", slug: "corner-roast",
      end: "十二年，两台烘焙机，一扇朝南的窗。谢谢你坐下来喝这一杯。",
      chapters: "寻豆与烘焙、街口与熟客", bg: true, bgOff: [], customBg: [],
      cta: { label: "街角日常 · 云南日晒挂耳礼盒（12片）", note: "每周二新鲜烘焙，店里喝到的同一支豆", price: "¥ 68", link: "https://example.com/corner-roast", wechat: "corner_roast", go: "带一盒走 ›" },
      card: { url: SAMPLE_URL, slogan: "扫码翻阅十二年，看这杯咖啡从哪里来", tag: "创刊号", style: "classic" },
      people: [
        { id: "p1", name: "周予安", born: 1987, died: "", parent: "", branch: "寻豆与烘焙", note: "主理人、烘焙师。2014 年辞去建筑设计工作，买下第一台一公斤样品烘焙机。" },
        { id: "p2", name: "林知夏", born: 1989, died: "", parent: "", branch: "街口与熟客", note: "联合主理人。负责吧台冲煮与社区书架，记得住老客人的杯子。" }
      ],
      steps: [
        { year: 2014, place: "上海 · 老弄堂", chapter: "街口与熟客", title: "九平米的第一扇窗", text: "在梧桐树下的老弄堂口租下九平米，放不下一张桌子，只能开一扇外带窗。第一天卖出十四杯美式，找零的硬币装在搪瓷缸里。", lesson: "店不在大，有一扇让人愿意停脚的窗就够了。", img: "", cta: { on: false, label: "", price: "", link: "", note: "" } },
        { year: 2016, place: "车库烘焙间", chapter: "寻豆与烘焙", title: "第一台五公斤烘焙机", text: "为了不再受制于代工厂的豆单，咬牙买下二手五公斤直火烘焙机。头两个月炒坏了六十多斤生豆，弄堂里的邻居每天闻着焦香味帮我们试喝。", lesson: "把核心手艺攥在自己手里，小店才真正有了名字。", img: "", cta: { on: false, label: "", price: "", link: "", note: "" } },
        { year: 2018, place: "云南 · 保山", chapter: "寻豆与烘焙", title: "第一次上山找豆", text: "坐大巴进高黎贡山，和咖农一起守着晒架翻豆子。那一年带回来的厌氧日晒豆，成了店里连续八年不换的招牌口粮。", lesson: "好原料不在批发市场里，在产地泥泞的山路上。", img: "", cta: { on: false, label: "", price: "", link: "", note: "" } },
        { year: 2020, place: "微信群", chapter: "街口与熟客", title: "挂耳包救了整间店", text: "没法堂食的那两个月，我们在吧台连夜手封挂耳包，顺丰寄给在家办公的老客人。三百位街坊的订单，撑住了房租和两位咖啡师的工资。", lesson: "平时攒下的熟客信任，是危机时刻唯一的救生艇。", img: "", cta: { on: true, label: "保山厌氧日晒 · 挂耳包", price: "¥ 68", link: "https://example.com/corner-roast", note: "2020 年救了小店的那支口粮豆" } },
        { year: 2023, place: "街角新店", chapter: "街口与熟客", title: "搬去隔壁转角的大窗房", text: "老店租约到期，搬到斜对面四十平米的转角铺面。保留了九年前那块木头招牌，老客人的自带杯墙从一面扩到了三面。", lesson: "搬店可以换门牌，不能换掉老客人熟悉的气味。", img: "", cta: { on: false, label: "", price: "", link: "", note: "" } },
        { year: 2026, place: "吧台前", chapter: "寻豆与烘焙", title: "把十二年印成一份店报", text: "第十二年，我们把每一支豆子的产地故事与街坊的留言编成这份小报，放在吧台豆罐旁。你手里的这一杯，就是最新的一页。", lesson: "一杯咖啡二十分钟喝完，一个好故事能留客十年。", img: "", cta: { on: false, label: "", price: "", link: "", note: "" } }
      ]
    },
    craft: {
      title: "木石器物", en: "Mushi Wood & Stone", min: 2011, max: 2026, price: "定价：一双木筷", slug: "mushi-craft",
      end: "十五年，万次刨花，只做经得起摩挲的日常器物。",
      chapters: "木作坊、市集与远方", bg: true, bgOff: [], customBg: [],
      cta: { label: "整木黑胡桃 · 手工凿纹茶盘", note: "天然木蜡油涂装，底部刻年份与匠人印记", price: "¥ 320", link: "https://example.com/mushi-craft", wechat: "mushi_wood", go: "入手器物 ›" },
      card: { url: SAMPLE_URL, slogan: "扫码看一块木头如何变成陪伴十年的器物", tag: "手作志", style: "dark" },
      people: [
        { id: "c1", name: "沈木匠", born: 1965, died: "", parent: "", branch: "木作坊", note: "老木匠。做了三十年传统榫卯家具，教徒弟只认准“木性”二字。" },
        { id: "c2", name: "沈知行", born: 1992, died: "", parent: "c1", branch: "市集与远方", note: "美院毕业后回镇上跟父亲学刨木头，把大件家具改成了年轻人桌上的茶盘与木皿。" }
      ],
      steps: [
        { year: 2011, place: "苏南古镇", chapter: "木作坊", title: "老木工坊的最后一张八仙桌", text: "镇上买实木大家具的人越来越少，父亲沈木匠做完最后一张榫卯八仙桌，准备关掉作坊。儿子沈知行带着素描本回来，说：“爸，我们做端得上书桌的小木器吧。”", lesson: "老手艺不会过时，只是需要换一个进入今天生活的尺寸。", img: "", cta: { on: false, label: "", price: "", link: "", note: "" } },
        { year: 2013, place: "晒木场", chapter: "木作坊", title: "两百块废木料试出的凿纹", text: "用传统圆凿在黑胡桃木上一刀一刀铲出鱼鳞纹，起初深浅不一，报废了两百多块边角料。半年后，手指摸上去像水波一样温润。", lesson: "机器追求没有痕迹，手作珍贵在每一刀的呼吸。", img: "", cta: { on: false, label: "", price: "", link: "", note: "" } },
        { year: 2016, place: "杭州 · 创意市集", chapter: "市集与远方", title: "第一次出摊卖光一箱木勺", text: "背着两只帆布包的木勺和茶则去杭州参加周末市集。客人们拿起木勺在手心里摩挲，三十八把勺子在周日下午全部售罄。", lesson: "好器物自己会说话，只要让它碰到买家的手掌。", img: "", cta: { on: false, label: "", price: "", link: "", note: "" } },
        { year: 2019, place: "木作坊", chapter: "木作坊", title: "给每件木器打上年份暗记", text: "决定不走工厂代工扩产的路子，父子俩守着两张木工台，在每一方茶盘底部烙上制作年份与编号，终身免费修补保养。", lesson: "敢在器物底下刻名字，客人就敢把它当传家物买。", img: "", cta: { on: true, label: "整木黑胡桃 · 手工凿纹茶盘", price: "¥ 320", link: "https://example.com/mushi-craft", note: "每件底部烙年份与匠人编号" } },
        { year: 2022, place: "线上木工课", chapter: "市集与远方", title: "寄出三千份“半成品木料包”", text: "不能出门办工作坊的日子，把粗坯木勺、砂纸与蜂蜡打包寄给客人，晚上直播带着大家一起打磨。三千多人在家里磨出了人生第一把木勺。", lesson: "卖成品是交易，带客人一起动手是交朋友。", img: "", cta: { on: false, label: "", price: "", link: "", note: "" } },
        { year: 2026, place: "临河展厅", chapter: "市集与远方", title: "十年老客寄回包浆的茶盘", text: "办了一场“用旧了的木器”小展，老客人们寄回用了五到十年的茶盘，颜色从浅褐养成了温润的琥珀色。这份店报，就摆在展厅入口。", lesson: "真正的设计在出厂那天只完成了一半，另一半由时间完成。", img: "", cta: { on: false, label: "", price: "", link: "", note: "" } }
      ]
    }
  };

  /* ---------- 状态 ---------- */
  const uid = () => "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const newStep = () => ({ year: "", place: "", chapter: "", title: "", text: "", lesson: "", img: "", cta: { on: false, label: "", price: "", link: "", note: "" } });
  const newPerson = () => ({ id: uid(), name: "", born: "", died: "", parent: "", branch: "", note: "" });
  const blank = () => ({
    title: "", en: "", min: "", max: "", price: "", slug: "", end: "",
    chapters: "创业史", bg: true, bgOff: [], customBg: [],
    steps: [], people: [],
    cta: { label: "", note: "", price: "", link: "", wechat: "", go: "" },
    card: { url: "", slogan: "", tag: "创刊号", style: "classic" }
  });
  let F = blank(), UP = {};
  try {
    const f = JSON.parse(localStorage.getItem("cc_form") || "null"), u = JSON.parse(localStorage.getItem("cc_up") || "null");
    if (f && f.steps) {
      F = Object.assign(blank(), f, {
        bgOff: Array.isArray(f.bgOff) ? f.bgOff : [],
        customBg: Array.isArray(f.customBg) ? f.customBg : [],
        cta: Object.assign(blank().cta, f.cta),
        card: Object.assign(blank().card, f.card)
      });
    }
    if (u) UP = u;
  } catch (e) {}
  if (!F.steps.length) while (F.steps.length < 5) F.steps.push(newStep());

  const get = (o, path) => path.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
  const set = (o, path, v) => { const ks = path.split("."), last = ks.pop(); const t = ks.reduce((a, k) => (a[k] ?? (a[k] = {})), o); t[last] = v; };
  const chapters = () => (F.chapters || "").split(/[、,，;；/\s]+/).map((s) => s.trim()).filter(Boolean);
  const minMax = () => {
    const yrs = F.steps.map((s) => +s.year).filter((y) => y > 1000);
    const min = +F.min || (yrs.length ? Math.min(...yrs) : 1984);
    const max = Math.max(+F.max || new Date().getFullYear(), ...yrs, min);
    return [min, max];
  };

  let saveT = 0, cardT = 0;
  function dirty(redrawCard = false) {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try { localStorage.setItem("cc_form", JSON.stringify(F)); localStorage.setItem("cc_up", JSON.stringify(UP)); }
      catch (e) { status("浏览器存储空间不够，照片太多或太大；草稿可能没有保存。", "err"); }
    }, 400);
    if (redrawCard) { clearTimeout(cardT); cardT = setTimeout(drawCard, 450); }
  }
  function status(msg, cls = "") { const el = $("status"); el.textContent = msg; el.className = "status small " + cls; }

  /* ---------- 顶层字段 ---------- */
  document.querySelectorAll("[data-k]").forEach((el) => {
    el.addEventListener("input", () => {
      set(F, el.dataset.k, el.type === "checkbox" ? el.checked : el.value);
      const k = el.dataset.k;
      if (k === "chapters") { renderSteps(); renderPeople(); }
      if (k === "bg" || k === "min" || k === "max") renderBg();
      if (k.startsWith("cta.")) renderTicket();
      dirty(k.startsWith("card.") || k === "title" || k === "en" || k === "min" || k === "max" || k === "price" || k.startsWith("cta."));
    });
  });
  function fillTop() {
    document.querySelectorAll("[data-k]").forEach((el) => { const v = get(F, el.dataset.k); if (el.type === "checkbox") el.checked = !!v; else el.value = v ?? ""; });
    renderTicket();
    renderBg();
  }
  function renderTicket() {
    const c = F.cta, has = c.label || c.link || c.wechat;
    $("tkPreview").innerHTML = has ? ticket(c) : `<span class="muted small">填上商品名、链接或微信号，这里会出现票根预览。</span>`;
  }
  /* 与 app.js 里的 ticket 相同的标记，预览用 */
  function ticket(c) {
    const wx = c.wechat ? `<span class="tk-wx">微信 <b>${esc(c.wechat)}</b> <button class="link" type="button" data-copy="${esc(c.wechat)}">复制</button></span>` : "";
    const goTxt = c.go || (c.link ? "立即入手 ›" : c.wechat ? "复制微信 ›" : "到店品鉴");
    return `<div class="ticket"><span class="tk-l"><span class="tk-k">入手同款</span><b>${esc(c.label || "")}</b>${c.note ? `<i>${esc(c.note)}</i>` : ""}${wx}</span>
      <span class="tk-r">${c.price ? `<span class="tk-price">${esc(c.price)}</span>` : ""}<span class="tk-go">${esc(goTxt)}</span></span></div>`;
  }

  /* ---------- 时代背景（号外）选择器 ---------- */
  const bgKey = (e) => `${e.year}:${e.title}`;
  function allBgPool() {
    const map = new Map();
    BG.forEach((e) => map.set(bgKey(e), { ...e, custom: false }));
    (F.customBg || []).forEach((e) => map.set(bgKey(e), { ...e, custom: true }));
    return [...map.values()].sort((a, b) => a.year - b.year);
  }
  function renderBg() {
    const wrap = $("bgWrap"), box = $("bgList");
    if (!wrap || !box) return;
    wrap.hidden = !F.bg;
    if (!F.bg) return;
    const [min, max] = minMax();
    const pool = allBgPool().filter((e) => e.year >= min && e.year <= max);
    box.innerHTML = pool.length
      ? pool.map((e) => {
          const k = bgKey(e), off = (F.bgOff || []).includes(k);
          return `<button type="button" class="bg-chip${off ? " off" : ""}" data-bg="${esc(k)}" title="${esc(e.place)} · ${esc(e.text)}"><b>${e.year}</b> ${esc(e.title)}${e.custom ? `<i data-bgdel="${esc(k)}" title="删除">×</i>` : ""}</button>`;
        }).join("")
      : `<span class="muted small">当前年份范围（${min}—${max}）暂无内置时代大事，可在下方手动添加。</span>`;
  }
  $("bgList")?.addEventListener("click", (e) => {
    const del = e.target.closest("[data-bgdel]");
    if (del) {
      e.stopPropagation();
      const k = del.dataset.bgdel;
      F.customBg = (F.customBg || []).filter((x) => bgKey(x) !== k);
      renderBg(); dirty();
      return;
    }
    const chip = e.target.closest("[data-bg]");
    if (!chip) return;
    const k = chip.dataset.bg;
    F.bgOff = F.bgOff || [];
    const idx = F.bgOff.indexOf(k);
    if (idx >= 0) F.bgOff.splice(idx, 1); else F.bgOff.push(k);
    renderBg(); dirty();
  });
  $("addBg")?.addEventListener("click", () => {
    const year = +$("bgYear").value, place = $("bgPlace").value.trim() || "本地", title = $("bgTitle").value.trim(), text = $("bgText").value.trim();
    if (!year || !title) { status("请先填好“号外”的年份和事件标题。", "err"); return; }
    F.customBg = F.customBg || [];
    const k = `${year}:${title}`;
    F.customBg = F.customBg.filter((x) => bgKey(x) !== k);
    F.customBg.push({ year, place, title, text: text || `${year} 年，${place}：${title}。` });
    F.bgOff = (F.bgOff || []).filter((x) => x !== k);
    $("bgYear").value = ""; $("bgPlace").value = ""; $("bgTitle").value = ""; $("bgText").value = "";
    renderBg(); dirty();
    status(`已添加号外：${year} · ${title}`, "ok");
  });

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
      const ctaBox = n.querySelector(".step-cta"), thumb = n.querySelector(".thumb"), urlInput = n.querySelector("[data-s=imgurl]");
      const showThumb = () => {
        const m = imgOf(st.img);
        thumb.style.backgroundImage = m ? `url("${m.src}")` : "";
        thumb.classList.toggle("has", !!m);
        thumb.title = st.img ? "已配图（点击 × 可移除）" : "可拖拽或粘贴图片到此站";
      };
      showThumb();
      const applyFile = async (f) => {
        if (!f || !f.type?.startsWith("image/")) return;
        try {
          const m = await fileToImage(f);
          const name = "up_" + Date.now().toString(36) + ".jpg";
          UP[name] = m; st.img = name;
          if (urlInput) urlInput.value = "";
          showThumb(); dirty(); status(`第 ${i + 1} 站照片已存入草稿。`, "ok");
        } catch (e) { status("这张照片读不出来，换一张试试。", "err"); }
      };
      ctaBox.hidden = !st.cta.on;
      n.querySelectorAll("[data-s]").forEach((el) => {
        const k = el.dataset.s;
        if (k === "file") { el.addEventListener("change", () => applyFile(el.files[0])); return; }
        if (k === "imgurl") {
          el.value = st.img && !st.img.startsWith("up_") && UP[st.img] ? UP[st.img].src : "";
          let t; el.addEventListener("input", () => { clearTimeout(t); t = setTimeout(async () => { const u = el.value.trim(); if (!/^https?:\/\//.test(u)) return; const name = "url_" + u.replace(/[^a-z0-9]/gi, "").slice(-40); UP[name] = await urlToImage(u); st.img = name; showThumb(); dirty(); }, 600); });
          return;
        }
        if (el.type === "checkbox") el.checked = !!get(st, k); else el.value = get(st, k) ?? "";
        el.addEventListener("input", () => {
          set(st, k, el.type === "checkbox" ? el.checked : el.value);
          if (k === "cta.on") ctaBox.hidden = !st.cta.on;
          if (k === "year") renderBg();
          dirty(k === "year" || k === "title");
        });
      });
      /* 支持拖拽与粘贴照片到这一站 */
      n.addEventListener("dragover", (e) => { if (e.dataTransfer?.types?.includes("Files")) { e.preventDefault(); n.classList.add("drop-on"); } });
      n.addEventListener("dragleave", () => n.classList.remove("drop-on"));
      n.addEventListener("drop", (e) => { n.classList.remove("drop-on"); const f = e.dataTransfer?.files?.[0]; if (f && f.type.startsWith("image/")) { e.preventDefault(); applyFile(f); } });
      n.addEventListener("paste", (e) => { const it = [...(e.clipboardData?.items || [])].find((x) => x.type.startsWith("image/")); if (it) { e.preventDefault(); applyFile(it.getAsFile()); } });
      n.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", (e) => {
        e.stopPropagation();
        const a = b.dataset.act;
        if (a === "pick") n.querySelector("[data-s=file]").click();
        if (a === "clearimg") { st.img = ""; if (urlInput) urlInput.value = ""; showThumb(); dirty(); status("已移除该站照片。"); }
        if (a === "del") { F.steps.splice(i, 1); renderSteps(); renderBg(); dirty(true); }
        if (a === "up" && i > 0) { [F.steps[i - 1], F.steps[i]] = [F.steps[i], F.steps[i - 1]]; renderSteps(); dirty(true); }
        if (a === "down" && i < F.steps.length - 1) { [F.steps[i + 1], F.steps[i]] = [F.steps[i], F.steps[i + 1]]; renderSteps(); dirty(true); }
      }));
      box.appendChild(n);
    });
  }
  $("addStep").addEventListener("click", () => { F.steps.push(newStep()); renderSteps(); dirty(); $("steps").lastElementChild.querySelector("input").focus(); });

  /* ---------- 家谱 ---------- */
  function renderPeople() {
    const box = $("people"), chs = chapters();
    box.innerHTML = "";
    F.people.forEach((p, i) => {
      const n = $("tplPerson").content.firstElementChild.cloneNode(true);
      const sel = n.querySelector("[data-p=parent]");
      sel.innerHTML = `<option value="">（第一代）</option>` + F.people.filter((q) => q.id !== p.id && q.name).map((q) => `<option value="${q.id}">${esc(q.name)} 的下一代</option>`).join("");
      const bSel = n.querySelector("[data-p=branch]");
      if (bSel) {
        bSel.innerHTML = chs.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
        if (!chs.includes(p.branch)) p.branch = chs[0] || "";
      }
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
    const [min, max] = minMax();
    let chs = chapters(); if (!chs.length) chs = ["店史"];
    const STORIES = chs.map((c, i) => {
      const ss = steps.filter((s) => (s.chapter || chs[0]) === c);
      if (!ss.length) return null;
      return {
        id: "c" + i, title: c, subtitle: `${ss[0].year}—${ss.at(-1).year} · ${ss.length} 站`, tags: [], color: PALETTE[i % PALETTE.length],
        steps: ss.map((s) => {
          const o = { year: s.year, place: (s.place || "").trim() || title, img: imgOf(s.img) ? s.img : null, title: (s.title || "").trim() || `${s.year} 年`, text: (s.text || "").trim() };
          if ((s.lesson || "").trim()) o.lesson = s.lesson.trim();
          if (s.cta && s.cta.on && (s.cta.label || s.cta.link || F.cta.wechat)) {
            o.cta = { label: s.cta.label, price: s.cta.price, link: s.cta.link, note: s.cta.note };
            if (!o.cta.link && F.cta.wechat) o.cta.wechat = F.cta.wechat;
          }
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
    const offSet = new Set(F.bgOff || []);
    let EVENTS = F.bg
      ? allBgPool()
          .filter((e) => e.year >= min && e.year <= max && !offSet.has(bgKey(e)))
          .map(({ year, place, img, title, text }) => ({ year, place, img: img && imgOf(img) ? img : null, title, text }))
      : [];
    while (EVENTS.length > 10) EVENTS = EVENTS.filter((e, i) => e.img || i % 2 === 0 || i === EVENTS.length - 1);
    const storyByChap = Object.fromEntries(STORIES.map((s) => [s.title, s.id]));
    const FAMILY = F.people.filter((p) => p.name.trim() && +p.born).map((p) => {
      const o = { id: p.id, name: p.name.trim(), born: +p.born, branch: storyByChap[p.branch] || STORIES[0].id, note: p.note || "" };
      if (p.parent) o.parent = p.parent;
      if (+p.died) o.died = +p.died;
      return o;
    });
    const IMAGES = {}, CAPTIONS = {};
    [...STORIES.flatMap((s) => s.steps), ...EVENTS].forEach((s) => {
      if (s.img && imgOf(s.img)) {
        IMAGES[s.img] = imgOf(s.img);
        CAPTIONS[s.img] = SAMPLE.CAPTIONS[s.img] || `${s.place} · ${s.year} — ${s.title}`;
      }
    });
    const range = max - min, stepY = range > 60 ? 20 : range > 25 ? 10 : range > 8 ? 5 : 2;
    const ticks = [min]; for (let y = Math.ceil((min + 1) / stepY) * stepY; y < max; y += stepY) ticks.push(y); if (ticks.length > 1 && max - ticks.at(-1) < stepY / 2) ticks.pop(); if (max > min) ticks.push(max);
    const cta = F.cta.label || F.cta.link || F.cta.wechat ? { ...F.cta } : undefined;
    const SITE = {
      name: title, title, en: (F.en || "").trim(), period: `${min} — ${max}`, price: (F.price || "").trim() || "定价：一句好故事", kicker: "商海时报 · 店报", masthead: title,
      min, max, gamma: 1, ticks, minorTicks: [], play: `播放${title}`, replay: "↺ 重看一遍", eventLane: "时代背景",
      empty: ["故事还没开始", "请按“播放”，从第一年看起。"], end: (F.end || "").trim() || `${title}，谢谢你翻到这里。`, quiz: [min, max],
      colophon: `本报由「店报工坊」生成 · 照片由店主提供${EVENTS.some((e) => e.img) ? "，时代背景图片来自 Wikimedia Commons（作者与许可见图注）" : ""}`, cta
    };
    return { SITE, ERAS, EVENTS, STORIES, FAMILY, IMAGES, CAPTIONS };
  }

  /* ---------- 引擎数据 → 表单（载入样板 / 导入完整数据） ---------- */
  function fromData(d) {
    const S = d.SITE || {};
    F = blank();
    F.title = S.title || S.name || ""; F.en = S.en || ""; F.min = S.min || ""; F.max = S.max || ""; F.price = S.price || ""; F.end = S.end || ""; F.slug = "";
    F.chapters = (d.STORIES || []).map((s) => s.title.split(/[：:]/)[0]).join("、");
    const chs = chapters();
    const branchToChap = Object.fromEntries((d.STORIES || []).map((s, i) => [s.id, chs[i] || chs[0] || ""]));
    (d.STORIES || []).forEach((s, i) => s.steps.forEach((st) => {
      F.steps.push({ year: st.year, place: st.place || "", chapter: chs[i], title: st.title || "", text: st.text || "", lesson: st.lesson || "", img: st.img || "", cta: { on: !!st.cta, label: st.cta?.label || "", price: st.cta?.price || "", link: st.cta?.link || "", note: st.cta?.note || "" } });
      if (st.img && (d.IMAGES || SAMPLE.IMAGES)[st.img]) UP[st.img] = (d.IMAGES || SAMPLE.IMAGES)[st.img];
    }));
    /* 保留样板或导入数据里的专属时代大事（如武夷山申遗、合福高铁） */
    const builtinKeys = new Set(BG.map(bgKey));
    F.customBg = [];
    (d.EVENTS || []).forEach((e) => {
      if (e.img && (d.IMAGES || SAMPLE.IMAGES)[e.img]) UP[e.img] = (d.IMAGES || SAMPLE.IMAGES)[e.img];
      if (!builtinKeys.has(bgKey(e))) F.customBg.push({ year: e.year, place: e.place || "", img: e.img || null, title: e.title || "", text: e.text || "" });
    });
    if (d.EVENTS && d.EVENTS.length) {
      const keepKeys = new Set(d.EVENTS.map(bgKey));
      const [min, max] = minMax();
      F.bgOff = BG.filter((e) => e.year >= min && e.year <= max && !keepKeys.has(bgKey(e))).map(bgKey);
    }
    (d.FAMILY || []).forEach((p) => F.people.push({ id: p.id, name: p.name, born: p.born, died: p.died || "", parent: p.parent || "", branch: branchToChap[p.branch] || chs[0] || "", note: p.note || "" }));
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
    dl(`family-${slug}.js`, `/* ${d.SITE.title} · 由店报工坊生成。放到 js/ 目录，访问 shop.html?d=${slug} */\n` + js("SITE", d.SITE) + js("ERAS", d.ERAS) + js("EVENTS", d.EVENTS) + js("STORIES", d.STORIES) + js("FAMILY", d.FAMILY) + js("CAPTIONS", d.CAPTIONS));
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
    fillTop(); renderSteps(); renderPeople(); dirty(true);
    status("已导入。看一眼各站内容，照片和票根都保留着。", "ok");
  });

  /* 载入样板（茶庄 / 咖啡馆 / 手作店） */
  document.querySelectorAll("[data-tpl]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (F.steps.some((s) => s.title || s.text) && !confirm("会覆盖你现在填的内容，继续载入样板？")) return;
      const tpl = btn.dataset.tpl;
      if (tpl === "tea") {
        fromData(SAMPLE); F.slug = "shanhai";
      } else if (PRESETS[tpl]) {
        const p = JSON.parse(JSON.stringify(PRESETS[tpl]));
        F = Object.assign(blank(), p);
      }
      fillTop(); renderSteps(); renderPeople(); dirty(); drawCard();
      status(`已载入《${F.title}》样板。点上方「预览我的店报」即可体验，或直接改成你的店。`, "ok");
    });
  });
  $("clearAll").addEventListener("click", () => {
    if (!confirm("清空全部内容和照片？")) return;
    F = blank(); UP = {}; while (F.steps.length < 5) F.steps.push(newStep());
    fillTop(); renderSteps(); renderPeople(); dirty(); drawCard(); status("已清空。");
  });

  /* ---------- 扫码立牌（支持 3 种版式 + 确定性纸纹 + 店史节点提要） ---------- */
  function fitFont(g, text, maxW, startPx, minPx, family) {
    let sz = startPx;
    while (sz > minPx) {
      g.font = `400 ${sz}px ${family}`;
      if (g.measureText(text).width <= maxW) break;
      sz -= 4;
    }
    return sz;
  }
  function wrapText(g, s, maxW) {
    const out = []; let cur = "";
    for (const ch of s) {
      if (g.measureText(cur + ch).width > maxW && cur) { out.push(cur); cur = ch; }
      else cur += ch;
    }
    if (cur) out.push(cur);
    return out;
  }
  function drawCornerOrnaments(g, x, y, w, h, s, color) {
    g.strokeStyle = color; g.lineWidth = 2;
    [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([cx, cy, dx, dy]) => {
      g.beginPath();
      g.moveTo(cx + dx * s, cy + dy * 6); g.lineTo(cx + dx * 6, cy + dy * 6); g.lineTo(cx + dx * 6, cy + dy * s);
      g.stroke();
    });
  }

  async function drawCard() {
    const cv = $("card"), g = cv.getContext("2d"), W = cv.width, H = cv.height;
    const title = (F.title || "我的店报").trim(), en = (F.en || "").trim(), url = (F.card.url || "").trim() || SAMPLE_URL;
    const slogan = (F.card.slogan || "").trim() || "扫码翻阅这家店的故事", tag = (F.card.tag || "").trim() || "创刊号";
    const style = F.card.style || "classic";
    const [min, max] = minMax();
    const price = (F.price || "定价：一个好故事").trim();
    try { await Promise.all([document.fonts.load('400 120px "Ma Shan Zheng"'), document.fonts.load('400 40px "UnifrakturMaguntia"'), document.fonts.load('900 40px "Noto Serif SC"')]); } catch (e) {}

    const isDark = style === "dark", isTicket = style === "ticket";
    const paper = isDark ? "#1c1814" : isTicket ? "#efe3c8" : "#f3ebd7";
    const ink = isDark ? "#f2e6ce" : "#1e1a15";
    const ink2 = isDark ? "#b8a686" : "#5d5244";
    const rule = isDark ? "#c9a458" : "#2a241d";
    const accent = isDark ? "#c9a458" : "#9e2a1f";
    const stampColor = "#9e2a1f";

    g.fillStyle = paper; g.fillRect(0, 0, W, H);
    /* 确定性纸纹（不随打字闪烁） */
    let seed = 1337;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 2400; i++) {
      g.fillStyle = isDark ? `rgba(255,235,190,${rand() * 0.035})` : `rgba(90,60,20,${rand() * 0.055})`;
      g.fillRect(rand() * W, rand() * H, 2, 2);
    }

    /* 外框与版式装饰 */
    if (isTicket) {
      g.strokeStyle = rule; g.lineWidth = 3; g.strokeRect(42, 42, W - 84, H - 84);
      g.lineWidth = 1; g.strokeRect(52, 52, W - 104, H - 104);
      /* 左右票根齿孔缺口 + 撕裂虚线 */
      const notchY = 420;
      g.save();
      g.fillStyle = "#cfc2a3";
      [42, W - 42].forEach((nx) => {
        g.beginPath(); g.arc(nx, notchY, 22, 0, Math.PI * 2); g.fill();
        g.strokeStyle = rule; g.lineWidth = 2.5; g.stroke();
      });
      g.strokeStyle = rule; g.lineWidth = 2; g.setLineDash([10, 8]);
      g.beginPath(); g.moveTo(72, notchY); g.lineTo(W - 72, notchY); g.stroke();
      g.restore();
    } else {
      g.strokeStyle = rule; g.lineWidth = 3.5; g.strokeRect(36, 36, W - 72, H - 72);
      g.lineWidth = 1.5; g.strokeRect(48, 48, W - 96, H - 96);
      drawCornerOrnaments(g, 48, 48, W - 96, H - 96, 28, accent);
    }

    /* 报头顶栏与左右报耳 */
    g.textAlign = "center"; g.fillStyle = ink2; g.font = '600 22px "Noto Serif SC", serif';
    g.fillText("商 海 时 报 · 店 报", W / 2, 108);
    g.strokeStyle = rule; g.lineWidth = 1.5; g.beginPath(); g.moveTo(96, 130); g.lineTo(W - 96, 130); g.stroke();

    /* 左右报耳（经典报头风格） */
    g.save();
    g.strokeStyle = rule; g.lineWidth = 1.2;
    g.strokeRect(96, 152, 156, 72);
    g.strokeRect(W - 252, 152, 156, 72);
    g.fillStyle = ink2; g.font = '600 17px "Noto Serif SC", serif';
    g.fillText("本报纪年", 174, 180);
    g.fillStyle = accent; g.font = '900 19px "Noto Serif SC", serif';
    g.fillText(`${min}—${max}`, 174, 208);
    g.fillStyle = ink2; g.font = '600 17px "Noto Serif SC", serif';
    g.fillText(tag, W - 174, 180);
    g.fillStyle = ink; g.font = '600 16px "Noto Serif SC", serif';
    g.fillText(price.slice(0, 8), W - 174, 208);
    g.restore();

    /* 店名大字（自动字号） */
    g.fillStyle = ink;
    const maxTitleW = W - 200;
    const titleSz = fitFont(g, title, maxTitleW, title.length <= 4 ? 142 : 118, 64, '"Ma Shan Zheng", "Noto Serif SC", serif');
    g.font = `400 ${titleSz}px "Ma Shan Zheng", "Noto Serif SC", serif`;
    const titleY = en ? 318 : 336;
    g.fillText(title, W / 2, titleY);
    if (en) {
      g.fillStyle = ink2; g.font = '400 40px "UnifrakturMaguntia", serif';
      g.fillText(en, W / 2, 372);
    }

    if (!isTicket) {
      g.strokeStyle = rule; g.lineWidth = 4; g.beginPath(); g.moveTo(96, 404); g.lineTo(W - 96, 404); g.stroke();
      g.lineWidth = 1.5; g.beginPath(); g.moveTo(96, 414); g.lineTo(W - 96, 414); g.stroke();
    }

    /* 二维码（整数像素格对齐，清晰无毛边） */
    const y0 = 468, targetSize = 480;
    try {
      const qr = qrcode(0, "M"); qr.addData(url); qr.make();
      const n = qr.getModuleCount(), cell = Math.max(2, Math.floor(targetSize / n)), size = cell * n;
      const x0 = Math.round((W - size) / 2);
      const pad = 26;
      g.fillStyle = isDark ? "#faf5e8" : "#ffffff";
      g.fillRect(x0 - pad, y0 - pad, size + pad * 2, size + pad * 2);
      g.strokeStyle = rule; g.lineWidth = 2.5;
      g.strokeRect(x0 - pad, y0 - pad, size + pad * 2, size + pad * 2);
      g.lineWidth = 1;
      g.strokeRect(x0 - pad + 6, y0 - pad + 6, size + pad * 2 - 12, size + pad * 2 - 12);
      g.fillStyle = "#1e1a15";
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) g.fillRect(x0 + c * cell, y0 + r * cell, cell, cell);
      }
    } catch (e) {
      g.strokeStyle = rule; g.lineWidth = 2; g.strokeRect((W - 480) / 2, y0, 480, 480);
      g.fillStyle = stampColor; g.font = '600 26px "Noto Serif SC", serif';
      g.fillText("二维码待生成（请检查网址长度或网络连接）", W / 2, y0 + 245);
    }

    /* 红色印章角标 */
    g.save();
    g.translate(W - 158, 456); g.rotate(-0.2);
    g.fillStyle = isDark ? "#1c1814" : paper;
    g.fillRect(-68, -32, 136, 64);
    g.strokeStyle = stampColor; g.lineWidth = 3.5; g.strokeRect(-68, -32, 136, 64);
    g.lineWidth = 1.2; g.strokeRect(-62, -26, 124, 52);
    g.fillStyle = stampColor; g.font = '900 30px "Noto Serif SC", serif';
    g.fillText(tag, 0, 11);
    g.restore();

    /* 扫码引导与标语 */
    g.fillStyle = ink; g.font = '900 44px "Noto Serif SC", serif';
    g.fillText("扫 码 翻 阅 店 报", W / 2, 1042);
    g.fillStyle = ink2; g.font = '400 29px "Noto Serif SC", serif';
    wrapText(g, slogan, W - 200).slice(0, 2).forEach((l, i) => g.fillText(l, W / 2, 1096 + i * 42));

    /* 店史关键节点提要（从表单 steps 自动提取最多 3 站） */
    const validSteps = F.steps.filter((s) => +s.year && (s.title || "").trim()).sort((a, b) => +a.year - +b.year);
    const picks = validSteps.length <= 3
      ? validSteps
      : [validSteps[0], validSteps[Math.floor(validSteps.length / 2)], validSteps.at(-1)];
    if (picks.length) {
      const ty = 1218;
      g.strokeStyle = rule; g.lineWidth = 1;
      g.beginPath(); g.moveTo(120, ty - 38); g.lineTo(W - 120, ty - 38); g.stroke();
      const spanW = (W - 240) / picks.length;
      picks.forEach((st, idx) => {
        const cx = 120 + spanW * (idx + 0.5);
        g.fillStyle = accent; g.font = '900 22px "Noto Serif SC", serif';
        g.fillText(`${st.year}`, cx, ty);
        g.fillStyle = ink; g.font = '600 20px "Noto Serif SC", serif';
        g.fillText(String(st.title).trim().slice(0, 8), cx, ty + 30);
      });
    } else if (F.cta && F.cta.label) {
      g.fillStyle = accent; g.font = '600 24px "Noto Serif SC", serif';
      g.fillText(`本报推荐：${F.cta.label}${F.cta.price ? " · " + F.cta.price : ""}`, W / 2, 1230);
    }

    /* 底栏刊尾 */
    g.strokeStyle = rule; g.lineWidth = 1.5; g.beginPath(); g.moveTo(96, 1340); g.lineTo(W - 96, 1340); g.stroke();
    g.fillStyle = ink2; g.font = '400 23px "Noto Serif SC", serif';
    g.fillText(`${min} — ${max} · ${price}`, W / 2, 1384);
    g.font = '400 19px "Noto Serif SC", serif';
    g.fillText(url.replace(/^https?:\/\//, "").slice(0, 62), W / 2, 1422);
  }
  $("drawCard").addEventListener("click", drawCard);
  $("dlCard").addEventListener("click", async () => { await drawCard(); const a = document.createElement("a"); a.download = `${(F.slug || "shop")}-card.png`; a.href = $("card").toDataURL("image/png"); a.click(); });

  /* ---------- 启动 ---------- */
  fillTop(); renderSteps(); renderPeople(); drawCard();
})();
