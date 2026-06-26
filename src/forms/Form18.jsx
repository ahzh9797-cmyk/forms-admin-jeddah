import React, { useState } from 'react'
import EmployeeSearch from '../components/EmployeeSearch'

export default function Form18() {
  const [employee, setEmployee] = useState(null)
  const [formData, setFormData] = useState({
    // Header
    school: '',
    date: '',
    // Section 1 — المدير
    violation: '', // 'late' | 'early'
    violation_day: '',
    violation_date: '',
    violation_time: '',
    // Section 3 — رأي المدير
    director_decision: '', // 'accept' | 'reject'
    director_name: '',
  })

  const set = (f, v) => setFormData(p => ({ ...p, [f]: v }))

  const DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']

  return (
    <div dir="rtl">
      {/* ── Controls (hidden on print) ── */}
      <div className="no-print bg-green-50 border border-green-200 rounded-xl p-4 mb-5 space-y-4">
        <EmployeeSearch onEmployeeFound={setEmployee} label="ابحث عن الموظف برقم الهوية الوطنية" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">اسم المدرسة</label>
            <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={formData.school} onChange={e => set('school', e.target.value)} placeholder="..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ النموذج</label>
            <input type="date" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={formData.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">يوم المخالفة</label>
            <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={formData.violation_day} onChange={e => set('violation_day', e.target.value)}>
              <option value="">--</option>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ المخالفة</label>
            <input type="date" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={formData.violation_date} onChange={e => set('violation_date', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">نوع المخالفة</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input type="radio" name="vtype" checked={formData.violation === 'late'} onChange={() => set('violation', 'late')} /> تأخر
              </label>
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input type="radio" name="vtype" checked={formData.violation === 'early'} onChange={() => set('violation', 'early')} /> انصراف مبكر
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">الوقت</label>
            <input type="time" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={formData.violation_time} onChange={e => set('violation_time', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">اسم المدير</label>
            <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={formData.director_name} onChange={e => set('director_name', e.target.value)} placeholder="..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">قرار المدير</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input type="radio" name="dec" checked={formData.director_decision === 'accept'} onChange={() => set('director_decision', 'accept')} /> قبول
              </label>
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input type="radio" name="dec" checked={formData.director_decision === 'reject'} onChange={() => set('director_decision', 'reject')} /> رفض
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={() => window.print()} className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded-lg font-bold text-sm">
            طباعة النموذج
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PRINTABLE OFFICIAL FORM — نموذج 18
      ══════════════════════════════════════ */}
      <div
        className="form-page official-form bg-white mx-auto text-black"
        style={{
          direction: 'rtl',
          width: '210mm',
          minHeight: '297mm',
          padding: '12mm 16mm',
          fontSize: '12pt',
          fontFamily: "'Cairo', 'Noto Naskh Arabic', Arial, sans-serif",
          boxSizing: 'border-box',
          boxShadow: '0 2px 16px #0002',
          borderRadius: 8,
        }}
      >
        {/* ── Page Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, borderBottom: '2px solid #000', paddingBottom: 6 }}>
          {/* Right block */}
          <div style={{ fontSize: 9, lineHeight: 1.7, textAlign: 'right' }}>
            <div style={{ fontWeight: 700 }}>المملكة العربية السعودية</div>
            <div>وزارة التعليم</div>
            <div>إدارة التعليم بمحافظة جدة</div>
            <div>مدرسة: <span style={{ borderBottom: '1px solid #000', paddingRight: 4, paddingLeft: 40 }}>{formData.school}</span></div>
          </div>

          {/* Center logo */}
          <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
            <svg viewBox="0 0 80 80" style={{ width: 64, height: 64 }}>
              <circle cx="40" cy="40" r="38" fill="none" stroke="#006633" strokeWidth="2"/>
              <text x="40" y="34" textAnchor="middle" fontSize="8" fill="#006633" fontWeight="bold">وزارة</text>
              <text x="40" y="44" textAnchor="middle" fontSize="8" fill="#006633" fontWeight="bold">التعليم</text>
              <text x="40" y="54" textAnchor="middle" fontSize="6.5" fill="#006633">المملكة العربية السعودية</text>
            </svg>
          </div>

          {/* Left block */}
          <div style={{ fontSize: 9, lineHeight: 1.7, textAlign: 'left' }}>
            <div>رقم النموذج: <strong>18</strong></div>
            <div>التاريخ: <span style={{ borderBottom: '1px solid #000', paddingLeft: 30 }}>
              {formData.date ? new Date(formData.date).toLocaleDateString('ar-SA') : ''}
            </span></div>
          </div>
        </div>

        {/* ── Form Title ── */}
        <div style={{ textAlign: 'center', margin: '8px 0 10px' }}>
          <div style={{
            display: 'inline-block',
            background: '#006633',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            padding: '4px 40px',
            borderRadius: 4,
            letterSpacing: 1,
          }}>
            نموذج مساءلة تأخر / انصراف مبكر
          </div>
        </div>

        {/* ── Employee Row ── */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8, fontSize: 10 }}>
          <tbody>
            <tr>
              <td style={tdLabel}>اسم الموظف</td>
              <td style={tdValue}>{employee?.full_name || employee?.name || ''}</td>
              <td style={tdLabel}>رقم الهوية</td>
              <td style={tdValue}>{employee?.id_number || ''}</td>
              <td style={tdLabel}>الوظيفة</td>
              <td style={tdValue}>{employee?.job_title || employee?.position || ''}</td>
            </tr>
          </tbody>
        </table>

        {/* ══════════════════════════════
            SECTION 1 — قسم المدير
        ══════════════════════════════ */}
        <SectionTitle>القسم الأول: إشعار المدير</SectionTitle>

        <div style={{ border: '1.5px solid #000', borderRadius: 4, padding: '8px 10px', marginBottom: 10, fontSize: 10 }}>
          <p style={{ margin: '0 0 8px', lineHeight: 2 }}>
            السيد / السيدة الموظف/ة الموقر/ة، يُشعركم بأنه قد رُصد عليكم ما يلي:
          </p>

          {/* Checkboxes row */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', marginBottom: 10 }}>
            {/* تأخر */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'default' }}>
              <CheckBox checked={formData.violation === 'late'} />
              <span style={{ fontWeight: 700 }}>تأخر عن الدوام</span>
            </label>
            {/* انصراف مبكر */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'default' }}>
              <CheckBox checked={formData.violation === 'early'} />
              <span style={{ fontWeight: 700 }}>انصراف مبكر</span>
            </label>
          </div>

          {/* Day / Date / Time */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 6px', fontWeight: 700, width: '15%' }}>اليوم</td>
                <td style={{ padding: '4px 6px', borderBottom: '1px solid #555', width: '18%' }}>{formData.violation_day}</td>
                <td style={{ padding: '4px 6px', fontWeight: 700, width: '15%' }}>التاريخ</td>
                <td style={{ padding: '4px 6px', borderBottom: '1px solid #555', width: '22%' }}>
                  {formData.violation_date ? new Date(formData.violation_date).toLocaleDateString('ar-SA') : ''}
                </td>
                <td style={{ padding: '4px 6px', fontWeight: 700, width: '12%' }}>الوقت</td>
                <td style={{ padding: '4px 6px', borderBottom: '1px solid #555', width: '18%' }}>{formData.violation_time}</td>
              </tr>
            </tbody>
          </table>

          {/* Director signature inside section 1 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, gap: 40, fontSize: 10 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>توقيع المدير</div>
              <div style={{ borderBottom: '1px solid #555', width: 120, height: 18 }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>التاريخ</div>
              <div style={{ borderBottom: '1px solid #555', width: 100, height: 18 }} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 2 — رد الموظف
        ══════════════════════════════ */}
        <SectionTitle>القسم الثاني: رد الموظف / الموظفة</SectionTitle>

        <div style={{ border: '1.5px solid #000', borderRadius: 4, padding: '8px 10px', marginBottom: 10, fontSize: 10 }}>
          <p style={{ margin: '0 0 6px' }}>
            يُرجى كتابة ردكم / عذركم فيما يتعلق بالمخالفة المشار إليها أعلاه:
          </p>
          {/* Writing lines */}
          {[1, 2, 3].map(i => (
            <div key={i} style={{ borderBottom: '1px solid #aaa', marginBottom: 12, height: 22 }} />
          ))}

          {/* Employee signature */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10 }}>
            <div>
              <span style={{ fontWeight: 700 }}>اسم الموظف / الموظفة: </span>
              <span style={{ borderBottom: '1px solid #555', display: 'inline-block', width: 180 }} />
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>التوقيع</div>
                <div style={{ borderBottom: '1px solid #555', width: 110, height: 18 }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>التاريخ</div>
                <div style={{ borderBottom: '1px solid #555', width: 100, height: 18 }} />
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 3 — رأي المدير
        ══════════════════════════════ */}
        <SectionTitle>القسم الثالث: رأي المدير في العذر المقدَّم</SectionTitle>

        <div style={{ border: '1.5px solid #000', borderRadius: 4, padding: '8px 10px', marginBottom: 14, fontSize: 10 }}>
          {/* Decision checkboxes */}
          <div style={{ display: 'flex', gap: 40, alignItems: 'center', marginBottom: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'default' }}>
              <CheckBox checked={formData.director_decision === 'accept'} />
              <span style={{ fontWeight: 700, fontSize: 11 }}>قبول العذر</span>
              <span style={{ fontSize: 9, color: '#555' }}>(ولا يُطبَّق الحسم)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'default' }}>
              <CheckBox checked={formData.director_decision === 'reject'} />
              <span style={{ fontWeight: 700, fontSize: 11 }}>رفض العذر</span>
              <span style={{ fontSize: 9, color: '#555' }}>(ويُطبَّق الحسم وفق الأنظمة)</span>
            </label>
          </div>

          {/* Director name + stamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 6 }}>
            <div style={{ fontSize: 10 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>اسم المدير:</div>
              <div style={{ borderBottom: '1px solid #555', width: 200, height: 20 }}>
                <span style={{ paddingRight: 4 }}>{formData.director_name}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: 10 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>التوقيع</div>
              <div style={{ borderBottom: '1px solid #555', width: 120, height: 20 }} />
            </div>

            <div style={{ textAlign: 'center', fontSize: 10 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>التاريخ</div>
              <div style={{ borderBottom: '1px solid #555', width: 100, height: 20 }} />
            </div>

            {/* Stamp circle */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 10, marginBottom: 4 }}>الختم الرسمي</div>
              <div style={{
                border: '1.5px solid #555',
                borderRadius: '50%',
                width: 72,
                height: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#bbb',
                fontSize: 9,
              }}>ختم</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #ccc', paddingTop: 5, textAlign: 'center', fontSize: 8, color: '#777' }}>
          نموذج رقم 18 — إدارة التعليم بمحافظة جدة — يُحفظ في ملف الموظف
        </div>
      </div>
    </div>
  )
}

/* ── Helpers ── */

function SectionTitle({ children }) {
  return (
    <div style={{
      background: '#006633',
      color: '#fff',
      fontWeight: 700,
      fontSize: 10,
      padding: '3px 10px',
      borderRadius: '3px 3px 0 0',
      marginBottom: 0,
    }}>
      {children}
    </div>
  )
}

function CheckBox({ checked }) {
  return (
    <div style={{
      width: 14,
      height: 14,
      border: '1.5px solid #000',
      borderRadius: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      background: '#fff',
    }}>
      {checked && (
        <svg viewBox="0 0 12 12" style={{ width: 10, height: 10 }}>
          <polyline points="2,6 5,9 10,3" fill="none" stroke="#006633" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  )
}

const tdLabel = {
  fontWeight: 700,
  background: '#f0f7f0',
  border: '1px solid #999',
  padding: '3px 6px',
  whiteSpace: 'nowrap',
  fontSize: 10,
}

const tdValue = {
  border: '1px solid #999',
  padding: '3px 6px',
  fontSize: 10,
  minWidth: 80,
}
