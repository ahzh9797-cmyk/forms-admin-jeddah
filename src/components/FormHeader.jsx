import React from 'react'

export default function FormHeader({ formNumber, formTitle, year = '1446' }) {
  return (
    <div className="text-center mb-4 border-b-2 border-gray-800 pb-3">
      {/* Kingdom Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-right text-xs leading-5">
          <div className="font-bold">المملكة العربية السعودية</div>
          <div>وزارة التعليم</div>
          <div>إدارة التعليم بمحافظة جدة</div>
        </div>

        {/* Logo placeholder */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-14 h-14">
              <circle cx="50" cy="50" r="48" fill="none" stroke="#006633" strokeWidth="2"/>
              <text x="50" y="45" textAnchor="middle" fontSize="8" fill="#006633" fontWeight="bold">وزارة</text>
              <text x="50" y="58" textAnchor="middle" fontSize="8" fill="#006633" fontWeight="bold">التعليم</text>
              <text x="50" y="71" textAnchor="middle" fontSize="7" fill="#006633">المملكة العربية</text>
              <text x="50" y="82" textAnchor="middle" fontSize="7" fill="#006633">السعودية</text>
            </svg>
          </div>
        </div>

        <div className="text-left text-xs leading-5">
          {formNumber && (
            <>
              <div>رقم النموذج: <span className="font-bold">{formNumber}</span></div>
              <div>العام الدراسي: {year}هـ</div>
            </>
          )}
        </div>
      </div>

      {/* Form Title */}
      <div className="bg-green-800 text-white py-2 px-4 rounded mt-2">
        <h1 className="text-base font-bold tracking-wide">{formTitle}</h1>
      </div>
    </div>
  )
}
