// admin/js/script.js
let allProducts = [];
let allUsers = [];
let allOrders = [];
let allSections = [];

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    initTabs();
    initSidebar();
    loadDashboardData();
    loadShopCMSData();
    loadSectionsData();
    initTheme();
});

function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Initial sync
    const savedTheme = localStorage.getItem('admin-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    
    toggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('admin-theme', newTheme);
        
        // Add a subtle rotation or bounce if needed, but the CSS transition handles most
    });
}

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const openBtn = document.getElementById('sidebarOpenBtn');
    const closeBtn = document.getElementById('sidebarCloseBtn');

    if(!sidebar || !overlay || !openBtn || !closeBtn) return;

    function openSidebar() {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('md:-ml-64');
        } else {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        }
    }

    function closeSidebar() {
        if (window.innerWidth >= 768) {
            sidebar.classList.add('md:-ml-64');
        } else {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('opacity-0');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    }

    openBtn.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    
    // Auto-close sidebar on mobile when a tab is clicked
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if(window.innerWidth < 768) {
                closeSidebar();
            }
        });
    });
}

// Check Auth Barrier
async function checkSession() {
    try {
        const res = await fetch('api/auth.php?action=check');
        if (!res.ok) throw new Error('Unauthorized');
    } catch {
        window.location.href = 'login.html';
    }
}

async function logout() {
    await fetch('api/auth.php?action=logout', { method: 'POST' });
    window.location.href = 'login.html';
}

// Tab Switching
function initTabs() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabs = document.querySelectorAll('.tab-content');
    const titleObj = document.getElementById('topNavTitle');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            
            // Reset active styles
            navBtns.forEach(b => {
                b.classList.remove('bg-brandAccent/10', 'text-brandAccent');
                b.classList.add('text-gray-400', 'hover:bg-darkBorder/50');
            });
            // Set active
            btn.classList.add('bg-brandAccent/10', 'text-brandAccent');
            btn.classList.remove('text-gray-400', 'hover:bg-darkBorder/50');

            // Hide tabs
            tabs.forEach(t => t.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            titleObj.innerText = btn.innerText.trim();
            
            // Load Context specific data
            if (target === 'products') loadProductsTable();
            if (target === 'users') loadUsers();
            if (target === 'orders') loadOrders();
            if (target === 'dashboard') loadDashboardData();
            if (target === 'cms') loadCmsData();
            if (target === 'sections-cms') loadSectionsData();
            if (target === 'shop-cms') loadShopCMSData();
        });
    });
}

// Core Dashboard & Settings Sync
async function loadDashboardData() {
    try {
        const res = await fetch('api/dashboard_data.php');
        const d = await res.json();
        
        if (d.success) {
            // Stats
            document.getElementById('dashProdCount').innerText = d.counts ? d.counts.products : 0;
            document.getElementById('dashOrderCount').innerText = d.counts ? d.counts.orders : 0;
            document.getElementById('dashUserCount').innerText = d.counts ? d.counts.users : 0;

            // Latest Orders List
            const ordersBody = document.getElementById('dashOrdersBody');
            if (d.latest_orders && d.latest_orders.length > 0) {
                ordersBody.innerHTML = d.latest_orders.map(o => `
                    <tr class="hover:bg-brandAccent/5 transition-colors">
                        <td class="py-3 font-mono text-[10px] text-gray-500">#${o.id}</td>
                        <td class="py-3 font-medium">${o.customer_name}</td>
                        <td class="py-3 font-bold">৳${parseFloat(o.total).toFixed(2)}</td>
                        <td class="py-3">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${o.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}">
                                ${o.status}
                            </span>
                        </td>
                    </tr>
                `).join('');
            } else {
                ordersBody.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-gray-500">No orders yet</td></tr>';
            }

            // Latest Users List
            const usersBody = document.getElementById('dashUsersBody');
            if (d.latest_users && d.latest_users.length > 0) {
                usersBody.innerHTML = d.latest_users.map(u => `
                    <tr class="hover:bg-brandAccent/5 transition-colors">
                        <td class="py-3">
                            <p class="font-medium">${u.name}</p>
                            <p class="text-[10px] text-gray-500">${new Date(u.created_at).toLocaleDateString()}</p>
                        </td>
                        <td class="py-3 text-xs">
                            <p>${u.email}</p>
                            <p class="text-gray-500">${u.phone || ''}</p>
                        </td>
                        <td class="py-3 text-[10px] text-gray-400">
                             ${u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                    </tr>
                `).join('');
            } else {
                usersBody.innerHTML = '<tr><td colspan="3" class="py-4 text-center text-gray-500">No users yet</td></tr>';
            }

            document.getElementById('stateSiteName').innerText = d.site_name;
            document.getElementById('sidebarBrandName').innerText = d.site_name;
            document.getElementById('stateHeroImg').src = '../user/' + d.hero_image;
            document.getElementById('stateFooterText').innerText = d.footer_text;
            
            document.getElementById('brandNameInput').value = d.site_name;
            document.getElementById('setFooterText').value = d.footer_text;
            document.getElementById('setSupportEmail').value = d.support_email;
            document.getElementById('previewHero').src = '../user/' + d.hero_image;
            if (d.site_logo) {
                document.getElementById('previewLogo').src = '../user/' + d.site_logo;
            }
            if (d.theme_color) {
                document.getElementById('themeColorInput').value = d.theme_color;
            }

            // Load Admin Username
            const resAuth = await fetch('api/settings_api.php?action=get_admin_user');
            const dAuth = await resAuth.json();
            if(dAuth.success) document.getElementById('adminUsername').value = dAuth.username;

            // Load SMTP settings
            loadSmtpSettings();
        }
    } catch (e) { console.error("Error loading dashboard data", e); }
}

