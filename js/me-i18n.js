/* 中洲纪年 · 中英双语
 * 语言由 middle-earth.html 头部的小脚本决定（?lang=en / 本地记忆 / 浏览器语言），写在 window.ME_LANG。
 * 英文模式下：把各数据文件里的中文换成 js/me-en.js（window.ME_EN）里的译文，再翻译页面上的固定文字。
 */
(function () {
  const EN = window.ME_LANG === "en";
  window.ME_UI = {
    "小朋友寻宝 🧒": "Kids Treasure Hunt 🧒", "跟着弗罗多找地方、集贴纸": "Find places with Frodo, collect stickers", "小朋友模式": "Kids mode",
    // 页面
    "中洲纪年 · 指环王版": "Chronicle of Middle-earth",
    "可交互的中洲世界地图、编年史、传说导读与主要战役推演。非官方爱好者作品。": "An interactive map of Middle-earth: chronicle, guided legends and the great battles. An unofficial fan work.",
    "商海时报 · 特别版 · 非官方爱好者作品": "Chronicle of Commerce · Special Edition · Unofficial fan work",
    "中洲纪年": "Chronicle of Middle-earth",
    "从双圣树的光，到魔戒在末日火山中熔化——七千多年的大陆、王国、传说与战争，铺在一张会随时间变化的地图上。拖动时间，看贝烈瑞安德沉入大海、努门诺尔升起又覆灭；跟着至尊戒走完它的路；看六十多位 Q 版人物在大陆上迁徙、远征、定居；走进战场，亲身经历那几场决定世界的战役。":
      "From the light of the Two Trees to the unmaking of the Ring in the fires of Mount Doom: seven thousand years of lands, kingdoms, legends and wars, laid out on one map that changes with time. Drag the timeline to watch Beleriand sink beneath the sea and Númenor rise and fall; follow the One Ring along its road; watch more than seventy little characters migrate, march and settle; then step onto the battlefields that decided the fate of the world.",
    "A Chronicle of Middle-earth": "The lands, legends and wars of Arda",
    "从头开始 ▸": "Start from the beginning ▸",
    "自动播放全部纪元": "Play through every age",
    "直接去魔戒大战": "Jump to the War of the Ring",
    "跟着弗罗多出发": "Set out with Frodo",
    "身临战场 ⚔": "Enter a battle ⚔",
    "六场主要战役": "Six great battles",
    "空格 播放/暂停 · ← → 逐个事件 · 滚轮/双指 缩放地图 · 点击地名查看历史": "Space play/pause · ← → step through events · wheel/pinch to zoom · click a place for its history",
    "商海时报": "Chronicle of Commerce",
    "指环王版": "Lord of the Rings edition",
    "首页": "Home", "家族版": "Family", "时尚版": "Fashion",
    "切换侧栏": "Toggle panel",
    "编年": "Chronicle", "人物": "People", "传说": "Legends", "战役": "Battles",
    "非官方爱好者作品，与托尔金遗产委员会、Middle-earth Enterprises、华纳兄弟等均无关联。地图为原创示意图、不按比例；文字为原创中文概述。":
      "Unofficial fan work, not affiliated with the Tolkien Estate, Middle-earth Enterprises or Warner Bros. The map is an original sketch, not to scale; all text is original summary.",
    "中洲地图": "Map of Middle-earth",
    "放大": "Zoom in", "缩小": "Zoom out", "本纪元全图": "Whole map for this age",
    "▲ 精灵": "▲ Elves", "■ 人类": "■ Men", "◆ 矮人": "◆ Dwarves", "● 霍比特": "● Hobbits", "✕ 暗影": "✕ Shadow", "◉ 至尊戒": "◉ The One Ring",
    "上一个事件": "Previous event", "下一个事件": "Next event", "播放": "Play", "暂停": "Pause",
    "自动推进": "Auto-advance", "声音 关": "Sound off", "声音 开": "Sound on", "关闭": "Close",
    "■ 西方/自由人民": "■ The West / Free Peoples", "■ 黑暗势力": "■ The Shadow",
    // 纪元与日期
    "双树纪": "Years of the Trees", "第一纪元": "FA", "第二纪元": "SA", "第三纪元": "TA", "第四纪元": "FoA",
    // 地图
    "已移出世界之圈 · 唯有精灵的船走笔直航道": "Removed from the circles of the world · only Elven ships sail the Straight Road",
    "至尊戒": "The One Ring", "地标 · 典故": "Landmark · Lore", "（废墟）": " (ruins)",
    "精灵": "Elves", "人类": "Men", "矮人": "Dwarves", "霍比特人": "Hobbits", "霍比特": "Hobbits", "黑暗势力": "The Shadow", "地标": "Landmark",
    "暗影": "Shadow", "魔戒": "The Ring", "战争": "War",
    "这里在编年里还没有专门的记载。": "The chronicle has no entry for this place yet.",
    "日月初升 · 第一纪元": "The Sun and Moon rise · First Age",
    "贝烈瑞安德沉入大海 · 第二纪元": "Beleriand sinks beneath the sea · Second Age",
    "索隆败亡 · 第三纪元": "Sauron is overthrown · Third Age",
    "精灵西渡 · 第四纪元": "The Elves sail West · Fourth Age",
    // 人物卡
    "登场": "Enters", "跟随": "Following", "停止跟随": "Stop following",
    "居所": "Homes", "参战": "Battles", "足迹 · 点一下跟着走": "Journeys · click to follow",
    "称号": "Titles", "生平": "Lifespan", "亲族": "Kin", "传记": "Biography", "结局": "Fate",
    "展开完整传记 ▾": "Read the full biography ▾", "收起 ▴": "Show less ▴",
    "迁徙": "Migration", "旅程": "Journey", "从头跟随这段路": "Follow this road from the start",
    "身临战场": "Enter the battle", "读传说": "Read the legend", "身临": "Enter: ",
    // 侧栏
    "每个传说是一段引导式阅读：点“下一段”，地图会飞到故事发生的地方，时间也会拨到那一年。": "Each legend is a guided reading: press “Next” and the map flies to where the story happens, and the clock turns to that year.",
    "段": "parts",
    "中洲的 {n} 位人物。点一个人，地图会跳到他出现的年代和地点；在人物卡里点“足迹”，就能跟着他走完那段路。地图上走动的小队就是正在旅行的人。": "{n} people of Middle-earth. Pick one and the map jumps to when and where they appear; under “Journeys” on their card you can follow them along the road. The little groups walking on the map are travellers on the move.",
    "选一场战役进入战场：分阶段推演兵力移动，你会以一个普通人的视角经历它。": "Choose a battle to enter: the armies move phase by phase, and you live through it as an ordinary soldier.",
    "对": "vs", "进入战场 ▸": "Enter the battle ▸",
    "全部传说": "All legends", "上一段": "Previous", "下一段": "Next", "读完了 · 回到列表": "The end · back to the list",
    "关键时刻": "Key moment", "上一个时刻": "Previous moment", "下一个时刻": "Next moment", "继续 ▸": "Continue ▸",
    "播放时遇到关键时刻自动停下": "Pause playback at key moments",
    "那些被反复讲述的瞬间。播放时间轴走到这里会自动停下，也可以直接点开。": "The instants that are told and retold. Playback pauses when it reaches one, or open any of them here.",
    "你": "You", "上一幕": "Previous act", "序": "Prologue", "回到地图 ▸": "Back to the map ▸", "下一幕": "Next act",
    "攻击": "Attack", "防御": "Defense", "力量": "Power", "知识": "Knowledge", "等级": "Level", "士气": "Morale", "运气": "Luck",
    "巫师": "Wizard", "骑士": "Knight", "游侠": "Ranger", "战士": "Warrior", "冒险者": "Adventurer", "术士": "Warlock", "贤者": "Sage", "吟游诗人": "Bard", "领主": "Lord",
    "月": "Month", "周": "Week", "日": "Day", "小地图": "Minimap", "英雄属性": "Hero stats",
  };
  const UI = window.ME_UI;

  // 语言切换按钮
  const btn = document.getElementById("langBtn");
  if (btn) {
    btn.textContent = EN ? "中文" : "EN";
    btn.title = EN ? "切换到中文" : "Switch to English";
    btn.addEventListener("click", () => {
      const to = EN ? "zh" : "en";
      try { localStorage.setItem("me-lang", to); } catch (e) {}
      const u = new URL(location.href); u.searchParams.set("lang", to); location.href = u.toString();
    });
  }
  // 地图风格切换：手绘写实（默认）→ 英雄（彩色冒险地图）→ 羊皮纸
  const sb = document.getElementById("styleBtn");
  if (sb) {
    const ORD = ["paint", "h3", "parch"], NM = { paint: ["手绘", "Painted"], h3: ["英雄", "Heroes"], parch: ["羊皮纸", "Parchment"] };
    const cur = window.ME_STYLE, to = ORD[(ORD.indexOf(cur) + 1) % ORD.length];
    sb.textContent = "🗺 " + NM[cur][EN ? 1 : 0];
    sb.title = EN ? `Map style: ${NM[cur][1]} — click for ${NM[to][1]}` : `地图风格：${NM[cur][0]}，点击切换到「${NM[to][0]}」`;
    sb.addEventListener("click", () => {
      try { localStorage.setItem("me-style", to); } catch (e) {}
      const u = new URL(location.href); u.searchParams.set("style", to); location.href = u.toString();
    });
  }
  if (!EN) return;

  // 数据：中文 → 英文
  const D = window.ME_EN || {};
  const CJK = /[㐀-鿿]/;
  const miss = new Set();
  const walk = (o, skip) => {
    if (!o || typeof o !== "object") return;
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (typeof v === "string") { if (CJK.test(v)) { if (D[v]) o[k] = D[v]; else miss.add(v); } }
      else if (v && typeof v === "object" && v !== skip) walk(v, skip);
    }
  };
  (window.ME?.EVENTS || []).forEach((e) => { e.h0 = e.h; });
  // 自带英文字段的数据（关键时刻、扩写后的传说）
  (window.ME_MOMENTS || []).forEach((m) => ["h", "line", "by", "scene"].forEach((k) => { if (m[k + "En"] != null) m[k] = m[k + "En"]; }));
  (window.ME?.LEGENDS || []).forEach((l) => { if (l.subEn) l.sub = l.subEn; l.beats.forEach((b) => { if (b.hEn) b.h = b.hEn; if (b.pEn) b.p = b.pEn; }); });
  ["WORLD", "ME", "ME_BATTLES", "ME_CHARS", "ME_DECO", "ME_BIO"].forEach((k) => walk(window[k]));
  if (window.ME_LIFE) { walk(window.ME_LIFE.LANDMARKS); walk(window.ME_LIFE.LIFE); walk(window.ME_LIFE.WONDERS); }
  // 中文名翻译后与英文副名重复时，去掉副名
  const norm = (x) => String(x || "").toLowerCase().replace(/^(the|a|an) /, "").replace(/^(battle of|siege of) (the )?/, "").trim();
  const dedupe = (o) => { if (o && typeof o.n === "string" && typeof o.en === "string" && norm(o.n) === norm(o.en)) o.en = ""; };
  const W = window.WORLD || {}, M = window.ME || {};
  [W.labels, W.edges, M.ERAS, M.PLACES, M.REALMS, M.LEGENDS, window.ME_BATTLES, window.ME_CHARS?.CHARS && Object.values(window.ME_CHARS.CHARS)].forEach((a) => (Array.isArray(a) ? a : a ? Object.values(a) : []).forEach(dedupe));
  // 时间轴色带用短名
  const SN = { trees: "Trees", fa: "First Age", sa: "Second Age", ta: "Third Age", hobbit: "Shadow", war: "Ring War", fo: "Fourth Age" };
  (M.ERAS || []).forEach((e) => { if (SN[e.id]) e.sn = SN[e.id]; });
  if (miss.size) console.warn("ME i18n: untranslated", miss.size, [...miss].slice(0, 5));

  // 页面固定文字
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = []; while (tw.nextNode()) nodes.push(tw.currentNode);
  nodes.forEach((n) => { const s = n.nodeValue.trim(); if (s && UI[s]) n.nodeValue = n.nodeValue.replace(s, UI[s]); });
  document.querySelectorAll("[aria-label],[title]").forEach((el) => ["aria-label", "title"].forEach((a) => { const v = el.getAttribute(a); if (v && UI[v]) el.setAttribute(a, UI[v]); }));
  document.title = UI["中洲纪年 · 指环王版"];
  const md = document.querySelector('meta[name="description"]'); if (md) md.content = UI[md.content] || md.content;
})();
