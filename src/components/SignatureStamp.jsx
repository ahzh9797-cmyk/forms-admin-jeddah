import React from 'react'

export default function SignatureStamp({ title = 'مدير الإدارة', showStamp = true }) {
  return (
    <div className="flex justify-between items-end mt-8 pt-4 border-t border-gray-400">
      {showStamp && (
        <div className="text-center">
          <div className="text-xs font-bold mb-2">الختم الرسمي</div>
          <div
            className="border-2 border-gray-600 rounded-full"
            style={{ width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span className="text-xs text-gray-400">ختم</span>
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="text-xs mb-1">{title}</div>
        <div className="text-xs mb-6">الاسم: ___________________________</div>
        <div className="text-xs mb-1">التوقيع: ___________________________</div>
        <div className="text-xs">التاريخ: _______________</div>
      </div>
    </div>
  )
}
