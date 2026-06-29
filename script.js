// ===========================
// TYPING EFFECT
// ===========================
const words = ["Web Developer", "UI Designer", "Tech Enthusiast", "Programmer Muda"];
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
// VISITOR COUNTER
// ===========================
let visitor = parseInt(localStorage.getItem("visitor") || "0");
visitor++;
localStorage.setItem("visitor", visitor);

const vEl = document.getElementById("visitor");
if (vEl) {
  // Animate count up
  let count = 0;
  const target = visitor;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    count += step;
    if (count >= target) {
      count = target;
      clearInterval(timer);
    }
    vEl.textContent = count;
  }, 30);
}

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
