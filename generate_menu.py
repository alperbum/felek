import json

categories = [
    {"id": "mezeler", "tr": "Mezeler", "en": "Appetizers", "ar": "المقبلات", "ru": "Закуски", "image": "", "sort": 10},
    {"id": "salatalar", "tr": "Salatalar", "en": "Salads", "ar": "السلطات", "ru": "Салаты", "image": "", "sort": 20},
    {"id": "ana_yemekler", "tr": "Et Çeşitleri", "en": "Grilled Meats", "ar": "اللحوم المشوية", "ru": "Мясо на Гриле", "image": "assets/images/SnapInsta.to_613647466_18491576731072243_8360769828246837946_n.jpg", "sort": 30},
    {"id": "alkolsuz", "tr": "Alkolsüz İçecekler", "en": "Soft Drinks", "ar": "المشروبات الغازية", "ru": "Безалкогольные Напитки", "image": "", "sort": 40},
    {"id": "raki", "tr": "Rakılar", "en": "Rakı", "ar": "راكي", "ru": "Раки", "image": "assets/images/SnapInsta.to_631052160_18497719381072243_630189921650077750_n.jpg", "sort": 50},
    {"id": "viski", "tr": "Viskiler", "en": "Whiskey", "ar": "الويسكي", "ru": "Виски", "image": "", "sort": 60},
    {"id": "sarap", "tr": "Şaraplar", "en": "Wine", "ar": "النبيذ", "ru": "Вино", "image": "", "sort": 70},
    {"id": "biralar", "tr": "Biralar & Atıştırmalıklar", "en": "Beers & Snacks", "ar": "البيرة والمقرمشات", "ru": "Пиво и Закуски", "image": "", "sort": 80},
    {"id": "votka_cin", "tr": "Votka & Cin", "en": "Vodka & Gin", "ar": "فودكا وجن", "ru": "Водка и Джин", "image": "", "sort": 90},
    {"id": "tatli_meyve", "tr": "Tatlı & Meyve", "en": "Desserts", "ar": "الحلويات", "ru": "Десерты", "image": "", "sort": 100}
]

items = []

def add(cat, tr, price, extras=""):
    items.append({
        "category_id": cat,
        "name_tr": tr, "name_en": tr, "name_ar": tr, "name_ru": tr,
        "price": price,
        "extras": extras
    })

# Mezeler
add("mezeler", "Havuç Tarator", 320)
add("mezeler", "Kırmızı Peynir Dolgulu Biber", 320)
add("mezeler", "Köpoğlu", 320)
add("mezeler", "Köz Patlıcan", 320)
add("mezeler", "Humus", 300)
add("mezeler", "Mantar Salatası", 300)
add("mezeler", "Pancar Turşusu", 300)
add("mezeler", "Haydari", 290)
add("mezeler", "Köz Biber", 290)
add("mezeler", "Izgara Zeytin", 270)
add("mezeler", "Çiğköfte", 260)
add("mezeler", "Cacık", 260)
add("mezeler", "Manda Yoğurdu", 200)
add("mezeler", "Beyaz Peynir", 180)
add("mezeler", "Yoğurt", 180)
add("mezeler", "Mantar", 160)
add("mezeler", "Hellim Peyniri", 100)
add("mezeler", "Sarımsak", 100)
add("mezeler", "Kırmızı Acı Biber (Porsiyon)", 90)
add("mezeler", "Acur Turşusu", 310)
add("mezeler", "Semizotu", 320)
add("mezeler", "Şakşuka", 320)

