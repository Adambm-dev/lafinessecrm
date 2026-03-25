import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════
// SUPABASE CONFIGURATION
// ═══════════════════════════════════════════════════════════════
const SUPABASE_URL = 'https://uksqkzxjnxhrrotlubxl.supabase.co'; // Replace with your URL
const SUPABASE_ANON_KEY = 'sb_publishable_NpMmJrjk60qQ1T4mosVi_w_e_uwO4NO'; // Replace with your Anon Key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const C = {
  cream:'#FDF6F0', blush:'#F5E6DD', roseGold:'#C9956C', roseLight:'#E8C4A8',
  mauve:'#8B4C70', plum:'#5C2D4A', noir:'#1E1018', dark:'#2D1B1B',
  gray:'#9A8A88', grayLight:'#C8B8B5', border:'#EAD9CE', white:'#FFFFFF',
  success:'#6B9E7A', successBg:'#EDF6F0', warning:'#D4956A', warningBg:'#FDF2EA',
  error:'#C4616B', errorBg:'#FDF0F1', infoBg:'#EEF0FA',
};

const FONTS = {
  serif: 'Cormorant Garamond, Georgia, serif',
  sans: 'DM Sans, system-ui, sans-serif',
};

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════
const fmt = d => d.toISOString().split('T')[0];
const addD = (d,n) => { const r=new Date(d); r.setDate(r.getDate()+n); return r; };
const T = new Date();

const MOCK_SERVICES = [
  { id:1, name:'Soin du visage hydratant', category:'Visage', duration:60, price:85, description:'Soin profond nourrissant pour une peau lumineuse et hydratée.', popular:true, color:C.roseGold },
  { id:2, name:'Soin anti-âge lifting', category:'Visage', duration:75, price:110, description:'Traitement raffermissant pour atténuer les rides et ridules.', popular:false, color:C.roseGold },
  { id:3, name:'Manucure semi-permanente', category:'Ongles', duration:60, price:50, description:'Vernis gel longue durée, jusqu\'à 3 semaines d\'impeccabilité.', popular:true, color:C.mauve },
  { id:4, name:'Pédicure spa complète', category:'Ongles', duration:75, price:60, description:'Soin complet des pieds avec bain, gommage et vernis.', popular:false, color:C.mauve },
  { id:5, name:'Épilation sourcils + lèvre', category:'Épilation', duration:25, price:20, description:'Mise en forme précise et épilation douce.', popular:true, color:C.success },
  { id:6, name:'Épilation jambes complètes', category:'Épilation', duration:45, price:40, description:'Épilation complète pour une peau soyeuse et lisse.', popular:false, color:C.success },
  { id:7, name:'Massage relaxant corps', category:'Corps', duration:60, price:75, description:'Massage aux huiles essentielles pour relâcher les tensions.', popular:true, color:C.warning },
  { id:8, name:'Maquillage mariée', category:'Maquillage', duration:90, price:130, description:'Maquillage haute définition pour votre jour J.', popular:false, color:C.error },
  { id:9, name:'Coloration + soin', category:'Cheveux', duration:120, price:95, description:'Coloration professionnelle suivie d\'un soin réparateur.', popular:false, color:C.plum },
  { id:10, name:'Brushing & mise en plis', category:'Cheveux', duration:45, price:35, description:'Brushing professionnel pour une chevelure parfaite.', popular:true, color:C.plum },
];

const MOCK_CLIENTS = [
  { id:1, firstName:'Yasmine', lastName:'Ben Ali', phone:'+216 22 345 678', email:'yasmine.benali@email.com', birthDate:'1990-03-15', notes:'Allergie au latex.', totalSpent:420, visits:6, points:420, createdAt:'2024-01-10', password:'yasmine123' },
  { id:2, firstName:'Sana', lastName:'Trabelsi', phone:'+216 55 234 567', email:'sana.t@email.com', birthDate:'1985-07-22', notes:'', totalSpent:275, visits:4, points:275, createdAt:'2024-02-05', password:'sana123' },
  { id:3, firstName:'Rim', lastName:'Hamdi', phone:'+216 98 765 432', email:'rim.hamdi@email.com', birthDate:'1995-11-08', notes:'Préfère le matin.', totalSpent:560, visits:8, points:560, createdAt:'2023-11-20', password:'rim123' },
  { id:4, firstName:'Ines', lastName:'Chaabane', phone:'+216 25 678 901', email:'ines.ch@email.com', birthDate:'1992-04-30', notes:'', totalSpent:185, visits:3, points:185, createdAt:'2024-03-01', password:'ines123' },
  { id:5, firstName:'Nadia', lastName:'Khelifi', phone:'+216 44 321 098', email:'nadia.k@email.com', birthDate:'1988-09-14', notes:'Cliente VIP.', totalSpent:890, visits:12, points:890, createdAt:'2023-06-15', password:'nadia123' },
];

const MOCK_APPOINTMENTS = [
  { id:1, client_id:1, service_id:1, date:fmt(T), time:'09:00', status:'confirmed', notes:'', price:85 },
  { id:2, client_id:3, service_id:8, date:fmt(T), time:'10:30', status:'confirmed', notes:'Mariage samedi.', price:130 },
  { id:3, client_id:5, service_id:7, date:fmt(T), time:'14:00', status:'scheduled', notes:'', price:75 },
  { id:4, client_id:2, service_id:3, date:fmt(addD(T,1)), time:'11:00', status:'scheduled', notes:'', price:50 },
  { id:5, client_id:4, service_id:6, date:fmt(addD(T,1)), time:'15:30', status:'scheduled', notes:'', price:40 },
  { id:6, client_id:1, service_id:4, date:fmt(addD(T,-1)), time:'10:00', status:'completed', notes:'', price:60 },
  { id:7, client_id:3, service_id:5, date:fmt(addD(T,-2)), time:'09:30', status:'completed', notes:'', price:20 },
  { id:8, client_id:5, service_id:9, date:fmt(addD(T,-3)), time:'13:00', status:'completed', notes:'', price:95 },
  { id:9, client_id:2, service_id:10, date:fmt(addD(T,-5)), time:'11:00', status:'completed', notes:'', price:35 },
  { id:10, client_id:4, service_id:1, date:fmt(addD(T,-6)), time:'14:00', status:'cancelled', notes:'', price:85 },
];

const MOCK_PROMOS = [
  { id:1, code:'ANNIVERSAIRE20', label:'Cadeau anniversaire', discount:20, type:'percent', validUntil: fmt(addD(T,30)), clientId:1 },
  { id:2, code:'FIDELITE15', label:'Fidélité VIP', discount:15, type:'percent', validUntil: fmt(addD(T,60)), clientId:5 },
  { id:3, code:'BIENVENUE10', label:'Bienvenue !', discount:10, type:'percent', validUntil: fmt(addD(T,90)), clientId:null },
];

const NEWS = [
  { id:1, title:'Nouvelle collection printemps 🌸', date: fmt(addD(T,-3)), content:'Découvrez nos nouveaux soins inspirés des rituels orientaux. Disponibles dès maintenant sur rendez-vous.', emoji:'🌸' },
  { id:2, title:'Offre Spéciale Ramadan ✨', date: fmt(addD(T,-7)), content:'Profitez de -20% sur tous les soins visage pendant tout le mois. Code : RAMADAN20.', emoji:'✨' },
  { id:3, title:'Nouveau soin corps "Gold Ritual"', date: fmt(addD(T,-12)), content:'Un soin luxueux aux paillettes d\'or pour illuminer votre peau. À découvrir absolument.', emoji:'💛' },
];

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════
const Ctx = createContext(null);

function AppProvider({ children }) {
  const ls = (k,fb) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):fb; } catch { return fb; } };

  const [adminUser, setAdminUser] = useState(() => ls('lf_admin',null));
  const [clientUser, setClientUser] = useState(() => ls('lf_client_user',null));
  const [appMode, setAppMode] = useState('client'); // 'client' | 'admin'

  const [clients, setClients] = useState(() => ls('lf_clients', MOCK_CLIENTS));
  const [appointments, setAppointments] = useState(() => ls('lf_appointments', MOCK_APPOINTMENTS));

  // Initial Data Fetching from Supabase
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Clients
      const { data: cData, error: cErr } = await supabase.from('users').select('*').eq('role', 'client');
      if (!cErr && cData) setClients(cData);

      // Fetch Appointments
      const { data: aData, error: aErr } = await supabase.from('appointments').select('*');
      if (!aErr && aData) setAppointments(aData);
    };
    fetchData();
  }, []);
  const [services] = useState(MOCK_SERVICES);
  const [promos] = useState(MOCK_PROMOS);
  const [news] = useState(NEWS);

  // Data no longer synced to localStorage automatically as we use Supabase
  // useEffect(() => { localStorage.setItem('lf_clients', JSON.stringify(clients)); }, [clients]);
  // useEffect(() => { localStorage.setItem('lf_appointments', JSON.stringify(appointments)); }, [appointments]);

  // Admin auth
  const adminLogin = async (email, pass) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', pass)
        .eq('role', 'admin')
        .single();

      if (error || !data) return { ok: false, error: 'Identifiants incorrects.' };

      const u = { name: data.full_name, email: data.email, role: 'admin' };
      setAdminUser(u);
      localStorage.setItem('lf_admin', JSON.stringify(u));
      setAppMode('admin');
      return { ok: true };
    } catch (err) {
      return { ok: false, error: 'Erreur de connexion.' };
    }
  };
  const adminLogout = () => { setAdminUser(null); localStorage.removeItem('lf_admin'); setAppMode('client'); };

  // Client auth
  const clientLogin = async (email, pass) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', pass)
        .eq('role', 'client')
        .single();

      if (error || !data) return { ok: false, error: 'Email ou mot de passe incorrect.' };
      
      const c = { ...data, firstName: data.full_name.split(' ')[0], lastName: data.full_name.split(' ').slice(1).join(' ') };
      setClientUser(c);
      localStorage.setItem('lf_client_user', JSON.stringify(c));
      return { ok: true, client: c };
    } catch (err) {
      return { ok: false, error: 'Erreur de connexion.' };
    }
  };

  const clientRegister = async (data) => {
    try {
      // Check if email exists
      const { data: existing } = await supabase.from('users').select('id').eq('email', data.email).single();
      if (existing) return { ok: false, error: 'Email déjà utilisé.' };

      const { data: newU, error } = await supabase
        .from('users')
        .insert([{
          email: data.email,
          full_name: `${data.firstName} ${data.lastName}`,
          password: data.password,
          role: 'client'
        }])
        .select()
        .single();

      if (error) throw error;

      const c = { ...newU, firstName: data.firstName, lastName: data.lastName };
      setClientUser(c);
      localStorage.setItem('lf_client_user', JSON.stringify(c));
      return { ok: true, client: c };
    } catch (err) {
      return { ok: false, error: 'Erreur lors de l\'inscription.' };
    }
  };
  const clientLogout = () => { setClientUser(null); localStorage.removeItem('lf_client_user'); };

  // Appointments
  const addAppointment = async (d) => {
    const svc = services.find(s => s.id === Number(d.serviceId));
    const aptData = {
      client_id: d.clientId,
      service_id: Number(d.serviceId),
      date: d.date,
      time: d.time,
      status: 'scheduled',
      price: svc?.price || 0,
      notes: d.notes
    };

    const { data, error } = await supabase.from('appointments').insert([aptData]).select().single();
    if (!error && data) {
      setAppointments(p => [data, ...p]);
      // Update local client visits (could also be done via fetching again)
      setClients(p => p.map(c => c.id === d.clientId ? { ...c, visits: (c.visits || 0) + 1 } : c));
      return data;
    }
    return null;
  };

  const updateAppointment = async (id, d) => {
    const { error } = await supabase.from('appointments').update(d).eq('id', id);
    if (!error) {
      setAppointments(p => p.map(a => a.id === id ? { ...a, ...d } : a));
      if (d.status === 'completed') {
        const apt = appointments.find(a => a.id === id);
        if (apt) {
          // Update client stats in DB (ideally via function or trigger)
          setClients(p => p.map(c => c.id === apt.client_id ? { ...c, totalSpent: (c.totalSpent || 0) + apt.price, points: (c.points || 0) + apt.price } : c));
        }
      }
    }
  };

  const deleteAppointment = async (id) => {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (!error) setAppointments(p => p.filter(a => a.id !== id));
  };

  // Clients CRUD (admin)
  const addClient = async (d) => {
    const { data, error } = await supabase.from('users').insert([{
      email: d.email,
      full_name: `${d.firstName} ${d.lastName}`,
      password: 'client123',
      role: 'client'
    }]).select().single();

    if (!error && data) {
      const c = { ...data, firstName: d.firstName, lastName: d.lastName };
      setClients(p => [c, ...p]);
      return c;
    }
    return null;
  };

  const updateClient = async (id, d) => {
    const updateData = {};
    if (d.firstName || d.lastName) updateData.full_name = `${d.firstName || ''} ${d.lastName || ''}`.trim();
    if (d.email) updateData.email = d.email;

    const { error } = await supabase.from('users').update(updateData).eq('id', id);
    if (!error) setClients(p => p.map(c => c.id === id ? { ...c, ...d } : c));
  };

  const deleteClient = async (id) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (!error) setClients(p => p.filter(c => c.id !== id));
  };
  const getClient = (id) => clients.find(c=>c.id===id);
  const getService = (id) => services.find(s=>s.id===id);

  return (
    <Ctx.Provider value={{
      adminUser,adminLogin,adminLogout,
      clientUser,clientLogin,clientRegister,clientLogout,
      appMode,setAppMode,
      clients,addClient,updateClient,deleteClient,getClient,
      appointments,addAppointment,updateAppointment,deleteAppointment,
      services,promos,news,getService,
    }}>
      {children}
    </Ctx.Provider>
  );
}

const useApp = () => useContext(Ctx);

// ═══════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════════
const btn = (bg,color,border='none',extra={}) => ({
  display:'inline-flex',alignItems:'center',gap:8,padding:'.6rem 1.25rem',
  borderRadius:8,fontSize:'.875rem',fontWeight:500,background:bg,color,border,
  cursor:'pointer',fontFamily:FONTS.sans,transition:'all .18s',whiteSpace:'nowrap',...extra
});
const BTNS = {
  primary: btn(C.mauve,C.white,'none',{boxShadow:'0 2px 8px rgba(139,76,112,.3)'}),
  secondary: btn(C.blush,C.dark,`1px solid ${C.border}`),
  ghost: btn('transparent',C.gray,'none',{padding:'.4rem .6rem'}),
  danger: btn(C.errorBg,C.error),
  outline: btn('transparent',C.mauve,`1.5px solid ${C.mauve}`),
  white: btn(C.white,C.dark,`1px solid ${C.border}`),
  sm: {padding:'.38rem .85rem',fontSize:'.78rem'},
  wide: {width:'100%',justifyContent:'center'},
};

