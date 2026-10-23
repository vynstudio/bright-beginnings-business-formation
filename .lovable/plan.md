# Documentation deliverable: AxiomAI SaaS landing page + blog CMS

Write a full feature and capability analysis as a Markdown document at `/mnt/documents/axiomai-template-analysis.md`. No app code changes.

## Board docs check
There is no `docs/plans/` folder, so no breadboard/cloudboard/screenboard/storyboard files to compare against. The document will say so and use the live code as the only source of truth.

## Document outline (only features that are wired up and rendered)

1. **UI/UX**: floating blurred header with a mobile hamburger menu; 500px rounded (24px) autoplay hero video; logo strip; features, benefits, enterprise and testimonial (star-rated cards) sections; "How it works" auto-advancing accordion with a progress bar next to a looping video; custom FAQ accordion with plus/minus icons; pricing with a monthly/annual toggle ("20% off") and 3 tiers (Starter, Enterprise Core, Custom dark card); CTA band; footer. Pages: /, /about, /contact, /blog, /blog/:slug, 404. Contact form is validated with react-hook-form and zod, but it only pretends to send (1s delay, then a toast). The document will say this plainly.
2. **Typography**: Outfit (400/500/600, sans default) and Inter (400/500/600), both from Google Fonts loaded without blocking the page, with a noscript fallback. Exact scale: H1 44/60/76px, leading-none; section H2 24/30/40px; H3 18px; body 15-16px; 12px `// Label //` eyebrows; `text-balance` utility; typography plugin for article bodies.
3. **Color**: HSL tokens. Primary near-black `0 0% 8%`, accent orange `17 97% 52%` (#FC5A0A-ish, also exposed as `lime` light/dark), grays 50-900, destructive, and a sidebar set. Dark palette is defined under `.dark`, but nothing switches to it. Also list the hardcoded hex values (#FF520A, #FF7732, #1F2420, #5A6B5D, #6B7280).
4. **Spacing/layout**: `--radius` 0.75rem with sm/md/lg/xl/2xl steps; 24px media radius; container centered with 1.5rem padding and a 2xl max of 1280px; section rhythm py-12 md:py-20; article column 760px.
5. **Responsive**: Tailwind default breakpoints; stacked CTAs; grids go from 1 to 2 or 3 columns; mobile menu; overflow-x guard; `h-dvh` admin; tested at 375px and 768px.
6. **Performance**: fonts load without blocking; `playsInline muted` videos; lazy logos; skeleton pulse loaders; a 300ms delay on blog search; "load more" pagination (5 at a time); reading progress bar using requestAnimationFrame; React Query.
7. **Accessibility**: aria-labels on icon buttons; semantic heading order; Radix keyboard support (popover, dialog, sheet); focus styles.
8. **SEO**: the exact title, description, OG and Twitter tags from index.html, including the og:image screenshot. No JSON-LD, no per-route meta, and not rendered on the server (so crawlers only see the one static page head).
9. **Content**: blog posts (Tiptap rich text plus JSON content blocks, featured image, excerpt, slug, draft/published), categories; search, category popover filter, featured/latest layout, table of contents from headings with an active heading highlight, reading progress, DOMPurify cleaning; admin sort (last edited, newest first), local search.
10. **Theming**: tokens only; next-themes is installed but not used for switching.
11. **Integrations / Lovable Cloud**: email/password auth with sign-up, reset, a strong password rule and leaked-password blocking; separate `user_roles` table plus `has_role` security definer function; the RLS policy tables for blog_posts, blog_categories and user_roles; `blog-images` storage bucket (public read by URL, admin-only listing, image type allowlist); `list-users` edge function (checks admin rights again); no realtime, analytics, or payments. Demo routes /demo/admin/* use seed data. Protected /admin/* routes via RequireAdmin.
12. **Developer experience**: TypeScript, ESLint 9 flat config, SWC Vite plugin, lovable-tagger; no Prettier and no tests.
13. **Name/slug**: "AxiomAI - Enterprise AI SaaS Landing Page with Blog CMS", slug `axiomai-enterprise-ai-saas-landing-page-with-blog-cms`.
14. **Stack**: base (React 18, Vite 5, TS 5, Tailwind 3, shadcn/Radix); state/data (TanStack Query, react-router 7); UI (framer-motion, Tiptap 3, hugeicons-react, sonner, date-fns, DOMPurify); forms (react-hook-form, zod); backend (Supabase auth, Postgres+RLS, storage, one edge function). Packages that are installed but unused (recharts, embla, vaul, cmdk, input-otp, day-picker, resizable panels, lucide) go in their own "not used" list and are not counted as features.

## Technical details
- Before writing, check each claimed component is actually imported from a route (a text search from App.tsx and the page files), and read Footer, About, AdminUsers and BlockRenderer for exact copy and details.
- Pull the RLS policy text from the live schema and the auth settings from the backend config.
- Output: a single Markdown file, about 8-12 pages, with tables for tokens, the type scale and policies.
