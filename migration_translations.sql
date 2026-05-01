-- ============================================================
-- Felek Mangalbaşı — Çeviri Migration
-- Kategori tablosuna EN/AR/RU sütunları ekleme + çevirileri güncelleme
-- Menü öğelerinde eksik çevirileri doldurma
-- ============================================================

-- 1) KATEGORİ ÇEVIRI SÜTUNLARI
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_ar TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_ru TEXT;

-- Kategori çevirilerini güncelle
UPDATE categories SET name_en = 'Appetizers', name_ar = 'المقبلات', name_ru = 'Закуски' WHERE id = 'mezeler';
UPDATE categories SET name_en = 'Salads', name_ar = 'السلطات', name_ru = 'Салаты' WHERE id = 'salatalar';
UPDATE categories SET name_en = 'Grilled Meats', name_ar = 'اللحوم المشوية', name_ru = 'Мясо на Гриле' WHERE id = 'ana_yemekler';
UPDATE categories SET name_en = 'Desserts & Fruits', name_ar = 'الحلويات والفواكه', name_ru = 'Десерты и Фрукты' WHERE id = 'tatli_meyve';
UPDATE categories SET name_en = 'Rakı', name_ar = 'راكي', name_ru = 'Раки' WHERE id = 'raki';
UPDATE categories SET name_en = 'Wine', name_ar = 'النبيذ', name_ru = 'Вино' WHERE id = 'sarap';
UPDATE categories SET name_en = 'Whiskey', name_ar = 'الويسكي', name_ru = 'Виски' WHERE id = 'viski';
UPDATE categories SET name_en = 'Vodka & Gin', name_ar = 'فودكا وجن', name_ru = 'Водка и Джин' WHERE id = 'votka_cin';
UPDATE categories SET name_en = 'Beer', name_ar = 'البيرة', name_ru = 'Пиво' WHERE id = 'bira';
UPDATE categories SET name_en = 'Sides', name_ar = 'الأطباق الجانبية', name_ru = 'Гарниры' WHERE id = 'diger_urunler';

-- 2) MEZE ÇEVİRİLERİ
UPDATE menu_items SET name_en = 'Carrot Tarator', name_ar = 'تاراتور الجزر', name_ru = 'Морковный Таратор' WHERE name_tr = 'Havuç Tarator';
UPDATE menu_items SET name_en = 'Red Pepper Stuffed with Cheese', name_ar = 'فلفل محشو بالجبن الأحمر', name_ru = 'Красный Перец с Сыром' WHERE name_tr = 'Kırmızı Peynir Dolgulu Biber';
UPDATE menu_items SET name_en = 'Köpoğlu', name_ar = 'كوبوغلو', name_ru = 'Кёпоглу' WHERE name_tr = 'Köpoğlu';
UPDATE menu_items SET name_en = 'Roasted Eggplant', name_ar = 'باذنجان مشوي', name_ru = 'Запечённый Баклажан' WHERE name_tr = 'Köz Patlıcan';
UPDATE menu_items SET name_en = 'Hummus', name_ar = 'حمص', name_ru = 'Хумус' WHERE name_tr = 'Humus';
UPDATE menu_items SET name_en = 'Mushroom Salad', name_ar = 'سلطة الفطر', name_ru = 'Грибной Салат' WHERE name_tr = 'Mantar Salatası';
UPDATE menu_items SET name_en = 'Pickled Beet', name_ar = 'مخلل الشمندر', name_ru = 'Маринованная Свёкла' WHERE name_tr = 'Pancar Turşusu';
UPDATE menu_items SET name_en = 'Haydari', name_ar = 'حيدري', name_ru = 'Хайдари' WHERE name_tr = 'Haydari';
UPDATE menu_items SET name_en = 'Roasted Pepper', name_ar = 'فلفل مشوي', name_ru = 'Запечённый Перец' WHERE name_tr = 'Köz Biber';
UPDATE menu_items SET name_en = 'Grilled Olives', name_ar = 'زيتون مشوي', name_ru = 'Жареные Оливки' WHERE name_tr = 'Izgara Zeytin';
UPDATE menu_items SET name_en = 'Raw Meatball (Vegan)', name_ar = 'كفتة نيئة (نباتية)', name_ru = 'Чигкёфте (Веган)' WHERE name_tr = 'Çiğköfte';
UPDATE menu_items SET name_en = 'Mushroom', name_ar = 'فطر', name_ru = 'Грибы' WHERE name_tr = 'Mantar' AND category_id = 'mezeler';
UPDATE menu_items SET name_en = 'Halloumi', name_ar = 'حلومي', name_ru = 'Халуми' WHERE name_tr = 'Hellim';
UPDATE menu_items SET name_en = 'Hot Red Pepper (Portion)', name_ar = 'فلفل أحمر حار (حصة)', name_ru = 'Красный Острый Перец (Порция)' WHERE name_tr = 'Kırmızı Acı Biber (Porsiyon)';

