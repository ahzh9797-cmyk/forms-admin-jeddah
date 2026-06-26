import React, { useState } from 'react'
import Form18 from './forms/Form18'
import Form19 from './forms/Form19'
import Form21 from './forms/Form21'
import FormLeaveBalance from './forms/FormLeaveBalance'
import FormSupervisorFaris from './forms/FormSupervisorFaris'
import FormManagerFaris from './forms/FormManagerFaris'

const FORMS = [
  {
    id: 'form18',
    number: '18',
    title: 'نموذج مساءلة تأخر / انصراف',
    description: 'توثيق مخالفات التأخر والانصراف المبكر',
    color: 'orange',
    component: Form18,
  },
  {
    id: 'form19',
    number: '19',
    title: 'نموذج حسم ساعات التأخر',
    description: 'حساب وتوثيق حسم ساعات التأخر الشهرية',
    color: 'red',
    component: Form19,
  },
  {
    id: 'form21',
    number: '21',
    title: 'قرار حسم غياب',
    description: 'إصدار قرار رسمي لحسم أيام الغياب',
    color: 'purple',
    component: Form21,
  },
  {
    id: 'leave',
    number: null,
    title: 'نموذج ترصيد الإجازات',
    description: 'عرض رصيد الإجازات المتبقي للموظف',
    color: 'blue',
    component: FormLeaveBalance,
  },
  {
    id: 'supervisor-faris',
    number: null,
    title: 'تصحيح مشرف في فارس',
    description: 'طلب تصحيح بيانات موظف في نظام فارس (مشرف)',
    color: 'teal',
    component: FormSupervisorFaris,
  },
  {
    id: 'manager-faris',
    number: null,
    title: 'تصحيح مدير في فارس',
    description: 'طلب تصحيح بيانات موظف في نظام فارس (مدير)',
    color: 'indigo',
    component: FormManagerFaris,
  },
]

const COLOR_MAP = {
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'bg-orange-500', border: 'border-orange-300', hover: 'hover:border-orange-400' },
  red:    { bg: 'bg-red-100',    text: 'text-red-700',    badge: 'bg-red-500',    border: 'border-red-300',    hover: 'hover:border-red-400' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', badge: 'bg-purple-500', border: 'border-purple-300', hover: 'hover:border-purple-400' },
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-700',   badge: 'bg-blue-500',   border: 'border-blue-300',   hover: 'hover:border-blue-400' },
  teal:   { bg: 'bg-teal-100',   text: 'text-teal-700',   badge: 'bg-teal-500',   border: 'border-teal-300',   hover: 'hover:border-teal-400' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', badge: 'bg-indigo-500', border: 'border-indigo-300', hover: 'hover:border-indigo-400' },
}

export default function App() {
  const [activeForm, setActiveForm] = useState(null)

  const current = activeForm ? FORMS.find(f => f.id === activeForm) : null
  const ActiveComponent = current?.component

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Header */}
      <header className="no-print bg-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-1.5">
              <svg viewBox="0 0 40 40" className="w-8 h-8">
                <circle cx="20" cy="20" r="19" fill="none" stroke="#006633" strokeWidth="1.5"/>
                <text x="20" y="17" textAnchor="middle" fontSize="5" fill="#006633" fontWeight="bold">وزارة</text>
                <text x="20" y="24" textAnchor="middle" fontSize="5" fill="#006633" fontWeight="bold">التعليم</text>
              </svg>
            </div>
            <div>
              <div className="font-bold text-lg leading-5">إدارة التعليم بمحافظة جدة</div>
              <div className="text-green-200 text-xs">نظام النماذج الرسمية</div>
            </div>
          </div>
          {activeForm && (
            <button
              onClick={() => setActiveForm(null)}
              className="bg-white text-green-800 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-green-50 transition-colors"
            >
              ← العودة للرئيسية
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {!activeForm ? (
          /* HOME PAGE */
          <>
            {/* Welcome Banner */}
            <div className="bg-white border border-green-200 rounded-2xl p-6 mb-8 flex items-center gap-4 shadow-sm">
              <div className="bg-green-100 rounded-full p-4">
                <svg className="w-10 h-10 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">مرحباً بك في نظام النماذج الرسمية</h2>
                <p className="text-gray-600 text-sm">اختر النموذج المطلوب، وأدخل رقم الهوية الوطنية لجلب بيانات الموظف تلقائياً من قاعدة البيانات، ثم اطبع النموذج.</p>
              </div>
            </div>

            {/* Forms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FORMS.map(form => {
                const c = COLOR_MAP[form.color]
                return (
                  <button
                    key={form.id}
                    onClick={() => setActiveForm(form.id)}
                    className={`text-right bg-white border-2 ${c.border} ${c.hover} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      {form.number ? (
                        <span className={`${c.badge} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                          نموذج {form.number}
                        </span>
                      ) : (
                        <span className={`${c.badge} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                          نموذج
                        </span>
                      )}
                      <div className={`${c.bg} rounded-lg p-2 group-hover:scale-110 transition-transform`}>
                        <svg className={`w-5 h-5 ${c.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1 text-sm">{form.title}</h3>
                    <p className="text-gray-500 text-xs leading-5">{form.description}</p>
                    <div className={`mt-3 text-xs font-bold ${c.text} flex items-center gap-1`}>
                      <span>فتح النموذج</span>
                      <span>←</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Info footer */}
            <div className="mt-8 text-center text-xs text-gray-400">
              يتم جلب بيانات الموظفين تلقائياً من جداول supervisors و vice_principals في قاعدة بيانات Supabase
            </div>
          </>
        ) : (
          /* FORM PAGE */
          <div>
            <div className="no-print mb-4 flex items-center gap-3">
              <button
                onClick={() => setActiveForm(null)}
                className="text-green-700 hover:text-green-900 text-sm font-bold"
              >
                ← الرئيسية
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700 text-sm font-bold">{current?.title}</span>
            </div>
            {ActiveComponent && <ActiveComponent />}
          </div>
        )}
      </main>
    </div>
  )
}
