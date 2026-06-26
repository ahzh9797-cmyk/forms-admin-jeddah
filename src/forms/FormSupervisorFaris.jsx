import React, { useState } from 'react'
import FormHeader from '../components/FormHeader'
import EmployeeSearch from '../components/EmployeeSearch'

const CORRECTION_TYPES = [
  'تصحيح بصمة الحضور',
  'تصحيح بصمة الانصراف',
  'تصحيح إجازة',
  'تصحيح مأمورية',
  'تصحيح مهمة رسمية',
  'تصحيح تدريب',
  'حذف سجل خاطئ',
  'إضافة سجل مفقود',
]

export default function FormSupervisorFaris() {
  const [employee, setEmployee] = useState(null)
  const [formData, setFormData] = useState({
    school: '',
    request_date: new Date().toLocaleDateString('ar-SA'),
    correction_type: '',
    correction_date: '',
    original_value: '',
    corrected_value: '',
    reason: '',
    supervisor_name: '',
  })

  const set = (f, v) => setFormData(p => ({ ...p, [f]: v }))

  return (
    <div>
      <EmployeeSearch onEmployeeFound={setEmployee} label="ابحث عن الموظف برقم الهوية الوطنية" />

      <div className="no-print mb-4 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">اسم المدرسة</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.school} onChange={e => set('school', e.target.value)} placeholder="اسم المدرسة..." />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">نوع التصحيح</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.correction_type} onChange={e => set('correction_type', e.target.value)}>
            <option value="">-- اختر نوع التصحيح --</option>
            {CORRECTION_TYPES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">تاريخ التصحيح</label>
          <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.correction_date} onChange={e => set('correction_date', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">القيمة الأصلية (قبل التصحيح)</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.original_value} onChange={e => set('original_value', e.target.value)} placeholder="مثال: 08:45" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">القيمة الصحيحة (بعد التصحيح)</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.corrected_value} onChange={e => set('corrected_value', e.target.value)} placeholder="مثال: 07:30" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">اسم المشرف</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.supervisor_name} onChange={e => set('supervisor_name', e.target.value)} placeholder="اسم المشرف المنفذ..." />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-bold text-gray-700 mb-1">سبب التصحيح</label>
          <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows={2} value={formData.reason} onChange={e => set('reason', e.target.value)} placeholder="اكتب سبب طلب التصحيح..." />
        </div>
      </div>

      <div className="no-print mb-4 flex justify-end">
        <button onClick={() => window.print()} className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded-lg font-bold text-sm">
          طباعة النموذج
        </button>
      </div>

      {/* PRINTABLE FORM */}
      <div className="form-page official-form bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto text-sm" style={{ direction: 'rtl' }}>
        <FormHeader formTitle="نموذج تصحيح بيانات مشرف في نظام فارس" />

        <div className="flex justify-between text-xs mb-4 bg-blue-50 border border-blue-200 rounded p-2">
          <div>المدرسة: <span className="font-bold">{formData.school || '___________________________'}</span></div>
          <div>تاريخ الطلب: <span className="font-bold">{formData.request_date}</span></div>
        </div>

        {/* Employee Data */}
        <div className="border-2 border-gray-700 rounded mb-4">
          <div className="bg-green-800 text-white text-center py-1 font-bold text-xs">بيانات الموظف المراد تصحيح بياناته</div>
          <table className="form-table text-xs">
            <tbody>
              <tr>
                <td className="font-bold bg-gray-50 w-1/4">الاسم الكامل</td>
                <td>{employee?.full_name || employee?.name || '___________________________'}</td>
                <td className="font-bold bg-gray-50 w-1/4">رقم الهوية</td>
                <td>{employee?.id_number || '_______________'}</td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-50">الوظيفة</td>
                <td>{employee?.job_title || employee?.position || '___________________________'}</td>
                <td className="font-bold bg-gray-50">رقم الجوال</td>
                <td>{employee?.phone || employee?.mobile || '_______________'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Correction Details */}
        <div className="border-2 border-gray-700 rounded mb-4">
          <div className="bg-blue-800 text-white text-center py-1 font-bold text-xs">تفاصيل التصحيح المطلوب</div>
          <table className="form-table text-xs">
            <tbody>
              <tr>
                <td className="font-bold bg-gray-50 w-1/3">نوع التصحيح</td>
                <td colSpan={3} className="font-bold text-blue-800">{formData.correction_type || '___________________________'}</td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-50">تاريخ السجل المراد تصحيحه</td>
                <td colSpan={3}>{formData.correction_date || '_______________'}</td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-50">البيانات الأصلية (قبل)</td>
                <td className="text-red-700 font-bold">{formData.original_value || '_______________'}</td>
                <td className="font-bold bg-gray-50">البيانات الصحيحة (بعد)</td>
                <td className="text-green-700 font-bold">{formData.corrected_value || '_______________'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Reason */}
        <div className="border border-gray-400 rounded mb-6 p-3">
          <div className="font-bold text-xs mb-2">سبب طلب التصحيح:</div>
          <div className="text-xs leading-7 min-h-12">
            {formData.reason || '...........................................................................................................................'}
          </div>
        </div>

        {/* Faris Steps */}
        <div className="border border-blue-300 bg-blue-50 rounded p-3 mb-6 text-xs">
          <div className="font-bold text-blue-800 mb-2">خطوات التصحيح في نظام فارس (للمشرف):</div>
          <ol className="list-decimal list-inside space-y-1 text-blue-900">
            <li>الدخول على نظام فارس &gt; إدارة الحضور والانصراف</li>
            <li>البحث عن الموظف برقم الهوية</li>
            <li>تحديد السجل المراد تصحيحه</li>
            <li>تعديل البيانات وحفظها</li>
            <li>الحصول على موافقة مدير المدرسة</li>
          </ol>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-6 text-center text-xs border-t border-gray-300 pt-4">
          <div>
            <div className="font-bold mb-2">طالب التصحيح (الموظف)</div>
            <div className="mb-6">التوقيع: ___________________</div>
            <div>التاريخ: ___________</div>
          </div>
          <div>
            <div className="font-bold mb-2">المشرف المنفذ</div>
            <div className="text-xs text-gray-600 mb-1">{formData.supervisor_name || '___________________________'}</div>
            <div className="mb-4">التوقيع: ___________________</div>
            <div>التاريخ: ___________</div>
          </div>
          <div>
            <div className="font-bold mb-2">اعتماد مدير المدرسة</div>
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
