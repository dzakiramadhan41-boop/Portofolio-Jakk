// ===========================
// TYPING EFFECT
// ===========================
const words = ["Web Developer", "UI Designer", "Web Enthusiast", "Programmer Muda"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const typingEl = document.getElementById("typing");
  if (!typingEl) return;

  const currentWord = words[wordIndex];

  if (!isDeleting) {
    typingEl.textContent = currentWord.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    typingEl.textContent = currentWord.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typeEffect, isDeleting ? 60 : 100);
}

if (document.getElementById("typing")) {
  typeEffect();
}

// ===========================
// REAL-TIME CLOCK
// ===========================
function updateJam() {
  const el = document.getElementById("jam");
  if (el) {
    el.textContent = new Date().toLocaleTimeString("id-ID");
  }
}
setInterval(updateJam, 1000);
updateJam();

// ===========================
// DARK MODE TOGGLE
// ===========================
function toggleDark() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// ===========================
// SCROLL FADE-IN ANIMATION
// ===========================
const fadeEls = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, i * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

// ===========================
// PARTICLES.JS
// ===========================
if (typeof particlesJS !== "undefined") {
  particlesJS("particles-js", {
    particles: {
      number: { value: 100, density: { enable: true, value_area: 800 } },
      color: { value: ["#0ea5e9", "#6366f1", "#ec4899"] },
      shape: { type: "circle" },
      opacity: { value: 0.7, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.3 } },
      size: { value: 4, random: true, anim: { enable: true, speed: 2, size_min: 1 } },
      move: {
        enable: true,
        speed: 2,
        random: true,
        out_mode: "out"
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#0ea5e9",
        opacity: 0.5,
        width: 1.5
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" }
      },
      modes: {
        grab: { distance: 180, line_linked: { opacity: 0.9 } },
        push: { particles_nb: 5 }
      }
    },
    retina_detect: true
  });
}

// ===========================
// CUSTOM CURSOR
// ===========================
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .tech-icon, .service-card, .box, .project-card, .theme-switch');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
  });
}

// ===========================
// BACK TO TOP BUTTON
// ===========================
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
}

// ===========================
// SKILL BAR ANIMATION (legacy — kept for compatibility)
// ===========================
const skillFills = document.querySelectorAll('.skill-fill');

if (skillFills.length > 0) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width = target.getAttribute('data-width');
        setTimeout(() => {
          target.style.width = width + '%';
        }, 200);
        skillObserver.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(el => skillObserver.observe(el));
}

// ===========================
// HAMBURGER MENU
// ===========================
function openMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  if (menu) menu.classList.add('open');
  if (btn)  btn.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  if (menu) menu.classList.remove('open');
  if (btn)  btn.classList.remove('open');
  document.body.style.overflow = '';
}

// Tutup menu kalau klik di luar
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});

// ===========================
// SCROLL PROGRESS BAR
// ===========================
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }, { passive: true });
}

// ===========================
// RIPPLE EFFECT
// ===========================
function createRipple(e) {
  const btn = e.currentTarget;
  const existingRipple = btn.querySelector('.ripple');
  if (existingRipple) existingRipple.remove();

  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top  - size / 2;

  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(ripple);

  ripple.addEventListener('animationend', () => ripple.remove());
}

// Attach ripple to all buttons and primary links
document.querySelectorAll('.btn-primary, .btn-outline, .project-btn, .filter-btn, .contact-card a').forEach(el => {
  el.addEventListener('click', createRipple);
});

// ===========================
// TOAST NOTIFICATION
// ===========================
function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">🔔</span><span>${message}</span>`;
  container.appendChild(toast);

  // Trigger show
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, duration);
}

// Attach toast to elements with data-toast attribute
document.querySelectorAll('[data-toast]').forEach(el => {
  el.addEventListener('click', () => {
    showToast(el.dataset.toast);
  });
});

// ===========================
// PROJECT FILTER
// ===========================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-category]');

if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.category || '';
        const match = filter === 'all' || categories.split(' ').includes(filter);

        if (match) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ===========================
// COUNTER ANIMATION (ABOUT STATS)
// ===========================
const countEls = document.querySelectorAll('.count-up');

if (countEls.length > 0) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(ease * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => countObserver.observe(el));
}

