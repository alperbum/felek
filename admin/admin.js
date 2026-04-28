const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;

let supabase;

// Eğer Supabase JS yüklendiyse ve URL geçerliyse başlat
if (typeof window.supabase !== 'undefined' && SUPABASE_URL) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    checkSession();
}

// UI Elements
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// State
let categories = [];
let items = [];

// --- AUTHENTICATION ---
async function checkSession() {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        showDashboard();
    } else {
        showLogin();
    }
}

if(loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!supabase) {
            loginError.textContent = "Supabase bağlantısı kurulamadı. URL ve KEY ayarlarını kontrol edin.";
            return;
        }

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = e.target.querySelector('button');
        btn.disabled = true;
        btn.textContent = 'Giriş yapılıyor...';

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            loginError.textContent = error.message;
            btn.disabled = false;
            btn.textContent = 'Giriş Yap';
        } else {
            showDashboard();
        }
    });
}

if(logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        if(supabase) await supabase.auth.signOut();
        showLogin();
    });
}

function showDashboard() {
    loginScreen.style.display = 'none';
    dashboardScreen.style.display = 'flex';
    loadData();
}

function showLogin() {
    loginScreen.style.display = 'flex';
    dashboardScreen.style.display = 'none';
}

// --- TAB NAVIGATION ---
document.querySelectorAll('.nav-menu li').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-menu li').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        const tabId = e.target.getAttribute('data-tab');
        e.target.classList.add('active');
        document.getElementById('tab-' + tabId).classList.add('active');
    });
});

// --- DATA FETCHING ---
async function loadData() {
    if(!supabase) return;
    
    // Load Categories
    const { data: catData, error: catError } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if(catError) console.error(catError);
    else categories = catData || [];

    // Load Items
    const { data: itemData, error: itemError } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
    if(itemError) console.error(itemError);
    else items = itemData || [];

    renderCategoriesTable();
    renderItemsTable();
    updateCategorySelects();
}

