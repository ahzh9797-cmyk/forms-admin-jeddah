import React, { useEffect, useMemo, useRef, useState } from 'react'
import EmployeeSearch from '../components/EmployeeSearch'
import { supabase } from '../lib/supabase'

const labels = {
  sent_to_employee: 'بانتظار إفادة الموظف',
  pending_manager_decision: 'بانتظار قرار المدير',
  manager_approved: 'اعتمد المدير بالموافقة',
  manager_rejected: 'اعتمد المدير بعدم الموافقة',
}

const tokenValue = () => {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}
const employeeUrl = token => `${window.location.origin}${window.location.pathname}#/form18/${token}`

function SignaturePad({ onChange }) {
  const ref = useRef(null)
  const drawing = useRef(false)
  useEffect(() => {
    const c = ref.current, ratio = Math.max(devicePixelRatio || 1, 1), w = Math.max(c.getBoundingClientRect().width, 300)
    c.width = w * ratio; c.height = 145 * ratio
    const x = c.getContext('2d'); x.scale(ratio, ratio); x.lineWidth = 2.2; x.lineCap = 'round'; x.strokeStyle = '#111827'
  }, [])
  const point = e => { const r = ref.current.getBoundingClientRect(), p = e.touches?.[0] || e; return { x: p.clientX-r.left, y:p.clientY-r.top } }
  const start = e => { e.preventDefault(); drawing.current=true; const x=ref.current.getContext('2d'),p=point(e); x.beginPath(); x.moveTo(p.x,p.y) }
  const move = e => { if(!drawing.current)return; e.preventDefault(); const x=ref.current.getContext('2d'),p=point(e); x.lineTo(p.x,p.y); x.stroke() }
  const end = () => { if(!drawing.current)return; drawing.current=false; onChange(ref.current.toDataURL('image/png')) }
  const clear = () => { const c=ref.current; c.getContext('2d').clearRect(0,0,c.width,c.height); onChange('') }
  return <div className="no-print"><canvas ref={ref} className="w-full h-[145px] bg-white border-2 border-dashed rounded-lg touch-none" onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end} onTouchStart={start} onTouchMove={move} onTouchEnd={end}/><button type="button" onClick={clear} className="text-xs font-bold text-red-600 mt-1">مسح التوقيع</button></div>
}

const Section = ({title,children}) => <><div style={{background:'#006633',color:'#fff',fontWeight:700,padding:'4px 10px',fontSize:10}}>{title}</div><div style={{border:'1.5px solid #000',padding:10,marginBottom:10,fontSize:10}}>{children}</div></>
const Check = ({on}) => <span style={{display:'inline-flex',width:15,height:15,border:'1px solid #000',alignItems:'center',justifyContent:'center'}}>{on?'✓':''}</span>
const sig = (src,label) => <div style={{textAlign:'center'}}><b>{label}</b>{src?<img src={src} alt={label} style={{maxWidth:130,maxHeight:55,margin:'4px auto'}}/>:<div style={{width:120,height:30,borderBottom:'1px solid #555'}}/>}</div>

