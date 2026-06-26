import React, { useState } from 'react'
import FormHeader from '../components/FormHeader'
import EmployeeSearch from '../components/EmployeeSearch'

const LEAVE_TYPES = [
  { id: 'annual', label: 'إجازة سنوية', entitlement: 30 },
  { id: 'sick', label: 'إجازة مرضية', entitlement: 60 },
  { id: 'emergency', label: 'إجازة اضطرارية', entitlement: 5 },
  { id: 'hajj', label: 'إجازة الحج', entitlement: 14 },
  { id: 'maternity', label: 'إجازة أمومة', entitlement: 60 },
  { id: 'accompanying', label: 'إجازة مرافقة', entitlement: 30 },
]

export default function FormLeaveBalance() {
  const [employee, setEmployee] = useState(null)
  const [year, setYear] = useState('1446')
  const [school, setSchool] = useState('')
  const [leaveData, setLeaveData] = useState(
    LEAVE_TYPES.reduce((acc, t) => ({ ...acc, [t.id]: { used: '', remaining: '' } }), {})
  )

  const updateLeave = (id, field, value, entitlement) => {
    setLeaveData(prev => {
      const updated = { ...prev[id], [field]: value }
      if (field === 'used' && value !== '') {
        const used = parseInt(value) || 0
        updated.remaining = Math.max(0, entitlement - used)
      }
      return { ...prev, [id]: updated }
    })
  }

  return (
    <div>
      <EmployeeSearch onEmployeeFound={setEmployee} label="ابحث عن الموظف برقم الهوية الوطنية" />

      <div className="no-print mb-4 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">العام الدراسي</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={year} onChange={e => setYear(e.target.value)} placeholder="1446هـ" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">اسم المدرسة</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={school} onChange={e => setSchool(e.target.value)} placeholder="اسم المدرسة..." />
        </div>
      </div>

      <div className="no-print mb-4 flex justify-end">
        <button onClick={() => window.print()} className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded-lg font-bold text-sm">
          طباعة النموذج
        </button>
      </div>

      {/* PRINTABLE FORM */}
      <div className="form-page official-form bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto text-sm" style={{ direction: 'rtl' }}>
        <FormHeader formTitle="نموذج ترصيد الإجازات" year={year} />

        <div className="flex justify-between text-xs mb-4">
          <div>المدرسة: <span className="font-bold">{school || '___________________________'}</span></div>
          <div>العام الدراسي: <span className="font-bold">{year}هـ</span></div>
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
                <td className="font-bold bg-gray-50">رقم الملف</td>
                <td>{employee?.file_number || '_______________'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Leave Balance Table */}
        <table className="form-table text-xs mb-6">
          <thead>
            <tr className="bg-green-800 text-white">
              <th className="text-center">م</th>
              <th>نوع الإجازة</th>
              <th className="text-center">الاستحقاق السنوي (يوم)</th>
              <th className="text-center">المستخدم (يوم)</th>
              <th className="text-center">الرصيد المتبقي (يوم)</th>
              <th>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {LEAVE_TYPES.map((type, idx) => (
              <tr key={type.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="text-center">{idx + 1}</td>
                <td className="font-bold">{type.label}</td>
                <td className="text-center">{type.entitlement}</td>
                <td className="text-center">
                  <input
                    className="no-print w-16 border border-gray-300 rounded text-center text-xs px-1 py-0.5"
                    type="number"
                    min="0"
                    max={type.entitlement}
                    value={leaveData[type.id].used}
                    onChange={e => updateLeave(type.id, 'used', e.target.value, type.entitlement)}
                    placeholder="0"
                  />
                  <span className="print-only">{leaveData[type.id].used || '---'}</span>
                </td>
                <td className="text-center font-bold text-green-800">
                  {leaveData[type.id].remaining !== '' ? leaveData[type.id].remaining : '---'}
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Note */}
        <div className="border border-gray-300 rounded p-3 mb-6 bg-yellow-50 text-xs">
          <div className="font-bold text-yellow-800 mb-1">تنبيه:</div>
          <div className="text-yellow-900">يتم احتساب الرصيد المتبقي بناءً على الاستحقاق السنوي مطروحاً منه الإجازات المستخدمة. لا تُنقل الأيام الزائدة عن الاستحقاق.</div>
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