function Btn({variant='primary',sm,wide,style,children,...p}) {
  return <button style={{...BTNS[variant],...(sm?BTNS.sm:{}),...(wide?BTNS.wide:{}),...style}} {...p}>{children}</button>;
}

function Modal({open,onClose,title,children,large,fullscreen}) {
  useEffect(()=>{document.body.style.overflow=open?'hidden':'';return()=>{document.body.style.overflow=''}},[open]);
  if(!open) return null;
  const modalStyle = fullscreen
    ? {background:C.white,width:'100%',height:'100%',overflow:'auto',padding:'2rem'}
    : {background:C.white,borderRadius:20,padding:'2rem',width:'100%',maxWidth:large?700:520,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 12px 40px rgba(30,17,24,.13)',animation:'slideUp .25s ease'};
  return (
    <div onClick={e=>!fullscreen&&e.target===e.currentTarget&&onClose()} style={{position:'fixed',inset:0,background:'rgba(30,16,24,.5)',backdropFilter:'blur(5px)',display:'flex',alignItems:fullscreen?'flex-start':'center',justifyContent:'center',zIndex:1000,padding:fullscreen?0:'1rem',animation:'fadeIn .2s ease'}}>
      <div style={modalStyle}>
        {title&&<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem',paddingBottom:'1rem',borderBottom:`1px solid ${C.border}`}}>
          <h3 style={{fontFamily:FONTS.serif,fontSize:'1.4rem',fontWeight:500}}>{title}</h3>
          <button style={{...BTNS.ghost,fontSize:'1.4rem',lineHeight:1}} onClick={onClose}>×</button>
        </div>}
        {children}
      </div>
    </div>
  );
}

function Input({label,style,...p}) {
  return (
    <div style={{marginBottom:'1rem',...style}}>
      {label&&<label style={{display:'block',fontSize:'.75rem',fontWeight:500,color:C.gray,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:5}}>{label}</label>}
      <input style={{width:'100%',padding:'.65rem .9rem',border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:'.9rem',color:C.dark,background:C.white,outline:'none',fontFamily:FONTS.sans}} {...p} />
    </div>
  );
}

function Select({label,options,style,...p}) {
  return (
    <div style={{marginBottom:'1rem',...style}}>
      {label&&<label style={{display:'block',fontSize:'.75rem',fontWeight:500,color:C.gray,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:5}}>{label}</label>}
      <select style={{width:'100%',padding:'.65rem .9rem',border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:'.9rem',color:C.dark,background:C.white,outline:'none',fontFamily:FONTS.sans,appearance:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239A8A88' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 10px center',paddingRight:'2rem',cursor:'pointer'}} {...p}>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Textarea({label,...p}) {
  return (
    <div style={{marginBottom:'1rem'}}>
      {label&&<label style={{display:'block',fontSize:'.75rem',fontWeight:500,color:C.gray,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:5}}>{label}</label>}
      <textarea style={{width:'100%',padding:'.65rem .9rem',border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:'.9rem',color:C.dark,background:C.white,outline:'none',fontFamily:FONTS.sans,resize:'vertical',minHeight:80}} {...p} />
    </div>
  );
}

function Badge({bg,color,children}) {
  return <span style={{display:'inline-flex',alignItems:'center',gap:4,padding:'3px 10px',borderRadius:100,fontSize:'.72rem',fontWeight:500,background:bg,color}}>{children}</span>;
}

function StatusBadge({status}) {
  const m={scheduled:[C.infoBg,'#5566CC','Planifié'],confirmed:[C.successBg,C.success,'Confirmé'],completed:[C.blush,C.gray,'Terminé'],cancelled:[C.errorBg,C.error,'Annulé']};
  const [bg,c,l]=m[status]||[C.blush,C.gray,status];
  return <Badge bg={bg} color={c}>{l}</Badge>;
}

function Avatar({n1='?',n2='',size=36}) {
  return <div style={{width:size,height:size,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONTS.serif,fontSize:size<32?'.75rem':'.9rem',fontWeight:600,flexShrink:0,background:`linear-gradient(135deg,${C.roseLight},${C.mauve})`,color:'white'}}>{n1[0]}{n2[0]}</div>;
}

function Stars({rating=5,max=5}) {
  return <span>{Array.from({length:max},(_, i)=><span key={i} style={{color:i<rating?C.roseGold:C.border}}>★</span>)}</span>;
}

function ConfirmDel({open,onClose,onConfirm,name,desc}) {
  return (
    <Modal open={open} onClose={onClose} title="Confirmer la suppression">
      <div style={{textAlign:'center',padding:'1rem 0'}}>
        <div style={{width:56,height:56,borderRadius:'50%',background:C.errorBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',margin:'0 auto 1rem'}}>⚠</div>
        <p style={{marginBottom:8}}>Supprimer <strong>{name}</strong> ?</p>
        {desc&&<p style={{fontSize:'.875rem',color:C.gray}}>{desc}</p>}
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:'.75rem',marginTop:'1.5rem',paddingTop:'1.25rem',borderTop:`1px solid ${C.border}`}}>
        <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
        <Btn variant="danger" onClick={onConfirm}>Supprimer</Btn>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════
// ██████████████  CLIENT INTERFACE  ██████████████
// ═══════════════════════════════════════════════════════════════

// CLIENT NAVBAR
function ClientNav({page, setPage}) {
  const {clientUser,clientLogout,setAppMode,adminUser} = useApp();
  const [menuOpen,setMenuOpen] = useState(false);

  const nav = [
    {id:'home',label:'Accueil'},
    {id:'services',label:'Prestations'},
    {id:'booking',label:'Réserver'},
    {id:'news',label:'Actualités'},
  ];

  return (
    <nav style={{background:C.white,borderBottom:`1px solid ${C.border}`,position:'sticky',top:0,zIndex:200,boxShadow:'0 1px 8px rgba(30,17,24,.05)'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 1.5rem',display:'flex',alignItems:'center',height:64,gap:'2rem'}}>
        {/* Logo */}
        <div onClick={()=>setPage('home')} style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',flexShrink:0}}>
          <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.roseGold},${C.mauve})`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONTS.serif,fontSize:'1.1rem',color:'white',fontWeight:600}}>𝓕</div>
          <div>
            <div style={{fontFamily:FONTS.serif,fontSize:'1rem',color:C.dark,fontWeight:500,lineHeight:1}}>La Finesse</div>
            <div style={{fontSize:'.6rem',color:C.gray,textTransform:'uppercase',letterSpacing:'.1em'}}>by Nourhen</div>
          </div>
        </div>

        {/* Nav links — desktop */}
        <div style={{display:'flex',gap:'.25rem',flex:1}}>
          {nav.map(n=>(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{...BTNS.ghost,color:page===n.id?C.mauve:C.gray,fontWeight:page===n.id?500:400,background:page===n.id?'#F2EBF5':'transparent',padding:'.45rem .85rem'}}>
              {n.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{display:'flex',alignItems:'center',gap:'.6rem',flexShrink:0}}>
          {clientUser ? (
            <div style={{position:'relative'}}>
              <button onClick={()=>setMenuOpen(m=>!m)} style={{display:'flex',alignItems:'center',gap:8,background:C.blush,borderRadius:100,padding:'5px 14px 5px 5px',border:'none',cursor:'pointer'}}>
                <Avatar n1={clientUser.firstName} n2={clientUser.lastName} size={28}/>
                <span style={{fontSize:'.82rem',fontWeight:500,color:C.dark}}>{clientUser.firstName}</span>
                <span style={{fontSize:'.7rem',color:C.gray}}>▾</span>
              </button>
              {menuOpen&&(
                <div style={{position:'absolute',right:0,top:'110%',background:C.white,border:`1px solid ${C.border}`,borderRadius:12,boxShadow:'0 8px 24px rgba(30,17,24,.1)',minWidth:180,overflow:'hidden',animation:'slideUp .15s ease'}}>
                  <button onClick={()=>{setPage('account');setMenuOpen(false);}} style={{...BTNS.ghost,width:'100%',justifyContent:'flex-start',padding:'.75rem 1rem',borderRadius:0,color:C.dark}}>👤 Mon compte</button>
                  <button onClick={()=>{setPage('loyalty');setMenuOpen(false);}} style={{...BTNS.ghost,width:'100%',justifyContent:'flex-start',padding:'.75rem 1rem',borderRadius:0,color:C.dark}}>💎 Fidélité</button>
                  <div style={{height:1,background:C.border}}/>
                  <button onClick={()=>{clientLogout();setMenuOpen(false);}} style={{...BTNS.ghost,width:'100%',justifyContent:'flex-start',padding:'.75rem 1rem',borderRadius:0,color:C.error}}>⏻ Déconnexion</button>
                </div>
              )}
            </div>
          ) : (
            <Btn variant="outline" sm onClick={()=>setPage('client-login')}>Se connecter</Btn>
          )}
          {/* Switch to admin */}
          {adminUser&&<Btn variant="secondary" sm onClick={()=>setAppMode('admin')} style={{borderColor:C.mauve,color:C.mauve}}>⚙ Admin</Btn>}
        </div>
      </div>
    </nav>
  );
}

// CLIENT HOME
function ClientHome({setPage}) {
  const {services,clientUser} = useApp();
  const popular = services.filter(s=>s.popular);
  const cats = [...new Set(services.map(s=>s.category))];
  const h=T.getHours();
  const greet = h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir';

  return (
    <div>
      {/* Hero */}
      <div style={{background:C.noir,padding:'5rem 1.5rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 30% 50%, rgba(201,149,108,.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(139,76,112,.1) 0%, transparent 60%)'}}/>
        <div style={{position:'relative',maxWidth:680,margin:'0 auto',animation:'slideUp .5s ease'}}>
          {clientUser&&<p style={{color:C.roseGold,fontSize:'.9rem',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'1rem'}}>{greet}, {clientUser.firstName} 🌸</p>}
          <h1 style={{fontFamily:FONTS.serif,fontSize:'3.5rem',color:C.white,fontWeight:400,lineHeight:1.1,marginBottom:'1.5rem'}}>
            L'Art de la<br/><em style={{color:C.roseGold}}>Beauté Raffinée</em>
          </h1>
          <p style={{color:'rgba(255,255,255,.55)',fontSize:'1.05rem',marginBottom:'2.5rem',lineHeight:1.7}}>
            Salon de beauté haut de gamme au Jardin El Manzah2.<br/>
            Prenez soin de vous avec nos expertes.
          </p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <Btn variant="primary" style={{padding:'.85rem 2.5rem',fontSize:'1rem',boxShadow:'0 4px 20px rgba(139,76,112,.4)'}} onClick={()=>setPage('booking')}>
              Prendre rendez-vous
            </Btn>
            <Btn variant="white" style={{padding:'.85rem 2rem',fontSize:'1rem'}} onClick={()=>setPage('services')}>
              Nos prestations
            </Btn>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{background:C.blush,borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'1.25rem 1.5rem',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',textAlign:'center'}}>
          {[['500+','Clientes satisfaites'],['10','Prestations signatures'],['5★','Note moyenne'],['Jardin El Manzah 2','Tunis']].map(([v,l])=>(
            <div key={l}>
              <div style={{fontFamily:FONTS.serif,fontSize:'1.5rem',color:C.mauve,fontWeight:600}}>{v}</div>
              <div style={{fontSize:'.75rem',color:C.gray}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'3rem 1.5rem'}}>
        {/* Popular services */}
        <div style={{marginBottom:'3rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
            <div>
              <h2 style={{fontFamily:FONTS.serif,fontSize:'1.8rem',marginBottom:4}}>Nos prestations phares</h2>
              <p style={{color:C.gray,fontSize:'.875rem'}}>Sélectionnées par nos expertes</p>
            </div>
            <Btn variant="outline" sm onClick={()=>setPage('services')}>Voir tout →</Btn>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'1.25rem'}}>
            {popular.map(svc=>(
              <ServiceCard key={svc.id} svc={svc} onBook={()=>setPage('booking')}/>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div style={{marginBottom:'3rem'}}>
          <h2 style={{fontFamily:FONTS.serif,fontSize:'1.8rem',marginBottom:'1.5rem'}}>Nos domaines d'expertise</h2>
          <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
            {cats.map(cat=>(
              <div key={cat} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:'1rem 1.5rem',display:'flex',alignItems:'center',gap:10,cursor:'pointer',transition:'box-shadow .18s',boxShadow:'0 1px 4px rgba(30,17,24,.04)'}}
                onClick={()=>setPage('services')}>
                <div style={{width:36,height:36,borderRadius:8,background:C.blush,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem'}}>
                  {cat==='Visage'?'✦':cat==='Ongles'?'💅':cat==='Épilation'?'🌿':cat==='Corps'?'💆':cat==='Maquillage'?'💄':'✂'}
                </div>
                <div>
                  <div style={{fontSize:'.9rem',fontWeight:500}}>{cat}</div>
                  <div style={{fontSize:'.72rem',color:C.gray}}>{services.filter(s=>s.category===cat).length} soins</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA if not logged in */}
        {!clientUser&&(
          <div style={{background:`linear-gradient(135deg,${C.noir},${C.plum})`,borderRadius:20,padding:'3rem',textAlign:'center',color:C.white}}>
            <h2 style={{fontFamily:FONTS.serif,fontSize:'1.75rem',marginBottom:'.75rem'}}>Créez votre compte cliente</h2>
            <p style={{color:'rgba(255,255,255,.6)',marginBottom:'1.75rem',fontSize:'.95rem'}}>Gérez vos rendez-vous, suivez votre fidélité et recevez des offres personnalisées.</p>
            <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
              <Btn variant="primary" onClick={()=>setPage('client-login')}>S'inscrire gratuitement</Btn>
              <Btn variant="white" onClick={()=>setPage('client-login')}>Se connecter</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// SERVICE CARD (client-facing)
function ServiceCard({svc,onBook,compact}) {
  return (
    <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:'hidden',transition:'box-shadow .2s,transform .2s',boxShadow:'0 1px 4px rgba(30,17,24,.05)'}}>
      <div style={{height:compact?0:100,background:`linear-gradient(135deg,${svc.color}22,${svc.color}44)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem',borderBottom:compact?'none':`1px solid ${C.border}`}}>
        {!compact&&(svc.category==='Visage'?'✦':svc.category==='Ongles'?'💅':svc.category==='Épilation'?'🌿':svc.category==='Corps'?'💆':svc.category==='Maquillage'?'💄':'✂')}
      </div>
      <div style={{padding:'1.1rem'}}>
        {svc.popular&&<Badge bg='#FBF0E9' color={C.roseGold} style={{marginBottom:6}}>★ Populaire</Badge>}
        <div style={{fontSize:'.95rem',fontWeight:500,marginTop:4,marginBottom:4}}>{svc.name}</div>
        {!compact&&<p style={{fontSize:'.78rem',color:C.gray,marginBottom:'1rem',lineHeight:1.5}}>{svc.description}</p>}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:compact?8:0}}>
          <div>
            <span style={{fontFamily:FONTS.serif,fontSize:'1.3rem',fontWeight:600,color:svc.color}}>{svc.price}</span>
            <span style={{fontSize:'.75rem',color:C.gray,marginLeft:3}}>DT · {svc.duration}min</span>
          </div>
          {onBook&&<Btn variant="primary" sm onClick={onBook}>Réserver</Btn>}
        </div>
      </div>
    </div>
  );
}

// SERVICES PAGE (client)
function ClientServices({setPage}) {
  const {services} = useApp();
  const [cat,setCat] = useState('all');
  const cats = [...new Set(services.map(s=>s.category))];
  const filtered = cat==='all'?services:services.filter(s=>s.category===cat);
  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:'2.5rem 1.5rem',animation:'fadeIn .3s ease'}}>
      <h2 style={{fontFamily:FONTS.serif,fontSize:'2rem',marginBottom:'.5rem'}}>Nos Prestations</h2>
      <p style={{color:C.gray,marginBottom:'2rem'}}>Tous nos soins réalisés par des expertes passionnées.</p>
      <div style={{display:'flex',gap:'.6rem',flexWrap:'wrap',marginBottom:'2rem'}}>
        {['all',...cats].map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{padding:'.45rem 1.1rem',borderRadius:100,fontSize:'.82rem',border:`1.5px solid ${cat===c?C.mauve:C.border}`,background:cat===c?C.mauve:C.white,color:cat===c?'white':C.gray,cursor:'pointer',fontFamily:FONTS.sans,transition:'all .18s'}}>
            {c==='all'?`Tous (${services.length})`:`${c} (${services.filter(s=>s.category===c).length})`}
          </button>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.25rem'}}>
        {filtered.map(svc=><ServiceCard key={svc.id} svc={svc} onBook={()=>setPage('booking')}/>)}
      </div>
    </div>
  );
}

