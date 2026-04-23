/* ═══════════════════════════════════════════════════
   AGX · app.js — responsive, vanilla JS, no dependencies
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ── NAV SCROLL ─────────────────────────────────── */
  const nav = $('#nav');
  const backTop = $('#backTop');
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (backTop) {
      const show = y > 600;
      backTop.hidden = !show;
      backTop.classList.toggle('show', show);
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  if (backTop) backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduce ? 'auto' : 'smooth' });
  });

  /* ── MOBILE DRAWER ──────────────────────────────── */
  const ham = $('#navHam');
  const drawer = $('#drawer');
  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (ham) ham.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('locked');
  };
  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (ham) ham.setAttribute('aria-expanded', 'true');
    document.body.classList.add('locked');
  };
  if (ham && drawer) {
    ham.addEventListener('click', () => {
      drawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });
    $$('[data-drawer-close]', drawer).forEach(el => el.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
    // Close drawer on viewport ≥ 1024
    const mq = matchMedia('(min-width: 1024px)');
    mq.addEventListener('change', e => { if (e.matches) closeDrawer(); });
  }

  /* ── SCROLL REVEAL (IntersectionObserver) ───────── */
  const reveals = $$('.rv');
  if (reveals.length) {
    if (prefersReduce || !('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(el => io.observe(el));
    }
  }

  /* ── HERO TITLE ROTATE ──────────────────────────── */
  const slogans = $$('[data-rotate] .hero-slogan-word');
  if (slogans.length > 1 && !prefersReduce) {
    let i = 0;
    setInterval(() => {
      slogans[i].classList.remove('active');
      i = (i + 1) % slogans.length;
      slogans[i].classList.add('active');
    }, 4000);
  }

  /* ── STAT COUNTERS ──────────────────────────────── */
  const counters = $$('.gd-n[data-count]');
  if (counters.length) {
    const countUp = el => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      if (prefersReduce) { el.textContent = prefix + target + suffix; return; }
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * ease) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const statIo = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { countUp(e.target); statIo.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(el => statIo.observe(el));
    } else {
      counters.forEach(countUp);
    }
  }

  /* ── GLOBE: capital city lights + rotating popup ── */
  (function globe() {
    const canvas = $('#globeArcs');
    const popup = $('#cityPopup');
    const cpName = $('#cpName');
    const cpCount = $('#cpCount');
    const cityMsg = $('#cityMsg');
    const ring = canvas && canvas.parentElement;
    if (!canvas || !ring) return;

    const ctx = canvas.getContext('2d');
    let W, H, cX, cY, radius;

    const sync = () => {
      const r = ring.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.width = Math.round(r.width * dpr);
      H = canvas.height = Math.round(r.height * dpr);
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      cX = W / 2; cY = H / 2;
      radius = Math.min(W, H) / 2 * 0.88;
      ctx.scale(1, 1); // identity; we do math in canvas pixels
    };
    sync();
    window.addEventListener('resize', sync, { passive: true });

    // Capital cities
    const caps = [
      { lng: -77, lat: 38.9 }, { lng: -74, lat: 40.7 }, { lng: -0.1, lat: 51.5 },
      { lng: 2.3, lat: 48.9 }, { lng: 13.4, lat: 52.5 }, { lng: 37.6, lat: 55.8 },
      { lng: 55.3, lat: 25.3 }, { lng: 72.9, lat: 19.1 }, { lng: 116.4, lat: 39.9 },
      { lng: 121.5, lat: 31.2 }, { lng: 139.7, lat: 35.7 }, { lng: 103.8, lat: 1.3 },
      { lng: 151.2, lat: -33.9 }, { lng: -46.6, lat: -23.5 }, { lng: 3.4, lat: 6.5 },
      { lng: 31.2, lat: 30 }, { lng: 127, lat: 37.6 }, { lng: 100.5, lat: 13.8 },
      { lng: 106.8, lat: -6.2 }, { lng: -79.4, lat: 43.7 }, { lng: -99.1, lat: 19.4 },
      { lng: 46.7, lat: 24.6 }, { lng: 28, lat: -26.2 }, { lng: 114.2, lat: 22.3 },
      { lng: 8.5, lat: 47.4 }
    ];
    const pulses = caps.map(() => ({ v: 0, t: 0, timer: Math.random() * 3000 }));

    const project = (lng, lat, rotOff) => {
      const L = (lng + rotOff) * Math.PI / 180;
      const La = lat * Math.PI / 180;
      const cl = Math.cos(La);
      const x = cl * Math.sin(L);
      const z = cl * Math.cos(L);
      const y = -Math.sin(La);
      if (z < -0.1) return null;
      return { x: cX + x * radius * .9, y: cY + y * radius * .85 - radius * .05, z };
    };

    // City popup sequence synced with the CSS globeSpin (90s per turn)
    const citySet = [
      { name: '北京 Beijing', lng: 116.4, lat: 39.9, count: 98457 },
      { name: '成都 Chengdu', lng: 104.1, lat: 30.6, count: 76234 },
      { name: '东京 Tokyo', lng: 139.7, lat: 35.7, count: 84762 },
      { name: '首尔 Seoul', lng: 127, lat: 37.6, count: 71837 },
      { name: '孟买 Mumbai', lng: 72.9, lat: 19.1, count: 67891 },
      { name: '迪拜 Dubai', lng: 55.3, lat: 25.3, count: 31763 },
      { name: '伊斯坦布尔 Istanbul', lng: 28.9, lat: 41, count: 46789 },
      { name: '柏林 Berlin', lng: 13.4, lat: 52.5, count: 54321 },
      { name: '巴黎 Paris', lng: 2.3, lat: 48.9, count: 63789 },
      { name: '伦敦 London', lng: -0.1, lat: 51.5, count: 58912 },
      { name: '纽约 New York', lng: -74, lat: 40.7, count: 77890 },
      { name: '多伦多 Toronto', lng: -79.4, lat: 43.7, count: 48231 },
      { name: '圣保罗 Sao Paulo', lng: -46.6, lat: -23.5, count: 62345 },
      { name: '悉尼 Sydney', lng: 151.2, lat: -33.9, count: 35678 }
    ];
    const GLOBE_OFFSET = -30;
    let cityIdx = 0, phase = 'idle', phaseTimer = 0;

    const projectForPopup = (lng, lat, rotOff) => {
      const r = ring.getBoundingClientRect();
      const cx = r.width / 2, cy = r.height / 2, rad = r.width / 2 * 0.88;
      const L = (lng + GLOBE_OFFSET - rotOff) * Math.PI / 180;
      const La = lat * Math.PI / 180;
      const cl = Math.cos(La);
      const x = cl * Math.sin(L);
      const z = cl * Math.cos(L);
      const y = -Math.sin(La);
      if (z < 0.15) return null;
      return { x: cx + x * rad * 0.88, y: cy + y * rad * 0.88, z };
    };

    const resetPopup = () => {
      if (!popup) return;
      popup.style.display = 'none';
      popup.style.opacity = '0';
      const line = popup.querySelector('.cp-line');
      const card = popup.querySelector('.cp-card');
      line && line.classList.remove('grow');
      if (card) { card.classList.remove('show'); card.style.opacity = '0'; }
    };

    const countUp = (target, dur) => {
      if (!cpCount) return;
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        cpCount.innerHTML = Math.round(target * ease).toLocaleString() + '<span>人</span>';
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    let lastTs = 0, running = false;
    const frame = (ts) => {
      if (!running) return;
      if (!lastTs) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;
      const rotOff = (ts / 1000) * (360 / 90);

      // Draw capital lights
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < caps.length; i++) {
        const c = caps[i];
        const p = project(c.lng, c.lat, rotOff);
        if (!p) continue;
        const dx = p.x - cX, dy = p.y - cY;
        if (dx * dx + dy * dy > radius * radius) continue;

        pulses[i].timer -= dt;
        if (pulses[i].timer <= 0) {
          pulses[i].t = Math.random() > .6 ? (.5 + Math.random() * .5) : 0;
          pulses[i].timer = 1500 + Math.random() * 3000;
        }
        pulses[i].v += (pulses[i].t - pulses[i].v) * .02;

        const baseA = .15 + p.z * .15;
        const pa = pulses[i].v;
        const r0 = 1 + p.z * .8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201,168,76,' + baseA + ')';
        ctx.fill();

        if (pa > .05) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r0 + 3 * pa, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(245,230,184,' + (pa * .6) + ')';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, r0 + 8 * pa, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(201,168,76,' + (pa * .15) + ')';
          ctx.fill();
        }
      }

      // City popup
      if (popup && cpName) {
        if (['show-dot', 'grow-line', 'show-card', 'hold'].includes(phase)) {
          const c = citySet[cityIdx];
          const p = projectForPopup(c.lng, c.lat, rotOff);
          if (p) {
            popup.style.display = 'block';
            popup.style.left = p.x + 'px';
            popup.style.top = p.y + 'px';
            popup.style.opacity = String(Math.min(1, .4 + p.z * .7));
          } else {
            popup.style.opacity = '0';
          }
        }
        phaseTimer -= dt;
        if (phaseTimer <= 0) {
          switch (phase) {
            case 'idle': {
              let tries = 0, found = false;
              while (tries < citySet.length) {
                const ro = (performance.now() / 1000) * (360 / 90);
                const p = projectForPopup(citySet[cityIdx].lng, citySet[cityIdx].lat, ro);
                if (p && p.z > .25) { found = true; break; }
                cityIdx = (cityIdx + 1) % citySet.length; tries++;
              }
              if (!found) { phaseTimer = 600; break; }
              cpName.textContent = citySet[cityIdx].name;
              if (cpCount) cpCount.innerHTML = '0<span>人</span>';
              resetPopup();
              popup.style.display = 'block';
              phase = 'show-dot'; phaseTimer = 350;
              break;
            }
            case 'show-dot':
              popup.querySelector('.cp-line').classList.add('grow');
              phase = 'grow-line'; phaseTimer = 450; break;
            case 'grow-line': {
              const card = popup.querySelector('.cp-card');
              if (card) { card.style.opacity = '1'; card.classList.add('show'); }
              countUp(citySet[cityIdx].count, 900);
              phase = 'show-card'; phaseTimer = 1000; break;
            }
            case 'show-card': phase = 'hold'; phaseTimer = 1400; break;
            case 'hold':
              popup.style.transition = 'opacity .4s ease';
              popup.style.opacity = '0';
              phase = 'fade'; phaseTimer = 450; break;
            case 'fade':
              resetPopup();
              cityIdx = (cityIdx + 1) % citySet.length;
              if (cityIdx % 5 === 0) { phase = 'msg-show'; phaseTimer = 200; }
              else { phase = 'idle'; phaseTimer = 300; }
              break;
            case 'msg-show':
              if (cityMsg) cityMsg.style.opacity = '1';
              phase = 'msg-hold'; phaseTimer = 2800; break;
            case 'msg-hold':
              if (cityMsg) cityMsg.style.opacity = '.6';
              phase = 'msg-fade'; phaseTimer = 900; break;
            case 'msg-fade': phase = 'idle'; phaseTimer = 400; break;
          }
        }
      }

      requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      sync();
      phase = 'idle'; phaseTimer = 0; lastTs = 0;
      requestAnimationFrame(frame);
    };
    const stop = () => { running = false; };

    if (prefersReduce) { start(); return; }
    if ('IntersectionObserver' in window) {
      const io2 = new IntersectionObserver((entries) => {
        entries.forEach(e => { e.isIntersecting ? start() : stop(); });
      }, { threshold: 0.1 });
      io2.observe(ring);
    } else {
      start();
    }
  })();

  /* ── SMOOTH ANCHOR SCROLL ───────────────────────── */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: prefersReduce ? 'auto' : 'smooth', block: 'start' });
  });
})();
