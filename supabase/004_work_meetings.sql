create table public.work_meetings (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id),
  occurred_at timestamptz not null,
  content text not null,
  follow_up text,
  follow_up_due date,
  calendar_event_id text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.work_meetings enable row level security;

create policy "authenticated users can read work meetings"
  on public.work_meetings for select
  to authenticated
  using (true);

create policy "authenticated users can insert work meetings"
  on public.work_meetings for insert
  to authenticated
  with check (auth.uid() = created_by);

create policy "authenticated users can update work meetings"
  on public.work_meetings for update
  to authenticated
  using (true);
