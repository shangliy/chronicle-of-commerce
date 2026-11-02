"""从 Wikipedia/Wikimedia 解析 data.js 中所有 img 文件名 → js/images.js（缩略图地址、作者、许可）。
用法：python3 scripts/fetch_images.py [数据文件 输出文件]   （默认 js/data.js → js/images.js）
家族版：python3 scripts/fetch_images.py js/family-rothschild.js js/family-rothschild-images.js"""
import json, re, sys, time, urllib.request, urllib.parse, html
SRC, OUT = (sys.argv[1], sys.argv[2]) if len(sys.argv) > 2 else ("js/data.js", "js/images.js")
UA = {"User-Agent": "ShangHaiShiXu/0.1 (open-source business history atlas)"}
src = open(SRC, encoding="utf8").read()
names = sorted(set(json.loads('"%s"' % m) for m in re.findall(r'img: "((?:[^"\\]|\\.)*)"', src)))
strip = lambda t: re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", t or ""))).strip()
out, missing = {}, []
for i in range(0, len(names), 40):
    chunk = names[i:i + 40]
    q = urllib.parse.urlencode({"action": "query", "format": "json", "prop": "imageinfo", "iiprop": "url|size|extmetadata",
                                "iiurlwidth": 960, "titles": "|".join("File:" + n for n in chunk)})
    d = json.load(urllib.request.urlopen(urllib.request.Request("https://en.wikipedia.org/w/api.php?" + q, headers=UA), timeout=60))
    back = {}
    for n in d["query"].get("normalized", []): back[n["to"]] = n["from"]
    for p in d["query"]["pages"].values():
        name = back.get(p["title"], p["title"])[5:]
        ii = (p.get("imageinfo") or [None])[0]
        if not ii: missing.append(name); continue
        md = ii.get("extmetadata", {})
        out[name] = {"src": ii.get("thumburl") or ii["url"], "w": ii.get("thumbwidth") or ii.get("width"), "h": ii.get("thumbheight") or ii.get("height"),
                     "page": ii.get("descriptionurl"), "artist": strip(md.get("Artist", {}).get("value"))[:80],
                     "license": strip(md.get("LicenseShortName", {}).get("value")), "date": strip(md.get("DateTimeOriginal", {}).get("value"))[:40]}
    time.sleep(1)
# 按 data.js 里写的文件名（下划线形式）建索引
idx = {}
for n in names:
    k = n.replace("_", " ")
    hit = out.get(n) or out.get(k) or next((v for kk, v in out.items() if kk.replace("_", " ") == k), None)
    if hit: idx[n] = hit
    else: missing.append(n)
open(OUT, "w", encoding="utf8").write(f"/* 自动生成：python3 scripts/fetch_images.py {SRC} {OUT} */"
    + "\nwindow.IMAGES = " + json.dumps(idx, ensure_ascii=False, indent=1) + ";\n")
print(f"resolved {len(idx)}/{len(names)}", "missing:", sorted(set(missing) - set(idx)))
