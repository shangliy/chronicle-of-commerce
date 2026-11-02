/* 商海时序 · 数据层
 * 新增故事只需在 STORIES 里追加一项，地点名需在 PLACES 中登记坐标 [经度, 纬度]。
 */

window.PLACES = {
  "巴黎": [2.35, 48.86], "纽约": [-74.0, 40.71], "摩纳哥": [7.42, 43.74], "日内瓦": [6.14, 46.2],
  "波士顿": [-71.06, 42.36], "马提尼克": [-61.02, 14.64], "加尔各答": [88.36, 22.57],
  "阿巴拉契科拉": [-84.98, 29.73], "布鲁克林": [-73.95, 40.65], "锡拉丘兹": [-76.15, 43.05],
  "大阪": [135.5, 34.69], "顺德": [113.29, 22.8], "珠海": [113.58, 22.27], "新加坡": [103.82, 1.35],
  "罗马": [12.5, 41.9], "维滕贝格": [12.65, 51.87], "奥格斯堡": [10.9, 48.37], "于特博格": [13.08, 51.99],
  "特伦托": [11.12, 46.07], "京都": [135.77, 35.01], "布鲁塞尔": [4.35, 50.85],
  "布达佩斯": [19.04, 47.5], "阿普尔顿": [-88.41, 44.26], "圣保罗（明尼苏达）": [-93.09, 44.95],
  "伦敦": [-0.13, 51.51], "柏林": [13.4, 52.52], "墨尔本": [144.96, -37.81], "底特律": [-83.05, 42.33],
  "华盛顿": [-77.04, 38.9], "钦查群岛": [-76.25, -13.64], "利马": [-77.04, -12.05], "太原": [112.55, 37.87],
  "芝加哥": [-87.63, 41.88], "东京": [139.69, 35.69], "塞拉多": [-47.9, -15.8], "阿比让": [-4.03, 5.36],
  "哈罗盖特": [-1.54, 53.99], "诺丁汉": [-1.15, 52.95], "利兹": [-1.55, 53.8], "长沙": [112.94, 28.23],
  "上海": [121.47, 31.23], "首尔": [126.98, 37.57], "器兴": [127.12, 37.28], "利川": [127.44, 37.27],
  "法兰克福": [8.68, 50.11], "圣克拉拉": [-121.96, 37.35], "匹兹堡": [-79.99, 40.44], "达拉斯": [-96.8, 32.78],
  "杰克逊维尔": [-81.66, 30.33], "纽波特比奇": [-117.93, 33.62], "约巴林达": [-117.81, 33.89],
  "阿姆斯特丹": [4.9, 52.37], "哈勒姆": [4.64, 52.38], "佛罗伦萨": [11.26, 43.77], "苏伊士": [32.55, 29.97],
  "布雷顿森林": [-71.43, 44.26], "深圳": [114.06, 22.54], "多哈": [51.53, 25.29], "曼彻斯特": [-2.24, 53.48],
  "柯卡尔迪": [-3.16, 56.11], "库比蒂诺": [-122.03, 37.32], "杭州": [120.16, 30.27]
};

/* 全球商业时代分期（时间轴底色） */
window.ERAS = [
  { start: 1300, end: 1492, name: "商人共和国", color: "#c9b48a", desc: "佛罗伦萨、威尼斯的银行家发明了复式记账与汇票，钱开始跨越国界。" },
  { start: 1492, end: 1760, name: "大航海与重商主义", color: "#b9a06e", desc: "特许公司、股票与泡沫诞生，香料、白银与蔗糖重塑世界贸易。" },
  { start: 1760, end: 1870, name: "第一次工业革命", color: "#a8896a", desc: "蒸汽、棉纺与铁路，工厂取代作坊，英国成为世界工厂。" },
  { start: 1870, end: 1914, name: "镀金时代", color: "#c7a24a", desc: "电力、钢铁与托拉斯，品牌、广告和百货公司走进日常。" },
  { start: 1914, end: 1945, name: "大战与大萧条", color: "#8f7a6a", desc: "两次世界大战之间，信用崩塌、关税高筑，生意在乱世中求生。" },
  { start: 1945, end: 1971, name: "战后黄金年代", color: "#9fae8a", desc: "布雷顿森林体系下的高增长，大众消费社会成形。" },
  { start: 1971, end: 2001, name: "浮动汇率与全球化", color: "#8aa3ae", desc: "美元脱钩黄金，供应链跨越大洋，东亚奇迹接连上演。" },
  { start: 2001, end: 2020, name: "互联网与世界工厂", color: "#8f9cc0", desc: "中国加入世贸，平台经济崛起，智能手机把世界装进口袋。" },
  { start: 2020, end: 2026, name: "AI 与再全球化", color: "#b08fbf", desc: "算力成为新石油，供应链重组，注意力与认同被重新定价。" }
];

