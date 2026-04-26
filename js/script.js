document.addEventListener('DOMContentLoaded', () => {

    // --- Language Switcher ---
    const langSwitcher = document.getElementById('lang-switcher');
    let currentLang = localStorage.getItem('siteLang') || 'tr';

    window.applyTranslations = function(lang) {
        if (!translations || !translations[lang]) return;
        
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.innerHTML = translations[lang][key];
                }
            }
        });

        // Re-render menu if we are on the menu page and functions exist
        if (typeof window.getCurrentView === 'function') {
            if (window.getCurrentView() === 'categories' && typeof window.renderCategories === 'function') {
                window.renderCategories();
            } else if (window.getCurrentView() === 'items' && typeof window.renderMenu === 'function') {
                window.renderMenu();
            }
        } else if (typeof renderCategories === 'function') {
            // Fallback
            try { renderCategories(); } catch(e) {}
        }
    }

    if (langSwitcher) {
        langSwitcher.value = currentLang;
        langSwitcher.addEventListener('change', (e) => {
            currentLang = e.target.value;
            localStorage.setItem('siteLang', currentLang);
            window.applyTranslations(currentLang);
        });
    }

    // Initial translation apply
    window.applyTranslations(currentLang);

    // --- Hero Carousel Slider ---
    const track = document.getElementById('carousel-track');
    if (track) {
        const slides = track.querySelectorAll('.carousel-img');
        let currentIndex = 0;
        
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }, 3000); // Change image every 3 seconds
    }
    
    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            // Hamburger animation
            const spans = menuToggle.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // --- Sticky Header ---
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Venue Video Autoplay on Scroll ---
    const venueVideo = document.getElementById('venue-video');
    if (venueVideo) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    venueVideo.play();
                } else {
                    venueVideo.pause();
                }
            });
        }, { threshold: 0.3 }); // Play when 30% of the video is visible

        videoObserver.observe(venueVideo);
    }

    // --- QR Menu Data & Rendering ---
    const menuData = [
        // KIRMIZI ETLER
        {
            categoryId: "kirmiziet",
            title: { tr: "Kasap Köfte", en: "Butcher's Meatballs", ar: "كفتة الجزار", ru: "Котлеты мясника" },
            price: "₺0.00", calories: "🔥 450 kcal",
            desc: { tr: "Özel baharat karışımlı klasik köfte", en: "Classic meatballs with special spices", ar: "كفتة كلاسيكية ببهارات خاصة", ru: "Классические котлеты со специями" },
            ingredients: { tr: "Dana-kuzu kıyma, soğan, baharat", en: "Beef-lamb mince, onion, spices", ar: "لحم بقر وغنم مفروم، بصل، بهارات", ru: "Говяжий и бараний фарш, лук, специи" },
            allergens: { tr: "Gluten", en: "Gluten", ar: "جلوتين", ru: "Глютен" }, image: "assets/images/SnapInsta.to_673824959_18514044895072243_796291128331931836_n.jpg"
        },
        {
            categoryId: "kirmiziet",
            title: { tr: "Felek Köfte (Kaşarlı)", en: "Felek Meatballs (with Cheese)", ar: "كفتة فيلك بالجبن", ru: "Котлеты Фелек с сыром" },
            price: "₺0.00", calories: "🔥 520 kcal",
            desc: { tr: "İçi eriyen kaşar peyniri dolgulu imza köftemiz", en: "Our signature meatballs stuffed with melting cheese", ar: "كفتة مميزة محشوة بالجبن المذاب", ru: "Наши фирменные котлеты с начинкой из плавленого сыра" },
            ingredients: { tr: "Dana-kuzu kıyma, kaşar peyniri, baharat", en: "Beef-lamb mince, cheddar cheese, spices", ar: "لحم بقر وغنم مفروم، جبن، بهارات", ru: "Говяжий и бараний фарш, сыр, специи" },
            allergens: { tr: "Gluten, Süt Ürünleri", en: "Gluten, Dairy", ar: "جلوتين، منتجات الألبان", ru: "Глютен, Молочные продукты" }, image: ""
        },
        {
            categoryId: "kirmiziet",
            title: { tr: "Şaşlık", en: "Shashlik", ar: "شاشليك", ru: "Шашлык" },
            price: "₺0.00", calories: "🔥 480 kcal",
            desc: { tr: "Soğan ve krema ile marine edilmiş lokum gibi et", en: "Tender meat marinated with onion and cream", ar: "لحم طري متبل بالبصل والكريمة", ru: "Нежное мясо, маринованное с луком и сливками" },
            ingredients: { tr: "Dana bonfile, soğan, krema", en: "Beef tenderloin, onion, cream", ar: "فيليه لحم بقر، بصل، كريمة", ru: "Говяжья вырезка, лук, сливки" },
            allergens: { tr: "Süt Ürünleri", en: "Dairy", ar: "منتجات الألبان", ru: "Молочные продукты" }, image: ""
        },
        {
            categoryId: "kirmiziet",
            title: { tr: "Dana Antrikot", en: "Ribeye Steak", ar: "ستيك ريب آي", ru: "Стейк Рибай" },
            price: "₺0.00", calories: "🔥 650 kcal",
            desc: { tr: "28 gün kuru dinlendirilmiş birinci sınıf Balıkesir danası", en: "28-day dry aged premium beef", ar: "لحم بقر ممتاز معتق لمدة 28 يومًا", ru: "Премиальная говядина 28-дневной выдержки" },
            ingredients: { tr: "Antrikot, deniz tuzu, taze kekik", en: "Ribeye, sea salt, fresh thyme", ar: "ريب آي، ملح بحري، زعتر طازج", ru: "Рибай, морская соль, свежий тимьян" },
            image: "assets/images/SnapInsta.to_613647466_18491576731072243_8360769828246837946_n.jpg"
        },
        {
            categoryId: "kirmiziet",
            title: { tr: "Kuzu Pirzola", en: "Lamb Chops", ar: "ريش ضأن", ru: "Бараньи Отбивные" },
            price: "₺0.00", calories: "🔥 550 kcal",
            desc: { tr: "Trakya kuzusu, özel sos marinasyonu", en: "Thrace lamb, special marinade", ar: "خروف تراقيا، تتبيلة خاصة", ru: "Баранина, специальный маринад" },
            ingredients: { tr: "Kuzu pirzola, zeytinyağı, baharat", en: "Lamb chops, olive oil, spices", ar: "ريش ضأن، زيت زيتون، بهارات", ru: "Бараньи отбивные, оливковое масло, специи" },
            image: "assets/images/SnapInsta.to_631052160_18497719381072243_630189921650077750_n.jpg"
        },
        // BEYAZ ETLER
        {
            categoryId: "beyazet",
            title: { tr: "Tavuk Şiş", en: "Chicken Skewers", ar: "شيش طاووق", ru: "Куриный Шашлык" },
            price: "₺0.00", calories: "🔥 320 kcal",
            desc: { tr: "Yoğurt ve baharatla marine edilmiş tavuk göğsü", en: "Chicken breast marinated with yogurt and spices", ar: "صدر دجاج متبل بالزبادي والبهارات", ru: "Куриная грудка, маринованная с йогуртом и специями" },
            ingredients: { tr: "Tavuk, yoğurt, salça", en: "Chicken, yogurt, tomato paste", ar: "دجاج، زبادي، معجون طماطم", ru: "Курица, йогурт, томатная паста" },
            allergens: { tr: "Süt Ürünleri", en: "Dairy", ar: "منتجات الألبان", ru: "Молочные продукты" }, image: ""
        },
        {
            categoryId: "beyazet",
            title: { tr: "Tavuk Kanat", en: "Chicken Wings", ar: "أجنحة دجاج", ru: "Куриные Крылышки" },
            price: "₺0.00", calories: "🔥 410 kcal",
            desc: { tr: "Acılı/Acısız mangallık soslu kanat", en: "Spicy/Non-spicy wings with grill sauce", ar: "أجنحة حارة/عادية بصلصة الشواء", ru: "Острые/неострые крылышки с соусом для гриля" },
            ingredients: { tr: "Tavuk kanat, özel sos", en: "Chicken wings, special sauce", ar: "أجنحة دجاج، صلصة خاصة", ru: "Куриные крылышки, специальный соус" },
            image: ""
        },
        // RAKI
        { categoryId: "raki", title: { tr: "Yeni Rakı (35cl)", en: "Yeni Raki (35cl)", ar: "ييني راكي (35cl)", ru: "Йени Раки (35cl)" }, price: "₺0.00", allergens: { tr: "Anason", en: "Anise", ar: "يانسون", ru: "Анис" }, image: "" },
        { categoryId: "raki", title: { tr: "Yeni Rakı (50cl)", en: "Yeni Raki (50cl)", ar: "ييني راكي (50cl)", ru: "Йени Раки (50cl)" }, price: "₺0.00", allergens: { tr: "Anason", en: "Anise", ar: "يانسون", ru: "Анис" }, image: "" },
        { categoryId: "raki", title: { tr: "Yeni Rakı (70cl)", en: "Yeni Raki (70cl)", ar: "ييني راكي (70cl)", ru: "Йени Раки (70cl)" }, price: "₺0.00", allergens: { tr: "Anason", en: "Anise", ar: "يانسون", ru: "Анис" }, image: "" },
        { categoryId: "raki", title: { tr: "Beylerbeyi Göbek (20cl)", en: "Beylerbeyi Gobek (20cl)", ar: "بيلربي جوبيك (20cl)", ru: "Бейлербейи Гобек (20cl)" }, price: "₺0.00", allergens: { tr: "Anason", en: "Anise", ar: "يانسون", ru: "Анис" }, image: "" },
        { categoryId: "raki", title: { tr: "Beylerbeyi Göbek (35cl)", en: "Beylerbeyi Gobek (35cl)", ar: "بيلربي جوبيك (35cl)", ru: "Бейлербейи Гобек (35cl)" }, price: "₺0.00", allergens: { tr: "Anason", en: "Anise", ar: "يانسون", ru: "Анис" }, image: "" },
        { categoryId: "raki", title: { tr: "Beylerbeyi Göbek (50cl)", en: "Beylerbeyi Gobek (50cl)", ar: "بيلربي جوبيك (50cl)", ru: "Бейлербейи Гобек (50cl)" }, price: "₺0.00", allergens: { tr: "Anason", en: "Anise", ar: "يانسون", ru: "Анис" }, image: "" },
        { categoryId: "raki", title: { tr: "Beylerbeyi Göbek (70cl)", en: "Beylerbeyi Gobek (70cl)", ar: "بيلربي جوبيك (70cl)", ru: "Бейлербейи Гобек (70cl)" }, price: "₺0.00", allergens: { tr: "Anason", en: "Anise", ar: "يانسون", ru: "Анис" }, image: "" },
        { categoryId: "raki", title: { tr: "Yeşil Efe (35cl)", en: "Yesil Efe (35cl)", ar: "يشيل ايفه (35cl)", ru: "Йешиль Эфе (35cl)" }, price: "₺0.00", allergens: { tr: "Anason", en: "Anise", ar: "يانسون", ru: "Анис" }, image: "" },
        { categoryId: "raki", title: { tr: "Yeşil Efe (50cl)", en: "Yesil Efe (50cl)", ar: "يشيل ايفه (50cl)", ru: "Йешиль Эфе (50cl)" }, price: "₺0.00", allergens: { tr: "Anason", en: "Anise", ar: "يانسون", ru: "Анис" }, image: "" },
        { categoryId: "raki", title: { tr: "Yeşil Efe (70cl)", en: "Yesil Efe (70cl)", ar: "يشيل ايفه (70cl)", ru: "Йешиль Эфе (70cl)" }, price: "₺0.00", allergens: { tr: "Anason", en: "Anise", ar: "يانسون", ru: "Анис" }, image: "" },
        // MEZELER
        {
            categoryId: "mezeler",
            title: { tr: "Süzme Yoğurtlu Haydari", en: "Haydari (Strained Yogurt)", ar: "حيدري (زبادي مصفى)", ru: "Хайдари (Процеженный йогурт)" },
            price: "₺0.00", calories: "🔥 150 kcal", allergens: { tr: "Süt Ürünleri", en: "Dairy", ar: "منتجات الألبان", ru: "Молочные продукты" }, image: ""
        },
        {
            categoryId: "mezeler",
            title: { tr: "Tereyağlı Humus", en: "Hummus with Butter", ar: "حمص بالزبدة", ru: "Хумус со сливочным маслом" },
            price: "₺0.00", calories: "🔥 220 kcal", allergens: { tr: "Susam, Süt Ürünleri", en: "Sesame, Dairy", ar: "سمسم، منتجات الألبان", ru: "Кунжут, Молочные продукты" }, image: ""
        },
        // SALATALAR
        {
            categoryId: "salatalar",
            title: { tr: "Gavurdağı Salatası", en: "Gavurdagi Salad", ar: "سلطة جافورداغي", ru: "Салат Гавурдаги" },
            price: "₺0.00", calories: "🔥 240 kcal", allergens: { tr: "Ceviz", en: "Walnuts", ar: "جوز", ru: "Грецкие орехи" }, image: ""
        },
        {
            categoryId: "salatalar",
            title: { tr: "Çoban Salata", en: "Shepherd's Salad", ar: "سلطة الراعي", ru: "Пастуший Салат" },
            price: "₺0.00", calories: "🔥 120 kcal", image: ""
        },
        // DİĞER ALKOL
        { categoryId: "digeralkol", title: { tr: "Efes Pilsen (50cl)", en: "Efes Pilsen Beer (50cl)", ar: "بيرة أفس (50cl)", ru: "Пиво Efes Pilsen (50cl)" }, price: "₺0.00", allergens: { tr: "Gluten", en: "Gluten", ar: "جلوتين", ru: "Глютен" }, image: "" },
        { categoryId: "digeralkol", title: { tr: "Kırmızı Şarap (Kadeh)", en: "Red Wine (Glass)", ar: "نبيذ أحمر (كأس)", ru: "Красное Вино (Бокал)" }, price: "₺0.00", allergens: { tr: "Sülfit", en: "Sulfites", ar: "كبريتات", ru: "Сульфиты" }, image: "" },
        // MEŞRUBAT
        { categoryId: "mesrubat", title: { tr: "Kutu Kola / Zero", en: "Coke / Zero", ar: "كولا / زيرو", ru: "Кола / Зеро" }, price: "₺0.00", image: "" },
        { categoryId: "mesrubat", title: { tr: "Şalgam", en: "Turnip Juice", ar: "عصير اللفت", ru: "Сок репы" }, price: "₺0.00", image: "" },
        { categoryId: "mesrubat", title: { tr: "Ayran", en: "Ayran (Yogurt Drink)", ar: "عيران (مشروب زبادي)", ru: "Айран (Йогуртовый напиток)" }, price: "₺0.00", allergens: { tr: "Süt Ürünleri", en: "Dairy", ar: "منتجات الألبان", ru: "Молочные продукты" }, image: "" },
        { categoryId: "mesrubat", title: { tr: "Su (Cam)", en: "Water (Glass Bottle)", ar: "ماء (زجاجة زجاجية)", ru: "Вода (Стеклянная бутылка)" }, price: "₺0.00", image: "" },
        // TATLI
        {
            categoryId: "tatli",
            title: { tr: "Fırın Sütlaç", en: "Baked Rice Pudding", ar: "أرز بالحليب مخبوز", ru: "Запеченный рисовый пудинг" },
            price: "₺0.00", calories: "🔥 280 kcal", allergens: { tr: "Süt Ürünleri", en: "Dairy", ar: "منتجات الألبان", ru: "Молочные продукты" }, image: ""
        },
        {
            categoryId: "tatli",
            title: { tr: "Künefe", en: "Kunefe", ar: "كنافة", ru: "Кюнефе" },
            price: "₺0.00", calories: "🔥 450 kcal", allergens: { tr: "Süt Ürünleri, Gluten", en: "Dairy, Gluten", ar: "منتجات الألبان، جلوتين", ru: "Молочные продукты, Глютен" }, image: ""
        }
    ];

    const categories = [
        { id: "kirmiziet", image: "assets/images/SnapInsta.to_613647466_18491576731072243_8360769828246837946_n.jpg" },
        { id: "beyazet", image: "assets/images/SnapInsta.to_670288761_18512718343072243_7403874126890321840_n.jpg" },
        { id: "raki", image: "assets/images/SnapInsta.to_631052160_18497719381072243_630189921650077750_n.jpg" },
        { id: "mezeler", image: "" },
        { id: "salatalar", image: "" },
        { id: "digeralkol", image: "" },
        { id: "mesrubat", image: "" },
        { id: "tatli", image: "" }
    ];

    const menuGrid = document.getElementById('qr-menu-grid');
    const categoryNav = document.getElementById('category-nav');
    if (categoryNav) categoryNav.style.display = 'none'; // Yeni yapıda buton nav yok

    if (menuGrid) {
        let currentView = 'categories';
        let activeCategory = null;

        // Localized veriyi çeken yardımcı fonksiyon
        function getLocalized(obj) {
            if (!obj) return '';
            if (typeof obj === 'string') return obj;
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'tr';
            return obj[lang] || obj['tr'] || '';
        }

        // Ana Menü (Kategoriler Kart Grid)
        function renderCategories() {
            currentView = 'categories';
            menuGrid.innerHTML = '';
            
            categories.forEach(cat => {
                const card = document.createElement('div');
                card.className = 'qr-category-card';
                
                const catName = (typeof currentLang !== 'undefined' && translations[currentLang] && translations[currentLang]['cat_' + cat.id]) 
                                ? translations[currentLang]['cat_' + cat.id] 
                                : cat.id;
                                
                const imgHtml = cat.image && cat.image !== '' 
                                ? `<img src="${cat.image}" alt="${catName}">` 
                                : `<div style="width:100%; height:100%; background:#111; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.1); font-family:var(--font-heading);">Görsel</div>`;
                
                card.innerHTML = `
                    ${imgHtml}
                    <h3 class="qr-category-card-title">${catName}</h3>
                `;
                card.addEventListener('click', () => {
                    activeCategory = cat.id;
                    renderMenu();
                });
                menuGrid.appendChild(card);
            });
        }

        // Alt Menü (Seçili Kategorinin Ürünleri)
        function renderMenu() {
            currentView = 'items';
            menuGrid.innerHTML = '';
            
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

            filteredItems.forEach(item => {
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

                const allergens = getLocalized(item.allergens);

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
                        </div>
                    </div>
                `;
                menuGrid.appendChild(card);
            });
        }

        // Global functions for onclick and language switcher
        window.renderCategories = renderCategories;
        window.renderMenu = renderMenu;
        window.getCurrentView = () => currentView;

        // Initialize
        renderCategories();
    }
});
