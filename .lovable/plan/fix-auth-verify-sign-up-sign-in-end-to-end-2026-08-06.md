# Fix auth + verify sign up / sign in end to end

## What's broken right now

The admin role check fails for every signed-in user. Live network requests show:

```text
GET /rest/v1/user_roles?...role=eq.admin  ->  403
{"code":"42501","message":"permission denied for function has_role"}
```

Cause (confirmed in the migration history): a security-hardening migration revoked
`EXECUTE` on `has_role` from `authenticated`. But the RLS policies on `user_roles`,
`blog_posts`, `blog_categories`, and the storage bucket all *call* `has_role`, and
policies are evaluated as the calling role. With execute revoked, every policy that
uses it errors out instead of returning true/false.

Effect: sign-in itself succeeds, but the app can never confirm admin status, so the
admin CMS is unreachable ("Access Denied" or a permanent 403 loop).

## The fix

1. Re-grant `EXECUTE ON FUNCTION public.has_role(uuid, app_role)` to `authenticated`
   and `service_role` (not `anon` — anonymous users have no roles to check).
   This is the standard, intended pattern for a `SECURITY DEFINER` role helper: the
   function only reads `user_roles` and returns a boolean, so exposing it to signed-in
   users is safe and required for RLS to work.
2. Update the security memory so a future scan doesn't re-revoke it and re-break auth.

No application code changes are needed — `useAuth` already queries `user_roles`
directly, which is the right approach.

## Then test the full auth flow with a real browser

Driven with Playwright against the running app, PASS/FAIL each step:

- Sign up a fresh throwaway email at `/admin/login` (Sign up tab) — expect the
  "account created, an admin must grant access" confirmation, no console errors.
- Sign in with that new non-admin account — expect a successful session but the
  "Access Denied" screen on `/admin/posts` (correct behaviour, and proof the role
  check now returns a clean `false` instead of a 403).
- Sign in with the demo admin `demo@axiomai.dev` — expect a redirect to
  `/admin/posts` with posts listed.
- Wrong password — expect an inline error, no redirect.
- Reload while signed in — session persists, still admin.
- Sign out — redirected back to the login page; `/admin/posts` is protected again.
- Forgot-password — expect the reset-link confirmation message.
- Capture the network panel throughout to confirm zero 403s on `user_roles`.

I'll report PASS/FAIL per step and fix anything that fails before finishing.

## Note on email confirmation

Signup currently sends a confirmation email, so a brand-new account is not signed in
until the link is clicked. That's the secure default and I'll leave it as-is; the
signup test will verify the "check your email" state rather than an instant session.
