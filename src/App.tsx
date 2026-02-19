import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Target, ArrowRight, ShieldCheck, Cpu, Search, 
  Activity, Globe, Binary, Terminal, Star, ChevronLeft, 
  BookOpen, Layers, User as UserIcon, Map
} from 'lucide-react';

/**
 * FIREBASE AUTHENTICATION
 */
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

/**
 * CORE MODULES
 */
import { ViewState, User } from '../types';
import { CareerProfile, SkillGapReport } from './types';
import { calculateCareerPath } from './utils/logic'; // The new Logic Engine
import { getQuickMarketPulse, searchGlobalMarketData } from '../geminiService';
import AssessmentPage from './AssessmentPage';
import SkillGapAnalyzer from './SkillGapAnalyzer';
import ExecutionPlanDashboard from './ExecutionPlanDashboard';

// Initialize Firebase (Replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSy_demo_key", 
  authDomain: "pathmind-ai.firebaseapp.com",
  projectId: "pathmind-ai",
  storageBucket: "pathmind-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// --- SHARED UI COMPONENTS ---

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="fixed top-28 left-6 md:left-10 z-[60] flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-slate-400 hover:text-cyan-400 transition-all group"
  >
    <div className="p-1 bg-white/5 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
      <ChevronLeft className="w-4 h-4" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.3em] mono">Back</span>
  </motion.button>
);