// --- RENDER TABLES ---
function renderCategoriesTable() {
    const tbody = document.getElementById('categories-table-body');
    if(!tbody) return;
    
    tbody.innerHTML = '';
    if(categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Kategori bulunamadı.</td></tr>';
        return;
    }

    categories.forEach(cat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cat.id}</td>
            <td>${cat.name_tr}</td>
            <td>${cat.sort_order}</td>
            <td>
                <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; margin-right: 0.5rem;" onclick="editCategory('${cat.id}')">Düzenle</button>
                <button class="btn btn-danger" onclick="deleteCategory('${cat.id}')">Sil</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderItemsTable(filterCatId = '') {
    const tbody = document.getElementById('items-table-body');
    if(!tbody) return;

    tbody.innerHTML = '';
    
    let filteredItems = items;
    if(filterCatId) {
        filteredItems = items.filter(i => i.category_id === filterCatId);
    }

    if(filteredItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Ürün bulunamadı.</td></tr>';
        return;
    }

    filteredItems.forEach(item => {
        const cat = categories.find(c => c.id === item.category_id);
        const catName = cat ? cat.name_tr : 'Bilinmeyen';
        const img = item.image ? `<img src="${item.image}" class="item-thumb">` : '<div class="item-thumb" style="display:flex;align-items:center;justify-content:center;font-size:10px;color:#666;">Görsel Yok</div>';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${img}</td>
            <td>${item.name_tr}</td>
            <td>${catName}</td>
            <td>${item.price ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price) : '-'}</td>
            <td>${item.is_active ? '<span style="color:var(--success);">Aktif</span>' : '<span style="color:var(--error);">Pasif</span>'}</td>
            <td>
                <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; margin-right: 0.5rem;" onclick="editItem('${item.id}')">Düzenle</button>
                <button class="btn btn-danger" onclick="deleteItem('${item.id}')">Sil</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateCategorySelects() {
    const filterSelect = document.getElementById('filter-category');
    const formSelect = document.getElementById('item-category');
    
    if(filterSelect && formSelect) {
        const options = categories.map(c => `<option value="${c.id}">${c.name_tr}</option>`).join('');
        
        filterSelect.innerHTML = '<option value="">Tüm Kategoriler</option>' + options;
        formSelect.innerHTML = options;
        
        filterSelect.addEventListener('change', (e) => {
            renderItemsTable(e.target.value);
        });
    }
}

// --- MODAL LOGIC ---
function openModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    if(id === 'itemModal') document.getElementById('item-form').reset();
    if(id === 'categoryModal') document.getElementById('category-form').reset();
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

// --- UPLOAD LOGIC ---
async function uploadImage(file) {
    if(!supabase || !file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
    if(uploadError) {
        alert("Görsel yüklenirken hata oluştu: " + uploadError.message);
        return null;
    }
    
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
}

// --- CRUD LOGIC ---

// CATEGORIES
document.getElementById('category-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(!supabase) return alert("Supabase bağlı değil");

    const id = document.getElementById('cat-id').value;
    const name_tr = document.getElementById('cat-name-tr').value;
    const sort_order = document.getElementById('cat-order').value;
    let image = document.getElementById('cat-image').value;
    const imageFile = document.getElementById('cat-image-file').files[0];

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Kaydediliyor...';

    if(imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if(uploadedUrl) image = uploadedUrl;
    }

    const isEdit = categories.some(c => c.id === id);

    if(isEdit) {
        // Update
        const { error } = await supabase.from('categories').update({
            name_tr, sort_order: parseInt(sort_order), image
        }).eq('id', id);
        if(error) alert(error.message);
    } else {
        // Insert
        const { error } = await supabase.from('categories').insert([{
            id, name_tr, sort_order: parseInt(sort_order), image
        }]);
        if(error) alert(error.message);
    }
    
    btn.disabled = false;
    btn.textContent = 'Kaydet';
    closeModal('categoryModal');
    loadData();
});

window.editCategory = function(id) {
    const cat = categories.find(c => c.id === id);
    if(cat) {
        document.getElementById('cat-id').value = cat.id;
        document.getElementById('cat-id').readOnly = true; // Can't change ID easily
        document.getElementById('cat-name-tr').value = cat.name_tr;
        document.getElementById('cat-order').value = cat.sort_order;
        document.getElementById('cat-image').value = cat.image || '';
        document.getElementById('categoryModalTitle').textContent = 'Kategori Düzenle';
        openModal('categoryModal');
    }
}

window.deleteCategory = async function(id) {
    if(!supabase) return;
    if(confirm('Bu kategoriyi silmek istediğinize emin misiniz? (İçindeki ürünler de silinebilir)')) {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if(error) alert(error.message);
        else loadData();
    }
}

// ITEMS
document.getElementById('item-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(!supabase) return alert("Supabase bağlı değil");

    const id = document.getElementById('item-id').value;
    const category_id = document.getElementById('item-category').value;
    const name_tr = document.getElementById('item-name-tr').value;
    const price = document.getElementById('item-price').value;
    let image = document.getElementById('item-image').value;
    const imageFile = document.getElementById('item-image-file').files[0];

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Kaydediliyor...';

    if(imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if(uploadedUrl) image = uploadedUrl;
    }

    if(id) {
        // Update
        const { error } = await supabase.from('menu_items').update({
            category_id, name_tr, price, image
        }).eq('id', id);
        if(error) alert(error.message);
    } else {
        // Insert
        const { error } = await supabase.from('menu_items').insert([{
            category_id, name_tr, price, image, is_active: true
        }]);
        if(error) alert(error.message);
    }

    btn.disabled = false;
    btn.textContent = 'Kaydet';
    closeModal('itemModal');
    loadData();
});

window.editItem = function(id) {
    const item = items.find(i => i.id === id);
    if(item) {
        document.getElementById('item-id').value = item.id;
        document.getElementById('item-category').value = item.category_id;
        document.getElementById('item-name-tr').value = item.name_tr;
        document.getElementById('item-price').value = item.price || '';
        document.getElementById('item-image').value = item.image || '';
        document.getElementById('itemModalTitle').textContent = 'Ürün Düzenle';
        openModal('itemModal');
    }
}

window.deleteItem = async function(id) {
    if(!supabase) return;
    if(confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
        const { error } = await supabase.from('menu_items').delete().eq('id', id);
        if(error) alert(error.message);
        else loadData();
    }
}