window.setPresetColor = (hex) => {
    const input = document.getElementById('themeColorInput');
    input.value = hex;
    // Trigger preview
    input.dispatchEvent(new Event('input'));
};

// Live Color Preview
document.getElementById('themeColorInput').addEventListener('input', function(e) {
    const color = e.target.value;
    // Update admin branding color for real-time feel
    document.documentElement.style.setProperty('--brand-accent', color);
});

// Global Image Preview
document.getElementById('heroImageInput').addEventListener('change', function(e) {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => document.getElementById('previewHero').src = e.target.result;
        reader.readAsDataURL(this.files[0]);
    }
});

document.getElementById('logoImageInput').addEventListener('change', function(e) {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => document.getElementById('previewLogo').src = e.target.result;
        reader.readAsDataURL(this.files[0]);
    }
});

// Branding Form Submit
document.getElementById('brandingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    
    const formData = new FormData(e.target);
    try {
        const res = await fetch('api/branding_api.php', { method: 'POST', body: formData });
        const d = await res.json();
        if (d.success) {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Globally Replaced';
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Global Branding';
                loadDashboardData();
            }, 2000);
        }
    } catch (err) { alert('Error updating branding'); btn.innerHTML = 'Error!'; }
});

// Settings Form Submit
document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Writing HTML...';
    
    const data = {
        support_email: document.getElementById('setSupportEmail').value,
        footer_text: document.getElementById('setFooterText').value
    };
    
    try {
        const res = await fetch('api/settings_api.php', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
        const d = await res.json();
        if (d.success) {
            btn.innerHTML = '<i class="fa-solid fa-check text-green-400"></i> Nodes Overwritten';
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-screwdriver-wrench"></i> Overwrite HTML Nodes';
                loadDashboardData();
            }, 2000);
        }
    } catch { alert('Update Failed'); btn.innerHTML = 'Error!'; }
});

// Products Logic
async function loadProductsTable() {
    try {
        const res = await fetch('api/products_api.php?action=list');
        const data = await res.json();
        if (data.success) {
            allProducts = data.data;
            renderProducts(allProducts);
        }
    } catch (e) { console.error(e); }
}

document.getElementById('prodSearch').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.id.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
    );
    renderProducts(filtered);
});

