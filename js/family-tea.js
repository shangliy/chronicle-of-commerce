/* 店报样板 · 山海茶事（小商家版示例：一家武夷山制茶人家的四十年，人物与店名均为虚构）
   数据结构与家族版相同：SITE / ERAS / EVENTS / STORIES / FAMILY，另加 cta（购买或引流卡）。
   任何一站、一个专题或整份报纸都可以挂 cta：{ label, note, price, link, wechat }。
   用 studio.html「店报工坊」可以不写代码直接生成这样的文件。 */
window.SITE = {
  name: "山海茶事",
  title: "山海茶事", en: "Shanhai Tea Chronicle", period: "1984 — 2026", price: "定价：一泡肉桂",
  kicker: "商海时报 · 店报样板", masthead: "山海茶事",
  min: 1984, max: 2026, gamma: 1,
  ticks: [1984, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2026], minorTicks: [1995, 2005, 2015],
  play: "播放四十年茶事", replay: "↺ 重看四十年",
  eventLane: "时代背景",
  empty: ["茶山还在雾里", "请按“播放”，看林阿公把第一担茶挑下山。"],
  end: "四十年，三代人，一泡茶。谢谢你翻到这里。",
  quiz: [1984, 2026],
  colophon: "本报为「店报工坊」样板，店名与人物均为虚构，照片来自 Wikimedia Commons（作者与许可见各图图注）。换成你的店：打开 studio.html，填五个问题即可。",
  cta: { label: "林氏岩茶 · 老丛水仙礼盒", note: "你手里扫码翻开本报的那一盒", price: "¥ 368", link: "https://example.com/shanhai-tea", wechat: "shanhai_tea" }
};

window.ERAS = [
  { start: 1984, end: 1993, name: "包山", color: "#8a5a2b", desc: "茶山分到各家各户，林阿公承包了村后最老的一片水仙，开始自己做茶。" },
  { start: 1993, end: 2004, name: "山门", color: "#2f5d8a", desc: "在武夷山市开出第一家门面，潮汕客商来了，茶从山里走到了街上。" },
  { start: 2004, end: 2013, name: "岩骨", color: "#9e2a1f", desc: "大红袍热起来又退潮，林家守着炭焙与老丛，在斗茶赛上拿下金奖。" },
  { start: 2013, end: 2020, name: "上网", color: "#a07a2c", desc: "第三代回乡开网店，高铁通到山脚，老客人搬进了微信群。" },
  { start: 2020, end: 2027, name: "新枝", color: "#4e7a3a", desc: "直播、溯源礼盒、茶山民宿；这一份可以翻页的店报，也是新枝之一。" }
];

window.EVENTS = [
  { year: 1992, place: "深圳", img: "1992年邓小平植树 3471.jpg", title: "南方谈话", text: "邓小平南巡。那一年全国个体工商户大增，武夷山脚下也开始有人把自家做的茶拿到街上卖。" },
  { year: 1999, place: "武夷山", img: "Wuyi Mountains Sea of clouds 4.jpg", title: "武夷山列入世界遗产", text: "武夷山成为世界文化与自然双重遗产，游客涌入九曲溪，“岩茶”两个字第一次被全国人听见。" },
  { year: 2003, place: "杭州", img: "TaobaoCity Alibaba Xixi Park.jpg", title: "淘宝上线", text: "一个叫淘宝的网站在杭州上线。十年后，它会把林家的茶卖到从没来过武夷山的人手里。" },
  { year: 2008, place: "北京", img: "2008 Summer Olympics opening ceremony - Fireworks.jpg", title: "北京奥运", text: "奥运年，送礼讲究“国货”“国礼”，大红袍价格一路飞涨，武夷山来了很多拿现金的生客。" },
  { year: 2011, place: "深圳", img: "China Jinan Lady with phone 5196971.jpg", title: "微信上线", text: "微信诞生。此后十年，中国小店最重要的收银台和会客厅，都搬进了这个绿色图标里。" },
  { year: 2015, place: "武夷山", img: "CRH2 Model Chinese high speed rail train passing Lianjiang Railway Station, Fujian.jpg", title: "合福高铁通车", text: "合福高铁通到武夷山北站。从上海到茶山，从一夜卧铺变成四个小时。" },
  { year: 2016, place: "杭州", img: "G20 2016 leaders.jpg", title: "直播元年", text: "G20 在杭州召开的这一年，淘宝直播、快手、抖音相继起步，“边看边买”成了新的赶集。" },
  { year: 2020, place: "武汉", img: "Wuhan Metro requests passengers to wear masks throughout their journeys during COVID-19 pandemic.jpg", title: "疫情", text: "门店关了四十天，游客消失了一整年。能活下来的小店，几乎都在那一年学会了对着手机说话。" }
];