// ===========================
// PARALLAX BANNER (SUBTLE)
// ===========================
const parallaxEls = document.querySelectorAll('.parallax-banner');

if (parallaxEls.length > 0) {
  // Only apply parallax if not on a touch/mobile device
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768;

  if (!prefersReducedMotion && !isMobile) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        // Move at 20% of scroll speed — subtle, won't go below initial position
        el.style.transform = `translateY(${scrollY * 0.2}px)`;
      });
    }, { passive: true });
  }
}


// ===========================
// FITUR 10 — VISITOR COUNTER (PROPER localStorage)
// Replaces the old simple counter above
// ===========================
(function() {
  const KEY_COUNT   = 'vx_count';
  const KEY_SESSION = 'vx_session';
  const KEY_DATE    = 'vx_date';

  // Get stored values
  let totalCount = parseInt(localStorage.getItem(KEY_COUNT) || '0', 10);
  const sessionDone = sessionStorage.getItem(KEY_SESSION);

  // Only increment once per browser session
  if (!sessionDone) {
    totalCount++;
    localStorage.setItem(KEY_COUNT, totalCount);
    sessionStorage.setItem(KEY_SESSION, '1');

    // Track unique days (bonus accuracy)
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem(KEY_DATE);
    if (lastDate !== today) {
      localStorage.setItem(KEY_DATE, today);
    }
  }

  // Animate display
  const vEl = document.getElementById('visitor');
  if (vEl) {
    const duration = 1200;
    const start = performance.now();
    function updateCount(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      vEl.textContent = Math.round(ease * totalCount);
      if (progress < 1) requestAnimationFrame(updateCount);
    }
    requestAnimationFrame(updateCount);
  }
})();

// ===========================
// FITUR 3 — LANGUAGE TOGGLE (ID / EN)
// ===========================
const translations = {
  id: {
    // Navbar
    nav_home: 'Home', nav_about: 'Tentang', nav_project: 'Project',
    nav_awards: 'Penghargaan', nav_contact: 'Kontak',
    // Index hero
    hero_badge: ' Mahasiswa Manajemen Informatika',
    available_badge: 'Available for Work',
    hero_sub: 'Universitas Negeri Surabaya\u00a0·\u00a0Web Developer\u00a0·\u00a0Web Enthusiast',
    btn_contact: '🔥 Hubungi Saya', btn_projects: '🛸 Lihat Project', btn_cv: 'Download CV',
    // Services
    services_label: 'KEAHLIAN',
    services_title: 'Apa yang Saya Kerjakan?',
    services_desc: 'Fokus membangun pengalaman digital yang modern, cepat, dan menarik.',
    // About
    about_intro: 'Halo, saya <b>Dzaki Pasha Ramadhan</b>, mahasiswa Manajemen Informatika di Universitas Negeri Surabaya. Saya memiliki minat besar pada pengembangan website, teknologi digital, dan pemecahan masalah menggunakan pemrograman.',
    skills_title: '⚡ Skill & Kemampuan',
    skill_advanced: 'Advanced', skill_intermediate: 'Intermediate', skill_beginner: 'Beginner',
    skill_html_tip: 'Sudah membuat 5+ project dengan HTML5 semantik',
    skill_css_tip: 'Mahir layout Flexbox, Grid, animasi & responsive design',
    skill_js_tip: 'Memahami DOM manipulation, event, & localStorage',
    skill_py_tip: 'Bisa scripting dasar, logika, dan struktur data',
    skill_cpp_tip: 'Sedang belajar sintaks dasar dan pemrograman OOP',
    github_title: '📊 GitHub Activity',
    github_subtitle: 'Kontribusi terbaru di GitHub',
    github_loading: 'Memuat data GitHub...',
    // Contact form
    form_title: '✉️ Kirim Pesan Langsung',
    form_desc: 'Isi form di bawah dan pesan kamu akan langsung masuk ke email saya.',
    form_name: 'Nama', form_email: 'Email', form_subject: 'Subjek',
    form_message: 'Pesan', form_send: '🚀 Kirim Pesan',
  },
  en: {
    // Navbar
    nav_home: 'Home', nav_about: 'About', nav_project: 'Projects',
    nav_awards: 'Awards', nav_contact: 'Contact',
    // Index hero
    hero_badge: ' Informatics Management Student',
    available_badge: 'Available for Work',
    hero_sub: 'Universitas Negeri Surabaya\u00a0·\u00a0Web Developer\u00a0·\u00a0Web Enthusiast',
    btn_contact: '🔥 Contact Me', btn_projects: '🛸 View Projects', btn_cv: 'Download CV',
    // Services
    services_label: 'EXPERTISE',
    services_title: 'What I Do?',
    services_desc: 'Focused on building modern, fast, and compelling digital experiences.',
    // About
    about_intro: 'Hi, I\'m <b>Dzaki Pasha Ramadhan</b>, an Informatics Management student at Universitas Negeri Surabaya. I have a strong interest in web development, digital technology, and problem-solving through programming.',
    skills_title: '⚡ Skills & Abilities',
    skill_advanced: 'Advanced', skill_intermediate: 'Intermediate', skill_beginner: 'Beginner',
    skill_html_tip: 'Built 5+ projects using semantic HTML5',
    skill_css_tip: 'Proficient in Flexbox, Grid, animations & responsive design',
    skill_js_tip: 'Understands DOM manipulation, events, & localStorage',
    skill_py_tip: 'Can do basic scripting, logic, and data structures',
    skill_cpp_tip: 'Currently learning basic syntax and OOP programming',
    github_title: '📊 GitHub Activity',
    github_subtitle: 'Recent contributions on GitHub',
    github_loading: 'Loading GitHub data...',
    // Contact form
    form_title: '✉️ Send a Direct Message',
    form_desc: 'Fill in the form below and your message will arrive directly to my email.',
    form_name: 'Name', form_email: 'Email', form_subject: 'Subject',
    form_message: 'Message', form_send: '🚀 Send Message',
  }
};

