// ===========================
// STATE
// ===========================
let favorites = JSON.parse(localStorage.getItem('kk_favorites')) || [];
let currentModalCard = null;

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  const saved = localStorage.getItem('kk_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('themeBtn').textContent = saved === 'dark' ? '🌙' : '☀️';
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  // Search
  document.getElementById('search').addEventListener('input', applyFilters);

  // Filter pills
  document.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  // Sort
  document.getElementById('sortSelect').addEventListener('change', applyFilters);

  // Modal close on overlay click
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  // Keyboard: Escape to close modal
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Init favorites UI
  restoreFavorites();
  updateFavCount();
  updateTotalKost();

  // Staggered card animation
  document.querySelectorAll('.kost-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 80}ms`;
  });

  initParticles();
});

// ===========================
// TOTAL KOST COUNTER
// ===========================
function updateTotalKost() {
  const total = document.querySelectorAll('.kost-card').length;
  const el = document.getElementById('totalKost');
  let count = 0;
  const step = Math.ceil(total / 30);
  const timer = setInterval(() => {
    count = Math.min(count + step, total);
    el.textContent = count;
    if (count >= total) clearInterval(timer);
  }, 30);
}

// ===========================
// FILTER & SORT
// ===========================
function applyFilters() {
  const q      = document.getElementById('search').value.toLowerCase().trim();
  const cat    = document.querySelector('.pill.active')?.dataset.filter || 'all';
  const sort   = document.getElementById('sortSelect').value;
  const cards  = [...document.querySelectorAll('.kost-card')];
  const empty  = document.getElementById('emptyState');
  const container = document.getElementById('kostContainer');

  // Filter
  let visible = cards.filter(card => {
    const name     = (card.dataset.name || '').toLowerCase();
    const location = (card.dataset.location || '').toLowerCase();
    const matchQ   = !q || name.includes(q) || location.includes(q);
    const matchCat = cat === 'all' || card.dataset.category === cat;
    return matchQ && matchCat;
  });

  // Sort
  visible.sort((a, b) => {
    if (sort === 'price-asc')   return parseInt(a.dataset.price) - parseInt(b.dataset.price);
    if (sort === 'price-desc')  return parseInt(b.dataset.price) - parseInt(a.dataset.price);
    if (sort === 'rating-desc') return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
    return 0;
  });

  // Hide all, then show filtered
  cards.forEach(c => {
    c.style.display = 'none';
    c.classList.remove('fade-in-item');
  });

  if (visible.length === 0) {
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    visible.forEach((c, i) => {
      c.style.display = 'block';
      c.style.animationDelay = `${i * 60}ms`;
      void c.offsetWidth; // reflow
      c.classList.add('fade-in-item');
      container.appendChild(c);
    });
  }
}

// ===========================
// SHOW DETAIL MODAL
// ===========================
function showDetail(card) {
  currentModalCard = card;
  const name     = card.dataset.name;
  const location = card.dataset.location;
  const price    = card.dataset.priceText;
  const facility = card.dataset.facility;
  const detail   = card.dataset.detail;
  const img      = card.dataset.img;
  const rating   = card.dataset.rating;
  const cat      = card.dataset.category;

  document.getElementById('modalImg').src     = img;
  document.getElementById('modalName').textContent     = name;
  document.getElementById('modalLocation').textContent = location;
  document.getElementById('modalRating').textContent   = '⭐ ' + rating + ' / 5.0';
  document.getElementById('modalPrice').textContent    = price;
  document.getElementById('modalDesc').textContent     = detail;

  // Badge
  const badge = document.getElementById('modalBadge');
  badge.textContent = cat === 'premium' ? '💎 Premium' : cat === 'standard' ? '💛 Standard' : '💚 Budget';
  badge.className   = 'modal-badge ' + (cat === 'premium' ? 'premium-badge' : cat === 'standard' ? 'standard-badge' : 'budget-badge');

  // Facilities
  const facDiv = document.getElementById('modalFacility');
  facDiv.innerHTML = facility.split(',').map(f =>
    `<span class="modal-fac-item">${f.trim()}</span>`
  ).join('');

  // Fav button state
  const favBtn = document.getElementById('modalFavBtn');
  const isFav  = favorites.includes(name);
  favBtn.textContent = isFav ? '❤️ Tersimpan' : '🤍 Simpan';
  favBtn.classList.toggle('active', isFav);

  document.getElementById('modalOverlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  document.body.style.overflow = '';
  currentModalCard = null;
}

// ===========================
// FAVORITE LOGIC
// ===========================
function toggleFavModal() {
  if (!currentModalCard) return;
  const name   = currentModalCard.dataset.name;
  const favBtn = document.getElementById('modalFavBtn');
  const cardFavBtn = currentModalCard.querySelector('.fav-btn');

  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
    favBtn.textContent = '🤍 Simpan';
    favBtn.classList.remove('active');
    if (cardFavBtn) { cardFavBtn.textContent = '🤍'; cardFavBtn.classList.remove('active'); }
    showToast('💔 Dihapus dari favorit', 'info');
  } else {
    favorites.push(name);
    favBtn.textContent = '❤️ Tersimpan';
    favBtn.classList.add('active');
    if (cardFavBtn) { cardFavBtn.textContent = '❤️'; cardFavBtn.classList.add('active'); }
    showToast('❤️ Ditambahkan ke favorit!', 'success');
  }

  saveFavorites();
  updateFavCount();
}

// Fav button on card
document.addEventListener('click', e => {
  const btn = e.target.closest('.fav-btn');
  if (!btn) return;
  e.stopPropagation();
  const name = btn.dataset.name;

  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
    btn.textContent = '🤍';
    btn.classList.remove('active');
    showToast('💔 Dihapus dari favorit', 'info');
  } else {
    favorites.push(name);
    btn.textContent = '❤️';
    btn.classList.add('active');
    showToast('❤️ Ditambahkan ke favorit!', 'success');
    // Heart burst animation
    btn.style.transform = 'scale(1.4)';
    setTimeout(() => { btn.style.transform = ''; }, 250);
  }

  saveFavorites();
  updateFavCount();
});

function saveFavorites() {
  localStorage.setItem('kk_favorites', JSON.stringify(favorites));
}

function restoreFavorites() {
  favorites.forEach(name => {
    const btn = document.querySelector(`.fav-btn[data-name="${name}"]`);
    if (btn) { btn.textContent = '❤️'; btn.classList.add('active'); }
  });
}

function updateFavCount() {
  const el = document.getElementById('favCount');
  if (el) el.textContent = favorites.length;
}

// ===========================
// THEME
// ===========================
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.getElementById('themeBtn').textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('kk_theme', next);
}

// ===========================
// TOAST
// ===========================
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000);
}

// ===========================
// PARTICLES
// ===========================
function initParticles() {
  if (typeof particlesJS === 'undefined') return;
  particlesJS('particles-js', {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 900 } },
      color: { value: ['#38bdf8', '#818cf8', '#34d399'] },
      shape: { type: 'circle' },
      opacity: { value: 0.3, random: true },
      size: { value: 2.5, random: true },
      line_linked: { enable: true, distance: 130, color: '#38bdf8', opacity: 0.18, width: 1 },
      move: { enable: true, speed: 1.2, random: true, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
      modes: { grab: { distance: 150, line_linked: { opacity: 0.5 } }, push: { particles_nb: 2 } }
    },
    retina_detect: true
  });
}
