create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('기부자', '동료', '기타')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

create policy "authenticated users can read contacts"
  on public.contacts for select
  to authenticated
  using (true);

create policy "authenticated users can insert contacts"
  on public.contacts for insert
  to authenticated
  with check (auth.uid() = created_by);
