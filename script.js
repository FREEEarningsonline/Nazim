/**
 * SnapDealz - Single Page Application Core JavaScript
 */

const STORAGE_KEYS = {
  CART: 'snapdealz_cart_v1',
  WISHLIST: 'snapdealz_wishlist_v1',
  USERS: 'snapdealz_users_v1',
  CURRENT_USER: 'snapdealz_current_user_v1',
  COUPON: 'snapdealz_active_coupon_v1',
  ORDERS: 'snapdealz_orders_v1'
};

const GOOGLE_SHEET_ORDER_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxok04-fGeaORcDyDwG8qYODD-903xt4q8xq2YTJBCG2fQ6gAF1rmy8FEUyHrozYdQ2/exec';

const PROMO_CODES = {
  'BUNDLE20': { discountPercent: 20, description: '20% Off Bundle Deal' },
  'SNAP10': { discountPercent: 10, description: '10% Flash Discount' },
  'FREESHIP': { discountPercent: 0, freeShipping: true, description: 'Free Express Shipping' }
};

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initStickyNavbar();
  initBackToTop();
  updateNavBadges();
  renderUserAuthNav();
  initScrollAnimations();
  initNewsletterForms();
  initGlobalSearchModal();
  initTrackOrderModal();

  // URL-based SPA Router Logic
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view') || 'home';
  
  // Set Dynamic Page Titles
  const viewMap = {
    'home': 'Home | SNAPDEALZ Store',
    'shop': 'All Deals | SNAPDEALZ',
    'product': 'Product Details | SNAPDEALZ',
    'cart': 'Shopping Cart | SNAPDEALZ',
    'login': 'Member Log In | SNAPDEALZ',
    'signup': 'Create VIP Account | SNAPDEALZ'
  };
  document.title = viewMap[view] || 'SNAPDEALZ Store';

  // Toggle View Containers
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
});

function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => { preloader.classList.add('fade-out'); setTimeout(() => preloader.remove(), 400); }, 250);
    });
    setTimeout(() => { if (preloader && !preloader.classList.contains('fade-out')) preloader.classList.add('fade-out'); }, 1200);
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

// ------------------------------------------------------------------------
// CART SYSTEM
// ------------------------------------------------------------------------
function getCart() {
  try { const raw = localStorage.getItem(STORAGE_KEYS.CART); return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
}
function saveCart(cart) { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); updateNavBadges(); }

function addToCart(productId, qty = 1, selectedColor = null, selectedSize = null) {
  const prod = products.find(p => p.id === Number(productId));
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

function removeFromCart(productId, color = '', size = '') {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === Number(productId) && (item.color || '') === color && (item.size || '') === size));
  saveCart(cart);
}
function removeCartItemByIndex(index) {
  const cart = getCart();
  if (Number(index) >= 0 && Number(index) < cart.length) { cart.splice(Number(index), 1); saveCart(cart); }
}
function updateCartQuantity(productId, color, size, deltaOrExact, isExact = false) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === Number(productId) && (item.color || '') === color && (item.size || '') === size);
  if (index === -1) return;
  if (isExact) cart[index].quantity = Math.max(1, Number(deltaOrExact));
  else cart[index].quantity += Number(deltaOrExact);
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart(cart);
}
function clearCart() { localStorage.removeItem(STORAGE_KEYS.CART); localStorage.removeItem(STORAGE_KEYS.COUPON); updateNavBadges(); }
function getCartCount() { return getCart().reduce((total, item) => total + item.quantity, 0); }
function getCartSubtotal() { return getCart().reduce((total, item) => total + (item.price * item.quantity), 0); }

// ------------------------------------------------------------------------
// WISHLIST SYSTEM
// ------------------------------------------------------------------------
function getWishlist() { try { const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST); return raw ? JSON.parse(raw) : []; } catch (e) { return []; } }
function saveWishlist(list) { localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list)); updateNavBadges(); }
function toggleWishlist(productId) {
  const list = getWishlist(); const id = Number(productId); const existsIndex = list.indexOf(id);
  const prod = products.find(p => p.id === id);
  if (existsIndex > -1) { list.splice(existsIndex, 1); saveWishlist(list); showToast(`Removed from Wishlist: ${prod ? prod.name : 'Item'}`); return false; } 
  else { list.push(id); saveWishlist(list); showToast(`Added to Wishlist: ${prod ? prod.name : 'Item'}`); return true; }
}
function isWishlisted(productId) { return getWishlist().includes(Number(productId)); }

