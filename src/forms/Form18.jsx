import React, { useState } from 'react'
import FormHeader from '../components/FormHeader'
import EmployeeSearch from '../components/EmployeeSearch'
import SignatureStamp from '../components/SignatureStamp'

const VIOLATION_TYPES = [
  { id: 'late', label: 'تأخر عن الدوام' },
  { id: 'early_leave', label: 'الانصراف المبكر' },
  { id: 'absent', label: 'الغياب' },
  { id: 'leave_without', label: 'مغادرة دون إذن' },
]

export default function Form18() {
  const [employee, setEmployee] = useState(null)
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('ar-SA'),
    violation_type: '',
    violation_date: '',
    violation_time: '',
    duration: '',
    notes: '',
    school_name: '',
    period: '',
  })

  const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

  return (
    <div>
      {/* Search Panel */}
      <EmployeeSearch onEmployeeFound={setEmployee} label="ابحث عن الموظف برقم الهوية الوطنية" />

      {/* School name input */}
      <div className="no-print mb-4 flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-700 mb-1">اسم المدرسة</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={formData.school_name}
            onChange={e => set('school_name', e.target.value)}
            placeholder="اسم المدرسة..."
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-700 mb-1">نوع المخالفة</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={formData.violation_type}
            onChange={e => set('violation_type', e.target.value)}
          >
            <option value="">-- اختر نوع المخالفة --</option>
            {VIOLATION_TYPES.map(v => (
              <option key={v.id} value={v.label}>{v.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-700 mb-1">تاريخ المخالفة</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={formData.violation_date}
            onChange={e => set('violation_date', e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-700 mb-1">المدة (دقيقة/ساعة)</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={formData.duration}
            onChange={e => set('duration', e.target.value)}
            placeholder="مثال: 45 دقيقة"
          />
        </div>
      </div>

      {/* Print Button */}
      <div className="no-print mb-4 flex justify-end">
        <button
          onClick={() => window.print()}
          className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded-lg font-bold text-sm"
        >
          طباعة النموذج
        </button>
      </div>

      {/* ===== PRINTABLE FORM ===== */}
      <div className="form-page official-form bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto text-sm" style={{ direction: 'rtl' }}>
        <FormHeader
          formNumber="18"
          formTitle="نموذج مساءلة تأخر / انصراف"
        />

        {/* Header info row */}
        <div className="flex justify-between items-start mb-4 text-xs">
          <div>
            التاريخ: <span className="underline-field px-3">{formData.date}</span>
          </div>
          <div>
            المدرسة: <span className="underline-field px-3">{formData.school_name || '_______________'}</span>
          </div>
        </div>

        {/* Employee Data */}
        <div className="border-2 border-gray-700 rounded mb-4">
          <div className="bg-green-800 text-white text-center py-1 font-bold text-xs">بيانات الموظف</div>
          <table className="form-table text-xs">
            <tbody>
              <tr>
                <td className="font-bold bg-gray-50 w-1/4">الاسم الكامل</td>
                <td className="w-3/4">{employee?.full_name || employee?.name || '___________________________'}</td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-50">رقم الهوية</td>
                <td>{employee?.id_number || '___________________________'}</td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-50">الوظيفة</td>
                <td>{employee?.job_title || employee?.position || '___________________________'}</td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-50">رقم الجوال</td>
                <td>{employee?.phone || employee?.mobile || '___________________________'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Violation Details */}
        <div className="border-2 border-gray-700 rounded mb-4">
          <div className="bg-green-800 text-white text-center py-1 font-bold text-xs">تفاصيل المخالفة</div>
          <table className="form-table text-xs">
            <tbody>
              <tr>
                <td className="font-bold bg-gray-50 w-1/3">نوع المخالفة</td>
                <td>
                  {formData.violation_type || (
                    <span className="text-gray-400">_______________</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-50">تاريخ المخالفة</td>
                <td>{formData.violation_date || '_______________'}</td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-50">المدة</td>
                <td>{formData.duration || '_______________'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Accountability Text */}
        <div className="border-2 border-gray-700 rounded mb-4 p-3">
          <div className="font-bold text-xs mb-2 text-center bg-green-800 text-white py-1 -mx-3 -mt-3 mb-3">نص المساءلة</div>
          <p className="text-xs leading-7 text-justify">
            بناءً على صلاحياتي، تمت مساءلة الموظف&nbsp;
            <span className="font-bold underline">{employee?.full_name || employee?.name || '___________________'}</span>
            &nbsp;وذلك بسبب&nbsp;
            <span className="font-bold underline">{formData.violation_type || '___________________'}</span>
            &nbsp;بتاريخ&nbsp;
            <span className="font-bold underline">{formData.violation_date || '___________'}</span>
            &nbsp;لمدة&nbsp;
            <span className="font-bold underline">{formData.duration || '___________'}</span>.
            وقد أُشعر الموظف بهذه المخالفة وطُلب منه الالتزام بأنظمة الدوام الرسمي.
          </p>
        </div>

        {/* Notes */}
        <div className="border border-gray-400 rounded mb-6 p-2">
          <div className="font-bold text-xs mb-1">ملاحظات إضافية:</div>
          <div className="text-xs min-h-12 leading-6">{formData.notes || '...'}</div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-6 text-center text-xs mt-6 border-t border-gray-300 pt-4">
          <div>
            <div className="font-bold mb-8">توقيع الموظف</div>
            <div className="border-b border-gray-500 mb-1">___________________</div>
            <div>التاريخ: ___________</div>
          </div>
          <div>
            <div className="font-bold mb-8">توقيع المشرف / الوكيل</div>
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