// Detect current language from localStorage, default 'id'
let currentLang = localStorage.getItem('lang') || 'id';

function applyLang(lang) {
  const t = translations[lang];
  if (!t) return;

  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  // Update lang toggle label
  const label = document.getElementById('langLabel');
  if (label) label.textContent = lang === 'id' ? 'EN' : 'ID';

  // Update html lang attribute
  document.documentElement.lang = lang === 'id' ? 'id' : 'en';
}

function toggleLang() {
  currentLang = currentLang === 'id' ? 'en' : 'id';
  localStorage.setItem('lang', currentLang);
  applyLang(currentLang);
  showToast(currentLang === 'en' ? '🌐 Switched to English' : '🌐 Beralih ke Bahasa Indonesia');
}

// Apply saved lang on load
if (document.getElementById('langToggle')) {
  applyLang(currentLang);
}

// ===========================
// FITUR 8 — ANIMATED SKILL BARS
// ===========================
const skillBarFills = document.querySelectorAll('.skill-bar-fill');

if (skillBarFills.length > 0) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      const targetWidth = parseInt(fill.getAttribute('data-width'), 10);
      const pctEl = fill.closest('.skill-bar-wrap')?.querySelector('.skill-pct');

      // Delay each bar slightly for stagger effect
      const index = Array.from(skillBarFills).indexOf(fill);
      setTimeout(() => {
        fill.style.width = targetWidth + '%';

        // Animate percentage number
        if (pctEl) {
          const start = performance.now();
          const duration = 1100;
          function animatePct(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            pctEl.textContent = Math.round(ease * targetWidth) + '%';
            if (progress < 1) requestAnimationFrame(animatePct);
          }
          requestAnimationFrame(animatePct);
        }
      }, index * 120);

      barObserver.unobserve(fill);
    });
  }, { threshold: 0.4 });

  skillBarFills.forEach(el => barObserver.observe(el));
}

