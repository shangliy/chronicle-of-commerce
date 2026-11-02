/* 家族版 · 罗斯柴尔德（数据与主报同构：ERAS / EVENTS / STORIES，另加 SITE 与 FAMILY 家谱）
   换成别的家族或品牌：复制本文件，改内容，再在 family.html 里换掉 <script src>。 */
window.SITE = {
  name: "罗斯柴尔德家报",
  min: 1744, max: 2026, gamma: 1.1,
  ticks: [1744, 1800, 1850, 1900, 1950, 2000, 2026], minorTicks: [1850, 1950],
  play: "播放家族二百八十年", replay: "↺ 重看家族史",
  eventLane: "世界大事",
  empty: ["家族尚未登场", "请按“播放”，看梅耶·阿姆谢尔从犹太巷出发。"],
  end: "五支箭，二百八十年，至今仍握在家族手中。",
  quiz: [1744, 2026]
};

window.ERAS = [
  { start: 1744, end: 1798, name: "犹太巷时代", color: "#8a5a2b", desc: "梅耶·阿姆谢尔从古钱币生意起家，攀上黑森宫廷，学会了替权贵管钱。" },
  { start: 1798, end: 1836, name: "五支箭", color: "#9e2a1f", desc: "五兄弟分驻法兰克福、伦敦、巴黎、维也纳、那不勒斯，用家族网络为拿破仑战争后的欧洲融资。" },
  { start: 1836, end: 1871, name: "铁路与国债", color: "#2f5d8a", desc: "第二代把资本投向铁路与工业，家族成为欧洲各国政府最重要的债权人之一。" },
  { start: 1871, end: 1914, name: "帝国金融的巅峰", color: "#a07a2c", desc: "苏伊士运河、钻石、巴库石油……伦敦与巴黎两支在第一次全球化浪潮中登上顶点。" },
  { start: 1914, end: 1945, name: "战火与劫难", color: "#4a4a4a", desc: "两次世界大战与大萧条：维也纳一支被纳粹夺走一切，巴黎一支被剥夺国籍、流亡海外。" },
  { start: 1945, end: 1981, name: "重建与转型", color: "#4e7a3a", desc: "从商业银行转向并购顾问；酒庄与庄园成为家族名字的新名片。" },
  { start: 1981, end: 2012, name: "国有化与再出发", color: "#6b2a4a", desc: "巴黎银行被收归国有，第六代从一间小咨询行重新起步。" },
  { start: 2012, end: 2027, name: "合流为一", color: "#2b2b2b", desc: "英法两支合并为 Rothschild & Co，随后退市，重新回到家族手中。" }
];

window.EVENTS = [
  { year: 1806, place: "柏林", img: "Continental_Blockade_(1812).svg", title: "大陆封锁", text: "拿破仑下令封锁英国与欧陆的贸易。走私与汇兑的风险，恰恰是跨国家族网络的机会。" },
  { year: 1815, place: "维也纳", img: "Europe_1815_map_en.png", title: "维也纳会议", text: "拿破仑战争结束，列强重划欧洲版图。战后重建与各国国债，催生了一个属于银行家的时代。" },
  { year: 1830, place: "曼彻斯特", img: "Opening_Liverpool_and_Manchester_Railway.jpg", title: "铁路时代开启", text: "利物浦—曼彻斯特铁路通车。铁路需要的巨额资本，将把银行家从国债带向工业。" },
  { year: 1914, place: "萨拉热窝", img: "DC-1914-27-d-Sarajevo-cropped.jpg", title: "一战爆发", text: "斐迪南大公遇刺，欧洲列强开战。分属敌对国家的罗斯柴尔德亲戚们，第一次站在了战线两边。" },
  { year: 1929, place: "纽约", img: "Crowd_outside_nyse.jpg", title: "华尔街股灾", text: "美国股市崩盘，资本从欧洲回撤。两年后，维也纳的信贷银行成为下一张倒下的骨牌。" },
  { year: 1944, place: "布雷顿森林", img: "Mt._Washington_Hotel.jpg", title: "布雷顿森林体系", text: "美元与黄金挂钩、各国货币与美元挂钩。国际金融的中心从伦敦移向纽约。" },
  { year: 1971, place: "华盛顿", img: "Nixon_30-0316a.jpg", title: "尼克松冲击", text: "美元与黄金脱钩，浮动汇率时代来临，黄金定价与外汇交易的重要性陡增。" },
  { year: 1986, place: "伦敦", img: "Canary-wharf-one.jpg", title: "金融大爆炸", text: "伦敦金融城放松管制，美国投行大举进入，老派家族商人银行面临被收购或被边缘化的抉择。" },
  { year: 2008, place: "纽约", img: "Lehman_Brothers_Times_Square_by_David_Shankbone.jpg", title: "雷曼倒闭", text: "全球金融危机爆发。不做自营、只做顾问的轻资产模式，反倒让家族投行躲过一劫。" }
];