/* 编年大事：不属于某个故事线的全球商业里程碑 */
window.EVENTS = [
  { year: 1397, place: "佛罗伦萨", img: "Giovanni_di_Bicci_de'_Medici_Portrait_by_Agnolo_Bronzino.jpg", title: "美第奇银行创立", text: "乔凡尼·德·美第奇创立银行，以汇票网络为教廷与欧洲王室融资，开创跨国银行的雏形。" },
  { year: 1602, place: "阿姆斯特丹", img: "De_terugkomst_in_Amsterdam_van_de_tweede_expeditie_naar_Oost-Indië,_Hendrik_Cornelisz_Vroom,_1599,_Rijksmuseum_SK-A-2858.jpg", title: "荷兰东印度公司成立", text: "VOC 向公众发行股份，被视为第一家现代意义上的股份公司，阿姆斯特丹随之出现常设股票交易。" },
  { year: 1637, place: "哈勒姆", img: "Jan_Brueghel_the_Younger,_Satire_on_Tulip_Mania,_c._1640.jpg", title: "郁金香狂热崩盘", text: "1637 年 2 月，哈勒姆的郁金香球茎拍卖突然无人接盘，史上最著名的投机泡沫之一戛然而止。" },
  { year: 1694, place: "伦敦", img: "Bank-of-England.jpg", title: "英格兰银行成立", text: "为筹措对法战争经费而设立，政府债务开始被打包为可交易的长期证券。" },
  { year: 1720, place: "伦敦", img: "Edward_Matthew_Ward_(1816-1879)_-_The_South_Sea_Bubble,_a_Scene_in_'Change_Alley_in_1720_-_N00432_-_National_Gallery.jpg", title: "南海泡沫", text: "南海公司股价半年内暴涨又崩溃，连牛顿也亏损惨重，留下“我能计算天体运行，却算不出人性的疯狂”的传说。" },
  { year: 1776, place: "柯卡尔迪", img: "Wealth_of_Nations.jpg", title: "《国富论》出版", text: "亚当·斯密在故乡写成《国富论》，“看不见的手”成为此后两百多年商业世界的底层叙事。" },
  { year: 1830, place: "曼彻斯特", img: "Opening_Liverpool_and_Manchester_Railway.jpg", title: "利物浦—曼彻斯特铁路通车", text: "世界上第一条城际客货运铁路，把棉纺工厂与港口连成一体。" },
  { year: 1869, place: "苏伊士", img: "Iss016e019375.jpg", title: "苏伊士运河通航", text: "欧亚航程缩短约四成，全球贸易进入蒸汽船与电报的新节奏。" },
  { year: 1913, place: "底特律", img: "1925_Ford_Model_T_touring.jpg", title: "福特流水线", text: "福特在高地公园工厂启用移动装配线，T 型车组装时间从十余小时降到约一个半小时。" },
  { year: 1929, place: "纽约", img: "Crowd_outside_nyse.jpg", title: "华尔街股灾", text: "10 月“黑色星期四”与“黑色星期二”，道琼斯指数暴跌，拉开大萧条序幕。" },
  { year: 1944, place: "布雷顿森林", img: "Mt._Washington_Hotel.jpg", title: "布雷顿森林会议", text: "44 国确立美元与黄金挂钩、各国货币与美元挂钩的战后货币体系。" },
  { year: 1971, place: "华盛顿", img: "Nixon_30-0316a.jpg", title: "尼克松冲击", text: "美国宣布停止美元兑换黄金，布雷顿森林体系瓦解，浮动汇率时代到来。" },
  { year: 1980, place: "深圳", img: "Commercial_area_of_futian_to_east2020.jpg", title: "深圳经济特区设立", text: "一个边陲渔村成为中国改革开放的试验田，“三来一补”工厂沿珠三角铺开。" },
  { year: 1999, place: "杭州", img: "TaobaoCity_Alibaba_Xixi_Park.jpg", title: "阿里巴巴创立", text: "十八位创始人在湖畔花园公寓起步，中国电商时代由此开启。" },
  { year: 2001, place: "多哈", img: "The_Pearl_Marina_in_Nov_2013.jpg", title: "中国加入世贸组织", text: "多哈部长级会议批准中国入世，“世界工厂”的二十年由此展开。" },
  { year: 2007, place: "库比蒂诺", img: "First_iPhone_Macworld_2007_DSCF1286.agr.jpg", title: "iPhone 发布", text: "苹果发布 iPhone，移动互联网与 App 经济从此改写注意力的分配。" },
  { year: 2008, place: "纽约", img: "Lehman_Brothers_Times_Square_by_David_Shankbone.jpg", title: "雷曼兄弟破产", text: "次贷危机全面爆发，全球金融体系濒临崩溃，各国央行开启量化宽松。" }
];

