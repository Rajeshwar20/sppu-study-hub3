import { useState, useEffect, useContext, createContext, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// CONTEXTS
// ═══════════════════════════════════════════════════════════════
const ThemeCtx = createContext();
const AuthCtx  = createContext();
const AppCtx   = createContext();

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════
const SUBJECTS = [
  { id:"s1",  name:"Engineering Mathematics – I",         code:"EM-I",  sem:1, color:"#1a73e8", icon:"∑",  enrolled:612, desc:"Differential Calculus, Matrices, Complex Numbers, Integral Calculus" },
  { id:"s2",  name:"Engineering Physics",                 code:"EP",    sem:1, color:"#9c27b0", icon:"⚛",  enrolled:598, desc:"Interference, Lasers, Quantum Mechanics, Semiconductor Physics" },
  { id:"s3",  name:"Engineering Chemistry",               code:"EC",    sem:1, color:"#2e7d32", icon:"⚗",  enrolled:574, desc:"Atomic Structure, Water Treatment, Corrosion, Polymers" },
  { id:"s4",  name:"Basic Electronics Engineering",       code:"BEE",   sem:1, color:"#c62828", icon:"📡", enrolled:541, desc:"Diodes, BJT, Op-Amps, Digital Logic, 555 Timer" },
  { id:"s5",  name:"Basic Electrical Engineering",        code:"BEE2",  sem:1, color:"#f57f17", icon:"⚡", enrolled:529, desc:"DC Circuits, AC Fundamentals, Transformers, Three-Phase Systems" },
  { id:"s6",  name:"Engineering Graphics",               code:"EG",    sem:1, color:"#00838f", icon:"📐", enrolled:607, desc:"BIS Drafting, Orthographic Projections, Isometric Views, Sections" },
  { id:"s7",  name:"Engineering Mechanics",              code:"EM",    sem:2, color:"#ad1457", icon:"⚙",  enrolled:588, desc:"Force Systems, Equilibrium, Centroid, Friction, Belt Drives" },
  { id:"s8",  name:"Fundamentals of Programming Languages",code:"FPL", sem:2, color:"#4527a0", icon:"💻", enrolled:563, desc:"C Programming, Control Structures, Arrays, Functions, Pointers" },
  { id:"s9",  name:"Programming and Problem Solving",    code:"PPS",   sem:2, color:"#00695c", icon:"🧩", enrolled:570, desc:"Problem Solving, Algorithms, Flowcharts, Python Basics, File Handling" },
  { id:"s10", name:"Engineering Mathematics – II",       code:"EM-II", sem:2, color:"#283593", icon:"∫",  enrolled:601, desc:"Multiple Integrals, Vector Calculus, Differential Equations, Laplace Transforms" },
];

const NOTES_DB = {
  s1:[
    {id:"n1",title:"Unit 1 – Differential Calculus",by:"Prof. Sharma",date:"2024-07-10",size:"2.4 MB",dl:487,rating:4.7,rcount:102,comments:[{id:"c1",user:"Rahul M.",text:"Very helpful!",time:"2 days ago",likes:12}]},
    {id:"n2",title:"Unit 2 – Matrices & Linear Algebra",by:"Prof. Sharma",date:"2024-07-18",size:"1.9 MB",dl:412,rating:4.5,rcount:88,comments:[]},
    {id:"n3",title:"Unit 3 – Complex Numbers",by:"Prof. Patil",date:"2024-08-02",size:"3.1 MB",dl:356,rating:4.6,rcount:74,comments:[]},
    {id:"n4",title:"Unit 4 – Partial Differentiation",by:"Prof. Patil",date:"2024-08-15",size:"2.7 MB",dl:298,rating:4.4,rcount:61,comments:[]},
    {id:"n5",title:"Unit 5 – Applications of Integration",by:"Prof. Sharma",date:"2024-09-01",size:"3.3 MB",dl:267,rating:4.8,rcount:57,comments:[]},
  ],
  s2:[
    {id:"n6",title:"Unit 1 – Interference & Diffraction",by:"Prof. Joshi",date:"2024-07-12",size:"3.6 MB",dl:378,rating:4.5,rcount:81,comments:[]},
    {id:"n7",title:"Unit 2 – Lasers & Fibre Optics",by:"Prof. Joshi",date:"2024-07-25",size:"2.8 MB",dl:342,rating:4.6,rcount:69,comments:[]},
  ],
  s3:[{id:"n10",title:"Unit 1 – Atomic Structure",by:"Prof. Kulkarni",date:"2024-07-11",size:"2.5 MB",dl:332,rating:4.2,rcount:66,comments:[]}],
  s4:[{id:"n14",title:"Unit 1 – Diodes & BJT",by:"Prof. Bhosale",date:"2024-07-14",size:"3.2 MB",dl:412,rating:4.6,rcount:84,comments:[]}],
  s5:[{id:"n18",title:"Unit 1 – DC Circuits",by:"Prof. Wagh",date:"2024-07-13",size:"2.3 MB",dl:395,rating:4.5,rcount:79,comments:[]}],
  s6:[{id:"n22",title:"Module 1 – BIS Standards",by:"Prof. Jadhav",date:"2024-07-09",size:"4.5 MB",dl:523,rating:4.8,rcount:108,comments:[]}],
  s7:[],s8:[],s9:[],s10:[],
};
const PYQS_DB = {
  s1:[
    {id:"p1",title:"EM-I – May 2024 End Sem",year:2024,exam:"End Semester",dl:623},
    {id:"p2",title:"EM-I – Nov 2023 End Sem",year:2023,exam:"End Semester",dl:587},
  ],
  s2:[{id:"p6",title:"Physics – May 2024 End Sem",year:2024,exam:"End Semester",dl:534}],
  s3:[],s4:[],s5:[],s6:[],s7:[],s8:[],s9:[],s10:[],
};

// ── Initial announcements with link support ───────────────────
const INIT_ANNOUNCEMENTS = [
  {id:"ga1",title:"🎉 Welcome to SPPU Study Hub!",body:"Dear FE students, welcome to your official study platform! All notes, PYQs, and announcements will be posted here.",author:"Admin",authorRole:"admin",date:"2025-01-01",pinned:true,important:true,subjectId:null,link:"https://unipune.ac.in",linkType:"external",clicks:12},
  {id:"ga2",title:"📅 End Semester Exam Schedule Released",body:"The end semester examination timetable for FE (Sem 1 & 2) has been released. All exams start at 10:00 AM. Carry your hall ticket.",author:"Prof. Sharma",authorRole:"admin",date:"2025-01-05",pinned:true,important:true,subjectId:null,link:"https://unipune.ac.in/examination",linkType:"external",clicks:87},
  {id:"ga3",title:"EM-I Unit 5 Notes Uploaded",body:"Applications of Integration notes with 20+ solved examples are now available in the EM-I subject page.",author:"Prof. Sharma",authorRole:"admin",date:"2024-09-01",pinned:false,important:false,subjectId:"s1",link:"",linkType:"internal",clicks:34},
  {id:"ga4",title:"Physics Lab Viva – 20 Jan 2025",body:"Physics laboratory viva voce on 20th January. Prepare all 10 experiments. Observation journals must be submitted before the viva.",author:"Prof. Joshi",authorRole:"admin",date:"2025-01-10",pinned:false,important:true,subjectId:"s2",link:"https://nptel.ac.in/courses/115/104/115104099/",linkType:"external",clicks:56},
  {id:"ga5",title:"Python Mini-Project Guidelines Posted",body:"Guidelines for the PPS mini-project are now available. Teams of 2 students. Submission: 15th January 2025.",author:"Prof. Deshpande",authorRole:"admin",date:"2024-12-10",pinned:false,important:false,subjectId:"s9",link:"https://docs.python.org/3/tutorial/",linkType:"external",clicks:29},
  {id:"ga6",title:"New Quiz Sets Added for EM-I!",body:"Unit 1 and Unit 2 quizzes for Engineering Mathematics I are now live. Practice MCQs with instant explanations.",author:"Prof. Sharma",authorRole:"admin",date:"2025-01-08",pinned:false,important:false,subjectId:"s1",link:"",linkType:"internal",clicks:18},
];

const QUIZZES_DB = {
  s1:[
    {id:"q1",unit:1,title:"Unit 1 – Differential Calculus",questions:[
      {id:1,q:"The derivative of xⁿ with respect to x is:",opts:["nxⁿ⁻¹","nxⁿ","(n-1)xⁿ","xⁿ⁻¹"],ans:0,exp:"Power rule: d/dx(xⁿ) = nxⁿ⁻¹."},
      {id:2,q:"If f(x) = sin(x), then f''(x) equals:",opts:["cos(x)","-cos(x)","sin(x)","-sin(x)"],ans:3,exp:"f'(x)=cos(x), f''(x)=-sin(x)."},
      {id:3,q:"L'Hôpital's rule applies when limit is of form:",opts:["0/1","∞/0","0/0 or ∞/∞","1/∞"],ans:2,exp:"L'Hôpital's rule is for indeterminate forms 0/0 or ∞/∞."},
      {id:4,q:"If y = eˣ, then dy/dx equals:",opts:["eˣ⁻¹","xeˣ","eˣ","1"],ans:2,exp:"eˣ is its own derivative."},
      {id:5,q:"Maclaurin series of eˣ starts with:",opts:["1-x+x²/2!","1+x+x²/2!","x+x²/2!","x-x²/2!"],ans:1,exp:"eˣ = 1+x+x²/2!+x³/3!+…"},
    ]},
    {id:"q2",unit:2,title:"Unit 2 – Matrices",questions:[
      {id:1,q:"Determinant of identity matrix of order 3 is:",opts:["0","1","3","-1"],ans:1,exp:"Identity matrix det = 1 always."},
      {id:2,q:"Eigenvalues of a triangular matrix are:",opts:["All zeros","Diagonal elements","Off-diagonal elements","Undefined"],ans:1,exp:"Eigenvalues of triangular matrix = diagonal entries."},
      {id:3,q:"Cayley-Hamilton theorem states every matrix satisfies:",opts:["Adjoint equation","Characteristic equation","Identity equation","None"],ans:1,exp:"Every matrix satisfies its own characteristic polynomial."},
    ]},
  ],
  s2:[
    {id:"q4",unit:1,title:"Unit 1 – Interference",questions:[
      {id:1,q:"In Young's double slit, fringe width β =",opts:["λd/D","λD/d","dD/λ","d/λD"],ans:1,exp:"β = λD/d."},
      {id:2,q:"Constructive interference when path difference is:",opts:["(2n+1)λ/2","nλ","(2n-1)λ/2","nλ/2"],ans:1,exp:"Path diff = nλ gives bright fringes."},
    ]},
  ],
  s4:[
    {id:"q5",unit:1,title:"Unit 1 – Diodes & BJT",questions:[
      {id:1,q:"Knee voltage for Silicon diode is approximately:",opts:["0.3V","0.7V","1.1V","1.4V"],ans:1,exp:"Si diode conducts at ~0.7V."},
      {id:2,q:"Current gain β = ",opts:["IC/IB","IB/IC","IE/IB","IC/IE"],ans:0,exp:"β = IC/IB (collector/base current)."},
    ]},
  ],
  s3:[],s5:[],s6:[],s7:[],s8:[],s9:[],s10:[],
};

const LEADERBOARD=[
  {rank:1,name:"Prof. Sharma",role:"admin",points:2840,uploads:42,answers:128},
  {rank:2,name:"Prof. Jadhav",role:"admin",points:2210,uploads:38,answers:96},
  {rank:3,name:"Rahul M.",role:"student",points:1650,uploads:0,answers:87},
  {rank:4,name:"Sneha P.",role:"student",points:1420,uploads:0,answers:72},
  {rank:5,name:"Prof. Joshi",role:"admin",points:1390,uploads:29,answers:61},
];
const FORUM_POSTS=[
  {id:"f1",title:"How to approach Laplace Transform questions?",body:"I've been struggling with Laplace transforms. Anyone have tips?",author:"Rahul M.",subject:"Engineering Mathematics – I",subId:"s1",tags:["math","laplace"],upvotes:34,downvotes:2,time:"2 hours ago",replies:[
    {id:"r1",author:"Sneha P.",text:"Focus on s-shifting and t-shifting theorems.",upvotes:18,time:"1 hour ago"},
    {id:"r2",author:"Prof. Sharma",text:"Practice partial fractions thoroughly.",upvotes:25,time:"45 min ago",isAdmin:true},
  ]},
  {id:"f2",title:"KVL and KCL solved examples?",body:"Looking for solved network problems.",author:"Priya K.",subject:"Basic Electrical Engineering",subId:"s5",tags:["electrical"],upvotes:21,downvotes:1,time:"5 hours ago",replies:[]},
];
const SYLLABUS_DATA={
  sem1:[
    {sub:"Engineering Mathematics – I",units:["Differential Calculus","Matrices","Complex Numbers","Partial Differentiation","Integration"]},
    {sub:"Engineering Physics",units:["Interference","Lasers","Quantum Mechanics","Semiconductor Physics","Superconductivity"]},
    {sub:"Basic Electronics Engineering",units:["Diodes","BJT","Op-Amps","Digital Logic","555 Timer"]},
  ],
  sem2:[
    {sub:"Engineering Mechanics",units:["Force Systems","Equilibrium","Centroid & MOI","Friction","Kinematics"]},
    {sub:"Fundamentals of Programming Languages",units:["C Intro","Control Structures","Arrays","Functions","Pointers"]},
    {sub:"Engineering Mathematics – II",units:["Multiple Integrals","Vector Calculus","Differential Equations","Numerical Methods","Laplace"]},
  ],
};

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════
const useLocalStorage=(key,init)=>{
  const[val,setVal]=useState(()=>{ try{const s=localStorage.getItem(key);return s?JSON.parse(s):init;}catch{return init;} });
  const set=useCallback(v=>{setVal(v);try{localStorage.setItem(key,JSON.stringify(v));}catch{}},[key]);
  return[val,set];
};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const isValidUrl=url=>{try{new URL(url);return true;}catch{return false;}};

const Badge=({children,color="#1a73e8",small})=>(
  <span style={{background:color+"20",color,borderRadius:20,padding:small?"1px 7px":"2px 10px",fontSize:small?10:11,fontWeight:600,whiteSpace:"nowrap"}}>{children}</span>
);
const Pill=({children,active,onClick,color="#1a73e8"})=>(
  <button onClick={onClick} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${active?color:"var(--border)"}`,background:active?color+"18":"transparent",color:active?color:"var(--muted)",fontWeight:active?600:400,fontSize:13,cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>{children}</button>
);
const Avatar=({name,size=32,color="#1a73e8"})=>(
  <div style={{width:size,height:size,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:size*0.38,flexShrink:0}}>{name?.[0]?.toUpperCase()}</div>
);
const Empty=({icon,title,sub})=>(
  <div style={{textAlign:"center",padding:"60px 20px"}}>
    <div style={{fontSize:52,marginBottom:12}}>{icon}</div>
    <div style={{fontSize:17,fontWeight:700,color:"var(--text)",marginBottom:6}}>{title}</div>
    <div style={{fontSize:14,color:"var(--muted)",maxWidth:300,margin:"0 auto",lineHeight:1.6}}>{sub}</div>
  </div>
);
const Stars=({rating,count})=>(
  <div style={{display:"flex",alignItems:"center",gap:3}}>
    {[1,2,3,4,5].map(s=><span key={s} style={{fontSize:13,color:s<=rating?"#f59e0b":"#d1d5db"}}>★</span>)}
    {count!=null&&<span style={{fontSize:11,color:"var(--muted)",marginLeft:2}}>{rating?.toFixed(1)} ({count})</span>}
  </div>
);
const Toast=({msg,type})=>(
  <div style={{position:"fixed",bottom:90,right:16,zIndex:9999,background:type==="error"?"#ea4335":type==="warn"?"#f59e0b":"#1a73e8",color:"#fff",padding:"12px 20px",borderRadius:12,fontWeight:500,fontSize:14,boxShadow:"0 8px 28px rgba(0,0,0,.22)",animation:"toastIn .3s ease",maxWidth:300}}>{msg}</div>
);
const lblS=dark=>({display:"block",fontSize:12,fontWeight:600,marginBottom:6,color:dark?"#999":"#6b7280",textTransform:"uppercase",letterSpacing:".05em"});
const inpS=dark=>({width:"100%",padding:"11px 14px",borderRadius:10,border:`1.5px solid ${dark?"#2a2a35":"#e2e5ea"}`,background:dark?"#1a1a1f":"#f9fafb",color:dark?"#eee":"#111",fontSize:14,outline:"none"});

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App(){
  const[dark,setDark]=useLocalStorage("dark",false);
  const[user,setUser]=useLocalStorage("user",null);
  const[page,setPage]=useState("dashboard");
  const[activeSub,setActiveSub]=useState(null);
  const[bookmarks,setBookmarks]=useLocalStorage("bookmarks",{notes:[],pyqs:[]});
  const[notes,setNotes]=useState(NOTES_DB);
  const[pyqs,setPyqs]=useState(PYQS_DB);
  const[quizzes,setQuizzes]=useState(QUIZZES_DB);
  const[announcements,setAnnouncements]=useState(INIT_ANNOUNCEMENTS);
  const[readAnnIds,setReadAnnIds]=useLocalStorage("readAnns",[]);
  const[forumPosts,setForumPosts]=useState(FORUM_POSTS);
  const[tasks,setTasks]=useLocalStorage("tasks",[
    {id:"t1",title:"Study Laplace Transforms",subject:"s1",deadline:"2025-01-14",priority:"high",done:false},
    {id:"t2",title:"Complete Drawing Sheet",subject:"s6",deadline:"2025-01-10",priority:"medium",done:false},
    {id:"t3",title:"Practice KVL/KCL",subject:"s5",deadline:"2025-01-12",priority:"low",done:true},
    {id:"t4",title:"Python mini-project",subject:"s9",deadline:"2025-01-15",priority:"high",done:false},
  ]);
  const[calEvents,setCalEvents]=useLocalStorage("calEvents",[
    {id:"e1",title:"EM-I End Sem",date:"2025-01-15",type:"exam",subId:"s1",time:"10:00"},
    {id:"e2",title:"Physics Lab Viva",date:"2025-01-20",type:"viva",subId:"s2",time:"09:00"},
  ]);
  const[toast,setToast]=useState(null);
  const[sidebarOpen,setSidebarOpen]=useState(true);
  const[uploadModal,setUploadModal]=useState(false);
  const[calModal,setCalModal]=useState(null);
  const[chatOpen,setChatOpen]=useState(false);
  const[quizModal,setQuizModal]=useState(null);
  const[addQuizModal,setAddQuizModal]=useState(null);
  const[viewerModal,setViewerModal]=useState(null);

  const showToast=useCallback((msg,type="success")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),3200); },[]);
  const navTo=(pg,sub=null)=>{ setPage(pg); if(sub) setActiveSub(sub); };
  const markRead=id=>{ if(!readAnnIds.includes(id)) setReadAnnIds(p=>[...p,id]); };
  const unreadCount=announcements.filter(a=>!readAnnIds.includes(a.id)).length;
  const toggleBookmark=(type,id)=>{ setBookmarks(prev=>{ const arr=prev[type]; const has=arr.includes(id); showToast(has?"Removed bookmark":"Bookmarked!",has?"warn":"success"); return{...prev,[type]:has?arr.filter(x=>x!==id):[...arr,id]}; }); };

  const trackClick=id=>{ setAnnouncements(prev=>prev.map(a=>a.id===id?{...a,clicks:(a.clicks||0)+1}:a)); };

  const theme={"--bg":dark?"#0d0d0f":"#f0f2f5","--surface":dark?"#1a1a1f":"#ffffff","--sidebar":dark?"#111115":"#ffffff","--border":dark?"#2a2a35":"#e2e5ea","--text":dark?"#eeeef0":"#111827","--muted":dark?"#7c7c8a":"#6b7280","--hover":dark?"#22222c":"#f3f4f6"};
  useEffect(()=>{ Object.entries(theme).forEach(([k,v])=>document.documentElement.style.setProperty(k,v)); },[dark]);

  if(!user) return <ThemeCtx.Provider value={{dark,setDark}}><AuthPage onLogin={setUser}/></ThemeCtx.Provider>;

  const ctx={
    page,navTo,activeSub,setActiveSub,
    bookmarks,toggleBookmark,isBookmarked:(t,id)=>bookmarks[t].includes(id),
    notes,setNotes,pyqs,setPyqs,quizzes,setQuizzes,
    announcements,setAnnouncements,readAnnIds,markRead,unreadCount,trackClick,
    forumPosts,setForumPosts,tasks,setTasks,calEvents,setCalEvents,
    showToast,uploadModal,setUploadModal,calModal,setCalModal,
    chatOpen,setChatOpen,quizModal,setQuizModal,addQuizModal,setAddQuizModal,
    viewerModal,setViewerModal,
  };

  return(
    <ThemeCtx.Provider value={{dark,setDark}}>
      <AuthCtx.Provider value={{user,setUser}}>
        <AppCtx.Provider value={ctx}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            *{box-sizing:border-box;margin:0;padding:0}
            body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);transition:background .25s,color .25s}
            input,select,textarea{font-family:'Plus Jakarta Sans',sans-serif}
            @keyframes spin{to{transform:rotate(360deg)}}
            @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
            @keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
            @keyframes fadeIn{from{opacity:0}to{opacity:1}}
            @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
            @keyframes ripple{from{transform:scale(0);opacity:.35}to{transform:scale(4);opacity:0}}
            @keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
            ::-webkit-scrollbar{width:5px;height:5px}
            ::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
          `}</style>
          <div style={{display:"flex",height:"100vh",overflow:"hidden"}}>
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}/>
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
              <TopBar setOpen={setSidebarOpen}/>
              <main style={{flex:1,overflowY:"auto",padding:"20px 20px",animation:"fadeIn .25s ease"}}>
                {page==="dashboard"    &&<Dashboard/>}
                {page==="subject"      &&activeSub&&<SubjectPage/>}
                {page==="bookmarks"    &&<BookmarksPage/>}
                {page==="forum"        &&<ForumPage/>}
                {page==="planner"      &&<PlannerPage/>}
                {page==="calendar"     &&<CalendarPage/>}
                {page==="syllabus"     &&<SyllabusPage/>}
                {page==="leaderboard"  &&<LeaderboardPage/>}
                {page==="profile"      &&<ProfilePage/>}
                {page==="announcements"&&<AnnouncementsPage/>}
              </main>
            </div>
          </div>
          {uploadModal &&<UploadModal/>}
          {calModal    &&<CalEventModal/>}
          {quizModal   &&<QuizModal/>}
          {addQuizModal&&<AddQuizModal/>}
          {viewerModal &&<DocumentViewerModal/>}
          {chatOpen    &&<ChatAssistant onClose={()=>setChatOpen(false)}/>}
          {toast       &&<Toast {...toast}/>}
          {/* FAB — AI launcher */}
          <AIFab onOpenInternal={()=>setChatOpen(c=>!c)} showToast={(...a)=>{setToast({msg:a[0],type:a[1]||"success"});setTimeout(()=>setToast(null),3000);}} />
        </AppCtx.Provider>
      </AuthCtx.Provider>
    </ThemeCtx.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════
