/* ═══════════════════════════════════════════════════
   AGX · app.js — minimalist luxury build
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ── NAV SCROLL + BACK TO TOP ──────────────── */
  const nav = $('#nav');
  const backTop = $('#backTop');
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 20);
    if (backTop) {
      const show = y > 800;
      backTop.hidden = !show;
      backTop.classList.toggle('show', show);
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  if (backTop) backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduce ? 'auto' : 'smooth' });
  });

  /* ── MOBILE DRAWER ──────────────────────────── */
  const ham = $('#navHam');
  const drawer = $('#drawer');
  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (ham) ham.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (ham) ham.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  if (ham && drawer) {
    ham.addEventListener('click', () => {
      drawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });
    $$('[data-drawer-close]', drawer).forEach(el =>
      el.addEventListener('click', closeDrawer)
    );
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer();
    });
    const mq = matchMedia('(min-width: 900px)');
    mq.addEventListener('change', e => { if (e.matches) closeDrawer(); });
  }

  /* ── SCROLL REVEAL ──────────────────────────── */
  const reveals = $$('.rv');
  if (reveals.length) {
    if (prefersReduce || !('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Stagger within a sibling group for a nicer cascade
            const idx = Array.from(entry.target.parentElement?.children || []).indexOf(entry.target);
            entry.target.style.transitionDelay = Math.min(idx * 60, 400) + 'ms';
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      reveals.forEach(el => io.observe(el));
    }
  }

  /* ── STAT COUNTERS ──────────────────────────── */
  const counters = $$('.stat-n[data-count]');
  if (counters.length) {
    const countUp = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      if (prefersReduce) { el.textContent = prefix + target + suffix; return; }
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const statIo = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { countUp(e.target); statIo.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(el => statIo.observe(el));
    } else {
      counters.forEach(countUp);
    }
  }

})();
