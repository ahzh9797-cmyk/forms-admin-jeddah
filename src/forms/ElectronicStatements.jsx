import React, { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

const STATUS_LABELS = {
  draft: 'مسودة',
  sent: 'بانتظار الإفادة',
  opened: 'تم فتح الرابط',
  submitted: 'تم استلام الإفادة',
  returned: 'معادة للاستكمال',
  completed: 'مكتملة',
  cancelled: 'ملغاة',
}

function makeToken() {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

function makeStatementNumber() {
  const now = new Date()
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  return `ES-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`
}

function publicUrl(token) {
  return `${window.location.origin}${window.location.pathname}#/statement/${token}`
}

function SignaturePad({ onChange }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      const rect = canvas.getBoundingClientRect()
      const snapshot = canvas.width ? canvas.toDataURL() : null
      canvas.width = rect.width * ratio
      canvas.height = 190 * ratio
      ctx.scale(ratio, ratio)
      ctx.lineWidth = 2.2
      ctx.lineCap = 'round'
      ctx.strokeStyle = '#111827'
      if (snapshot) {
        const img = new Image()
        img.onload = () => ctx.drawImage(img, 0, 0, rect.width, 190)
        img.src = snapshot
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const point = event => {
    const rect = canvasRef.current.getBoundingClientRect()
    const p = event.touches?.[0] || event
    return { x: p.clientX - rect.left, y: p.clientY - rect.top }
  }

  const start = event => {
    event.preventDefault()
    drawing.current = true
    const ctx = canvasRef.current.getContext('2d')
    const p = point(event)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
  }

  const move = event => {
    if (!drawing.current) return
    event.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const p = point(event)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }

  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    onChange(canvasRef.current.toDataURL('image/png'))
  }

  const clear = () => {
    const canvas = canvasRef.current
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    onChange('')
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="w-full h-[190px] rounded-xl border-2 border-dashed border-gray-300 bg-white touch-none"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <button type="button" onClick={clear} className="mt-2 text-sm font-bold text-red-600 hover:text-red-800">
        مسح التوقيع وإعادته
      </button>
    </div>
  )
}

function PublicStatement({ token }) {
  const [statement, setStatement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [response, setResponse] = useState('')
  const [signature, setSignature] = useState('')
  const [approved, setApproved] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error: rpcError } = await supabase.rpc('get_public_electronic_statement', { p_token: token })
      if (rpcError || !data?.length) {
        setError('الرابط غير صحيح أو انتهت صلاحيته.')
      } else {
        const item = data[0]
        setStatement(item)
        setResponse(item.employee_response || '')
        if (['sent', 'draft'].includes(item.status)) {
          await supabase.rpc('mark_electronic_statement_opened', { p_token: token })
          item.status = 'opened'
        }
      }
      setLoading(false)
    }
    load()
  }, [token])

  const submit = async () => {
    if (!response.trim() || !signature || !approved) {
      setError('يجب كتابة الإفادة، والتوقيع، وتأكيد الإقرار قبل الاعتماد.')
      return
    }
    if (!window.confirm('بعد اعتماد الإفادة لن تتمكن من تعديلها إلا إذا أعادتها الجهة المختصة. هل ترغب في المتابعة؟')) return
    setSubmitting(true)
    setError('')
    const { error: rpcError } = await supabase.rpc('submit_electronic_statement', {
      p_token: token,
      p_response: response.trim(),
      p_signature_data: signature,
    })
    setSubmitting(false)
    if (rpcError) {
      setError(rpcError.message || 'تعذر إرسال الإفادة.')
      return
    }
    setDone(true)
  }

  if (loading) return <div className="py-16 text-center text-gray-500">جاري تحميل الإفادة...</div>
  if (error && !statement) return <div className="max-w-xl mx-auto mt-10 bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">{error}</div>

  const locked = done || ['submitted', 'completed', 'cancelled'].includes(statement.status)

  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="bg-white border border-green-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-green-800 text-white p-5">
          <h1 className="text-xl font-bold">الإفادة الإلكترونية</h1>
          <p className="text-green-100 text-sm mt-1">رقم الإفادة: {statement.statement_number}</p>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Info label="اسم الموظف" value={statement.employee_name} />
            <Info label="جهة العمل" value={statement.workplace || '—'} />
            <Info label="نوع المعاملة" value={statement.statement_type} />
            <Info label="الحالة" value={STATUS_LABELS[statement.status] || statement.status} />
          </div>

          <section className="bg-gray-50 border rounded-xl p-4">
            <h2 className="font-bold text-gray-800 mb-2">موضوع الإفادة</h2>
            <p className="text-gray-700">{statement.subject}</p>
          </section>

          <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h2 className="font-bold text-amber-900 mb-2">نص المساءلة أو التعهد</h2>
            <p className="text-gray-800 whitespace-pre-wrap leading-7">{statement.statement_text}</p>
          </section>

          {locked ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <div className="font-bold text-green-800 text-lg">تم استلام إفادتك بنجاح</div>
              <div className="text-green-700 text-sm mt-2">الحالة الحالية: {STATUS_LABELS[done ? 'submitted' : statement.status]}</div>
            </div>
          ) : (
            <>
              {statement.status === 'returned' && statement.return_reason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
                  <strong>سبب الإعادة:</strong> {statement.return_reason}
                </div>
              )}
              <div>
                <label className="block font-bold text-gray-800 mb-2">الإفادة</label>
                <textarea
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                  rows={8}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                  placeholder="اكتب إفادتك هنا بالتفصيل..."
                />
              </div>
              <div>
                <label className="block font-bold text-gray-800 mb-2">التوقيع الحي</label>
                <SignaturePad onChange={setSignature} />
              </div>
              <label className="flex items-start gap-3 bg-gray-50 border rounded-xl p-4 cursor-pointer">
                <input type="checkbox" checked={approved} onChange={e => setApproved(e.target.checked)} className="mt-1 w-5 h-5" />
                <span className="text-sm leading-6">أقر بأن الإفادة المدونة أعلاه صادرة مني، وأنني اطلعت على كامل محتوى المعاملة وأعتمد توقيعي المرفق عليها.</span>
              </label>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">{error}</div>}
              <button onClick={submit} disabled={submitting} className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white rounded-xl py-3 font-bold">
                {submitting ? 'جاري الاعتماد...' : 'اعتماد وإرسال الإفادة'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return <div className="bg-gray-50 border rounded-lg p-3"><div className="text-gray-500 text-xs mb-1">{label}</div><div className="font-bold text-gray-800">{value}</div></div>
}

