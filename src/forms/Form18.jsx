import React, { useState } from 'react'
import EmployeeSearch from '../components/EmployeeSearch'

export default function Form18() {
  const [employee, setEmployee] = useState(null)

  const [formData, setFormData] = useState({
    form_number: '',
    form_date: '',
    // employee fields (overridable)
    emp_name: '',
    emp_specialty: '',
    emp_level: '',
    emp_job_number: '',
    emp_work: '',
    // violation
    violation_day: '',
    violation_date_day: '',
    violation_date_month: '',
    violation_date_year: '14',
    // checkbox states
    chk_late: false,
    chk_absent: false,
    chk_early: false,
    chk_location: false,
    // times
    late_time: '',
    absent_from: '',
    absent_to: '',
    early_time: '',
    // director
    director_name: '',
    director_sign_date: '',
    // employee response
    emp_response: '',
    emp_response_name: '',
    emp_response_date: '',
  })

  const set = (f, v) => setFormData(p => ({ ...p, [f]: v }))

  // When employee found from Supabase, auto-fill fields
  const handleEmployeeFound = (emp) => {
    setEmployee(emp)
    if (emp) {
      setFormData(p => ({
        ...p,
        emp_name: emp.full_name || emp.name || '',
        emp_specialty: emp.specialty || emp.specialization || '',
        emp_level: emp.grade || emp.level || '',
        emp_job_number: emp.job_number || emp.id_number || '',
        emp_work: emp.school || emp.work_place || emp.job_title || '',
      }))
    }
  }

  const DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']

  return (
    <div dir="rtl">

      {/* ══ Controls Panel (hidden on print) ══ */}
      <div className="no-print bg-green-50 border border-green-200 rounded-xl p-4 mb-5 space-y-4">
        <EmployeeSearch
          onEmployeeFound={handleEmployeeFound}
          label="ابحث عن الموظف برقم الهوية الوطنية (يملأ البيانات تلقائياً)"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">رقم النموذج</label>
            <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              value={formData.form_number} onChange={e => set('form_number', e.target.value)} placeholder="مثال: 1025" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ النموذج</label>
            <input type="date" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              value={formData.form_date} onChange={e => set('form_date', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">يوم المخالفة</label>
            <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              value={formData.violation_day} onChange={e => set('violation_day', e.target.value)}>
              <option value="">-- اختر --</option>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ المخالفة (هجري)</label>
            <div className="flex gap-1">
              <input className="w-12 border border-gray-300 rounded px-1 py-1.5 text-sm text-center"
                value={formData.violation_date_day} onChange={e => set('violation_date_day', e.target.value)} placeholder="يوم" maxLength={2} />
              <input className="w-12 border border-gray-300 rounded px-1 py-1.5 text-sm text-center"
                value={formData.violation_date_month} onChange={e => set('violation_date_month', e.target.value)} placeholder="شهر" maxLength={2} />
              <input className="w-16 border border-gray-300 rounded px-1 py-1.5 text-sm text-center"
                value={formData.violation_date_year} onChange={e => set('violation_date_year', e.target.value)} placeholder="14__" maxLength={4} />
            </div>
          </div>
        </div>

        {/* Employee editable fields */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">الاسم</label>
            <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              value={formData.emp_name} onChange={e => set('emp_name', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">التخصص</label>
            <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              value={formData.emp_specialty} onChange={e => set('emp_specialty', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">المستوى / المرتبة</label>
            <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              value={formData.emp_level} onChange={e => set('emp_level', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">رقم الوظيفة</label>
            <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              value={formData.emp_job_number} onChange={e => set('emp_job_number', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">العمل الحالي</label>
            <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              value={formData.emp_work} onChange={e => set('emp_work', e.target.value)} />
          </div>
        </div>

        {/* Violation checkboxes */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
          <p className="text-xs font-bold text-gray-700">نوع المخالفة (اختر واحدة أو أكثر):</p>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.chk_late} onChange={e => set('chk_late', e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">تأخر من بداية الدوام — وقت الحضور:</span>
            <input type="time" className="border border-gray-300 rounded px-2 py-0.5 text-sm" value={formData.late_time} onChange={e => set('late_time', e.target.value)} />
          </label>

          <label className="flex items-center gap-2 cursor-pointer flex-wrap">
            <input type="checkbox" checked={formData.chk_absent} onChange={e => set('chk_absent', e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">عدم تواجد أثناء الدوام — من:</span>
            <input type="time" className="border border-gray-300 rounded px-2 py-0.5 text-sm" value={formData.absent_from} onChange={e => set('absent_from', e.target.value)} />
            <span className="text-sm">إلى:</span>
            <input type="time" className="border border-gray-300 rounded px-2 py-0.5 text-sm" value={formData.absent_to} onChange={e => set('absent_to', e.target.value)} />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.chk_early} onChange={e => set('chk_early', e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">انصراف مبكر — وقت الانصراف:</span>
            <input type="time" className="border border-gray-300 rounded px-2 py-0.5 text-sm" value={formData.early_time} onChange={e => set('early_time', e.target.value)} />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.chk_location} onChange={e => set('chk_location', e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">الحضور أو الانصراف من موقع آخر</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">اسم مدير الإدارة</label>
            <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              value={formData.director_name} onChange={e => set('director_name', e.target.value)} placeholder="اسم المدير..." />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button onClick={() => window.print()}
            className="bg-green-700 hover:bg-green-800 text-white px-10 py-2 rounded-lg font-bold text-sm shadow">
            طباعة النموذج
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          PRINTABLE FORM — مطابق للنموذج الورقي الرسمي
      ══════════════════════════════════════════════════ */}
      <div style={styles.container}>

        {/* ── Header ── */}
        <div style={styles.header}>
          <p style={{ margin: '2px 0', fontWeight: 700, fontSize: 14 }}>المملكة العربية السعودية</p>
          <p style={{ margin: '2px 0', fontWeight: 700, fontSize: 12 }}>وزارة التعليم - الإدارة العامة للتعليم بمنطقة جدة</p>
          <p style={{ margin: '2px 0', fontWeight: 700, fontSize: 11 }}>إدارة الموارد البشرية - وحدة متابعة دوام الموظفين</p>
          <p style={{ margin: '6px 0 2px', fontSize: 11 }}>
            <strong>نموذج رقم (18) | رمز النموذج: (و.م.ع.ن - 02-02)</strong>
          </p>
        </div>

        {/* ── Number / Date row ── */}
        <table style={styles.table}>
          <tbody>
            <tr>
              <th style={styles.th}>الرقم:</th>
              <td style={styles.td}>{formData.form_number}</td>
              <th style={styles.th}>التاريخ:</th>
              <td style={styles.td}>
                {formData.form_date
                  ? new Date(formData.form_date).toLocaleDateString('ar-SA-u-ca-islamic', { day: 'numeric', month: 'numeric', year: 'numeric' })
                  : ''}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── Employee Data ── */}
        <div style={styles.section}>
          <p style={{ margin: '0 0 4px', fontWeight: 700 }}>بيانات الموظف:</p>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>العمل الحالي</th>
                <th style={styles.th}>رقم الوظيفة</th>
                <th style={styles.th}>المستوى / المرتبة</th>
                <th style={styles.th}>التخصص</th>
                <th style={styles.th}>الاسم</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>{formData.emp_work}</td>
                <td style={styles.td}>{formData.emp_job_number}</td>
                <td style={styles.td}>{formData.emp_level}</td>
                <td style={styles.td}>{formData.emp_specialty}</td>
                <td style={{ ...styles.td, fontWeight: 700 }}>{formData.emp_name}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Body / Checkboxes ── */}
        <div style={styles.section}>
          <p style={{ margin: '0 0 6px' }}>
            المكرم الموظف /{' '}
            <span style={styles.dotted}>{formData.emp_name || repeat('.', 24)}</span>
            {' '}وفقه الله، السلام عليكم ورحمة الله وبركاته، وبعد:
          </p>

          <p style={{ margin: '0 0 10px' }}>
            إنه في يوم{' '}
            <span style={styles.dotted}>{formData.violation_day || repeat('.', 10)}</span>
            {' '}الموافق{' '}
            <span style={styles.dotted}>{formData.violation_date_day || '..'}</span>
            {' '}/{' '}
            <span style={styles.dotted}>{formData.violation_date_month || '..'}</span>
            {' '}/ {formData.violation_date_year}هـ اتضح ما يلي:
          </p>

          {/* Checkbox 1 */}
          <div style={styles.checkRow}>
            <Box checked={formData.chk_late} />
            <span>
              تأخركم من بداية الدوام وحضوركم الساعة{' '}
              <span style={styles.timeBox}>{formData.chk_late ? (formData.late_time || ':') : ':'}</span>
            </span>
          </div>

          {/* Checkbox 2 */}
          <div style={styles.checkRow}>
            <Box checked={formData.chk_absent} />
            <span>
              عدم تواجدكم أثناء الدوام من الساعة{' '}
              <span style={styles.timeBox}>{formData.chk_absent ? (formData.absent_from || ':') : ':'}</span>
              {' '}الى الساعة{' '}
              <span style={styles.timeBox}>{formData.chk_absent ? (formData.absent_to || ':') : ':'}</span>
            </span>
          </div>

          {/* Checkbox 3 */}
          <div style={styles.checkRow}>
            <Box checked={formData.chk_early} />
            <span>
              انصرافكم مبكراً قبل نهاية الدوام من الساعة{' '}
              <span style={styles.timeBox}>{formData.chk_early ? (formData.early_time || ':') : ':'}</span>
            </span>
          </div>

          {/* Checkbox 4 */}
          <div style={styles.checkRow}>
            <Box checked={formData.chk_location} />
            <span>الحضور أو الانصراف من موقع آخر.</span>
          </div>
        </div>

        {/* ── Director Footer ── */}
        <div style={styles.footerSigns}>
          <p style={{ margin: 0 }}>
            مدير الإدارة:{' '}
            <span style={styles.dotted}>{formData.director_name || repeat('.', 14)}</span>
            {'   '}التوقيع:{' '}
            <span style={styles.dotted}>{repeat('.', 14)}</span>
            {'   '}التاريخ:{' '}
            <span style={styles.dotted}>{repeat('.', 12)}</span>
          </p>
        </div>

        {/* ── Divider ── */}
        <hr style={{ border: 'none', borderTop: '1px solid #000', margin: '18px 0 12px' }} />

        {/* ── Employee Response ── */}
        <div style={styles.section}>
          <p style={{ margin: '0 0 8px', fontWeight: 700 }}>رد الموظف:</p>
          <p style={{ margin: '0 0 14px', lineHeight: 2.2 }}>
            أفيدكم أن أسباب ذلك ما يلي:{' '}
            <span style={{ borderBottom: '1px solid #555', paddingLeft: 280, display: 'inline-block', verticalAlign: 'bottom' }} />
          </p>
          <div style={{ borderBottom: '1px solid #aaa', marginBottom: 14, height: 28 }} />
          <div style={{ borderBottom: '1px solid #aaa', marginBottom: 14, height: 28 }} />
          <p style={{ margin: '10px 0 0', fontSize: 11 }}>
            الاسم:{' '}
            <span style={styles.dotted}>{repeat('.', 16)}</span>
            {'   '}التوقيع:{' '}
            <span style={styles.dotted}>{repeat('.', 14)}</span>
            {'   '}التاريخ:{' '}
            <span style={styles.dotted}>{repeat('.', 12)}</span>
          </p>
        </div>

        {/* ── Form Footer ── */}
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 9, color: '#777', borderTop: '1px solid #ddd', paddingTop: 6 }}>
          نموذج رقم (18) — إدارة التعليم بمحافظة جدة — يُحفظ نسخة في ملف الموظف
        </div>
      </div>
    </div>
  )
}

/* ── Helper: checkbox box ── */
function Box({ checked }) {
  return (
    <span style={{
      display: 'inline-block',
      width: 14,
      height: 14,
      border: '1.5px solid #000',
      borderRadius: 2,
      marginLeft: 6,
      flexShrink: 0,
      background: '#fff',
      position: 'relative',
      verticalAlign: 'middle',
    }}>
      {checked && (
        <svg viewBox="0 0 12 12" style={{ position: 'absolute', top: 0, left: 0, width: 12, height: 12 }}>
          <polyline points="2,6 5,9 10,3" fill="none" stroke="#000" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}

function repeat(char, n) { return char.repeat(n) }

/* ── Inline styles matching the original HTML ── */
const styles = {
  container: {
    width: 800,
    margin: '0 auto',
    border: '1px solid #000',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.5,
    background: '#fff',
    direction: 'rtl',
    fontSize: 12,
  },
  header: {
    textAlign: 'center',
    marginBottom: 16,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '8px 0',
  },
  th: {
    border: '1px solid #000',
    padding: '6px 8px',
    textAlign: 'center',
    background: '#f5f5f5',
    fontWeight: 700,
    fontSize: 11,
  },
  td: {
    border: '1px solid #000',
    padding: '6px 8px',
    textAlign: 'center',
    fontSize: 11,
    minWidth: 60,
    minHeight: 24,
  },
  section: {
    marginTop: 16,
    fontSize: 12,
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    margin: '7px 0',
    fontSize: 12,
  },
  footerSigns: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 20,
    fontSize: 12,
  },
  dotted: {
    borderBottom: '1px solid #555',
    paddingLeft: 4,
    paddingRight: 2,
    display: 'inline-block',
    minWidth: 60,
    verticalAlign: 'bottom',
  },
  timeBox: {
    border: '1px solid #555',
    borderRadius: 2,
    padding: '0 6px',
    minWidth: 50,
    display: 'inline-block',
    textAlign: 'center',
    fontFamily: 'monospace',
    fontSize: 11,
  },
}
