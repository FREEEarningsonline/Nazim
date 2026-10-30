/**
 * ==============================================================================
 * SNAPDEALZ - ADMIN DASHBOARD SCRIPT (GOOGLE SHEETS INTEGRATED)
 * ==============================================================================
 */

// ⚠️ YAHAN APNA GOOGLE APPS SCRIPT WEBHOOK URL DALEIN ⚠️
const GOOGLE_SHEET_WEBHOOK = 'YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE';
const DEFAULT_ADMIN_PIN = '1234';
const AUTH_KEY = 'snapdealz_admin_auth';

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  // Pin Form Submit
  document.getElementById('adminPinForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pin = document.getElementById('adminPinInput').value;
    if (pin === DEFAULT_ADMIN_PIN) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      checkAuth();
    } else {
      document.getElementById('adminPinError').classList.remove('d-none');
    }
  });

  // Logout / Lock
  document.getElementById('adminLockBtn')?.addEventListener('click', lockDashboard);
  document.getElementById('adminLockBtnMobile')?.addEventListener('click', lockDashboard);

  // Tabs Switching
  document.getElementById('tabOrdersBtn')?.addEventListener('click', (e) => switchTab('orders', e.target));
  document.getElementById('tabProductsBtn')?.addEventListener('click', (e) => switchTab('products', e.target));
  
  // Refresh Button
  document.getElementById('adminRefreshBtn')?.addEventListener('click', () => {
    fetchOrders();
    fetchAdminProducts();
    showToast('Data Synced with Google Sheets!');
  });

  // Add Product Form
  document.getElementById('adminAddNewProductForm')?.addEventListener('submit', handleAddAdminProduct);
});

function lockDashboard() {
  sessionStorage.removeItem(AUTH_KEY);
  checkAuth();
}

function checkAuth() {
  const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true';
  if (isAuth) {
    document.getElementById('adminLoginGate').classList.add('d-none');
    document.getElementById('adminMainPortal').classList.remove('d-none');
    fetchOrders(); // Load orders on successful login
  } else {
    document.getElementById('adminLoginGate').classList.remove('d-none');
    document.getElementById('adminMainPortal').classList.add('d-none');
    document.getElementById('adminPinInput').value = '';
    document.getElementById('adminPinError').classList.add('d-none');
  }
}

function switchTab(tab, btnElement) {
  document.getElementById('tabOrdersBtn').classList.replace('btn-dark', 'btn-outline-dark');
  document.getElementById('tabOrdersBtn').classList.remove('text-warning');
  document.getElementById('tabProductsBtn').classList.replace('btn-dark', 'btn-outline-dark');
  document.getElementById('tabProductsBtn').classList.remove('text-warning');
  
  btnElement.classList.replace('btn-outline-dark', 'btn-dark');
  btnElement.classList.add('text-warning');

  document.getElementById('tabOrdersPane').classList.add('d-none');
  document.getElementById('tabProductsPane').classList.add('d-none');
  
  if (tab === 'orders') {
    document.getElementById('tabOrdersPane').classList.remove('d-none');
    fetchOrders();
  } else {
    document.getElementById('tabProductsPane').classList.remove('d-none');
    fetchAdminProducts();
  }
}

