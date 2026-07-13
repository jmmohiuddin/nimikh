// Nimikh Agency — main.js

// ── Scroll progress bar ──────────────────────────────────────────
const scrollBar = document.querySelector('.scroll-bar');
if (scrollBar) {
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - innerHeight) * 100;
    scrollBar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}

// ── Sticky nav ───────────────────────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });
}

// ── Mobile nav ───────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    })
  );
}

// ── Scroll-reveal ────────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-in').forEach(el => revealObs.observe(el));

// ── Accordion ────────────────────────────────────────────────────
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion-item');
    const open = item.classList.contains('open');
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

// ── Filter tabs (marketplace) ─────────────────────────────────────
document.querySelectorAll('.filter-tabs').forEach(tabGroup => {
  tabGroup.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabGroup.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter || 'all';
      document.querySelectorAll('[data-category]').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
      });
    });
  });
});

// ── Animated counters ─────────────────────────────────────────────
function countUp(el, target, dur = 1800) {
  const start = performance.now();
  const suffix = el.dataset.suffix || '';
  const step = ts => {
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target, parseInt(e.target.dataset.count));
      cntObs.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => cntObs.observe(el));

// ── Toast notification ────────────────────────────────────────────
function showToast(msg, duration = 4200) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast'; t.className = 'toast'; t.setAttribute('role','status');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

// ── Contact form ──────────────────────────────────────────────────
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true;
    setTimeout(() => {
      showToast('✓ Message sent! We\'ll reply within 24 hours.');
      form.reset();
      btn.textContent = orig; btn.disabled = false;
    }, 1200);
  });
}

// ── Smooth anchor links ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Mark active nav link ──────────────────────────────────────────
const path = location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('#nav-links a').forEach(a => {
  const href = a.getAttribute('href').replace(/\/$/, '') || '/';
  if (href === path || (href !== '/' && href !== '/index.html' && path.startsWith(href))) {
    a.classList.add('active');
  }
});
