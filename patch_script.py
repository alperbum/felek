import re

with open("c:/Users/alperbum/Desktop/felek/generated_js.txt", "r", encoding="utf-8") as f:
    generated_code = f.read()

with open("c:/Users/alperbum/Desktop/felek/js/script.js", "r", encoding="utf-8") as f:
    js_code = f.read()

js_code = re.sub(r'let menuData = \[.*?\];', '', js_code, flags=re.DOTALL)
js_code = re.sub(r'let categories = \[.*?\];', '', js_code, flags=re.DOTALL)

js_code = js_code.replace("const menuGrid = document.getElementById('qr-menu-grid');", generated_code + "\n\n    const menuGrid = document.getElementById('qr-menu-grid');")

new_render_menu = r"""        function renderMenu() {
            currentView = 'items';
            menuGrid.innerHTML = '';
            // Feedback bölümünü gizle
            const feedbackEl = document.getElementById('feedback');
            if (feedbackEl) feedbackEl.style.display = 'none';
            
            // Geri Dön Butonu
            const backBtnContainer = document.createElement('div');
            backBtnContainer.style.gridColumn = '1 / -1';
            const backBtnText = (typeof currentLang !== 'undefined' && translations[currentLang]) ? translations[currentLang].btn_back : '← Geri Dön';
            backBtnContainer.innerHTML = `<button class="qr-back-btn" onclick="renderCategories()">${backBtnText}</button>`;
            menuGrid.appendChild(backBtnContainer);

            const filteredItems = menuData.filter(item => item.categoryId === activeCategory);
            
            if (filteredItems.length === 0) {
                const emptyMsg = (typeof currentLang !== 'undefined' && translations[currentLang]) ? translations[currentLang].empty_category : 'Bu kategoride henüz ürün bulunmamaktadır.';
                menuGrid.innerHTML += `<p style="color: var(--text-muted); text-align: center; grid-column: 1 / -1; padding: 2rem;">${emptyMsg}</p>`;
                return;
            }

            // --- GRUPLAMA MANTIĞI ---
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
            } else {
                groupedItems = filteredItems;
            }

            groupedItems.forEach(item => {
                const card = document.createElement('div');
                card.className = 'qr-card';
                
                const title = getLocalized(item.title);
                const desc = getLocalized(item.desc);
                const ingredients = getLocalized(item.ingredients);

                let imageHtml = '';
                if (item.image && item.image.trim() !== '') {
                    imageHtml = `<img src="${item.image}" alt="${title}" class="qr-card-img">`;
                } else {
                    const placeholderTxt = (typeof currentLang !== 'undefined' && translations[currentLang]) ? translations[currentLang].placeholder_image : 'Görsel Bekleniyor';
                    imageHtml = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.2); font-family:var(--font-heading);">${placeholderTxt}</div>`;
                }

                if (item.isGroup) {
                    let defaultVariant = item.variants[0]; 
                    let pillsHtml = item.variants.map((v, idx) => 
                        `<button type="button" class="qr-variant-pill ${idx === 0 ? 'active' : ''}" data-price="${v.price}">${v.size}</button>`
                    ).join('');

                    card.innerHTML = `
                        <div class="qr-card-img-wrapper">
                            ${imageHtml}
                        </div>
                        <div class="qr-card-content">
                            <div class="qr-card-header">
                                <h3 class="qr-card-title">${title}</h3>
                                <span class="qr-card-price">${defaultVariant.price}</span>
                            </div>
                            <div class="qr-variant-pills">
                                ${pillsHtml}
                            </div>
                        </div>
                    `;
                    
                    const pills = card.querySelectorAll('.qr-variant-pill');
                    const priceEl = card.querySelector('.qr-card-price');
                    
                    pills.forEach(pill => {
                        pill.addEventListener('click', function(e) {
                            e.stopPropagation();
                            pills.forEach(p => p.classList.remove('active'));
                            this.classList.add('active');
                            priceEl.textContent = this.getAttribute('data-price');
                        });
                    });

                } else {
                    const allergens = getLocalized(item.allergens);
                    let extrasObj = item.extras;
                    let extrasStr = '';
                    if (extrasObj && typeof extrasObj === 'object') {
                       extrasStr = getLocalized(extrasObj);
                    } else if (extrasObj) {
                       extrasStr = extrasObj;
                    }

                    card.innerHTML = `
                        <div class="qr-card-img-wrapper">
                            ${imageHtml}
                            ${item.calories ? `<span class="qr-card-cal">${item.calories}</span>` : ''}
                        </div>
                        <div class="qr-card-content">
                            <div class="qr-card-header">
                                <h3 class="qr-card-title">${title}</h3>
                                ${item.price ? `<span class="qr-card-price">${item.price}</span>` : ''}
                            </div>
                            ${desc ? `<p class="qr-card-desc">${desc}</p>` : ''}
                            <div class="qr-card-ingredients">
                                ${ingredients ? `<strong>${(typeof currentLang !== 'undefined' && translations[currentLang]) ? translations[currentLang].ingredients_label : 'İçindekiler:'}</strong> ${ingredients}<br>` : ''}
                                ${allergens ? `<strong style="color: #ffb44d;">${(typeof currentLang !== 'undefined' && translations[currentLang]) ? translations[currentLang].allergen_label : '⚠️ Alerjen Uyarısı:'}</strong> ${allergens}` : ''}
                                ${extrasStr && extrasStr !== 'undefined' ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.1); color: #ccc;"><em>${extrasStr}</em></div>` : ''}
                            </div>
                        </div>
                    `;
                }
                menuGrid.appendChild(card);
            });
        }"""

# Use string replace instead of regex for safety
start_marker = "        function renderMenu() {"
end_marker = "        }\n\n        // Global functions"

start_idx = js_code.find(start_marker)
end_idx = js_code.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    js_code = js_code[:start_idx] + new_render_menu + "\n\n" + js_code[end_idx:]
else:
    print("Could not find renderMenu to replace")

with open("c:/Users/alperbum/Desktop/felek/js/script.js", "w", encoding="utf-8") as f:
    f.write(js_code)
