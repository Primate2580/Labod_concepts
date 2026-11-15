-- Run once: Supabase dashboard > SQL Editor > New query > paste all > Run.
-- FIRST replace ADMIN_EMAIL_HERE (one place, in is_admin below) with the client's login email.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  category text not null,
  year int,
  sqft int,
  cover text not null,
  images text[] not null default '{}',
  floor_plans jsonb not null default '[]',
  source_files jsonb not null default '[]',
  source_link text,
  created_at timestamptz not null default now()
);

create table if not exists public.options (
  kind text not null check (kind in ('category', 'location')),
  name text not null,
  primary key (kind, name)
);

create or replace function public.is_admin() returns boolean
language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = lower('larryaboderin@gmail.com')
$$;

alter table public.projects enable row level security;
alter table public.options enable row level security;

create policy "projects: anyone can read" on public.projects for select using (true);
create policy "projects: admin writes" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "options: anyone can read" on public.options for select using (true);
create policy "options: admin writes" on public.options for all using (public.is_admin()) with check (public.is_admin());

-- Storage: 'projects' is public (photos + floor plans), 'private-files' is admin-only (DWG/RVT/PCP)
insert into storage.buckets (id, name, public, file_size_limit)
values ('projects', 'projects', true, 52428800), ('private-files', 'private-files', false, 52428800)
on conflict (id) do nothing;

create policy "storage: admin upload" on storage.objects for insert to authenticated
  with check (bucket_id in ('projects', 'private-files') and public.is_admin());
create policy "storage: admin delete" on storage.objects for delete to authenticated
  using (bucket_id in ('projects', 'private-files') and public.is_admin());
create policy "storage: admin read private" on storage.objects for select to authenticated
  using (bucket_id = 'private-files' and public.is_admin());
