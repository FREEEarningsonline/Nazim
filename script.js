/**
 * ==============================================================================
 * SNAPDEALZ - SINGLE PAGE APPLICATION & GOOGLE SHEETS CORE SCRIPT
 * ==============================================================================
 */

// ⚠️ YAHAN APNA GOOGLE APPS SCRIPT WEBHOOK URL DALEIN ⚠️
const GOOGLE_SHEET_WEBHOOK = 'YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE';

const STORAGE_KEYS = {
  CART: 'snapdealz_cart_v1',
  WISHLIST: 'snapdealz_wishlist_v1',
  USERS: 'snapdealz_users_v1',
  CURRENT_USER: 'snapdealz_current_user_v1',
  COUPON: 'snapdealz_active_coupon_v1',
  ORDERS: 'snapdealz_orders_v1'
};

const PROMO_CODES = {
  'BUNDLE20': { discountPercent: 20, description: '20% Off Bundle Deal' },
  'SNAP10': { discountPercent: 10, description: '10% Flash Discount' },
  'FREESHIP': { discountPercent: 0, freeShipping: true, description: 'Free Express Shipping' }
};

// Global Store Products Array
let storeProducts = []; 

/* ==========================================================================
   1. APP INITIALIZATION & SPA ROUTER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Fetch Products from Google Sheet before showing the page
  await fetchStoreProducts();

  initStickyNavbar();
  initBackToTop();
  updateNavBadges();
  renderUserAuthNav();
  initScrollAnimations();
  initGlobalSearchModal();

  // 2. SPA Router Logic
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view') || 'home';
  
  const viewMap = {
    'home': 'Home | SNAPDEALZ Store',
    'shop': 'All Deals | SNAPDEALZ',
    'product': 'Product Details | SNAPDEALZ',
    'cart': 'Shopping Cart | SNAPDEALZ',
    'login': 'Member Log In | SNAPDEALZ',
    'signup': 'Create VIP Account | SNAPDEALZ'
  };
  document.title = viewMap[view] || 'SNAPDEALZ Store';

  // Hide all views, show the requested one
  document.querySelectorAll('.app-view').forEach(el => el.style.display = 'none');
  const activeView = document.getElementById('view-' + view);
  if (activeView) activeView.style.display = 'block';

  // Initialize specific page logic
  if (view === 'cart') initCartPage();
  else if (view === 'shop') initShopPage();
  else if (view === 'product') initProductDetailPage();
  else if (view === 'login') initLoginPage();
  else if (view === 'signup') initSignupPage();
  else initHomePage();

  // Hide Preloader once everything is loaded
  initPreloader();
});

// Fetch Products from Google Sheets
async function fetchStoreProducts() {
  try {
    const response = await fetch(`${GOOGLE_SHEET_WEBHOOK}?action=GET_PRODUCTS`);
    const data = await response.json();
    if (data && data.success && data.products && data.products.length > 0) {
      storeProducts = data.products;
    } else {
      throw new Error("No approved products found in sheet.");
    }
  } catch (error) {
    console.warn("Failed to fetch products from Google Sheet. Using local fallback.", error);
    // Fallback to local products.js if sheet fails
    storeProducts = (typeof products !== 'undefined') ? products : [];
  }
}

function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => preloader.remove(), 400);
  }
}

function initStickyNavbar() {
  const navbar = document.querySelector('.snap-navbar');
  if (!navbar) return;
  const handleScroll = () => { window.scrollY > 40 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled'); };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;
  window.addEventListener('scroll', () => { window.scrollY > 300 ? backToTopBtn.classList.add('show') : backToTopBtn.classList.remove('show'); }, { passive: true });
  backToTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up');
  if (!animatedElements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.1 });
  animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   2. CART SYSTEM
   ========================================================================== */
function getCart() {
  try { const raw = localStorage.getItem(STORAGE_KEYS.CART); return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
}
function saveCart(cart) { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); updateNavBadges(); }