# Salatalar
add("salatalar", "Gavurdağ Salata", 370, "+₺100,00 Duble Porsiyon")
add("salatalar", "Çoban Salata", 350, "+₺100,00 Duble Porsiyon")
add("salatalar", "İstanbul Salata", 350, "+₺100,00 Duble Porsiyon")
add("salatalar", "Kaşık Salata", 350, "+₺100,00 Duble Porsiyon")
add("salatalar", "Mevsim Salata", 350, "+₺100,00 Duble Porsiyon")
add("salatalar", "Peynirli Roka Salata", 350, "+₺120,00 Duble Porsiyon")
add("salatalar", "Söğüş Salata", 280, "+₺100,00 Duble Porsiyon")
add("salatalar", "Salata Üstü Ekstra Ceviz", 80)
add("salatalar", "Salata Üstü Rende Peynir", 80)

# Ana Yemekler
add("ana_yemekler", "Bonfile", 3700)
add("ana_yemekler", "Pirzola", 3200)
add("ana_yemekler", "Kırmızı Et", 2900)
add("ana_yemekler", "Beyaz Et", 1800)

# Tatlı & Meyve
add("tatli_meyve", "Soğuk Baklava", 330)
add("tatli_meyve", "Ayva Tatlısı", 330)
add("tatli_meyve", "İncir Tatlısı", 330)
add("tatli_meyve", "Kabak Tatlısı", 330)
add("tatli_meyve", "Dondurmalı İrmik Helvası", 330)
add("tatli_meyve", "İrmik Helvası", 250)
add("tatli_meyve", "Güllaç", 150)
add("tatli_meyve", "Dondurma (Porsiyon)", 150)
add("tatli_meyve", "Serpme Meyve", 450)
add("tatli_meyve", "Tekli Karışık Meyve", 350)
add("tatli_meyve", "Kavun", 310)
add("tatli_meyve", "Karpuz", 280)
add("tatli_meyve", "Ananas", 210)
add("tatli_meyve", "Ballı Muz", 210)
add("tatli_meyve", "Kaşık Ayva", 210)
add("tatli_meyve", "Tek Meyve", 140)

# Rakılar
add("raki", "Yeni Rakı 70 cl", 3000)
add("raki", "Yeni Rakı 50 cl", 2200)
add("raki", "Yeni Rakı 35 cl", 1550)
add("raki", "Yeni Rakı 20 cl", 900)
add("raki", "Yeni Seri 70 cl", 3300)
add("raki", "Yeni Seri 35 cl", 1550)
add("raki", "Yeni Seri 20 cl", 950)
add("raki", "Kulüp Rakı 70 cl", 3400)
add("raki", "Kulüp Rakı 35 cl", 1750)
add("raki", "Sarı Zeybek 70 cl", 3800)
add("raki", "Sarı Zeybek 35 cl", 1950)
add("raki", "Altın Seri 70 cl", 3600)
add("raki", "Altın Seri 35 cl", 1850)
add("raki", "Altın Seri 20 cl", 1050)
add("raki", "Efe Gold 70 cl", 3600)
add("raki", "Efe Gold 35 cl", 1850)
add("raki", "Beylerbeyi Göbek 70 cl", 3750)
add("raki", "Beylerbeyi Göbek 35 cl", 1950)
add("raki", "Beylerbeyi Göbek 20 cl", 1100)
add("raki", "Göbek Duble", 430)
add("raki", "Göbek Tek", 290)
add("raki", "Duble Rakı", 380)
add("raki", "Tek Rakı", 240)

# Viski
add("viski", "Chivas 70 cl", 5700)
add("viski", "Chivas 35 cl", 2900)
add("viski", "Duble Viski", 650)
add("viski", "Tek Viski", 450)

# Votka & Cin
add("votka_cin", "Absolut 70 cl", 4200)
add("votka_cin", "Absolut 35 cl", 2150)
add("votka_cin", "Smirnoff 70 cl", 4200)
add("votka_cin", "Duble Cin", 470)
add("votka_cin", "Duble Absolut Votka", 420)

