// ─── SUPABASE BAĞLANTISI ─────────────────────────────────────────────
let sb = null;

function initSupabase() {
    const url = window.SUPABASE_URL;
    const key = window.SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    if (window.supabase && window.supabase.createClient) {
        return window.supabase.createClient(url, key);
    }
    return null;
}

// ─── UI ELEMENTS ─────────────────────────────────────────────────────
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

let categories = [];
let items = [];

// ─── TOAST BİLDİRİM SİSTEMİ ─────────────────────────────────────────
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ─── ONAY DİYALOĞU ──────────────────────────────────────────────────
function showConfirm(message) {
    return new Promise((resolve) => {
        const dialog = document.getElementById('confirm-dialog');
        const msgEl = document.getElementById('confirm-message');
        const yesBtn = document.getElementById('confirm-yes');
        const noBtn = document.getElementById('confirm-no');

        msgEl.textContent = message;
        dialog.classList.add('visible');

        const cleanup = () => {
            dialog.classList.remove('visible');
            yesBtn.onclick = null;
            noBtn.onclick = null;
        };

        yesBtn.onclick = () => { cleanup(); resolve(true); };
        noBtn.onclick = () => { cleanup(); resolve(false); };
    });
}

// ─── BOOT ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    sb = initSupabase();
    if (sb) {
        checkSession();
    } else {
        if (loginError) loginError.textContent = 'Bağlantı kurulamadı. Lütfen yöneticiyle iletişime geçin.';
    }
    setupImageUploads();
});

// ─── AUTHENTICATION ──────────────────────────────────────────────────
async function checkSession() {
    if (!sb) return;
    try {
        const { data: { session } } = await sb.auth.getSession();
        if (session) showDashboard();
    } catch (e) {
        console.error('Session kontrolü hatası:', e);
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!sb) return;

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = e.target.querySelector('button[type="submit"]');

        btn.disabled = true;
        btn.textContent = 'Giriş yapılıyor...';
        if (loginError) loginError.textContent = '';

        const { error } = await sb.auth.signInWithPassword({ email, password });

        if (error) {
            loginError.textContent = 'E-posta veya şifre hatalı.';
            btn.disabled = false;
            btn.textContent = 'Giriş Yap';
        } else {
            showDashboard();
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            if (sb) await sb.auth.signOut();
        } catch (e) { /* ignore */ }
        showLogin();
    });
}

function showDashboard() {
    loginScreen.style.display = 'none';
    dashboardScreen.style.display = 'block';
    loadData();
}

function showLogin() {
    loginScreen.style.display = 'flex';
    dashboardScreen.style.display = 'none';
}

// ─── TAB NAVIGATION ─────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.getAttribute('data-tab')).classList.add('active');
    });
});

// ─── DATA FETCHING ───────────────────────────────────────────────────
async function loadData() {
    if (!sb) return;

    const { data: catData } = await sb.from('categories').select('*').order('sort_order', { ascending: true });
    categories = catData || [];

    const { data: itemData } = await sb.from('menu_items').select('*').order('sort_order', { ascending: true });
    items = itemData || [];

    const filterSelect = document.getElementById('filter-category');
    const currentFilter = filterSelect ? filterSelect.value : '';

    renderCategoriesList();
    updateCategorySelects(currentFilter);
    renderItemsList(currentFilter);
}

