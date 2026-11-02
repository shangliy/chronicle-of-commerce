"""一次性脚本：给 data.js 中每个故事站点 / 编年大事写入 img 字段（Wikimedia 文件名）。"""
import re, json, sys
IMGS = {
 "vca": ["Place_Vendome,_Paris_20_April_2011.jpg", "P1040419_Paris_Ier_place_Vendôme_immeubles_n°18_20_22_24_et_26_rwk.JPG",
         "Postcard_of_Exposition_des_Art_Decoratifs_et_Industriels_Modernes.jpg", "Van_Cleef_&_Arpels_Exhibition.JPG",
         "Joseph_Binder's_poster_for_the_1939_New_York_World's_Fair.jpg", "Princess_Grace_and_Prince_Rainier_III.jpg",
         "Four-leaf_Clover_Trifolium_repens_2.jpg", "HK_Central_Landmark_Van_Cleef_&_Arpels_May-2013_ceiling.JPG"],
 "cards": ["King_Kelly_0554fu.jpg", "Honus_wagner_t206_baseball_card.jpg", "JimmyFoxxGoudeycard.jpg", "Mickey_Mantle_1953.jpg",
           "Ken_Griffey,_Jr._June_2009_(cropped).jpg", "1909_T206_Honus_Wagner_Baseball_Card_with_PSA_grade_EX_5-MC.jpg",
           "Honus_wagner_portrait.jpg", "Heritage_Auctions_2020_view_small.jpg", "Topps_wagner_2002_blue.jpg"],
 "cold": ["Frederic_Tudor-facingright_pre1864.jpg", "Slaves_Unloading_Ice_in_Cuba_1832.jpg", "World_Ice_Trade,_1856.png", "Gorrie.jpg",
          "Willis_Carrier_1915.jpg", "Willis_Carrier_Engineers_Handbook.jpg", "Daikin_air_conditioner_at_Tennoji_Station_20060626.jpg",
          "Midea_Group_headquarters.jpg", "GREEStoreNanchang.jpg", "External_units_of_air_conditioners_in_Singapore.jpg"],
 "indulgence": ["Giotto_-_Bonifatius_VIII_(cropped).jpg",
          "Pedro_Berruguete_-_Portrait_of_Pope_Sixtus_IV_della_Rovere_-_1916.815_-_Cleveland_Museum_of_ArtFXD.jpg",
          "Albrecht_Dürer_080.jpg", "Jüterbog_Nikolaikirche_Tetzelkasten.JPG", "Luther_95_Thesen.png",
          "Concilio_Trento_Museo_Buonconsiglio.jpg", "Turbine_aalborg.jpg", "EUA_prices_from_ICAP_secondary_market_2010_to_2024_verysmall.png"],
 "houdini": ["View_from_Gellért_Hill_to_the_Danube,_Hungary_-_Budapest_(28493220635).jpg", "Downtown_Appleton_Skyline.jpg",
          "The_Houdinis,_Harry,_Bessie_introducing_the_only_and_original._LCCN2014636901.jpg", "HarryHoudini1899.jpg",
          "Harry_Houdini-sitting.jpg", "Houdini_challenge.jpg",
          "Houdini_airborne_in_his_Voisin_at_Diggers_Rest,_1910,_by_Marcel_Poupe.jpg", "Houdini_performing_Water_Torture_Cell.jpg",
          "Houdini_and_Lincoln.jpg", "Harry_Houdini_Grave_Marker_8-2008.jpg"],
 "elnino": ["Chincha_Islands_-_panoramio.jpg",
          "Famine_Victims_Selling_Their_Children_from_The_Famine_in_China,_Illustrations_by_a_Native_Artist_(1878).jpg",
          "Engraulis_ringens.jpg", "Chicago_Board_of_Trade_(November_2008).jpg", "Nixon_30-0316a.jpg", "Kakuei_Tanaka_19720707.jpg",
          "Morro_cabeludo_-_Parque_dos_Pireneus_-_Pirenópolis_-_Goiás_01.jpg", "Cocoa_Pods.JPG"],
 "mystery": ["American_cover_of_«The_Mysterious_Affair_at_Styles».png", "Christie_at_Hydro.jpg", "Penguin_Crime_I.JPG",
          "Cluedo_Clue_pack_logo.png", "London-The_Mousetrap_celebrating_70_years.jpg", None,
          "Murder_mystery_merriment_at_RAF_Mildenhall_131025-F-DL987-126.jpg"],
 "korea": ["Lee_Byung-chul_(cropped).jpg", "MT4C1024-HD.jpg", "Samsung_headquarters.jpg", "Lee_Kun-Hee.jpg",
          "USD_to_South_Korean_Won_exchange_rate.webp", "AMD_Fiji_GPU_package_with_GPU,_HBM_memory_and_interposer.jpg",
          "2788-2888_San_Tomas_Expwy.jpg", "Kospi-20170713.png"],
}
EVENTS = {1397: "Giovanni_di_Bicci_de'_Medici_Portrait_by_Agnolo_Bronzino.jpg",
 1602: "De_terugkomst_in_Amsterdam_van_de_tweede_expeditie_naar_Oost-Indië,_Hendrik_Cornelisz_Vroom,_1599,_Rijksmuseum_SK-A-2858.jpg",
 1637: "Jan_Brueghel_the_Younger,_Satire_on_Tulip_Mania,_c._1640.jpg", 1694: "Bank-of-England.jpg",
 1720: "Edward_Matthew_Ward_(1816-1879)_-_The_South_Sea_Bubble,_a_Scene_in_'Change_Alley_in_1720_-_N00432_-_National_Gallery.jpg",
 1776: "Wealth_of_Nations.jpg", 1830: "Opening_Liverpool_and_Manchester_Railway.jpg", 1869: "Iss016e019375.jpg",
 1913: "1925_Ford_Model_T_touring.jpg", 1929: "Crowd_outside_nyse.jpg", 1944: "Mt._Washington_Hotel.jpg", 1971: "Nixon_30-0316a.jpg",
 1980: "Commercial_area_of_futian_to_east2020.jpg", 1999: "TaobaoCity_Alibaba_Xixi_Park.jpg", 2001: "The_Pearl_Marina_in_Nov_2013.jpg",
 2007: "First_iPhone_Macworld_2007_DSCF1286.agr.jpg", 2008: "Lehman_Brothers_Times_Square_by_David_Shankbone.jpg"}

if __name__ == "__main__":
    if sys.argv[1:] == ["--list"]:
        names = {n for v in IMGS.values() for n in v if n} | set(EVENTS.values())
        print("\n".join(sorted(names))); sys.exit()
    p = "js/data.js"; s = open(p, encoding="utf8").read()
    # 编年大事：按年份匹配 `{ year: 1397, place:` 行
    for y, f in EVENTS.items():
        s = re.sub(r'(\{ year: %d, place: "[^"]+", )(?!img)' % y, lambda m: m.group(1) + "img: %s, " % json.dumps(f, ensure_ascii=False), s, count=1)
    # 故事线：在每个故事的 steps 中依序插入
    for sid, files in IMGS.items():
        start = s.index('id: "%s"' % sid); end = s.find('id: "', start + 5); end = len(s) if end < 0 else end
        block = s[start:end]; it = iter(files)
        def rep(m):
            f = next(it)
            return m.group(1) + ("img: %s, " % json.dumps(f, ensure_ascii=False) if f else "")
        block = re.sub(r'(\{ year: \d+, place: "[^"]+", )(?!img)', rep, block)
        s = s[:start] + block + s[end:]
    open(p, "w", encoding="utf8").write(s)
