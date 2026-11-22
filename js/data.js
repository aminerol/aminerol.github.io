/* Content for case-study and project sheets. */
window.PORTFOLIO = {
  notifications: [
    { app: 'Sircles', icon: 'assets/img/sircles/icon.jpg', time: 'now', title: 'Sara checked in at Café Clock', body: '3 friends in your circle love this place. Tap to see why.', open: ['xp', 'sircles'] },
    { app: 'POP Manager', icon: 'assets/img/popmanager/icon.jpg', time: '2m ago', title: 'New leave request', body: 'Jane Cooper requested 6 days off · Jun 03 → Jun 11. Approve?', open: ['xp', 'gemography'] },
    { app: 'OpenChair', iconHTML: 'openchair', time: '4m ago', title: '2 barbers available', body: 'Haircut + Beard · right now. See who answered.', open: ['project', 'openchair'] },
    { app: 'RAP Veto', iconHTML: 'veto', time: '9m ago', title: 'You pushed OBSESSED to #1 🔥', body: 'Your share link brought 12 new votes tonight.', open: ['project', 'veto'] },
    { app: 'POP by Gemo', icon: 'assets/img/pop/icon.jpg', time: '20m ago', title: 'Holiday alert 🎉', body: 'Independence Day is coming up in 2 days.', open: ['xp', 'gemography'] },
    { app: 'Reelmaxx', icon: 'assets/img/shorts/icon.webp?v=2', time: '32m ago', title: 'Render finished', body: '“5 quick tips for phone photography” · 0:42 · ready to publish.', open: ['project', 'shorts'] },
    { app: 'ResumeByJob', iconHTML: 'resumebyjob', time: '1h ago', title: 'Resume tailored ✓', body: '14 suggestions ready to review for Senior Mobile Engineer.', open: ['project', 'resumebyjob'] },
    { app: 'Gymo', icon: 'assets/img/gymo/icon.webp', time: '2h ago', title: 'Leg day at 18:00 💪', body: 'Your coach added a new workout to this week’s plan.', open: ['project', 'gymo'] },
    { app: 'VPN.Express', iconHTML: 'vpn', time: 'yesterday', title: 'You’re protected 🛡️', body: 'Connected to Amsterdam · your real IP is hidden.', open: ['project', 'vpn'] }
  ],

  shiplog: [
    ['shipped', 'Sircles', 'Real-time chat & gesture UI · 4.7★', ['xp', 'sircles']],
    ['shipped', 'POP Manager', 'Managers handle their team’s leave requests', ['xp', 'gemography']],
    ['shipped', 'POP by Gemo', 'Request & track time off', ['xp', 'gemography']],
    ['oss', 'react-query-firestore', 'Firestore + React Query · ★ 103', ['project', 'gymo']],
    ['built', 'OpenChair', 'On-demand barber marketplace', ['project', 'openchair']],
    ['built', 'RAP Veto', 'Fan-voted chart for Moroccan rap', ['project', 'veto']],
    ['built', 'Reelmaxx', 'Prompt → short video on macOS', ['project', 'shorts']],
    ['live', 'ResumeByJob', 'Resumes tailored to each job', ['project', 'resumebyjob']],
    ['history', 'VPN.Express', 'VPN apps for Windows, iOS & Android', ['project', 'vpn']]
  ],

  xp: {
    sircles: {
      kind: 'Case study',
      title: 'Sircles',
      role: 'React Native Engineer',
      period: 'Feb 2022 – Jun 2026',
      icon: 'assets/img/sircles/icon.jpg',
      accent: '#33b6ff',
      accent2: '#ff5b8a',
      tagline: 'Close-friend circles, real-time chat, and the gesture work that makes it feel alive.',
      intro: 'Sircles is a location-based social app built around your closest friends: check-ins, recommendations you can actually trust, gamified badges and entertainment discovery — rated 4.7★ from 927 reviews on the App Store. I worked across the whole app, from build tooling and native modules to the interactions people touch every day.',
      facts: [['Role', 'React Native Engineer'], ['When', 'Feb 2022 – Jun 2026'], ['Platforms', 'iOS · Android'], ['App Store', '4.7★ · 927 ratings']],
      stack: ['React Native', 'Expo', 'TypeScript', 'GraphQL', 'WebSocket subscriptions', 'Firebase', 'Mapbox', 'Reanimated', 'Gesture Handler', 'Jotai', 'Lottie'],
      groups: [
        {
          name: 'Architecture & migrations',
          items: [
            ['Untangled the monorepo', 'Front and back end shared zero code but all of the friction — scattered files, painful upgrades, complex tooling. I made the case for a standalone app repo and led the move, which later unblocked Expo adoption and every React Native upgrade after it.'],
            ['React Native 0.79 + New Architecture', 'Led the upgrade end to end: native build configs, dependency surgery and a Recoil → Jotai state migration, all while the app kept shipping to users.'],
            ['One routing layer for 10+ entities', 'Universal deep linking across iOS Universal Links, Android App Links and custom URL schemes, with deferred routing so signed-out users land in the right place after auth.'],
            ['Native modules', 'Built and maintained native modules for messaging notifications and storage, and kept behaviour consistent across iOS and Android.']
          ]
        },
        {
          name: 'Product engineering',
          items: [
            ['Topic-threaded chat', 'A threading model that organises conversations by subject inside a single chat. Group and DM messaging, media, reactions and typing indicators, with optimistic UI over GraphQL WebSocket subscriptions.'],
            ['Gesture-driven components', 'A rotary wheel that follows pan gestures in polar coordinates with snapping and haptics, and a drag-to-reorder grid with animated repositioning — both on Reanimated + Gesture Handler. Try them in the Gesture Lab.'],
            ['12-step onboarding', 'Firebase phone verification on both platforms with rate limiting, code expiry and error recovery; location, contacts and notification permissions; Lottie animations, staggered transitions and step persistence.']
          ]
        },
        {
          name: 'Performance & influence',
          items: [
            ['Smooth chat under load', 'Profiled and fixed rendering bottlenecks in virtualised lists, eliminated scroll jitter in high-throughput chat, cut re-renders with memoisation and raised animation frame rates with Reanimated.'],
            ['Advocating for the foundations', 'Pushed product and engineering toward architecture and state-management work even when it was not yet visible to users — the kind of work that makes the next feature cheap.']
          ]
        }
      ],
      video: { src: 'assets/video/sircles.mp4', poster: 'assets/video/sircles.jpg', orient: 'portrait' },
      gallery: { type: 'phone', images: ['assets/img/sircles/1.webp', 'assets/img/sircles/2.webp', 'assets/img/sircles/3.webp', 'assets/img/sircles/4.webp', 'assets/img/sircles/5.webp', 'assets/img/sircles/6.webp', 'assets/img/sircles/7.webp', 'assets/img/sircles/8.webp', 'assets/img/sircles/9.webp'], caption: 'App Store screenshots' },
      links: [
        { label: 'App Store', href: 'https://apps.apple.com/us/app/sircles/id1213538655', icon: 'apple' },
        { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.sircles.sircles', icon: 'play' },
        { label: 'sircles.com', href: 'https://sircles.com', icon: 'ext' }
      ]
    },

    gemography: {
      kind: 'Case study',
      title: 'Gemography',
      role: 'Lead React Native Engineer',
      period: 'Nov 2019 – Dec 2021',
      icon: 'assets/img/pop/icon.jpg',
      accent: '#6c5ce7',
      accent2: '#a29bfe',
      tagline: 'Two apps on one codebase — POP by Gemo for employees, POP Manager for managers handling their team’s leave.',
      intro: 'POP is Gemography\'s people-operations platform. Employees request and track leave, see upcoming holidays and stay in sync with their team; managers see availability at a glance and approve requests. I was the lead React Native engineer across both the employee and manager apps — owning architecture, delivery and cross-platform consistency.',
      facts: [['Role', 'Lead React Native Engineer'], ['When', 'Nov 2019 – Dec 2021'], ['Apps', 'POP by Gemo · POP Manager'], ['Platforms', 'iOS · Android']],
      stack: ['React Native', 'TypeScript', 'React Query', 'Restyle by Shopify', 'Fastlane', 'Monorepo', 'Native modules'],
      groups: [
        {
          name: 'Architecture',
          items: [
            ['Shared monorepo', 'Designed and maintained a monorepo that shared UI and business logic between two separate apps — while working around the React Native tooling limitations of the time.'],
            ['Design system on Restyle', 'Built the UI foundation from scratch on Restyle by Shopify: reusable, themeable, highly composable components shared by both apps as an internal library.'],
            ['Offline-first', 'React Query hydration and dehydration so leave data stays available — and the app stays pleasant — on unstable networks.']
          ]
        },
        {
          name: 'Product & performance',
          items: [
            ['Approve from the notification', 'A native module powering rich notification views, so managers approve or reject leave requests without opening the app. Try it in the Gesture Lab.'],
            ['60 fps calendars', 'Kept complex calendar and scheduling screens smooth despite heavy date maths and long scrollable month lists.']
          ]
        },
        {
          name: 'Release engineering',
          items: [
            ['CI/CD with Fastlane', 'Automated staging and production pipelines for consistent releases and less manual overhead.'],
            ['Isolated environments', 'Separate staging and production configurations, build pipelines and deployment flows for safer testing and rollout.']
          ]
        }
      ],
      video: { src: 'assets/video/pop.mp4?v=2', poster: 'assets/video/pop.jpg?v=2', orient: 'portrait' },
      apps: [
        { name: 'POP by Gemo', who: 'For employees', icon: 'assets/img/pop/icon.jpg', since: 'App Store · Jan 2021', href: 'https://apps.apple.com/us/app/pop-by-gemo/id1547411689',
          copy: 'Request a leave or report a past one in seconds, keep track of upcoming and previous leaves, get notified about holidays and request status, and stay in sync with teammates.',
          bullets: ['Leave requests & history', 'Holiday + status notifications', 'Team availability'],
          images: ['assets/img/pop/1.webp', 'assets/img/pop/2.webp', 'assets/img/pop/3.webp', 'assets/img/pop/4.webp'] },
        { name: 'POP Manager', who: 'For managers', icon: 'assets/img/popmanager/icon.jpg', since: 'App Store · Jun 2020', href: 'https://apps.apple.com/us/app/pop-manager/id1495368124',
          copy: 'Managers handle their employees’ leave: team availability at a glance, a leave calendar per person, and approve or decline requests — right from the notification when it’s quicker.',
          bullets: ['Instant request notifications', 'Leave calendar per teammate', 'Approve / decline in one tap'],
          images: ['assets/img/popmanager/1.webp', 'assets/img/popmanager/2.webp', 'assets/img/popmanager/3.webp', 'assets/img/popmanager/4.webp', 'assets/img/popmanager/5.webp'] }
      ],
      gallery: null,
      links: [
        { label: 'POP by Gemo', href: 'https://apps.apple.com/us/app/pop-by-gemo/id1547411689', icon: 'apple' },
        { label: 'POP Manager', href: 'https://apps.apple.com/us/app/pop-manager/id1495368124', icon: 'apple' }
      ]
    }
  },

  projects: {
    openchair: {
      kind: 'Mobile app · 2026',
      title: 'OpenChair',
      tagline: 'A barber, right now.',
      accent: '#2148c6',
      accent2: '#ce2230',
      light: true,
      intro: 'OpenChair is an on-demand barber marketplace, launching in Agdal, Rabat. Customers think “I need a barber now”; barbers think “I have an empty chair now”. The app connects those two moments — no calendars, no bidding, no directory scrolling.',
      sections: [
        ['How it works', 'The customer broadcasts a request. Nearby barbers with a free chair answer that they’re available. The customer picks one, the barber reconfirms inside a 45-second window, and the job takes over from there — live, until the rating.'],
        ['Designed first, then built', 'The whole product was designed in Claude Design: 37 screens and 73 states across a customer app and a barber app, each with annotated measurements, copy tables and a clickable prototype. I then built it in React Native against that handoff with an agent-orchestrated workflow — specialist reviewers for visual parity, RTL and performance gate every screen.'],
        ['Under the hood', 'Expo + React Native on the New Architecture, Supabase for Postgres, Realtime and Edge Functions, TanStack Query with persistence, MMKV, FlashList, Reanimated and Gesture Handler. English and Moroccan Arabic with full RTL.']
      ],
      bullets: ['Customer + barber apps in one codebase', 'Realtime broadcast → offer → reconfirm flow', 'English + ar-MA with full RTL', 'Pixel-parity QA against 73 design states', 'Performance regression tests with Reassure'],
      facts: [['Role', 'Product + engineering'], ['Platforms', 'iOS · Android'], ['Status', 'MVP · Rabat pilot']],
      stack: ['Expo', 'React Native', 'TypeScript', 'Supabase', 'Realtime', 'TanStack Query', 'Reanimated', 'Unistyles', 'i18next · RTL', 'Sentry', 'PostHog'],
      video: { src: 'assets/video/openchair.mp4', poster: 'assets/video/openchair.jpg', orient: 'portrait' },
      gallery: { type: 'phone', images: ['assets/img/openchair/customer-04-home_live.webp', 'assets/img/openchair/customer-07-new.webp', 'assets/img/openchair/customer-13-search_offers.webp', 'assets/img/openchair/customer-21-job_matched.webp', 'assets/img/openchair/barber-11-available.webp', 'assets/img/openchair/barber-09-request.webp', 'assets/img/openchair/barber-12-reconfirm.webp', 'assets/img/openchair/barber-14-matched.webp', 'assets/img/openchair/barber-19-job_rated.webp', 'assets/img/openchair/customer-16-profile.webp', 'assets/img/openchair/barber-24-upgrade.webp'], caption: 'Customer app, then barber app' },
      links: []
    },

    veto: {
      kind: 'Mobile web · 2026',
      title: 'RAP Veto',
      tagline: 'The people’s chart for Moroccan rap.',
      accent: '#cdfb45',
      accent2: '#ff5a3c',
      intro: 'Fans vote songs up a season leaderboard, and the top 15 win a playlist slot and a share of a 25K MAD prize pool. It’s built for Gen-Z Morocco: phone-first, instant, a little competitive — and every action is designed to be shared.',
      sections: [
        ['A vote economy, not a like button', 'Anyone can vote in seconds. Anonymous votes become “Buzz” — social proof that doesn’t move the rank — until the fan verifies by SMS code and their votes are claimed. Verified fans hold free, bonus and paid votes, spent in that order, and can boost a favourite with purchased packs.'],
        ['Sharing is the growth loop', 'Vote → share → friends open the link or scan the story QR → they vote. Share cards are rendered on demand at the edge in four variants — story, portrait, square and sticker — each carrying the sharer’s votes, rank and the season stakes, with referral links that pay out bonus votes.'],
        ['Made for the audience', 'English and Arabic/Darija with full RTL, Midnight Casa visual system (Anton numbers, Space Grotesk UI, a single acid-lime accent), bottom-sheet modals on mobile and dialogs on desktop.']
      ],
      bullets: ['Phone-OTP sign-in, no passwords', 'Buzz vs counted votes, claim on sign-in', 'Vote packs, boosts and payment confirmation polling', 'Edge-rendered share cards with QR', 'EN + AR/Darija, RTL-first QA'],
      facts: [['Role', 'Product + full-stack'], ['Platform', 'Mobile-first web'], ['Market', 'Morocco']],
      stack: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Headless UI', 'Edge OG images', 'SMS OTP', 'Payments'],
      video: { src: 'assets/video/veto.mp4', poster: 'assets/video/veto.jpg', orient: 'portrait' },
      gallery: { type: 'mixed', images: [['phone', 'assets/img/veto/home.webp'], ['phone', 'assets/img/veto/song.webp'], ['browser', 'assets/img/veto/desktop.webp', 'veto-rap.vercel.app']], caption: 'Live site — mobile and desktop' },
      links: [{ label: 'Open RAP Veto', href: 'https://veto-rap.vercel.app/', icon: 'ext' }]
    },

    resumebyjob: {
      kind: 'Web app · AI',
      title: 'ResumeByJob',
      tagline: 'Same facts, better ordered, in the words the posting uses.',
      accent: '#ff6b2c',
      accent2: '#1a1a1a',
      light: true,
      intro: 'Drop in your resume PDF and the job posting. ResumeByJob reads the roles, skills and results already on your page, treats the posting as the brief, and proposes a tailored one-page resume — using the posting’s vocabulary without inventing a single employer, skill or date.',
      sections: [
        ['Honest by design', 'Matching a posting should make your real fit easier to see, not turn an application into fiction. The source stays visible, every proposed change is marked, additions are opt-in, and you accept, edit, reorder or remove each suggestion before exporting.'],
        ['Private by default', 'No account. Your resume, application answers and history live in your browser; AI generation sends inputs for processing and nothing is stored on the server.'],
        ['More than a rewrite', 'A company-matched cover letter generator, and a library of practical resume-tailoring guides.']
      ],
      bullets: ['PDF in, one-page PDF out', 'Reviewable diff for every change', 'No fabricated experience — enforced', 'Browser-only storage, no sign-up', 'Cover letters + SEO guides'],
      facts: [['Role', 'Design + engineering'], ['Platform', 'Web'], ['Status', 'Live']],
      stack: ['Next.js', 'React', 'TypeScript', 'LLM generation', 'React PDF', 'Headless UI', 'Vaul', 'PostHog'],
      video: { src: 'assets/video/resumebyjob.mp4', poster: 'assets/video/resumebyjob.jpg', orient: 'portrait' },
      gallery: { type: 'mixed', images: [['phone', 'assets/img/resumebyjob/shot-1.webp?v=2'], ['phone', 'assets/img/resumebyjob/shot-3.webp?v=2'], ['phone', 'assets/img/resumebyjob/shot-4.webp?v=2'], ['phone', 'assets/img/resumebyjob/shot-5.webp?v=2'], ['phone', 'assets/img/resumebyjob/shot-6.webp?v=2']], caption: 'Real runs: tailoring a resume, writing a cover letter, turning a resume into a portfolio' },
      links: [{ label: 'Open ResumeByJob', href: 'https://www.resumebyjob.com/', icon: 'ext' }]
    },

    shorts: {
      kind: 'macOS app · Electron',
      title: 'Reelmaxx',
      tagline: 'An AI studio that writes, voices, edits and publishes short-form video.',
      accent: '#5b4be6',
      accent2: '#a5b4fc',
      intro: 'Reelmaxx is a macOS desktop app for producing YouTube Shorts, TikToks and Reels end to end. Describe the reel or pick a topic idea, and the pipeline handles the script, voiceover, captions, background footage, music and export — then helps you research what works and publish it.',
      sections: [
        ['The pipeline', 'AI script generation with OpenAI and Gemini, voices from ElevenLabs, TikTok TTS or OpenAI, word-timed captions converted to styled ASS subtitles, and two render engines: FFmpeg for raw speed and Remotion for React-driven compositions. Formats include brainrot gameplay, UGC and photo slideshows.'],
        ['Beyond editing', 'A Research tab that searches TikTok for winning content, a Publish queue, Insights for post analytics, a media Library, multi-account management and reusable presets. It can even drive real iPhones through WebDriverAgent for automations.'],
        ['Architecture', 'A multi-window Electron app — main editor plus subtitle editors — with feature modules in the main process exposed to React renderers through tRPC over IPC, and LowDB for local project storage.']
      ],
      bullets: ['Prompt → script → voice → captions → video', 'FFmpeg + Remotion render engines', 'Brainrot, UGC and slideshow formats', 'TikTok research + publishing queue', 'Multi-window Electron, tRPC over IPC'],
      facts: [['Role', 'Solo developer'], ['Platform', 'macOS (Electron)'], ['Status', 'Personal tool, in use']],
      stack: ['Electron', 'React', 'TypeScript', 'tRPC', 'FFmpeg', 'Remotion', 'OpenAI', 'Gemini', 'ElevenLabs', 'Tailwind', 'LowDB'],
      video: { src: 'assets/video/shorts.mp4?v=3', poster: 'assets/video/shorts.jpg?v=3', orient: 'landscape' },
      gallery: { type: 'mac', images: ['assets/img/shorts/mk-home.webp', 'assets/img/shorts/mk-research.webp', 'assets/img/shorts/mk-ugc.webp', 'assets/img/shorts/mk-slides.webp', 'assets/img/shorts/mk-publish.webp', 'assets/img/shorts/mk-devices.webp', 'assets/img/shorts/mk-automation.webp', 'assets/img/shorts/mk-insights.webp'], caption: 'Prompt home, research, UGC and slideshow editors, publishing, real-iPhone automations and insights' },


      links: []
    },

    gymo: {
      kind: 'Two mobile apps · Open source',
      title: 'Gymo',
      tagline: 'Two apps, one monorepo: Gymo for members, Gymo Manager for gym owners.',
      accent: '#6f5cff',
      accent2: '#201844',
      intro: 'Gymo gives a neighbourhood gym a proper digital front desk, split into two apps that share one codebase. Members get Gymo: onboard with a goal, see how busy the gym is, book today’s workout and chat with the gym. Gym owners get Gymo Manager: track members and memberships, see how the month compares, and message members in a few taps.',
      apps: [
        { name: 'Gymo', who: 'For members', icon: 'assets/img/gymo/icon.webp?v=2', since: 'iOS · Android', href: 'https://github.com/aminerol/gymo/tree/develop/apps/client', linkIcon: 'github', linkLabel: 'apps/client',
          copy: 'Goal-driven onboarding (goal, body metrics, profile, training days), a home with the gym crowd by muscle and hour, today’s workout to book or skip, chat with the gym and notifications.',
          images: ['assets/img/gymo/shot-1.webp?v=2', 'assets/img/gymo/shot-metrics.webp', 'assets/img/gymo/shot-2.webp?v=2', 'assets/img/gymo/shot-membership.webp', 'assets/img/gymo/shot-chat.webp'] },
        { name: 'Gymo Manager', who: 'For gym owners', icon: 'assets/img/gymo/icon-manager.webp', since: 'iOS · Android', href: 'https://github.com/aminerol/gymo/tree/develop/apps/manager', linkIcon: 'github', linkLabel: 'apps/manager',
          copy: 'A dashboard compared with last month, members filtered by new, active, inactive and deleted, Classic, Gold and Premium memberships, class schedules, threaded chat and a notification composer with audience filters.',
          images: ['assets/img/gymo/shot-3.webp?v=2', 'assets/img/gymo/shot-4.webp?v=2', 'assets/img/gymo/shot-profile.webp', 'assets/img/gymo/shot-renew.webp', 'assets/img/gymo/shot-5.webp?v=2', 'assets/img/gymo/shot-inbox.webp'] }
      ],
      sections: [
        ['One monorepo, two apps', 'Both React Native apps live in Yarn workspaces and share core (API hooks, auth, notifications), ui (theme and components) and types packages, so a feature like memberships is modelled once and shows up correctly on both sides.'],
        ['Shared backend', 'A Next.js API and Firestore behind both apps, read through react-query-firestore — my own package for using Firestore with React Query, later published on its own.'],
        ['Shipping both', 'Each app has its own identity, icon and Fastlane beta and production lanes, built from the same commit. Arabic-first, with right-to-left layouts throughout.']
      ],
      bullets: ['Two apps: members + gym owners', 'One monorepo, shared core/ui/types', 'Firestore through React Query', 'RTL layouts', 'Fastlane lanes per app'],
      facts: [['Role', 'Solo developer'], ['Apps', 'Gymo · Gymo Manager'], ['Platforms', 'iOS · Android'], ['Code', 'Public on GitHub']],
      stack: ['React Native', 'Expo', 'TypeScript', 'Yarn workspaces', 'Firebase', 'Firestore', 'React Query', 'Reanimated', 'Next.js', 'Fastlane'],
      video: { src: 'assets/video/gymo.mp4?v=2', poster: 'assets/video/gymo.jpg?v=2', orient: 'portrait' },
      galleryFirst: true,
      gallery: { type: 'phone', images: ['assets/img/gymo/shot-duo.webp?v=2'], caption: 'Screens rebuilt from the open-source code: Gymo for members (blue) and Gymo Manager for gym owners (orange)' },
      links: [{ label: 'GitHub', href: 'https://github.com/aminerol/gymo', icon: 'github' }, { label: 'react-query-firestore', href: 'https://github.com/aminerol/react-query-firestore', icon: 'github' }]
    },

    vpn: {
      kind: 'Cross-platform · 2016–2019',
      title: 'VPN.Express',
      tagline: 'Fast, safe and simple VPN — built across three platforms.',
      accent: '#1e88e5',
      accent2: '#5ec2ff',
      intro: 'My first product team. VPN.Express offered encrypted, no-logs browsing with 64 servers in 28 countries and clients for Windows, macOS, Linux, iOS, Android and Roku. I led development across Windows, iOS and Android — making the architectural calls for each platform independently.',
      sections: [
        ['Windows (C# / WPF)', 'Built and shipped the Windows client on MVVM, with the networking logic in a separate WCF service talking to the desktop app over inter-process communication.'],
        ['iOS (Swift)', 'Built from scratch in Swift with fully programmatic UI, and integrated OpenVPN at a low level at a time when mature libraries simply didn’t exist — handling encryption and tunnelling constraints directly.'],
        ['Android (Java) & reliability', 'Delivered a full Android client on a short timeline by adapting an open-source VPN foundation. Across all three, owned reconnection logic and stable tunnelling on unstable mobile networks.']
      ],
      bullets: ['Windows, iOS and Android clients', 'WCF networking service over IPC', 'Low-level OpenVPN on iOS', 'Reconnect + stability on mobile networks'],
      facts: [['Role', 'Software engineer · platform lead'], ['Platforms', 'Windows · iOS · Android'], ['When', 'Jul 2016 – Aug 2019']],
      stack: ['C#', 'WPF', 'WCF', 'Swift', 'Java', 'OpenVPN', 'MVVM'],
      gallery: { type: 'mixed', images: [['phone', 'assets/img/vpn/shot-3.webp?v=2'], ['phone', 'assets/img/vpn/shot-4.webp?v=2'], ['phone', 'assets/img/vpn/shot-5.webp?v=2'], ['phone', 'assets/img/vpn/shot-1.webp?v=2'], ['phone', 'assets/img/vpn/shot-2.webp?v=2']], caption: 'iOS and Android screens recreated, then the Windows client (real screenshots)' },
      links: [{ label: 'View on Wayback Machine', href: 'https://web.archive.org/web/20180617181449/https://vpn.express/', icon: 'ext' }]
    }
  }
};
