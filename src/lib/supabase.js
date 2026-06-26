import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://btlbakqjpdrzdphtsara.supabase.co'
const SUPABASE_KEY = 'sb_publishable_lXAINstVeBqF5KO8QD_kow_LYiOGN1k'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function fetchEmployeeByIdNumber(idNumber) {
  if (!idNumber || idNumber.length < 5) return null

  const [supervisorResult, vpResult] = await Promise.all([
    supabase
      .from('supervisors')
      .select('*')
      .eq('id_number', idNumber)
      .maybeSingle(),
    supabase
      .from('vice_principals')
      .select('*')
      .eq('id_number', idNumber)
      .maybeSingle(),
  ])

  if (supervisorResult.data) {
    return { ...supervisorResult.data, role_type: 'supervisor' }
  }
  if (vpResult.data) {
    return { ...vpResult.data, role_type: 'vice_principal' }
  }

  return null
}