window.STORIES = [
  {
    id: "frankfurt", title: "法兰克福：犹太巷里的起点", subtitle: "从古钱币商到宫廷代理人", tags: ["创业", "家训"], color: "#8a5a2b",
    steps: [
      { year: 1744, place: "法兰克福", img: "Museum-judengasse-ffm002.jpg", title: "犹太巷出生", text: "梅耶·阿姆谢尔·罗斯柴尔德出生在法兰克福犹太巷——一条狭长、夜里和节日都要上锁的街道。家族的姓氏，来自祖上门口挂着的“红盾”（Rot Schild）。", lesson: "起点越窄，越要找到一扇愿意信任你的门。" },
      { year: 1769, place: "哈瑙", img: "Wilhelm_IX._Landgraf_von_Hessel-Kassel_Boettner.jpg", title: "宫廷代理人", text: "靠买卖古钱币，梅耶结识了黑森的威廉王储，获得“宫廷代理人”头衔。威廉日后成为欧洲最富有的君主之一。", lesson: "先替一个大客户把小事做到极致，再争取他的整个钱袋。" },
      { year: 1806, place: "法兰克福", img: "Amschel_Mayer_Rothschild.jpg", title: "替逃亡的选帝侯理财", text: "拿破仑占领黑森，选帝侯威廉出逃。罗斯柴尔德父子替他暗中打理资产、追收利息，并把其中一部分经伦敦投资英国国债。", lesson: "危机中替人守住财富，换来的是一辈子的信用。" },
      { year: 1810, place: "法兰克福", img: "Mayer_Amschel_Rothschild.jpg", title: "父子合伙", text: "“M. A. Rothschild & Söhne”合伙协议签订，梅耶与儿子们共同持股，长子阿姆谢尔留守法兰克福。" },
      { year: 1812, place: "法兰克福", img: "Great_coat_of_arms_of_Rothschild_family.svg", title: "遗嘱：团结与保密", text: "梅耶去世。遗嘱规定生意只由男性后代继承，账目不得外泄，兄弟必须同进同退——这成了家族此后一百多年的“宪法”。", lesson: "家族企业最稀缺的不是钱，是写下来的规矩。" },
      { year: 1822, place: "维也纳", img: "Great_coat_of_arms_of_Rothschild_family.svg", title: "五支箭", text: "奥地利皇帝封五兄弟为男爵。家族纹章上，一只手紧握五支箭——一根易折，一束难断。" },
      { year: 1901, place: "法兰克福", img: null, title: "老宅熄灯", text: "法兰克福一支的最后掌门威廉·卡尔去世，身后没有男性继承人。按照家规，诞生罗斯柴尔德的那家银行关上了大门。", lesson: "让家族团结的规矩，也可能让家族失去一条腿。" }
    ]
  },
  {
    id: "london", title: "伦敦：从布商到英格兰的银行家", subtitle: "国债、战争金融与政治", tags: ["国债", "战争金融", "政治"], color: "#2f5d8a",
    steps: [
      { year: 1798, place: "曼彻斯特", img: "Nathan_Rothschild.jpg", title: "布商内森", text: "三子内森带着本钱来到曼彻斯特做棉布生意：绕过中间商直接向工厂下单、现金结算，以价格和速度取胜。", lesson: "先在最激烈的市场里练出成本与速度。" },
      { year: 1809, place: "伦敦", img: "New_Court_Rothschild_Building.jpg", title: "新庭", text: "内森移居伦敦，在圣斯威辛巷的“新庭”（New Court）落脚，转做票据与金银生意。两百年来，家族银行一直守着这个地址。" },
      { year: 1814, place: "伦敦", img: "Sir_Arthur_Wellesley,_1st_Duke_of_Wellington.jpg", title: "为威灵顿运金", text: "英国政府委托内森把大批金币送上欧陆，支付威灵顿的军饷和对盟国的补贴。分驻各国的兄弟让汇兑在战线之间畅通无阻。", lesson: "跨国网络本身，就是最难复制的产品。" },
      { year: 1815, place: "伦敦", img: "Battle_of_Waterloo_1815.PNG", title: "滑铁卢的传说", text: "流传最广的故事说，内森抢先得知战果，在债市大赚一笔。史学家考证，这一说法主要来自 1846 年的一本反犹小册子；而战争提前结束，反让囤积黄金准备长期作战的罗斯柴尔德承受了损失。", lesson: "传奇往往是别人替你写的，未必对你有利。" },
      { year: 1825, place: "伦敦", img: "Bank-of-England.jpg", title: "驰援英格兰银行", text: "英国爆发银行业恐慌，数十家银行倒闭。内森从欧陆调运金币，帮助英格兰银行撑过挤兑。" },
      { year: 1858, place: "伦敦", img: "Lionel_Nathan_de_Rothschild.jpg", title: "第一位犹太议员", text: "莱昂内尔自 1847 年起多次当选下议院议员，却因不肯以“基督徒的真诚信仰”宣誓而无法就座。1858 年法律修改后，他手按希伯来圣经宣誓入席。", lesson: "坚持原则的代价是时间，回报是规则被改写。" },
      { year: 1875, place: "伦敦", img: "Benjamin_Disraeli,_Earl_of_Beaconsfield_(3x4_cropped).jpg", title: "一夜之间的苏伊士", text: "首相迪斯雷利得知埃及总督急售苏伊士运河股份，议会休会无法拨款，于是向莱昂内尔借了 400 万英镑。英国由此成为运河最大股东。", lesson: "速度与信誉，能让一家私人银行替国家下单。" },
      { year: 1885, place: "伦敦", img: "Lord_Rothschild_LCCN2014685661.jpg", title: "第一位犹太贵族", text: "内蒂受封罗斯柴尔德男爵，成为英国上议院第一位犹太裔议员。伦敦一支此时为铁路、矿业和各国政府融资，也支持了罗兹整合戴比尔斯钻石。" },
      { year: 1917, place: "伦敦", img: "Balfour_declaration_unmarked.jpg", title: "贝尔福宣言", text: "英国外交大臣贝尔福写信给第二代男爵沃尔特，表示支持在巴勒斯坦建立“犹太民族家园”。这封信以《贝尔福宣言》之名载入史册。" },
      { year: 1919, place: "伦敦", img: null, title: "伦敦金价", text: "每个交易日，五家金商聚在新庭的一间屋里，由罗斯柴尔德主持，为全世界报出伦敦金价。2004 年，罗斯柴尔德退出了这项延续 85 年的仪式。", lesson: "掌握定价权的人，不必是最大的交易者。" },
      { year: 1980, place: "伦敦", img: "Jacob_Rothschild_Amana_nli_(cropped_2).jpg", title: "族兄弟分道", text: "雅各布与族兄伊夫林在发展路线上意见不合，雅各布离开家族银行，带着投资信托业务另立门户（后来的 RIT Capital Partners）。" }
    ]
  },
  {
    id: "paris", title: "巴黎：铁路、国债与城堡", subtitle: "最小的弟弟，最长的一支", tags: ["铁路", "国债", "国有化"], color: "#9e2a1f",
    steps: [
      { year: 1812, place: "巴黎", img: "James_de_Rothschild_(1792-1868).jpg", title: "幼子詹姆斯", text: "最小的詹姆斯二十岁来到巴黎，1817 年创立罗斯柴尔德兄弟银行。他历经复辟、七月王朝与第二帝国，始终是法国政府最重要的债权人之一。" },
      { year: 1846, place: "巴黎", img: "Paris_CheminsFerNord.jpg", title: "北方铁路", text: "詹姆斯牵头的北方铁路公司拿下巴黎通往比利时边境的线路，他从“国债银行家”变成了工业资本家。", lesson: "当政府的钱不再稀缺，就去找下一个需要巨额资本的行业。" },
      { year: 1855, place: "费里耶尔", img: "Ferrières-en-Brie_château.jpg", title: "费里耶尔城堡", text: "詹姆斯在巴黎东郊兴建费里耶尔城堡，由设计伦敦水晶宫的帕克斯顿操刀。城堡是会客厅，也是家族实力的广告。" },
      { year: 1871, place: "巴黎", img: "A_v_Werner_-_Kaiserproklamation_am_18_Januar_1871_(3._Fassung_1885).jpg", title: "五十亿法郎赔款", text: "普法战争中，普王曾把大本营设在费里耶尔城堡。战后法国须赔付五十亿法郎，阿方斯牵头的国债发行大获超额认购，法国提前付清赔款。", lesson: "国家最需要钱的时刻，也是银行家信誉最值钱的时刻。" },
      { year: 1882, place: "里雄莱锡安", img: "Rishon-LeZion-Gan-Moshava-0002.jpg", title: "埃德蒙的定居点", text: "詹姆斯的幼子埃德蒙开始资助巴勒斯坦的犹太农业定居点，引入法国葡萄种植技术，在里雄莱锡安建起酒厂。" },
      { year: 1886, place: "巴库", img: "Branobel.jpg", title: "里海石油", text: "巴黎一支为巴库石油外运融资，成立里海—黑海石油公司，与诺贝尔兄弟争夺俄国石油；1911 年以资产换取荷兰皇家壳牌的股份抽身。" },
      { year: 1940, place: "巴黎", img: null, title: "充公与流亡", text: "法国沦陷。维希政府剥夺出逃的罗斯柴尔德家族成员的法国国籍，家族资产与艺术收藏遭到没收，费里耶尔城堡被德军占用。" },
      { year: 1981, place: "巴黎", img: "President_François_Mitterrand_in_1983_(cropped).jpg", title: "被收归国有", text: "密特朗政府将罗斯柴尔德银行收归国有。居伊在《世界报》撰文：“贝当时期是犹太人，密特朗时期成了贱民。”随后远走纽约。", lesson: "资产可以被拿走，名字和关系网拿不走。" },
      { year: 1984, place: "巴黎", img: "David_de_Rothschild_2014.jpg", title: "从零重建", text: "居伊之子大卫以一间小型咨询公司起步。起初不准挂“罗斯柴尔德”的招牌，名为“PO 银行”；两年后，家族姓氏重回门楣。" },
      { year: 2008, place: "巴黎", img: "Emmanuel_Macron_2025_(cropped).jpg", title: "年轻的银行家", text: "一位名叫埃马纽埃尔·马克龙的财政监察官加入罗斯柴尔德银行做并购顾问，四年后离开；2017 年，他当选法国总统。" }
    ]
  },
  {
    id: "vienna", title: "维也纳：帝国的银行家", subtitle: "最显赫，也最悲剧的一支", tags: ["铁路", "银行危机"], color: "#4e7a3a",
    steps: [
      { year: 1820, place: "维也纳", img: "Prince_Metternich_by_Lawrence.jpeg", title: "梅特涅的银行家", text: "次子所罗门定居维也纳，与首相梅特涅过从甚密，为哈布斯堡王朝承销国债。" },
      { year: 1836, place: "维也纳", img: "Salomon_Rothschild.jpg", title: "皇帝北方铁路", text: "所罗门取得奥地利第一条蒸汽铁路——费迪南皇帝北方铁路的特许权，从维也纳通往摩拉维亚的煤矿与加利西亚的盐矿。" },
      { year: 1848, place: "维也纳", img: "Horace_Vernet-Barricade_rue_Soufflot.jpg", title: "革命之年", text: "革命席卷欧洲，梅特涅倒台流亡，所罗门也离开了维也纳。王朝与银行家的靠山，一起倒下。", lesson: "与权力绑得越紧，越要为权力的倒台准备预案。" },
      { year: 1855, place: "维也纳", img: "BA-CA_Kunstforum,_ehem._Österr._Creditanstalt_für_Handel_und_Gewerbe_(90738)_stitch_IMG_5158_-_IMG_5161.jpg", title: "创办信贷银行", text: "所罗门之子安塞尔姆牵头创办奥地利信贷银行（Creditanstalt），迎战巴黎佩雷尔兄弟那种吸收公众资金、投资实业的新式银行。", lesson: "对手的新模式，最好的回应常常是自己也做一个。" },
      { year: 1931, place: "维也纳", img: "Louis_Freiherr_von_Rothschild_(1882–1955)_~1930_©_Georg_Fayer_(1892–1950)_OeNB_12995689.jpg", title: "信贷银行倒下", text: "奥地利信贷银行披露巨额亏损，引爆中欧银行业危机，并迅速传导到德国与英国。家族掌门路易被迫出面收拾残局。" },
      { year: 1938, place: "维也纳", img: "Anschluss_Heldenplatz1.jpg", title: "人质", text: "德奥合并后，路易在维也纳被盖世太保扣押近一年，家族交出在奥地利的产业后他才获释，远走美国。维也纳一支就此终结。" }
    ]
  },
  {
    id: "naples", title: "那不勒斯：最短的一支箭", subtitle: "随军而来，随王国而去", tags: ["主权借贷"], color: "#b0802a",
    steps: [
      { year: 1821, place: "那不勒斯", img: "Carl_Mayer_Rothschild.jpg", title: "随军南下", text: "奥地利出兵镇压那不勒斯革命，四子卡尔随行料理军费，此后留在那不勒斯开设分行。" },
      { year: 1832, place: "罗马", img: "Gregory_XVI.jpg", title: "给教皇的贷款", text: "罗斯柴尔德向教皇国提供贷款。一个犹太银行家族资助教廷，在当时的欧洲引起不小的议论。", lesson: "生意做到足够大，客户便不再挑剔你的出身。" },
      { year: 1863, place: "那不勒斯", img: null, title: "分行关闭", text: "意大利统一，两西西里王国覆亡。失去了王室客户的那不勒斯分行关门，五支箭从此少了一支。", lesson: "押注单一主权客户，就要承受它的兴亡。" }
    ]
  },
  {
    id: "wine", title: "酒庄与庄园：把财富变成品牌", subtitle: "拉菲、木桐与沃德斯登", tags: ["葡萄酒", "奢侈品", "收藏"], color: "#6b2a4a",
    steps: [
      { year: 1853, place: "波亚克", img: "Jardin_de_Château_de_Mouton-Rothschild,_Pauillac._2012.jpg", title: "买下木桐", text: "伦敦一支的纳撒尼尔买下波亚克的布朗-木桐酒庄，改名为木桐-罗斯柴尔德。" },
      { year: 1855, place: "波尔多", img: null, title: "屈居二级", text: "巴黎世博会前的波尔多分级中，木桐只被列为二级酒庄。家族后来以一句话作答：“第一不能，第二不屑，木桐就是木桐。”", lesson: "被低估时，先把不服写成品牌态度。" },
      { year: 1868, place: "波亚克", img: "Château_Lafite-Rothschild.jpg", title: "拉菲", text: "詹姆斯在拍卖会上买下一级酒庄拉菲，几个月后去世。从此，巴黎与伦敦两支各握一座波亚克名庄。" },
      { year: 1874, place: "白金汉郡", img: "Waddesdon_Manor_north_west_2016.jpg", title: "沃德斯登庄园", text: "维也纳一支的费迪南在英国动工兴建法式城堡沃德斯登庄园，用来收藏艺术品、招待名流，维多利亚女王也曾到访。" },
      { year: 1924, place: "波亚克", img: "1931_Philippe_de_Rothschild.jpg", title: "酒庄装瓶", text: "二十二岁的菲利普接掌木桐，首创全部在酒庄内装瓶，杜绝酒商掺兑。“酒庄装瓶”后来成为名庄的标配。", lesson: "掌控最后一公里，才能掌控品质与品牌。" },
      { year: 1945, place: "波亚克", img: null, title: "艺术家酒标", text: "为庆祝胜利，菲利普在酒标上印了一个“V”。此后每年邀请一位艺术家设计酒标，夏加尔、米罗、毕加索、沃霍尔都曾留下作品。", lesson: "让每一年的产品都成为收藏品。" },
      { year: 1957, place: "白金汉郡", img: null, title: "交给国民信托", text: "詹姆斯·德·罗斯柴尔德去世，将沃德斯登庄园连同藏品遗赠英国国民信托，家族信托至今仍参与管理。" },
      { year: 1973, place: "波亚克", img: null, title: "唯一一次升级", text: "经过菲利普半个世纪的游说，木桐升为一级酒庄——这是 1855 年分级以来唯一的改动。座右铭随之改为：“如今第一，昔日第二，木桐不变。”" },
      { year: 1988, place: "纳帕谷", img: "Opus-One-Szmurlo.jpg", title: "女庄主", text: "菲利普去世，女儿菲丽嫔接掌木桐，继续经营父亲与蒙大维合创的加州“作品一号”，并在智利推出 Almaviva，把家族葡萄酒带到新世界。" }
    ]
  },
  {
    id: "merge", title: "合流：一家公司，两种语言", subtitle: "第六、七代与 Rothschild & Co", tags: ["投行", "公司治理"], color: "#2b2b2b",
    steps: [
      { year: 2003, place: "伦敦", img: "New_Court_Rothschild_Building.jpg", title: "一人掌两家", text: "伊夫林退休，巴黎的大卫同时成为伦敦与巴黎两家罗斯柴尔德银行的掌门。" },
      { year: 2012, place: "巴黎", img: null, title: "合二为一", text: "英法两支完成重组，伦敦业务并入巴黎的控股公司巴黎-奥尔良旗下；2015 年，公司更名为 Rothschild & Co。", lesson: "两百年后，五支箭终于被捆成一束。" },
      { year: 2018, place: "巴黎", img: null, title: "第七代", text: "亚历山大·德·罗斯柴尔德接替父亲大卫出任执行主席，成为家族第七代掌门。" },
      { year: 2023, place: "巴黎", img: null, title: "退市", text: "家族联合体完成要约收购，Rothschild & Co 从巴黎泛欧交易所退市，重新成为家族控制的私人公司。", lesson: "上市是工具，不是目的；控制权才是家族企业的底线。" }
    ]
  }
];

