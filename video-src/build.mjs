// Generates HyperFrames app-preview compositions for the portfolio.
// Usage: node build.mjs  → writes ./<id>/index.html + copies assets
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const SITE = path.resolve(ROOT, '..');
const HIRES = process.env.HIRES; // dir with hi-res store shots

const VIDEOS = [
  {
    id: 'openchair', w: 1080, h: 1920, kind: 'device',
    pal: { bg: '#E7EAF1', ink: '#10182B', sub: '#3A465F', accent: '#2148C6', hot: '#CE2230', glow: 'rgba(33,72,198,0.22)', glow2: 'rgba(206,34,48,0.16)' },
    intro: { badge: 'flag', title: 'A barber, right now.', sub: 'On-demand barber marketplace for Rabat — a customer app and a barber app.', meta: 'IOS · ANDROID · REACT NATIVE · SUPABASE' },
    ghost: 'OPENCHAIR',
    scenes: [
      ['customer-04-home_live', 'CUSTOMER · LIVE MAP', 'Fourteen barbers online. One tap away.'],
      ['customer-07-new', 'CUSTOMER · NEW REQUEST', 'Broadcast exactly what you need.'],
      ['customer-13-search_offers', 'CUSTOMER · OFFERS', 'Nearby barbers answer. You choose.'],
      ['barber-09-request', 'BARBER · INCOMING', 'An empty chair meets a request.'],
      ['barber-12-reconfirm', 'BARBER · RECONFIRM', 'Forty-five seconds to lock it in.'],
      ['customer-21-job_matched', 'CUSTOMER · MATCHED', 'Matched. Directions on.'],
    ],
    src: (n) => `${SITE}/../openchair-screenshots/screenshots-src/${n}.png`,
    outro: { title: 'Two apps. One realtime flow.', sub: 'Expo · React Native · Supabase Realtime · RTL' },
  },
  {
    id: 'veto', w: 1080, h: 1920, kind: 'device',
    pal: { bg: '#0C0B10', ink: '#F4F2EA', sub: '#B7B3C4', accent: '#CDFB45', hot: '#FF5A3C', glow: 'rgba(205,251,69,0.20)', glow2: 'rgba(255,90,60,0.18)' },
    intro: { badge: 'veto', title: 'The people’s chart for Moroccan rap.', sub: 'Vote songs up the season board. Share to rally your friends.', meta: 'MOBILE WEB · EN + DARIJA · RTL' },
    ghost: 'RAPVETO',
    scenes: [
      ['home', 'THE BOARD', 'Vote in one tap. Watch it climb.'],
      ['song', 'SONG PAGE', 'Verified votes move the rank.'],
    ],
    src: (n) => `${process.env.SHOTS}/veto-${n}.png`,
    outro: { title: 'Top 15 win the playlist.', sub: '+ a 25K MAD prize pool · veto-rap.vercel.app' },
  },
  {
    id: 'sircles', w: 1080, h: 1920, kind: 'pano',
    pal: { bg: '#071526', ink: '#F2F7FF', sub: '#A9C1DD', accent: '#33B6FF', hot: '#FF4D6D', glow: 'rgba(51,182,255,0.24)', glow2: 'rgba(255,77,109,0.18)' },
    intro: { badge: 'icon', icon: 'sircles-icon', title: 'Recommendations from people you trust.', sub: 'Close-friend circles, check-ins, badges and real-time chat.', meta: 'IOS · ANDROID · 4.7★ · 927 RATINGS' },
    ghost: 'SIRCLES',
    panels: ['sircles-1', 'sircles-2', 'sircles-3', 'sircles-4', 'sircles-5', 'sircles-6', 'sircles-7', 'sircles-8', 'sircles-9'],
    stops: [[0, 'FRIENDS, NOT STRANGERS'], [2, 'THE ROTARY WHEEL'], [4, 'NO REVIEWS'], [5, 'BADGES & REWARDS'], [7, 'PLACES & ENTERTAINMENT']],
    outro: { title: 'Shipped on React Native 0.79.', sub: 'New Architecture · GraphQL · Reanimated · Mapbox' },
  },
  {
    id: 'pop', w: 1080, h: 1920, kind: 'pano',
    pal: { bg: '#130F2E', ink: '#F4F2FF', sub: '#BDB6E8', accent: '#8F7BFF', hot: '#36D399', glow: 'rgba(108,92,231,0.30)', glow2: 'rgba(162,155,254,0.20)' },
    intro: { badge: 'icon', icon: 'pop-icon', title: 'Two apps. One people-ops platform.', sub: 'POP by Gemo for employees. POP Manager for managers.', meta: 'GEMOGRAPHY · IOS · ANDROID · 2019–2021' },
    ghost: 'POP',
    panels: ['pop-1', 'pop-2', 'pop-3', 'pop-4', 'popmanager-1', 'popmanager-2', 'popmanager-3', 'popmanager-4', 'popmanager-5'],
    stops: [[0, 'POP BY GEMO · EMPLOYEES'], [2, 'HOLIDAY ALERTS'], [3, 'TEAM IN SYNC'], [4, 'POP MANAGER · MANAGERS'], [6, 'LEAVE CALENDAR'], [7, 'APPROVE IN ONE TAP']],
    outro: { title: 'One monorepo. Shared design system.', sub: 'React Native · React Query · Restyle · Fastlane' },
  },
  {
    id: 'resumebyjob', w: 1080, h: 1920, kind: 'device',
    pal: { bg: '#F5EFE6', ink: '#1A1714', sub: '#6B5F55', accent: '#E8501A', hot: '#FF5A1F', glow: 'rgba(255,90,31,0.16)', glow2: 'rgba(255,170,90,0.16)' },
    intro: { badge: 'rbj', title: 'Tailor your resume to the job.', sub: 'Same facts, better ordered, in the words the posting uses.', meta: 'WEB APP · AI · NEXT.JS · NO SIGN-UP' },
    ghost: 'RESUMEBYJOB',
    scenes: [
      ['1', 'TAILOR · THE BRIEF', 'Paste the job. Attach your resume.'],
      ['3', 'REVIEW · 97% MATCH', 'Every change marked. Nothing invented.'],
      ['4', 'COVER LETTER', 'A letter that fits the company.'],
      ['5', 'PORTFOLIO', 'Your resume, now a portfolio site.'],
      ['6', 'PORTFOLIO · VOICES', 'Three voices. Same facts.'],
    ],
    src: (n) => `${process.env.SHOTS}/raw-rbj${n}.png`,
    outro: { title: 'Your facts. Better told.', sub: 'Next.js · LLM generation · React PDF · resumebyjob.com' },
  },
  {
    id: 'gymo', w: 1080, h: 1920, kind: 'device',
    pal: { bg: '#1B1840', ink: '#F2F4FF', sub: '#AEB6DA', accent: '#4374FF', hot: '#F39C12', glow: 'rgba(67,116,255,0.28)', glow2: 'rgba(243,156,18,0.16)' },
    intro: { badge: 'icon', icon: 'gymo-icon', title: 'Two apps. One monorepo.', sub: 'Gymo for members. Gymo Manager for gym owners. Shared core, UI and types.', meta: 'IOS · ANDROID · REACT NATIVE · OPEN SOURCE' },
    ghost: 'GYMO',
    scenes: [
      ['goal', 'GYMO · FOR MEMBERS', 'Starts with your goal.'],
      ['home', 'GYMO · FOR MEMBERS', 'Know when the gym is busy.'],
      ['stats', 'GYMO MANAGER · FOR OWNERS', 'The whole gym at a glance.'],
      ['members', 'GYMO MANAGER · FOR OWNERS', 'Every membership, one list.'],
      ['notify', 'GYMO MANAGER · FOR OWNERS', 'Message members in seconds.'],
    ],
    src: (n) => `${process.env.SHOTS}/scr-${n}.png`,
    outro: { title: 'Members and owners, in sync.', sub: 'Yarn workspaces · shared core/ui/types · react-query-firestore · Fastlane' },
  },
  {
    id: 'shorts', w: 1920, h: 1080, kind: 'mac',
    pal: { bg: '#10132A', ink: '#F3F2FF', sub: '#B3B0DA', accent: '#7B6BFF', hot: '#FF5FAE', glow: 'rgba(110,92,255,0.36)', glow2: 'rgba(255,95,174,0.18)' },
    intro: { badge: 'icon', icon: 'shorts-icon', title: 'Reelmaxx. Short-form, maxxed.', sub: 'Research, create, publish, automate and learn — one macOS app for Shorts, TikToks and Reels.', meta: 'MACOS · ELECTRON · FFMPEG · REMOTION' },
    ghost: 'REELMAXX',
    scenes: [
      ['win-research', 'STEP 01 · RESEARCH', 'Find what’s already winning.'],
      ['win-ugc', 'STEP 02 · CREATE', 'UGC reels, no film crew.'],
      ['win-slides', 'STEP 03 · SLIDESHOWS', 'Built to stop the scroll.'],
      ['win-publish', 'STEP 04 · PUBLISH', 'Queue it. Post everywhere.'],
      ['win-devices', 'STEP 05 · DEVICES', 'Drives real iPhones.'],
      ['win-automation', 'STEP 06 · AUTOMATIONS', 'Accounts that warm up themselves.'],
      ['win-insights', 'STEP 07 · INSIGHTS', 'See what actually performs.'],
    ],
    src: (n) => `${SITE}/assets/img/shorts/${n}.webp`,
    outro: { title: 'Prompt → video → posted.', sub: 'OpenAI · Gemini · ElevenLabs · tRPC over IPC' },
  },
];

