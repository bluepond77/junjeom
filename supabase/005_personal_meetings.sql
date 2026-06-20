create table public.personal_meetings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id),
  contact_name text not null,
  occurred_at timestamptz not null,
  family_info text,
  birthday date,
  baptismal_name text,
  religion text,
  health_notes text,
  recent_joy text,
  values_notes text,
  follow_up text,
  follow_up_due date,
  calendar_event_id text,
  created_at timestamptz not null default now()
);

alter table public.personal_meetings enable row level security;

create policy "owner can read personal meetings"
  on public.personal_meetings for select
  to authenticated
  using (auth.uid() = owner_id);

create policy "owner can insert personal meetings"
  on public.personal_meetings for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "owner can update personal meetings"
  on public.personal_meetings for update
  to authenticated
  using (auth.uid() = owner_id);