// ===========================
// FITUR 2 — GITHUB ACTIVITY GRAPH
// ===========================
async function loadGitHubGraph() {
  const container = document.getElementById('githubGraph');
  const metaEl    = document.getElementById('githubMeta');
  if (!container) return;

  const username = 'dzakiramadhan41-boop';
  const CACHE_KEY = 'gh_events_cache';
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  let events = null;

  // Check cache
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && (Date.now() - cached.ts < CACHE_TTL)) {
      events = cached.data;
    }
  } catch(e) { /* ignore */ }

  // Fetch from API if no cache
  if (!events) {
    try {
      const res = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`);
      if (!res.ok) throw new Error('API error ' + res.status);
      events = await res.json();
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: events }));
    } catch(e) {
      container.innerHTML = `<div style="text-align:center;padding:32px 20px;color:var(--text-muted);">
  <div style="font-size:32px;margin-bottom:10px;">⚠️</div>
  <p style="font-size:13px;margin-bottom:8px;">Tidak dapat memuat data GitHub.</p>
  <small style="font-size:11px;">Mungkin karena rate limit API. Coba refresh halaman dalam beberapa menit.</small>
</div>`;
      return;
    }
  }

  // Build contribution map for last 26 weeks (182 days)
  const today = new Date();
  today.setHours(0,0,0,0);
  const totalDays = 182;
  const contribMap = {};

  events.forEach(ev => {
    if (!ev.created_at) return;
    const d = new Date(ev.created_at);
    d.setHours(0,0,0,0);
    const key = d.toISOString().slice(0,10);
    contribMap[key] = (contribMap[key] || 0) + 1;
  });

  // Count totals
  let totalContribs = Object.values(contribMap).reduce((a,b) => a+b, 0);
  let activeDays = Object.keys(contribMap).length;
  const maxVal = Math.max(...Object.values(contribMap), 1);

  // Render grid
  const grid = document.createElement('div');
  grid.className = 'github-grid';

  // Start from 182 days ago, aligned to Sunday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - totalDays);
  // Align to Sunday
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  let currentDate = new Date(startDate);
  let week = null;

  while (currentDate <= today) {
    if (currentDate.getDay() === 0) {
      week = document.createElement('div');
      week.className = 'github-week';
      grid.appendChild(week);
    }

    const key = currentDate.toISOString().slice(0,10);
    const count = contribMap[key] || 0;
    const level = count === 0 ? 0 : count <= Math.ceil(maxVal * 0.25) ? 1 : count <= Math.ceil(maxVal * 0.5) ? 2 : count <= Math.ceil(maxVal * 0.75) ? 3 : 4;

    const day = document.createElement('div');
    day.className = 'github-day';
    day.setAttribute('data-level', level);
    const dateStr = currentDate.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
    day.title = count > 0 ? `${count} aktivitas – ${dateStr}` : `Tidak ada aktivitas – ${dateStr}`;

    if (week) week.appendChild(day);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Legend
  const legend = document.createElement('div');
  legend.className = 'github-legend';
  legend.innerHTML = `
    <span>Sedikit</span>
    <div class="github-legend-box" style="background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.08);"></div>
    <div class="github-legend-box" data-level="1" style="background:rgba(56,189,248,0.25);"></div>
    <div class="github-legend-box" data-level="2" style="background:rgba(56,189,248,0.5);"></div>
    <div class="github-legend-box" data-level="3" style="background:rgba(56,189,248,0.75);"></div>
    <div class="github-legend-box" data-level="4" style="background:rgba(56,189,248,1);"></div>
    <span>Banyak</span>
  `;

  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';
  wrapper.appendChild(grid);
  wrapper.appendChild(legend);

  container.innerHTML = '';
  container.appendChild(wrapper);

  // Meta info
  if (metaEl) {
    metaEl.innerHTML = `
      <div class="github-meta-item">📅 <strong>${totalContribs}</strong>&nbsp;aktivitas dalam 6 bulan terakhir</div>
      <div class="github-meta-item">🔥 <strong>${activeDays}</strong>&nbsp;hari aktif</div>
      <div class="github-meta-item"><a href="https://github.com/${username}" target="_blank" rel="noopener" style="color:var(--primary);">@${username}</a></div>
    `;
  }
}

loadGitHubGraph();

// ===========================
// FITUR 9 — TESTIMONIAL SLIDER
// ===========================
(function() {
  const track = document.getElementById('testimonialTrack');
  const dotsEl = document.getElementById('testimonialDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoTimer = null;

  // Create dots
  if (dotsEl) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 't-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Testimonial ${i+1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    });
  }

  function getCardWidth() {
    const card = track.querySelector('.testimonial-card');
    const gap = 24;
    return card ? card.offsetWidth + gap : 444;
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * getCardWidth()}px)`;
    // Update dots
    if (dotsEl) {
      dotsEl.querySelectorAll('.t-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }
    // Restart auto
    clearTimeout(autoTimer);
    autoTimer = setTimeout(nextSlide, 5000);
  }

  function nextSlide() { goTo(current + 1); }

  // Touch / drag support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // Auto-play
  autoTimer = setTimeout(nextSlide, 5000);

  window.addEventListener('resize', () => { goTo(current); }, { passive: true });

  // Pause on hover
  track.addEventListener('mouseenter', () => clearTimeout(autoTimer));
  track.addEventListener('mouseleave', () => { autoTimer = setTimeout(nextSlide, 5000); });
})();

// ===========================
// FITUR 4 — CONTACT FORM (EmailJS)
// ===========================
(function() {
  // ⚠️  GANTI NILAI INI SETELAH DAFTAR DI emailjs.com
  const EMAILJS_PUBLIC_KEY  = '1fG4OqOANeLTavpYe';
  const EMAILJS_SERVICE_ID  = 'service_8tgbydl';
  const EMAILJS_TEMPLATE_ID = 'template_rv95rxx';

  const form = document.getElementById('contactForm');
  if (!form) return;

  // Init EmailJS only if credentials are set
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  function validate() {
    let ok = true;
    const fields = [
      { id: 'cf_name',    errId: 'err_name',    msg: 'Nama wajib diisi.' },
      { id: 'cf_email',   errId: 'err_email',   msg: 'Email tidak valid.', type: 'email' },
      { id: 'cf_subject', errId: 'err_subject', msg: 'Subjek wajib diisi.' },
      { id: 'cf_message', errId: 'err_message', msg: 'Pesan wajib diisi.' },
    ];
    fields.forEach(f => {
      const el  = document.getElementById(f.id);
      const err = document.getElementById(f.errId);
      let valid = el.value.trim().length > 0;
      if (f.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
      el.classList.toggle('error', !valid);
      if (err) err.textContent = valid ? '' : f.msg;
      if (!valid) ok = false;
    });
    return ok;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const btn     = document.getElementById('formSubmitBtn');
    const btnText = document.getElementById('formBtnText');
    const spinner = document.getElementById('formSpinner');

    btn.disabled = true;
    spinner.classList.add('active');
    if (btnText) btnText.textContent = currentLang === 'en' ? 'Sending...' : 'Mengirim...';

    // Check if EmailJS is configured
    if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      setTimeout(() => {
        btn.disabled = false;
        spinner.classList.remove('active');
        if (btnText) btnText.innerHTML = currentLang === 'en' ? '🚀 Send Message' : '🚀 Kirim Pesan';
        showToast('⚠️ EmailJS belum dikonfigurasi. Lihat panduan di contact.html');
      }, 1000);
      return;
    }

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
      showToast('✅ Pesan berhasil dikirim! Saya akan segera membalas.');
      form.reset();
      document.querySelectorAll('.form-error').forEach(e => e.textContent = '');
      document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => el.classList.remove('error'));
    } catch(err) {
      showToast('❌ Gagal mengirim pesan. Coba lagi atau hubungi via WhatsApp.');
    } finally {
      btn.disabled = false;
      spinner.classList.remove('active');
      if (btnText) btnText.innerHTML = currentLang === 'en' ? '🚀 Send Message' : '🚀 Kirim Pesan';
    }
  });

  // Live validation on blur
  ['cf_name','cf_email','cf_subject','cf_message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => validate());
  });
})();