function renderProducts(products) {
    const t = document.getElementById('productsTableBody');
    t.innerHTML = products.map(p => `
        <tr class="hover:bg-darkBorder/20 transition group">
            <td class="px-6 py-4 flex items-center gap-4">
                <img src="../user/${p.image1}?t=${Date.now()}" class="w-10 h-12 object-cover rounded bg-darkBg border border-darkBorder">
                <div>
                    <span class="block font-semibold text-gray-200">${p.name}</span>
                    <span class="text-xs text-gray-500">${p.id}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-gray-400">${p.category}</td>
            <td class="px-6 py-4">
                <span class="text-white font-medium">৳${p.price.toFixed(2)}</span>
                ${p.originalPrice ? `<br><span class="text-xs text-gray-500 line-through">৳${p.originalPrice.toFixed(2)}</span>` : ''}
            </td>
            <td class="px-6 py-4">
                <div class="flex gap-2 text-[10px] font-bold uppercase">
                    ${p.isNew ? '<span class="bg-brandAccent/20 text-brandAccent px-2 py-0.5 rounded border border-brandAccent/30">New</span>' : ''}
                    ${p.isFlashSale ? '<span class="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded border border-orange-500/30">Sale</span>' : ''}
                    ${p.isSoldOut ? '<span class="bg-red-500/20 text-red-500 px-2 py-0.5 rounded border border-red-500/30">Sold Out</span>' : ''}
                </div>
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick='editProduct(${JSON.stringify(p).replace(/'/g, "&apos;")})' class="text-gray-400 hover:text-white" title="Edit JSON">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="deleteProduct('${p.id}')" class="text-red-400 hover:text-red-300" title="Smart Delete Data & Image">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Modal Logic
const prodModal = document.getElementById('productModal');
let currentAction = 'add';

document.getElementById('addProdBtn').addEventListener('click', () => {
    currentAction = 'add';
    document.getElementById('productForm').reset();
    document.getElementById('prodId').value = '';
    document.getElementById('prodModalTitle').innerText = 'Add New Product in JSON';
    showProductModal();
});

window.editProduct = (p) => {
    currentAction = 'update';
    document.getElementById('prodId').value = p.id;
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodOrigPrice').value = p.originalPrice || '';
    document.getElementById('prodCat').value = p.category;
    document.getElementById('prodFeat').value = p.feature || '';
    document.getElementById('prodIsNew').checked = p.isNew;
    document.getElementById('prodIsSale').checked = p.isFlashSale;
    if (document.getElementById('prodIsSoldOut')) document.getElementById('prodIsSoldOut').checked = p.isSoldOut;
    
    // Check assigned sections
    const checkboxes = document.querySelectorAll('#productSectionsContainer input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = (p.sections && p.sections.includes(parseInt(cb.value) || cb.value));
    });
    
    document.getElementById('prodImage').value = ''; // Reset file input
    document.getElementById('prodModalTitle').innerText = 'Edit Product';
    showProductModal();
};

function showProductModal() {
    prodModal.classList.remove('opacity-0', 'pointer-events-none');
}
window.closeProductModal = () => {
    prodModal.classList.add('opacity-0', 'pointer-events-none');
};

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const ogHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Wait...';
    
    try {
        const formData = new FormData(e.target);
        const res = await fetch(`api/products_api.php?action=${currentAction}`, {
            method: 'POST',
            body: formData
        });
        const d = await res.json();
        if (d.success) {
            closeProductModal();
            loadProductsTable();
        } else { alert(d.message); }
    } catch { alert('Error processing JSON file rewrite.'); }
    finally { btn.innerHTML = ogHtml; }
});

window.deleteProduct = async (id) => {
    if (!confirm("Are you sure? This will remove the object from products.json AND physically unlink() the image from user/assets/ folder.")) return;
    try {
        const res = await fetch('api/products_api.php?action=delete', {
            method: 'DELETE',
            body: JSON.stringify({id})
        });
        await res.json();
        loadProductsTable();
    } catch { alert('API Deletion Failed'); }
};

// User DB Logic
async function loadUsers() {
    try {
        const res = await fetch('api/users_api.php');
        const d = await res.json();
        if (d.success) {
            allUsers = d.data;
            renderUsers(allUsers);
        }
    } catch (e) { console.error(e); }
}

function renderUsers(users) {
    const t = document.getElementById('usersTableBody');
    if (users.length > 0) {
        t.innerHTML = users.map(u => `
            <tr class="hover:bg-darkBorder/20 border-b border-darkBorder/30">
                <td class="px-6 py-4 text-xs font-mono text-gray-500">${u.id}</td>
                <td class="px-6 py-4 text-gray-300 font-medium">${u.name}</td>
                <td class="px-6 py-4 text-gray-400">${u.email}</td>
                <td class="px-6 py-4">
                    <select onchange="updateUserStatus('${u.id}', this.value)" class="bg-transparent border border-darkBorder text-xs py-1 px-2 rounded ${u.status === 'Active' ? 'text-green-400 focus:border-green-500' : 'text-red-400 focus:border-red-500'}">
                        <option value="Active" ${u.status === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="Banned" ${u.status === 'Banned' ? 'selected' : ''}>Banned</option>
                    </select>
                </td>
                <td class="px-6 py-4 text-right">
                    <button onclick="viewUserDetail('${u.id}')" class="text-brandAccent hover:underline text-xs font-bold">
                        View Profile
                    </button>
                </td>
            </tr>
        `).join('');
    } else {
        t.innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">No users found matching your search.</td></tr>`;
    }
}

document.getElementById('userSearch').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allUsers.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) || 
        u.id.toString().includes(q)
    );
    renderUsers(filtered);
});

window.updateUserStatus = async (id, status) => {
    try {
        await fetch('api/users_api.php?action=status', {
            method: 'POST',
            body: JSON.stringify({id, status})
        });
    } catch { alert('Update Failed'); }
};

