import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────
// THEME / DESIGN TOKENS
// ─────────────────────────────────────────────
const C = {
  cream: '#FDF6F0', blush: '#F5E6DD', roseGold: '#C9956C', roseLight: '#E8C4A8',
  mauve: '#8B4C70', plum: '#5C2D4A', noir: '#1E1018', dark: '#2D1B1B',
  gray: '#9A8A88', grayLight: '#C8B8B5', border: '#EAD9CE', white: '#FFFFFF',
  success: '#6B9E7A', successBg: '#EDF6F0', warning: '#D4956A', warningBg: '#FDF2EA',
  error: '#C4616B', errorBg: '#FDF0F1', infoBg: '#EEF0FA',
};

const S = {
  // layout
  appLayout: { display:'flex', minHeight:'100vh' },
  mainContent: (collapsed) => ({ flex:1, marginLeft: collapsed ? 72 : 260, minHeight:'100vh', display:'flex', flexDirection:'column', transition:'margin-left .3s ease' }),
  pageWrapper: { padding:'2rem 2.5rem', flex:1, animation:'fadeIn .3s ease' },
  // sidebar
  sidebar: (collapsed) => ({ position:'fixed', top:0, left:0, height:'100vh', width: collapsed ? 72 : 260, background: C.noir, display:'flex', flexDirection:'column', zIndex:100, overflow:'hidden', transition:'width .3s ease' }),
  sidebarLogo: { padding:'1.25rem', borderBottom:`1px solid rgba(255,255,255,.07)`, display:'flex', alignItems:'center', gap:12, minHeight:64 },
  logoMark: { width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${C.roseGold},${C.mauve})`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garamond,serif', fontSize:'1.1rem', color:'white', fontWeight:600, flexShrink:0 },
  sidebarNav: { flex:1, padding:'1.25rem .75rem', overflowY:'auto', overflowX:'hidden' },
  navLabel: { fontSize:'.65rem', textTransform:'uppercase', letterSpacing:'.1em', color:'rgba(255,255,255,.25)', padding:'0 .5rem', margin:'1rem 0 .5rem' },
  navItem: (active) => ({ display:'flex', alignItems:'center', gap:12, padding:'.7rem .75rem', borderRadius:8, color: active ? C.roseGold : 'rgba(255,255,255,.55)', fontSize:'.875rem', cursor:'pointer', background: active ? 'rgba(201,149,108,.18)' : 'transparent', marginBottom:2, border:'none', width:'100%', fontFamily:'DM Sans,sans-serif', borderLeft: active ? `3px solid ${C.roseGold}` : '3px solid transparent', transition:'all .18s' }),
  sidebarFooter: { padding:'1rem .75rem', borderTop:'1px solid rgba(255,255,255,.07)' },
  // topbar
  topbar: { height:64, background:C.white, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2rem 0 1.5rem', position:'sticky', top:0, zIndex:50 },
  // card
  card: { background:C.white, borderRadius:12, boxShadow:'0 2px 8px rgba(30,17,24,.07)', padding:'1.5rem', border:`1px solid ${C.border}` },
  // kpi
  kpiGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1.25rem', marginBottom:'2rem' },
  kpiCard: { background:C.white, borderRadius:12, padding:'1.5rem', border:`1px solid ${C.border}`, boxShadow:'0 1px 3px rgba(30,17,24,.05)', position:'relative', overflow:'hidden' },
  kpiIcon: (bg,color) => ({ width:44, height:44, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.25rem', marginBottom:'1rem', background:bg, color }),
  // buttons
  btnPrimary: { display:'inline-flex', alignItems:'center', gap:8, padding:'.6rem 1.25rem', borderRadius:8, fontSize:'.875rem', fontWeight:500, background:C.mauve, color:C.white, border:'none', cursor:'pointer', fontFamily:'DM Sans,sans-serif', boxShadow:'0 2px 8px rgba(139,76,112,.3)', transition:'all .18s', whiteSpace:'nowrap' },
  btnSecondary: { display:'inline-flex', alignItems:'center', gap:8, padding:'.6rem 1.25rem', borderRadius:8, fontSize:'.875rem', fontWeight:500, background:C.blush, color:C.dark, border:`1px solid ${C.border}`, cursor:'pointer', fontFamily:'DM Sans,sans-serif', transition:'all .18s', whiteSpace:'nowrap' },
  btnGhost: { display:'inline-flex', alignItems:'center', gap:6, padding:'.4rem .6rem', borderRadius:8, fontSize:'.875rem', background:'transparent', color:C.gray, border:'none', cursor:'pointer', fontFamily:'DM Sans,sans-serif', transition:'all .18s' },
  btnDanger: { display:'inline-flex', alignItems:'center', gap:8, padding:'.6rem 1.25rem', borderRadius:8, fontSize:'.875rem', fontWeight:500, background:C.errorBg, color:C.error, border:'none', cursor:'pointer', fontFamily:'DM Sans,sans-serif', transition:'all .18s' },
  btnSm: { padding:'.38rem .85rem', fontSize:'.8rem' },
  // form
  formLabel: { display:'block', fontSize:'.78rem', fontWeight:500, color:C.gray, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:5 },
  formInput: { width:'100%', padding:'.65rem .9rem', border:`1.5px solid ${C.border}`, borderRadius:8, fontSize:'.9rem', color:C.dark, background:C.white, outline:'none', fontFamily:'DM Sans,sans-serif' },
  formRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' },
  // table
  tableWrapper: { overflowX:'auto', borderRadius:12, border:`1px solid ${C.border}` },
  th: { padding:'.85rem 1rem', textAlign:'left', fontSize:'.72rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', color:C.gray, whiteSpace:'nowrap', background:C.blush },
  td: { padding:'.9rem 1rem', fontSize:'.875rem', borderBottom:`1px solid ${C.border}`, verticalAlign:'middle' },
  // badge
  badge: (bg,color) => ({ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:100, fontSize:'.73rem', fontWeight:500, background:bg, color }),
  // modal
  overlay: { position:'fixed', inset:0, background:'rgba(30,16,24,.45)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem', animation:'fadeIn .2s ease' },
  modal: { background:C.white, borderRadius:20, padding:'2rem', width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 12px 40px rgba(30,17,24,.13)', animation:'slideUp .25s ease' },
  modalLg: { maxWidth: 700 },
  modalHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem', paddingBottom:'1rem', borderBottom:`1px solid ${C.border}` },
  modalFooter: { display:'flex', justifyContent:'flex-end', gap:'.75rem', marginTop:'1.75rem', paddingTop:'1.25rem', borderTop:`1px solid ${C.border}` },
  // avatar
  avatar: (size=36) => ({ width:size, height:size, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garamond,serif', fontSize: size < 34 ? '.75rem' : '.9rem', fontWeight:600, flexShrink:0, background:`linear-gradient(135deg,${C.roseLight},${C.mauve})`, color:'white' }),
  // misc
  serviceCard: { background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:'1.25rem', position:'relative', overflow:'hidden', transition:'box-shadow .18s,transform .18s' },
};

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const fmt = (d) => d.toISOString().split('T')[0];
const addD = (d,n) => { const r=new Date(d); r.setDate(r.getDate()+n); return r; };
const TODAY = new Date();

const MOCK_SERVICES = [
  { id:1, name:'Soin du visage hydratant', duration:60, price:85, category:'Visage', color:C.roseGold },
  { id:2, name:'Manucure semi-permanente', duration:60, price:50, category:'Ongles', color:C.mauve },
  { id:3, name:'Pédicure spa', duration:75, price:60, category:'Ongles', color:C.mauve },
  { id:4, name:'Épilation sourcils', duration:20, price:15, category:'Épilation', color:C.success },
  { id:5, name:'Épilation jambes complètes', duration:45, price:40, category:'Épilation', color:C.success },
  { id:6, name:'Massage relaxant corps', duration:60, price:75, category:'Corps', color:C.warning },
  { id:7, name:'Maquillage mariée / événement', duration:90, price:130, category:'Maquillage', color:C.error },
  { id:8, name:'Coloration + soin', duration:120, price:95, category:'Cheveux', color:C.plum },
  { id:9, name:'Brushing', duration:45, price:35, category:'Cheveux', color:C.plum },
];

const MOCK_CLIENTS = [
  { id:1, firstName:'Yasmine', lastName:'Ben Ali', phone:'+216 22 345 678', email:'yasmine.benali@email.com', birthDate:'1990-03-15', notes:'Allergie au latex. Préfère les produits naturels.', totalSpent:420, visits:6, createdAt:'2024-01-10' },
  { id:2, firstName:'Sana', lastName:'Trabelsi', phone:'+216 55 234 567', email:'sana.t@email.com', birthDate:'1985-07-22', notes:'', totalSpent:275, visits:4, createdAt:'2024-02-05' },
  { id:3, firstName:'Rim', lastName:'Hamdi', phone:'+216 98 765 432', email:'rim.hamdi@email.com', birthDate:'1995-11-08', notes:'Préfère les rendez-vous le matin.', totalSpent:560, visits:8, createdAt:'2023-11-20' },
  { id:4, firstName:'Ines', lastName:'Chaabane', phone:'+216 25 678 901', email:'ines.ch@email.com', birthDate:'1992-04-30', notes:'', totalSpent:185, visits:3, createdAt:'2024-03-01' },
  { id:5, firstName:'Nadia', lastName:'Khelifi', phone:'+216 44 321 098', email:'nadia.k@email.com', birthDate:'1988-09-14', notes:'Cliente VIP — offrir une réduction de fidélité.', totalSpent:890, visits:12, createdAt:'2023-06-15' },
  { id:6, firstName:'Amira', lastName:'Mansouri', phone:'+216 52 987 654', email:'amira.m@email.com', birthDate:'1998-01-25', notes:'', totalSpent:145, visits:2, createdAt:'2024-04-10' },
];

const MOCK_APPOINTMENTS = [
  { id:1, clientId:1, serviceId:1, date:fmt(TODAY), time:'09:00', status:'confirmed', notes:'', price:85 },
  { id:2, clientId:3, serviceId:7, date:fmt(TODAY), time:'10:30', status:'confirmed', notes:'Mariage — tenue dorée.', price:130 },
  { id:3, clientId:5, serviceId:6, date:fmt(TODAY), time:'14:00', status:'scheduled', notes:'', price:75 },
  { id:4, clientId:2, serviceId:2, date:fmt(addD(TODAY,1)), time:'11:00', status:'scheduled', notes:'', price:50 },
  { id:5, clientId:4, serviceId:5, date:fmt(addD(TODAY,1)), time:'15:30', status:'scheduled', notes:'', price:40 },
  { id:6, clientId:1, serviceId:3, date:fmt(addD(TODAY,-1)), time:'10:00', status:'completed', notes:'', price:60 },
  { id:7, clientId:3, serviceId:4, date:fmt(addD(TODAY,-2)), time:'09:30', status:'completed', notes:'', price:15 },
  { id:8, clientId:5, serviceId:8, date:fmt(addD(TODAY,-3)), time:'13:00', status:'completed', notes:'', price:95 },
  { id:9, clientId:2, serviceId:9, date:fmt(addD(TODAY,-5)), time:'11:00', status:'completed', notes:'', price:35 },
  { id:10, clientId:4, serviceId:1, date:fmt(addD(TODAY,-6)), time:'14:00', status:'cancelled', notes:'Annulé — indisponible.', price:85 },
];

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────
const AppCtx = createContext(null);

function AppProvider({ children }) {
  const ls = (key, fallback) => { try { const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; } catch { return fallback; } };

  const [user, setUser] = useState(() => ls('lf_user', null));
  const [clients, setClients] = useState(() => ls('lf_clients', MOCK_CLIENTS));
  const [appointments, setAppointments] = useState(() => ls('lf_appointments', MOCK_APPOINTMENTS));
  const [services, setServices] = useState(() => ls('lf_services', MOCK_SERVICES));
  const [page, setPage] = useState('dashboard');

  useEffect(() => { localStorage.setItem('lf_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('lf_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('lf_services', JSON.stringify(services)); }, [services]);

  const login = (email, pass) => {
    if (email === 'admin@lafinesse.tn' && pass === 'finesse2024') {
      const u = { name:'Nourhen', email, role:'admin' };
      setUser(u); localStorage.setItem('lf_user', JSON.stringify(u));
      return { ok:true };
    }
    return { ok:false, error:'Email ou mot de passe incorrect.' };
  };
  const logout = () => { setUser(null); localStorage.removeItem('lf_user'); setPage('dashboard'); };

  const addClient    = (d) => { const c={...d,id:Date.now(),totalSpent:0,visits:0,createdAt:fmt(TODAY)}; setClients(p=>[c,...p]); return c; };
  const updateClient = (id,d) => setClients(p=>p.map(c=>c.id===id?{...c,...d}:c));
  const deleteClient = (id) => setClients(p=>p.filter(c=>c.id!==id));
  const getClient    = (id) => clients.find(c=>c.id===id);

  const addAppointment = (d) => {
    const svc=services.find(s=>s.id===Number(d.serviceId));
    const apt={...d,id:Date.now(),status:'scheduled',price:svc?.price||0,serviceId:Number(d.serviceId),clientId:Number(d.clientId)};
    setAppointments(p=>[apt,...p]);
    setClients(p=>p.map(c=>c.id===Number(d.clientId)?{...c,visits:c.visits+1}:c));
  };
  const updateAppointment = (id,d) => {
    setAppointments(p=>p.map(a=>a.id===id?{...a,...d}:a));
    if (d.status==='completed') {
      const apt=appointments.find(a=>a.id===id);
      if(apt) setClients(p=>p.map(c=>c.id===apt.clientId?{...c,totalSpent:c.totalSpent+apt.price}:c));
    }
  };
  const deleteAppointment = (id) => setAppointments(p=>p.filter(a=>a.id!==id));

  const addService    = (d) => setServices(p=>[...p,{...d,id:Date.now(),price:Number(d.price),duration:Number(d.duration)}]);
  const updateService = (id,d) => setServices(p=>p.map(s=>s.id===id?{...s,...d,price:Number(d.price),duration:Number(d.duration)}:s));
  const deleteService = (id) => setServices(p=>p.filter(s=>s.id!==id));
  const getService    = (id) => services.find(s=>s.id===id);

  return (
    <AppCtx.Provider value={{ user,login,logout,page,setPage,clients,addClient,updateClient,deleteClient,getClient,appointments,addAppointment,updateAppointment,deleteAppointment,services,addService,updateService,deleteService,getService }}>
      {children}
    </AppCtx.Provider>
  );
}

const useApp = () => useContext(AppCtx);

// ─────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────
function Modal({ open, onClose, title, children, large }) {
  useEffect(() => { document.body.style.overflow = open?'hidden':''; return ()=>{document.body.style.overflow=''}; }, [open]);
  if (!open) return null;
  return (
    <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ ...S.modal, ...(large?S.modalLg:{}) }}>
        {title && (
          <div style={S.modalHeader}>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', fontWeight:500 }}>{title}</h3>
            <button style={{...S.btnGhost, fontSize:'1.4rem', lineHeight:1}} onClick={onClose}>×</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    scheduled: [C.infoBg,'#5566CC','Planifié'],
    confirmed: [C.successBg,C.success,'Confirmé'],
    completed: [C.blush,C.gray,'Terminé'],
    cancelled: [C.errorBg,C.error,'Annulé'],
  };
  const [bg,color,label] = map[status] || [C.blush,C.gray,status];
  return <span style={S.badge(bg,color)}>{label}</span>;
}

function Avatar({ name1, name2, size=36 }) {
  return <div style={S.avatar(size)}>{name1?.[0]}{name2?.[0]}</div>;
}

function FormInput({ label, children, style }) {
  return (
    <div style={{ marginBottom:'1.1rem', ...style }}>
      {label && <label style={S.formLabel}>{label}</label>}
      {children}
    </div>
  );
}

function Input({ label, style, inputStyle, ...props }) {
  return (
    <FormInput label={label} style={style}>
      <input style={{ ...S.formInput, ...inputStyle }} {...props} />
    </FormInput>
  );
}

function Select({ label, options, style, ...props }) {
  return (
    <FormInput label={label} style={style}>
      <select style={{ ...S.formInput, appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239A8A88' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center', paddingRight:'2rem', cursor:'pointer' }} {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </FormInput>
  );
}

function Textarea({ label, ...props }) {
  return (
    <FormInput label={label}>
      <textarea style={{ ...S.formInput, resize:'vertical', minHeight:80 }} {...props} />
    </FormInput>
  );
}

function ConfirmDelete({ open, onClose, onConfirm, name, desc }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirmer la suppression">
      <div style={{ textAlign:'center', padding:'1rem 0' }}>
        <div style={{ width:56,height:56,borderRadius:'50%',background:C.errorBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',margin:'0 auto 1rem' }}>⚠</div>
        <p style={{ marginBottom:8, fontSize:'1rem' }}>Supprimer <strong>{name}</strong> ?</p>
        {desc && <p style={{ fontSize:'.875rem', color:C.gray }}>{desc}</p>}
      </div>
      <div style={S.modalFooter}>
        <button style={S.btnSecondary} onClick={onClose}>Annuler</button>
        <button style={S.btnDanger} onClick={onConfirm}>Supprimer définitivement</button>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────
function LoginPage() {
  const { login, setPage } = useApp();
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    await new Promise(r=>setTimeout(r,500));
    const res = login(form.email, form.password);
    if (!res.ok) setError(res.error);
    setLoading(false);
  };

  const leftBg = { flex:1, background:C.noir, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'3rem', position:'relative', overflow:'hidden' };
  return (
    <div style={{ minHeight:'100vh', display:'flex' }}>
      {/* Left */}
      <div style={leftBg}>
        <div style={{ position:'absolute', width:380, height:380, borderRadius:'50%', background:`radial-gradient(circle,rgba(201,149,108,.13) 0%,transparent 70%)`, top:-80, right:-80 }} />
        <div style={{ position:'absolute', width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle,rgba(139,76,112,.13) 0%,transparent 70%)`, bottom:-60, left:-60 }} />
        <div style={{ textAlign:'center', position:'relative', zIndex:1, animation:'slideUp .4s ease' }}>
          <div style={{ width:72,height:72,borderRadius:20,background:`linear-gradient(135deg,${C.roseGold},${C.mauve})`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond,serif',fontSize:'2rem',color:'white',fontWeight:600,margin:'0 auto 1.5rem',boxShadow:'0 8px 30px rgba(201,149,108,.3)' }}>
            𝓕
          </div>
          <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2.2rem', color:C.white, fontWeight:400 }}>La Finesse</div>
          <div style={{ fontSize:'.75rem', color:C.gray, textTransform:'uppercase', letterSpacing:'.15em', marginTop:4 }}>by Nourhen</div>
          <p style={{ fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', color:'rgba(255,255,255,.35)', marginTop:'2rem', maxWidth:260, lineHeight:1.6, fontSize:'1rem' }}>
            « Chaque cliente mérite un moment de grâce et de beauté absolue. »
          </p>
        </div>
      </div>
      {/* Right */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'3rem' }}>
        <div style={{ width:'100%', maxWidth:400, animation:'slideUp .35s ease' }}>
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem', fontWeight:500, marginBottom:6 }}>Bienvenue 👋</h1>
          <p style={{ fontSize:'.875rem', color:C.gray, marginBottom:'2.5rem' }}>Connectez-vous à votre espace de gestion.</p>
          {error && <div style={{ background:C.errorBg, borderLeft:`3px solid ${C.error}`, padding:'.75rem 1rem', borderRadius:8, fontSize:'.875rem', color:C.error, marginBottom:'1rem' }}>⚠ {error}</div>}
          <form onSubmit={handleSubmit}>
            <Input label="Adresse e-mail" type="email" placeholder="admin@lafinesse.tn" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required autoFocus />
            <Input label="Mot de passe" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required />
            <button type="submit" disabled={loading} style={{ ...S.btnPrimary, width:'100%', justifyContent:'center', padding:'.85rem', fontSize:'.95rem' }}>
              {loading ? 'Connexion…' : 'Se connecter →'}
            </button>
          </form>
          <div style={{ background:C.blush, borderRadius:8, padding:'.75rem 1rem', fontSize:'.78rem', color:C.gray, marginTop:'1.5rem', borderLeft:`3px solid ${C.roseGold}` }}>
            <strong style={{ color:C.dark }}>Démo :</strong> admin@lafinesse.tn / finesse2024
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
function Sidebar({ collapsed, onToggle }) {
  const { page, setPage, user, logout } = useApp();
  const todayStr = fmt(TODAY);
  const { appointments } = useApp();
  const todayCount = appointments.filter(a=>a.date===todayStr&&a.status!=='cancelled').length;

  const navs = [
    { id:'dashboard', icon:'◇', label:'Tableau de bord' },
    { id:'clients', icon:'♀', label:'Clientes' },
    { id:'appointments', icon:'◷', label:'Rendez-vous' },
    { id:'services', icon:'✦', label:'Prestations' },
  ];

  return (
    <aside style={S.sidebar(collapsed)}>
      <div style={S.sidebarLogo}>
        <div style={S.logoMark}>F</div>
        {!collapsed && (
          <div>
            <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.05rem', color:C.white, fontWeight:500, whiteSpace:'nowrap' }}>La Finesse</div>
            <div style={{ fontSize:'.68rem', color:C.gray, textTransform:'uppercase', letterSpacing:'.1em', whiteSpace:'nowrap' }}>by Nourhen</div>
          </div>
        )}
      </div>

      <nav style={S.sidebarNav}>
        {!collapsed && <div style={S.navLabel}>Menu</div>}
        {navs.map(n => (
          <button key={n.id} style={{...S.navItem(page===n.id), justifyContent: collapsed?'center':'flex-start'}} onClick={()=>setPage(n.id)} title={collapsed?n.label:''}>
            <span style={{ fontSize:'1rem', width:20, textAlign:'center', flexShrink:0 }}>{n.icon}</span>
            {!collapsed && <span style={{ whiteSpace:'nowrap' }}>{n.label}</span>}
            {!collapsed && n.id==='appointments' && todayCount>0 && (
              <span style={{ ...S.badge(`rgba(201,149,108,.25)`,C.roseGold), marginLeft:'auto', padding:'1px 7px', fontSize:'.68rem' }}>{todayCount}</span>
            )}
          </button>
        ))}
        <div style={{ height:'1rem' }}/>
        {!collapsed && <div style={S.navLabel}>Admin</div>}
        <button style={{...S.navItem(page==='admin'), justifyContent: collapsed?'center':'flex-start'}} onClick={()=>setPage('admin')} title={collapsed?'Paramètres':''}>
          <span style={{ fontSize:'1rem', width:20, textAlign:'center', flexShrink:0 }}>⚙</span>
          {!collapsed && <span style={{ whiteSpace:'nowrap' }}>Paramètres</span>}
        </button>
      </nav>

      <div style={S.sidebarFooter}>
        {!collapsed && <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.3)', marginBottom:'.6rem', paddingLeft:'.5rem' }}>Connecté : <strong style={{ color:'rgba(255,255,255,.5)' }}>{user?.name}</strong></div>}
        <button style={{...S.navItem(false), justifyContent: collapsed?'center':'flex-start', width:'100%'}} onClick={logout} title={collapsed?'Déconnexion':''}>
          <span style={{ fontSize:'1rem', width:20, textAlign:'center', flexShrink:0 }}>⏻</span>
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────
function Topbar({ collapsed, onToggle }) {
  const { page, user, appointments } = useApp();
  const TITLES = { dashboard:'Tableau de bord', clients:'Clientes', appointments:'Rendez-vous', services:'Prestations', admin:'Paramètres' };
  const todayStr = fmt(TODAY);
  const todayCount = appointments.filter(a=>a.date===todayStr&&a.status!=='cancelled').length;
  const dateLabel = TODAY.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  return (
    <header style={S.topbar}>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
        <button style={{ ...S.btnGhost, fontSize:'1.1rem', padding:'.4rem .55rem' }} onClick={onToggle}>☰</button>
        <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.1rem', color:C.dark }}>{TITLES[page]||''}</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
        <span style={{ fontSize:'.78rem', color:C.gray }}>{dateLabel}</span>
        {todayCount>0 && (
          <div style={{ background:C.blush, borderRadius:100, padding:'4px 12px', fontSize:'.75rem', color:C.mauve, fontWeight:500, display:'flex', alignItems:'center', gap:5 }}>
            ◷ {todayCount} RDV aujourd'hui
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:8, background:C.blush, borderRadius:100, padding:'5px 14px 5px 5px', cursor:'default' }}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${C.roseGold},${C.mauve})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.72rem', color:'white', fontWeight:600 }}>
            {user?.name?.[0]}
          </div>
          <span style={{ fontSize:'.82rem', fontWeight:500 }}>{user?.name}</span>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────
function Dashboard() {
  const { clients, appointments, services, setPage, user } = useApp();
  const todayStr = fmt(TODAY);
  const nowDate = TODAY;
  const monthStr = `${nowDate.getFullYear()}-${String(nowDate.getMonth()+1).padStart(2,'0')}`;

  const todayApts = appointments.filter(a=>a.date===todayStr&&a.status!=='cancelled');
  const monthlyRevenue = appointments.filter(a=>a.date.startsWith(monthStr)&&a.status==='completed').reduce((s,a)=>s+a.price,0);
  const newClientsMonth = clients.filter(c=>c.createdAt?.startsWith(monthStr)).length;

  const upcoming = appointments
    .filter(a=>a.date>=todayStr&&a.status!=='cancelled'&&a.status!=='completed')
    .sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time))
    .slice(0,6);

  const recent = appointments.filter(a=>a.status==='completed').sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);

  const getClient = id => clients.find(c=>c.id===id);
  const getService = id => services.find(s=>s.id===id);

  const h = nowDate.getHours();
  const greet = h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir';

  const KPI = ({ icon, iconBg, iconColor, value, label, sub }) => (
    <div style={S.kpiCard}>
      <div style={S.kpiIcon(iconBg,iconColor)}>{icon}</div>
      <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem', fontWeight:600, lineHeight:1, marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:'.78rem', color:C.gray, textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</div>
      {sub && <div style={{ fontSize:'.73rem', color:C.gray, marginTop:5 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ animation:'fadeIn .3s ease' }}>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem', fontWeight:500 }}>{greet}, {user?.name} ✦</h1>
        <p style={{ color:C.gray, fontSize:'.875rem', marginTop:4 }}>Voici un aperçu de votre salon aujourd'hui.</p>
      </div>

      <div style={S.kpiGrid}>
        <KPI icon="♀" iconBg="#FBF0E9" iconColor={C.roseGold} value={clients.length} label="Clientes" sub={`↑ ${newClientsMonth} ce mois-ci`} />
        <KPI icon="◷" iconBg="#F2EBF5" iconColor={C.mauve} value={todayApts.length} label="RDV aujourd'hui" sub={`${todayApts.filter(a=>a.status==='confirmed').length} confirmés`} />
        <KPI icon="◈" iconBg="#EEE6F0" iconColor={C.plum} value={`${monthlyRevenue} DT`} label="Revenus du mois" sub="Prestations réalisées" />
        <KPI icon="✦" iconBg={C.successBg} iconColor={C.success} value={services.length} label="Prestations actives" sub={`${[...new Set(services.map(s=>s.category))].length} catégories`} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        {/* Upcoming */}
        <div style={S.card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.2rem' }}>Prochains rendez-vous</h3>
            <button style={{ ...S.btnSecondary, ...S.btnSm }} onClick={()=>setPage('appointments')}>Voir tout →</button>
          </div>
          {upcoming.length===0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:C.gray, fontSize:'.875rem' }}>Aucun rendez-vous à venir</div>
          ) : upcoming.map(apt => {
            const client=getClient(apt.clientId); const service=getService(apt.serviceId);
            const isToday=apt.date===todayStr;
            return (
              <div key={apt.id} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'.8rem .9rem', borderRadius:8, background:C.blush, border:`1px solid ${C.border}`, marginBottom:'.6rem' }}>
                <div style={{ minWidth:58 }}>
                  <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'.95rem', fontWeight:600, color:C.mauve }}>{apt.time}</div>
                  <div style={{ fontSize:'.68rem', color:C.gray }}>{isToday?'Auj.':(new Date(apt.date+'T12:00:00')).toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'.875rem', fontWeight:500 }}>{client?`${client.firstName} ${client.lastName}`:'—'}</div>
                  <div style={{ fontSize:'.78rem', color:C.gray }}>{service?.name||'—'}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3 }}>
                  <StatusBadge status={apt.status} />
                  <span style={{ fontSize:'.75rem', color:C.mauve, fontWeight:600 }}>{apt.price} DT</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent */}
        <div style={S.card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.2rem' }}>Meilleures clientes</h3>
            <button style={{ ...S.btnSecondary, ...S.btnSm }} onClick={()=>setPage('clients')}>Voir tout →</button>
          </div>
          {[...clients].sort((a,b)=>b.totalSpent-a.totalSpent).slice(0,5).map(c => (
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'.5rem 0', borderBottom:`1px solid ${C.border}` }}>
              <Avatar name1={c.firstName} name2={c.lastName} size={30} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'.875rem', fontWeight:500 }}>{c.firstName} {c.lastName}</div>
                <div style={{ fontSize:'.72rem', color:C.gray }}>{c.visits} visite{c.visits!==1?'s':''}</div>
              </div>
              <span style={{ ...S.badge('#F2EBF5',C.mauve), fontWeight:600 }}>{c.totalSpent} DT</span>
            </div>
          ))}
          <div style={{ marginTop:'1.25rem' }}>
            <div style={{ fontSize:'.72rem', textTransform:'uppercase', letterSpacing:'.06em', color:C.gray, marginBottom:'.6rem' }}>Dernières prestations</div>
            {recent.map(apt => {
              const c=getClient(apt.clientId); const sv=getService(apt.serviceId);
              return (
                <div key={apt.id} style={{ display:'flex', justifyContent:'space-between', padding:'.4rem 0', borderBottom:`1px solid ${C.border}`, fontSize:'.8rem' }}>
                  <span><strong>{c?.firstName} {c?.lastName}</strong> — {sv?.name}</span>
                  <span style={{ color:C.mauve, fontWeight:600 }}>{apt.price} DT</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop:'1.5rem', display:'flex', gap:'1rem', flexWrap:'wrap' }}>
        <button style={S.btnPrimary} onClick={()=>setPage('appointments')}>+ Nouveau rendez-vous</button>
        <button style={S.btnSecondary} onClick={()=>setPage('clients')}>+ Nouvelle cliente</button>
        <button style={S.btnSecondary} onClick={()=>setPage('services')}>Gérer les prestations</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CLIENTS PAGE
// ─────────────────────────────────────────────
const EMPTY_CLIENT = { firstName:'', lastName:'', phone:'', email:'', birthDate:'', notes:'' };

function Clients() {
  const { clients, addClient, updateClient, deleteClient, appointments, services } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null|'add'|'edit'|'view'|'del'
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState(EMPTY_CLIENT);
  const sf = (k,v) => setForm(f=>({...f,[k]:v}));
  const close = () => { setModal(null); setSel(null); };

  const filtered = clients.filter(c => {
    const q=search.toLowerCase();
    return `${c.firstName} ${c.lastName} ${c.phone} ${c.email}`.toLowerCase().includes(q);
  });

  const ClientForm = ({ onSave, label }) => (
    <>
      <div style={S.formRow}>
        <Input label="Prénom *" value={form.firstName} onChange={e=>sf('firstName',e.target.value)} placeholder="Yasmine" required />
        <Input label="Nom *" value={form.lastName} onChange={e=>sf('lastName',e.target.value)} placeholder="Ben Ali" required />
      </div>
      <div style={S.formRow}>
        <Input label="Téléphone *" value={form.phone} onChange={e=>sf('phone',e.target.value)} placeholder="+216 XX XXX XXX" required />
        <Input label="Email" type="email" value={form.email} onChange={e=>sf('email',e.target.value)} placeholder="email@exemple.com" />
      </div>
      <Input label="Date de naissance" type="date" value={form.birthDate} onChange={e=>sf('birthDate',e.target.value)} />
      <Textarea label="Notes internes" value={form.notes} onChange={e=>sf('notes',e.target.value)} placeholder="Allergies, préférences…" />
      <div style={S.modalFooter}>
        <button style={S.btnSecondary} onClick={close}>Annuler</button>
        <button style={S.btnPrimary} onClick={onSave}>{label}</button>
      </div>
    </>
  );

  return (
    <div style={{ animation:'fadeIn .3s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem', fontWeight:500 }}>Clientes</h2>
          <div style={{ fontSize:'.82rem', color:C.gray }}>{clients.length} cliente{clients.length!==1?'s':''} enregistrée{clients.length!==1?'s':''}</div>
        </div>
        <button style={S.btnPrimary} onClick={()=>{setForm(EMPTY_CLIENT);setModal('add');}}>+ Nouvelle cliente</button>
      </div>

      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem' }}>
        <div style={{ position:'relative', flex:1, maxWidth:340 }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.gray }}>⌕</span>
          <input style={{ ...S.formInput, paddingLeft:'2.4rem' }} placeholder="Rechercher une cliente…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <span style={{ alignSelf:'center', fontSize:'.82rem', color:C.gray }}>{filtered.length} résultat{filtered.length!==1?'s':''}</span>
      </div>

      <div style={S.tableWrapper}>
        <table style={{ width:'100%', borderCollapse:'collapse', background:C.white }}>
          <thead><tr>
            {['Cliente','Téléphone','Email','Visites','Total dépensé','Inscrite le',''].map(h=>(
              <th key={h} style={S.th}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length===0 ? (
              <tr><td colSpan={7} style={{ ...S.td, textAlign:'center', color:C.gray, padding:'3rem' }}>Aucune cliente trouvée.</td></tr>
            ) : filtered.map(c=>(
              <tr key={c.id} onClick={()=>{setSel(c);setModal('view');}} style={{ cursor:'pointer' }}>
                <td style={S.td}>
                  <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                    <Avatar name1={c.firstName} name2={c.lastName} size={30} />
                    <div>
                      <div style={{ fontWeight:500, fontSize:'.9rem' }}>{c.firstName} {c.lastName}</div>
                      {c.notes && <div style={{ fontSize:'.7rem', color:C.warning }}>⚠ Notes</div>}
                    </div>
                  </div>
                </td>
                <td style={S.td}>{c.phone}</td>
                <td style={{ ...S.td, color:C.gray, fontSize:'.82rem' }}>{c.email||'—'}</td>
                <td style={S.td}><span style={{ fontFamily:'Cormorant Garamond,serif', fontWeight:600, color:C.mauve, fontSize:'1.1rem' }}>{c.visits}</span></td>
                <td style={S.td}><span style={{ ...S.badge('#F2EBF5',C.mauve), fontWeight:600 }}>{c.totalSpent} DT</span></td>
                <td style={{ ...S.td, color:C.gray, fontSize:'.8rem' }}>{new Date(c.createdAt+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})}</td>
                <td style={S.td} onClick={e=>e.stopPropagation()}>
                  <div style={{ display:'flex', gap:4 }}>
                    <button style={S.btnGhost} title="Modifier" onClick={e=>{e.stopPropagation();setSel(c);setForm({firstName:c.firstName,lastName:c.lastName,phone:c.phone,email:c.email||'',birthDate:c.birthDate||'',notes:c.notes||''});setModal('edit');}}>✎</button>
                    <button style={{ ...S.btnGhost, color:C.error }} title="Supprimer" onClick={e=>{e.stopPropagation();setSel(c);setModal('del');}}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal==='add'} onClose={close} title="Nouvelle cliente">
        <ClientForm onSave={()=>{if(!form.firstName||!form.lastName||!form.phone)return;addClient(form);close();}} label="+ Ajouter la cliente" />
      </Modal>
      <Modal open={modal==='edit'} onClose={close} title="Modifier la cliente">
        <ClientForm onSave={()=>{if(!form.firstName||!form.lastName)return;updateClient(sel.id,form);close();}} label="Enregistrer" />
      </Modal>

      <Modal open={modal==='view'} onClose={close} title={null} large>
        {sel && <ClientDetailView client={sel} appointments={appointments} services={services}
          onEdit={()=>{close();setTimeout(()=>{setForm({firstName:sel.firstName,lastName:sel.lastName,phone:sel.phone,email:sel.email||'',birthDate:sel.birthDate||'',notes:sel.notes||''});setModal('edit');},50);}}
          onDelete={()=>{close();setTimeout(()=>setModal('del'),50);}}
          onClose={close}
        />}
      </Modal>
      <ConfirmDelete open={modal==='del'} onClose={close} onConfirm={()=>{deleteClient(sel.id);close();}} name={sel?`${sel.firstName} ${sel.lastName}`:''} desc="Cette action est irréversible." />
    </div>
  );
}

function ClientDetailView({ client, appointments, services, onEdit, onDelete, onClose }) {
  const getService = id => services.find(s=>s.id===id);
  const clientApts = appointments.filter(a=>a.clientId===client.id).sort((a,b)=>b.date.localeCompare(a.date));
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
        <Avatar name1={client.firstName} name2={client.lastName} size={52} />
        <div style={{ flex:1 }}>
          <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', fontWeight:500 }}>{client.firstName} {client.lastName}</h3>
          <div style={{ fontSize:'.8rem', color:C.gray }}>Cliente depuis {new Date(client.createdAt+'T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'})}</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ ...S.btnSecondary, ...S.btnSm }} onClick={onEdit}>✎ Modifier</button>
          <button style={{ ...S.btnDanger, ...S.btnSm }} onClick={onDelete}>✕ Supprimer</button>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.25rem' }}>
        {[['Visites',client.visits,'◷'],['Total dépensé',`${client.totalSpent} DT`,'◈'],['Prestations',clientApts.filter(a=>a.status==='completed').length,'✦']].map(([label,value,icon])=>(
          <div key={label} style={{ background:C.blush, borderRadius:8, padding:'1rem', textAlign:'center' }}>
            <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', fontWeight:600, color:C.mauve }}>{value}</div>
            <div style={{ fontSize:'.72rem', color:C.gray, marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:C.blush, borderRadius:8, padding:'1rem', marginBottom:'1rem' }}>
        {client.phone && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.875rem', padding:'3px 0' }}><span style={{ color:C.gray }}>Téléphone</span><strong>{client.phone}</strong></div>}
        {client.email && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.875rem', padding:'3px 0' }}><span style={{ color:C.gray }}>Email</span><strong>{client.email}</strong></div>}
        {client.birthDate && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.875rem', padding:'3px 0' }}><span style={{ color:C.gray }}>Naissance</span><strong>{new Date(client.birthDate+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</strong></div>}
      </div>
      {client.notes && <div style={{ background:C.warningBg, borderLeft:`3px solid ${C.warning}`, borderRadius:8, padding:'.75rem 1rem', marginBottom:'1rem', fontSize:'.875rem' }}><strong style={{ fontSize:'.72rem', textTransform:'uppercase', letterSpacing:'.05em' }}>Notes :</strong><br/>{client.notes}</div>}
      <div style={{ fontSize:'.72rem', textTransform:'uppercase', letterSpacing:'.06em', color:C.gray, marginBottom:'.75rem' }}>Historique ({clientApts.length})</div>
      <div style={{ maxHeight:200, overflowY:'auto' }}>
        {clientApts.length===0 ? <div style={{ color:C.gray, fontSize:'.875rem', padding:'1rem', textAlign:'center' }}>Aucun rendez-vous.</div>
          : clientApts.map(apt=>{
            const sv=getService(apt.serviceId);
            return (
              <div key={apt.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.45rem 0', borderBottom:`1px solid ${C.border}`, fontSize:'.82rem' }}>
                <div><strong>{sv?.name||'—'}</strong> <span style={{ color:C.gray }}>{new Date(apt.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})} à {apt.time}</span></div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}><StatusBadge status={apt.status}/><span style={{ color:C.mauve, fontWeight:600 }}>{apt.price} DT</span></div>
              </div>
            );
          })
        }
      </div>
      <div style={{ ...S.modalFooter, marginTop:'1.25rem' }}>
        <button style={S.btnSecondary} onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APPOINTMENTS PAGE
// ─────────────────────────────────────────────
const STATUSES = ['scheduled','confirmed','completed','cancelled'];
const STATUS_FR = { scheduled:'Planifié', confirmed:'Confirmé', completed:'Terminé', cancelled:'Annulé' };
const EMPTY_APT = { clientId:'', serviceId:'', date:'', time:'09:00', notes:'' };

function Appointments() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, clients, services } = useApp();
  const todayStr = fmt(TODAY);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_APT, date: todayStr });
  const sf = (k,v) => setForm(f=>({...f,[k]:v}));
  const close = () => { setModal(null); setSel(null); };
  const getClient = id => clients.find(c=>c.id===id);
  const getService = id => services.find(s=>s.id===id);

  const filtered = appointments.filter(a => {
    if (filterStatus!=='all' && a.status!==filterStatus) return false;
    if (filterDate && a.date!==filterDate) return false;
    if (search) {
      const cl=getClient(a.clientId); const sv=getService(a.serviceId);
      return `${cl?.firstName} ${cl?.lastName} ${sv?.name}`.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  }).sort((a,b)=>b.date.localeCompare(a.date)||a.time.localeCompare(b.time));

  const AptForm = ({ onSave, label }) => (
    <>
      <div style={S.formRow}>
        <Select label="Cliente *" value={form.clientId} onChange={e=>sf('clientId',e.target.value)} required
          options={[{value:'',label:'Sélectionner une cliente…'},...[...clients].sort((a,b)=>a.firstName.localeCompare(b.firstName)).map(c=>({value:c.id,label:`${c.firstName} ${c.lastName}`}))]} />
        <Select label="Prestation *" value={form.serviceId} onChange={e=>sf('serviceId',e.target.value)} required
          options={[{value:'',label:'Sélectionner une prestation…'},...services.map(s=>({value:s.id,label:`${s.name} — ${s.price} DT`}))]} />
      </div>
      <div style={S.formRow}>
        <Input label="Date *" type="date" value={form.date} onChange={e=>sf('date',e.target.value)} required />
        <Input label="Heure *" type="time" value={form.time} onChange={e=>sf('time',e.target.value)} required />
      </div>
      <Textarea label="Notes" value={form.notes} onChange={e=>sf('notes',e.target.value)} placeholder="Informations supplémentaires…" />
      <div style={S.modalFooter}>
        <button style={S.btnSecondary} onClick={close}>Annuler</button>
        <button style={S.btnPrimary} onClick={onSave}>{label}</button>
      </div>
    </>
  );

  const pending = appointments.filter(a=>['scheduled','confirmed'].includes(a.status)&&a.date>=todayStr).length;

  return (
    <div style={{ animation:'fadeIn .3s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem', fontWeight:500 }}>Rendez-vous</h2>
          <div style={{ fontSize:'.82rem', color:C.gray }}>{pending} à venir · {appointments.filter(a=>a.date===todayStr&&a.status!=='cancelled').length} aujourd'hui</div>
        </div>
        <button style={S.btnPrimary} onClick={()=>{setForm({...EMPTY_APT,date:todayStr});setModal('add');}}>+ Nouveau rendez-vous</button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', marginBottom:'1.5rem', alignItems:'center' }}>
        <div style={{ position:'relative', maxWidth:260, flex:1 }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.gray }}>⌕</span>
          <input style={{ ...S.formInput, paddingLeft:'2.4rem' }} placeholder="Cliente ou prestation…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        {['all',...STATUSES].map(s=>(
          <button key={s} onClick={()=>setFilterStatus(s)}
            style={{ padding:'.45rem 1rem', borderRadius:100, fontSize:'.78rem', border:`1.5px solid ${filterStatus===s?C.mauve:C.border}`, background:filterStatus===s?C.mauve:C.white, color:filterStatus===s?'white':C.gray, cursor:'pointer', fontFamily:'DM Sans,sans-serif', transition:'all .18s' }}>
            {s==='all'?'Tous':STATUS_FR[s]}
          </button>
        ))}
        <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{ ...S.formInput, width:'auto', padding:'.45rem .75rem', fontSize:'.82rem' }} title="Filtrer par date" />
        {filterDate && <button style={S.btnSecondary} onClick={()=>setFilterDate('')}>× Effacer</button>}
      </div>

      <div style={S.tableWrapper}>
        <table style={{ width:'100%', borderCollapse:'collapse', background:C.white }}>
          <thead><tr>
            {['Date & Heure','Cliente','Prestation','Prix','Statut','Notes',''].map(h=><th key={h} style={S.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.length===0 ? <tr><td colSpan={7} style={{ ...S.td, textAlign:'center', color:C.gray, padding:'3rem' }}>Aucun rendez-vous trouvé.</td></tr>
              : filtered.map(apt => {
                const cl=getClient(apt.clientId); const sv=getService(apt.serviceId);
                const isToday=apt.date===todayStr;
                return (
                  <tr key={apt.id}>
                    <td style={S.td}>
                      <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1rem', fontWeight:600, color:isToday?C.mauve:C.dark }}>{apt.time}</div>
                      <div style={{ fontSize:'.72rem', color:isToday?C.mauve:C.gray }}>{isToday?'✦ Aujourd\'hui':new Date(apt.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})}</div>
                    </td>
                    <td style={S.td}>
                      {cl ? <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}><Avatar name1={cl.firstName} name2={cl.lastName} size={28}/><span style={{ fontWeight:500 }}>{cl.firstName} {cl.lastName}</span></div> : '—'}
                    </td>
                    <td style={S.td}>
                      <div style={{ fontSize:'.875rem' }}>{sv?.name||'—'}</div>
                      {sv?.duration && <div style={{ fontSize:'.7rem', color:C.gray }}>{sv.duration} min</div>}
                    </td>
                    <td style={S.td}><span style={{ ...S.badge('#F2EBF5',C.mauve), fontWeight:600 }}>{apt.price} DT</span></td>
                    <td style={S.td}>
                      <select value={apt.status} onChange={e=>updateAppointment(apt.id,{status:e.target.value})}
                        style={{ ...S.badge(apt.status==='confirmed'?C.successBg:apt.status==='completed'?C.blush:apt.status==='cancelled'?C.errorBg:C.infoBg, apt.status==='confirmed'?C.success:apt.status==='completed'?C.gray:apt.status==='cancelled'?C.error:'#5566CC'), border:'none', cursor:'pointer', appearance:'none', fontFamily:'DM Sans,sans-serif', fontSize:'.73rem' }}>
                        {STATUSES.map(s=><option key={s} value={s}>{STATUS_FR[s]}</option>)}
                      </select>
                    </td>
                    <td style={{ ...S.td, maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'.78rem', color:C.gray }}>{apt.notes||'—'}</td>
                    <td style={S.td}>
                      <div style={{ display:'flex', gap:4 }}>
                        <button style={S.btnGhost} onClick={()=>{setSel(apt);setForm({clientId:String(apt.clientId),serviceId:String(apt.serviceId),date:apt.date,time:apt.time,notes:apt.notes||''});setModal('edit');}}>✎</button>
                        <button style={{ ...S.btnGhost, color:C.error }} onClick={()=>{setSel(apt);setModal('del');}}>✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <Modal open={modal==='add'} onClose={close} title="Nouveau rendez-vous">
        <AptForm onSave={()=>{if(!form.clientId||!form.serviceId||!form.date)return;addAppointment(form);close();}} label="+ Créer" />
      </Modal>
      <Modal open={modal==='edit'} onClose={close} title="Modifier le rendez-vous">
        <AptForm onSave={()=>{const sv=services.find(s=>s.id===Number(form.serviceId));updateAppointment(sel.id,{clientId:Number(form.clientId),serviceId:Number(form.serviceId),date:form.date,time:form.time,notes:form.notes,price:sv?.price||sel.price});close();}} label="Enregistrer" />
      </Modal>
      <ConfirmDelete open={modal==='del'} onClose={close} onConfirm={()=>{deleteAppointment(sel.id);close();}} name="ce rendez-vous"
        desc={sel?`${getClient(sel.clientId)?.firstName} ${getClient(sel.clientId)?.lastName} — ${sel.date} à ${sel.time}`:''} />
    </div>
  );
}

// ─────────────────────────────────────────────
// SERVICES PAGE
// ─────────────────────────────────────────────
const CAT_COLORS = { Visage:'#C9956C', Ongles:'#8B4C70', Épilation:'#6B9E7A', Corps:'#D4956A', Maquillage:'#C4616B', Cheveux:'#5C2D4A', Autre:'#9A8A88' };
const CATS = Object.keys(CAT_COLORS);
const EMPTY_SVC = { name:'', category:'Visage', duration:60, price:0, color:CAT_COLORS.Visage };

function Services() {
  const { services, addService, updateService, deleteService } = useApp();
  const [filterCat, setFilterCat] = useState('all');
  const [modal, setModal] = useState(null);
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState(EMPTY_SVC);
  const sf = (k,v) => setForm(f=>({...f,[k]:v}));
  const close = () => { setModal(null); setSel(null); };
  const cats = [...new Set(services.map(s=>s.category))];
  const filtered = filterCat==='all' ? services : services.filter(s=>s.category===filterCat);

  const SvcForm = ({ onSave, label }) => (
    <>
      <Input label="Nom de la prestation *" value={form.name} onChange={e=>sf('name',e.target.value)} placeholder="Soin du visage hydratant" required />
      <div style={S.formRow}>
        <Select label="Catégorie *" value={form.category} onChange={e=>{sf('category',e.target.value);sf('color',CAT_COLORS[e.target.value]||'#C9956C');}}
          options={CATS.map(c=>({value:c,label:c}))} />
        <FormInput label="Couleur">
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <input type="color" value={form.color} onChange={e=>sf('color',e.target.value)} style={{ width:40,height:38,padding:2,border:`1.5px solid ${C.border}`,borderRadius:6,cursor:'pointer' }} />
            <span style={{ fontSize:'.78rem', color:C.gray }}>Couleur d'accentuation</span>
          </div>
        </FormInput>
      </div>
      <div style={S.formRow}>
        <Input label="Durée (min) *" type="number" min="5" step="5" value={form.duration} onChange={e=>sf('duration',e.target.value)} required />
        <Input label="Prix (DT) *" type="number" min="0" step="1" value={form.price} onChange={e=>sf('price',e.target.value)} required />
      </div>
      <div style={S.modalFooter}>
        <button style={S.btnSecondary} onClick={close}>Annuler</button>
        <button style={S.btnPrimary} onClick={onSave}>{label}</button>
      </div>
    </>
  );

  return (
    <div style={{ animation:'fadeIn .3s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem', fontWeight:500 }}>Prestations</h2>
          <div style={{ fontSize:'.82rem', color:C.gray }}>{services.length} prestation{services.length!==1?'s':''} · Tarif moy. {Math.round(services.reduce((s,sv)=>s+sv.price,0)/(services.length||1))} DT</div>
        </div>
        <button style={S.btnPrimary} onClick={()=>{setForm(EMPTY_SVC);setModal('add');}}>+ Nouvelle prestation</button>
      </div>

      <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1.75rem' }}>
        {['all',...cats].map(c=>(
          <button key={c} onClick={()=>setFilterCat(c)}
            style={{ padding:'.45rem 1rem', borderRadius:100, fontSize:'.78rem', border:`1.5px solid ${filterCat===c?C.mauve:C.border}`, background:filterCat===c?C.mauve:C.white, color:filterCat===c?'white':C.gray, cursor:'pointer', fontFamily:'DM Sans,sans-serif', transition:'all .18s' }}>
            {c==='all'?`Toutes (${services.length})`:`${c} (${services.filter(s=>s.category===c).length})`}
          </button>
        ))}
      </div>

      {filterCat==='all' ? (
        cats.map(cat=>(
          <div key={cat} style={{ marginBottom:'2rem' }}>
            <div style={{ fontSize:'.75rem', textTransform:'uppercase', letterSpacing:'.07em', color:C.gray, marginBottom:'.75rem', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:CAT_COLORS[cat]||C.roseGold }} />
              {cat}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:'1rem' }}>
              {services.filter(s=>s.category===cat).map(svc=><SvcCard key={svc.id} svc={svc} onEdit={()=>{setSel(svc);setForm({name:svc.name,category:svc.category,duration:svc.duration,price:svc.price,color:svc.color||CAT_COLORS[svc.category]});setModal('edit');}} onDel={()=>{setSel(svc);setModal('del');}}/>)}
            </div>
          </div>
        ))
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:'1rem' }}>
          {filtered.map(svc=><SvcCard key={svc.id} svc={svc} onEdit={()=>{setSel(svc);setForm({name:svc.name,category:svc.category,duration:svc.duration,price:svc.price,color:svc.color||CAT_COLORS[svc.category]});setModal('edit');}} onDel={()=>{setSel(svc);setModal('del');}}/>)}
        </div>
      )}

      <Modal open={modal==='add'} onClose={close} title="Nouvelle prestation">
        <SvcForm onSave={()=>{if(!form.name)return;addService(form);close();}} label="+ Créer" />
      </Modal>
      <Modal open={modal==='edit'} onClose={close} title="Modifier la prestation">
        <SvcForm onSave={()=>{updateService(sel.id,form);close();}} label="Enregistrer" />
      </Modal>
      <ConfirmDelete open={modal==='del'} onClose={close} onConfirm={()=>{deleteService(sel.id);close();}} name={sel?.name} />
    </div>
  );
}

