/**
 * StockPro - Cahier des Charges ULTRA-PREMIUM
 * Animations GSAP & Interactions
 */

document.addEventListener('DOMContentLoaded', init);

function init() {
  // Boutons d'export et modal
  initExportButtons();
  // Fonctions qui fonctionnent sans GSAP
  initAccordion();
  initLightbox();
  initScrollToTop();
  initThemeToggle();
  initTabs();
  initNavbar();

  // GSAP - chargement asynchrone pour éviter les erreurs (file://, CORS)
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.body.classList.add('no-gsap');
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);
    createParticles();
    initHeroAnimation();
    initScrollAnimations();
    initStatsCounters();
  } catch (e) {
    console.warn('GSAP animations désactivées:', e);
    document.body.classList.add('no-gsap');
  }
}

// ========== PARTICLES ==========
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 50;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (10 + Math.random() * 10) + 's';
    container.appendChild(particle);
  }
}

// ========== HERO ANIMATION ==========
function initHeroAnimation() {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  
  tl.from('.hero-badge', { y: -15, duration: 0.5 })
    .from('.hero-title', { scale: 0.95, duration: 0.6 }, '-=0.2')
    .from('.hero-subtitle', { x: -20, duration: 0.5 }, '-=0.3')
    .from('.hero-description', { duration: 0.5 }, '-=0.2')
    .from('.hero-cta', { y: 20, duration: 0.5 }, '-=0.3')
    .from('.scroll-indicator', { duration: 0.4 }, '-=0.2');
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
  gsap.utils.toArray('.content-section').forEach((section, i) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 90%',
        end: 'bottom 10%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      duration: 0.7,
      ease: 'power2.out',
      delay: i * 0.05
    });

    const badge = section.querySelector('.section-badge');
    const title = section.querySelector('.section-title');
    if (badge) gsap.from(badge, { scrollTrigger: { trigger: section, start: 'top 90%' }, x: -20, duration: 0.5 });
    if (title) gsap.from(title, { scrollTrigger: { trigger: section, start: 'top 90%' }, x: 20, duration: 0.5, delay: 0.1 });
  });

  gsap.from('.intro-card, .scope-card, .info-card, .stat-card', {
    scrollTrigger: { trigger: '.main-content', start: 'top 85%' },
    y: 30,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out'
  });
}

// ========== NAVBAR ==========
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scrollProgress');
  const navLinks = document.querySelectorAll('.navbar-menu a');

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    const progressPct = (y / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (progress) progress.style.width = Math.min(progressPct, 100) + '%';

    if (y > lastScroll && y > 300) navbar.style.transform = 'translateY(-100%)';
    else navbar.style.transform = 'translateY(0)';
    lastScroll = y;
  }, { passive: true });

  function setActiveNav(id) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  if (typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('.content-section').forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setActiveNav(section.id),
        onEnterBack: () => setActiveNav(section.id)
      });
    });
  } else {
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('.content-section');
      let current = '';
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) current = section.id;
      });
      if (current) setActiveNav(current);
    });
  }
}

// ========== TABS ==========
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.feature-tab-content');
  const indicator = document.querySelector('.tab-indicator');

  if (!indicator) return;

  const updateIndicator = (btn) => {
    const rect = btn.getBoundingClientRect();
    const container = btn.closest('.features-tabs');
    const containerRect = container.getBoundingClientRect();
    indicator.style.left = (rect.left - containerRect.left) + 'px';
    indicator.style.width = rect.width + 'px';
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const contentId = 'tab-' + tab.dataset.tab;
      const contentEl = document.getElementById(contentId);
      if (contentEl) contentEl.classList.add('active');
      updateIndicator(tab);

      if (typeof gsap !== 'undefined') {
        try {
          gsap.from(contentEl?.querySelector('.feature-layout'), {
            opacity: 0.5,
            x: 15,
            duration: 0.3,
            ease: 'power2.out'
          });
        } catch (_) {}
      }
    });
  });

  const activeTab = document.querySelector('.tab-btn.active');
  if (activeTab) updateIndicator(activeTab);
}

// ========== ACCORDION ==========
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  }
  );
}

// ========== STATS COUNTERS ==========
function initStatsCounters() {
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 90%',
      onEnter: () => animateCounter(card)
    });
  });
}

function animateCounter(card) {
  const el = card.querySelector('.stat-number');
  if (!el || el.dataset.animated) return;
  el.dataset.animated = 'true';

  const target = parseInt(el.dataset.target) || 0;
  const duration = 2;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = (currentTime - startTime) / 1000;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(start + (target - start) * easeProgress);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

// ========== LIGHTBOX ==========
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const content = lightbox?.querySelector('.lightbox-content img');

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      const img = el.querySelector('img');
      if (img && content) {
        content.src = img.src;
        content.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ========== SCROLL TO TOP ==========
function initScrollToTop() {
  const btn = document.getElementById('scrollToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========== EXPORT MODAL & BOUTONS ==========
function initExportButtons() {
  const modal = document.getElementById('exportModal');
  const exportBtns = ['exportPdfBtn', 'heroExportBtn', 'footerExportBtn'];
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const modalPrintBtn = document.getElementById('modalPrintBtn');

  function openModal() {
    if (modal) modal.classList.add('open');
  }

  function closeModal() {
    if (modal) modal.classList.remove('open');
  }

  exportBtns.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', openModal);
  });

  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
  if (modalPrintBtn) {
    modalPrintBtn.addEventListener('click', () => {
      window.print();
      closeModal();
    });
  }
}

// ========== THEME TOGGLE ==========
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle') || document.querySelector('.theme-toggle');
  if (!toggle) return;

  const saved = localStorage.getItem('stockpro-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  function updateIcon() {
    const theme = document.documentElement.getAttribute('data-theme');
    toggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('stockpro-theme', next);
    updateIcon();
  });

  updateIcon();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('exportModal')?.classList.remove('open');
    closeLightbox();
  }
});
