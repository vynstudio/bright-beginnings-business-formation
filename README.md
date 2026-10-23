# AxiomAI — SaaS landing page template

A marketing site for a fictional enterprise AI product, with a real blog and an admin CMS. Built with React, Vite, Tailwind and Lovable Cloud.

## Public pages
- `/` — home: hero video, features, pricing (monthly/yearly), testimonials, FAQ
- `/about`, `/contact`
- `/blog`, `/blog/:slug` — published posts with search and category filter

## Blog admin
- `/admin/login` — sign in / sign up / forgot password
- `/admin/posts`, `/admin/categories`, `/admin/users`, `/admin/messages`
- `/demo/admin/*` — read-only preview of the admin with sample data (no sign-in)

## Creating the first admin
Sign up at `/admin/login` first — that account becomes the admin (after confirming the email and signing in). This only happens while no admin exists; every later sign-up gets no role until an admin grants it on the Users page.

## Contact messages
The contact form stores each message in the `contact_messages` table. Admins read them at `/admin/messages`.