async function viewUserDetail(id) {
    try {
        const res = await fetch(`api/users_api.php?action=details&id=${id}`);
        const d = await res.json();
        if (d.success) {
            const u = d.data;
            document.getElementById('userDetailName').innerText = u.name;
            document.getElementById('userDetailEmail').innerText = u.email;
            document.getElementById('userDetailPhone').innerText = u.phone || 'N/A';
            document.getElementById('userDetailJoined').innerText = new Date(u.created_at).toLocaleDateString();
            
            const badge = document.getElementById('userDetailStatusBadge');
            badge.innerText = u.status;
            badge.className = `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`;

            document.getElementById('userDetailOrderCount').innerText = `${u.order_count} Orders`;
            
            const ordersBody = document.getElementById('userDetailOrdersBody');
            if (u.orders && u.orders.length > 0) {
                ordersBody.innerHTML = u.orders.map(o => `
                    <tr class="hover:bg-brandAccent/5 transition-colors">
                        <td class="px-4 py-3 font-mono text-xs">#${o.id}</td>
                        <td class="px-4 py-3 font-bold">৳${parseFloat(o.total).toFixed(2)}</td>
                        <td class="px-4 py-3 text-xs text-gray-500">${new Date(o.created_at).toLocaleDateString()}</td>
                        <td class="px-4 py-3">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${o.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}">
                                ${o.status}
                            </span>
                        </td>
                    </tr>
                `).join('');
            } else {
                ordersBody.innerHTML = '<tr><td colspan="4" class="px-4 py-6 text-center text-gray-500 text-xs">No orders found for this user.</td></tr>';
            }

            const modal = document.getElementById('userDetailModal');
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.querySelector('.card').classList.remove('scale-95');
        }
    } catch (e) {
        console.error("Error loading user details", e);
    }
}