// AUTH PAGE
// ═══════════════════════════════════════════════════════════════
function AuthPage({onLogin}){
  const{dark,setDark}=useContext(ThemeCtx);
  const[mode,setMode]=useState("login");
  const[form,setForm]=useState({name:"",email:"",password:""});
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const submit=async()=>{
    if(!form.email||!form.password){setErr("Fill all fields");return;}
    setErr("");setLoading(true);await sleep(900);setLoading(false);
    const isAdmin=form.email.includes("admin")||form.email==="admin@sppu.edu";
    onLogin({name:form.name||(isAdmin?"Admin User":"Student"),email:form.email,role:isAdmin?"admin":"student",branch:"FE",joined:"Jan 2025",avatar:(form.name||form.email)?.[0]?.toUpperCase()||"S",points:isAdmin?2840:450,answers:isAdmin?128:12});
  };
  return(
    <div style={{minHeight:"100vh",display:"flex",fontFamily:"'Plus Jakarta Sans',sans-serif",background:dark?"#0d0d0f":"#f0f2f5"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:40,background:"linear-gradient(135deg,#1a73e8,#0d47a1 50%,#1b5e20)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:.07,backgroundImage:"radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px)",backgroundSize:"36px 36px"}}/>
        <div style={{position:"relative",textAlign:"center",color:"#fff",maxWidth:340}}>
          <div style={{fontSize:60,marginBottom:12}}>📚</div>
          <h1 style={{fontSize:32,fontWeight:800,marginBottom:10}}>SPPU Study Hub</h1>
          <p style={{fontSize:15,opacity:.85,lineHeight:1.6,marginBottom:28}}>Your complete FE Engineering academic companion</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["📄","Notes & PYQs"],["📝","Unit Quizzes"],["📢","Announcements"],["🤖","AI Assistant"]].map(([ic,lb])=>(
              <div key={lb} style={{background:"rgba(255,255,255,.12)",borderRadius:12,padding:"12px 14px",backdropFilter:"blur(8px)"}}>
                <div style={{fontSize:22}}>{ic}</div><div style={{fontSize:12,fontWeight:600,marginTop:4}}>{lb}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{width:440,display:"flex",flexDirection:"column",justifyContent:"center",padding:"40px 44px",background:dark?"#111115":"#fff",overflowY:"auto",position:"relative"}}>
        <button onClick={()=>setDark(!dark)} style={{position:"absolute",top:18,right:18,background:"none",border:`1px solid ${dark?"#333":"#e2e5ea"}`,borderRadius:20,padding:"5px 12px",cursor:"pointer",color:dark?"#eee":"#333",fontSize:12}}>{dark?"☀ Light":"🌙 Dark"}</button>
        <h2 style={{fontSize:24,fontWeight:800,color:dark?"#eee":"#111",marginBottom:6}}>{mode==="login"?"Welcome back 👋":"Join us ✨"}</h2>
        <p style={{color:dark?"#888":"#6b7280",fontSize:13,marginBottom:20}}>SPPU First Year Engineering Platform</p>
        <div style={{marginBottom:14,padding:"10px 14px",background:"#1a73e818",borderRadius:10,fontSize:12,color:"#1a73e8",border:"1px solid #1a73e830"}}>💡 Demo: <strong>admin@sppu.edu</strong> for admin · any email for student</div>
        {mode==="signup"&&<div style={{marginBottom:12}}><label style={lblS(dark)}>Full Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" style={inpS(dark)}/></div>}
        <div style={{marginBottom:12}}><label style={lblS(dark)}>Email</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} type="email" placeholder="you@sppu.edu" style={inpS(dark)}/></div>
        <div style={{marginBottom:14}}><label style={lblS(dark)}>Password</label><input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" placeholder="••••••••" style={inpS(dark)}/></div>
        {err&&<p style={{color:"#ea4335",fontSize:12,marginBottom:10}}>{err}</p>}
        <button onClick={submit} disabled={loading} style={{width:"100%",padding:"13px",background:loading?"#93b4f0":"#1a73e8",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",boxShadow:"0 4px 16px rgba(26,115,232,.3)"}}>
          {loading?"Signing in…":mode==="login"?"Sign In →":"Create Account →"}
        </button>
        <p style={{textAlign:"center",marginTop:16,fontSize:13,color:dark?"#888":"#6b7280"}}>
          {mode==="login"?"No account? ":"Have an account? "}
          <button onClick={()=>setMode(m=>m==="login"?"signup":"login")} style={{color:"#1a73e8",background:"none",border:"none",cursor:"pointer",fontWeight:700}}>{mode==="login"?"Sign up":"Sign in"}</button>
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════
function Sidebar({open,setOpen}){
  const{user}=useContext(AuthCtx);
  const{page,navTo,activeSub,unreadCount}=useContext(AppCtx);
  const nav=[
    {id:"dashboard",icon:"⊞",label:"Dashboard"},
    {id:"announcements",icon:"📢",label:"Announcements",badge:unreadCount},
    {id:"planner",icon:"📋",label:"Study Planner"},
    {id:"calendar",icon:"📅",label:"Calendar"},
    {id:"forum",icon:"💬",label:"Forum"},
    {id:"syllabus",icon:"📖",label:"Syllabus"},
    {id:"leaderboard",icon:"🏆",label:"Leaderboard"},
    {id:"bookmarks",icon:"🔖",label:"Bookmarks"},
    {id:"profile",icon:"👤",label:"Profile"},
  ];
  return(
    <div style={{width:open?248:0,minWidth:open?248:0,background:"var(--sidebar)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",overflow:"hidden",transition:"width .22s ease,min-width .22s ease",zIndex:100,flexShrink:0}}>
      <div style={{padding:"16px 14px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid var(--border)"}}>
        <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#1a73e8,#0d47a1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:17}}>📚</div>
        {open&&<div><div style={{fontWeight:800,fontSize:13,color:"var(--text)",whiteSpace:"nowrap"}}>SPPU Study Hub</div><div style={{fontSize:10,color:"var(--muted)"}}>First Year Engineering</div></div>}
      </div>
      <nav style={{padding:"8px 6px",flex:1,overflowY:"auto"}}>
        {nav.map(item=>(
          <button key={item.id} onClick={()=>navTo(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"8px 9px",borderRadius:9,border:"none",cursor:"pointer",background:page===item.id?"#1a73e818":"transparent",color:page===item.id?"#1a73e8":"var(--muted)",fontWeight:page===item.id?700:500,fontSize:12,transition:"all .15s",marginBottom:1,whiteSpace:"nowrap",textAlign:"left"}}>
            <span style={{fontSize:15,width:19,textAlign:"center",flexShrink:0}}>{item.icon}</span>
            {open&&<span style={{flex:1}}>{item.label}</span>}
            {open&&item.badge>0&&<span style={{background:"#ea4335",color:"#fff",borderRadius:10,padding:"1px 5px",fontSize:10,fontWeight:700}}>{item.badge}</span>}
          </button>
        ))}
        {open&&(
          <div style={{marginTop:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",padding:"3px 9px",marginBottom:3,textTransform:"uppercase",letterSpacing:".08em"}}>Subjects</div>
            {SUBJECTS.map(sub=>(
              <button key={sub.id} onClick={()=>navTo("subject",sub)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 9px",borderRadius:8,border:"none",cursor:"pointer",background:activeSub?.id===sub.id&&page==="subject"?"#1a73e810":"transparent",color:"var(--text)",fontSize:11,transition:"background .15s",textAlign:"left",marginBottom:1}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:sub.color,flexShrink:0}}/>
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{sub.name}</span>
              </button>
            ))}
          </div>
        )}
      </nav>
      {open&&user&&(
        <div style={{padding:"10px 12px",borderTop:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8}}>
          <Avatar name={user.name} size={30} color="#1a73e8"/>
          <div style={{overflow:"hidden",flex:1}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div>
            <Badge color={user.role==="admin"?"#ea4335":"#34a853"} small>{user.role}</Badge>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TOP BAR
// ═══════════════════════════════════════════════════════════════
function TopBar({setOpen}){
  const{dark,setDark}=useContext(ThemeCtx);
  const{user,setUser}=useContext(AuthCtx);
  const{setUploadModal,navTo,unreadCount}=useContext(AppCtx);
  const[drop,setDrop]=useState(false);
  return(
    <div style={{height:56,background:"var(--sidebar)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",padding:"0 14px",gap:10,flexShrink:0,zIndex:50}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:36,height:36,borderRadius:18,border:"none",background:"transparent",cursor:"pointer",fontSize:17,color:"var(--muted)",display:"flex",alignItems:"center",justifyContent:"center"}}>☰</button>
      <AdvancedSearch />
      <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:"auto"}}>
        {user?.role==="admin"&&(
          <button onClick={()=>setUploadModal(true)} style={{padding:"6px 14px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:18,fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Upload</button>
        )}
        <button onClick={()=>navTo("announcements")} style={{position:"relative",width:34,height:34,borderRadius:17,border:"none",background:"transparent",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
          🔔{unreadCount>0&&<span style={{position:"absolute",top:2,right:2,width:15,height:15,background:"#ea4335",borderRadius:"50%",fontSize:9,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{unreadCount}</span>}
        </button>
        <button onClick={()=>setDark(!dark)} style={{width:34,height:34,borderRadius:17,border:"none",background:"transparent",cursor:"pointer",fontSize:16}}>{dark?"☀️":"🌙"}</button>
        <div style={{position:"relative"}}>
          <button onClick={()=>setDrop(d=>!d)} style={{width:34,height:34,borderRadius:"50%",background:"#1a73e8",border:"none",cursor:"pointer",color:"#fff",fontWeight:800,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>{user?.avatar}</button>
          {drop&&(
            <div style={{position:"absolute",right:0,top:42,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:6,boxShadow:"0 10px 40px rgba(0,0,0,.18)",zIndex:200,minWidth:170,animation:"fadeUp .2s ease"}}>
              <div style={{padding:"7px 10px",borderBottom:"1px solid var(--border)",marginBottom:4}}>
                <div style={{fontWeight:700,fontSize:13,color:"var(--text)"}}>{user?.name}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{user?.email}</div>
              </div>
              <button onClick={()=>{navTo("profile");setDrop(false);}} style={{width:"100%",padding:"7px 10px",border:"none",background:"transparent",color:"var(--text)",fontSize:12,cursor:"pointer",textAlign:"left",borderRadius:6}}>👤 Profile</button>
              <button onClick={()=>{setUser(null);localStorage.removeItem("user");}} style={{width:"100%",padding:"7px 10px",border:"none",background:"transparent",color:"#ea4335",fontSize:12,cursor:"pointer",textAlign:"left",borderRadius:6}}>🚪 Sign out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STUDY PLAN CARD
// ═══════════════════════════════════════════════════════════════
function SPCProgressBar({pct}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{flex:1,height:7,borderRadius:4,background:"#dbeafe",overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:4,width:`${pct}%`,background:pct===100?"#34a853":"linear-gradient(90deg,#1a73e8,#34a853)",transition:"width .7s cubic-bezier(.4,0,.2,1)"}}/>
      </div>
      <span style={{fontSize:11,fontWeight:700,color:pct===100?"#34a853":"#1a73e8",whiteSpace:"nowrap",minWidth:46,textAlign:"right"}}>{pct}% done</span>
    </div>
  );
}
function SPCBadge({count}){
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,flexShrink:0,padding:"8px 16px",borderLeft:"1.5px solid #c7d9fb"}}>
      <span style={{fontSize:26,fontWeight:900,lineHeight:1,color:count===0?"#34a853":"#1a73e8"}}>{count}</span>
      <span style={{fontSize:9,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".07em"}}>Pending</span>
    </div>
  );
}
function StudyPlanCard(){
  const{tasks,navTo}=useContext(AppCtx);
  const[hovered,setHovered]=useState(false);
  const pending=tasks.filter(t=>!t.done);
  const done=tasks.filter(t=>t.done);
  const high=pending.filter(t=>t.priority==="high").length;
  const total=pending.length;
  const pct=tasks.length?Math.round((done.length/tasks.length)*100):0;
  return(
    <div role="button" onClick={()=>navTo("planner")} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{display:"flex",alignItems:"center",gap:18,padding:"18px 22px",marginBottom:24,borderRadius:16,border:"1.5px solid #c7d9fb",background:"linear-gradient(135deg,#e8f0fe,#f0fdf4)",cursor:"pointer",userSelect:"none",transform:hovered?"scale(1.015)":"scale(1)",boxShadow:hovered?"0 10px 32px rgba(26,115,232,.2)":"0 3px 14px rgba(26,115,232,.09)",transition:"transform .2s cubic-bezier(.4,0,.2,1),box-shadow .2s ease",animation:"fadeUp .4s ease both"}}>
      <div style={{width:48,height:48,borderRadius:13,flexShrink:0,background:"linear-gradient(135deg,#1a73e8,#4285f4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:hovered?"0 5px 16px rgba(26,115,232,.4)":"0 3px 10px rgba(26,115,232,.22)",transition:"box-shadow .2s"}}>📚</div>
      <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:7}}>
        <span style={{fontSize:15,fontWeight:800,color:"#1a1a2e"}}>Study Plan</span>
        {total===0?<p style={{fontSize:13,color:"#374151",margin:0}}>🎉 All tasks completed!</p>
          :<p style={{fontSize:13,color:"#374151",margin:0}}>You have <strong style={{color:"#1a73e8"}}>{total} pending {total===1?"task":"tasks"}</strong>{high>0&&<> · <span style={{color:"#ea4335",fontWeight:700}}>{high} high priority</span></>}</p>}
        <SPCProgressBar pct={pct}/>
      </div>
      <SPCBadge count={total}/>
      <span style={{fontSize:20,color:"#1a73e8",flexShrink:0,opacity:.6,transform:hovered?"translateX(3px)":"translateX(0)",transition:"transform .2s"}}>›</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ANNOUNCEMENT CARD (full-featured with links + analytics)
// ═══════════════════════════════════════════════════════════════
function AnnouncementCard({ann, compact, onClick}){
  const{readAnnIds,markRead,announcements,setAnnouncements,showToast,trackClick}=useContext(AppCtx);
  const{user}=useContext(AuthCtx);
  const[ripple,setRipple]=useState(null);
  const isRead=readAnnIds.includes(ann.id);
  const subj=ann.subjectId?SUBJECTS.find(s=>s.id===ann.subjectId):null;
  const hasLink=ann.link&&ann.link.trim()!=="";

  const handleClick=e=>{
    // ripple
    const rect=e.currentTarget.getBoundingClientRect();
    setRipple({x:e.clientX-rect.left,y:e.clientY-rect.top});
    setTimeout(()=>setRipple(null),600);

    markRead(ann.id);

    if(hasLink){
      if(!isValidUrl(ann.link)){showToast("Invalid link attached","error");return;}
      trackClick(ann.id);
      window.open(ann.link,"_blank","noopener,noreferrer");
    } else {
      onClick&&onClick();
    }
  };

  const handlePin=e=>{ e.stopPropagation(); setAnnouncements(prev=>prev.map(a=>a.id===ann.id?{...a,pinned:!a.pinned}:a)); showToast(ann.pinned?"Unpinned":"📌 Pinned!"); };
  const handleDelete=e=>{ e.stopPropagation(); setAnnouncements(prev=>prev.filter(a=>a.id!==ann.id)); showToast("Deleted","warn"); };

  return(
    <div onClick={handleClick} style={{background:"var(--surface)",borderRadius:14,padding:compact?"14px 16px":"18px 20px",border:`1.5px solid ${ann.pinned?"#f59e0b50":isRead?"var(--border)":"#1a73e840"}`,cursor:hasLink?"pointer":"default",transition:"all .2s",position:"relative",overflow:"hidden",userSelect:"none"}}
      onMouseEnter={e=>{if(hasLink){e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,.13)";e.currentTarget.style.transform="translateY(-2px) scale(1.01)";}}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
      {/* pinned stripe */}
      {ann.pinned&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#f59e0b,#f97316)"}}/>}
      {/* ripple */}
      {ripple&&<span style={{position:"absolute",left:ripple.x,top:ripple.y,width:12,height:12,borderRadius:"50%",background:"#1a73e8",transform:"scale(0)",opacity:.35,animation:"ripple .6s linear",pointerEvents:"none",marginLeft:-6,marginTop:-6}}/>}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:7,flex:1,minWidth:0}}>
          {ann.pinned&&<span style={{fontSize:13,flexShrink:0}}>📌</span>}
          {!isRead&&<span style={{width:8,height:8,borderRadius:"50%",background:"#1a73e8",flexShrink:0,animation:"pulse 2s infinite"}}/>}
          <span style={{fontSize:compact?13:15,fontWeight:700,color:"var(--text)",lineHeight:1.3,overflow:compact?"hidden":"visible",textOverflow:compact?"ellipsis":"unset",whiteSpace:compact?"nowrap":"normal"}}>{ann.title}</span>
        </div>
        {/* Right side: link icon + admin controls */}
        <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
          {hasLink&&(
            <span title="Opens external link" style={{fontSize:14,color:"#1a73e8",opacity:.8}}>🔗</span>
          )}
          {user?.role==="admin"&&!compact&&(
            <>
              <button onClick={handlePin} style={{padding:"2px 7px",fontSize:10,background:ann.pinned?"#f59e0b18":"var(--hover)",border:"1px solid var(--border)",borderRadius:6,cursor:"pointer",color:"#f59e0b",fontWeight:600}}>{ann.pinned?"Unpin":"Pin"}</button>
              <button onClick={handleDelete} style={{padding:"2px 7px",fontSize:10,background:"#ea433510",border:"1px solid #ea433330",borderRadius:6,cursor:"pointer",color:"#ea4335",fontWeight:600}}>Del</button>
            </>
          )}
        </div>
      </div>

      <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.65,marginBottom:10,display:compact?"-webkit-box":"block",WebkitLineClamp:compact?2:100,WebkitBoxOrient:"vertical",overflow:compact?"hidden":"visible"}}>{ann.body}</p>

      <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
        <span style={{fontSize:11,color:"var(--muted)"}}>By {ann.author}</span>
        <span style={{fontSize:11,color:"var(--muted)"}}>· {ann.date}</span>
        {ann.important&&<Badge color="#ea4335" small>Important</Badge>}
        {subj&&<Badge color={subj.color} small>{subj.code}</Badge>}
        {!isRead&&<Badge color="#1a73e8" small>New</Badge>}
        {ann.clicks>0&&<span style={{fontSize:10,color:"var(--muted)",marginLeft:"auto"}}>👁 {ann.clicks} views</span>}
      </div>

      {/* Link hint */}
      {hasLink&&!compact&&(
        <div style={{marginTop:10,display:"flex",alignItems:"center",gap:6,padding:"7px 10px",background:"#1a73e810",borderRadius:8,border:"1px solid #1a73e820"}}>
          <span style={{fontSize:13}}>🔗</span>
          <span style={{fontSize:11,color:"#1a73e8",fontWeight:600,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ann.link}</span>
          <span style={{fontSize:10,color:"var(--muted)",whiteSpace:"nowrap"}}>Tap to open ↗</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ANNOUNCEMENTS PAGE (admin can add links)
// ═══════════════════════════════════════════════════════════════
function AnnouncementsPage(){
  const{announcements,setAnnouncements,showToast,markRead,readAnnIds,trackClick}=useContext(AppCtx);
  const{user}=useContext(AuthCtx);
  const{dark}=useContext(ThemeCtx);
  const[filter,setFilter]=useState("all");
  const[showForm,setShowForm]=useState(false);
  const[form,setForm]=useState({title:"",body:"",subjectId:"",important:false,link:"",linkType:"external"});
  const[linkErr,setLinkErr]=useState("");

  const validateAndPost=()=>{
    if(!form.title||!form.body){showToast("Fill title and message","warn");return;}
    if(form.link&&!isValidUrl(form.link)){setLinkErr("Please enter a valid URL (e.g. https://example.com)");return;}
    setLinkErr("");
    const a={id:Date.now()+"",title:form.title,body:form.body,author:user.name,authorRole:"admin",date:new Date().toISOString().split("T")[0],pinned:false,important:form.important,subjectId:form.subjectId||null,link:form.link.trim(),linkType:form.linkType,clicks:0};
    setAnnouncements(prev=>[a,...prev]);
    setForm({title:"",body:"",subjectId:"",important:false,link:"",linkType:"external"});
    setShowForm(false);showToast("📢 Announcement posted!");
  };

  const sorted=[...announcements].filter(a=>{
    if(filter==="pinned") return a.pinned;
    if(filter==="unread") return!readAnnIds.includes(a.id);
    if(filter==="important") return a.important;
    if(filter==="links") return a.link&&a.link!=="";
    return true;
  }).sort((a,b)=>{ if(a.pinned&&!b.pinned) return -1; if(!a.pinned&&b.pinned) return 1; return b.date.localeCompare(a.date); });

  // top-clicked
  const topClicked=[...announcements].filter(a=>a.clicks>0).sort((a,b)=>b.clicks-a.clicks).slice(0,3);

  return(
    <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontSize:21,fontWeight:800,color:"var(--text)"}}>📢 Announcements</h1>
          <p style={{fontSize:13,color:"var(--muted)",marginTop:3}}>{announcements.filter(a=>!readAnnIds.includes(a.id)).length} unread · {announcements.length} total</p>
        </div>
        {user?.role==="admin"&&<button onClick={()=>setShowForm(s=>!s)} style={{padding:"9px 18px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>+ New Announcement</button>}
      </div>

      {/* Admin create form */}
      {showForm&&(
        <div style={{background:"var(--surface)",borderRadius:16,padding:22,border:"1px solid var(--border)",marginBottom:22,animation:"fadeUp .25s ease"}}>
          <div style={{fontSize:14,fontWeight:800,color:"var(--text)",marginBottom:14}}>📝 Create Announcement</div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Announcement title…" style={{...inpS(dark),width:"100%"}}/>
            <textarea value={form.body} onChange={e=>setForm({...form,body:e.target.value})} placeholder="Write your message…" rows={3} style={{...inpS(dark),width:"100%",resize:"vertical"}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
              <div>
                <label style={lblS(dark)}>Subject (optional)</label>
                <select value={form.subjectId} onChange={e=>setForm({...form,subjectId:e.target.value})} style={{...inpS(dark),width:"100%"}}>
                  <option value="">General</option>
                  {SUBJECTS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{display:"flex",alignItems:"flex-end",paddingBottom:2}}>
                <label style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",userSelect:"none"}}>
                  <div onClick={()=>setForm({...form,important:!form.important})} style={{width:20,height:20,borderRadius:5,border:`2px solid ${form.important?"#ea4335":"var(--border)"}`,background:form.important?"#ea4335":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .15s"}}>
                    {form.important&&<span style={{color:"#fff",fontSize:12}}>✓</span>}
                  </div>
                  <span style={{fontSize:13,color:"var(--text)",fontWeight:500}}>Mark Important</span>
                </label>
              </div>
            </div>

            {/* Link section */}
            <div style={{padding:"14px 16px",background:"#1a73e808",borderRadius:12,border:"1px solid #1a73e820"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#1a73e8",marginBottom:10,textTransform:"uppercase",letterSpacing:".05em"}}>🔗 Attach Link (optional)</div>
              <input value={form.link} onChange={e=>{setForm({...form,link:e.target.value});setLinkErr("");}} placeholder="https://example.com/resource" style={{...inpS(dark),width:"100%",marginBottom:8}}/>
              {linkErr&&<p style={{fontSize:11,color:"#ea4335",marginBottom:8}}>{linkErr}</p>}
              <div style={{display:"flex",gap:8}}>
                {[["external","🌐 External Link"],["internal","🔒 Internal Page"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setForm({...form,linkType:v})} style={{flex:1,padding:"7px",border:`2px solid ${form.linkType===v?"#1a73e8":"var(--border)"}`,borderRadius:9,background:form.linkType===v?"#1a73e818":"transparent",color:form.linkType===v?"#1a73e8":"var(--muted)",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>{l}</button>
                ))}
              </div>
              {form.link&&isValidUrl(form.link)&&(
                <div style={{marginTop:8,padding:"6px 10px",background:"#34a85310",borderRadius:7,border:"1px solid #34a85330",fontSize:11,color:"#34a853"}}>✓ Valid URL: {form.link}</div>
              )}
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button onClick={validateAndPost} style={{padding:"10px 20px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer"}}>📢 Post</button>
            <button onClick={()=>{setShowForm(false);setLinkErr("");}} style={{padding:"10px 16px",background:"none",color:"var(--muted)",border:"1.5px solid var(--border)",borderRadius:9,fontSize:13,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}

      {/* Analytics strip */}
      {topClicked.length>0&&(
        <div style={{background:"var(--surface)",borderRadius:13,padding:"12px 16px",border:"1px solid var(--border)",marginBottom:18}}>
          <div style={{fontSize:12,fontWeight:700,color:"var(--muted)",marginBottom:10,textTransform:"uppercase",letterSpacing:".06em"}}>📊 Most Viewed Resources</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {topClicked.map((a,i)=>(
              <div key={a.id} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 12px",background:"var(--hover)",borderRadius:20,border:"1px solid var(--border)"}}>
                <span style={{fontSize:14}}>{["🥇","🥈","🥉"][i]}</span>
                <span style={{fontSize:11,fontWeight:600,color:"var(--text)",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.title}</span>
                <span style={{fontSize:10,color:"#1a73e8",fontWeight:700}}>👁 {a.clicks}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{display:"flex",gap:7,marginBottom:18,flexWrap:"wrap"}}>
        {[["all","All"],["unread","🔵 Unread"],["pinned","📌 Pinned"],["important","🔴 Important"],["links","🔗 With Links"]].map(([v,l])=>(
          <Pill key={v} active={filter===v} onClick={()=>setFilter(v)}>{l}</Pill>
        ))}
      </div>

      {sorted.length===0?<Empty icon="📢" title="No announcements" sub="Check back later."/>:
      <div style={{display:"flex",flexDirection:"column",gap:11}}>
        {sorted.map(a=><AnnouncementCard key={a.id} ann={a} onClick={()=>markRead(a.id)}/>)}
      </div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
function Dashboard(){
  const{navTo,announcements,readAnnIds,markRead}=useContext(AppCtx);
  const{user}=useContext(AuthCtx);
  const[semF,setSemF]=useState("all");
  const filtered=SUBJECTS.filter(s=>semF==="all"||s.sem===+semF);
  const pinnedAnns=announcements.filter(a=>a.pinned).slice(0,2);
  const recentAnns=announcements.filter(a=>!a.pinned).slice(0,2);

  return(
    <div style={{maxWidth:1160,margin:"0 auto"}}>
      {/* Hero */}
      <div style={{background:"linear-gradient(135deg,#1a73e8,#1557b0 40%,#0a3d62)",borderRadius:18,padding:"28px 30px",marginBottom:24,color:"#fff",position:"relative",overflow:"hidden",animation:"fadeUp .4s ease"}}>
        <div style={{position:"absolute",right:-20,top:-20,fontSize:120,opacity:.06}}>📚</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16}}>
          <div>
            <h1 style={{fontSize:24,fontWeight:800,marginBottom:4}}>Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
            <p style={{opacity:.85,fontSize:14}}>First Year Engineering · SPPU</p>
            <div style={{display:"flex",gap:16,marginTop:14,flexWrap:"wrap"}}>
              {[["📄",Object.values(NOTES_DB).flat().length,"Notes"],["📝",Object.values(QUIZZES_DB).flat().length,"Quizzes"],["📚",SUBJECTS.length,"Subjects"],["📢",announcements.length,"Updates"]].map(([ic,ct,lb])=>(
                <div key={lb} style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:800}}>{ic} {ct}</div><div style={{fontSize:11,opacity:.8}}>{lb}</div></div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={()=>navTo("announcements")} style={{padding:"9px 16px",background:"rgba(255,255,255,.15)",color:"#fff",border:"1px solid rgba(255,255,255,.3)",borderRadius:9,fontSize:12,fontWeight:600,cursor:"pointer"}}>📢 Announcements</button>
            <button onClick={()=>navTo("planner")} style={{padding:"9px 16px",background:"rgba(255,255,255,.15)",color:"#fff",border:"1px solid rgba(255,255,255,.3)",borderRadius:9,fontSize:12,fontWeight:600,cursor:"pointer"}}>📋 Planner</button>
          </div>
        </div>
      </div>

      {/* Study Plan Card */}
      <StudyPlanCard/>

      {/* Announcements on dashboard */}
      {(pinnedAnns.length>0||recentAnns.length>0)&&(
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h2 style={{fontSize:15,fontWeight:800,color:"var(--text)"}}>📢 Latest Announcements</h2>
            <button onClick={()=>navTo("announcements")} style={{fontSize:12,color:"#1a73e8",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>View all →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:11}}>
            {[...pinnedAnns,...recentAnns].slice(0,4).map(a=>(
              <AnnouncementCard key={a.id} ann={a} compact onClick={()=>navTo("announcements")}/>
            ))}
          </div>
        </div>
      )}

      {/* Subject filters */}
      <div style={{display:"flex",gap:7,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:12,fontWeight:600,color:"var(--muted)"}}>Subjects:</span>
        {[["all","All"],["1","Sem 1"],["2","Sem 2"]].map(([v,l])=><Pill key={v} active={semF===v} onClick={()=>setSemF(v)}>{l}</Pill>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(275px,1fr))",gap:16}}>
        {filtered.map((sub,i)=><SubjectCard key={sub.id} sub={sub} i={i} onClick={()=>navTo("subject",sub)}/>)}
      </div>
    </div>
  );
}

function SubjectCard({sub,i,onClick}){
  const[hov,setHov]=useState(false);
  const nCount=NOTES_DB[sub.id]?.length||0;
  const pCount=PYQS_DB[sub.id]?.length||0;
  const qCount=QUIZZES_DB[sub.id]?.length||0;
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:"var(--surface)",borderRadius:15,overflow:"hidden",cursor:"pointer",border:"1px solid var(--border)",boxShadow:hov?"0 10px 36px rgba(0,0,0,.14)":"0 2px 8px rgba(0,0,0,.05)",transform:hov?"translateY(-4px)":"none",transition:"all .2s ease",animation:`fadeUp .4s ease ${i*40}ms both`}}>
      <div style={{background:sub.color,padding:"20px 18px 14px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:10,top:6,fontSize:48,opacity:.14}}>{sub.icon}</div>
        <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.75)",textTransform:"uppercase"}}>FE · Sem {sub.sem}</div>
        <div style={{fontSize:15,fontWeight:800,color:"#fff",marginTop:4,lineHeight:1.3,paddingRight:36}}>{sub.name}</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,.7)",marginTop:3}}>{sub.code}</div>
      </div>
      <div style={{padding:"12px 16px 14px"}}>
        <p style={{fontSize:11,color:"var(--muted)",marginBottom:10,lineHeight:1.5}}>{sub.desc}</p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {[["📄",nCount,"Notes"],["📋",pCount,"PYQs"],["📝",qCount,"Quizzes"]].map(([ic,ct,lb])=>(
            <div key={lb} style={{display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:12}}>{ic}</span>
              <span style={{fontSize:11,color:"var(--muted)"}}><strong style={{color:"var(--text)"}}>{ct}</strong> {lb}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUBJECT PAGE
// ═══════════════════════════════════════════════════════════════
function SubjectPage(){
  const{activeSub:sub,notes,pyqs,quizzes,announcements,setAnnouncements,showToast,navTo,setCalModal,setQuizModal,setAddQuizModal,markRead}=useContext(AppCtx);
  const{user}=useContext(AuthCtx);
  const[tab,setTab]=useState("notes");
  const subNotes=notes[sub.id]||[];
  const subPyqs=pyqs[sub.id]||[];
  const subQuizzes=quizzes[sub.id]||[];
  const subAnns=announcements.filter(a=>a.subjectId===sub.id||a.subjectId===null);
  const tabs=[
    {id:"notes",label:"📄 Notes",count:subNotes.length},
    {id:"pyqs",label:"📋 PYQs",count:subPyqs.length},
    {id:"quizzes",label:"📝 Quizzes",count:subQuizzes.length},
    {id:"announcements",label:"📢 Annc.",count:subAnns.length},
  ];
  return(
    <div style={{maxWidth:900,margin:"0 auto",animation:"fadeUp .3s ease"}}>
      <button onClick={()=>navTo("dashboard")} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:12,marginBottom:12}}>← Back</button>
      <div style={{background:sub.color,borderRadius:16,padding:"24px 26px",color:"#fff",marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:18,top:8,fontSize:70,opacity:.1}}>{sub.icon}</div>
        <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.75)",textTransform:"uppercase"}}>FE · Semester {sub.sem}</div>
        <h1 style={{fontSize:22,fontWeight:800,marginTop:5,marginBottom:4}}>{sub.name}</h1>
        <div style={{fontSize:12,opacity:.8,marginBottom:10}}>{sub.code} · {sub.enrolled} enrolled</div>
        <button onClick={()=>setCalModal({type:"exam",subId:sub.id})} style={{padding:"6px 12px",background:"rgba(255,255,255,.2)",color:"#fff",border:"1px solid rgba(255,255,255,.3)",borderRadius:7,fontSize:11,fontWeight:600,cursor:"pointer"}}>📅 Add to Calendar</button>
      </div>
      <div style={{display:"flex",gap:1,marginBottom:20,borderBottom:"2px solid var(--border)",overflowX:"auto"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"9px 14px",border:"none",background:"none",cursor:"pointer",fontSize:12,fontWeight:tab===t.id?700:500,color:tab===t.id?"#1a73e8":"var(--muted)",borderBottom:tab===t.id?"2px solid #1a73e8":"2px solid transparent",marginBottom:-2,transition:"all .15s",whiteSpace:"nowrap"}}>
            {t.label} <span style={{marginLeft:3,background:tab===t.id?"#1a73e818":"var(--hover)",color:tab===t.id?"#1a73e8":"var(--muted)",borderRadius:9,padding:"1px 6px",fontSize:10}}>{t.count}</span>
          </button>
        ))}
      </div>
      {tab==="notes"&&(subNotes.length===0?<Empty icon="📄" title="No notes yet" sub="Notes will appear here."/>:<div style={{display:"flex",flexDirection:"column",gap:9}}>{subNotes.map(n=><NoteCard key={n.id} note={n}/>)}</div>)}
      {tab==="pyqs"&&(subPyqs.length===0?<Empty icon="📋" title="No PYQs yet" sub="Question papers will appear here."/>:<div style={{display:"flex",flexDirection:"column",gap:9}}>{subPyqs.map(p=><PYQCard key={p.id} pyq={p}/>)}</div>)}
      {tab==="quizzes"&&<QuizzesTab subId={sub.id} quizzes={subQuizzes}/>}
      {tab==="announcements"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {subAnns.length===0?<Empty icon="📢" title="No announcements" sub="Your teacher will post here."/>:subAnns.map(a=><AnnouncementCard key={a.id} ann={a} onClick={()=>markRead(a.id)}/>)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUIZZES TAB + QUIZ MODAL + ADD QUIZ MODAL
// ═══════════════════════════════════════════════════════════════
function QuizzesTab({subId,quizzes}){
  const{setQuizModal,setAddQuizModal}=useContext(AppCtx);
  const{user}=useContext(AuthCtx);
  const[results]=useLocalStorage(`qresults_${subId}`,{});
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><div style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>Unit-wise Practice Quizzes</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>MCQ · Instant results & explanations</div></div>
        {user?.role==="admin"&&<button onClick={()=>setAddQuizModal(subId)} style={{padding:"8px 16px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Add Quiz</button>}
      </div>
      {quizzes.length===0?<Empty icon="📝" title="No quizzes yet" sub={user?.role==="admin"?"Click '+ Add Quiz' to create quizzes.":"Quizzes will be added by your teacher soon."}/>:
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
        {quizzes.map(quiz=>{
          const res=results[quiz.id];
          const score=res?Math.round((res.correct/quiz.questions.length)*100):0;
          const sc=score>=80?"#34a853":score>=60?"#f59e0b":"#ea4335";
          return(
            <div key={quiz.id} style={{background:"var(--surface)",borderRadius:15,overflow:"hidden",border:"1px solid var(--border)",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.12)";e.currentTarget.style.transform="translateY(-3px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
              <div style={{background:"linear-gradient(135deg,#1a73e8,#4285f4)",padding:"16px 16px 12px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",right:8,top:4,fontSize:36,opacity:.14}}>📝</div>
                <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.75)",textTransform:"uppercase"}}>Unit {quiz.unit}</div>
                <div style={{fontSize:13,fontWeight:800,color:"#fff",marginTop:3,lineHeight:1.3}}>{quiz.title.replace(`Unit ${quiz.unit} – `,"")}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.75)",marginTop:5}}>{quiz.questions.length} questions · MCQ</div>
              </div>
              <div style={{padding:"12px 14px"}}>
                {res?(
                  <div style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:"var(--muted)"}}>Last score</span><span style={{fontSize:13,fontWeight:800,color:sc}}>{score}%</span></div>
                    <div style={{height:5,borderRadius:3,background:"var(--border)",overflow:"hidden"}}><div style={{height:"100%",width:`${score}%`,background:sc,borderRadius:3,transition:"width .5s"}}/></div>
                    <div style={{fontSize:10,color:"var(--muted)",marginTop:4}}>{res.correct}/{quiz.questions.length} correct</div>
                  </div>
                ):<div style={{marginBottom:10,padding:"7px 9px",background:"#1a73e810",borderRadius:7,fontSize:11,color:"#1a73e8"}}>Not attempted yet</div>}
                <button onClick={()=>setQuizModal({quiz,subId})} style={{width:"100%",padding:"8px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>{res?"Retake →":"Start Quiz →"}</button>
              </div>
            </div>
          );
        })}
      </div>}
    </div>
  );
}

function QuizModal(){
  const{quizModal,setQuizModal,showToast}=useContext(AppCtx);
  const{quiz,subId}=quizModal;
  const[results,setResults]=useLocalStorage(`qresults_${subId}`,{});
  const[phase,setPhase]=useState("quiz");
  const[answers,setAnswers]=useState({});
  const[currentQ,setCurrentQ]=useState(0);
  const[showExp,setShowExp]=useState({});
  const total=quiz.questions.length;
  const q=quiz.questions[currentQ];

  const submit=()=>{
    if(Object.keys(answers).length<total){showToast(`Answer all ${total} questions first`,"warn");return;}
    const correct=quiz.questions.filter((q,i)=>answers[i]===q.ans).length;
    setResults(prev=>({...prev,[quiz.id]:{correct,total,date:new Date().toISOString()}}));
    setPhase("results");showToast(`Submitted! Score: ${Math.round(correct/total*100)}%`);
  };

  const score=quiz.questions.filter((q,i)=>answers[i]===q.ans).length;
  const pct=Math.round((score/total)*100);
  const sc=pct>=80?"#34a853":pct>=60?"#f59e0b":"#ea4335";
  const weakTopics=quiz.questions.filter((q,i)=>answers[i]!==q.ans);

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:14}} onClick={e=>e.target===e.currentTarget&&setQuizModal(null)}>
      <div style={{background:"var(--surface)",borderRadius:18,width:"100%",maxWidth:580,maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",animation:"fadeUp .3s ease"}}>
        <div style={{padding:"16px 20px",background:"linear-gradient(135deg,#1a73e8,#4285f4)",color:"#fff",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:10,fontWeight:700,opacity:.8,textTransform:"uppercase"}}>Quiz · {quiz.title}</div><div style={{fontSize:15,fontWeight:800,marginTop:2}}>{phase==="quiz"?`Q ${currentQ+1}/${total}`:"Results"}</div></div>
            <button onClick={()=>setQuizModal(null)} style={{width:30,height:30,borderRadius:15,background:"rgba(255,255,255,.2)",border:"none",cursor:"pointer",color:"#fff",fontSize:14}}>✕</button>
          </div>
          {phase==="quiz"&&<div style={{marginTop:10,height:4,borderRadius:2,background:"rgba(255,255,255,.25)",overflow:"hidden"}}><div style={{height:"100%",width:`${((currentQ+1)/total)*100}%`,background:"rgba(255,255,255,.85)",borderRadius:2,transition:"width .3s"}}/></div>}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
          {phase==="quiz"?(
            <div key={currentQ} style={{animation:"fadeUp .2s ease"}}>
              <div style={{fontSize:15,fontWeight:700,color:"var(--text)",marginBottom:18,lineHeight:1.5}}>{currentQ+1}. {q.q}</div>
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {q.opts.map((opt,i)=>{
                  const sel=answers[currentQ]===i;
                  return(
                    <button key={i} onClick={()=>setAnswers({...answers,[currentQ]:i})} style={{padding:"12px 14px",borderRadius:11,border:`2px solid ${sel?"#1a73e8":"var(--border)"}`,background:sel?"#1a73e818":"var(--hover)",color:"var(--text)",fontSize:13,cursor:"pointer",textAlign:"left",fontWeight:sel?600:400,transition:"all .15s",display:"flex",alignItems:"center",gap:10}}>
                      <span style={{width:26,height:26,borderRadius:"50%",background:sel?"#1a73e8":"var(--border)",color:sel?"#fff":"var(--muted)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{String.fromCharCode(65+i)}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ):(
            <div style={{animation:"fadeUp .3s ease"}}>
              <div style={{textAlign:"center",marginBottom:24}}>
                <div style={{fontSize:52,marginBottom:6}}>{pct>=80?"🏆":pct>=60?"👍":"📚"}</div>
                <div style={{fontSize:44,fontWeight:900,color:sc,marginBottom:3}}>{pct}%</div>
                <div style={{fontSize:15,color:"var(--text)",fontWeight:600,marginBottom:3}}>{score}/{total} correct</div>
                <div style={{height:8,borderRadius:4,background:"var(--border)",overflow:"hidden",margin:"12px 0"}}><div style={{height:"100%",width:`${pct}%`,background:sc,borderRadius:4,transition:"width 1s ease"}}/></div>
              </div>
              {weakTopics.length>0&&(
                <div style={{background:"#ea433508",borderRadius:12,padding:14,border:"1px solid #ea433330",marginBottom:18}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#ea4335",marginBottom:10}}>📌 Weak Topics</div>
                  {weakTopics.map((wq,i)=>(
                    <div key={i} style={{padding:"9px 0",borderBottom:"1px solid #ea433320"}}>
                      <div style={{fontSize:12,fontWeight:600,color:"var(--text)",marginBottom:5}}>{wq.q}</div>
                      <div style={{display:"flex",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                        <span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"#ea433320",color:"#ea4335"}}>Your: {wq.opts[answers[quiz.questions.indexOf(wq)]]}</span>
                        <span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"#34a85320",color:"#34a853"}}>Correct: {wq.opts[wq.ans]}</span>
                      </div>
                      <button onClick={()=>setShowExp({...showExp,[i]:!showExp[i]})} style={{fontSize:11,color:"#1a73e8",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>{showExp[i]?"▲ Hide":"▼ Show"} Explanation</button>
                      {showExp[i]&&<div style={{marginTop:7,padding:"8px 10px",background:"#1a73e810",borderRadius:7,fontSize:12,color:"var(--muted)",lineHeight:1.6}}>💡 {wq.exp}</div>}
                    </div>
                  ))}
                </div>
              )}
              <div style={{fontSize:13,fontWeight:700,color:"var(--text)",marginBottom:10}}>📋 All Answers</div>
              {quiz.questions.map((q,i)=>{
                const ok=answers[i]===q.ans;
                return(
                  <div key={i} style={{padding:"10px 12px",borderRadius:10,border:`1px solid ${ok?"#34a85340":"#ea433340"}`,background:ok?"#34a85308":"#ea433308",marginBottom:7}}>
                    <div style={{display:"flex",gap:7,alignItems:"flex-start"}}>
                      <span style={{fontSize:14,flexShrink:0}}>{ok?"✅":"❌"}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:600,color:"var(--text)",marginBottom:5}}>{q.q}</div>
                        {!ok&&<div style={{fontSize:11,color:"#34a853",marginBottom:3}}>✓ {q.opts[q.ans]}</div>}
                        <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.6}}>💡 {q.exp}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div style={{padding:"14px 20px",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"space-between",gap:10,flexShrink:0}}>
          {phase==="quiz"?(
            <>
              <button onClick={()=>setCurrentQ(q=>Math.max(0,q-1))} disabled={currentQ===0} style={{padding:"9px 16px",border:"1.5px solid var(--border)",borderRadius:9,background:"transparent",cursor:currentQ===0?"not-allowed":"pointer",color:"var(--muted)",fontSize:12,opacity:currentQ===0?.5:1}}>← Prev</button>
              <div style={{flex:1,display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap"}}>
                {quiz.questions.map((_,i)=>(
                  <button key={i} onClick={()=>setCurrentQ(i)} style={{width:26,height:26,borderRadius:"50%",border:"none",cursor:"pointer",fontSize:10,fontWeight:700,background:i===currentQ?"#1a73e8":answers[i]!==undefined?"#34a853":"var(--border)",color:i===currentQ||answers[i]!==undefined?"#fff":"var(--muted)"}}>{i+1}</button>
                ))}
              </div>
              {currentQ<total-1
                ?<button onClick={()=>setCurrentQ(q=>q+1)} style={{padding:"9px 16px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>Next →</button>
                :<button onClick={submit} style={{padding:"9px 18px",background:"#34a853",color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>Submit ✓</button>
              }
            </>
          ):(
            <>
              <button onClick={()=>{setAnswers({});setCurrentQ(0);setPhase("quiz");setShowExp({});}} style={{padding:"9px 16px",border:"1.5px solid var(--border)",borderRadius:9,background:"transparent",cursor:"pointer",color:"var(--text)",fontSize:12,fontWeight:600}}>🔄 Retake</button>
              <button onClick={()=>setQuizModal(null)} style={{padding:"9px 20px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>Done ✓</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AddQuizModal(){
  const{addQuizModal,setAddQuizModal,quizzes,setQuizzes,showToast}=useContext(AppCtx);
  const{dark}=useContext(ThemeCtx);
  const subId=addQuizModal;
  const[unit,setUnit]=useState(1);
  const[title,setTitle]=useState("");
  const[questions,setQuestions]=useState([{q:"",opts:["","","",""],ans:0,exp:""}]);
  const addQ=()=>setQuestions(prev=>[...prev,{q:"",opts:["","","",""],ans:0,exp:""}]);
  const removeQ=i=>setQuestions(prev=>prev.filter((_,j)=>j!==i));
  const updateQ=(i,field,val)=>setQuestions(prev=>prev.map((q,j)=>j===i?{...q,[field]:val}:q));
  const updateOpt=(qi,oi,val)=>setQuestions(prev=>prev.map((q,j)=>j===qi?{...q,opts:q.opts.map((o,k)=>k===oi?val:o)}:q));
  const save=()=>{
    if(!title){showToast("Enter title","warn");return;}
    if(!questions.every(q=>q.q&&q.opts.every(o=>o)&&q.exp)){showToast("Fill all fields","warn");return;}
    const nq={id:`q${Date.now()}`,unit,title:`Unit ${unit} – ${title}`,totalQ:questions.length,questions:questions.map((q,i)=>({id:i+1,...q}))};
    setQuizzes(prev=>({...prev,[subId]:[...(prev[subId]||[]),nq]}));
    showToast("Quiz added! ✓");setAddQuizModal(null);
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:14}} onClick={e=>e.target===e.currentTarget&&setAddQuizModal(null)}>
      <div style={{background:"var(--surface)",borderRadius:18,width:"100%",maxWidth:640,maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",animation:"fadeUp .3s ease"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{fontSize:16,fontWeight:800,color:"var(--text)"}}>📝 Add Unit Quiz</div>
          <button onClick={()=>setAddQuizModal(null)} style={{width:30,height:30,borderRadius:15,border:"1.5px solid var(--border)",background:"transparent",cursor:"pointer",color:"var(--muted)",fontSize:14}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"18px 20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:18}}>
            <div><label style={lblS(dark)}>Unit</label><select value={unit} onChange={e=>setUnit(+e.target.value)} style={{...inpS(dark),width:"100%"}}>{[1,2,3,4,5].map(u=><option key={u} value={u}>Unit {u}</option>)}</select></div>
            <div><label style={lblS(dark)}>Title</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Differential Calculus" style={{...inpS(dark),width:"100%"}}/></div>
          </div>
          {questions.map((q,qi)=>(
            <div key={qi} style={{background:"var(--hover)",borderRadius:12,padding:14,marginBottom:12,border:"1px solid var(--border)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                <div style={{fontSize:12,fontWeight:800,color:"#1a73e8"}}>Q{qi+1}</div>
                {questions.length>1&&<button onClick={()=>removeQ(qi)} style={{fontSize:11,color:"#ea4335",background:"none",border:"none",cursor:"pointer"}}>Remove</button>}
              </div>
              <textarea value={q.q} onChange={e=>updateQ(qi,"q",e.target.value)} placeholder="Question text…" rows={2} style={{...inpS(dark),width:"100%",resize:"none",marginBottom:9}}/>
              {q.opts.map((opt,oi)=>(
                <div key={oi} style={{display:"flex",gap:7,marginBottom:7,alignItems:"center"}}>
                  <button onClick={()=>updateQ(qi,"ans",oi)} style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${q.ans===oi?"#34a853":"var(--border)"}`,background:q.ans===oi?"#34a853":"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {q.ans===oi&&<span style={{width:7,height:7,borderRadius:"50%",background:"#fff"}}/>}
                  </button>
                  <span style={{fontSize:11,color:"var(--muted)",width:18,flexShrink:0}}>{String.fromCharCode(65+oi)}.</span>
                  <input value={opt} onChange={e=>updateOpt(qi,oi,e.target.value)} placeholder={`Option ${String.fromCharCode(65+oi)}`} style={{...inpS(dark),flex:1,padding:"7px 11px"}}/>
                </div>
              ))}
              <div style={{marginTop:9}}>
                <label style={lblS(dark)}>Explanation</label>
                <textarea value={q.exp} onChange={e=>updateQ(qi,"exp",e.target.value)} placeholder="Why is the answer correct?" rows={2} style={{...inpS(dark),width:"100%",resize:"none"}}/>
              </div>
            </div>
          ))}
          <button onClick={addQ} style={{width:"100%",padding:"10px",border:"2px dashed var(--border)",borderRadius:11,background:"transparent",cursor:"pointer",color:"#1a73e8",fontSize:12,fontWeight:600}}>+ Add Question</button>
        </div>
        <div style={{padding:"14px 20px",borderTop:"1px solid var(--border)",display:"flex",gap:9,flexShrink:0}}>
          <button onClick={save} style={{flex:1,padding:"11px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:800,cursor:"pointer"}}>Save Quiz ({questions.length} Qs)</button>
          <button onClick={()=>setAddQuizModal(null)} style={{padding:"11px 18px",background:"none",color:"var(--muted)",border:"1.5px solid var(--border)",borderRadius:9,fontSize:12,cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NOTE + PYQ CARDS
// ═══════════════════════════════════════════════════════════════
function NoteCard({note}){
  const{toggleBookmark,isBookmarked,showToast,notes,setNotes,setViewerModal}=useContext(AppCtx);
  const{user}=useContext(AuthCtx);
  const bm=isBookmarked("notes",note.id);
  const[showC,setShowC]=useState(false);
  const[nc,setNc]=useState("");
  const addComment=()=>{ if(!nc.trim()) return; setNotes(prev=>{ const u=JSON.parse(JSON.stringify(prev)); Object.keys(u).forEach(sid=>{ u[sid]=u[sid].map(n=>n.id===note.id?{...n,comments:[...n.comments,{id:Date.now()+"",user:user.name,text:nc,time:"Just now",likes:0}]}:n); }); return u; }); setNc("");showToast("Comment added!"); };
  const cur=Object.values(notes).flat().find(n=>n.id===note.id)||note;
  return(
    <div style={{background:"var(--surface)",borderRadius:13,border:"1px solid var(--border)",overflow:"hidden"}}>
      <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:42,height:42,borderRadius:11,background:"#ea433518",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📄</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:"var(--text)",marginBottom:3}}>{cur.title}</div>
          <div style={{fontSize:11,color:"var(--muted)",marginBottom:5}}>By {cur.by} · {cur.date} · {cur.size}</div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <Stars rating={cur.rating||0} count={cur.rcount}/>
            <span style={{fontSize:11,color:"var(--muted)"}}>👁 {cur.dl}</span>
            <button onClick={()=>setShowC(s=>!s)} style={{fontSize:11,color:"var(--muted)",background:"none",border:"none",cursor:"pointer"}}>💬 {cur.comments?.length||0}</button>
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexShrink:0}}>
          <button onClick={()=>toggleBookmark("notes",cur.id)} style={{width:32,height:32,borderRadius:16,border:"1.5px solid var(--border)",background:bm?"#f59e0b18":"var(--surface)",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{bm?"🔖":"☆"}</button>
          <button onClick={()=>setViewerModal({title:cur.title,type:"note",by:cur.by})} style={{padding:"6px 14px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:16,fontSize:11,fontWeight:700,cursor:"pointer"}}>👁 View</button>
        </div>
      </div>
      {showC&&(
        <div style={{borderTop:"1px solid var(--border)",padding:"12px 16px",background:"var(--hover)"}}>
          {cur.comments?.map(c=>(
            <div key={c.id} style={{display:"flex",gap:8,marginBottom:10}}>
              <Avatar name={c.user} size={24} color="#6366f1"/>
              <div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,color:"var(--text)"}}>{c.user} <span style={{fontWeight:400,color:"var(--muted)"}}>{c.time}</span></div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{c.text}</div></div>
            </div>
          ))}
          <div style={{display:"flex",gap:7,marginTop:7}}>
            <Avatar name={user?.name} size={24} color="#1a73e8"/>
            <input value={nc} onChange={e=>setNc(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addComment()} placeholder="Comment…" style={{flex:1,padding:"6px 11px",borderRadius:16,border:"1.5px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:12,outline:"none"}}/>
            <button onClick={addComment} style={{padding:"6px 12px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:16,fontSize:11,fontWeight:700,cursor:"pointer"}}>Post</button>
          </div>
        </div>
      )}
    </div>
  );
}
function PYQCard({pyq}){
  const{toggleBookmark,isBookmarked,setViewerModal}=useContext(AppCtx);
  const bm=isBookmarked("pyqs",pyq.id);
  return(
    <div style={{background:"var(--surface)",borderRadius:13,padding:"13px 16px",border:"1px solid var(--border)",display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:42,height:42,borderRadius:11,background:"#1a73e818",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📋</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:700,color:"var(--text)",marginBottom:5}}>{pyq.title}</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <Badge color="#1a73e8" small>{pyq.year}</Badge>
          <Badge color="#34a853" small>{pyq.exam}</Badge>
          <span style={{fontSize:11,color:"var(--muted)"}}>👁 {pyq.dl}</span>
        </div>
      </div>
      <div style={{display:"flex",gap:6,flexShrink:0}}>
        <button onClick={()=>toggleBookmark("pyqs",pyq.id)} style={{width:32,height:32,borderRadius:16,border:"1.5px solid var(--border)",background:bm?"#f59e0b18":"var(--surface)",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{bm?"🔖":"☆"}</button>
        <button onClick={()=>setViewerModal&&setViewerModal({title:pyq.title,type:"pyq",year:pyq.year,exam:pyq.exam})} style={{padding:"6px 14px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:16,fontSize:11,fontWeight:700,cursor:"pointer"}}>👁 View</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DOCUMENT VIEWER MODAL
// ═══════════════════════════════════════════════════════════════
function DocumentViewerModal(){
  const{viewerModal,setViewerModal}=useContext(AppCtx);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:14}} onClick={e=>e.target===e.currentTarget&&setViewerModal(null)}>
      <div style={{background:"var(--surface)",borderRadius:18,width:"100%",maxWidth:680,height:"82vh",display:"flex",flexDirection:"column",animation:"fadeUp .3s ease",overflow:"hidden"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div><div style={{fontSize:14,fontWeight:800,color:"var(--text)"}}>{viewerModal.title}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{viewerModal.type==="note"?`By ${viewerModal.by}`:`${viewerModal.year} · ${viewerModal.exam}`}</div></div>
          <button onClick={()=>setViewerModal(null)} style={{width:30,height:30,borderRadius:15,border:"1.5px solid var(--border)",background:"transparent",cursor:"pointer",color:"var(--muted)",fontSize:14}}>✕</button>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"var(--hover)",gap:10,padding:28}}>
          <div style={{fontSize:56}}>📄</div>
          <div style={{fontSize:16,fontWeight:700,color:"var(--text)",textAlign:"center"}}>{viewerModal.title}</div>
          <div style={{fontSize:13,color:"var(--muted)",textAlign:"center",maxWidth:320,lineHeight:1.6}}>PDF viewer would load from cloud storage in production. This simulates the experience.</div>
          <div style={{display:"flex",gap:8,marginTop:6}}>
            {["Page 1","Page 2","Page 3"].map(p=>(
              <div key={p} style={{width:72,height:95,background:"var(--surface)",borderRadius:7,border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"var(--muted)",boxShadow:"0 2px 7px rgba(0,0,0,.07)"}}>{p}</div>
            ))}
          </div>
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid var(--border)",display:"flex",gap:9,justifyContent:"flex-end",flexShrink:0}}>
          <button onClick={()=>setViewerModal(null)} style={{padding:"8px 18px",background:"none",color:"var(--muted)",border:"1.5px solid var(--border)",borderRadius:8,fontSize:12,cursor:"pointer"}}>Close</button>
          <button onClick={()=>setViewerModal(null)} style={{padding:"8px 18px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>⬇ Download</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BOOKMARKS
// ═══════════════════════════════════════════════════════════════
function BookmarksPage(){
  const{bookmarks,notes,pyqs}=useContext(AppCtx);
  const[tab,setTab]=useState("notes");
  const bN=Object.values(notes).flat().filter(n=>bookmarks.notes.includes(n.id));
  const bP=Object.values(pyqs).flat().filter(p=>bookmarks.pyqs.includes(p.id));
  return(
    <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp .3s ease"}}>
      <h1 style={{fontSize:20,fontWeight:800,marginBottom:18,color:"var(--text)"}}>🔖 Bookmarks</h1>
      <div style={{display:"flex",gap:2,marginBottom:18,borderBottom:"2px solid var(--border)"}}>
        {[["notes",`📄 Notes (${bN.length})`],["pyqs",`📋 PYQs (${bP.length})`]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"8px 16px",border:"none",background:"none",cursor:"pointer",fontSize:12,fontWeight:tab===k?700:500,color:tab===k?"#1a73e8":"var(--muted)",borderBottom:tab===k?"2px solid #1a73e8":"2px solid transparent",marginBottom:-2}}>{l}</button>
        ))}
      </div>
      {tab==="notes"&&(bN.length===0?<Empty icon="🔖" title="No bookmarks" sub="Star notes from subject pages."/>:<div style={{display:"flex",flexDirection:"column",gap:9}}>{bN.map(n=><NoteCard key={n.id} note={n}/>)}</div>)}
      {tab==="pyqs"&&(bP.length===0?<Empty icon="🔖" title="No bookmarks" sub="Star PYQs from subject pages."/>:<div style={{display:"flex",flexDirection:"column",gap:9}}>{bP.map(p=><PYQCard key={p.id} pyq={p}/>)}</div>)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FORUM
// ═══════════════════════════════════════════════════════════════
function ForumPage(){
  const{forumPosts,setForumPosts,showToast}=useContext(AppCtx);
  const{user}=useContext(AuthCtx);
  const[activePost,setActivePost]=useState(null);
  const[newPost,setNewPost]=useState({title:"",body:"",subId:"s1",tags:""});
  const[showNew,setShowNew]=useState(false);
  const[replyText,setReplyText]=useState("");
  const submitPost=()=>{
    if(!newPost.title||!newPost.body){showToast("Fill all fields","warn");return;}
    const sub=SUBJECTS.find(s=>s.id===newPost.subId);
    setForumPosts(prev=>[{id:Date.now()+"",title:newPost.title,body:newPost.body,author:user.name,subject:sub?.name||"",subId:newPost.subId,tags:newPost.tags.split(",").map(t=>t.trim()).filter(Boolean),upvotes:0,downvotes:0,time:"Just now",replies:[]},...prev]);
    setNewPost({title:"",body:"",subId:"s1",tags:""});setShowNew(false);showToast("Posted!");
  };
  const submitReply=pid=>{ if(!replyText.trim()){showToast("Write a reply","warn");return;} setForumPosts(prev=>prev.map(p=>p.id===pid?{...p,replies:[...p.replies,{id:Date.now()+"",author:user.name,text:replyText,upvotes:0,time:"Just now",isAdmin:user.role==="admin"}]}:p)); setReplyText("");showToast("Reply posted!"); };
  const vote=(pid,dir)=>setForumPosts(prev=>prev.map(p=>p.id===pid?{...p,[dir===1?"upvotes":"downvotes"]:p[dir===1?"upvotes":"downvotes"]+1}:p));

  if(activePost){
    const post=forumPosts.find(p=>p.id===activePost.id)||activePost;
    return(
      <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp .3s ease"}}>
        <button onClick={()=>setActivePost(null)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:12,marginBottom:14}}>← Forum</button>
        <div style={{background:"var(--surface)",borderRadius:14,padding:22,border:"1px solid var(--border)",marginBottom:14}}>
          <div style={{display:"flex",gap:12}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,paddingTop:2}}>
              <button onClick={()=>vote(post.id,1)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#34a853"}}>▲</button>
              <span style={{fontSize:14,fontWeight:800,color:"var(--text)"}}>{post.upvotes-post.downvotes}</span>
              <button onClick={()=>vote(post.id,-1)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#ea4335"}}>▼</button>
            </div>
            <div style={{flex:1}}>
              <h2 style={{fontSize:17,fontWeight:800,color:"var(--text)",marginBottom:7}}>{post.title}</h2>
              <div style={{display:"flex",gap:7,marginBottom:10,flexWrap:"wrap"}}><Badge color="#1a73e8" small>{post.subject}</Badge>{post.tags?.map(t=><Badge key={t} color="#6366f1" small>#{t}</Badge>)}</div>
              <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.7,marginBottom:12}}>{post.body}</p>
              <div style={{fontSize:11,color:"var(--muted)"}}>{post.author} · {post.time}</div>
            </div>
          </div>
        </div>
        <div style={{fontSize:13,fontWeight:700,color:"var(--text)",marginBottom:12}}>{post.replies.length} Answers</div>
        {post.replies.map(r=>(
          <div key={r.id} style={{background:"var(--surface)",borderRadius:12,padding:16,border:"1px solid var(--border)",marginBottom:9,borderLeft:r.isAdmin?"4px solid #34a853":undefined}}>
            <div style={{display:"flex",gap:10}}>
              <Avatar name={r.author} size={28} color={r.isAdmin?"#34a853":"#6366f1"}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}><span style={{fontSize:12,fontWeight:700,color:"var(--text)"}}>{r.author}</span>{r.isAdmin&&<Badge color="#34a853" small>Admin</Badge>}<span style={{fontSize:10,color:"var(--muted)"}}>{r.time}</span></div>
                <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.65}}>{r.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div style={{background:"var(--surface)",borderRadius:12,padding:16,border:"1px solid var(--border)",marginTop:14}}>
          <div style={{fontSize:13,fontWeight:700,color:"var(--text)",marginBottom:10}}>Your Answer</div>
          <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Write your answer…" rows={3} style={{...inpS(false),width:"100%",resize:"vertical"}}/>
          <button onClick={()=>submitReply(post.id)} style={{marginTop:10,padding:"8px 20px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>Post Answer</button>
        </div>
      </div>
    );
  }

  return(
    <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <h1 style={{fontSize:20,fontWeight:800,color:"var(--text)"}}>💬 Forum</h1>
        <button onClick={()=>setShowNew(s=>!s)} style={{padding:"8px 18px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Ask Question</button>
      </div>
      {showNew&&(
        <div style={{background:"var(--surface)",borderRadius:14,padding:20,border:"1px solid var(--border)",marginBottom:20,animation:"fadeUp .25s ease"}}>
          <input value={newPost.title} onChange={e=>setNewPost({...newPost,title:e.target.value})} placeholder="Question title…" style={{...inpS(false),width:"100%",marginBottom:9}}/>
          <textarea value={newPost.body} onChange={e=>setNewPost({...newPost,body:e.target.value})} placeholder="Describe in detail…" rows={3} style={{...inpS(false),width:"100%",resize:"vertical",marginBottom:9}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:9}}>
            <select value={newPost.subId} onChange={e=>setNewPost({...newPost,subId:e.target.value})} style={inpS(false)}>{SUBJECTS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
            <input value={newPost.tags} onChange={e=>setNewPost({...newPost,tags:e.target.value})} placeholder="Tags (comma-separated)" style={inpS(false)}/>
          </div>
          <div style={{display:"flex",gap:7}}>
            <button onClick={submitPost} style={{padding:"8px 18px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>Post</button>
            <button onClick={()=>setShowNew(false)} style={{padding:"8px 16px",background:"none",color:"var(--muted)",border:"1.5px solid var(--border)",borderRadius:8,fontSize:12,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {forumPosts.map(post=>(
          <div key={post.id} onClick={()=>setActivePost(post)} style={{background:"var(--surface)",borderRadius:13,padding:"14px 16px",border:"1px solid var(--border)",cursor:"pointer",transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 5px 18px rgba(0,0,0,.1)";e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:40,textAlign:"center"}}>
                <div style={{fontSize:14,color:"#34a853"}}>▲</div>
                <div style={{fontSize:14,fontWeight:800,color:"var(--text)"}}>{post.upvotes-post.downvotes}</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:5}}>{post.title}</div>
                <p style={{fontSize:12,color:"var(--muted)",marginBottom:8,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{post.body}</p>
                <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
                  <Badge color="#1a73e8" small>{post.subject}</Badge>
                  {post.tags?.slice(0,2).map(t=><Badge key={t} color="#6366f1" small>#{t}</Badge>)}
                  <span style={{fontSize:10,color:"var(--muted)",marginLeft:"auto"}}>💬 {post.replies.length} · {post.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PLANNER
// ═══════════════════════════════════════════════════════════════
function PlannerPage(){
  const{tasks,setTasks,showToast}=useContext(AppCtx);
  const{dark}=useContext(ThemeCtx);
  const[showAdd,setShowAdd]=useState(false);
  const[newTask,setNewTask]=useState({title:"",subject:"s1",deadline:"",priority:"medium"});
  const[filter,setFilter]=useState("all");
  const addTask=()=>{ if(!newTask.title||!newTask.deadline){showToast("Fill all fields","warn");return;} setTasks(prev=>[...prev,{id:Date.now()+"",title:newTask.title,subject:newTask.subject,deadline:newTask.deadline,priority:newTask.priority,done:false}]); setNewTask({title:"",subject:"s1",deadline:"",priority:"medium"});setShowAdd(false);showToast("Task added!"); };
  const toggleDone=id=>setTasks(prev=>prev.map(t=>t.id===id?{...t,done:!t.done}:t));
  const deleteTask=id=>{setTasks(prev=>prev.filter(t=>t.id!==id));showToast("Removed","warn");};
  const ft=tasks.filter(t=>filter==="all"||(filter==="done"&&t.done)||(filter==="pending"&&!t.done));
  const pr={high:{color:"#ea4335",label:"High"},medium:{color:"#f59e0b",label:"Med"},low:{color:"#34a853",label:"Low"}};
  const done=tasks.filter(t=>t.done).length;
  const pct=tasks.length?Math.round((done/tasks.length)*100):0;
  return(
    <div style={{maxWidth:840,margin:"0 auto",animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <h1 style={{fontSize:20,fontWeight:800,color:"var(--text)"}}>📋 Study Planner</h1>
        <button onClick={()=>setShowAdd(s=>!s)} style={{padding:"8px 18px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Add Task</button>
      </div>
      <div style={{background:"var(--surface)",borderRadius:14,padding:20,border:"1px solid var(--border)",marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>Progress</span><span style={{fontSize:13,fontWeight:700,color:"#1a73e8"}}>{pct}%</span></div>
        <div style={{height:9,borderRadius:4,background:"var(--border)",overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#1a73e8,#34a853)",borderRadius:4,transition:"width .5s ease"}}/></div>
      </div>
      {showAdd&&(
        <div style={{background:"var(--surface)",borderRadius:13,padding:18,border:"1px solid var(--border)",marginBottom:18,animation:"fadeUp .2s ease"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <input value={newTask.title} onChange={e=>setNewTask({...newTask,title:e.target.value})} placeholder="Task title…" style={{...inpS(dark),gridColumn:"1/-1"}}/>
            <select value={newTask.subject} onChange={e=>setNewTask({...newTask,subject:e.target.value})} style={inpS(dark)}>{SUBJECTS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
            <input type="date" value={newTask.deadline} onChange={e=>setNewTask({...newTask,deadline:e.target.value})} style={inpS(dark)}/>
            <select value={newTask.priority} onChange={e=>setNewTask({...newTask,priority:e.target.value})} style={{...inpS(dark),gridColumn:"1/-1"}}><option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option></select>
          </div>
          <div style={{display:"flex",gap:7}}><button onClick={addTask} style={{padding:"8px 18px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>Add</button><button onClick={()=>setShowAdd(false)} style={{padding:"8px 14px",background:"none",color:"var(--muted)",border:"1.5px solid var(--border)",borderRadius:8,fontSize:12,cursor:"pointer"}}>Cancel</button></div>
        </div>
      )}
      <div style={{display:"flex",gap:7,marginBottom:14}}>{[["all","All"],["pending","Pending"],["done","Done"]].map(([v,l])=><Pill key={v} active={filter===v} onClick={()=>setFilter(v)}>{l}</Pill>)}</div>
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {ft.length===0?<Empty icon="📋" title="No tasks" sub="Add tasks to start planning."/>:
        ft.map(task=>{
          const sub=SUBJECTS.find(s=>s.id===task.subject);
          const p=pr[task.priority];
          const ov=task.deadline&&new Date(task.deadline)<new Date()&&!task.done;
          return(
            <div key={task.id} style={{background:"var(--surface)",borderRadius:11,padding:"12px 14px",border:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10,opacity:task.done?.7:1}}>
              <button onClick={()=>toggleDone(task.id)} style={{width:21,height:21,borderRadius:"50%",border:`2px solid ${task.done?"#34a853":"var(--border)"}`,background:task.done?"#34a853":"transparent",cursor:"pointer",fontSize:10,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{task.done&&"✓"}</button>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:"var(--text)",textDecoration:task.done?"line-through":"none",marginBottom:3}}>{task.title}</div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
                  <span style={{fontSize:10,color:"var(--muted)"}}>{sub?.name}</span>
                  <span style={{fontSize:10,color:ov?"#ea4335":"var(--muted)"}}>📅 {task.deadline}{ov?" ⚠️":""}</span>
                  <Badge color={p.color} small>{p.label}</Badge>
                </div>
              </div>
              <button onClick={()=>deleteTask(task.id)} style={{width:26,height:26,borderRadius:7,border:"1.5px solid var(--border)",background:"transparent",cursor:"pointer",color:"#ea4335",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CALENDAR
// ═══════════════════════════════════════════════════════════════
function CalendarPage(){
  const{calEvents,setCalEvents,setCalModal}=useContext(AppCtx);
  const[vm,setVm]=useState(new Date(2025,0,1));
  const[selDay,setSelDay]=useState(null);
  const y=vm.getFullYear(),m=vm.getMonth();
  const fd=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate();
  const mns=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const efd=day=>{ const d=`${y}-${String(m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`; return calEvents.filter(e=>e.date===d); };
  const tc={exam:"#ea4335",viva:"#9c27b0",deadline:"#f59e0b",study:"#1a73e8"};
  return(
    <div style={{maxWidth:900,margin:"0 auto",animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <h1 style={{fontSize:20,fontWeight:800,color:"var(--text)"}}>📅 Calendar</h1>
        <button onClick={()=>setCalModal({type:"custom"})} style={{padding:"8px 18px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Add Event</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:18,alignItems:"start"}}>
        <div style={{background:"var(--surface)",borderRadius:14,padding:20,border:"1px solid var(--border)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <button onClick={()=>setVm(new Date(y,m-1,1))} style={{width:30,height:30,borderRadius:7,border:"1.5px solid var(--border)",background:"transparent",cursor:"pointer",color:"var(--text)",fontSize:14}}>‹</button>
            <span style={{fontWeight:800,fontSize:14,color:"var(--text)"}}>{mns[m]} {y}</span>
            <button onClick={()=>setVm(new Date(y,m+1,1))} style={{width:30,height:30,borderRadius:7,border:"1.5px solid var(--border)",background:"transparent",cursor:"pointer",color:"var(--text)",fontSize:14}}>›</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:3}}>
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:"var(--muted)",padding:"5px 0"}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
            {[...Array(fd)].map((_,i)=><div key={"e"+i}/>)}
            {[...Array(dim)].map((_,i)=>{
              const day=i+1,de=efd(day);
              const it=day===new Date().getDate()&&m===new Date().getMonth()&&y===new Date().getFullYear();
              const is=selDay===day;
              return(
                <div key={day} onClick={()=>setSelDay(is?null:day)} style={{borderRadius:7,padding:"5px 3px",cursor:"pointer",background:is?"#1a73e818":it?"#1a73e810":"transparent",border:it?"1.5px solid #1a73e8":is?"1.5px solid #1a73e860":"1.5px solid transparent",minHeight:44}}>
                  <div style={{textAlign:"center",fontSize:11,fontWeight:it?800:500,color:it?"#1a73e8":"var(--text)",marginBottom:2}}>{day}</div>
                  {de.slice(0,2).map(ev=><div key={ev.id} style={{fontSize:8,background:tc[ev.type]||"#6366f1",color:"#fff",borderRadius:3,padding:"1px 3px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:1}}>{ev.title}</div>)}
                  {de.length>2&&<div style={{fontSize:8,color:"var(--muted)"}}>+{de.length-2}</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{background:"var(--surface)",borderRadius:14,padding:16,border:"1px solid var(--border)"}}>
          <div style={{fontSize:13,fontWeight:800,color:"var(--text)",marginBottom:12}}>🔔 Upcoming</div>
          {[...calEvents].sort((a,b)=>a.date.localeCompare(b.date)).filter(e=>e.date>=new Date().toISOString().split("T")[0]).slice(0,6).map(ev=>(
            <div key={ev.id} style={{display:"flex",gap:8,marginBottom:10,paddingBottom:10,borderBottom:"1px solid var(--border)"}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:tc[ev.type]||"#6366f1",flexShrink:0,marginTop:3}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:"var(--text)"}}>{ev.title}</div>
                <div style={{fontSize:10,color:"var(--muted)"}}>{ev.date} · {ev.time}</div>
              </div>
              <Badge color={tc[ev.type]||"#6366f1"} small>{ev.type}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SYLLABUS + LEADERBOARD + PROFILE
// ═══════════════════════════════════════════════════════════════
function SyllabusPage(){
  const{user}=useContext(AuthCtx);
  const{dark}=useContext(ThemeCtx);
  const{showToast}=useContext(AppCtx);

  const[sem,setSem]=useState(1);
  const[exp,setExp]=useState(null);
  const[syllabus,setSyllabus]=useLocalStorage("customSyllabus",{sem1:[...SYLLABUS_DATA.sem1],sem2:[...SYLLABUS_DATA.sem2]});
  const[showAddSubject,setShowAddSubject]=useState(false);
  const[editingUnits,setEditingUnits]=useState(null); // index of subject being edited
  const[newSubName,setNewSubName]=useState("");
  const[newSubIcon,setNewSubIcon]=useState("📚");
  const[newSubColor,setNewSubColor]=useState("#1a73e8");
  const[newUnit,setNewUnit]=useState("");
  const[editUnitIdx,setEditUnitIdx]=useState(null); // {subIdx, unitIdx} for inline edit
  const[editUnitVal,setEditUnitVal]=useState("");

  const semKey=sem===1?"sem1":"sem2";
  const data=syllabus[semKey];

  // ── Add subject ──────────────────────────────────────────────
  const addSubject=()=>{
    if(!newSubName.trim()){showToast("Enter subject name","warn");return;}
    setSyllabus(prev=>({...prev,[semKey]:[...prev[semKey],{sub:newSubName.trim(),icon:newSubIcon,color:newSubColor,units:[]}]}));
    setNewSubName("");setNewSubIcon("📚");setNewSubColor("#1a73e8");
    setShowAddSubject(false);showToast("Subject added! ✓");
  };

  // ── Delete subject ───────────────────────────────────────────
  const deleteSubject=idx=>{
    setSyllabus(prev=>({...prev,[semKey]:prev[semKey].filter((_,i)=>i!==idx)}));
    if(exp===idx) setExp(null);
    if(editingUnits===idx) setEditingUnits(null);
    showToast("Subject removed","warn");
  };

  // ── Add unit ─────────────────────────────────────────────────
  const addUnit=subIdx=>{
    if(!newUnit.trim()){showToast("Enter unit name","warn");return;}
    setSyllabus(prev=>{
      const sk=sem===1?"sem1":"sem2";
      const updated=prev[sk].map((s,i)=>i===subIdx?{...s,units:[...s.units,newUnit.trim()]}:s);
      return{...prev,[sk]:updated};
    });
    setNewUnit("");showToast("Unit added! ✓");
  };

  // ── Delete unit ──────────────────────────────────────────────
  const deleteUnit=(subIdx,unitIdx)=>{
    setSyllabus(prev=>{
      const sk=sem===1?"sem1":"sem2";
      const updated=prev[sk].map((s,i)=>i===subIdx?{...s,units:s.units.filter((_,j)=>j!==unitIdx)}:s);
      return{...prev,[sk]:updated};
    });
    showToast("Unit removed","warn");
  };

  // ── Save inline unit edit ────────────────────────────────────
  const saveUnitEdit=(subIdx,unitIdx)=>{
    if(!editUnitVal.trim()) return;
    setSyllabus(prev=>{
      const sk=sem===1?"sem1":"sem2";
      const updated=prev[sk].map((s,i)=>i===subIdx?{...s,units:s.units.map((u,j)=>j===unitIdx?editUnitVal.trim():u)}:s);
      return{...prev,[sk]:updated};
    });
    setEditUnitIdx(null);setEditUnitVal("");showToast("Unit updated ✓");
  };

  const ICONS=["📚","📐","⚡","⚗","⚛","💻","⚙","🧩","∑","∫","📡","🔬"];
  const COLORS=["#1a73e8","#9c27b0","#2e7d32","#c62828","#f57f17","#00838f","#ad1457","#4527a0","#00695c","#283593","#e65100","#00796b"];

  return(
    <div style={{maxWidth:900,margin:"0 auto",animation:"fadeUp .3s ease"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <div>
          <h1 style={{fontSize:20,fontWeight:800,color:"var(--text)"}}>📖 Syllabus</h1>
          <p style={{fontSize:12,color:"var(--muted)",marginTop:3}}>{data.length} subjects · Semester {sem}</p>
        </div>
        {user?.role==="admin"&&(
          <button onClick={()=>{setShowAddSubject(s=>!s);setExp(null);setEditingUnits(null);}} style={{padding:"8px 18px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            {showAddSubject?"✕ Cancel":"+ Add Subject"}
          </button>
        )}
      </div>

      {/* Semester tabs */}
      <div style={{display:"flex",gap:7,marginBottom:20}}>
        <Pill active={sem===1} onClick={()=>{setSem(1);setExp(null);setEditingUnits(null);setShowAddSubject(false);}}>Semester 1</Pill>
        <Pill active={sem===2} onClick={()=>{setSem(2);setExp(null);setEditingUnits(null);setShowAddSubject(false);}}>Semester 2</Pill>
      </div>

      {/* ── Add Subject Form ── */}
      {showAddSubject&&user?.role==="admin"&&(
        <div style={{background:"var(--surface)",borderRadius:16,padding:22,border:"1.5px solid #1a73e840",marginBottom:20,animation:"fadeUp .25s ease"}}>
          <div style={{fontSize:14,fontWeight:800,color:"var(--text)",marginBottom:16}}>➕ Add New Subject — Sem {sem}</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {/* Subject Name */}
            <div>
              <label style={lblS(dark)}>Subject Name</label>
              <input value={newSubName} onChange={e=>setNewSubName(e.target.value)} placeholder="e.g. Engineering Thermodynamics" style={{...inpS(dark),width:"100%"}}/>
            </div>
            {/* Icon picker */}
            <div>
              <label style={lblS(dark)}>Icon</label>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {ICONS.map(ic=>(
                  <button key={ic} onClick={()=>setNewSubIcon(ic)} style={{width:36,height:36,borderRadius:9,border:`2px solid ${newSubIcon===ic?"#1a73e8":"var(--border)"}`,background:newSubIcon===ic?"#1a73e818":"var(--hover)",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>{ic}</button>
                ))}
              </div>
            </div>
            {/* Color picker */}
            <div>
              <label style={lblS(dark)}>Subject Color</label>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {COLORS.map(c=>(
                  <button key={c} onClick={()=>setNewSubColor(c)} style={{width:28,height:28,borderRadius:"50%",background:c,border:newSubColor===c?"3px solid var(--text)":"3px solid transparent",cursor:"pointer",transition:"border .15s",boxShadow:"0 2px 6px rgba(0,0,0,.2)"}}/>
                ))}
              </div>
            </div>
            {/* Preview */}
            <div style={{padding:"10px 14px",background:newSubColor+"18",borderRadius:10,border:`1px solid ${newSubColor}40`,display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:9,background:newSubColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{newSubIcon}</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>{newSubName||"Subject Name"}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>Sem {sem} · 0 Units</div>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button onClick={addSubject} style={{padding:"10px 22px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer"}}>Add Subject</button>
            <button onClick={()=>setShowAddSubject(false)} style={{padding:"10px 16px",background:"none",color:"var(--muted)",border:"1.5px solid var(--border)",borderRadius:9,fontSize:12,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Subject List ── */}
      {data.length===0&&(
        <div style={{textAlign:"center",padding:"52px 20px"}}>
          <div style={{fontSize:48,marginBottom:10}}>📭</div>
          <div style={{fontSize:16,fontWeight:700,color:"var(--text)",marginBottom:6}}>No subjects yet</div>
          <div style={{fontSize:13,color:"var(--muted)"}}>{user?.role==="admin"?"Click \"+ Add Subject\" to get started.":"Your teacher hasn't added subjects for this semester yet."}</div>
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {data.map((item,i)=>{
          const isOpen=exp===i;
          const isEditingU=editingUnits===i;
          // try to match a SUBJECT for icon/color; fallback to item's own
          const matched=SUBJECTS.find(s=>s.name===item.sub);
          const iconColor=item.color||matched?.color||"#1a73e8";
          const icon=item.icon||matched?.icon||"📚";

          return(
            <div key={i} style={{background:"var(--surface)",borderRadius:14,border:`1px solid ${isOpen?"#1a73e840":"var(--border)"}`,overflow:"hidden",transition:"border-color .2s",boxShadow:isOpen?"0 4px 18px rgba(26,115,232,.1)":"none"}}>

              {/* ── Subject header row ── */}
              <div style={{display:"flex",alignItems:"center",gap:0}}>
                <button onClick={()=>{setExp(isOpen?null:i);if(isOpen)setEditingUnits(null);}} style={{flex:1,padding:"14px 16px",display:"flex",alignItems:"center",gap:10,border:"none",background:"transparent",cursor:"pointer",textAlign:"left"}}>
                  <div style={{width:36,height:36,borderRadius:9,background:iconColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.sub}</div>
                    <div style={{fontSize:11,color:"var(--muted)"}}>{item.units.length} Unit{item.units.length!==1?"s":""}</div>
                  </div>
                  <span style={{fontSize:14,color:"var(--muted)",transform:isOpen?"rotate(90deg)":"none",transition:"transform .2s",marginRight:6}}>›</span>
                </button>

                {/* Admin controls on header */}
                {user?.role==="admin"&&(
                  <div style={{display:"flex",gap:4,paddingRight:12,flexShrink:0}}>
                    <button onClick={e=>{e.stopPropagation();setEditingUnits(isEditingU?null:i);setExp(i);setNewUnit("");}} title="Manage units" style={{padding:"5px 9px",borderRadius:8,border:`1.5px solid ${isEditingU?"#1a73e8":"var(--border)"}`,background:isEditingU?"#1a73e818":"transparent",cursor:"pointer",fontSize:11,fontWeight:700,color:isEditingU?"#1a73e8":"var(--muted)",transition:"all .15s"}}>
                      {isEditingU?"✓ Done":"✏️ Edit"}
                    </button>
                    <button onClick={e=>{e.stopPropagation();if(window.confirm(`Delete "${item.sub}"?`)) deleteSubject(i);}} title="Delete subject" style={{padding:"5px 9px",borderRadius:8,border:"1.5px solid #ea433330",background:"#ea433510",cursor:"pointer",fontSize:11,fontWeight:700,color:"#ea4335"}}>🗑</button>
                  </div>
                )}
              </div>

              {/* ── Units panel ── */}
              {isOpen&&(
                <div style={{borderTop:"1px solid var(--border)",padding:"14px 16px",background:"var(--hover)"}}>

                  {/* Unit list */}
                  {item.units.length===0&&(
                    <div style={{textAlign:"center",padding:"16px 0",fontSize:13,color:"var(--muted)"}}>
                      {user?.role==="admin"?"No units yet. Add units below.":"No units added yet."}
                    </div>
                  )}
                  <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:isEditingU?14:0}}>
                    {item.units.map((u,j)=>{
                      const isEditThisUnit=editUnitIdx&&editUnitIdx.subIdx===i&&editUnitIdx.unitIdx===j;
                      return(
                        <div key={j} style={{display:"flex",gap:9,alignItems:"center"}}>
                          {/* unit number badge */}
                          <div style={{width:26,height:26,borderRadius:7,background:iconColor+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:iconColor,flexShrink:0}}>U{j+1}</div>

                          {/* unit text / inline edit */}
                          {isEditThisUnit&&user?.role==="admin"?(
                            <div style={{flex:1,display:"flex",gap:6}}>
                              <input value={editUnitVal} onChange={e=>setEditUnitVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") saveUnitEdit(i,j); if(e.key==="Escape") setEditUnitIdx(null);}} autoFocus style={{...inpS(dark),flex:1,padding:"6px 10px",fontSize:12}}/>
                              <button onClick={()=>saveUnitEdit(i,j)} style={{padding:"5px 10px",background:"#34a853",color:"#fff",border:"none",borderRadius:7,fontSize:11,cursor:"pointer",fontWeight:700}}>✓</button>
                              <button onClick={()=>setEditUnitIdx(null)} style={{padding:"5px 10px",background:"none",color:"var(--muted)",border:"1.5px solid var(--border)",borderRadius:7,fontSize:11,cursor:"pointer"}}>✕</button>
                            </div>
                          ):(
                            <span style={{flex:1,fontSize:12,color:"var(--text)",lineHeight:1.4}}>{u}</span>
                          )}

                          {/* Admin unit controls */}
                          {user?.role==="admin"&&isEditingU&&!isEditThisUnit&&(
                            <div style={{display:"flex",gap:4,flexShrink:0}}>
                              <button onClick={()=>{setEditUnitIdx({subIdx:i,unitIdx:j});setEditUnitVal(u);}} style={{width:24,height:24,borderRadius:6,border:"1.5px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:11,color:"var(--muted)",display:"flex",alignItems:"center",justifyContent:"center"}} title="Edit unit">✏</button>
                              <button onClick={()=>deleteUnit(i,j)} style={{width:24,height:24,borderRadius:6,border:"1.5px solid #ea433330",background:"#ea433510",cursor:"pointer",fontSize:11,color:"#ea4335",display:"flex",alignItems:"center",justifyContent:"center"}} title="Delete unit">✕</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Add unit row (admin only, while editing) */}
                  {user?.role==="admin"&&isEditingU&&(
                    <div style={{display:"flex",gap:7,paddingTop:10,borderTop:"1px dashed var(--border)"}}>
                      <input value={newUnit} onChange={e=>setNewUnit(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addUnit(i)} placeholder="New unit name… (press Enter)" style={{...inpS(dark),flex:1,padding:"8px 12px",fontSize:12}}/>
                      <button onClick={()=>addUnit(i)} style={{padding:"8px 16px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>+ Add Unit</button>
                    </div>
                  )}

                  {/* Non-editing admin quick-add */}
                  {user?.role==="admin"&&!isEditingU&&(
                    <div style={{marginTop:item.units.length>0?10:0,display:"flex",gap:7}}>
                      <input value={editingUnits===i?newUnit:""} onChange={e=>setNewUnit(e.target.value)} onFocus={()=>setEditingUnits(i)} onKeyDown={e=>e.key==="Enter"&&addUnit(i)} placeholder="Quick-add a unit…" style={{...inpS(dark),flex:1,padding:"7px 11px",fontSize:12}}/>
                      <button onClick={()=>addUnit(i)} style={{padding:"7px 14px",background:"#1a73e818",color:"#1a73e8",border:"1.5px solid #1a73e840",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>+ Add</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function LeaderboardPage(){
  const{user}=useContext(AuthCtx);
  const md=["🏆","🥈","🥉"];
  return(
    <div style={{maxWidth:720,margin:"0 auto",animation:"fadeUp .3s ease"}}>
      <h1 style={{fontSize:20,fontWeight:800,color:"var(--text)",marginBottom:20}}>🏆 Leaderboard</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:22}}>
        {LEADERBOARD.slice(0,3).map((u,i)=>(
          <div key={u.rank} style={{background:"var(--surface)",borderRadius:14,padding:18,border:"1px solid var(--border)",textAlign:"center"}}>
            <div style={{fontSize:26,marginBottom:7}}>{md[i]}</div>
            <Avatar name={u.name} size={40} color={u.role==="admin"?"#ea4335":"#1a73e8"}/>
            <div style={{marginTop:8,fontSize:13,fontWeight:800,color:"var(--text)"}}>{u.name}</div>
            <Badge color={u.role==="admin"?"#ea4335":"#34a853"} small>{u.role}</Badge>
            <div style={{marginTop:7,fontSize:18,fontWeight:800,color:"#1a73e8"}}>{u.points}</div>
            <div style={{fontSize:10,color:"var(--muted)"}}>points</div>
          </div>
        ))}
      </div>
      <div style={{background:"var(--surface)",borderRadius:14,border:"1px solid var(--border)",overflow:"hidden"}}>
        {LEADERBOARD.map((u,i)=>(
          <div key={u.rank} style={{padding:"11px 16px",borderBottom:"1px solid var(--border)",display:"grid",gridTemplateColumns:"38px 1fr 70px 70px",gap:7,alignItems:"center",background:user?.name===u.name?"#1a73e808":"transparent"}}>
            <span style={{fontSize:13,fontWeight:800,color:i<3?"#f59e0b":"var(--muted)"}}>{i<3?md[i]:u.rank}</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={u.name} size={28} color={u.role==="admin"?"#ea4335":"#1a73e8"}/><div><div style={{fontSize:12,fontWeight:700,color:"var(--text)"}}>{u.name}{user?.name===u.name&&" (You)"}</div><Badge color={u.role==="admin"?"#ea4335":"#34a853"} small>{u.role}</Badge></div></div>
            <span style={{fontSize:13,fontWeight:800,color:"#1a73e8",textAlign:"right"}}>{u.points}</span>
            <span style={{fontSize:11,color:"var(--muted)",textAlign:"right"}}>{u.answers} ans</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function ProfilePage(){
  const{user}=useContext(AuthCtx);
  const{tasks,bookmarks,notes,pyqs}=useContext(AppCtx);
  const bN=Object.values(notes).flat().filter(n=>bookmarks.notes.includes(n.id));
  const bP=Object.values(pyqs).flat().filter(p=>bookmarks.pyqs.includes(p.id));
  return(
    <div style={{maxWidth:720,margin:"0 auto",animation:"fadeUp .3s ease"}}>
      <div style={{background:"linear-gradient(135deg,#1a73e8,#0d47a1)",borderRadius:18,padding:"28px",color:"#fff",marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{display:"flex",gap:18,alignItems:"center",flexWrap:"wrap"}}>
          <Avatar name={user?.name} size={64} color="rgba(255,255,255,.22)"/>
          <div><h1 style={{fontSize:20,fontWeight:800,marginBottom:3}}>{user?.name}</h1><div style={{opacity:.85,fontSize:13,marginBottom:7}}>{user?.email}</div><div style={{display:"flex",gap:7,flexWrap:"wrap"}}><Badge color="#fff" small><span style={{color:"#1a73e8"}}>{user?.role}</span></Badge><Badge color="#fff" small><span style={{color:"#1a73e8"}}>FE · {user?.joined}</span></Badge></div></div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:12,marginBottom:20}}>
        {[["🔖",bN.length+bP.length,"Bookmarks"],["📋",tasks.length,"Tasks"],["✅",tasks.filter(t=>t.done).length,"Done"],["⭐",user?.points||450,"Points"],["💬",user?.answers||12,"Answers"]].map(([ic,ct,lb])=>(
          <div key={lb} style={{background:"var(--surface)",borderRadius:13,padding:14,border:"1px solid var(--border)",textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:3}}>{ic}</div><div style={{fontSize:18,fontWeight:800,color:"var(--text)",marginBottom:1}}>{ct}</div><div style={{fontSize:10,color:"var(--muted)"}}>{lb}</div>
          </div>
        ))}
      </div>
      <div style={{background:"var(--surface)",borderRadius:14,padding:20,border:"1px solid var(--border)"}}>
        <div style={{fontSize:14,fontWeight:800,color:"var(--text)",marginBottom:14}}>📚 Enrolled Subjects</div>
        {SUBJECTS.map(sub=>(
          <div key={sub.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
            <div style={{width:30,height:30,borderRadius:7,background:sub.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{sub.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:"var(--text)"}}>{sub.name}</div><div style={{fontSize:10,color:"var(--muted)"}}>{sub.code} · Sem {sub.sem}</div></div>
            <div style={{display:"flex",gap:5}}><Badge color="#1a73e8" small>📄 {NOTES_DB[sub.id]?.length||0}</Badge><Badge color="#9c27b0" small>📝 {QUIZZES_DB[sub.id]?.length||0}</Badge></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// UPLOAD + CALENDAR EVENT MODALS
// ═══════════════════════════════════════════════════════════════
function UploadModal(){
  const{setUploadModal,setNotes,setPyqs,showToast}=useContext(AppCtx);
  const{user}=useContext(AuthCtx);
  const{dark}=useContext(ThemeCtx);
  const[type,setType]=useState("notes");
  const[form,setForm]=useState({title:"",subject:"s1",year:"2024"});
  const[file,setFile]=useState(null);
  const[loading,setLoading]=useState(false);
  const submit=async()=>{ if(!form.title||!file){showToast("Fill fields & select PDF","warn");return;} setLoading(true);await sleep(1100);setLoading(false); if(type==="notes") setNotes(prev=>({...prev,[form.subject]:[...(prev[form.subject]||[]),{id:Date.now()+"",title:form.title,by:user.name,date:new Date().toISOString().split("T")[0],size:(file.size/1024/1024).toFixed(1)+" MB",dl:0,rating:0,rcount:0,comments:[]}]})); else setPyqs(prev=>({...prev,[form.subject]:[...(prev[form.subject]||[]),{id:Date.now()+"",title:form.title,year:+form.year,exam:"End Semester",dl:0}]})); showToast("Uploaded! ✓");setUploadModal(false); };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:14}} onClick={e=>e.target===e.currentTarget&&setUploadModal(false)}>
      <div style={{background:"var(--surface)",borderRadius:18,padding:28,width:"100%",maxWidth:440,animation:"fadeUp .3s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><h2 style={{fontSize:17,fontWeight:800,color:"var(--text)"}}>📤 Upload Resource</h2><button onClick={()=>setUploadModal(false)} style={{width:30,height:30,borderRadius:15,border:"1.5px solid var(--border)",background:"transparent",cursor:"pointer",color:"var(--muted)",fontSize:14}}>✕</button></div>
        <div style={{display:"flex",gap:7,marginBottom:18}}>{[["notes","📄 Notes"],["pyqs","📋 PYQ"]].map(([k,l])=><button key={k} onClick={()=>setType(k)} style={{flex:1,padding:"9px",border:`2px solid ${type===k?"#1a73e8":"var(--border)"}`,borderRadius:9,background:type===k?"#1a73e818":"transparent",color:type===k?"#1a73e8":"var(--muted)",fontWeight:700,cursor:"pointer",fontSize:13}}>{l}</button>)}</div>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div><label style={lblS(dark)}>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Resource title…" style={{...inpS(dark),width:"100%"}}/></div>
          <div><label style={lblS(dark)}>Subject</label><select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={{...inpS(dark),width:"100%"}}>{SUBJECTS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          {type==="pyqs"&&<div><label style={lblS(dark)}>Year</label><select value={form.year} onChange={e=>setForm({...form,year:e.target.value})} style={{...inpS(dark),width:"100%"}}>{[2024,2023,2022,2021].map(y=><option key={y}>{y}</option>)}</select></div>}
          <div onClick={()=>document.getElementById("fInput").click()} style={{border:"2px dashed var(--border)",borderRadius:11,padding:22,textAlign:"center",cursor:"pointer",background:"var(--hover)"}}>
            <input id="fInput" type="file" accept=".pdf" style={{display:"none"}} onChange={e=>setFile(e.target.files[0])}/>
            <div style={{fontSize:26,marginBottom:5}}>{file?"📎":"☁️"}</div>
            {file?<div style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>{file.name}</div>:<div style={{fontSize:12,color:"var(--muted)"}}>Drop PDF or click to browse</div>}
          </div>
        </div>
        <button onClick={submit} disabled={loading} style={{width:"100%",marginTop:18,padding:"12px",background:loading?"#93b4f0":"#1a73e8",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:loading?"not-allowed":"pointer"}}>{loading?"⏳ Uploading…":"📤 Upload"}</button>
      </div>
    </div>
  );
}
function CalEventModal(){
  const{calModal,setCalModal,setCalEvents,showToast}=useContext(AppCtx);
  const{dark}=useContext(ThemeCtx);
  const[form,setForm]=useState({title:calModal?.title||"",date:"2025-01-20",time:"10:00",type:calModal?.type||"exam"});
  const submit=()=>{ if(!form.title||!form.date){showToast("Fill fields","warn");return;} setCalEvents(prev=>[...prev,{id:Date.now()+"",title:form.title,date:form.date,time:form.time,type:form.type}]); showToast("📅 Added!");setCalModal(null); };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:14}} onClick={e=>e.target===e.currentTarget&&setCalModal(null)}>
      <div style={{background:"var(--surface)",borderRadius:18,padding:28,width:"100%",maxWidth:400,animation:"fadeUp .3s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><h2 style={{fontSize:16,fontWeight:800,color:"var(--text)"}}>📅 Add Event</h2><button onClick={()=>setCalModal(null)} style={{width:28,height:28,borderRadius:14,border:"1.5px solid var(--border)",background:"transparent",cursor:"pointer",color:"var(--muted)",fontSize:13}}>✕</button></div>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div><label style={lblS(dark)}>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{...inpS(dark),width:"100%"}}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label style={lblS(dark)}>Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{...inpS(dark),width:"100%"}}/></div>
            <div><label style={lblS(dark)}>Time</label><input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} style={{...inpS(dark),width:"100%"}}/></div>
          </div>
          <div><label style={lblS(dark)}>Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{...inpS(dark),width:"100%"}}><option value="exam">📝 Exam</option><option value="deadline">⏰ Deadline</option><option value="viva">🎤 Viva</option><option value="study">📚 Study</option></select></div>
        </div>
        <button onClick={submit} style={{width:"100%",marginTop:16,padding:"11px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:800,cursor:"pointer"}}>Add to Calendar</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADVANCED SEARCH SYSTEM — AdvancedSearch.jsx
// ═══════════════════════════════════════════════════════════════

// ── Static search corpus ──────────────────────────────────────
const SEARCH_CORPUS = [
  // Notes
  ...Object.entries(NOTES_DB).flatMap(([subId, notes]) =>
    notes.map(n => ({
      id: `note-${n.id}`, type: "note", icon: "📄",
      title: n.title, sub: SUBJECTS.find(s => s.id === subId)?.name || "",
      subId, rating: n.rating, date: n.date,
    }))
  ),
  // Subjects
  ...SUBJECTS.map(s => ({
    id: `sub-${s.id}`, type: "subject", icon: s.icon,
    title: s.name, sub: `Sem ${s.sem} · ${s.code}`,
    subId: s.id, color: s.color,
  })),
  // Quizzes
  ...Object.entries(QUIZZES_DB).flatMap(([subId, qs]) =>
    qs.map(q => ({
      id: `quiz-${q.id}`, type: "quiz", icon: "📝",
      title: q.title, sub: SUBJECTS.find(s => s.id === subId)?.name || "",
      subId, unit: q.unit,
    }))
  ),
  // Announcements
  ...INIT_ANNOUNCEMENTS.map(a => ({
    id: `ann-${a.id}`, type: "announcement", icon: "📢",
    title: a.title, sub: a.author + " · " + a.date,
    subId: a.subjectId, important: a.important,
  })),
  // PYQs
  ...Object.entries(PYQS_DB).flatMap(([subId, ps]) =>
    ps.map(p => ({
      id: `pyq-${p.id}`, type: "pyq", icon: "📋",
      title: p.title, sub: `${p.year} · ${p.exam}`,
      subId,
    }))
  ),
];

const TYPE_META = {
  note:         { label: "Note",         color: "#ea4335", bg: "#ea433518" },
  subject:      { label: "Subject",      color: "#1a73e8", bg: "#1a73e818" },
  quiz:         { label: "Quiz",         color: "#9c27b0", bg: "#9c27b018" },
  announcement: { label: "Announcement", color: "#f59e0b", bg: "#f59e0b18" },
  pyq:          { label: "PYQ",          color: "#34a853", bg: "#34a85318" },
};

// ── Highlight matched text ────────────────────────────────────
function Highlight({ text, query }) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark style={{ background: "#fef08a", color: "#713f12", borderRadius: 3, padding: "0 1px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

// ── Main AdvancedSearch component ─────────────────────────────
function AdvancedSearch() {
  const { dark } = useContext(ThemeCtx);
  const { navTo } = useContext(AppCtx);

  const [query,       setQuery]       = useState("");
  const [debouncedQ,  setDebouncedQ]  = useState("");
  const [focused,     setFocused]     = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [listening,   setListening]   = useState(false);
  const [activeIdx,   setActiveIdx]   = useState(-1);
  const [history,     setHistory]     = useLocalStorage("searchHistory", []);
  const [isMobile]                    = useState(() => window.innerWidth < 640);

  // filters
  const [fSubject,  setFSubject]  = useState("");
  const [fType,     setFType]     = useState("");
  const [fDate,     setFDate]     = useState("");
  const [fPriority, setFPriority] = useState("");
  const hasFilter = fSubject || fType || fDate || fPriority;

  const inputRef     = useRef(null);
  const containerRef = useRef(null);
  const filterRef    = useRef(null);

  // ── debounce ────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // ── close on outside click ───────────────────────────────────
  useEffect(() => {
    const h = e => {
      if (containerRef.current && !containerRef.current.contains(e.target) &&
          filterRef.current && !filterRef.current.contains(e.target)) {
        setFocused(false); setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── filter corpus ────────────────────────────────────────────
  const results = useMemo(() => {
    let pool = SEARCH_CORPUS;
    if (fType)    pool = pool.filter(r => r.type === fType);
    if (fSubject) pool = pool.filter(r => r.subId === fSubject || r.sub?.toLowerCase().includes(fSubject));
    if (!debouncedQ.trim()) return [];
    const q = debouncedQ.toLowerCase();
    return pool
      .filter(r => r.title.toLowerCase().includes(q) || r.sub?.toLowerCase().includes(q))
      .slice(0, 12);
  }, [debouncedQ, fType, fSubject]);

  // ── grouped results ──────────────────────────────────────────
  const grouped = useMemo(() => {
    const g = {};
    results.forEach(r => { (g[r.type] = g[r.type] || []).push(r); });
    return g;
  }, [results]);

  const flatList = results; // for keyboard nav

  // ── save to history ──────────────────────────────────────────
  const saveHistory = q => {
    if (!q.trim()) return;
    setHistory(prev => [q, ...prev.filter(h => h !== q)].slice(0, 5));
  };

  // ── select a result ──────────────────────────────────────────
  const selectResult = result => {
    saveHistory(result.title);
    setQuery(result.title); setFocused(false); setActiveIdx(-1);
    if (result.type === "subject") { const s = SUBJECTS.find(x => x.id === result.subId); if (s) navTo("subject", s); }
    else if (result.type === "announcement") navTo("announcements");
    else if (result.subId) { const s = SUBJECTS.find(x => x.id === result.subId); if (s) navTo("subject", s); }
  };

  // ── keyboard nav ─────────────────────────────────────────────
  const handleKeyDown = e => {
    if (!focused) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, flatList.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") {
      if (activeIdx >= 0 && flatList[activeIdx]) selectResult(flatList[activeIdx]);
      else { saveHistory(query); setFocused(false); }
    }
    else if (e.key === "Escape") { setFocused(false); setShowFilters(false); }
  };

  // ── voice search ─────────────────────────────────────────────
  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR(); rec.lang = "en-IN"; rec.interimResults = false;
    setListening(true);
    rec.onresult = e => { setListening(false); setQuery(e.results[0][0].transcript); inputRef.current?.focus(); };
    rec.onerror = () => setListening(false);
    rec.onend   = () => setListening(false);
    rec.start();
  };

  const resetFilters = () => { setFSubject(""); setFType(""); setFDate(""); setFPriority(""); };
  const showDropdown = focused && (debouncedQ.trim().length > 0 || history.length > 0);

  // ── styles ───────────────────────────────────────────────────
  const barBorder = focused ? "#1a73e8" : "var(--border)";
  const barShadow = focused ? "0 0 0 3px rgba(26,115,232,.15), 0 4px 18px rgba(0,0,0,.1)" : "0 2px 8px rgba(0,0,0,.06)";

  return (
    <div ref={containerRef} style={{ position: "relative", flex: 1, maxWidth: 520 }}>
      {/* ── Search Bar ── */}
      <div style={{ display: "flex", alignItems: "center", background: "var(--surface)", border: `1.5px solid ${barBorder}`, borderRadius: 24, padding: "0 12px", gap: 8, boxShadow: barShadow, transition: "border-color .2s, box-shadow .25s" }}>
        {/* search icon */}
        <span style={{ fontSize: 15, color: focused ? "#1a73e8" : "var(--muted)", flexShrink: 0, transition: "color .2s" }}>🔍</span>

        {/* input */}
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveIdx(-1); }}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search notes, subjects, quizzes…"
          aria-label="Search"
          autoComplete="off"
          style={{ flex: 1, border: "none", background: "transparent", padding: "9px 0", fontSize: 13, outline: "none", color: "var(--text)", minWidth: 0 }}
        />

        {/* clear */}
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} style={{ width: 20, height: 20, borderRadius: "50%", border: "none", background: "var(--border)", cursor: "pointer", fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
        )}

        {/* voice */}
        <button
          onClick={startVoice}
          title="Voice search"
          style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: listening ? "#ea4335" : "transparent", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .2s", animation: listening ? "pulse 1s infinite" : "none" }}
        >🎤</button>

        {/* filter toggle */}
        <button
          onClick={() => setShowFilters(s => !s)}
          title="Advanced filters"
          style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 9px", borderRadius: 14, border: `1.5px solid ${hasFilter ? "#1a73e8" : "var(--border)"}`, background: hasFilter ? "#1a73e818" : "transparent", cursor: "pointer", fontSize: 12, fontWeight: 600, color: hasFilter ? "#1a73e8" : "var(--muted)", flexShrink: 0, transition: "all .15s" }}
        >
          ⚙ {hasFilter && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a73e8" }} />}
        </button>
      </div>

      {/* ── Filter Panel ── */}
      {showFilters && (
        <div ref={filterRef} style={{ position: isMobile ? "fixed" : "absolute", ...(isMobile ? { bottom: 0, left: 0, right: 0, borderRadius: "18px 18px 0 0" } : { top: "calc(100% + 8px)", left: 0, right: 0, borderRadius: 16 }), background: "var(--surface)", border: "1.5px solid var(--border)", padding: 18, zIndex: 600, boxShadow: "0 12px 40px rgba(0,0,0,.18)", animation: "fadeUp .2s ease" }}>
          {isMobile && <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 14px" }} />}
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>🔧 Advanced Filters</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {/* Subject */}
            <div>
              <label style={lblS(dark)}>Subject</label>
              <select value={fSubject} onChange={e => setFSubject(e.target.value)} style={{ ...inpS(dark), width: "100%", fontSize: 12, padding: "8px 10px" }}>
                <option value="">All Subjects</option>
                {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            {/* Type */}
            <div>
              <label style={lblS(dark)}>Content Type</label>
              <select value={fType} onChange={e => setFType(e.target.value)} style={{ ...inpS(dark), width: "100%", fontSize: 12, padding: "8px 10px" }}>
                <option value="">All Types</option>
                <option value="note">📄 Notes</option>
                <option value="quiz">📝 Quizzes</option>
                <option value="pyq">📋 PYQs</option>
                <option value="announcement">📢 Announcements</option>
                <option value="subject">📚 Subjects</option>
              </select>
            </div>
            {/* Date */}
            <div>
              <label style={lblS(dark)}>Date Range</label>
              <select value={fDate} onChange={e => setFDate(e.target.value)} style={{ ...inpS(dark), width: "100%", fontSize: 12, padding: "8px 10px" }}>
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            {/* Priority */}
            <div>
              <label style={lblS(dark)}>Priority</label>
              <select value={fPriority} onChange={e => setFPriority(e.target.value)} style={{ ...inpS(dark), width: "100%", fontSize: 12, padding: "8px 10px" }}>
                <option value="">All</option>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>
          {/* Active filter chips */}
          {hasFilter && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
              {fSubject  && <FilterChip label={SUBJECTS.find(s=>s.id===fSubject)?.code || fSubject} onRemove={() => setFSubject("")} />}
              {fType     && <FilterChip label={TYPE_META[fType]?.label} onRemove={() => setFType("")} />}
              {fDate     && <FilterChip label={fDate} onRemove={() => setFDate("")} />}
              {fPriority && <FilterChip label={fPriority} onRemove={() => setFPriority("")} />}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={() => setShowFilters(false)} style={{ flex: 1, padding: "9px", background: "#1a73e8", color: "#fff", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Apply Filters</button>
            {hasFilter && <button onClick={resetFilters} style={{ padding: "9px 14px", background: "none", color: "#ea4335", border: "1.5px solid #ea433340", borderRadius: 9, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Reset</button>}
          </div>
        </div>
      )}

      {/* ── Dropdown ── */}
      {showDropdown && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 16, zIndex: 500, boxShadow: "0 12px 40px rgba(0,0,0,.16)", overflow: "hidden", animation: "fadeUp .18s ease", maxHeight: 380, overflowY: "auto" }}>

          {/* Search history (when input is empty) */}
          {!debouncedQ.trim() && history.length > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px 4px" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em" }}>Recent Searches</span>
                <button onClick={() => setHistory([])} style={{ fontSize: 10, color: "#ea4335", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Clear</button>
              </div>
              {history.map((h, i) => (
                <div key={i} onClick={() => { setQuery(h); setFocused(true); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", cursor: "pointer", transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>🕒</span>
                  <span style={{ fontSize: 13, color: "var(--text)" }}>{h}</span>
                </div>
              ))}
            </div>
          )}

          {/* Results by category */}
          {debouncedQ.trim() && results.length > 0 && Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <div style={{ padding: "8px 14px 3px", fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".07em", borderTop: "1px solid var(--border)" }}>
                {TYPE_META[type]?.label}s
              </div>
              {items.map(result => {
                const globalIdx = flatList.indexOf(result);
                const isActive  = activeIdx === globalIdx;
                const tm        = TYPE_META[result.type] || {};
                return (
                  <div key={result.id} onClick={() => selectResult(result)}
                    style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 14px", cursor: "pointer", background: isActive ? "var(--hover)" : "transparent", transition: "background .12s" }}
                    onMouseEnter={e => { setActiveIdx(globalIdx); e.currentTarget.style.background = "var(--hover)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isActive ? "var(--hover)" : "transparent"; }}>
                    {/* icon */}
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: result.color ? result.color + "22" : tm.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                      {result.icon}
                    </div>
                    {/* text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <Highlight text={result.title} query={debouncedQ} />
                      </div>
                      {result.sub && <div style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{result.sub}</div>}
                    </div>
                    {/* type badge */}
                    <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 8, background: tm.bg, color: tm.color, fontWeight: 700, flexShrink: 0 }}>{tm.label}</span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Empty state */}
          {debouncedQ.trim() && results.length === 0 && (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 5 }}>No results found</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Try different keywords or adjust filters</div>
            </div>
          )}

          {/* Footer hint */}
          {results.length > 0 && (
            <div style={{ padding: "6px 14px 8px", fontSize: 10, color: "var(--muted)", borderTop: "1px solid var(--border)", display: "flex", gap: 12 }}>
              <span>↑↓ navigate</span><span>↵ select</span><span>Esc close</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// small reusable filter chip
function FilterChip({ label, onRemove }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 12, background: "#1a73e818", border: "1px solid #1a73e840", fontSize: 11, fontWeight: 600, color: "#1a73e8" }}>
      {label}
      <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "#1a73e8", fontSize: 11, padding: 0, lineHeight: 1 }}>✕</button>
    </div>
  );
}

const SPPU_KB={
  physics:{name:"Engineering Physics",units:{1:{title:"Interference & Diffraction",topics:["Young's double slit","Newton's rings","Fraunhofer diffraction","Diffraction grating","Resolving power"]},2:{title:"Lasers & Fibre Optics",topics:["Stimulated emission","Ruby laser","He-Ne laser","Numerical aperture","Fibre optic sensors"]},3:{title:"Quantum Mechanics",topics:["de Broglie hypothesis","Heisenberg uncertainty","Schrödinger equation","Particle in a box","Tunnel effect"]},4:{title:"Semiconductor Physics",topics:["Energy bands","Fermi level","Hall effect","Conductivity","Solar cell"]}},
    assignment:u=>[`Q1. State and derive the condition for bright/dark fringes in ${SPPU_KB.physics.units[u]?.title||"the unit"}.`,`Q2. Draw and explain the experimental setup with a neat diagram.`,`Q3. Derive the mathematical expression and explain each term.`,`Q4. Differentiate between constructive and destructive interference.`,`Q5. Numerical: λ=589nm, d=0.5mm, D=1m. Find fringe width.`,`Q6. Explain applications of ${SPPU_KB.physics.units[u]?.topics?.[1]||"the topic"} in modern technology.`,`Q7. State Rayleigh criterion. How does wavelength affect resolving power?`,`Q8. Write short notes: (a) ${SPPU_KB.physics.units[u]?.topics?.[0]} (b) ${SPPU_KB.physics.units[u]?.topics?.[2]||"related topic"}.`],
    notes:u=>`📘 **Unit ${u} – ${SPPU_KB.physics.units[u]?.title}**\n\n**Key Concepts:**\n${(SPPU_KB.physics.units[u]?.topics||[]).map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\n**Formulae:**\n• Fringe width β = λD/d\n• Path diff for bright = nλ\n\n**Exam Tips:**\n✦ Draw neat labelled diagrams\n✦ Derive step-by-step\n✦ Practice numericals`,
  },
  chemistry:{name:"Engineering Chemistry",units:{1:{title:"Atomic Structure",topics:["Wave model","Quantum numbers","Hybridisation","MOT","VSEPR"]},2:{title:"Water Treatment",topics:["Hardness","Boiler troubles","Softening","Potable water","RO"]},3:{title:"Corrosion",topics:["Electrochemical","Galvanic","Passivation","Cathodic protection","Coatings"]},4:{title:"Polymers",topics:["Addition polymerisation","Condensation","Thermoplastics","Thermosets","Composites"]}},
    assignment:u=>[`Q1. Explain mechanism of ${SPPU_KB.chemistry.units[u]?.title} with diagrams.`,`Q2. Compare two major types in tabular form.`,`Q3. Describe industrial applications of ${SPPU_KB.chemistry.units[u]?.topics?.[0]}.`,`Q4. Preventive measures — explain two methods in detail.`,`Q5. Numerical based on relevant formula.`,`Q6. Short notes: (a) ${SPPU_KB.chemistry.units[u]?.topics?.[1]} (b) ${SPPU_KB.chemistry.units[u]?.topics?.[3]||"topic"}.`,`Q7. Advantages and disadvantages.`,`Q8. Relevance to current engineering challenges.`],
    notes:u=>`📗 **Unit ${u} – ${SPPU_KB.chemistry.units[u]?.title}**\n\n**Key Concepts:**\n${(SPPU_KB.chemistry.units[u]?.topics||[]).map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\n**Exam Tips:**\n✦ Start with definitions\n✦ Use labelled diagrams\n✦ Memorise industrial applications`,
  },
  maths1:{name:"Engineering Mathematics I",units:{1:{title:"Differential Calculus",topics:["nth derivative","Leibnitz theorem","Partial differentiation","Euler's theorem","Maxima & minima"]},2:{title:"Matrices",topics:["Eigenvalues","Cayley-Hamilton","Diagonalisation","Linear equations","Rank"]},3:{title:"Complex Numbers",topics:["Polar form","De Moivre's","Powers & roots","Circular functions","Hyperbolic functions"]},4:{title:"Integral Calculus",topics:["Beta & Gamma","Rectification","Volumes","Surface areas","Double integrals"]}},
    assignment:u=>[`Q1. State and prove ${SPPU_KB.maths1.units[u]?.topics?.[0]}.`,`Q2. If y=eᵃˣsin(bx), find nth derivative using Leibnitz.`,`Q3. Find eigenvalues/eigenvectors of 3×3 matrix, verify Cayley-Hamilton.`,`Q4. Evaluate integral using Beta-Gamma formula.`,`Q5. Find maxima/minima of f(x,y)=x³+y³-3axy.`,`Q6. Prove Euler's theorem for homogeneous function.`,`Q7. Expand f(x,y)=eˣlog(1+y) in Taylor's series.`,`Q8. Find area between y²=4ax and x²=4ay by double integration.`],
    notes:u=>`📙 **Unit ${u} – ${SPPU_KB.maths1.units[u]?.title}**\n\n**Key Concepts:**\n${(SPPU_KB.maths1.units[u]?.topics||[]).map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\n**Formulae:**\n• Leibnitz: (uv)ₙ=Σ ⁿCᵣ uₙ₋ᵣvᵣ\n• Euler: x∂u/∂x+y∂u/∂y=nu\n• Beta: B(m,n)=Γ(m)Γ(n)/Γ(m+n)\n\n**Tips:**\n✦ Show every step\n✦ Practice PYQ numericals`,
  },
  bee:{name:"Basic Electronics Engineering",units:{1:{title:"Diodes & BJT",topics:["p-n junction","Zener diode","BJT biasing","CE/CB/CC","Load line"]},2:{title:"Op-Amps",topics:["Ideal op-amp","Inverting amp","Summing amp","Differentiator","Integrator"]},3:{title:"Digital Logic",topics:["Boolean algebra","De Morgan","K-map","Combinational","Flip-flops"]},4:{title:"555 Timer",topics:["Astable","Monostable","Schmitt trigger","PWM","Applications"]}},
    assignment:u=>[`Q1. Explain working of ${SPPU_KB.bee.units[u]?.topics?.[0]} with circuit diagram.`,`Q2. Draw V-I characteristics and list important parameters.`,`Q3. Design circuit for given specification and verify.`,`Q4. Derive voltage gain expression.`,`Q5. Simplify: F(A,B,C,D)=Σ(1,3,5,7,9,11,13,15) using K-map.`,`Q6. Tabular comparison of two major configurations.`,`Q7. Numerical: Find Q-point for BJT (VCC=12V,RC=2kΩ,β=100).`,`Q8. Short notes: (a) ${SPPU_KB.bee.units[u]?.topics?.[2]} (b) Applications.`],
    notes:u=>`📕 **Unit ${u} – ${SPPU_KB.bee.units[u]?.title}**\n\n**Key Concepts:**\n${(SPPU_KB.bee.units[u]?.topics||[]).map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\n**Tips:**\n✦ Label all circuit diagrams\n✦ Si Vbe≈0.7V, Ge≈0.3V\n✦ KVL/KCL for numericals`,
  },
  programming:{name:"C Programming / PPS",units:{1:{title:"C Basics",topics:["Variables","Operators","Control structures","I/O","Type conversion"]},2:{title:"Arrays & Strings",topics:["1D/2D arrays","String functions","strcpy/strcat","Bubble sort","Binary search"]},3:{title:"Functions",topics:["Call by value/ref","Recursion","Factorial/Fibonacci","Tower of Hanoi","Scope rules"]},4:{title:"Pointers & Structures",topics:["Pointer arithmetic","Pointer to array","struct/typedef","Linked list","File I/O"]}},
    assignment:u=>[`Q1. Write C program to ${["find primes using Sieve of Eratosthenes","sort array using Bubble Sort","find GCD/LCM recursively","demonstrate pointer arithmetic"][u-1]||"solve given problem"}.`,`Q2. Explain with program: ${SPPU_KB.programming.units[u]?.topics?.[0]}.`,`Q3. String function: length, reverse, palindrome check.`,`Q4. Call-by-value vs call-by-reference with swap example.`,`Q5. Recursive Tower of Hanoi, trace for n=3.`,`Q6. Struct 'Student': input, display, find average.`,`Q7. Dry run the code and find output.`,`Q8. Common runtime errors in C with corrections.`],
    notes:u=>`💻 **Unit ${u} – ${SPPU_KB.programming.units[u]?.title}**\n\n**Key Concepts:**\n${(SPPU_KB.programming.units[u]?.topics||[]).map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\n**Code Patterns:**\n• Array: for(i=0;i<n;i++)\n• String copy: while(*d++=*s++)\n• Recursion must have base case!\n\n**Tips:**\n✦ Trace programs for dry run\n✦ Declare with proper types`,
  },
  mechanics:{name:"Engineering Mechanics",units:{1:{title:"Force Systems",topics:["Resultant","Moment","Varignon's","FBD","Lami's theorem"]},2:{title:"Equilibrium",topics:["Conditions","Support reactions","Beam reactions","Pin frames","Method of sections"]},3:{title:"Centroid & MOI",topics:["Composite centroid","MOI","Parallel axis","Polar moment","Radius of gyration"]},4:{title:"Friction",topics:["Laws of friction","Angle of friction","Belt friction","Projectile","Relative motion"]}},
    assignment:u=>[`Q1. State and prove ${SPPU_KB.mechanics.units[u]?.topics?.[0]} with numerical.`,`Q2. Beam: span=6m, UDL=10kN/m over 3m, point load=20kN at mid. Find reactions.`,`Q3. Centroid of composite figure (rectangle+triangle+semicircle).`,`Q4. MOI of T-section about centroidal axes.`,`Q5. Two blocks, μ=0.3. Find acceleration and tension.`,`Q6. Projectile at 60°, v=40m/s. Find max height, range, time.`,`Q7. Method of joints for pin-jointed plane truss.`,`Q8. Lami's theorem: solve concurrent force system.`],
    notes:u=>`⚙️ **Unit ${u} – ${SPPU_KB.mechanics.units[u]?.title}**\n\n**Key Concepts:**\n${(SPPU_KB.mechanics.units[u]?.topics||[]).map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\n**Formulae:**\n• ΣFx=0, ΣFy=0, ΣM=0\n• Centroid: x̄=ΣAx/ΣA\n• MOI: I=Iₒ+Ah²\n• Friction: F=μN\n\n**Tips:**\n✦ Draw clear FBD first\n✦ Consistent sign convention`,
  },
};

function parseIntent(text){
  const t=text.toLowerCase();
  const sm=[{keys:["physics","ep"],sub:"physics"},{keys:["chemistry","ec"],sub:"chemistry"},{keys:["math","maths","em1","em-1","em i"],sub:"maths1"},{keys:["electronics","bee","basic electronics"],sub:"bee"},{keys:["programming","c program","fpl","pps","python"],sub:"programming"},{keys:["mechanics","em2"],sub:"mechanics"}];
  const um=t.match(/unit\s*(\d)/i);
  const unit=um?parseInt(um[1]):1;
  let subject=null;
  for(const s of sm){if(s.keys.some(k=>t.includes(k))){subject=s.sub;break;}}
  if(t.includes("assign")) return{type:"assignment",subject,unit};
  if(t.includes("note")) return{type:"notes",subject,unit};
  if(t.includes("quiz")||t.includes("test me")) return{type:"quiz",subject,unit};
  if(t.includes("study plan")||t.includes("schedule")) return{type:"studyplan"};
  if(t.includes("import")||t.includes("important question")) return{type:"important",subject,unit};
  if(t.includes("explain")||t.includes("what is")) return{type:"explain",subject,unit};
  if(t.includes("syllabus")) return{type:"syllabus",subject};
  if(t.match(/^h(i|ello|ey)/)||t==="hi") return{type:"greet"};
  if(t.includes("help")) return{type:"help"};
  return{type:"unknown",subject,unit};
}

function buildResponse(intent,query,ctx){
  const sub=intent.subject||ctx.lastSubject;
  const kb=sub?SPPU_KB[sub]:null;
  const u=Math.min(Math.max(intent.unit||1,1),4);
  switch(intent.type){
    case"greet": return{text:"👋 Hello! I'm your **SPPU FE Study Assistant**.\n\nI can help with:\n• 📘 Assignment questions\n• 📝 Unit-wise notes\n• 🎯 Quick quizzes\n• 📅 Study plans\n\nTry: *\"Physics Unit 1 assignment\"*",mode:"rich"};
    case"help": return{text:"🤖 **What I can do:**\n\n📘 *\"Physics Unit 2 assignment\"*\n📝 *\"Notes for Maths Unit 1\"*\n🎯 *\"Quiz me on BEE\"*\n📌 *\"Important questions Chemistry\"*\n📖 *\"Show Physics syllabus\"*\n📅 *\"Create study plan\"*",mode:"rich"};
    case"assignment": if(!kb) return{text:"⚠️ Please mention a subject!\nE.g. \"Physics Unit 1 assignment\"",mode:"plain"}; const qs=kb.assignment(u); return{text:`📘 **${kb.name} — Unit ${u}: ${kb.units[u]?.title||""}**\n**Assignment Questions**\n━━━━━━━━━━━━━━━\n\n${qs.join("\n\n")}\n\n━━━━━━━━━━━━━━━\n📌 ${qs.length} questions | SPPU FE Pattern`,mode:"assignment",subject:sub,unit:u,qs};
    case"notes": if(!kb) return{text:"⚠️ Specify a subject! E.g. \"BEE Unit 2 notes\"",mode:"plain"}; return{text:kb.notes(u),mode:"notes",subject:sub,unit:u};
    case"quiz": if(!kb) return{text:"⚠️ Mention a subject to quiz on!",mode:"plain"}; const qUnit=kb.units[u]; return{text:`🎯 **Quick Quiz — ${kb.name} Unit ${u}**\n\n${(qUnit?.topics||[]).map((t,i)=>`**Q${i+1}.** What do you know about *${t}*?`).join("\n\n")}\n\n💡 *Go to Quizzes tab for full MCQ practice!*`,mode:"rich"};
    case"important": if(!kb) return{text:"⚠️ Specify a subject.",mode:"plain"}; return{text:`📌 **Important Questions — ${kb.name} Unit ${u}**\n\n${kb.assignment(u).slice(0,5).map((q,i)=>`**${i+1}.** ${q.replace(/^Q\d+\. /,"")}`).join("\n\n")}\n\n⭐ *High-probability exam questions*`,mode:"rich"};
    case"explain": if(!kb) return{text:"Please specify what to explain.",mode:"plain"}; const exU=kb.units[u]; return{text:`📖 **${exU?.title||kb.name}**\n\n${(exU?.topics||[]).map((t,i)=>`${i+1}. **${t}** — Core concept in ${kb.name} per SPPU syllabus.`).join("\n\n")}`,mode:"rich"};
    case"syllabus": if(!kb) return{text:`Available:\n${Object.values(SPPU_KB).map(s=>`• ${s.name}`).join("\n")}\n\nAsk: "Physics syllabus"`,mode:"plain"}; return{text:`📚 **${kb.name} Syllabus**\n\n${Object.entries(kb.units).map(([n,u])=>`**Unit ${n}: ${u.title}**\n${u.topics.map(t=>`  • ${t}`).join("\n")}`).join("\n\n")}`,mode:"rich"};
    case"studyplan": return{text:`📅 **7-Day FE Study Plan**\n\n**Day 1–2:** Engineering Mathematics I\n  • Units 1–2: Calculus + Matrices\n\n**Day 3:** Engineering Physics\n  • Units 1–2: Interference + Lasers\n\n**Day 4:** Basic Electronics\n  • Units 1–2: Diodes + Op-Amps\n\n**Day 5:** Engineering Chemistry\n  • Units 2–3: Water + Corrosion\n\n**Day 6:** Mechanics + Graphics\n\n**Day 7:** Revision + PYQs\n\n✦ *Add tasks via the Study Planner tab!*`,mode:"rich"};
    default: if(kb) return{text:`I see you're asking about **${kb.name}**. Try:\n• "${kb.name} Unit ${u} assignment"\n• "Make notes for ${kb.name}"\n• "Quiz me on ${kb.name}"`,mode:"plain"}; return{text:`🤔 Try:\n• "Physics assignment"\n• "Maths Unit 2 notes"\n• "Quiz me on BEE"\n• "Study plan for FE"`,mode:"plain"};
  }
}

function MessageBubble({msg}){
  const isUser=msg.role==="user";
  if(isUser) return(
    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10,animation:"fadeUp .2s ease"}}>
      <div style={{maxWidth:"75%",padding:"10px 13px",borderRadius:"18px 18px 4px 18px",background:"linear-gradient(135deg,#1a73e8,#4285f4)",color:"#fff",fontSize:13,boxShadow:"0 2px 10px rgba(26,115,232,.3)"}}>{msg.text}</div>
    </div>
  );
  const fmt=text=>text.split("\n").map((line,i)=>{
    line=line.replace(/\*\*(.*?)\*\*/g,(_,m)=>`<strong>${m}</strong>`).replace(/\*(.*?)\*/g,(_,m)=>`<em>${m}</em>`);
    return<p key={i} style={{margin:"1px 0",lineHeight:1.6}} dangerouslySetInnerHTML={{__html:line||"&nbsp;"}}/>;
  });
  return(
    <div style={{display:"flex",gap:7,marginBottom:12,alignItems:"flex-end",animation:"fadeUp .25s ease"}}>
      <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#1a73e8,#0d47a1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,boxShadow:"0 2px 8px rgba(26,115,232,.3)"}}>🤖</div>
      <div style={{maxWidth:"80%",padding:"10px 13px",borderRadius:"18px 18px 18px 4px",background:"var(--surface)",border:"1px solid var(--border)",fontSize:13,boxShadow:"0 2px 8px rgba(0,0,0,.07)",color:"var(--text)"}}>
        {msg.typing?(
          <div style={{display:"flex",gap:4,alignItems:"center",padding:"2px 0"}}>{[0,1,2].map(i=><span key={i} style={{width:7,height:7,borderRadius:"50%",background:"#1a73e8",display:"inline-block",animation:`bounce .9s ease ${i*.2}s infinite`}}/>)}</div>
        ):(
          <>
            {msg.mode==="assignment"&&(
              <div style={{display:"flex",gap:5,marginBottom:9,padding:"5px 7px",background:"#1a73e808",borderRadius:7,border:"1px solid #1a73e820"}}>
                <button onClick={()=>navigator.clipboard?.writeText(msg.text)} style={{fontSize:10,padding:"3px 9px",background:"#1a73e8",color:"#fff",border:"none",borderRadius:5,cursor:"pointer",fontWeight:600}}>📋 Copy</button>
                <button onClick={()=>{const w=window.open("","_blank","width=700,height=900");w.document.write(`<html><body style="font-family:Arial;padding:28px;max-width:660px;margin:auto"><h2 style="color:#1a73e8">${msg.text.split("\n")[0].replace(/\*/g,"")}</h2><hr/><pre style="white-space:pre-wrap;font-size:14px;line-height:1.8">${msg.text.replace(/\*\*/g,"").replace(/\*/g,"")}</pre></body></html>`);w.print();}} style={{fontSize:10,padding:"3px 9px",background:"#34a853",color:"#fff",border:"none",borderRadius:5,cursor:"pointer",fontWeight:600}}>🖨 Print</button>
              </div>
            )}
            <div style={{fontSize:13,lineHeight:1.65}}>{fmt(msg.text)}</div>
          </>
        )}
      </div>
    </div>
  );
}

function InputBar({onSend,listening,onVoice}){
  const[val,setVal]=useState("");
  const iRef=useRef(null);
  const send=()=>{ if(!val.trim()) return; onSend(val.trim());setVal("");iRef.current?.focus(); };
  return(
    <div style={{display:"flex",gap:7,padding:"9px 12px 12px",borderTop:"1px solid var(--border)",background:"var(--surface)",alignItems:"flex-end"}}>
      <div style={{flex:1,display:"flex",alignItems:"center",background:"var(--hover)",borderRadius:20,border:"1.5px solid var(--border)",padding:"0 10px",gap:6}}>
        <input ref={iRef} value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Ask about assignments, notes, quizzes…" style={{flex:1,border:"none",background:"transparent",padding:"9px 0",fontSize:12,outline:"none",color:"var(--text)"}}/>
        <button onClick={onVoice} title="Voice input" style={{width:26,height:26,borderRadius:"50%",border:"none",background:listening?"#ea4335":"transparent",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .2s"}}>🎤</button>
      </div>
      <button onClick={send} disabled={!val.trim()} style={{width:38,height:38,borderRadius:"50%",border:"none",background:val.trim()?"linear-gradient(135deg,#1a73e8,#4285f4)":"var(--border)",cursor:val.trim()?"pointer":"default",fontSize:15,color:val.trim()?"#fff":"#9ca3af",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",boxShadow:val.trim()?"0 3px 10px rgba(26,115,232,.4)":"none",flexShrink:0}}>➤</button>
    </div>
  );
}

function ChatWindow({onClose}){
  const[messages,setMessages]=useState([{id:0,role:"assistant",text:"👋 Hello! I'm your **SPPU FE Study Assistant**.\n\nI can generate assignments, notes, quizzes, and study plans.\n\nTry: *\"Physics Unit 1 assignment\"*",mode:"rich"}]);
  const[ctx,setCtx]=useState({lastSubject:null});
  const[listening,setListening]=useState(false);
  const[isMobile]=useState(()=>window.innerWidth<640);
  const bottomRef=useRef(null);
  const nextId=useRef(1);

  const QUICK_ACTIONS=[
    {label:"📘 Physics Assignment",query:"Engineering Physics Unit 1 assignment"},
    {label:"📝 Maths Notes",query:"Maths Unit 1 notes"},
    {label:"🎯 Quiz on BEE",query:"Quiz me on Basic Electronics Unit 1"},
    {label:"📅 Study Plan",query:"Create 7 day study plan"},
  ];
  const SUGGESTIONS=["Physics Unit 2 assignment","Important questions Chemistry","Quiz me on Programming","Maths Unit 3 notes"];

  const handleSend=async text=>{
    const uid=nextId.current++;
    setMessages(prev=>[...prev,{id:uid,role:"user",text}]);
    const tid=nextId.current++;
    setMessages(prev=>[...prev,{id:tid,role:"assistant",typing:true}]);
    await sleep(700+Math.random()*500);
    const intent=parseIntent(text);
    const resp=buildResponse(intent,text,ctx);
    if(intent.subject) setCtx(c=>({...c,lastSubject:intent.subject}));
    setMessages(prev=>prev.map(m=>m.id===tid?{...m,typing:false,text:resp.text,mode:resp.mode}:m));
  };

  const handleVoice=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setMessages(prev=>[...prev,{id:nextId.current++,role:"assistant",text:"⚠️ Voice input not supported in this browser."}]);return;}
    const rec=new SR();rec.lang="en-IN";rec.interimResults=false;
    setListening(true);
    rec.onresult=e=>{setListening(false);handleSend(e.results[0][0].transcript);};
    rec.onerror=()=>setListening(false);
    rec.onend=()=>setListening(false);
    rec.start();
  };

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  const ws=isMobile
    ?{position:"fixed",inset:0,zIndex:950,display:"flex",flexDirection:"column",background:"var(--surface)",animation:"fadeUp .3s ease"}
    :{position:"fixed",bottom:82,right:20,width:370,height:570,zIndex:950,display:"flex",flexDirection:"column",borderRadius:20,overflow:"hidden",background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"0 20px 60px rgba(0,0,0,.22)",animation:"fadeUp .3s cubic-bezier(.4,0,.2,1)"};

  return(
    <div style={ws}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1a73e8,#0d47a1)",padding:"14px 16px",display:"flex",alignItems:"center",gap:10,flexShrink:0,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-10,top:-10,fontSize:70,opacity:.07}}>🎓</div>
        <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0,boxShadow:"0 2px 10px rgba(0,0,0,.2)"}}>🤖</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.2}}>Study Assistant</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.75)"}}>SPPU FE Expert · Always online</div>
        </div>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#34a853",animation:"pulse 2s infinite"}}/>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,.15)",border:"none",cursor:"pointer",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 12px 6px"}}>
        {messages.map(msg=><MessageBubble key={msg.id} msg={msg}/>)}
        {messages.length<=2&&(
          <div style={{padding:"4px 0 9px",display:"flex",flexWrap:"wrap",gap:5}}>
            {SUGGESTIONS.map(s=><button key={s} onClick={()=>handleSend(s)} style={{padding:"4px 11px",borderRadius:13,border:"1.5px solid #1a73e840",background:"#1a73e810",color:"#1a73e8",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{s}</button>)}
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Quick actions */}
      <div style={{padding:"7px 10px",borderTop:"1px solid var(--border)",display:"flex",gap:5,overflowX:"auto",background:"var(--hover)",flexShrink:0}}>
        {QUICK_ACTIONS.map(a=>(
          <button key={a.label} onClick={()=>handleSend(a.query)} style={{padding:"5px 11px",borderRadius:13,border:"1.5px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s",flexShrink:0}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#1a73e8";e.currentTarget.style.color="#1a73e8";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text)";}}>
            {a.label}
          </button>
        ))}
      </div>

      <InputBar onSend={handleSend} listening={listening} onVoice={handleVoice}/>
    </div>
  );
}

function ChatAssistant({onClose}){
  return <ChatWindow onClose={onClose}/>;
}

// ═══════════════════════════════════════════════════════════════
// AI FAB — AIFab.jsx
// Long-press (500 ms) → choice menu  |  Short tap → Gemini
// ═══════════════════════════════════════════════════════════════
function AIFab({ onOpenInternal, showToast }) {
  const [menu, setMenu]       = useState(false);   // choice menu visible
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);   // visual press feedback
  const holdTimer             = useRef(null);
  const menuRef               = useRef(null);

  // ── close menu on outside click ─────────────────────────────
  useEffect(() => {
    if (!menu) return;
    const handle = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false); };
    document.addEventListener("pointerdown", handle);
    return () => document.removeEventListener("pointerdown", handle);
  }, [menu]);

  // ── open Gemini ──────────────────────────────────────────────
  const openGemini = () => {
    showToast("✨ Opening Gemini AI…", "success");
    setTimeout(() => window.open("https://gemini.google.com/", "_blank", "noopener,noreferrer"), 400);
  };

  // ── pointer events (short tap vs long-press) ─────────────────
  const onPointerDown = () => {
    setPressed(true);
    holdTimer.current = setTimeout(() => {
      setPressed(false);
      setMenu(true);                  // long-press → show menu
    }, 500);
  };
  const onPointerUp = () => {
    setPressed(false);
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
      if (!menu) openGemini();        // short tap → Gemini
    }
  };
  const onPointerLeave = () => {
    setPressed(false);
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
    setHovered(false);
  };

  // ── styles ───────────────────────────────────────────────────
  const fabStyle = {
    position: "fixed", bottom: 20, right: 20, zIndex: 800,
    width: 54, height: 54, borderRadius: "50%", border: "none",
    background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 55%, #06b6d4 100%)",
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 24,
    // hover + press transforms
    transform: pressed ? "scale(0.92)" : hovered ? "scale(1.12)" : "scale(1)",
    boxShadow: hovered
      ? "0 0 0 8px rgba(124,58,237,.18), 0 8px 28px rgba(124,58,237,.45)"
      : "0 6px 22px rgba(124,58,237,.40)",
    transition: "transform .18s cubic-bezier(.4,0,.2,1), box-shadow .18s ease",
    userSelect: "none", WebkitUserSelect: "none",
    touchAction: "none",
  };

  const menuStyle = {
    position: "fixed",
    bottom: 84, right: 20,
    zIndex: 810,
    background: "var(--surface)",
    border: "1.5px solid var(--border)",
    borderRadius: 16,
    padding: "8px 6px",
    boxShadow: "0 16px 48px rgba(0,0,0,.22)",
    minWidth: 210,
    animation: "fadeUp .22s cubic-bezier(.4,0,.2,1)",
  };

  const menuItemStyle = (accent) => ({
    width: "100%", display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", border: "none", borderRadius: 10,
    background: "transparent", cursor: "pointer", textAlign: "left",
    fontSize: 13, fontWeight: 600, color: "var(--text)",
    transition: "background .15s",
  });

  const tooltipStyle = {
    position: "absolute", bottom: "calc(100% + 10px)", right: 0,
    background: "#1a1a2e", color: "#fff",
    fontSize: 11, fontWeight: 600,
    padding: "5px 10px", borderRadius: 8,
    whiteSpace: "nowrap", pointerEvents: "none",
    opacity: hovered && !menu ? 1 : 0,
    transform: hovered && !menu ? "translateY(0)" : "translateY(4px)",
    transition: "opacity .18s, transform .18s",
    boxShadow: "0 4px 14px rgba(0,0,0,.25)",
  };

  // ── pulsing ring ─────────────────────────────────────────────
  const ringStyle = {
    position: "fixed", bottom: 20, right: 20, zIndex: 799,
    width: 54, height: 54, borderRadius: "50%",
    border: "2px solid rgba(124,58,237,.5)",
    animation: "fabRing 2.4s ease-out infinite",
    pointerEvents: "none",
  };

  return (
    <>
      <style>{`
        @keyframes fabRing {
          0%   { transform: scale(1);   opacity: .7; }
          70%  { transform: scale(1.65); opacity: 0; }
          100% { transform: scale(1.65); opacity: 0; }
        }
      `}</style>

      {/* pulsing ring */}
      <div style={ringStyle} />

      {/* choice menu */}
      {menu && (
        <div ref={menuRef} style={menuStyle}>
          {/* Gemini option */}
          <button
            style={menuItemStyle()}
            onMouseEnter={e => e.currentTarget.style.background="var(--hover)"}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}
            onClick={() => { setMenu(false); openGemini(); }}
          >
            <span style={{ fontSize: 22 }}>✨</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Open Gemini AI</div>
              <div style={{ fontSize: 10, color: "var(--muted)" }}>Opens in new tab</div>
            </div>
          </button>

          {/* divider */}
          <div style={{ height: 1, background: "var(--border)", margin: "4px 6px" }} />

          {/* internal assistant option */}
          <button
            style={menuItemStyle()}
            onMouseEnter={e => e.currentTarget.style.background="var(--hover)"}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}
            onClick={() => { setMenu(false); onOpenInternal(); }}
          >
            <span style={{ fontSize: 22 }}>🤖</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Internal Assistant</div>
              <div style={{ fontSize: 10, color: "var(--muted)" }}>SPPU FE study bot</div>
            </div>
          </button>

          <div style={{ padding: "6px 8px 2px", fontSize: 10, color: "var(--muted)", textAlign: "center" }}>
            Hold button for this menu · Tap to open Gemini
          </div>
        </div>
      )}

      {/* FAB button */}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 800 }}>
        {/* tooltip */}
        <div style={tooltipStyle}>✨ Open Gemini AI &nbsp;·&nbsp; Hold for options</div>

        <button
          aria-label="Open Gemini AI Assistant"
          title="Open Gemini AI"
          style={fabStyle}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerLeave}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); }}
        >
          ✨
        </button>
      </div>
    </>
  );
}
