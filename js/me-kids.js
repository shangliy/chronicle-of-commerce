/* 中洲纪年 · 小朋友模式
 * 跟着弗罗多的冒险路线，在地图上找到 10 个地方，每找到一个得一颗星和一张贴纸。
 * 点地图上的人物会弹出一句简单的介绍，可以用浏览器自带的语音朗读。
 * 依赖 me.js 暴露的 window.__ME，以及 showPlace / showChar 里对 window.ME_KIDS 的调用。
 */
(function () {
  "use strict";
  const EN = window.ME_LANG === "en";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const L = (zh, en) => (EN ? en : zh);
  const D = window.ME || { PLACES: [] }, TT = window.ME_T;
  const PI = {}; D.PLACES.forEach((p) => (PI[p.id] = p));

  /* ——任务：弗罗多的冒险路线—— {n} 会换成地图上当时的地名 */
  const QUEST = [
    { id: "hobbiton", who: "frodo", ask: ["弗罗多住在山坡下一个圆圆门的小洞里。帮他找到「{n}」吧！", "Frodo lives in a cosy hole with a round green door. Can you find {n}?"],
      yay: ["找到啦！霍比特人个子小小的，脚毛茸茸的，一天要吃六顿饭！", "You found it! Hobbits are small, have furry feet, and eat six meals a day!"] },
    { id: "rivendell", who: "elrond", ask: ["弗罗多要把魔戒送去精灵的家「{n}」。它藏在大山脚下的山谷里。", "Frodo must carry the Ring to the Elves' home, {n}. It hides in a valley below the mountains."],
      yay: ["太棒了！九个好朋友在这里组成了「魔戒远征队」。", "Great! Nine friends became the Fellowship of the Ring here."] },
    { id: "moria", who: "gandalf", ask: ["大家要穿过矮人挖在山肚子里的地下城「{n}」。它就在那排大雪山中间！", "The friends go under the mountains through the Dwarf city {n}. Look in the middle of the big snowy range!"],
      yay: ["找到了！甘道夫在这里对火焰怪物说：「你不能过去！」", "Found it! Here Gandalf told the fire monster: \"You shall not pass!\""] },
    { id: "lorien", who: "galadriel", ask: ["接下来去金色树叶的精灵森林「{n}」休息一下。", "Next, rest in {n}, the Elf forest with golden leaves."],
      yay: ["真厉害！精灵女王凯兰崔尔送给每个人一份礼物。", "Well done! The Elf queen Galadriel gave everyone a gift."] },
    { id: "isengard", who: "treebeard", ask: ["坏巫师萨鲁曼躲在一座黑色高塔里。找找「{n}」！", "The bad wizard Saruman hides in a tall black tower. Find {n}!"],
      yay: ["抓到你了！会走路的大树「树人」把高塔团团围住了。", "Got him! The walking trees, the Ents, surrounded his tower."] },
    { id: "edoras", who: "theoden", ask: ["骑马的人们住在草原上的金色大殿里。它叫「{n}」。", "The horse-riders live in a golden hall on the grassy plains. It is called {n}."],
      yay: ["找到了！洛汗的骑士们骑着骏马去帮助朋友。", "Yes! The Riders of Rohan gallop off to help their friends."] },
    { id: "minastirith", who: "aragorn", ask: ["有一座七层高的白色城市，建在山坡上。它叫「{n}」。", "There is a white city with seven levels built on a mountain. It is called {n}."],
      yay: ["好眼力！阿拉贡后来在这里当上了国王。", "Sharp eyes! Aragorn later became king here."] },
    { id: "orodruin", who: "sam", ask: ["魔戒只能在一座冒火的大山里被毁掉。快找到「{n}」！", "The Ring can only be destroyed in a fiery mountain. Find {n}, quick!"],
      yay: ["成功啦！山姆背着累坏了的弗罗多爬上火山，魔戒被毁掉了！", "Hooray! Sam carried tired Frodo up the mountain and the Ring was destroyed!"] },
    { id: "erebor", who: "bilbo", ask: ["弗罗多的叔叔比尔博年轻时去过一座孤零零的山，那里住过一条巨龙。找找「{n}」。", "When Bilbo was young he visited a lonely mountain where a dragon lived. Find {n}."],
      yay: ["找到了！巨龙史矛革睡在一大堆金子上。", "Found it! The dragon Smaug slept on a giant pile of gold."] },
    { id: "mithlond", who: "frodo", ask: ["冒险结束了，弗罗多要从海边的港口坐白船去远方。找到「{n}」！", "The adventure is over. Frodo sails away on a white ship from the harbour. Find {n}!"],
      yay: ["你完成了全部冒险！弗罗多和朋友们挥手说再见。", "You finished the whole adventure! Frodo waves goodbye to his friends."] },
  ];

  /* ——人物的一句话介绍（其余人物用传记的第一句）—— */
  const SAY = {
    frodo: ["我是弗罗多，一个霍比特人。我要把魔戒送去火山毁掉！", "I'm Frodo, a hobbit. I must take the Ring to the fiery mountain!"],
    sam: ["我是山姆，弗罗多最好的朋友。我喜欢种花，也会一直陪着他！", "I'm Sam, Frodo's best friend. I love gardening, and I'll never leave him!"],
    merry: ["我是梅里！我和皮平总是一起闯祸，也一起变勇敢。", "I'm Merry! Pippin and I get into trouble together, and get brave together."],
    pippin: ["我是皮平，最小的霍比特人。我后来长得比谁都高！", "I'm Pippin, the youngest hobbit. Later I grew taller than anyone!"],
    bilbo: ["我是比尔博，我写了一本冒险书，还找到了那枚戒指。", "I'm Bilbo. I wrote a book about my adventure, and I found the Ring."],
    gollum: ["我的宝贝……咕噜，咕噜！", "My precious... gollum, gollum!"],
    gandalf: ["我是巫师甘道夫，我的烟花可好看啦！", "I'm Gandalf the wizard. My fireworks are the best!"],
    gandalfw: ["我回来了，现在我是白袍甘道夫！", "I'm back, and now I'm Gandalf the White!"],
    aragorn: ["我是阿拉贡，一个守护大家的游侠，后来成了国王。", "I'm Aragorn, a ranger who protects people. Later I became king."],
    legolas: ["我是精灵莱戈拉斯，我的眼睛能看到很远很远！", "I'm Legolas the Elf. My eyes can see very, very far!"],
    gimli: ["我是矮人金雳！我的斧头可厉害了！", "I'm Gimli the Dwarf! My axe is mighty!"],
    boromir: ["我是波洛米尔，我会吹响大号角保护朋友。", "I'm Boromir. I blow my big horn to protect my friends."],
    galadriel: ["我是精灵女王凯兰崔尔，我送给弗罗多一瓶星光。", "I'm Galadriel, Queen of the Elves. I gave Frodo a bottle of starlight."],
    elrond: ["欢迎来到幽谷，我是这里的主人埃尔隆德。", "Welcome to Rivendell. I'm Elrond, the lord of this house."],
    arwen: ["我是亚玟，精灵公主，我骑着白马救了弗罗多。", "I'm Arwen, an Elf princess. I rode a white horse to save Frodo."],
    treebeard: ["呼——嗯——我是树须，一棵会走路、会说话的老树。别着急！", "Hoom, hom... I'm Treebeard, a tree who walks and talks. Don't be hasty!"],
    saruman: ["我是萨鲁曼，一个变坏了的巫师。", "I'm Saruman, a wizard who turned bad."],
    sauron: ["我是索隆，黑暗魔君。我在找我的戒指……", "I am Sauron, the Dark Lord. I'm looking for my Ring..."],
    eye: ["一只燃烧的大眼睛，一直在找魔戒。", "A great burning eye, always searching for the Ring."],
    smaug: ["我是巨龙史矛革，我最喜欢金子！", "I'm Smaug the dragon. I love gold more than anything!"],
    theoden: ["我是洛汗的国王希奥顿，骑士们，出发！", "I'm Théoden, King of Rohan. Riders, forward!"],
    eowyn: ["我是伊奥温，我勇敢地打败了可怕的巫王！", "I'm Éowyn. I bravely defeated the scary Witch-king!"],
    faramir: ["我是法拉米尔，我帮助了弗罗多和山姆。", "I'm Faramir. I helped Frodo and Sam."],
    tom: ["嘿哟！我是汤姆·邦巴迪尔，森林里最快乐的人！", "Hey dol! I'm Tom Bombadil, the merriest fellow in the forest!"],
    thorin: ["我是矮人国王索林，我想夺回我们的大山。", "I'm Thorin, King of the Dwarves. I want our mountain back."],
    beorn: ["我是贝奥恩，我能变成一头大熊！", "I'm Beorn. I can turn into a great bear!"],
    witchking: ["我是戒灵之首巫王，小心我！", "I'm the Witch-king, chief of the Ringwraiths. Beware!"],
    nazgul: ["九个黑骑士，骑着黑马找魔戒。", "Nine Black Riders on black horses, hunting for the Ring."],
    balrog: ["一只浑身是火的大怪物！", "A huge monster made of fire!"],
    shelob: ["我是大蜘蛛希洛布，我织的网可黏了！", "I'm Shelob the giant spider. My webs are very sticky!"],
    radagast: ["我是拉达加斯特，小鸟和小动物都是我的朋友。", "I'm Radagast. Birds and animals are my friends."],
  };

  /* ——存档—— */
  const KEY = "me-kids";
  let S = { i: 0, got: [] };
  try { S = Object.assign(S, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  let mute = false; try { mute = localStorage.getItem("me-kids-mute") === "1"; } catch (e) {}

  /* ——声音：小铃铛 + 朗读—— */
  let AC = null;
  function tone(seq) {
    if (mute) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      let t = AC.currentTime;
      seq.forEach(([f, d, type = "sine", v = 0.18]) => {
        const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + d);
        o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + 0.05); t += d * 0.55;
      });
    } catch (e) {}
  }
  const chime = () => tone([[659, 0.25], [784, 0.25], [988, 0.3], [1319, 0.55]]);
  const boop = () => tone([[330, 0.22, "triangle", 0.14], [262, 0.3, "triangle", 0.12]]);
  const pop = () => tone([[880, 0.12, "sine", 0.12]]);
  function speak(text) {
    if (mute || !window.speechSynthesis) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[「」]/g, ""));
      u.lang = EN ? "en-US" : "zh-CN"; u.rate = EN ? 0.92 : 0.95; u.pitch = 1.15;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* ——界面—— */
  const box = document.createElement("div");
  box.id = "kids"; box.className = "kids-box"; box.hidden = true;
  document.querySelector(".mapwrap").appendChild(box);
  const fx = document.createElement("div"); fx.className = "kids-fx"; document.querySelector(".mapwrap").appendChild(fx);

  const M = () => window.__ME;
  const nameOf = (p) => (p.tx ? p.tx.textContent : p.n);
  const iconSvg = (p) => `<svg viewBox="-17 -24 34 34" class="k-ic">${window.ME_ICON ? window.ME_ICON(p) : ""}</svg>`;
  const face = (id) => { const c = M() && M().CI[id]; return c ? `<span class="k-face">${M().PT(c)}</span>` : ""; };
  let tries = 0, hintT = 0, cur = null;

  function stickers() {
    return `<div class="k-st">${QUEST.map((q, k) => { const p = PI[q.id], g = S.got.includes(q.id);
      return `<span class="k-sl${g ? " got" : ""}${k === S.i ? " now" : ""}" title="${g ? esc(nameOf(p)) : "?"}">${g ? iconSvg(p) : "<b>?</b>"}</span>`; }).join("")}</div>`;
  }
  function head() {
    return `<div class="k-top"><b class="k-stars">⭐ ${S.got.length} / ${QUEST.length}</b>
      <span class="k-btns"><button data-k="say" title="${L("读给我听", "Read it to me")}">🔊</button><button data-k="mute" title="${L("声音开关", "Sound on/off")}">${mute ? "🔇" : "🔔"}</button><button data-k="exit" title="${L("退出小朋友模式", "Leave kids mode")}">✕</button></span></div>`;
  }
  function render(msg, cls = "") {
    if (S.i >= QUEST.length) return done();
    cur = QUEST[S.i]; const p = PI[cur.id];
    const ask = cur.ask[EN ? 1 : 0].replace("{n}", nameOf(p));
    box.innerHTML = head() + `<div class="k-q">${face(cur.who)}<div class="k-tx"><small>${L("第", "Quest ")}${S.i + 1}${L(" 关", "")}</small><p>${esc(ask).replace(esc(nameOf(p)), `<b>${esc(nameOf(p))}</b>`)}</p></div><span class="k-goal">${iconSvg(p)}</span></div>
      <div class="k-msg ${cls}">${msg || L("👆 在地图上点一点，找到它！", "👆 Tap the map to find it!")}</div>
      <div class="k-row"><button data-k="hint" class="k-hint">💡 ${L("给我一点提示", "Give me a hint")}</button></div>` + stickers();
    box.hidden = false;
    return ask;
  }
  function done() {
    box.innerHTML = head() + `<div class="k-done"><div class="k-medal">🏅</div><h3>${L("魔戒小英雄！", "Little Hero of the Ring!")}</h3><p>${L("你跟着弗罗多走完了整段冒险，集齐了所有贴纸。", "You followed Frodo through the whole adventure and collected every sticker.")}</p>${stickers()}<button data-k="again" class="k-go">${L("再玩一次 ↻", "Play again ↻")}</button></div>`;
    box.hidden = false; confetti(60); chime();
    speak(L("你是魔戒小英雄！", "You are a little hero of the Ring!"));
  }
  function dir(dx, dy) {
    const a = Math.atan2(-dy, dx) * 180 / Math.PI, k = Math.round(((a + 360) % 360) / 45) % 8;
    return EN ? ["east", "north-east", "north", "north-west", "west", "south-west", "south", "south-east"][k] : ["东", "东北", "北", "西北", "西", "西南", "南", "东南"][k];
  }
  const arrow = (dx, dy) => { const a = Math.atan2(dy, dx) * 180 / Math.PI; return `<i class="k-arrow" style="transform:rotate(${a.toFixed(0)}deg)">➜</i>`; };

  function hint() {
    if (!cur) return; const p = PI[cur.id], me = M(); if (!me) return;
    me.flyTo(p.x - (innerWidth > 860 ? 70 : 0), p.y + (innerWidth > 860 ? 0 : 60), 380, 1400); setTimeout(() => me.pulse(p.x, p.y), 1300); setTimeout(() => me.pulse(p.x, p.y), 2300);
    p.g && p.g.classList.add("k-target"); clearTimeout(hintT); hintT = setTimeout(() => p.g && p.g.classList.remove("k-target"), 6000);
  }
  function confetti(n = 36) {
    const cols = ["#f4c430", "#e8553f", "#4aa3df", "#6cc04a", "#c86ad8", "#ff9a3c"];
    for (let i = 0; i < n; i++) {
      const s = document.createElement("i"); s.className = "k-cf"; s.textContent = i % 5 === 0 ? "⭐" : "";
      s.style.cssText = `left:${50 + (Math.random() - 0.5) * 30}%;background:${i % 5 === 0 ? "none" : cols[i % cols.length]};--dx:${((Math.random() - 0.5) * 900).toFixed(0)}px;--dy:${(-200 - Math.random() * 380).toFixed(0)}px;--r:${(Math.random() * 720).toFixed(0)}deg;animation-delay:${(Math.random() * 0.15).toFixed(2)}s`;
      fx.appendChild(s); setTimeout(() => s.remove(), 1900);
    }
  }

  function onPlace(p) {
    if (!K.on || !cur) return false;
    const me = M();
    if (p.id === cur.id) {
      if (!S.got.includes(p.id)) S.got.push(p.id);
      chime(); confetti(); me && me.pulse(p.x, p.y);
      p.g && p.g.classList.remove("k-target");
      const yay = cur.yay[EN ? 1 : 0];
      S.i++; tries = 0; save();
      box.innerHTML = head() + `<div class="k-win"><span class="k-big">${iconSvg(p)}</span><div><h3>🎉 ${L("找到了", "You found")} ${esc(nameOf(p))}${L("！", "!")}</h3><p>${esc(yay)}</p></div></div>
        <div class="k-row"><button data-k="next" class="k-go">${S.i >= QUEST.length ? L("领取奖章 🏅", "Get your medal 🏅") : L("下一站 ➜", "Next stop ➜")}</button></div>` + stickers();
      box.hidden = false; speak(L("找到了！", "You found it! ") + yay);
      box.querySelector(".k-big")?.classList.add("pop");
      return true;
    }
    tries++; boop();
    const t = PI[cur.id], dx = t.x - p.x, dy = t.y - p.y, dist = Math.hypot(dx, dy);
    const near = dist < 70;
    const msg = EN ? `That's ${esc(nameOf(p))}. ${near ? "So close!" : "Not quite."} Try further <b>${dir(dx, dy)}</b> ${arrow(dx, dy)}`
      : `这是「${esc(nameOf(p))}」。${near ? "很近了！" : "不是这里哦，"}往<b>${dir(dx, dy)}边</b>找找 ${arrow(dx, dy)}`;
    render(msg, "no");
    speak((EN ? `That's ${nameOf(p)}. Try further ${dir(dx, dy)}.` : `这是${nameOf(p)}。往${dir(dx, dy)}边找找。`));
    if (tries >= 3) hint();
    return true;
  }

  function onChar(c) {
    if (!K.on) return false;
    const me = M(); pop();
    const line = SAY[c.id] ? SAY[c.id][EN ? 1 : 0] : String(c.bio || "").split(/(?<=[。！？.!?])/)[0];
    const card = $("#card");
    card.innerHTML = `<button class="x" aria-label="${L("关闭", "Close")}">×</button><div class="k-char"><span class="k-cpt">${me ? me.PT(c) : ""}</span><div><h3>${esc(c.n)}</h3><p class="k-bubble">${esc(line)}</p><button class="k-say" data-k="csay">🔊 ${L("听一听", "Listen")}</button></div></div>`;
    card.hidden = false; card.classList.add("k-card");
    card.querySelector("[data-k=csay]").onclick = (e) => { e.stopPropagation(); speak(c.n + "。" + line); };
    speak(line);
    return true;
  }

  function onJourney(j, who) {
    if (!K.on) return false;
    const me = M(); if (!me || !who.length) return false;
    if (who.length === 1) return onChar(me.CI[who[0]]);
    pop();
    const card = $("#card");
    card.innerHTML = `<button class="x" aria-label="${L("关闭", "Close")}">×</button><h3 class="k-jh">${L("谁在赶路？点一点！", "Who is travelling? Tap one!")}</h3><div class="k-who">${who.map((id) => me.CI[id] ? `<button data-c="${id}"><span>${me.PT(me.CI[id])}</span><b>${esc(me.CI[id].n)}</b></button>` : "").join("")}</div>`;
    card.hidden = false; card.classList.add("k-card");
    return true;
  }
  const home = () => { const m = innerWidth <= 860; M()?.flyTo(m ? 600 : 560, m ? 560 : 420, m ? 900 : 1150, 1200); };
  function enter() {
    K.on = true; document.documentElement.classList.add("kids");
    $("#kidsBtn")?.classList.add("on");
    const me = M(); if (!me) return;
    me.pause && me.pause();
    if (TT) me.setT(TT.TA(3018, 9, 23), true);
    home();
    $("#card").hidden = true;
    document.body.classList.remove("panel-open");
    window.dispatchEvent(new Event("resize"));
    const ask = render();
    setTimeout(() => speak(ask || ""), 700);
  }
  function exit() {
    K.on = false; document.documentElement.classList.remove("kids"); box.hidden = true; $("#kidsBtn")?.classList.remove("on");
    $("#card").classList.remove("k-card");
    window.dispatchEvent(new Event("resize"));
    try { speechSynthesis.cancel(); } catch (e) {}
  }

  box.addEventListener("click", (e) => {
    const b = e.target.closest("[data-k]"); if (!b) return; e.stopPropagation();
    const k = b.dataset.k;
    if (k === "exit") exit();
    else if (k === "hint") { hint(); speak(L("看，它在闪光的地方！", "Look where it sparkles!")); }
    else if (k === "next") { const a = render(); speak(a || ""); if (S.i < QUEST.length) home(); }
    else if (k === "say") { if (S.i >= QUEST.length) return; speak(QUEST[S.i].ask[EN ? 1 : 0].replace("{n}", nameOf(PI[QUEST[S.i].id]))); }
    else if (k === "mute") { mute = !mute; try { localStorage.setItem("me-kids-mute", mute ? "1" : "0"); speechSynthesis.cancel(); } catch (e) {} b.textContent = mute ? "🔇" : "🔔"; }
    else if (k === "again") { S = { i: 0, got: [] }; save(); render(); home(); }
  });
  // 普通卡片关闭时去掉小朋友样式
  $("#card").addEventListener("click", (e) => { if (e.target.closest(".x")) $("#card").classList.remove("k-card"); });

  const kb = $("#kidsBtn");
  if (kb) { kb.textContent = L("🧒 小朋友", "🧒 Kids"); kb.title = L("小朋友模式：找地方、集贴纸", "Kids mode: find places, collect stickers"); kb.addEventListener("click", () => (K.on ? exit() : enter())); }

  // 更大的点击区域
  function hits() {
    document.querySelectorAll("#map .pl .sc").forEach((s) => {
      if (s.querySelector(".khit")) return;
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle"); c.setAttribute("r", "15"); c.setAttribute("class", "khit"); s.insertBefore(c, s.firstChild);
    });
  }
  setTimeout(hits, 0);

  const K = { on: false, enter, exit, place: onPlace, char: onChar, journey: onJourney, QUEST };
  window.ME_KIDS = K;
  if (new URLSearchParams(location.search).get("kids") === "1") setTimeout(() => { const i = $("#intro"); if (i) { i.classList.add("gone"); i.hidden = true; } enter(); }, 300);
})();
