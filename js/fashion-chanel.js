/* 风尚版 · 香奈儿特辑：引导式品牌故事
   换一个品牌：复制本文件、改写 MAG，再在 fashion.html 里换掉两个 <script src>。

   原则：每件事只讲一次。章节没有“正文”，只有一句场景（scene）、一个标题和逐句浮现的 beats。
   beats 里每一项可以是：
     "字符串"                      旁白
     "问：……"                      替读者发问（强调色、左竖线）
     { t, code }                   读到这句时点亮左栏的品牌符号
     { cast: "id" }                人物登场卡（见 cast）
     { poll: { q, options, answer } } 猜一猜
     { t, echo: 1918 }             回响：回指前面某一年，可点击跳回
   章节的其余字段：img 主图 · looks 证物条（见 looks）· logos 出场品牌 · video 视频（见 videos）·
                   codes 本章诞生的符号 · stat / quote / lesson
   所有图片都写成 img: 加 Commons 文件名，scripts/fetch_images.py 会把它们抓进 *-images.js。
   视频只用品牌官方 YouTube 频道的嵌入（点击才加载）；官网大片受版权保护，不下载、不盗链。 */
window.MAG = {
  title: "風尚誌",
  titleEn: "MAISON",
  issue: "香奈儿特辑 · 1883 — 2026",
  brand: "香奈儿",
  logo: { img: "Chanel_logo.svg" },
  cover: { img: "Coco+chanel+1937-1_(5423401656).jpg", kicker: "本期封面人物", name: "嘉柏丽尔 · 香奈儿", line: "她发明了现代女人的衣橱，却花了一辈子，想把自己的名字要回来。" },
  coverlines: ["修道院的黑白，怎样变成一个品牌", "一瓶香水，10% 的股份", "拉格斐的三十六年：做她会做的事", "一只包，四年涨价一倍", "利润掉三成之后，一个外人接过剪刀"],

  question: "香奈儿，到底属于谁？",
  stake: { label: "她本人占多少", points: [
    { y: 1910, v: 100, l: "自己的帽店（卡柏担保）" },
    { y: 1924, v: 10, l: "香水公司里她的股份" },
    { y: 1947, v: 2, l: "只剩 5 号香水的销售分成" },
    { y: 1954, v: 0, l: "整个香奈儿归韦尔泰梅家族" }
  ] },

  eras: [
    { start: 1883, name: "序章", fr: "Prologue", tone: "light", accent: "#1a1a1a" },
    { start: 1910, name: "革命", fr: "La Révolution", tone: "light", accent: "#a8843d" },
    { start: 1939, name: "沉寂", fr: "Le Silence", tone: "dark", accent: "#9a9a9a" },
    { start: 1954, name: "归来", fr: "Le Retour", tone: "light", accent: "#b06f7f" },
    { start: 1971, name: "空窗", fr: "L'Interrègne", tone: "light", accent: "#7a7a7a" },
    { start: 1983, name: "拉格斐时代", fr: "L'Ère Lagerfeld", tone: "dark", accent: "#c9a227" },
    { start: 2019, name: "交接", fr: "La Transition", tone: "light", accent: "#8a1c2b" },
    { start: 2025, name: "新篇", fr: "Le Nouveau Chapitre", tone: "light", accent: "#2e5e7e" }
  ],

  directors: [
    { name: "嘉柏丽尔·香奈儿", from: 1910, to: 1971 },
    { name: "工作室团队", from: 1971, to: 1983 },
    { name: "卡尔·拉格斐", from: 1983, to: 2019 },
    { name: "维吉妮·维亚", from: 2019, to: 2024 },
    { name: "马修·布拉齐", from: 2024, to: null }
  ],

  // 左栏的廓形：每个时代女人的身体被衣服塑成什么样（12 个点，镜像绘制，便于形变动画）
  // s 肩宽 a 腋下 w/wy 腰 h/hy 臀 m/my 下摆（半宽 @ 高度，画布 60×120，中线 x=30）
  silhouettes: [
    { y: 1883, name: "紧身胸衣", s: 22, a: 23, w: 25.5, wy: 48, h: 16, hy: 62, m: 8, my: 116 },
    { y: 1913, name: "松开腰身", s: 21, a: 22, w: 22, wy: 50, h: 20, hy: 66, m: 15, my: 108 },
    { y: 1926, name: "直筒短裙", s: 22, a: 22, w: 21, wy: 62, h: 20, hy: 70, m: 18, my: 94 },
    { y: 1939, name: "回到腰线", s: 21, a: 23, w: 24, wy: 48, h: 21, hy: 62, m: 17, my: 114 },
    { y: 1947, name: "迪奥新风貌", s: 23, a: 24, w: 25, wy: 46, h: 12, hy: 64, m: 6, my: 100 },
    { y: 1954, name: "直身套装", s: 21, a: 22, w: 22, wy: 52, h: 22, hy: 64, m: 21, my: 96 },
    { y: 1983, name: "宽肩权力装", s: 14, a: 20, w: 23, wy: 50, h: 22, hy: 64, m: 22, my: 92 },
    { y: 2019, name: "流动的直线", s: 20, a: 21, w: 21, wy: 54, h: 19, hy: 68, m: 16, my: 106 },
    { y: 2025, name: "松开的男式衬衫", s: 19, a: 20, w: 20, wy: 58, h: 18, hy: 70, m: 18, my: 110 }
  ],

  codes: [
    { id: "jersey", name: "针织与条纹", when: "1913", desc: "把男士内衣用的平纹针织布做成女装，配上水手条纹衫——舒适第一次成为时髦。" },
    { id: "no5", name: "5 号香水", when: "1921", desc: "第一款大量使用醛的香水，方正如药瓶的玻璃瓶，名字只有一个数字。" },
    { id: "tweed", name: "粗花呢", when: "1920 年代中期", desc: "来自苏格兰狩猎场的男装面料，被她带进女装，后来成了套装的灵魂。" },
    { id: "pearls", name: "珍珠", when: "1920 年代", desc: "真假珍珠一起戴、一串一串叠着戴——珠宝从此不必只是财富的证明。" },
    { id: "camellia", name: "山茶花", when: "1920 年代", desc: "没有香味的花，不会抢走 5 号香水的风头。它出现在胸针、发饰与鞋面上。" },
    { id: "lbd", name: "小黑裙", when: "1926", desc: "黑色不再只属于丧服。一条简单的黑裙，成了每个衣橱的基本款。" },
    { id: "bw", name: "黑与白", when: "1920 年代", desc: "据说源自奥巴辛修道院的素净：修女的黑白衣裙，孤儿院的白墙与黑门。" },
    { id: "suit", name: "开襟套装", when: "1954", desc: "无领、直身、四个口袋、链条压住下摆的粗花呢套装，七十年来几乎没变。" },
    { id: "bag", name: "2.55 手袋", when: "1955", desc: "菱格绗缝、金属链条肩带，让女人腾出双手；名字就是诞生日期。" },
    { id: "shoes", name: "双色鞋", when: "1957", desc: "米色鞋身拉长腿部，黑色鞋头让脚显小，也不怕弄脏。" }
  ],

  // 人物：第一次登场时出现一张卡片
  cast: {
    balsan: { name: "艾蒂安·巴勒松", role: "纺织富商之子 · 养马的人", img: "Balsan,_célèbre_propriétaire,_entraîneur,_Jockey,_gentleman.jpg", note: "给了她第一种自由：不用工作的生活，和一衣柜的男装。" },
    capel: { name: "亚瑟·“男孩”·卡柏", role: "英国马球手 · 煤炭商人", img: "Arthur_Edward_Capel.png", note: "她一生的爱人，也是她第一笔生意的担保人。" },
    dmitri: { name: "德米特里大公", role: "流亡巴黎的俄国皇族", img: "Dmitriy_Pavlovich_of_Russia_and_Coco_Chanel.jpg", note: "带来了罗曼诺夫家的珍珠，和一位前沙皇御用调香师。" },
    beaux: { name: "恩尼斯·鲍", role: "调香师 · 曾为沙皇宫廷工作", img: "Ernest_Beaux.jpg", note: "递给她十个小瓶，她选了第五个。" },
    wertheimer: { name: "皮埃尔·韦尔泰梅", role: "妙巴黎（Bourjois）化妆品老板", img: "(Pierre)_Wertheimer_(propriétaire_du_cheval_Epinard,_à_l'hippodrome_de_Saint-Cloud,_lors_du_match_contre_le_cheval_Sir_Gallahad,_le_19_mai_1924)_-_(photographie_de_presse)_-_(Agence_Rol).jpg", note: "她叫他“强盗”。他的家族至今拥有香奈儿。" },
    westminster: { name: "威斯敏斯特公爵", role: "当时英国最富有的人", img: "Hugh_Grosvenor,_2nd_Duke_of_Westminster.jpg", note: "带她去苏格兰打猎，她带回了粗花呢。" },
    dincklage: { name: "汉斯·冯·丁克拉格", role: "德国外交官", img: "1933_H_von_Dincklage.jpg", note: "占领时期她的情人。战后的档案显示他与德国情报机构有关。" },
    marilyn: { name: "玛丽莲·梦露", role: "好莱坞明星", img: "Marilyn_Monroe_in_Niagara.jpg", note: "一句话，做了 5 号香水史上最好的广告，分文未取。" },
    jackie: { name: "杰奎琳·肯尼迪", role: "美国第一夫人", img: "President_and_Mrs_Kennedy_deplane_from_Air_Force_One_(3083217259)_(cropped).jpg", note: "她那套粉色套装，是一件“授权仿制品”。" },
    karl: { name: "卡尔·拉格斐", role: "1983—2019 艺术总监", img: "Fendi_store_opening_-_Karl_Lagerfeld_(14091153382)_crop.jpg", note: "同时为芬迪工作了 54 年。墨镜、白马尾、高领。" },
    viard: { name: "维吉妮·维亚", role: "2019—2024 艺术总监", img: "Virginie_Viard_filmed_by_Sofia_Coppola.jpg", note: "拉格斐身边三十年的副手。" },
    ines: { name: "伊娜·德拉弗拉桑", role: "模特 · 1980 年代香奈儿的脸", img: "Inès de la Fressange.jpg", note: "第一位与高定时装屋签独家合约的模特。" },
    nair: { name: "莉娜·奈尔", role: "2022 年起全球 CEO", img: "Chanel Leena Nair 148-Colour Chanel Official Headshot.jpg", note: "此前是联合利华的首席人力资源官。" },
    blazy: { name: "马修·布拉齐", role: "2024 年起艺术总监", note: "从葆蝶家（Bottega Veneta）来，第一次有外人接过这把剪刀。" }
  },

  // 出场的品牌标识（来自维基共享资源，仅作新闻与评论性引用）
  logos: {
    chanel: { name: "CHANEL", img: "Chanel_logo.svg" },
    galeries: { name: "老佛爷百货", img: "Logo_galeries_lafayette.jpg" },
    vogue: { name: "VOGUE", img: "VOGUE_LOGO.svg" },
    bazaar: { name: "Harper's BAZAAR", img: "Harper's_Bazaar_Logo.svg" },
    dior: { name: "Dior", img: "Dior_Logo.svg" },
    fendi: { name: "FENDI", img: "Fendi_logo.svg" },
    lv: { name: "Louis Vuitton", img: "Louis_Vuitton_logo_and_wordmark.svg" },
    bottega: { name: "Bottega Veneta", img: "Logo_of_Bottega_Veneta.svg" }
  },

  // 证物：当年的单品、博物馆藏品与秀场照片。章节里出现在主图下方的胶片条，尾声汇成一本衣橱
  looks: {
    hat1912: { img: "Chanel_hat_from_Les_Modes_1912.jpg", y: 1912, name: "香奈儿草帽", where: "《Les Modes》杂志" },
    jersey1917: { img: "Chanel_jersey_casual_wear_1917,.jpg", y: 1917, name: "针织便装", where: "时装插画" },
    dmitri: { img: "Dmitriy_Pavlovich_of_Russia_and_Coco_Chanel.jpg", y: 1920, name: "与德米特里大公", where: "1920 年代" },
    pearls: { img: "Chanel_pearl_necklace_LOT_4264_AW_Auctions.jpg", y: 1925, name: "多层珍珠项链", where: "拍卖图录" },
    wedding1923: { img: "1923_Coco_Chanel_wedding_dress.jpg", y: 1923, name: "婚纱", where: "博物馆藏" },
    trainbleu: { img: "Sasha_Lydia_Sokolova_Anton_Dolin_Le_Train_Bleu_1924.jpg", y: 1924, name: "芭蕾《蓝色列车》泳装", where: "俄罗斯芭蕾舞团" },
    bazar1925: { img: "Designs_by_Chanel_and_Myrbor_-_Harper's_Bazar_1925-09.jpg", y: 1925, name: "香奈儿新款", where: "《Harper's Bazar》1925 年 9 月" },
    sem1927: { img: "Sem_Chanel.jpg", y: 1927, name: "5 号香水广告", where: "插画家 Sem" },
    lbd_odense: { img: "Den_lille_sorte_kjole_-_Coco_Chanel_design.jpg", y: 1926, name: "小黑裙", where: "丹麦欧登塞博物馆" },
    lbd_black: { img: "Black_dress_by_Coco_Chanel.jpg", y: 1927, name: "黑色日装裙", where: "博物馆藏" },
    chiffon: { img: "Chiffon_dress_-_Coco_Chanel_(39715882951).jpg", y: 1928, name: "雪纺裙", where: "博物馆藏" },
    evening: { img: "Evening_dress_and_underslip_-_Coco_Chanel_(39715868291).jpg", y: 1930, name: "晚礼服与衬裙", where: "博物馆藏" },
    dorvyne1938: { img: "Modèle_Chanel_photographié_par_Studio_Dorvyne_en_1938.jpg", y: 1938, name: "香奈儿模特", where: "Studio Dorvyne 摄" },
    no5_1960: { img: "Chanel_n._5,_boccetta_del_1960_circa_(chanel_collection).jpg", y: 1960, name: "5 号香水瓶", where: "约 1960 年" },
    no5_1970: { img: "CHANEL_N°5.jpg", y: 1970, name: "5 号香水", where: "1970 年代" },
    no5_box: { img: "Chanel_1.JPG", y: 2010, name: "5 号香水盒", where: "白盒黑边" },
    no5_parfum: { img: "CHANEL_No5_parfum_(cropped).jpg", y: 2015, name: "5 号香精", where: "今天的瓶子" },
    suit1955: { img: "Suit_by_Coco_Chanel,_c._1955,_wool,_silk_-_Musée_de_la_mode_-_Montreal,_Canada_-_DSC07028.jpg", y: 1955, name: "粗花呢套装", where: "蒙特利尔时装博物馆" },
    flap: { img: "Chanel_CLASSIC_Double_Flap_2.55_.jpg", y: 1955, name: "经典口盖包", where: "菱格 · 链条" },
    lace1958: { img: "1958_Coco_Chanel_strapless_evening_dress,_black_lace_with_velvet_sash.jpg", y: 1958, name: "黑色蕾丝无肩带晚装", where: "博物馆藏" },
    suit1960: { img: "Chanel_suit.jpg", y: 1960, name: "套装", where: "约 1960 年" },
    jacket1961: { img: "Chanel_Haute_Couture_jacket,_1961.jpg", y: 1961, name: "高定外套", where: "博物馆藏" },
    suit60s: { img: "Three-piece_suit,_Coco_Chanel,_early_1960s_-_National_Museum_of_American_History_-_DSC00033.jpg", y: 1962, name: "三件套", where: "美国国家历史博物馆" },
    copy1966: { img: "Gabrielle_“Coco”_Chanel_day_suit_and_Licensed_copy.jpg", y: 1966, name: "原版（左）与美国授权仿制版", where: "纽约 FIT 博物馆" },
    suit1965: { img: "1965_Chanel_suit_and_silk_blouse.jpg", y: 1965, name: "套装与真丝衬衫", where: "博物馆藏" },
    tweed1965: { img: "1965_Chanel_suit_and_silk_blouse_detail.jpg", y: 1965, name: "粗花呢的纹理", where: "细节" },
    purple1965: { img: "1965_purple_Chanel_suit.jpg", y: 1965, name: "紫色套装", where: "博物馆藏" },
    hc1965: { img: "Chanel_Haute_Couture_suit,_1965.jpg", y: 1965, name: "高定套装", where: "博物馆藏" },
    berthelet1972: { img: "Chanel_suit_designed_by_Gaston_Berthelet_for_Chanel,_Fall-Winter_1972-3.jpg", y: 1972, name: "无主之年的套装", where: "加斯东·贝特莱设计" },
    karl1983: { img: "Hommage_à_Karl_Lagerfeld_(musée_des_arts_décoratifs,_Paris)_-_33415030458.jpg", y: 1983, name: "拉格斐的第一套", where: "巴黎装饰艺术博物馆" },
    boy: { img: "Sac_Chanel.jpg", y: 2011, name: "Boy 手袋", where: "以“男孩”卡柏命名" },
    lbd2009: { img: "2009_Chanel_by_Karl_Lagerfeld_little_black_evening_dress,_pleated_silk_with_beading_01.jpg", y: 2009, name: "拉格斐的小黑裙", where: "褶裥真丝 · 钉珠" },
    model2009: { img: "Chanel_model_suit_2009.jpg", y: 2009, name: "秀场上的套装", where: "2009" , runway: true },
    claudia2009: { img: "Claudia_Schiffer_20091006_Chanel_02.jpg", y: 2009, name: "克劳迪娅·希弗", where: "2009 春夏成衣秀" , runway: true },
    hc2011: { img: "Chanel_Haute_Couture_Fall-Winter_2011.jpg", y: 2011, name: "高定秀场", where: "大皇宫 · 2011 秋冬" , runway: true },
    robot: { img: "Chanel_Original_Robot_Clutch.jpg", y: 2012, name: "机器人手包", where: "拉格斐的玩笑" },
    heidi2012: { img: "Heidi_Mount_at_Chanel_SS2012_Collection_Photo_Ed_Kavishe.jpg", y: 2012, name: "海蒂·芒特走秀", where: "2012 春夏" , runway: true },
    street2012: { img: "Antonia_Wesseloh_-_Paris_Haute_Couture_Spring-Summer_2012.jpg", y: 2012, name: "秀场外的街拍", where: "巴黎高定周" },
    mannequin2017: { img: "Chanel_on_mannequin.jpg", y: 2017, name: "粗花呢新作", where: "陈列" },
    cruise2021: { img: "CHANEL_ROCK_ROMANTICISM_2021_CRUISE.jpg", y: 2020, name: "2021 早春度假系列", where: "维亚" },
    coco1984: { img: "Coco de Chanel.jpg", y: 1984, name: "Coco 香水", where: "调香师雅克·波尔日" },
    egoiste1990: { img: "Égoïste.jpg", y: 1990, name: "Égoïste 男香", where: "“自私鬼！”" },
    allure1996: { img: "Allure Homme.jpg", y: 1996, name: "Allure Homme", where: "男香" },
    mouglalis2010: { img: "Anna Mouglalis Défilé Channel, Printemps-Eté 2010 cropped.jpg", y: 2010, name: "安娜·穆格拉莉丝走秀", where: "2010 春夏" , runway: true },
    ines2012: { img: "Inès de La Fressange - Paris Haute Couture Spring-Summer 2012.jpg", y: 2012, name: "伊娜，三十年后", where: "巴黎高定周" },
    kim2020: { img: "Kim Go-eun in 2020 7.png", y: 2020, name: "品牌大使金高银", where: "亚洲市场" },
    chip2021: { img: "HK Chanel microchip Mini Flap Mini Square Light Grey 晶片淺灰色方淡金色鈎鏈手袋 px3.jpg", y: 2021, name: "内嵌芯片的迷你口盖包", where: "香港" },
    window2022: { img: "HK 中環 Central 太子大廈 Prince's Building mall shop CHANEL clothing store window display handbags August 2022 Px3 02.jpg", y: 2022, name: "橱窗里的手袋", where: "香港中环" },
    bond2023: { img: "Christmas 2023 Chanel Fine Jewellery New Bond Street.jpg", y: 2023, name: "高级珠宝店的圣诞", where: "伦敦新邦德街" },
    bryanboy2023: { img: "Bryan Yambao aka BryanBoy at Chanel October 3rd, 2023.jpg", y: 2023, name: "秀场外", where: "2023 年 10 月" },
    jennie2024: { img: "Jennie at Chanel Event in 2024.png", y: 2024, name: "品牌大使 Jennie", where: "2024 年活动" },
    goyounjung2025: { img: "Go Youn-jung for Chanel Beauty at the 2025 Marie Claire Asia Star Awards (September 2025) 02.png", y: 2025, name: "香奈儿美妆", where: "2025 年 9 月" },
    constellation2025: { img: "璀璨星辰 CHANEL Winter Constellation 20251215.jpg", y: 2025, name: "冬日星辰橱窗", where: "2025 年 12 月" },
    tilda2026: { img: "2026-05-26 Tilda Swinton for Chanel 01.jpg", y: 2026, name: "蒂尔达·斯文顿", where: "布拉齐的香奈儿 · 2026 年 5 月" , runway: true },
    robbie2026: { img: "Margot Robbie at the 2026 Met Gala 250 (cropped).jpg", y: 2026, name: "玛格特·罗比", where: "2026 大都会慈善晚宴" , runway: true },
    // —— 秀场与更多产品（runway: true 的在倒叙黑白版里排成 T 台大图）——
    chain1965: { img: "1965 Chanel suit and silk blouse detail2.jpg", y: 1965, name: "下摆里的那条链子", where: "让外套垂得笔直" },
    cream1960s: { img: "Cream Chanel suit, late 1960s.jpg", y: 1967, name: "奶油色粗花呢套装", where: "1965—69" },
    cocomlle2001: { img: "Coco mademoiselle.jpg", y: 2001, name: "Coco Mademoiselle", where: "写给“她的孙女们”的香水" },
    ss10_1: { img: "Claudia Schiffer 20091006 Chanel 03.jpg", y: 2009, name: "克劳迪娅·希弗", where: "2010 春夏成衣秀当天", runway: true },
    ss10_5: { img: "Claudia Schiffer 20091006 Chanel 01.jpg", y: 2009, name: "长枪短炮", where: "大皇宫外 · 2009 年 10 月", runway: true },
    lbd2009b: { img: "2009 Chanel by Karl Lagerfeld little black evening dress, pleated silk with beading 03.jpg", y: 2009, name: "小黑裙的背面", where: "褶裥 · 钉珠" },
    window2011: { img: "HK Admiralty 太古廣場 Pacific Place shop CHANEL window model fashion Aug-2011.jpg", y: 2011, name: "橱窗里的模特", where: "香港太古广场" },
    lbdwin2011: { img: "CHANEL little black dress (6330181828).jpg", y: 2011, name: "橱窗里的小黑裙", where: "旧金山" },
    mannequins2017: { img: "Chanel on mannequins.jpg", y: 2017, name: "一排粗花呢套装", where: "百货公司陈列" },
    noordhoff2018: { img: "Meeting a fabulous model, Felice Noordhoff after the Chanel SS19 show.jpg", y: 2018, name: "秀后的模特", where: "2019 春夏成衣秀 · 巴黎" },
    honore2021: { img: "Chanel, 382 rue Saint-Honoré, Paris 1er.jpg", y: 2021, name: "圣奥诺雷街的转角店", where: "巴黎 · 2021" },
    no5_2017: { img: "Chanel No 5 (24846737817).jpg", y: 2021, name: "一百岁的 5 号", where: "方瓶 · 一个数字" },
    elixir: { img: "Chanel N°5 Elixir sensuel (cropped).jpg", y: 2021, name: "5 号的分支", where: "Elixir Sensuel" },
    cwb2022: { img: "HK CWB 銅鑼灣 Causeway Bay 羅素街 Russell Street Times Square shop Chanel clothing February 2022 Px3 01.jpg", y: 2022, name: "门店里的成衣", where: "香港铜锣湾" },
    central2022: { img: "HK 中環 Central 太子大廈 Prince's Building mall shop CHANEL clothing store window display August 2022 Px3 01.jpg", y: 2022, name: "橱窗陈列", where: "香港中环" },
    jennie2026: { img: "Guests at the 2026 Met Gala 372 (Jennie).jpg", y: 2026, name: "Jennie", where: "2026 大都会慈善晚宴", runway: true },
    ayo2026: { img: "Guests at the 2026 Met Gala 455.jpg", y: 2026, name: "艾尤·艾德贝里", where: "2026 大都会慈善晚宴", runway: true },
    gracie2026: { img: "Gracie Abrams at the 2026 Met Gala 268 (cropped).jpg", y: 2026, name: "格蕾西·艾布拉姆斯", where: "2026 大都会慈善晚宴", runway: true },
    sora2026: { img: "2026-05-26 Choi Sora for Chanel 01.jpg", y: 2026, name: "崔素拉走上 T 台", where: "首尔 · 高级手工坊秀", runway: true },
    sora2026b: { img: "2026-05-26 Choi Sora for Chanel 02.jpg", y: 2026, name: "崔素拉", where: "首尔 · 2026 年 5 月", runway: true },
    kazuha2026: { img: "26052026 LE SSERAFIM Kazuha - Photocall @ CHANEL Métiers d'art 1.jpg", y: 2026, name: "Kazuha", where: "首尔秀场外", runway: true },
    wonhee2026: { img: "2605206 ILLIT WONHEE CHANEL Photo Call 1.jpg", y: 2026, name: "Wonhee", where: "首尔秀场外", runway: true },
    tilda2026b: { img: "2026-05-26 Tilda Swinton for Chanel 02.jpg", y: 2026, name: "蒂尔达·斯文顿", where: "汉华蓬皮杜中心", runway: true }
  },

  // 官方视频：CHANEL 品牌 YouTube 频道（oEmbed 已核对作者为 CHANEL）
  videos: {
    insideNo5: { yt: "tRQa33dqyxI", t: "N°5 的诞生 · Inside CHANEL", note: "官方短片：从样本瓶到那个数字" },
    mademoiselle: { yt: "VCAro7GnCHo", t: "Mademoiselle · Inside CHANEL", note: "官方短片：她是谁" },
    goesWest: { yt: "nHgSCKLPIr0", t: "Gabrielle Chanel Goes West", note: "官方短片：去好莱坞的那一年" },
    marilyn: { yt: "Wo8UtWiYiZI", t: "Marilyn and N°5", note: "梦露本人的录音" },
    jacket: { yt: "zx1R49B_tzw", t: "The Jacket · Inside CHANEL", note: "官方短片：一件外套的结构" },
    bags: { yt: "gOMWNIFdi_c", t: "手袋的手艺 · Savoir-Faire", note: "官方短片：菱格是怎么缝出来的" },
    karl: { yt: "kSVmNhbiVm4", t: "CHANEL by Karl · Inside CHANEL", note: "官方短片：拉格斐的三十六年" },
    couture: { yt: "19W7fvOBG0c", t: "Haute Couture · Inside CHANEL", note: "官方短片：工坊里的高级定制" },
    supermarket: { yt: "YLDUXZ4X5b8", t: "2014/15 秋冬成衣秀 · 超市", note: "完整秀场" },
    rocket: { yt: "C89jkwr_wXk", t: "2017/18 秋冬成衣秀 · 火箭", note: "完整秀场" },
    blazy: { yt: "5D0i7mtlqLs", t: "2026 春夏成衣秀 · 布拉齐首秀", note: "完整秀场" },
    metiersNY: { yt: "afbCCkgVGHY", t: "2026 高级手工坊 · 纽约", note: "完整秀场：包厘街地铁站" },
    cruiseBiarritz: { yt: "S4rKUBukPr8", t: "2026/27 度假系列 · 比亚里茨", note: "官方预告" }
  },

  // 倒叙版的冷开场：从最近的一场秀倒着往回读
  coldRewind: [
    "2026 年 10 月 5 日，巴黎，大皇宫。",
    "穹顶下悬着九十五只发光的鸟。灯亮，第一位模特走出来，肩上背着一只旧包。",
    "那不是新品。那是嘉柏丽尔·香奈儿本人用过的 2.55。",
    "问：一只包，要倒回多少年，才能讲清它为什么值得被这样背出来？",
    "我们从今天开始，一页一页往回翻。",
    "翻到最后，你会回到一座修道院——黑与白，最开始的地方。"
  ],

  // 冷开场：封面之后，先把读者扔进一个场景
  cold: [
    "1954 年 2 月 5 日，巴黎，康朋街 31 号。",
    "一个七十一岁的女人坐在镜面楼梯的最上一级。楼下，模特一个个走出来，观众很安静。",
    "这是她关门十五年后的第一场秀。",
    "第二天，法国报纸说：一场惨败。“回到了 1930 年代。”",
    "问：一个被时代抛下的老太太，为什么还要回来？",
    "因为这场秀的钱，是她恨了三十年的那个人出的。",
    "也因为——门上那个名字，早就不完全属于她了。"
  ],

  // 幕：from 指这一幕从哪一年开始；img 可选，作幕间页的整幅背景
  acts: [
    { from: 1883, title: "黑与白从哪里来", hook: "一个不肯说出身世的孤儿，后来用两种颜色定义了一个时代。" },
    { from: 1910, title: "解放女人的身体", hook: "她卖的不是衣服，是一种生活方式——以及一瓶差点不属于她的香水。", img: "Dmitriy_Pavlovich_of_Russia_and_Coco_Chanel.jpg" },
    { from: 1939, title: "想夺回名字的人", hook: "战争、背叛与一场打了二十年的官司。这一幕，品牌史通常一笔带过。" },
    { from: 1954, title: "卖掉自己", hook: "回归、成功，然后把一切都签给了对手。", img: "1965_Chanel_suit_and_silk_blouse_detail.jpg" },
    { from: 1978, title: "没有香奈儿的香奈儿", hook: "她走了以后，一个德国人用三十六年证明：这个名字比她本人更能活。", img: "Heidi_Mount_at_Chanel_SS2012_Collection_Photo_Ed_Kavishe.jpg" },
    { from: 2019, title: "谁来接这把剪刀", hook: "拉格斐走后的七年：疫情、涨价、利润掉三成，然后，第一次有外人坐上那级台阶。", img: "2026-05-26 Tilda Swinton for Chanel 01.jpg" }
  ],

  chapters: [
    // —— 第一幕 ——
    { year: 1883, place: "索米尔 · 奥巴辛", scene: "一家济贫院，一座修道院", img: "Coupe.transept.eglise.Obazine.png", title: "修道院里的黑与白",
      beats: [
        "她出生在修女开办的济贫院里。十一岁那年母亲病逝，父亲把三个女儿送进一座十二世纪修道院里的孤儿院，再也没有回来。",
        { t: "白墙，黑门，修女穿黑袍、戴白头巾；彩窗只有灰白两色——没有颜色，只有线条。", code: "bw" },
        "她在这里学会了缝纫。也学会了不提这里。",
        "问：为什么不提？",
        "对一个想进上流社会的女人，“孤儿”是最不能说出口的两个字。她后来编了一辈子故事：说父亲去美国发财了。"
      ], codes: ["bw"] },
    { year: 1908, place: "穆兰 · 鲁瓦亚略", scene: "咖啡音乐厅，然后是一座养马的庄园", title: "“可可”，和一衣柜的男装",
      beats: [
        "她在驻军小城的咖啡馆给军官唱歌，只会两首，其中一首叫《谁见过可可？》。嗓子没留下，名字留下了。",
        { cast: "balsan" },
        "她搬进巴勒松的庄园，成了“被供养的女人”。别的女人侧坐骑马、裹着长裙；她让马夫改了一条男式马裤，跨坐着骑。",
        "她借男人的衬衫和外套穿，又给自己做了一顶平顶草帽——干净、没有羽毛。女客们都来找她要帽子。"
      ] },

    // —— 第二幕 ——
    { year: 1910, place: "巴黎 · 康朋街 21 号", scene: "第一家店", title: "只准卖帽子",
      looks: ["hat1912"],
      beats: [
        { cast: "capel" },
        "卡柏替她向银行担保，租下康朋街 21 号。可租约上写着：楼里已经有一家裁缝了，她不准做衣服。",
        "于是第一块招牌是“香奈儿帽子店”。",
        "问：那她自己占多少？",
        "全部——只是钱是借来的。这是故事里她最“拥有”香奈儿的时候。"
      ] },
    { year: 1913, place: "多维尔 · 比亚里茨", scene: "两座海滨小城", img: "Gabrielle_Chanel_en_marinière.jpg", title: "海边的针织衫",
      looks: ["jersey1917"],
      stat: { n: "300", l: "1916 年她手下的女工人数" },
      beats: [
        "卡柏又出钱，在诺曼底的多维尔开了第二家店。战争来了，女人们要逃难、要工作——裙撑和胸衣成了累赘。",
        { t: "她做宽松的水手条纹衫和直身裙，买下一整批原本做男人内衣的针织布。巴黎人说她在卖“穷人的衣服”。卖疯了。", code: "jersey" },
        "1915 年，她在西班牙边境的比亚里茨开了第一家真正的时装屋。1916 年，她把卡柏的钱全部还清。",
        "记住这两座海边小城。一百多年后，香奈儿还会回来。"
      ], codes: ["jersey"] },
    { year: 1918, place: "巴黎 · 康朋街 31 号", scene: "一栋整楼，一条公路", img: "31_Rue_Cambon_Ancien_Ancien_appartement_de_Coco_Chanel.JPG", title: "镜面楼梯",
      beats: [
        "她买下康朋街 31 号整栋楼。通往沙龙的螺旋楼梯四面都是镜子。",
        "发布会那天，她就坐在楼梯顶上的那一级——从镜子里看观众的表情，观众看不见她。记住这级台阶。",
        "第二年圣诞节前三天，卡柏开车去戛纳的路上出了车祸。他已经娶了别人，她连去葬礼的身份都没有。",
        { t: "她让人把卧室刷成黑色。很多人相信，从这一年起，黑色在她手里不再是丧服的颜色。", code: "lbd" }
      ] },
    { year: 1921, place: "格拉斯 · 巴黎", scene: "五月五日", img: "Sem_Chanel.jpg", title: "第 5 号样本",
      looks: ["no5_1960", "no5_1970", "no5_box"],
      video: "insideNo5",
      beats: [
        { cast: "dmitri" },
        "新情人德米特里大公，把她介绍给一位从俄国逃出来的调香师。",
        { cast: "beaux" },
        "鲍拿来两组小瓶：1 到 5 号，20 到 24 号。她闻完，指着第五瓶。“就叫它 5 号吧，会带来好运。”",
        { t: "瓶子方方正正，像实验室的药瓶。标签只有一个数字。在那个瓶身雕满花的年代，这是一种挑衅。", code: "no5" },
        "她说：“女人要闻起来像女人，而不是像玫瑰。”"
      ], codes: ["no5"] },
    { year: 1924, place: "巴黎 · 隆尚赛马场", scene: "一场赛马 · 一次引荐", img: "(Pierre)_Wertheimer_(propriétaire_du_cheval_Epinard,_à_l'hippodrome_de_Saint-Cloud,_lors_du_match_contre_le_cheval_Sir_Gallahad,_le_19_mai_1924)_-_(photographie_de_presse)_-_(Agence_Rol).jpg", title: "10% 的代价",
      logos: ["galeries"],
      quote: { t: "那个强盗把我骗了。", by: "香奈儿谈韦尔泰梅" },
      beats: [
        "5 号香水供不应求，可她没有工厂。老佛爷百货的老板巴德在赛马场把她介绍给一个人。",
        { cast: "wertheimer" },
        "三方成立“香奈儿香水公司”：韦尔泰梅兄弟出钱、出工厂、出渠道。",
        { poll: { q: "这家以她名字命名的香水公司，她本人占多少股份？", options: ["51%", "30%", "10%"], answer: 2 } },
        "10%。韦尔泰梅家拿 70%，巴德 20%。她当时觉得无所谓——她要的是时装。",
        "后来 5 号成了世界上最畅销的香水。她用余生去后悔这个签名。"
      ] },
    { year: 1925, place: "苏格兰高地", scene: "狩猎季 · 一位公爵的庄园", img: "Designs_by_Chanel_and_Myrbor_-_Harper's_Bazar_1925-09.jpg", title: "公爵的粗花呢",
      logos: ["chanel", "bazaar"],
      looks: ["pearls", "trainbleu", "wedding1923", "bazar1925", "dmitri"],
      beats: [
        { cast: "westminster" },
        { t: "她穿公爵的粗花呢猎装——粗糙、保暖、耐脏，男人的料子。她把它带回巴黎，做成了女装。", code: "tweed" },
        { t: "罗曼诺夫珍珠和假珍珠混在一起，一串叠一串地戴。“珠宝不是为了让人觉得你有钱。”", code: "pearls" },
        { t: "胸前别一朵山茶花——没有香味，不会盖过 5 号。", code: "camellia" },
        "两个背靠背交叠的 C 开始印在香水盒上。一个品牌的“字母表”已经写了一大半。"
      ], codes: ["tweed", "pearls", "camellia"] },
    { year: 1926, place: "纽约", scene: "十月号《Vogue》", img: "Den_lille_sorte_kjole_-_Coco_Chanel_design.jpg", title: "香奈儿的福特",
      logos: ["vogue"],
      looks: ["lbd_odense", "lbd_black", "chiffon", "evening"],
      video: "mademoiselle",
      beats: [
        { t: "美国版《Vogue》登了一条黑色直身裙，配的说明是：“这是香奈儿的福特。”——人人都该有一辆，而且只有黑色。", code: "lbd" },
        "在那之前，黑色是寡妇和女仆的颜色。",
        "对手设计师波烈看见她一身黑，问：“小姐，您在为谁服丧？”她回答：“为您，先生。”"
      ], codes: ["lbd"] },

    // —— 第三幕 ——
    { year: 1939, place: "巴黎 · 丽兹酒店", scene: "宣战，然后是占领", img: "Modèle_Chanel_photographié_par_Studio_Dorvyne_en_1938.jpg", title: "关门，与暗面",
      looks: ["dorvyne1938"],
      stat: { n: "约 4000", l: "关门时被解雇的员工" },
      beats: [
        "宣战之后，她关掉时装屋，只留一楼卖香水。将近四千人失业。她搬进对街的丽兹酒店。",
        { cast: "dincklage" },
        "德军住进了丽兹。她留了下来，和一位德国外交官住在一起。",
        "韦尔泰梅家是犹太人，已经逃到美国。她依据占领当局的“雅利安化”法令，申请接管香水公司。",
        "问：她成功了吗？",
        "没有。韦尔泰梅家早把股份转到了一位法国飞机制造商名下。战后，她在瑞士住了将近十年。"
      ] },
    { year: 1947, place: "纽约 · 瑞士", scene: "一场打了二十年的官司", title: "2% 的和解",
      logos: ["dior"],
      beats: [
        "她在瑞士做了自己的香水，打算用“香奈儿”这个名字跟韦尔泰梅抢生意。皮埃尔坐下来和她谈。",
        "结果：她拿到全球 5 号香水销售额的 2%，以及——她的一切开销，终生由韦尔泰梅家承担。",
        "同一年，迪奥发布了“新风貌”：束腰、垫胯、大裙摆。她说：“迪奥不是在给女人穿衣服，是在给她们装软垫。”"
      ] },
    { year: 1952, place: "好莱坞", scene: "一次采访", img: "Marilyn_Monroe_in_Niagara.jpg", title: "只穿 5 号",
      video: "marilyn",
      beats: [
        { cast: "marilyn" },
        "记者问梦露：“您睡觉时穿什么？”“只穿几滴香奈儿 5 号。”",
        "这句话传遍世界。钱进的是韦尔泰梅的口袋，她只拿 2%。"
      ] },

    // —— 第四幕 ——
    { year: 1954, place: "巴黎 · 康朋街 31 号", scene: "二月五日", img: "Suit_by_Coco_Chanel,_c._1955,_wool,_silk_-_Musée_de_la_mode_-_Montreal,_Canada_-_DSC07028.jpg", title: "七十一岁归来",
      looks: ["suit1955", "chain1965", "tweed1965", "suit1960", "hc1965", "purple1965"],
      video: "jacket",
      beats: [
        { t: "又是这级台阶。她坐在镜子后面，看着那场被骂作“惨败”的秀。", echo: 1918 },
        "法国人不买账。美国人买。",
        { t: "无领、直身、粗花呢，袖口真的能扣上，口袋真的能放东西，下摆缝一条细链子让它垂得笔直。", code: "suit" },
        { poll: { q: "她的回归是谁出的钱？", options: ["她自己的积蓄", "美国百货公司", "皮埃尔·韦尔泰梅"], answer: 2 } },
        "韦尔泰梅。作为交换，他买下了整个香奈儿：时装屋、名字，连康朋街的房子都算进去。",
        "她从此只是一个终身领薪水的设计师。她不在乎——她要的只是继续工作。"
      ], codes: ["suit"] },
    { year: 1955, place: "巴黎", scene: "1955 年 2 月", img: "Chanel_2.55.jpg", title: "腾出双手",
      looks: ["flap", "lace1958", "jacket1961"],
      video: "bags",
      beats: [
        "女人总是一手拿包，一手干别的。她给手袋加了一条链子，可以背在肩上。名字就是日期：2.55。",
        { t: "菱格绗缝来自马夫的夹克；链子像修女腰间挂钥匙的那串；内衬是酒红色——孤儿院制服的颜色。", code: "bag" },
        "她从没承认过这些来历。她最不愿意说的那段童年，被缝进了她最有名的包里。",
        { t: "两年后是双色鞋：米色鞋身让腿显得长，黑色鞋头让脚显得小。十个符号到这里全部出齐。", code: "shoes" }
      ], codes: ["bag", "shoes"] },
    { year: 1963, place: "达拉斯", scene: "11 月 22 日 · 机场", img: "President_and_Mrs_Kennedy_deplane_from_Air_Force_One_(3083217259)_(cropped).jpg", title: "粉色套装",
      looks: ["copy1966", "suit60s", "suit1965", "cream1960s"],
      lesson: "被模仿，是成功要付的赎金。",
      beats: [
        { cast: "jackie" },
        "那套后来沾满血迹的粉色套装，不是从巴黎来的——是纽约一家店按香奈儿授权的纸样，一针一线复刻的。",
        "她从不起诉仿制者。旁边这张博物馆藏品，左边是巴黎原版，右边是美国授权仿制版。你分得出来吗？"
      ] },
    { year: 1971, place: "巴黎 · 丽兹酒店", scene: "一个星期天", img: "Coco+chanel+1937-1_(5423401656).jpg", title: "星期天",
      beats: [
        "1 月 10 日，她在丽兹酒店的房间里去世，八十七岁。",
        "那天是星期天。她一辈子最讨厌星期天——因为没有人工作。",
        "康朋街的楼梯上，再也没有人坐在最上面那一级了。"
      ] },

    // —— 第五幕 ——
    { year: 1978, place: "巴黎 · 纽约", scene: "没有主人的十二年", img: "Chanel_suit_designed_by_Gaston_Berthelet_for_Chanel,_Fall-Winter_1972-3.jpg", title: "没有主人的房子",
      looks: ["berthelet1972"],
      beats: [
        "她走后，工作室的老员工照着她的样子一季一季地做，越做越像标本。",
        "1974 年，皮埃尔的孙子阿兰·韦尔泰梅接手。他先做了一件反直觉的事：把 5 号从药妆店货架上撤下来，故意让它难买。",
        "1978 年，香奈儿第一次推出成衣。可在年轻人眼里，它已经是“妈妈的牌子”。"
      ] },
    { year: 1983, place: "巴黎", scene: "一月 · 高定发布", img: "Hommage_à_Karl_Lagerfeld_(musée_des_arts_décoratifs,_Paris)_-_33415030458.jpg", title: "做她会做的事",
      logos: ["fendi"],
      looks: ["karl1983"],
      video: "karl",
      quote: { t: "我的工作不是做她做过的事，而是做她会做的事。", by: "卡尔·拉格斐" },
      beats: [
        { cast: "karl" },
        "阿兰请来一个德国人。他同时还在给罗马的芬迪做皮草。",
        "他把双 C 放大，印满全身；让粗花呢配牛仔、配皮夹克。",
        "老顾客吓坏了。她们的女儿开始排队。"
      ] },
    { year: 1987, place: "巴黎 · 旺多姆广场", scene: "一张独家合同，一块八角形的表", title: "一张脸，一块表",
      looks: ["coco1984"],
      beats: [
        { cast: "ines" },
        "拉格斐需要一张活的“香奈儿小姐”。他签下伊娜·德拉弗拉桑——第一位和高定时装屋签独家合约的模特。",
        "又高又瘦、短发、嘲讽地笑。她穿上套装，像年轻时的嘉柏丽尔本人。",
        "1984 年，调香师雅克·波尔日做出了以她小名命名的香水 Coco。",
        "1987 年，香奈儿第一次做手表：Première，八角形表盘取自 5 号的瓶盖和旺多姆广场的轮廓。",
        "问：一个时装屋，为什么要卖表？",
        "因为不是每个人都买得起一套高定，但很多人买得起一样“带着双 C 的东西”。"
      ] },
    { year: 1991, place: "巴黎", scene: "超模的年代", img: "Claudia_Schiffer_20091006_Chanel_02.jpg", title: "金链子和超模",
      looks: ["claudia2009", "egoiste1990", "allure1996"],
      beats: [
        "九十年代初，拉格斐把金链子一圈圈缠在腰上，把粗花呢剪成短裙，配上嘻哈式的大号双 C 吊坠。",
        "克劳迪娅·希弗成了他的缪斯。超模一个个走上香奈儿的 T 台，她们的脸比衣服传得更远。",
        "1990 年的男香 Égoïste 拍了一支广告：一排酒店窗户里，女人们推开百叶窗，对着镜头大喊“自私鬼！”",
        "香水和配饰撑起了利润，T 台负责制造欲望。这套分工，一直用到今天。"
      ] },
    { year: 2000, place: "瑞士 · 拉夏德芳", scene: "一块陶瓷", title: "黑色的陶瓷，白色的陶瓷",
      looks: ["cocomlle2001"],
      beats: [
        "香奈儿推出 J12：整只表用高科技陶瓷做成，起初只有黑色。三年后出了白色。",
        { t: "一块表，两种颜色，没有第三种——又是奥巴辛修道院的黑与白。", echo: 1883, code: "bw" },
        "它成了香奈儿卖得最好的表。一家时装屋，开始认真地做起了制表厂。",
        "第二年，香水部门推出 Coco Mademoiselle——同一个名字，写给更年轻的一代。"
      ] },
    { year: 2002, place: "巴黎周边", scene: "一座座濒临倒闭的工坊", title: "买下手艺",
      video: "couture",
      beats: [
        "做刺绣的、做羽毛的、做纽扣的、做帽子的、做鞋的……巴黎的老工坊一家家撑不下去。",
        "香奈儿成立了一家子公司，把它们一家家买下来，取名“Paraffection”——出于感情。",
        "每年专门为它们办一场“高级手工坊”秀。手艺不是成本，是护城河。"
      ] },
    { year: 2008, place: "香港 · 东京 · 纽约中央公园", scene: "一座会旅行的展馆", img: "ZahaHahidPavillionCentralPark2008.jpg", title: "白色的贝壳",
      beats: [
        "拉格斐请建筑师扎哈·哈迪德设计了一座可拆卸的白色展馆，形状像一只贝壳，里面陈列艺术家们以 2.55 为灵感的作品。",
        "它从香港出发，到东京，再到纽约中央公园。原计划还要去伦敦、莫斯科和巴黎。",
        "然后金融危机来了。巡展提前结束。",
        "问：奢侈品怕经济危机吗？",
        "怕。但它们更怕的是看起来在乎钱。展馆后来被送给了巴黎的阿拉伯世界研究所。"
      ] },
    { year: 2011, place: "巴黎", scene: "一只以爱人命名的包", img: "Sac_Chanel.jpg", title: "Boy",
      looks: ["boy", "mouglalis2010", "hc2011", "window2011", "lbdwin2011"],
      beats: [
        "拉格斐推出了一只更方、更硬朗的包，链条更粗，扣子像一块金属牌。",
        { t: "名字叫 Boy——她一生的爱人，那个替她担保开第一家店的男人。", echo: 1910 },
        "九十年过去了。品牌在用一段爱情故事，卖给年轻一代。"
      ] },
    { year: 2012, place: "东京 · 纽约 · 巴黎", scene: "一件外套，一百多张照片", img: "Anna Mouglalis (8121876628).jpg", title: "小黑外套",
      looks: ["heidi2012", "street2012", "ines2012", "robot"],
      beats: [
        "拉格斐亲自掌镜，造型师卡琳·洛菲德搭配，一百多位名人穿同一件黑色粗花呢外套拍照。",
        { t: "同一件外套，配礼服、配牛仔、配朋克——这是 1954 年那件外套的第一百种穿法。", echo: 1954 },
        "照片做成一本书，又办成巡回展览，一路走过东京、纽约、巴黎。",
        "这是香奈儿最擅长的生意：不发明新东西，而是让旧东西不停地被重新看见。"
      ] },
    { year: 2014, place: "巴黎 · 大皇宫", scene: "三月 · 一家超市", img: "Chanel_Haute_Couture_Fall-Winter_2011.jpg", title: "秀场即广告",
      looks: ["ss10_1", "ss10_5", "model2009", "lbd2009", "lbd2009b"],
      video: "supermarket",
      beats: [
        "2009 年 10 月，他把大皇宫变成一座巨大的谷仓；克劳迪娅·希弗重回香奈儿秀场，门外的镜头比秀里还多。",
        "2014 年，他又在大皇宫里搭了一座超市：货架上是香奈儿牌的番茄酱、扫帚和牛奶。",
        "后来是机场、赌场、冰山、海滩。一场秀十几分钟，造价以百万欧元计。",
        "但它会被拍下来、传出去，被几亿人看到。秀场是全世界最贵的广告牌。"
      ] },
    { year: 2017, place: "哈瓦那 · 巴黎大皇宫", scene: "一辆老爷车，一枚火箭", title: "火箭发射",
      looks: ["mannequin2017", "mannequins2017"],
      video: "rocket",
      beats: [
        "2016 年 5 月，香奈儿在古巴哈瓦那办了一场度假系列秀：模特从老爷车上走下来。",
        "2017 年 3 月，大皇宫中央立起一枚印着双 C 的火箭。秀的最后，它“点火升空”，烟雾灌满穹顶。",
        "这是拉格斐在香奈儿的第三十四年。他快八十四岁了。"
      ] },
    { year: 2018, place: "伦敦", scene: "一百多年来第一次", img: "Chanel_boutique,_Rue_Cambon,_Paris_2009.jpg", title: "第一次公开账本",
      logos: ["lv"],
      looks: ["noordhoff2018"],
      stat: { n: "96 亿美元", l: "2017 年营收，首次公布" },
      beats: [
        "为了安抚担心它要被卖掉的市场，香奈儿第一次公布了财报。",
        "同一年，LVMH 靠七十多个品牌做到 426 亿欧元。香奈儿只有一个品牌。",
        "问：会卖吗？会上市吗？",
        "财务总监说：不卖，不上市。"
      ] },

    // —— 第六幕 ——
    { year: 2019, place: "巴黎", scene: "二月 · 一个人走了", img: "Virginie_Viard_filmed_by_Sofia_Coppola.jpg", title: "副手接棒",
      beats: [
        "拉格斐去世，八十五岁。他在香奈儿工作了三十六年，比嘉柏丽尔本人掌舵的时间还长。",
        { cast: "viard" },
        "接班的是他身边三十年的副手。她不搭火箭，不搭超市，把衣服做得更轻、更好穿。",
        "评论说：太安全了。"
      ] },
    { year: 2020, place: "全球", scene: "门店关闭的一年", img: "CHANEL_ROCK_ROMANTICISM_2021_CRUISE.jpg", title: "没有观众的秀",
      looks: ["cruise2021", "kim2020", "honore2021"],
      stat: { n: "−18%", l: "2020 年营收，跌到约 101 亿美元" },
      beats: [
        "疫情来了。全世界的精品店关门，秀场没有观众。",
        "原定在意大利卡普里岛的度假系列秀取消，改成一组照片和一段影片在网上发布。",
        "营收跌了将近两成。可香奈儿没有打折，也没有裁员。",
        "它反而做了一件事：涨价。"
      ] },
    { year: 2021, place: "全球", scene: "一个数字的一百岁", img: "HK Chanel microchip Mini Flap Mini Square Light Grey 晶片淺灰色方淡金色鈎鏈手袋 px3.jpg", title: "包里的芯片",
      looks: ["chip2021", "no5_parfum", "no5_2017", "elixir"],
      stat: { n: "约 156 亿美元", l: "2021 年营收，比疫情前还高" },
      beats: [
        { t: "5 号香水一百岁了。那个只有一个数字的方瓶子，还是全世界最有名的香水。", echo: 1921 },
        "这一年，香奈儿手袋里的真品卡和防伪贴纸，换成了一枚内嵌的芯片。",
        "问：为什么要芯片？",
        "因为二手市场上的香奈儿，有时比新的还贵。一只包，成了一种可以转手的资产。",
        "报复性消费来了。营收不仅收复失地，还比 2019 年更高。"
      ] },
    { year: 2022, place: "伦敦 · 香港", scene: "一位从联合利华来的 CEO", img: "HK 中環 Central 太子大廈 Prince's Building mall shop CHANEL clothing store window display handbags August 2022 Px3 02.jpg", title: "限购",
      looks: ["window2022", "cwb2022", "central2022"],
      beats: [
        { cast: "nair" },
        "香奈儿请来一位做人力资源出身的全球 CEO。她没做过时装，做过的是全球最大的日化公司。",
        "同一年，有的市场开始对经典口盖包限购：一人一年一只。",
        "橱窗里的包越摆越少，门外排队的人越来越多。"
      ] },
    { year: 2023, place: "全球", scene: "一只包的价格", img: "Christmas 2023 Chanel Fine Jewellery New Bond Street.jpg", title: "越贵越好卖",
      looks: ["bond2023", "bryanboy2023"],
      stat: { n: "10,200", l: "美元：2023 年经典口盖包美国售价（2019 年为 5,800）" },
      beats: [
        "经典口盖包四年涨价将近一倍。",
        "营收从 2017 年的 96 亿美元，涨到 2023 年的近 200 亿；营业利润 64 亿。",
        "它卖的已经不只是包，而是“买得到”这件事本身。",
        "问：这能一直涨下去吗？"
      ] },
    { year: 2024, place: "巴黎", scene: "六月 · 一份简短的声明", img: "Chanel_Display,_Rue_Cambon,_Paris_April_2011.jpg", title: "利润掉了三成",
      looks: ["jennie2024"],
      stat: { n: "−30%", l: "2024 年营业利润，约 45 亿美元" },
      beats: [
        "不能。中国市场放缓，涨价的魔法开始失灵。营收约 187 亿美元，四年来第一次下跌。",
        "6 月，香奈儿宣布维亚离开。没有告别秀，只有一份几行字的声明。",
        "半年里，外界猜了一个又一个名字。",
        "12 月，答案揭晓：马修·布拉齐，一个在葆蝶家把一只编织包重新做红的法国人。",
        "问：为什么是他？",
        "因为他擅长的事，正是香奈儿此刻最缺的：让熟悉的东西重新让人心跳。"
      ] },
    { year: 2025, place: "巴黎 · 大皇宫", scene: "十月 · 星球之间", img: "France-000296_-_Paris'_Grand_Palais_(14525102530).jpg", title: "新掌舵人",
      logos: ["bottega"],
      looks: ["goyounjung2025"],
      video: "blazy",
      beats: [
        { cast: "blazy" },
        "大皇宫的穹顶下悬着一颗颗星球。一个从外面来的人，交出了他在香奈儿的第一场秀。",
        "条纹衫、男式衬衫、粗花呢——他回到了最开始：多维尔海边的那个女人。",
        { t: "一百一十年了，衣服还在讲同一个故事。", echo: 1913 }
      ] },
    { year: 2025, place: "纽约 · 包厘街地铁站", scene: "十二月二日 · 一座废弃的站台", title: "地下的手艺",
      looks: ["constellation2025"],
      video: "metiersNY",
      beats: [
        "他的第一场高级手工坊秀，没有去宫殿，而是选在纽约一段停用的地铁站里。",
        "勒萨日工坊绣出了豹纹粗花呢，米歇尔工坊做了帽子——都是 2002 年香奈儿出于感情买下的那些老作坊。",
        { t: "上一次香奈儿在纽约办这场秀，是 2018 年，拉格斐选在大都会博物馆的埃及神庙前。", echo: 2002 },
        "从神庙到地铁站。新掌舵人想说：香奈儿不只属于宫殿。"
      ] },
    { year: 2026, place: "巴黎 · 大皇宫 · 纽约", scene: "一月 · 第一季高定；五月 · 红毯", img: "Margot Robbie 2026 Met Gala.jpg", title: "一群鸟",
      looks: ["robbie2026", "jennie2026", "ayo2026", "gracie2026"],
      beats: [
        "1 月 27 日，布拉齐的第一场高级定制：54 套，主题是轻——羽毛、薄纱、像鸟一样的廓形。",
        { t: "他重新做了一条小黑裙。一百年前，《Vogue》叫它“香奈儿的福特”。", echo: 1926, code: "lbd" },
        "5 月 4 日，大都会慈善晚宴，主题“服装艺术”。玛格特·罗比、Jennie、艾尤·艾德贝里、格蕾西·艾布拉姆斯——红毯上一排人穿着他做的香奈儿。",
        "红毯就是另一条 T 台。一个新设计师有没有被接受，先看明星愿不愿意穿。",
        "评论终于不再说“安全”。"
      ] },
    { year: 2026, place: "比亚里茨", scene: "四月二十八日 · 海边", title: "回到第一家时装屋",
      video: "cruiseBiarritz",
      stat: { n: "约 193 亿美元", l: "2025 年营收：止跌回升，利润约 47 亿" },
      beats: [
        { t: "2026/27 度假系列，布拉齐把秀带到了比亚里茨——1915 年，嘉柏丽尔在这里开了她第一家真正的时装屋。", echo: 1913 },
        "11 月，这个系列还要飞到悉尼再走一次。",
        "五月公布的年报里，营收回升、利润止跌。CEO 把功劳记在了“新的创作势头”上。",
        "美洲在涨，亚洲还冷。故事没有完全翻篇。"
      ] },
    { year: 2026, place: "首尔 · 汝矣岛", scene: "五月二十六日 · 一座还没开馆的美术馆", img: "2026-05-26 Tilda Swinton for Chanel 05.jpg", title: "把秀搬到首尔",
      looks: ["sora2026", "sora2026b", "tilda2026", "tilda2026b", "kazuha2026", "wonhee2026"],
      beats: [
        "亚洲还冷——所以香奈儿亲自去了。纽约地铁站里那个高级手工坊系列，半年后在首尔又走了一遍。",
        "81 套衣服，场地是一周后才对公众开放的汉华蓬皮杜中心。整座新美术馆，先给香奈儿用。",
        "模特崔素拉走上 T 台，第一次公开了自己的孕肚。蒂尔达·斯文顿坐在台下，Jennie 在派对上唱歌。",
        "问：为什么是首尔？",
        "因为韩国已经是香奈儿最舍得花钱的市场之一，而它的明星决定着整个亚洲年轻人想穿什么。"
      ] },
    { year: 2026, place: "巴黎 · 大皇宫", scene: "十月五日 · 九十五只发光的鸟", title: "她本人的那只包",
      beats: [
        "2027 春夏成衣，名叫《对话·第三部》。83 套衣服，穹顶下悬着 95 只发光的鸟。",
        { t: "开场的模特，肩上背着的是嘉柏丽尔·香奈儿本人用过的那只 2.55。", echo: 1955, code: "bag" },
        "压轴是一套黑色粗花呢套装——七十二年前，她在镜面楼梯上看着它第一次出场。",
        "问：下一站去哪儿？",
        { t: "多维尔。2027 年 4 月，度假系列回到她开第二家店的那片海滩。", echo: 1913 }
      ] }
  ],

  // 尾声：回答开篇之问
  ending: [
    "所以，香奈儿到底属于谁？",
    "按法律：属于韦尔泰梅家族。皮埃尔的孙子阿兰与杰拉尔两兄弟，至今拥有它的全部。他们几乎从不接受采访。",
    "她本人？从 100%，到 10%，到 2%，再到 0。",
    "她走后五十多年，掌舵人换了四任，营收涨到将近两百亿美元。",
    "问：那她输了吗？",
    "账本上，是的。",
    "可是你刚才读到的那十个符号——黑与白、针织、5 号、粗花呢、珍珠、山茶花、小黑裙、套装、2.55、双色鞋——没有一个是韦尔泰梅发明的。",
    "他们买下的是名字。名字之所以值钱，是因为她。",
    "2026 年秋天，新掌舵人让开场模特背着她本人的那只包走出来——他也知道这一点。",
    "这也许是时尚生意最奇怪的地方：你可以卖掉一个品牌，但卖不掉是谁创造了它。"
  ],

  captions: {
    "Coco_Chanel_in_Los_Angeles,_1931_(cropped).jpg": "嘉柏丽尔·香奈儿在洛杉矶，1931 年",
    "Panorama_of_Saumur.JPG": "卢瓦尔河畔的索米尔",
    "Coupe.transept.eglise.Obazine.png": "奥巴辛修道院教堂剖面图",
    "Moulins_-_Perspective3.JPG": "穆兰街景",
    "Balsan,_célèbre_propriétaire,_entraîneur,_Jockey,_gentleman.jpg": "艾蒂安·巴勒松",
    "Arthur_Edward_Capel.png": "亚瑟·“男孩”·卡柏",
    "Gabrielle_Chanel_en_marinière.jpg": "身穿水手条纹衫的香奈儿",
    "31_Rue_Cambon_Ancien_Ancien_appartement_de_Coco_Chanel.JPG": "康朋街 31 号的香奈儿公寓",
    "Ernest_Beaux.jpg": "调香师恩尼斯·鲍",
    "(Pierre)_Wertheimer_(propriétaire_du_cheval_Epinard,_à_l'hippodrome_de_Saint-Cloud,_lors_du_match_contre_le_cheval_Sir_Gallahad,_le_19_mai_1924)_-_(photographie_de_presse)_-_(Agence_Rol).jpg": "皮埃尔·韦尔泰梅在圣克卢赛马场，1924 年",
    "Hugh_Grosvenor,_2nd_Duke_of_Westminster.jpg": "第二代威斯敏斯特公爵",
    "1933_H_von_Dincklage.jpg": "汉斯·君特·冯·丁克拉格，1933 年",
    "Marilyn_Monroe_in_Niagara.jpg": "玛丽莲·梦露，《飞瀑怒潮》剧照",
    "Chanel_2.55.jpg": "2.55 手袋",
    "President_and_Mrs_Kennedy_deplane_from_Air_Force_One_(3083217259)_(cropped).jpg": "1963 年 11 月 22 日，肯尼迪夫妇抵达达拉斯",
    "Coco+chanel+1937-1_(5423401656).jpg": "香奈儿，1937 年",
    "Fendi_store_opening_-_Karl_Lagerfeld_(14091153382)_crop.jpg": "卡尔·拉格斐",
    "Chanel_boutique,_Rue_Cambon,_Paris_2009.jpg": "康朋街的香奈儿精品店",
    "Virginie_Viard_filmed_by_Sofia_Coppola.jpg": "维吉妮·维亚",
    "Chanel_Display,_Rue_Cambon,_Paris_April_2011.jpg": "康朋街的香奈儿橱窗",
    "France-000296_-_Paris'_Grand_Palais_(14525102530).jpg": "巴黎大皇宫",
    "Chanel_jersey_casual_wear_1917,.jpg": "香奈儿针织便装，1917 年时装插画",
    "Sem_Chanel.jpg": "插画家 Sem 为 5 号香水画的广告，1920 年代",
    "Designs_by_Chanel_and_Myrbor_-_Harper's_Bazar_1925-09.jpg": "《Harper's Bazar》上的香奈儿新款，1925 年 9 月",
    "Den_lille_sorte_kjole_-_Coco_Chanel_design.jpg": "1920 年代的香奈儿小黑裙，丹麦欧登塞",
    "Modèle_Chanel_photographié_par_Studio_Dorvyne_en_1938.jpg": "香奈儿模特，Studio Dorvyne 摄于 1938 年",
    "Suit_by_Coco_Chanel,_c._1955,_wool,_silk_-_Musée_de_la_mode_-_Montreal,_Canada_-_DSC07028.jpg": "香奈儿套装，约 1955 年，蒙特利尔时装博物馆",
    "Chanel_suit_designed_by_Gaston_Berthelet_for_Chanel,_Fall-Winter_1972-3.jpg": "她去世后的套装，1972—73 秋冬",
    "Hommage_à_Karl_Lagerfeld_(musée_des_arts_décoratifs,_Paris)_-_33415030458.jpg": "拉格斐为香奈儿做的第一季，巴黎装饰艺术博物馆",
    "Chanel_Haute_Couture_Fall-Winter_2011.jpg": "大皇宫里的香奈儿高定秀，2011 秋冬",
    "Dmitriy_Pavlovich_of_Russia_and_Coco_Chanel.jpg": "德米特里大公与香奈儿，1920 年代",
    "1965_Chanel_suit_and_silk_blouse_detail.jpg": "1965 年香奈儿套装的粗花呢细节",
    "Heidi_Mount_at_Chanel_SS2012_Collection_Photo_Ed_Kavishe.jpg": "香奈儿 2012 春夏秀场",
    "Claudia_Schiffer_20091006_Chanel_02.jpg": "克劳迪娅·希弗，2009 年重回香奈儿秀场",
    "ZahaHahidPavillionCentralPark2008.jpg": "扎哈·哈迪德设计的 Mobile Art 展馆，纽约中央公园，2008 年",
    "Sac_Chanel.jpg": "Boy 手袋",
    "Anna Mouglalis (8121876628).jpg": "“小黑外套”展览上的安娜·穆格拉莉丝，2012 年",
    "CHANEL_ROCK_ROMANTICISM_2021_CRUISE.jpg": "维亚的 2021 早春度假系列",
    "HK Chanel microchip Mini Flap Mini Square Light Grey 晶片淺灰色方淡金色鈎鏈手袋 px3.jpg": "内嵌芯片的香奈儿迷你口盖包，香港",
    "HK 中環 Central 太子大廈 Prince's Building mall shop CHANEL clothing store window display handbags August 2022 Px3 02.jpg": "香港中环太子大厦的香奈儿橱窗，2022 年 8 月",
    "Christmas 2023 Chanel Fine Jewellery New Bond Street.jpg": "伦敦新邦德街的香奈儿高级珠宝店，2023 年圣诞",
    "2026-05-26 Tilda Swinton for Chanel 05.jpg": "蒂尔达·斯文顿在首尔高级手工坊秀，2026 年 5 月 26 日",
    "Margot Robbie 2026 Met Gala.jpg": "玛格特·罗比身穿布拉齐设计的香奈儿，2026 年大都会慈善晚宴",
    "2026-05-26 Tilda Swinton for Chanel 01.jpg": "蒂尔达·斯文顿身穿布拉齐设计的香奈儿，2026 年 5 月"
  }
};

