/* =========================================================
   Amine Bouhlali — portfolio interactions (vanilla JS)
   Feature-detected; degrades gracefully on older browsers.
   ========================================================= */
(function () {
  'use strict';

  var DATA = window.PORTFOLIO || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var TZ = 'Africa/Casablanca';

  var userActed = false;
  ['pointerdown', 'keydown'].forEach(function (t) { window.addEventListener(t, function () { userActed = true; }, { once: true, capture: true }); });
  function haptic(ms) { try { if (userActed && navigator.vibrate) navigator.vibrate(ms || 8); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* Damped spring → array of progress samples (0..1, may overshoot). Used to drive WAAPI keyframes. */
  function springSamples(opts) {
    opts = opts || {};
    var k = opts.stiffness || 210, c = opts.damping || 24, m = opts.mass || 1;
    var x = 0, v = 0, dt = 1 / 60, out = [0], i = 0;
    while (i < 240) {
      var f = -k * (x - 1) - c * v;
      v += (f / m) * dt; x += v * dt; out.push(x); i++;
      if (Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01) break;
    }
    out[out.length - 1] = 1;
    return out;
  }

  /* ---------------- Pause offscreen decorative animations ---------------- */
  if ('IntersectionObserver' in window) {
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-paused', !en.isIntersecting); });
    }, { rootMargin: '100px 0px' });
    $$('main > section, .hero__device, .shiplog').forEach(function (el) { pio.observe(el); });
  }
  document.addEventListener('visibilitychange', function () { document.documentElement.classList.toggle('page-hidden', document.hidden); });

  /* ---------------- Viewport height var (mobile toolbars) ---------------- */
  function setVh() { document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px'); }
  setVh(); window.addEventListener('resize', setVh);

  /* ---------------- Clock (Rabat time) ---------------- */
  var fmtTime, fmtDate;
  try {
    fmtTime = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
    fmtDate = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ });
  } catch (e) {
    fmtTime = { format: function (d) { return d.toTimeString().slice(0, 5); } };
    fmtDate = { format: function (d) { return d.toDateString(); } };
  }
  function tick() {
    var d = new Date(), t = fmtTime.format(d);
    var ls = t.replace(/^0/, '');
    setText('#sbClock', t); setText('#lsTime', ls); setText('#miniTime', ls);
    setText('#lsDate', fmtDate.format(d).replace(',', ''));
    setText('#footClock', 'Rabat · ' + t);
  }
  function setText(sel, v) { var el = $(sel); if (el && el.textContent !== v) el.textContent = v; }
  tick(); setInterval(tick, 15000);
  setText('#year', String(new Date().getFullYear()));

  function copyEmail() {
    var EMAIL = 'atlasbytezz@gmail.com';
    var ok = function () { liveActivity('Email copied ✓', '<span class="island__dot"></span>'); haptic(8); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(EMAIL).then(ok, function () { location.href = 'mailto:' + EMAIL; });
    else location.href = 'mailto:' + EMAIL;
  }

  /* ---------------- Toast ---------------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add('is-in');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-in'); }, 2200);
  }

  /* ---------------- Theme (View Transitions circular reveal) ---------------- */
  var themeBtn = $('#themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function (e) {
    var root = document.documentElement;
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    var apply = function () { root.setAttribute('data-theme', next); try { localStorage.setItem('theme', next); } catch (er) {} };
    setTimeout(function () { liveActivity(next === 'dark' ? 'Dark mode' : 'Light mode', '<span class="island__dot"></span>', 1400); }, 300);
    haptic(6);
    if (!document.startViewTransition || reduceMotion) { apply(); return; }
    var x = e.clientX || window.innerWidth - 30, y = e.clientY || 30;
    var r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var vt = document.startViewTransition(apply);
    vt.ready.then(function () {
      root.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + r + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(function () {});
  });

  /* ---------------- Reveal on scroll ---------------- */
  var reveals = $$('.reveal');
  function finishReveal(el) {
    // hand transform back to the element's own transitions (tilt, hover)
    setTimeout(function () { el.classList.remove('reveal', 'is-in'); }, 1300);
  }
  if ('IntersectionObserver' in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); finishReveal(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); finishReveal(el); });
  }

  /* ---------------- Dynamic Island: live activity + quick nav ---------------- */
  var island = $('#island'), islandLabel = $('#islandLabel'), islandLead = $('#islandLead'), islandBtn = $('#islandBtn'), islandPanel = $('#islandPanel'), ring = $('#islandRing');
  var tabs = $$('#tabbar a'), pill = $('#tabPill');
  var sections = $$('main > section');
  var currentSection = null, baseLabel = 'Available for hire', baseLead = null, eventT = 0;
  var DOT = '<span class="island__dot"></span>';
  var SECTION_LABELS = { top: 'Available for hire', work: 'Experience · 2 teams · 3 apps', lab: 'Gesture Lab · 8 live demos', projects: 'Projects · 6 products', contact: 'Say hi · replies within a day' };

  function swapIsland(label, leadHTML) {
    if (!islandLabel) return;
    islandLabel.classList.add('is-swap');
    island.classList.add('is-bump');
    setTimeout(function () {
      islandLabel.textContent = label;
      islandLead.innerHTML = leadHTML || DOT;
      islandLabel.classList.remove('is-swap'); island.classList.remove('is-bump');
    }, 180);
  }
  // Public: show a transient live activity (like iOS), then fall back to the section label
  function liveActivity(label, leadHTML, ms) {
    if (!island || island.classList.contains('is-open')) return;
    clearTimeout(eventT);
    island.classList.add('is-event');
    swapIsland(label, leadHTML);
    eventT = setTimeout(function () { island.classList.remove('is-event'); swapIsland(baseLabel, baseLead); }, ms || 2200);
  }
  window.__liveActivity = liveActivity;
  function setIslandOpen(open) {
    island.classList.toggle('is-open', open);
    $('#statusbar').classList.toggle('is-island-open', open);
    islandPanel.hidden = !open; islandBtn.hidden = open;
    islandBtn.setAttribute('aria-expanded', String(open));
    if (open) { haptic(8); var f = $('a', islandPanel); if (f) f.focus({ preventScroll: true }); }
  }
  if (islandBtn) {
    islandBtn.addEventListener('click', function (e) { e.stopPropagation(); setIslandOpen(true); });
    document.addEventListener('click', function (e) { if (island.classList.contains('is-open') && !island.contains(e.target)) setIslandOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && island.classList.contains('is-open')) { setIslandOpen(false); islandBtn.focus(); } });
    $$('[data-jump]', islandPanel).forEach(function (a) { a.addEventListener('click', function () { setIslandOpen(false); }); });
    $('#islandEmail').addEventListener('click', function () { copyEmail(); setIslandOpen(false); });
  }

  function movePill(link) {
    if (!pill || !link) return;
    pill.style.width = link.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + link.offsetLeft + 'px)';
  }
  function setActive(id) {
    if (id === currentSection) return;
    currentSection = id;
    baseLabel = SECTION_LABELS[id] || baseLabel; baseLead = null;
    if (!island.classList.contains('is-event')) swapIsland(baseLabel, baseLead);
    var tabId = id;
    tabs.forEach(function (a) {
      var on = a.getAttribute('data-tab') === tabId;
      a.classList.toggle('is-active', on);
      if (on) movePill(a);
    });
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var h = document.documentElement.scrollHeight - innerHeight;
      var p = h > 0 ? clamp(scrollY / h, 0, 1) : 0;
      if (ring) ring.style.strokeDashoffset = String(50.27 * (1 - p));
      var mid = innerHeight * 0.4, id = sections[0] && sections[0].id;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= mid) id = sections[i].id;
      }
      setActive(id);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { var a = $('#tabbar a.is-active'); movePill(a); });
  setTimeout(function () { onScroll(); var a = $('#tabbar a.is-active') || tabs[0]; if (a) { a.classList.add('is-active'); movePill(a); } }, 60);
  tabs.forEach(function (a) { a.addEventListener('click', function () { haptic(5); }); });

  /* ---------------- Hero phone tilt ---------------- */
  var phone = $('#heroPhone'), hero = $('#top');
  if (phone && hero && !reduceMotion) {
    var base = { rx: 6, ry: -14 };
    var setTilt = function (nx, ny) {
      phone.style.setProperty('--ry', (base.ry + nx * 26) + 'deg');
      phone.style.setProperty('--rx', (base.rx - ny * 16) + 'deg');
      phone.style.setProperty('--rz', (nx * 2) + 'deg');
      phone.style.setProperty('--gx', (nx * 40) + '%');
    };
    if (finePointer) {
      hero.addEventListener('pointermove', function (e) {
        phone.classList.add('is-tracking');
        setTilt(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5);
      });
      hero.addEventListener('pointerleave', function () {
        phone.classList.remove('is-tracking');
        ['--rx', '--ry', '--rz', '--gx'].forEach(function (p) { phone.style.removeProperty(p); });
      });
    } else if ('DeviceOrientationEvent' in window && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null) return;
        phone.classList.add('is-tracking');
        setTilt(clamp(e.gamma / 45, -0.5, 0.5), clamp((e.beta - 45) / 60, -0.5, 0.5));
      }, { passive: true });
    }
  }

  /* ---------------- "touch." ripple ---------------- */
  var touchWord = $('#touchWord');
  if (touchWord) touchWord.addEventListener('pointerdown', function (e) {
    var r = touchWord.getBoundingClientRect(), s = document.createElement('span');
    var size = Math.max(r.width, r.height) * 2.2;
    s.className = 'ripple'; s.style.width = s.style.height = size + 'px';
    s.style.left = (e.clientX - r.left) + 'px'; s.style.top = (e.clientY - r.top) + 'px';
    touchWord.appendChild(s); haptic(10);
    setTimeout(function () { s.remove(); }, 900);
  });

  /* ---------------- Lock-screen notifications from the apps (tap = open, swipe = dismiss) ---------------- */
  var notifsEl = $('#notifs'), notifsEmpty = $('#notifsEmpty');
  var ICON_HTML = {
    openchair: '<span class="proj-icon proj-icon--openchair"><i></i></span>',
    veto: '<span class="proj-icon proj-icon--veto">RV</span>',
    resumebyjob: '<span class="proj-icon proj-icon--rbj"><b></b></span>',
    vpn: '<span class="proj-icon proj-icon--vpn"><img src="assets/img/vpn/logo.svg" alt=""></span>'
  };
  function appIcon(n, cls) {
    if (n.icon) return '<img class="' + (cls || '') + '" src="' + n.icon + '" alt="">';
    return (ICON_HTML[n.iconHTML] || '').replace('class="proj-icon', 'class="' + (cls || '') + ' proj-icon');
  }
  function notifHTML(n) {
    return '<span class="notif__icon">' + appIcon(n) + '</span><div class="notif__body"><div class="notif__top"><span>' + esc(n.app) + '</span><span>' + esc(n.time) + '</span></div>' +
      '<div class="notif__title">' + esc(n.title) + '</div><div class="notif__text">' + esc(n.body) + '</div></div>';
  }
  var queue = [], qi = 0, MAXN = 4;
  function pushNotif(delay, idx) {
    var list = DATA.notifications || [];
    if (!list.length || !notifsEl) return;
    var n = list[(idx == null ? qi++ : idx) % list.length];
    setTimeout(function () {
      var el = document.createElement('div');
      el.className = 'notif'; el.innerHTML = notifHTML(n); el.setAttribute('role', 'button'); el.tabIndex = 0;
      el.insertAdjacentHTML('beforeend', '<span class="sr-only">. Press Enter to open, Delete to dismiss.</span>');
      notifsEl.appendChild(el); bindSwipe(el, n); haptic(4); notifsEmpty.hidden = true;
    }, delay || 0);
  }
  function renderNotifs() {
    if (!notifsEl || !DATA.notifications) return;
    notifsEl.innerHTML = ''; notifsEmpty.hidden = true; qi = 0;
    var ph = $('#heroPhone');
    MAXN = (ph && ph.offsetHeight < 660) || innerHeight < 700 ? 3 : 4;
    // newest lands on top (column-reverse), so push the first batch backwards: item 0 ends up on top
    for (var i = 0; i < MAXN; i++) pushNotif(700 + i * 650, MAXN - 1 - i);
    qi = MAXN;
  }
  function openFromNotif(el, n) {
    if (!n.open) return;
    openSheet(n.open[0], n.open[1], el);
  }
  function dismiss(el, dir) {
    el.style.transition = 'transform .35s cubic-bezier(.16,1,.3,1), opacity .3s';
    el.style.transform = 'translateX(' + (dir * 120) + '%) rotate(' + (dir * 6) + 'deg)';
    el.style.opacity = '0';
    haptic(8);
    setTimeout(function () {
      var h = el.offsetHeight;
      el.style.transition = 'height .35s cubic-bezier(.16,1,.3,1), margin .35s, padding .35s';
      el.style.height = h + 'px'; el.offsetHeight; // reflow
      el.style.height = '0px'; el.style.paddingTop = el.style.paddingBottom = '0px'; el.style.marginTop = '-7px';
      setTimeout(function () {
        el.remove();
        if (qi < DATA.notifications.length) pushNotif(350); // next app slides in
        else if (!notifsEl.children.length) notifsEmpty.hidden = false;
      }, 360);
    }, 250);
  }
  function bindSwipe(el, n) {
    var sx = 0, sy = 0, dx = 0, st = 0, active = false, moved = false;
    el.addEventListener('pointerdown', function (e) {
      active = true; moved = false; sx = e.clientX; sy = e.clientY; dx = 0; st = performance.now();
      el.classList.add('is-dragging'); el.style.transition = 'none';
      if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', function (e) {
      if (!active) return;
      dx = e.clientX - sx;
      if (Math.abs(dx) > 6) moved = true;
      if (Math.abs(e.clientY - sy) > Math.abs(dx) + 10 && !moved) return;
      el.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx / 40) + 'deg)';
      el.style.opacity = String(1 - Math.min(Math.abs(dx) / 260, 0.6));
    });
    var end = function () {
      if (!active) return; active = false; el.classList.remove('is-dragging');
      var v = dx / Math.max(1, performance.now() - st);
      if (Math.abs(dx) > 90 || Math.abs(v) > 0.6) { dismiss(el, dx > 0 ? 1 : -1); return; }
      el.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1), opacity .3s';
      el.style.transform = ''; el.style.opacity = '';
      if (!moved) openFromNotif(el, n);
    };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    el.addEventListener('keydown', function (e) { if (e.key === 'Delete' || e.key === 'Backspace') dismiss(el, 1); if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFromNotif(el, n); } });
  }
  var replay = $('#notifsReplay');
  if (replay) replay.addEventListener('click', renderNotifs);
  renderNotifs();

  /* ---------------- Ship log ticker ---------------- */
  (function shiplog() {
    var track = $('#shiplog'); if (!track || !DATA.shiplog) return;
    var TAG = { shipped: 'Shipped', built: 'Built', launch: 'Launch', milestone: 'Milestone', oss: 'Open source', design: 'Design', live: 'Live', history: '2016–19' };
    var html = DATA.shiplog.map(function (s) {
      return '<button type="button" class="ship" data-open="' + s[3].join('/') + '"><span class="ship__tag ship__tag--' + s[0] + '">' + TAG[s[0]] + '</span><b>' + esc(s[1]) + '</b>' + esc(s[2]) + '</button>';
    }).join('');
    track.innerHTML = html + html.replace(/class="ship"/g, 'class="ship" aria-hidden="true" tabindex="-1"');
    $$('.ship', track).forEach(function (b) {
      b.addEventListener('click', function () { var o = b.getAttribute('data-open').split('/'); openSheet(o[0], o[1], b); });
    });
  })();

  /* =========================================================
     GESTURE LAB
     ========================================================= */

  /* ---------- Sircles category wheel (bottom-sheet wheel, as in the app) ---------- */
  (function wheelDemo() {
    var wrap = $('#swheel'); if (!wrap) return;
    var ring = $('#swRing'), title = $('#swTitle');
    // white line icons (24x24, stroke) — drawn to match the app's category glyphs
    var I = {
      food: '<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10"/><circle cx="15.5" cy="12" r="5.5"/><circle cx="15.5" cy="12" r="2.6"/>',
      spirit: '<circle cx="12" cy="12" r="9"/><path d="M12 3a4.5 4.5 0 0 1 0 9 4.5 4.5 0 0 0 0 9"/><circle cx="12" cy="7.5" r="1" fill="#fff"/><circle cx="12" cy="16.5" r="1"/>',
      pro: '<circle cx="12" cy="7" r="3.2"/><path d="M5.5 21v-3.5A4.5 4.5 0 0 1 10 13h4a4.5 4.5 0 0 1 4.5 4.5V21"/><path d="M12 13l-1.2 3.5L12 21l1.2-4.5z"/>',
      estate: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10.5 21v-3h3v3"/>',
      kids: '<path d="M12 3l6 7-6 7-6-7z"/><path d="M12 17c0 2 1.5 2 1 4M6 10h12"/>',
      home: '<path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
      fitness: '<path d="M6.5 7v10M4 9v6M17.5 7v10M20 9v6M6.5 12h11"/>',
      furniture: '<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 12a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z"/><path d="M5 17v2M19 17v2"/>',
      bars: '<path d="M5 5h14l-7 8z"/><path d="M12 13v7M8 20h8M15 3l2 3"/>',
      pets: '<ellipse cx="12" cy="16" rx="4" ry="3.4"/><circle cx="6.5" cy="10.5" r="1.8"/><circle cx="17.5" cy="10.5" r="1.8"/><circle cx="9.5" cy="6.5" r="1.8"/><circle cx="14.5" cy="6.5" r="1.8"/>',
      shop: '<path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H7"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="16.5" cy="19" r="1.4"/>',
      health: '<path d="M9.5 4h5v5.5H20v5h-5.5V20h-5v-5.5H4v-5h5.5z"/>',
      beauty: '<circle cx="6.5" cy="17.5" r="2.5"/><circle cx="12.5" cy="17.5" r="2.5"/><path d="M7.8 15.4L15 5M11.2 15.4L5 7"/><path d="M17 21v-6h3v6zM17.5 15l1-5 1 5"/>',
      auto: '<path d="M5 15l1.6-5A2 2 0 0 1 8.5 8.5h7a2 2 0 0 1 1.9 1.5L19 15"/><rect x="3.5" y="15" width="17" height="4" rx="1.5"/><circle cx="7.5" cy="19.5" r="1.2"/><circle cx="16.5" cy="19.5" r="1.2"/>',
      tech: '<path d="M4.5 10.5a11 11 0 0 1 15 0M7.5 13.5a6.5 6.5 0 0 1 9 0"/><circle cx="12" cy="17" r="1.4"/><rect x="5" y="19.5" width="14" height="1.5" rx=".7"/>'
    };
    var CATS = [
      ['Food & Drink', 'food', '#e8f59a', '#c3e14b'], ['Spirituality', 'spirit', '#c8f7c5', '#86dc8a'], ['Professional', 'pro', '#b9f0d9', '#5fd3b0'],
      ['Real Estate', 'estate', '#a8ecef', '#4fc6d4'], ['Kids & Family', 'kids', '#a7dcff', '#4aaef0'], ['Home Services', 'home', '#b8e2ff', '#6cbcf2'],
      ['Fitness', 'fitness', '#d9c7ff', '#a98bf0'], ['Furniture', 'furniture', '#cfc4ff', '#9a8ae6'], ['Bars & Nightlife', 'bars', '#8b8f99', '#4b5060'],
      ['Pets', 'pets', '#f3e2cf', '#d8b58f'], ['Shopping', 'shop', '#c2416b', '#8f1d45'], ['Health', 'health', '#ff8a9a', '#e84a63'],
      ['Beauty', 'beauty', '#ffb8d0', '#f06f9c'], ['Tech & Internet', 'tech', '#ffa99b', '#ef6a5b'], ['Auto', 'auto', '#ffd0a6', '#f7a35c']
    ];
    var N = CATS.length, STEP = 360 / N, A = 0, sel = 0, dir = 1, raf = 0, items = [];
    CATS.forEach(function (c, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'sw2-item';
      b.style.background = 'radial-gradient(circle at 34% 28%, ' + c[2] + ' 0%, ' + c[3] + ' 100%)';
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + I[c[1]] + '</svg>';
      b.setAttribute('aria-label', c[0]);
      b.addEventListener('click', function () { if (!moved) springTo(-i * STEP + Math.round((A + i * STEP) / 360) * 360); });
      ring.appendChild(b); items.push(b);
    });
    function R() { return ring.clientWidth / 2; }
    function render() {
      var r = R(), size = r * Math.PI * 1.8 / N * 1.18;
      items.forEach(function (el, i) {
        var ang = (i * STEP - 90 + A) * Math.PI / 180, x = Math.cos(ang) * r, y = Math.sin(ang) * r;
        // app interpolation: y=-r → 1.5x, y=-0.9r → 1.2x, y=+r → 0.9x; higher items draw on top
        var s = y < -r * 0.9 ? 1.5 - ((y + r) / (r * 0.1)) * 0.3 : 1.2 - ((y + r * 0.9) / (r * 1.9)) * 0.3;
        el.style.width = el.style.height = size + 'px';
        el.style.transform = 'translate(' + (x - size / 2) + 'px,' + (y - size / 2) + 'px) scale(' + s.toFixed(3) + ')';
        el.style.zIndex = String(Math.round((1 - (y + r) / (2 * r)) * N));
      });
      var i = ((Math.round(-A / STEP) % N) + N) % N;
      if (i !== sel) {
        dir = ((i - sel + N) % N) <= N / 2 ? 1 : -1; sel = i; haptic(5);
        title.classList.remove('in-l', 'in-r'); void title.offsetWidth;
        title.textContent = CATS[i][0]; title.classList.add(dir > 0 ? 'in-l' : 'in-r');
        wrap.setAttribute('aria-valuenow', i); wrap.setAttribute('aria-valuetext', CATS[i][0]);
      }
    }
    function springTo(target) {
      cancelAnimationFrame(raf); var v = 0, last = performance.now();
      var step = function (now) {
        var dt = Math.min(0.032, (now - last) / 1000); last = now;
        v += (-170 * (A - target) - 22 * v) * dt; A += v * dt; render();
        if (Math.abs(A - target) < 0.05 && Math.abs(v) < 0.05) { A = target; render(); return; }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    function angleOf(e) { var b = ring.getBoundingClientRect(); return Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180 / Math.PI; }
    var drag = null, moved = false;
    wrap.addEventListener('pointerdown', function (e) { cancelAnimationFrame(raf); drag = { a: angleOf(e) }; moved = false; if (wrap.setPointerCapture) wrap.setPointerCapture(e.pointerId); });
    wrap.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var a = angleOf(e), d = a - drag.a; if (d > 180) d -= 360; if (d < -180) d += 360;
      if (Math.abs(d) > 0.2) moved = true;
      A += d; drag.a = a; render();
    });
    var up = function () { if (!drag) return; drag = null; springTo(Math.round(A / STEP) * STEP); setTimeout(function () { moved = false; }, 0); };
    wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); springTo(Math.round(A / STEP) * STEP - STEP); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); springTo(Math.round(A / STEP) * STEP + STEP); }
    });
    title.textContent = CATS[0][0];
    render(); window.addEventListener('resize', render);
  })();

  /* ---------- Sircles "My Sircle of Trust" (profile grid with edit mode, as in the app) ---------- */
  (function sotDemo() {
    var grid = $('#sot'); if (!grid) return;
    var editBtn = $('#sotEdit'), box = $('#sotw');
    var editing = true;
    var COLS = 5;
    var PALETTE = [['#ffb38a', '#e8590c'], ['#9be7d1', '#0ca678'], ['#ffc2d9', '#d6336c'], ['#b8c4ff', '#4263eb'], ['#e5c3ff', '#ae3ec9'], ['#ffe08a', '#f08c00'], ['#a5e9f5', '#1098ad'], ['#ffc9a8', '#d9480f']];
    var FRIENDS = ['Bob H', 'Sara M', 'Johnny W', 'Jesse L', 'Kenza B', 'Adam R'];
    var EXTRA = ['Nora K', 'Rayan T', 'Maya S'], ex = 0;
    var slots = FRIENDS.map(function (n, i) { return { kind: 'user', name: n, pal: PALETTE[i % PALETTE.length] }; });
    slots.splice(1, 0, { kind: 'ghost', name: 'ShowerBob' });
    slots.push({ kind: 'invite' }, { kind: 'plus' }, { kind: 'locked' });
    function initials(n) { return n.split(' ').map(function (p) { return p[0]; }).join(''); }
    function inner(s) {
      var rm = '<button type="button" class="sot2-rm" aria-label="Remove">×</button>';
      if (s.kind === 'user') return '<span class="sot2-ava" style="background:radial-gradient(circle at 35% 30%,' + s.pal[0] + ',' + s.pal[1] + ')">' + initials(s.name) + rm + '</span><span class="sot2-name">' + s.name + '</span>';
      if (s.kind === 'ghost') return '<span class="sot2-ava sot2-ava--ghost"><svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="4.2" fill="#fff"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0z" fill="#fff"/></svg>' + rm + '</span><span class="sot2-name">' + s.name + '</span>';
      if (s.kind === 'invite') return '<span class="sot2-ava sot2-ava--invite">Invite</span><span class="sot2-name">&nbsp;</span>';
      if (s.kind === 'plus') return '<span class="sot2-ava sot2-ava--plus"><b>+</b>Invite</span><span class="sot2-name">&nbsp;</span>';
      return '<span class="sot2-ava sot2-ava--locked"><svg viewBox="0 0 24 24"><rect x="6" y="11" width="12" height="9" rx="2" fill="currentColor"/><path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" fill="none" stroke="currentColor" stroke-width="2"/></svg></span><span class="sot2-name">&nbsp;</span>';
    }
    function cell() { var w = grid.clientWidth / COLS; return { w: w, h: w * 1.18 }; }
    function pos(n) { var c = cell(); return { x: (n % COLS) * c.w, y: Math.floor(n / COLS) * c.h }; }
    function movable(s) { return s.kind === 'user' || s.kind === 'ghost'; }
    function build() {
      grid.innerHTML = '';
      slots.forEach(function (s) { var el = document.createElement('div'); s.el = el; paintSlot(s); grid.appendChild(el); });
      layout(true);
    }
    function paintSlot(s, anim) {
      s.el.className = 'sot2-slot sot2-slot--' + s.kind + (anim ? ' is-in' : '');
      s.el.innerHTML = inner(s);
      var rm = s.el.querySelector('.sot2-rm');
      if (rm) {
        rm.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
        rm.addEventListener('click', function (e) {
          e.stopPropagation(); haptic(10); s.el.classList.add('is-out');
          setTimeout(function () { s.kind = 'invite'; paintSlot(s, true); }, 180);
        });
      }
    }
    function layout(instant) {
      var c = cell();
      grid.style.height = Math.ceil(slots.length / COLS) * c.h + 'px';
      slots.forEach(function (s, n) {
        if (s.dragging) return;
        var p = pos(n);
        s.el.style.width = c.w + 'px'; s.el.style.height = c.h + 'px';
        if (instant) s.el.style.transition = 'none';
        s.el.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px)';
        if (instant) { void s.el.offsetWidth; s.el.style.transition = ''; }
      });
    }
    function slotFromEvent(e) { for (var i = 0; i < slots.length; i++) if (slots[i].el.contains(e.target)) return slots[i]; return null; }
    function orderAt(x, y) {
      var c = cell();
      return clamp(Math.round(y / c.h), 0, Math.ceil(slots.length / COLS) - 1) * COLS + clamp(Math.round(x / c.w), 0, COLS - 1);
    }
    function setEditing() {}
    var drag = null;
    grid.addEventListener('pointerdown', function (e) {
      var s = slotFromEvent(e); if (!s) return;
      if (s.kind === 'invite' || s.kind === 'plus') {
        var name = EXTRA[ex++ % EXTRA.length]; haptic([8, 30, 8]);
        s.kind = 'user'; s.name = name; s.pal = PALETTE[(ex + 3) % PALETTE.length]; paintSlot(s, true);
        return;
      }
      if (!movable(s)) return;
      var p = pos(slots.indexOf(s));
      drag = { s: s, sx: e.clientX, sy: e.clientY, x0: p.x, y0: p.y, mouse: e.pointerType === 'mouse', timer: 0 };
      if (grid.setPointerCapture) grid.setPointerCapture(e.pointerId);
      // like the app: drag lives in edit mode; outside edit mode a long-press switches it on
      if (!drag.mouse) drag.timer = setTimeout(function () { if (drag) lift(); }, 160);
    });
    function lift() { drag.s.dragging = true; drag.s.el.classList.add('is-lifted'); haptic(12); }
    grid.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!drag.s.dragging) {
        if (editing && drag.mouse && Math.hypot(dx, dy) > 3) lift();
        else { if (Math.hypot(dx, dy) > 10) { clearTimeout(drag.timer); drag = null; } return; }
      }
      var x = drag.x0 + dx, y = drag.y0 + dy;
      drag.s.el.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(1.1)';
      var to = orderAt(x, y), from = slots.indexOf(drag.s);
      if (to !== from && to < slots.length && movable(slots[to])) { var o = slots[to]; slots[to] = drag.s; slots[from] = o; haptic(5); layout(); }
    });
    var end = function () {
      if (!drag) return; clearTimeout(drag.timer);
      var s = drag.s; drag = null;
      if (s.dragging) { s.dragging = false; s.el.classList.remove('is-lifted'); layout(); }
    };
    grid.addEventListener('pointerup', end); grid.addEventListener('pointercancel', end);
    grid.addEventListener('touchmove', function (e) { if (drag && drag.s.dragging) e.preventDefault(); }, { passive: false });
    grid.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    window.addEventListener('resize', function () { layout(true); });
    build();
  })();

  /* ---------- Actionable notification (Gemography) ---------- */
  (function actionNotif() {
    var host = $('#actionNotif'), toastBox = $('#miniToast'), counter = $('#miniCounter');
    if (!host) return;
    var reqs = [
      { name: 'Sara M.', role: 'Lead iOS Developer', from: 'Oct 01', to: 'Oct 09', days: 7, note: 'Feeling tired, need some rest' },
      { name: 'Youssef A.', role: 'Backend Engineer', from: 'Dec 23', to: 'Dec 31', days: 6, note: 'Family trip to Chefchaouen' },
      { name: 'Kenza B.', role: 'Product Designer', from: 'Nov 14', to: 'Nov 15', days: 2, note: 'Moving apartments' },
      { name: 'Omar T.', role: 'QA Engineer', from: 'Jan 06', to: 'Jan 10', days: 5, note: 'Wedding in Fès 🎉' }
    ];
    var i = 0, handled = 0;
    function show() {
      var r = reqs[i % reqs.length]; i++;
      host.innerHTML = '<div class="anotif" tabindex="0" role="button" aria-expanded="false">' +
        '<div class="anotif__row"><img class="anotif__icon" src="assets/img/popmanager/icon.jpg" alt="">' +
        '<div style="flex:1;min-width:0"><div class="anotif__top"><span>POP Manager</span><span>now</span></div>' +
        '<div class="anotif__title">' + esc(r.name) + ' requested ' + r.days + ' days off</div>' +
        '<div class="anotif__dates">' + r.from + ' → ' + r.to + '</div>' +
        '<div class="anotif__quote">“' + esc(r.note) + '” · ' + esc(r.role) + '</div></div></div>' +
        '<div class="anotif__actions"><div><div class="row"><button type="button" data-act="decline">Decline</button><button type="button" data-act="approve">Approve</button></div></div></div></div>';
      var n = host.firstChild, holdT, held = false;
      var toggle = function (force) {
        var open = typeof force === 'boolean' ? force : !n.classList.contains('is-open');
        n.classList.toggle('is-open', open); n.setAttribute('aria-expanded', String(open)); haptic(open ? 12 : 4);
      };
      n.addEventListener('pointerdown', function (e) {
        if (e.target.closest('button')) return;
        held = false; n.classList.add('is-pressing');
        holdT = setTimeout(function () { held = true; n.classList.remove('is-pressing'); toggle(true); }, 380);
      });
      var cancel = function () { clearTimeout(holdT); n.classList.remove('is-pressing'); };
      n.addEventListener('pointerup', function (e) { cancel(); if (!held && !e.target.closest('button')) toggle(); });
      n.addEventListener('pointerleave', cancel); n.addEventListener('pointercancel', cancel);
      n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      $$('button', n).forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          var ok = b.getAttribute('data-act') === 'approve';
          haptic(ok ? [10, 40, 10] : 14);
          n.classList.add('is-done'); handled++;
          counter.textContent = handled + ' handled without opening the app';
          toastBox.innerHTML = ok ? '<svg class="ic"><use href="#i-check"/></svg> Approved · ' + esc(r.name) + ' notified' : 'Declined · ' + esc(r.name) + ' notified';
          toastBox.classList.add('is-in');
          setTimeout(function () { toastBox.classList.remove('is-in'); }, 1600);
          setTimeout(show, 1500);
        });
      });
    }
    show();
  })();

  /* ---------- "See it in the app" toggles ---------- */
  $$('[data-prod]').forEach(function (stage) {
    var btn = $('.prod-btn', stage);
    btn.addEventListener('click', function () {
      var on = !stage.classList.contains('is-prod');
      stage.classList.toggle('is-prod', on); btn.setAttribute('aria-pressed', String(on)); haptic(6);
    });
  });

  /* ---------- Sircles: topic-threaded chat with a swipeable topic pager ---------- */
  (function topicPagerDemo() {
    var root = $('#tpager'); if (!root) return;
    var row = $('#tpRow'), rail = $('#tpRail'), ind = $('#tpInd'), view = $('#tpView'), pagesEl = $('#tpPages');
    var form = $('#tpForm'), input = $('#tpInput');
    var PEOPLE = { Sara: '#ff7a59', Youssef: '#36d399', Kenza: '#f06595', Omar: '#5c7cfa' };
    var TOPICS = [
      { name: 'Main chat', ava: 'B', c: 'linear-gradient(135deg,#33b6ff,#7b6cff)', main: true,
        msgs: [['Sara', 'Who’s free Saturday?'], ['me', 'Me! Beach?'], ['Youssef', 'Made a topic for it 👉']],
        replies: ['Same here', 'Let’s do it', 'Count me in 🙌'] },
      { name: 'Weekend', ava: '🌊', c: '#d9f2ff',
        msgs: [['Youssef', 'Bouznika, leave at 9'], ['Kenza', 'I’ll drive'], ['me', 'Bringing the speaker 🔊']],
        replies: ['Snacks on me 🍉', 'Group photo this time', 'Skhirat instead?'] },
      { name: 'Movie night', ava: '🍿', c: '#ffe8cc', card: ['🎬', '#ffe8cc', 'Dune: Part Two', '3 friends loved it'],
        msgs: [['Kenza', 'Megarama at 9?'], ['me', 'Booking seats']], replies: ['Popcorn is on me 🍿', 'No spoilers here!!'] },
      { name: 'Food', ava: '🍜', c: '#ffe3e3', card: ['📍', '#ffe3e3', 'Café Clock', 'Checked in by Sara'],
        msgs: [['Sara', 'Their camel burger 🤯']], replies: ['Adding it to my circle', 'Friday lunch?'] },
      { name: 'Gym', ava: '🏋️', c: '#d3f9d8',
        msgs: [['Omar', 'Leg day 18:00'], ['me', 'Skipping. Again.'], ['Omar', '😑']], replies: ['No excuses 💪', 'See you at 6'] }
    ];
    var N = TOPICS.length, idx = 0, items = [], pages = [], x = 0, raf = 0;
    function bubble(who, text, pending) {
      var el = document.createElement('div');
      if (who === 'me') { el.className = 'tp-msg tp-msg--me'; el.innerHTML = esc(text) + '<small class="tp-meta">' + (pending ? '<svg class="ic"><use href="#i-clock"/></svg>' : '<svg class="ic"><use href="#i-check"/></svg>') + '</small>'; }
      else { el.className = 'tp-msg'; el.style.setProperty('--c', PEOPLE[who] || '#33b6ff'); el.innerHTML = '<b>' + who + '</b>' + esc(text); }
      var last = 0;
      el.addEventListener('pointerup', function () { var now = Date.now(); if (now - last < 320) react(el); last = now; });
      el.addEventListener('dblclick', function () { react(el); });
      return el;
    }
    function react(el) {
      if (el.querySelector('.tp-react')) return;
      var r = document.createElement('span'); r.className = 'tp-react'; r.textContent = '❤️'; el.appendChild(r); haptic(10);
    }
    TOPICS.forEach(function (t, i) {
      var it = document.createElement('button'); it.type = 'button'; it.className = 'tp-item';
      it.innerHTML = '<span class="tp-ava' + (t.main ? ' tp-ava--main' : '') + '" style="--c:' + t.c + '">' + t.ava + '<span class="tp-typing"><i></i><i></i><i></i></span><span class="tp-badge"></span></span><span class="tp-name">' + t.name + '</span>';
      it.addEventListener('click', function () { go(i); });
      row.appendChild(it); items.push(it);
      var pg = document.createElement('div'); pg.className = 'tp-page';
      pg.innerHTML = '<p class="tp-page__title">' + (t.main ? 'Main chat' : '# ' + t.name) + '</p>' +
        (t.card ? '<div class="tp-card"><span style="--c:' + t.card[1] + '">' + t.card[0] + '</span><div><b>' + t.card[2] + '</b><small>' + t.card[3] + '</small></div></div>' : '');
      t.msgs.forEach(function (m) { pg.appendChild(bubble(m[0], m[1])); });
      pagesEl.appendChild(pg); pages.push(pg); t.unread = 0;
    });
    function W() { return view.clientWidth; }
    function centre(i) { var el = items[i]; return el.offsetLeft + el.offsetWidth / 2; }
    function paint(progress) {
      pagesEl.style.transform = 'translate3d(' + (-progress * W()) + 'px,0,0)';
      var i0 = clamp(Math.floor(progress), 0, N - 1), i1 = clamp(i0 + 1, 0, N - 1), f = clamp(progress - i0, 0, 1);
      var cx = centre(i0) + (centre(i1) - centre(i0)) * f, w = 26 + Math.sin(f * Math.PI) * 18;
      ind.style.width = w + 'px'; ind.style.transform = 'translate3d(' + (cx - w / 2) + 'px,0,0)';
    }
    function badge(i) { var b = items[i].querySelector('.tp-badge'); b.textContent = TOPICS[i].unread || ''; items[i].classList.toggle('has-unread', TOPICS[i].unread > 0); }
    function setActive(i) {
      idx = i; TOPICS[i].unread = 0; badge(i);
      items.forEach(function (el, k) { el.classList.toggle('is-active', k === i); });
      input.placeholder = 'Message ' + (TOPICS[i].main ? 'main chat' : '#' + TOPICS[i].name.toLowerCase());
      var target = Math.max(0, centre(i) - rail.clientWidth / 2);
      if (rail.scrollTo) rail.scrollTo({ left: target, behavior: 'smooth' }); else rail.scrollLeft = target;
    }
    function animateTo(target) {
      cancelAnimationFrame(raf);
      var p = x, v = 0, last = performance.now();
      var step = function (now) {
        var dt = Math.min(0.032, (now - last) / 1000); last = now;
        v += (-200 * (p - target) - 24 * v) * dt; p += v * dt; x = p; paint(p);
        if (Math.abs(p - target) < 0.001 && Math.abs(v) < 0.01) { x = target; paint(target); return; }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    function go(i) { i = clamp(i, 0, N - 1); if (i !== idx) haptic(6); setActive(i); animateTo(i); }
    function scrollEnd(pg) { pg.scrollTop = pg.scrollHeight; }
    // drag between topics
    var drag = null;
    view.addEventListener('pointerdown', function (e) { cancelAnimationFrame(raf); drag = { sx: e.clientX, sy: e.clientY, x0: x, t: performance.now(), lx: e.clientX, v: 0, locked: null }; });
    view.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (drag.locked === null && Math.abs(dx) + Math.abs(dy) > 6) { drag.locked = Math.abs(dx) > Math.abs(dy); if (drag.locked && view.setPointerCapture) view.setPointerCapture(e.pointerId); }
      if (!drag.locked) return;
      var now = performance.now();
      drag.v = (e.clientX - drag.lx) / Math.max(1, now - drag.t); drag.lx = e.clientX; drag.t = now;
      var p = drag.x0 - dx / W();
      if (p < 0) p = -Math.pow(-p, 0.6) * 0.35;
      if (p > N - 1) p = N - 1 + Math.pow(p - (N - 1), 0.6) * 0.35;
      x = p; paint(p);
      var near = clamp(Math.round(p), 0, N - 1);
      if (near !== idx) { items.forEach(function (el, k) { el.classList.toggle('is-active', k === near); }); idx = near; haptic(4); }
    });
    var up = function () {
      if (!drag) return;
      var target = Math.round(x - drag.v * 90 / W());
      if (drag.locked) go(clamp(target, 0, N - 1)); else animateTo(idx);
      drag = null;
    };
    view.addEventListener('pointerup', up); view.addEventListener('pointercancel', up);
    window.addEventListener('resize', function () { paint(x); });
    // send: optimistic → delivered → typing → reply, scoped to the current topic
    var replyT;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim(); if (!text) return;
      input.value = ''; haptic(6);
      var ti = idx, t = TOPICS[ti], pg = pages[ti];
      var el = bubble('me', text, true); pg.appendChild(el); scrollEnd(pg);
      setTimeout(function () { var m = el.querySelector('.tp-meta'); if (m) m.innerHTML = '<svg class="ic"><use href="#i-check"/></svg>'; }, 600);
      clearTimeout(replyT);
      replyT = setTimeout(function () {
        items[ti].classList.add('is-typing');
        setTimeout(function () {
          items[ti].classList.remove('is-typing');
          var names = Object.keys(PEOPLE), who = names[(text.length + ti) % names.length];
          pg.appendChild(bubble(who, t.replies[(text.length) % t.replies.length])); scrollEnd(pg);
          if (ti !== idx) { t.unread++; badge(ti); }
        }, 1300);
      }, 800);
    });
    // other topics stay alive: typing badges + unread counts while visible
    var visible = false, pings = 0;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.4 }).observe(root);
    setInterval(function () {
      if (!visible || document.hidden || pings > 6) return;
      var k = 1 + (pings % (N - 1)); if (k === idx) k = (k % (N - 1)) + 1;
      var t = TOPICS[k];
      items[k].classList.add('is-typing');
      setTimeout(function () {
        items[k].classList.remove('is-typing');
        var names = Object.keys(PEOPLE);
        pages[k].appendChild(bubble(names[pings % names.length], t.replies[pings % t.replies.length])); scrollEnd(pages[k]);
        if (k !== idx) { t.unread++; badge(k); }
      }, 1800);
      pings++;
    }, 6000);
    // drag the topic rail with a mouse (touch scrolls natively); a drag never counts as a tap
    var rd = null, railMoved = false, rraf = 0;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      cancelAnimationFrame(rraf); railMoved = false;
      rd = { x: e.clientX, s: rail.scrollLeft, lx: e.clientX, t: performance.now(), v: 0 };
    });
    window.addEventListener('pointermove', function (e) {
      if (!rd) return;
      var dx = e.clientX - rd.x; if (Math.abs(dx) > 4) railMoved = true;
      var now = performance.now(); rd.v = (rd.lx - e.clientX) / Math.max(1, now - rd.t); rd.lx = e.clientX; rd.t = now;
      rail.scrollLeft = rd.s - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!rd) return; var v = rd.v * 16; rd = null;
      var step = function () { v *= 0.92; rail.scrollLeft += v; if (Math.abs(v) > 0.3) rraf = requestAnimationFrame(step); };
      rraf = requestAnimationFrame(step);
    });
    rail.addEventListener('click', function (e) { if (railMoved) { e.stopPropagation(); e.preventDefault(); railMoved = false; } }, true);
    rail.addEventListener('wheel', function (e) { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { rail.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });
    setActive(0); paint(0);
  })();

  /* ---------- Gemography: leave calendar with range selection ---------- */
  (function leaveCalendarDemo() {
    var root = $('#lcal'); if (!root) return;
    var grid = $('#lcalGrid'), title = $('#lcalTitle'), summary = $('#lcalSum'), send = $('#lcalSend');
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var HOLIDAYS = { '2026-7-30': 'Throne Day', '2026-8-14': 'Oued Ed-Dahab Day', '2026-8-20': 'Revolution Day', '2026-8-21': 'Youth Day', '2026-11-6': 'Green March', '2026-11-18': 'Independence Day' };
    var y = 2026, m = 6, start = null, end = null, dragging = false, cells = [];
    function key(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
    function same(a, b) { return a && b && a.getTime() === b.getTime(); }
    function inRange(d) { if (!start) return false; var e = end || start; var a = start < e ? start : e, b = start < e ? e : start; return d >= a && d <= b; }
    function workdays(a, b) {
      var n = 0, d = new Date(a);
      while (d <= b) { var wd = d.getDay(); if (wd !== 0 && wd !== 6 && !HOLIDAYS[key(d)]) n++; d.setDate(d.getDate() + 1); }
      return n;
    }
    function fmt(d) { return MONTHS[d.getMonth()].slice(0, 3) + ' ' + String(d.getDate()).padStart(2, '0'); }
    function render(dir) {
      title.textContent = MONTHS[m] + ' ' + y;
      var first = new Date(y, m, 1), offset = (first.getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
      var html = '';
      for (var i = 0; i < offset; i++) html += '<span class="lcal__pad"></span>';
      for (var dd = 1; dd <= days; dd++) {
        var d = new Date(y, m, dd), k = key(d), wd = d.getDay();
        html += '<button type="button" class="lcal__day' + (wd === 0 || wd === 6 ? ' is-weekend' : '') + (HOLIDAYS[k] ? ' is-holiday' : '') + '" data-d="' + dd + '"' + (HOLIDAYS[k] ? ' title="' + HOLIDAYS[k] + '"' : '') + '><span>' + dd + '</span></button>';
      }
      grid.innerHTML = html; cells = $$('.lcal__day', grid);
      if (dir && grid.animate) grid.animate([{ transform: 'translateX(' + (dir * 30) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' });
      paint();
    }
    function paint() {
      var e = end || start, a = start && (start < e ? start : e), b = start && (start < e ? e : start);
      cells.forEach(function (c) {
        var d = new Date(y, m, +c.getAttribute('data-d'));
        var on = inRange(d);
        c.classList.toggle('is-in', on);
        c.classList.toggle('is-start', on && same(d, a));
        c.classList.toggle('is-end', on && same(d, b));
      });
      if (!start) { summary.innerHTML = 'Pick your first day off'; send.disabled = true; return; }
      var n = workdays(a, b), hol = 0, dd = new Date(a);
      while (dd <= b) { if (HOLIDAYS[key(dd)]) hol++; dd.setDate(dd.getDate() + 1); }
      summary.innerHTML = '<b>' + fmt(a) + (same(a, b) ? '' : ' → ' + fmt(b)) + '</b> · ' + n + ' working day' + (n === 1 ? '' : 's') + (hol ? ' <em>· ' + hol + ' holiday' + (hol > 1 ? 's' : '') + ' skipped</em>' : '');
      send.disabled = false;
    }
    function dayAt(e) { var el = document.elementFromPoint(e.clientX, e.clientY); el = el && el.closest && el.closest('.lcal__day'); return el ? new Date(y, m, +el.getAttribute('data-d')) : null; }
    grid.addEventListener('pointerdown', function (e) {
      var d = dayAt(e); if (!d) return;
      dragging = true; start = d; end = null; haptic(6); paint();
      if (grid.setPointerCapture) grid.setPointerCapture(e.pointerId);
    });
    grid.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var d = dayAt(e); if (d && !same(d, end)) { end = d; haptic(3); paint(); }
    });
    var up = function () { dragging = false; };
    grid.addEventListener('pointerup', up); grid.addEventListener('pointercancel', up);
    $('#lcalPrev').addEventListener('click', function () { m--; if (m < 0) { m = 11; y--; } start = end = null; render(-1); haptic(4); });
    $('#lcalNext').addEventListener('click', function () { m++; if (m > 11) { m = 0; y++; } start = end = null; render(1); haptic(4); });
    send.addEventListener('click', function () {
      if (!start) return;
      haptic([10, 40, 10]);
      send.textContent = 'Sent ✓'; send.disabled = true;
      setTimeout(function () { start = end = null; send.textContent = 'Request'; paint(); }, 1600);
    });
    render(0);
  })();

  /* ---------- Gymo: ruler picker ---------- */
  (function rulerDemo() {
    var track = $('#rulerTrack'); if (!track) return;
    var ticksEl = $('#rulerTicks'), valEl = $('#rulerVal'), unitEl = $('#rulerUnit');
    var TICK = 12, unit = 'kg', range = { kg: [30, 200], lb: [66, 440] }, value = 72, raf = 0;
    function render() {
      var r = range[unit], html = '<span class="pad"></span>';
      for (var v = r[0]; v <= r[1]; v++) {
        var cls = v % 10 === 0 ? 'm10' : v % 5 === 0 ? 'm5' : '';
        html += '<i class="' + cls + '">' + (v % 10 === 0 ? '<span>' + v + '</span>' : '') + '</i>';
      }
      ticksEl.innerHTML = html + '<span class="pad"></span>';
      var pad = track.clientWidth / 2 - TICK / 2;
      $$('.pad', ticksEl).forEach(function (p) { p.style.width = pad + 'px'; });
    }
    function scrollToValue(v, smooth) {
      var x = (v - range[unit][0]) * TICK;
      if (smooth && track.scrollTo) track.scrollTo({ left: x, behavior: 'smooth' }); else track.scrollLeft = x;
    }
    function read() {
      var v = clamp(Math.round(track.scrollLeft / TICK) + range[unit][0], range[unit][0], range[unit][1]);
      if (v !== value) { value = v; valEl.textContent = v; haptic(3); }
    }
    track.addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(read); }, { passive: true });
    render(); scrollToValue(value);
    window.addEventListener('resize', function () { render(); scrollToValue(value); });
    $$('.ruler__units button').forEach(function (b) {
      b.addEventListener('click', function () {
        var u = b.getAttribute('data-unit'); if (u === unit) return;
        var kg = unit === 'kg' ? value : value / 2.20462;
        unit = u; $$('.ruler__units button').forEach(function (x) { x.classList.toggle('is-active', x === b); });
        unitEl.textContent = u; render();
        value = Math.round(u === 'kg' ? kg : kg * 2.20462); valEl.textContent = value; scrollToValue(value); haptic(6);
      });
    });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollToValue(value + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToValue(value - 1, true); }
    });
    // mouse drag with momentum (touch uses native scrolling)
    var drag = null, mraf = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      cancelAnimationFrame(mraf);
      drag = { x: e.clientX, s: track.scrollLeft, v: 0, t: performance.now(), lx: e.clientX };
      track.style.scrollSnapType = 'none'; track.style.cursor = 'grabbing';
      if (track.setPointerCapture) track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var now = performance.now();
      drag.v = (drag.lx - e.clientX) / Math.max(1, now - drag.t); drag.lx = e.clientX; drag.t = now;
      track.scrollLeft = drag.s + (drag.x - e.clientX);
    });
    var up = function () {
      if (!drag) return;
      var v = drag.v * 16; drag = null; track.style.cursor = '';
      var step = function () {
        v *= 0.92; track.scrollLeft += v;
        if (Math.abs(v) > 0.4) mraf = requestAnimationFrame(step);
        else { track.style.scrollSnapType = ''; scrollToValue(value, true); }
      };
      mraf = requestAnimationFrame(step);
    };
    track.addEventListener('pointerup', up); track.addEventListener('pointercancel', up);
  })();

  /* ---------- RAP Veto: live leaderboard voting ---------- */
  (function boardDemo() {
    var list = $('#boardList'); if (!list) return;
    var left = $('#boardLeft'), board = $('#board');
    var songs = [
      { n: 'OBSESSED', a: 'U · Najm', v: 30, g: 'linear-gradient(140deg,#FF5A3C,#7A1FA2)' },
      { n: 'GHALAT', a: 'GHALAT · Najm', v: 28, g: 'linear-gradient(140deg,#E03131,#FFD43B)' },
      { n: 'SKUUMA', a: 'SKUUMA · Mobench', v: 27, g: 'linear-gradient(140deg,#1971C2,#63E6BE)' },
      { n: 'Hermes', a: 'Hermes · Caspr', v: 25, g: 'linear-gradient(140deg,#7048E8,#4DABF7)' },
      { n: 'AGAIN', a: 'AGAIN · LUZI', v: 24, g: 'linear-gradient(140deg,#E8590C,#F08C00)' }
    ];
    var votes = 5, ROW = 58;
    var buy = document.createElement('div');
    buy.className = 'board__buy'; buy.innerHTML = '<span>Out of free votes</span><button type="button">Get 10 votes</button>';
    board.appendChild(buy);
    buy.querySelector('button').addEventListener('click', function () { votes = 10; buy.classList.remove('is-in'); updateLeft(); haptic([8, 30, 8]); });
    songs.forEach(function (s) {
      var li = document.createElement('li'); li.className = 'board__row';
      li.innerHTML = '<span class="board__rank"></span><span class="board__cover" style="--g:' + s.g + '"></span><span class="board__name"><b>' + s.n + '</b><small>' + s.a + '</small></span><span class="board__count">' + s.v + '</span><button type="button" class="board__vote" aria-label="Vote for ' + s.n + '"><svg viewBox="0 0 24 24"><path d="M12 19V5m0 0-6 6m6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
      s.el = li; list.appendChild(li);
      li.querySelector('.board__vote').addEventListener('click', function () { vote(s); });
    });
    function layout() {
      var sorted = songs.slice().sort(function (a, b) { return b.v - a.v; });
      sorted.forEach(function (s, i) {
        s.el.style.transform = 'translateY(' + (i * ROW) + 'px)';
        s.el.querySelector('.board__rank').textContent = i + 1;
        s.el.classList.toggle('is-top', i === 0);
        s.rank = i;
      });
    }
    function updateLeft() { left.textContent = votes + (votes === 1 ? ' vote left' : ' votes left'); left.classList.toggle('is-out', votes === 0); }
    function vote(s) {
      if (votes <= 0) { buy.classList.add('is-in'); haptic(20); return; }
      votes--; updateLeft();
      var before = s.rank;
      s.v++; var c = s.el.querySelector('.board__count');
      c.textContent = s.v; c.classList.remove('is-bump'); void c.offsetWidth; c.classList.add('is-bump');
      var plus = document.createElement('span'); plus.className = 'board__plus'; plus.textContent = '+1'; c.appendChild(plus);
      setTimeout(function () { plus.remove(); }, 800);
      haptic(8); layout();
      if (votes === 0) setTimeout(function () { buy.classList.add('is-in'); }, 500);
    }
    layout(); updateLeft();
  })();

  /* ---------- RAP Veto: share card variants ---------- */
  (function shareDemo() {
    var card = $('#shareCard'); if (!card) return;
    var canvas = card.parentElement;
    var RATIO = { story: [9, 16, 16], portrait: [4, 5, 16], square: [1, 1, 16], sticker: [1, 1, 999] };
    var current = 'story';
    function size(v) {
      var r = RATIO[v], cw = canvas.clientWidth, ch = canvas.clientHeight;
      var h = Math.min(ch, cw * 0.86 * r[1] / r[0]);
      if (v === 'sticker') h = Math.min(ch, cw) * 0.62;
      var w = h * r[0] / r[1];
      card.style.width = w + 'px'; card.style.height = h + 'px'; card.style.aspectRatio = 'auto';
      card.style.borderRadius = (v === 'sticker' ? h / 2 : 16) + 'px';
      card.setAttribute('data-v', v);
    }
    card.style.transition = 'width .6s cubic-bezier(.34,1.4,.64,1), height .6s cubic-bezier(.34,1.4,.64,1), border-radius .5s cubic-bezier(.34,1.4,.64,1)';
    size(current);
    window.addEventListener('resize', function () { size(current); });
    $$('#shareTabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        current = b.getAttribute('data-v'); size(current); haptic(6);
        $$('#shareTabs button').forEach(function (x) { x.classList.toggle('is-active', x === b); });
      });
    });
  })();

  /* =========================================================
     SHEETS (case studies + projects)
     ========================================================= */
  var sheet = $('#sheet'), panel = sheet && $('.sheet__panel', sheet), content = $('#sheetContent'), scroller = $('#sheetScroll');
  var opener = null, openKey = null, pushed = false, animating = false;
  var ICONS = { apple: 'i-apple', github: 'i-github', ext: 'i-ext', play: 'i-play' };

  function linkBtns(links) {
    return (links || []).map(function (l) {
      return '<a class="btn magnetic" href="' + l.href + '" target="_blank" rel="noopener"><svg class="ic"><use href="#' + (ICONS[l.icon] || 'i-ext') + '"/></svg>' + esc(l.label) + '</a>';
    }).join('');
  }
  function factsHTML(f) { return '<dl class="sh-facts">' + f.map(function (x) { return '<div><dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd></div>'; }).join('') + '</dl>'; }
  function chipsHTML(a) { return '<ul class="chips chips--sm">' + a.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>'; }
  function galleryHTML(g) {
    if (!g) return '';
    var items = g.images.map(function (im) {
      var type = g.type, src = im, label = '';
      if (g.type === 'mixed') { type = im[0]; src = im[1]; label = im[2] || ''; }
      else if (g.type === 'browser') { src = im[0]; label = im[1]; }
      if (type === 'browser') return '<div class="gallery__item gallery__item--browser" data-src="' + src + '"><div class="browser"><div class="browser__bar"><i></i><i></i><i></i><span>' + esc(label) + '</span></div><img src="' + src + '" alt="' + esc(label) + '" loading="lazy"></div></div>';
      if (type === 'mac') return '<div class="gallery__item gallery__item--mac" data-src="' + src + '"><img src="' + src + '" alt="" loading="lazy"></div>';
      return '<div class="gallery__item gallery__item--phone" data-src="' + src + '"><img src="' + src + '" alt="" loading="lazy"></div>';
    }).join('');
    return '<div class="gallery"><div class="gallery__head"><p class="sh-label" style="margin:0">' + esc(g.caption || 'Screens') + '</p>' +
      '<div class="gallery__nav"><button class="icon-btn" data-gal="-1" aria-label="Previous"><svg class="ic" style="transform:scaleX(-1)"><use href="#i-chev"/></svg></button><button class="icon-btn" data-gal="1" aria-label="Next"><svg class="ic"><use href="#i-chev"/></svg></button></div></div>' +
      '<div class="gallery__track">' + items + '</div></div>';
  }
  function heroHTML(d, iconHTML) {
    return '<header class="sh-hero' + (d.light ? ' sh-hero--light' : '') + '" style="--a1:' + d.accent + ';--a2:' + (d.accent2 || d.accent) + '">' +
      '<div class="sh-hero__bg"></div><div class="sh-hero__inner">' +
      '<p class="sh-kind">' + esc(d.kind) + (d.period ? ' · ' + esc(d.period) : '') + '</p>' +
      '<div class="sh-title">' + iconHTML + '<h2 id="sheetTitle">' + esc(d.title) + '</h2></div>' +
      '<p class="sh-tagline">' + esc(d.tagline) + '</p>' +
      '<div class="sh-links">' + linkBtns(d.links) + '</div></div></header>';
  }
  function mediaItems(d) {
    var out = [];
    if (d.video) out.push({ t: 'video', src: d.video.src, poster: d.video.poster, orient: d.video.orient });
    var gal = function () { if (d.gallery) d.gallery.images.forEach(function (im) {
      var g = d.gallery;
      if (g.type === 'mixed') out.push({ t: im[0], src: im[1], label: '', bar: im[2] || '' });
      else if (g.type === 'browser') out.push({ t: 'browser', src: im[0], bar: im[1] });
      else out.push({ t: g.type, src: im });
    }); };
    if (d.galleryFirst) gal();
    if (d.apps) d.apps.forEach(function (a) { a.images.forEach(function (im, i) { out.push({ t: 'phone', src: im, label: i === 0 ? a.name : '' }); }); });
    if (!d.galleryFirst) gal();
    return out;
  }
  function mediaHTML(d) {
    var items = mediaItems(d);
    if (!items.length) return '';
    var html = items.map(function (it) {
      var label = it.label ? '<span class="sh-media__label">' + esc(it.label) + '</span>' : '';
      if (it.t === 'video') return '<div class="sh-media__item sh-media__item--video ' + it.orient + '"><video data-src="' + it.src + '" poster="' + it.poster + '" muted loop playsinline preload="none"></video><span class="sh-media__badge">App preview · HyperFrames</span></div>';
      if (it.t === 'browser') return '<div class="sh-media__item sh-media__item--browser" data-src="' + it.src + '"><div class="browser__bar"><i></i><i></i><i></i><span>' + esc(it.bar || '') + '</span></div><img src="' + it.src + '" alt="" loading="lazy" decoding="async"></div>';
      if (it.t === 'mac') return '<div class="sh-media__item sh-media__item--mac" data-src="' + it.src + '">' + label + '<img src="' + it.src + '" alt="" loading="lazy" decoding="async"></div>';
      return '<div class="sh-media__item" data-src="' + it.src + '">' + label + '<img src="' + it.src + '" alt="" loading="lazy" decoding="async"></div>';
    }).join('');
    return '<div class="sh-media"><div class="sh-media__nav"><button class="icon-btn" data-media="-1" aria-label="Previous"><svg class="ic" style="transform:scaleX(-1)"><use href="#i-chev"/></svg></button><button class="icon-btn" data-media="1" aria-label="Next"><svg class="ic"><use href="#i-chev"/></svg></button></div>' +
      '<div class="sh-media__track">' + html + '</div></div>';
  }
  function appCardsHTML(apps) {
    if (!apps) return '';
    return '<div class="sh-appcards">' + apps.map(function (a) {
      return '<div class="sh-appcard"><header><img src="' + a.icon + '" alt=""><div><h4>' + esc(a.name) + '</h4><small>' + esc(a.who) + ' · ' + esc(a.since) + '</small></div></header>' +
        '<p>' + esc(a.copy) + '</p><a class="btn btn--ghost btn--sm" href="' + a.href + '" target="_blank" rel="noopener"><svg class="ic"><use href="#i-' + (a.linkIcon || 'apple') + '"/></svg>' + esc(a.linkLabel || 'App Store') + '</a></div>';
    }).join('') + '</div>';
  }
  function mainHTML(left, right) {
    return '<div class="sh-body"><div class="sh-main"><div>' + left + '</div><aside class="sh-aside sh-aside--sticky">' + right + '</aside></div></div>';
  }
  function buildXP(d) {
    var groups = d.groups.map(function (g) {
      return '<div class="sh-group"><p class="sh-group__name">' + esc(g.name) + '</p><div class="sh-items">' +
        g.items.map(function (it) { return '<div class="sh-item"><h4>' + esc(it[0]) + '</h4><p>' + esc(it[1]) + '</p></div>'; }).join('') + '</div></div>';
    }).join('');
    return heroHTML(d, '<img src="' + d.icon + '" alt="">') + mediaHTML(d) +
      mainHTML('<p class="sh-intro">' + esc(d.intro) + '</p>' + appCardsHTML(d.apps) + '<div class="sh-groups">' + groups + '</div>',
        factsHTML(d.facts) + '<div><p class="sh-label">Stack</p>' + chipsHTML(d.stack) + '</div>');
  }
  var PROJECT_ICONS = {
    openchair: '<span class="proj-icon proj-icon--openchair"><i></i></span>',
    veto: '<span class="proj-icon proj-icon--veto">RV</span>',
    resumebyjob: '<span class="proj-icon proj-icon--rbj"><b></b></span>',
    shorts: '<img src="assets/img/shorts/icon.webp?v=2" alt="">',
    gymo: '<img src="assets/img/gymo/icon.webp" alt="">',
    vpn: '<span class="proj-icon proj-icon--vpn"><img src="assets/img/vpn/logo.svg" alt=""></span>'
  };
  function gymoMap() {
    var cols = [
      ['Onboarding', [['Goal', 'build · lose · maintain'], ['Body metrics', 'ruler pickers'], ['Profile', 'photo + name'], ['Schedule', 'training days']]],
      ['Gymo · members', [['Home · workout', 'today’s plan'], ['Gym crowd', 'donut by muscle'], ['Chat', 'with the gym'], ['Notifications', 'push + inbox']]],
      ['Gymo Manager · owners', [['Dashboard', 'vs last month'], ['Members', 'active · inactive'], ['Memberships', 'classic · gold · premium'], ['Broadcast', 'filters + search']]]
    ];
    return '<p class="sh-label" style="margin-top:44px">Screen map</p><div class="screenmap" style="margin-top:0">' + cols.map(function (c) {
      return '<div class="screenmap__col"><h4>' + c[0] + '</h4><ul>' + c[1].map(function (s) { return '<li>' + s[0] + '<span>' + s[1] + '</span></li>'; }).join('') + '</ul></div>';
    }).join('') + '</div>';
  }
  function buildProject(key, d) {
    var sections = d.sections.map(function (x) { return '<div class="sh-section"><h3>' + esc(x[0]) + '</h3><p>' + esc(x[1]) + '</p></div>'; }).join('');
    return heroHTML(d, PROJECT_ICONS[key] || '') + mediaHTML(d) +
      mainHTML('<p class="sh-intro">' + esc(d.intro) + '</p>' + appCardsHTML(d.apps) + sections + (key === 'gymo' ? gymoMap() : ''),
        factsHTML(d.facts) + '<div><p class="sh-label">Highlights</p><ul class="sh-bullets">' + d.bullets.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
        '<div><p class="sh-label">Stack</p>' + chipsHTML(d.stack) + '</div>');
  }

  function lockBody(on) {
    document.body.classList.toggle('is-locked', on);
    var tb = $('#tabbar'); if (tb) tb.classList.toggle('is-hidden', on);
  }

  function openSheet(type, key, fromEl, opts) {
    if (!sheet || animating) return;
    var d = type === 'xp' ? DATA.xp && DATA.xp[key] : DATA.projects && DATA.projects[key];
    if (!d) return;
    opts = opts || {};
    opener = fromEl || null; openKey = type + '/' + key;
    content.innerHTML = type === 'xp' ? buildXP(d) : buildProject(key, d);
    scroller.scrollTop = 0;
    bindSheetContent();
    sheet.classList.add('is-open'); sheet.setAttribute('aria-hidden', 'false'); lockBody(true);
    haptic(10);
    if (!opts.noHistory && history.pushState) { history.pushState({ sheet: openKey }, '', '#' + openKey); pushed = true; }
    document.title = d.title + ' — Amine Bouhlali';
    var lead = type === 'xp' ? '<img src="' + (d.apps ? d.apps[0].icon : d.icon) + '" alt="">' : (PROJECT_ICONS[key] || '');
    liveActivity('Opened ' + d.title, lead, 1800);

    if (reduceMotion || !panel.animate) { panel.focus({ preventScroll: true }); playVideos(); return; }
    animating = true;
    var cr = fromEl && fromEl.getBoundingClientRect();
    panel.style.opacity = '0';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var pr = panel.getBoundingClientRect();
        panel.style.willChange = 'transform, opacity';
        var a = panel.animate(fromCard(cr, pr, true), { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' });
        panel.style.opacity = '';
        a.onfinish = function () { a.cancel(); panel.style.willChange = ''; animating = false; panel.focus({ preventScroll: true }); playVideos(); };
      });
    });
  }
  // keyframes that grow the panel out of (or back into) the card it came from — uniform scale, compositor-only
  function fromCard(cr, pr, opening) {
    var start;
    if (cr && cr.width) {
      var s = clamp(Math.min(cr.width / pr.width, cr.height / pr.height) * 1.15, 0.55, 0.9);
      var dx = (cr.left + cr.width / 2) - (pr.left + pr.width / 2), dy = (cr.top + cr.height / 2) - (pr.top + pr.height / 2);
      start = { transform: 'translate3d(' + dx * 0.85 + 'px,' + dy * 0.85 + 'px,0) scale(' + s + ')', opacity: 0 };
    } else {
      start = { transform: 'translate3d(0,' + Math.round(pr.height * 0.12) + 'px,0) scale(.96)', opacity: 0 };
    }
    var end = { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 };
    var mid = { opacity: 1, offset: opening ? 0.35 : 0.6 };
    return opening ? [start, mid, end] : [end, mid, start];
  }
  function playVideos() {
    $$('video[data-src]', content).forEach(function (v) {
      if (!v.getAttribute('src')) v.setAttribute('src', v.getAttribute('data-src'));
      var pr = v.play && v.play(); if (pr && pr.catch) pr.catch(function () {});
    });
  }

  function closeSheet(opts) {
    if (!sheet || !sheet.classList.contains('is-open') || animating) return;
    opts = opts || {};
    var done = function () {
      sheet.classList.remove('is-open'); sheet.setAttribute('aria-hidden', 'true'); lockBody(false);
      panel.style.transform = ''; panel.style.transition = ''; panel.style.clipPath = '';
      content.innerHTML = ''; animating = false;
      document.title = 'Amine Bouhlali — Mobile Engineer';
      if (opener && opener.focus) opener.focus({ preventScroll: true });
    };
    if (!opts.fromPop && pushed) { pushed = false; history.back(); }
    else if (!opts.fromPop && (location.hash.indexOf('#xp/') === 0 || location.hash.indexOf('#project/') === 0)) { history.replaceState(null, '', location.pathname + location.search); }
    pushed = false;
    haptic(6);
    if (reduceMotion || !panel.animate) { done(); return; }
    animating = true;
    var pr = panel.getBoundingClientRect(), to;
    var cur = opts.fromY || 0;
    if (opener && !opts.fromY && opener.getBoundingClientRect().bottom > 0 && opener.getBoundingClientRect().top < innerHeight) {
      $$('video', content).forEach(function (v) { v.pause(); });
      panel.style.willChange = 'transform, opacity';
      var a = panel.animate(fromCard(opener.getBoundingClientRect(), pr, false), { duration: 380, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
      a.onfinish = function () { done(); panel.style.willChange = ''; a.cancel(); };
    } else {
      var b = panel.animate([{ transform: 'translateY(' + cur + 'px)' }, { transform: 'translateY(' + (pr.height + 40) + 'px)' }],
        { duration: 380, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'forwards' });
      b.onfinish = function () { done(); b.cancel(); };
    }
    sheet.querySelector('.sheet__backdrop').style.opacity = '';
  }

  function bindSheetContent() {
    $$('.sh-media', content).forEach(function (m) {
      var track = $('.sh-media__track', m);
      $$('[data-media]', m).forEach(function (btn) {
        btn.addEventListener('click', function () { track.scrollBy({ left: +btn.getAttribute('data-media') * track.clientWidth * 0.7, behavior: 'smooth' }); });
      });
      $$('.sh-media__item[data-src]', m).forEach(function (it) { it.addEventListener('click', function () { openLightbox(it.getAttribute('data-src')); }); });
    });
  }

  // open triggers
  function bindOpen(attr, type) {
    $$('[' + attr + ']').forEach(function (el) {
      var key = el.getAttribute(attr);
      el.addEventListener('click', function () { openSheet(type, key, el); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet(type, key, el); } });
    });
  }
  // warm up: decode the first media of each sheet while idle, so the first open has nothing to wait on
  (function warm() {
    var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 1200); };
    idle(function () {
      var all = [];
      Object.keys(DATA.xp || {}).forEach(function (k) { all.push(DATA.xp[k]); });
      Object.keys(DATA.projects || {}).forEach(function (k) { all.push(DATA.projects[k]); });
      all.forEach(function (d) {
        mediaItems(d).slice(0, 4).forEach(function (it) {
          var im = new Image(); im.src = it.t === 'video' ? it.poster : it.src;
          if (im.decode) im.decode().catch(function () {});
        });
      });
    });
  })();
  bindOpen('data-open-xp', 'xp');
  bindOpen('data-open-project', 'project');

  if (sheet) {
    $$('[data-close]', sheet).forEach(function (b) { b.addEventListener('click', function () { closeSheet(); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if ($('#lightbox').classList.contains('is-open')) closeLightbox(); else closeSheet(); }
    });
    window.addEventListener('popstate', function () {
      var m = location.hash.match(/^#(xp|project)\/([\w-]+)/);
      if (sheet.classList.contains('is-open') && (!m || m[1] + '/' + m[2] !== openKey)) { pushed = false; closeSheet({ fromPop: true }); }
      else if (m && !sheet.classList.contains('is-open')) openSheet(m[1], m[2], $('[data-open-' + m[1] + '="' + m[2] + '"]'), { noHistory: true });
    });
    // share
    $('#sheetShare').addEventListener('click', function () {
      var url = location.href.split('#')[0] + '#' + openKey, title = document.title;
      if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); }
      else if (navigator.clipboard) { navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }); }
    });
    // drag to dismiss (grabber, or content when scrolled to top)
    (function dragDismiss() {
      var startY = 0, dy = 0, active = false, fromContent = false, t0 = 0, backdrop = $('.sheet__backdrop', sheet);
      function down(e, isContent) {
        if (animating || innerWidth >= 900 && e.pointerType === 'mouse' && isContent) return;
        if (isContent && scroller.scrollTop > 0) return;
        active = true; fromContent = isContent; startY = e.clientY; dy = 0; t0 = performance.now();
      }
      function move(e) {
        if (!active) return;
        dy = e.clientY - startY;
        if (fromContent && (dy < 0 || scroller.scrollTop > 0)) { if (dy < -4) active = false; return; }
        if (dy > 0) {
          if (e.cancelable) e.preventDefault();
          var d = dy < 0 ? dy * 0.2 : dy;
          panel.style.transition = 'none'; panel.style.transform = 'translateY(' + d + 'px)';
          backdrop.style.opacity = String(1 - Math.min(d / 600, 0.7));
        }
      }
      function up() {
        if (!active) return; active = false;
        var v = dy / Math.max(1, performance.now() - t0);
        if (dy > 140 || (dy > 30 && v > 0.7)) { closeSheet({ fromY: dy }); return; }
        panel.style.transition = 'transform .5s cubic-bezier(.34,1.3,.64,1)'; panel.style.transform = '';
        backdrop.style.opacity = '';
      }
      var grab = $('#sheetGrabber');
      grab.addEventListener('pointerdown', function (e) { down(e, false); if (grab.setPointerCapture) grab.setPointerCapture(e.pointerId); });
      grab.addEventListener('pointermove', move); grab.addEventListener('pointerup', up); grab.addEventListener('pointercancel', up);
      // touch on content: use touch events so we can cancel native scroll at top
      scroller.addEventListener('touchstart', function (e) { down({ clientY: e.touches[0].clientY, pointerType: 'touch' }, true); }, { passive: true });
      scroller.addEventListener('touchmove', function (e) { move({ clientY: e.touches[0].clientY, cancelable: e.cancelable, preventDefault: function () { e.preventDefault(); } }); }, { passive: false });
      scroller.addEventListener('touchend', up); scroller.addEventListener('touchcancel', up);
    })();
    // deep link on load
    var m0 = location.hash.match(/^#(xp|project)\/([\w-]+)/);
    if (m0) setTimeout(function () { openSheet(m0[1], m0[2], $('[data-open-' + m0[1] + '="' + m0[2] + '"]'), { noHistory: true }); }, 400);
  }

  /* ---------------- Lightbox ---------------- */
  var lb = $('#lightbox'), lbImg = $('#lightboxImg');
  function openLightbox(src) { if (!lb) return; lbImg.src = src; lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); }
  function closeLightbox() { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); }
  if (lb) lb.addEventListener('click', closeLightbox);

  /* ---------------- Contact ---------------- */
  var EMAIL = 'atlasbytezz@gmail.com';
  var copyBtn = $('#copyEmail');
  if (copyBtn) copyBtn.addEventListener('click', copyEmail);
  var imForm = $('#imForm'), imInput = $('#imInput'), imList = $('#imList');
  if (imForm) imForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = imInput.value.trim(); if (!text) { imInput.focus(); return; }
    imInput.value = ''; haptic(6);
    var b = document.createElement('div'); b.className = 'bubble bubble--out'; b.textContent = text; imList.appendChild(b);
    var note = document.createElement('div'); note.className = 'bubble bubble--note'; note.textContent = 'Delivered';
    imList.appendChild(note); imList.scrollTop = imList.scrollHeight;
    setTimeout(function () {
      var r = document.createElement('div'); r.className = 'bubble bubble--in'; r.textContent = 'Opening your mail app with that message ✉️';
      imList.appendChild(r); imList.scrollTop = imList.scrollHeight;
      setTimeout(function () {
        location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Hello from your portfolio') + '&body=' + encodeURIComponent(text);
      }, 700);
    }, 700);
  });

})();