function OfficialForm({payload,mode,employeeText,setEmployeeText,setEmployeeSign,manager,setManager}) {
  const emp=payload.employee||{}, er=payload.employee_response||{}, md=payload.manager_decision||{}
  const decision=mode==='manager'?manager.decision:md.decision
  return <div className="form-page bg-white mx-auto text-black" style={{direction:'rtl',width:'210mm',maxWidth:'100%',minHeight:'297mm',padding:'12mm 14mm',boxSizing:'border-box',fontFamily:"'Cairo',Arial",boxShadow:'0 2px 16px #0002'}}>
    <div style={{display:'flex',justifyContent:'space-between',borderBottom:'2px solid #000',paddingBottom:6,fontSize:9}}><div><b>المملكة العربية السعودية</b><br/>وزارة التعليم<br/>إدارة التعليم بمحافظة جدة<br/>مدرسة: <b>{payload.school||'—'}</b></div><div style={{color:'#006633',fontSize:17,fontWeight:800,paddingTop:12}}>وزارة التعليم</div><div>نموذج: <b>18</b><br/>التاريخ: {payload.date?new Date(payload.date).toLocaleDateString('ar-SA'):'—'}</div></div>
    <h2 style={{textAlign:'center',background:'#006633',color:'#fff',padding:6,borderRadius:4,fontSize:13}}>نموذج مساءلة تأخر / انصراف مبكر</h2>
    <table style={{width:'100%',borderCollapse:'collapse',fontSize:10,marginBottom:9}}><tbody><tr><td style={th}>اسم الموظف</td><td style={td}>{emp.full_name||'—'}</td><td style={th}>رقم الهوية</td><td style={td}>{emp.id_number||'—'}</td><td style={th}>الوظيفة</td><td style={td}>{emp.job_title||'—'}</td></tr></tbody></table>
    <Section title="القسم الأول: إشعار المدير"><p>يُشعركم بأنه قد رُصد عليكم ما يلي:</p><div style={{display:'flex',gap:32}}><span><Check on={payload.violation==='late'}/> تأخر عن الدوام</span><span><Check on={payload.violation==='early'}/> انصراف مبكر</span></div><p><b>اليوم:</b> {payload.violation_day||'—'} &nbsp; <b>التاريخ:</b> {payload.violation_date?new Date(payload.violation_date).toLocaleDateString('ar-SA'):'—'} &nbsp; <b>الوقت:</b> {payload.violation_time||'—'}</p></Section>
    <Section title="القسم الثاني: رد الموظف / الموظفة">{mode==='employee'?<div className="no-print space-y-3"><textarea rows={7} value={employeeText} onChange={e=>setEmployeeText(e.target.value)} className="w-full border rounded-lg p-3" placeholder="اكتب الإفادة هنا..."/><b>التوقيع الحي للموظف</b><SignaturePad onChange={setEmployeeSign}/></div>:<><div style={{minHeight:90,border:'1px solid #bbb',padding:8,whiteSpace:'pre-wrap'}}>{er.text||'لم تُستلم الإفادة بعد.'}</div><div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginTop:10}}><span><b>اسم الموظف:</b> {emp.full_name||'—'}</span>{sig(er.signature_base64,'توقيع الموظف')}<span><b>التاريخ:</b><br/>{er.signed_at?new Date(er.signed_at).toLocaleString('ar-SA'):'—'}</span></div></>}</Section>
    <Section title="القسم الثالث: رأي المدير في العذر المقدَّم">{mode==='manager'?<div className="no-print space-y-3"><div className="flex gap-6"><label><input type="radio" checked={manager.decision==='accepted'} onChange={()=>setManager({...manager,decision:'accepted'})}/> قبول العذر</label><label><input type="radio" checked={manager.decision==='rejected'} onChange={()=>setManager({...manager,decision:'rejected'})}/> عدم قبول العذر</label></div><input className="w-full border rounded p-2" value={manager.name} onChange={e=>setManager({...manager,name:e.target.value})} placeholder="اسم المدير"/><textarea className="w-full border rounded p-2" rows={4} value={manager.note} onChange={e=>setManager({...manager,note:e.target.value})} placeholder="ملاحظات المدير"/><b>توقيع المدير</b><SignaturePad onChange={s=>setManager({...manager,signature:s})}/></div>:<><div style={{display:'flex',gap:30}}><span><Check on={decision==='accepted'}/> قبول العذر</span><span><Check on={decision==='rejected'}/> عدم قبول العذر</span></div><p><b>ملاحظات المدير:</b> {md.note||'—'}</p><div style={{display:'flex',justifyContent:'space-between',alignItems:'end'}}><span><b>اسم المدير:</b> {md.manager_name||'—'}</span>{sig(md.signature_base64,'توقيع المدير')}<span><b>التاريخ:</b><br/>{md.signed_at?new Date(md.signed_at).toLocaleString('ar-SA'):'—'}</span></div></>}</Section>
    <div style={{textAlign:'center',fontSize:8,color:'#777'}}>نموذج رقم 18 — يُحفظ في ملف الموظف</div>
  </div>
}

