create extension if not exists pgcrypto;

create table if not exists public.electronic_statements (
  id uuid primary key default gen_random_uuid(),
  statement_number text not null unique,
  statement_type text not null,
  employee_name text not null,
  employee_identifier text,
  employee_phone text,
  employee_email text,
  workplace text,
  subject text not null,
  statement_text text not null,
  employee_response text,
  signature_data text,
  return_reason text,
  internal_notes text,
  status text not null default 'draft' check (status in ('draft','sent','opened','submitted','returned','completed','cancelled')),
  secure_token text not null unique,
  token_is_active boolean not null default true,
  deadline_at timestamptz,
  sent_at timestamptz,
  opened_at timestamptz,
  submitted_at timestamptz,
  returned_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists electronic_statements_token_idx on public.electronic_statements (secure_token);
create index if not exists electronic_statements_status_idx on public.electronic_statements (status);

alter table public.electronic_statements enable row level security;

-- النسخة الحالية من برنامج النماذج لا تتضمن تسجيل دخول إداري.
-- تسمح هذه السياسة لواجهة الإدارة الحالية بإنشاء ومتابعة الإفادات.
-- عند إضافة تسجيل الدخول لاحقاً يجب استبدالها بسياسة تعتمد على المستخدم المخول.
drop policy if exists "electronic statements admin access" on public.electronic_statements;
create policy "electronic statements admin access"
on public.electronic_statements
for all
to anon, authenticated
using (true)
with check (true);

create or replace function public.get_public_electronic_statement(p_token text)
returns table (
  statement_number text,
  statement_type text,
  employee_name text,
  workplace text,
  subject text,
  statement_text text,
  employee_response text,
  status text,
  return_reason text,
  submitted_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    s.statement_number,
    s.statement_type,
    s.employee_name,
    s.workplace,
    s.subject,
    s.statement_text,
    s.employee_response,
    s.status,
    s.return_reason,
    s.submitted_at
  from public.electronic_statements s
  where s.secure_token = p_token
    and s.token_is_active = true
    and s.status <> 'cancelled'
  limit 1;
$$;

create or replace function public.mark_electronic_statement_opened(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.electronic_statements
     set status = case when status = 'sent' then 'opened' else status end,
         opened_at = coalesce(opened_at, now()),
         updated_at = now()
   where secure_token = p_token
     and token_is_active = true
     and status in ('sent','opened');
  return found;
end;
$$;

create or replace function public.submit_electronic_statement(
  p_token text,
  p_response text,
  p_signature_data text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if nullif(trim(p_response), '') is null or nullif(trim(p_signature_data), '') is null then
    raise exception 'الإفادة والتوقيع مطلوبان';
  end if;

  update public.electronic_statements
     set employee_response = p_response,
         signature_data = p_signature_data,
         status = 'submitted',
         submitted_at = now(),
         updated_at = now()
   where secure_token = p_token
     and token_is_active = true
     and status in ('sent','opened','returned');

  if not found then
    raise exception 'الرابط غير صالح أو تم اعتماد الإفادة مسبقاً';
  end if;

  return true;
end;
$$;

grant execute on function public.get_public_electronic_statement(text) to anon, authenticated;
grant execute on function public.mark_electronic_statement_opened(text) to anon, authenticated;
grant execute on function public.submit_electronic_statement(text, text, text) to anon, authenticated;
