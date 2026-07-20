create extension if not exists pgcrypto;

create table if not exists public.response_transactions (
  id uuid primary key default gen_random_uuid(),
  response_id text,
  statement_id text,
  transaction_id text,
  action text,
  transaction_type text,
  from_status text,
  to_status text,
  status text,
  actor_id text,
  actor_name text,
  actor_role text,
  manager_id text,
  manager_name text,
  notes text,
  reason text,
  payload jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists response_transactions_response_id_idx
  on public.response_transactions (response_id);

create index if not exists response_transactions_statement_id_idx
  on public.response_transactions (statement_id);

create index if not exists response_transactions_created_at_idx
  on public.response_transactions (created_at desc);

alter table public.response_transactions enable row level security;

drop policy if exists "response transactions admin access" on public.response_transactions;
create policy "response transactions admin access"
on public.response_transactions
for all
to anon, authenticated
using (true)
with check (true);

grant select, insert, update on public.response_transactions to anon, authenticated;