function EmployeePage({token}) {
  const [row,setRow]=useState(null),[text,setText]=useState(''),[sign,setSign]=useState(''),[ok,setOk]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(false)
  useEffect(()=>{ supabase.rpc('get_public_form18_transaction',{p_token:token}).then(({data,error})=>{const r=Array.isArray(data)?data[0]:data;if(error||!r)setError(error?.message||'الرابط غير صحيح');else setRow(r)}) },[token])
  const submit=async()=>{ if(!text.trim()||!sign||!ok){setError('أكمل الإفادة والتوقيع والإقرار.');return} const {error}=await supabase.rpc('submit_form18_employee_response',{p_token:token,p_response:text.trim(),p_signature_base64:sign}); if(error)setError(error.message);else setDone(true) }
  if(error&&!row)return <div className="bg-red-50 p-6 rounded-xl text-center text-red-700">{error}</div>
  if(!row)return <div className="py-16 text-center">جاري تحميل النموذج...</div>
  if(done)return <div className="bg-green-50 p-8 rounded-xl text-center font-bold text-green-800">تم إرسال الإفادة والتوقيع للمدير.</div>
  const locked=row.form_payload?.workflow_status!=='sent_to_employee'
  return <div className="space-y-4"><div className="no-print bg-blue-50 border p-4 rounded-xl text-sm">النموذج كامل للقراءة فقط، والمتاح لك هو القسم الثاني فقط.</div><OfficialForm payload={row.form_payload||{}} mode={locked?'locked':'employee'} employeeText={text} setEmployeeText={setText} setEmployeeSign={setSign} manager={{}} setManager={()=>{}}/>{!locked&&<div className="no-print bg-white border rounded-xl p-4 space-y-3"><label><input type="checkbox" checked={ok} onChange={e=>setOk(e.target.checked)}/> أقر بصحة الإفادة والتوقيع.</label>{error&&<div className="text-red-700">{error}</div>}<button onClick={submit} className="w-full bg-green-700 text-white rounded-lg py-3 font-bold">اعتماد الإفادة والتوقيع</button></div>}</div>
}