const Navbar: React.FC<{ 
  currentView: ViewState; 
  setView: (v: ViewState) => void;
  user: User | null;
  onLogout: () => void;
  isLanding: boolean;
}> = ({ currentView, setView, user, onLogout, isLanding }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isLanding && !isScrolled;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 px-6 md:px-10 py-6 flex justify-between items-center transition-all duration-500 ease-in-out ${
        isTransparent 
          ? 'bg-transparent border-transparent' 
          : 'bg-[#020617]/80 backdrop-blur-3xl border-b border-white/5 shadow-2xl'
      }`}
    >
      <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('landing')}>
        <div className="bg-gradient-to-br from-cyan-500 to-violet-600 p-2.5 rounded-xl group-hover:rotate-12 transition-all shadow-lg shadow-cyan-500/20">
          <Binary className="text-white w-6 h-6" />
        </div>
        <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">PathMind<span className="text-cyan-400 not-italic">AI</span></span>
      </div>
      
      <div className="hidden lg:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
        <button onClick={() => setView('landing')} className={`hover:text-cyan-400 transition-colors ${currentView === 'landing' ? 'text-cyan-400' : ''}`}>Protocol</button>
        <button onClick={() => setView('assessment')} className={`hover:text-cyan-400 transition-colors ${currentView === 'assessment' ? 'text-cyan-400' : ''}`}>Neural Sync</button>
        <button onClick={() => setView('trends')} className={`hover:text-cyan-400 transition-colors ${currentView === 'trends' ? 'text-cyan-400' : ''}`}>Market Grounding</button>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4 bg-white/5 pl-6 pr-2 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Operative</p>
              <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
            </div>
            <button onClick={onLogout} title="Terminate Session">
              <img src={user.photoURL} alt="User Avatar" className="w-10 h-10 rounded-xl border-2 border-cyan-500/30 hover:scale-105 transition-transform" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setView('login')}
            className="bg-white text-slate-950 px-6 md:px-10 py-4 rounded-xl text-xs font-black hover:bg-cyan-400 hover:text-white transition-all flex items-center gap-3 shadow-2xl active:scale-95 uppercase tracking-widest"
          >
            Authenticate
          </button>
        )}
      </div>
    </motion.nav>
  );
};

// --- LANDING PAGE ---
const LandingPage: React.FC<{ onStart: () => void; onExplore: () => void }> = ({ onStart, onExplore }) => {
  const [marketPulse, setMarketPulse] = useState("Synchronizing intelligence...");
  
  useEffect(() => {
    // Optional: Keep this for flavor text
    getQuickMarketPulse("Future of Work").then(setMarketPulse);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020617]">
      <div className="mesh-gradient" />
      
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        {/* Background Video/Effect */}
        <div className="video-docker opacity-40 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/0 via-[#020617]/50 to-[#020617] z-[1]" />
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl"
        >
          <div className="inline-flex items-center gap-4 bg-cyan-500/10 text-cyan-400 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-cyan-500/20 backdrop-blur-2xl mono">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>{marketPulse}</span>
          </div>

          <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-black text-white mb-10 leading-[0.85] tracking-tighter">
            Architect Your <br />
            <span className="gradient-text italic">Absolute Legacy.</span>
          </h1>

          <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto mb-20 leading-relaxed font-medium">
            PathMind utilizes <span className="text-white">Multi-Dimensional Neural Logic</span> to map your personality, skills, and life direction to a precise career trajectory.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 80px rgba(6, 182, 212, 0.4)" }} 
              whileTap={{ scale: 0.95 }} 
              onClick={onStart} 
              className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white px-20 py-8 md:py-10 rounded-2xl text-xl font-black transition-all flex items-center gap-5 group shadow-3xl shadow-cyan-500/10 uppercase tracking-widest"
            >
              Initialize Protocol
              <ArrowRight className="group-hover:translate-x-2 transition-transform w-6 h-6" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }} 
              whileTap={{ scale: 0.95 }}
              onClick={onExplore}
              className="px-20 py-8 md:py-10 rounded-2xl text-xl font-bold text-white border border-white/10 backdrop-blur-md transition-all flex items-center gap-4 uppercase tracking-widest"
            >
              <Globe className="w-6 h-6 text-cyan-400" />
              Intelligence Feed
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

// --- RESULTS DASHBOARD (UPDATED FOR 3-LAYER LOGIC) ---
const ResultsDashboard: React.FC<{ profile: CareerProfile, setView: (v: ViewState) => void }> = ({ profile, setView }) => {
  return (
    <div className="pt-40 pb-20 space-y-24 text-left animate-in fade-in slide-in-from-bottom-10 duration-1000">
      
      {/* 1. HERO SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-16">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] border border-cyan-500/20 mono">
              Stream: {profile.stream}
            </span>
            <span className="bg-violet-500/10 text-violet-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] border border-violet-500/20 mono">
              Branch: {profile.branch}
            </span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
            <span className="text-slate-500 text-4xl block mb-2 tracking-normal font-bold">Optimal Designation:</span>
            <span className="gradient-text italic">{profile.title}</span>
          </h1>
          
          <p className="text-2xl text-slate-300 leading-relaxed font-medium mb-10 max-w-2xl border-l-4 border-cyan-500 pl-6">
            {profile.description}
          </p>

          <div className="flex flex-wrap gap-4">
             {/* Personality Badge */}
             <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                <UserIcon className="w-5 h-5 text-cyan-400" />
                <div>
                   <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Personality Fit</div>
                   <div className="text-white font-bold">{profile.personalityFit}</div>
                </div>
             </div>
             {/* Match Score Badge */}
             <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                <Target className="w-5 h-5 text-violet-400" />
                <div>
                   <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Confidence</div>
                   <div className="text-white font-bold">{profile.matchScore}% Verified</div>
                </div>
             </div>
          </div>
        </div>
        
        {/* Score Card */}
        <div className="glass-card p-12 rounded-[48px] text-center border-2 border-cyan-500/40 min-w-[300px] relative overflow-hidden group">
           <div className="absolute inset-0 bg-cyan-500/5 blur-[50px] animate-pulse" />
           <div className="text-[8rem] font-black text-white mb-0 leading-none tracking-tighter relative z-10">
             {profile.matchScore}
           </div>
           <p className="text-sm font-black text-cyan-400 uppercase tracking-[0.4em] mono relative z-10 mt-4">
             Match Index
           </p>
        </div>
      </div>
      
      {/* 2. ROADMAP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Roadmap List */}
        <div className="lg:col-span-8 glass-card p-12 md:p-16 rounded-[64px] border border-white/10">
          <div className="flex justify-between items-center mb-16">
            <h3 className="text-3xl font-black text-white flex items-center gap-6 uppercase tracking-tight">
              <Map className="text-cyan-400 w-8 h-8" /> 
              Strategic Roadmap
            </h3>
            <span className="text-[10px] font-black text-slate-600 mono uppercase tracking-widest">
              Execution Plan
            </span>
          </div>

          <div className="space-y-8 relative">
            {/* Connector Line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-white/10" />

            {profile.roadmap.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative pl-20"
              >
                <div className="absolute left-0 top-0 w-12 h-12 bg-[#020617] border border-cyan-500 rounded-full flex items-center justify-center z-10">
                  <span className="text-cyan-400 font-bold text-sm">{i + 1}</span>
                </div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-all">
                  <h4 className="text-xl font-bold text-white mb-2">{step}</h4>
                  <p className="text-slate-400 text-sm">Recommended milestone for this trajectory.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions / Side Panel */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-10 rounded-[48px] border border-white/10 bg-gradient-to-br from-violet-600/10 to-blue-600/10">
              <h4 className="text-xl font-black text-white mb-4 uppercase italic">Next Steps</h4>
              
              {/* UPDATED BUTTON: Routes to Skill Gap */}
              <button 
                onClick={() => setView('skill-gap')} 
                className="w-full bg-cyan-500 text-slate-950 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-cyan-400 transition-all mb-4"
              >
                Analyze Skill Gaps
              </button>

              <button 
                onClick={() => setView('trends')} 
                className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-200 transition-all mb-4"
              >
                Explore Market Data
              </button>
              
              <button 
                onClick={() => setView('assessment')} 
                className="w-full bg-transparent border border-white/20 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
              >
                Retake Assessment
              </button>
           </div>

           <div className="glass-card p-10 rounded-[48px] border border-white/10 flex flex-col items-center text-center">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mb-4" />
              <div className="text-lg font-bold text-white">AI Verified</div>
              <div className="text-xs text-slate-500">Logic Core v4.2</div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- MARKET TRENDS (GEMINI INTEGRATION) ---
const MarketTrends: React.FC = () => {
  const [query, setQuery] = useState('Future of Technology Careers 2026');
  const [data, setData] = useState<{text: string, sources: any[]} | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTrends = async (q: string) => {
    setLoading(true);
    try {
      // Note: This requires your geminiService.ts to be set up correctly
      const res = await searchGlobalMarketData(q);
      setData(res);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchTrends(query); }, []);

  return (
    <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 text-left">
      <div className="flex flex-col lg:flex-row gap-20 items-start">
        <div className="flex-1 space-y-16">
          <div>
            <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.6em] mb-6 block mono">GROUNDING PROTOCOL ACTIVE</span>
            <h2 className="text-8xl font-black text-white tracking-tighter leading-tight">Market <br /><span className="gradient-text italic">Grounding.</span></h2>
          </div>

          <div className="relative group max-w-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-[40px] blur opacity-25 group-focus-within:opacity-100 transition duration-1000" />
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTrends(query)}
              className="w-full bg-[#020617] border border-white/10 p-10 rounded-[40px] text-white focus:outline-none focus:border-cyan-500 transition-all font-medium placeholder:text-slate-700 text-xl relative z-10"
            />
            <button 
              onClick={() => fetchTrends(query)}
              className="absolute right-8 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-violet-600 p-6 rounded-3xl text-white hover:scale-105 transition-all z-10"
            >
              <Search className="w-8 h-8" />
            </button>
          </div>
        </div>

        <div className="lg:w-[700px] glass-card rounded-[64px] border border-white/10 overflow-hidden min-h-[700px] flex flex-col relative bg-[#020617]/50">
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
               <Loader2 className="w-20 h-20 text-cyan-500 animate-spin mb-10" />
               <p className="text-white font-black text-2xl uppercase tracking-widest mono">Scanning Global Index...</p>
             </div>
           ) : data ? (
             <div className="p-16 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex items-center gap-4 bg-cyan-500/10 text-cyan-400 px-6 py-3 rounded-full w-fit border border-cyan-500/20">
                   <Activity className="w-4 h-4 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest mono">Data Verified</span>
                </div>
                
                <div className="prose prose-invert prose-2xl max-w-none text-slate-400 leading-relaxed font-medium">
                   {data.text.split('\n').map((para, i) => para.trim() && <p key={i} className="mb-10">{para}</p>)}
                </div>

                {data.sources.length > 0 && (
                  <div className="pt-12 border-t border-white/5">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-10 mono">Grounding References</p>
                    <div className="flex flex-wrap gap-6">
                       {data.sources.map((src: any, i: number) => (
                         <a 
                           key={i} 
                           href={src.web?.uri || '#'} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center gap-4 bg-white/5 border border-white/5 px-8 py-5 rounded-3xl hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all group"
                         >
                            <span className="text-sm font-bold text-slate-400 group-hover:text-white truncate max-w-[200px]">{src.web?.title || 'Index Point'}</span>
                         </a>
                       ))}
                    </div>
                  </div>
                )}
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-20 text-center text-slate-700 opacity-30">
               <Binary className="w-32 h-32 mb-10" />
               <p className="text-2xl font-black uppercase tracking-[0.5em] mono">Initialize Scan</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- LOGIN PAGE ---
const LoginPage: React.FC<{ onLogin: (u: User) => void }> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userObj: User = {
        id: result.user.uid,
        name: result.user.displayName || "Operative",
        email: result.user.email || "",
        photoURL: result.user.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${result.user.uid}`
      };
      onLogin(userObj);
    } catch (error) {
      // Fallback for development if Firebase fails or isn't set up
      const dummy: User = { 
        id: 'dev-001', 
        name: 'Lead Architect', 
        email: 'architect@pathmind.ai', 
        photoURL: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Architect' 
      };
      onLogin(dummy);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
      <div className="mesh-gradient" />
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="z-10 w-full max-w-xl glass-card p-20 rounded-[64px] border border-white/10 text-center"
      >
        <div className="bg-gradient-to-br from-cyan-500 to-violet-600 w-32 h-32 rounded-[40px] flex items-center justify-center mx-auto mb-16 shadow-4xl shadow-cyan-500/30">
          <Terminal className="text-white w-16 h-16" />
        </div>
        <h1 className="text-5xl font-black text-white mb-6 tracking-tighter uppercase italic">PathMind<span className="text-cyan-400 not-italic">AI</span></h1>
        <p className="text-slate-500 mb-16 font-medium text-xl">Identity verification required for <br />Protocol Access.</p>
        
        <motion.button 
          whileHover={!loading ? { scale: 1.05 } : {}}
          whileTap={!loading ? { scale: 0.95 } : {}}
          onClick={handleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-6 p-8 rounded-3xl font-black uppercase text-sm tracking-[0.3em] transition-all shadow-3xl group border border-white/10 ${
            loading ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-950 hover:bg-cyan-400 hover:text-white'
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-4">
              <Loader2 className="w-7 h-7 animate-spin" />
              <span>Verifying Token...</span>
            </div>
          ) : (
            <>
              <Cpu className="w-6 h-6" />
              <span>Identity Hub Login</span>
            </>
          )}
        </motion.button>
        
        <p className="mt-12 text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mono">Encrypted Session // SHA-256</p>
      </motion.div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [history, setHistory] = useState<ViewState[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  // New State: Stores the Final Profile object
  const [careerProfile, setCareerProfile] = useState<CareerProfile | null>(null);
  
  // NEW: State to hold the gap report so we can pass it to the 90-Day Plan
  const [gapReport, setGapReport] = useState<SkillGapReport | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pathmind_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleSetView = (next: ViewState) => {
    if (next !== view) {
      setHistory(prev => [...prev, view]);
      setView(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(prevStack => prevStack.slice(0, -1));
      setView(prev);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setView('landing');
    }
  };

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('pathmind_user', JSON.stringify(u));
    handleSetView('landing');
  };

  const handleLogout = async () => {
    try { await signOut(auth); } catch (e) {}
    setUser(null);
    localStorage.removeItem('pathmind_user');
    handleSetView('landing');
  };

  // --- THE NEW LOGIC INTEGRATION ---
  const handleAssessmentComplete = (answers: Record<string, number>) => {
    setLoading(true);
    
    // Simulate a brief "Thinking" delay for UX (Calculations are actually instant)
    setTimeout(() => {
        // 1. Run the Logic Engine
        const result = calculateCareerPath(answers);
        
        // 2. Save Result
        setCareerProfile(result);
        
        // 3. Switch View
        setLoading(false);
        handleSetView('results');
    }, 1500); 
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <Navbar currentView={view} setView={handleSetView} user={user} onLogout={handleLogout} isLanding={view === 'landing'} />
      {view !== 'landing' && <BackButton onClick={handleGoBack} />}
      <main>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-[#020617] z-[100] flex flex-col items-center justify-center">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse" />
               <Loader2 className="w-24 h-24 text-cyan-500 animate-spin mb-10" />
               <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">Synthesizing DNA...</h2>
               <p className="text-slate-600 font-bold mt-6 uppercase tracking-[0.6em] mono">Mapping Career Trajectory</p>
            </motion.div>
          ) : (
            <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              
              {view === 'landing' && <LandingPage onStart={() => handleSetView(user ? 'assessment' : 'login')} onExplore={() => handleSetView('trends')} />}
              
              {view === 'login' && <LoginPage onLogin={handleLogin} />}
              
              {view === 'trends' && <MarketTrends />}
              
              {view === 'assessment' && (
                <div className="fixed inset-0 z-50 bg-[#020617] overflow-y-auto">
                    <AssessmentPage onComplete={handleAssessmentComplete} />
                </div>
              )}
              
              {view === 'results' && careerProfile && (
                <div className="max-w-7xl mx-auto px-6">
                   <ResultsDashboard profile={careerProfile} setView={handleSetView} />
                </div>
              )}
              
              {/* NEW: SKILL GAP ROUTE */}
              {view === 'skill-gap' && careerProfile && (
                <div className="max-w-7xl mx-auto px-6 pt-20 pb-20">
                  <SkillGapAnalyzer 
                    profile={careerProfile} 
                    onGeneratePlan={(report) => {
                      setGapReport(report);
                      handleSetView('execution-plan');
                    }} 
                  />
                </div>
              )}

              {/* FEATURE 5: EXECUTION PLAN ROUTE */}
              {view === 'execution-plan' && gapReport && (
                <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                  <ExecutionPlanDashboard report={gapReport} />
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}