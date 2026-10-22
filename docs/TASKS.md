# TASKS.md

Backlog in priority order. Owned by the user; agents read it only.
Each UC's progress lives in its own `Status` field.

## Backlog

### Public site
- [ ] UC-001-site-shell: header with navigation, language switcher (de/fr/en), footer with contact, social links, Impressum and AGB links, and a custom 404 page
- [ ] UC-002-home: home page introducing the gym, its disciplines (boxing, kickboxing, grappling, MMA), both locations and a call to action for a trial lesson
- [ ] UC-003-training-times: training schedule per location (Ostermundigen, Aarwangen) by weekday, time and discipline
- [ ] UC-004-prices: memberships and class passes per location, with prices and conditions
- [ ] UC-005-trainers: trainer profiles with photo, disciplines and short bio
- [ ] UC-006-trial-and-contact: trial lesson info (no registration needed), addresses with map facade, and a contact form that emails the gym (Resend)
- [ ] UC-007-legal: Impressum, privacy policy (revDSG, all processors from PROJECT.md) and AGB
- [ ] UC-008-seo: sitemap.xml, robots.txt, LocalBusiness structured data per location
- [ ] UC-009-history: the gym's history
- [ ] UC-010-gallery: photo gallery with optimized, lazy-loaded images

### Members
- [ ] UC-011-member-auth: member sign-up, login, logout and password reset (Supabase Auth)
- [ ] UC-012-buy-membership: buy a recurring membership via Stripe Checkout; state from the verified webhook
- [ ] UC-013-buy-class-pass: buy a class pass (one-time payment) via Stripe Checkout
- [ ] UC-014-member-account: view active memberships and class passes, manage billing (Stripe customer portal), export and delete own data

## Done
- [x] Bootstrap: Next.js, CI quality gates, protected `main`, Vercel project (PR #1)
