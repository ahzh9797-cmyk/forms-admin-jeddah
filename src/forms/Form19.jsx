import React, { useState } from 'react'
import FormHeader from '../components/FormHeader'
import EmployeeSearch from '../components/EmployeeSearch'

export default function Form19() {
  const [employee, setEmployee] = useState(null)
  const [rows, setRows] = useState([
    { date: '', day: '', late_minutes: '', early_minutes: '', total_minutes: '', notes: '' },
    { date: '', day: '', late_minutes: '', early_minutes: '', total_minutes: '', notes: '' },
    { date: '', day: '', late_minutes: '', early_minutes: '', total_minutes: '', notes: '' },
    { date: '', day: '', late_minutes: '', early_minutes: '', total_minutes: '', notes: '' },
    { date: '', day: '', late_minutes: '', early_minutes: '', total_minutes: '', notes: '' },
  ])
  const [month, setMonth] = useState('')
  const [school, setSchool] = useState('')

  const updateRow = (idx, field, value) => {
    setRows(prev => prev.map((r, i) => {
      if (i !== idx) return r
      const updated = { ...r, [field]: value }
      if (field === 'late_minutes' || field === 'early_minutes') {
        const late = parseInt(field === 'late_minutes' ? value : r.late_minutes) || 0
        const early = parseInt(field === 'early_minutes' ? value : r.early_minutes) || 0
        updated.total_minutes = late + early > 0 ? String(late + early) : ''
      }
      return updated
    }))
  }

  const addRow = () => setRows(prev => [...prev, { date: '', day: '', late_minutes: '', early_minutes: '', total_minutes: '', notes: '' }])

  const totalMinutes = rows.reduce((s, r) => s + (parseInt(r.total_minutes) || 0), 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainMinutes = totalMinutes % 60

  const DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']

  return (
    <div>
      <EmployeeSearch onEmployeeFound={setEmployee} label="ابحث عن الموظف برقم الهوية الوطنية" />

      <div className="no-print mb-4 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">الشهر</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={month}
            onChange={e => setMonth(e.target.value)}
            placeholder="مثال: محرم 1446"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">اسم المدرسة</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={school}
            onChange={e => setSchool(e.target.value)}
            placeholder="اسم المدرسة..."
          />
        </div>
        <div className="flex items-end">
          <button onClick={addRow} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-bold w-full">
            + إضافة سطر
          </button>
        </div>
      </div>

      <div className="no-print mb-4 flex justify-end">
        <button onClick={() => window.print()} className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded-lg font-bold text-sm">
          طباعة النموذج
        </button>
      </div>

      {/* PRINTABLE FORM */}
      <div className="form-page official-form bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto text-sm" style={{ direction: 'rtl' }}>
        <FormHeader formNumber="19" formTitle="نموذج حسم ساعات التأخر والانصراف المبكر" />

        <div className="flex justify-between text-xs mb-4">
          <div>المدرسة: <span className="font-bold">{school || '___________________________'}</span></div>
          <div>الشهر: <span className="font-bold">{month || '_______________'}</span></div>
        </div>

        {/* Employee info */}
        <table className="form-table text-xs mb-4">
          <tbody>
            <tr>
              <td className="font-bold bg-gray-50 w-1/4">اسم الموظف</td>
              <td>{employee?.full_name || employee?.name || '___________________________'}</td>
              <td className="font-bold bg-gray-50 w-1/4">رقم الهوية</td>
              <td>{employee?.id_number || '_______________'}</td>
            </tr>
            <tr>
              <td className="font-bold bg-gray-50">الوظيفة</td>
              <td colSpan={3}>{employee?.job_title || employee?.position || '___________________________'}</td>
            </tr>
          </tbody>
        </table>

        {/* Data table */}
        <table className="form-table text-xs mb-4">
          <thead>
            <tr className="bg-green-800 text-white">
              <th className="text-center">م</th>
              <th>التاريخ</th>
              <th>اليوم</th>
              <th>دقائق التأخر</th>
              <th>دقائق الانصراف المبكر</th>
              <th>المجموع (دقيقة)</th>
              <th>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="text-center bg-gray-50">{idx + 1}</td>
                <td>
                  <input
                    className="no-print w-full border-0 outline-none text-xs"
                    value={row.date}
                    onChange={e => updateRow(idx, 'date', e.target.value)}
                    placeholder="التاريخ"
                  />
                  <span className="print-only">{row.date}</span>
                </td>
                <td>
                  <select
                    className="no-print w-full border-0 outline-none text-xs"
                    value={row.day}
                    onChange={e => updateRow(idx, 'day', e.target.value)}
                  >
                    <option value="">--</option>
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <span className="print-only">{row.day}</span>
                </td>
                <td>
                  <input
                    className="no-print w-full border-0 outline-none text-xs text-center"
                    type="number"
                    value={row.late_minutes}
                    onChange={e => updateRow(idx, 'late_minutes', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                  <span className="print-only">{row.late_minutes}</span>
                </td>
                <td>
                  <input
                    className="no-print w-full border-0 outline-none text-xs text-center"
                    type="number"
                    value={row.early_minutes}
                    onChange={e => updateRow(idx, 'early_minutes', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                  <span className="print-only">{row.early_minutes}</span>
                </td>
                <td className="text-center font-bold text-green-800">{row.total_minutes}</td>
                <td>
                  <input
                    className="no-print w-full border-0 outline-none text-xs"
                    value={row.notes}
                    onChange={e => updateRow(idx, 'notes', e.target.value)}
                  />
                  <span className="print-only">{row.notes}</span>
                </td>
              </tr>
            ))}
            {/* Total row */}
            <tr className="bg-green-50 font-bold">
              <td colSpan={5} className="text-center text-xs">الإجمالي</td>
              <td className="text-center text-green-800">{totalMinutes} دقيقة</td>
              <td className="text-xs">{totalHours > 0 ? `${totalHours} ساعة ` : ''}{remainMinutes > 0 ? `${remainMinutes} دقيقة` : ''}</td>
            </tr>
          </tbody>
        </table>

        {/* Summary */}
        <div className="border border-gray-400 rounded p-3 mb-6 text-xs">
          <div className="font-bold mb-1">ملخص الحسم:</div>
          <div className="flex gap-8">
            <div>إجمالي دقائق التأخر والانصراف المبكر: <span className="font-bold text-red-700">{totalMinutes} دقيقة</span></div>
            <div>ما يعادل: <span className="font-bold text-red-700">{totalHours} ساعة و{remainMinutes} دقيقة</span></div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-6 text-center text-xs border-t border-gray-300 pt-4">
          <div>
            <div className="font-bold mb-8">توقيع الموظف</div>
            <div className="border-b border-gray-500 mb-1">___________________</div>
            <div>التاريخ: ___________</div>
          </div>
          <div>
            <div className="font-bold mb-8">وكيل المدرسة</div>
            <div className="border-b border-gray-500 mb-1">___________________</div>
            <div>التاريخ: ___________</div>
          </div>
          <div>
            <div className="font-bold mb-4">مدير المدرسة</div>
            <div className="stamp-box mx-auto mb-1" style={{ width: 90, height: 70 }}>
              <span className="text-gray-300 text-xs">الختم الرسمي</span>
            </div>
            <div className="border-b border-gray-500">___________________</div>
          </div>
        </div>
      </div>
    </div>
  )
}
