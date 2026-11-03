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

  /* ——战场兵种：通用 Q 版士兵（不进人物面板）—— */
  const SOLDIERS = {
    gondor: { h: "#2a1a1a", hat: "helm", hc: "#d8dde2", c: "#2a2a3a", t: "#c8ccd4", it: "spear", ic: "#e8ecf0" },
    rohan: { h: "#d8b060", hs: "long", hat: "helm", hc: "#c8ccd0", plume: "#f0ece0", c: "#3a6a2a", t: "#c8a040", it: "spear" },
    westfold: { h: "#b08040", hat: "helm", hc: "#a8acb0", c: "#5a6a3a", t: "#b0985a", it: "spear" },
    elf: C({ h: "#e8d8a0", hat: "helm", hc: "#e0c060", c: "#3a5a8a", t: "#d0d8e8", it: "bow" }, ELF),
    woodelf: C({ h: "#c09040", c: "#4a6a3a", t: "#b8c890", it: "bow" }, ELF),
    noldor: C({ h: "#151515", hat: "helm", hc: "#e8ecf0", c: "#2a3a7a", t: "#c8d0e8", it: "spear", ic: "#fff" }, ELF),
    dwarf: C({ h: "#7a3a1a", bc: "#7a3a1a", hat: "helm", hc: "#8a9098", c: "#5a3a2a", t: "#8a7a6a", it: "axe" }, DW),
    laketown: { h: "#3a2a1a", hat: "hood", hc: "#5a5a6a", c: "#5a5a6a", t: "#a89a7a", it: "bow" },
    edain: { h: "#3a2a1a", hs: "long", hat: "helm", hc: "#b09040", c: "#5a3a2a", t: "#a88a5a", it: "spear" },
    numenor: { h: "#151515", hat: "helm", hc: "#e8ecf0", c: "#1a2a4a", t: "#b8c4d8", it: "sword", ic: "#e8f4ff" },
    orc: { s: "#8a9a5a", h: "#1a1a1a", hat: "darkhelm", hc: "#3a3430", c: "#3a3028", t: "#5a4a3a", it: "sword", ic: "#6a6a6a", ear: 1, eye: "#c02010" },
    uruk: { s: "#6a6a52", h: "#151515", hat: "darkhelm", hc: "#2a2420", c: "#2a2420", t: "#4a4038", it: "shield", ic: "#e8e0d0", wide: 1, eye: "#c02010" },
    easterling: { h: "#151515", hat: "helm", hc: "#a07a2a", c: "#7a2a1a", t: "#c09040", it: "spear" },
    harad: { s: "#a8784a", h: "#151515", hat: "hood", hc: "#7a1a1a", c: "#b03a1a", t: "#e0b040", it: "spear" },
    dunland: { h: "#4a2a1a", hs: "long", b: "long", bc: "#4a2a1a", c: "#6a4a2a", t: "#8a6a4a", it: "axe" },
    troll: { s: "#7a7a6a", h: "#3a3a30", hs: "bald", c: "#4a3a2a", t: "#6a5a4a", it: "axe", ic: "#5a5a5a", wide: 1, sz: 1.5, eye: "#c02010" },
    wolf: { sp: "wraith" }
  };
  /* ——每支部队：s 兵种，lead 带队的具名人物；hero 单位继续用 HEROES—— */
  const TROOPS = {
    "hornburg.theoden": { s: "rohan", lead: ["theoden"] }, "hornburg.wall": { s: "westfold", lead: ["gamling"] }, "hornburg.dike": { s: "westfold" },
    "hornburg.uruk": { s: "uruk" }, "hornburg.dun": { s: "dunland" }, "hornburg.ladders": { s: "uruk" }, "hornburg.rams": { s: "troll" },
    "hornburg.gandalf": { s: "westfold", lead: ["gandalfw", "erkenbrand"] },
    "pelennor.city": { s: "gondor", lead: ["denethor", "faramir"] }, "pelennor.host1": { s: "orc", lead: ["gothmog"] }, "pelennor.host2": { s: "orc" },
    "pelennor.grond": { s: "troll" }, "pelennor.harad": { s: "harad" }, "pelennor.rohan": { s: "rohan", lead: ["eomer"] }, "pelennor.ships": { lead: ["aragorn", "legolas", "gimli"] },
    "morannon.west1": { s: "gondor", lead: ["imrahil"] }, "morannon.west2": { s: "rohan", lead: ["eomer"] }, "morannon.mouth": { lead: ["mouth"] },
    "morannon.gatehost": { s: "orc" }, "morannon.flankL": { s: "orc" }, "morannon.flankR": { s: "easterling" }, "morannon.trolls": { s: "troll" }, "morannon.nazgul": { lead: ["nazgul", "nazgul", "nazgul"] },
    "fivearmies.men": { s: "laketown", lead: ["bard"] }, "fivearmies.elves": { s: "woodelf", lead: ["thranduil"] }, "fivearmies.dain": { s: "dwarf", lead: ["dain"] },
    "fivearmies.goblins": { s: "orc" }, "fivearmies.bolg": { s: "troll", lead: ["bolg"] }, "fivearmies.beorn": { lead: ["beorn"] },
    "lastalliance.gilgalad": { s: "elf", lead: ["gilgalad", "elrond"] }, "lastalliance.elendil": { s: "numenor", lead: ["anarion"] }, "lastalliance.oropher": { s: "woodelf", lead: ["oropher"] },
    "lastalliance.sauronhost": { s: "orc" },
    "nirnaeth.fingon": { s: "noldor", lead: ["fingon"] }, "nirnaeth.hurin": { s: "edain", lead: ["hurin", "huor"] }, "nirnaeth.turgon": { s: "noldor", lead: ["turgon"] },
    "nirnaeth.maedhros": { s: "noldor", lead: ["maedhros"] }, "nirnaeth.ulfang": { s: "easterling" }, "nirnaeth.dwarves": { s: "dwarf", lead: ["azaghal"] },
    "nirnaeth.host": { s: "orc" }, "nirnaeth.hidden": { s: "orc" }, "nirnaeth.glaurung": { lead: ["glaurung", "balrog"] }
  };
  /* 只出现在战场里的具名人物 */
  const EXTRA = [
    { id: "fingon", n: "芬巩", en: "Fingon", r: "elf", look: C({ h: "#151515", hs: "long", hat: "helm", hc: "#e0c060", c: "#2a4a8a", t: "#c0c8e0", it: "sword" }, ELF),
      bio: "芬国昐的长子，至高王。曾独自上安戈洛墨斯山救下梅斯罗斯；泪雨之战中被炎魔之首围攻而死。" },
    { id: "hurin", n: "胡林", en: "Húrin Thalion", r: "man", look: { h: "#2a1a10", b: "short", bc: "#2a1a10", hat: "helm", hc: "#b09040", c: "#3a3a5a", t: "#a8a080", it: "axe" },
      bio: "多尔罗明的领主，图林的父亲。泪雨之战断后，挥斧高喊“白昼将再来临”，直到被俘。" },
    { id: "huor", n: "胡奥", en: "Huor", r: "man", look: { h: "#c09040", hat: "helm", hc: "#b09040", c: "#3a3a5a", t: "#a8a080", it: "spear" },
      bio: "胡林的弟弟，图奥的父亲。与哥哥一起守住退路，让特刚得以撤回刚多林，自己中箭战死。" },
    { id: "azaghal", n: "阿萨格哈尔", en: "Azaghâl", r: "dwarf", look: C({ h: "#4a2a1a", bc: "#4a2a1a", hat: "helm", hc: "#8a9098", c: "#3a3a3a", t: "#8a7a6a", it: "axe" }, DW),
      bio: "贝烈戈斯特的矮人王。矮人不怕龙火，他重伤格劳龙，自己也被踩死。" },
    { id: "oropher", n: "欧洛费尔", en: "Oropher", r: "elf", look: C({ h: "#e8d8a0", hat: "crown", hc: "#8a5a2a", c: "#5a6a2a", t: "#c8c090", it: "bow" }, ELF),
      bio: "瑟兰迪尔的父亲，绿林之王。在达戈拉德不等号令就冲锋，战死在魔多门前。" },
    { id: "imrahil", n: "印拉希尔", en: "Prince Imrahil", r: "man", look: { h: "#151515", hat: "helm", hc: "#d8dde2", plume: "#3a6aa8", c: "#2a4a7a", t: "#d8dde2", it: "sword" },
      bio: "多阿姆洛斯亲王，率天鹅骑士守卫米那斯提力斯，也跟着阿拉贡走到了黑门。" },
    { id: "erkenbrand", n: "艾肯布兰德", en: "Erkenbrand", r: "man", look: { h: "#c8c0a8", b: "short", bc: "#c8c0a8", hat: "helm", hc: "#a8acb0", c: "#5a6a3a", t: "#b0985a", it: "spear" },
      bio: "西伏尔德的领主。号角堡之战的清晨，他与甘道夫一起从山坡上冲下来。" },
    { id: "gamling", n: "甘姆林", en: "Gamling", r: "man", look: { h: "#a8a090", b: "long", bc: "#a8a090", hat: "helm", hc: "#a8acb0", c: "#5a6a3a", t: "#b0985a", it: "sword" },
      bio: "号角堡的老守将，深谷墙上的守军由他指挥。" },
    { id: "gothmog", n: "戈斯魔格", en: "Gothmog of Minas Morgul", r: "dark", look: { s: "#8a9a5a", h: "#1a1a1a", hat: "darkhelm", hc: "#2a2420", c: "#2a2028", t: "#4a3a3a", it: "sword", wide: 1, eye: "#c02010" },
      bio: "米那斯魔古尔的副将。巫王倒下后，由他接手指挥帕兰诺平原上的魔多大军。" },
    { id: "bolg", n: "博格", en: "Bolg", r: "dark", look: { s: "#7a8a5a", h: "#151515", hs: "bald", c: "#2a2420", t: "#4a3a2a", it: "sword", wide: 1, sz: 1.2, eye: "#c02010" },
      bio: "阿佐格之子，北方奥克之王。五军之战中率近卫杀到最前，被比翁所杀。" },
    { id: "mouth", n: "索隆之口", en: "The Mouth of Sauron", r: "dark", look: { s: "#d8d0c0", h: "#151515", hat: "darkhelm", hc: "#151515", c: "#151515", t: "#3a1a1a", eye: "#c02010" },
      bio: "巴拉督尔的副官，努门诺尔人后裔，早已忘了自己的名字。在黑门前拿出弗罗多的锁子甲来恐吓西方将领。" }
  ];
  EXTRA.forEach((c) => (c.battle = 1)); CHARS.push(...EXTRA);

  const RACES = [["hob", "霍比特人"], ["elf", "精灵"], ["man", "人类"], ["dwarf", "矮人"], ["maia", "巫师与古老者"], ["dark", "黑暗势力"]];
  window.ME_CHARS = { CHARS, HEROES, RACES, SOLDIERS, TROOPS };
})();