export default function Form18Unified() {
  const token=useMemo(()=>window.location.hash.match(/^#\/form18\/([^/]+)/)?.[1]||null,[])
  const [employee,setEmployee]=useState(null),[items,setItems]=useState([]),[selected,setSelected]=useState(null),[message,setMessage]=useState('')
  const [form,setForm]=useState({school:'',date:'',violation:'',violation_day:'',violation_date:'',violation_time:''})
  const [manager,setManager]=useState({name:'',decision:'',note:'',signature:''})
  const load=()=>supabase.from('response_transactions').select('*').eq('transaction_type','form18').order('created_at',{ascending:false}).then(({data,error})=>{if(error)setMessage(error.message);setItems(data||[])})
  useEffect(()=>{if(!token)load()},[token])
  if(token)return <EmployeePage token={token}/>
  const create=async()=>{if(!employee||Object.values(form).some(v=>!v)){setMessage('أكمل جميع البيانات.');return}const t=tokenValue(),payload={...form,workflow_status:'sent_to_employee',employee:{full_name:employee.full_name||employee.name||'',id_number:employee.id_number||'',job_title:employee.job_title||employee.position||''}};const {error}=await supabase.from('response_transactions').insert({transaction_id:t,transaction_type:'form18',action:'created',status:'sent',form_payload:payload});if(error)setMessage(error.message);else{const u=employeeUrl(t);await navigator.clipboard?.writeText(u);setMessage(`تم إنشاء المساءلة ونسخ رابط الموظف: ${u}`);load()}}
  const approve=async()=>{if(!selected||!manager.name.trim()||!manager.decision||!manager.signature){setMessage('اسم المدير والقرار والتوقيع مطلوبة.');return}const {error}=await supabase.rpc('submit_form18_manager_decision',{p_transaction_id:selected.id,p_manager_name:manager.name.trim(),p_decision:manager.decision,p_note:manager.note,p_signature_base64:manager.signature});if(error)setMessage(error.message);else{setMessage('تم اعتماد المدير وإغلاق المعاملة.');setSelected(null);setManager({name:'',decision:'',note:'',signature:''});load()}}
  const workflow=i=>i.form_payload?.workflow_status||i.status
  return <div className="space-y-5"><div className="no-print bg-white border rounded-2xl p-5 space-y-4"><h1 className="text-xl font-bold">نموذج المساءلة الإلكتروني الموحد</h1><EmployeeSearch onEmployeeFound={setEmployee} label="ابحث عن الموظف برقم الهوية الوطنية"/>{employee&&<div className="bg-green-50 p-3 rounded"><b>الموظف:</b> {employee.full_name||employee.name}</div>}<div className="grid md:grid-cols-3 gap-3"><F l="اسم المدرسة"><input className="input" value={form.school} onChange={e=>setForm({...form,school:e.target.value})}/></F><F l="تاريخ النموذج"><input type="date" className="input" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></F><F l="نوع المخالفة"><select className="input" value={form.violation} onChange={e=>setForm({...form,violation:e.target.value})}><option value="">اختر</option><option value="late">تأخر</option><option value="early">انصراف مبكر</option></select></F><F l="اليوم"><select className="input" value={form.violation_day} onChange={e=>setForm({...form,violation_day:e.target.value})}><option value="">اختر</option>{['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'].map(d=><option key={d}>{d}</option>)}</select></F><F l="تاريخ المخالفة"><input type="date" className="input" value={form.violation_date} onChange={e=>setForm({...form,violation_date:e.target.value})}/></F><F l="الوقت"><input type="time" className="input" value={form.violation_time} onChange={e=>setForm({...form,violation_time:e.target.value})}/></F></div><button onClick={create} className="bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold">إنشاء المساءلة ونسخ رابط الموظف</button></div>{message&&<div className="no-print bg-blue-50 border p-3 rounded-xl break-all">{message}</div>}<div className="no-print bg-white border rounded-2xl overflow-hidden"><table className="w-full text-sm"><thead><tr className="bg-gray-50"><th className="p-3 text-right">الموظف</th><th className="p-3 text-right">الحالة</th><th className="p-3 text-right">الإجراء</th></tr></thead><tbody>{items.map(i=><tr key={i.id} className="border-t"><td className="p-3">{i.form_payload?.employee?.full_name||'—'}</td><td className="p-3">{labels[workflow(i)]||workflow(i)}</td><td className="p-3"><button onClick={()=>setSelected(i)} className="text-green-700 font-bold ml-3">فتح</button>{workflow(i)==='sent_to_employee'&&<button onClick={()=>navigator.clipboard.writeText(employeeUrl(i.transaction_id))} className="text-blue-700 font-bold">نسخ الرابط</button>}</td></tr>)}</tbody></table></div>{selected&&<div className="space-y-4"><div className="no-print flex justify-between"><button onClick={()=>window.print()} className="bg-gray-800 text-white px-4 py-2 rounded">طباعة / PDF</button><button onClick={()=>setSelected(null)} className="border px-4 py-2 rounded">إغلاق</button></div><OfficialForm payload={selected.form_payload||{}} mode={workflow(selected)==='pending_manager_decision'?'manager':'locked'} employeeText="" setEmployeeText={()=>{}} setEmployeeSign={()=>{}} manager={manager} setManager={setManager}/>{workflow(selected)==='pending_manager_decision'&&<button onClick={approve} className="no-print w-full bg-green-700 text-white py-3 rounded-xl font-bold">اعتماد قرار المدير والتوقيع</button>}</div>}<style>{`.input{width:100%;border:1px solid #d1d5db;border-radius:.6rem;padding:.65rem}.input:focus{outline:2px solid #86efac}`}</style></div>
}

const F=({l,children})=><label><span className="block text-xs font-bold mb-1">{l}</span>{children}</label>
const th={fontWeight:700,background:'#f0f7f0',border:'1px solid #999',padding:'4px 6px'}
const td={border:'1px solid #999',padding:'4px 6px'}