// ------------------------------------------------------------------------
// TOAST NOTIFICATIONS
// ------------------------------------------------------------------------
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

// ------------------------------------------------------------------------
// AUTHENTICATION & NAVBAR USER STATE
// ------------------------------------------------------------------------
function getCurrentUser() { try { const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }
function setCurrentUser(user) { if (user) { localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user)); } else { localStorage.removeItem(STORAGE_KEYS.CURRENT_USER); } renderUserAuthNav(); }
function logoutUser() { setCurrentUser(null); showToast('You have been logged out.'); setTimeout(() => { window.location.reload(); }, 500); }

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

// ------------------------------------------------------------------------
// PRODUCT CARD RENDERER COMPONENT
// ------------------------------------------------------------------------
function createProductCardHTML(prod) {
  const discountPercent = Math.round(((prod.oldPrice - prod.price) / prod.oldPrice) * 100);
  const wishActive = isWishlisted(prod.id) ? 'active' : '';
  const heartIcon = isWishlisted(prod.id) ? 'bi-heart-fill' : 'bi-heart';
  return `
    <div class="deal-product-card" data-product-id="${prod.id}">
      <div class="card-img-wrap">
        <a href="?view=product&id=${prod.id}" class="d-block w-100 h-100">
          <img src="${prod.images[0]}" alt="${prod.name}" loading="lazy">
        </a>
        <span class="card-discount-badge">-${discountPercent}%</span>
        <button type="button" class="card-wishlist-btn ${wishActive}" data-wishlist-id="${prod.id}"><i class="bi ${heartIcon}"></i></button>
        <button type="button" class="card-quick-add" data-quick-add-id="${prod.id}"><i class="bi bi-cart-plus-fill"></i> Quick Add</button>
      </div>
      <div class="card-content">
        <span class="card-category">${prod.category}</span>
        <h3 class="card-title"><a href="?view=product&id=${prod.id}">${prod.name}</a></h3>
        <div class="card-rating"><i class="bi bi-star-fill text-warning"></i> <span class="rating-count">(${prod.reviewCount})</span></div>
        <div class="card-price-row">
          <span class="current-price">$${prod.price.toFixed(2)}</span>
          <span class="old-price">$${prod.oldPrice.toFixed(2)}</span>
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
      btn.querySelector('i').className = isAdded ? 'bi bi-heart-fill' : 'bi bi-heart';
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

// ------------------------------------------------------------------------
// PAGE INIT LOGIC
// ------------------------------------------------------------------------
function initHomePage() {
  const categoryScroll = document.getElementById('categoryScrollContainer');
  if (categoryScroll && typeof categoriesData !== 'undefined') {
    categoryScroll.innerHTML = categoriesData.map(cat => `<a href="?view=shop&category=${cat.slug}" class="category-item"><div class="category-circle"><i class="bi ${cat.icon}"></i></div><span class="category-label">${cat.name}</span></a>`).join('');
  }
  const trendingGrid = document.getElementById('trendingProductsGrid');
  if (trendingGrid && typeof products !== 'undefined') {
    trendingGrid.innerHTML = products.slice(0, 8).map(prod => `<div class="col-6 col-md-4 col-lg-3 mb-4">${createProductCardHTML(prod)}</div>`).join('');
    bindProductCardEvents(trendingGrid);
  }
  const copyBtn = document.getElementById('copyCouponBtn');
  if (copyBtn) copyBtn.addEventListener('click', () => { navigator.clipboard.writeText('BUNDLE20'); showToast('Coupon copied!'); });
}

function initShopPage() {
  const shopGrid = document.getElementById('shopProductsGrid');
  if (!shopGrid || typeof products === 'undefined') return;
  const urlParams = new URLSearchParams(window.location.search);
  let activeCategory = urlParams.get('category') || 'all';
  let searchQuery = urlParams.get('q') || '';
  
  function renderProducts() {
    let filtered = products.filter(p => (activeCategory === 'all' || p.categorySlug === activeCategory) && (!searchQuery || p.name.toLowerCase().includes(searchQuery)));
    document.getElementById('shopResultsCount').textContent = `Showing ${filtered.length} products`;
    shopGrid.innerHTML = filtered.length ? filtered.map(prod => `<div class="col-6 col-md-6 col-lg-4 mb-4">${createProductCardHTML(prod)}</div>`).join('') : '<h4 class="text-center w-100 py-5">No Products Found</h4>';
    bindProductCardEvents(shopGrid);
  }
  renderProducts();
}

function initProductDetailPage() {
  const container = document.getElementById('productDetailContent');
  const urlParams = new URLSearchParams(window.location.search);
  const prod = products.find(p => p.id === Number(urlParams.get('id')));
  
  if (!prod) return container.innerHTML = '<h2 class="text-center py-5">Product Not Found</h2>';
  document.title = `${prod.name} | SnapDealz`;

  container.innerHTML = `
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb"><li class="breadcrumb-item"><a href="?view=home">Home</a></li><li class="breadcrumb-item"><a href="?view=shop">Shop</a></li><li class="breadcrumb-item active">${prod.name}</li></ol>
    </nav>
    <div class="row g-4">
      <div class="col-lg-6"><div class="product-gallery-main"><img src="${prod.images[0]}" class="w-100"></div></div>
      <div class="col-lg-6">
        <h1 class="deal-heading fs-2">${prod.name}</h1>
        <div class="fs-1 fw-bold my-3">$${prod.price.toFixed(2)} <span class="text-muted text-decoration-line-through fs-5">$${prod.oldPrice.toFixed(2)}</span></div>
        <p class="text-secondary">${prod.description}</p>
        <button type="button" class="btn btn-deal py-3 w-100 mb-3" onclick="addToCart(${prod.id}); window.location.href='?view=cart'">Buy Now</button>
        <button type="button" class="btn btn-deal-outline py-3 w-100" onclick="addToCart(${prod.id})">Add to Cart</button>
      </div>
    </div>
  `;
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
        <img src="${item.image}" style="width:60px;height:60px;object-fit:cover;">
        <div class="flex-grow-1 fw-bold">${item.name} <br> <span class="text-muted small">$${item.price} x ${item.quantity}</span></div>
        <button class="btn btn-sm btn-danger cart-remove-item" onclick="removeCartItemByIndex(${idx}); initCartPage();"><i class="bi bi-trash"></i></button>
      </div>
    `).join('');
    
    const sub = getCartSubtotal();
    document.getElementById('cartSubtotal').textContent = `$${sub.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${sub.toFixed(2)}`;
  }
  renderCart();

  document.getElementById('clearCartBtn')?.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('emptyCartModal'));
    modal.show();
  });
  
  document.getElementById('confirmEmptyCartBtn')?.addEventListener('click', () => {
    clearCart(); renderCart();
    bootstrap.Modal.getInstance(document.getElementById('emptyCartModal')).hide();
  });

  document.getElementById('proceedCheckoutBtn')?.addEventListener('click', () => {
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
  });

  document.getElementById('checkoutOrderForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
    clearCart();
    new bootstrap.Modal(document.getElementById('orderSuccessModal')).show();
  });
}

function initLoginPage() {
  const form = document.getElementById('loginForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    setCurrentUser({ name: email.split('@')[0], email: email });
    window.location.href = '?view=home';
  });
}

function initSignupPage() {
  const form = document.getElementById('signupForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    setCurrentUser({ name: document.getElementById('signupName').value, email: email });
    window.location.href = '?view=home';
  });
}

// ------------------------------------------------------------------------
// MODALS
// ------------------------------------------------------------------------
function initGlobalSearchModal() {
  const input = document.getElementById('globalSearchInput');
  const box = document.getElementById('globalSearchResults');
  if(!input) return;
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const matched = products.filter(p => p.name.toLowerCase().includes(q)).slice(0,5);
    box.innerHTML = matched.map(p => `<a href="?view=product&id=${p.id}" class="d-block p-2 border-bottom fw-bold text-dark text-decoration-none">${p.name}</a>`).join('');
  });
}
function initNewsletterForms() {}
function initTrackOrderModal() {}