/* 故事线：每个故事是一段“商业行迹”，按年份推进 */
window.STORIES = [
  {
    id: "vca",
    title: "梵克雅宝：一门幸运生意",
    subtitle: "一场婚姻、一座广场与一部乱世家史",
    tags: ["奢侈品", "家族企业"],
    color: "#2f6f5e",
    steps: [
      { year: 1895, place: "巴黎", img: "Place_Vendome,_Paris_20_April_2011.jpg", title: "一场联姻", text: "宝石商之子阿尔弗雷德·梵克（Alfred Van Cleef）与宝石商之女艾斯特尔·雅宝（Estelle Arpels）成婚。两个家族、两种手艺，品牌名就是这段婚姻本身。" },
      { year: 1906, place: "巴黎", img: "P1040419_Paris_Ier_place_Vendôme_immeubles_n°18_20_22_24_et_26_rwk.JPG", title: "旺多姆广场 22 号", text: "阿尔弗雷德与艾斯特尔的兄弟查尔斯、朱利安在旺多姆广场 22 号开出第一家店，对面就是丽兹酒店——全世界最有钱的客人都住在这里。", lesson: "选址即定位：把店开在客户的必经之路上。" },
      { year: 1925, place: "巴黎", img: "Postcard_of_Exposition_des_Art_Decoratifs_et_Industriels_Modernes.jpg", title: "装饰艺术博览会大奖", text: "在巴黎国际装饰艺术与现代工业博览会上，一件红白玫瑰图案手链为品牌赢得大奖，梵克雅宝从珠宝商变成了“艺术”的代名词。" },
      { year: 1933, place: "巴黎", img: "Van_Cleef_&_Arpels_Exhibition.JPG", title: "隐秘式镶嵌", text: "品牌为“隐秘式镶嵌（Serti Mystérieux）”申请专利：宝石之间看不见任何金属爪。一项工艺成为此后近一个世纪的护城河。", lesson: "可被看见、却难以复制的工艺，是奢侈品最好的专利。" },
      { year: 1939, place: "纽约", img: "Joseph_Binder's_poster_for_the_1939_New_York_World's_Fair.jpg", title: "战火中的迁徙", text: "二战爆发前后，雅宝家族成员远渡美国，在纽约世博会亮相后扎根第五大道。乱世里，客户与工匠一起迁徙，品牌得以保全。" },
      { year: 1956, place: "摩纳哥", img: "Princess_Grace_and_Prince_Rainier_III.jpg", title: "王妃的婚礼", text: "雷尼尔三世迎娶格蕾丝·凯利，赠出梵克雅宝的珍珠钻石套装，品牌随后成为摩纳哥公国的指定珠宝商——一场婚礼胜过十年广告。" },
      { year: 1968, place: "巴黎", img: "Four-leaf_Clover_Trifolium_repens_2.jpg", title: "四叶草 Alhambra", text: "Alhambra 四叶草长项链问世。它不靠稀世宝石，而靠“幸运”这个故事，成为品牌最畅销、最易入门的系列。", lesson: "把高门槛的品牌，翻译成一个人人都想要的符号。" },
      { year: 1999, place: "日内瓦", img: "HK_Central_Landmark_Van_Cleef_&_Arpels_May-2013_ceiling.JPG", title: "并入历峰集团", text: "家族时代落幕，历峰集团（Richemont）入主梵克雅宝。故事与工艺被保留，资本与渠道被接管。" }
    ]
  },
  {
    id: "cards",
    title: "球星卡：给认同标个价",
    subtitle: "从香烟盒里的赠品到千万美元的资产",
    tags: ["收藏", "体育", "金融化"],
    color: "#a8432f",
    steps: [
      { year: 1886, place: "纽约", img: "King_Kelly_0554fu.jpg", title: "香烟盒里的硬纸板", text: "Goodwin 公司在 Old Judge 香烟里附赠棒球员照片卡，起初只是为了撑住软烟盒、顺便促销。" },
      { year: 1909, place: "匹兹堡", img: "Honus_wagner_t206_baseball_card.jpg", title: "T206 瓦格纳", text: "美国烟草公司发行 T206 系列。匹兹堡海盗队的霍纳斯·瓦格纳要求停印自己的卡，存世极少，日后成为“卡中圣杯”。", lesson: "稀缺往往来自意外，而不是设计。" },
      { year: 1933, place: "波士顿", img: "JimmyFoxxGoudeycard.jpg", title: "口香糖接棒", text: "Goudey 口香糖公司推出 Big League Chewing Gum 卡片，球星卡从成年人的烟盒走进孩子的口袋。" },
      { year: 1952, place: "布鲁克林", img: "Mickey_Mantle_1953.jpg", title: "Topps 与米奇·曼特尔", text: "Topps 的赛·伯杰设计出带数据背面的现代卡片格式。1952 年版米奇·曼特尔滞销，传说大量库存后来被倒进了大西洋。" },
      { year: 1989, place: "约巴林达", img: "Ken_Griffey,_Jr._June_2009_(cropped).jpg", title: "Upper Deck 的全息防伪", text: "Upper Deck 用全息防伪标与高规格印刷挑战老牌厂商，1 号卡小肯·格里菲新秀卡成为一代人的记忆。" },
      { year: 1991, place: "纽波特比奇", img: "1909_T206_Honus_Wagner_Baseball_Card_with_PSA_grade_EX_5-MC.jpg", title: "PSA 评级：给纸片打分", text: "PSA 成立，用 1–10 分为卡片品相评级并封装。从此卡片有了“标准化”，可以像证券一样被比较与交易。", lesson: "金融化的第一步，是把非标品变成标准品。" },
      { year: 1991, place: "纽约", img: "Honus_wagner_portrait.jpg", title: "45 万美元的瓦格纳", text: "冰球巨星格雷茨基与合伙人在苏富比以 45.1 万美元拍下一张 T206 瓦格纳，球星卡第一次登上财经版面。" },
      { year: 2022, place: "达拉斯", img: "Heritage_Auctions_2020_view_small.jpg", title: "1260 万美元的曼特尔", text: "一张 1952 年 Topps 曼特尔在 Heritage 拍卖行以 1260 万美元成交，创下体育收藏品纪录。当年没人要的卡，成了另类资产。" },
      { year: 2022, place: "杰克逊维尔", img: "Topps_wagner_2002_blue.jpg", title: "Fanatics 收购 Topps", text: "体育电商 Fanatics 拿下 MLB 等联盟授权后收购 Topps 卡片业务，授权、制造、销售与二级市场被整合进一家公司。" }
    ]
  },
  {
    id: "cold",
    title: "冷气背后的文明",
    subtitle: "从贩冰到空调，一门“搬运温度”的生意",
    tags: ["制造业", "基础设施"],
    color: "#3b6ea5",
    steps: [
      { year: 1806, place: "波士顿", img: "Frederic_Tudor-facingright_pre1864.jpg", title: "“冰王”的豪赌", text: "弗雷德里克·都铎把新英格兰池塘的冰装船运往加勒比，被嘲笑为疯子。首航马提尼克大亏。" },
      { year: 1806, place: "马提尼克", img: "Slaves_Unloading_Ice_in_Cuba_1832.jpg", title: "没人知道冰能做什么", text: "冰运到了，当地人却不知道冰有何用、如何保存。都铎意识到：卖冰之前，得先卖“冰镇”的生活方式。", lesson: "全新品类，先教育需求，再出售供给。" },
      { year: 1833, place: "加尔各答", img: "World_Ice_Trade,_1856.png", title: "跨越半个地球的冰", text: "“托斯卡纳号”载着冰绕过好望角，四个多月后抵达加尔各答，仍有大半保存完好。冰成了全球贸易品。" },
      { year: 1851, place: "阿巴拉契科拉", img: "Gorrie.jpg", title: "人造冰专利", text: "医生约翰·戈里为降温病房发明制冰机并获美国专利，但贩冰商的抵制与资金困境让他没能商业化。" },
      { year: 1902, place: "布鲁克林", img: "Willis_Carrier_1915.jpg", title: "开利与印刷厂", text: "年轻工程师威利斯·开利为一家印刷厂控制湿度，设计出现代空调系统的雏形——空调最初是为机器、而非为人发明的。" },
      { year: 1925, place: "纽约", img: "Willis_Carrier_Engineers_Handbook.jpg", title: "夏天去电影院", text: "开利为时代广场的里沃利剧院安装制冷系统，“夏季大片”由此诞生：人们为冷气买票，顺便看电影。" },
      { year: 1951, place: "大阪", img: "Daikin_air_conditioner_at_Tennoji_Station_20060626.jpg", title: "大金的日本第一台", text: "大金推出日本第一台整体式空调，日本厂商开始把空调做小、做省、做进千家万户。" },
      { year: 1985, place: "顺德", img: "Midea_Group_headquarters.jpg", title: "美的进入空调", text: "从塑料瓶盖作坊起家的美的开始生产空调，珠三角的家电集群逐步成形。" },
      { year: 1991, place: "珠海", img: "GREEStoreNanchang.jpg", title: "格力诞生", text: "格力电器在珠海成立，专注空调。中国后来成为全球最大的空调生产国。" },
      { year: 2009, place: "新加坡", img: "External_units_of_air_conditioners_in_Singapore.jpg", title: "“历史上最重要的发明之一”", text: "李光耀在访谈中说，空调对新加坡是最重要的发明，让热带地区的人也能在白天高效工作。", lesson: "改变环境的发明，最终改变的是地理对经济的限制。" }
    ]
  },
  {
    id: "indulgence",
    title: "当道德承诺可以变现",
    subtitle: "赎罪券：一门灵魂金融",
    tags: ["宗教", "金融", "ESG"],
    color: "#7a4a8c",
    steps: [
      { year: 1300, place: "罗马", img: "Giotto_-_Bonifatius_VIII_(cropped).jpg", title: "第一个大赦年", text: "教宗卜尼法斯八世宣布大赦年，朝圣者来罗马即可获得全大赦。“免罪”第一次成为吸引大规模客流的产品。" },
      { year: 1476, place: "罗马", img: "Pedro_Berruguete_-_Portrait_of_Pope_Sixtus_IV_della_Rovere_-_1916.815_-_Cleveland_Museum_of_ArtFXD.jpg", title: "扩展到炼狱", text: "西斯笃四世允许为已逝亲人购买赎罪，客群从活人扩展到死者——市场规模瞬间翻倍。", lesson: "扩大可服务人群，是最古老的增长术。" },
      { year: 1514, place: "奥格斯堡", img: "Albrecht_Dürer_080.jpg", title: "富格尔家族的贷款", text: "勃兰登堡的阿尔布雷希特为买下美因茨大主教职位向富格尔银行借巨款，教廷允许他在辖区销售赎罪券，一半收入用于还贷。" },
      { year: 1517, place: "于特博格", img: "Jüterbog_Nikolaikirche_Tetzelkasten.JPG", title: "钱币叮当响", text: "道明会修士台彻尔四处兜售赎罪券，流传着“钱币落进钱箱叮当一响，灵魂便从炼狱飞升”的推销口号。" },
      { year: 1517, place: "维滕贝格", img: "Luther_95_Thesen.png", title: "九十五条论纲", text: "10 月 31 日，马丁·路德发表《九十五条论纲》质疑赎罪券。印刷术让论纲迅速传遍德意志，宗教改革爆发。", lesson: "当承诺的兑现无法验证，信任一旦崩塌就是系统性的。" },
      { year: 1562, place: "特伦托", img: "Concilio_Trento_Museo_Buonconsiglio.jpg", title: "废除赎罪券贩子", text: "特伦托会议废除专职募款的赎罪券贩子，随后教廷禁止一切涉及金钱的赎罪券。" },
      { year: 1997, place: "京都", img: "Turbine_aalborg.jpg", title: "碳抵消登场", text: "《京都议定书》引入清洁发展机制，企业可以购买减排量“抵消”自己的排放。批评者称之为“现代赎罪券”。" },
      { year: 2005, place: "布鲁塞尔", img: "EUA_prices_from_ICAP_secondary_market_2010_to_2024_verysmall.png", title: "碳排放交易体系", text: "欧盟碳排放交易体系启动，把“对气候的道德责任”变成可交易的配额。问题依旧：如何验证承诺被真正兑现？" }
    ]
  },
  {
    id: "houdini",
    title: "胡迪尼：从锁链之中到时代中央",
    subtitle: "一个魔术师如何把自己做成全球品牌",
    tags: ["娱乐", "个人品牌", "营销"],
    color: "#8c6a2f",
    steps: [
      { year: 1874, place: "布达佩斯", img: "View_from_Gellért_Hill_to_the_Danube,_Hungary_-_Budapest_(28493220635).jpg", title: "埃里希·魏斯出生", text: "未来的胡迪尼出生在布达佩斯一个拉比家庭，原名埃里希·魏斯。" },
      { year: 1878, place: "阿普尔顿", img: "Downtown_Appleton_Skyline.jpg", title: "移民美国", text: "全家移民到威斯康星州阿普尔顿，家境贫寒，少年时就靠擦鞋、送报补贴家用。" },
      { year: 1891, place: "纽约", img: "The_Houdinis,_Harry,_Bessie_introducing_the_only_and_original._LCCN2014636901.jpg", title: "取名“胡迪尼”", text: "读了法国魔术大师罗贝尔-乌丹的回忆录后，他给自己取了艺名 Houdini，在纽约的低端杂耍场里四处登台。" },
      { year: 1899, place: "圣保罗（明尼苏达）", img: "HarryHoudini1899.jpg", title: "遇见经纪人", text: "演出经纪人马丁·贝克看到他的手铐逃脱，建议他放弃纸牌戏法、专攻逃脱术，并把他签进连锁剧院。", lesson: "最好的定位，是砍掉一切不够独特的东西。" },
      { year: 1900, place: "伦敦", img: "Harry_Houdini-sitting.jpg", title: "挑战苏格兰场", text: "初到伦敦，他让苏格兰场的警探给自己上铐，当众逃脱。用权威背书来证明能力，他一夜成名。" },
      { year: 1904, place: "伦敦", img: "Houdini_challenge.jpg", title: "《每日镜报》挑战", text: "《每日镜报》悬赏一副据称耗时多年打造的手铐。他在竞技场剧院挣扎一个多小时后逃脱，报纸销量与他的名气同时暴涨。", lesson: "把媒体变成合伙人：你制造新闻，它负责传播。" },
      { year: 1910, place: "墨尔本", img: "Houdini_airborne_in_his_Voisin_at_Diggers_Rest,_1910,_by_Marcel_Poupe.jpg", title: "澳洲上空的飞行", text: "他在墨尔本附近的迪格斯雷斯驾驶自己的飞机升空，被广泛宣传为澳大利亚最早的动力飞行之一。" },
      { year: 1912, place: "柏林", img: "Houdini_performing_Water_Torture_Cell.jpg", title: "中国水牢", text: "倒吊入水的“中国水牢”逃脱在柏林首演，成为他的招牌节目，并申请了版权以防模仿。" },
      { year: 1926, place: "华盛顿", img: "Houdini_and_Lincoln.jpg", title: "国会作证", text: "晚年他转向揭穿灵媒骗局，在国会听证会上作证，支持立法禁止付费通灵。" },
      { year: 1926, place: "底特律", img: "Harry_Houdini_Grave_Marker_8-2008.jpg", title: "万圣节的谢幕", text: "1926 年 10 月 31 日，他因腹膜炎在底特律去世。2026 年是他逝世一百周年。" }
    ]
  },
  {
    id: "elnino",
    title: "气候、农业与帝国",
    subtitle: "厄尔尼诺催生的交易与变革",
    tags: ["大宗商品", "气候", "地缘"],
    color: "#b5772e",
    steps: [
      { year: 1840, place: "钦查群岛", img: "Chincha_Islands_-_panoramio.jpg", title: "鸟粪时代", text: "秘鲁外海的钦查群岛堆积着千年鸟粪，被出口为欧洲农业的肥料，成为秘鲁的财政支柱。鸟粪的来源，正是寒流滋养的鳀鱼群。" },
      { year: 1877, place: "太原", img: "Famine_Victims_Selling_Their_Children_from_The_Famine_in_China,_Illustrations_by_a_Native_Artist_(1878).jpg", title: "丁戊奇荒", text: "1876—1879 年间的强厄尔尼诺与全球性旱灾相伴，华北爆发“丁戊奇荒”，同期印度也出现大饥荒。" },
      { year: 1972, place: "利马", img: "Engraulis_ringens.jpg", title: "鳀鱼消失了", text: "一次强厄尔尼诺让秘鲁鳀鱼渔获崩溃。鱼粉是全球饲料的重要蛋白来源，缺口转向了大豆粕。" },
      { year: 1973, place: "芝加哥", img: "Chicago_Board_of_Trade_(November_2008).jpg", title: "大豆价格飙升", text: "芝加哥期货交易所的大豆价格创纪录，畜牧业成本飞涨。", lesson: "一个市场的供给冲击，会通过替代品传导到另一个市场。" },
      { year: 1973, place: "华盛顿", img: "Nixon_30-0316a.jpg", title: "大豆出口禁令", text: "为压制国内通胀，尼克松政府暂停大豆出口。高度依赖美国大豆的日本受到巨大冲击。" },
      { year: 1974, place: "东京", img: "Kakuei_Tanaka_19720707.jpg", title: "日本寻找第二供应商", text: "首相田中角荣访问巴西，日本决定扶持巴西开发塞拉多稀树草原，分散粮食供应风险。" },
      { year: 1979, place: "塞拉多", img: "Morro_cabeludo_-_Parque_dos_Pireneus_-_Pirenópolis_-_Goiás_01.jpg", title: "把荒原变成粮仓", text: "日巴合作的塞拉多农业开发项目启动，酸性贫瘠的土地被改良为大豆带。数十年后，巴西超越美国成为世界最大大豆生产国。" },
      { year: 2024, place: "阿比让", img: "Cocoa_Pods.JPG", title: "可可创纪录", text: "厄尔尼诺带来的干旱与病害叠加，科特迪瓦与加纳可可减产，国际可可价格突破每吨一万美元，巧克力全面涨价。" }
    ]
  },
  {
    id: "mystery",
    title: "真相只是借口：悬疑经济",
    subtitle: "从阿加莎到剧本杀",
    tags: ["文化产业", "IP"],
    color: "#4d5a3a",
    steps: [
      { year: 1920, place: "伦敦", img: "American_cover_of_«The_Mysterious_Affair_at_Styles».png", title: "第一部小说", text: "阿加莎·克里斯蒂的处女作《斯泰尔斯庄园奇案》出版，比利时侦探波洛登场。" },
      { year: 1926, place: "哈罗盖特", img: "Christie_at_Hydro.jpg", title: "失踪的十一天", text: "她神秘失踪十一天后在哈罗盖特的酒店被找到。这场真实的悬案登上各大报纸头条，作家本人成了最大的谜。" },
      { year: 1935, place: "伦敦", img: "Penguin_Crime_I.JPG", title: "企鹅平装书", text: "企鹅出版社推出六便士平装书，绿色封面专属犯罪小说。悬疑小说从此成为火车站报刊亭里的大众消费品。", lesson: "渠道和价格的革命，往往比内容本身更能造就一个品类。" },
      { year: 1949, place: "利兹", img: "Cluedo_Clue_pack_logo.png", title: "《妙探寻凶》", text: "Waddingtons 推出桌游 Cluedo，玩家第一次亲自扮演侦探，悬疑从“读”变成了“玩”。" },
      { year: 1952, place: "诺丁汉", img: "London-The_Mousetrap_celebrating_70_years.jpg", title: "《捕鼠器》首演", text: "舞台剧《捕鼠器》在诺丁汉首演，随后进入伦敦西区，成为世界上连续演出时间最长的戏剧；观众被要求为结局保密。" },
      { year: 2016, place: "长沙", title: "《明星大侦探》", text: "芒果 TV 推出推理综艺《明星大侦探》，把“扮演+推理”的玩法带给大众，为剧本杀热潮铺路。" },
      { year: 2021, place: "上海", img: "Murder_mystery_merriment_at_RAF_Mildenhall_131025-F-DL987-126.jpg", title: "剧本杀进入千城", text: "剧本杀门店在全国城市大量开张。据艾媒咨询估算，2021 年中国剧本杀市场规模约 170 亿元。人们买的不是真相，而是三五小时的社交与沉浸。", lesson: "内容是借口，关系才是产品。" }
    ]
  },
  {
    id: "korea",
    title: "韩国存储：从万亿芯片到社会重估",
    subtitle: "一个国家如何押注一种芯片",
    tags: ["半导体", "资本市场"],
    color: "#2f4f8c",
    steps: [
      { year: 1983, place: "东京", img: "Lee_Byung-chul_(cropped).jpg", title: "“东京宣言”", text: "三星创始人李秉喆在东京宣布进军半导体，几乎所有人都认为这是一次以卵击石的豪赌。" },
      { year: 1983, place: "器兴", img: "MT4C1024-HD.jpg", title: "64K DRAM", text: "同年底，三星在器兴研发出 64K DRAM，与美日的差距被迅速缩短。现代电子也在同年进入半导体。" },
      { year: 1992, place: "器兴", img: "Samsung_headquarters.jpg", title: "DRAM 世界第一", text: "三星成为全球最大的 DRAM 厂商，此后靠逆周期投资在一轮轮价格战中淘汰对手。", lesson: "周期性行业里，敢在低谷扩产的人赢得下一个高峰。" },
      { year: 1993, place: "法兰克福", img: "Lee_Kun-Hee.jpg", title: "“除了老婆孩子，一切都要变”", text: "李健熙在法兰克福召集高管发表“新经营宣言”，把三星从追求数量推向追求质量。" },
      { year: 1997, place: "首尔", img: "USD_to_South_Korean_Won_exchange_rate.webp", title: "亚洲金融危机", text: "韩国向 IMF 求援，财阀被迫重组。现代电子与 LG 半导体随后合并，2001 年更名海力士。" },
      { year: 2012, place: "利川", img: "AMD_Fiji_GPU_package_with_GPU,_HBM_memory_and_interposer.jpg", title: "SK 入主海力士", text: "SK 集团收购海力士，更名 SK 海力士，并在次年与 AMD 合作推出全球首款 HBM 高带宽内存。" },
      { year: 2024, place: "圣克拉拉", img: "2788-2888_San_Tomas_Expwy.jpg", title: "HBM 与 AI 算力", text: "英伟达 AI 芯片对 HBM 需求爆发，SK 海力士成为核心供应商，存储从周期品变成了 AI 时代的瓶颈资源。" },
      { year: 2025, place: "首尔", img: "Kospi-20170713.png", title: "价值重估", text: "政府推动“企业价值提升计划”、改善股东回报，叠加存储景气，KOSPI 指数刷新历史纪录，市场开始重估“韩国折价”。" }
    ]
  }
];
