-- Initial schema for the self-hosted Supabase project (ofitimdebbncfdhvxwub).
-- Copied from the Lovable Cloud export of 2026-10-24
-- (bright-beginnings-business-formation_261024.backup): public schema + blog-images storage only.
-- Run once on an empty project in the Supabase SQL Editor.
-- Kept outside supabase/migrations so Lovable's GitHub sync never applies it to the Lovable database.
--
-- After running: sign up on the new site immediately and claim admin
-- (claim_first_admin makes the first signed-in user the admin).

begin;

-- Types

create type public.app_role as enum ('admin', 'moderator', 'user');

-- Tables

create table public.blog_categories (
  id uuid default gen_random_uuid() not null,
  name text not null,
  slug text not null,
  created_at timestamp with time zone default now() not null,
  constraint blog_categories_pkey primary key (id),
  constraint blog_categories_name_key unique (name),
  constraint blog_categories_slug_key unique (slug)
);

create table public.blog_posts (
  id uuid default gen_random_uuid() not null,
  title text not null,
  slug text not null,
  excerpt text not null,
  content text not null,
  featured_image_url text,
  category_id uuid,
  published boolean default false not null,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  content_blocks jsonb default '[]'::jsonb,
  constraint blog_posts_pkey primary key (id),
  constraint blog_posts_slug_key unique (slug),
  constraint blog_posts_category_id_fkey foreign key (category_id)
    references public.blog_categories(id) on delete set null
);

create table public.contact_messages (
  id uuid default gen_random_uuid() not null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default now() not null,
  constraint contact_messages_pkey primary key (id),
  constraint contact_messages_email_check check (((char_length(email) >= 3) and (char_length(email) <= 255))),
  constraint contact_messages_email_format_check check ((email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)),
  constraint contact_messages_email_no_markup_check check ((email !~ '[[:cntrl:]<>]'::text)),
  constraint contact_messages_message_check check (((char_length(message) >= 10) and (char_length(message) <= 2000))),
  constraint contact_messages_message_no_script_check check ((message !~~* '%<script%'::text)),
  constraint contact_messages_name_check check (((char_length(name) >= 1) and (char_length(name) <= 100))),
  constraint contact_messages_name_no_markup_check check ((name !~ '[[:cntrl:]<>]'::text)),
  constraint contact_messages_subject_check check (((char_length(subject) >= 1) and (char_length(subject) <= 200))),
  constraint contact_messages_subject_no_markup_check check ((subject !~ '[[:cntrl:]<>]'::text))
);

create table public.orders (
  id uuid default gen_random_uuid() not null,
  plan text not null,
  entity_type text not null,
  extras text[] default '{}'::text[] not null,
  company_name text not null,
  alt_company_name text,
  business_purpose text,
  owners jsonb default '[]'::jsonb not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,
  country text not null,
  address text not null,
  language text default 'en'::text not null,
  total_cents integer not null,
  status text default 'pending'::text not null,
  stripe_session_id text,
  environment text default 'sandbox'::text not null,
  paid_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  constraint orders_pkey primary key (id)
);

create index orders_created_at_idx on public.orders using btree (created_at desc);

create table public.user_roles (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamp with time zone default now() not null,
  constraint user_roles_pkey primary key (id),
  constraint user_roles_user_id_role_key unique (user_id, role),
  constraint user_roles_user_id_fkey foreign key (user_id)
    references auth.users(id) on delete cascade
);

-- Functions

create function public.has_role(_user_id uuid, _role public.app_role) returns boolean
  language sql stable security definer
  set search_path to 'public'
  as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

create function public.claim_first_admin() returns boolean
  language plpgsql security definer
  set search_path to 'public'
  as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return false; end if;
  perform pg_advisory_xact_lock(hashtext('claim_first_admin'));
  if exists (select 1 from public.user_roles where role = 'admin') then
    return false;
  end if;
  insert into public.user_roles (user_id, role) values (uid, 'admin');
  return true;
end;
$$;

create function public.update_updated_at_column() returns trigger
  language plpgsql
  set search_path to 'public'
  as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.update_updated_at_column();

-- Grants (same as Lovable; row level security below decides what each role can actually do)

grant all on table public.blog_categories, public.blog_posts, public.contact_messages,
  public.orders, public.user_roles to anon, authenticated, service_role;
grant all on function public.has_role(uuid, public.app_role),
  public.claim_first_admin(), public.update_updated_at_column()
  to anon, authenticated, service_role;

-- Row level security

alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_messages enable row level security;
alter table public.orders enable row level security;
alter table public.user_roles enable row level security;

-- blog_categories
create policy "Admins can create categories" on public.blog_categories
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can delete categories" on public.blog_categories
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can update categories" on public.blog_categories
  for update to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can view all categories" on public.blog_categories
  for select to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Anyone can view categories with published posts" on public.blog_categories
  for select to authenticated, anon using ((exists (
    select 1 from public.blog_posts bp
    where ((bp.category_id = blog_categories.id) and (bp.published = true)))));

-- blog_posts
create policy "Admins can create posts" on public.blog_posts
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can delete posts" on public.blog_posts
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can update posts" on public.blog_posts
  for update to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can view all posts" on public.blog_posts
  for select to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Anyone can view published posts" on public.blog_posts
  for select using ((published = true));

-- contact_messages
create policy "Admins can delete contact messages" on public.contact_messages
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can read contact messages" on public.contact_messages
  for select to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Anyone can send a contact message" on public.contact_messages
  for insert to authenticated, anon with check (((email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)
    and (email !~~ '%<%'::text) and (email !~~ '%>%'::text)
    and (name !~~ '%<%'::text) and (name !~~ '%>%'::text)
    and (subject !~~ '%<%'::text) and (subject !~~ '%>%'::text)
    and (message !~~* '%<script%'::text)));

-- orders: no insert policy on purpose; only the create-checkout function (service role) writes orders
create policy "Admins read orders" on public.orders
  for select to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins update orders" on public.orders
  for update to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- user_roles
create policy "Admins can delete roles" on public.user_roles
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can insert roles" on public.user_roles
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can update roles" on public.user_roles
  for update to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can view all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Users can view own roles" on public.user_roles
  for select to authenticated using ((auth.uid() = user_id));

-- Storage: public blog-images bucket. Image types and the 5 MB limit match the
-- upload checks in BlogPostForm.tsx and TiptapEditor.tsx.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-images', 'blog-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

create policy "Admins can delete blog images" on storage.objects
  for delete to authenticated using (((bucket_id = 'blog-images'::text) and public.has_role(auth.uid(), 'admin'::public.app_role)));
create policy "Admins can list blog images" on storage.objects
  for select to authenticated using (((bucket_id = 'blog-images'::text) and public.has_role(auth.uid(), 'admin'::public.app_role)));
create policy "Admins can update blog images" on storage.objects
  for update to authenticated using (((bucket_id = 'blog-images'::text) and public.has_role(auth.uid(), 'admin'::public.app_role)));
create policy "Admins can upload blog images" on storage.objects
  for insert to authenticated with check (((bucket_id = 'blog-images'::text) and public.has_role(auth.uid(), 'admin'::public.app_role)));

commit;