export default function ElectronicStatements() {
  const token = useMemo(() => {
    const match = window.location.hash.match(/^#\/statement\/([^/]+)/)
    return match?.[1] || null
  }, [])

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    statement_type: 'مساءلة', employee_name: '', employee_identifier: '', employee_phone: '',
    workplace: '', subject: '', statement_text: '', deadline_at: '',
  })

  const loadItems = async () => {
    setLoading(true)
    const { data } = await supabase.from('electronic_statements').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { if (!token) loadItems() }, [token])

  if (token) return <PublicStatement token={token} />

  const createStatement = async e => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const tokenValue = makeToken()
    const payload = {
      ...form,
      statement_number: makeStatementNumber(),
      secure_token: tokenValue,
      status: 'sent',
      token_is_active: true,
      sent_at: new Date().toISOString(),
      deadline_at: form.deadline_at || null,
    }
    const { error } = await supabase.from('electronic_statements').insert(payload)
    setSaving(false)
    if (error) {
      setMessage(`تعذر إنشاء الإفادة: ${error.message}`)
      return
    }
    const url = publicUrl(tokenValue)
    await navigator.clipboard?.writeText(url)
    setMessage(`تم إنشاء رابط الإفادة ونسخه: ${url}`)
    setShowCreate(false)
    setForm({ statement_type: 'مساءلة', employee_name: '', employee_identifier: '', employee_phone: '', workplace: '', subject: '', statement_text: '', deadline_at: '' })
    loadItems()
  }

  const copyLink = async item => {
    await navigator.clipboard.writeText(publicUrl(item.secure_token))
    setMessage('تم نسخ رابط الإفادة.')
  }

  const whatsapp = item => {
    const text = `السلام عليكم، نأمل الدخول على رابط الإفادة الإلكترونية واستكمال الإفادة والتوقيع:\n${publicUrl(item.secure_token)}`
    window.open(`https://wa.me/${(item.employee_phone || '').replace(/\D/g, '').replace(/^0/, '966')}?text=${encodeURIComponent(text)}`, '_blank')
  }

  const stats = items.reduce((acc, item) => {
    acc.total++
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, { total: 0 })

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الإفادات الإلكترونية</h1>
          <p className="text-gray-500 text-sm mt-1">إنشاء وإرسال ومتابعة إفادات الموظفين وتعهداتهم إلكترونيًا.</p>
        </div>
        <button onClick={() => setShowCreate(v => !v)} className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-bold">
          {showCreate ? 'إغلاق' : '+ إنشاء إفادة جديدة'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat title="جميع الإفادات" value={stats.total} />
        <Stat title="بانتظار الإفادة" value={(stats.sent || 0) + (stats.opened || 0)} />
        <Stat title="تم الاستلام" value={stats.submitted || 0} />
        <Stat title="مكتملة" value={stats.completed || 0} />
      </div>

      {message && <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-3 text-sm break-all">{message}</div>}

      {showCreate && (
        <form onSubmit={createStatement} className="bg-white border border-green-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-gray-800">بيانات الإفادة الجديدة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="نوع المعاملة"><select value={form.statement_type} onChange={e => setForm({ ...form, statement_type: e.target.value })} className="input"><option>مساءلة</option><option>تعهد</option><option>إفادة</option><option>إقرار</option><option>إشعار</option></select></Field>
            <Field label="اسم الموظف"><input required value={form.employee_name} onChange={e => setForm({ ...form, employee_name: e.target.value })} className="input" /></Field>
            <Field label="رقم الهوية أو الرقم الوظيفي"><input value={form.employee_identifier} onChange={e => setForm({ ...form, employee_identifier: e.target.value })} className="input" /></Field>
            <Field label="رقم الجوال"><input value={form.employee_phone} onChange={e => setForm({ ...form, employee_phone: e.target.value })} className="input" placeholder="05xxxxxxxx" /></Field>
            <Field label="جهة العمل أو المدرسة"><input value={form.workplace} onChange={e => setForm({ ...form, workplace: e.target.value })} className="input" /></Field>
            <Field label="آخر موعد للرد"><input type="date" value={form.deadline_at} onChange={e => setForm({ ...form, deadline_at: e.target.value })} className="input" /></Field>
          </div>
          <Field label="موضوع الإفادة"><input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input" /></Field>
          <Field label="نص المساءلة أو التعهد"><textarea required rows={6} value={form.statement_text} onChange={e => setForm({ ...form, statement_text: e.target.value })} className="input" /></Field>
          <button disabled={saving} className="bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-bold">{saving ? 'جاري الإنشاء...' : 'حفظ وإنشاء رابط'}</button>
        </form>
      )}

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600"><tr><th className="p-3 text-right">رقم الإفادة</th><th className="p-3 text-right">الموظف</th><th className="p-3 text-right">الموضوع</th><th className="p-3 text-right">الحالة</th><th className="p-3 text-right">الإجراءات</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="5" className="p-8 text-center text-gray-500">جاري التحميل...</td></tr> : items.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-gray-500">لا توجد إفادات حتى الآن.</td></tr> : items.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="p-3 font-bold">{item.statement_number}</td>
                  <td className="p-3"><div className="font-bold">{item.employee_name}</div><div className="text-xs text-gray-500">{item.workplace}</div></td>
                  <td className="p-3">{item.subject}</td>
                  <td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">{STATUS_LABELS[item.status] || item.status}</span></td>
                  <td className="p-3"><div className="flex gap-2 flex-wrap"><button onClick={() => copyLink(item)} className="text-blue-700 font-bold">نسخ الرابط</button><button onClick={() => whatsapp(item)} className="text-green-700 font-bold">واتساب</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`.input{width:100%;border:1px solid #d1d5db;border-radius:.75rem;padding:.7rem .8rem;outline:none}.input:focus{border-color:#15803d;box-shadow:0 0 0 2px rgba(21,128,61,.15)}`}</style>
    </div>
  )
}

function Field({ label, children }) { return <label className="block"><span className="block text-sm font-bold text-gray-700 mb-1.5">{label}</span>{children}</label> }
function Stat({ title, value }) { return <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm"><div className="text-xs text-gray-500">{title}</div><div className="text-2xl font-bold text-green-800 mt-1">{value}</div></div> }