/* 倒叙版（fashion-noir.html）专用的叙事层。
   正序的文字是“先发问、下一章作答”；倒过来读时这些钩子会断。这里按章节标题覆盖：
     beats  倒叙时替换整章 beats（只给需要改的章）
     out    章末的“倒带”问题，答案在下一张（更早的）章节里
   acts 按幕号覆盖幕头导语；ending 覆盖尾声。 */
window.MAG.rewind = {
  acts: {
    6: "一个外人接过剪刀之前，香奈儿先后经历了疫情、涨价和利润三成的下滑。再往前，是拉格斐的最后一年。",
    5: "公开账本、火箭、超市、超模——拉格斐三十六年的热闹，起点是一栋没有主人、越做越旧的房子。",
    4: "她死在一个星期天。倒回十七年，是她七十一岁的归来，和一份把一切卖掉的合同。",
    3: "梦露那句“只穿 5 号”的背后，是一场打了二十年的官司，和一段品牌史通常一笔带过的战争。",
    2: "小黑裙、粗花呢、珍珠、5 号——她最风光的十几年，也是她签下 10% 的那几年。",
    1: "所有符号的源头：一个不肯说出身世的孤儿，和一座只有黑白两色的修道院。"
  },
  ch: {
    "她本人的那只包": {
      beats: [
        "这一季叫《对话·第三部》，83 套衣服。设计师马修·布拉齐，接手香奈儿刚满一年。",
        { t: "开场是她的旧包，压轴是一套黑色粗花呢套装——七十二年前，她坐在镜面楼梯顶上，看着它第一次出场。", echo: 1954 },
        { t: "明年四月，度假系列还要回到多维尔，她开第二家店的那片海滩。", echo: 1913 }
      ],
      out: "把她的旧包背上 T 台之前，这位新设计师这一年还做了什么？"
    },
    "把秀搬到首尔": {
      beats: [
        "5 月 26 日，首尔汝矣岛。一个半年前在纽约地铁站里首演的高级手工坊系列，被整个搬了过来。",
        "81 套衣服，场地是一周后才对公众开放的汉华蓬皮杜中心。整座新美术馆，先给香奈儿用。",
        "模特崔素拉走上 T 台，第一次公开了自己的孕肚。蒂尔达·斯文顿坐在台下，Jennie 在派对上唱歌。",
        "问：为什么是首尔？",
        "因为亚洲还冷。而韩国是香奈儿最舍得花钱的市场之一，它的明星决定着整个亚洲年轻人想穿什么。"
      ],
      out: "“亚洲还冷”——这句话写在哪里？"
    },
    "回到第一家时装屋": {
      beats: [
        "写在五月公布的年报里：营收回升、利润止跌。美洲在涨，亚洲还冷。",
        "CEO 把功劳记在了“新的创作势头”上。",
        { t: "这一年的度假系列，布拉齐把秀带到了比亚里茨——1915 年，嘉柏丽尔在这里开了她第一家真正的时装屋。", echo: 1913 },
        "11 月，这个系列还要飞到悉尼再走一次。"
      ],
      out: "“新的创作势头”从哪儿来？倒回这一年的一月。"
    },
    "一群鸟": {
      beats: [
        "1 月 27 日，布拉齐的第一场高级定制：54 套，主题是轻——羽毛、薄纱、像鸟一样的廓形。",
        { t: "他重新做了一条小黑裙。一百年前，《Vogue》叫它“香奈儿的福特”。", echo: 1926, code: "lbd" },
        "5 月 4 日，大都会慈善晚宴，主题“服装艺术”。玛格特·罗比、Jennie、艾尤·艾德贝里、格蕾西·艾布拉姆斯——红毯上一排人穿着他做的香奈儿。",
        "红毯就是另一条 T 台。一个新设计师有没有被接受，先看明星愿不愿意穿。",
        "评论终于不再用那个跟了香奈儿七年的词：“安全”。"
      ],
      out: "在这之前一个月，他已经把一场秀放进了地下。在哪儿？"
    },
    "地下的手艺": { out: "再往前两个月：这个“外人”第一次走进大皇宫，交出了什么？" },
    "新掌舵人": { out: "一个从葆蝶家来的人，是怎么坐上这把椅子的？倒回一年。" },
    "利润掉了三成": {
      beats: [
        "2024 年，涨价的魔法开始失灵。中国市场放缓，营收约 187 亿美元，四年来第一次下跌。",
        "6 月，香奈儿宣布维亚离开。没有告别秀，只有一份几行字的声明。",
        "半年里，外界猜了一个又一个名字。",
        "12 月，答案揭晓：马修·布拉齐，一个在葆蝶家把一只编织包重新做红的法国人。",
        "问：为什么是他？",
        "因为他擅长的事，正是香奈儿此刻最缺的：让熟悉的东西重新让人心跳。"
      ],
      out: "跌下来之前，它涨得有多猛？"
    },
    "越贵越好卖": {
      beats: [
        "经典口盖包四年涨价将近一倍。",
        "营收从 2017 年的 96 亿美元，涨到 2023 年的近 200 亿；营业利润 64 亿。",
        "它卖的已经不只是包，而是“买得到”这件事本身。",
        "问：这能一直涨下去吗？",
        "你已经知道答案了：第二年，它就跌了。"
      ],
      out: "一只包，凭什么能四年涨一倍？"
    },
    "限购": {
      beats: [
        "办法之一：让它买不到。从这一年起，有的市场对经典口盖包限购，一人一年一只。",
        "橱窗里的包越摆越少，门外排队的人越来越多。",
        { cast: "nair" },
        "同一年，香奈儿请来一位做人力资源出身的全球 CEO。她没做过时装，做过的是全球最大的日化公司。"
      ],
      out: "可排队的人是从哪儿来的？疫情不是才刚过去吗？"
    },
    "包里的芯片": {
      beats: [
        "报复性消费来了。2021 年，营收不仅收复失地，还比 2019 年更高。",
        "这一年，香奈儿手袋里的真品卡和防伪贴纸，换成了一枚内嵌的芯片。",
        "问：为什么要芯片？",
        "因为二手市场上的香奈儿，有时比新的还贵。一只包，成了一种可以转手的资产。",
        { t: "5 号香水一百岁了。那个只有一个数字的方瓶子，还是全世界最有名的香水。", echo: 1921 }
      ],
      out: "“收复失地”——一年前，它跌得有多惨？"
    },
    "没有观众的秀": { out: "疫情来的前一年，坐在设计台前的是谁？" },
    "副手接棒": {
      beats: [
        { cast: "karl" },
        "拉格斐去世，八十五岁。他在香奈儿工作了三十六年，比嘉柏丽尔本人掌舵的时间还长。",
        { cast: "viard" },
        "接班的是他身边三十年的副手。她不搭火箭，不搭超市，把衣服做得更轻、更好穿。",
        "评论说：太安全了。——这个词，跟了她五年。"
      ],
      out: "拉格斐留下的，除了衣服，还有一家什么样的公司？"
    },
    "第一次公开账本": { out: "这家不肯卖、不肯上市的公司，靠什么让全世界一直看着它？" },
    "火箭发射": { out: "一场秀动辄几百万欧元，只为十几分钟——值吗？" },
    "秀场即广告": { out: "除了秀场，他还有什么办法，让旧东西被重新看见？" },
    "小黑外套": { out: "旧东西要卖给年轻人，光换个穿法够吗？还得有一个故事。" },
    "Boy": { out: "Boy 之前，那只最有名的 2.55，又是怎么被重新讲了一遍的？" },
    "白色的贝壳": { out: "展馆里那些刺绣、羽毛和纽扣，靠谁一针一线做出来？" },
    "买下手艺": { out: "买下作坊的同时，这家时装屋还在悄悄长出什么？" },
    "黑色的陶瓷，白色的陶瓷": { out: "在表和新香水之前，这个“妈妈的牌子”是怎么在九十年代重新变酷的？" },
    "金链子和超模": { out: "超模之前，拉格斐找的第一张“脸”是谁？" },
    "一张脸，一块表": { out: "签下她的这个德国人，又是怎么来的？" },
    "做她会做的事": {
      beats: [
        { cast: "karl" },
        "1983 年，韦尔泰梅家的阿兰请来一个德国人。他同时还在给罗马的芬迪做皮草。",
        "他把双 C 放大，印满全身；让粗花呢配牛仔、配皮夹克。",
        "老顾客吓坏了。她们的女儿开始排队。"
      ],
      out: "一个法国品牌，为什么要请一个德国人来救？它出了什么事？"
    },
    "没有主人的房子": { out: "“她走后”——她是怎么走的？" },
    "星期天": { out: "去世前八年，全世界最有名的一套香奈儿，穿在谁身上？" },
    "粉色套装": { out: "开场那只被背上 T 台的旧包，终于要出现了。它是哪一年做的？" },
    "腾出双手": {
      beats: [
        "女人总是一手拿包，一手干别的。她给手袋加了一条链子，可以背在肩上。名字就是日期：2.55。",
        { t: "菱格绗缝来自马夫的夹克；链子像修女腰间挂钥匙的那串；内衬是酒红色——孤儿院制服的颜色。", code: "bag" },
        "她从没承认过这些来历。她最不愿意说的那段童年，被缝进了她最有名的包里。七十一年后，新设计师把这只包原样背上了大皇宫。",
        { t: "两年后是双色鞋：米色鞋身让腿显得长，黑色鞋头让脚显得小。十个符号里，这是最晚的一个。", code: "shoes" }
      ],
      out: "做这只包时，她已经七十出头。她是怎么回到康朋街的？"
    },
    "七十一岁归来": {
      beats: [
        { t: "她坐在镜面楼梯最上面那一级，从镜子里看着那场被骂作“惨败”的秀——这个位置，往下翻到 1918 年你会再看见。", echo: 1918 },
        "法国人不买账。美国人买。",
        { t: "无领、直身、粗花呢，袖口真的能扣上，口袋真的能放东西，下摆缝一条细链子让它垂得笔直。", code: "suit" },
        { poll: { q: "她的回归是谁出的钱？", options: ["她自己的积蓄", "美国百货公司", "皮埃尔·韦尔泰梅"], answer: 2 } },
        "韦尔泰梅。作为交换，他买下了整个香奈儿：时装屋、名字，连康朋街的房子都算进去。",
        { cast: "wertheimer" },
        "她从此只是一个终身领薪水的设计师。她不在乎——她要的只是继续工作。"
      ],
      out: "她为什么要靠韦尔泰梅的钱？全世界最畅销的香水，不是她的吗？"
    },
    "只穿 5 号": { out: "2%——这个数字是怎么谈出来的？" },
    "2% 的和解": { out: "她为什么在瑞士？又为什么要跟韦尔泰梅抢生意？" },
    "关门，与暗面": { out: "战争之前，她站在多高的地方？" },
    "香奈儿的福特": { out: "除了黑色，她还从男人那里拿来了什么？" },
    "公爵的粗花呢": { out: "盒子上印着双 C 的那瓶香水，她本人分到多少？" },
    "10% 的代价": { out: "这瓶让她后悔一辈子的香水，是怎么被闻出来的？" },
    "第 5 号样本": { out: "她第一次把黑色穿成自己的颜色，是为了谁？" },
    "镜面楼梯": {
      beats: [
        "她买下康朋街 31 号整栋楼。通往沙龙的螺旋楼梯四面都是镜子。",
        "发布会那天，她就坐在楼梯顶上的那一级——从镜子里看观众的表情，观众看不见她。你在 1954 年已经见过这级台阶。",
        { cast: "capel" },
        "第二年圣诞节前三天，卡柏开车去戛纳的路上出了车祸。他已经娶了别人，她连去葬礼的身份都没有。",
        { t: "她让人把卧室刷成黑色。很多人相信，从这一年起，黑色在她手里不再是丧服的颜色。", code: "lbd" }
      ],
      out: "卡柏不只是她的爱人。他还替她做过什么？"
    },
    "海边的针织衫": {
      beats: [
        "他是她的出资人。卡柏又出钱，在诺曼底的多维尔开了第二家店。战争来了，女人们要逃难、要工作——裙撑和胸衣成了累赘。",
        { t: "她做宽松的水手条纹衫和直身裙，买下一整批原本做男人内衣的针织布。巴黎人说她在卖“穷人的衣服”。卖疯了。", code: "jersey" },
        "1915 年，她在西班牙边境的比亚里茨开了第一家真正的时装屋。1916 年，她把卡柏的钱全部还清。",
        "这两座海边小城，你在 2026 年已经见过：一百一十年后，香奈儿的秀又回到了这里。"
      ],
      out: "第二家店——那第一家呢？"
    },
    "只准卖帽子": { out: "一个驻军小城的孤女，是怎么认识一个英国富商的？" },
    "“可可”，和一衣柜的男装": {
      beats: [
        "她在驻军小城的咖啡馆给军官唱歌，只会两首，其中一首叫《谁见过可可？》。嗓子没留下，名字留下了。",
        { cast: "balsan" },
        "她搬进巴勒松的庄园，成了“被供养的女人”。别的女人侧坐骑马、裹着长裙；她让马夫改了一条男式马裤，跨坐着骑。",
        "她借男人的衬衫和外套穿，又给自己做了一顶平顶草帽——干净、没有羽毛。女客们都来找她要帽子。",
        "也是在这座庄园里，她认识了巴勒松的朋友：英国人亚瑟·卡柏，大家叫他 Boy。"
      ],
      out: "“可可”是艺名。她真正的来历，为什么一辈子不肯说？"
    }
  },
  ending: [
    "我们从 2026 年的大皇宫一路倒回来，停在这座修道院。",
    "问：所以，香奈儿到底属于谁？",
    "按法律：属于韦尔泰梅家族。皮埃尔的孙子阿兰与杰拉尔两兄弟，至今拥有它的全部。他们几乎从不接受采访。",
    "她本人？倒着数：0，2%，10%——再往前，是那家用借来的钱开的帽子店，100%。",
    "问：那她输了吗？",
    "账本上，是的。",
    "可是这一路倒着看过来的十个符号——双色鞋、2.55、套装、小黑裙、山茶花、珍珠、粗花呢、5 号、针织，最后都收拢到同一个地方：这里的白墙和黑门。",
    "2026 年秋天被背上 T 台的那只包，内衬是孤儿院制服的酒红色。她一辈子不肯提的地方，成了这个品牌最值钱的东西。",
    "他们买下的是名字。名字之所以值钱，是因为她。",
    "你可以卖掉一个品牌，但卖不掉是谁创造了它。"
  ]
};
