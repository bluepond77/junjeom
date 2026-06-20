create table public.google_tokens (
  owner_id uuid primary key references public.profiles(id),
  refresh_token text not null,
  created_at timestamptz not null default now()
);

alter table public.google_tokens enable row level security;
-- 정책을 두지 않으면 anon/authenticated는 전부 차단, service_role만 접근 가능
