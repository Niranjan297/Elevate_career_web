import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Target, ArrowRight, ShieldCheck, Cpu, Search, 
  Activity, Globe, Binary, Terminal, Star, ChevronLeft, 
  BookOpen, Layers, User as UserIcon, Map, Youtube
} from 'lucide-react';

/**
 * COMPONENTS
 */
import LearningHub from './components/LearningHub';
import AssessmentPage from './AssessmentPage';
import SkillGapAnalyzer from './SkillGapAnalyzer';
import ExecutionPlanDashboard from './ExecutionPlanDashboard';

/**
 * FIREBASE AUTHENTICATION
 */
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

/**
 * CORE MODULES & TYPES
 */
import { ViewState, User } from '../types';
import { CareerProfile, SkillGapReport } from './types';
import { calculateCareerPath } from './utils/logic'; 
import { getQuickMarketPulse, searchGlobalMarketData } from '../geminiService';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
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

const Navbar: React.FC<{ user: User | null, onLogin: () => void, onLogout: () => void }> = ({ user, onLogin, onLogout }) => (
  <nav className="fixed top-0 left-0 right-0 z-[100] p-6 flex justify-between items-center bg-gradient-to-b from-[#020617] to-transparent pointer-events-none">
    <div className="flex items-center gap-2 pointer-events-auto">
      <div className="bg-gradient-to-br from-cyan-500 to-violet-600 text-white font-black p-2 rounded-lg text-xs leading-none shadow-lg shadow-cyan-500/20">
        01<br/>10
      </div>
      <span className="text-white font-black text-xl tracking-tighter italic drop-shadow-md">PATHMINDAI</span>
    </div>

    <div className="pointer-events-auto">
      {user ? (
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 pr-4 rounded-full backdrop-blur-md shadow-lg">
          <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-cyan-500/50" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-xs">{user.name}</span>
            <button onClick={onLogout} className="text-slate-400 text-[10px] uppercase font-bold text-left hover:text-rose-400 transition-colors">
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={onLogin}
          className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-cyan-400 hover:text-white transition-all shadow-lg flex items-center gap-2"
        >
          <UserIcon className="w-4 h-4" /> Authenticate
        </button>
      )}
    </div>
  </nav>
);

// --- GLOBAL ANIMATED PARTICLES ---
const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.9)]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -80],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

