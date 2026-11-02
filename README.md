# 商海时报 · The Chronicle of Commerce

一份可以翻页的商业故事报：七百年商业影像随时间流动，看一门生意如何穿越时代。
灵感来自 [江山时序](https://github.com/DeanChensj/jiangshan-map)，选题参考播客「虚实之间」。

**在线访问：** https://shangliy.github.io/chronicle-of-commerce/ （[倒叙黑白版](https://shangliy.github.io/chronicle-of-commerce/fashion-noir.html) · [香奈儿滚动版](https://shangliy.github.io/chronicle-of-commerce/fashion.html) · [翻页版](https://shangliy.github.io/chronicle-of-commerce/fashion-book.html) · [家族版](https://shangliy.github.io/chronicle-of-commerce/family.html)）

## 玩法

1. **时光机（头版顶部）**：一键播放 1300 → 2026。年份滚动，时代色带随之变色，新时代到来时盖下“时代更替”印章，
   每到一则史事，剪报就“啪”地落到桌面上；九条泳道（编年大事 + 8 个故事）随时间生长点亮。
   - 拖动标尺穿越时间，悬停圆点预览，点击直接翻到那一页；点时代色带跳到该时代
   - 空白年代自动快进、事件密集处放慢，可切换 1× / 2× / 4×
   - 往下读版面时，时间轴自动缩成细条停靠在屏幕底部（左侧显示年份与播放键），仍可拖动、点圆点、播放；回到顶部恢复原样
2. **头版随年份演进**：时光机走到哪一年，下面整版就是那一年的报纸——
   - 头条换成当年最新进展的故事（附前情提要与进度条），报头显示「1929 年版 · 大战与大萧条」
   - 各故事栏显示「连载 · 第 k 站 / 完结 / 未刊 · 还要再等 N 年」，按更新时间重新排版，变动的栏目会“重新上墨”
   - 编年简讯只列已发生的大事（最新带「新」字），底部「下期预告」提示下一则消息
   - 「时间之河」里未来的照片蒙尘模糊，年代越早，网点照片的泛黄越重
3. **翻页阅读**：每个故事是一本小报——封面拼贴 + 目录 → 每站一个跨页（左图右文，3D 翻页） → 封底「本期启示」+ 下期预告。
   - 右页附「同一时期 · 世界商业」：其他故事里相近年份的事，点击即可跨故事跳转
   - 底部胶片条 + 年份标尺；← → / 点击页面左右半边 / 触屏滑动翻页，空格自动翻页，Esc 返回
   - 「旧报色调 / 原图色彩」切换
4. **号外**：17 条全球商业里程碑（美第奇银行 → 雷曼倒闭）。
5. **看图猜年份**：5 张老照片，滑尺估年份，按误差计分评段位。
6. **检索**：城市、公司、人物、年份、关键词。

故事：梵克雅宝 · 球星卡 · 冷气背后的文明 · 赎罪券到碳交易 · 胡迪尼 · 厄尔尼诺 · 悬疑经济 · 韩国存储

可分享链接：`?story=houdini&page=3`、`?event=1929`、`?year=1971`（时光机停在某年）。

## 家族版 · 罗斯柴尔德家报（`family.html`）

同一套引擎，只讲一个家族：1744 年法兰克福犹太巷 → 2023 年 Rothschild & Co 退市。

- **八条泳道**：世界大事 + 法兰克福 / 伦敦 / 巴黎 / 维也纳 / 那不勒斯 / 酒庄与庄园 / 合流，共 50 站
- **家谱随时间生长**（时光机下方）：七代 27 位主要人物按代排布。未出生时是淡影；出生时头像弹出、
  与父辈的连线“画”出来；去世后转为旧照色调并标 †。顶部实时显示「在世 N 人 · 已传 k 代」，
  点击人物看小传，可一键跳到他出生那年或翻阅他所在的那一支
- 头版、翻页阅读、看图猜年份、检索与主报一致，链接参数也相同：`family.html?year=1871`

### 换成别的家族或品牌

1. 复制 `js/family-rothschild.js` 为 `js/family-xxx.js`，改写：
   - `SITE`：年份范围、标尺刻度、播放按钮文字、终刊语、猜年份范围
   - `ERAS` / `EVENTS` / `STORIES`：与主报同构，品牌可以按产品线或市场分“支”
   - `FAMILY`：`{ id, parent, name, born, died, branch, img, note }`，`branch` 对应某个故事 id 决定颜色；
     品牌可把“人物”换成历任掌门人或子品牌。不需要家谱就删掉这一项（和 `family.html` 里的 `#tree`）
   - `CAPTIONS`：图注
2. `python3 scripts/fetch_images.py js/family-xxx.js js/family-xxx-images.js`
3. 复制 `family.html`，改报头与两个 `<script src>`

## 风尚版 · 香奈儿特辑（`fashion.html`）

报纸适合讲“年代”，时尚更适合讲“一个人、一条线”。这一版用杂志排版讲一个故事：一个问题贯穿始终，每件事只讲一次，用“场景”推进。

- **全篇之问**：冷开场从 1954 年那场“惨败”的复出秀讲起，抛出「香奈儿，到底属于谁？」，尾声回答它
- **六幕 · 39 个场景**（前三幕精简，2019 年之后加厚：维雅交接、2020–2024 的涨价与利润下滑、布拉齐 2025 首秀、纽约地铁高级手工坊、2026 高定 / 比亚里茨度假系列 / 2027 春夏）：每章开头先交代“地点 · 时刻”，再用旁白、替读者发问的句子、人物登场卡逐句推进；同一个事件不在别处重复
- **人物登场卡**：巴勒松、卡佩尔、韦尔泰梅、丁克拉格、玛丽莲·梦露、拉格斐……第一次出场时“显影”出来，之后不再重复
- **证物**：每章可带一条胶片式的产品 / 秀场图（5 号香水瓶、2.55、粗花呢套装、拉格斐时代的秀场），点开大图可回到对应段落
- **影像**：穿插 CHANEL 官方 YouTube 短片（5 号香水、Mademoiselle、外套、手袋、超市秀、火箭秀……），点了才加载
- **本章出场的 logo**：老佛爷百货、Vogue、Harper's Bazaar、Dior、Fendi、LV……出现在它们真正登场的那一年
- **左栏**：描边大号年份、随年代变形的廓形剪影（1883 紧身胸衣 → 1926 小黑裙 → 1947 New Look → 1954 粗花呢 → 2019）、
  主线指标“她本人占多少”（100% → 10% → 2% → 0%）、掌舵人传承带、10 个品牌符号（读到对应句子时点亮）
- **猜一猜**：关键节点先让读者猜
- **尾声**：主线答案 → 一百年的衣橱（所有证物按年份横向排开）→ 影像合集 → logo 墙（点击跳到它出场那年）→ 符号总览
- **右侧衣橱时间线**：竖直贯穿全文，每章一个节点、挂着那一年的产品缩略图；往下读时当前节点放大、读过的变成彩色，
  点年份跳章、点缩略图看大图；窄屏收成右侧抽屉（右下角「衣橱」按钮）
- 时代色调切换；链接参数 `fashion.html?year=1954`（同一年有多章时用 `#y2026-2` 锚点）；键盘 `j` / `k`

## 倒叙黑白版（`fashion-noir.html`）

和滚动版用同一个引擎、同一份数据，只在页面里多一行开关：

```html
<script>window.FASHION_MODE = { rewind: true, mono: true, runway: true, coverImg: "…" };</script>
```

- `rewind`：章节从 2026 倒着排到 1883，用 `MAG.coldRewind` 作开场，幕头放在每一幕最新的一章前
- `mono`：背景按幕黑白交替；封面与幕头大图转灰度，秀场照片在读到该章时由灰转彩，产品图保留原色
- `runway`：带 `runway: true` 的造型单独排成横向大图条「秀场内外」
- `coverImg`：换封面图
- 倒叙的叙事另写在 `MAG.rewind` 里：按章节标题覆盖 `beats`，每章末尾加一个“倒带”问题 `out`，由下一张（更早的）章节回答；`acts` 覆盖幕头导语，`ending` 覆盖尾声

## 翻页版（`fashion-book.html`）

同一份 `MAG` 数据排成一本左右翻页的杂志：封面 → 目录 → 冷开场 → 全篇之问 → 每一幕一个跨页（左图右题 + 章节页码）→
每一章“左页大图 + 右页正文” → 尾声 → 衣橱 → 影像 → 符号词典 → 出场的名字 → 封底。

- 宽屏是双页跨页，3D 翻页（带阴影）；窄屏 / 竖屏自动变单页
- 正文按页面实际尺寸自动分页（离屏量尺），证物 / 影片 / 数字放不下时会往前补空；窗口大小变化后重新排版，停在原来那一页
- 翻页：← → / 空格 / PageUp PageDown / Home End、两侧按钮、点左页或右页、手机左右滑、触控板横滑、底部页码条拖动（带“幕”刻度）
- 猜一猜、回扣前文（↩ 年份）、证物大图、符号卡片、官方影片都能在书页里直接用；翻走后视频自动停
- 链接参数：`?year=1955`、`?year=2026&n=2`（当年第 2 章）、`?p=40`（页码）

**素材原则**：图片只用 Wikimedia Commons 上的公有领域 / CC 图片（署名自动生成）；官网模特图与广告大片有版权，不下载也不外链；
视频只嵌入品牌官方频道，且点击后才通过 `youtube-nocookie.com` 加载；logo 仅作编辑性引用，商标归各自所有者。

### 换成别的品牌

1. 复制 `js/fashion-chanel.js`，改写 `MAG`：
   - `question` 全篇之问、`stake` 主线指标、`eras` 分期（`tone: light|dark`、`accent`）、`directors` 掌舵人、`codes` 品牌符号
   - `silhouettes` 廓形关键帧（12 个控制点参数，按年份插值）
   - `cast` 人物、`logos` logo、`looks` 证物图、`videos` 官方视频（YouTube id）
   - `cold` 冷开场、`acts`（`from` 起始年、`title`、`hook`、可选 `img`）、`chapters`、`ending` 尾声
   - 章节：`{year, place, scene, img, title, beats, looks, logos, video, codes, stat, quote, lesson}`
   - beat 写法：普通字符串 = 旁白；`"问：…"` = 替读者发问；`{t, code}` 点亮符号；`{cast: id}` 人物登场；
     `{poll: {q, options, answer}}` 猜一猜；`{t, echo: year}` 回扣前文
   - 所有图片都写成 `img: "Commons 文件名"`（双引号），抓图脚本靠它识别
   - 章节的 `video` 可以是一个 key，也可以是数组；同一年可以有多章
   - 符号图标在 `js/fashion-common.js` 的 `ICONS` 里（48×48 线描 SVG），新符号要补一个
2. `python3 scripts/fetch_images.py js/fashion-xxx.js js/fashion-xxx-images.js`
3. 在 `fashion.html` 和 `fashion-book.html` 里换掉前两个 `<script src>`

## 运行

纯静态，无构建、无依赖：

```bash
python3 -m http.server 8000   # 打开 http://localhost:8000
```

图片直接引用 Wikimedia 的缩略图，需联网。

## 图片流程

```bash
python3 scripts/assign_images.py   # 为 data.js 里每条史事写入 img（Wikimedia 文件名）
python3 scripts/fetch_images.py    # 调 Wikipedia API 取缩略图 URL、作者、许可 → js/images.js
python3 scripts/fetch_images.py js/family-rothschild.js js/family-rothschild-images.js   # 家族版
python3 scripts/fetch_images.py js/fashion-chanel.js js/fashion-chanel-images.js         # 风尚版
```

图注手写在 `js/captions.js`。作者与许可会显示在每张图下方，并链接到原始文件页。
大多数是公有领域或 CC 许可；`Penguin_Crime_I.JPG` 在维基上标注为 fair use，公开发布时请留意或替换。

## 新增一条故事

在 `js/data.js` 的 `STORIES` 中追加：

```js
{
  id: "prada", title: "普拉达：……", subtitle: "一句话副标题", tags: ["奢侈品"], color: "#2f6f5e",
  steps: [
    { year: 1913, place: "米兰", img: "Some_File_On_Commons.jpg", title: "标题", text: "正文", lesson: "可选：商业启示" }
  ]
}
```

再跑一次 `fetch_images.py`，并在 `captions.js` 里补图注。全球里程碑写进 `EVENTS`，时代分期在 `ERAS`。

## 目录

```
index.html        报纸版面骨架（主报）
family.html       家族版：罗斯柴尔德家报
fashion.html      风尚版：香奈儿特辑（杂志排版 + 引导式叙事）
css/style.css     纸张、网点印刷、翻页、时光机样式
js/data.js        时代 / 编年大事 / 故事（内容都在这里）
js/images.js      图片元数据（脚本生成）
js/captions.js    图注
js/app.js         头版、时光机、翻页阅读、号外、小试、检索（读 window.SITE 配置）
js/tree.js        家族版的家谱（读 window.FAMILY）
js/family-rothschild*.js  家族版的内容与图片元数据
css/fashion.css   风尚版样式
fashion-noir.html 风尚版的倒叙黑白形式（同引擎，FASHION_MODE 开关）
fashion-book.html 风尚版的翻页杂志形式
css/fashion-book.css  翻页版样式
js/fashion.js     风尚版引擎（读 window.MAG）
js/fashion-book.js    翻页版引擎（排版、分页、3D 翻页）
js/fashion-common.js  两个版本共用的符号图标与廓形
js/fashion-chanel*.js     风尚版的内容、故事主线与图片元数据
scripts/          图片分配与抓取脚本
```

## 许可证

本项目代码以 [MIT 许可证](LICENSE) 发布。页面引用的图片来自 Wikimedia Commons，各自遵循原作者的 CC / 公有领域授权（见图片说明）；嵌入的视频版权归原发布方所有。
