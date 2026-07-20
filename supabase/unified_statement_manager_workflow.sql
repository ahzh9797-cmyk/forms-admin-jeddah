-- توحيد دورة إفادة الموظف وقرار المدير داخل نفس response_transaction.
-- يحافظ هذا الترحيل على توافق دالة submit_manager_decision الحالية التي تشترط status = 'completed'.
-- تظهر المرحلة الفعلية للمستخدم داخل form_payload.workflow_status.

alter table public.response_transactions
  add column if not exists form_payload jsonb not null default '{}'::jsonb;

create or replace function public.normalize_response_transaction_workflow()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_has_employee_response boolean;
  v_has_manager_decision boolean;
  v_manager_decision text;
begin
  new.form_payload := coalesce(new.form_payload, '{}'::jsonb);

  v_has_manager_decision := new.form_payload ? 'manager_decision';
  v_has_employee_response :=
       new.form_payload ? 'employee_response'
    or new.form_payload ? 'employee_statement'
    or new.form_payload ? 'employee_signature'
    or new.form_payload ? 'signature_data'
    or new.form_payload ? 'response_text'
    or new.status in ('submitted', 'employee_completed', 'pending_manager_decision');

  if v_has_manager_decision then
    v_manager_decision := coalesce(new.form_payload #>> '{manager_decision,decision}', 'accepted');

    new.form_payload := new.form_payload || jsonb_build_object(
      'workflow_status', case
        when v_manager_decision = 'rejected' then 'manager_rejected'
        else 'manager_approved'
      end,
      'workflow_completed_at', coalesce(new.form_payload->>'workflow_completed_at', now()::text)
    );

    new.status := 'completed';
  elsif v_has_employee_response then
    new.form_payload := new.form_payload || jsonb_build_object(
      'workflow_status', 'pending_manager_decision',
      'employee_completed_at', coalesce(new.form_payload->>'employee_completed_at', now()::text)
    );

    -- توافق مع submit_manager_decision الحالية التي تشترط completed.
    -- المرحلة الحقيقية محفوظة في workflow_status ولا تعني اعتماد المدير.
    new.status := 'completed';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists response_transactions_workflow_trigger
  on public.response_transactions;

create trigger response_transactions_workflow_trigger
before insert or update of status, form_payload
on public.response_transactions
for each row
execute function public.normalize_response_transaction_workflow();

-- تصحيح المعاملات التي استلمت رد الموظف ولم يعتمدها المدير بعد.
update public.response_transactions
set
  form_payload = coalesce(form_payload, '{}'::jsonb) || jsonb_build_object(
    'workflow_status', 'pending_manager_decision',
    'employee_completed_at', coalesce(form_payload->>'employee_completed_at', updated_at::text, now()::text)
  ),
  status = 'completed',
  updated_at = now()
where not (coalesce(form_payload, '{}'::jsonb) ? 'manager_decision')
  and (
       status in ('submitted', 'employee_completed', 'pending_manager_decision')
    or coalesce(form_payload, '{}'::jsonb) ? 'employee_response'
    or coalesce(form_payload, '{}'::jsonb) ? 'employee_statement'
    or coalesce(form_payload, '{}'::jsonb) ? 'employee_signature'
    or coalesce(form_payload, '{}'::jsonb) ? 'signature_data'
    or coalesce(form_payload, '{}'::jsonb) ? 'response_text'
  );

create index if not exists response_transactions_workflow_status_idx
on public.response_transactions ((form_payload->>'workflow_status'));

comment on function public.normalize_response_transaction_workflow() is
'يوحّد رد الموظف وقرار المدير داخل نفس معاملة المساءلة، مع حفظ المرحلة الفعلية في form_payload.workflow_status.';