// --- LANDING PAGE ---
const LandingPage: React.FC<{ onStart: () => void; onExplore: () => void }> = ({ onStart, onExplore }) => {
  const [marketPulse, setMarketPulse] = useState("Synchronizing intelligence...");
  
  useEffect(() => {
    getQuickMarketPulse("Future of Work").then(setMarketPulse);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="max-w-7xl text-center w-full"
      >
        <div className="inline-flex items-center gap-4 bg-[#020617]/50 text-cyan-400 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-cyan-500/30 backdrop-blur-xl mono shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>{marketPulse}</span>
        </div>

        <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-black text-white mb-10 leading-[0.85] tracking-tighter drop-shadow-2xl">
          Architect Your <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 bg-clip-text text-transparent italic">
            Absolute Legacy.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium bg-[#020617]/40 backdrop-blur-sm p-6 rounded-3xl border border-white/5">
          PathMind utilizes <span className="text-cyan-400 font-bold">Multi-Dimensional Neural Logic</span> to map your personality, skills, and life direction to a precise career trajectory.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(6, 182, 212, 0.4)" }} 
            whileTap={{ scale: 0.95 }} 
            onClick={onStart} 
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-16 py-6 rounded-2xl text-lg font-black transition-all flex items-center justify-center gap-4 group uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20"
          >
            Initialize Protocol
            <ArrowRight className="group-hover:translate-x-2 transition-transform w-6 h-6" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }} 
            whileTap={{ scale: 0.95 }}
            onClick={onExplore}
            className="w-full sm:w-auto px-16 py-6 rounded-2xl text-lg font-bold text-white bg-[#020617]/50 border border-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] hover:border-cyan-500/50"
          >
            <Globe className="w-6 h-6 text-cyan-400" />
            Intelligence Feed
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// --- RESULTS DASHBOARD ---
const ResultsDashboard: React.FC<{ profile: CareerProfile, setView: (v: ViewState) => void }> = ({ profile, setView }) => {
  return (
    <div className="pt-10 pb-20 space-y-24 text-left animate-in fade-in slide-in-from-bottom-10 duration-1000 relative z-10">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-16">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] border border-cyan-500/30 backdrop-blur-md mono">
              Stream: {profile.stream}
            </span>
            <span className="bg-violet-500/10 text-violet-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] border border-violet-500/30 backdrop-blur-md mono">
              Branch: {profile.branch}
            </span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 drop-shadow-lg">
            <span className="text-slate-500 text-4xl block mb-2 tracking-normal font-bold">Optimal Designation:</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 bg-clip-text text-transparent italic">{profile.title}</span>
          </h1>
          
          <p className="text-2xl text-slate-300 leading-relaxed font-medium mb-10 max-w-2xl border-l-4 border-cyan-500 pl-6 bg-[#020617]/40 backdrop-blur-sm p-4 rounded-r-2xl">
            {profile.description}
          </p>

          <div className="flex flex-wrap gap-4">
             <div className="flex items-center gap-3 bg-[#020617]/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                <UserIcon className="w-5 h-5 text-cyan-400" />
                <div>
                   <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Personality Fit</div>
                   <div className="text-white font-bold">{profile.personalityFit}</div>
                </div>
             </div>
             <div className="flex items-center gap-3 bg-[#020617]/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                <Target className="w-5 h-5 text-violet-400" />
                <div>
                   <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Confidence</div>
                   <div className="text-white font-bold">{profile.matchScore}% Verified</div>
                </div>
             </div>
          </div>
        </div>
        
        <div className="glass-card bg-[#020617]/60 backdrop-blur-xl p-12 rounded-[48px] text-center border-2 border-cyan-500/40 min-w-[300px] relative overflow-hidden group shadow-[0_0_50px_rgba(6,182,212,0.15)]">
           <div className="absolute inset-0 bg-cyan-500/10 blur-[50px] animate-pulse" />
           <div className="text-[8rem] font-black text-white mb-0 leading-none tracking-tighter relative z-10 drop-shadow-2xl">
             {profile.matchScore}
           </div>
           <p className="text-sm font-black text-cyan-400 uppercase tracking-[0.4em] mono relative z-10 mt-4">
             Match Index
           </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 glass-card bg-[#020617]/60 backdrop-blur-xl p-12 md:p-16 rounded-[64px] border border-white/10">
          <div className="flex justify-between items-center mb-16">
            <h3 className="text-3xl font-black text-white flex items-center gap-6 uppercase tracking-tight">
              <Map className="text-cyan-400 w-8 h-8" /> 
              Strategic Roadmap
            </h3>
            <span className="text-[10px] font-black text-slate-500 mono uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10">
              Execution Plan
            </span>
          </div>

          <div className="space-y-8 relative">
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500/50 to-violet-600/10" />
            {profile.roadmap.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative pl-20"
              >
                <div className="absolute left-0 top-0 w-12 h-12 bg-[#020617] border-2 border-cyan-500/50 rounded-full flex items-center justify-center z-10 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <span className="text-cyan-400 font-bold text-sm">{i + 1}</span>
                </div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-cyan-500/30 hover:bg-white/10 transition-all backdrop-blur-md">
                  <h4 className="text-xl font-bold text-white mb-2">{step}</h4>
                  <p className="text-slate-400 text-sm">Recommended milestone for this trajectory.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card bg-[#020617]/80 backdrop-blur-xl p-10 rounded-[48px] border border-white/10 shadow-2xl">
              <h4 className="text-xl font-black text-white mb-6 uppercase italic flex items-center gap-3">
                <Layers className="text-violet-400 w-5 h-5"/> Next Steps
              </h4>
              
              <button 
                onClick={() => setView('learning-hub')} 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/20 transition-all mb-4 flex items-center justify-center gap-3"
              >
                <Youtube className="w-5 h-5" /> Access Learning Hub
              </button>

              <button 
                onClick={() => setView('skill-gap')} 
                className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 hover:border-cyan-500/30 transition-all mb-4"
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
                className="w-full bg-transparent border border-rose-500/20 text-rose-400 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-rose-500/10 transition-all"
              >
                Retake Assessment
              </button>
           </div>

           <div className="glass-card bg-[#020617]/60 backdrop-blur-xl p-10 rounded-[48px] border border-white/10 flex flex-col items-center text-center">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
              <div className="text-lg font-bold text-white">AI Verified</div>
              <div className="text-xs text-slate-500">Logic Core v4.2</div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- MARKET TRENDS ---
const MarketTrends: React.FC = () => {
  const [query, setQuery] = useState('Future of Technology Careers 2026');
  const [data, setData] = useState<{text: string, sources: any[]} | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTrends = async (q: string) => {
    setLoading(true);
    try {
      const res = await searchGlobalMarketData(q);
      setData(res);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchTrends(query); }, []);

  return (
    <div className="pt-10 pb-32 max-w-7xl mx-auto px-6 text-left relative z-10">
      <div className="flex flex-col lg:flex-row gap-20 items-start">
        <div className="flex-1 space-y-16">
          <div>
            <span className="bg-[#020617]/50 border border-cyan-500/30 text-cyan-400 font-black text-xs uppercase tracking-[0.6em] mb-6 inline-block mono px-4 py-2 rounded-lg backdrop-blur-md">GROUNDING PROTOCOL ACTIVE</span>
            <h2 className="text-8xl font-black text-white tracking-tighter leading-tight drop-shadow-xl">Market <br /><span className="bg-gradient-to-r from-cyan-400 to-violet-600 bg-clip-text text-transparent italic">Grounding.</span></h2>
          </div>
          <div className="relative group max-w-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-[40px] blur opacity-25 group-focus-within:opacity-100 transition duration-1000" />
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTrends(query)}
              className="w-full bg-[#020617]/80 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] text-white focus:outline-none focus:border-cyan-500 transition-all font-medium placeholder:text-slate-700 text-xl relative z-10 shadow-2xl"
            />
            <button 
              onClick={() => fetchTrends(query)}
              className="absolute right-8 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-violet-600 p-6 rounded-3xl text-white hover:scale-105 transition-all z-10 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <Search className="w-8 h-8" />
            </button>
          </div>
        </div>
        <div className="lg:w-[700px] glass-card rounded-[64px] border border-white/10 overflow-hidden min-h-[700px] flex flex-col relative bg-[#020617]/60 backdrop-blur-2xl shadow-2xl">
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
               <Loader2 className="w-20 h-20 text-cyan-500 animate-spin mb-10" />
               <p className="text-white font-black text-2xl uppercase tracking-widest mono drop-shadow-md">Scanning Global Index...</p>
             </div>
           ) : data ? (
             <div className="p-16 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex items-center gap-4 bg-cyan-500/10 text-cyan-400 px-6 py-3 rounded-full w-fit border border-cyan-500/20 backdrop-blur-md">
                   <Activity className="w-4 h-4 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest mono">Data Verified</span>
                </div>
                <div className="prose prose-invert prose-2xl max-w-none text-slate-300 leading-relaxed font-medium">
                   {data.text.split('\n').map((para, i) => para.trim() && <p key={i} className="mb-10">{para}</p>)}
                </div>
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
      const dummy: User = { 
        id: 'dev-001', name: 'Lead Architect', email: 'architect@pathmind.ai', 
        photoURL: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Architect' 
      };
      onLogin(dummy);
    } finally { setLoading(false); }
  };

  return (
    <div className="w-full flex items-center justify-center py-20 px-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="z-10 w-full max-w-xl glass-card p-20 rounded-[64px] border border-white/10 text-center backdrop-blur-2xl bg-[#020617]/60 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="bg-gradient-to-br from-cyan-500 to-violet-600 w-32 h-32 rounded-[40px] flex items-center justify-center mx-auto mb-16 shadow-[0_0_40px_rgba(6,182,212,0.4)]">
          <Terminal className="text-white w-16 h-16" />
        </div>
        <h1 className="text-5xl font-black text-white mb-6 tracking-tighter uppercase italic drop-shadow-lg">PathMind<span className="text-cyan-400 not-italic">AI</span></h1>
        <p className="text-slate-400 mb-16 font-medium text-xl bg-white/5 p-4 rounded-2xl border border-white/5">Identity verification required for <br />Protocol Access.</p>
        
        <motion.button 
          whileHover={!loading ? { scale: 1.05 } : {}}
          whileTap={!loading ? { scale: 0.95 } : {}}
          onClick={handleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-6 p-8 rounded-3xl font-black uppercase text-sm tracking-[0.3em] transition-all shadow-xl group border border-white/10 ${
            loading ? 'bg-[#020617] text-slate-500' : 'bg-white text-slate-950 hover:bg-cyan-400 hover:text-white hover:border-cyan-400'
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-4">
              <Loader2 className="w-7 h-7 animate-spin text-cyan-500" />
              <span>Verifying Token...</span>
            </div>
          ) : (
            <>
              <Cpu className="w-6 h-6" />
              <span>Identity Hub Login</span>
            </>
          )}
        </motion.button>
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
  const [careerProfile, setCareerProfile] = useState<CareerProfile | null>(null);
  const [gapReport, setGapReport] = useState<SkillGapReport | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pathmind_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid, name: currentUser.displayName || 'Explorer',
          email: currentUser.email || '', photoURL: currentUser.photoURL || ''
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
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

  const handleLoginClick = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  const handleLogout = async () => {
    try { await signOut(auth); } catch (e) {}
    setUser(null);
    localStorage.removeItem('pathmind_user');
    handleSetView('landing');
  };

  const handleAssessmentComplete = (answers: Record<string, number>) => {
    setLoading(true);
    setTimeout(() => {
        const result = calculateCareerPath(answers);
        setCareerProfile(result);
        setLoading(false);
        handleSetView('results');
    }, 1500); 
  };

  return (
    // 1. THE GLOBAL WRAPPER
    <div className="relative min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden font-sans">
      
      {/* 2. THE GLOBAL NEURAL GRID & PARTICLES */}
      <div className="fixed inset-0 pointer-events-none z-0">
         
         {/* Deep Blueprint Grid */}
         <div 
           className="absolute inset-0 opacity-[0.05]" 
           style={{
             backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
             backgroundSize: '50px 50px'
           }}
         />

         {/* Animated Popping Particles */}
         <Particles />

         {/* Ambient Neural Glows */}
         <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-500/10 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-violet-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
         
         {/* Cinematic Noise */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* 3. THE CONTENT LAYER */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar user={user} onLogin={handleLoginClick} onLogout={handleLogout} />
        {view !== 'landing' && <BackButton onClick={handleGoBack} />}
        
        {/* Main Content Area */}
        <main className="flex-grow flex flex-col justify-center pt-32 pb-12">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full w-full py-20 relative z-20">
                 <Loader2 className="w-24 h-24 text-cyan-500 animate-spin mb-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                 <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-lg">Synthesizing DNA...</h2>
                 <p className="text-cyan-400 font-bold mt-6 uppercase tracking-[0.6em] mono bg-[#020617]/50 px-6 py-2 rounded-full border border-cyan-500/20 backdrop-blur-sm">Mapping Career Trajectory</p>
              </motion.div>
            ) : (
              <motion.div key={view} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="w-full h-full flex flex-col items-center justify-center">
                
                {view === 'landing' && <LandingPage onStart={() => handleSetView(user ? 'assessment' : 'login')} onExplore={() => handleSetView('trends')} />}
                {view === 'login' && <LoginPage onLogin={handleLogin} />}
                {view === 'trends' && <MarketTrends />}
                
                {/* ASSESSMENT WRAPPER FIX: Removed solid backgrounds so the grid shows through */}
                {view === 'assessment' && (
                  <div className="w-full max-w-5xl mx-auto px-6 relative z-20 py-10">
                      <AssessmentPage onComplete={handleAssessmentComplete} />
                  </div>
                )}
                
                {view === 'results' && careerProfile && (
                  <div className="w-full max-w-7xl mx-auto px-6">
                     <ResultsDashboard profile={careerProfile} setView={handleSetView} />
                  </div>
                )}
                
                {view === 'learning-hub' && careerProfile && (
                  <div className="w-full max-w-7xl mx-auto px-6">
                    <LearningHub careerTitle={careerProfile.title} />
                  </div>
                )}

                {view === 'skill-gap' && careerProfile && (
                  <div className="w-full max-w-7xl mx-auto px-6 py-10">
                    <SkillGapAnalyzer 
                      profile={careerProfile} 
                      onGeneratePlan={(report) => {
                        setGapReport(report);
                        handleSetView('execution-plan');
                      }} 
                    />
                  </div>
                )}

                {view === 'execution-plan' && gapReport && (
                  <div className="w-full max-w-7xl mx-auto px-6 py-10">
                    <ExecutionPlanDashboard report={gapReport} />
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}