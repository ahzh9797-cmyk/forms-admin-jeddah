import React, { useState } from 'react'
import { fetchEmployeeByIdNumber } from '../lib/supabase'

export default function EmployeeSearch({ onEmployeeFound, label = 'هوية الموظف' }) {
  const [idNumber, setIdNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!idNumber.trim()) {
      setError('يرجى إدخال رقم الهوية الوطنية')
      return
    }
    setLoading(true)
    setError('')
    try {
      const employee = await fetchEmployeeByIdNumber(idNumber.trim())
      if (employee) {
        onEmployeeFound(employee)
        setError('')
      } else {
        setError('لم يتم العثور على موظف بهذا الرقم')
        onEmployeeFound(null)
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث. تحقق من الاتصال.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="no-print bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
      <label className="block text-sm font-bold text-green-800 mb-2">
        {label}
      </label>
      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="أدخل رقم الهوية الوطنية..."
          className="flex-1 border border-green-300 rounded-lg px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          maxLength={10}
          dir="ltr"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-60"
        >
          {loading ? 'جاري البحث...' : 'بحث'}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-red-600 text-sm">{error}</p>
      )}
    </div>
  )
}
