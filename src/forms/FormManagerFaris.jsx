import React, { useState } from 'react'
import FormHeader from '../components/FormHeader'
import EmployeeSearch from '../components/EmployeeSearch'

const CORRECTION_TYPES = [
  'تصحيح بيانات الحضور والانصراف',
  'تصحيح إجازة سنوية',
  'تصحيح إجازة مرضية',
  'تصحيح إجازة طارئة',
  'تصحيح مهمة رسمية',
  'تصحيح مأمورية',
  'تصحيح اجتماع رسمي',
  'إضافة عذر غياب',
  'تصحيح تدريب ميداني',
]

export default function FormManagerFaris() {
  const [employee, setEmployee] = useState(null)
  const [formData, setFormData] = useState({
    school: '',
    request_number: '',
    request_date: new Date().toLocaleDateString('ar-SA'),
    correction_type: '',
    correction_from: '',
    correction_to: '',
    original_value: '',
    corrected_value: '',
    reason: '',
    manager_name: '',
    supporting_docs: '',
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
          <label className="block text-sm font-bold text-gray-700 mb-1">رقم الطلب</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.request_number} onChange={e => set('request_number', e.target.value)} placeholder="رقم الطلب..." />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">نوع التصحيح</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.correction_type} onChange={e => set('correction_type', e.target.value)}>
            <option value="">-- اختر نوع التصحيح --</option>
            {CORRECTION_TYPES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">من تاريخ</label>
          <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.correction_from} onChange={e => set('correction_from', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">إلى تاريخ</label>
          <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.correction_to} onChange={e => set('correction_to', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">اسم مدير المدرسة</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.manager_name} onChange={e => set('manager_name', e.target.value)} placeholder="اسم المدير..." />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">البيانات الأصلية</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.original_value} onChange={e => set('original_value', e.target.value)} placeholder="قبل التصحيح..." />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">البيانات الصحيحة</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.corrected_value} onChange={e => set('corrected_value', e.target.value)} placeholder="بعد التصحيح..." />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">المستندات المرفقة</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.supporting_docs} onChange={e => set('supporting_docs', e.target.value)} placeholder="مثال: خطاب رسمي، تقرير..." />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-bold text-gray-700 mb-1">مبررات طلب التصحيح</label>
          <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows={2} value={formData.reason} onChange={e => set('reason', e.target.value)} placeholder="اكتب المبررات التفصيلية..." />
        </div>
      </div>

      <div className="no-print mb-4 flex justify-end">
        <button onClick={() => window.print()} className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded-lg font-bold text-sm">
          طباعة النموذج
        </button>
      </div>

      {/* PRINTABLE FORM */}
      <div className="form-page official-form bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto text-sm" style={{ direction: 'rtl' }}>
        <FormHeader formTitle="نموذج تصحيح بيانات مدير في نظام فارس" />

        {/* Reference Header */}
        <div className="flex justify-between text-xs mb-4 bg-gray-50 border border-gray-300 rounded p-2">
          <div>رقم الطلب: <span className="font-bold">{formData.request_number || '___________'}</span></div>
          <div>تاريخ الطلب: <span className="font-bold">{formData.request_date}</span></div>
          <div>المدرسة: <span className="font-bold">{formData.school || '___________________________'}</span></div>
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
                <td className="font-bold bg-gray-50">الدرجة الوظيفية</td>
                <td>{employee?.grade || '_______________'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Correction Details */}
        <div className="border-2 border-gray-700 rounded mb-4">
          <div className="bg-indigo-800 text-white text-center py-1 font-bold text-xs">تفاصيل التصحيح المطلوب</div>
          <table className="form-table text-xs">
            <tbody>
              <tr>
                <td className="font-bold bg-gray-50 w-1/3">نوع التصحيح</td>
                <td colSpan={3} className="font-bold text-indigo-800">{formData.correction_type || '___________________________'}</td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-50">الفترة الزمنية</td>
                <td colSpan={3}>
                  من: <span className="font-bold">{formData.correction_from || '___________'}</span>
                  &nbsp;&nbsp;إلى: <span className="font-bold">{formData.correction_to || '___________'}</span>
                </td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-50">البيانات قبل التصحيح</td>
                <td className="text-red-700 font-bold">{formData.original_value || '___________________________'}</td>
                <td className="font-bold bg-gray-50">البيانات بعد التصحيح</td>
                <td className="text-green-700 font-bold">{formData.corrected_value || '___________________________'}</td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-50">المستندات المرفقة</td>
                <td colSpan={3}>{formData.supporting_docs || 'لا توجد مستندات'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Reason */}
        <div className="border border-gray-400 rounded mb-4 p-3">
          <div className="font-bold text-xs mb-2">مبررات طلب التصحيح:</div>
          <div className="text-xs leading-7 min-h-16">
            {formData.reason || '...........................................................................................................................'}
          </div>
        </div>

        {/* Commitment */}
        <div className="border border-yellow-400 bg-yellow-50 rounded p-3 mb-6 text-xs">
          <div className="font-bold text-yellow-800 mb-1">إقرار مدير المدرسة:</div>
          <p className="text-yellow-900 leading-6">
            أنا الموقع أدناه&nbsp;
            <span className="font-bold underline">{formData.manager_name || '___________________________'}</span>
            &nbsp;مدير مدرسة&nbsp;
            <span className="font-bold underline">{formData.school || '___________________________'}</span>
            &nbsp;أُقر بصحة المعلومات الواردة في هذا النموذج وأتحمل المسؤولية الكاملة عن طلب التصحيح.
          </p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-4 text-center text-xs border-t border-gray-300 pt-4">
          <div>
            <div className="font-bold mb-2">طالب التصحيح (الموظف)</div>
            <div className="mb-6">التوقيع: ___________________</div>
            <div>التاريخ: ___________</div>
          </div>
          <div>
            <div className="font-bold mb-2">مدير المدرسة</div>
            <div className="text-xs text-gray-600 mb-1">{formData.manager_name || '___________________________'}</div>
            <div className="mb-4">التوقيع: ___________________</div>
            <div>التاريخ: ___________</div>
          </div>
          <div>
            <div className="font-bold mb-2">ختم المدرسة</div>
            <div className="stamp-box mx-auto mb-1" style={{ width: 90, height: 80 }}>
              <span className="text-gray-300 text-xs">الختم الرسمي</span>
            </div>
          </div>
        </div>

        {/* Admin Section */}
        <div className="mt-6 border-t-2 border-dashed border-gray-400 pt-4">
          <div className="text-center font-bold text-xs mb-3 text-gray-600">— تُكمل هذه الخانة إدارة التعليم —</div>
          <table className="form-table text-xs">
            <tbody>
              <tr>
                <td className="font-bold bg-gray-50 w-1/3">رقم الطلب في فارس</td>
                <td></td>
                <td className="font-bold bg-gray-50 w-1/3">تاريخ التنفيذ</td>
                <td></td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-50">اسم المنفذ</td>
                <td></td>
                <td className="font-bold bg-gray-50">حالة الطلب</td>
                <td>
                  <div className="flex gap-4 text-xs">
                    <label className="flex items-center gap-1"><input type="checkbox" /> منفذ</label>
                    <label className="flex items-center gap-1"><input type="checkbox" /> مرفوض</label>
                    <label className="flex items-center gap-1"><input type="checkbox" /> معلق</label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
