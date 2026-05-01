const menuData = [
    { categoryId: "raki", title: { tr: "Yeni Rakı 70 cl" }, price: "₺3.000,00", image: "" },
    { categoryId: "raki", title: { tr: "Yeni Rakı 50 cl" }, price: "₺2.200,00", image: "" }
];

const activeCategory = 'raki';
const filteredItems = menuData.filter(item => item.categoryId === activeCategory);

const groupableCategories = ['raki', 'viski', 'votka_cin', 'sarap', 'biralar'];
let groupedItems = [];

if (groupableCategories.includes(activeCategory)) {
    let groups = {};
    filteredItems.forEach(item => {
        const titleTr = item.title.tr || '';
        const clMatch = titleTr.match(/(.+?)\s+(\d+(?:,\d+)?\s*cl\.?)\s*$/i);
        
        if (clMatch) {
            const baseName = clMatch[1].trim();
            const sizeStr = clMatch[2].replace('.', '').trim();
            
            if (!groups[baseName]) {
                groups[baseName] = {
                    isGroup: true,
                    baseName: baseName,
                    title: { tr: baseName, en: baseName, ar: baseName, ru: baseName },
                    image: item.image,
                    categoryId: item.categoryId,
                    variants: []
                };
            }
            groups[baseName].variants.push({
                size: sizeStr,
                price: item.price,
                extras: item.extras,
                originalItem: item
            });
        } else {
            groupedItems.push(item);
        }
    });
    
    for (let key in groups) {
        let group = groups[key];
        group.variants.sort((a, b) => {
            let aVal = parseFloat(a.size.replace(',', '.'));
            let bVal = parseFloat(b.size.replace(',', '.'));
            return bVal - aVal;
        });
        groupedItems.push(group);
    }
}

console.log(JSON.stringify(groupedItems, null, 2));
