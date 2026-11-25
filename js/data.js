/* Content for case-study and project sheets.
   Story items: [title, body, result]. Blank line ("\n\n") in a body starts a new paragraph.
   The result renders as the story's closing paragraph. */
window.PORTFOLIO = {
  notifications: [
    {
      app: "Sircles",
      icon: "assets/img/sircles/icon.jpg",
      time: "now",
      title: "Sara checked in at Café Clock",
      body: "3 friends in your circle love this place. Tap to see why.",
      open: ["xp", "sircles"],
    },
    {
      app: "POP Manager",
      icon: "assets/img/popmanager/icon.jpg",
      time: "2m ago",
      title: "New leave request",
      body: "Jane Cooper requested 6 days off · Jun 03 → Jun 11. Approve?",
      open: ["xp", "gemography"],
    },
    {
      app: "OpenChair",
      iconHTML: "openchair",
      time: "4m ago",
      title: "2 barbers available",
      body: "Haircut + Beard · right now. See who answered.",
      open: ["project", "openchair"],
    },
    {
      app: "RAP Veto",
      iconHTML: "veto",
      time: "9m ago",
      title: "You pushed OBSESSED to #1 🔥",
      body: "Your share link brought 12 new votes tonight.",
      open: ["project", "veto"],
    },
    {
      app: "POP by Gemo",
      icon: "assets/img/pop/icon.jpg",
      time: "20m ago",
      title: "Holiday alert 🎉",
      body: "Independence Day is coming up in 2 days.",
      open: ["xp", "gemography"],
    },
    {
      app: "Reelmaxx",
      icon: "assets/img/shorts/icon.webp?v=2",
      time: "32m ago",
      title: "Render finished",
      body: "“5 quick tips for phone photography” · 0:42 · ready to publish.",
      open: ["project", "shorts"],
    },
    {
      app: "ResumeByJob",
      iconHTML: "resumebyjob",
      time: "1h ago",
      title: "Resume tailored ✓",
      body: "14 suggestions ready to review for Senior Mobile Engineer.",
      open: ["project", "resumebyjob"],
    },
    {
      app: "Gymo",
      icon: "assets/img/gymo/icon.webp",
      time: "2h ago",
      title: "Leg day at 18:00 💪",
      body: "Your coach added a new workout to this week’s plan.",
      open: ["project", "gymo"],
    },
    {
      app: "VPN.Express",
      iconHTML: "vpn",
      time: "yesterday",
      title: "You’re protected 🛡️",
      body: "Connected to Amsterdam · your real IP is hidden.",
      open: ["project", "vpn"],
    },
  ],

  shiplog: [
    [
      "shipped",
      "Sircles",
      "Social app for close-friend circles · 4.7★",
      ["xp", "sircles"],
    ],
    [
      "shipped",
      "POP Manager",
      "Team leave management for managers",
      ["xp", "gemography"],
    ],
    [
      "shipped",
      "POP by Gemo",
      "Time-off app for employees",
      ["xp", "gemography"],
    ],
    [
      "oss",
      "react-query-firestore",
      "Firestore hooks for React Query · ★ 103",
      ["project", "gymo"],
    ],
    [
      "built",
      "OpenChair",
      "On-demand barber marketplace",
      ["project", "openchair"],
    ],
    ["built", "RAP Veto", "Fan-voted Moroccan rap chart", ["project", "veto"]],
    [
      "built",
      "Reelmaxx",
      "AI short-video studio for macOS",
      ["project", "shorts"],
    ],
    [
      "live",
      "ResumeByJob",
      "AI resume tailoring for each job",
      ["project", "resumebyjob"],
    ],
    [
      "history",
      "VPN.Express",
      "Cross-platform VPN for private browsing",
      ["project", "vpn"],
    ],
  ],

  xp: {
    sircles: {
      kind: "Case study",
      title: "Sircles",
      role: "React Native Engineer",
      period: "Feb 2022 to Jun 2026",
      icon: "assets/img/sircles/icon.jpg",
      accent: "#33b6ff",
      accent2: "#ff5b8a",
      tagline:
        "A location-based social app built around your closest friends, with real-time chat, check-ins and badges.",
      intro:
        "Sircles is a social app built around your closest friends: check-ins, recommendations from people you trust, badges, streaks and real-time chat. It’s rated 4.7★ on the App Store. I spent over four years on the mobile app, and much of my work was keeping a growing app easy to change without slowing down what users saw.",
      tldr: [
        "Gave the app its own home and an automated release pipeline, then brought React Native up to date without pausing releases.",
        "Built the topic-based group chat, the gesture-driven screens and the links that open the right place.",
        "Wrote the native code that makes notifications open the right screen and keeps badge counts honest.",
        "Made it possible to ship fixes without waiting on app store review.",
      ],
      facts: [
        ["Role", "React Native Engineer"],
        ["When", "Feb 2022 to Jun 2026"],
        ["Platforms", "iOS · Android"],
        ["App Store", "4.7★"],
      ],
      stack: [
        "React Native 0.79",
        "Expo",
        "New Architecture",
        "TypeScript",
        "GraphQL",
        "WebSocket subscriptions",
        "Firebase",
        "Mapbox",
        "Reanimated",
        "Gesture Handler",
        "Jotai",
        "FlashList",
        "Sentry",
        "EAS Update",
        "Swift",
        "Kotlin",
      ],
      groups: [
        {
          name: "Making the app easier to change",
          items: [
            [
              "Gave the app its own repository",
              "The mobile app shared a repository with the backend, but the two shared no code. Every upgrade touched both, files were scattered, and the tooling slowed everyone down. Keeping them together cost us time and bought us nothing.\n\nI made that case to the team and led the split. I used the move to clean house: within days, the app ran on standard building blocks instead of our home-made versions, and iOS and Android builds ran automatically.",
              "The team was shipping again within days, and every upgrade after that became a smaller, safer job.",
            ],
            [
              "Upgraded React Native without freezing releases",
              "Big framework upgrades are where apps stall: feature work stops until the upgrade lands. I didn’t want that, so I broke the work into steps that could each ship on their own, and saved the riskiest change, React Native’s New Architecture, for last.\n\nWhen that step went out, a few things broke, like pasting text into the chat. Rather than patch it under pressure, I switched the new architecture off, fixed the problems properly, and turned it back on once it was solid.",
              "Users kept getting updates the whole way through, and the app now sits on a foundation that current libraries support.",
            ],
            [
              "Replaced a dying library before it hurt us",
              "The library holding the app’s state was no longer maintained, and it had already caused a bug that left the home screen stuck. Every feature built on top of it would make leaving harder later. So while the move was still a manageable size, I moved the app to a maintained alternative, including the data it keeps between launches.",
              "We stopped building on a dead end.",
            ],
            [
              "Shipped fixes without waiting on app review",
              "App store review can hold back even a one-line fix. I set up a way to send updates straight to the installed app, run from a simple form: which environment, which app version, which platform.",
              "Fixes reach testers and users as soon as they’re ready, not when the review queue clears.",
            ],
          ],
        },
        {
          name: "Features people use every day",
          items: [
            [
              "Built group chat that splits by topic",
              "Big group chats get messy: the plan for Saturday ends up buried under five other conversations. I built topics, so one group chat can be split by subject while everyone stays in the same place.\n\nI wanted the chat to feel instant, so messages appear the moment you hit send and confirm with the server in the background. Photos and videos you send play straight from your phone instead of downloading again.",
              "Conversations stay organized, and the chat never feels like it’s waiting on the network.",
            ],
            [
              "Made the app feel physical",
              "Some screens needed more than taps. I built a wheel for browsing categories that follows your thumb and clicks into place with a small vibration, and a grid of your closest friends you rearrange by dragging. I ran the animations apart from the app’s other work, so they stay smooth while the app is busy loading.",
              "These screens feel fluid instead of fiddly.",
            ],
            [
              "Made shared links open the right screen",
              "A link shared from Sircles can point to a group, a chat, a profile, a check-in, a podcast episode and more. I built one routing layer behind all of them, on iOS and Android.\n\nThe case I cared about most was a friend who doesn’t have the app yet. If they tap a link, sign up and land on a generic home screen, the invitation is wasted. So the app remembers where they were headed and takes them there after sign-up.",
              "A shared link works as an invitation, not a dead end.",
            ],
            [
              "Built an onboarding that survives real life",
              "Twelve steps is a lot to ask of anyone, so each one had to be forgiving. Phone verification handles expired codes, too many attempts and mistyped numbers with clear messages. Permissions are asked one at a time, and location starts with “while using the app” before ever asking for “always”. If someone closes the app halfway, they pick up where they left off.",
              "Nobody gets sent back to step one because life interrupted them.",
            ],
          ],
        },
        {
          name: "Stability and native work",
          items: [
            [
              "Stopped busy chats from jumping",
              "People would be reading and the conversation would jump, usually right at the good part. It wasn’t one bug. It happened when a new message arrived, when older messages loaded, when a reaction landed, even when the tab bar changed height. I treated each trigger as its own case, reproduced it and fixed it, instead of hiding the symptom behind one blanket workaround.",
              "The chat stays where you left it.",
            ],
            [
              "Made notifications open the right place",
              "Two notification problems kept coming back: badge counts drifted from what was actually unread, and opening the app sometimes dropped people into a chat they hadn’t asked for. Both came from the same gap. The JavaScript side of the app can’t see what happens to a notification while the app is closed.\n\nSo I went native. I wrote the app’s native modules for iOS and Android, including an iOS extension that records each notification as it arrives and a module that remembers which notification actually opened the app.",
              "Badges match what’s unread, and opening Sircles just opens Sircles.",
            ],
            [
              "Kept monitoring from slowing anyone down",
              "Crash reports and session recordings help us fix bugs, but recording has a cost, and older phones feel it most. I turned recordings off on older iPhones and low-memory Android phones, and stripped debug logging out of release builds. When some Android users were being logged out unexpectedly, I added a small native check to test one suspected cause instead of guessing.",
              "We got the data we needed to fix bugs without making the app worse for people on older devices.",
            ],
          ],
        },
      ],
      video: {
        src: "assets/video/sircles.mp4",
        poster: "assets/video/sircles.jpg",
        orient: "portrait",
      },
      gallery: {
        type: "phone",
        images: [
          "assets/img/sircles/1.webp",
          "assets/img/sircles/2.webp",
          "assets/img/sircles/3.webp",
          "assets/img/sircles/4.webp",
          "assets/img/sircles/5.webp",
          "assets/img/sircles/6.webp",
          "assets/img/sircles/7.webp",
          "assets/img/sircles/8.webp",
          "assets/img/sircles/9.webp",
        ],
        caption: "Sircles on iPhone",
      },
      links: [
        {
          label: "App Store",
          href: "https://apps.apple.com/us/app/sircles/id1213538655",
          icon: "apple",
        },
        {
          label: "Google Play",
          href: "https://play.google.com/store/apps/details?id=com.sircles.sircles",
          icon: "play",
        },
        { label: "sircles.com", href: "https://sircles.com", icon: "ext" },
      ],
    },

    gemography: {
      kind: "Case study",
      title: "Gemography",
      role: "Lead React Native Engineer",
      period: "Nov 2019 to Dec 2021",
      icon: "assets/img/pop/icon.jpg",
      accent: "#6c5ce7",
      accent2: "#a29bfe",
      tagline:
        "A people-ops platform shipped as two apps: POP by Gemo for employees, POP Manager for managers handling their team’s leave.",
      intro:
        "POP is Gemography’s people-ops platform. Employees request and track time off, see upcoming holidays and know who on their team is out. Managers see availability at a glance and approve requests. I was the lead React Native engineer on both apps: I owned the architecture, shipped the features and kept iOS and Android consistent.",
      tldr: [
        "Led React Native on two apps, one for employees and one for managers, from a single codebase.",
        "Let managers approve or decline leave right from the notification.",
        "Made the apps fast and dependable, even on a weak connection.",
        "Automated releases for both apps.",
      ],
      facts: [
        ["Role", "Lead React Native Engineer"],
        ["When", "Nov 2019 to Dec 2021"],
        ["Apps", "POP by Gemo · POP Manager"],
        ["Platforms", "iOS · Android"],
      ],
      stack: [
        "React Native",
        "TypeScript",
        "React Query",
        "Restyle by Shopify",
        "Fastlane",
        "Sentry",
        "Monorepo",
        "Native modules",
      ],
      groups: [
        {
          name: "Architecture",
          items: [
            [
              "One codebase for two apps",
              "Employees and managers needed different apps, but much of the screens and rules underneath were the same. Building them twice would have meant fixing every bug twice and watching the two apps drift apart. I set up one shared codebase instead, and worked around the tooling limits of the time to make it hold.",
              "A fix in shared code reached both apps in the next release.",
            ],
            [
              "A design system both apps could build on",
              "With two apps, consistency couldn’t depend on everyone remembering the rules. I built a shared library of themed components from scratch, so the right spacing, colors and type came with every piece.",
              "The two apps looked like one product, and new screens came together from parts that already worked.",
            ],
            [
              "Rethought how the app handles data",
              "One bug kept showing up in different places: a screen showing old data after you came back to the app. Fixing it screen by screen would never end, because the real problem was that we managed server data by hand. I moved that job to a library built for it, which keeps data fresh and refreshes screens when the app comes back to the foreground.",
              "We stopped fixing stale screens one at a time.",
            ],
            [
              "Leave data that works offline",
              "The app saves leave data on the phone, shows it instantly on launch and updates it quietly in the background. Building this also led me to an out-of-memory crash caused by how we wrote to storage, which I fixed along the way.",
              "People see their balance and requests even on a weak connection.",
            ],
          ],
        },
        {
          name: "Product",
          items: [
            [
              "Approve leave from the notification",
              "Approving time off meant unlocking the phone, opening POP Manager and finding the request: a lot of steps for a yes or a no. On iOS, I built a notification extension, a small companion app that shows the request inside the notification itself and passes the manager’s decision back to POP Manager.",
              "A routine approval takes one tap from the lock screen.",
            ],
            [
              "Calendars that stay smooth",
              "The leave calendar does a lot of date math: ranges that cross months, weekends and public holidays, across a long scrolling list of months. That’s exactly the kind of screen that starts to stutter, so I reworked how it renders to keep the heavy calculations from slowing down scrolling.",
              "It stays smooth on both platforms.",
            ],
            [
              "Small details for a distributed team",
              "The team screen shows each colleague’s local time, so you know whether it’s a good moment to call, and one tap copies, calls or emails them. If the app ever crashed, people saw a recovery screen while the error report came straight to us.",
              "Teammates are easy to reach, and a crash becomes a bug report instead of a dead app.",
            ],
          ],
        },
        {
          name: "Release engineering",
          items: [
            [
              "Releases without a manual checklist",
              "Shipping two apps to two stores by hand is slow, easy to get wrong, and nobody’s favorite way to spend a Friday. I automated the builds for testing and for production.",
              "A release became one command instead of a checklist.",
            ],
            [
              "Separate testing and production",
              "Each app got fully separate setups for testing and production, from configuration to deployment.",
              "QA could try new work without any risk of touching real employee data.",
            ],
          ],
        },
      ],
      video: {
        src: "assets/video/pop.mp4?v=2",
        poster: "assets/video/pop.jpg?v=2",
        orient: "portrait",
      },
      apps: [
        {
          name: "POP by Gemo",
          who: "For employees",
          icon: "assets/img/pop/icon.jpg",
          since: "App Store · Jan 2021",
          href: "https://apps.apple.com/us/app/pop-by-gemo/id1547411689",
          copy: "Request time off or report a past leave in seconds, keep track of upcoming and past leaves, get notified about holidays and request updates, and see who on your team is out.",
          images: [
            "assets/img/pop/1.webp",
            "assets/img/pop/2.webp",
            "assets/img/pop/3.webp",
            "assets/img/pop/4.webp",
          ],
        },
        {
          name: "POP Manager",
          who: "For managers",
          icon: "assets/img/popmanager/icon.jpg",
          since: "App Store · Jun 2020",
          href: "https://apps.apple.com/us/app/pop-manager/id1495368124",
          copy: "Managers handle their team’s leave: who’s out at a glance, a leave calendar per person, and one tap to approve or decline, right from the notification when that’s quicker.",
          images: [
            "assets/img/popmanager/1.webp",
            "assets/img/popmanager/2.webp",
            "assets/img/popmanager/3.webp",
            "assets/img/popmanager/4.webp",
            "assets/img/popmanager/5.webp",
          ],
        },
      ],
      gallery: null,
      links: [
        {
          label: "POP by Gemo",
          href: "https://apps.apple.com/us/app/pop-by-gemo/id1547411689",
          icon: "apple",
        },
        {
          label: "POP Manager",
          href: "https://apps.apple.com/us/app/pop-manager/id1495368124",
          icon: "apple",
        },
      ],
    },
  },

  projects: {
    openchair: {
      kind: "Mobile app · 2026",
      title: "OpenChair",
      tagline: "A barber, right now.",
      accent: "#2148c6",
      accent2: "#ce2230",
      light: true,
      intro:
        "OpenChair is an on-demand barber marketplace. Customers think “I need a haircut now”. Barbers think “I have an empty chair now”. The app connects those two moments, with no calendars, no bidding and no directory to scroll. I own it end to end: the product rules, the design, the two apps and the backend.",
      tldr: [
        "Designed and built two apps, one for customers and one for barbers, plus the backend behind them.",
        "Matches a customer with a nearby barber who is free right now.",
        "Built billing around how local barbers already pay.",
        "Tested the way it’s used: on two phones at once.",
      ],
      sections: [
        [
          "How a match happens",
          "A customer sends one request. Nearby barbers with a free chair say they’re available, and the customer picks one.\n\nThe tricky part is time. A barber who said yes a minute ago may have just sat someone down. So the chosen barber gets a short window to confirm before the job is created.",
          "Customers never wait on a barber who’s already halfway through someone else’s fade.",
        ],
        [
          "Let people try it before signing up",
          "An account form is a poor first impression for someone who just wants a haircut. So new customers can send a request and watch barbers answer before they create an account.",
          "The first thing a new customer sees is a barber saying yes.",
        ],
        [
          "Billing that fits how local barbers pay",
          "Rather than assume everyone pays by card, I built the paid plan around the ways local barbers already move money: cash transfer or bank transfer. They pay, upload the receipt, and the plan turns on once it’s checked. No card on file, no surprise renewals.\n\nThe free plan includes a monthly allowance of connections, and one is only used when a match is fully confirmed.",
          "Barbers only pay for real customers, never for someone who browsed and left.",
        ],
        [
          "Privacy where it matters",
          "A customer’s photo is visible only to the barber they picked, and only while that match is live. Links to photos stop working on their own.",
          "People share only what’s needed, for only as long as it’s needed.",
        ],
        [
          "Designed first, then built",
          "I designed every screen and state for both apps before writing code, down to the exact copy. Then I built against that design, with automated checks on every screen for visual accuracy, right-to-left layout and performance.",
          "What ships matches what was designed, in English and in Arabic.",
        ],
        [
          "Tested like two people are using it",
          "Most marketplace bugs happen between two phones: the customer does something, and the barber’s screen has to react. Testing one app at a time misses that. So my end-to-end tests run a customer phone and a barber phone together, against the real backend, through the request, the answer, the confirmation, timeouts and recovery.",
          "The whole loop gets checked the way people actually use it.",
        ],
      ],
      facts: [
        ["Role", "Product, design and engineering"],
        ["Platforms", "iOS · Android"],
      ],
      stack: [
        "Expo",
        "React Native",
        "TypeScript",
        "Supabase",
        "Realtime",
        "TanStack Query",
        "Reanimated",
        "Unistyles",
        "i18next · RTL",
        "Maestro",
        "Reassure",
        "Sentry",
        "PostHog",
      ],
      video: {
        src: "assets/video/openchair.mp4",
        poster: "assets/video/openchair.jpg",
        orient: "portrait",
      },
      gallery: {
        type: "phone",
        images: [
          "assets/img/openchair/customer-04-home_live.webp",
          "assets/img/openchair/customer-07-new.webp",
          "assets/img/openchair/customer-13-search_offers.webp",
          "assets/img/openchair/customer-21-job_matched.webp",
          "assets/img/openchair/barber-11-available.webp",
          "assets/img/openchair/barber-09-request.webp",
          "assets/img/openchair/barber-12-reconfirm.webp",
          "assets/img/openchair/barber-14-matched.webp",
          "assets/img/openchair/barber-19-job_rated.webp",
          "assets/img/openchair/customer-16-profile.webp",
          "assets/img/openchair/barber-24-upgrade.webp",
        ],
        caption: "Customer app, then barber app",
      },
      links: [],
    },

    veto: {
      kind: "Mobile web · 2022 to 2026",
      title: "RAP Veto",
      tagline: "The people’s chart for Moroccan rap.",
      accent: "#cdfb45",
      accent2: "#ff5a3c",
      intro:
        "RAP Veto is a fan-voted chart for Moroccan rap. Fans push songs up a season leaderboard, and the top songs win a playlist slot and a share of a prize pool. It’s made for a young audience: phone first, instant, a little competitive, and built so every action is worth sharing. I built the product and the whole stack.",
      tldr: [
        "Built the product and the whole stack, from sign-in to payments.",
        "Anyone can vote instantly. Votes count once a phone number is verified.",
        "Found and fixed a payment bug that could have charged fans for nothing.",
        "Made sharing the main way the chart grows.",
      ],
      sections: [
        [
          "Rebuilt so anyone can vote",
          "The first version was a voting playlist tied to a big streaming service. Every fan needed an account there, free accounts ran into limits, and every screen had to follow the platform’s rules. In practice, the platform decided who could vote.\n\nWhen I rebuilt it, I removed that dependency and made a phone number the only account a fan needs.",
          "Anyone with a phone can vote, not just people with the right subscription.",
        ],
        [
          "Vote first, sign in later",
          "Two goals pulled against each other: the first vote had to be effortless, and the chart had to be hard to cheat (rap fans take rankings personally). I split the difference. Anyone can vote in seconds, but those votes only show interest and don’t move the rankings. Once a fan confirms their phone number, their votes start to count.",
          "Voting stays instant, and the rankings stay honest.",
        ],
        [
          "Payments that can’t go missing",
          "Fans can buy extra votes, so a payment bug costs real people real money. During an architecture review I found one: if our database hiccuped at the wrong moment, we still told the payment provider everything was fine, so it never tried again. A fan could pay and get nothing.\n\nI changed it so failures are reported and retried, and made sure a payment processed twice still only counts once. Votes come only from our own records, never from what the provider claims.",
          "Every paid vote either lands or gets retried.",
        ],
        [
          "Sharing is the growth loop",
          "A chart like this grows when fans recruit other fans, so I made sharing part of voting. After you vote, you get a share card shaped for wherever you post it (a story, a post or a sticker) with your votes, the song’s rank and a QR code back to the song.",
          "Every share works as an invite, and referrals earn bonus votes.",
        ],
        [
          "Made for its audience",
          "English and Arabic, with layouts that read right to left. A dark visual identity with one bright accent, built for phones first.",
        ],
      ],
      facts: [
        ["Role", "Product and full-stack"],
        ["Platform", "Mobile-first web"],
      ],
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind",
        "Headless UI",
        "Firestore",
        "Redis",
        "Edge OG images",
        "SMS OTP",
        "Payments",
      ],
      video: {
        src: "assets/video/veto.mp4",
        poster: "assets/video/veto.jpg",
        orient: "portrait",
      },
      gallery: {
        type: "mixed",
        images: [
          ["phone", "assets/img/veto/home.webp"],
          ["phone", "assets/img/veto/song.webp"],
          ["browser", "assets/img/veto/desktop.webp", "veto-rap.vercel.app"],
        ],
        caption: "On mobile and desktop",
      },
      links: [
        {
          label: "Open RAP Veto",
          href: "https://veto-rap.vercel.app/",
          icon: "ext",
        },
      ],
    },

    resumebyjob: {
      kind: "Web app · AI",
      title: "ResumeByJob",
      tagline: "Same facts, better ordered, in the words the posting uses.",
      accent: "#ff6b2c",
      accent2: "#1a1a1a",
      light: true,
      intro:
        "Drop in your resume PDF and the job posting. ResumeByJob reads the roles, skills and results already on your page, treats the posting as the brief, and proposes a tailored one-page resume in the posting’s vocabulary, without inventing a single employer, skill or date.",
      tldr: [
        "Tailors a resume to a job posting and exports a one-page PDF.",
        "Never lets the AI invent experience you don’t have.",
        "Needs no account: everything stays in your browser.",
        "Keeps working when the AI provider is overloaded.",
      ],
      sections: [
        [
          "Honest by design",
          "The risk with AI resume tools is that they quietly make you sound like someone you’re not, and you pay for it in the interview. I treated that as the main problem to solve. Every AI suggestion is checked before you see it: if it adds a number or a skill that isn’t on your resume, it’s thrown out and your original line stays.",
          "Every change is marked, and you decide what stays before you export.",
        ],
        [
          "Private by default",
          "A resume holds a lot of personal detail, so I kept it with you. There’s no account. Your resume, answers and history stay in your browser, and nothing is stored on the server.",
        ],
        [
          "Reliable when the AI isn’t",
          "AI services get overloaded, and a spinner that never stops is just a polite way of saying broken. I gave every request a deadline and a fallback, retried short failures, and made sure a failed step never wipes what you’ve already done.",
          "You always get a clear answer, and you don’t lose your work.",
        ],
        [
          "More than a rewrite",
          "A cover letter matched to the company. A workspace that drafts answers to application questions from your own resume. A tool that turns a resume into a one-page portfolio site. And a library of practical guides on tailoring a resume.",
        ],
      ],
      facts: [
        ["Role", "Design and engineering"],
        ["Platform", "Web"],
        ["Status", "Live"],
      ],
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "LLM generation",
        "React PDF",
        "Headless UI",
        "Vaul",
        "Vitest",
        "PostHog",
      ],
      video: {
        src: "assets/video/resumebyjob.mp4",
        poster: "assets/video/resumebyjob.jpg",
        orient: "portrait",
      },
      gallery: {
        type: "mixed",
        images: [
          ["phone", "assets/img/resumebyjob/shot-1.webp?v=2"],
          ["phone", "assets/img/resumebyjob/shot-3.webp?v=2"],
          ["phone", "assets/img/resumebyjob/shot-4.webp?v=2"],
          ["phone", "assets/img/resumebyjob/shot-5.webp?v=2"],
          ["phone", "assets/img/resumebyjob/shot-6.webp?v=2"],
        ],
        caption:
          "Tailoring a resume, writing a cover letter, turning a resume into a portfolio",
      },
      links: [
        {
          label: "Open ResumeByJob",
          href: "https://www.resumebyjob.com/",
          icon: "ext",
        },
      ],
    },

    shorts: {
      kind: "macOS app · Electron",
      title: "Reelmaxx",
      tagline:
        "An AI studio for macOS that writes, voices, edits and publishes short-form video.",
      accent: "#5b4be6",
      accent2: "#a5b4fc",
      intro:
        "Reelmaxx is a macOS app I built to make YouTube Shorts, TikToks and Reels from start to finish. Describe the video or pick a topic, and it writes the script, records the voiceover, times the captions, picks footage and music, and exports. Then it helps you research what works and publish. I’ve been building it for a few years and still use it.",
      tldr: [
        "A macOS app that takes an idea all the way to a published short video.",
        "Made it open quickly by loading only what the first screen needs.",
        "Tracked down why scrolling went blank and made it smooth again.",
        "Kept it fast as months of saved work piled up.",
      ],
      sections: [
        [
          "From idea to video",
          "You describe a video or pick a topic. The app writes the script, records a voiceover, times the captions, picks footage and music, and renders the result, with a fast engine for simple videos and a more flexible one for richer layouts.",
          "A finished video, without ever opening an editor.",
        ],
        [
          "Making a heavy app open fast",
          "As features piled up, the app got slow to open. Instead of guessing, I measured what happened between clicking the icon and seeing a window. Most of that time went into loading tools the first screen didn’t need yet.\n\nSo I flipped the order: the window opens first, and heavier parts load the moment you actually use them.",
          "What the app loads at startup dropped from 4.9 MB to 320 KB, and the window shows up right away.",
        ],
        [
          "Fixing blank scrolling",
          "Long lists would flash blank while you scrolled. The obvious suspect was the lists themselves, and tuning them helped, but the gaps came back. Measuring again showed the graphics chip was busy even when nothing was happening on screen.\n\nThe cause turned out to be decoration: a few small looping animations sitting under frosted-glass panels, forcing the screen to be redrawn constantly. The effect was barely visible, so it went. Nobody has missed it.",
          "Scrolling went from stuttering to smooth, and the Mac stopped working hard while scrolling dropped from about a second to 17 ms.",
        ],
        [
          "Staying fast as work piles up",
          "Every save rewrote everything the app had ever saved, so it got slower the more you used it. I changed it so each project, run or result is stored on its own and a save only touches what changed. My own work was on the line, so I migrated it with a script, checked every record against the original and kept full backups.",
          "The app no longer slows down with age.",
        ],
        [
          "Beyond editing",
          "Research on what’s performing, a publishing queue, post analytics, a media library, multiple accounts and reusable presets. It can even drive real iPhones to publish on its own.",
        ],
        [
          "Built for the desktop",
          "Several windows work side by side: the main editor plus dedicated subtitle editors. The heavy work runs in the background, apart from the interface, so editing stays responsive while videos render.",
        ],
      ],
      facts: [
        ["Role", "Solo developer"],
        ["Platform", "macOS (Electron)"],
        ["Status", "Personal tool, in use"],
      ],
      stack: [
        "Electron",
        "React",
        "TypeScript",
        "tRPC",
        "FFmpeg",
        "Remotion",
        "OpenAI",
        "Gemini",
        "ElevenLabs",
        "Tailwind",
        "LowDB",
      ],
      video: {
        src: "assets/video/shorts.mp4?v=3",
        poster: "assets/video/shorts.jpg?v=3",
        orient: "landscape",
      },
      gallery: {
        type: "mac",
        images: [
          "assets/img/shorts/mk-home.webp",
          "assets/img/shorts/mk-research.webp",
          "assets/img/shorts/mk-ugc.webp",
          "assets/img/shorts/mk-slides.webp",
          "assets/img/shorts/mk-publish.webp",
          "assets/img/shorts/mk-devices.webp",
          "assets/img/shorts/mk-automation.webp",
          "assets/img/shorts/mk-insights.webp",
        ],
        caption:
          "Prompt home, research, UGC and slideshow editors, publishing, real-iPhone automations and insights",
      },
      links: [],
    },

    gymo: {
      kind: "Two mobile apps · Open source",
      title: "Gymo",
      tagline:
        "Two apps, one monorepo: Gymo for members, Gymo Manager for gym owners.",
      accent: "#6f5cff",
      accent2: "#201844",
      intro:
        "Gymo gives a neighborhood gym a proper digital front desk, split into two apps that share one codebase. Members get Gymo: plan their week, see how busy the gym will be and chat with the gym. Owners get Gymo Manager: run memberships, see how the month compares with the last one and reach members directly. I built both apps and the backend on my own between 2020 and 2023. Yes, by hand, back before AI tools could vibe-code an app in an afternoon.",
      tldr: [
        "Built two apps, one for gym members and one for gym owners, plus the backend, on my own.",
        "Showed members how busy the gym will be, using nothing but everyone’s workout plans.",
        "Gave owners one place to run memberships, follow the month and reach members.",
        "Published an open-source library along the way.",
      ],
      apps: [
        {
          name: "Gymo",
          who: "For members",
          icon: "assets/img/gymo/icon.webp?v=2",
          since: "iOS · Android",
          href: "https://github.com/aminerol/gymo/tree/develop/apps/client",
          linkIcon: "github",
          linkLabel: "apps/client",
          copy: "Goal-driven onboarding (goal, body metrics, profile, training days), a home screen that shows how crowded the gym is by muscle group and hour, today’s workout to book or skip, chat with the gym and notifications.",
          images: [
            "assets/img/gymo/shot-1.webp?v=2",
            "assets/img/gymo/shot-metrics.webp",
            "assets/img/gymo/shot-2.webp?v=2",
            "assets/img/gymo/shot-membership.webp",
            "assets/img/gymo/shot-chat.webp",
          ],
        },
        {
          name: "Gymo Manager",
          who: "For gym owners",
          icon: "assets/img/gymo/icon-manager.webp",
          since: "iOS · Android",
          href: "https://github.com/aminerol/gymo/tree/develop/apps/manager",
          linkIcon: "github",
          linkLabel: "apps/manager",
          copy: "A dashboard compared with last month, members filtered by new, active, inactive and deleted, Classic, Gold and Premium memberships, class schedules, threaded chat and a notification composer with audience filters.",
          images: [
            "assets/img/gymo/shot-3.webp?v=2",
            "assets/img/gymo/shot-4.webp?v=2",
            "assets/img/gymo/shot-profile.webp",
            "assets/img/gymo/shot-renew.webp",
            "assets/img/gymo/shot-5.webp?v=2",
            "assets/img/gymo/shot-inbox.webp",
          ],
        },
      ],
      groups: [
        {
          name: "For members",
          items: [
            [
              "A crowd forecast without sensors",
              "Members want to know whether the gym will be packed before they go. Counting people at the door would mean extra hardware, or someone standing there with a clicker. But members were already telling the app when they planned to train and which muscles they’d work.\n\nSo the home screen adds up those plans and shows how many people are expected each hour, broken down by muscle group.",
              "Members can pick a quieter hour, and the forecast gets more accurate as more members plan their week.",
            ],
            [
              "A schedule that bends without breaking",
              "Members set a weekly routine, but real weeks change. Changing today’s workout leaves the rest of the week alone, and cancelling a session cancels its reminder too. Reminders arrive an hour before each workout, and another one comes before the membership runs out.",
              "Members can adjust one day without redoing their whole week.",
            ],
            [
              "Onboarding that feels like part of the app",
              "New members set a goal, their body metrics, a profile and their training days. For height and weight I built ruler pickers instead of number fields. The first version felt sluggish, so I reworked the animations until swiping through the steps felt smooth.",
              "Setup feels like part of the app, not a form to get through.",
            ],
            [
              "Chat that behaves on both platforms",
              "Members can message the gym directly. Getting the keyboard right on iOS and Android took more work than the chat itself: inputs hiding behind the keyboard, screens jumping, navigation breaking while the keyboard was open. Where the defaults fell short, I wrote small native bridges on each platform to control it.",
              "Typing a message works the way people expect, on either phone.",
            ],
          ],
        },
        {
          name: "For gym owners",
          items: [
            [
              "Memberships that keep themselves accurate",
              "A membership counts as active based on its start and end dates, not a switch someone has to remember to flip. Owners add, edit or end a member’s plan (Classic, Gold or Premium), and the member’s app reflects it.\n\nRemoving a member moves them to a Deleted tab instead of erasing them, so a returning member can be restored with their history.",
              "Owners don’t have to babysit statuses, and removing someone can always be undone.",
            ],
            [
              "Knowing how the month is going",
              "The dashboard compares members, memberships and notifications with the previous month.",
              "An owner can tell at a glance whether the gym is growing.",
            ],
            [
              "Reaching members directly",
              "Owners can send a notification to every member, a filtered group or one person, and open a chat from any member’s profile. Tapping a chat notification opens the right conversation in either app. I moved the read counts to the server, so the numbers come from one trusted place instead of each phone updating them.",
              "Owners see how many notifications went out and how many were actually seen.",
            ],
          ],
        },
        {
          name: "Building both apps",
          items: [
            [
              "One codebase, two apps",
              "Members and owners see the same gym from opposite sides: a membership, a schedule, a message. If each app modeled those on its own, the two would drift apart. So both apps share their data logic, design and types, and each feature is written once.",
              "Members and owners always see the same thing.",
            ],
            [
              "Sign-in that doesn’t wait on a text message",
              "Members first signed in with an SMS code. I later moved sign-in to our own server: members use their phone number and a password, the server checks it against a securely hashed copy, and hands the app a session.",
              "Logging in no longer depends on a text message arriving.",
            ],
            [
              "An open-source library along the way",
              "Both apps read live data from Firebase, and I wanted it cached and refreshed the same way on every screen. I started from an existing library built for a different data tool, adapted it, moved Gymo onto it, and published it on its own as react-query-firestore.",
              "It has 103 stars on GitHub.",
            ],
            [
              "Two languages, both directions",
              "Gymo works in two languages, including Arabic, so every screen had to read just as well right to left. I built the layouts to mirror for Arabic, so one set of screens serves both languages instead of two versions drifting apart.",
              "Members and owners use the app in the language they’re most comfortable with.",
            ],
            [
              "Shipping both",
              "Each app has its own name, icon and release track, built from the same commit, with crash reporting wired in from the start.",
            ],
          ],
        },
      ],
      facts: [
        ["Role", "Solo developer"],
        ["When", "2020 to 2023"],
        ["Apps", "Gymo · Gymo Manager"],
        ["Platforms", "iOS · Android"],
        ["Code", "Public on GitHub"],
      ],
      stack: [
        "React Native",
        "Expo",
        "TypeScript",
        "Yarn workspaces",
        "Firebase",
        "Firestore",
        "React Query",
        "Reanimated",
        "Next.js",
        "Fastlane",
        "Sentry",
      ],
      video: {
        src: "assets/video/gymo.mp4?v=2",
        poster: "assets/video/gymo.jpg?v=2",
        orient: "portrait",
      },
      galleryFirst: true,
      gallery: {
        type: "phone",
        images: ["assets/img/gymo/shot-duo.webp?v=2"],
        caption:
          "Gymo for members (blue) and Gymo Manager for gym owners (orange)",
      },
      links: [
        {
          label: "GitHub",
          href: "https://github.com/aminerol/gymo",
          icon: "github",
        },
        {
          label: "react-query-firestore",
          href: "https://github.com/aminerol/react-query-firestore",
          icon: "github",
        },
      ],
    },

    vpn: {
      kind: "Employment · 2016 to 2019",
      title: "VPN.Express",
      tagline:
        "A fast, simple VPN for private browsing, with apps for Windows, iOS and Android.",
      accent: "#1e88e5",
      accent2: "#5ec2ff",
      intro:
        "VPN.Express sold encrypted, no-logs browsing on servers around the world. I joined as a software engineer and owned the Windows, iOS and Android apps, choosing the approach for each platform on its own terms. Most of the hard work was keeping people connected when their network wasn’t cooperating.",
      tldr: [
        "Owned the Windows, iOS and Android apps at my first product team.",
        "Kept the Windows app’s connection apart from its interface.",
        "Built the secure tunnel on iOS before ready-made libraries existed.",
        "Made the apps reconnect on their own when the network changed.",
      ],
      sections: [
        [
          "Windows: interface and connection kept apart",
          "I built the Windows app with the connection running in its own background service, separate from the window you see, with the two talking to each other.",
          "Each side could be changed and debugged without breaking the other.",
        ],
        [
          "iOS: building what didn’t exist yet",
          "When I built the iOS app, there were no mature libraries for the VPN protocol we used. Instead of waiting for one or switching protocols, I implemented it myself at a low level, handling the encryption and tunneling rules directly.",
        ],
        [
          "Android: shipping on a deadline",
          "The Android app had a tight deadline. Writing a VPN from zero would have taken longer than we had, so I started from a solid open-source base and adapted it to our servers.",
          "We shipped a full Android app on time.",
        ],
        [
          "Staying connected on bad networks",
          "Phones jump between Wi-Fi and mobile data all day, and each system handles networking its own way. A VPN that drops without telling you is worse than none, because you think you’re protected when you’re not. I owned reconnection on all three apps.",
          "When the connection dropped, the apps noticed and reconnected without the user doing anything.",
        ],
      ],
      facts: [
        ["Role", "Software engineer, platform lead"],
        ["Platforms", "Windows · iOS · Android"],
        ["When", "Jul 2016 to Aug 2019"],
      ],
      stack: ["C#", "WPF", "WCF", "Swift", "Java", "OpenVPN", "MVVM"],
      gallery: {
        type: "mixed",
        images: [
          ["phone", "assets/img/vpn/shot-3.webp?v=2"],
          ["phone", "assets/img/vpn/shot-4.webp?v=2"],
          ["phone", "assets/img/vpn/shot-5.webp?v=2"],
          ["phone", "assets/img/vpn/shot-1.webp?v=2"],
          ["phone", "assets/img/vpn/shot-2.webp?v=2"],
        ],
        caption: "The iOS and Android apps, then the Windows client",
      },
      links: [
        {
          label: "View on Wayback Machine",
          href: "https://web.archive.org/web/20180617181449/https://vpn.express/",
          icon: "ext",
        },
      ],
    },
  },
};