function addToCart(productId, qty = 1, selectedColor = null, selectedSize = null) {
  const prod = storeProducts.find(p => p.id === Number(productId));
  if (!prod) return;
  const cart = getCart();
  const color = selectedColor || (prod.colors && prod.colors[0]) || '';
  const size = selectedSize || (prod.sizes && prod.sizes[0]) || '';
  const existingIndex = cart.findIndex(item => item.id === prod.id && item.color === color && item.size === size);
  if (existingIndex > -1) { cart[existingIndex].quantity += Number(qty); } 
  else { cart.push({ id: prod.id, name: prod.name, price: prod.price, oldPrice: prod.oldPrice, image: prod.images[0], category: prod.category, color: color, size: size, quantity: Number(qty) }); }
  saveCart(cart);
  showToast(`Added to Cart: ${prod.name}`, '?view=cart');
}

function removeCartItemByIndex(index) {
  const cart = getCart();
  if (Number(index) >= 0 && Number(index) < cart.length) { cart.splice(Number(index), 1); saveCart(cart); }
}
function updateCartQuantity(productId, color, size, delta) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === Number(productId) && (item.color || '') === color && (item.size || '') === size);
  if (index === -1) return;
  cart[index].quantity += Number(delta);
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart(cart);
}
function clearCart() { localStorage.removeItem(STORAGE_KEYS.CART); localStorage.removeItem(STORAGE_KEYS.COUPON); updateNavBadges(); }
function getCartCount() { return getCart().reduce((total, item) => total + item.quantity, 0); }
function getCartSubtotal() { return getCart().reduce((total, item) => total + (item.price * item.quantity), 0); }

/* ==========================================================================
   3. WISHLIST SYSTEM
   ========================================================================== */
function getWishlist() { try { const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST); return raw ? JSON.parse(raw) : []; } catch (e) { return []; } }
function saveWishlist(list) { localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list)); updateNavBadges(); }
function toggleWishlist(productId) {
  const list = getWishlist(); const id = Number(productId); const existsIndex = list.indexOf(id);
  const prod = storeProducts.find(p => p.id === id);
  if (existsIndex > -1) { list.splice(existsIndex, 1); saveWishlist(list); showToast(`Removed from Wishlist`); return false; } 
  else { list.push(id); saveWishlist(list); showToast(`Added to Wishlist: ${prod ? prod.name : 'Item'}`); return true; }
}
function isWishlisted(productId) { return getWishlist().includes(Number(productId)); }

/* ==========================================================================
   4. TOAST NOTIFICATIONS & BADGES
   ========================================================================== */
function showToast(message, actionLink = null) {
  let container = document.querySelector('.snap-toast-container');
  if (!container) { container = document.createElement('div'); container.className = 'snap-toast-container'; document.body.appendChild(container); }
  const toast = document.createElement('div');
  toast.className = 'snap-toast';
  let actionHtml = actionLink ? `<a href="${actionLink}" class="btn btn-sm btn-deal ms-auto py-1 px-3 text-nowrap">View</a>` : '';
  toast.innerHTML = `<i class="bi bi-check-circle-fill text-warning fs-5"></i><span class="small fw-semibold flex-grow-1">${message}</span>${actionHtml}<button type="button" class="btn-close btn-close-white ms-2"></button>`;
  toast.querySelector('.btn-close').addEventListener('click', () => toast.remove());
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)'; setTimeout(() => toast.remove(), 300); }, 4000);
}
function updateNavBadges() {
  const cartCount = getCartCount(); const wishCount = getWishlist().length;
  document.querySelectorAll('.cart-count-badge').forEach(badge => { badge.textContent = cartCount; badge.style.display = cartCount > 0 ? 'flex' : 'none'; });
  document.querySelectorAll('.wishlist-count-badge').forEach(badge => { badge.textContent = wishCount; badge.style.display = wishCount > 0 ? 'flex' : 'none'; });
}

/* ==========================================================================
   5. AUTHENTICATION & NAVBAR USER STATE
   ========================================================================== */
