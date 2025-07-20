 // شاشة الانتظار (loading screen)
window.addEventListener('DOMContentLoaded', function() {
  document.body.classList.remove('loaded');
  setTimeout(function() {
    document.body.classList.add('loaded');
    document.getElementById('loadingScreen')?.remove();
    if (window.AOS) {
      AOS.init({ duration: 700, once: false, mirror: true });
    }
    setTimeout(() => {
      if (window.AOS) AOS.refresh();
    }, 500);
  }, 2000);
});

// القائمة العلوية إظهار/إخفاء حسب اتجاه السحب (sticky hide/show)
let lastScroll = window.scrollY;
let navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function() {
  if (!navbar) return;
  let currentScroll = window.scrollY;
  if (currentScroll > lastScroll && currentScroll > 120) {
    navbar.classList.add('hide-navbar');
  } else {
    navbar.classList.remove('hide-navbar');
  }
  lastScroll = currentScroll;
});

// هيرو سلايدر (تلقائي ونقاط - الصور متزامنة تمامًا)
let current = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dots .dot');
let sliderInterval = null;

function showSlide(idx) {
  slides.forEach((s, i) => s.classList.toggle('active', i === idx));
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  current = idx;
}

function startSliderAuto() {
  if(sliderInterval) clearInterval(sliderInterval);
  sliderInterval = setInterval(() => {
    let idx = (current + 1) % slides.length;
    showSlide(idx);
  }, 6000);
}

if (dots.length && slides.length) {
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    showSlide(i);
    startSliderAuto();
  }));
  window.onload = function(){ showSlide(0); startSliderAuto(); };
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) startSliderAuto();
    else clearInterval(sliderInterval);
  });
}

// المنتجات متجاوبة (لضمان grid على الهاتف)
window.addEventListener('DOMContentLoaded', function() {
  let grid = document.querySelector('.product-grid');
  function adjustProductsGrid() {
    if (window.innerWidth <= 900) {
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
      grid.style.display = '';
      grid.style.gridTemplateColumns = '';
    }
  }
  if (grid) {
    adjustProductsGrid();
    window.addEventListener('resize', adjustProductsGrid);
  }
});

// نموذج اشتراك التواصل معنا
document.addEventListener('DOMContentLoaded', function() {
  const subscribeForm = document.getElementById('subscribeForm');
  if (subscribeForm) {
    subscribeForm.onsubmit = function(e) {
      e.preventDefault();
      subscribeForm.reset();
      alert("شكرًا لانضمامك إلى عائلة البجاوي! سنرسل لك أحدث العروض.");
    };
  }
});

// سلة المشتريات
let cartCount = 0;
let cartItems = [];
function updateCartCount() {
  const cartCountEl = document.getElementById('cartCount');
  const cartCountFixedEl = document.getElementById('cartCountFixed');
  if (cartCountEl) cartCountEl.textContent = cartCount;
  if (cartCountFixedEl) cartCountFixedEl.textContent = cartCount;
}
function renderCartItems() {
  const container = document.getElementById('cartItems');
  if(!container) return;
  if(cartItems.length === 0) {
    container.innerHTML = "<div style='text-align:center;color:#b4ffd3'>سلتك فارغة 🛒</div>";
    return;
  }
  container.innerHTML = "";
  cartItems.forEach(item => {
    container.innerHTML += `
      <div class="cart-item-row">
        <img src="${item.img}" alt="">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-qty">x${item.qty}</span>
        <span>${item.price}</span>
      </div>
    `;
  });
}
function addToCart(name, price, img) {
  const sound = document.getElementById('cartSound');
  if(sound) { sound.currentTime = 0; sound.play(); }
  cartCount++;
  let found = cartItems.find(i => i.name === name);
  if(found) { found.qty += 1; }
  else { cartItems.push({name, price, img, qty:1}); }
  updateCartCount();
  renderCartItems();
}
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const parent = btn.closest('.product-card');
      const name = parent.querySelector('h3').textContent;
      const price = parent.querySelector('.price').textContent;
      const img = parent.querySelector('img').src;
      addToCart(name, price, img);
    });
  });
});
const sideCart = document.getElementById('sideCart');
const sideCartBtn = document.getElementById('sideCartBtn');
const closeCartBtn = document.getElementById('closeCart');
if (sideCartBtn && sideCart) {
  sideCartBtn.onclick = function() { sideCart.classList.add('open'); };
}
if (closeCartBtn && sideCart) {
  closeCartBtn.onclick = function() { sideCart.classList.remove('open'); };
}
window.addEventListener('click', function(e){
  if(sideCart && sideCart.classList.contains('open') &&
     !sideCart.contains(e.target) && e.target.id !== 'sideCartBtn' && !e.target.closest('#sideCartBtn')) {
    sideCart.classList.remove('open');
  }
});
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.onclick = function() {
    alert('شكرًا لطلبك! سنقوم بالتواصل معك قريبًا.');
    cartItems = [];
    cartCount = 0;
    updateCartCount();
    renderCartItems();
  };
}

// ظهور تدريجي لكل الأقسام عند التمرير (يدعم جميع الأجهزة)
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top < window.innerHeight - 30 &&
    rect.bottom > 60
  );
}
function revealOnScrollAll() {
  document.querySelectorAll('.fade-in-up, [data-aos]').forEach(function(el) {
    if (isInViewport(el)) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScrollAll);
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(revealOnScrollAll, 100);
  setTimeout(revealOnScrollAll, 1200);
});
window.addEventListener('resize', revealOnScrollAll);

// إصلاح الأنيميشن في الهاتف (AOS + fade-in-up)
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.fade-in-up').forEach(function(el){
    if (isInViewport(el)) el.classList.add('visible');
  });
});