// BOOKING FLOW
function BookingFlow({setPage}) {
  const {services,clients,addAppointment,clientUser} = useApp();
  const [step,setStep] = useState(1); // 1=service 2=datetime 3=confirm 4=done
  const [sel,setSel] = useState({service:null,date:'',time:'',notes:'',promoCode:''});
  const [discount,setDiscount] = useState(null);
  const [promoError,setPromoError] = useState('');
  const {promos} = useApp();

  const todayStr = fmt(T);
  const times = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'];
  const cats = [...new Set(services.map(s=>s.category))];
  const [filterCat,setFilterCat] = useState('all');
  const filtered = filterCat==='all'?services:services.filter(s=>s.category===filterCat);

  const finalPrice = sel.service ? (discount ? sel.service.price*(1-discount/100) : sel.service.price) : 0;

  const applyPromo = () => {
    const promo = promos.find(p=>p.code===sel.promoCode.toUpperCase()&&(!p.clientId||(clientUser&&p.clientId===clientUser.id)));
    if(promo) { setDiscount(promo.discount); setPromoError(''); }
    else setPromoError('Code invalide ou non applicable.');
  };

  const confirm = () => {
    if(!clientUser) { setPage('client-login'); return; }
    addAppointment({client_id:clientUser.id,service_id:sel.service.id,date:sel.date,time:sel.time,notes:sel.notes});
    setStep(4);
  };

  const Step = ({n,label}) => (
    <div style={{display:'flex',alignItems:'center',gap:8}}>
      <div style={{width:28,height:28,borderRadius:'50%',background:step>=n?C.mauve:C.border,color:step>=n?'white':C.gray,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.8rem',fontWeight:600,transition:'all .3s'}}>{step>n?'✓':n}</div>
      <span style={{fontSize:'.82rem',color:step>=n?C.mauve:C.gray,fontWeight:step===n?500:400}}>{label}</span>
    </div>
  );

  return (
    <div style={{maxWidth:860,margin:'0 auto',padding:'2.5rem 1.5rem',animation:'fadeIn .3s ease'}}>
      <h2 style={{fontFamily:FONTS.serif,fontSize:'2rem',marginBottom:'.5rem'}}>Prendre rendez-vous</h2>
      <p style={{color:C.gray,fontSize:'.875rem',marginBottom:'2rem'}}>Réservez en quelques clics — confirmation immédiate.</p>

      {/* Stepper */}
      {step<4&&(
        <div style={{display:'flex',gap:'2rem',marginBottom:'2.5rem',flexWrap:'wrap'}}>
          <Step n={1} label="Prestation"/>
          <div style={{color:C.border,alignSelf:'center'}}>—</div>
          <Step n={2} label="Date & Heure"/>
          <div style={{color:C.border,alignSelf:'center'}}>—</div>
          <Step n={3} label="Confirmation"/>
        </div>
      )}

      {/* Step 1 — Service */}
      {step===1&&(
        <div>
          <div style={{display:'flex',gap:'.6rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>
            {['all',...cats].map(c=>(
              <button key={c} onClick={()=>setFilterCat(c)} style={{padding:'.4rem .9rem',borderRadius:100,fontSize:'.78rem',border:`1.5px solid ${filterCat===c?C.mauve:C.border}`,background:filterCat===c?C.mauve:C.white,color:filterCat===c?'white':C.gray,cursor:'pointer',fontFamily:FONTS.sans}}>
                {c==='all'?'Tous':c}
              </button>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'1rem'}}>
            {filtered.map(svc=>(
              <div key={svc.id} onClick={()=>{setSel(s=>({...s,service:svc}));setStep(2);}} style={{background:sel.service?.id===svc.id?'#F2EBF5':C.white,border:`2px solid ${sel.service?.id===svc.id?C.mauve:C.border}`,borderRadius:12,padding:'1.1rem',cursor:'pointer',transition:'all .18s'}}>
                <div style={{fontSize:'.95rem',fontWeight:500,marginBottom:4}}>{svc.name}</div>
                <div style={{fontSize:'.78rem',color:C.gray,marginBottom:'1rem'}}>{svc.duration} min</div>
                <div style={{fontFamily:FONTS.serif,fontSize:'1.3rem',fontWeight:600,color:svc.color}}>{svc.price} DT</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Date & Time */}
      {step===2&&(
        <div style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,padding:'2rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem',background:C.blush,borderRadius:10,marginBottom:'2rem'}}>
            <div style={{width:44,height:44,borderRadius:8,background:`${sel.service.color}22`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem'}}>✦</div>
            <div>
              <div style={{fontWeight:500}}>{sel.service.name}</div>
              <div style={{fontSize:'.8rem',color:C.gray}}>{sel.service.duration} min · {sel.service.price} DT</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem'}}>
            <div>
              <div style={{fontSize:'.78rem',textTransform:'uppercase',letterSpacing:'.06em',color:C.gray,marginBottom:'.75rem'}}>Choisir la date</div>
              <input type="date" min={todayStr} value={sel.date} onChange={e=>setSel(s=>({...s,date:e.target.value}))}
                style={{width:'100%',padding:'.65rem .9rem',border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:'.9rem',fontFamily:FONTS.sans,outline:'none'}}/>
            </div>
            <div>
              <div style={{fontSize:'.78rem',textTransform:'uppercase',letterSpacing:'.06em',color:C.gray,marginBottom:'.75rem'}}>Choisir l'heure</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.5rem',maxHeight:200,overflowY:'auto'}}>
                {times.map(t=>(
                  <button key={t} onClick={()=>setSel(s=>({...s,time:t}))} style={{padding:'.45rem',borderRadius:8,border:`1.5px solid ${sel.time===t?C.mauve:C.border}`,background:sel.time===t?C.mauve:C.white,color:sel.time===t?'white':C.dark,cursor:'pointer',fontSize:'.82rem',fontFamily:FONTS.sans}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Textarea label="Notes (optionnel)" value={sel.notes} onChange={e=>setSel(s=>({...s,notes:e.target.value}))} placeholder="Informations utiles pour la praticienne…" style={{marginTop:'1.5rem'}}/>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:'1.5rem'}}>
            <Btn variant="secondary" onClick={()=>setStep(1)}>← Retour</Btn>
            <Btn variant="primary" onClick={()=>{if(sel.date&&sel.time)setStep(3);}} style={{opacity:sel.date&&sel.time?1:.5}}>Continuer →</Btn>
          </div>
        </div>
      )}

      {/* Step 3 — Confirm */}
      {step===3&&(
        <div style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,padding:'2rem'}}>
          <h3 style={{fontFamily:FONTS.serif,fontSize:'1.4rem',marginBottom:'1.5rem'}}>Récapitulatif</h3>
          {[['Prestation',sel.service.name],['Durée',`${sel.service.duration} min`],['Date',new Date(sel.date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})],['Heure',sel.time]].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'.6rem 0',borderBottom:`1px solid ${C.border}`,fontSize:'.9rem'}}>
              <span style={{color:C.gray}}>{k}</span><strong>{v}</strong>
            </div>
          ))}
          {sel.notes&&<div style={{marginTop:'1rem',background:C.blush,borderRadius:8,padding:'.75rem',fontSize:'.82rem',color:C.gray}}><strong>Notes :</strong> {sel.notes}</div>}

          {/* Promo */}
          <div style={{marginTop:'1.5rem'}}>
            <div style={{fontSize:'.78rem',textTransform:'uppercase',letterSpacing:'.06em',color:C.gray,marginBottom:'.5rem'}}>Code promo</div>
            <div style={{display:'flex',gap:'.75rem'}}>
              <input value={sel.promoCode} onChange={e=>setSel(s=>({...s,promoCode:e.target.value}))} placeholder="Entrez votre code…"
                style={{flex:1,padding:'.6rem .9rem',border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:'.875rem',fontFamily:FONTS.sans,outline:'none'}}/>
              <Btn variant="secondary" onClick={applyPromo}>Appliquer</Btn>
            </div>
            {promoError&&<p style={{color:C.error,fontSize:'.78rem',marginTop:4}}>{promoError}</p>}
            {discount&&<p style={{color:C.success,fontSize:'.82rem',marginTop:4}}>✓ Réduction de {discount}% appliquée !</p>}
          </div>

          {/* Price */}
          <div style={{background:C.blush,borderRadius:10,padding:'1rem 1.25rem',marginTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontWeight:500}}>Total</span>
            <div>
              {discount&&<span style={{textDecoration:'line-through',color:C.gray,marginRight:8,fontSize:'.875rem'}}>{sel.service.price} DT</span>}
              <span style={{fontFamily:FONTS.serif,fontSize:'1.5rem',fontWeight:600,color:C.mauve}}>{finalPrice.toFixed(0)} DT</span>
            </div>
          </div>

          {!clientUser&&<div style={{background:C.warningBg,borderLeft:`3px solid ${C.warning}`,borderRadius:8,padding:'.75rem 1rem',marginTop:'1rem',fontSize:'.82rem',color:C.dark}}>⚠ Vous devez être <strong>connectée</strong> pour confirmer votre réservation.</div>}

          <div style={{display:'flex',justifyContent:'space-between',marginTop:'1.5rem'}}>
            <Btn variant="secondary" onClick={()=>setStep(2)}>← Retour</Btn>
            <Btn variant="primary" onClick={confirm} style={{padding:'.7rem 2rem'}}>
              {clientUser?'Confirmer le rendez-vous →':'Se connecter pour confirmer →'}
            </Btn>
          </div>
        </div>
      )}

      {/* Step 4 — Done */}
      {step===4&&(
        <div style={{textAlign:'center',padding:'3rem 2rem',background:C.white,borderRadius:20,border:`1px solid ${C.border}`,animation:'slideUp .35s ease'}}>
          <div style={{width:80,height:80,borderRadius:'50%',background:C.successBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem',margin:'0 auto 1.5rem'}}>✓</div>
          <h2 style={{fontFamily:FONTS.serif,fontSize:'2rem',marginBottom:'.75rem',color:C.success}}>Rendez-vous confirmé !</h2>
          <p style={{color:C.gray,marginBottom:'.5rem'}}>Votre prestation <strong>{sel.service?.name}</strong></p>
          <p style={{color:C.gray,marginBottom:'2rem'}}>Le <strong>{sel.date&&new Date(sel.date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</strong> à <strong>{sel.time}</strong></p>
          <p style={{fontSize:'.82rem',color:C.gray,marginBottom:'2rem'}}>Un rappel vous sera envoyé la veille. À bientôt au salon ! 🌸</p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <Btn variant="primary" onClick={()=>setPage('account')}>Voir mes rendez-vous</Btn>
            <Btn variant="secondary" onClick={()=>{setStep(1);setSel({service:null,date:'',time:'',notes:'',promoCode:''});setDiscount(null);}}>Nouveau rendez-vous</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// CLIENT ACCOUNT
function ClientAccount({setPage}) {
  const {clientUser,clientLogout,appointments,services,updateAppointment} = useApp();
  const [tab,setTab] = useState('upcoming');
  const todayStr=fmt(T);

  if(!clientUser) return (
    <div style={{maxWidth:480,margin:'4rem auto',textAlign:'center',padding:'2rem'}}>
      <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🔒</div>
      <h2 style={{fontFamily:FONTS.serif,fontSize:'1.75rem',marginBottom:'.75rem'}}>Espace personnel</h2>
      <p style={{color:C.gray,marginBottom:'2rem'}}>Connectez-vous pour accéder à votre compte.</p>
      <Btn variant="primary" wide onClick={()=>setPage('client-login')}>Se connecter</Btn>
    </div>
  );

  const myApts = appointments.filter(a=>a.client_id===clientUser.id);
  const upcoming = myApts.filter(a=>a.date>=todayStr&&!['completed','cancelled'].includes(a.status)).sort((a,b)=>a.date.localeCompare(b.date));
  const past = myApts.filter(a=>a.status==='completed'||a.date<todayStr).sort((a,b)=>b.date.localeCompare(a.date));
  const getService = id=>services.find(s=>s.id===id);

  const cancelApt = (id)=>{ if(window.confirm('Annuler ce rendez-vous ?')) updateAppointment(id,{status:'cancelled'}); };

  const AptCard = ({apt,canCancel}) => {
    const svc=getService(apt.service_id);
    return (
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:'1.1rem',display:'flex',gap:'1rem',alignItems:'center'}}>
        <div style={{width:48,height:48,borderRadius:10,background:`${svc?.color||C.roseGold}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>
          {svc?.category==='Visage'?'✦':svc?.category==='Ongles'?'💅':'✂'}
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:500,fontSize:'.95rem'}}>{svc?.name||'Prestation'}</div>
          <div style={{fontSize:'.78rem',color:C.gray,marginTop:2}}>
            {new Date(apt.date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short',year:'numeric'})} à {apt.time}
          </div>
          {apt.notes&&<div style={{fontSize:'.72rem',color:C.warning,marginTop:2}}>📝 {apt.notes}</div>}
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
          <StatusBadge status={apt.status}/>
          <span style={{fontFamily:FONTS.serif,fontSize:'1rem',fontWeight:600,color:C.mauve}}>{apt.price} DT</span>
          {canCancel&&apt.status!=='cancelled'&&<Btn variant="danger" sm onClick={()=>cancelApt(apt.id)}>Annuler</Btn>}
        </div>
      </div>
    );
  };

  return (
    <div style={{maxWidth:800,margin:'0 auto',padding:'2.5rem 1.5rem',animation:'fadeIn .3s ease'}}>
      {/* Profile header */}
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:16,padding:'1.75rem',marginBottom:'2rem',display:'flex',alignItems:'center',gap:'1.5rem'}}>
        <Avatar n1={clientUser.firstName} n2={clientUser.lastName} size={64}/>
        <div style={{flex:1}}>
          <h2 style={{fontFamily:FONTS.serif,fontSize:'1.75rem',fontWeight:500}}>{clientUser.firstName} {clientUser.lastName}</h2>
          <p style={{color:C.gray,fontSize:'.875rem'}}>{clientUser.email} · {clientUser.phone}</p>
          <div style={{display:'flex',gap:'.75rem',marginTop:'.75rem',flexWrap:'wrap'}}>
            <Badge bg={C.blush} color={C.mauve}>{clientUser.visits} visite{clientUser.visits!==1?'s':''}</Badge>
            <Badge bg={C.successBg} color={C.success}>{clientUser.totalSpent} DT dépensés</Badge>
            <Badge bg='#FBF0E9' color={C.roseGold}>💎 {clientUser.points} pts</Badge>
          </div>
        </div>
        <Btn variant="secondary" sm onClick={()=>setPage('loyalty')}>Voir fidélité</Btn>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:'.5rem',marginBottom:'1.5rem'}}>
        {[['upcoming',`À venir (${upcoming.length})`],['past','Historique']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'.5rem 1.25rem',borderRadius:100,border:`1.5px solid ${tab===t?C.mauve:C.border}`,background:tab===t?C.mauve:'transparent',color:tab===t?'white':C.gray,cursor:'pointer',fontSize:'.85rem',fontFamily:FONTS.sans}}>
            {l}
          </button>
        ))}
        <Btn variant="primary" sm onClick={()=>setPage('booking')} style={{marginLeft:'auto'}}>+ Nouveau RDV</Btn>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
        {(tab==='upcoming'?upcoming:past).length===0 ? (
          <div style={{textAlign:'center',padding:'3rem',color:C.gray,background:C.white,borderRadius:12,border:`1px solid ${C.border}`}}>
            {tab==='upcoming'?'Aucun rendez-vous à venir. 📅':'Aucun historique.'}
          </div>
        ) : (tab==='upcoming'?upcoming:past).map(apt=><AptCard key={apt.id} apt={apt} canCancel={tab==='upcoming'}/>)}
      </div>
    </div>
  );
}

// LOYALTY PAGE
function LoyaltyPage({setPage}) {
  const {clientUser,promos} = useApp();
  const myPromos = promos.filter(p=>!p.clientId||(clientUser&&p.clientId===clientUser.id));

  if(!clientUser) return (
    <div style={{maxWidth:480,margin:'4rem auto',textAlign:'center',padding:'2rem'}}>
      <div style={{fontSize:'3rem',marginBottom:'1rem'}}>💎</div>
      <h2 style={{fontFamily:FONTS.serif,fontSize:'1.75rem',marginBottom:'.75rem'}}>Programme de fidélité</h2>
      <p style={{color:C.gray,marginBottom:'2rem'}}>Connectez-vous pour accéder à vos avantages.</p>
      <Btn variant="primary" wide onClick={()=>setPage('client-login')}>Se connecter</Btn>
    </div>
  );

  const pts=clientUser.points||0;
  const nextLevel = pts<200?200:pts<500?500:pts<1000?1000:null;
  const pct = nextLevel?Math.min((pts/(nextLevel))*100,100):100;
  const level = pts<200?'Bronze':pts<500?'Silver':pts<1000?'Gold':'VIP Platinum';
  const levelColor = pts<200?'#CD7F32':pts<500?C.grayLight:pts<1000?C.roseGold:C.mauve;

  return (
    <div style={{maxWidth:700,margin:'0 auto',padding:'2.5rem 1.5rem',animation:'fadeIn .3s ease'}}>
      <h2 style={{fontFamily:FONTS.serif,fontSize:'2rem',marginBottom:'.5rem'}}>Programme de fidélité</h2>
      <p style={{color:C.gray,marginBottom:'2rem'}}>Chaque visite vous rapproche de la récompense. 🌸</p>

      {/* Card */}
      <div style={{background:`linear-gradient(135deg,${C.noir},${C.plum})`,borderRadius:20,padding:'2rem',color:C.white,marginBottom:'2rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-40,right:-40,width:150,height:150,borderRadius:'50%',background:'rgba(201,149,108,.12)'}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'2rem'}}>
          <div>
            <div style={{fontSize:'.7rem',textTransform:'uppercase',letterSpacing:'.12em',color:'rgba(255,255,255,.5)'}}>Carte de fidélité</div>
            <div style={{fontFamily:FONTS.serif,fontSize:'1.4rem',marginTop:4}}>{clientUser.firstName} {clientUser.lastName}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:'.7rem',textTransform:'uppercase',letterSpacing:'.08em',color:levelColor}}>Niveau</div>
            <div style={{fontFamily:FONTS.serif,fontSize:'1.2rem',color:levelColor,fontWeight:600}}>{level}</div>
          </div>
        </div>
        <div style={{marginBottom:'.75rem',display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:'.8rem',color:'rgba(255,255,255,.6)'}}>Points</span>
          <span style={{fontSize:'.8rem',color:'rgba(255,255,255,.6)'}}>{nextLevel?`${pts} / ${nextLevel} pts`:'Niveau max atteint 🎉'}</span>
        </div>
        <div style={{height:8,background:'rgba(255,255,255,.15)',borderRadius:100,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${C.roseGold},${C.mauve})`,borderRadius:100,transition:'width 1s ease'}}/>
        </div>
        <div style={{marginTop:'1.5rem',display:'flex',gap:'2rem'}}>
          <div><div style={{fontFamily:FONTS.serif,fontSize:'1.5rem',fontWeight:600}}>{pts}</div><div style={{fontSize:'.7rem',color:'rgba(255,255,255,.5)'}}>Points cumulés</div></div>
          <div><div style={{fontFamily:FONTS.serif,fontSize:'1.5rem',fontWeight:600}}>{clientUser.visits}</div><div style={{fontSize:'.7rem',color:'rgba(255,255,255,.5)'}}>Visites</div></div>
          <div><div style={{fontFamily:FONTS.serif,fontSize:'1.5rem',fontWeight:600}}>{clientUser.totalSpent} DT</div><div style={{fontSize:'.7rem',color:'rgba(255,255,255,.5)'}}>Dépensé</div></div>
        </div>
      </div>

      {/* Levels */}
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:16,padding:'1.5rem',marginBottom:'2rem'}}>
        <h3 style={{fontFamily:FONTS.serif,fontSize:'1.2rem',marginBottom:'1.25rem'}}>Les niveaux de fidélité</h3>
        {[['Bronze','#CD7F32','0–199 pts','5% sur votre soin d\'anniversaire'],['Silver',C.grayLight,'200–499 pts','10% de réduction + 1 soin offert / 10'],['Gold',C.roseGold,'500–999 pts','15% de réduction + invitations exclusives'],['VIP Platinum',C.mauve,'1000+ pts','20% de réduction + services prioritaires']].map(([name,color,range,perk])=>(
          <div key={name} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'.75rem 0',borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:38,height:38,borderRadius:10,background:`${color}22`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONTS.serif,fontSize:'.8rem',fontWeight:600,color,flexShrink:0}}>{name[0]}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:500,fontSize:'.9rem',color}}>{name}</div>
              <div style={{fontSize:'.75rem',color:C.gray}}>{range} · {perk}</div>
            </div>
            {level===name&&<Badge bg={`${color}22`} color={color}>✓ Votre niveau</Badge>}
          </div>
        ))}
      </div>

      {/* Promos */}
      {myPromos.length>0&&(
        <div>
          <h3 style={{fontFamily:FONTS.serif,fontSize:'1.2rem',marginBottom:'1rem'}}>Vos offres personnelles</h3>
          <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
            {myPromos.map(p=>(
              <div key={p.id} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                <div style={{width:44,height:44,borderRadius:10,background:C.warningBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>🎁</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500}}>{p.label}</div>
                  <div style={{fontSize:'.78rem',color:C.gray}}>Valable jusqu'au {new Date(p.validUntil+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</div>
                </div>
                <div>
                  <Badge bg={C.warningBg} color={C.warning}>-{p.discount}%</Badge>
                  <div style={{fontSize:'.72rem',color:C.gray,marginTop:4,textAlign:'center',fontFamily:'monospace'}}>{p.code}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// NEWS PAGE
function NewsPage() {
  const {news} = useApp();
  return (
    <div style={{maxWidth:800,margin:'0 auto',padding:'2.5rem 1.5rem',animation:'fadeIn .3s ease'}}>
      <h2 style={{fontFamily:FONTS.serif,fontSize:'2rem',marginBottom:'.5rem'}}>Actualités du salon</h2>
      <p style={{color:C.gray,marginBottom:'2rem'}}>Suivez les dernières nouvelles et offres de La Finesse. 🌸</p>
      <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
        {news.map(n=>(
          <div key={n.id} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:16,overflow:'hidden'}}>
            <div style={{background:`linear-gradient(135deg,${C.blush},${C.roseLight})`,padding:'1.5rem',display:'flex',gap:'1.25rem',alignItems:'center'}}>
              <div style={{fontSize:'2.5rem',flexShrink:0}}>{n.emoji}</div>
              <div>
                <h3 style={{fontFamily:FONTS.serif,fontSize:'1.3rem',marginBottom:4}}>{n.title}</h3>
                <div style={{fontSize:'.75rem',color:C.gray}}>{new Date(n.date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
              </div>
            </div>
            <div style={{padding:'1.25rem',fontSize:'.9rem',color:C.dark,lineHeight:1.7}}>{n.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// CLIENT LOGIN / REGISTER
function ClientAuth({setPage}) {
  const {clientLogin,clientRegister} = useApp();
  const [mode,setMode] = useState('login');
  const [form,setForm] = useState({email:'',password:'',firstName:'',lastName:'',phone:''});
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(false);
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    await new Promise(r=>setTimeout(r,400));
    const res = mode==='login' ? clientLogin(form.email,form.password) : clientRegister(form);
    if(res.ok) setPage('account');
    else setError(res.error);
    setLoading(false);
  };

  return (
    <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{width:'100%',maxWidth:420,animation:'slideUp .3s ease'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{width:56,height:56,borderRadius:16,background:`linear-gradient(135deg,${C.roseGold},${C.mauve})`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONTS.serif,fontSize:'1.5rem',color:'white',margin:'0 auto .75rem'}}>𝓕</div>
          <h2 style={{fontFamily:FONTS.serif,fontSize:'1.75rem'}}>{mode==='login'?'Connexion':'Créer un compte'}</h2>
          <p style={{color:C.gray,fontSize:'.875rem',marginTop:4}}>{mode==='login'?'Accédez à votre espace personnel.':'Rejoignez La Finesse by Nourhen.'}</p>
        </div>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:20,padding:'2rem',boxShadow:'0 4px 20px rgba(30,17,24,.07)'}}>
          {error&&<div style={{background:C.errorBg,borderLeft:`3px solid ${C.error}`,padding:'.75rem 1rem',borderRadius:8,fontSize:'.875rem',color:C.error,marginBottom:'1rem'}}>⚠ {error}</div>}
          <form onSubmit={handleSubmit}>
            {mode==='register'&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem'}}><Input label="Prénom *" value={form.firstName} onChange={e=>sf('firstName',e.target.value)} required/><Input label="Nom *" value={form.lastName} onChange={e=>sf('lastName',e.target.value)} required/></div>}
            {mode==='register'&&<Input label="Téléphone *" value={form.phone} onChange={e=>sf('phone',e.target.value)} placeholder="+216 XX XXX XXX" required/>}
            <Input label="Email *" type="email" value={form.email} onChange={e=>sf('email',e.target.value)} placeholder="votre@email.com" required autoFocus/>
            <Input label="Mot de passe *" type="password" value={form.password} onChange={e=>sf('password',e.target.value)} placeholder="••••••••" required/>
            <Btn variant="primary" wide style={{marginTop:'.5rem'}} type="submit">
              {loading?'Chargement…':mode==='login'?'Se connecter →':'Créer mon compte →'}
            </Btn>
          </form>
          <div style={{textAlign:'center',marginTop:'1.25rem',fontSize:'.82rem',color:C.gray}}>
            {mode==='login'?<>Pas encore de compte ?<button onClick={()=>{setMode('register');setError('');}} style={{...BTNS.ghost,color:C.mauve,padding:'0 4px',fontSize:'.82rem'}}> S'inscrire</button></>
              :<>Déjà un compte ?<button onClick={()=>{setMode('login');setError('');}} style={{...BTNS.ghost,color:C.mauve,padding:'0 4px',fontSize:'.82rem'}}> Se connecter</button></>}
          </div>
          {mode==='login'&&<div style={{background:C.blush,borderRadius:8,padding:'.75rem 1rem',marginTop:'1rem',fontSize:'.75rem',color:C.gray,borderLeft:`3px solid ${C.roseGold}`}}><strong style={{color:C.dark}}>Démo :</strong> yasmine.benali@email.com / yasmine123</div>}
        </div>
        <div style={{textAlign:'center',marginTop:'1rem'}}>
          <button style={{...BTNS.ghost,color:C.gray,fontSize:'.82rem'}} onClick={()=>setPage('home')}>← Retour à l'accueil</button>
        </div>
      </div>
    </div>
  );
}

// CLIENT FOOTER
function ClientFooter() {
  return (
    <footer style={{background:C.noir,color:'rgba(255,255,255,.5)',padding:'2.5rem 1.5rem',marginTop:'auto'}}>
      <div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${C.roseGold},${C.mauve})`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONTS.serif,fontSize:'.85rem',color:'white'}}>𝓕</div>
          <div>
            <div style={{fontFamily:FONTS.serif,fontSize:'.95rem',color:C.white}}>La Finesse by Nourhen</div>
            <div style={{fontSize:'.65rem',textTransform:'uppercase',letterSpacing:'.1em'}}>Salon de beauté · Jardin El Manzah 2, Tunis</div>
          </div>
        </div>
        <div style={{fontSize:'.75rem',textAlign:'right'}}>
          <div>📞 +216 52 39 39 56</div>
          <div>📍 Jardin El Manzah 2, Tunis, Tunisie</div>
          <div>🕐 Lun–Dim : 10:00–20:00</div>
        </div>
      </div>
    </footer>
  );
}

// CLIENT APP WRAPPER
function ClientApp() {
  const {setAppMode,adminUser} = useApp();
  const [page,setPage] = useState('home');

  const pages = {
    home:<ClientHome setPage={setPage}/>,
    services:<ClientServices setPage={setPage}/>,
    booking:<BookingFlow setPage={setPage}/>,
    account:<ClientAccount setPage={setPage}/>,
    loyalty:<LoyaltyPage setPage={setPage}/>,
    news:<NewsPage/>,
    'client-login':<ClientAuth setPage={setPage}/>,
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',background:C.cream}}>
      <ClientNav page={page} setPage={setPage}/>
      <main style={{flex:1}}>
        {pages[page]||<ClientHome setPage={setPage}/>}
      </main>
      <ClientFooter/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ██████████████  ADMIN INTERFACE  ██████████████
// ═══════════════════════════════════════════════════════════════

// ADMIN SIDEBAR
function AdminSidebar({page,setPage,collapsed}) {
  const {adminLogout,setAppMode} = useApp();
  const navs=[
    {id:'dashboard',icon:'◇',label:'Tableau de bord'},
    {id:'agenda',icon:'◷',label:'Agenda'},
    {id:'clients',icon:'♀',label:'Clientes'},
    {id:'services',icon:'✦',label:'Prestations'},
    {id:'finance',icon:'◈',label:'Finances'},
    {id:'marketing',icon:'◉',label:'Marketing'},
    {id:'settings',icon:'⚙',label:'Paramètres'},
  ];
  return (
    <aside style={{position:'fixed',top:0,left:0,height:'100vh',width:collapsed?72:255,background:C.noir,display:'flex',flexDirection:'column',zIndex:100,overflow:'hidden',transition:'width .3s ease'}}>
      <div style={{padding:'1.25rem',borderBottom:'1px solid rgba(255,255,255,.07)',display:'flex',alignItems:'center',gap:12,minHeight:64}}>
        <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.roseGold},${C.mauve})`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONTS.serif,fontSize:'1.1rem',color:'white',fontWeight:600,flexShrink:0}}>F</div>
        {!collapsed&&<div><div style={{fontFamily:FONTS.serif,fontSize:'1rem',color:C.white,fontWeight:500,whiteSpace:'nowrap'}}>La Finesse</div><div style={{fontSize:'.6rem',color:C.gray,textTransform:'uppercase',letterSpacing:'.1em',whiteSpace:'nowrap'}}>Admin</div></div>}
      </div>
      <nav style={{flex:1,padding:'1rem .75rem',overflowY:'auto',overflowX:'hidden'}}>
        {!collapsed&&<div style={{fontSize:'.62rem',textTransform:'uppercase',letterSpacing:'.1em',color:'rgba(255,255,255,.25)',padding:'0 .5rem',margin:'0 0 .5rem'}}>Navigation</div>}
        {navs.map(n=>{
          const active=page===n.id;
          return <button key={n.id} onClick={()=>setPage(n.id)} title={collapsed?n.label:''} style={{display:'flex',alignItems:'center',gap:12,padding:'.65rem .75rem',borderRadius:8,color:active?C.roseGold:'rgba(255,255,255,.55)',fontSize:'.875rem',cursor:'pointer',background:active?'rgba(201,149,108,.18)':'transparent',marginBottom:2,border:active?`1px solid rgba(201,149,108,.2)`:'1px solid transparent',width:'100%',fontFamily:FONTS.sans,justifyContent:collapsed?'center':'flex-start',transition:'all .18s'}}>
            <span style={{fontSize:'1rem',width:20,textAlign:'center',flexShrink:0}}>{n.icon}</span>
            {!collapsed&&<span style={{whiteSpace:'nowrap'}}>{n.label}</span>}
          </button>;
        })}
      </nav>
      <div style={{padding:'1rem .75rem',borderTop:'1px solid rgba(255,255,255,.07)'}}>
        <button onClick={()=>setAppMode('client')} title={collapsed?'Interface client':''} style={{display:'flex',alignItems:'center',gap:12,padding:'.6rem .75rem',borderRadius:8,color:'rgba(255,255,255,.4)',fontSize:'.82rem',cursor:'pointer',background:'transparent',border:'none',width:'100%',fontFamily:FONTS.sans,justifyContent:collapsed?'center':'flex-start',marginBottom:4}}>
          <span style={{width:20,textAlign:'center'}}>👁</span>{!collapsed&&<span>Vue cliente</span>}
        </button>
        <button onClick={adminLogout} title={collapsed?'Déconnexion':''} style={{display:'flex',alignItems:'center',gap:12,padding:'.6rem .75rem',borderRadius:8,color:`rgba(196,97,107,.7)`,fontSize:'.82rem',cursor:'pointer',background:'transparent',border:'none',width:'100%',fontFamily:FONTS.sans,justifyContent:collapsed?'center':'flex-start'}}>
          <span style={{width:20,textAlign:'center'}}>⏻</span>{!collapsed&&<span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}

// ADMIN TOPBAR
function AdminTopbar({page,onToggle}) {
  const {adminUser,appointments} = useApp();
  const todayStr=fmt(T);
  const todayCount=appointments.filter(a=>a.date===todayStr&&a.status!=='cancelled').length;
  const TITLES={dashboard:'Tableau de bord',agenda:'Agenda',clients:'Clientes',services:'Prestations',finance:'Finances',marketing:'Marketing',settings:'Paramètres'};
  const dateLabel=T.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  return (
    <header style={{height:64,background:C.white,borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 2rem 0 1.5rem',position:'sticky',top:0,zIndex:50}}>
      <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
        <button onClick={onToggle} style={{...BTNS.ghost,fontSize:'1.1rem',padding:'.4rem .55rem'}}>☰</button>
        <span style={{fontFamily:FONTS.serif,fontSize:'1.1rem'}}>{TITLES[page]||''}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
        <span style={{fontSize:'.75rem',color:C.gray,display:'none'}} className="hide-sm">{dateLabel}</span>
        {todayCount>0&&<div style={{background:C.blush,borderRadius:100,padding:'4px 12px',fontSize:'.75rem',color:C.mauve,fontWeight:500}}>◷ {todayCount} RDV</div>}
        <div style={{display:'flex',alignItems:'center',gap:8,background:C.blush,borderRadius:100,padding:'5px 14px 5px 5px'}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${C.roseGold},${C.mauve})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.72rem',color:'white',fontWeight:600}}>{adminUser?.name?.[0]}</div>
          <span style={{fontSize:'.82rem',fontWeight:500}}>{adminUser?.name}</span>
        </div>
      </div>
    </header>
  );
}

// ADMIN DASHBOARD
function AdminDashboard({setPage}) {
  const {clients,appointments,services} = useApp();
  const todayStr=fmt(T);
  const nm=T;
  const monthStr=`${nm.getFullYear()}-${String(nm.getMonth()+1).padStart(2,'0')}`;
  const todayApts=appointments.filter(a=>a.date===todayStr&&a.status!=='cancelled');
  const monthRevenue=appointments.filter(a=>a.date.startsWith(monthStr)&&a.status==='completed').reduce((s,a)=>s+a.price,0);
  const weekRevenue=appointments.filter(a=>{const d=new Date(a.date+'T12:00:00');const wd=new Date(T);wd.setDate(wd.getDate()-7);return d>=wd&&a.status==='completed';}).reduce((s,a)=>s+a.price,0);
  const newClients=clients.filter(c=>c.createdAt?.startsWith(monthStr)).length;
  const upcoming=appointments.filter(a=>a.date>=todayStr&&!['completed','cancelled'].includes(a.status)).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).slice(0,8);
  const gc=id=>clients.find(c=>c.id===id);
  const gs=id=>services.find(s=>s.id===id);
  const fillRate=Math.round((todayApts.length/8)*100);
  const h=T.getHours();
  return (
    <div style={{animation:'fadeIn .3s ease'}}>
      <div style={{marginBottom:'2rem'}}>
        <h1 style={{fontFamily:FONTS.serif,fontSize:'2rem',fontWeight:500}}>{h<12?'Bonjour':'Bon après-midi'}, Nourhen ✦</h1>
        <p style={{color:C.gray,fontSize:'.875rem',marginTop:4}}>Voici l'état de votre salon aujourd'hui.</p>
      </div>
      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:'1.25rem',marginBottom:'2rem'}}>
        {[
          {icon:'♀',bg:'#FBF0E9',color:C.roseGold,value:clients.length,label:'Clientes',sub:`↑ ${newClients} ce mois`},
          {icon:'◷',bg:'#F2EBF5',color:C.mauve,value:todayApts.length,label:'RDV aujourd\'hui',sub:`${fillRate}% de remplissage`},
          {icon:'◈',bg:'#EEE6F0',color:C.plum,value:`${monthRevenue} DT`,label:'CA du mois',sub:`${weekRevenue} DT cette semaine`},
          {icon:'✓',bg:C.successBg,color:C.success,value:appointments.filter(a=>a.status==='completed').length,label:'Prestations réalisées',sub:'Total historique'},
        ].map((k,i)=>(
          <div key={i} style={{background:C.white,borderRadius:12,padding:'1.5rem',border:`1px solid ${C.border}`,boxShadow:'0 1px 4px rgba(30,17,24,.05)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,right:0,width:70,height:70,borderRadius:'0 0 0 70px',background:k.color,opacity:.07}}/>
            <div style={{width:44,height:44,borderRadius:8,background:k.bg,color:k.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',marginBottom:'1rem'}}>{k.icon}</div>
            <div style={{fontFamily:FONTS.serif,fontSize:'1.9rem',fontWeight:600,lineHeight:1,marginBottom:3}}>{k.value}</div>
            <div style={{fontSize:'.75rem',color:C.gray,textTransform:'uppercase',letterSpacing:'.06em'}}>{k.label}</div>
            <div style={{fontSize:'.72rem',color:C.gray,marginTop:4}}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
        {/* Upcoming */}
        <div style={{background:C.white,borderRadius:12,padding:'1.5rem',border:`1px solid ${C.border}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
            <h3 style={{fontFamily:FONTS.serif,fontSize:'1.2rem'}}>Agenda du jour & à venir</h3>
            <Btn variant="secondary" sm onClick={()=>setPage('agenda')}>Voir agenda →</Btn>
          </div>
          {upcoming.length===0?<div style={{textAlign:'center',padding:'2rem',color:C.gray,fontSize:'.875rem'}}>Aucun rendez-vous.</div>
          :upcoming.map(apt=>{const cl=gc(apt.client_id);const sv=gs(apt.service_id);const isToday=apt.date===todayStr;return(
            <div key={apt.id} style={{display:'flex',gap:'.9rem',alignItems:'center',padding:'.7rem .9rem',borderRadius:8,background:isToday?C.blush:C.white,border:`1px solid ${isToday?C.border:'transparent'}`,marginBottom:'.5rem'}}>
              <div style={{minWidth:52,textAlign:'center'}}>
                <div style={{fontFamily:FONTS.serif,fontSize:'.95rem',fontWeight:600,color:C.mauve}}>{apt.time}</div>
                <div style={{fontSize:'.65rem',color:C.gray}}>{isToday?'Auj.':new Date(apt.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}</div>
              </div>
              <Avatar n1={cl?.firstName||'?'} n2={cl?.lastName||''} size={30}/>
              <div style={{flex:1}}>
                <div style={{fontSize:'.875rem',fontWeight:500}}>{cl?`${cl.firstName} ${cl.lastName}`:'—'}</div>
                <div style={{fontSize:'.75rem',color:C.gray}}>{sv?.name}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:3}}>
                <StatusBadge status={apt.status}/>
                <span style={{fontSize:'.73rem',color:C.mauve,fontWeight:600}}>{apt.price} DT</span>
              </div>
            </div>
          );})}
        </div>
        {/* Top clients */}
        <div style={{background:C.white,borderRadius:12,padding:'1.5rem',border:`1px solid ${C.border}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
            <h3 style={{fontFamily:FONTS.serif,fontSize:'1.2rem'}}>Meilleures clientes</h3>
            <Btn variant="secondary" sm onClick={()=>setPage('clients')}>Voir tout →</Btn>
          </div>
          {[...clients].sort((a,b)=>b.totalSpent-a.totalSpent).slice(0,5).map(c=>(
            <div key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.5rem 0',borderBottom:`1px solid ${C.border}`}}>
              <Avatar n1={c.firstName} n2={c.lastName} size={30}/>
              <div style={{flex:1}}>
                <div style={{fontSize:'.875rem',fontWeight:500}}>{c.firstName} {c.lastName}</div>
                <div style={{fontSize:'.72rem',color:C.gray}}>{c.visits} visite{c.visits!==1?'s':''}</div>
              </div>
              <Badge bg='#F2EBF5' color={C.mauve}>{c.totalSpent} DT</Badge>
            </div>
          ))}
        </div>
      </div>
      <div style={{marginTop:'1.5rem',display:'flex',gap:'1rem',flexWrap:'wrap'}}>
        <Btn variant="primary" onClick={()=>setPage('agenda')}>+ Nouveau rendez-vous</Btn>
        <Btn variant="secondary" onClick={()=>setPage('clients')}>+ Nouvelle cliente</Btn>
      </div>
    </div>
  );
}

// ADMIN AGENDA (full appointment management)
const STATUSES=['scheduled','confirmed','completed','cancelled'];
const STATUS_FR={scheduled:'Planifié',confirmed:'Confirmé',completed:'Terminé',cancelled:'Annulé'};

function AdminAgenda() {
  const {appointments,addAppointment,updateAppointment,deleteAppointment,clients,services,getClient,getService} = useApp();
  const todayStr=fmt(T);
  const [filterStatus,setFilterStatus]=useState('all');
  const [filterDate,setFilterDate]=useState('');
  const [search,setSearch]=useState('');
  const [modal,setModal]=useState(null);
  const [sel,setSel]=useState(null);
  const [form,setForm]=useState({clientId:'',serviceId:'',date:todayStr,time:'09:00',notes:''});
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const close=()=>{setModal(null);setSel(null);};

  const filtered=appointments.filter(a=>{
    if(filterStatus!=='all'&&a.status!==filterStatus) return false;
    if(filterDate&&a.date!==filterDate) return false;
    if(search){const cl=getClient(a.clientId);const sv=getService(a.serviceId);return`${cl?.firstName} ${cl?.lastName} ${sv?.name}`.toLowerCase().includes(search.toLowerCase());}
    return true;
  }).sort((a,b)=>b.date.localeCompare(a.date)||a.time.localeCompare(b.time));

  const AptForm=({onSave,label})=>(
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
        <Select label="Cliente *" value={form.clientId} onChange={e=>sf('clientId',e.target.value)} options={[{value:'',label:'Choisir…'},...[...clients].sort((a,b)=>a.firstName.localeCompare(b.firstName)).map(c=>({value:c.id,label:`${c.firstName} ${c.lastName}`}))]}/>
        <Select label="Prestation *" value={form.serviceId} onChange={e=>sf('serviceId',e.target.value)} options={[{value:'',label:'Choisir…'},...services.map(s=>({value:s.id,label:`${s.name} — ${s.price} DT`}))]}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
        <Input label="Date *" type="date" value={form.date} onChange={e=>sf('date',e.target.value)} required/>
        <Input label="Heure *" type="time" value={form.time} onChange={e=>sf('time',e.target.value)} required/>
      </div>
      <Textarea label="Notes" value={form.notes} onChange={e=>sf('notes',e.target.value)} placeholder="Notes internes…"/>
      <div style={{display:'flex',justifyContent:'flex-end',gap:'.75rem',marginTop:'1.5rem',paddingTop:'1.25rem',borderTop:`1px solid ${C.border}`}}>
        <Btn variant="secondary" onClick={close}>Annuler</Btn>
        <Btn variant="primary" onClick={onSave}>{label}</Btn>
      </div>
    </>
  );

  return (
    <div style={{animation:'fadeIn .3s ease'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <div>
          <h2 style={{fontFamily:FONTS.serif,fontSize:'2rem',fontWeight:500}}>Agenda</h2>
          <div style={{fontSize:'.82rem',color:C.gray}}>{appointments.filter(a=>['scheduled','confirmed'].includes(a.status)&&a.date>=todayStr).length} à venir</div>
        </div>
        <Btn variant="primary" onClick={()=>{setForm({clientId:'',serviceId:'',date:todayStr,time:'09:00',notes:''});setModal('add');}}>+ Nouveau rendez-vous</Btn>
      </div>
      <div style={{display:'flex',gap:'.6rem',flexWrap:'wrap',marginBottom:'1.5rem',alignItems:'center'}}>
        <div style={{position:'relative',flex:1,maxWidth:260}}>
          <span style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:C.gray}}>⌕</span>
          <input style={{width:'100%',padding:'.6rem .9rem .6rem 2.3rem',border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:'.875rem',fontFamily:FONTS.sans,outline:'none'}} placeholder="Chercher…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {['all',...STATUSES].map(s=>(
          <button key={s} onClick={()=>setFilterStatus(s)} style={{padding:'.4rem .9rem',borderRadius:100,fontSize:'.78rem',border:`1.5px solid ${filterStatus===s?C.mauve:C.border}`,background:filterStatus===s?C.mauve:C.white,color:filterStatus===s?'white':C.gray,cursor:'pointer',fontFamily:FONTS.sans}}>
            {s==='all'?'Tous':STATUS_FR[s]}
          </button>
        ))}
        <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{padding:'.4rem .75rem',border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:'.82rem',fontFamily:FONTS.sans,outline:'none'}}/>
        {filterDate&&<Btn variant="secondary" sm onClick={()=>setFilterDate('')}>× Effacer</Btn>}
      </div>
      <div style={{overflowX:'auto',borderRadius:12,border:`1px solid ${C.border}`}}>
        <table style={{width:'100%',borderCollapse:'collapse',background:C.white}}>
          <thead><tr style={{background:C.blush}}>{['Date & Heure','Cliente','Prestation','Prix','Statut','Notes',''].map(h=><th key={h} style={{padding:'.8rem 1rem',textAlign:'left',fontSize:'.72rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',color:C.gray,whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.length===0?<tr><td colSpan={7} style={{padding:'3rem',textAlign:'center',color:C.gray}}>Aucun rendez-vous.</td></tr>
            :filtered.map(apt=>{
              const cl=getClient(apt.clientId);const sv=getService(apt.serviceId);const isToday=apt.date===todayStr;
              return <tr key={apt.id} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:'.85rem 1rem'}}>
                  <div style={{fontFamily:FONTS.serif,fontSize:'1rem',fontWeight:600,color:isToday?C.mauve:C.dark}}>{apt.time}</div>
                  <div style={{fontSize:'.7rem',color:isToday?C.mauve:C.gray}}>{isToday?'✦ Aujourd\'hui':new Date(apt.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})}</div>
                </td>
                <td style={{padding:'.85rem 1rem'}}>
                  {cl?<div style={{display:'flex',alignItems:'center',gap:8}}><Avatar n1={cl.firstName} n2={cl.lastName} size={28}/><span style={{fontWeight:500,fontSize:'.875rem'}}>{cl.firstName} {cl.lastName}</span></div>:'—'}
                </td>
                <td style={{padding:'.85rem 1rem'}}>
                  <div style={{fontSize:'.875rem'}}>{sv?.name||'—'}</div>
                  {sv?.duration&&<div style={{fontSize:'.7rem',color:C.gray}}>{sv.duration} min</div>}
                </td>
                <td style={{padding:'.85rem 1rem'}}><Badge bg='#F2EBF5' color={C.mauve}>{apt.price} DT</Badge></td>
                <td style={{padding:'.85rem 1rem'}}>
                  <select value={apt.status} onChange={e=>updateAppointment(apt.id,{status:e.target.value})}
                    style={{border:'none',cursor:'pointer',appearance:'none',fontFamily:FONTS.sans,fontSize:'.73rem',background:'transparent',color:apt.status==='confirmed'?C.success:apt.status==='completed'?C.gray:apt.status==='cancelled'?C.error:'#5566CC',fontWeight:500,padding:'3px 0'}}>
                    {STATUSES.map(s=><option key={s} value={s}>{STATUS_FR[s]}</option>)}
                  </select>
                </td>
                <td style={{padding:'.85rem 1rem',maxWidth:130,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'.78rem',color:C.gray}}>{apt.notes||'—'}</td>
                <td style={{padding:'.85rem 1rem'}}>
                  <div style={{display:'flex',gap:4}}>
                    <Btn variant="ghost" sm onClick={()=>{setSel(apt);setForm({clientId:String(apt.clientId),serviceId:String(apt.serviceId),date:apt.date,time:apt.time,notes:apt.notes||''});setModal('edit');}}>✎</Btn>
                    <Btn variant="ghost" sm style={{color:C.error}} onClick={()=>{setSel(apt);setModal('del');}}>✕</Btn>
                  </div>
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
      <Modal open={modal==='add'} onClose={close} title="Nouveau rendez-vous"><AptForm onSave={()=>{if(!form.clientId||!form.serviceId||!form.date)return;addAppointment(form);close();}} label="+ Créer"/></Modal>
      <Modal open={modal==='edit'} onClose={close} title="Modifier"><AptForm onSave={()=>{const sv=services.find(s=>s.id===Number(form.serviceId));updateAppointment(sel.id,{clientId:Number(form.clientId),serviceId:Number(form.serviceId),date:form.date,time:form.time,notes:form.notes,price:sv?.price||sel.price});close();}} label="Enregistrer"/></Modal>
      <ConfirmDel open={modal==='del'} onClose={close} onConfirm={()=>{deleteAppointment(sel.id);close();}} name="ce rendez-vous"/>
    </div>
  );
}

// ADMIN CLIENTS
const EC={firstName:'',lastName:'',phone:'',email:'',birthDate:'',notes:''};
function AdminClients() {
  const {clients,addClient,updateClient,deleteClient,appointments,services,getService} = useApp();
  const [search,setSearch]=useState('');
  const [modal,setModal]=useState(null);
  const [sel,setSel]=useState(null);
  const [form,setForm]=useState(EC);
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const close=()=>{setModal(null);setSel(null);};
  const filtered=clients.filter(c=>`${c.firstName} ${c.lastName} ${c.phone} ${c.email}`.toLowerCase().includes(search.toLowerCase()));

  const ClientForm=({onSave,label})=>(
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
        <Input label="Prénom *" value={form.firstName} onChange={e=>sf('firstName',e.target.value)} required/>
        <Input label="Nom *" value={form.lastName} onChange={e=>sf('lastName',e.target.value)} required/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
        <Input label="Téléphone *" value={form.phone} onChange={e=>sf('phone',e.target.value)} placeholder="+216 XX XXX XXX" required/>
        <Input label="Email" type="email" value={form.email} onChange={e=>sf('email',e.target.value)}/>
      </div>
      <Input label="Date de naissance" type="date" value={form.birthDate} onChange={e=>sf('birthDate',e.target.value)}/>
      <Textarea label="Notes internes" value={form.notes} onChange={e=>sf('notes',e.target.value)} placeholder="Allergies, préférences…"/>
      <div style={{display:'flex',justifyContent:'flex-end',gap:'.75rem',marginTop:'1.5rem',paddingTop:'1.25rem',borderTop:`1px solid ${C.border}`}}>
        <Btn variant="secondary" onClick={close}>Annuler</Btn>
        <Btn variant="primary" onClick={onSave}>{label}</Btn>
      </div>
    </>
  );

  return (
    <div style={{animation:'fadeIn .3s ease'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <div>
          <h2 style={{fontFamily:FONTS.serif,fontSize:'2rem',fontWeight:500}}>Clientes</h2>
          <div style={{fontSize:'.82rem',color:C.gray}}>{clients.length} clientes</div>
        </div>
        <Btn variant="primary" onClick={()=>{setForm(EC);setModal('add');}}>+ Nouvelle cliente</Btn>
      </div>
      <div style={{display:'flex',gap:'1rem',marginBottom:'1.5rem'}}>
        <div style={{position:'relative',flex:1,maxWidth:340}}>
          <span style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:C.gray}}>⌕</span>
          <input style={{width:'100%',padding:'.6rem .9rem .6rem 2.3rem',border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:'.875rem',fontFamily:FONTS.sans,outline:'none'}} placeholder="Rechercher…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>
      <div style={{overflowX:'auto',borderRadius:12,border:`1px solid ${C.border}`}}>
        <table style={{width:'100%',borderCollapse:'collapse',background:C.white}}>
          <thead><tr style={{background:C.blush}}>{['Cliente','Téléphone','Email','Visites','Total','Points','Inscrite',''].map(h=><th key={h} style={{padding:'.8rem 1rem',textAlign:'left',fontSize:'.72rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',color:C.gray,whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(c=>(
              <tr key={c.id} onClick={()=>{setSel(c);setModal('view');}} style={{borderBottom:`1px solid ${C.border}`,cursor:'pointer'}}>
                <td style={{padding:'.85rem 1rem'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                    <Avatar n1={c.firstName} n2={c.lastName} size={30}/>
                    <div><div style={{fontWeight:500,fontSize:'.9rem'}}>{c.firstName} {c.lastName}</div>{c.notes&&<div style={{fontSize:'.7rem',color:C.warning}}>⚠ Notes</div>}</div>
                  </div>
                </td>
                <td style={{padding:'.85rem 1rem',fontSize:'.875rem'}}>{c.phone}</td>
                <td style={{padding:'.85rem 1rem',fontSize:'.82rem',color:C.gray}}>{c.email||'—'}</td>
                <td style={{padding:'.85rem 1rem'}}><span style={{fontFamily:FONTS.serif,fontSize:'1.1rem',fontWeight:600,color:C.mauve}}>{c.visits}</span></td>
                <td style={{padding:'.85rem 1rem'}}><Badge bg='#F2EBF5' color={C.mauve}>{c.totalSpent} DT</Badge></td>
                <td style={{padding:'.85rem 1rem'}}><Badge bg='#FBF0E9' color={C.roseGold}>💎 {c.points}</Badge></td>
                <td style={{padding:'.85rem 1rem',fontSize:'.78rem',color:C.gray}}>{new Date(c.createdAt+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})}</td>
                <td style={{padding:'.85rem 1rem'}} onClick={e=>e.stopPropagation()}>
                  <div style={{display:'flex',gap:4}}>
                    <Btn variant="ghost" sm onClick={e=>{e.stopPropagation();setSel(c);setForm({firstName:c.firstName,lastName:c.lastName,phone:c.phone,email:c.email||'',birthDate:c.birthDate||'',notes:c.notes||''});setModal('edit');}}>✎</Btn>
                    <Btn variant="ghost" sm style={{color:C.error}} onClick={e=>{e.stopPropagation();setSel(c);setModal('del');}}>✕</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={modal==='add'} onClose={close} title="Nouvelle cliente"><ClientForm onSave={()=>{if(!form.firstName||!form.phone)return;addClient(form);close();}} label="+ Ajouter"/></Modal>
      <Modal open={modal==='edit'} onClose={close} title="Modifier la cliente"><ClientForm onSave={()=>{updateClient(sel.id,form);close();}} label="Enregistrer"/></Modal>
      <Modal open={modal==='view'} onClose={close} title={null} large>
        {sel&&<AdminClientDetail client={sel} appointments={appointments} services={services} onEdit={()=>{close();setTimeout(()=>{setForm({firstName:sel.firstName,lastName:sel.lastName,phone:sel.phone,email:sel.email||'',birthDate:sel.birthDate||'',notes:sel.notes||''});setModal('edit');},50);}} onDelete={()=>{close();setTimeout(()=>{setModal('del');},50);}} onClose={close}/>}
      </Modal>
      <ConfirmDel open={modal==='del'} onClose={close} onConfirm={()=>{deleteClient(sel.id);close();}} name={sel?`${sel.firstName} ${sel.lastName}`:''} desc="Cette action est irréversible."/>
    </div>
  );
}

function AdminClientDetail({client,appointments,services,onEdit,onDelete,onClose}) {
  const myApts=appointments.filter(a=>a.clientId===client.id).sort((a,b)=>b.date.localeCompare(a.date));
  const gs=id=>services.find(s=>s.id===id);
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.5rem'}}>
        <Avatar n1={client.firstName} n2={client.lastName} size={52}/>
        <div style={{flex:1}}>
          <h3 style={{fontFamily:FONTS.serif,fontSize:'1.5rem',fontWeight:500}}>{client.firstName} {client.lastName}</h3>
          <div style={{fontSize:'.8rem',color:C.gray}}>Cliente depuis {new Date(client.createdAt+'T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'})}</div>
        </div>
        <Btn variant="secondary" sm onClick={onEdit}>✎ Modifier</Btn>
        <Btn variant="danger" sm onClick={onDelete}>✕</Btn>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.25rem'}}>
        {[['Visites',client.visits],['Total',`${client.totalSpent} DT`],['Points',`💎 ${client.points}`],['Prestations',myApts.filter(a=>a.status==='completed').length]].map(([l,v])=>(
          <div key={l} style={{background:C.blush,borderRadius:8,padding:'1rem',textAlign:'center'}}>
            <div style={{fontFamily:FONTS.serif,fontSize:'1.3rem',fontWeight:600,color:C.mauve}}>{v}</div>
            <div style={{fontSize:'.7rem',color:C.gray,marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{background:C.blush,borderRadius:8,padding:'1rem',marginBottom:'1rem'}}>
        {[['Téléphone',client.phone],['Email',client.email||'—'],['Naissance',client.birthDate?new Date(client.birthDate+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}):'-']].map(([k,v])=>(
          <div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:'.875rem',padding:'3px 0'}}><span style={{color:C.gray}}>{k}</span><strong>{v}</strong></div>
        ))}
      </div>
      {client.notes&&<div style={{background:C.warningBg,borderLeft:`3px solid ${C.warning}`,borderRadius:8,padding:'.75rem 1rem',marginBottom:'1rem',fontSize:'.875rem'}}><strong>Notes :</strong> {client.notes}</div>}
      <div style={{fontSize:'.72rem',textTransform:'uppercase',letterSpacing:'.06em',color:C.gray,marginBottom:'.75rem'}}>Historique ({myApts.length} RDV)</div>
      <div style={{maxHeight:200,overflowY:'auto'}}>
        {myApts.map(apt=>{const sv=gs(apt.serviceId);return(
          <div key={apt.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.45rem 0',borderBottom:`1px solid ${C.border}`,fontSize:'.82rem'}}>
            <span><strong>{sv?.name||'—'}</strong> <span style={{color:C.gray}}>{new Date(apt.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})} à {apt.time}</span></span>
            <div style={{display:'flex',gap:8,alignItems:'center'}}><StatusBadge status={apt.status}/><span style={{color:C.mauve,fontWeight:600}}>{apt.price} DT</span></div>
          </div>
        );})}
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:'1.5rem',paddingTop:'1.25rem',borderTop:`1px solid ${C.border}`}}>
        <Btn variant="secondary" onClick={onClose}>Fermer</Btn>
      </div>
    </div>
  );
}

// ADMIN SERVICES
function AdminServices() {
  const {services,addService,updateService,deleteService} = useApp();
  const CAT_COLORS={Visage:C.roseGold,Ongles:C.mauve,Épilation:C.success,Corps:C.warning,Maquillage:C.error,Cheveux:C.plum,Autre:C.gray};
  const CATS=Object.keys(CAT_COLORS);
  const [filterCat,setFilterCat]=useState('all');
  const [modal,setModal]=useState(null);
  const [sel,setSel]=useState(null);
  const [form,setForm]=useState({name:'',category:'Visage',duration:60,price:0,color:C.roseGold,description:''});
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const close=()=>{setModal(null);setSel(null);};
  const cats=[...new Set(services.map(s=>s.category))];
  const filtered=filterCat==='all'?services:services.filter(s=>s.category===filterCat);

  const SvcForm=({onSave,label})=>(
    <>
      <Input label="Nom *" value={form.name} onChange={e=>sf('name',e.target.value)} placeholder="Soin du visage hydratant" required/>
      <Textarea label="Description" value={form.description} onChange={e=>sf('description',e.target.value)} placeholder="Courte description de la prestation…"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
        <Select label="Catégorie *" value={form.category} onChange={e=>{sf('category',e.target.value);sf('color',CAT_COLORS[e.target.value]||C.roseGold);}} options={CATS.map(c=>({value:c,label:c}))}/>
        <div style={{marginBottom:'1rem'}}>
          <label style={{display:'block',fontSize:'.75rem',fontWeight:500,color:C.gray,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:5}}>Couleur</label>
          <div style={{display:'flex',gap:8,alignItems:'center'}}><input type="color" value={form.color} onChange={e=>sf('color',e.target.value)} style={{width:40,height:38,padding:2,border:`1.5px solid ${C.border}`,borderRadius:6,cursor:'pointer'}}/><span style={{fontSize:'.78rem',color:C.gray}}>Accentuation</span></div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
        <Input label="Durée (min) *" type="number" min="5" step="5" value={form.duration} onChange={e=>sf('duration',e.target.value)} required/>
        <Input label="Prix (DT) *" type="number" min="0" value={form.price} onChange={e=>sf('price',e.target.value)} required/>
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:'.75rem',marginTop:'1.5rem',paddingTop:'1.25rem',borderTop:`1px solid ${C.border}`}}>
        <Btn variant="secondary" onClick={close}>Annuler</Btn>
        <Btn variant="primary" onClick={onSave}>{label}</Btn>
      </div>
    </>
  );

  return (
    <div style={{animation:'fadeIn .3s ease'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <div>
          <h2 style={{fontFamily:FONTS.serif,fontSize:'2rem',fontWeight:500}}>Prestations</h2>
          <div style={{fontSize:'.82rem',color:C.gray}}>{services.length} prestations · Tarif moy. {Math.round(services.reduce((s,sv)=>s+sv.price,0)/(services.length||1))} DT</div>
        </div>
        <Btn variant="primary" onClick={()=>{setForm({name:'',category:'Visage',duration:60,price:0,color:C.roseGold,description:''});setModal('add');}}>+ Nouvelle</Btn>
      </div>
      <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',marginBottom:'1.75rem'}}>
        {['all',...cats].map(c=>(
          <button key={c} onClick={()=>setFilterCat(c)} style={{padding:'.4rem .9rem',borderRadius:100,fontSize:'.78rem',border:`1.5px solid ${filterCat===c?C.mauve:C.border}`,background:filterCat===c?C.mauve:C.white,color:filterCat===c?'white':C.gray,cursor:'pointer',fontFamily:FONTS.sans}}>
            {c==='all'?`Toutes (${services.length})`:`${c} (${services.filter(s=>s.category===c).length})`}
          </button>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:'1rem'}}>
        {filtered.map(svc=>(
          <div key={svc.id} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:'1.25rem',paddingLeft:'1.5rem',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',left:0,top:0,width:4,height:'100%',background:svc.color||C.roseGold}}/>
            <div style={{fontSize:'1rem',fontWeight:500,marginBottom:4}}>{svc.name}</div>
            {svc.description&&<p style={{fontSize:'.78rem',color:C.gray,marginBottom:'1rem',lineHeight:1.5}}>{svc.description}</p>}
            <Badge bg={C.blush} color={C.gray}>{svc.category}</Badge>
            <div style={{display:'flex',gap:'1.5rem',margin:'1rem 0'}}>
              <div><div style={{fontFamily:FONTS.serif,fontSize:'1.4rem',fontWeight:600,color:svc.color}}>{svc.price} <span style={{fontSize:'.8rem'}}>DT</span></div><div style={{fontSize:'.65rem',color:C.gray}}>Prix</div></div>
              <div><div style={{fontFamily:FONTS.serif,fontSize:'1.4rem',fontWeight:600,color:C.dark}}>{svc.duration} <span style={{fontSize:'.8rem'}}>min</span></div><div style={{fontSize:'.65rem',color:C.gray}}>Durée</div></div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <Btn variant="secondary" sm style={{flex:1}} onClick={()=>{setSel(svc);setForm({name:svc.name,category:svc.category,duration:svc.duration,price:svc.price,color:svc.color||C.roseGold,description:svc.description||''});setModal('edit');}}>✎ Modifier</Btn>
              <Btn variant="ghost" sm style={{color:C.error}} onClick={()=>{setSel(svc);setModal('del');}}>✕</Btn>
            </div>
          </div>
        ))}
      </div>
      <Modal open={modal==='add'} onClose={close} title="Nouvelle prestation"><SvcForm onSave={()=>{if(!form.name)return;addService(form);close();}} label="+ Créer"/></Modal>
      <Modal open={modal==='edit'} onClose={close} title="Modifier"><SvcForm onSave={()=>{updateService(sel.id,form);close();}} label="Enregistrer"/></Modal>
      <ConfirmDel open={modal==='del'} onClose={close} onConfirm={()=>{deleteService(sel.id);close();}} name={sel?.name}/>
    </div>
  );
}

// ADMIN FINANCE
function AdminFinance() {
  const {appointments,services,clients} = useApp();
  const completed=appointments.filter(a=>a.status==='completed');
  const totalRevenue=completed.reduce((s,a)=>s+a.price,0);
  const nm=T;
  const monthStr=`${nm.getFullYear()}-${String(nm.getMonth()+1).padStart(2,'0')}`;
  const monthRevenue=completed.filter(a=>a.date.startsWith(monthStr)).reduce((s,a)=>s+a.price,0);
  const gs=id=>services.find(s=>s.id===id);
  const gc=id=>clients.find(c=>c.id===id);

  // Revenue by category
  const byCat={};
  completed.forEach(a=>{const sv=gs(a.serviceId);if(sv){byCat[sv.category]=(byCat[sv.category]||0)+a.price;}});
  const catData=Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
  const maxCat=catData[0]?.[1]||1;

  return (
    <div style={{animation:'fadeIn .3s ease'}}>
      <h2 style={{fontFamily:FONTS.serif,fontSize:'2rem',fontWeight:500,marginBottom:'1.5rem'}}>Finances & Statistiques</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'1.25rem',marginBottom:'2rem'}}>
        {[
          {label:'CA total',value:`${totalRevenue} DT`,icon:'◈',color:C.plum},
          {label:'CA du mois',value:`${monthRevenue} DT`,icon:'◷',color:C.mauve},
          {label:'Panier moyen',value:`${completed.length>0?Math.round(totalRevenue/completed.length):0} DT`,icon:'∑',color:C.roseGold},
          {label:'Prestations réalisées',value:completed.length,icon:'✓',color:C.success},
        ].map(k=>(
          <div key={k.label} style={{background:C.white,borderRadius:12,padding:'1.5rem',border:`1px solid ${C.border}`}}>
            <div style={{width:40,height:40,borderRadius:8,background:`${k.color}18`,color:k.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',marginBottom:'1rem'}}>{k.icon}</div>
            <div style={{fontFamily:FONTS.serif,fontSize:'1.8rem',fontWeight:600,color:C.dark,marginBottom:3}}>{k.value}</div>
            <div style={{fontSize:'.75rem',color:C.gray,textTransform:'uppercase',letterSpacing:'.06em'}}>{k.label}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
        {/* Revenue by category */}
        <div style={{background:C.white,borderRadius:12,padding:'1.5rem',border:`1px solid ${C.border}`}}>
          <h3 style={{fontFamily:FONTS.serif,fontSize:'1.2rem',marginBottom:'1.25rem'}}>CA par catégorie</h3>
          {catData.map(([cat,val])=>(
            <div key={cat} style={{marginBottom:'.75rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'.82rem',marginBottom:4}}>
                <span style={{fontWeight:500}}>{cat}</span><span style={{color:C.mauve,fontWeight:600}}>{val} DT</span>
              </div>
              <div style={{height:7,background:C.blush,borderRadius:100,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${(val/maxCat)*100}%`,background:`linear-gradient(90deg,${C.roseGold},${C.mauve})`,borderRadius:100}}/>
              </div>
            </div>
          ))}
        </div>
        {/* Recent transactions */}
        <div style={{background:C.white,borderRadius:12,padding:'1.5rem',border:`1px solid ${C.border}`}}>
          <h3 style={{fontFamily:FONTS.serif,fontSize:'1.2rem',marginBottom:'1.25rem'}}>Dernières transactions</h3>
          <div style={{maxHeight:320,overflowY:'auto'}}>
            {[...completed].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,12).map(apt=>{
              const cl=gc(apt.clientId);const sv=gs(apt.serviceId);
              return <div key={apt.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.5rem 0',borderBottom:`1px solid ${C.border}`,fontSize:'.82rem'}}>
                <div>
                  <div style={{fontWeight:500}}>{cl?.firstName} {cl?.lastName}</div>
                  <div style={{color:C.gray,fontSize:'.75rem'}}>{sv?.name} · {new Date(apt.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}</div>
                </div>
                <span style={{color:C.mauve,fontWeight:600}}>{apt.price} DT</span>
              </div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ADMIN MARKETING
function AdminMarketing() {
  const {clients,promos,appointments,services} = useApp();
  const [tab,setTab]=useState('segments');
  const todayStr=fmt(T);

  const inactive=clients.filter(c=>{
    const lastApt=appointments.filter(a=>a.clientId===c.id&&a.status==='completed').sort((a,b)=>b.date.localeCompare(a.date))[0];
    if(!lastApt) return true;
    const diff=(new Date(todayStr)-new Date(lastApt.date+'T12:00:00'))/(1000*60*60*24);
    return diff>90;
  });
  const vip=clients.filter(c=>c.totalSpent>=500);
  const newClients=clients.filter(c=>{const d=(new Date(todayStr)-new Date(c.createdAt+'T12:00:00'))/(1000*60*60*24);return d<=30;});

  const segments=[
    {label:'Clientes inactives (+90j)',count:inactive.length,color:C.error,icon:'😴',desc:'N\'ont pas réservé depuis plus de 3 mois'},
    {label:'Clientes VIP (500+ DT)',count:vip.length,color:C.mauve,icon:'💎',desc:'Meilleures clientes par CA'},
    {label:'Nouvelles clientes (30j)',count:newClients.length,color:C.success,icon:'🌸',desc:'Inscrites dans les 30 derniers jours'},
    {label:'Toutes les clientes',count:clients.length,color:C.roseGold,icon:'♀',desc:'Newsletter générale'},
  ];

  return (
    <div style={{animation:'fadeIn .3s ease'}}>
      <h2 style={{fontFamily:FONTS.serif,fontSize:'2rem',fontWeight:500,marginBottom:'1.5rem'}}>Marketing & Fidélité</h2>
      <div style={{display:'flex',gap:'.5rem',marginBottom:'2rem'}}>
        {[['segments','Segments'],['promos','Offres & Promos'],['loyalty','Fidélité']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'.5rem 1.25rem',borderRadius:100,border:`1.5px solid ${tab===t?C.mauve:C.border}`,background:tab===t?C.mauve:'transparent',color:tab===t?'white':C.gray,cursor:'pointer',fontSize:'.85rem',fontFamily:FONTS.sans}}>
            {l}
          </button>
        ))}
      </div>

      {tab==='segments'&&(
        <div>
          <p style={{color:C.gray,fontSize:'.875rem',marginBottom:'1.5rem'}}>Segmentez vos clientes pour des campagnes ciblées.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.25rem'}}>
            {segments.map(seg=>(
              <div key={seg.label} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:'1.5rem',overflow:'hidden',position:'relative'}}>
                <div style={{position:'absolute',top:0,right:0,width:80,height:80,borderRadius:'0 0 0 80px',background:seg.color,opacity:.07}}/>
                <div style={{fontSize:'1.75rem',marginBottom:'.75rem'}}>{seg.icon}</div>
                <div style={{fontFamily:FONTS.serif,fontSize:'2rem',fontWeight:600,color:seg.color,lineHeight:1,marginBottom:4}}>{seg.count}</div>
                <div style={{fontWeight:500,fontSize:'.95rem',marginBottom:4}}>{seg.label}</div>
                <div style={{fontSize:'.78rem',color:C.gray,marginBottom:'1.25rem'}}>{seg.desc}</div>
                <Btn variant="outline" sm>Envoyer une offre →</Btn>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='promos'&&(
        <div>
          <p style={{color:C.gray,fontSize:'.875rem',marginBottom:'1.5rem'}}>Codes promotionnels actifs visibles dans l'espace client.</p>
          <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
            {promos.map(p=>(
              <div key={p.id} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                <div style={{width:44,height:44,borderRadius:10,background:C.warningBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>🎁</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500}}>{p.label}</div>
                  <div style={{fontSize:'.78rem',color:C.gray}}>Code : <strong style={{fontFamily:'monospace',color:C.dark}}>{p.code}</strong> · Valable jusqu'au {new Date(p.validUntil+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</div>
                  {p.clientId&&<div style={{fontSize:'.72rem',color:C.mauve,marginTop:2}}>Personnalisé pour une cliente</div>}
                </div>
                <Badge bg={C.warningBg} color={C.warning}>-{p.discount}%</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='loyalty'&&(
        <div>
          <p style={{color:C.gray,fontSize:'.875rem',marginBottom:'1.5rem'}}>Vue d'ensemble du programme de fidélité.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
            {[['Bronze','#CD7F32',clients.filter(c=>c.points<200).length,'0–199 pts'],['Silver',C.grayLight,clients.filter(c=>c.points>=200&&c.points<500).length,'200–499 pts'],['Gold',C.roseGold,clients.filter(c=>c.points>=500&&c.points<1000).length,'500–999 pts'],['Platinum',C.mauve,clients.filter(c=>c.points>=1000).length,'1000+ pts']].map(([name,color,count,range])=>(
              <div key={name} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:'1.25rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                <div style={{width:44,height:44,borderRadius:10,background:`${color}22`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONTS.serif,fontSize:'1rem',fontWeight:700,color,flexShrink:0}}>{name[0]}</div>
                <div>
                  <div style={{fontFamily:FONTS.serif,fontSize:'1.5rem',fontWeight:600,color,lineHeight:1}}>{count}</div>
                  <div style={{fontSize:'.8rem',fontWeight:500,color:C.dark}}>{name}</div>
                  <div style={{fontSize:'.72rem',color:C.gray}}>{range}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden'}}>
            <div style={{background:C.blush,padding:'.85rem 1rem',display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr',gap:'1rem'}}>
              {['Cliente','Points','Visites','Total CA','Niveau'].map(h=><div key={h} style={{fontSize:'.72rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',color:C.gray}}>{h}</div>)}
            </div>
            {[...clients].sort((a,b)=>b.points-a.points).map(c=>{
              const lvl=c.points<200?'Bronze':c.points<500?'Silver':c.points<1000?'Gold':'Platinum';
              const lvlColor=c.points<200?'#CD7F32':c.points<500?C.grayLight:c.points<1000?C.roseGold:C.mauve;
              return <div key={c.id} style={{padding:'.85rem 1rem',display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr',gap:'1rem',borderTop:`1px solid ${C.border}`,alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}><Avatar n1={c.firstName} n2={c.lastName} size={26}/><span style={{fontSize:'.875rem',fontWeight:500}}>{c.firstName} {c.lastName}</span></div>
                <div style={{fontFamily:FONTS.serif,fontWeight:600,color:C.mauve}}>💎 {c.points}</div>
                <div style={{color:C.gray,fontSize:'.875rem'}}>{c.visits}</div>
                <div style={{fontSize:'.875rem',fontWeight:600,color:C.dark}}>{c.totalSpent} DT</div>
                <Badge bg={`${lvlColor}22`} color={lvlColor}>{lvl}</Badge>
              </div>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ADMIN SETTINGS
function AdminSettings() {
  const {adminUser,clients,appointments,services} = useApp();
  const [saved,setSaved]=useState(false);
  const [info,setInfo]=useState({name:'La Finesse by Nourhen',address:'La Marsa, Tunis, Tunisie',phone:'+216 XX XXX XXX',email:'contact@lafinesse.tn',openTime:'09:00',closeTime:'19:00',cancelPolicy:'24h avant',currency:'DT'});
  const si=(k,v)=>setInfo(i=>({...i,[k]:v}));
  const totalRevenue=appointments.filter(a=>a.status==='completed').reduce((s,a)=>s+a.price,0);

  const Section=({icon,title,children})=>(
    <div style={{border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden',marginBottom:'1.5rem'}}>
      <div style={{background:C.blush,padding:'1rem 1.5rem',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:10}}>
        <span>{icon}</span><h4 style={{fontSize:'1rem',fontWeight:500}}>{title}</h4>
      </div>
      <div style={{padding:'1.5rem',background:C.white}}>{children}</div>
    </div>
  );

  return (
    <div style={{animation:'fadeIn .3s ease',maxWidth:720}}>
      <h2 style={{fontFamily:FONTS.serif,fontSize:'2rem',fontWeight:500,marginBottom:'1.5rem'}}>Paramètres</h2>
      <Section icon="◇" title="Informations du salon">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}><Input label="Nom" value={info.name} onChange={e=>si('name',e.target.value)}/><Input label="Adresse" value={info.address} onChange={e=>si('address',e.target.value)}/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}><Input label="Téléphone" value={info.phone} onChange={e=>si('phone',e.target.value)}/><Input label="Email" type="email" value={info.email} onChange={e=>si('email',e.target.value)}/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
          <Input label="Ouverture" type="time" value={info.openTime} onChange={e=>si('openTime',e.target.value)}/>
          <Input label="Fermeture" type="time" value={info.closeTime} onChange={e=>si('closeTime',e.target.value)}/>
          <Input label="Politique annulation" value={info.cancelPolicy} onChange={e=>si('cancelPolicy',e.target.value)}/>
        </div>
      </Section>
      <Section icon="◈" title="Statistiques globales">
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
          {[['Clientes',clients.length],['Rendez-vous',appointments.length],['Prestations',services.length],['RDV réalisés',appointments.filter(a=>a.status==='completed').length],['CA total',`${totalRevenue} DT`],['Panier moy.',`${appointments.filter(a=>a.status==='completed').length>0?Math.round(totalRevenue/appointments.filter(a=>a.status==='completed').length):0} DT`]].map(([l,v])=>(
            <div key={l} style={{background:C.blush,borderRadius:8,padding:'1rem',textAlign:'center'}}>
              <div style={{fontFamily:FONTS.serif,fontSize:'1.5rem',fontWeight:600,color:C.mauve}}>{v}</div>
              <div style={{fontSize:'.72rem',color:C.gray,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section icon="⚙" title="Compte administrateur">
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <Avatar n1={adminUser?.name?.[0]||'N'} n2="" size={44}/>
          <div style={{flex:1}}><div style={{fontWeight:500}}>{adminUser?.name}</div><div style={{fontSize:'.82rem',color:C.gray}}>{adminUser?.email}</div></div>
          <Badge bg='#F2EBF5' color={C.mauve}>Administrateur</Badge>
        </div>
      </Section>
      <Section icon="⬡" title="Données">
        <p style={{fontSize:'.875rem',color:C.gray,marginBottom:'1rem'}}>Les données sont stockées dans le localStorage du navigateur.</p>
        <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
          <Btn variant="secondary" sm onClick={()=>{const d={clients:JSON.parse(localStorage.getItem('lf_clients')||'[]'),appointments:JSON.parse(localStorage.getItem('lf_appointments')||'[]'),exportedAt:new Date().toISOString()};const b=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`lafinesse-backup-${fmt(T)}.json`;a.click();URL.revokeObjectURL(u);}}>⬇ Exporter JSON</Btn>
          <Btn variant="danger" sm onClick={()=>{if(window.confirm('Réinitialiser ?')){localStorage.clear();window.location.reload();}}}>⚠ Réinitialiser</Btn>
        </div>
      </Section>
      <div style={{display:'flex',justifyContent:'flex-end',gap:'.75rem',alignItems:'center'}}>
        {saved&&<span style={{fontSize:'.875rem',color:C.success}}>✓ Sauvegardé</span>}
        <Btn variant="primary" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);}}>Enregistrer</Btn>
      </div>
    </div>
  );
}

// ADMIN LOGIN
function AdminLogin() {
  const {adminLogin} = useApp();
  const [form,setForm]=useState({email:'',password:''});
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const handleSubmit=async(e)=>{e.preventDefault();setError('');setLoading(true);await new Promise(r=>setTimeout(r,500));const res=adminLogin(form.email,form.password);if(!res.ok)setError(res.error);setLoading(false);};
  return (
    <div style={{minHeight:'100vh',display:'flex'}}>
      <div style={{flex:1,background:C.noir,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'3rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',width:380,height:380,borderRadius:'50%',background:'radial-gradient(circle,rgba(201,149,108,.13) 0%,transparent 70%)',top:-80,right:-80}}/>
        <div style={{position:'absolute',width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle,rgba(139,76,112,.13) 0%,transparent 70%)',bottom:-60,left:-60}}/>
        <div style={{textAlign:'center',position:'relative',zIndex:1,animation:'slideUp .4s ease'}}>
          <div style={{width:72,height:72,borderRadius:20,background:`linear-gradient(135deg,${C.roseGold},${C.mauve})`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONTS.serif,fontSize:'2rem',color:'white',fontWeight:600,margin:'0 auto 1.5rem',boxShadow:'0 8px 30px rgba(201,149,108,.3)'}}>𝓕</div>
          <div style={{fontFamily:FONTS.serif,fontSize:'2.2rem',color:C.white,fontWeight:400}}>La Finesse</div>
          <div style={{fontSize:'.72rem',color:C.gray,textTransform:'uppercase',letterSpacing:'.15em',marginTop:4}}>Administration · by Nourhen</div>
          <p style={{fontFamily:FONTS.serif,fontStyle:'italic',color:'rgba(255,255,255,.3)',marginTop:'2rem',maxWidth:260,lineHeight:1.6,fontSize:'1rem'}}>Espace de gestion interne du salon.</p>
        </div>
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'3rem'}}>
        <div style={{width:'100%',maxWidth:400,animation:'slideUp .35s ease'}}>
          <h1 style={{fontFamily:FONTS.serif,fontSize:'2rem',fontWeight:500,marginBottom:6}}>Espace Admin</h1>
          <p style={{fontSize:'.875rem',color:C.gray,marginBottom:'2.5rem'}}>Connectez-vous pour gérer votre salon.</p>
          {error&&<div style={{background:C.errorBg,borderLeft:`3px solid ${C.error}`,padding:'.75rem 1rem',borderRadius:8,fontSize:'.875rem',color:C.error,marginBottom:'1rem'}}>⚠ {error}</div>}
          <form onSubmit={handleSubmit}>
            <Input label="Email administrateur" type="email" placeholder="admin@lafinesse.tn" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required autoFocus/>
            <Input label="Mot de passe" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required/>
            <Btn variant="primary" wide type="submit" style={{padding:'.85rem',fontSize:'.95rem',marginTop:'.25rem'}}>
              {loading?'Connexion…':'Se connecter →'}
            </Btn>
          </form>
          <div style={{background:C.blush,borderRadius:8,padding:'.75rem 1rem',fontSize:'.78rem',color:C.gray,marginTop:'1.5rem',borderLeft:`3px solid ${C.roseGold}`}}><strong style={{color:C.dark}}>Démo :</strong> admin@lafinesse.tn / finesse2024</div>
        </div>
      </div>
    </div>
  );
}

// ADMIN APP WRAPPER
function AdminApp() {
  const {adminUser,setAppMode} = useApp();
  const [page,setPage]=useState('dashboard');
  const [collapsed,setCollapsed]=useState(false);

  if(!adminUser) return <AdminLogin/>;

  const PAGES={
    dashboard:<AdminDashboard setPage={setPage}/>,
    agenda:<AdminAgenda/>,
    clients:<AdminClients/>,
    services:<AdminServices/>,
    finance:<AdminFinance/>,
    marketing:<AdminMarketing/>,
    settings:<AdminSettings/>,
  };

  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <AdminSidebar page={page} setPage={setPage} collapsed={collapsed}/>
      <div style={{flex:1,marginLeft:collapsed?72:255,minHeight:'100vh',display:'flex',flexDirection:'column',transition:'margin-left .3s ease'}}>
        <AdminTopbar page={page} onToggle={()=>setCollapsed(c=>!c)}/>
        <div style={{padding:'2rem 2.5rem',flex:1,animation:'fadeIn .3s ease'}}>
          {PAGES[page]||<AdminDashboard setPage={setPage}/>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════
function AppInner() {
  const {appMode} = useApp();
  return appMode==='admin' ? <AdminApp/> : <ClientApp/>;
}

export default function App() {
  return (
    <AppProvider>
      <style>{`
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{font-size:16px;scroll-behavior:smooth}
        body{font-family:'DM Sans',system-ui,sans-serif;background:#FDF6F0;color:#2D1B1B;-webkit-font-smoothing:antialiased}
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#F5E6DD}
        ::-webkit-scrollbar-thumb{background:#E8C4A8;border-radius:3px}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        button:hover{opacity:.9}
      `}</style>
      <AppInner/>
    </AppProvider>
  );
}