window.closeUserDetailModal = () => {
    const modal = document.getElementById('userDetailModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.querySelector('.card').classList.add('scale-95');
};

// Orders DB Logic
async function loadOrders() {
    try {
        const res = await fetch('api/orders_api.php');
        const d = await res.json();
        if (d.success) {
            allOrders = d.data;
            renderOrders(allOrders);
        }
    } catch (e) { console.error(e); }
}

function renderOrders(orders) {
    const t = document.getElementById('ordersTableBody');
    if (orders.length > 0) {
        t.innerHTML = orders.map(o => `
            <tr class="hover:bg-darkBorder/20 border-b border-darkBorder/30">
                <td class="px-6 py-4 text-xs font-mono text-gray-500">#${o.id}</td>
                <td class="px-6 py-4">
                    <p class="font-bold text-gray-200">${o.customer_name || 'N/A'}</p>
                    <p class="text-[10px] text-gray-400 mt-1"><i class="fa-solid fa-phone mr-1"></i> ${o.customer_phone || ''}</p>
                </td>
                <td class="px-6 py-4 font-bold text-gray-200">৳${parseFloat(o.total || 0).toFixed(2)}</td>
                <td class="px-6 py-4 text-xs text-gray-400">${new Date(o.created_at).toLocaleString()}</td>
                <td class="px-6 py-4">
                    <select onchange="updateOrderStatus('${o.id}', this.value)" class="bg-darkBg border border-darkBorder text-xs py-1 px-2 rounded">
                        <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
                <td class="px-6 py-4 text-right">
                    <button onclick="viewOrder('${o.id}')" class="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1 rounded transition text-xs border border-blue-600/30">
                        <i class="fa-solid fa-eye mr-1"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
    } else {
        t.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">No orders found matching your search.</td></tr>`;
    }
}

window.viewOrder = (id) => {
    const order = allOrders.find(o => o.id === id);
    if (!order) return;

    document.getElementById('orderModalTitle').innerText = 'Order #' + order.id;
    
    // Customer Info
    document.getElementById('orderCustomerInfo').innerHTML = `
        <p><strong class="text-white">Name:</strong> ${order.customer_name || 'N/A'}</p>
        <p><strong class="text-white">Phone:</strong> ${order.customer_phone || 'N/A'}</p>
        <p><strong class="text-white">Division:</strong> ${order.division || 'N/A'}</p>
        <p><strong class="text-white">District:</strong> ${order.district || 'N/A'}</p>
        <p><strong class="text-white">Address:</strong> ${order.city || 'N/A'}</p>
        <p><strong class="text-white">Zip Code:</strong> ${order.zip || 'N/A'}</p>
    `;

    // Summary Info
    document.getElementById('orderSummaryInfo').innerHTML = `
        <p><strong class="text-white">Subtotal:</strong> ৳${parseFloat(order.subtotal || 0).toFixed(2)}</p>
        <p><strong class="text-white">Delivery Charge:</strong> ৳${parseFloat(order.delivery_charge || 0).toFixed(2)}</p>
        <p class="text-lg font-bold text-brandAccent mt-2 pt-2 border-t border-darkBorder"><strong class="text-white text-sm font-normal">Total:</strong> ৳${parseFloat(order.total || 0).toFixed(2)}</p>
        <p class="mt-2"><strong class="text-white">Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
        <p><strong class="text-white">Status:</strong> <span class="px-2 py-0.5 rounded bg-darkBorder text-xs ml-2">${order.status}</span></p>
    `;

    // Items
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
    
    if (items.length > 0) {
        document.getElementById('orderItemsTableBody').innerHTML = items.map(item => `
            <tr class="hover:bg-darkBorder/10">
                <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                        <img src="${item.image1 || '../user/assets/logo.png'}" class="w-10 h-10 object-cover rounded border border-darkBorder">
                        <div>
                            <p class="font-bold text-gray-200 text-xs">${item.name}</p>
                            <p class="text-[10px] text-gray-500">Size: ${item.size || 'N/A'}</p>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-3 text-center text-xs">${item.quantity}</td>
                <td class="px-4 py-3 text-right text-xs">৳${parseFloat(item.price || 0).toFixed(2)}</td>
                <td class="px-4 py-3 text-right text-xs font-bold text-brandAccent">৳${parseFloat((item.price || 0) * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');
    } else {
        document.getElementById('orderItemsTableBody').innerHTML = `<tr><td colspan="4" class="px-4 py-6 text-center text-gray-500 text-xs">No item data found for this order.</td></tr>`;
    }

    // Show modal
    const modal = document.getElementById('orderDetailModal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
}

window.closeOrderModal = () => {
    document.getElementById('orderDetailModal').classList.add('opacity-0', 'pointer-events-none');
}

document.getElementById('orderSearch').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allOrders.filter(o => 
        o.id.toString().includes(q) || 
        o.status.toLowerCase().includes(q)
    );
    renderOrders(filtered);
});

window.updateOrderStatus = async (id, status) => {
    try {
        await fetch('api/orders_api.php?action=status', {
            method: 'POST',
            body: JSON.stringify({id, status})
        });
    } catch { alert('Update Failed'); }
};

// ==========================================
// Phase 2 & 3: Dynamic CMS (Menus & Texts)
// ==========================================

async function loadCmsData() {
    try {
        const resMenu = await fetch('api/cms_api.php?action=get_menus');
        const dMenu = await resMenu.json();
        renderCmsMenus(dMenu.data || []);

        const resText = await fetch('api/cms_api.php?action=get_texts');
        const dText = await resText.json();
        renderCmsTexts(dText.data || []);
    } catch (e) { console.error('Error loading CMS data:', e); }
}

function renderCmsMenus(menus) {
    const tbody = document.getElementById('cmsMenuTableBody');
    if (menus.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No menus configured.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = menus.map(m => `
        <tr class="hover:bg-darkBorder/20">
            <td class="px-6 py-4 font-medium text-white">${m.menu_title}</td>
            <td class="px-6 py-4 text-xs font-mono text-gray-400 opacity-70">${m.menu_location}</td>
            <td class="px-6 py-4 text-gray-400 text-xs truncate max-w-[150px]">${m.link_target}</td>
            <td class="px-6 py-4 text-right whitespace-nowrap">
                <button onclick='editMenu(${JSON.stringify(m).replace(/'/g, "&apos;")})' class="text-gray-400 hover:text-white mr-3"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteMenu('${m.id}')" class="text-red-400 hover:text-red-300"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderCmsTexts(texts) {
    const tbody = document.getElementById('cmsTextTableBody');
    if (texts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No dynamic texts configured.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = texts.map(t => `
        <tr class="hover:bg-darkBorder/20">
            <td class="px-6 py-4 text-xs font-mono text-brandAccent">${t.text_key}</td>
            <td class="px-6 py-4 text-gray-300 text-xs max-w-xs truncate">${t.text_value}</td>
            <td class="px-6 py-4 text-right">
                <button onclick='editText(${JSON.stringify(t).replace(/'/g, "&apos;")})' class="text-gray-400 hover:text-white mr-3"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteText('${t.text_key}')" class="text-red-400 hover:text-red-300"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Menu Modal Controls
window.openMenuModal = () => {
    document.getElementById('cmsMenuForm').reset();
    document.getElementById('cmsMenuId').value = '';
    document.getElementById('cmsMenuModal').classList.remove('opacity-0', 'pointer-events-none');
};
window.closeMenuModal = () => document.getElementById('cmsMenuModal').classList.add('opacity-0', 'pointer-events-none');

window.editMenu = (m) => {
    document.getElementById('cmsMenuId').value = m.id;
    document.getElementById('cmsMenuTitle').value = m.menu_title;
    document.getElementById('cmsMenuLocation').value = m.menu_location;
    document.getElementById('cmsMenuType').value = m.link_type;
    document.getElementById('cmsMenuTarget').value = m.link_target;
    document.getElementById('cmsMenuModal').classList.remove('opacity-0', 'pointer-events-none');
};

document.getElementById('cmsMenuForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = 'Saving...';
    
    const payload = {
        id: document.getElementById('cmsMenuId').value || null,
        menu_title: document.getElementById('cmsMenuTitle').value,
        menu_location: document.getElementById('cmsMenuLocation').value,
        link_type: document.getElementById('cmsMenuType').value,
        link_target: document.getElementById('cmsMenuTarget').value
    };
    
    try {
        const res = await fetch('api/cms_api.php?action=save_menu', { method: 'POST', body: JSON.stringify(payload) });
        if((await res.json()).success) { closeMenuModal(); loadCmsData(); }
    } catch { alert('API Error'); } finally { btn.innerHTML = 'Save Menu'; }
});

window.deleteMenu = async (id) => {
    if(!confirm('Delete this menu?')) return;
    try {
        await fetch('api/cms_api.php?action=delete_menu', { method: 'POST', body: JSON.stringify({id}) });
        loadCmsData();
    } catch { alert('API Error'); }
};

// Text Modal Controls
window.openTextModal = () => {
    document.getElementById('cmsTextForm').reset();
    document.getElementById('cmsTextKey').readOnly = false;
    document.getElementById('cmsTextModal').classList.remove('opacity-0', 'pointer-events-none');
};
window.closeTextModal = () => document.getElementById('cmsTextModal').classList.add('opacity-0', 'pointer-events-none');

window.editText = (t) => {
    document.getElementById('cmsTextKey').value = t.text_key;
    document.getElementById('cmsTextKey').readOnly = true; // Lock key during edit
    document.getElementById('cmsTextValue').value = t.text_value;
    document.getElementById('cmsTextModal').classList.remove('opacity-0', 'pointer-events-none');
};

document.getElementById('cmsTextForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = 'Updating...';
    
    const payload = {
        text_key: document.getElementById('cmsTextKey').value,
        text_value: document.getElementById('cmsTextValue').value
    };
    
    try {
        const res = await fetch('api/cms_api.php?action=save_text', { method: 'POST', body: JSON.stringify(payload) });
        if((await res.json()).success) { closeTextModal(); loadCmsData(); }
    } catch { alert('API Error'); } finally { btn.innerHTML = 'Update Text Globally'; }
});

window.deleteText = async (key) => {
    if(!confirm('Delete this text mapping?')) return;
    try {
        await fetch('api/cms_api.php?action=delete_text', { method: 'POST', body: JSON.stringify({text_key: key}) });
        loadCmsData();
    } catch { alert('API Error'); }
};

// Admin Auth Changes
document.getElementById('adminAuthForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const btn = e.target.querySelector('button');
    
    btn.innerHTML = 'Updating Security...';
    try {
        const res = await fetch('api/settings_api.php?action=update_admin', {
            method: 'POST',
            body: JSON.stringify({username, password})
        });
        const d = await res.json();
        if(d.success) {
            alert('Admin credentials updated successfully. Please login again if you changed the password.');
            if(password) logout();
        } else {
            alert(d.message);
        }
    } catch { alert('Failed to update admin details'); }
    finally { btn.innerHTML = '<i class="fa-solid fa-lock"></i> Update Access'; }
});

// Load SMTP Settings
async function loadSmtpSettings() {
    try {
        const res = await fetch('api/smtp_api.php');
        const d = await res.json();
        if (d.success && d.data) {
            document.getElementById('smtpSenderEmail').value = d.data.sender_email;
            document.getElementById('smtpPassword').value = d.data.smtp_password;
            document.getElementById('smtpReceiverEmail').value = d.data.receiver_email;
        }
    } catch (e) { console.error('Error loading SMTP data', e); }
}

// SMTP Settings Form Submit
document.getElementById('smtpSettingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    
    const payload = {
        sender_email: document.getElementById('smtpSenderEmail').value,
        smtp_password: document.getElementById('smtpPassword').value,
        receiver_email: document.getElementById('smtpReceiverEmail').value
    };
    
    try {
        const res = await fetch('api/smtp_api.php', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });
        const d = await res.json();
        if (d.success) {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved';
            setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-save"></i> Save SMTP Settings'; }, 2000);
        } else {
            alert(d.message || 'Failed to save settings');
            btn.innerHTML = '<i class="fa-solid fa-save"></i> Save SMTP Settings';
        }
    } catch { 
        alert('Update Failed'); 
        btn.innerHTML = '<i class="fa-solid fa-save"></i> Save SMTP Settings';
    }
});

// Shop CMS Logic
async function loadShopCMSData() {
    try {
        const res = await fetch('api/cms_api.php?action=get_shop_data');
        const d = await res.json();
        if (d.success) {
            renderShopCategories(d.categories);
            renderShopSortOptions(d.sort_options);
            renderShopFeatures(d.features);
        }
    } catch (e) { console.error(e); }
}

function renderShopCategories(cats) {
    const tbody = document.getElementById('shopCatTableBody');
    const prodCatSelect = document.getElementById('prodCat');
    
    const html = (cats || []).map(c => `
        <tr class="hover:bg-darkBorder/20 transition group">
            <td class="px-6 py-4 font-medium text-white">${c.name}</td>
            <td class="px-6 py-4 text-xs font-mono text-gray-400 opacity-70">${c.value}</td>
            <td class="px-6 py-4 text-right whitespace-nowrap">
                <button onclick='editShopCat(${JSON.stringify(c).replace(/'/g, "&apos;")})' class="text-gray-400 hover:text-white mr-3"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteShopCat('${c.id}')" class="text-red-400 hover:text-red-300"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = html;
    
    // Update Product Modal Dropdown
    if (prodCatSelect) {
        prodCatSelect.innerHTML = (cats || []).map(c => `<option value="${c.value}">${c.name}</option>`).join('');
    }
}