/* 家谱：只收录与本报故事相关的主要人物（父系） */
window.FAMILY = [
  { id: "mayer", name: "梅耶·阿姆谢尔", born: 1744, died: 1812, branch: "frankfurt", img: "Mayer_Amschel_Rothschild.jpg", note: "创始人。宫廷代理人，五个儿子分驻五国。" },
  { id: "amschel", parent: "mayer", name: "阿姆谢尔", born: 1773, died: 1855, branch: "frankfurt", img: "Amschel_Mayer_Rothschild.jpg", note: "长子，留守法兰克福总行。" },
  { id: "salomon", parent: "mayer", name: "所罗门", born: 1774, died: 1855, branch: "vienna", img: "Salomon_Rothschild.jpg", note: "次子，维也纳，梅特涅的银行家。" },
  { id: "nathan", parent: "mayer", name: "内森", born: 1777, died: 1836, branch: "london", img: "Nathan_Rothschild.jpg", note: "三子，伦敦，家族最具开拓性的金融家。" },
  { id: "carl", parent: "mayer", name: "卡尔", born: 1788, died: 1855, branch: "naples", img: "Carl_Mayer_Rothschild.jpg", note: "四子，那不勒斯。" },
  { id: "james", parent: "mayer", name: "詹姆斯", born: 1792, died: 1868, branch: "paris", img: "James_de_Rothschild_(1792-1868).jpg", note: "幼子，巴黎，北方铁路与拉菲。" },
  { id: "anselm", parent: "salomon", name: "安塞尔姆", born: 1803, died: 1874, branch: "vienna", img: "Anselm_Salomon_Rothschild.jpg", note: "创办奥地利信贷银行。" },
  { id: "lionel", parent: "nathan", name: "莱昂内尔", born: 1808, died: 1879, branch: "london", img: "Lionel_Nathan_de_Rothschild.jpg", note: "首位犹太议员，苏伊士运河贷款。" },
  { id: "nathaniel", parent: "nathan", name: "纳撒尼尔", born: 1812, died: 1870, branch: "wine", note: "买下木桐酒庄。" },
  { id: "alphonse", parent: "james", name: "阿方斯", born: 1827, died: 1905, branch: "paris", img: "Alphonse_de_Rothschild_(1827-1905).png", note: "主持 1871 年赔款国债。" },
  { id: "edmond", parent: "james", name: "埃德蒙", born: 1845, died: 1934, branch: "paris", img: "הברון_(_אדמונד_דה_רוטשילד_ּ1934_-_1845ׂ-JNF012590.jpeg", note: "资助巴勒斯坦农业定居点。" },
  { id: "ferdinand", parent: "anselm", name: "费迪南", born: 1839, died: 1898, branch: "wine", img: "Ferdinand_de_Rothschild,_1880.jpg", note: "兴建沃德斯登庄园。" },
  { id: "albert", parent: "anselm", name: "阿尔伯特", born: 1844, died: 1911, branch: "vienna", img: "AlbertRothschild.jpg", note: "维也纳掌门。" },
  { id: "natty", parent: "lionel", name: "内蒂", born: 1840, died: 1915, branch: "london", img: "Lord_Rothschild_LCCN2014685661.jpg", note: "第一代罗斯柴尔德男爵。" },
  { id: "jamesed", parent: "nathaniel", name: "詹姆斯·爱德华", born: 1844, died: 1881, branch: "wine", note: "木桐一系承上启下。" },
  { id: "edouard", parent: "alphonse", name: "爱德华", born: 1868, died: 1949, branch: "paris", img: "Édouard_Alphonse_James_de_Rothschild.jpg", note: "二战中流亡，被维希政府剥夺国籍。" },
  { id: "walter", parent: "natty", name: "沃尔特", born: 1868, died: 1937, branch: "london", img: "Walter_Rothschild.jpg", note: "第二代男爵、动物学家，《贝尔福宣言》收信人。" },
  { id: "henri", parent: "jamesed", name: "亨利", born: 1872, died: 1947, branch: "wine", img: "Henri_de_Rothschild_(1872-1946).jpg", note: "医生、剧作家，木桐的主人。" },
  { id: "charles", parent: "natty", name: "查尔斯", born: 1877, died: 1923, branch: "london", note: "银行家、昆虫学家，英国自然保护先驱。" },
  { id: "louis", parent: "albert", name: "路易", born: 1882, died: 1955, branch: "vienna", img: "Louis_Freiherr_von_Rothschild_(1882–1955)_~1930_©_Georg_Fayer_(1892–1950)_OeNB_12995689.jpg", note: "维也纳最后的掌门，1938 年被纳粹扣押。" },
  { id: "philippe", parent: "henri", name: "菲利普", born: 1902, died: 1988, branch: "wine", img: "1931_Philippe_de_Rothschild.jpg", note: "酒庄装瓶、艺术家酒标、一级酒庄。" },
  { id: "guy", parent: "edouard", name: "居伊", born: 1909, died: 2007, branch: "paris", img: "Guy_de_Rothschild_1964.jpg", note: "银行在 1981 年被收归国有。" },
  { id: "victor", parent: "charles", name: "维克多", born: 1910, died: 1990, branch: "london", note: "第三代男爵，科学家。" },
  { id: "philippine", parent: "philippe", name: "菲丽嫔", born: 1933, died: 2014, branch: "wine", note: "木桐女庄主。" },
  { id: "jacob", parent: "victor", name: "雅各布", born: 1936, died: 2024, branch: "london", img: "Jacob_Rothschild_Amana_nli_(cropped_2).jpg", note: "第四代男爵，1980 年离开家族银行。" },
  { id: "david", parent: "guy", name: "大卫", born: 1942, died: null, branch: "merge", img: "David_de_Rothschild_2014.jpg", note: "第六代，重建巴黎银行并合并英法两支。" },
  { id: "alexandre", parent: "david", name: "亚历山大", born: 1980, died: null, branch: "merge", note: "第七代，Rothschild & Co 执行主席。" }
];

