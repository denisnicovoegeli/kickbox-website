# TASKS.md

Backlog in priority order. Owned by the user; agents read it only.
Each UC's progress lives in its own `Status` field.

## Backlog

### Customization
- [ ] UC-001-gym-profile: one gym profile (name, logo, brand colors, address, contact, social links, opening hours, disciplines) that every page reads, so the site can be rebranded for another gym without code changes; the demo profile is the fictive "Aare Boxing Club" in Bern

### Public site
- [ ] UC-002-site-shell: header with navigation, language switcher (de/fr/en), footer with contact, social links, Impressum and AGB links, and a custom 404 page
- [ ] UC-003-home: home page introducing the gym, its classes (e.g. boxing, fitness boxing, kids boxing, sparring) and a call to action for a trial lesson
- [ ] UC-004-schedule: weekly class schedule by weekday, time, class and level
- [ ] UC-005-prices: memberships and class passes with prices and conditions
- [ ] UC-006-coaches: coach profiles with photo, focus and short bio
- [ ] UC-007-trial-and-contact: trial lesson info, address with map facade, and a contact form that emails the gym (Resend)
- [ ] UC-008-legal: Impressum, privacy policy (revDSG, all processors from PROJECT.md) and AGB
- [ ] UC-009-seo: sitemap.xml, robots.txt and LocalBusiness structured data from the gym profile
- [ ] UC-010-gallery: photo gallery with optimized, lazy-loaded images

### Members
- [ ] UC-011-member-auth: member sign-up, login, logout and password reset (Supabase Auth)
- [ ] UC-012-buy-membership: buy a recurring membership via Stripe Checkout; state from the verified webhook
- [ ] UC-013-buy-class-pass: buy a class pass (one-time payment) via Stripe Checkout
- [ ] UC-014-member-account: view active memberships and class passes, manage billing (Stripe customer portal), export and delete own data

## Done
- [x] Bootstrap: Next.js, CI quality gates, protected `main`, Vercel project (PR #1)