-- 3) SALATA ÇEVİRİLERİ
UPDATE menu_items SET name_en = 'Gavurdağ Salad', name_ar = 'سلطة جافورداغ', name_ru = 'Салат Гавурдаг' WHERE name_tr = 'Gavurdağ Salata';
UPDATE menu_items SET name_en = 'Shepherd''s Salad', name_ar = 'سلطة الراعي', name_ru = 'Пастуший Салат' WHERE name_tr = 'Çoban Salata';
UPDATE menu_items SET name_en = 'Istanbul Salad', name_ar = 'سلطة اسطنبول', name_ru = 'Стамбульский Салат' WHERE name_tr = 'İstanbul Salata';
UPDATE menu_items SET name_en = 'Spoon Salad', name_ar = 'سلطة الملعقة', name_ru = 'Салат-Ложка' WHERE name_tr = 'Kaşık Salata';
UPDATE menu_items SET name_en = 'Seasonal Salad', name_ar = 'سلطة موسمية', name_ru = 'Сезонный Салат' WHERE name_tr = 'Mevsim Salata';
UPDATE menu_items SET name_en = 'Arugula Salad with Cheese', name_ar = 'سلطة الجرجير بالجبن', name_ru = 'Салат из Рукколы с Сыром' WHERE name_tr = 'Peynirli Roka Salata';
UPDATE menu_items SET name_en = 'Söğüş Salad', name_ar = 'سلطة سوغوش', name_ru = 'Салат Сёгюш' WHERE name_tr = 'Söğüş Salata';
UPDATE menu_items SET name_en = 'Extra Walnut on Salad', name_ar = 'جوز إضافي على السلطة', name_ru = 'Грецкий Орех на Салат' WHERE name_tr = 'Salata Üstü Ekstra Ceviz';
UPDATE menu_items SET name_en = 'Grated Cheese on Salad', name_ar = 'جبن مبشور على السلطة', name_ru = 'Тёртый Сыр на Салат' WHERE name_tr = 'Salata Üstü Rende Peynir';

-- Salata extras çevirileri
UPDATE menu_items SET extras_ar = '+₺100,00 حصة مزدوجة', extras_ru = '+₺100,00 Двойная Порция' WHERE category_id = 'salatalar' AND extras_tr LIKE '+₺100%';
UPDATE menu_items SET extras_ar = '+₺120,00 حصة مزدوجة', extras_ru = '+₺120,00 Двойная Порция' WHERE category_id = 'salatalar' AND extras_tr LIKE '+₺120%';

-- 4) ANA YEMEK ÇEVİRİLERİ
UPDATE menu_items SET name_en = 'Tenderloin', name_ar = 'فيليه', name_ru = 'Филе' WHERE name_tr = 'Bonfile';
UPDATE menu_items SET name_en = 'Lamb Chops', name_ar = 'ضلوع لحم الغنم', name_ru = 'Бараньи Рёбрышки' WHERE name_tr = 'Pirzola';
UPDATE menu_items SET name_en = 'Red Meat', name_ar = 'لحم أحمر', name_ru = 'Красное Мясо' WHERE name_tr = 'Kırmızı Et';
UPDATE menu_items SET name_en = 'White Meat (Chicken)', name_ar = 'لحم أبيض (دجاج)', name_ru = 'Белое Мясо (Курица)' WHERE name_tr = 'Beyaz Et';

-- 5) İÇECEK ÇEVİRİLERİ (bira kategorisindeki garnitürler)
UPDATE menu_items SET name_en = 'French Fries (Portion)', name_ar = 'بطاطس مقلية (حصة)', name_ru = 'Картофель Фри (Порция)' WHERE name_tr = 'Patates (Porsiyon)';
UPDATE menu_items SET name_en = 'Chips', name_ar = 'رقائق', name_ru = 'Чипсы' WHERE name_tr = 'Cips';
UPDATE menu_items SET name_en = 'Antep Mixed Nuts', name_ar = 'مكسرات أنتب', name_ru = 'Антепские Орехи' WHERE name_tr = 'Antep Çerez';

-- 6) DİĞER ÜRÜNLER ÇEVİRİLERİ
UPDATE menu_items SET name_en = 'Buffalo Yogurt', name_ar = 'زبادي جاموس', name_ru = 'Буйволиный Йогурт' WHERE name_tr = 'Manda Yoğurdu';
UPDATE menu_items SET name_en = 'Yogurt', name_ar = 'زبادي', name_ru = 'Йогурт' WHERE name_tr = 'Yoğurt';
UPDATE menu_items SET name_en = 'Garlic', name_ar = 'ثوم', name_ru = 'Чеснок' WHERE name_tr = 'Sarımsak';