window.STORIES = [
  {
    id: "shan", title: "岩骨：三代人的制茶手艺", subtitle: "从承包老茶山到父子同焙", tags: ["制茶", "手艺", "非遗"], color: "#8a5a2b",
    cta: { label: "老丛水仙 · 2024 年炭焙", note: "本专题里焙出来的那一批", price: "¥ 268 / 250g", link: "https://example.com/shanhai-tea/laocong", wechat: "shanhai_tea" },
    steps: [
      { year: 1984, place: "武夷山", img: "武夷山茶园.JPG", title: "承包老茶山", text: "茶山分到各家各户。林阿公林德水挑了村后那片没人要的老水仙——树龄六十年，产量低，但他说“老树的根扎得深，味道不会骗人”。", lesson: "别人嫌麻烦的地方，往往就是你的护城河。" },
      { year: 1988, place: "慧苑坑", img: "深山茶园 - Tea Garden in Remote Mountains - 2015.08 - panoramio.jpg", title: "第一担茶下山", text: "第一批自己做的老丛水仙挑到镇上，一斤卖八块钱。买家是供销社的老采购，喝完一泡，把整担都留下了。", lesson: "第一个客户是用一泡茶谈下来的，不是用价格。" },
      { year: 1996, place: "做青房", img: "Oolong tea leaves - character for tea in Chinese.jpg", title: "看青做青", text: "儿子林茂山接手做青。岩茶的香气从摇青那一夜开始决定：天气、青叶、火候都在变，“看青做青，看天做茶”，没有一张配方管用。", lesson: "手艺的本质是判断力，不是流程。" },
      { year: 2006, place: "焙坊", img: "Tea Roasting (37995430594).jpg", title: "守住炭焙", text: "村里纷纷换电焙，省人工省时间。林家留下了炭焙房：一炉荔枝炭，三道文火，一焙七天。那年产量少了三成，回头客多了一倍。", lesson: "效率能复制，耐心复制不了。" },
      { year: 2010, place: "武夷山", img: "Da Hong Pao Oolong tea leaf close.jpg", title: "斗茶赛金奖", text: "林茂山的老丛水仙在武夷山民间斗茶赛上拿下金奖。评语是“岩骨花香，汤水有骨”。奖杯摆在店里，比任何广告都管用。", lesson: "公开的第三方背书，是小店最便宜的广告。" },
      { year: 2019, place: "武夷山", img: "Wuyi oolong tea.jpg", title: "长孙回焙坊", text: "在厦门做了几年设计的长孙林岩回到焙坊，跟着父亲学看火。第一年焙坏了两批茶，第二年开始，老客人说“焙火的味道回来了”。", lesson: "传承不是传秘方，是让下一代也犯一遍错。" },
      { year: 2024, place: "焙坊", img: "Jin Jun Mei tea.jpg", title: "父子同焙", text: "父子二人同焙一批老丛，一半按父亲的火、一半按儿子的火，装进同一个礼盒。买的人自己评，店里只写“不告诉你哪泡是谁焙的”。", lesson: "把分歧做成产品，比争出对错更值钱。", cta: { label: "父子同焙 · 盲品双罐", note: "两种火功，各 125g", price: "¥ 298", link: "https://example.com/shanhai-tea/duo" } }
    ]
  },
  {
    id: "men", title: "山门：从茶山到街上的店", subtitle: "一家门面，两代掌柜", tags: ["门店", "客商", "茶旅"], color: "#2f5d8a",
    steps: [
      { year: 1993, place: "武夷山市", img: "白花岩上看武夷山市 - Wuyishan City Viewed from Baihua Rock - 2015.11 - panoramio.jpg", title: "第一家门面", text: "南方谈话后的第二年，林茂山在武夷山市租下一间十二平米的门面，招牌是找镇上写春联的先生写的四个字：林氏岩茶。", lesson: "门店是信用的地址：有地方能找到你，生意才开始。" },
      { year: 1998, place: "潮州", img: "Teochew Kanghu tea.jpg", title: "潮汕客商", text: "第一批大客户是潮汕来的茶商。他们用工夫茶的小杯一泡一泡试，试了三天，定下每年两百斤。此后二十年，潮汕一直是林家最稳的销路。", lesson: "最挑剔的客户，往往是最忠诚的客户。" },
      { year: 2002, place: "厦门", img: "Xiamen - View from GulangYu 20091120.jpg", title: "厦门分号", text: "女儿林茂兰在厦门开了分号，面向写字楼和外贸公司。茶从“山里带下来的土产”，第一次被装进了印着店名的罐子。", lesson: "换一座城市，就得换一种讲法。" },
      { year: 2007, place: "武夷山", img: "大红袍 - Dahongpao(Big Red Robe Tea) on the Cliff - 2010.09 - panoramio.jpg", title: "大红袍热", text: "大红袍价格飞涨，拿现金的生客排到店门口。林家不涨价、不囤货，只对老客限量供应。隔壁店一年赚了十年的钱，也在三年后关了门。", lesson: "风口上最难的，是不接风口的钱。" },
      { year: 2012, place: "武夷山", img: "大红袍祖庭 - Place of Worship for Dahongpao(Big Red Robe Tea) - 2010.09 - panoramio.jpg", title: "退潮之后", text: "礼品茶市场骤冷，大红袍从神坛上下来。林家门店生意反而稳了：喝茶的人留下了，送礼的人走了。", lesson: "潮水退了才知道，谁的客户是真的喝茶。" },
      { year: 2018, place: "武夷山", img: "Yixing ware teapot and Lapsang tea.jpg", title: "茶席与紫砂", text: "门店搬到临溪的老宅，增加了茶席、紫砂和短课。客人不再只是买茶，而是坐下来喝一泡、学一手、再带两罐走。", lesson: "让客人多坐十分钟，客单价和复购都会跟着来。", cta: { label: "山海茶席 · 入门套组", note: "紫砂壶 + 品茗杯 + 两泡老丛", price: "¥ 580", link: "https://example.com/shanhai-tea/set" } },
      { year: 2023, place: "慧苑坑", img: "Wuyi Mountains Sea of clouds.jpg", title: "茶山一日", text: "把老宅后面的三间房改成民宿，推出“茶山一日”：清晨采青、午后看焙、晚上一泡刚出炉的茶。来过的客人，第二年几乎都回来了。", lesson: "体验是最贵的广告，也是最便宜的会员制。", cta: { label: "茶山一日 · 民宿体验", note: "采青、看焙、晚茶，含一宿", price: "¥ 880 / 人", link: "https://example.com/shanhai-tea/stay", wechat: "shanhai_tea" } }
    ]
  },
  {
    id: "xin", title: "新枝：第三代把茶搬上网", subtitle: "淘宝、微信群、直播间与礼盒", tags: ["电商", "直播", "礼盒"], color: "#4e7a3a",
    steps: [
      { year: 2013, place: "杭州 → 武夷山", img: "Alibaba group Headquarters.jpg", title: "孙女回乡开网店", text: "孙女林小满从杭州毕业回乡，开了林家的淘宝店。第一个月卖出十一单，其中九单是亲戚。第二年，陌生人的订单超过了潮汕老客。", lesson: "网店的前一百单靠熟人，后一万单靠前一百单的评价。" },
      { year: 2015, place: "武夷山北站", img: "CRH2 Model Chinese high speed rail train passing Lianjiang Railway Station, Fujian.jpg", title: "四十八小时到杯", text: "高铁通车，快递提速。林家推出“焙火第七天发货”：茶一下焙就寄，四十八小时内到客人杯里。", lesson: "物流变快的时候，第一个改变承诺的人拿走增量。" },
      { year: 2017, place: "微信群", img: "China Jinan Lady with phone 5196971.jpg", title: "老客搬进群里", text: "三百位老客进了微信群。每年春茶开采、焙火开炉，林小满在群里直播一张照片，二十分钟卖完当天的量。", lesson: "三百个真正喝茶的人，比三万个粉丝值钱。" },
      { year: 2020, place: "直播间", img: "Kung fu cha - Shanghai - 2013-08-15 - 1411.jpg", title: "对着手机泡茶", text: "疫情封店。林小满把茶席搬到手机前，每晚八点泡茶一小时，不喊“上链接”，只讲这泡茶是哪片山、哪天焙的。四十天，补回了门店两个月的营业额。", lesson: "直播卖的不是折扣，是“有人在那头认真做事”。" },
      { year: 2022, place: "武夷山", img: "Oolong Tea wrapped tea balls.jpg", title: "溯源礼盒", text: "每盒茶印一个二维码：扫开是这批茶的山场、采摘日、焙火日和焙茶人。退货率降到了千分之三，送礼的人说“这盒茶会讲话”。", lesson: "包装上的二维码，是小店最便宜的品牌官网。", cta: { label: "溯源礼盒 · 老丛水仙", note: "扫码即可翻阅本报", price: "¥ 368", link: "https://example.com/shanhai-tea", wechat: "shanhai_tea" } },
      { year: 2026, place: "武夷山", img: "Tea garden building of Mt Wuyi.jpg", title: "本报创刊", text: "四十年后，林家把三代人的故事做成了这份可以翻页的店报，印在礼盒的二维码里。你现在读到的，就是创刊号。", lesson: "讲清楚自己是谁，是小店能卖出溢价的全部理由。" }
    ]
  }
];