# Şaraplar
add("sarap", "Sarafin 75 cl (Kırmızı/Beyaz/Blush)", 4300)
add("sarap", "Versus Dedeçeşme 75 cl", 3000)
add("sarap", "Versus Beyaz 75 cl", 2900)
add("sarap", "Vintage Beyaz 75 cl", 2700)
add("sarap", "Leona Blush 75 cl", 2300)
add("sarap", "Terra 75 cl (Öküzgözü/Kalecik Karası/Rose/Shiraz)", 2300)
add("sarap", "Buzbağ 75 cl (Kırmızı/Beyaz)", 1950)
add("sarap", "Buzbağ 37,5 cl (Kırmızı/Beyaz)", 900)
add("sarap", "Kadeh Şarap", 450)

# Biralar
add("biralar", "Efes 50 cl", 420)
add("biralar", "Tuborg 50 cl", 420)
add("biralar", "Corona 33 cl", 320)
add("biralar", "Miller", 275)
add("biralar", "Efes Pilsen", 250)
add("biralar", "Tuborg 33 cl", 250)
add("biralar", "Cips", 300)
add("biralar", "Antep Çerez", 245)
add("biralar", "Patates Tava", 240)

# Alkolsüz
add("alkolsuz", "1 Litre Şalgam / Tonik", 400)
add("alkolsuz", "Büyük Redbull", 270)
add("alkolsuz", "Redbull", 175)
add("alkolsuz", "Kola / Fanta / Sprite", 145)
add("alkolsuz", "Tonik", 140)
add("alkolsuz", "Portakal / Vişne / Şeftali Suyu", 130)
add("alkolsuz", "Ice Tea Limon / Şeftali", 130)
add("alkolsuz", "Churchill", 130)
add("alkolsuz", "Acılı / Acısız Şalgam", 110)
add("alkolsuz", "Ayran", 100)
add("alkolsuz", "Soda", 75)

import locale
try:
    locale.setlocale(locale.LC_ALL, 'tr_TR.UTF-8')
except:
    pass

def format_price(p):
    # just basic for JS
    return f"₺{p:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

js_cats = []
for c in categories:
    js_cats.append(f'{{ id: "{c["id"]}", image: "{c["image"]}" }}')

js_items = []
for i in items:
    ex = ""
    if i["extras"]:
        ex = f', extras: {{ tr: "{i["extras"]}", en: "{i["extras"]}", ar: "{i["extras"]}", ru: "{i["extras"]}" }}'
    price_str = format_price(i["price"])
    js_items.append(f'''{{ categoryId: "{i["category_id"]}", title: {{ tr: "{i["name_tr"]}", en: "{i["name_tr"]}", ar: "{i["name_tr"]}", ru: "{i["name_tr"]}" }}, price: "{price_str}", image: ""{ex} }}''')

with open("c:/Users/alperbum/Desktop/felek/generated_js.txt", "w", encoding="utf-8") as f:
    f.write("let categories = [\n    " + ",\n    ".join(js_cats) + "\n];\n\n")
    f.write("let menuData = [\n    " + ",\n    ".join(js_items) + "\n];")

with open("c:/Users/alperbum/Desktop/felek/seed.sql", "w", encoding="utf-8") as f:
    f.write("DELETE FROM menu_items;\nDELETE FROM categories;\n\n")
    for c in categories:
        f.write(f"INSERT INTO categories (id, name_tr, name_en, name_ar, name_ru, sort_order, image) VALUES ('{c['id']}', '{c['tr']}', '{c['en']}', '{c['ar']}', '{c['ru']}', {c['sort']}, '{c['image']}');\n")
    f.write("\n")
    for i in items:
        ex = f"'{i['extras']}'" if i['extras'] else "NULL"
        f.write(f"INSERT INTO menu_items (category_id, name_tr, name_en, name_ar, name_ru, price, extras_tr, extras_en, extras_ar, extras_ru, image, is_active) VALUES ('{i['category_id']}', '{i['name_tr']}', '{i['name_tr']}', '{i['name_tr']}', '{i['name_tr']}', {i['price']}, {ex}, {ex}, {ex}, {ex}, NULL, true);\n")

