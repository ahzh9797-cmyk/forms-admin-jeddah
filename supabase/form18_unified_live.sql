-- تشغيل نموذج المساءلة رقم 18 كمعاملة واحدة تمر بالموظف ثم المدير.

alter table public.response_transactions
  add column if not exists form_payload jsonb not null default '{}'::jsonb;

create unique index if not exists response_transactions_form18_token_uidx
on public.response_transactions (transaction_id)
where transaction_type = 'form18' and transaction_id is not null;

create or replace function public.get_public_form18_transaction(p_token text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', t.id,
    'transaction_id', t.transaction_id,
    'status', t.status,
    'form_payload', coalesce(t.form_payload, '{}'::jsonb),
    'created_at', t.created_at,
    'updated_at', t.updated_at
  )
  from public.response_transactions t
  where t.transaction_type = 'form18'
    and t.transaction_id = p_token
    and coalesce(t.form_payload->>'workflow_status', 'sent_to_employee') <> 'cancelled'
  limit 1;
$$;

create or replace function public.submit_form18_employee_response(
  p_token text,
  p_response text,
  p_signature_base64 text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_signed_at timestamptz := now();
  v_id uuid;
begin
  if nullif(trim(p_response), '') is null then
    raise exception 'نص الإفادة مطلوب';
  end if;

  if length(coalesce(p_signature_base64, '')) < 100 then
    raise exception 'توقيع الموظف مطلوب';
  end if;

  update public.response_transactions
  set
    form_payload = coalesce(form_payload, '{}'::jsonb) || jsonb_build_object(
      'employee_response', jsonb_build_object(
        'text', trim(p_response),
        'signature_base64', p_signature_base64,
        'signed_at', v_signed_at
      ),
      'workflow_status', 'pending_manager_decision',
      'employee_completed_at', v_signed_at
    ),
    status = 'completed',
    updated_at = now()
  where transaction_type = 'form18'
    and transaction_id = p_token
    and coalesce(form_payload->>'workflow_status', 'sent_to_employee') = 'sent_to_employee'
    and not (coalesce(form_payload, '{}'::jsonb) ? 'employee_response')
  returning id into v_id;

  if v_id is null then
    raise exception 'الرابط غير صالح أو سبق اعتماد إفادة الموظف';
  end if;

  return jsonb_build_object('id', v_id, 'workflow_status', 'pending_manager_decision', 'signed_at', v_signed_at);
end;
$$;

create or replace function public.submit_form18_manager_decision(
  p_transaction_id uuid,
  p_manager_name text,
  p_decision text,
  p_note text,
  p_signature_base64 text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_signed_at timestamptz := now();
  v_updated integer;
  v_workflow_status text;
begin
  if auth.uid() is null then
    raise exception 'يجب تسجيل الدخول بحساب إداري';
  end if;

  if nullif(trim(p_manager_name), '') is null then
    raise exception 'اسم المدير مطلوب';
  end if;

  if p_decision not in ('accepted', 'rejected') then
    raise exception 'قرار المدير غير صحيح';
  end if;

  if length(coalesce(p_signature_base64, '')) < 100 then
    raise exception 'توقيع المدير مطلوب';
  end if;

  v_workflow_status := case when p_decision = 'accepted' then 'manager_approved' else 'manager_rejected' end;

  update public.response_transactions
  set
    form_payload = coalesce(form_payload, '{}'::jsonb) || jsonb_build_object(
      'manager_decision', jsonb_build_object(
        'manager_name', trim(p_manager_name),
        'decision', p_decision,
        'note', trim(coalesce(p_note, '')),
        'signature_base64', p_signature_base64,
        'signed_at', v_signed_at,
        'signed_by', auth.uid()
      ),
      'workflow_status', v_workflow_status,
      'workflow_completed_at', v_signed_at
    ),
    status = 'completed',
    updated_at = now()
  where id = p_transaction_id
    and transaction_type = 'form18'
    and coalesce(form_payload->>'workflow_status', '') = 'pending_manager_decision'
    and coalesce(form_payload, '{}'::jsonb) ? 'employee_response'
    and not (coalesce(form_payload, '{}'::jsonb) ? 'manager_decision');

  get diagnostics v_updated = row_count;
  if v_updated = 0 then
    raise exception 'المعاملة ليست بانتظار قرار المدير أو سبق اعتمادها';
  end if;

  return jsonb_build_object('workflow_status', v_workflow_status, 'signed_at', v_signed_at);
end;
$$;

grant execute on function public.get_public_form18_transaction(text) to anon, authenticated;
grant execute on function public.submit_form18_employee_response(text, text, text) to anon, authenticated;
grant execute on function public.submit_form18_manager_decision(uuid, text, text, text, text) to authenticated;