// ─── RENDER: ÜRÜN KARTLARI ──────────────────────────────────────────
function renderItemsList(filterCatId = '') {
    const container = document.getElementById('items-list');
    const countEl = document.getElementById('items-count');
    if (!container) return;

    let filtered = items;
    if (filterCatId) filtered = items.filter(i => i.category_id === filterCatId);

    countEl.textContent = `${filtered.length} ürün${filterCatId ? ' (filtrelenmiş)' : ''}`;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🍽️</div>
                <p>${filterCatId ? 'Bu kategoride ürün yok.' : 'Henüz ürün eklenmemiş.'}</p>
            </div>`;
        return;
    }

    container.innerHTML = '';
    filtered.forEach(item => {
        const cat = categories.find(c => c.id === item.category_id);
        const catName = cat ? cat.name_tr : '—';
        const priceText = item.price
            ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price)
            : '—';

        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            ${item.image
                ? `<img src="${escapeAttr(item.image)}" class="item-thumb" alt="" loading="lazy">`
                : `<div class="item-thumb-empty">🍖</div>`
            }
            <div class="item-info">
                <div class="item-name">${esc(item.name_tr)}</div>
                <div class="item-meta">
                    <span>${esc(catName)}</span>
                    <span>·</span>
                    <span class="badge ${item.is_active ? 'badge-active' : 'badge-inactive'}">${item.is_active ? 'Aktif' : 'Pasif'}</span>
                </div>
            </div>
            <span class="item-price">${priceText}</span>
            <div class="item-actions">
                <button class="btn-icon" onclick="editItem('${item.id}')" title="Düzenle">✏️</button>
                <button class="btn-icon danger" onclick="handleDeleteItem('${item.id}')" title="Sil">🗑️</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// ─── RENDER: KATEGORİ KARTLARI ──────────────────────────────────────
function renderCategoriesList() {
    const container = document.getElementById('categories-list');
    const countEl = document.getElementById('cats-count');
    if (!container) return;

    countEl.textContent = `${categories.length} kategori`;

    if (categories.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📂</div>
                <p>Henüz kategori eklenmemiş.</p>
            </div>`;
        return;
    }

    container.innerHTML = '';
    categories.forEach(cat => {
        const itemCount = items.filter(i => i.category_id === cat.id).length;
        const card = document.createElement('div');
        card.className = 'cat-card';
        card.innerHTML = `
            <div class="cat-order">${cat.sort_order}</div>
            ${cat.image
                ? `<img src="${escapeAttr(cat.image)}" class="item-thumb" alt="" loading="lazy">`
                : `<div class="item-thumb-empty">📂</div>`
            }
            <div class="cat-info">
                <div class="cat-name">${esc(cat.name_tr)}</div>
                <div class="cat-item-count">${itemCount} ürün</div>
            </div>
            <div class="item-actions">
                <button class="btn-icon" onclick="editCategory('${escapeAttr(cat.id)}')" title="Düzenle">✏️</button>
                <button class="btn-icon danger" onclick="handleDeleteCategory('${escapeAttr(cat.id)}')" title="Sil">🗑️</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateCategorySelects(currentFilter = '') {
    const filterSelect = document.getElementById('filter-category');
    const formSelect = document.getElementById('item-category');

    if (filterSelect && formSelect) {
        const options = categories.map(c => `<option value="${escapeAttr(c.id)}">${esc(c.name_tr)}</option>`).join('');
        filterSelect.innerHTML = '<option value="">Tüm Kategoriler</option>' + options;
        if (currentFilter) filterSelect.value = currentFilter;
        formSelect.innerHTML = options;
        filterSelect.onchange = (e) => renderItemsList(e.target.value);
    }
}

// ─── HELPERS ─────────────────────────────────────────────────────────
function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// Türkçe isimden slug oluştur (kategori ID için)
function slugify(text) {
    const charMap = {'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','Ç':'c','Ğ':'g','İ':'i','Ö':'o','Ş':'s','Ü':'u'};
    return text.toLowerCase()
        .replace(/[çğıöşüÇĞİÖŞÜ]/g, c => charMap[c] || c)
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

// ─── GÖRSEL ÖNİZLEME & UPLOAD ───────────────────────────────────────
function setupImageUploads() {
    setupSingleUpload('item-image-file', 'item-image-preview', 'item-upload-placeholder');
    setupSingleUpload('cat-image-file', 'cat-image-preview', 'cat-upload-placeholder');
}

function setupSingleUpload(inputId, previewId, placeholderId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById(previewId);
        const placeholder = document.getElementById(placeholderId);
        if (file && preview && placeholder) {
            const url = URL.createObjectURL(file);
            preview.src = url;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        }
    });
}

function resetImagePreview(previewId, placeholderId) {
    const preview = document.getElementById(previewId);
    const placeholder = document.getElementById(placeholderId);
    if (preview) { preview.style.display = 'none'; preview.src = ''; }
    if (placeholder) placeholder.style.display = '';
}

// ─── IMAGE COMPRESSION (Canvas API) ──────────────────────────────────
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_RAW_SIZE = 10 * 1024 * 1024;
const MAX_DIMENSION = 1200;
const COMPRESS_QUALITY = 0.80;

async function compressImage(file) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        showToast('Desteklenmeyen dosya tipi. JPEG, PNG veya WebP yükleyin.', 'error');
        return null;
    }
    if (file.size > MAX_RAW_SIZE) {
        showToast(`Dosya çok büyük (${(file.size / 1024 / 1024).toFixed(1)}MB). Maks 10MB.`, 'error');
        return null;
    }
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                if (width > height) { height = Math.round(height * (MAX_DIMENSION / width)); width = MAX_DIMENSION; }
                else { width = Math.round(width * (MAX_DIMENSION / height)); height = MAX_DIMENSION; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width; canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                if (blob) resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }));
                else canvas.toBlob((jpgBlob) => {
                    resolve(jpgBlob ? new File([jpgBlob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }) : file);
                }, 'image/jpeg', COMPRESS_QUALITY);
            }, 'image/webp', COMPRESS_QUALITY);
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
        img.src = url;
    });
}

async function uploadImage(file, categoryId) {
    if (!sb || !file) return null;
    const compressed = await compressImage(file);
    if (!compressed) return null;
    const fileExt = compressed.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
    const filePath = categoryId ? `${categoryId}/${fileName}` : fileName;
    const { error } = await sb.storage.from('images').upload(filePath, compressed, { cacheControl: '86400', upsert: false });
    if (error) { showToast('Görsel yüklenemedi: ' + error.message, 'error'); return null; }
    const { data } = sb.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
}

// ─── MODAL LOGIC ─────────────────────────────────────────────────────
function openModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    if (id === 'itemModal') {
        document.getElementById('item-form').reset();
        document.getElementById('item-id').value = '';
        document.getElementById('item-image').value = '';
        resetImagePreview('item-image-preview', 'item-upload-placeholder');
        document.getElementById('itemModalTitle').textContent = 'Yeni Ürün Ekle';
    }
    if (id === 'categoryModal') {
        document.getElementById('category-form').reset();
        document.getElementById('cat-id').value = '';
        document.getElementById('cat-image').value = '';
        resetImagePreview('cat-image-preview', 'cat-upload-placeholder');
        document.getElementById('categoryModalTitle').textContent = 'Yeni Kategori Ekle';
    }
}

window.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
        // Find which modal was clicked
        if (event.target.id === 'itemModal') closeModal('itemModal');
        if (event.target.id === 'categoryModal') closeModal('categoryModal');
    }
});

// ─── MODAL OPENERS ───────────────────────────────────────────────────
window.openItemModal = function () {
    closeModal('itemModal'); // reset first
    document.getElementById('item-is-active').checked = true;
    openModal('itemModal');
};

window.openCategoryModal = function () {
    closeModal('categoryModal'); // reset first
    openModal('categoryModal');
};

// ─── CRUD: KATEGORİLER ──────────────────────────────────────────────
document.getElementById('category-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!sb) return showToast('Bağlantı yok.', 'error');

    let id = document.getElementById('cat-id').value;
    const name_tr = document.getElementById('cat-name-tr').value.trim();
    const sort_order = parseInt(document.getElementById('cat-order').value) || 0;
    let image = document.getElementById('cat-image').value;
    const imageFile = document.getElementById('cat-image-file').files[0];

    if (!name_tr) return showToast('Kategori adı boş olamaz.', 'error');

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Kaydediliyor...';

    if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile, id || slugify(name_tr));
        if (uploadedUrl) image = uploadedUrl;
    }

    const isEdit = id && categories.some(c => c.id === id);

    if (isEdit) {
        const { error } = await sb.from('categories').update({ name_tr, sort_order, image }).eq('id', id);
        if (error) showToast('Hata: ' + error.message, 'error');
        else showToast('Kategori güncellendi ✓');
    } else {
        // Yeni kategori — ID otomatik oluştur
        id = slugify(name_tr);
        if (!id) { showToast('Geçersiz kategori adı.', 'error'); btn.disabled = false; btn.textContent = 'Kaydet'; return; }
        // ID çakışması kontrolü
        if (categories.some(c => c.id === id)) {
            id = id + '_' + Date.now().toString(36).slice(-4);
        }
        const { error } = await sb.from('categories').insert([{ id, name_tr, sort_order, image }]);
        if (error) showToast('Hata: ' + error.message, 'error');
        else showToast('Kategori eklendi ✓');
    }

    btn.disabled = false;
    btn.textContent = 'Kaydet';
    closeModal('categoryModal');
    loadData();
});

window.editCategory = function (id) {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    document.getElementById('cat-id').value = cat.id;
    document.getElementById('cat-name-tr').value = cat.name_tr;
    document.getElementById('cat-order').value = cat.sort_order;
    document.getElementById('cat-image').value = cat.image || '';
    document.getElementById('categoryModalTitle').textContent = 'Kategori Düzenle';
    // Mevcut görseli önizle
    if (cat.image) {
        const preview = document.getElementById('cat-image-preview');
        const placeholder = document.getElementById('cat-upload-placeholder');
        preview.src = cat.image;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    }
    openModal('categoryModal');
};

window.handleDeleteCategory = async function (id) {
    const cat = categories.find(c => c.id === id);
    const itemCount = items.filter(i => i.category_id === id).length;
    const name = cat ? cat.name_tr : id;
    const msg = itemCount > 0
        ? `"${name}" kategorisini ve içindeki ${itemCount} ürünü silmek istediğinize emin misiniz?`
        : `"${name}" kategorisini silmek istediğinize emin misiniz?`;

    const confirmed = await showConfirm(msg);
    if (!confirmed) return;

    const { error } = await sb.from('categories').delete().eq('id', id);
    if (error) showToast('Silinemedi: ' + error.message, 'error');
    else { showToast('Kategori silindi.'); loadData(); }
};

// ─── CRUD: ÜRÜNLER ───────────────────────────────────────────────────
document.getElementById('item-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!sb) return showToast('Bağlantı yok.', 'error');

    const id = document.getElementById('item-id').value;
    const category_id = document.getElementById('item-category').value;
    const name_tr = document.getElementById('item-name-tr').value.trim();
    const price = document.getElementById('item-price').value;
    const sort_order = parseInt(document.getElementById('item-sort-order').value) || 0;
    const is_active = document.getElementById('item-is-active').checked;
    let image = document.getElementById('item-image').value;
    const imageFile = document.getElementById('item-image-file').files[0];

    if (!name_tr) return showToast('Ürün adı boş olamaz.', 'error');
    if (!price) return showToast('Fiyat girilmeli.', 'error');

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Kaydediliyor...';

    if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile, category_id);
        if (uploadedUrl) image = uploadedUrl;
    }

    const payload = { category_id, name_tr, price: parseFloat(price), sort_order, is_active, image };

    if (id) {
        const { error } = await sb.from('menu_items').update(payload).eq('id', id);
        if (error) showToast('Hata: ' + error.message, 'error');
        else showToast('Ürün güncellendi ✓');
    } else {
        const { error } = await sb.from('menu_items').insert([payload]);
        if (error) showToast('Hata: ' + error.message, 'error');
        else showToast('Ürün eklendi ✓');
    }

    btn.disabled = false;
    btn.textContent = 'Kaydet';
    closeModal('itemModal');
    loadData();
});

window.editItem = function (id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    document.getElementById('item-id').value = item.id;
    document.getElementById('item-category').value = item.category_id;
    document.getElementById('item-name-tr').value = item.name_tr;
    document.getElementById('item-price').value = item.price || '';
    document.getElementById('item-sort-order').value = item.sort_order || 0;
    document.getElementById('item-is-active').checked = item.is_active;
    document.getElementById('item-image').value = item.image || '';
    document.getElementById('itemModalTitle').textContent = 'Ürün Düzenle';
    // Mevcut görseli önizle
    if (item.image) {
        const preview = document.getElementById('item-image-preview');
        const placeholder = document.getElementById('item-upload-placeholder');
        preview.src = item.image;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    }
    openModal('itemModal');
};

window.handleDeleteItem = async function (id) {
    const item = items.find(i => i.id === id);
    const name = item ? item.name_tr : 'Bu ürün';
    const confirmed = await showConfirm(`"${name}" ürününü silmek istediğinize emin misiniz?`);
    if (!confirmed) return;

    const { error } = await sb.from('menu_items').delete().eq('id', id);
    if (error) showToast('Silinemedi: ' + error.message, 'error');
    else { showToast('Ürün silindi.'); loadData(); }
};