const FONTFACE = fs.readFileSync(path.join(ROOT, 'fonts/fontface.css'), 'utf8');
const INTRO = 2.6, SCENE = 2.3, OUTRO = 2.6, TR = 0.5;

function css(v) {
  const p = v.pal, port = v.h > v.w;
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: ${v.w}px; height: ${v.h}px; overflow: hidden; background: ${p.bg}; }
    #root { position: relative; width: 100%; height: 100%; overflow: hidden; font-family: "Instrument Sans", sans-serif; color: ${p.ink}; background: ${p.bg}; }
    .bg { position: absolute; inset: 0; overflow: hidden; }
    .glow { position: absolute; border-radius: 50%; }
    .glow-a { width: ${port ? 1300 : 1400}px; height: ${port ? 1300 : 1400}px; left: -380px; top: -420px; background: radial-gradient(circle, ${p.glow} 0%, ${p.glow.replace(/[\d.]+\)$/, '0)')} 65%); }
    .glow-b { width: 1200px; height: 1200px; right: -420px; bottom: -380px; background: radial-gradient(circle, ${p.glow2} 0%, ${p.glow2.replace(/[\d.]+\)$/, '0)')} 65%); }
    .ghost { position: absolute; left: -40px; bottom: ${port ? 120 : 40}px; font-family: "Instrument Serif", serif; font-style: italic; font-size: ${port ? 380 : 420}px; line-height: 0.8; color: ${p.ink}; opacity: 0.06; white-space: nowrap; }
    .hair { position: absolute; left: ${port ? 90 : 120}px; right: ${port ? 90 : 120}px; height: 2px; background: ${p.ink}; opacity: 0.16; }
    .hair-top { top: ${port ? 96 : 80}px; } .hair-bot { bottom: ${port ? 96 : 80}px; }
    .meta-top { position: absolute; top: ${port ? 56 : 42}px; left: ${port ? 90 : 120}px; right: ${port ? 90 : 120}px; display: flex; justify-content: space-between; font-family: "JetBrains Mono", monospace; font-size: 22px; letter-spacing: 0.08em; color: ${p.sub}; }
    .progress { position: absolute; bottom: ${port ? 94 : 78}px; left: ${port ? 90 : 120}px; height: 6px; width: ${v.w - (port ? 180 : 240)}px; background: ${p.accent}; transform-origin: left center; border-radius: 3px; }
    .scene { position: absolute; top: 0; left: 0; width: ${v.w}px; height: ${v.h}px; overflow: hidden; }
    .scene + .scene { opacity: 0; }
    .scene-content { width: 100%; height: 100%; padding: ${port ? '170px 90px 150px' : '150px 120px 140px'}; display: flex; flex-direction: ${port ? 'column' : 'row'}; gap: ${port ? 48 : 80}px; box-sizing: border-box; }
    .center { justify-content: center; flex-direction: column; }
    .badge { flex: none; }
    .kicker { font-family: "JetBrains Mono", monospace; font-size: ${port ? 26 : 24}px; letter-spacing: 0.1em; color: ${p.accent}; font-weight: 500; }
    .cap { font-family: "Instrument Serif", serif; font-size: ${port ? 92 : 104}px; line-height: 0.98; letter-spacing: -0.02em; max-width: ${port ? 880 : 700}px; color: ${p.ink}; }
    .title { font-family: "Instrument Serif", serif; font-size: ${port ? 132 : 128}px; line-height: 0.95; letter-spacing: -0.025em; max-width: ${port ? 900 : 1300}px; }
    .sub { font-size: ${port ? 40 : 38}px; line-height: 1.3; color: ${p.sub}; max-width: ${port ? 860 : 1100}px; }
    .meta { font-family: "JetBrains Mono", monospace; font-size: 24px; letter-spacing: 0.1em; color: ${p.sub}; }
    .rule { width: 240px; height: 6px; background: ${p.accent}; border-radius: 3px; transform-origin: left center; }
    .badge { width: 180px; height: 180px; border-radius: 44px; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 30px 70px rgba(0,0,0,0.35); }
    .badge img { width: 100%; height: 100%; object-fit: cover; }
    .badge-flag { background: #FFFFFF; }
    .badge-flag i { display: block; width: 110px; height: 64px; border-radius: 40px; background: linear-gradient(#CE2230 0 33%, #FFFFFF 33% 66%, #2148C6 66%); border: 3px solid rgba(16,24,43,0.12); }
    .badge-veto { background: #0C0B10; border: 3px solid rgba(205,251,69,0.4); font-family: "Anton", "Instrument Sans", sans-serif; font-size: 70px; color: #CDFB45; letter-spacing: 0.02em; }
    .badge-rbj { background: #FFFFFF; box-shadow: 0 30px 70px rgba(60,30,10,0.18); }
    .badge-rbj i { display: block; width: 64px; height: 64px; border-radius: 14px; background: #FF5A1F; }
    .head { display: flex; flex-direction: column; gap: 22px; ${port ? '' : 'width: 640px; justify-content: center;'} }
    .shot-zone { flex: 1; position: relative; display: flex; align-items: ${port ? 'flex-start' : 'center'}; justify-content: center; min-height: 0; }
    .shot-wrap { position: relative; height: 100%; ${port ? 'max-height: 1240px;' : ''} border-radius: ${port ? 64 : 22}px; overflow: hidden; box-shadow: 0 50px 120px rgba(0,0,0,0.38), 0 0 0 3px rgba(255,255,255,0.08); }
    .shot-wrap img { display: block; height: 100%; width: auto; }
    .mac .shot-wrap { height: auto; width: 100%; max-width: 900px; }
    .mac .shot-wrap img { width: 100%; height: auto; }
    .counter { position: absolute; right: ${port ? 90 : 120}px; bottom: ${port ? 120 : 104}px; font-family: "JetBrains Mono", monospace; font-size: 24px; color: ${p.sub}; letter-spacing: 0.08em; }
    .dot { display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: ${p.hot}; margin-right: 14px; vertical-align: middle; }
    /* panorama */
    .pano-frame { position: absolute; left: 0; top: 0; width: ${v.w}px; height: ${v.h}px; overflow: hidden; }
    .pano-strip { position: absolute; top: 0; left: 0; height: ${v.h}px; display: flex; }
    .pano-strip img { height: ${v.h}px; width: ${v.w}px; display: block; }
    .pano-label { position: absolute; left: 90px; bottom: 150px; padding: 18px 28px; border-radius: 999px; background: ${p.bg}; color: ${p.ink}; font-family: "JetBrains Mono", monospace; font-size: 28px; letter-spacing: 0.08em; box-shadow: 0 20px 50px rgba(0,0,0,0.35); }
    .pano-label b { color: ${p.accent}; font-weight: 500; }
  `;
}

function chrome(v, idx) {
  return `
      <div class="bg" data-layout-ignore>
        <div class="glow glow-a"></div><div class="glow glow-b"></div>
        <div class="ghost">${v.ghost}</div>
      </div>`;
}

function badge(v) {
  const b = v.intro.badge;
  if (b === 'flag') return `<div class="badge badge-flag" id="i-badge"><i></i></div>`;
  if (b === 'veto') return `<div class="badge badge-veto" id="i-badge">RV</div>`;
  if (b === 'rbj') return `<div class="badge badge-rbj" id="i-badge"><i></i></div>`;
  return `<div class="badge" id="i-badge"><img src="assets/${v.intro.icon}.png" alt=""></div>`;
}

function build(v) {
  const dir = path.join(ROOT, v.id), adir = path.join(dir, 'assets');
  fs.mkdirSync(adir, { recursive: true });
  fs.cpSync(path.join(ROOT, 'fonts'), path.join(dir, 'fonts'), { recursive: true, filter: (f) => !f.endsWith('.css') });
  const port = v.h > v.w;
  let html = '', js = '', t = 0, sceneIds = [];

  // INTRO
  html += `<div class="scene" id="s0"><div class="scene-content center">
        ${badge(v)}
        <div class="rule" id="i-rule"></div>
        <h1 class="title" id="i-title">${v.intro.title}</h1>
        <p class="sub" id="i-sub">${v.intro.sub}</p>
        <p class="meta" id="i-meta">${v.intro.meta}</p>
      </div></div>`;
  js += `
      tl.fromTo("#i-badge", { scale: 0.6, opacity: 0, rotation: -8 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: "back.out(1.8)" }, 0.2);
      tl.fromTo("#i-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "expo.out" }, 0.45);
      tl.fromTo("#i-title", { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }, 0.5);
      tl.fromTo("#i-sub", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 0.8);
      tl.fromTo("#i-meta", { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.7, ease: "sine.out" }, 1.0);`;
  sceneIds.push(['s0', 0]);
  t = INTRO;

  if (v.kind === 'pano') {
    // copy panels
    v.panels.forEach((p) => fs.copyFileSync(path.join(HIRES, `${p}.jpg`), path.join(adir, `${p}.jpg`)));
    const dur = v.stops.length * 2.0 + 0.6;
    html += `<div class="scene" id="s1">
        <div class="pano-frame"><div class="pano-strip" id="strip">${v.panels.map((p) => `<img src="assets/${p}.jpg" alt="">`).join('')}</div></div>
        ${v.stops.map((s, i) => `<div class="pano-label" id="pl${i}"><b>${String(i + 1).padStart(2, '0')}</b> &nbsp;${s[1]}</div>`).join('')}
      </div>`;
    sceneIds.push(['s1', t]);
    // transition intro → pano : vertical push
    js += `
      tl.to("#s0", { y: -${v.h}, duration: ${TR}, ease: "power3.inOut" }, ${t - TR});
      tl.fromTo("#s1", { y: ${v.h}, opacity: 1 }, { y: 0, duration: ${TR}, ease: "power3.inOut" }, ${t - TR});`;
    v.stops.forEach((s, i) => {
      const at = t + i * 2.0;
      if (i > 0) js += `
      tl.to("#strip", { x: -${s[0] * v.w}, duration: 0.85, ease: "expo.inOut" }, ${at - 0.45});`;
      js += `
      tl.fromTo("#pl${i}", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${at + 0.15});`;
      if (i < v.stops.length - 1) js += `
      tl.to("#pl${i}", { opacity: 0, duration: 0.2, ease: "power2.in" }, ${at + 1.5});
      tl.set("#pl${i}", { opacity: 0, visibility: "hidden" }, ${at + 1.7});`;
    });
    t += dur;
  } else {
    v.scenes.forEach((s, i) => {
      const id = `s${i + 1}`, file = `${s[0]}.${v.kind === 'mac' ? 'webp' : 'png'}`;
      fs.copyFileSync(v.src(s[0]), path.join(adir, file));
      html += `<div class="scene ${v.kind === 'mac' ? 'mac' : ''}" id="${id}"><div class="scene-content">
        <div class="head">
          <p class="kicker" id="${id}-k"><span class="dot"></span>${s[1]}</p>
          <h2 class="cap" id="${id}-c">${s[2]}</h2>
        </div>
        <div class="shot-zone"><div class="shot-wrap" id="${id}-w"><img id="${id}-img" src="assets/${file}" alt=""></div></div>
      </div><div class="counter" id="${id}-n">${String(i + 1).padStart(2, '0')} / ${String(v.scenes.length).padStart(2, '0')}</div></div>`;
      sceneIds.push([id, t]);
      const prev = i === 0 ? 's0' : `s${i}`;
      // push slide (primary), first one vertical push from intro
      if (i === 0) js += `
      tl.to("#${prev}", { y: -${v.h}, duration: ${TR}, ease: "power3.inOut" }, ${t - TR});
      tl.fromTo("#${id}", { y: ${v.h}, opacity: 1 }, { y: 0, duration: ${TR}, ease: "power3.inOut" }, ${t - TR});`;
      else js += `
      tl.to("#${prev}", { x: -${v.w}, duration: ${TR}, ease: "power3.inOut" }, ${t - TR});
      tl.fromTo("#${id}", { x: ${v.w}, opacity: 1 }, { x: 0, duration: ${TR}, ease: "power3.inOut" }, ${t - TR});`;
      const e = t + 0.05;
      js += `
      tl.fromTo("#${id}-k", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }, ${e + 0.1});
      tl.fromTo("#${id}-c", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.65, ease: "power4.out" }, ${e + 0.18});
      tl.fromTo("#${id}-w", { opacity: 0, y: ${port ? 120 : 0}, x: ${port ? 0 : 120}, rotation: ${i % 2 ? 3 : -3} }, { opacity: 1, y: 0, x: 0, rotation: 0, duration: 0.9, ease: "expo.out" }, ${e + 0.05});
      tl.fromTo("#${id}-img", { scale: 1.0 }, { scale: 1.05, duration: ${SCENE + TR}, ease: "none" }, ${e});
      tl.fromTo("#${id}-n", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "sine.out" }, ${e + 0.4});`;
      t += SCENE;
    });
  }

  // OUTRO
  const oid = 'so', last = sceneIds[sceneIds.length - 1][0];
  html += `<div class="scene" id="${oid}"><div class="scene-content center">
        ${badge(v).replace('id="i-badge"', 'id="o-badge"')}
        <h2 class="title" id="o-title">${v.outro.title}</h2>
        <p class="sub" id="o-sub">${v.outro.sub}</p>
      </div></div>`;
  js += `
      tl.to("#${last}", { opacity: 0, filter: "blur(18px)", duration: 0.6, ease: "sine.inOut" }, ${t - 0.3});
      tl.fromTo("#${oid}", { opacity: 0, filter: "blur(18px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "sine.inOut" }, ${t - 0.2});
      tl.fromTo("#o-badge", { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, ${t + 0.1});
      tl.fromTo("#o-title", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power4.out" }, ${t + 0.25});
      tl.fromTo("#o-sub", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "sine.out" }, ${t + 0.55});`;
  const total = +(t + OUTRO).toFixed(2);
  // ambient + progress (seekable)
  js = `
      tl.fromTo(".glow-a", { x: 0, y: 0, scale: 1 }, { x: 120, y: 80, scale: 1.12, duration: ${total}, ease: "sine.inOut" }, 0);
      tl.fromTo(".glow-b", { x: 0, y: 0 }, { x: -100, y: -60, duration: ${total}, ease: "sine.inOut" }, 0);
      tl.fromTo(".ghost", { x: 0 }, { x: -260, duration: ${total}, ease: "none" }, 0);
      tl.fromTo("#progress", { scaleX: 0 }, { scaleX: 1, duration: ${total}, ease: "none" }, 0);` + js;

  // icons
  if (v.intro.icon) {
    const src = { 'sircles-icon': `${SITE}/assets/img/sircles/icon.jpg`, 'pop-icon': `${SITE}/assets/img/pop/icon.jpg`, 'shorts-icon': process.env.RMX_ICON, 'gymo-icon': `${SITE}/assets/img/gymo/icon.webp` }[v.intro.icon];
    fs.copyFileSync(src, path.join(adir, `${v.intro.icon}.png`));
  }

  const doc = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${v.w}, height=${v.h}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>${FONTFACE}
${css(v)}</style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${v.w}" data-height="${v.h}">
      ${chrome(v)}
      ${html}
      <div class="hair hair-top" data-layout-ignore></div>
      <div class="meta-top" data-layout-ignore><span>AMINE BOUHLALI · APP PREVIEW</span><span>${v.ghost}</span></div>
      <div class="hair hair-bot" data-layout-ignore></div>
      <div class="progress" id="progress" data-layout-ignore></div>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      ${js}
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;
  fs.writeFileSync(path.join(dir, 'index.html'), doc);
  if (!fs.existsSync(path.join(dir, 'package.json'))) {
    for (const f of ['package.json', 'hyperframes.json', 'meta.json']) {
      const s = path.join(ROOT, 'sircles', f);
      if (fs.existsSync(s) && v.id !== 'sircles') fs.writeFileSync(path.join(dir, f), fs.readFileSync(s, 'utf8').replace(/sircles/g, v.id));
    }
  }
  console.log('built', v.id, total + 's');
}

const only = process.argv[2];
VIDEOS.filter((v) => !only || v.id === only).forEach(build);