function renderShopFeatures(feats) {
    const tbody = document.getElementById('shopFeatTableBody');
    const prodFeatSelect = document.getElementById('prodFeat');
    
    const html = (feats || []).map(f => `
        <tr class="hover:bg-darkBorder/20 transition group">
            <td class="px-6 py-4 font-medium text-white">${f.name}</td>
            <td class="px-6 py-4 text-xs font-mono text-gray-400 opacity-70">${f.value}</td>
            <td class="px-6 py-4 text-right whitespace-nowrap">
                <button onclick='editShopFeat(${JSON.stringify(f).replace(/'/g, "&apos;")})' class="text-gray-400 hover:text-white mr-3"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteShopFeat('${f.id}')" class="text-red-400 hover:text-red-300"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = html;
    
    // Update Product Modal Dropdown
    if (prodFeatSelect) {
        prodFeatSelect.innerHTML = '<option value="">None</option>' + (feats || []).map(f => `<option value="${f.value}">${f.name}</option>`).join('');
    }
}

function renderShopSortOptions(sorts) {
    const tbody = document.getElementById('shopSortTableBody');
    tbody.innerHTML = (sorts || []).map(s => `
        <tr class="hover:bg-darkBorder/20 transition group">
            <td class="px-6 py-4 font-medium text-white">${s.name}</td>
            <td class="px-6 py-4 text-xs font-mono text-gray-400 opacity-70">${s.value}</td>
            <td class="px-6 py-4 text-right whitespace-nowrap">
                <button onclick='editShopSort(${JSON.stringify(s).replace(/'/g, "&apos;")})' class="text-gray-400 hover:text-white mr-3"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteShopSort('${s.id}')" class="text-red-400 hover:text-red-300"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Category Modals