window.CAPTIONS = {
  "Continental_Blockade_(1812).svg": "1812 年的大陆封锁形势图",
  "Europe_1815_map_en.png": "维也纳会议后的欧洲（1815）",
  "Opening_Liverpool_and_Manchester_Railway.jpg": "利物浦—曼彻斯特铁路开通",
  "DC-1914-27-d-Sarajevo-cropped.jpg": "1914 年萨拉热窝刺杀事件前的斐迪南大公夫妇",
  "Crowd_outside_nyse.jpg": "1929 年股灾时聚集在纽约证券交易所外的人群",
  "Mt._Washington_Hotel.jpg": "布雷顿森林会议举办地：华盛顿山酒店",
  "Nixon_30-0316a.jpg": "理查德·尼克松",
  "Canary-wharf-one.jpg": "伦敦金丝雀码头——金融大爆炸后崛起的新金融区",
  "Lehman_Brothers_Times_Square_by_David_Shankbone.jpg": "时代广场上的雷曼兄弟大楼",
  "Museum-judengasse-ffm002.jpg": "法兰克福犹太巷博物馆中的老街遗址",
  "Wilhelm_IX._Landgraf_von_Hessel-Kassel_Boettner.jpg": "黑森-卡塞尔的威廉九世（后为选帝侯威廉一世）",
  "Amschel_Mayer_Rothschild.jpg": "长子阿姆谢尔·梅耶·罗斯柴尔德",
  "Mayer_Amschel_Rothschild.jpg": "家族创始人梅耶·阿姆谢尔·罗斯柴尔德",
  "Great_coat_of_arms_of_Rothschild_family.svg": "罗斯柴尔德家族纹章，手握五支箭",
  "Nathan_Rothschild.jpg": "内森·梅耶·罗斯柴尔德",
  "New_Court_Rothschild_Building.jpg": "伦敦圣斯威辛巷的新庭，今日罗斯柴尔德总部",
  "Sir_Arthur_Wellesley,_1st_Duke_of_Wellington.jpg": "威灵顿公爵",
  "Battle_of_Waterloo_1815.PNG": "滑铁卢战役",
  "Bank-of-England.jpg": "伦敦针线街的英格兰银行",
  "Lionel_Nathan_de_Rothschild.jpg": "莱昂内尔·德·罗斯柴尔德",
  "Benjamin_Disraeli,_Earl_of_Beaconsfield_(3x4_cropped).jpg": "本杰明·迪斯雷利",
  "Lord_Rothschild_LCCN2014685661.jpg": "第一代罗斯柴尔德男爵“内蒂”",
  "Balfour_declaration_unmarked.jpg": "《贝尔福宣言》原件，收信人为罗斯柴尔德勋爵",
  "Jacob_Rothschild_Amana_nli_(cropped_2).jpg": "第四代罗斯柴尔德男爵雅各布",
  "James_de_Rothschild_(1792-1868).jpg": "詹姆斯·德·罗斯柴尔德",
  "Paris_CheminsFerNord.jpg": "北方铁路公司在巴黎的旧址",
  "Ferrières-en-Brie_château.jpg": "费里耶尔城堡",
  "A_v_Werner_-_Kaiserproklamation_am_18_Januar_1871_(3._Fassung_1885).jpg": "1871 年德意志帝国在凡尔赛宫宣告成立，维尔纳绘",
  "Rishon-LeZion-Gan-Moshava-0002.jpg": "今日里雄莱锡安的老定居点",
  "Branobel.jpg": "诺贝尔兄弟石油公司——巴黎罗斯柴尔德在巴库的对手",
  "President_François_Mitterrand_in_1983_(cropped).jpg": "弗朗索瓦·密特朗，1983 年",
  "David_de_Rothschild_2014.jpg": "大卫·德·罗斯柴尔德，2014 年",
  "Emmanuel_Macron_2025_(cropped).jpg": "埃马纽埃尔·马克龙",
  "Prince_Metternich_by_Lawrence.jpeg": "梅特涅亲王，托马斯·劳伦斯绘",
  "Salomon_Rothschild.jpg": "所罗门·梅耶·冯·罗斯柴尔德",
  "Horace_Vernet-Barricade_rue_Soufflot.jpg": "1848 年巴黎街垒，奥拉斯·韦尔内绘",
  "BA-CA_Kunstforum,_ehem._Österr._Creditanstalt_für_Handel_und_Gewerbe_(90738)_stitch_IMG_5158_-_IMG_5161.jpg": "维也纳原奥地利信贷银行大楼",
  "Louis_Freiherr_von_Rothschild_(1882–1955)_~1930_©_Georg_Fayer_(1892–1950)_OeNB_12995689.jpg": "路易·冯·罗斯柴尔德，约 1930 年",
  "Anschluss_Heldenplatz1.jpg": "1938 年德奥合并，维也纳英雄广场",
  "Carl_Mayer_Rothschild.jpg": "卡尔·梅耶·冯·罗斯柴尔德",
  "Gregory_XVI.jpg": "教宗格列高利十六世",
  "Jardin_de_Château_de_Mouton-Rothschild,_Pauillac._2012.jpg": "木桐-罗斯柴尔德酒庄花园",
  "Château_Lafite-Rothschild.jpg": "拉菲-罗斯柴尔德酒庄",
  "Waddesdon_Manor_north_west_2016.jpg": "白金汉郡沃德斯登庄园",
  "1931_Philippe_de_Rothschild.jpg": "菲利普·德·罗斯柴尔德，1931 年",
  "Opus-One-Szmurlo.jpg": "纳帕谷的作品一号酒庄",
  "Anselm_Salomon_Rothschild.jpg": "安塞尔姆·冯·罗斯柴尔德",
  "Alphonse_de_Rothschild_(1827-1905).png": "阿方斯·德·罗斯柴尔德",
  "הברון_(_אדמונד_דה_רוטשילד_ּ1934_-_1845ׂ-JNF012590.jpeg": "埃德蒙·德·罗斯柴尔德",
  "Ferdinand_de_Rothschild,_1880.jpg": "费迪南·德·罗斯柴尔德，1880 年",
  "AlbertRothschild.jpg": "阿尔伯特·冯·罗斯柴尔德",
  "Édouard_Alphonse_James_de_Rothschild.jpg": "爱德华·德·罗斯柴尔德",
  "Walter_Rothschild.jpg": "第二代罗斯柴尔德男爵沃尔特",
  "Henri_de_Rothschild_(1872-1946).jpg": "亨利·德·罗斯柴尔德",
  "Guy_de_Rothschild_1964.jpg": "居伊·德·罗斯柴尔德，1964 年"
};