// ==========================================
// ORDERS MANAGEMENT (GOOGLE SHEETS)
// ==========================================
async function fetchOrders() {
  const tbody = document.getElementById('adminOrdersTableBody');
  tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4"><div class="spinner-border text-warning"></div></td></tr>';
  
  try {
    const res = await fetch(`${GOOGLE_SHEET_WEBHOOK}?action=GET_ORDERS`);
    const data = await res.json();
    
    if (data.orders && data.orders.length > 0) {
      tbody.innerHTML = data.orders.map(order => {
        let statusBadge = order.status === 'Delivered' ? 'bg-success' : (order.status === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark');
        return `
          <tr>
            <td class="fw-bold">${order.orderId}</td>
            <td class="small text-muted">${order.dateString}</td>
            <td>${order.customerName}<br><small>${order.email}</small></td>
            <td class="fw-bold">$${order.total}</td>
            <td><span class="badge bg-light text-dark border">${order.paymentMethod}</span></td>
            <td><span class="badge ${statusBadge}">${order.status}</span></td>
            <td>
              <select class="form-select form-select-sm d-inline-block w-auto" onchange="updateOrderStatus('${order.orderId}', this.value)">
                <option value="">Update...</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancel</option>
              </select>
            </td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No orders found in Sheet.</td></tr>';
    }
  } catch (error) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger py-4">Error connecting to Google Sheets.</td></tr>';
  }
}

async function updateOrderStatus(orderId, newStatus) {
  if(!newStatus) return;
  if(confirm(`Change status of ${orderId} to ${newStatus}?`)) {
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK, {
        method: 'POST',
        body: JSON.stringify({ action: 'UPDATE_STATUS', orderId: orderId, newStatus: newStatus })
      });
      showToast(`Order ${orderId} updated to ${newStatus}`);
      fetchOrders();
    } catch(err) {
      alert("Error updating order status.");
    }
  }
}

// ==========================================
// PRODUCTS & APPROVALS (GOOGLE SHEETS)
// ==========================================
async function fetchAdminProducts() {
  const tbody = document.getElementById('adminProductsTableBody');
  tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>';
  
  try {
    // We need a new action in Google script to fetch ALL products (Approved + Pending)
    const res = await fetch(`${GOOGLE_SHEET_WEBHOOK}?action=GET_ALL_PRODUCTS_ADMIN`);
    const data = await res.json();
    
    if (data.products && data.products.length > 0) {
      tbody.innerHTML = data.products.map(p => {
        let badge = p.status === 'Approved' ? 'bg-success' : 'bg-danger';
        let actionBtn = p.status === 'Pending' 
          ? `<button class="btn btn-sm btn-success rounded-pill px-3" onclick="approveProduct('${p.id}')">Approve</button>` 
          : `<span class="text-muted small"><i class="bi bi-check-circle-fill text-success"></i> Live</span>`;

        return `
          <tr>
            <td><img src="${p.images[0]}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;"></td>
            <td><strong>${p.name}</strong><br><small class="text-muted">By: ${p.seller || 'Admin'}</small></td>
            <td class="fw-bold">$${p.price}</td>
            <td>${p.category}</td>
            <td><span class="badge ${badge}">${p.status}</span></td>
            <td>${actionBtn}</td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No products found.</td></tr>';
    }
  } catch (error) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4">Error loading inventory.</td></tr>';
  }
}

async function approveProduct(prodId) {
  if(confirm(`Approve this product to go live on the store?`)) {
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK, {
        method: 'POST',
        body: JSON.stringify({ action: 'APPROVE_PRODUCT', prodId: prodId })
      });
      showToast(`Product Approved Successfully!`);
      fetchAdminProducts();
    } catch(err) {
      alert("Error approving product.");
    }
  }
}

async function handleAddAdminProduct(e) {
  e.preventDefault();
  const btn = document.getElementById('submitAddNewProdBtn');
  btn.innerHTML = 'Publishing...'; btn.disabled = true;

  const payload = {
    action: 'ADD_PRODUCT',
    sellerEmail: 'Admin',
    title: document.getElementById('newProdName').value,
    price: document.getElementById('newProdPrice').value,
    category: document.getElementById('newProdCategory').value,
    imageUrl: document.getElementById('newProdImageUrl').value,
    description: document.getElementById('newProdDesc').value,
    status: 'Approved' // Admin products go live directly
  };

  try {
    await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', body: JSON.stringify(payload) });
    showToast("Product Published Live!");
    document.getElementById('adminAddNewProductForm').reset();
    bootstrap.Modal.getInstance(document.getElementById('addNewProductModal')).hide();
    fetchAdminProducts();
  } catch(err) {
    alert("Failed to add product.");
  } finally {
    btn.innerHTML = 'Publish Live on Store'; btn.disabled = false;
  }
}

function showToast(message) {
  const container = document.querySelector('.snap-toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast show align-items-center text-bg-dark border-0 mb-2';
  toast.innerHTML = `<div class="d-flex"><div class="toast-body"><i class="bi bi-check-circle-fill text-warning me-2"></i>${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
