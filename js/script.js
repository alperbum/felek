// Supabase ayarları artık config.js dosyasından geliyor.
document.addEventListener('DOMContentLoaded', () => {

    // --- Language Switcher ---
    const langSwitcher = document.getElementById('lang-switcher');
    let currentLang = localStorage.getItem('siteLang') || 'tr';

    window.applyTranslations = function(lang) {
        if (!translations || !translations[lang]) return;
        currentLang = lang;
        
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

        // Update SEO meta tags based on language
        const metaDesc = document.getElementById('meta-description');
        if (metaDesc && translations[lang].seo_description) {
            metaDesc.setAttribute('content', translations[lang].seo_description);
        }
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && translations[lang].seo_title) {
            ogTitle.setAttribute('content', translations[lang].seo_title);
        }
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && translations[lang].seo_description) {
            ogDesc.setAttribute('content', translations[lang].seo_description);
        }

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

    // --- Carousel Sliders ---
    let carouselIntervals = [];

    function initCarousel(trackId, interval) {
        const track = document.getElementById(trackId);
        if (track) {
            const slides = track.querySelectorAll('.carousel-img');
            if (slides.length <= 1) return;
            let currentIndex = 0;
            
            const intervalId = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
            }, interval);
            carouselIntervals.push(intervalId);
        }
    }

    // Cleanup carousel intervals on page unload
    window.addEventListener('beforeunload', () => {
        carouselIntervals.forEach(id => clearInterval(id));
    });
    
    // Init venue carousel with 3s interval
    initCarousel('carousel-track', 3000);
    
    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const headerNav = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (menuToggle && headerNav) {
        menuToggle.addEventListener('click', () => {
            headerNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                headerNav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // --- Sticky Header ---
    const header = document.getElementById('header');
    
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // --- Reveal Animations ---
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));

    // Hero instant reveal on load
    window.addEventListener('load', () => {
      document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 200 + i * 150);
      });
    });


    // --- QR Menu Data & Rendering ---
    

    

    let categories = [
    { id: "mezeler", image: "" },
    { id: "salatalar", image: "" },
    { id: "ana_yemekler", image: "assets/images/SnapInsta.to_613647466_18491576731072243_8360769828246837946_n.webp" },
    { id: "alkolsuz", image: "" },
    { id: "raki", image: "assets/images/SnapInsta.to_631052160_18497719381072243_630189921650077750_n.webp" },
    { id: "viski", image: "" },
    { id: "sarap", image: "" },
    { id: "biralar", image: "" },
    { id: "votka_cin", image: "" },
    { id: "tatli_meyve", image: "" }
];

