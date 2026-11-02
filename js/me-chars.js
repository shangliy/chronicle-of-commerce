/* 中洲纪年 · Q 版人物与迁徙（原创造型，用参数拼出来的小人，不模仿任何电影形象）
 * look: s 肤色 h 发色 hs 发型(short/curly/long/longs/bald) b 胡子(short/long/braid) bc 胡色
 *       hat(wizard/crown/circlet/helm/hood/tall/darkhelm) hc 帽色 c 斗篷 t 内衣 it 手持(staff/sword/bow/axe/spear/star/harp/pipe/shield/pack/ring)
 *       ic 手持物颜色 ear 尖耳 feet:"bare" 赤脚 wide 粗壮 sz 缩放 plume 盔缨 fl 发间花 sp 特殊造型
 */
(function () {
  const { FA, SA, TA, FO } = window.ME_T, D = window.ME;
  const HOB = { feet: "bare", ear: 1, sz: 0.86, hs: "curly" }, ELF = { ear: 1, hs: "longs", sz: 1.04 }, DW = { wide: 1, sz: 0.9, b: "braid" };
  const C = (o, base) => Object.assign({}, base || {}, o);

  const CHARS = [
    /* ——霍比特人—— */
    { id: "frodo", n: "弗罗多", en: "Frodo Baggins", r: "hob", look: C({ h: "#3a2414", c: "#6e7a5a", t: "#d8c8a0", it: "sword", ic: "#9fd8ff" }, HOB),
      bio: "比尔博的继承人。接下至尊戒，从夏尔一路走到末日火山。回来以后，伤口一直没有好，最后随精灵西渡。",
      homes: [["hobbiton", TA(2989), TA(3018, 9, 23)], ["hobbiton", TA(3019, 11, 3), TA(3021, 9, 22)]] },
    { id: "sam", n: "山姆", en: "Samwise Gamgee", r: "hob", look: C({ h: "#a0703a", c: "#7a5a3a", t: "#e0d0a8", it: "pack" }, HOB),
      bio: "袋底洞的园丁。全程没有离开弗罗多，在火山的斜坡上把他背了上去。后来当了七届夏尔镇长。",
      homes: [["hobbiton", TA(3021, 10, 1), FO(61.7)]] },
    { id: "merry", n: "梅里", en: "Meriadoc Brandybuck", r: "hob", look: C({ h: "#8a5a2a", c: "#3e6a3a", t: "#e0c890", it: "sword" }, HOB),
      bio: "雄鹿地的少爷，心思缜密。跟着洛汗大军上了帕兰诺平原，和伊奥温一起击倒了巫王。",
      homes: [["buckland", TA(3001), TA(3018, 9, 25)]] },
    { id: "pippin", n: "皮平", en: "Peregrin Took", r: "hob", look: C({ h: "#b07a3a", c: "#5a7a8a", t: "#e8d8b0" }, HOB),
      bio: "图克家最闹腾的一个。闯过祸，也立过功：在米那斯提力斯当了城卫，救下了法拉米尔。",
      homes: [[[300, 264], TA(3001), TA(3018, 9, 23), "塔克镇"]] },
    { id: "bilbo", n: "比尔博", en: "Bilbo Baggins", r: "hob", look: C({ h: "#6a4a2a", c: "#8a3a2a", t: "#e8d8a8", it: "pipe" }, HOB),
      bio: "被甘道夫“推出门”的体面霍比特人。在山洞里赢下猜谜，捡到一枚戒指，也捡到了往后六十年的故事。",
      homes: [["hobbiton", TA(2942, 6, 22), TA(3001, 9, 22)], ["rivendell", TA(3002), TA(3021, 9, 20)]] },
    { id: "gollum", n: "咕噜", en: "Gollum · Sméagol", r: "hob", look: { sp: "gollum" },
      bio: "曾经叫斯米戈尔，为了戒指杀了朋友，在山根下躲了近五百年。最后，恰恰是他让戒指落进了火里。",
      homes: [["gollumcave", TA(2470), TA(2944)]] },
    { id: "marcho", n: "马丘与布兰寇", en: "Marcho & Blanco", r: "hob", look: C({ h: "#7a4a2a", c: "#8a7a4a", t: "#d8c090", it: "pack" }, HOB),
      bio: "带领霍比特人越过白兰地河、在夏尔定居的两兄弟。夏尔纪年就从这一年算起。",
      homes: [["hobbiton", TA(1601), TA(1660)]] },

    /* ——精灵—— */
    { id: "finwe", n: "芬威", en: "Finwë", r: "elf", look: C({ h: "#2a2a3a", hat: "circlet", hc: "#e0b440", c: "#3a4a7a", t: "#c8c0e0" }, ELF),
      bio: "诺多族的第一位王，率族人从库维因恩西行到阿门洲。后来死在魔苟斯手里，这是一切仇恨的开始。",
      homes: [["tirion", -385, -60], ["formenos", -60, -40]] },
    { id: "feanor", n: "费艾诺", en: "Fëanor", r: "elf", look: C({ h: "#151515", hat: "circlet", hc: "#e0b440", c: "#9a2a1a", t: "#3a1a1a", it: "star", ic: "#fffbe0" }, ELF),
      bio: "最伟大的精灵工匠，精灵宝钻是他造的。立下可怕的誓言，烧掉了船，踏上中洲没多久就战死了。",
      homes: [["tirion", -300, -60], ["formenos", -60, -10]] },
    { id: "fingolfin", n: "芬国昐", en: "Fingolfin", r: "elf", look: C({ h: "#151515", hat: "helm", hc: "#d8dde2", c: "#2a4a8a", t: "#c0c8e0", it: "sword" }, ELF),
      bio: "被费艾诺抛在对岸，带族人硬是走过了冰峡。最后一个人骑马到安格班门前，单挑魔苟斯。",
      homes: [["tirion", -385, -7.5], ["eithel", FA(1), FA(456)]] },
    { id: "maedhros", n: "梅斯罗斯", en: "Maedhros", r: "elf", look: C({ h: "#b0402a", c: "#7a2a2a", t: "#d8b0a0", it: "sword" }, ELF),
      bio: "费艾诺的长子，被吊在桑戈洛锥姆的悬崖上，被芬巩救下，从此只剩一只手。守着希姆凛的东方防线。",
      homes: [["himring", FA(60), FA(472)]] },
    { id: "thingol", n: "庭葛", en: "Thingol · Elwë", r: "elf", look: C({ h: "#dfe4ea", hat: "crown", hc: "#e8ecf0", c: "#5a6a8a", t: "#e0e4f0" }, ELF),
      bio: "原本带着帖勒瑞族西行，在南埃尔莫斯的林子里遇见美丽安，一站就是许多年，从此留在中洲做了灰精灵的王。",
      homes: [["nanelmoth", -420, -380], ["menegroth", -380, FA(503)]] },
    { id: "melian", n: "美丽安", en: "Melian the Maia", r: "maia", look: C({ h: "#2a1a3a", hs: "long", c: "#4a3a6a", t: "#b8a8d8", it: "star", ic: "#e0d0ff" }),
      bio: "迈雅，夜莺环绕的歌者。她织出的“环带”护住多瑞亚斯几百年。",
      homes: [["menegroth", -380, FA(503)]] },
    { id: "luthien", n: "露西恩", en: "Lúthien", r: "elf", look: C({ h: "#141428", hs: "long", c: "#3a4a7a", t: "#6a7ab0", fl: 1 }, ELF),
      bio: "庭葛与美丽安的女儿，世上最美的人。和凡人贝伦一起闯进安格班，从魔苟斯的王冠上挖下一颗宝钻。",
      homes: [["menegroth", -300, FA(465)], ["tolgalen", FA(467), FA(503)]] },
    { id: "finrod", n: "芬罗德", en: "Finrod Felagund", r: "elf", look: C({ h: "#e0c060", hat: "crown", hc: "#e0b440", c: "#3a6a8a", t: "#e0d8b0", it: "harp" }, ELF),
      bio: "纳国斯隆德之王，第一个和人类交朋友的精灵。为了兑现对贝伦父亲的誓言，死在索隆的地牢里。",
      homes: [["nargothrond", FA(102), FA(465)]] },
    { id: "turgon", n: "特刚", en: "Turgon", r: "elf", look: C({ h: "#151515", hat: "crown", hc: "#e8ecf0", c: "#e8e8f0", t: "#b8c4d0", it: "sword" }, ELF),
      bio: "隐匿之城刚多林的王。把城藏了四百年，最终还是被出卖。",
      homes: [["gondolin", FA(116), FA(510)]] },
    { id: "idril", n: "伊缀尔", en: "Idril", r: "elf", look: C({ h: "#e8c860", hs: "long", c: "#ecebf4", t: "#c8d0e8" }, ELF),
      bio: "特刚的女儿，嫁给了凡人图奥。她预先挖好的密道，让刚多林的一部分人逃了出来。",
      homes: [["gondolin", FA(116), FA(510)]] },
    { id: "earendil", n: "埃雅仁迪尔", en: "Eärendil", r: "elf", look: C({ h: "#e8c860", hs: "short", c: "#2a5a8a", t: "#d8e0e8", it: "star", ic: "#fffbe0" }, ELF),
      bio: "图奥与伊缀尔的儿子，半精灵的航海家。带着宝钻驶到西方，替中洲求来援军，后来成了天上的晨星。",
      homes: [["sirionhavens", FA(511), FA(542)], ["tirion", FA(543), FA(560)]] },
    { id: "elwing", n: "埃尔汶", en: "Elwing", r: "elf", look: C({ h: "#2a1a1a", hs: "long", c: "#d8e4ec", t: "#a8c0d0" }, ELF),
      bio: "迪奥的女儿，露西恩的孙女。宁愿抱着宝钻投海也不交出去，化作白鸟飞到丈夫的船上。",
      homes: [["sirionhavens", FA(511), FA(542)]] },
    { id: "gilgalad", n: "吉尔-加拉德", en: "Gil-galad", r: "elf", look: C({ h: "#2a2a3a", hat: "helm", hc: "#e8ecf0", c: "#2a4a7a", t: "#c8d4e8", it: "spear", ic: "#ffffff" }, ELF),
      bio: "诺多族在中洲的最后一位至高王。与埃兰迪尔结成最后联盟，死在巴拉督尔的山坡上。",
      homes: [["mithlond", 591, SA(3430)]] },
    { id: "cirdan", n: "奇尔丹", en: "Círdan", r: "elf", look: C({ h: "#e8e8ec", b: "short", bc: "#e8e8ec", c: "#3a6a7a", t: "#c8dce0" }, ELF),
      bio: "造船者，留着胡子的精灵。守着灰港几千年，看着每一艘船向西开走。",
      homes: [["mithlond", 591, FO(62)]] },
    { id: "elrond", n: "埃尔隆德", en: "Elrond", r: "elf", look: C({ h: "#151515", hat: "circlet", hc: "#dfe4ea", c: "#6a2a3a", t: "#d8c0c8" }, ELF),
      bio: "埃雅仁迪尔的儿子、幽谷之主。护戒同盟就是在他家里组成的。",
      homes: [["rivendell", 2287, TA(3021, 9, 20)]] },
    { id: "galadriel", n: "凯兰崔尔", en: "Galadriel", r: "elf", look: C({ h: "#f0d070", c: "#f2f2f6", t: "#e0e4ee", it: "star", ic: "#e8f4ff" }, ELF),
      bio: "罗斯洛立安的夫人，经历过双圣树之光的最后几位精灵之一。拒绝了至尊戒，于是“甘愿衰减，西渡而去”。",
      homes: [["tirion", -385, -10], ["lorien", TA(1981), TA(3021, 9, 15)], ["avallone", TA(3021, 10, 12), FO(123)]] },
    { id: "thranduil", n: "瑟兰迪尔", en: "Thranduil", r: "elf", look: C({ h: "#f0e0a0", hat: "crown", hc: "#a0602a", c: "#8a4a2a", t: "#e0c890" }, ELF),
      bio: "黑森林北部的林地王国之王，莱戈拉斯的父亲。抓过索林一行，也在五军之战并肩作战。",
      homes: [["thranduil", TA(1), FO(123)]] },
    { id: "legolas", n: "莱戈拉斯", en: "Legolas", r: "elf", look: C({ h: "#f0d890", c: "#4a6a3a", t: "#c8d0a0", it: "bow" }, ELF),
      bio: "护戒同盟里的精灵，眼神最好的弓箭手。和矮人金雳成了一辈子的朋友，最后一起乘船西去。",
      homes: [["thranduil", TA(2930), TA(3018, 10, 1)]] },
    { id: "arwen", n: "亚玟", en: "Arwen", r: "elf", look: C({ h: "#151515", hs: "long", hat: "circlet", hc: "#dfe4ea", c: "#5a3a6a", t: "#b8a8c8" }, ELF),
      bio: "埃尔隆德的女儿，为阿拉贡选择了凡人的命运。",
      homes: [["rivendell", TA(2952), TA(3019, 5, 1)], ["minastirith", TA(3019, 7, 1), FO(121)]] },

    /* ——人类—— */
    { id: "beor", n: "比奥", en: "Bëor the Old", r: "man", look: { h: "#6a5a4a", b: "short", bc: "#a8a8a0", c: "#6a5a3a", t: "#c8b890", it: "staff", ic: "#6a4a2a" },
      bio: "第一批翻过蓝色山脉进入贝烈瑞安德的人类首领，被芬罗德在林中营火旁发现。",
      homes: [[[-230, 110], FA(316), FA(355), "埃斯托拉德"]] },
    { id: "beren", n: "贝伦", en: "Beren", r: "man", look: { h: "#3a2a1a", b: "short", bc: "#3a2a1a", c: "#4a5a3a", t: "#c8b890", it: "sword" },
      bio: "比奥家族的后代。为了娶露西恩，接下一个不可能的聘礼——魔苟斯王冠上的一颗宝钻。",
      homes: [["tolgalen", FA(467), FA(503)]] },
    { id: "turin", n: "图林", en: "Túrin Turambar", r: "man", look: { h: "#151515", hs: "long", hat: "helm", hc: "#b09040", c: "#2a2a2a", t: "#5a5a5a", it: "sword", ic: "#1a1a1a" },
      bio: "被诅咒的英雄。走到哪里，灾祸就跟到哪里。最后杀死巨龙格劳龙，也杀死了自己。" },
    { id: "tuor", n: "图奥", en: "Tuor", r: "man", look: { h: "#e0c060", c: "#3a5a7a", t: "#d8d0b0", it: "axe" },
      bio: "图林的堂弟。受水神乌欧牟指引找到刚多林，又带着妻儿从陷落的城里逃了出来。" },
    { id: "elros", n: "埃尔洛斯", en: "Elros Tar-Minyatur", r: "man", look: { h: "#151515", hat: "crown", hc: "#e8ecf0", c: "#2a3a6a", t: "#c8d0e8" },
      bio: "埃尔隆德的孪生兄弟，选择做人类，成为努门诺尔的第一位国王，活了五百岁。",
      homes: [["armenelos", SA(32), SA(442)]] },
    { id: "pharazon", n: "阿尔-法拉宗", en: "Ar-Pharazôn", r: "man", look: { h: "#151515", hat: "crown", hc: "#e0b440", c: "#6a1a1a", t: "#c8a040" },
      bio: "努门诺尔最后、也最骄傲的国王。俘虏了索隆，又被索隆说动去攻打不死之地，整座岛因此沉入大海。",
      homes: [["armenelos", SA(3255), SA(3319)]] },
    { id: "elendil", n: "埃兰迪尔", en: "Elendil", r: "man", look: { h: "#3a2a1a", b: "short", bc: "#3a2a1a", hat: "circlet", hc: "#e8ecf0", c: "#2a3a5a", t: "#c0c8d8", it: "sword" },
      bio: "努门诺尔“忠贞派”的领袖，带九艘船逃出覆灭的岛，在中洲建立阿尔诺与刚铎。",
      homes: [["annuminas", SA(3320), SA(3430)]] },
    { id: "isildur", n: "伊熙尔杜", en: "Isildur", r: "man", look: { h: "#2a1a1a", hat: "helm", hc: "#d8dde2", c: "#2a3a5a", t: "#c0c8d8", it: "sword" },
      bio: "埃兰迪尔的长子。用断剑砍下索隆手上的戒指，却没舍得把它扔进火里。",
      homes: [["minasmorgul", SA(3320), SA(3429)]] },
    { id: "anarion", n: "阿纳瑞安", en: "Anárion", r: "man", look: { h: "#3a2a1a", hat: "helm", hc: "#d8dde2", c: "#3a4a6a", t: "#c0c8d8", it: "spear" },
      bio: "埃兰迪尔的次子，镇守米那斯阿诺尔。在巴拉督尔被围的第七年，被城上落石击中。",
      homes: [["minastirith", SA(3320), SA(3429)]] },
    { id: "eorl", n: "埃奥尔", en: "Eorl the Young", r: "man", look: { h: "#e0c060", hs: "long", hat: "helm", hc: "#d8dde2", plume: "#f4f4f4", c: "#3a6a2a", t: "#c8a040", it: "spear" },
      bio: "北方骑马民族的少年首领。听见刚铎的求援，七千骑兵连夜南下，换来了后来的洛汗。" },
    { id: "aragorn", n: "阿拉贡", en: "Aragorn · Strider", r: "man", look: { h: "#3a2a1a", hs: "long", b: "short", bc: "#3a2a1a", c: "#4a4a3a", t: "#8a7a5a", it: "sword" },
      bio: "布理人叫他“大步佬”。伊熙尔杜的后裔，做了几十年游侠，才回来认领自己的王冠。",
      homes: [["minastirith", TA(3019, 5, 1), FO(120)]], homeLook: "elessar" },
    { id: "boromir", n: "波洛米尔", en: "Boromir", r: "man", look: { h: "#7a4a2a", b: "short", bc: "#7a4a2a", c: "#5a1a1a", t: "#a88a6a", it: "shield", ic: "#5a1a1a" },
      bio: "刚铎宰相的长子，勇敢、骄傲。在阿蒙汉没能抵住戒指的诱惑，随后为保护霍比特人战死。",
      homes: [["minastirith", TA(3000), TA(3018, 7, 1)]] },
    { id: "faramir", n: "法拉米尔", en: "Faramir", r: "man", look: { h: "#7a4a2a", c: "#3a5a3a", t: "#8a9a6a", it: "bow" },
      bio: "波洛米尔的弟弟。在汉奈斯安努恩放走了弗罗多——他说，就算魔戒躺在路边，他也不会去捡。",
      homes: [["henneth", TA(3018), TA(3019, 3, 10)]] },
    { id: "denethor", n: "德内梭尔", en: "Denethor II", r: "man", look: { h: "#c8c8c8", c: "#1a1a1a", t: "#4a4a4a" },
      bio: "刚铎的宰相，用真知晶石看了太久索隆想让他看的东西，在最黑暗的一天绝望地自焚。",
      homes: [["minastirith", TA(2984), TA(3019, 3, 15)]] },
    { id: "theoden", n: "希奥顿", en: "Théoden", r: "man", look: { h: "#e8e0c8", hs: "long", b: "long", bc: "#e8e0c8", hat: "crown", hc: "#e0b440", c: "#3a6a2a", t: "#c8a040", it: "sword" },
      bio: "洛汗国王。被萨鲁曼的蛊惑困了多年，醒来以后亲自带队冲进了帕兰诺平原。",
      homes: [["edoras", TA(2980), TA(3019, 3, 2)]] },
    { id: "eomer", n: "伊奥梅尔", en: "Éomer", r: "man", look: { h: "#d0a050", b: "short", bc: "#d0a050", hat: "helm", hc: "#d8dde2", plume: "#f4f4f4", c: "#3a6a2a", t: "#c8a040", it: "spear" },
      bio: "希奥顿的外甥，后来的洛汗国王。",
      homes: [["edoras", TA(3019, 8, 1), FO(63)]] },
    { id: "eowyn", n: "伊奥温", en: "Éowyn", r: "man", look: { h: "#f0d070", hs: "longs", c: "#5a7a5a", t: "#e0e4d0", it: "sword" },
      bio: "洛汗的公主，不甘被留在后方，化名德恩海姆随军出征，砍下了“没有男人能杀死”的巫王。",
      homes: [["edoras", TA(3000), TA(3019, 3, 2)]] },
    { id: "bard", n: "巴德", en: "Bard the Bowman", r: "man", look: { h: "#2a1a1a", c: "#3a3a3a", t: "#7a6a5a", it: "bow" },
      bio: "长湖镇的弓手，用最后一支黑箭射穿了史矛革。之后重建河谷城，做了国王。",
      homes: [["esgaroth", TA(2920), TA(2941, 11, 1)], ["dale", TA(2944), TA(2977)]] },
    { id: "beorn", n: "贝奥恩", en: "Beorn", r: "man", look: { h: "#2a1a10", b: "long", bc: "#2a1a10", c: "#6a4a2a", t: "#a88a5a", wide: 1, sz: 1.15 },
      bio: "能变成大黑熊的换皮人，住在卡尔岩附近，养蜂、养马，不喜欢客人——但收留了索林一行。",
      homes: [[[612, 216], TA(2930), TA(3000), "贝奥恩的木屋"]] },

    /* ——矮人—— */
    { id: "durin", n: "都林", en: "Durin's line", r: "dwarf", look: C({ h: "#8a8a8a", bc: "#d0d0d0", hat: "crown", hc: "#e0b440", c: "#3a3a6a", t: "#8a8aa8", it: "axe" }, DW),
      bio: "长须族的始祖，传说会一次次转世为王。他的子孙在卡扎督姆住了几千年，直到挖醒了地下的炎魔。",
      homes: [["moria", FA(1), TA(1980)]] },
    { id: "thrain", n: "索恩", en: "Thráin II", r: "dwarf", look: C({ h: "#7a5a3a", bc: "#7a5a3a", hat: "hood", hc: "#5a4a3a", c: "#5a4a3a", t: "#9a8a6a" }, DW),
      bio: "索林的父亲。孤山被夺后带族人流亡，最后被关进多古尔都，死前把地图和钥匙交给了甘道夫。" },
    { id: "thorin", n: "索林", en: "Thorin Oakenshield", r: "dwarf", look: C({ h: "#151515", bc: "#151515", hat: "hood", hc: "#4a7ab0", c: "#2a3a5a", t: "#8a8aa0", it: "sword", ic: "#9fe0ff" }, DW),
      bio: "流亡的矮人王子。带着十二个同伴和一个霍比特人去夺回孤山，赢回了家园，却没能活着坐上王座。",
      homes: [[[230, 170], TA(2802), TA(2941, 4, 20), "蓝色山脉"]] },
    { id: "gimli", n: "金雳", en: "Gimli", r: "dwarf", look: C({ h: "#a0402a", bc: "#a0402a", hat: "helm", hc: "#a9b0b8", c: "#6a4a2a", t: "#a88a6a", it: "axe" }, DW),
      bio: "护戒同盟里的矮人。向凯兰崔尔要了一根头发，当作一辈子的珍宝。",
      homes: [["erebor", TA(2942), TA(3018, 10, 1)]] },
    { id: "dain", n: "戴因", en: "Dáin Ironfoot", r: "dwarf", look: C({ h: "#b05a2a", bc: "#b05a2a", hat: "helm", hc: "#a9b0b8", c: "#5a3a2a", t: "#9a7a5a", it: "axe" }, DW),
      bio: "铁丘陵的矮人领主，五军之战后成为山下之王。魔戒大战时战死在孤山门前。",
      homes: [[[904, 100], TA(2799), TA(2941, 11, 20), "铁丘陵"], ["erebor", TA(2941, 12, 1), TA(3019, 3, 17)]] },

    /* ——迈雅与巫师—— */
    { id: "gandalf", n: "甘道夫", en: "Gandalf the Grey", r: "maia", look: { h: "#c8c8c8", b: "long", bc: "#dcdcdc", hat: "wizard", hc: "#8a8a8a", c: "#8a8a8a", t: "#a8a8a8", it: "staff", ic: "#dddddd" },
      bio: "灰袍巫师，霍比特人最好的朋友。在卡扎督姆的桥上挡住炎魔，一起坠入深渊。" },
    { id: "gandalfw", n: "白袍甘道夫", en: "Gandalf the White", r: "maia", look: { h: "#f4f4f4", b: "long", bc: "#ffffff", c: "#f4f4f6", t: "#e4e4ea", it: "staff", ic: "#ffffff" },
      bio: "从死亡中被送回来的甘道夫，换了白袍，取代了堕落的萨鲁曼。骑着捷影奔走于各条战线。" },
    { id: "saruman", n: "萨鲁曼", en: "Saruman", r: "maia", look: { h: "#ececec", hs: "long", b: "long", bc: "#ececec", c: "#e4e4ea", t: "#c8c8d0", it: "staff", ic: "#1a1a1a" },
      bio: "白袍巫师，巫师会的领袖。研究敌人太久，终于想成为敌人。",
      homes: [["isengard", TA(2759), TA(3019, 8, 15)]] },
    { id: "radagast", n: "拉达加斯特", en: "Radagast", r: "maia", look: { h: "#8a7a5a", b: "long", bc: "#8a7a5a", hat: "wizard", hc: "#6a5a2a", c: "#6a5a2a", t: "#8a7a4a", it: "staff", ic: "#6a8a3a" },
      bio: "褐袍巫师，跟鸟兽说话比跟人说话多。住在黑森林边的罗斯戈贝尔。",
      homes: [[[634, 262], TA(1050), TA(3018, 7, 1), "罗斯戈贝尔"]] },
    { id: "tom", n: "汤姆·邦巴迪尔", en: "Tom Bombadil", r: "maia", look: { h: "#7a4a2a", b: "short", bc: "#7a4a2a", hat: "tall", hc: "#2a4a8a", c: "#2a4a8a", t: "#d8b030", feet: "boots" },
      bio: "老林子里唱着歌的“最年长者”。至尊戒对他没有任何作用。没人说得清他到底是谁。",
      homes: [[[350, 270], -600, FO(123), "老林子"]] },
    { id: "treebeard", n: "树须", en: "Treebeard", r: "maia", look: { sp: "ent" },
      bio: "范贡森林的树人，中洲最古老的生灵之一。说话很慢，发起火来能把艾森加德的墙推倒。",
      homes: [[[552, 438], -600, FO(123), "范贡森林"]] },

    /* ——黑暗势力—— */
    { id: "morgoth", n: "魔苟斯", en: "Morgoth", r: "dark", look: { sp: "morgoth" },
      bio: "原名米尔寇，最强大的维拉，也是第一个黑暗魔君。偷走精灵宝钻，在安格班盘踞了一整个纪元。",
      homes: [["twotrees", -300, -40], ["angband", -6, 587]] },
    { id: "sauron", n: "索隆", en: "Sauron", r: "dark", look: { sp: "sauron" },
      bio: "魔苟斯的副手，后来的黑暗魔君。化名“赠礼之主”骗精灵铸戒，又暗中铸了统御一切的至尊戒。",
      homes: [["baraddur", SA(1000), SA(3262)], ["armenelos", SA(3262), SA(3319)], ["baraddur", SA(3320), SA(3441)], ["dolguldur", TA(1050), TA(2941)]] },
    { id: "eye", n: "索隆之眼", en: "The Eye", r: "dark", look: { sp: "eye" },
      bio: "失去至尊戒的索隆没有了形体，只剩塔顶一只燃烧的眼睛，日夜盯着中洲。",
      homes: [["baraddur", TA(2951), TA(3019, 3, 25)]] },
    { id: "witchking", n: "巫王", en: "The Witch-king", r: "dark", look: { sp: "wraith", crown: 1 },
      bio: "九戒灵之首，曾是安格玛的巫王，亲手灭掉了北方王国。预言说，没有男人能杀死他。",
      homes: [["carndum", TA(1300), TA(1975)], ["minasmorgul", TA(2002), TA(3018, 6, 20)], ["minasmorgul", TA(3018, 11, 1), TA(3019, 3, 10)]] },
    { id: "nazgul", n: "戒灵", en: "Nazgûl", r: "dark", look: { sp: "wraith" },
      bio: "九个被人类之戒吞噬的国王，变成了既不活也不死的影子。",
      homes: [["baraddur", SA(2251), SA(3441)]] },
    { id: "smaug", n: "史矛革", en: "Smaug", r: "dark", look: { sp: "dragon", c: "#b0342a", c2: "#e0a040" },
      bio: "中洲最后的大火龙。占了孤山，在金子堆上睡了一百七十年。",
      homes: [["erebor", TA(2770.05), 6972.82]] },
    { id: "glaurung", n: "格劳龙", en: "Glaurung", r: "dark", look: { sp: "dragon", c: "#c9a23a", c2: "#7a5a1a" },
      bio: "龙之父，没有翅膀的金色大蛇。用眼神给图林和妮诺尔下了咒。",
      homes: [["angband", FA(260), FA(495)], ["nargothrond", FA(495.9), FA(500.9)]] },
    { id: "balrog", n: "炎魔", en: "Durin's Bane", r: "dark", look: { sp: "balrog" },
      bio: "魔苟斯麾下火与影的恶魔。在迷雾山脉的深处睡了几千年，被贪心挖秘银的矮人吵醒。",
      homes: [["moria", TA(1980), TA(3019, 1, 15)]] },
    { id: "shelob", n: "希洛布", en: "Shelob", r: "dark", look: { sp: "spider" },
      bio: "远古巨蜘蛛的后代，盘踞在西力斯昂哥的隘道里，什么光都吞。",
      homes: [["ciritungol", TA(1), TA(3019, 3, 13)]] }
  ];

  /* ——迁徙与新增旅程（pts 第三项："ship" 乘船、"ride" 骑马、"gap" 不可见）—— */
  const MORE = [
    { id: "greatjourney", n: "精灵大迁徙", c: "#3f6d8c", mig: 1, who: ["finwe", "thingol"], whoAt: [[-419, ["finwe"]]],
      pts: [[[990, 300], -470], [[760, 250], -455], [[580, 210], -445], [[340, 250], -432], ["nanelmoth", -420], [[-300, 300], -405], [[-600, 300], -392], [[-760, 330], -388, "ship"], ["alqualonde", -385, "ship"]] },
    { id: "feanor", n: "费艾诺渡海", c: "#9a2a1a", who: ["feanor"], pts: [["alqualonde", -10], [[-880, 110], -9, "ship"], ["losgar", -8, "ship"], [[-470, 40], -4]] },
    { id: "edain", n: "比奥一族东来", c: "#7a5a3a", mig: 1, who: ["beor"], pts: [[[260, 140], FA(305)], [[170, 190], FA(308)], [[40, 250], FA(310)], [[-120, 200], FA(313)], [[-230, 110], FA(316)]] },
    { id: "beren", n: "贝伦的远征", c: "#4a6a3a", who: ["beren"], whoAt: [[FA(465.4), ["beren", "luthien"]]],
      pts: [[[-230, 110], FA(460)], [[-220, 175], FA(464)], ["menegroth", FA(464.5)], ["nargothrond", FA(465)], [[-352, 60], FA(465.4)], [[-300, 0], FA(465.7)], ["angband", FA(466)], ["menegroth", FA(466.5)]] },
    { id: "turin", n: "图林的流浪", c: "#3a3a3a", who: ["turin"], pts: [[[-520, 90], FA(473)], ["menegroth", FA(474)], [[-380, 260], FA(486)], ["nargothrond", FA(490)], [[-520, 90], FA(496)], ["cabed", FA(499)], ["cabed", FA(501)]] },
    { id: "tuor", n: "图奥寻找刚多林", c: "#3a5a7a", who: ["tuor"], pts: [[[-560, 110], FA(495)], [[-620, 240], FA(495.6)], ["gondolin", FA(496)]] },
    { id: "gondolinfall", n: "刚多林的逃亡", c: "#8a8aa8", mig: 1, who: ["tuor", "idril", "earendil"], pts: [["gondolin", FA(510)], [[-330, 300], FA(510.4)], ["sirionhavens", FA(511)]] },
    { id: "earendilsail", n: "埃雅仁迪尔西航", c: "#2a5a8a", who: ["earendil", "elwing"], pts: [["sirionhavens", FA(542)], [[-600, 480], FA(542.4), "ship"], [[-820, 380], FA(542.8), "ship"], ["tirion", FA(543)]] },
    { id: "tonumenor", n: "伊甸人航向努门诺尔", c: "#2e5a7a", mig: 1, who: ["elros"], pts: [[[150, 320], SA(31)], [[-150, 520], SA(31.5), "ship"], ["armenelos", SA(32), "ship"]] },
    { id: "hobbitswest", n: "霍比特人西迁", c: "#5f7a33", mig: 1, who: ["marcho"], pts: [[[600, 262], TA(1050)], [[540, 240], TA(1100)], [[480, 232], TA(1150)], [[420, 252], TA(1300)], ["bree", TA(1350)], ["hobbiton", TA(1601)]] },
    { id: "durinfolk", n: "都林子民流亡", c: "#6a5a3c", mig: 1, who: ["thrain", "thorin"], pts: [["erebor", TA(2770.1)], [[700, 200], TA(2775)], [[600, 240], TA(2790)], ["azanulbizar", TA(2799)], [[470, 420], TA(2800)], [[230, 170], TA(2802)]] },
    { id: "smaugcome", n: "史矛革南下", c: "#b0342a", who: ["smaug"], pts: [[[720, -10], TA(2770)], ["erebor", TA(2770.05)]] },
    { id: "smaugfall", n: "史矛革袭击长湖镇", c: "#b0342a", who: ["smaug"], pts: [["erebor", 6972.82], ["esgaroth", 6972.83]] },
    { id: "nazgulhunt", n: "九骑手", c: "#1a1a1a", who: ["witchking", "nazgul"], mode: "ride",
      pts: [["minasmorgul", TA(3018, 6, 20)], [[640, 430], TA(3018, 7, 10)], ["isengard", TA(3018, 9, 18)], [[400, 320], TA(3018, 9, 21)], ["hobbiton", TA(3018, 9, 23)], ["bree", TA(3018, 9, 30)], ["weathertop", TA(3018, 10, 6)], [[498, 252], TA(3018, 10, 20)]] },
    { id: "ents", n: "树人进军", c: "#5a6a2a", mig: 1, who: ["treebeard"], pts: [[[552, 438], TA(3019, 3, 2)], ["isengard", TA(3019, 3, 3)]] },
    { id: "westward", n: "西渡", c: "#6a8aa8", who: ["frodo", "sam"], whoAt: [[TA(3021, 9, 25), ["frodo", "sam", "bilbo", "elrond", "galadriel"]], [TA(3021, 9, 29.5), ["frodo", "bilbo", "gandalfw", "elrond", "galadriel"]]],
      pts: [["hobbiton", TA(3021, 9, 22)], [[252, 248], TA(3021, 9, 27)], ["mithlond", TA(3021, 9, 29)], [[-200, 300], TA(3021, 10, 6), "ship"], ["avallone", TA(3021, 10, 12), "ship"]] },
    { id: "samwest", n: "山姆西去", c: "#7a5a3a", who: ["sam"], pts: [["hobbiton", FO(61.7)], ["mithlond", FO(61.75)], ["avallone", FO(62), "ship"]] },
    { id: "lastship", n: "莱戈拉斯与金雳出海", c: "#4a6a3a", who: ["legolas", "gimli"], pts: [[[704, 560], FO(120)], ["pelargir", FO(120.3), "ship"], [[300, 700], FO(120.6), "ship"], ["avallone", FO(121), "ship"]] }
  ];

  /* ——给已有旅程配上人物—— */
  const J = (id) => D.JOURNEYS.find((j) => j.id === id);
  const set = (id, o) => Object.assign(J(id), o);
  set("fingolfin", { who: ["fingolfin"], mig: 1, pts: [[[-930, -30], -7.5], [[-860, -96], -6], [[-760, -100], -4.5], [[-700, -96], -3.5], [[-660, -40], -2], [[-610, 10], FA(1)]] });
  set("elendil", { who: ["elendil"], mode: "ship" });
  set("isildur", { who: ["isildur", "anarion"], mode: "ship" });
  set("alliance", { who: ["gilgalad", "elendil", "elrond", "isildur"], mig: 1 });
  set("eorl", { who: ["eorl"], mode: "ride", mig: 1 });
  set("bilbo", { who: ["bilbo", "thorin", "gandalf"], whoAt: [[TA(2941, 8, 25), ["bilbo", "thorin"]], [TA(2941, 11, 30), ["bilbo", "gandalf"]]] });
  set("frodo", { who: ["frodo", "sam", "merry", "pippin"], whoAt: [
    [TA(3018, 9, 29), ["frodo", "sam", "merry", "pippin", "aragorn"]],
    [TA(3018, 12, 25), ["frodo", "sam", "gandalf", "aragorn", "legolas", "gimli", "boromir", "merry", "pippin"]],
    [TA(3019, 1, 15), ["frodo", "sam", "aragorn", "legolas", "gimli", "boromir", "merry", "pippin"]],
    [TA(3019, 2, 26), ["frodo", "sam"]], [TA(3019, 2, 29), ["frodo", "sam", "gollum"]], [TA(3019, 3, 13), ["frodo", "sam"]]] });
  J("frodo").pts.forEach((p) => { if (p[1] > TA(3019, 2, 16) && p[1] <= TA(3019, 2, 26)) p[2] = "ship"; });
  set("aragorn", { who: ["aragorn", "legolas", "gimli"] });
  J("aragorn").pts.forEach((p) => { if (p[1] > TA(3019, 3, 2) && p[1] <= TA(3019, 3, 13)) p[2] = "ride"; else if (p[1] > TA(3019, 3, 13) && p[1] <= TA(3019, 3, 15)) p[2] = "ship"; else if (p[1] > TA(3019, 3, 18)) p[2] = "ride"; });
  set("merry", { who: ["merry", "pippin"], whoAt: [[TA(3019, 3, 5.5), ["merry"]], [TA(3019, 3, 9), ["theoden", "eowyn", "merry"]]] });
  J("merry").pts.forEach((p) => { if (p[1] > TA(3019, 3, 5)) p[2] = "ride"; });
  // 甘道夫：灰袍随护戒同盟走到卡扎督姆；这里只画白袍归来之后
  set("gandalf", { n: "白袍甘道夫与捷影", c: "#9a9a9a", who: ["gandalfw"], whoAt: [[TA(3019, 3, 5.5), ["gandalfw", "pippin"]]], mode: "ride", pts: J("gandalf").pts.filter((p) => p[1] >= TA(3019, 3, 1)).map((p, i) => (i ? [p[0], p[1]] : [p[0], p[1]])) });
  D.JOURNEYS.push(...MORE);

  /* ——地点补丁：巴拉督尔在第三纪元重建—— */
  const bd = D.PLACES.find((p) => p.id === "baraddur"); if (bd) bd.again = [TA(2951), TA(3019, 3, 25.5)];

  /* ——新增事件—— */
  D.EVENTS.push(
    { t: -470, h: "精灵大迁徙", at: [760, 250], k: "elf", p: "维拉召唤精灵前往西方。凡雅、诺多和帖勒瑞三支精灵从库维因恩出发，走了很多年才到达大海；有的半路留下，有的始终没有出发。" },
    { t: SA(3319.05), h: "世界变圆", at: "twotrees", k: "elf", p: "努门诺尔的舰队踏上不死之地，一如维把阿门洲从世界里移走，海面合拢成一个球。从此凡人往西航行，只会绕回原地；只有精灵的船还能找到那条笔直的航道。" },
    { t: TA(1050), h: "霍比特人翻越迷雾山脉", at: [540, 240], k: "hob", p: "绿林蒙上阴影的那些年，安都因河谷的霍比特人开始向西迁移，翻过迷雾山脉，先到布理，几百年后才在夏尔定居。" },
    { t: TA(3018, 6, 20), h: "九骑手出动", at: "minasmorgul", k: "dark", p: "索隆从咕噜嘴里问出了“夏尔”和“巴金斯”。九个黑骑手出了米那斯魔古尔，一路向北，打听一个霍比特人的下落。" }
  );
  D.EVENTS.sort((a, b) => a.t - b.t);

  /* ——战场里的英雄小人（战役 id.单位 id → 人物）—— */
  const HEROES = {
    "hornburg.aragorn": ["aragorn", "eomer"], "hornburg.gimli": ["gimli", "legolas"],
    "pelennor.gandalf": ["gandalfw", "pippin"], "pelennor.witch": ["witchking"], "pelennor.theoden": ["theoden"], "pelennor.eowyn": ["eowyn", "merry"],
    "morannon.captains": ["aragorn", "gandalfw", "legolas", "gimli"], "fivearmies.thorin": ["thorin"], "fivearmies.bilbo": ["bilbo"],
    "lastalliance.isildur": ["isildur", "elendil", "gilgalad"], "lastalliance.sauron": ["sauron"]
  };

  const RACES = [["hob", "霍比特人"], ["elf", "精灵"], ["man", "人类"], ["dwarf", "矮人"], ["maia", "巫师与古老者"], ["dark", "黑暗势力"]];
  window.ME_CHARS = { CHARS, HEROES, RACES };
})();

