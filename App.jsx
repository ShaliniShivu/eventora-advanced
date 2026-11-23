import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard, CalendarDays, Ticket, Users, ChartNoAxesCombined, Settings,
  Search, Plus, Bell, ChevronDown, ArrowUpRight, ArrowDownRight, MoreHorizontal,
  MapPin, Clock3, Download, Filter, X, Menu, Check, Trash2, Pencil, Eye,
  CalendarCheck, CircleDollarSign, TrendingUp, Sparkles, Mail, Phone, SlidersHorizontal
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const initialEvents = [
  {id:101,title:'The Grand Wedding Showcase',type:'Wedding',date:'2026-12-12',time:'18:00',venue:'The Leela Palace, Bengaluru',status:'Published',capacity:350,registered:286,revenue:858000,price:3000,description:'An immersive wedding showcase featuring destination décor, curated vendors and live experiences.'},
  {id:102,title:'Future Forward Summit',type:'Conference',date:'2026-12-18',time:'09:30',venue:'Bangalore International Centre',status:'Published',capacity:500,registered:342,revenue:684000,price:2000,description:'A full-day gathering for founders, technology leaders and creative thinkers.'},
  {id:103,title:'Midnight in Bloom',type:'Music',date:'2026-12-22',time:'20:00',venue:'Palace Grounds, Bengaluru',status:'Draft',capacity:800,registered:0,revenue:0,price:1500,description:'An atmospheric live music experience with emerging artists and immersive production.'},
  {id:104,title:'Creative Minds Workshop',type:'Workshop',date:'2027-01-08',time:'10:00',venue:'The Courtyard, Bengaluru',status:'Published',capacity:120,registered:94,revenue:94000,price:1000,description:'Hands-on sessions on design thinking, storytelling and creative collaboration.'},
  {id:105,title:'Founders & Friends Mixer',type:'Networking',date:'2027-01-15',time:'18:30',venue:'Social, Indiranagar',status:'Completed',capacity:160,registered:152,revenue:76000,price:500,description:'An informal evening connecting startup founders, investors and builders.'},
  {id:106,title:'Little Stars Carnival',type:'Festival',date:'2027-01-24',time:'11:00',venue:'Lalbagh Event Lawn, Bengaluru',status:'Published',capacity:600,registered:418,revenue:209000,price:500,description:'A family-friendly carnival with games, food stalls and creative activities.'}
]
const chartData = [
  {month:'Jun',registrations:180,revenue:42},{month:'Jul',registrations:230,revenue:56},
  {month:'Aug',registrations:205,revenue:51},{month:'Sep',registrations:310,revenue:72},
  {month:'Oct',registrations:285,revenue:68},{month:'Nov',registrations:390,revenue:94},
  {month:'Dec',registrations:460,revenue:112}
]
const initialAttendees = [
  {id:1,name:'Aarav Mehta',email:'aarav@example.com',event:'The Grand Wedding Showcase',ticket:'VIP',status:'Confirmed'},
  {id:2,name:'Diya Rao',email:'diya@example.com',event:'Future Forward Summit',ticket:'Standard',status:'Confirmed'},
  {id:3,name:'Kabir Nair',email:'kabir@example.com',event:'Creative Minds Workshop',ticket:'Early bird',status:'Pending'},
  {id:4,name:'Ananya Shetty',email:'ananya@example.com',event:'Little Stars Carnival',ticket:'Family',status:'Confirmed'}
]
const money = n => '₹' + Number(n || 0).toLocaleString('en-IN')
const dateLabel = d => new Date(d+'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }

function App() {
  const [events,setEvents] = useState(()=>load('eventora_advanced_events',initialEvents))
  const [attendees,setAttendees] = useState(()=>load('eventora_advanced_attendees',initialAttendees))
  const [page,setPage] = useState('Overview')
  const [query,setQuery] = useState('')
  const [statusFilter,setStatusFilter] = useState('All')
  const [modal,setModal] = useState('')
  const [editing,setEditing] = useState(null)
  const [selected,setSelected] = useState(null)
  const [mobileNav,setMobileNav] = useState(false)
  const [toast,setToast] = useState('')
  const [eventForm,setEventForm] = useState({title:'',type:'Conference',date:'',time:'10:00',venue:'',capacity:'',price:'',description:''})
  const [attendeeForm,setAttendeeForm] = useState({name:'',email:'',event:'',ticket:'Standard'})
  useEffect(()=>{localStorage.setItem('eventora_advanced_events',JSON.stringify(events))},[events])
  useEffect(()=>{localStorage.setItem('eventora_advanced_attendees',JSON.stringify(attendees))},[attendees])
  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(''),2600);return()=>clearTimeout(t)}},[toast])

  const filteredEvents = useMemo(()=>events.filter(e=>{
    const matches = `${e.title} ${e.type} ${e.venue}`.toLowerCase().includes(query.toLowerCase())
    return matches && (statusFilter==='All' || e.status===statusFilter)
  }),[events,query,statusFilter])
  const totalReg = events.reduce((s,e)=>s+Number(e.registered),0)
  const totalRevenue = events.reduce((s,e)=>s+Number(e.revenue),0)
  const published = events.filter(e=>e.status==='Published').length
  const occupancy = events.reduce((s,e)=>s+(e.capacity ? e.registered/e.capacity : 0),0) / Math.max(events.length,1) * 100

  function openCreate(){setEditing(null);setEventForm({title:'',type:'Conference',date:'',time:'10:00',venue:'',capacity:'',price:'',description:''});setModal('event')}
  function openEdit(event){setEditing(event);setEventForm({...event});setModal('event')}
  function saveEvent(e){
    e.preventDefault()
    const item={...eventForm,id:editing?.id ?? Date.now(),capacity:Number(eventForm.capacity),price:Number(eventForm.price),registered:editing?.registered ?? 0,revenue:editing?.revenue ?? 0,status:editing?.status ?? 'Draft'}
    setEvents(prev=>editing?prev.map(x=>x.id===editing.id?item:x):[item,...prev])
    setModal('');setToast(editing?'Event updated successfully':'New event created as draft')
  }
  function deleteEvent(id){if(confirm('Delete this event? This cannot be undone.')){setEvents(prev=>prev.filter(e=>e.id!==id));setToast('Event deleted')}}
  function saveAttendee(e){
    e.preventDefault();setAttendees(prev=>[{...attendeeForm,id:Date.now(),status:'Confirmed'},...prev])
    setEvents(prev=>prev.map(ev=>ev.title===attendeeForm.event?{...ev,registered:ev.registered+1,revenue:ev.revenue+ev.price}:ev))
    setModal('');setToast('Attendee registered successfully')
  }
  function exportCSV(){
    const rows=[['Name','Email','Event','Ticket','Status'],...attendees.map(a=>[a.name,a.email,a.event,a.ticket,a.status])]
    const csv=rows.map(r=>r.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\\n')
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}))
    const a=document.createElement('a');a.href=url;a.download='eventora-attendees.csv';a.click();URL.revokeObjectURL(url)
    setToast('Attendee CSV exported')
  }

  const nav=[['Overview',LayoutDashboard],['Events',CalendarDays],['Attendees',Users],['Analytics',ChartNoAxesCombined]]
  return <div className="layout">
    <aside className={`sidebar ${mobileNav?'sidebar-open':''}`}>
      <a className="logo" href="#" onClick={()=>setPage('Overview')}><span className="logo-icon"><Sparkles size={18}/></span>eventora<span>.</span></a>
      <div className="workspace"><div className="workspace-avatar">E</div><div><b>Eventora Studio</b><small>Workspace</small></div><ChevronDown size={15}/></div>
      <small className="nav-caption">WORKSPACE</small>
      <nav>{nav.map(([name,Icon])=><button key={name} className={page===name?'nav-item selected':'nav-item'} onClick={()=>{setPage(name);setMobileNav(false)}}><Icon size={17}/>{name}{name==='Events'&&<span className="nav-count">{events.length}</span>}</button>)}</nav>
      <small className="nav-caption tools-caption">MANAGE</small>
      <button className="nav-item" onClick={()=>{setModal('attendee');setMobileNav(false)}}><Ticket size={17}/>Add registration</button>
      <button className="nav-item" onClick={()=>setToast('Settings are available in the full product version')}><Settings size={17}/>Settings</button>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-spark"><Sparkles size={16}/></div><b>Need a hand?</b><p>Make your next event run smoothly.</p><button onClick={()=>setToast('Support: hello@eventora.example')}>Contact support <ArrowUpRight size={13}/></button></div><div className="profile"><div className="profile-avatar">SS</div><div><b>Studio Admin</b><small>Administrator</small></div><MoreHorizontal size={18}/></div></div>
    </aside>

    <main className="main">
      <header className="topbar"><button className="hamburger" onClick={()=>setMobileNav(!mobileNav)}><Menu/></button><div className="breadcrumbs">Workspace <span>/</span> <b>{page}</b></div><div className="top-actions"><div className="top-date"><CalendarDays size={15}/>{new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div><button className="icon-btn" onClick={()=>setToast('You are all caught up')} aria-label="Notifications"><Bell size={18}/><i/></button><div className="top-user">SS</div></div></header>

      {page==='Overview'&&<div className="content">
        <div className="welcome-row"><div><div className="overline">SUNDAY, 22 NOVEMBER 2026</div><h1>Good evening, Shalini <span>✦</span></h1><p>Here's what's happening across your events today.</p></div><button className="primary-btn" onClick={openCreate}><Plus size={17}/> Create event</button></div>
        <div className="metric-grid">
          <Metric title="Total registrations" value={totalReg.toLocaleString('en-IN')} change="+12.8%" up icon={Users} note="vs. previous month"/>
          <Metric title="Total revenue" value={money(totalRevenue)} change="+8.4%" up icon={CircleDollarSign} note="vs. previous month"/>
          <Metric title="Published events" value={published} change="+2 this month" up icon={CalendarCheck} note="Across all categories"/>
          <Metric title="Average occupancy" value={`${occupancy.toFixed(1)}%`} change="-2.1%" icon={TrendingUp} note="Across all events"/>
        </div>
        <div className="dashboard-grid">
          <section className="panel chart-panel"><div className="panel-heading"><div><h2>Performance overview</h2><p>Registration and revenue trends</p></div><select className="period-select"><option>Last 7 months</option><option>Last 30 days</option><option>This year</option></select></div><div className="chart-legend"><span><i className="legend-blue"/> Registrations</span><span><i className="legend-gold"/> Revenue (₹K)</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:10,right:8,left:-20,bottom:0}}><defs><linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6688d8" stopOpacity={.22}/><stop offset="100%" stopColor="#6688d8" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#edf0f4" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#8b95a3',fontSize:11}}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#8b95a3',fontSize:10}}/><Tooltip/><Area type="monotone" dataKey="registrations" stroke="#6688d8" strokeWidth={2.5} fill="url(#blueFill)"/><Area type="monotone" dataKey="revenue" stroke="#d2a45d" strokeWidth={2.5} fill="none"/></AreaChart></ResponsiveContainer></div></section>
          <section className="panel upcoming-panel"><div className="panel-heading"><div><h2>Upcoming events</h2><p>Your next events at a glance</p></div><button className="link-btn" onClick={()=>setPage('Events')}>View all <ArrowUpRight size={14}/></button></div><div className="upcoming-list">{events.filter(e=>e.status!=='Completed').sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4).map(e=><div className="upcoming-item" key={e.id}><div className="date-tile"><b>{new Date(e.date+'T00:00:00').getDate()}</b><small>{new Date(e.date+'T00:00:00').toLocaleDateString('en-IN',{month:'short'})}</small></div><div className="upcoming-detail"><b>{e.title}</b><small><MapPin size={12}/>{e.venue}</small></div><span className={`status ${e.status.toLowerCase()}`}>{e.status}</span></div>)}</div></section>
        </div>
        <section className="panel table-panel"><div className="panel-heading"><div><h2>Recent events</h2><p>Monitor registration and event status</p></div><button className="link-btn" onClick={()=>setPage('Events')}>Manage events <ArrowUpRight size={14}/></button></div><EventTable events={events.slice(0,5)} onView={setSelected} onEdit={openEdit} onDelete={deleteEvent}/></section>
      </div>}

      {page==='Events'&&<div className="content"><div className="page-title-row"><div><div className="overline">EVENT MANAGEMENT</div><h1>All events</h1><p>Create, organise and track your event portfolio.</p></div><button className="primary-btn" onClick={openCreate}><Plus size={17}/> Create event</button></div><div className="panel event-list-panel"><div className="toolbar"><label className="search-input"><Search size={16}/><input placeholder="Search events, venues..." value={query} onChange={e=>setQuery(e.target.value)}/></label><label className="filter-select"><Filter size={15}/><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>All</option><option>Published</option><option>Draft</option><option>Completed</option></select></label><span className="result-count">{filteredEvents.length} events</span></div><EventTable events={filteredEvents} onView={setSelected} onEdit={openEdit} onDelete={deleteEvent}/></div></div>}

      {page==='Attendees'&&<div className="content"><div className="page-title-row"><div><div className="overline">AUDIENCE MANAGEMENT</div><h1>Attendees</h1><p>Manage registrations and keep your guest list organised.</p></div><div className="action-group"><button className="secondary-btn" onClick={exportCSV}><Download size={16}/> Export CSV</button><button className="primary-btn" onClick={()=>setModal('attendee')}><Plus size={17}/> Add attendee</button></div></div><div className="metric-grid compact"><Metric title="Total attendees" value={attendees.length} icon={Users} note="All registrations"/><Metric title="Confirmed" value={attendees.filter(a=>a.status==='Confirmed').length} icon={Check} note="Confirmed guests"/><Metric title="Pending" value={attendees.filter(a=>a.status==='Pending').length} icon={Clock3} note="Awaiting confirmation"/><Metric title="Events represented" value={new Set(attendees.map(a=>a.event)).size} icon={CalendarDays} note="Unique events"/></div><div className="panel table-panel"><div className="panel-heading"><div><h2>Guest directory</h2><p>Latest attendee registrations</p></div><button className="secondary-btn small-btn" onClick={exportCSV}><Download size={14}/> Download list</button></div><div className="table-scroll"><table><thead><tr><th>ATTENDEE</th><th>EVENT</th><th>TICKET TYPE</th><th>STATUS</th></tr></thead><tbody>{attendees.map(a=><tr key={a.id}><td><b>{a.name}</b><small className="sub-cell">{a.email}</small></td><td>{a.event}</td><td>{a.ticket}</td><td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td></tr>)}</tbody></table>{attendees.length===0&&<div className="no-data">No attendees yet. Add your first registration.</div>}</div></div></div>}

      {page==='Analytics'&&<div className="content"><div className="page-title-row"><div><div className="overline">INSIGHTS & REPORTS</div><h1>Analytics</h1><p>Understand event performance and make informed decisions.</p></div><button className="secondary-btn" onClick={exportCSV}><Download size={16}/> Export attendees</button></div><div className="metric-grid"><Metric title="Gross revenue" value={money(totalRevenue)} icon={CircleDollarSign} note="All tracked events"/><Metric title="Registrations" value={totalReg.toLocaleString('en-IN')} icon={Users} note="Total registrations"/><Metric title="Avg. ticket price" value={money(totalReg?totalRevenue/totalReg:0)} icon={Ticket} note="Revenue per registration"/><Metric title="Capacity used" value={`${occupancy.toFixed(1)}%`} icon={TrendingUp} note="Average occupancy"/></div><div className="dashboard-grid analytics-grid"><section className="panel chart-panel"><div className="panel-heading"><div><h2>Registration growth</h2><p>Monthly registration volume</p></div></div><div className="chart-wrap tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid stroke="#edf0f4" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="registrations" fill="#718bd0" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></section><section className="panel category-panel"><div className="panel-heading"><div><h2>Event portfolio</h2><p>Events by category</p></div></div>{['Wedding','Conference','Music','Workshop','Networking','Festival'].map(type=>{const n=events.filter(e=>e.type===type).length;return <div className="category-stat" key={type}><div><span>{type}</span><b>{n}</b></div><div className="progress"><i style={{width:`${events.length?n/events.length*100:0}%`}}/></div></div>})}</section></div></div>}
    </main>

    {mobileNav&&<div className="mobile-scrim" onClick={()=>setMobileNav(false)}/>}
    {modal==='event'&&<div className="overlay" onClick={()=>setModal('')}><div className="dialog" onClick={e=>e.stopPropagation()}><div className="dialog-head"><div><span className="overline">{editing?'UPDATE EVENT':'EVENT SETUP'}</span><h2>{editing?'Edit event':'Create an event'}</h2><p>Fill in the details to {editing?'update':'add'} your event.</p></div><button className="close-btn" onClick={()=>setModal('')}><X/></button></div><form className="form-grid" onSubmit={saveEvent}><label className="wide">Event name<input required value={eventForm.title} onChange={e=>setEventForm({...eventForm,title:e.target.value})} placeholder="e.g. Annual Creative Summit"/></label><label>Category<select value={eventForm.type} onChange={e=>setEventForm({...eventForm,type:e.target.value})}>{['Wedding','Conference','Music','Workshop','Networking','Festival','Corporate','Birthday'].map(x=><option key={x}>{x}</option>)}</select></label><label>Venue<input required value={eventForm.venue} onChange={e=>setEventForm({...eventForm,venue:e.target.value})} placeholder="Venue and city"/></label><label>Date<input type="date" required min={new Date().toISOString().slice(0,10)} value={eventForm.date} onChange={e=>setEventForm({...eventForm,date:e.target.value})}/></label><label>Time<input type="time" required value={eventForm.time} onChange={e=>setEventForm({...eventForm,time:e.target.value})}/></label><label>Capacity<input type="number" required min="1" value={eventForm.capacity} onChange={e=>setEventForm({...eventForm,capacity:e.target.value})} placeholder="Maximum guests"/></label><label>Ticket price (₹)<input type="number" required min="0" value={eventForm.price} onChange={e=>setEventForm({...eventForm,price:e.target.value})} placeholder="0"/></label><label className="wide">Description<textarea rows="3" value={eventForm.description} onChange={e=>setEventForm({...eventForm,description:e.target.value})} placeholder="Describe your event..."/></label><div className="form-actions wide"><button type="button" className="secondary-btn" onClick={()=>setModal('')}>Cancel</button><button type="submit" className="primary-btn"><Check size={16}/>{editing?'Save changes':'Create event'}</button></div></form></div></div>}
    {modal==='attendee'&&<div className="overlay" onClick={()=>setModal('')}><div className="dialog narrow" onClick={e=>e.stopPropagation()}><div className="dialog-head"><div><span className="overline">GUEST MANAGEMENT</span><h2>Add attendee</h2><p>Register a guest for an event.</p></div><button className="close-btn" onClick={()=>setModal('')}><X/></button></div><form className="form-grid one-col" onSubmit={saveAttendee}><label>Full name<input required value={attendeeForm.name} onChange={e=>setAttendeeForm({...attendeeForm,name:e.target.value})} placeholder="Guest name"/></label><label>Email address<input required type="email" value={attendeeForm.email} onChange={e=>setAttendeeForm({...attendeeForm,email:e.target.value})} placeholder="guest@email.com"/></label><label>Event<select required value={attendeeForm.event} onChange={e=>setAttendeeForm({...attendeeForm,event:e.target.value})}><option value="">Select an event</option>{events.map(e=><option key={e.id}>{e.title}</option>)}</select></label><label>Ticket type<select value={attendeeForm.ticket} onChange={e=>setAttendeeForm({...attendeeForm,ticket:e.target.value})}>{['Standard','VIP','Early bird','Family'].map(x=><option key={x}>{x}</option>)}</select></label><div className="form-actions"><button type="button" className="secondary-btn" onClick={()=>setModal('')}>Cancel</button><button className="primary-btn"><Check size={16}/> Save attendee</button></div></form></div></div>}
    {selected&&<div className="overlay" onClick={()=>setSelected(null)}><div className="dialog narrow" onClick={e=>e.stopPropagation()}><div className="dialog-head"><div><span className="overline">{selected.type} · EVENT DETAILS</span><h2>{selected.title}</h2></div><button className="close-btn" onClick={()=>setSelected(null)}><X/></button></div><div className="detail-content"><p>{selected.description||'No description provided.'}</p><div className="detail-line"><CalendarDays/> {dateLabel(selected.date)} · {selected.time}</div><div className="detail-line"><MapPin/> {selected.venue}</div><div className="detail-line"><Users/> {selected.registered} / {selected.capacity} registered</div><div className="detail-line"><CircleDollarSign/> {money(selected.revenue)} revenue</div><div className="detail-footer"><span className={`status ${selected.status.toLowerCase()}`}>{selected.status}</span><button className="primary-btn" onClick={()=>{setSelected(null);openEdit(selected)}}><Pencil size={15}/> Edit event</button></div></div></div></div>}
    {toast&&<div className="toast"><Check size={16}/>{toast}</div>}
  </div>
}

