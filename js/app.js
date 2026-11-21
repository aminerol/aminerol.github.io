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
  var currentSection = null, baseLabel = 'Open to React Native roles', baseLead = null, eventT = 0;
  var DOT = '<span class="island__dot"></span>';
  var SECTION_LABELS = { top: 'Open to React Native roles', work: 'Experience · 2 teams · 3 apps', lab: 'Gesture Lab · 8 live demos', projects: 'Projects · 6 products', stack: 'Toolbox', contact: 'Say hi · replies within a day' };

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
    var tabId = id === 'stack' ? 'projects' : id;
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
    vpn: '<span class="proj-icon proj-icon--vpn"><svg><use href="#i-power"/></svg></span>'
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
  function pushNotif(delay) {
    var list = DATA.notifications || [];
    if (!list.length || !notifsEl) return;
    var n = list[qi % list.length]; qi++;
    setTimeout(function () {
      var el = document.createElement('div');
      el.className = 'notif'; el.innerHTML = notifHTML(n); el.setAttribute('role', 'button'); el.tabIndex = 0;
      el.setAttribute('aria-label', n.app + ': ' + n.title + '. Press Enter to open, Delete to dismiss.');
      notifsEl.appendChild(el); bindSwipe(el, n); haptic(4); notifsEmpty.hidden = true;
    }, delay || 0);
  }
  function renderNotifs() {
    if (!notifsEl || !DATA.notifications) return;
    notifsEl.innerHTML = ''; notifsEmpty.hidden = true; qi = 0;
    var ph = $('#heroPhone');
    MAXN = (ph && ph.offsetHeight < 660) || innerHeight < 700 ? 3 : 4;
    for (var i = 0; i < MAXN; i++) pushNotif(700 + i * 650);
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
    var TAG = { shipped: 'Shipped', launch: 'Launch', milestone: 'Milestone', oss: 'Open source', design: 'Design', live: 'Live', history: '2016–19' };
    var html = DATA.shiplog.map(function (s) {
      return '<button type="button" class="ship" data-open="' + s[3].join('/') + '"><span class="ship__tag ship__tag--' + s[0] + '">' + TAG[s[0]] + '</span><b>' + esc(s[1]) + '</b>' + esc(s[2]) + '</button>';
    }).join('');
    track.innerHTML = html + html.replace(/class="ship"/g, 'class="ship" aria-hidden="true" tabindex="-1"');
    $$('.ship', track).forEach(function (b) {
      b.addEventListener('click', function () { var o = b.getAttribute('data-open').split('/'); openSheet(o[0], o[1], b); });
    });
  })();

  /* ---------------- Magnetic buttons ---------------- */
  if (finePointer && !reduceMotion) {
    $$('.magnetic').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        b.style.transform = 'translate(' + (x * 0.22) + 'px,' + (y * 0.35) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------------- Card tilt + pointer glow ---------------- */
  if (finePointer && !reduceMotion) {
    $$('.tilt').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        if (c.classList.contains('reveal')) return;
        var r = c.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.transition = 'transform .2s ease-out, box-shadow .4s, border-color .3s';
        c.style.transform = 'perspective(1200px) rotateX(' + ((0.5 - py) * 4) + 'deg) rotateY(' + ((px - 0.5) * 5) + 'deg) translateY(-4px)';
        c.style.setProperty('--mx', (px * 100) + '%'); c.style.setProperty('--my', (py * 100) + '%');
      });
      c.addEventListener('pointerleave', function () { c.style.transition = ''; c.style.transform = ''; });
    });
    $$('.cc-tile').forEach(function (t) {
      t.addEventListener('pointermove', function (e) {
        var r = t.getBoundingClientRect();
        t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* =========================================================
     GESTURE LAB
     ========================================================= */

  /* ---------- Rotary wheel ---------- */
  (function wheelDemo() {
    var wheel = $('#wheel'), label = $('#wheelLabel'), pointer = $('.wheel__pointer');
    if (!wheel) return;
    var items = [['🎬', 'Movies'], ['📍', 'Places'], ['📺', 'Shows'], ['🎧', 'Podcasts'], ['🍜', 'Food'], ['🎵', 'Music']];
    var N = items.length, SLICE = 360 / N, spans = [];
    items.forEach(function (it, i) {
      var s = document.createElement('div');
      s.className = 'wheel__slice';
      s.innerHTML = '<span>' + it[0] + '</span>';
      wheel.appendChild(s); spans.push(s);
    });
    var rot = 0, idx = 0, raf = 0;
    function layout() {
      var R = wheel.offsetWidth * 0.37;
      spans.forEach(function (s, i) {
        var a = i * SLICE * Math.PI / 180;
        s.style.transform = 'translate(' + (Math.sin(a) * R) + 'px,' + (-Math.cos(a) * R) + 'px)';
        s.firstChild.style.transform = 'translate(-50%,-50%) rotate(' + (-rot) + 'deg)';
      });
    }
    function render() {
      wheel.style.transform = 'rotate(' + rot + 'deg)';
      spans.forEach(function (s) { s.firstChild.style.transform = 'translate(-50%,-50%) rotate(' + (-rot) + 'deg)'; });
      var i = ((Math.round(-rot / SLICE) % N) + N) % N;
      if (i !== idx) {
        idx = i; label.textContent = items[i][1]; wheel.setAttribute('aria-valuenow', i); wheel.setAttribute('aria-valuetext', items[i][1]);
        haptic(5);
        pointer.classList.add('is-tick'); label.classList.add('is-tick');
        setTimeout(function () { pointer.classList.remove('is-tick'); label.classList.remove('is-tick'); }, 60);
      }
    }
    layout(); render(); window.addEventListener('resize', layout);

    function springTo(target) {
      cancelAnimationFrame(raf);
      var v = 0, last = performance.now();
      var step = function (now) {
        var dt = Math.min(0.032, (now - last) / 1000); last = now;
        var f = -180 * (rot - target) - 20 * v;
        v += f * dt; rot += v * dt; render();
        if (Math.abs(rot - target) < 0.05 && Math.abs(v) < 0.05) { rot = target; render(); return; }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    function angleOf(e) {
      var r = wheel.getBoundingClientRect();
      return Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180 / Math.PI;
    }
    var dragging = false, lastA = 0, vel = 0, lastT = 0;
    wheel.addEventListener('pointerdown', function (e) {
      dragging = true; cancelAnimationFrame(raf); lastA = angleOf(e); lastT = performance.now(); vel = 0;
      if (wheel.setPointerCapture) wheel.setPointerCapture(e.pointerId);
    });
    wheel.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var a = angleOf(e), d = a - lastA;
      if (d > 180) d -= 360; if (d < -180) d += 360;
      var now = performance.now(), dt = Math.max(1, now - lastT);
      vel = vel * 0.6 + (d / dt) * 0.4;
      rot += d; lastA = a; lastT = now; render();
    });
    var release = function () {
      if (!dragging) return; dragging = false;
      var projected = rot + clamp(vel, -2.5, 2.5) * 220; // momentum projection
      var tgt = Math.round(projected / SLICE) * SLICE; springTo(tgt);
      var k = ((Math.round(-tgt / SLICE) % N) + N) % N;
      if (window.__liveActivity) window.__liveActivity(items[k][1] + ' selected', '<span style="font-size:16px">' + items[k][0] + '</span>', 1500);
    };
    wheel.addEventListener('pointerup', release); wheel.addEventListener('pointercancel', release);
    wheel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); springTo(Math.round(rot / SLICE) * SLICE - SLICE); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); springTo(Math.round(rot / SLICE) * SLICE + SLICE); }
    });
  })();

  /* ---------- Drag-to-reorder grid ---------- */
  (function reorderDemo() {
    var box = $('#reorder');
    if (!box) return;
    var items = [['👯', 'Besties', '#ff7a59'], ['🏠', 'Family', '#ffb020'], ['🏋️', 'Gym', '#36d399'], ['💼', 'Work', '#33b6ff'], ['🍿', 'Movie club', '#8b7bff'], ['🍜', 'Foodies', '#ff5ea8'], ['🥾', 'Hikers', '#20c997'], ['🎮', 'Gamers', '#5c7cfa'], ['📚', 'Book club', '#f06595']];
    var order = items.map(function (_, i) { return i; });
    var tiles = items.map(function (it, i) {
      var t = document.createElement('div');
      t.className = 'tile'; t.style.setProperty('--c', it[2]);
      t.innerHTML = '<b>' + it[0] + '</b>' + it[1];
      t.setAttribute('aria-label', it[1]);
      box.appendChild(t); return t;
    });
    function slotTransform(slot) {
      var c = slot % 3, r = Math.floor(slot / 3);
      return 'translate(calc(' + c + ' * (100% + 10px)), calc(' + r + ' * (100% + 10px)))';
    }
    function layout(skip) {
      order.forEach(function (itemIdx, slot) { if (itemIdx !== skip) tiles[itemIdx].style.transform = slotTransform(slot); });
    }
    layout();

    var drag = null, holdT = 0;
    function lift(item, e) {
      var t = tiles[item], br = box.getBoundingClientRect(), tr = t.getBoundingClientRect();
      drag = { item: item, ox: e.clientX - tr.left, oy: e.clientY - tr.top, br: br };
      t.classList.add('is-lifted'); box.classList.add('is-jiggle'); haptic(12);
      move(e);
    }
    function move(e) {
      if (!drag) return;
      var t = tiles[drag.item], br = box.getBoundingClientRect();
      var x = e.clientX - br.left - drag.ox, y = e.clientY - br.top - drag.oy;
      t.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(1.1)';
      var col = clamp(Math.floor((e.clientX - br.left) / (br.width / 3)), 0, 2);
      var row = clamp(Math.floor((e.clientY - br.top) / (br.height / 3)), 0, 2);
      var target = row * 3 + col, cur = order.indexOf(drag.item);
      if (target !== cur) {
        order.splice(cur, 1); order.splice(target, 0, drag.item);
        layout(drag.item); haptic(4);
      }
    }
    function drop() {
      clearTimeout(holdT);
      if (!drag) return;
      var t = tiles[drag.item]; t.classList.remove('is-lifted'); box.classList.remove('is-jiggle');
      t.style.transform = slotTransform(order.indexOf(drag.item));
      drag = null;
    }
    tiles.forEach(function (t, i) {
      var start = null;
      t.addEventListener('pointerdown', function (e) {
        start = { x: e.clientX, y: e.clientY, type: e.pointerType };
        if (t.setPointerCapture) t.setPointerCapture(e.pointerId);
        if (e.pointerType !== 'mouse') holdT = setTimeout(function () { lift(i, e); }, 220);
      });
      t.addEventListener('pointermove', function (e) {
        if (drag) { move(e); return; }
        if (!start) return;
        var d = Math.hypot(e.clientX - start.x, e.clientY - start.y);
        if (start.type === 'mouse' && d > 3) lift(i, e);
        else if (start.type !== 'mouse' && d > 10) { clearTimeout(holdT); start = null; }
      });
      var up = function () { start = null; drop(); };
      t.addEventListener('pointerup', up); t.addEventListener('pointercancel', up);
      t.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    });
    // block page scroll only while a tile is lifted
    box.addEventListener('touchmove', function (e) { if (drag) e.preventDefault(); }, { passive: false });
  })();

  /* ---------- Topic-threaded chat ---------- */
  (function chatDemo() {
    var list = $('#chatList'), topicsEl = $('#chatTopics'), form = $('#chatForm'), input = $('#chatInput');
    if (!list) return;
    var people = { Sara: '#ff7a59', Youssef: '#33b6ff', Kenza: '#36d399' };
    var topics = [
      { id: 'weekend', name: '#weekend', unread: 0, msgs: [['Sara', 'Beach on Saturday? 🌊'], ['Youssef', 'Only if we leave before 10'], ['me', 'I’ll bring the speaker 🔊']],
        replies: ['Deal. Kenza drives?', 'Bouznika or Skhirat?', 'Bringing snacks 🍉', 'Group photo this time, no excuses'] },
      { id: 'movies', name: '#movie-night', unread: 0, msgs: [['Kenza', 'Dune 2 or the new Pixar?'], ['Sara', 'Dune. Obviously.']],
        replies: ['Popcorn is on me 🍿', 'Megarama at 9?', 'I’ll book the seats', 'No spoilers in this topic!!'] },
      { id: 'food', name: '#food', unread: 0, msgs: [['Youssef', 'That tajine spot in Agdal is 🔥'], ['Kenza', 'Saving it to my circle']],
        replies: ['Adding it to Sircles rn', 'Their msemen too 🤤', 'Friday lunch?', 'Checked in last week, 10/10'] }
    ];
    var active = topics[0];
    function bubble(who, text, opts) {
      opts = opts || {};
      var me = who === 'me', el = document.createElement('div');
      el.className = 'msg' + (me ? ' msg--me' : '');
      el.innerHTML = (me ? '' : '<div class="msg__who" style="color:' + people[who] + '">' + who + '</div>') +
        '<div class="msg__bubble">' + esc(text) + '</div>' +
        (me ? '<div class="msg__meta">' + (opts.pending ? '<svg class="ic"><use href="#i-clock"/></svg>Sending' : '<svg class="ic"><use href="#i-check"/></svg>Delivered') + '</div>' : '');
      var lastTap = 0;
      el.querySelector('.msg__bubble').addEventListener('pointerup', function () {
        var now = Date.now();
        if (now - lastTap < 320) react(el); lastTap = now;
      });
      el.addEventListener('dblclick', function () { react(el); });
      return el;
    }
    function react(el) {
      if (el.querySelector('.msg__react')) return;
      var r = document.createElement('span'); r.className = 'msg__react'; r.textContent = '❤️';
      el.appendChild(r); haptic(10);
    }
    function scrollEnd() { list.scrollTo ? list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' }) : (list.scrollTop = list.scrollHeight); }
    function renderTopics() {
      topicsEl.innerHTML = '';
      topics.forEach(function (t) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'topic' + (t === active ? ' is-active' : ''); b.setAttribute('role', 'tab');
        b.setAttribute('aria-selected', t === active ? 'true' : 'false');
        b.innerHTML = esc(t.name) + (t.unread ? '<span class="topic__badge">' + t.unread + '</span>' : '');
        b.addEventListener('click', function () { active = t; t.unread = 0; haptic(4); renderTopics(); renderList(); });
        topicsEl.appendChild(b);
      });
      input.placeholder = 'Message ' + active.name;
    }
    function renderList() {
      list.innerHTML = '';
      active.msgs.forEach(function (m) { list.appendChild(bubble(m[0], m[1])); });
      list.scrollTop = list.scrollHeight;
    }
    renderTopics(); renderList();

    var replyT;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim(); if (!text) return;
      input.value = ''; haptic(6);
      var topic = active;
      topic.msgs.push(['me', text]);
      var el = bubble('me', text, { pending: true }); list.appendChild(el); scrollEnd();
      // optimistic → confirmed
      setTimeout(function () { var meta = el.querySelector('.msg__meta'); if (meta) meta.innerHTML = '<svg class="ic"><use href="#i-check"/></svg>Delivered'; if (window.__liveActivity) window.__liveActivity('Delivered to ' + topic.name, '<span style="font-size:15px">💬</span>', 1500); }, 650);
      clearTimeout(replyT);
      replyT = setTimeout(function () {
        if (active !== topic) return;
        var typing = document.createElement('div'); typing.className = 'typing'; typing.innerHTML = '<i></i><i></i><i></i>';
        list.appendChild(typing); scrollEnd();
        setTimeout(function () {
          typing.remove();
          var names = Object.keys(people), who = names[Math.floor(Math.random() * names.length)];
          var txt = topic.replies[Math.floor(Math.random() * topic.replies.length)];
          topic.msgs.push([who, txt]);
          if (active === topic) { list.appendChild(bubble(who, txt)); scrollEnd(); }
        }, 1300);
      }, 900);
    });

    // simulate activity in other topics while visible
    var visible = false, pings = 0;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.4 }).observe(list);
    }
    setInterval(function () {
      if (!visible || document.hidden || pings > 5) return;
      var others = topics.filter(function (t) { return t !== active; });
      var t = others[Math.floor(Math.random() * others.length)];
      var names = Object.keys(people);
      t.msgs.push([names[Math.floor(Math.random() * names.length)], t.replies[Math.floor(Math.random() * t.replies.length)]]);
      t.unread++; pings++; renderTopics();
    }, 7000);
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
          if (window.__liveActivity) window.__liveActivity((ok ? 'Approved · ' : 'Declined · ') + r.name, '<img src="assets/img/popmanager/icon.jpg" alt="">', 1800);
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

  /* ---------- OTP verification ---------- */
  (function otpDemo() {
    var root = $('#otp'); if (!root) return;
    var boxesEl = $('#otpBoxes'), sms = $('#otpSms'), smsText = $('#otpSmsText'), timerEl = $('#otpTimer'), resend = $('#otpResend'), status = $('#otpStatus');
    var code = '', left = 30, tick = 0, attempts = 0, inputs = [];
    for (var i = 0; i < 6; i++) {
      var inp = document.createElement('input');
      inp.type = 'text'; inp.inputMode = 'numeric'; inp.maxLength = 1; inp.autocomplete = i ? 'off' : 'one-time-code';
      inp.setAttribute('aria-label', 'Digit ' + (i + 1));
      boxesEl.appendChild(inp); inputs.push(inp);
    }
    function newCode() {
      code = String(100000 + Math.floor(Math.random() * 900000));
      smsText.textContent = 'Your Sircles code is ' + code;
      sms.classList.remove('is-in'); setTimeout(function () { sms.classList.add('is-in'); haptic(6); }, 700);
      left = 30; clearInterval(tick);
      resend.disabled = true;
      status.innerHTML = 'Code expires in <b id="otpTimer">0:30</b>'; timerEl = $('#otpTimer');
      tick = setInterval(function () {
        left--;
        if (left <= 0) { clearInterval(tick); status.textContent = 'Code expired.'; resend.disabled = false; code = ''; return; }
        timerEl.textContent = '0:' + String(left).padStart(2, '0');
        if (left === 20) resend.disabled = false; // rate limit: resend unlocks after 10s
      }, 1000);
    }
    function value() { return inputs.map(function (x) { return x.value; }).join(''); }
    function check() {
      var v = value(); if (v.length < 6) return;
      if (v === code) {
        clearInterval(tick); root.classList.add('is-done'); haptic([10, 40, 10]);
        if (window.__liveActivity) window.__liveActivity('Phone verified', '<span class="island__dot"></span>');
        setTimeout(function () { root.classList.remove('is-done'); inputs.forEach(function (x) { x.value = ''; }); attempts = 0; newCode(); }, 2600);
      } else {
        attempts++; haptic(30);
        boxesEl.classList.add('is-error', 'is-shake');
        status.textContent = attempts >= 3 ? 'Too many attempts — request a new code.' : 'Wrong code. ' + (3 - attempts) + ' tries left.';
        if (attempts >= 3) { code = ''; clearInterval(tick); resend.disabled = false; }
        setTimeout(function () { boxesEl.classList.remove('is-shake'); }, 450);
        setTimeout(function () { boxesEl.classList.remove('is-error'); inputs.forEach(function (x) { x.value = ''; }); inputs[0].focus({ preventScroll: true }); }, 700);
      }
    }
    function fill(str) {
      str.replace(/\D/g, '').slice(0, 6).split('').forEach(function (d, k) { inputs[k].value = d; });
      inputs[Math.min(5, str.length)].focus({ preventScroll: true }); check();
    }
    inputs.forEach(function (inp, k) {
      inp.addEventListener('input', function () {
        inp.value = inp.value.replace(/\D/g, '').slice(-1);
        if (inp.value && k < 5) inputs[k + 1].focus();
        check();
      });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Backspace' && !inp.value && k > 0) inputs[k - 1].focus(); });
      inp.addEventListener('paste', function (e) { e.preventDefault(); fill((e.clipboardData || window.clipboardData).getData('text')); });
    });
    sms.addEventListener('click', function () { if (code) { sms.classList.remove('is-in'); fill(code); } });
    resend.addEventListener('click', function () { attempts = 0; inputs.forEach(function (x) { x.value = ''; }); newCode(); });
    // start when visible
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { newCode(); io.disconnect(); } }, { threshold: 0.4 });
      io.observe(root);
    } else newCode();
  })();

  /* ---------- Offline-first leave list ---------- */
  (function offlineDemo() {
    var root = $('#offline'); if (!root) return;
    var list = $('#leaveList'), toggle = $('#netToggle'), label = $('#netLabel'), add = $('#leaveAdd');
    var leaves = [
      { t: 'Summer trip', d: 'Aug 04 → Aug 15', s: 'ok' },
      { t: 'Dentist', d: 'Jun 12 · half day', s: 'ok' },
      { t: 'Eid al-Adha', d: 'Jun 16 → Jun 18', s: 'wait' }
    ];
    var ideas = [['Family visit', 'Jul 02 → Jul 05'], ['Conference', 'Sep 21 → Sep 23'], ['Moving day', 'Oct 10'], ['Long weekend', 'Nov 06 → Nov 07']], ii = 0;
    var PILL = { ok: '<span class="pill pill--ok"><svg class="ic"><use href="#i-check"/></svg>Approved</span>', wait: '<span class="pill pill--wait">Pending</span>', queue: '<span class="pill pill--queue"><svg class="ic"><use href="#i-clock"/></svg>Queued</span>', sync: '<span class="pill pill--sync">Syncing…</span>' };
    function render() {
      list.innerHTML = leaves.map(function (l) { return '<li><span><b>' + esc(l.t) + '</b><small>' + esc(l.d) + '</small></span>' + PILL[l.s] + '</li>'; }).join('');
    }
    render();
    function online() { return toggle.checked; }
    function flush() {
      var q = leaves.filter(function (l) { return l.s === 'queue'; });
      q.forEach(function (l, k) {
        setTimeout(function () { l.s = 'sync'; render(); }, 250 + k * 500);
        setTimeout(function () { l.s = 'wait'; render(); haptic(5); }, 900 + k * 500);
      });
      if (q.length && window.__liveActivity) setTimeout(function () { window.__liveActivity(q.length + ' change' + (q.length > 1 ? 's' : '') + ' synced', '<span class="island__dot"></span>'); }, 900 + q.length * 500);
    }
    toggle.addEventListener('change', function () {
      root.classList.toggle('is-off', !online()); label.textContent = online() ? 'Online' : 'Offline'; haptic(6);
      if (online()) flush();
    });
    add.addEventListener('click', function () {
      var idea = ideas[ii++ % ideas.length];
      var l = { t: idea[0], d: idea[1], s: online() ? 'sync' : 'queue' };
      leaves.unshift(l); render(); haptic(6);
      if (online()) setTimeout(function () { l.s = 'wait'; render(); }, 700);
      if (leaves.length > 6) leaves.pop();
    });
  })();

  /* ---------- Deep-link router ---------- */
  (function linksDemo() {
    var root = $('#links'); if (!root) return;
    var urlsEl = $('#linkUrls'), screen = $('#linkScreen'), crumbs = $('#linkCrumbs'), title = $('#linkTitle'), sub = $('#linkSub');
    var auth = $('#authToggle'), authLabel = $('#authLabel'), signin = $('#linkSignin');
    var ROUTES = [
      { url: 'https://sircles.com/place/42', crumbs: 'Tabs › Discover › Place', title: 'Café Clock', sub: 'place · id 42 · Universal Link' },
      { url: 'sircles://circle/besties/chat?topic=weekend', crumbs: 'Tabs › Circles › Chat', title: '#weekend', sub: 'circle “besties” · topic param · custom scheme' },
      { url: 'https://sircles.com/u/sara', crumbs: 'Tabs › Friends › Profile', title: '@sara', sub: 'user · handle · App Link (Android)' },
      { url: 'https://sircles.com/movie/dune-part-two', crumbs: 'Tabs › Watch › Movie', title: 'Dune: Part Two', sub: 'movie · slug · Universal Link' }
    ];
    var pending = null;
    ROUTES.forEach(function (r, i) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = r.url; b.title = r.url;
      b.addEventListener('click', function () { $$('button', urlsEl).forEach(function (x) { x.classList.toggle('is-active', x === b); }); open(r); });
      urlsEl.appendChild(b);
    });
    function show(c, t, s) {
      screen.classList.remove('is-push'); void screen.offsetWidth; screen.classList.add('is-push');
      crumbs.textContent = c; title.textContent = t; sub.textContent = s;
    }
    function open(r) {
      haptic(6);
      if (!auth.checked) { pending = r; show('Auth › Sign in', 'Sign in', 'Saved “' + r.title + '” — it opens right after sign-in'); signin.hidden = false; return; }
      show(r.crumbs, r.title, r.sub);
      if (window.__liveActivity) window.__liveActivity('Routed → ' + r.title, '<span class="island__dot"></span>', 1600);
    }
    auth.addEventListener('change', function () { authLabel.textContent = auth.checked ? 'Signed in' : 'Signed out'; if (auth.checked) signin.hidden = true; haptic(5); });
    signin.addEventListener('click', function () {
      auth.checked = true; authLabel.textContent = 'Signed in'; signin.hidden = true;
      if (pending) { var r = pending; pending = null; setTimeout(function () { open(r); }, 250); }
    });
  })();

  /* ---------- Snapping bottom sheet ---------- */
  (function sheetDemo() {
    var box = $('#bs'), el = $('#bsSheet'), label = $('#bsSnap'); if (!box) return;
    var names = ['full', 'half', 'peek'], snaps = [], y = 0, raf = 0;
    function measure() { var h = box.offsetHeight; snaps = [h * 0.12, h * 0.48, h * 0.78]; }
    function set(v) { y = v; el.style.transform = 'translateY(' + v + 'px)'; }
    measure(); set(snaps[2]);
    window.addEventListener('resize', function () { measure(); set(snaps[nearest(y)]); });
    function nearest(v) { var bi = 0; snaps.forEach(function (s, i) { if (Math.abs(s - v) < Math.abs(snaps[bi] - v)) bi = i; }); return bi; }
    function springTo(target) {
      cancelAnimationFrame(raf); var v = 0, last = performance.now();
      var step = function (now) {
        var dt = Math.min(0.032, (now - last) / 1000); last = now;
        v += (-260 * (y - target) - 26 * v) * dt; set(y + v * dt);
        if (Math.abs(y - target) < 0.3 && Math.abs(v) < 0.3) { set(target); return; }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    var drag = null;
    el.addEventListener('pointerdown', function (e) { cancelAnimationFrame(raf); drag = { sy: e.clientY, y0: y, t: performance.now(), ly: e.clientY, v: 0 }; if (el.setPointerCapture) el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var now = performance.now(), ny = drag.y0 + (e.clientY - drag.sy);
      // rubber band past the edges
      if (ny < snaps[0]) ny = snaps[0] - Math.pow(snaps[0] - ny, 0.7);
      if (ny > snaps[2]) ny = snaps[2] + Math.pow(ny - snaps[2], 0.7);
      drag.v = (e.clientY - drag.ly) / Math.max(1, now - drag.t); drag.ly = e.clientY; drag.t = now;
      set(ny);
    });
    var up = function () {
      if (!drag) return;
      var projected = y + drag.v * 180; drag = null;
      var i = nearest(projected); label.textContent = names[i]; haptic(6);
      springTo(snaps[i]);
    };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
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
  function videoHTML(v) {
    if (!v) return '';
    return '<div class="sh-video sh-video--' + v.orient + '"><div><video src="' + v.src + '" poster="' + v.poster + '" muted loop playsinline autoplay preload="metadata"></video>' +
      '<p class="sh-video__cap">App preview · made with HyperFrames</p></div></div>';
  }
  function appsHTML(apps) {
    if (!apps) return '';
    return '<div class="sh-apps">' + apps.map(function (a) {
      return '<div class="sh-app"><div class="sh-app__head"><img src="' + a.icon + '" alt=""><div><h4>' + esc(a.name) + '</h4><small>' + esc(a.who) + ' · ' + esc(a.since) + '</small></div></div>' +
        '<p>' + esc(a.copy) + '</p>' + chipsHTML(a.bullets) +
        '<div class="sh-app__shots">' + a.images.map(function (im) { return '<img src="' + im + '" alt="" loading="lazy" data-src="' + im + '">'; }).join('') + '</div>' +
        '<a class="btn btn--ghost btn--sm" href="' + a.href + '" target="_blank" rel="noopener"><svg class="ic"><use href="#i-apple"/></svg>App Store</a></div>';
    }).join('') + '</div>';
  }
  function introCols(d, aside) {
    var land = d.video && d.video.orient === 'landscape';
    if (d.video && !land) return '<div class="sh-cols sh-cols--video"><div>' + aside.left + '</div>' + videoHTML(d.video) + '</div>' + '<div class="sh-cols" style="margin-top:36px"><div>' + aside.more + '</div><aside class="sh-aside">' + aside.right + '</aside></div>';
    return (land ? '<div style="margin-bottom:36px">' + videoHTML(d.video) + '</div>' : '') + '<div class="sh-cols"><div>' + aside.left + aside.more + '</div><aside class="sh-aside">' + aside.right + '</aside></div>';
  }
  function buildXP(d) {
    var groups = d.groups.map(function (g) {
      return '<div class="sh-group"><p class="sh-group__name">' + esc(g.name) + '</p><div class="sh-items">' +
        g.items.map(function (it) { return '<div class="sh-item"><h4>' + esc(it[0]) + '</h4><p>' + esc(it[1]) + '</p></div>'; }).join('') + '</div></div>';
    }).join('');
    var icon = d.apps ? '<span class="icon-pair">' + d.apps.map(function (a) { return '<img src="' + a.icon + '" alt="">'; }).join('') + '</span>' : '<img src="' + d.icon + '" alt="">';
    return heroHTML(d, icon) +
      '<div class="sh-body">' + introCols(d, { left: '<p class="sh-intro">' + esc(d.intro) + '</p>', more: '', right: factsHTML(d.facts) + '<div><p class="sh-label">Stack</p>' + chipsHTML(d.stack) + '</div>' }) +
      appsHTML(d.apps) + groups + galleryHTML(d.gallery) + '</div>';
  }
  var PROJECT_ICONS = {
    openchair: '<span class="proj-icon proj-icon--openchair"><i></i></span>',
    veto: '<span class="proj-icon proj-icon--veto">RV</span>',
    resumebyjob: '<span class="proj-icon proj-icon--rbj"><b></b></span>',
    shorts: '<img src="assets/img/shorts/icon.webp" alt="">',
    gymo: '<img src="assets/img/gymo/icon.webp" alt="">',
    vpn: '<span class="proj-icon proj-icon--vpn"><svg><use href="#i-power"/></svg></span>'
  };
  function gymoMap() {
    var cols = [
      ['Onboarding', [['Goal', 'الهدف'], ['Body metrics', 'القياسات'], ['Profile', 'الملف'], ['Schedule', 'جدول الحصص']]],
      ['Member app', [['Home · workout', 'التمارين'], ['Stats', 'الإحصائيات'], ['Chat', 'الدردشة'], ['Notifications', 'الإشعارات']]],
      ['Manager app', [['Members', 'كل الاعضاء'], ['Subscriptions', 'الإشتراكات'], ['New members', 'الاعضاء الجدد'], ['Broadcast', 'إشعار جديد']]]
    ];
    return '<p class="sh-label" style="margin-top:44px">Screen map</p><div class="screenmap" style="margin-top:0">' + cols.map(function (c) {
      return '<div class="screenmap__col"><h4>' + c[0] + '</h4><ul>' + c[1].map(function (s) { return '<li>' + s[0] + '<span dir="rtl" lang="ar">' + s[1] + '</span></li>'; }).join('') + '</ul></div>';
    }).join('') + '</div>';
  }
  function vpnDemoHTML() {
    var servers = [['🇳🇱', 'Amsterdam', '185.194.143.'], ['🇩🇪', 'Frankfurt', '91.218.114.'], ['🇺🇸', 'New York', '104.200.31.'], ['🇸🇬', 'Singapore', '139.59.240.'], ['🇯🇵', 'Tokyo', '45.76.98.'], ['🇨🇦', 'Toronto', '158.69.4.']];
    return '<div class="vpn-demo" id="vpnDemo"><button class="vpn-power" id="vpnPower" aria-label="Connect"><svg><use href="#i-power"/></svg></button>' +
      '<div><div class="vpn-status" id="vpnStatus">Not protected<small>Tap to connect — a tiny homage to the 2016 client</small></div>' +
      '<div class="vpn-ip"><span>IP <b id="vpnIp">105.158.22.41</b></span><span id="vpnLoc">📍 Rabat, MA</span></div>' +
      '<div class="vpn-servers" id="vpnServers">' + servers.map(function (s, i) { return '<button type="button" data-i="' + i + '" class="' + (i ? '' : 'is-active') + '">' + s[0] + ' ' + s[1] + '</button>'; }).join('') + '</div></div></div>';
  }
  function bindVpn() {
    var box = $('#vpnDemo'); if (!box) return;
    var servers = [['🇳🇱', 'Amsterdam, NL', '185.194.143.'], ['🇩🇪', 'Frankfurt, DE', '91.218.114.'], ['🇺🇸', 'New York, US', '104.200.31.'], ['🇸🇬', 'Singapore, SG', '139.59.240.'], ['🇯🇵', 'Tokyo, JP', '45.76.98.'], ['🇨🇦', 'Toronto, CA', '158.69.4.']];
    var sel = 0, state = 'off', t;
    var status = $('#vpnStatus'), ip = $('#vpnIp'), loc = $('#vpnLoc');
    function set(s) {
      state = s; box.classList.toggle('is-connecting', s === 'connecting'); box.classList.toggle('is-on', s === 'on');
      if (s === 'off') { status.innerHTML = 'Not protected<small>Your real IP is visible</small>'; ip.textContent = '105.158.22.41'; loc.textContent = '📍 Rabat, MA'; }
      if (s === 'connecting') status.innerHTML = 'Connecting…<small>Handshaking with ' + servers[sel][1] + '</small>';
      if (s === 'on' && window.__liveActivity) window.__liveActivity('VPN on · ' + servers[sel][1], '<span class="proj-icon proj-icon--vpn"><svg><use href="#i-power"/></svg></span>', 1800);
      if (s === 'on') { status.innerHTML = 'Protected<small>Encrypted tunnel via ' + servers[sel][1] + '</small>'; ip.textContent = servers[sel][2] + (10 + Math.floor(Math.random() * 240)); loc.textContent = servers[sel][0] + ' ' + servers[sel][1]; haptic([8, 30, 8]); }
    }
    $('#vpnPower').addEventListener('click', function () {
      clearTimeout(t); haptic(10);
      if (state === 'off') { set('connecting'); t = setTimeout(function () { set('on'); }, 1500); } else set('off');
    });
    $$('#vpnServers button').forEach(function (b) {
      b.addEventListener('click', function () {
        sel = +b.getAttribute('data-i'); $$('#vpnServers button').forEach(function (x) { x.classList.toggle('is-active', x === b); }); haptic(4);
        if (state !== 'off') { clearTimeout(t); set('connecting'); t = setTimeout(function () { set('on'); }, 1100); }
      });
    });
  }
  function buildProject(key, d) {
    var sections = d.sections.map(function (s) { return '<div class="sh-section"><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></div>'; }).join('');
    return heroHTML(d, PROJECT_ICONS[key] || '') +
      '<div class="sh-body">' + introCols(d, { left: '<p class="sh-intro">' + esc(d.intro) + '</p>', more: sections,
        right: factsHTML(d.facts) + '<div><p class="sh-label">Highlights</p><ul class="sh-bullets">' + d.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul></div>' +
          '<div><p class="sh-label">Stack</p>' + chipsHTML(d.stack) + '</div>' }) +
      (d.vpnDemo ? vpnDemoHTML() : '') + (key === 'gymo' ? gymoMap() : '') + galleryHTML(d.gallery) + '</div>';
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

    var children = content.children;
    if (reduceMotion || !panel.animate) { panel.focus({ preventScroll: true }); return; }
    animating = true;
    var pr = panel.getBoundingClientRect(), from;
    if (fromEl) {
      var cr = fromEl.getBoundingClientRect();
      from = { x: cr.left - pr.left, y: cr.top - pr.top, sx: cr.width / pr.width, sy: cr.height / pr.height };
    } else {
      from = { x: 0, y: pr.height, sx: 1, sy: 1 };
    }
    var s = springSamples({ stiffness: 230, damping: 26 });
    var frames = s.map(function (p) {
      return {
        transform: 'translate(' + (from.x * (1 - p)) + 'px,' + (from.y * (1 - p)) + 'px) scale(' + (from.sx + (1 - from.sx) * p) + ',' + (from.sy + (1 - from.sy) * p) + ')',
        borderRadius: (36 - 8 * clamp(p, 0, 1)) + 'px'
      };
    });
    panel.style.transformOrigin = '0 0';
    var a = panel.animate(frames, { duration: s.length * (1000 / 60), easing: 'linear' });
    content.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 0, offset: 0.25 }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
    a.onfinish = function () { animating = false; panel.style.transformOrigin = ''; panel.focus({ preventScroll: true }); };
  }

  function closeSheet(opts) {
    if (!sheet || !sheet.classList.contains('is-open') || animating) return;
    opts = opts || {};
    var done = function () {
      sheet.classList.remove('is-open'); sheet.setAttribute('aria-hidden', 'true'); lockBody(false);
      panel.style.transform = ''; panel.style.transition = '';
      content.innerHTML = ''; animating = false;
      document.title = 'Amine Bouhlali — React Native Engineer';
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
      var cr = opener.getBoundingClientRect();
      to = { x: cr.left - pr.left, y: cr.top - pr.top, sx: cr.width / pr.width, sy: cr.height / pr.height };
      panel.style.transformOrigin = '0 0';
      var fade = content.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' });
      var a = panel.animate([
        { transform: 'translate(0,0) scale(1,1)', borderRadius: '28px' },
        { transform: 'translate(' + to.x + 'px,' + to.y + 'px) scale(' + to.sx + ',' + to.sy + ')', borderRadius: '36px', opacity: 0.6 }
      ], { duration: 420, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'forwards' });
      a.onfinish = function () { a.cancel(); fade.cancel(); panel.style.transformOrigin = ''; done(); };
    } else {
      var b = panel.animate([{ transform: 'translateY(' + cur + 'px)' }, { transform: 'translateY(' + (pr.height + 40) + 'px)' }],
        { duration: 380, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'forwards' });
      b.onfinish = function () { b.cancel(); done(); };
    }
    sheet.querySelector('.sheet__backdrop').style.opacity = '';
  }

  function bindSheetContent() {
    // gallery arrows + lightbox
    $$('.gallery', content).forEach(function (g) {
      var track = $('.gallery__track', g);
      $$('[data-gal]', g).forEach(function (b) {
        b.addEventListener('click', function () { track.scrollBy({ left: +b.getAttribute('data-gal') * track.clientWidth * 0.7, behavior: 'smooth' }); });
      });
      $$('.gallery__item', g).forEach(function (it) { it.addEventListener('click', function () { openLightbox(it.getAttribute('data-src')); }); });
    });
    $$('.sh-app__shots img', content).forEach(function (im) { im.addEventListener('click', function () { openLightbox(im.getAttribute('data-src')); }); });
    $$('video', content).forEach(function (v) { var p = v.play && v.play(); if (p && p.catch) p.catch(function () {}); });
    bindVpn();
  }

  // open triggers
  function bindOpen(attr, type) {
    $$('[' + attr + ']').forEach(function (el) {
      var key = el.getAttribute(attr);
      el.addEventListener('click', function () { openSheet(type, key, el); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet(type, key, el); } });
    });
  }
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

  /* ---------------- FPS meter ---------------- */
  (function fps() {
    var val = $('#fpsVal'), bars = $('#fpsBars');
    if (!val) return;
    var hist = [], N = 28, i, peak = 60, budget = $('.cc-tile--slider .small');
    for (i = 0; i < N; i++) { var b = document.createElement('i'); b.style.height = '90%'; bars.appendChild(b); }
    var frames = 0, last = performance.now(), visible = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(val);
    function loop(now) {
      frames++;
      if (now - last >= 500) {
        var f = Math.min(120, Math.round(frames * 1000 / (now - last)));
        frames = 0; last = now;
        if (visible) {
          val.textContent = f; hist.push(f); if (hist.length > N) hist.shift();
          var kids = bars.children, off = N - hist.length;
          var hz = f > 100 ? 120 : f > 80 ? 90 : 60; peak = Math.max(peak, hz);
          for (var k = 0; k < hist.length; k++) kids[off + k].style.height = clamp(hist[k] / peak * 95, 8, 100) + '%';
          if (budget) budget.textContent = (1000 / peak).toFixed(1) + ' ms per frame at ' + peak + ' Hz. I treat it like a deadline.';
        }
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  })();

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