window.openShopCatModal = () => {
    document.getElementById('shopCatForm').reset();
    document.getElementById('shopCatId').value = '';
    document.getElementById('shopCatModal').classList.remove('opacity-0', 'pointer-events-none');
}
window.closeShopCatModal = () => document.getElementById('shopCatModal').classList.add('opacity-0', 'pointer-events-none');

window.editShopCat = (c) => {
    document.getElementById('shopCatId').value = c.id;
    document.getElementById('shopCatName').value = c.name;
    document.getElementById('shopCatValue').value = c.value;
    document.getElementById('shopCatModal').classList.remove('opacity-0', 'pointer-events-none');
}

document.getElementById('shopCatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        id: document.getElementById('shopCatId').value || null,
        name: document.getElementById('shopCatName').value,
        value: document.getElementById('shopCatValue').value
    };
    try {
        const res = await fetch('api/cms_api.php?action=save_shop_category', { method: 'POST', body: JSON.stringify(payload) });
        if((await res.json()).success) { closeShopCatModal(); loadShopCMSData(); }
    } catch { alert('API Error'); }
});

window.deleteShopCat = async (id) => {
    if(!confirm('Delete this category?')) return;
    try {
        await fetch('api/cms_api.php?action=delete_shop_category', { method: 'POST', body: JSON.stringify({id}) });
        loadShopCMSData();
    } catch { alert('API Error'); }
}

// Sort Modals
window.openShopSortModal = () => {
    document.getElementById('shopSortForm').reset();
    document.getElementById('shopSortId').value = '';
    document.getElementById('shopSortModal').classList.remove('opacity-0', 'pointer-events-none');
}
window.closeShopSortModal = () => document.getElementById('shopSortModal').classList.add('opacity-0', 'pointer-events-none');

window.editShopSort = (s) => {
    document.getElementById('shopSortId').value = s.id;
    document.getElementById('shopSortName').value = s.name;
    document.getElementById('shopSortValue').value = s.value;
    document.getElementById('shopSortModal').classList.remove('opacity-0', 'pointer-events-none');
}

document.getElementById('shopSortForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        id: document.getElementById('shopSortId').value || null,
        name: document.getElementById('shopSortName').value,
        value: document.getElementById('shopSortValue').value
    };
    try {
        const res = await fetch('api/cms_api.php?action=save_shop_sort', { method: 'POST', body: JSON.stringify(payload) });
        if((await res.json()).success) { closeShopSortModal(); loadShopCMSData(); }
    } catch { alert('API Error'); }
});