function Metric({title,value,change,up,icon:Icon,note}){return <div className="metric-card"><div className="metric-top"><span>{title}</span><span className="metric-icon"><Icon size={17}/></span></div><div className="metric-value">{value}</div><div className="metric-foot">{change&&<span className={up?'positive':'negative'}>{up?<ArrowUpRight size={13}/>:<ArrowDownRight size={13}/>} {change}</span>}<small>{note}</small></div></div>}
function EventTable({events,onView,onEdit,onDelete}){return <div className="table-scroll"><table><thead><tr><th>EVENT</th><th>DATE & VENUE</th><th>REGISTRATIONS</th><th>REVENUE</th><th>STATUS</th><th></th></tr></thead><tbody>{events.map(e=><tr key={e.id}><td><b>{e.title}</b><small className="sub-cell">{e.type}</small></td><td>{dateLabel(e.date)}<small className="sub-cell"><MapPin size={11}/>{e.venue}</small></td><td><div className="registration-cell"><span>{e.registered} / {e.capacity}</span><div className="mini-progress"><i style={{width:`${Math.min(100,e.capacity?e.registered/e.capacity*100:0)}%`}}/></div></div></td><td><b>{money(e.revenue)}</b></td><td><span className={`status ${e.status.toLowerCase()}`}>{e.status}</span></td><td><div className="row-actions"><button title="View" onClick={()=>onView(e)}><Eye size={15}/></button><button title="Edit" onClick={()=>onEdit(e)}><Pencil size={15}/></button><button title="Delete" onClick={()=>onDelete(e.id)}><Trash2 size={15}/></button></div></td></tr>)}</tbody></table>{events.length===0&&<div className="no-data">No events match your filters.</div>}</div>}
export default App
