# Audit roadmap (2026-09-27)

Requested: run all audits and fix everything found — security, accessibility (WCAG),
responsive at 375/768/1024/1440 — plus the blog clear-search label.

## Done

- [x] Blog search clear button has `aria-label="Clear search"` (search input also labelled)
- [x] Security: contact-message insert policy + DB checks (email format, no markup/script)
- [x] Security: public blog category reads limited to categories with published posts
      (replaced the `USING (true)` policy that the stored scan flagged)
- [x] Security: least-privilege table grants (anon/authenticated/service_role)
- [x] Security: list-users edge function CORS — reflect request origin + `Vary: Origin`,
      allow GET/POST/OPTIONS, function redeployed
- [x] Accessibility: skip-to-content link, focusable `main` landmarks on every route,
      labelled search inputs, labelled sidebar/mobile-nav landmarks,
      `h-dvh`/`min-h-dvh` instead of `h-screen`/`min-h-screen`
- [x] Accessibility: How It Works cards operable by keyboard (button role, Enter/Space,
      `aria-expanded`, visible focus ring)
- [x] Accessibility: contrast — accent token darkened to `#cb3e06`, muted foreground
      darkened, status badge text darkened, About highlight uses the accent token,
      decorative badges dropped their tinted background
- [x] Accessibility: decorative login/reset video panels marked `aria-hidden` and moved
      inside the main landmark
- [x] Responsive: admin login form column now `w-full max-w-[360px]` (was clipped on a
      375px phone)
- [x] Responsive: horizontal overflow measured on 11 routes at 375/768/1024/1440 — none
- [x] axe-core over 11 routes — 0 violations
- [x] Contact inbox cleanup — the policy-probe message is deleted, 0 rows left

## Verification status

- axe-core, overflow matrix, skip-link, mobile menu (Escape / outside click / link
  navigation), demo drawer open + Escape close: VERIFIED in a real browser
- Database policy behaviour (valid insert 201; invalid email/markup/script and anon
  post update rejected; category reads 200): VERIFIED through the public API
- Basic security scan: no issues reported; the stored scan entry for
  `blog_categories` predates the policy change and is now resolved in the database

## Open

- None.