/* 家谱：三代七人（虚构）。branch 对应上面专题的 id，决定颜色 */
window.FAMILY = [
  { id: "deshui", name: "林德水", born: 1932, died: 2015, branch: "shan", note: "阿公。1984 年承包老茶山，林家岩茶的起点。" },
  { id: "maoshan", parent: "deshui", name: "林茂山", born: 1958, branch: "shan", note: "第二代掌柜。看青做青、守住炭焙，2010 年斗茶赛金奖。" },
  { id: "maolan", parent: "deshui", name: "林茂兰", born: 1962, branch: "men", note: "厦门分号主理人，把茶装进了印着店名的罐子。" },
  { id: "yan", parent: "maoshan", name: "林岩", born: 1988, branch: "shan", note: "长孙。做过设计，2019 年回焙坊学火。" },
  { id: "xiaoman", parent: "maoshan", name: "林小满", born: 1990, branch: "xin", note: "孙女。2013 年回乡开网店，微信群与直播间的主播。" },
  { id: "yichuan", parent: "maolan", name: "陈一川", born: 1995, branch: "men", note: "外孙。负责老宅门店与茶山民宿。" },
  { id: "tuantuan", parent: "xiaoman", name: "林团团", born: 2021, branch: "xin", note: "第四代。还不会喝茶，已经会把茶罐当鼓敲。" }
];
