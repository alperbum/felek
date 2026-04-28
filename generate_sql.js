const fs = require('fs');

const content = fs.readFileSync('js/script.js', 'utf8');

// Extract arrays using eval
const menuDataMatch = content.match(/let menuData = (\[[\s\S]*?\]);\s*let categories/);
const categoriesMatch = content.match(/let categories = (\[[\s\S]*?\]);/);

if (!menuDataMatch || !categoriesMatch) {
    console.error("Could not find arrays");
    process.exit(1);
}

let menuData, categories;
eval('menuData = ' + menuDataMatch[1] + ';');
eval('categories = ' + categoriesMatch[1] + ';');

let sql = '';

// Delete existing to avoid duplicates if any
sql += 'DELETE FROM menu_items;\n';
sql += 'DELETE FROM categories;\n\n';

// Insert categories
sql += '-- KATEGORİLER\n';
categories.forEach((cat, index) => {
    // Generate a human-readable name for category from ID if possible
    let name_tr = cat.id.replace('_', ' ');
    name_tr = name_tr.charAt(0).toUpperCase() + name_tr.slice(1);
    
    // Some hardcoded names for better UX
    const names = {
        'mezeler': 'Mezeler',
        'salatalar': 'Salatalar',
        'ana_yemekler': 'Ana Yemekler',
        'tatli_meyve': 'Tatlı & Meyve',
        'raki': 'Rakı',
        'sarap': 'Şarap',
        'viski': 'Viski',
        'votka_cin': 'Votka & Cin',
        'bira': 'Bira',
        'diger_urunler': 'Diğer Ürünler'
    };
    if (names[cat.id]) name_tr = names[cat.id];

    sql += `INSERT INTO categories (id, name_tr, sort_order, image) VALUES ('${cat.id}', '${name_tr}', ${index * 10}, '${cat.image || ''}');\n`;
});

sql += '\n-- ÜRÜNLER\n';

menuData.forEach(item => {
    // Convert price "₺320,00" to 320
    let numericPrice = null;
    if (item.price) {
        const p = item.price.replace('₺', '').replace(/\./g, '').replace(',', '.').trim();
        numericPrice = parseFloat(p);
    }
    
    const escapeSql = (str) => {
        if (!str) return 'NULL';
        return "'" + str.replace(/'/g, "''") + "'";
    };

    const name_tr = escapeSql(item.title ? item.title.tr : '');
    const name_en = escapeSql(item.title ? item.title.en : '');
    const name_ar = escapeSql(item.title ? item.title.ar : '');
    const name_ru = escapeSql(item.title ? item.title.ru : '');
    
    const ext_tr = escapeSql(item.extras ? item.extras.tr : '');
    const ext_en = escapeSql(item.extras ? item.extras.en : '');
    const ext_ar = escapeSql(item.extras ? item.extras.ar : '');
    const ext_ru = escapeSql(item.extras ? item.extras.ru : '');
    
    const priceStr = numericPrice !== null && !isNaN(numericPrice) ? numericPrice : 'NULL';
    const imageStr = escapeSql(item.image || '');
    
    sql += `INSERT INTO menu_items (category_id, name_tr, name_en, name_ar, name_ru, price, extras_tr, extras_en, extras_ar, extras_ru, image, is_active) VALUES ('${item.categoryId}', ${name_tr}, ${name_en}, ${name_ar}, ${name_ru}, ${priceStr}, ${ext_tr}, ${ext_en}, ${ext_ar}, ${ext_ru}, ${imageStr}, true);\n`;
});

fs.writeFileSync('seed.sql', sql);
console.log('seed.sql oluşturuldu!');