window.deleteShopSort = async (id) => {
    if(!confirm('Delete this sort option?')) return;
    try {
        await fetch('api/cms_api.php?action=delete_shop_sort', { method: 'POST', body: JSON.stringify({id}) });
        loadShopCMSData();
    } catch { alert('API Error'); }
}
// Feature Modals
window.openShopFeatModal = () => {
    document.getElementById('shopFeatForm').reset();
    document.getElementById('shopFeatId').value = '';
    document.getElementById('shopFeatModal').classList.remove('opacity-0', 'pointer-events-none');
}
window.closeShopFeatModal = () => document.getElementById('shopFeatModal').classList.add('opacity-0', 'pointer-events-none');

window.editShopFeat = (f) => {
    document.getElementById('shopFeatId').value = f.id;
    document.getElementById('shopFeatName').value = f.name;
    document.getElementById('shopFeatValue').value = f.value;
    document.getElementById('shopFeatModal').classList.remove('opacity-0', 'pointer-events-none');
}

document.getElementById('shopFeatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        id: document.getElementById('shopFeatId').value || null,
        name: document.getElementById('shopFeatName').value,
        value: document.getElementById('shopFeatValue').value
    };
    try {
        const res = await fetch('api/cms_api.php?action=save_shop_feature', { method: 'POST', body: JSON.stringify(payload) });
        if((await res.json()).success) { closeShopFeatModal(); loadShopCMSData(); }
    } catch { alert('API Error'); }
});

window.deleteShopFeat = async (id) => {
    if(!confirm('Delete this feature?')) return;
    try {
        await fetch('api/cms_api.php?action=delete_shop_feature', { method: 'POST', body: JSON.stringify({id}) });
        loadShopCMSData();
    } catch { alert('API Error'); }
}

// Homepage Sections Logic
async function loadSectionsData() {
    const defaultMockSections = [
        {id: 1, section_name: 'Curated Shop'},
        {id: 2, section_name: 'New Arrivals'},
        {id: 3, section_name: 'Trending'},
        {id: 4, section_name: 'Recommended For You'}
    ];
    
    try {
        const res = await fetch('api/sections_crud.php?action=list');
        const d = await res.json();
        
        if (d.success && d.data && d.data.length > 0) {
            allSections = d.data;
        } else {
            // DB connection failed or returned empty table. Use defaults.
            allSections = defaultMockSections;
        }
    } catch (e) { 
        console.error('Error loading sections - likely local DB driver issue. Using fallback.'); 
        allSections = defaultMockSections;
    } finally {
        renderSectionsTable();
        renderProductSectionCheckboxes();
    }
}

function renderSectionsTable() {
    const tbody = document.getElementById('sectionsTableBody');
    if(tbody) {
        tbody.innerHTML = allSections.map(s => `
            <tr class="hover:bg-darkBorder/20 transition group">
                <td class="px-6 py-4 font-medium text-white">${s.section_name}</td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                    <button onclick='editSection(${JSON.stringify(s).replace(/'/g, "&apos;")})' class="text-gray-400 hover:text-white mr-3"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="deleteSection('${s.id}')" class="text-red-400 hover:text-red-300"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }
}

function renderProductSectionCheckboxes() {
    const container = document.getElementById('productSectionsContainer');
    if(container) {
        container.innerHTML = allSections.map(s => `
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="sections[]" value="${s.id}" class="w-4 h-4 rounded text-brandAccent accent-brandAccent bg-darkCard border-darkBorder">
                <span class="text-sm truncate" title="${s.section_name}">${s.section_name}</span>
            </label>
        `).join('');
    }
}

window.openSectionModal = () => {
    document.getElementById('sectionForm').reset();
    document.getElementById('sectionId').value = '';
    document.getElementById('sectionModalTitle').innerText = 'Add Section';
    document.getElementById('sectionModal').classList.remove('opacity-0', 'pointer-events-none');
}
window.closeSectionModal = () => document.getElementById('sectionModal').classList.add('opacity-0', 'pointer-events-none');

window.editSection = (s) => {
    document.getElementById('sectionId').value = s.id;
    document.getElementById('sectionName').value = s.section_name;
    document.getElementById('sectionModalTitle').innerText = 'Edit Section';
    document.getElementById('sectionModal').classList.remove('opacity-0', 'pointer-events-none');
}

document.getElementById('sectionForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('sectionId').value;
    const action = id ? 'update' : 'add';
    const payload = {
        id: id || null,
        section_name: document.getElementById('sectionName').value
    };
    try {
        const res = await fetch(`api/sections_crud.php?action=${action}`, { method: 'POST', body: JSON.stringify(payload) });
        if((await res.json()).success) { closeSectionModal(); loadSectionsData(); }
    } catch { alert('API Error'); }
});

window.deleteSection = async (id) => {
    if(!confirm('Delete this section? Products assigned to it will just lose their mapping.')) return;
    try {
        await fetch('api/sections_crud.php?action=delete', { method: 'POST', body: JSON.stringify({id}) });
        loadSectionsData();
    } catch { alert('API Error'); }
}