/* ======== Q 版小人绘制（返回 SVG 片段；脚底在 0,0，头顶约 -44）========
 * 绘法：左上主光、右下冷阴影；每个部件用渐变上色，再叠褶皱、高光与轮廓。
 * 渐变定义内嵌在片段里（<use> 引用时同样有效），id 逐个递增避免冲突。 */
window.CHIBI = (function () {
  const INK = "#2a1810";
  let uid = 0;
  function hx(c) { c = (c || "#888").replace("#", ""); if (c.length === 3) c = c.split("").map((x) => x + x).join(""); return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16)); }
  function mix(a, b, k) { const A = hx(a), B = hx(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join(""); }
  const dk = (c, k = 0.3) => mix(c, "#000000", k), lt = (c, k = 0.3) => mix(c, "#ffffff", k);
  const hi = (c, k = 0.3) => mix(c, "#fff1cf", k), sh = (c, k = 0.3) => mix(c, "#1b1222", k);
  const ln = (d, c, w, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const P = (d, f, extra = "") => `<path d="${d}" fill="${f}" ${extra}/>`;
  // 每个小人一个材质上下文
  function ctx() {
    const u = "cb" + uid++ + "_", D = []; let n = 0;
    const lin = (stops, x1 = 0, y1 = 0, x2 = 1, y2 = 0.4) => { const i = u + n++; D.push(`<linearGradient id="${i}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`); return `url(#${i})`; };
    const rad = (stops, cx = 0.38, cy = 0.32, r = 0.78) => { const i = u + n++; D.push(`<radialGradient id="${i}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</radialGradient>`); return `url(#${i})`; };
    const M = {};
    const memo = (k, f) => M[k] || (M[k] = f());
    return {
      D,
      skin: (c) => memo("s" + c, () => rad([[0, hi(c, 0.28)], [0.5, c], [1, sh(c, 0.36)]])),
      cloth: (c) => memo("c" + c, () => lin([[0, hi(c, 0.22)], [0.45, c], [1, sh(c, 0.45)]])),
      metal: (c) => memo("m" + c, () => lin([[0, sh(c, 0.4)], [0.22, hi(c, 0.55)], [0.4, c], [0.65, sh(c, 0.45)], [0.85, hi(c, 0.2)], [1, sh(c, 0.55)]], 0, 0, 1, 0.6)),
      hair: (c) => memo("h" + c, () => lin([[0, hi(c, 0.25)], [0.45, c], [1, sh(c, 0.5)]], 0.2, 0, 0.7, 1)),
      gold: () => memo("gold", () => lin([[0, "#7a5212"], [0.3, "#f6dc80"], [0.55, "#c9962a"], [0.8, "#f8e8a8"], [1, "#7a5212"]], 0, 0, 1, 0.7)),
      gem: (c) => memo("g" + c, () => rad([[0, lt(c, 0.7)], [0.45, c], [1, dk(c, 0.5)]], 0.35, 0.3, 0.7)),
    };
  }
  function face(L, X) {
    const s = L.s || "#f4d6b8", eye = L.eye || "#2a1a10", mouth = !L.b;
    let o = "";
    // 眼：眼白 + 虹膜 + 瞳 + 高光，眉
    [[-4.2, 1], [4.2, -1]].forEach(([x, d]) => {
      o += `<ellipse cx="${x}" cy="-30" rx="2.1" ry="2.4" fill="#fbf7f0"/><ellipse cx="${x + d * 0.2}" cy="-29.8" rx="1.45" ry="1.9" fill="${eye}"/><ellipse cx="${x + d * 0.2}" cy="-29.6" rx=".8" ry="1.2" fill="#0a0604"/><circle cx="${x + 0.5}" cy="-30.8" r=".65" fill="#fff"/>`;
      o += ln(`M${x - 2.2},-30.6 Q${x},-33 ${x + 2.2},-30.6`, INK, 0.7);
    });
    if (L.eye === "#c02010") o += `<circle cx="-4.2" cy="-30" r="3" fill="#ff3010" opacity=".3"/><circle cx="4.2" cy="-30" r="3" fill="#ff3010" opacity=".3"/>`;
    const bc = sh(L.bc && L.b ? L.bc : L.h || "#4a3a2a", 0.3);
    o += ln("M-6.6,-34.2 Q-4.2,-35.6 -1.8,-34.4 M1.8,-34.4 Q4.2,-35.6 6.6,-34.2", bc, L.b ? 1.1 : 0.8);
    // 鼻、嘴、腮红、下巴影
    o += ln("M0,-29 Q-1,-26.4 0.4,-26", sh(s, 0.5), 0.6, 'opacity=".8"');
    o += `<ellipse cx="-7.6" cy="-26.6" rx="2.2" ry="1.4" fill="#ff8a7a" opacity=".3"/><ellipse cx="7.6" cy="-26.6" rx="2.2" ry="1.4" fill="#ff8a7a" opacity=".22"/>`;
    if (mouth) o += ln("M-1.8,-24.6 Q0,-23 1.8,-24.6", mix(s, "#8a3030", 0.6), 0.8);
    return o;
  }
  function item(L, front, X) {
    const ic = L.ic, it = L.it;
    if (!front) {
      if (it === "bow") return ln("M-10,-28 Q-20,-13 -10,1", "#4a3018", 2.4) + ln("M-10,-28 Q-20,-13 -10,1", "#8a6a3a", 1.4) + ln("M-10,-28 L-10,1", "#e8e0c8", 0.5) + ln("M-12,-20 L-7,-33 M-10.5,-20 L-5,-32", "#7a5a2a", 1) + `<path d="M-7,-33 l1,-2.5 l1,2.8z M-5,-32 l1,-2.5 l1,2.8z" fill="#e8e8e8"/>`;
      if (it === "pack") return `<rect x="-12" y="-23" width="9" height="15" rx="2.5" fill="${X.cloth("#8a6a3a")}" stroke="${INK}" stroke-width=".6"/><rect x="-12" y="-23" width="9" height="4" rx="2" fill="#6a8a4a"/><path d="M-13,-9 h11" stroke="#5a3a1a" stroke-width="2"/><rect x="-8.5" y="-16" width="2" height="3" rx=".5" fill="${X.gold()}"/>`;
      if (it === "spear") return ln("M12,2 L12,-50", "#4a3018", 2) + ln("M12,2 L12,-50", "#8a6a3a", 1.1) + `<path d="M12,-57 L14.5,-49 L9.5,-49 Z" fill="${X.metal(ic || "#d8dde2")}" stroke="#444" stroke-width=".4"/><path d="M9.6,-48 L14.4,-48 L12,-43 Z" fill="#8a2a1a"/>`;
      if (it === "axe") return ln("M12,-4 L16,-34", "#4a3018", 2.2) + ln("M12,-4 L16,-34", "#8a6a3a", 1.2) + `<path d="M14.5,-34.5 Q25,-37 23,-25 Q19,-28 15.8,-25.5 Z" fill="${X.metal("#c0c6cc")}" stroke="#333" stroke-width=".5"/>` + ln("M16.5,-33 Q22,-33 22,-27", "#fff", 0.6, 'opacity=".7"');
      return "";
    }
    switch (it) {
      case "staff": return ln("M11.5,0 L11.5,-44", "#3a2412", 2.6) + ln("M11.5,0 L11.5,-44", "#7a5a32", 1.5) + ln("M11,-2 Q10.6,-20 11,-40", hi("#7a5a32", 0.4), 0.5, 'opacity=".6"') + `<circle cx="11.5" cy="-45.5" r="5" fill="${ic || "#fff"}" opacity=".2" class="glowit"/><circle cx="11.5" cy="-45.5" r="2.6" fill="${X.gem(ic || "#ddd")}" stroke="${INK}" stroke-width=".4"/><circle cx="10.6" cy="-46.4" r=".7" fill="#fff"/>`;
      case "sword": return `<path d="M9.4,-11 L16.4,-33 L18.2,-32.6 L11.6,-10.2 Z" fill="${X.metal(ic || "#d8dde2")}" stroke="#2a2a2a" stroke-width=".35"/>` + ln("M10.4,-11 L17,-32", hi(ic || "#d8dde2", 0.7), 0.4, 'opacity=".9"') + ln("M6.4,-13 L13,-8", X.gold(), 1.8) + `<circle cx="9.2" cy="-8" r="1.3" fill="${X.gold()}" stroke="#5a3a0a" stroke-width=".3"/>`;
      case "axe": return ln("M9,-7 L13.5,-31", "#3a2412", 2.4) + ln("M9,-7 L13.5,-31", "#8a6a3a", 1.3) + `<path d="M12,-31.5 Q22,-34 20,-23 Q16.5,-26 13.4,-23.6 Z" fill="${X.metal("#c0c6cc")}" stroke="#333" stroke-width=".5"/>` + ln("M14,-30 Q19,-30 19,-25", "#fff", 0.6, 'opacity=".7"');
      case "spear": return ln("M11,1 L11,-48", "#3a2412", 2.1) + ln("M11,1 L11,-48", "#8a6a3a", 1.1) + `<path d="M11,-55 L13.4,-47 L8.6,-47 Z" fill="${X.metal(ic || "#d8dde2")}" stroke="#444" stroke-width=".4"/><path d="M8.8,-46 L13.2,-46 L11,-41 Z" fill="#8a2a1a"/>`;
      case "star": return `<circle cx="11" cy="-13" r="6.5" fill="${ic || "#fff6c0"}" opacity=".35" class="glowit"/><circle cx="11" cy="-13" r="3.6" fill="${ic || "#fff6c0"}" opacity=".5"/><path d="M11,-18 L12.2,-14.2 L16,-13 L12.2,-11.8 L11,-8 L9.8,-11.8 L6,-13 L9.8,-14.2 Z" fill="#fff"/>`;
      case "harp": return `<path d="M8,-6 Q6,-20 14,-22 L15,-6 Z" fill="none" stroke="${X.gold()}" stroke-width="1.6"/>` + ln("M10,-8 L11,-18 M12.5,-7 L13,-19", "#f6ecc0", 0.4);
      case "pipe": return ln("M1.5,-25 L8.5,-22.5", "#4a2a12", 1.4) + `<path d="M7.6,-25.8 L10,-25.8 L9.8,-21.4 L7.4,-21.4 Z" fill="#5a3a1a"/>` + `<circle cx="9.6" cy="-29.5" r="1.4" fill="#ccc" opacity=".5"/><circle cx="11.4" cy="-33.5" r="2.1" fill="#ccc" opacity=".35"/>`;
      case "shield": { const sc = ic || "#7a2a1a"; return `<circle cx="-9.5" cy="-11" r="7" fill="${X.metal("#c8ccd2")}" stroke="#333" stroke-width=".5"/><circle cx="-9.5" cy="-11" r="5.6" fill="${X.cloth(sc)}"/><circle cx="-9.5" cy="-11" r="1.8" fill="${X.metal("#d8dde2")}" stroke="#444" stroke-width=".3"/><circle cx="-10" cy="-11.5" r=".6" fill="#fff" opacity=".8"/><circle cx="-9.5" cy="-11" r="4" fill="none" stroke="${X.gold()}" stroke-width=".6"/>` + `<path d="M9.4,-11 L15.6,-30 L17.4,-29.6 L11.6,-10.2 Z" fill="${X.metal("#d8dde2")}" stroke="#2a2a2a" stroke-width=".35"/>` + ln("M6.6,-13 L12.6,-8.4", X.gold(), 1.6); }
      default: return "";
    }
  }
  function hairBack(L, X) {
    const h = L.h || "#4a3a2a";
    if (L.hs === "long" || L.hs === "longs") return `<path d="M-12.8,-32 Q-14.5,-17 -9.5,-12 L9.5,-12 Q14.5,-17 12.8,-32 Z" fill="${X.hair(h)}"/>` + ln("M-11,-26 Q-11.6,-18 -9.6,-14 M11,-26 Q11.6,-18 9.6,-14", sh(h, 0.5), 0.6, 'opacity=".6"');
    return "";
  }
  function hairFront(L, X) {
    const h = L.h || "#4a3a2a", f = X.hair(h), hd = sh(h, 0.5), hl = hi(h, 0.55);
    switch (L.hs) {
      case "bald": return "";
      case "curly": return [[-10, -36], [-5.5, -41], [0, -42.5], [5.5, -41], [10, -36], [-11.5, -31.5], [11.5, -31.5], [-5, -37], [5, -37]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.3" fill="${f}" stroke="${hd}" stroke-width=".35"/>` + ln(`M${x - 1.6},${y - 1.8} q1.2,-1 2.4,-0.2`, hl, 0.5, 'opacity=".7"')).join("");
      case "longs": return `<path d="M-12.4,-31 Q-12.6,-44.5 0,-44.5 Q12.6,-44.5 12.4,-31 L12.4,-21 L9.4,-21 L9.4,-34 Q0,-39 -9.4,-34 L-9.4,-21 L-12.4,-21 Z" fill="${f}"/>` + ln("M-10.8,-30 L-10.8,-22 M10.8,-30 L10.8,-22 M-3,-43 Q-7,-41 -9,-36 M3,-43.5 Q7,-41 9,-36", hd, 0.5, 'opacity=".6"') + ln("M-7,-42 Q-2,-44 2,-43.5", hl, 0.8, 'opacity=".55"');
      default: return `<path d="M-12.4,-31 Q-12.6,-44.5 0,-44.5 Q12.6,-44.5 12.4,-31 Q10,-37 5,-37.5 Q2.5,-34.5 -0.5,-37.5 Q-6,-38.5 -12.4,-31 Z" fill="${f}"/>` + ln("M-4,-43 Q-8,-41 -10.5,-35 M4,-43 Q8,-41.5 10,-36 M0,-43.5 Q-1.5,-40 -1,-38", hd, 0.5, 'opacity=".6"') + ln("M-7.5,-42 Q-3,-44 1.5,-43.6", hl, 0.8, 'opacity=".55"');
    }
  }
  function beard(L, X) {
    const c = L.bc || L.h || "#4a3a2a", f = X.hair(c), cd = sh(c, 0.5), cl = hi(c, 0.5);
    if (L.b === "short") return `<path d="M-9.5,-28 Q-9,-18.5 0,-17.5 Q9,-18.5 9.5,-28 Q5,-23.8 0,-24.4 Q-5,-23.8 -9.5,-28 Z" fill="${f}"/>` + ln("M-6,-25 Q-5,-21 -2,-19.5 M6,-25 Q5,-21 2,-19.5", cd, 0.5, 'opacity=".6"') + ln("M-5.6,-23 Q-5,-20.5 -3,-19.4", cl, 0.5, 'opacity=".5"') + `<path d="M-4,-25.6 Q0,-27.6 4,-25.6 Q2,-24.6 0,-24.8 Q-2,-24.6 -4,-25.6Z" fill="${f}"/>`;
    if (L.b === "long" || L.b === "braid") return `<path d="M-9.8,-28 Q-11,-13 0,-5 Q11,-13 9.8,-28 Q5,-23.6 0,-24.4 Q-5,-23.6 -9.8,-28 Z" fill="${f}" stroke="${cd}" stroke-width=".4"/>` + ln("M-6,-24 Q-6,-14 -2,-8 M6,-24 Q6,-14 2,-8 M0,-22 L0,-7", cd, 0.5, 'opacity=".6"') + ln("M-4.6,-22 Q-4.6,-13 -1.6,-8.6", cl, 0.5, 'opacity=".5"') +
      (L.b === "braid" ? [-3.2, 3.2].map((x) => ln(`M${x},-19 L${x},-8`, cd, 1.6) + ln(`M${x},-19 L${x},-8`, c, 1) + `<rect x="${x - 1.2}" y="-13" width="2.4" height="1.2" fill="${X.gold()}"/><rect x="${x - 1.2}" y="-9.5" width="2.4" height="1.2" fill="${X.gold()}"/>`).join("") : "") + `<path d="M-5,-25.8 Q0,-28 5,-25.8 Q2.5,-24.6 0,-24.8 Q-2.5,-24.6 -5,-25.8 Z" fill="${f}"/>`;
    return "";
  }
  function hat(L, X) {
    const hc = L.hc || L.c || "#6a6a6a", hd = sh(hc, 0.5), hl = hi(hc, 0.5);
    switch (L.hat) {
      case "wizard": { const f = X.cloth(hc); return `<path d="M-16.5,-37.5 Q0,-33 16.5,-37.5 Q0,-42.5 -16.5,-37.5 Z" fill="${f}" stroke="${hd}" stroke-width=".5"/><path d="M-9,-39.5 Q-3,-52 2,-62 Q6,-70 12,-70 Q6,-66 5,-56 Q6,-48 9.5,-39.5 Z" fill="${f}" stroke="${hd}" stroke-width=".5"/>` + ln("M-1,-42 Q-0.5,-50 1.5,-56", hd, 0.5, 'opacity=".55"') + ln("M-6.5,-41 Q-3,-48 -1,-53", hl, 0.6, 'opacity=".45"') + ln("M-8.5,-39.8 Q0,-37.5 9,-39.8", dk(hc, 0.5), 1.4); }
      case "tall": { const f = X.cloth(hc); return `<path d="M-14,-38 Q0,-34.5 14,-38 Q0,-41.5 -14,-38 Z" fill="${f}" stroke="${hd}" stroke-width=".4"/><path d="M-8,-39.5 L-7,-55 Q0,-57 7,-55 L8,-39.5 Z" fill="${f}" stroke="${hd}" stroke-width=".5"/>` + ln("M-5.5,-53 L-5,-42", hl, 1, 'opacity=".35"') + `<rect x="-7.6" y="-44.5" width="15.2" height="2.6" fill="${X.gold()}"/>` + ln("M6,-52 Q14,-60 10,-66", "#3a8a5a", 1.6) + ln("M7.5,-53 Q12,-58 11,-63", "#6ab080", 0.7); }
      case "crown": { const f = X.metal(hc); return `<path d="M-8.5,-41 L-8.5,-49 L-4.2,-44.5 L0,-51 L4.2,-44.5 L8.5,-49 L8.5,-41 Z" fill="${f}" stroke="${hd}" stroke-width=".5"/>` + ln("M-7.5,-42 L7.5,-42", hl, 0.6, 'opacity=".7"') + [-5, 0, 5].map((x) => `<circle cx="${x}" cy="-43" r="1" fill="${X.gem(L.gem || "#e04040")}"/>`).join("") + `<circle cx="0" cy="-50.6" r=".8" fill="${hl}"/>`; }
      case "circlet": return ln("M-11.8,-36.5 Q0,-40.8 11.8,-36.5", X.metal(hc), 1.5) + ln("M-10.5,-36.6 Q0,-40.4 10.5,-36.6", hl, 0.4, 'opacity=".7"') + `<path d="M0,-41.2 l1.6,2.2 l-1.6,2.2 l-1.6,-2.2 z" fill="${X.gem(L.gem || "#bfe8ff")}"/><circle cx="-0.4" cy="-39.6" r=".4" fill="#fff"/>`;
      case "helm": { const f = X.metal(hc); return `<path d="M-12.8,-30.5 Q-13,-45.5 0,-45.5 Q13,-45.5 12.8,-30.5 L9.6,-30.5 L9.6,-35.5 L-9.6,-35.5 L-9.6,-30.5 Z" fill="${f}" stroke="${hd}" stroke-width=".6"/>` + `<path d="M-1,-35.5 L1,-35.5 L0.6,-28 L-0.6,-28 Z" fill="${f}" stroke="${hd}" stroke-width=".4"/>` + ln("M0,-45.5 L0,-35.5", hd, 0.6) + ln("M-0.8,-44.5 L-0.8,-36.5", hl, 0.4, 'opacity=".8"') + ln("M-11.5,-36.5 Q0,-39.5 11.5,-36.5", hl, 0.7, 'opacity=".8"') + ln("M-11.8,-35.6 Q0,-38.4 11.8,-35.6", hd, 0.4) + `<ellipse cx="-5" cy="-41.5" rx="3" ry="1.6" fill="#fff" opacity=".35" transform="rotate(-30 -5 -41.5)"/>` + [-9, 0, 9].map((x) => `<circle cx="${x}" cy="-36.3" r=".55" fill="${hl}"/>`).join("") + (L.plume ? `<path d="M0,-45.5 Q-9,-54 -17,-42 Q-10,-48 -1,-43 Z" fill="${X.cloth(L.plume)}"/>` + ln("M-2,-45 Q-9,-49 -14,-44", sh(L.plume, 0.3), 0.5, 'opacity=".5"') : ""); }
      case "hood": { const f = X.cloth(hc); return `<path d="M-14.6,-30 Q-14.5,-47 0,-47 Q14.5,-47 14.6,-30 Q12,-41.5 0,-42.5 Q-12,-41.5 -14.6,-30 Z" fill="${f}" stroke="${hd}" stroke-width=".5"/>` + ln("M-13,-32 Q-11,-41 0,-42.5 Q11,-41 13,-32", sh(hc, 0.7), 1.2, 'opacity=".5"') + ln("M-10,-44 Q-4,-46.5 2,-46", hl, 0.7, 'opacity=".45"'); }
      default: return "";
    }
  }
  function person(L, X) {
    const s = L.s || "#f4d6b8", c = L.c || "#6b4a2a", t = L.t || "#c8b48a", bw = L.wide ? 11.5 : 9, armor = L.hat === "helm";
    const sd = sh(s, 0.45), cd = sh(c, 0.6);
    let o = item(L, false, X) + hairBack(L, X);
    if (L.hat === "hood") o += `<circle cx="0" cy="-31" r="14.6" fill="${X.cloth(L.hc || c)}"/>`;
    // 脚
    if (L.feet === "bare") o += `<ellipse cx="-4.8" cy="-1.5" rx="4.4" ry="2.1" fill="${X.skin(s)}" stroke="${sd}" stroke-width=".5"/><ellipse cx="4.8" cy="-1.5" rx="4.4" ry="2.1" fill="${X.skin(s)}" stroke="${sd}" stroke-width=".5"/>` + ln("M-7,-3 l1,-1.5 M-5,-3 l1,-1.5 M3,-3 l1,-1.5 M5,-3 l1,-1.5", L.h || INK, 0.8);
    else { const bc = L.feet === "boots" ? "#c8a030" : "#3a2a1a"; o += [-4, 4].map((x) => `<ellipse cx="${x}" cy="-1.4" rx="3.7" ry="2.1" fill="${X.cloth(bc)}" stroke="${sh(bc, 0.5)}" stroke-width=".4"/><ellipse cx="${x - 0.8}" cy="-2.4" rx="1.6" ry=".6" fill="${hi(bc, 0.5)}" opacity=".5"/>`).join(""); }
    // 斗篷
    o += `<path d="M-${bw},-2 Q-${bw + 1},-14 -6,-20 L6,-20 Q${bw + 1},-14 ${bw},-2 Z" fill="${X.cloth(c)}" stroke="${cd}" stroke-width=".6"/>`;
    o += ln(`M-${bw - 2.5},-3 Q-${bw - 2},-11 -5,-17 M${bw - 3},-3 Q${bw - 2.4},-11 ${bw - 6},-16`, sh(c, 0.55), 0.6, 'opacity=".55"') + ln(`M-${bw - 4.6},-3.4 Q-${bw - 4.4},-10 -4,-15.6`, hi(c, 0.5), 0.5, 'opacity=".5"');
    o += `<path d="M${bw - 5},-16 Q${bw - 1},-10 ${bw - 0.6},-3 L${bw},-2 Q${bw + 1},-14 6,-20 Z" fill="${sh(c, 0.6)}" opacity=".3"/>`;
    // 内衣 / 胸甲
    if (armor) { const mc = L.hc || "#9aa0a8"; o += `<path d="M-4,-20 L4,-20 L5,-2.5 L-5,-2.5 Z" fill="${X.metal(mc)}" stroke="${sh(mc, 0.5)}" stroke-width=".4"/>` + ln("M-2.5,-18 L-2.5,-5", hi(mc, 0.6), 0.6, 'opacity=".6"') + ln("M0,-19 L0,-4", sh(mc, 0.4), 0.4, 'opacity=".5"') + [-7.2, 7.2].map((x) => `<path d="M${x > 0 ? 5 : -5},-20 Q${x * 1.4},-21 ${x * 1.25},-15 Q${x},-16 ${x > 0 ? 4 : -4},-17 Z" fill="${X.metal(mc)}" stroke="${sh(mc, 0.5)}" stroke-width=".4"/>`).join(""); }
    else { o += `<path d="M-3.8,-20 L3.8,-20 L4.8,-2.5 L-4.8,-2.5 Z" fill="${X.cloth(t)}"/>` + ln("M0,-18 L0,-12", sh(t, 0.45), 0.5, 'opacity=".5"') + ln("M-2.2,-19 L-2.6,-5", hi(t, 0.4), 0.5, 'opacity=".4"'); }
    // 腰带 + 扣
    o += `<rect x="-5.4" y="-11.6" width="10.8" height="1.9" fill="#4a3018"/><rect x="-5.4" y="-11.6" width="10.8" height=".6" fill="${hi("#4a3018", 0.4)}" opacity=".6"/><rect x="-1.3" y="-11.9" width="2.6" height="2.5" rx=".4" fill="${X.gold()}" stroke="#3a2a0a" stroke-width=".25"/>`;
    // 手
    o += [-8.8, 8.8].map((x) => `<circle cx="${x}" cy="-10" r="2.6" fill="${X.skin(s)}" stroke="${sd}" stroke-width=".5"/>`).join("");
    // 脖子与头下阴影
    o += `<rect x="-3" y="-22" width="6" height="4" fill="${sh(s, 0.4)}"/><ellipse cx="0" cy="-19.5" rx="7" ry="2" fill="${cd}" opacity=".35"/>`;
    if (L.ear) o += `<path d="M-11,-33.5 L-17.5,-39 L-10.6,-28 Z" fill="${X.skin(s)}" stroke="${sd}" stroke-width=".5"/><path d="M11,-33.5 L17.5,-39 L10.6,-28 Z" fill="${X.skin(s)}" stroke="${sd}" stroke-width=".5"/>`;
    else o += `<ellipse cx="-11.6" cy="-30" rx="1.6" ry="2.2" fill="${X.skin(s)}" stroke="${sd}" stroke-width=".4"/><ellipse cx="11.6" cy="-30" rx="1.6" ry="2.2" fill="${X.skin(s)}" stroke="${sd}" stroke-width=".4"/>`;
    // 头
    o += `<circle cx="0" cy="-31" r="12" fill="${X.skin(s)}" stroke="${sd}" stroke-width=".7"/>` + `<path d="M6,-40 Q12.4,-33 7,-21.5 Q10,-29 6,-40 Z" fill="${sh(s, 0.5)}" opacity=".3"/><ellipse cx="-4" cy="-36" rx="4.5" ry="2.4" fill="${hi(s, 0.6)}" opacity=".35"/>`;
    o += face(L, X);
    o += beard(L, X) + hairFront(L, X) + hat(L, X);
    if (L.fl) o += `<circle cx="-9" cy="-39" r="2.2" fill="#f4f4ff"/><circle cx="-9" cy="-39" r=".9" fill="#f0d060"/><circle cx="-5" cy="-42" r="1.7" fill="#f4f4ff"/><circle cx="-5" cy="-42" r=".7" fill="#f0d060"/>`;
    o += item(L, true, X);
    return o;
  }
  const SP = {
    gollum: (L, X) => `<path d="M-7,-1 Q-9,-10 -5,-16 L5,-16 Q9,-10 7,-1 Z" fill="${X.skin("#c8c8a8")}" stroke="#6a6a58" stroke-width=".5"/><path d="M-5,-8 h10 l-1,4 h-8z" fill="#6a5a3a"/>` + ln("M-6,-12 L-12,-4 M6,-12 L12,-4 M-4,-1 L-7,0 M4,-1 L7,0", "#c0c0a0", 2.2) + ln("M-4,-6 Q0,-5 4,-6 M-3.5,-11 Q0,-10 3.5,-11", "#8a8a74", 0.5, 'opacity=".7"') +
      `<circle cx="0" cy="-27" r="11.5" fill="${X.skin("#d0d0b0")}" stroke="#6a6a58" stroke-width=".7"/><path d="M5,-36 Q12,-28 6,-17 Q9,-26 5,-36 Z" fill="#6a6a58" opacity=".35"/><ellipse cx="-4.5" cy="-27" rx="3.8" ry="4.2" fill="#eef6ff" stroke="#6a6a58" stroke-width=".4"/><ellipse cx="4.5" cy="-27" rx="3.8" ry="4.2" fill="#eef6ff" stroke="#6a6a58" stroke-width=".4"/><circle cx="-4" cy="-26.5" r="2.2" fill="${X.gem("#5a9ab8")}"/><circle cx="5" cy="-26.5" r="2.2" fill="${X.gem("#5a9ab8")}"/><circle cx="-4" cy="-26.5" r="1.1" fill="#0a1418"/><circle cx="5" cy="-26.5" r="1.1" fill="#0a1418"/><circle cx="-3.2" cy="-27.6" r=".6" fill="#fff"/><circle cx="5.8" cy="-27.6" r=".6" fill="#fff"/>` +
      ln("M-2,-38 Q-1,-42 0,-38.5 M2,-38 Q4,-42 4,-38 M-4,-37.5 Q-5,-41 -3,-38.5", "#555", 0.6) + `<path d="M-11,-30 L-17,-34 L-11,-25 Z M11,-30 L17,-34 L11,-25 Z" fill="${X.skin("#d0d0b0")}" stroke="#6a6a58" stroke-width=".5"/>` + ln("M-2.5,-20.5 Q0,-19 2.5,-20.5", INK, 0.6) + `<rect x="-1.4" y="-20.6" width="1" height="1.2" fill="#f4f0d8"/><rect x="0.6" y="-20.6" width="1" height="1.2" fill="#f4f0d8"/>`,
    wraith: (L, X) => `<path d="M-11.5,0 Q-12.5,-20 -10.5,-34 Q-8,-48 0,-49 Q8,-48 10.5,-34 Q12.5,-20 11.5,0 L7,-3 L3.5,0 L0,-3 L-3.5,0 L-7,-3 Z" fill="${X.cloth("#1a1416")}" stroke="#3a3030" stroke-width=".6"/>` + ln("M-7,-30 Q-8,-14 -7.5,-2 M7,-30 Q8,-14 7.5,-2 M0,-20 L0,-3", "#0a0608", 0.7, 'opacity=".8"') + ln("M-4,-32 Q-4.5,-16 -4,-4", "#4a4044", 0.5, 'opacity=".5"') +
      `<ellipse cx="0" cy="-33" rx="7" ry="8" fill="#000"/><circle cx="-2.7" cy="-33" r="1.3" fill="#ff3a2a" class="glowit"/><circle cx="2.7" cy="-33" r="1.3" fill="#ff3a2a" class="glowit"/>` + `<path d="M9.2,-12 L15.8,-30 L17.2,-29.6 L10.8,-11.4 Z" fill="${X.metal("#9aa0a8")}" stroke="#222" stroke-width=".3"/>` + ln("M7,-13.5 L12.5,-9.5", "#3a3a40", 1.5) +
      (L.crown ? `<path d="M-7,-45 L-7,-52 L-3.5,-47.5 L0,-54 L3.5,-47.5 L7,-52 L7,-45 Z" fill="${X.metal("#8a8a90")}" stroke="#1a1a1a" stroke-width=".5"/>` + ln("M-6,-46 L6,-46", "#d8d8e0", 0.4, 'opacity=".6"') : ""),
    eye: (L, X) => `<path d="M-12,0 L-7,-28 L7,-28 L12,0 Z" fill="${X.cloth("#1a1210")}" stroke="#000" stroke-width=".6"/><path d="M-7,-28 L-10,-34 M7,-28 L10,-34" stroke="#1a1210" stroke-width="2.5"/>` + ln("M-4,-2 L-1,-26", "#3a3028", 0.6, 'opacity=".6"') +
      `<ellipse cx="0" cy="-42" rx="18" ry="11" fill="#ff7a1a" opacity=".35" class="glowit"/><path d="M-15,-42 Q0,-55 15,-42 Q0,-29 -15,-42 Z" fill="#ffa030" stroke="#c03a10" stroke-width=".8"/><path d="M-9,-42 Q0,-50 9,-42 Q0,-34 -9,-42 Z" fill="#ffd060"/><ellipse cx="0" cy="-42" rx="2.2" ry="7" fill="#1a0500"/>`,
    dragon: (L, X) => { const c1 = L.c || "#b0342a", c2 = L.c2 || "#e0a040", cd = sh(c1, 0.5); return `<path d="M-4,-17 L-20,-36 L-15,-25 L-23,-27 L-14,-17 Z" fill="${X.cloth(c2)}" stroke="${cd}" stroke-width=".5" opacity="${c1 === "#c9a23a" ? 0 : 1}"/>` + (c1 === "#c9a23a" ? "" : ln("M-6,-19 L-16,-31 M-8,-18 L-18,-25", dk(c2, 0.4), 0.5)) +
      `<path d="M-16,-3 Q-21,-15 -8,-17 Q4,-19 6,-9 Q8,-1 18,-4" fill="none" stroke="${cd}" stroke-width="9" stroke-linecap="round"/><path d="M-16,-3 Q-21,-15 -8,-17 Q4,-19 6,-9 Q8,-1 18,-4" fill="none" stroke="${X.cloth(c1)}" stroke-width="7.4" stroke-linecap="round"/><path d="M-16,-4 Q-20,-14 -8,-16 Q3,-18 5,-9" fill="none" stroke="${hi(c1, 0.4)}" stroke-width="1.6" stroke-linecap="round" opacity=".5"/><path d="M-16,-3 Q-21,-15 -8,-17 Q4,-19 6,-9 Q8,-1 18,-4" fill="none" stroke="${c2}" stroke-width="2" stroke-dasharray="1.6 2.6" opacity=".8"/>` +
      `<ellipse cx="7" cy="-26" rx="10" ry="7.5" fill="${X.skin(c1)}" stroke="${cd}" stroke-width=".6"/><path d="M12,-20 Q16,-19 17,-23 Q14,-20 12,-20Z" fill="${dk(c1, 0.3)}"/><path d="M2,-32 L-1,-40 L5,-33 M9,-32.5 L10,-41 L12,-32" fill="${X.cloth(c2)}" stroke="${cd}" stroke-width=".5"/><ellipse cx="10" cy="-27.5" rx="2.2" ry="1.9" fill="${X.gem("#ffe040")}"/><ellipse cx="10.2" cy="-27.5" rx=".6" ry="1.5" fill="#000"/><circle cx="9.4" cy="-28.4" r=".5" fill="#fff"/>` + ln("M3,-22 q3,2 6,0 M3,-25 q3,1.5 6,0", cd, 0.5, 'opacity=".6"') +
      `<circle cx="16" cy="-23" r=".9" fill="${INK}"/>` + (c1 === "#b0342a" ? `<path d="M17,-22 Q24,-22 30,-17 Q24,-19 19,-19" fill="#ffa030" opacity=".8" class="glowit"/><path d="M18,-21.5 Q23,-21.5 27,-18.5" fill="#ffe060" opacity=".8" class="glowit"/>` : ""); },
    balrog: (L, X) => `<path d="M-6,-24 L-24,-42 L-18,-28 L-26,-30 L-12,-16 Z M6,-24 L24,-42 L18,-28 L26,-30 L12,-16 Z" fill="${X.cloth("#1a0c08")}" stroke="#4a1a0a" stroke-width=".6"/>` + ln("M-8,-22 L-20,-36 M8,-22 L20,-36", "#3a1a10", 0.5) +
      `<path d="M-11,0 Q-13,-18 -9,-26 L9,-26 Q13,-18 11,0 Z" fill="${X.skin("#2a1410")}" stroke="#000" stroke-width=".7"/><path d="M-9,-28 Q-12,-46 -4,-50 Q-2,-44 0,-52 Q3,-45 5,-50 Q12,-44 9,-28 Z" fill="#ff6a1a" opacity=".85" class="glowit"/><path d="M-5,-30 Q-6,-42 -2,-46 Q0,-40 2,-46 Q6,-42 5,-30 Z" fill="#ffd040" opacity=".8" class="glowit"/>` + ln("M-5,-4 L-6,-20 M5,-4 L6,-20", "#ff7020", 0.8, 'opacity=".6"') +
      `<circle cx="0" cy="-31" r="9.5" fill="${X.skin("#2a1410")}" stroke="#000" stroke-width=".7"/><path d="M-6,-38 L-10,-46 L-3,-39 M6,-38 L10,-46 L3,-39" stroke="#1a0c08" stroke-width="2" fill="none"/><ellipse cx="-3.3" cy="-31" rx="1.9" ry="1.2" fill="#ffd040" class="glowit"/><ellipse cx="3.3" cy="-31" rx="1.9" ry="1.2" fill="#ffd040" class="glowit"/>` + ln("M-3,-26 Q0,-24.5 3,-26", "#ffb040", 0.8) +
      ln("M10,-12 Q22,-6 18,6", "#ff8a2a", 1.6) + ln("M10,-12 Q22,-6 18,6", "#ffe080", 0.6, 'opacity=".7"'),
    ent: (L, X) => `<path d="M-8.5,0 L-7,-30 L7,-30 L8.5,0 L4,-1 L2,0 L-2,-1 Z" fill="${X.cloth("#6a4a2a")}" stroke="#3a2414" stroke-width=".7"/>` + ln("M-4,-4 L-3,-26 M3,-6 L2.5,-24 M0,-3 L0,-27", "#4a3018", 0.6) + ln("M-5.5,-5 L-5,-24", hi("#6a4a2a", 0.4), 0.5, 'opacity=".5"') +
      ln("M-7,-18 L-16,-26 L-19,-24 M7,-18 L16,-28 L19,-26", "#6a4a2a", 2.2) + ln("M-9,-20 L-15,-25 M9,-20 L15,-27", "#4a3018", 0.6) +
      [[-9, -36, 8], [0, -44, 9], [9, -36, 8], [0, -34, 7], [-14, -29, 4.5], [14, -30, 4.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${X.skin("#5f7a33")}" stroke="#3a4a1a" stroke-width=".5"/>`).join("") + [[-11, -38], [-2, -46], [7, -39], [12, -31]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.2" fill="#8ab050" opacity=".8" transform="rotate(-30 ${x} ${y})"/>`).join("") +
      `<ellipse cx="-3" cy="-22" rx="1.5" ry="1.9" fill="#1a1a10"/><ellipse cx="3" cy="-22" rx="1.5" ry="1.9" fill="#1a1a10"/><circle cx="-2.6" cy="-22.6" r=".55" fill="#c8e0a0"/><circle cx="3.4" cy="-22.6" r=".55" fill="#c8e0a0"/>` + ln("M-5,-25 Q-3,-26 -1,-25 M1,-25 Q3,-26 5,-25", "#3a2414", 0.8) +
      `<path d="M-4,-18 Q-4,-9 0,-7 Q4,-9 4,-18 Q0,-16 -4,-18 Z" fill="${X.cloth("#8a9a5a")}" opacity=".9"/>` + ln("M-2,-16 L-1.5,-9 M2,-16 L1.5,-9", "#5a6a3a", 0.4),
    spider: (L, X) => [-1, 1].map((k) => [0, 1, 2, 3].map((i) => ln(`M${k * 5},${-10 + i * 2} Q${k * (16 + i * 2)},${-22 + i * 5} ${k * (20 + i)},${-2 + i}`, "#1a1410", 1.7) + ln(`M${k * 5},${-10 + i * 2} Q${k * (16 + i * 2)},${-22 + i * 5} ${k * (20 + i)},${-2 + i}`, "#4a4050", 0.5, 'opacity=".5" transform="translate(0,-.5)"')).join("")).join("") +
      `<ellipse cx="0" cy="-14" rx="11" ry="9" fill="${X.skin("#1e1a22")}" stroke="#000" stroke-width=".6"/><ellipse cx="-3" cy="-17" rx="4" ry="2.4" fill="#5a5060" opacity=".4"/><circle cx="0" cy="-24" r="6" fill="${X.skin("#24202a")}"/>` + [[-2.5, -25, 1.1], [2.5, -25, 1.1], [-1.2, -27.5, 0.8], [1.2, -27.5, 0.8], [-4, -22.5, 0.6], [4, -22.5, 0.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#9ae060"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.3}" fill="#fff"/>`).join("") + `<path d="M-2,-20 l-1,3 l1.5,-1 z M2,-20 l1,3 l-1.5,-1 z" fill="#c8c8b0"/>`,
    morgoth: (L, X) => `<path d="M-14,0 Q-16,-16 -10,-24 L10,-24 Q16,-16 14,0 Z" fill="${X.cloth("#141018")}" stroke="#000" stroke-width=".8"/>` + ln("M-9,-2 Q-10,-14 -7,-21 M9,-2 Q10,-14 7,-21", "#000", 0.7, 'opacity=".8"') + `<path d="M-3.5,-22 L3.5,-22 L4.5,-2 L-4.5,-2 Z" fill="${X.metal("#2a2430")}"/><path d="M-10,-24 Q-15,-26 -16,-19 Q-12,-21 -8,-20 Z M10,-24 Q15,-26 16,-19 Q12,-21 8,-20 Z" fill="${X.metal("#2a2430")}" stroke="#000" stroke-width=".5"/>` +
      ln("M12,-6 L18,-36", "#3a3a40", 2.6) + ln("M12.5,-7 L18,-34", "#6a6a74", 0.6, 'opacity=".5"') + `<rect x="13" y="-42" width="11" height="8" rx="1.5" fill="${X.metal("#3a3a40")}" stroke="#000" stroke-width=".6" transform="rotate(18 18 -38)"/><rect x="14.5" y="-40.5" width="8" height="1" fill="#6a6a74" opacity=".6" transform="rotate(18 18 -38)"/>` +
      `<circle cx="0" cy="-33" r="11" fill="${X.skin("#c8c0b8")}" stroke="#000" stroke-width=".8"/><path d="M-11,-35 Q-11,-46 0,-46 Q11,-46 11,-35 L8,-35 L8,-30 L-8,-30 L-8,-35 Z" fill="${X.metal("#1a1a20")}"/>` + ln("M-9,-38 Q0,-41 9,-38", "#5a5a68", 0.5, 'opacity=".6"') +
      `<ellipse cx="-3.8" cy="-31.5" rx="1.7" ry="1.3" fill="#ff3a2a" class="glowit"/><ellipse cx="3.8" cy="-31.5" rx="1.7" ry="1.3" fill="#ff3a2a" class="glowit"/>` +
      `<path d="M-10,-44 L-10,-54 L-5,-48 L0,-57 L5,-48 L10,-54 L10,-44 Z" fill="${X.metal("#2a2a30")}" stroke="#000" stroke-width=".6"/>` + [-6, 0, 6].map((x) => `<circle cx="${x}" cy="-47.5" r="2.4" fill="#fffbe0" opacity=".3" class="glowit"/><circle cx="${x}" cy="-47.5" r="1.3" fill="#fffbe0" class="glowit"/>`).join(""),
    sauron: (L, X) => `<path d="M-11,0 Q-13,-14 -8,-21 L8,-21 Q13,-14 11,0 Z" fill="${X.cloth("#1a1416")}" stroke="#000" stroke-width=".7"/>` + ln("M-6,-2 Q-7,-12 -5,-19 M6,-2 Q7,-12 5,-19", "#000", 0.6, 'opacity=".8"') + `<path d="M-8,-21 L-13,-26 L-8,-16 M8,-21 L13,-26 L8,-16" fill="${X.metal("#2a2428")}" stroke="#000" stroke-width=".5"/><path d="M-3,-21 L3,-21 L3.5,-5 L-3.5,-5 Z" fill="${X.metal("#2a2428")}"/>` +
      ln("M10,-8 L15,-30", "#3a3a40", 2.2) + `<circle cx="15.5" cy="-31.5" r="3.6" fill="${X.metal("#2a2a30")}" stroke="#000" stroke-width=".5"/><path d="M15.5,-35 l1,2 l-1,2 l-1,-2z" fill="#6a6a74"/>` +
      `<path d="M-12,-30 Q-12.5,-45 0,-46 Q12.5,-45 12,-30 Q12,-21 0,-20 Q-12,-21 -12,-30 Z" fill="${X.metal("#2a2428")}" stroke="#000" stroke-width=".8"/>` + ln("M-9,-28 Q-9,-40 -2,-43", "#6a6070", 0.6, 'opacity=".5"') +
      `<path d="M-9,-44 L-12,-56 L-5,-46 L0,-59 L5,-46 L12,-56 L9,-44 Z" fill="${X.metal("#1a1416")}" stroke="#000" stroke-width=".5"/><path d="M-7,-32 L-2,-30 M7,-32 L2,-30" stroke="#ff8a2a" stroke-width="2" stroke-linecap="round" class="glowit"/><ellipse cx="0" cy="-31" rx="8" ry="3" fill="#ff6a10" opacity=".2" class="glowit"/>` +
      `<circle cx="-9" cy="-10" r="2.2" fill="#ffd040" opacity=".3"/><circle cx="-9" cy="-10" r="1.4" fill="none" stroke="${X.gold()}" stroke-width=".9"/>`
  };
  function HORSE(c = "#7a5a3a") {
    const X = ctx(), cd = sh(c, 0.55), cl = hi(c, 0.4);
    return `<g class="horse">${X.D.join("")}` + ln("M-9,-4 L-10,6 M-4,-4 L-4,6 M5,-4 L6,6 M10,-4 L11,6", "#2a1810", 2.2) + ln("M-9,-4 L-10,6 M-4,-4 L-4,6 M5,-4 L6,6 M10,-4 L11,6", mix(c, "#000", 0.25), 1.2) + [-10, -4, 6, 11].map((x) => `<ellipse cx="${x}" cy="6.3" rx="1.4" ry=".7" fill="#1a1008"/>`).join("") +
      `<ellipse cx="0" cy="-6" rx="13" ry="6.5" fill="${X.cloth(c)}" stroke="${cd}" stroke-width=".6"/><ellipse cx="-3" cy="-8.5" rx="6" ry="2.4" fill="${cl}" opacity=".35"/><path d="M-6,-12 Q0,-14 6,-12 L6,-6 Q0,-5 -6,-6 Z" fill="${X.cloth("#8a2a1a")}" stroke="#4a1a0a" stroke-width=".4"/><path d="M-5,-6 L-5,-1 M5,-6 L5,-1" stroke="#4a2a14" stroke-width=".8"/>` +
      `<path d="M9,-9 Q14,-20 18,-21 Q22,-20 22,-16 L16,-12 Z" fill="${X.cloth(c)}" stroke="${cd}" stroke-width=".6"/><path d="M11,-12 Q13,-20 18,-21 Q14,-21 10,-17 Z" fill="${cd}"/><path d="M17.5,-22 l1,-2.5 l1.5,2.2z" fill="${cd}"/>` + ln("M13,-10 Q17,-11 19,-14", "#3a2414", 0.5, 'opacity=".7"') +
      ln("M-13,-7 Q-19,-3 -17,4", "#2a1810", 2.4) + ln("M-13,-7 Q-19,-3 -17,4", cd, 1.2) + `<circle cx="18.5" cy="-18" r="1" fill="#000"/><circle cx="18.2" cy="-18.3" r=".35" fill="#fff"/><circle cx="21.4" cy="-16.6" r=".4" fill="${cd}"/></g>`;
  }
  function chibi(L) {
    const sz = L.sz || 1, X = ctx();
    const body = L.sp ? SP[L.sp](L, X) : person(L, X);
    return `<g transform="scale(${sz})">${X.D.join("")}<ellipse cx="0" cy="0" rx="10" ry="2.6" fill="#000" opacity=".22"/><ellipse cx="0" cy=".2" rx="6" ry="1.4" fill="#000" opacity=".2"/>${body}</g>`;
  }
  chibi.horse = HORSE;
  chibi.sail = `<path d="M1,-64 L1,-4 L26,-10 Q20,-38 1,-64 Z" fill="#f4ecd6" stroke="#5a4326" stroke-width=".8"/><path d="M3,-56 Q16,-40 22,-12 L3,-8 Z" fill="#d8ccb0" opacity=".45"/><path d="M2,-60 L2,-6" stroke="#fff" stroke-width=".8" opacity=".6"/>`;
  chibi.hull = `<path d="M-30,-4 L32,-4 L24,7 L-24,7 Z" fill="#7a5a3a" stroke="#3a2414" stroke-width=".8"/><path d="M-30,-4 L32,-4 L30,-1 L-28,-1 Z" fill="#9a7a52"/><path d="M-26,-1 H28" stroke="#c8a870" stroke-width="1"/><path d="M-27,2 H26 M-25,5 H24" stroke="#4a3018" stroke-width=".5" opacity=".6"/>`;
  return chibi;
})();
