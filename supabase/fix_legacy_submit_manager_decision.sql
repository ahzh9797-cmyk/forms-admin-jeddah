-- إصلاح توافق دالة اعتماد المدير القديمة مع دورة المساءلة الموحدة.
-- يسمح بالاعتماد بعد توقيع الموظف سواء كانت الحالة القديمة submitted/completed
-- أو كانت المرحلة الجديدة pending_manager_decision داخل form_payload.

alter table public.response_transactions
  add column if not exists form_payload jsonb not null default '{}'::jsonb;

create or replace function public.submit_manager_decision(
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

  if trim(coalesce(p_manager_name, '')) = '' then
    raise exception 'اسم المدير مطلوب';
  end if;

  if p_decision not in ('accepted', 'rejected') then
    raise exception 'قرار المدير غير صحيح';
  end if;

  if length(coalesce(p_signature_base64, '')) < 100 then
    raise exception 'توقيع المدير مطلوب';
  end if;

  v_workflow_status := case
    when p_decision = 'rejected' then 'manager_rejected'
    else 'manager_approved'
  end;

  update public.response_transactions
  set
    form_payload = coalesce(form_payload, '{}'::jsonb) || jsonb_build_object(
      'manager_decision',
      jsonb_build_object(
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
    and not (coalesce(form_payload, '{}'::jsonb) ? 'manager_decision')
    and (
      coalesce(form_payload->>'workflow_status', '') = 'pending_manager_decision'
      or status in ('submitted', 'employee_completed', 'pending_manager_decision', 'completed')
      or coalesce(form_payload, '{}'::jsonb) ? 'employee_response'
      or coalesce(form_payload, '{}'::jsonb) ? 'employee_statement'
      or coalesce(form_payload, '{}'::jsonb) ? 'employee_signature'
      or coalesce(form_payload, '{}'::jsonb) ? 'signature_data'
      or coalesce(form_payload, '{}'::jsonb) ? 'response_text'
    );

  get diagnostics v_updated = row_count;

  if v_updated = 0 then
    if exists (
      select 1
      from public.response_transactions
      where id = p_transaction_id
        and coalesce(form_payload, '{}'::jsonb) ? 'manager_decision'
    ) then
      raise exception 'سبق اعتماد قرار المدير لهذه المعاملة';
    elsif not exists (
      select 1
      from public.response_transactions
      where id = p_transaction_id
    ) then
      raise exception 'المعاملة غير موجودة';
    else
      raise exception 'لم تُستكمل إفادة الموظف وتوقيعه بعد';
    end if;
  end if;

  return jsonb_build_object(
    'signed_at', v_signed_at,
    'workflow_status', v_workflow_status
  );
end;
$$;

grant execute on function public.submit_manager_decision(uuid, text, text, text, text)
  to authenticated;