let menuData = [
    { categoryId: "mezeler", title: { tr: "Havuç Tarator", en: "Havuç Tarator", ar: "Havuç Tarator", ru: "Havuç Tarator" }, price: "₺320,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Kırmızı Peynir Dolgulu Biber", en: "Kırmızı Peynir Dolgulu Biber", ar: "Kırmızı Peynir Dolgulu Biber", ru: "Kırmızı Peynir Dolgulu Biber" }, price: "₺320,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Köpoğlu", en: "Köpoğlu", ar: "Köpoğlu", ru: "Köpoğlu" }, price: "₺320,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Köz Patlıcan", en: "Köz Patlıcan", ar: "Köz Patlıcan", ru: "Köz Patlıcan" }, price: "₺320,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Humus", en: "Humus", ar: "Humus", ru: "Humus" }, price: "₺300,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Mantar Salatası", en: "Mantar Salatası", ar: "Mantar Salatası", ru: "Mantar Salatası" }, price: "₺300,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Pancar Turşusu", en: "Pancar Turşusu", ar: "Pancar Turşusu", ru: "Pancar Turşusu" }, price: "₺300,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Haydari", en: "Haydari", ar: "Haydari", ru: "Haydari" }, price: "₺290,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Köz Biber", en: "Köz Biber", ar: "Köz Biber", ru: "Köz Biber" }, price: "₺290,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Izgara Zeytin", en: "Izgara Zeytin", ar: "Izgara Zeytin", ru: "Izgara Zeytin" }, price: "₺270,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Çiğköfte", en: "Çiğköfte", ar: "Çiğköfte", ru: "Çiğköfte" }, price: "₺260,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Cacık", en: "Cacık", ar: "Cacık", ru: "Cacık" }, price: "₺260,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Manda Yoğurdu", en: "Manda Yoğurdu", ar: "Manda Yoğurdu", ru: "Manda Yoğurdu" }, price: "₺200,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Beyaz Peynir", en: "Beyaz Peynir", ar: "Beyaz Peynir", ru: "Beyaz Peynir" }, price: "₺180,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Yoğurt", en: "Yoğurt", ar: "Yoğurt", ru: "Yoğurt" }, price: "₺180,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Mantar", en: "Mantar", ar: "Mantar", ru: "Mantar" }, price: "₺160,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Hellim Peyniri", en: "Hellim Peyniri", ar: "Hellim Peyniri", ru: "Hellim Peyniri" }, price: "₺100,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Sarımsak", en: "Sarımsak", ar: "Sarımsak", ru: "Sarımsak" }, price: "₺100,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Kırmızı Acı Biber (Porsiyon)", en: "Kırmızı Acı Biber (Porsiyon)", ar: "Kırmızı Acı Biber (Porsiyon)", ru: "Kırmızı Acı Biber (Porsiyon)" }, price: "₺90,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Acur Turşusu", en: "Acur Turşusu", ar: "Acur Turşusu", ru: "Acur Turşusu" }, price: "₺310,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Semizotu", en: "Semizotu", ar: "Semizotu", ru: "Semizotu" }, price: "₺320,00", image: "" },
    { categoryId: "mezeler", title: { tr: "Şakşuka", en: "Şakşuka", ar: "Şakşuka", ru: "Şakşuka" }, price: "₺320,00", image: "" },
    { categoryId: "salatalar", title: { tr: "Gavurdağ Salata", en: "Gavurdağ Salata", ar: "Gavurdağ Salata", ru: "Gavurdağ Salata" }, price: "₺370,00", image: "", extras: { tr: "+₺100,00 Duble Porsiyon", en: "+₺100,00 Duble Porsiyon", ar: "+₺100,00 Duble Porsiyon", ru: "+₺100,00 Duble Porsiyon" } },
    { categoryId: "salatalar", title: { tr: "Çoban Salata", en: "Çoban Salata", ar: "Çoban Salata", ru: "Çoban Salata" }, price: "₺350,00", image: "", extras: { tr: "+₺100,00 Duble Porsiyon", en: "+₺100,00 Duble Porsiyon", ar: "+₺100,00 Duble Porsiyon", ru: "+₺100,00 Duble Porsiyon" } },
    { categoryId: "salatalar", title: { tr: "İstanbul Salata", en: "İstanbul Salata", ar: "İstanbul Salata", ru: "İstanbul Salata" }, price: "₺350,00", image: "", extras: { tr: "+₺100,00 Duble Porsiyon", en: "+₺100,00 Duble Porsiyon", ar: "+₺100,00 Duble Porsiyon", ru: "+₺100,00 Duble Porsiyon" } },
    { categoryId: "salatalar", title: { tr: "Kaşık Salata", en: "Kaşık Salata", ar: "Kaşık Salata", ru: "Kaşık Salata" }, price: "₺350,00", image: "", extras: { tr: "+₺100,00 Duble Porsiyon", en: "+₺100,00 Duble Porsiyon", ar: "+₺100,00 Duble Porsiyon", ru: "+₺100,00 Duble Porsiyon" } },
    { categoryId: "salatalar", title: { tr: "Mevsim Salata", en: "Mevsim Salata", ar: "Mevsim Salata", ru: "Mevsim Salata" }, price: "₺350,00", image: "", extras: { tr: "+₺100,00 Duble Porsiyon", en: "+₺100,00 Duble Porsiyon", ar: "+₺100,00 Duble Porsiyon", ru: "+₺100,00 Duble Porsiyon" } },
    { categoryId: "salatalar", title: { tr: "Peynirli Roka Salata", en: "Peynirli Roka Salata", ar: "Peynirli Roka Salata", ru: "Peynirli Roka Salata" }, price: "₺350,00", image: "", extras: { tr: "+₺120,00 Duble Porsiyon", en: "+₺120,00 Duble Porsiyon", ar: "+₺120,00 Duble Porsiyon", ru: "+₺120,00 Duble Porsiyon" } },
    { categoryId: "salatalar", title: { tr: "Söğüş Salata", en: "Söğüş Salata", ar: "Söğüş Salata", ru: "Söğüş Salata" }, price: "₺280,00", image: "", extras: { tr: "+₺100,00 Duble Porsiyon", en: "+₺100,00 Duble Porsiyon", ar: "+₺100,00 Duble Porsiyon", ru: "+₺100,00 Duble Porsiyon" } },
    { categoryId: "salatalar", title: { tr: "Salata Üstü Ekstra Ceviz", en: "Salata Üstü Ekstra Ceviz", ar: "Salata Üstü Ekstra Ceviz", ru: "Salata Üstü Ekstra Ceviz" }, price: "₺80,00", image: "" },
    { categoryId: "salatalar", title: { tr: "Salata Üstü Rende Peynir", en: "Salata Üstü Rende Peynir", ar: "Salata Üstü Rende Peynir", ru: "Salata Üstü Rende Peynir" }, price: "₺80,00", image: "" },
    { categoryId: "ana_yemekler", title: { tr: "Bonfile", en: "Bonfile", ar: "Bonfile", ru: "Bonfile" }, price: "₺3.700,00", image: "" },
    { categoryId: "ana_yemekler", title: { tr: "Pirzola", en: "Pirzola", ar: "Pirzola", ru: "Pirzola" }, price: "₺3.200,00", image: "" },
    { categoryId: "ana_yemekler", title: { tr: "Kırmızı Et", en: "Kırmızı Et", ar: "Kırmızı Et", ru: "Kırmızı Et" }, price: "₺2.900,00", image: "" },
    { categoryId: "ana_yemekler", title: { tr: "Beyaz Et", en: "Beyaz Et", ar: "Beyaz Et", ru: "Beyaz Et" }, price: "₺1.800,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Soğuk Baklava", en: "Soğuk Baklava", ar: "Soğuk Baklava", ru: "Soğuk Baklava" }, price: "₺330,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Ayva Tatlısı", en: "Ayva Tatlısı", ar: "Ayva Tatlısı", ru: "Ayva Tatlısı" }, price: "₺330,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "İncir Tatlısı", en: "İncir Tatlısı", ar: "İncir Tatlısı", ru: "İncir Tatlısı" }, price: "₺330,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Kabak Tatlısı", en: "Kabak Tatlısı", ar: "Kabak Tatlısı", ru: "Kabak Tatlısı" }, price: "₺330,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Dondurmalı İrmik Helvası", en: "Dondurmalı İrmik Helvası", ar: "Dondurmalı İrmik Helvası", ru: "Dondurmalı İrmik Helvası" }, price: "₺330,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "İrmik Helvası", en: "İrmik Helvası", ar: "İrmik Helvası", ru: "İrmik Helvası" }, price: "₺250,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Güllaç", en: "Güllaç", ar: "Güllaç", ru: "Güllaç" }, price: "₺150,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Dondurma (Porsiyon)", en: "Dondurma (Porsiyon)", ar: "Dondurma (Porsiyon)", ru: "Dondurma (Porsiyon)" }, price: "₺150,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Serpme Meyve", en: "Serpme Meyve", ar: "Serpme Meyve", ru: "Serpme Meyve" }, price: "₺450,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Tekli Karışık Meyve", en: "Tekli Karışık Meyve", ar: "Tekli Karışık Meyve", ru: "Tekli Karışık Meyve" }, price: "₺350,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Kavun", en: "Kavun", ar: "Kavun", ru: "Kavun" }, price: "₺310,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Karpuz", en: "Karpuz", ar: "Karpuz", ru: "Karpuz" }, price: "₺280,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Ananas", en: "Ananas", ar: "Ananas", ru: "Ananas" }, price: "₺210,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Ballı Muz", en: "Ballı Muz", ar: "Ballı Muz", ru: "Ballı Muz" }, price: "₺210,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Kaşık Ayva", en: "Kaşık Ayva", ar: "Kaşık Ayva", ru: "Kaşık Ayva" }, price: "₺210,00", image: "" },
    { categoryId: "tatli_meyve", title: { tr: "Tek Meyve", en: "Tek Meyve", ar: "Tek Meyve", ru: "Tek Meyve" }, price: "₺140,00", image: "" },
    { categoryId: "raki", title: { tr: "Yeni Rakı 70 cl", en: "Yeni Rakı 70 cl", ar: "Yeni Rakı 70 cl", ru: "Yeni Rakı 70 cl" }, price: "₺3.000,00", image: "" },
    { categoryId: "raki", title: { tr: "Yeni Rakı 50 cl", en: "Yeni Rakı 50 cl", ar: "Yeni Rakı 50 cl", ru: "Yeni Rakı 50 cl" }, price: "₺2.200,00", image: "" },
    { categoryId: "raki", title: { tr: "Yeni Rakı 35 cl", en: "Yeni Rakı 35 cl", ar: "Yeni Rakı 35 cl", ru: "Yeni Rakı 35 cl" }, price: "₺1.550,00", image: "" },
    { categoryId: "raki", title: { tr: "Yeni Rakı 20 cl", en: "Yeni Rakı 20 cl", ar: "Yeni Rakı 20 cl", ru: "Yeni Rakı 20 cl" }, price: "₺900,00", image: "" },
    { categoryId: "raki", title: { tr: "Yeni Seri 70 cl", en: "Yeni Seri 70 cl", ar: "Yeni Seri 70 cl", ru: "Yeni Seri 70 cl" }, price: "₺3.300,00", image: "" },
    { categoryId: "raki", title: { tr: "Yeni Seri 35 cl", en: "Yeni Seri 35 cl", ar: "Yeni Seri 35 cl", ru: "Yeni Seri 35 cl" }, price: "₺1.550,00", image: "" },
    { categoryId: "raki", title: { tr: "Yeni Seri 20 cl", en: "Yeni Seri 20 cl", ar: "Yeni Seri 20 cl", ru: "Yeni Seri 20 cl" }, price: "₺950,00", image: "" },
    { categoryId: "raki", title: { tr: "Kulüp Rakı 70 cl", en: "Kulüp Rakı 70 cl", ar: "Kulüp Rakı 70 cl", ru: "Kulüp Rakı 70 cl" }, price: "₺3.400,00", image: "" },
    { categoryId: "raki", title: { tr: "Kulüp Rakı 35 cl", en: "Kulüp Rakı 35 cl", ar: "Kulüp Rakı 35 cl", ru: "Kulüp Rakı 35 cl" }, price: "₺1.750,00", image: "" },
    { categoryId: "raki", title: { tr: "Sarı Zeybek 70 cl", en: "Sarı Zeybek 70 cl", ar: "Sarı Zeybek 70 cl", ru: "Sarı Zeybek 70 cl" }, price: "₺3.800,00", image: "" },
    { categoryId: "raki", title: { tr: "Sarı Zeybek 35 cl", en: "Sarı Zeybek 35 cl", ar: "Sarı Zeybek 35 cl", ru: "Sarı Zeybek 35 cl" }, price: "₺1.950,00", image: "" },
    { categoryId: "raki", title: { tr: "Altın Seri 70 cl", en: "Altın Seri 70 cl", ar: "Altın Seri 70 cl", ru: "Altın Seri 70 cl" }, price: "₺3.600,00", image: "" },
    { categoryId: "raki", title: { tr: "Altın Seri 35 cl", en: "Altın Seri 35 cl", ar: "Altın Seri 35 cl", ru: "Altın Seri 35 cl" }, price: "₺1.850,00", image: "" },
    { categoryId: "raki", title: { tr: "Altın Seri 20 cl", en: "Altın Seri 20 cl", ar: "Altın Seri 20 cl", ru: "Altın Seri 20 cl" }, price: "₺1.050,00", image: "" },
    { categoryId: "raki", title: { tr: "Efe Gold 70 cl", en: "Efe Gold 70 cl", ar: "Efe Gold 70 cl", ru: "Efe Gold 70 cl" }, price: "₺3.600,00", image: "" },
    { categoryId: "raki", title: { tr: "Efe Gold 35 cl", en: "Efe Gold 35 cl", ar: "Efe Gold 35 cl", ru: "Efe Gold 35 cl" }, price: "₺1.850,00", image: "" },
    { categoryId: "raki", title: { tr: "Beylerbeyi Göbek 70 cl", en: "Beylerbeyi Göbek 70 cl", ar: "Beylerbeyi Göbek 70 cl", ru: "Beylerbeyi Göbek 70 cl" }, price: "₺3.750,00", image: "" },
    { categoryId: "raki", title: { tr: "Beylerbeyi Göbek 35 cl", en: "Beylerbeyi Göbek 35 cl", ar: "Beylerbeyi Göbek 35 cl", ru: "Beylerbeyi Göbek 35 cl" }, price: "₺1.950,00", image: "" },
    { categoryId: "raki", title: { tr: "Beylerbeyi Göbek 20 cl", en: "Beylerbeyi Göbek 20 cl", ar: "Beylerbeyi Göbek 20 cl", ru: "Beylerbeyi Göbek 20 cl" }, price: "₺1.100,00", image: "" },
    { categoryId: "raki", title: { tr: "Duble Göbek", en: "Duble Göbek", ar: "Duble Göbek", ru: "Duble Göbek" }, price: "₺430,00", image: "" },
    { categoryId: "raki", title: { tr: "Tek Göbek", en: "Tek Göbek", ar: "Tek Göbek", ru: "Tek Göbek" }, price: "₺290,00", image: "" },
    { categoryId: "raki", title: { tr: "Duble Rakı", en: "Duble Rakı", ar: "Duble Rakı", ru: "Duble Rakı" }, price: "₺380,00", image: "" },
    { categoryId: "raki", title: { tr: "Tek Rakı", en: "Tek Rakı", ar: "Tek Rakı", ru: "Tek Rakı" }, price: "₺240,00", image: "" },
    { categoryId: "viski", title: { tr: "Chivas 70 cl", en: "Chivas 70 cl", ar: "Chivas 70 cl", ru: "Chivas 70 cl" }, price: "₺5.700,00", image: "" },
    { categoryId: "viski", title: { tr: "Chivas 35 cl", en: "Chivas 35 cl", ar: "Chivas 35 cl", ru: "Chivas 35 cl" }, price: "₺2.900,00", image: "" },
    { categoryId: "viski", title: { tr: "Duble Viski", en: "Duble Viski", ar: "Duble Viski", ru: "Duble Viski" }, price: "₺650,00", image: "" },
    { categoryId: "viski", title: { tr: "Tek Viski", en: "Tek Viski", ar: "Tek Viski", ru: "Tek Viski" }, price: "₺450,00", image: "" },
    { categoryId: "votka_cin", title: { tr: "Absolut 70 cl", en: "Absolut 70 cl", ar: "Absolut 70 cl", ru: "Absolut 70 cl" }, price: "₺4.200,00", image: "" },
    { categoryId: "votka_cin", title: { tr: "Absolut 35 cl", en: "Absolut 35 cl", ar: "Absolut 35 cl", ru: "Absolut 35 cl" }, price: "₺2.150,00", image: "" },
    { categoryId: "votka_cin", title: { tr: "Smirnoff 70 cl", en: "Smirnoff 70 cl", ar: "Smirnoff 70 cl", ru: "Smirnoff 70 cl" }, price: "₺4.200,00", image: "" },
    { categoryId: "votka_cin", title: { tr: "Duble Cin", en: "Duble Cin", ar: "Duble Cin", ru: "Duble Cin" }, price: "₺470,00", image: "" },
    { categoryId: "votka_cin", title: { tr: "Duble Absolut Votka", en: "Duble Absolut Votka", ar: "Duble Absolut Votka", ru: "Duble Absolut Votka" }, price: "₺420,00", image: "" },
    { categoryId: "sarap", title: { tr: "Sarafin 75 cl (Kırmızı/Beyaz/Blush)", en: "Sarafin 75 cl (Kırmızı/Beyaz/Blush)", ar: "Sarafin 75 cl (Kırmızı/Beyaz/Blush)", ru: "Sarafin 75 cl (Kırmızı/Beyaz/Blush)" }, price: "₺4.300,00", image: "" },
    { categoryId: "sarap", title: { tr: "Versus Dedeçeşme 75 cl", en: "Versus Dedeçeşme 75 cl", ar: "Versus Dedeçeşme 75 cl", ru: "Versus Dedeçeşme 75 cl" }, price: "₺3.000,00", image: "" },
    { categoryId: "sarap", title: { tr: "Versus Beyaz 75 cl", en: "Versus Beyaz 75 cl", ar: "Versus Beyaz 75 cl", ru: "Versus Beyaz 75 cl" }, price: "₺2.900,00", image: "" },
    { categoryId: "sarap", title: { tr: "Vintage Beyaz 75 cl", en: "Vintage Beyaz 75 cl", ar: "Vintage Beyaz 75 cl", ru: "Vintage Beyaz 75 cl" }, price: "₺2.700,00", image: "" },
    { categoryId: "sarap", title: { tr: "Leona Blush 75 cl", en: "Leona Blush 75 cl", ar: "Leona Blush 75 cl", ru: "Leona Blush 75 cl" }, price: "₺2.300,00", image: "" },
    { categoryId: "sarap", title: { tr: "Terra 75 cl (Öküzgözü/Kalecik Karası/Rose/Shiraz)", en: "Terra 75 cl (Öküzgözü/Kalecik Karası/Rose/Shiraz)", ar: "Terra 75 cl (Öküzgözü/Kalecik Karası/Rose/Shiraz)", ru: "Terra 75 cl (Öküzgözü/Kalecik Karası/Rose/Shiraz)" }, price: "₺2.300,00", image: "" },
    { categoryId: "sarap", title: { tr: "Buzbağ 75 cl (Kırmızı/Beyaz)", en: "Buzbağ 75 cl (Kırmızı/Beyaz)", ar: "Buzbağ 75 cl (Kırmızı/Beyaz)", ru: "Buzbağ 75 cl (Kırmızı/Beyaz)" }, price: "₺1.950,00", image: "" },
    { categoryId: "sarap", title: { tr: "Buzbağ 37,5 cl (Kırmızı/Beyaz)", en: "Buzbağ 37,5 cl (Kırmızı/Beyaz)", ar: "Buzbağ 37,5 cl (Kırmızı/Beyaz)", ru: "Buzbağ 37,5 cl (Kırmızı/Beyaz)" }, price: "₺900,00", image: "" },
    { categoryId: "sarap", title: { tr: "Kadeh Şarap", en: "Kadeh Şarap", ar: "Kadeh Şarap", ru: "Kadeh Şarap" }, price: "₺450,00", image: "" },
    { categoryId: "biralar", title: { tr: "Efes 50 cl", en: "Efes 50 cl", ar: "Efes 50 cl", ru: "Efes 50 cl" }, price: "₺420,00", image: "" },
    { categoryId: "biralar", title: { tr: "Tuborg 50 cl", en: "Tuborg 50 cl", ar: "Tuborg 50 cl", ru: "Tuborg 50 cl" }, price: "₺420,00", image: "" },
    { categoryId: "biralar", title: { tr: "Corona 33 cl", en: "Corona 33 cl", ar: "Corona 33 cl", ru: "Corona 33 cl" }, price: "₺320,00", image: "" },
    { categoryId: "biralar", title: { tr: "Miller", en: "Miller", ar: "Miller", ru: "Miller" }, price: "₺275,00", image: "" },
    { categoryId: "biralar", title: { tr: "Efes Pilsen", en: "Efes Pilsen", ar: "Efes Pilsen", ru: "Efes Pilsen" }, price: "₺250,00", image: "" },
    { categoryId: "biralar", title: { tr: "Tuborg 33 cl", en: "Tuborg 33 cl", ar: "Tuborg 33 cl", ru: "Tuborg 33 cl" }, price: "₺250,00", image: "" },
    { categoryId: "biralar", title: { tr: "Cips", en: "Cips", ar: "Cips", ru: "Cips" }, price: "₺300,00", image: "" },
    { categoryId: "biralar", title: { tr: "Antep Çerez", en: "Antep Çerez", ar: "Antep Çerez", ru: "Antep Çerez" }, price: "₺245,00", image: "" },
    { categoryId: "biralar", title: { tr: "Patates Tava", en: "Patates Tava", ar: "Patates Tava", ru: "Patates Tava" }, price: "₺240,00", image: "" },
    { categoryId: "alkolsuz", title: { tr: "1 Litre Şalgam / Tonik", en: "1 Litre Şalgam / Tonik", ar: "1 Litre Şalgam / Tonik", ru: "1 Litre Şalgam / Tonik" }, price: "₺400,00", image: "" },
    { categoryId: "alkolsuz", title: { tr: "Büyük Redbull", en: "Büyük Redbull", ar: "Büyük Redbull", ru: "Büyük Redbull" }, price: "₺270,00", image: "" },
    { categoryId: "alkolsuz", title: { tr: "Redbull", en: "Redbull", ar: "Redbull", ru: "Redbull" }, price: "₺175,00", image: "" },
    { categoryId: "alkolsuz", title: { tr: "Kola / Fanta / Sprite", en: "Kola / Fanta / Sprite", ar: "Kola / Fanta / Sprite", ru: "Kola / Fanta / Sprite" }, price: "₺145,00", image: "" },
    { categoryId: "alkolsuz", title: { tr: "Tonik", en: "Tonik", ar: "Tonik", ru: "Tonik" }, price: "₺140,00", image: "" },
    { categoryId: "alkolsuz", title: { tr: "Portakal / Vişne / Şeftali Suyu", en: "Portakal / Vişne / Şeftali Suyu", ar: "Portakal / Vişne / Şeftali Suyu", ru: "Portakal / Vişne / Şeftali Suyu" }, price: "₺130,00", image: "" },
    { categoryId: "alkolsuz", title: { tr: "Ice Tea Limon / Şeftali", en: "Ice Tea Limon / Şeftali", ar: "Ice Tea Limon / Şeftali", ru: "Ice Tea Limon / Şeftali" }, price: "₺130,00", image: "" },
    { categoryId: "alkolsuz", title: { tr: "Churchill", en: "Churchill", ar: "Churchill", ru: "Churchill" }, price: "₺130,00", image: "" },
    { categoryId: "alkolsuz", title: { tr: "Acılı / Acısız Şalgam", en: "Acılı / Acısız Şalgam", ar: "Acılı / Acısız Şalgam", ru: "Acılı / Acısız Şalgam" }, price: "₺110,00", image: "" },
    { categoryId: "alkolsuz", title: { tr: "Ayran", en: "Ayran", ar: "Ayran", ru: "Ayran" }, price: "₺100,00", image: "" },
    { categoryId: "alkolsuz", title: { tr: "Soda", en: "Soda", ar: "Soda", ru: "Soda" }, price: "₺75,00", image: "" }
];

    const menuGrid = document.getElementById('qr-menu-grid');
    const categoryNav = document.getElementById('category-nav');
    if (categoryNav) categoryNav.style.display = 'none'; // Yeni yapıda buton nav yok

    if (menuGrid) {
        let currentView = 'categories';
        let activeCategory = null;

        // HTML sanitizasyon helper
        function escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

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
            // Feedback bölümünü göster
            const feedbackEl = document.getElementById('feedback');
            if (feedbackEl) feedbackEl.style.display = '';
            
            categories.forEach(cat => {
                const card = document.createElement('div');
                card.className = 'qr-category-card';
                
                const catName = (typeof currentLang !== 'undefined' && translations[currentLang] && translations[currentLang]['cat_' + cat.id]) 
                                ? translations[currentLang]['cat_' + cat.id] 
                                : cat.id;
                                
                const imgHtml = cat.image && cat.image !== '' 
                                ? `<img src="${escapeHtml(cat.image)}" alt="${escapeHtml(catName)}" loading="lazy" decoding="async">` 
                                : ``;

                
                card.innerHTML = `
                    ${imgHtml}
                    <h3 class="qr-category-card-title">${escapeHtml(catName)}</h3>
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
            
            // Helper to parse price string for sorting
            function parsePrice(item) {
                let priceStr = '';
                if (item.isGroup && item.variants && item.variants.length > 0) {
                    priceStr = item.variants[0].price;
                } else if (item.price) {
                    priceStr = item.price;
                }
                if (!priceStr) return 0;
                // e.g. "₺3.000,00" -> 3000.00
                return parseFloat(priceStr.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
            }

            // Sort by custom order for Raki, fallback to price descending (Pahalıdan ucuza)
            const customRakiOrder = [
                "Beylerbeyi Göbek",
                "Altın Seri",
                "Efe Gold",
                "Yeni Rakı",
                "Sarı Zeybek",
                "Yeni Seri",
                "Kulüp Rakı"
            ];

            groupedItems.sort((a, b) => {
                if (activeCategory === 'raki') {
                    let nameA = a.isGroup ? a.baseName : (a.title.tr || '');
                    let nameB = b.isGroup ? b.baseName : (b.title.tr || '');
                    
                    let idxA = customRakiOrder.findIndex(r => nameA.includes(r));
                    let idxB = customRakiOrder.findIndex(r => nameB.includes(r));
                    
                    if (idxA === -1) idxA = 999;
                    if (idxB === -1) idxB = 999;
                    
                    if (idxA !== idxB) {
                        return idxA - idxB;
                    }
                }
                return parsePrice(b) - parsePrice(a);
            });

            groupedItems.forEach(item => {
                const card = document.createElement('div');
                card.className = 'qr-card';
                
                const title = getLocalized(item.title);
                const desc = getLocalized(item.desc);
                const ingredients = getLocalized(item.ingredients);

                let imageHtml = '';
                if (item.image && item.image.trim() !== '') {
                    imageHtml = `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(title)}" class="qr-card-img" loading="lazy" decoding="async">`;
                } else {
                    const placeholderTxt = (typeof currentLang !== 'undefined' && translations[currentLang]) ? translations[currentLang].placeholder_image : 'Görsel Bekleniyor';
                    imageHtml = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.2); font-family:var(--font-heading);">${placeholderTxt}</div>`;
                }

                if (item.isGroup) {
                    let variantsHtml = item.variants.map(v => 
                        `<span class="qr-variant-inline-item"><span style="color:#aaa;">${v.size}</span> <span style="color:var(--primary-color);">${v.price}</span></span>`
                    ).join('<span class="qr-variant-separator">•</span>');

                    card.innerHTML = `
                        <div class="qr-card-img-wrapper">
                            ${imageHtml}
                        </div>
                        <div class="qr-card-content">
                            <div class="qr-card-header">
                                <h3 class="qr-card-title">${title}</h3>
                            </div>
                            <div class="qr-variant-inline-list">
                                ${variantsHtml}
                            </div>
                        </div>
                    `;
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
        }

        // Global functions for onclick and language switcher
        window.renderCategories = renderCategories;
        window.renderMenu = renderMenu;
        window.getCurrentView = () => currentView;

        // Initialize with Supabase (if configured) or fallback to static
        async function initMenuData() {
            if (typeof supabase !== 'undefined' && window.SUPABASE_URL && window.SUPABASE_URL !== 'BURAYA_SUPABASE_URL_GELECEK') {
                try {
                    const client = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
                    const { data: catData, error: catError } = await client.from('categories').select('*').order('sort_order', { ascending: true });
                    const { data: itemData, error: itemError } = await client.from('menu_items').select('*').eq('is_active', true).order('sort_order', { ascending: true });
                    
                    if (!catError && catData && !itemError && itemData) {
                        categories = catData.map(c => ({
                            id: c.id,
                            image: c.image || ''
                        }));
                        
                        menuData = itemData.map(item => ({
                            categoryId: item.category_id,
                            title: { tr: item.name_tr, en: item.name_en, ar: item.name_ar, ru: item.name_ru },
                            price: item.price ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price) : '',
                            extras: { tr: item.extras_tr, en: item.extras_en, ar: item.extras_ar, ru: item.extras_ru },
                            image: item.image || ''
                        }));
                        
                        // Kategori isimlerini translations nesnesine dinamik ekle
                        if (window.translations) {
                            catData.forEach(c => {
                                if (window.translations.tr && c.name_tr) window.translations.tr['cat_' + c.id] = c.name_tr;
                                if (window.translations.en && c.name_en) window.translations.en['cat_' + c.id] = c.name_en;
                                if (window.translations.ar && c.name_ar) window.translations.ar['cat_' + c.id] = c.name_ar;
                                if (window.translations.ru && c.name_ru) window.translations.ru['cat_' + c.id] = c.name_ru;
                            });
                        }
                    }
                } catch(e) {
                    console.error("Supabase bağlantı hatası:", e);
                }
            }
            renderCategories();
        }

        initMenuData();
    }
});
