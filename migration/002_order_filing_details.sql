-- Filing details collected at checkout (principal address, management, shares, effective date,
-- EIN questions) and the client's authorization record. Never stores SSNs, ITINs or ID numbers.
alter table public.orders
  add column if not exists filing jsonb not null default '{}'::jsonb,
  add column if not exists ein jsonb,
  add column if not exists signature_name text,
  add column if not exists authorized_at timestamp with time zone,
  add column if not exists client_ip text,
  add column if not exists user_agent text;
