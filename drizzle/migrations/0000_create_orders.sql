CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan text NOT NULL,
  entity_type text NOT NULL,
  extras text[] NOT NULL DEFAULT '{}',
  company_name text NOT NULL,
  alt_company_name text,
  business_purpose text,
  owners jsonb NOT NULL DEFAULT '[]',
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  country text NOT NULL,
  address text NOT NULL,
  language text NOT NULL DEFAULT 'en',
  total_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  stripe_session_id text,
  environment text NOT NULL DEFAULT 'sandbox',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX orders_created_at_idx ON public.orders (created_at DESC);