// ===========================
// FITUR 6 — PROJECT DETAIL MODAL
// ===========================
const projectData = {
  handtrack: {
    title: '🖐️ Hand Gesture Particle Control',
    images: ['images/hand tracking.png'],
    desc: 'Aplikasi interaktif yang memanfaatkan MediaPipe Hands untuk mendeteksi posisi jari tangan secara real-time melalui kamera webcam. Partikel di layar merespons gerakan tangan pengguna, menciptakan pengalaman visual yang imersif.',
    tech: ['HTML5', 'CSS3', 'JavaScript ES6+', 'MediaPipe Hands', 'Canvas API', 'WebRTC'],
    features: [
      'Deteksi 21 landmark tangan secara real-time',
      'Kontrol partikel interaktif berdasarkan posisi jari',
      'Efek visual responsif dengan Canvas API',
      'Dukungan kamera webcam via WebRTC',
      'Performa optimal dengan requestAnimationFrame',
    ],
    link: 'project/hand tracking/index.html',
  },
  finance: {
    title: '💸 Student Finance Tracker',
    images: ['images/finance tracker.png'],
    desc: 'Aplikasi manajemen keuangan khusus mahasiswa dengan dashboard interaktif. Pengguna dapat mencatat pemasukan dan pengeluaran, melihat ringkasan statistik, dan menyimpan data secara lokal tanpa perlu backend.',
    tech: ['HTML5', 'CSS3', 'JavaScript ES6+', 'localStorage API', 'Chart.js', 'Flexbox Grid'],
    features: [
      'Input dan kategorisasi transaksi keuangan',
      'Dashboard statistik dengan grafik visual',
      'Penyimpanan data persisten via localStorage',
      'Filter dan pencarian riwayat transaksi',
      'Ekspor/ringkasan bulanan',
      'Desain responsif untuk mobile',
    ],
    link: 'project/finance tracker/index.html',
  },
  kost: {
    title: '🏡 Kost Finder',
    images: ['images/kostku premium.png', 'images/kost1.jpg', 'images/kost2.jpg'],
    desc: 'Platform pencarian kost berbasis web yang membantu mahasiswa menemukan hunian sesuai budget, lokasi, dan fasilitas yang diinginkan. Menampilkan listing kost dengan foto, deskripsi lengkap, dan filter pencarian canggih.',
    tech: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Responsive Design', 'CSS Grid', 'Filter API'],
    features: [
      'Filter pencarian berdasarkan harga, lokasi, fasilitas',
      'Galeri foto tiap unit kost',
      'Halaman detail kost dengan informasi lengkap',
      'Tampilan card grid yang responsif',
      'Bookmark / simpan kost favorit',
      'UI/UX yang bersih dan modern',
    ],
    link: 'project/kostku premium/index.html',
  },
  absensi: {
    title: '🎓 Sistem Absensi Mahasiswa',
    images: ['images/absensi mahasiswa.png'],
    desc: 'Sistem absensi berbasis web untuk lingkungan kampus. Dosen atau mahasiswa dapat mencatat kehadiran, melihat statistik kehadiran, melakukan pencarian, dan mengakses riwayat lengkap. Data disimpan secara lokal.',
    tech: ['HTML5', 'CSS3', 'JavaScript ES6+', 'localStorage API', 'CSS Grid', 'Date API'],
    features: [
      'Input kehadiran mahasiswa secara cepat',
      'Dashboard statistik kehadiran visual',
      'Pencarian mahasiswa berdasarkan nama/NIM',
      'Riwayat kehadiran dengan filter tanggal',
      'Export data kehadiran',
      'Penyimpanan lokal tanpa backend',
    ],
    link: 'project/absensi mahasiswa/index.html',
  },
};