/* ======== Q 版小人绘制（返回 SVG 片段；脚底在 0,0，头顶约 -44）======== */
window.CHIBI = (function () {
  const INK = "#3a2414";
  const ln = (d, c, w, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
  function face(o, eye = "#2a1a10", mouth = true) {
    let s = `<ellipse cx="-4" cy="-30" rx="1.6" ry="2.1" fill="${eye}"/><ellipse cx="4" cy="-30" rx="1.6" ry="2.1" fill="${eye}"/><circle cx="-3.4" cy="-30.9" r=".6" fill="#fff"/><circle cx="4.6" cy="-30.9" r=".6" fill="#fff"/>`;
    s += `<circle cx="-7.4" cy="-26.4" r="1.9" fill="#ff8a7a" opacity=".35"/><circle cx="7.4" cy="-26.4" r="1.9" fill="#ff8a7a" opacity=".35"/>`;
    if (mouth) s += ln("M-1.6,-25.4 Q0,-24 1.6,-25.4", INK, 0.7);
    return s;
  }
  function item(L, front) {
    const ic = L.ic, it = L.it;
    if (!front) {
      if (it === "bow") return ln("M-10,-27 Q-19,-13 -10,1", "#7a5a2a", 1.8) + ln("M-10,-27 L-10,1", "#e8e0c8", 0.5);
      if (it === "pack") return `<rect x="-11" y="-22" width="8" height="14" rx="2" fill="#8a6a3a" stroke="${INK}" stroke-width=".6"/><path d="M-12,-8 h9" stroke="#5a3a1a" stroke-width="2"/>`;
      return "";
    }
    switch (it) {
      case "staff": return ln("M11.5,0 L11.5,-44", "#6a4a2a", 1.9) + `<circle cx="11.5" cy="-45" r="2.4" fill="${ic || "#ddd"}" stroke="${INK}" stroke-width=".5"/>`;
      case "sword": return ln("M9,-10 L17,-31", ic || "#d8dde2", 2.1) + ln("M6.6,-12.6 L12,-8.4", "#8a6a2a", 1.7);
      case "axe": return ln("M9,-7 L13.5,-31", "#6a4a2a", 1.9) + `<path d="M12,-31 Q21,-33 19,-23 Q16,-25.5 13.6,-23.6 Z" fill="#c0c6cc" stroke="#555" stroke-width=".5"/>`;
      case "spear": return ln("M11,1 L11,-48", "#6a4a2a", 1.5) + `<path d="M11,-54 L13,-47 L9,-47 Z" fill="${ic || "#d8dde2"}"/>`;
      case "star": return `<circle cx="11" cy="-13" r="5.5" fill="${ic || "#fff6c0"}" opacity=".45" class="glowit"/><path d="M11,-17.5 L12,-14 L15.5,-13 L12,-12 L11,-8.5 L10,-12 L6.5,-13 L10,-14 Z" fill="#fff"/>`;
      case "harp": return `<path d="M8,-6 Q6,-20 14,-22 L15,-6 Z" fill="none" stroke="#c99a2e" stroke-width="1.4"/>` + ln("M10,-8 L11,-18 M12.5,-7 L13,-19", "#f0e0a0", 0.4);
      case "pipe": return ln("M1.5,-25 L8,-22.5 L8,-25.5", "#6a4a2a", 1.2) + `<circle cx="9" cy="-29" r="1.5" fill="#ccc" opacity=".5"/><circle cx="10.5" cy="-33" r="2" fill="#ccc" opacity=".35"/>`;
      case "shield": return `<circle cx="-9.5" cy="-11" r="6.2" fill="${ic || "#7a2a1a"}" stroke="#d8dde2" stroke-width="1.2"/><circle cx="-9.5" cy="-11" r="1.4" fill="#d8dde2"/>` + ln("M9,-10 L16,-29", "#d8dde2", 2);
      default: return "";
    }
  }
  function hairBack(L) {
    if (L.hs === "long" || L.hs === "longs") return `<path d="M-12.5,-32 Q-14,-17 -9,-13 L9,-13 Q14,-17 12.5,-32 Z" fill="${L.h}"/>`;
    return "";
  }
  function hairFront(L) {
    const h = L.h;
    switch (L.hs) {
      case "bald": return "";
      case "curly": return [[-10, -36], [-5.5, -41], [0, -42.5], [5.5, -41], [10, -36], [-11.5, -31.5], [11.5, -31.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.3" fill="${h}"/>`).join("");
      case "longs": return `<path d="M-12.4,-31 Q-12.6,-44.5 0,-44.5 Q12.6,-44.5 12.4,-31 L12.4,-21 L9.4,-21 L9.4,-34 Q0,-39 -9.4,-34 L-9.4,-21 L-12.4,-21 Z" fill="${h}"/>`;
      default: return `<path d="M-12.4,-31 Q-12.6,-44.5 0,-44.5 Q12.6,-44.5 12.4,-31 Q10,-37 5,-37.5 Q2.5,-34.5 -0.5,-37.5 Q-6,-38.5 -12.4,-31 Z" fill="${h}"/>`;
    }
  }
  function beard(L) {
    const c = L.bc || L.h;
    if (L.b === "short") return `<path d="M-9.5,-28 Q-9,-18.5 0,-17.5 Q9,-18.5 9.5,-28 Q5,-23.8 0,-24.4 Q-5,-23.8 -9.5,-28 Z" fill="${c}"/>`;
    if (L.b === "long" || L.b === "braid") return `<path d="M-9.8,-28 Q-11,-13 0,-5 Q11,-13 9.8,-28 Q5,-23.6 0,-24.4 Q-5,-23.6 -9.8,-28 Z" fill="${c}" stroke="${INK}" stroke-width=".4"/>` + (L.b === "braid" ? ln("M-3,-19 L-2.5,-9 M3,-19 L2.5,-9", INK, 0.5, 'opacity=".45"') : "") + `<path d="M-5,-25.6 Q0,-27.4 5,-25.6" fill="none" stroke="${c}" stroke-width="1.8"/>`;
    return "";
  }
  function hat(L) {
    const hc = L.hc || L.c;
    switch (L.hat) {
      case "wizard": return `<path d="M-16,-37.5 Q0,-33.5 16,-37.5 Q0,-42 -16,-37.5 Z" fill="${hc}" stroke="${INK}" stroke-width=".5"/><path d="M-9,-39.5 Q-2,-52 3,-66 Q4,-52 9.5,-39.5 Z" fill="${hc}" stroke="${INK}" stroke-width=".6"/>`;
      case "tall": return `<path d="M-14,-38 Q0,-35 14,-38 Q0,-41 -14,-38 Z" fill="${hc}"/><path d="M-8,-39.5 L-7,-54 L7,-54 L8,-39.5 Z" fill="${hc}" stroke="${INK}" stroke-width=".5"/>` + ln("M6,-52 Q14,-60 10,-66", "#3a8a5a", 1.6);
      case "crown": return `<path d="M-8.5,-41.5 L-8.5,-48 L-4.2,-44 L0,-50 L4.2,-44 L8.5,-48 L8.5,-41.5 Z" fill="${hc}" stroke="${INK}" stroke-width=".5"/>`;
      case "circlet": return ln("M-11.8,-36.5 Q0,-40.5 11.8,-36.5", hc, 1.4) + `<circle cx="0" cy="-39" r="1.7" fill="${L.gem || "#bfe8ff"}"/>`;
      case "helm": return `<path d="M-12.8,-30.5 Q-13,-45.5 0,-45.5 Q13,-45.5 12.8,-30.5 L9.6,-30.5 L9.6,-35.5 L-9.6,-35.5 L-9.6,-30.5 Z" fill="${hc}" stroke="${INK}" stroke-width=".7"/>` + ln("M0,-45.5 L0,-35.5", INK, 0.5) + (L.plume ? `<path d="M0,-45 Q-10,-52 -16,-40 Q-8,-46 0,-42 Z" fill="${L.plume}"/>` : "");
      case "hood": return `<path d="M-14.6,-30 Q-14.5,-47 0,-47 Q14.5,-47 14.6,-30 Q12,-41.5 0,-42.5 Q-12,-41.5 -14.6,-30 Z" fill="${hc}" stroke="${INK}" stroke-width=".5"/>`;
      default: return "";
    }
  }
  function person(L) {
    const s = L.s || "#f4d6b8", c = L.c || "#6b4a2a", t = L.t || "#c8b48a", bw = L.wide ? 11.5 : 9;
    let o = item(L, false) + hairBack(L);
    if (L.hat === "hood") o += `<circle cx="0" cy="-31" r="14.6" fill="${L.hc || c}"/>`;
    if (L.feet === "bare") o += `<ellipse cx="-4.8" cy="-1.5" rx="4.4" ry="2.1" fill="${s}" stroke="${INK}" stroke-width=".6"/><ellipse cx="4.8" cy="-1.5" rx="4.4" ry="2.1" fill="${s}" stroke="${INK}" stroke-width=".6"/>` + ln("M-7,-3 l1,-1.5 M-5,-3 l1,-1.5 M3,-3 l1,-1.5 M5,-3 l1,-1.5", L.h || INK, 0.8);
    else o += `<ellipse cx="-4" cy="-1.6" rx="3.6" ry="2.1" fill="${L.feet === "boots" ? "#d8b030" : "#3a2a1a"}"/><ellipse cx="4" cy="-1.6" rx="3.6" ry="2.1" fill="${L.feet === "boots" ? "#d8b030" : "#3a2a1a"}"/>`;
    o += `<path d="M-${bw},-2 Q-${bw + 1},-14 -6,-20 L6,-20 Q${bw + 1},-14 ${bw},-2 Z" fill="${c}" stroke="${INK}" stroke-width=".7"/>`;
    o += `<path d="M-3.6,-20 L3.6,-20 L4.6,-2.5 L-4.6,-2.5 Z" fill="${t}"/><rect x="-5.2" y="-11.4" width="10.4" height="1.7" fill="#4a3018"/>`;
    o += `<circle cx="-8.8" cy="-10" r="2.5" fill="${s}" stroke="${INK}" stroke-width=".6"/><circle cx="8.8" cy="-10" r="2.5" fill="${s}" stroke="${INK}" stroke-width=".6"/>`;
    if (L.ear) o += `<path d="M-11,-33.5 L-17.5,-39 L-10.6,-28 Z" fill="${s}" stroke="${INK}" stroke-width=".6"/><path d="M11,-33.5 L17.5,-39 L10.6,-28 Z" fill="${s}" stroke="${INK}" stroke-width=".6"/>`;
    o += `<circle cx="0" cy="-31" r="12" fill="${s}" stroke="${INK}" stroke-width=".8"/>`;
    o += face(L, L.eye, !L.b);
    o += beard(L) + hairFront(L) + hat(L);
    if (L.fl) o += `<circle cx="-9" cy="-39" r="2.2" fill="#f4f4ff"/><circle cx="-9" cy="-39" r=".9" fill="#f0d060"/><circle cx="-5" cy="-42" r="1.7" fill="#f4f4ff"/>`;
    o += item(L, true);
    return o;
  }
  const SP = {
    gollum: () => `<path d="M-7,-1 Q-9,-10 -5,-16 L5,-16 Q9,-10 7,-1 Z" fill="#c8c8a8" stroke="${INK}" stroke-width=".6"/><path d="M-5,-8 h10 l-1,4 h-8z" fill="#6a5a3a"/>` + ln("M-6,-12 L-12,-4 M6,-12 L12,-4 M-4,-1 L-7,0 M4,-1 L7,0", "#c8c8a8", 2.2) +
      `<circle cx="0" cy="-27" r="11.5" fill="#d0d0b0" stroke="${INK}" stroke-width=".8"/><ellipse cx="-4.5" cy="-27" rx="3.6" ry="4" fill="#cfe8ff" stroke="${INK}" stroke-width=".5"/><ellipse cx="4.5" cy="-27" rx="3.6" ry="4" fill="#cfe8ff" stroke="${INK}" stroke-width=".5"/><circle cx="-4" cy="-26.5" r="1.6" fill="#1a1a1a"/><circle cx="5" cy="-26.5" r="1.6" fill="#1a1a1a"/>` +
      ln("M-2,-38 Q-1,-42 0,-38.5 M2,-38 Q4,-42 4,-38", "#555", 0.6) + `<path d="M-11,-30 L-17,-34 L-11,-25 Z M11,-30 L17,-34 L11,-25 Z" fill="#d0d0b0" stroke="${INK}" stroke-width=".5"/>` + ln("M-2,-20.5 Q0,-19 2,-20.5", INK, 0.6),
    wraith: (L) => `<path d="M-11.5,0 Q-12.5,-20 -10.5,-34 Q-8,-48 0,-49 Q8,-48 10.5,-34 Q12.5,-20 11.5,0 L7,-3 L3.5,0 L0,-3 L-3.5,0 L-7,-3 Z" fill="#141010" stroke="#3a3030" stroke-width=".7"/><ellipse cx="0" cy="-33" rx="7" ry="8" fill="#000"/><circle cx="-2.7" cy="-33" r="1.3" fill="#ff3a2a"/><circle cx="2.7" cy="-33" r="1.3" fill="#ff3a2a"/>` + ln("M9,-12 L16,-30", "#9aa0a8", 1.8) +
      (L.crown ? `<path d="M-7,-45 L-7,-51 L-3.5,-47 L0,-53 L3.5,-47 L7,-51 L7,-45 Z" fill="#7a7a80" stroke="#1a1a1a" stroke-width=".5"/>` : ""),
    eye: () => `<path d="M-12,0 L-7,-28 L7,-28 L12,0 Z" fill="#1a1210" stroke="#000" stroke-width=".6"/><path d="M-7,-28 L-10,-34 M7,-28 L10,-34" stroke="#1a1210" stroke-width="2.5"/>` +
      `<ellipse cx="0" cy="-42" rx="18" ry="11" fill="#ff7a1a" opacity=".35" class="glowit"/><path d="M-15,-42 Q0,-55 15,-42 Q0,-29 -15,-42 Z" fill="#ffa030" stroke="#c03a10" stroke-width=".8"/><ellipse cx="0" cy="-42" rx="2.2" ry="7" fill="#1a0500"/>`,
    dragon: (L) => `<path d="M-4,-17 L-20,-36 L-15,-25 L-23,-27 L-14,-17 Z" fill="${L.c2}" stroke="${INK}" stroke-width=".5" opacity="${L.c === "#c9a23a" ? 0 : 1}"/>` +
      `<path d="M-16,-3 Q-21,-15 -8,-17 Q4,-19 6,-9 Q8,-1 18,-4" fill="none" stroke="${L.c}" stroke-width="8" stroke-linecap="round"/><path d="M-16,-3 Q-21,-15 -8,-17 Q4,-19 6,-9 Q8,-1 18,-4" fill="none" stroke="${L.c2}" stroke-width="2" stroke-dasharray="2 3" opacity=".7"/>` +
      `<ellipse cx="7" cy="-26" rx="10" ry="7.5" fill="${L.c}" stroke="${INK}" stroke-width=".7"/><path d="M2,-32 L-1,-40 L5,-33 M9,-32.5 L10,-41 L12,-32" fill="${L.c2}" stroke="${INK}" stroke-width=".5"/><circle cx="10" cy="-27.5" r="1.8" fill="#ffe040"/><ellipse cx="10" cy="-27.5" rx=".6" ry="1.5" fill="#000"/>` +
      `<circle cx="16" cy="-23" r=".9" fill="${INK}"/>` + (L.c === "#b0342a" ? `<path d="M17,-22 Q24,-22 30,-17 Q24,-19 19,-19" fill="#ffa030" opacity=".8" class="glowit"/>` : ""),
    balrog: () => `<path d="M-6,-24 L-24,-42 L-18,-28 L-26,-30 L-12,-16 Z M6,-24 L24,-42 L18,-28 L26,-30 L12,-16 Z" fill="#1a0c08" stroke="#4a1a0a" stroke-width=".6"/>` +
      `<path d="M-11,0 Q-13,-18 -9,-26 L9,-26 Q13,-18 11,0 Z" fill="#2a1410" stroke="#000" stroke-width=".7"/><path d="M-9,-28 Q-12,-46 -4,-50 Q-2,-44 0,-52 Q3,-45 5,-50 Q12,-44 9,-28 Z" fill="#ff6a1a" opacity=".85" class="glowit"/>` +
      `<circle cx="0" cy="-31" r="9.5" fill="#2a1410" stroke="#000" stroke-width=".7"/><path d="M-6,-38 L-10,-46 L-3,-39 M6,-38 L10,-46 L3,-39" stroke="#1a0c08" stroke-width="2" fill="none"/><circle cx="-3.3" cy="-31" r="1.5" fill="#ffd040"/><circle cx="3.3" cy="-31" r="1.5" fill="#ffd040"/>` +
      ln("M10,-12 Q22,-6 18,6", "#ff8a2a", 1.4),
    ent: () => `<path d="M-8.5,0 L-7,-30 L7,-30 L8.5,0 L4,-1 L2,0 L-2,-1 Z" fill="#6a4a2a" stroke="#3a2414" stroke-width=".8"/>` + ln("M-4,-4 L-3,-26 M3,-6 L2.5,-24", "#4a3018", 0.6) +
      ln("M-7,-18 L-16,-26 L-19,-24 M7,-18 L16,-28 L19,-26", "#6a4a2a", 2) +
      [[-9, -36, 8], [0, -44, 9], [9, -36, 8], [0, -34, 7], [-14, -29, 4.5], [14, -30, 4.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#5f7a33" stroke="#3a4a1a" stroke-width=".5"/>`).join("") +
      `<ellipse cx="-3" cy="-22" rx="1.4" ry="1.8" fill="#1a1a10"/><ellipse cx="3" cy="-22" rx="1.4" ry="1.8" fill="#1a1a10"/><circle cx="-2.6" cy="-22.6" r=".5" fill="#c8e0a0"/><circle cx="3.4" cy="-22.6" r=".5" fill="#c8e0a0"/>` +
      `<path d="M-4,-18 Q-4,-9 0,-7 Q4,-9 4,-18 Q0,-16 -4,-18 Z" fill="#8a9a5a" opacity=".85"/>`,
    spider: () => [-1, 1].map((k) => [0, 1, 2, 3].map((i) => ln(`M${k * 5},${-10 + i * 2} Q${k * (16 + i * 2)},${-22 + i * 5} ${k * (20 + i)},${-2 + i}`, "#1a1410", 1.6)).join("")).join("") +
      `<ellipse cx="0" cy="-14" rx="11" ry="9" fill="#1a1410" stroke="#000" stroke-width=".6"/><circle cx="0" cy="-24" r="6" fill="#1a1410"/>` + [[-2.5, -25], [2.5, -25], [-1.2, -27.5], [1.2, -27.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="#ff3a2a"/>`).join("") + `<path d="M-5,-15 h10" stroke="#5a3a2a" stroke-width=".8"/>`,
    morgoth: () => `<path d="M-14,0 Q-16,-16 -10,-24 L10,-24 Q16,-16 14,0 Z" fill="#141018" stroke="#000" stroke-width=".8"/><path d="M-3,-22 L3,-22 L4,-2 L-4,-2 Z" fill="#2a2430"/>` +
      ln("M12,-6 L18,-36", "#3a3a40", 2.4) + `<rect x="13" y="-42" width="11" height="8" rx="1.5" fill="#3a3a40" stroke="#000" stroke-width=".6" transform="rotate(18 18 -38)"/>` +
      `<circle cx="0" cy="-33" r="11" fill="#c8c0b8" stroke="#000" stroke-width=".8"/><path d="M-11,-35 Q-11,-46 0,-46 Q11,-46 11,-35 L8,-35 L8,-30 L-8,-30 L-8,-35 Z" fill="#1a1a20"/>` +
      `<ellipse cx="-3.8" cy="-31.5" rx="1.6" ry="1.4" fill="#ff3a2a"/><ellipse cx="3.8" cy="-31.5" rx="1.6" ry="1.4" fill="#ff3a2a"/>` +
      `<path d="M-10,-44 L-10,-53 L-5,-47 L0,-56 L5,-47 L10,-53 L10,-44 Z" fill="#2a2a30" stroke="#000" stroke-width=".6"/>` + [-6, 0, 6].map((x) => `<circle cx="${x}" cy="-47.5" r="1.6" fill="#fffbe0" class="glowit"/>`).join(""),
    sauron: () => `<path d="M-11,0 Q-13,-14 -8,-21 L8,-21 Q13,-14 11,0 Z" fill="#1a1416" stroke="#000" stroke-width=".7"/><path d="M-8,-21 L-13,-25 L-8,-17 M8,-21 L13,-25 L8,-17" fill="#2a2428" stroke="#000" stroke-width=".6"/>` +
      ln("M10,-8 L15,-30", "#3a3a40", 2) + `<circle cx="15.5" cy="-31" r="3.4" fill="#2a2a30" stroke="#000" stroke-width=".5"/>` +
      `<path d="M-12,-30 Q-12.5,-45 0,-46 Q12.5,-45 12,-30 Q12,-21 0,-20 Q-12,-21 -12,-30 Z" fill="#2a2428" stroke="#000" stroke-width=".8"/>` +
      `<path d="M-9,-44 L-12,-55 L-5,-46 L0,-58 L5,-46 L12,-55 L9,-44 Z" fill="#1a1416" stroke="#000" stroke-width=".5"/><path d="M-7,-32 L-2,-30 M7,-32 L2,-30" stroke="#ff8a2a" stroke-width="2" stroke-linecap="round" class="glowit"/>` +
      `<circle cx="-9" cy="-10" r="1.8" fill="#e8b830"/>`
  };
  const HORSE = (c = "#7a5a3a") => `<g class="horse">` + ln("M-9,-4 L-10,6 M-4,-4 L-4,6 M5,-4 L6,6 M10,-4 L11,6", "#3a2414", 1.8) +
    `<ellipse cx="0" cy="-6" rx="13" ry="6.5" fill="${c}" stroke="#3a2414" stroke-width=".7"/><path d="M9,-9 Q14,-20 18,-21 Q22,-20 22,-16 L16,-12 Z" fill="${c}" stroke="#3a2414" stroke-width=".7"/>` +
    ln("M-13,-7 Q-19,-3 -17,4", "#3a2414", 2) + `<circle cx="18.5" cy="-18" r=".9" fill="#000"/></g>`;
  function chibi(L) {
    const sz = L.sz || 1;
    return `<g transform="scale(${sz})"><ellipse cx="0" cy="0" rx="10" ry="2.6" fill="#000" opacity=".2"/>${L.sp ? SP[L.sp](L) : person(L)}</g>`;
  }
  chibi.horse = HORSE;
  chibi.sail = `<path d="M1,-64 L1,-4 L26,-10 Q20,-38 1,-64 Z" fill="#f4ecd6" stroke="#5a4326" stroke-width=".8"/>`;
  chibi.hull = `<path d="M-30,-4 L32,-4 L24,7 L-24,7 Z" fill="#7a5a3a" stroke="#3a2414" stroke-width=".8"/><path d="M-26,-1 H28" stroke="#c8a870" stroke-width="1"/>`;
  return chibi;
})();
