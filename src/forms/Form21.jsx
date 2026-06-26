import React, { useState } from 'react'
import FormHeader from '../components/FormHeader'
import EmployeeSearch from '../components/EmployeeSearch'

export default function Form21() {
  const [employee, setEmployee] = useState(null)
  const [formData, setFormData] = useState({
    school: '',
    decision_number: '',
    decision_date: new Date().toLocaleDateString('ar-SA'),
    absence_days: '',
    month: '',
    absence_type: 'غياب بدون عذر',
    deduction_amount: '',
    notes: '',
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
          <label className="block text-sm font-bold text-gray-700 mb-1">رقم القرار</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.decision_number} onChange={e => set('decision_number', e.target.value)} placeholder="رقم القرار..." />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">الشهر</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.month} onChange={e => set('month', e.target.value)} placeholder="الشهر الهجري..." />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">أيام الغياب</label>
          <input type="number" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.absence_days} onChange={e => set('absence_days', e.target.value)} min="1" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">نوع الغياب</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.absence_type} onChange={e => set('absence_type', e.target.value)}>
            <option>غياب بدون عذر</option>
            <option>غياب بدون إشعار</option>
            <option>تغيب مستمر</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">مبلغ الحسم (ريال)</label>
          <input type="number" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.deduction_amount} onChange={e => set('deduction_amount', e.target.value)} placeholder="0" />
        </div>
      </div>

      <div className="no-print mb-4 flex justify-end">
        <button onClick={() => window.print()} className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded-lg font-bold text-sm">
          طباعة القرار
        </button>
      </div>

      {/* PRINTABLE FORM */}
      <div className="form-page official-form bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto text-sm" style={{ direction: 'rtl' }}>
        <FormHeader formNumber="21" formTitle="قرار حسم غياب" />

        {/* Decision reference */}
        <div className="flex justify-between text-xs mb-4 border border-gray-300 rounded p-2 bg-gray-50">
          <div>رقم القرار: <span className="font-bold">{formData.decision_number || '___________'}</span></div>
          <div>تاريخه: <span className="font-bold">{formData.decision_date}</span></div>
          <div>المدرسة: <span className="font-bold">{formData.school || '___________'}</span></div>
        </div>

        {/* Employee Data */}
        <div className="border-2 border-gray-700 rounded mb-4">
          <div className="bg-green-800 text-white text-center py-1 font-bold text-xs">بيانات الموظف</div>
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

        {/* Decision Body */}
        <div className="border-2 border-gray-700 rounded mb-4 p-4">
          <div className="font-bold text-center text-xs mb-3 bg-green-800 text-white py-1 -mx-4 -mt-4 mb-4">نص القرار</div>
          <p className="text-xs leading-8 text-justify">
            بناءً على الصلاحيات الممنوحة وعلى المادة (43) من نظام الخدمة المدنية ولوائحه التنفيذية، وبعد التحقق من&nbsp;
            <span className="font-bold underline">{formData.absence_type}</span>
            &nbsp;للموظف / الموظفة&nbsp;
            <span className="font-bold underline">{employee?.full_name || employee?.name || '___________________________'}</span>
            &nbsp;خلال شهر&nbsp;
            <span className="font-bold underline">{formData.month || '___________'}</span>
            &nbsp;لمدة&nbsp;
            <span className="font-bold underline">{formData.absence_days || '___'} يوم/أيام</span>،
            يُقرر حسم ما يعادل هذه الأيام من راتبه/راتبها.
          </p>
          {formData.deduction_amount && (
            <div className="mt-3 text-center">
              <span className="bg-red-100 border border-red-400 text-red-800 px-4 py-1 rounded text-xs font-bold">
                مبلغ الحسم: {formData.deduction_amount} ريال
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        {formData.notes && (
          <div className="border border-gray-400 rounded mb-4 p-2">
            <div className="font-bold text-xs mb-1">ملاحظات:</div>
            <div className="text-xs leading-6">{formData.notes}</div>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 text-center text-xs border-t border-gray-300 pt-4 mt-6">
          <div>
            <div className="font-bold mb-2">وكيل المدرسة للشؤون التعليمية</div>
            <div className="text-gray-600 mb-6">الاسم: ___________________________</div>
            <div className="border-b border-gray-500 mb-1">التوقيع: ___________________</div>
            <div>التاريخ: _______________</div>
          </div>
          <div>
            <div className="font-bold mb-2">مدير المدرسة</div>
            <div className="stamp-box mx-auto mb-2" style={{ width: 100, height: 80 }}>
              <span className="text-gray-300 text-xs">الختم الرسمي</span>
            </div>
            <div className="border-b border-gray-500 mb-1">التوقيع: ___________________</div>
            <div>التاريخ: _______________</div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-4 border-t border-gray-200 pt-2 text-center text-xs text-gray-500">
          يُحفظ هذا القرار في ملف الموظف ويُرسل صورة منه إلى إدارة التعليم
        </div>
      </div>
    </div>
  )
}
