# Clean up demo CTAs, bigger hero heading, no self-promo, then test blog end to end

## 1. Replace every "Request a demo" with "Talk to sales"

"Request a demo" opens a booking widget that isn't a real calendar, so it goes away everywhere. Each place keeps a single working button that leads to the contact form.

- Header (desktop + mobile menu): "Talk to sales" linking to the contact page.
- Hero: one "Talk to sales" button; the "Try demo" link is removed.
- Closing call-to-action band: one "Talk to sales" button.
- Pricing cards: buttons become "Talk to sales".
- Enterprise section: button becomes "Talk to sales".
- The demo booking popup itself is deleted from the project.

The `/demo/*` preview pages stay reachable by direct link (useful for screenshots); only the visible "Try demo" link on the landing page goes.

## 2. Bigger hero heading

Scale "SaaS Landing Page" up noticeably on all sizes, keeping the tagline and spacing balanced:

- phone: from 32px to ~44px
- tablet: from 40px to ~60px
- desktop: from 48px to ~76px

## 3. No self-promotion

Footer social row: the LinkedIn link to the fictional company is replaced with a single "Lovable" link pointing to lovable.dev. Everything else in the footer stays.

## 4. End-to-end test of the blog and admin

Driven with a real browser against the running app, PASS/FAIL per step, fixing anything that fails:

**Sign up / sign in**
- Create a fresh account, confirm the "awaiting admin access" state.
- Sign in as the shared admin, land on the posts list.
- Reload keeps the session; signing out re-protects the admin pages.

**Managing content**
- Create a new draft post: title, slug auto-fill, excerpt, rich text body, category, image upload.
- Verify the draft is hidden from the public blog.
- Publish it, confirm it appears on the blog index and its own page with correct text and image.
- Edit the title and body, confirm the change shows publicly.
- Unpublish, confirm it disappears from the public blog.
- Delete it, confirm it's gone from both the admin list and the blog.
- Create, rename, and delete a category; confirm the blog's category filter follows.
- Search and filter on the public blog return the right posts.

**Checks along the way**
- No errors in the browser console or failed data requests.
- Phone (375px) and tablet (768px) views of the landing page, blog, and admin list.

I'll report the tally and list any bugs found and fixed.

## Technical notes

- Delete `src/components/DemoModal.tsx` and its imports in `Header`, `HeroSection`, `CTASection`, `PricingSection`, `EnterpriseSection`.
- Hero heading classes in `src/components/HeroSection.tsx`; keep `text-balance` and `leading-none`.
- `socialLinks` array in `src/components/Footer.tsx` → single Lovable entry.
- Keep `/demo` routes in `src/App.tsx` untouched.