function openProjectModal(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  const overlay = document.getElementById('projectModal');
  const body    = document.getElementById('modalBody');
  if (!overlay || !body) return;

  // Build gallery HTML
  const galleryHtml = data.images.map(src =>
    `<img src="${src}" alt="${data.title}" loading="lazy">`
  ).join('');

  // Build tech pills
  const techHtml = data.tech.map(t => `<div class="modal-tech-pill">${t}</div>`).join('');

  // Build features
  const featuresHtml = data.features.map(f => `<li>${f}</li>`).join('');

  body.innerHTML = `
    <div class="modal-img-gallery">${galleryHtml}</div>
    <h2 class="modal-title">${data.title}</h2>
    <p class="modal-desc">${data.desc}</p>
    <div class="modal-tech-section">
      <div class="modal-tech-title">Tech Stack</div>
      <div class="modal-tech-grid">${techHtml}</div>
    </div>
    <div class="modal-features">
      <div class="modal-tech-title">Fitur Utama</div>
      <ul>${featuresHtml}</ul>
    </div>
    <a href="${data.link}" class="modal-open-btn" target="_blank" rel="noopener">⚡ Buka Project</a>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }, 100);
}

function closeProjectModal(event, force) {
  if (!force && event && !event.target.classList.contains('project-modal-overlay')) return;
  const overlay = document.getElementById('projectModal');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectModal(null, true);
});

// ===========================
// FITUR 7 — PWA SERVICE WORKER REGISTRATION
// ===========================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log('[PWA] Service Worker registered:', reg.scope);
      })
      .catch(err => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });
}