function SvcCard({ svc, onEdit, onDel }) {
  return (
    <div style={{ ...S.serviceCard, paddingLeft:'1.5rem' }}>
      <div style={{ position:'absolute', left:0, top:0, width:4, height:'100%', background:svc.color||C.roseGold, borderRadius:'12px 0 0 12px' }} />
      <div style={{ fontSize:'1rem', fontWeight:500, marginBottom:4 }}>{svc.name}</div>
      <span style={{ ...S.badge(C.blush,C.gray), marginBottom:'1rem', display:'inline-flex' }}>{svc.category}</span>
      <div style={{ display:'flex', gap:'1.5rem', marginBottom:'1rem' }}>
        <div>
          <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', fontWeight:600, color:svc.color||C.mauve }}>{svc.price} <span style={{ fontSize:'.85rem' }}>DT</span></div>
          <div style={{ fontSize:'.68rem', color:C.gray }}>Prix</div>
        </div>
        <div>
          <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', fontWeight:600, color:C.dark }}>{svc.duration} <span style={{ fontSize:'.85rem' }}>min</span></div>
          <div style={{ fontSize:'.68rem', color:C.gray }}>Durée</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button style={{ ...S.btnSecondary, ...S.btnSm, flex:1 }} onClick={onEdit}>✎ Modifier</button>
        <button style={{ ...S.btnGhost, color:C.error }} onClick={onDel}>✕</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN PAGE
// ─────────────────────────────────────────────
function AdminPage() {
  const { user, clients, appointments, services } = useApp();
  const [saved, setSaved] = useState(false);
  const [info, setInfo] = useState({ name:'La Finesse by Nourhen', address:'La Marsa, Tunis, Tunisie', phone:'+216 XX XXX XXX', email:'contact@lafinesse.tn', openTime:'09:00', closeTime:'19:00' });
  const si = (k,v) => setInfo(i=>({...i,[k]:v}));
  const totalRevenue = appointments.filter(a=>a.status==='completed').reduce((s,a)=>s+a.price,0);
  const completed = appointments.filter(a=>a.status==='completed').length;

  const Section = ({ icon, title, children }) => (
    <div style={{ border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden', marginBottom:'1.5rem' }}>
      <div style={{ background:C.blush, padding:'1rem 1.5rem', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:10 }}>
        <span>{icon}</span><h4 style={{ fontSize:'1rem', fontWeight:500 }}>{title}</h4>
      </div>
      <div style={{ padding:'1.5rem', background:C.white }}>{children}</div>
    </div>
  );

  return (
    <div style={{ animation:'fadeIn .3s ease', maxWidth:720 }}>
      <div style={{ marginBottom:'2rem' }}>
        <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem', fontWeight:500 }}>Paramètres</h2>
        <div style={{ fontSize:'.82rem', color:C.gray }}>Configuration du salon et informations générales</div>
      </div>

      <Section icon="◇" title="Informations du salon">
        <div style={S.formRow}>
          <Input label="Nom du salon" value={info.name} onChange={e=>si('name',e.target.value)} />
          <Input label="Adresse" value={info.address} onChange={e=>si('address',e.target.value)} />
        </div>
        <div style={S.formRow}>
          <Input label="Téléphone" value={info.phone} onChange={e=>si('phone',e.target.value)} />
          <Input label="Email" type="email" value={info.email} onChange={e=>si('email',e.target.value)} />
        </div>
        <div style={S.formRow}>
          <Input label="Ouverture" type="time" value={info.openTime} onChange={e=>si('openTime',e.target.value)} />
          <Input label="Fermeture" type="time" value={info.closeTime} onChange={e=>si('closeTime',e.target.value)} />
        </div>
      </Section>

      <Section icon="◈" title="Statistiques globales">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
          {[['Clientes',clients.length],['Rendez-vous',appointments.length],['Prestations',services.length],['RDV réalisés',completed],['Revenu total',`${totalRevenue} DT`],['Panier moyen',`${completed>0?Math.round(totalRevenue/completed):0} DT`]].map(([label,value])=>(
            <div key={label} style={{ background:C.blush, borderRadius:8, padding:'1rem', textAlign:'center' }}>
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', fontWeight:600, color:C.mauve }}>{value}</div>
              <div style={{ fontSize:'.72rem', color:C.gray, marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon="⚙" title="Compte administrateur">
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <Avatar name1={user?.name?.[0]} name2="" />
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:500 }}>{user?.name}</div>
            <div style={{ fontSize:'.82rem', color:C.gray }}>{user?.email}</div>
          </div>
          <span style={{ ...S.badge('#F2EBF5',C.mauve) }}>Administrateur</span>
        </div>
      </Section>

      <Section icon="⬡" title="Données & stockage">
        <p style={{ fontSize:'.875rem', color:C.gray, marginBottom:'1rem' }}>
          Les données sont stockées dans le localStorage du navigateur.
        </p>
        <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
          <button style={{ ...S.btnSecondary, ...S.btnSm }} onClick={()=>{
            const data = { clients:JSON.parse(localStorage.getItem('lf_clients')||'[]'), appointments:JSON.parse(localStorage.getItem('lf_appointments')||'[]'), services:JSON.parse(localStorage.getItem('lf_services')||'[]'), exportedAt:new Date().toISOString() };
            const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
            const url=URL.createObjectURL(blob); const a=document.createElement('a');
            a.href=url; a.download=`lafinesse-backup-${fmt(TODAY)}.json`; a.click(); URL.revokeObjectURL(url);
          }}>⬇ Exporter JSON</button>
          <button style={{ ...S.btnDanger, ...S.btnSm }} onClick={()=>{ if(window.confirm('Réinitialiser toutes les données ?')){ localStorage.removeItem('lf_clients');localStorage.removeItem('lf_appointments');localStorage.removeItem('lf_services');window.location.reload(); } }}>
            ⚠ Réinitialiser
          </button>
        </div>
      </Section>

      <div style={{ display:'flex', justifyContent:'flex-end', gap:'.75rem', marginTop:'1.5rem', alignItems:'center' }}>
        {saved && <span style={{ fontSize:'.875rem', color:C.success }}>✓ Paramètres sauvegardés</span>}
        <button style={S.btnPrimary} onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);}}>Enregistrer</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
function AppInner() {
  const { user, page } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return <LoginPage />;

  const PAGES = { dashboard:<Dashboard/>, clients:<Clients/>, appointments:<Appointments/>, services:<Services/>, admin:<AdminPage/> };

  return (
    <div style={S.appLayout}>
      <Sidebar collapsed={collapsed} />
      <div style={S.mainContent(collapsed)}>
        <Topbar collapsed={collapsed} onToggle={()=>setCollapsed(c=>!c)} />
        <div style={S.pageWrapper}>
          {PAGES[page] || <Dashboard/>}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