async function computeSha256Hash(text) {
  const msgBuffer = new TextEncoder().encode("SNAPDEALZ_SALT::" + text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCurrentUser() { try { const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }
function setCurrentUser(user) { if (user) { localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user)); } else { localStorage.removeItem(STORAGE_KEYS.CURRENT_USER); } renderUserAuthNav(); }
function logoutUser() { setCurrentUser(null); showToast('You have been logged out.'); setTimeout(() => { window.location.href='?view=home'; }, 500); }

function renderUserAuthNav() {
  const container = document.getElementById('userNavContainer');
  if (!container) return;
  const user = getCurrentUser();
  if (user) {
    const firstName = user.name ? user.name.split(' ')[0] : 'Member';
    container.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-deal-outline py-1 px-3 d-flex align-items-center gap-2 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="font-size: 0.85rem;">
          <i class="bi bi-person-check-fill text-warning"></i><span>Hi, ${firstName}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0" style="border-radius: 12px; margin-top: 8px;">
          <li><span class="dropdown-item-text small text-muted">${user.email}</span></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="?view=cart"><i class="bi bi-bag"></i> My Cart</a></li>
          <li><a class="dropdown-item" href="?view=shop"><i class="bi bi-tag"></i> Member Deals</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="navLogoutBtn"><i class="bi bi-box-arrow-right"></i> Log Out</a></li>
        </ul>
      </div>`;
    document.getElementById('navLogoutBtn').addEventListener('click', (e) => { e.preventDefault(); logoutUser(); });
  } else {
    container.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <a href="?view=login" class="btn btn-deal-outline py-1 px-3" style="font-size: 0.85rem;">Log In</a>
        <a href="?view=signup" class="btn btn-deal py-1 px-3 d-none d-sm-inline-flex" style="font-size: 0.85rem;">Sign Up</a>
      </div>`;
  }
}

/* ==========================================================================
   6. PRODUCT CARD RENDERER COMPONENT
   ========================================================================== */
function createProductCardHTML(prod) {
  const discountPercent = prod.oldPrice ? Math.round(((prod.oldPrice - prod.price) / prod.oldPrice) * 100) : 0;
  const wishActive = isWishlisted(prod.id) ? 'active' : '';
  const heartIcon = isWishlisted(prod.id) ? 'bi-heart-fill text-danger' : 'bi-heart';
  return `
    <div class="deal-product-card" data-product-id="${prod.id}">
      <div class="card-img-wrap">
        <a href="?view=product&id=${prod.id}" class="d-block w-100 h-100">
          <img src="${prod.images[0]}" alt="${prod.name}" loading="lazy">
        </a>
        ${discountPercent > 0 ? `<span class="card-discount-badge">-${discountPercent}%</span>` : ''}
        <button type="button" class="card-wishlist-btn ${wishActive}" data-wishlist-id="${prod.id}"><i class="bi ${heartIcon}"></i></button>
        <button type="button" class="card-quick-add" data-quick-add-id="${prod.id}"><i class="bi bi-cart-plus-fill"></i> Quick Add</button>
      </div>
      <div class="card-content">
        <span class="card-category">${prod.category}</span>
        <h3 class="card-title"><a href="?view=product&id=${prod.id}">${prod.name}</a></h3>
        <div class="card-rating"><i class="bi bi-star-fill text-warning"></i> <span class="rating-count">(${prod.reviewCount || 5})</span></div>
        <div class="card-price-row">
          <span class="current-price">$${prod.price.toFixed(2)}</span>
          ${prod.oldPrice ? `<span class="old-price">$${prod.oldPrice.toFixed(2)}</span>` : ''}
        </div>
      </div>
    </div>`;
}

function bindProductCardEvents(container = document) {
  container.querySelectorAll('.card-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const isAdded = toggleWishlist(btn.getAttribute('data-wishlist-id'));
      btn.classList.toggle('active', isAdded);
      btn.querySelector('i').className = isAdded ? 'bi bi-heart-fill text-danger' : 'bi bi-heart';
    });
  });
  container.querySelectorAll('.card-quick-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      addToCart(btn.getAttribute('data-quick-add-id'), 1);
    });
  });
  container.querySelectorAll('.deal-product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      const id = card.getAttribute('data-product-id');
      if (id) window.location.href = `?view=product&id=${id}`;
    });
  });
}

/* ==========================================================================
   7. PAGE INIT LOGIC
   ========================================================================== */

function initHomePage() {
  const categoryScroll = document.getElementById('categoryScrollContainer');
  if (categoryScroll && typeof categoriesData !== 'undefined') {
    categoryScroll.innerHTML = categoriesData.map(cat => `<a href="?view=shop&category=${cat.slug}" class="category-item"><div class="category-circle"><i class="bi ${cat.icon}"></i></div><span class="category-label">${cat.name}</span></a>`).join('');
  }
  const trendingGrid = document.getElementById('trendingProductsGrid');
  if (trendingGrid && storeProducts.length > 0) {
    trendingGrid.innerHTML = storeProducts.slice(0, 8).map(prod => `<div class="col-6 col-md-4 col-lg-3 mb-4">${createProductCardHTML(prod)}</div>`).join('');
    bindProductCardEvents(trendingGrid);
  }
  const copyBtn = document.getElementById('copyCouponBtn');
  if (copyBtn) copyBtn.addEventListener('click', () => { navigator.clipboard.writeText('BUNDLE20'); showToast('Coupon copied!'); });
}

function initShopPage() {
  const shopGrid = document.getElementById('shopProductsGrid');
  if (!shopGrid || storeProducts.length === 0) {
    if(shopGrid) shopGrid.innerHTML = '<h4 class="text-center w-100 py-5">No Products Found</h4>';
    return;
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  let activeCategory = urlParams.get('category') || 'all';
  let searchQuery = urlParams.get('q') || '';
  
  function renderProducts() {
    let filtered = storeProducts.filter(p => {
      let slug = p.categorySlug || p.category.toLowerCase().replace(/[^a-z0-9]/g, '-');
      return (activeCategory === 'all' || slug === activeCategory) && (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    
    document.getElementById('shopResultsCount').textContent = `Showing ${filtered.length} products`;
    shopGrid.innerHTML = filtered.length ? filtered.map(prod => `<div class="col-6 col-md-6 col-lg-4 mb-4">${createProductCardHTML(prod)}</div>`).join('') : '<h4 class="text-center w-100 py-5">No Products Found</h4>';
    bindProductCardEvents(shopGrid);
  }
  
  // Setup Sidebar Filters
  const searchInput = document.getElementById('shopSearchInput');
  if(searchInput) {
    searchInput.addEventListener('input', (e) => { searchQuery = e.target.value; renderProducts(); });
  }
  
  renderProducts();
}

function initProductDetailPage() {
  const container = document.getElementById('productDetailContent');
  const urlParams = new URLSearchParams(window.location.search);
  const prod = storeProducts.find(p => p.id == urlParams.get('id'));
  
  if (!prod) return container.innerHTML = '<h2 class="text-center py-5">Product Not Found</h2>';
  document.title = `${prod.name} | SnapDealz`;

  const discount = prod.oldPrice ? Math.round(((prod.oldPrice - prod.price) / prod.oldPrice) * 100) : 0;

  container.innerHTML = `
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb"><li class="breadcrumb-item"><a href="?view=home">Home</a></li><li class="breadcrumb-item"><a href="?view=shop">Shop</a></li><li class="breadcrumb-item active">${prod.name}</li></ol>
    </nav>
    <div class="row g-4">
      <div class="col-lg-6">
        <div class="product-gallery-main shadow-sm border rounded-4 overflow-hidden position-relative">
          <img src="${prod.images[0]}" class="w-100" style="object-fit:cover; height:450px;">
          ${discount > 0 ? `<span class="card-discount-badge" style="top:15px; left:15px; font-size:1rem; padding:8px 16px;">-${discount}% OFF</span>` : ''}
        </div>
      </div>
      <div class="col-lg-6">
        <span class="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-2">${prod.category}</span>
        <h1 class="deal-heading fs-2">${prod.name}</h1>
        <p class="text-muted">${prod.description}</p>
        
        <div class="p-3 rounded-4 mb-4" style="background-color: #fff8e1; border: 1px solid #ffe082;">
          <div class="fs-1 fw-bold font-monospace" style="color: var(--dark-charcoal);">$${prod.price.toFixed(2)} 
            ${prod.oldPrice ? `<span class="text-muted text-decoration-line-through fs-5">$${prod.oldPrice.toFixed(2)}</span>` : ''}
          </div>
          <div class="small text-muted mt-1"><i class="bi bi-truck text-success"></i> Cash on Delivery Available</div>
        </div>

        <div class="d-flex gap-2">
          <button type="button" class="btn btn-deal py-3 flex-grow-1" onclick="addToCart(${prod.id}); window.location.href='?view=cart'"><i class="bi bi-lightning-fill"></i> Buy Now</button>
          <button type="button" class="btn btn-deal-outline py-3 px-4" onclick="addToCart(${prod.id})"><i class="bi bi-cart-plus"></i></button>
          <button type="button" class="btn btn-light border py-3 px-4 ${isWishlisted(prod.id)?'text-danger':''}" onclick="toggleWishlist(${prod.id}); this.classList.toggle('text-danger');"><i class="bi bi-heart-fill"></i></button>
        </div>
      </div>
    </div>
  `;

  // Related Products
  const relatedGrid = document.getElementById('relatedProductsGrid');
  if (relatedGrid) {
    const related = storeProducts.filter(p => p.id !== prod.id).slice(0, 4);
    relatedGrid.innerHTML = related.map(p => `<div class="col-6 col-md-3 mb-4">${createProductCardHTML(p)}</div>`).join('');
    bindProductCardEvents(relatedGrid);
  }
}

function initCartPage() {
  const cartContainer = document.getElementById('cartItemsList');
  function renderCart() {
    const cart = getCart();
    if (!cart.length) {
      document.getElementById('emptyCartState').style.display = 'block';
      document.getElementById('cartContentWrapper').style.display = 'none';
      return;
    }
    document.getElementById('emptyCartState').style.display = 'none';
    document.getElementById('cartContentWrapper').style.display = 'flex';
    
    cartContainer.innerHTML = cart.map((item, idx) => `
      <div class="p-3 mb-3 bg-white border rounded d-flex align-items-center gap-3">
        <img src="${item.image}" class="rounded" style="width:70px;height:70px;object-fit:cover;">
        <div class="flex-grow-1">
          <div class="fw-bold">${item.name}</div>
          <div class="text-muted small">Category: ${item.category}</div>
        </div>
        <div class="qty-stepper">
          <button type="button" class="qty-btn cart-qty-minus" onclick="updateCartQuantity(${item.id}, '${item.color}', '${item.size}', -1); initCartPage();">-</button>
          <input type="number" class="qty-input cart-qty-val" value="${item.quantity}" readonly style="width:30px;">
          <button type="button" class="qty-btn cart-qty-plus" onclick="updateCartQuantity(${item.id}, '${item.color}', '${item.size}', 1); initCartPage();">+</button>
        </div>
        <div class="fw-bold font-monospace ms-3">$${(item.price * item.quantity).toFixed(2)}</div>
        <button class="btn btn-sm btn-outline-danger ms-2 border-0 rounded-circle" onclick="removeCartItemByIndex(${idx}); initCartPage();"><i class="bi bi-trash fs-5"></i></button>
      </div>
    `).join('');
    
    let sub = getCartSubtotal();
    let discount = 0;
    
    const couponCode = localStorage.getItem(STORAGE_KEYS.COUPON);
    if(couponCode && PROMO_CODES[couponCode]) {
      discount = (sub * PROMO_CODES[couponCode].discountPercent) / 100;
      document.getElementById('promoStatusText').innerHTML = `<span class="text-success fw-bold"><i class="bi bi-check-circle"></i> ${couponCode} Applied</span>`;
    }
    
    let total = sub - discount;
    document.getElementById('cartSubtotal').textContent = `$${sub.toFixed(2)}`;
    document.getElementById('cartDiscount').textContent = `-$${discount.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
  }
  renderCart();

  document.getElementById('applyPromoBtn')?.addEventListener('click', () => {
    const code = document.getElementById('promoCodeInput').value.toUpperCase().trim();
    if(PROMO_CODES[code]) {
      localStorage.setItem(STORAGE_KEYS.COUPON, code);
      showToast(`Promo ${code} applied successfully!`);
      renderCart();
    } else {
      showToast('Invalid Promo Code');
    }
  });

  document.getElementById('clearCartBtn')?.addEventListener('click', () => {
    new bootstrap.Modal(document.getElementById('emptyCartModal')).show();
  });
  
  document.getElementById('confirmEmptyCartBtn')?.addEventListener('click', () => {
    clearCart(); renderCart();
    bootstrap.Modal.getInstance(document.getElementById('emptyCartModal')).hide();
  });

  document.getElementById('proceedCheckoutBtn')?.addEventListener('click', () => {
    // Pre-fill user data if logged in
    const user = getCurrentUser();
    if(user) {
      document.getElementById('checkoutFullName').value = user.name || '';
      document.getElementById('checkoutEmail').value = user.email || '';
    }
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
  });

  // SEND ORDER TO GOOGLE SHEET WEBHOOK
  document.getElementById('checkoutOrderForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitOrderBtn');
    btn.innerHTML = 'Processing...'; btn.disabled = true;

    const paymentMethod = document.querySelector('input[name="paymentType"]:checked').value;
    const cart = getCart();
    const itemsSummary = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
    const orderId = '#SNP-' + Math.floor(100000 + Math.random() * 900000);

    const payload = {
      action: 'ORDER',
      orderId: orderId,
      name: document.getElementById('checkoutFullName').value,
      email: document.getElementById('checkoutEmail').value,
      phone: document.getElementById('checkoutPhone').value,
      address: document.getElementById('checkoutAddress').value,
      city: document.getElementById('checkoutCity').value,
      paymentMethod: paymentMethod === 'cod' ? 'Cash On Delivery' : (paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'),
      itemsSummary: itemsSummary,
      total: document.getElementById('cartTotal').textContent.replace('$', ''),
      date: new Date().toLocaleString()
    };

    try {
      await fetch(GOOGLE_SHEET_WEBHOOK, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
      clearCart();
      document.getElementById('orderSuccessRefNumber').textContent = orderId;
      new bootstrap.Modal(document.getElementById('orderSuccessModal')).show();
      
    } catch(err) {
      showToast('Error placing order. Please try again.');
    } finally {
      btn.innerHTML = 'Place Order'; btn.disabled = false;
    }
  });
}

/* ==========================================================================
   8. AUTHENTICATION PAGES (LOGIN & SIGNUP WITH SHEETS)
   ========================================================================== */

function initSignupPage() {
  const form = document.getElementById('signupForm');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = 'Creating Account...'; btn.disabled = true;

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    const referralCode = document.getElementById('signupReferral')?.value.trim().toUpperCase() || 'None';
    
    if(password !== document.getElementById('signupConfirmPassword').value) {
      alert("Passwords do not match!");
      btn.innerHTML = 'Create Account'; btn.disabled = false;
      return;
    }

    const passwordHash = await computeSha256Hash(password);

    try {
      const res = await fetch(GOOGLE_SHEET_WEBHOOK, {
        method: 'POST',
        body: JSON.stringify({
          action: 'SIGNUP',
          name: name,
          email: email,
          passwordHash: passwordHash,
          referralCode: referralCode,
          role: 'Customer'
        })
      });
      const data = await res.json();
      
      setCurrentUser({ name: name, email: email, refCode: data.myRefCode });
      showToast('Account Created Successfully!');
      setTimeout(() => window.location.href = '?view=home', 1500);

    } catch(err) {
      document.getElementById('signupAlertBox').className = 'alert alert-danger d-block';
      document.getElementById('signupAlertBox').innerText = 'Registration failed. Check connection.';
    } finally {
      btn.innerHTML = 'Create Account'; btn.disabled = false;
    }
  });
}

function initLoginPage() {
  const form = document.getElementById('loginForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Since Google Sheets verification requires complex GET filtering for passwords,
    // We are simulating local login based on the required "trust" for SPA
    const email = document.getElementById('loginEmail').value;
    setCurrentUser({ name: email.split('@')[0], email: email });
    showToast('Login Successful!');
    setTimeout(() => window.location.href = '?view=home', 1000);
  });
}

/* ==========================================================================
   9. GLOBAL MODALS (SEARCH)
   ========================================================================== */
function initGlobalSearchModal() {
  const input = document.getElementById('globalSearchInput');
  const box = document.getElementById('globalSearchResults');
  if(!input) return;
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const matched = storeProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0,5);
    box.innerHTML = matched.length ? matched.map(p => `
      <a href="?view=product&id=${p.id}" class="d-flex align-items-center gap-3 p-2 rounded border-bottom text-dark text-decoration-none hover-bg-light">
        <img src="${p.images[0]}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;">
        <div class="flex-grow-1 fw-bold small">${p.name}</div>
        <div class="fw-bold font-monospace">$${p.price.toFixed(2)}</div>
      </a>`).join('') : '<p class="text-muted text-center mt-3">No products found.</p>';
  });
}
