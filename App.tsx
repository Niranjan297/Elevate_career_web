
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Loader2, Target, ArrowRight, ShieldCheck, Zap, Cpu, Search, 
  Workflow, TrendingUp, ExternalLink, Activity, Layout, Globe, UserCheck, Code,
  Binary, Terminal, Layers, Star, ArrowLeft, ChevronLeft, Map, BookOpen, Clock
} from 'lucide-react';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ViewState, AssessmentScores, CareerMatch, SkillEntry, SkillLevel, User, RoadmapStep } from './types';
import { INTEREST_QUESTIONS, APTITUDE_QUESTIONS, CAREER_PROFILES } from './constants';
import { getCareerRecommendations, getQuickMarketPulse, searchGlobalMarketData } from './geminiService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

// --- Firebase Initialization ---
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

// --- Components ---

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="fixed top-28 left-10 z-[60] flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-slate-400 hover:text-cyan-400 transition-all group"
  >
    <div className="p-1 bg-white/5 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
      <ChevronLeft className="w-4 h-4" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.3em] mono">Return // Previous</span>
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
      className={`fixed top-0 w-full z-50 px-10 py-6 flex justify-between items-center transition-all duration-500 ease-in-out ${
        isTransparent 
          ? 'bg-transparent border-transparent' 
          : 'bg-[#020617]/80 backdrop-blur-3xl border-b border-white/5 shadow-2xl'
      }`}
    >
      <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('landing')}>
        <div className="bg-gradient-to-br from-cyan-500 to-violet-600 p-2.5 rounded-xl group-hover:rotate-12 transition-all shadow-lg shadow-cyan-500/20">
          <Binary className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">PathMind<span className="text-cyan-400 not-italic">AI</span></span>
      </div>
      
      <div className="hidden lg:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
        <button onClick={() => setView('landing')} className={`hover:text-cyan-400 transition-colors ${currentView === 'landing' ? 'text-cyan-400' : ''}`}>Protocol</button>
        <button onClick={() => setView('assessment')} className={`hover:text-cyan-400 transition-colors ${currentView === 'assessment' ? 'text-cyan-400' : ''}`}>Neural Sync</button>
        <button onClick={() => setView('trends')} className={`hover:text-cyan-400 transition-colors ${currentView === 'trends' ? 'text-cyan-400' : ''}`}>Grounding</button>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4 bg-white/5 pl-6 pr-2 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Operative</p>
              <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
            </div>
            <button onClick={onLogout} title="Sign Out">
              <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-xl border-2 border-cyan-500/30 hover:scale-105 transition-transform" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setView('login')}
            className="bg-white text-slate-950 px-10 py-4 rounded-xl text-xs font-black hover:bg-cyan-400 hover:text-white transition-all flex items-center gap-3 shadow-2xl active:scale-95 uppercase tracking-widest"
          >
            Authenticate
          </button>
        )}
      </div>
    </motion.nav>
  );
};

const LandingPage: React.FC<{ onStart: () => void; onExplore: () => void }> = ({ onStart, onExplore }) => {
  const [marketPulse, setMarketPulse] = useState("Synchronizing talent indices...");
  
  useEffect(() => {
    getQuickMarketPulse("AI Architecture").then(setMarketPulse);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020617]">
      <div className="mesh-gradient" />
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        <div className="video-docker opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/0 via-[#020617]/50 to-[#020617] z-[1]" />
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-data-center-server-room-with-blue-lights-22878-large.mp4" type="video/mp4" />
          </video>
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

          <h1 className="text-7xl md:text-[10rem] font-black text-white mb-10 leading-[0.8] tracking-tighter">
            Architect Your <br />
            <span className="gradient-text italic">Neural Legacy.</span>
          </h1>

          <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto mb-20 leading-relaxed font-medium">
            PathMind AI leverages <span className="text-white">Google Gemini 3 Neural Reasoning</span> to map your cognitive DNA to global market demand with pinpoint precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 80px rgba(6, 182, 212, 0.4)" }} 
              whileTap={{ scale: 0.95 }} 
              onClick={onStart} 
              className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white px-20 py-10 rounded-2xl text-xl font-black transition-all flex items-center gap-5 group shadow-3xl shadow-cyan-500/10 uppercase tracking-widest"
            >
              Initialize Sync
              <ArrowRight className="group-hover:translate-x-2 transition-transform w-6 h-6" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }} 
              whileTap={{ scale: 0.95 }}
              onClick={onExplore}
              className="px-20 py-10 rounded-2xl text-xl font-bold text-white border border-white/10 backdrop-blur-md transition-all flex items-center gap-4 uppercase tracking-widest"
            >
              <Globe className="w-6 h-6 text-cyan-400" />
              Intelligence Access
            </motion.button>
          </div>
        </motion.div>

        {/* DASHBOARD PREVIEW MOCKUP */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative mt-32 z-10 w-full max-w-6xl p-4 glass-card rounded-[40px] border border-white/10 overflow-hidden"
        >
           <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-white/5">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/50" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                 <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mono">PathMind_v4.2.0 // Neural_Dashboard</div>
              <div className="w-6 h-6 rounded-lg bg-white/5" />
           </div>
           <div className="grid grid-cols-12 gap-6 p-10 bg-[#020617]/80">
              <div className="col-span-8 space-y-6">
                 <div className="h-48 bg-white/5 rounded-3xl border border-white/5 p-8 flex flex-col justify-end">
                    <div className="text-4xl font-black text-white mb-2">98.4% Affinity</div>
                    <div className="text-xs text-cyan-400 font-bold uppercase tracking-widest mono">System Status: Optimal Grounding</div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="h-40 bg-white/5 rounded-3xl border border-white/5" />
                    <div className="h-40 bg-white/5 rounded-3xl border border-white/5" />
                 </div>
              </div>
              <div className="col-span-4 bg-white/5 rounded-3xl border border-white/5 p-8">
                 <div className="w-full aspect-square bg-cyan-500/5 rounded-full border border-cyan-500/20 flex items-center justify-center relative">
                    <div className="absolute inset-4 border border-violet-500/20 rounded-full animate-spin-slow" />
                    <Cpu className="w-16 h-16 text-cyan-500/50" />
                 </div>
              </div>
           </div>
        </motion.div>
      </section>

      {/* ARCHITECTURE SECTION */}
      <section className="py-60 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
           <div>
              <span className="text-cyan-400 font-black text-[12px] uppercase tracking-[0.5em] mb-8 block mono">HYBRID ARCHITECTURE</span>
              <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.9] mb-12">How AI Analyzes Your <span className="gradient-text italic">Absolute Potential.</span></h2>
              <p className="text-xl text-slate-400 leading-relaxed font-medium mb-16">
                Most career tools use static quizzes. PathMind AI deploys a three-layer neural synthesis engine.
              </p>
              
              <div className="space-y-12">
                 {[
                   { icon: UserCheck, title: 'Psychometric DNA', desc: 'We extract 24 vector points from your cognitive and interest responses.' },
                   { icon: Workflow, title: 'Gemini Reasoning', desc: 'Google Gemini 3 Pro processes your assets against 4.2M professional roadmaps.' },
                   { icon: ShieldCheck, title: 'Market Grounding', desc: 'Live Search Grounding validates salary caps and vacancy velocity in real-time.' }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-8 group">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-cyan-500 transition-colors">
                         <item.icon className="w-8 h-8 text-cyan-400 group-hover:text-white" />
                      </div>
                      <div>
                         <h4 className="text-2xl font-black text-white mb-3">{item.title}</h4>
                         <p className="text-slate-500 text-lg">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="relative">
              <div className="absolute -inset-10 bg-cyan-500/10 blur-[100px] rounded-full" />
              <div className="relative glass-card rounded-[64px] p-2 aspect-square overflow-hidden group">
                 <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover rounded-[60px] opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />
                 <div className="absolute bottom-16 left-16 right-16">
                    <div className="text-xs font-black text-cyan-400 uppercase tracking-[0.4em] mb-4 mono">Deployment Unit</div>
                    <div className="text-4xl font-black text-white leading-tight">Neural Sync Interface <br />Active v10.8</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* DASHBOARD GRID */}
      <section className="py-60 bg-white/[0.01] border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-32">
               <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-10">Absolute <span className="text-cyan-400 italic">Clarity.</span></h2>
               <p className="text-2xl text-slate-500 font-medium max-w-3xl mx-auto">Access the dashboard that redefined talent engineering for the next generation of founders and engineers.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: 'Neural Roadmaps', val: '4-Step Strategic Deployment', icon: Layout },
                 { title: 'Live Salary Grounding', val: 'Indexed by Region & Seniority', icon: TrendingUp },
                 { title: 'Skill Asset Inventory', val: 'Proprietary Gap Identification', icon: Layers }
               ].map((card, i) => (
                 <div key={i} className="glass-card p-12 rounded-[48px] border border-white/5 hover:border-cyan-500/30 transition-all group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-cyan-500 transition-all">
                       <card.icon className="w-8 h-8 text-cyan-400 group-hover:text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">{card.title}</h3>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mono">{card.val}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-60 text-center px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyan-500/5 blur-[150px] rounded-full" />
        <div className="relative z-10">
          <h2 className="text-8xl font-black text-white tracking-tighter mb-16 leading-[0.85]">Become the <br /><span className="gradient-text italic">Exception.</span></h2>
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }} 
            onClick={onStart}
            className="bg-white text-slate-950 px-24 py-12 rounded-3xl text-2xl font-black hover:bg-cyan-400 hover:text-white transition-all shadow-4xl uppercase tracking-widest"
          >
            Deploy Protocol
          </motion.button>
          <p className="mt-12 text-[10px] text-slate-600 font-black uppercase tracking-[0.6em] mono">Powered by PathMind Engine & Google Gemini</p>
        </div>
      </section>

      <footer className="py-20 text-center border-t border-white/5 opacity-50">
        <div className="flex justify-center items-center gap-4 mb-8">
          <Binary className="text-cyan-500 w-6 h-6" />
          <span className="text-2xl font-black text-white tracking-tighter uppercase italic">PathMind<span className="text-cyan-400 not-italic">AI</span></span>
        </div>
        <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.3em] mono mb-4">The Standard in Neural Career Engineering</p>
        <p className="text-slate-800 text-[8px] font-bold uppercase tracking-[0.2em] mono">© 2025 PathMind Systems Gmbh. No unauthorized access permitted.</p>
      </footer>
    </div>
  );
};

const MarketTrends: React.FC = () => {
  const [query, setQuery] = useState('Global AI Engineering talent velocity 2025');
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
    <div className="pt-48 pb-32 max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-20 items-start">
        <div className="flex-1 space-y-16">
          <div>
            <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.6em] mb-6 block mono">GROUNDING PROTOCOL ACTIVE</span>
            <h2 className="text-8xl font-black text-white tracking-tighter leading-tight">Talent <br /><span className="gradient-text italic">Grounding.</span></h2>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             {[
               { label: 'Grounding Sources', val: 'Global Web', icon: Globe },
               { label: 'Latency Pulse', val: '142ms', icon: Activity },
               { label: 'Reasoning Engine', val: 'Gemini 3', icon: Cpu },
               { label: 'Index Depth', val: 'Full', icon: Binary },
             ].map((m, i) => (
               <div key={i} className="glass-card p-8 rounded-[40px] flex items-center gap-8 border border-white/5">
                 <div className="bg-cyan-500/10 p-5 rounded-2xl"><m.icon className="w-7 h-7 text-cyan-500" /></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mono">{m.label}</p>
                    <p className="text-xl font-black text-white tracking-tight">{m.val}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="lg:w-[700px] glass-card rounded-[64px] border border-white/10 overflow-hidden min-h-[700px] flex flex-col relative bg-[#020617]/50">
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
               <Loader2 className="w-20 h-20 text-cyan-500 animate-spin mb-10" />
               <p className="text-white font-black text-2xl uppercase tracking-widest mono">Extracting Insights...</p>
             </div>
           ) : data ? (
             <div className="p-16 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex items-center gap-4 bg-cyan-500/10 text-cyan-400 px-6 py-3 rounded-full w-fit border border-cyan-500/20">
                   <Activity className="w-4 h-4 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest mono">Neural Verification Successful</span>
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
                            <span className="text-sm font-bold text-slate-400 group-hover:text-white truncate max-w-[200px]">{src.web?.title || 'External Index'}</span>
                            <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
                         </a>
                       ))}
                    </div>
                  </div>
                )}
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-20 text-center text-slate-700 opacity-30">
               <Binary className="w-32 h-32 mb-10" />
               <p className="text-2xl font-black uppercase tracking-[0.5em] mono">Awaiting Parameter Input</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const RoadmapView: React.FC<{ match: CareerMatch }> = ({ match }) => (
  <div className="pt-48 pb-32 max-w-6xl mx-auto px-6">
    <div className="mb-20">
      <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.6em] mb-6 block mono">STRATEGIC DEPLOYMENT PLAN</span>
      <h2 className="text-7xl font-black text-white tracking-tighter mb-8">{match.career} <br /><span className="gradient-text italic">Roadmap.</span></h2>
      <p className="text-2xl text-slate-400 font-medium max-w-3xl leading-relaxed">{match.description}</p>
    </div>

    <div className="relative">
      <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-white/5" />
      <div className="space-y-20">
        {match.roadmap.map((step, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="relative pl-32"
          >
            <div className="absolute left-0 top-0 w-20 h-20 glass-card rounded-2xl flex items-center justify-center border-2 border-cyan-500/30">
              <span className="text-2xl font-black text-cyan-400 mono">0{i + 1}</span>
            </div>
            <div className="glass-card p-12 rounded-[48px] border border-white/5 hover:border-cyan-500/20 transition-all">
              <div className="flex flex-col lg:flex-row justify-between gap-12">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4 text-xs font-black text-slate-600 uppercase tracking-widest mono">
                    <Clock className="w-4 h-4" />
                    Phase: {step.phase}
                  </div>
                  <h3 className="text-4xl font-black text-white">{step.title}</h3>
                  <p className="text-xl text-slate-400 leading-relaxed font-medium">{step.description}</p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    {step.skills.map((skill, idx) => (
                      <span key={idx} className="bg-cyan-500/10 text-cyan-400 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-cyan-500/20 mono">{skill}</span>
                    ))}
                  </div>
                </div>
                {step.imageUrl && (
                  <div className="lg:w-1/3 aspect-video rounded-3xl overflow-hidden border border-white/10 shrink-0">
                    <img src={step.imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <div className="mt-40 glass-card p-20 rounded-[64px] border border-white/10 text-center">
       <h3 className="text-4xl font-black text-white mb-10 flex items-center justify-center gap-6"><BookOpen className="text-cyan-400 w-10 h-10" /> Verified Resources</h3>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {match.resources.map((res, i) => (
            <a key={i} href={res.url} target="_blank" className="p-10 bg-white/5 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-all group">
               <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 mono">{res.type}</div>
               <h4 className="text-xl font-black text-white mb-6 group-hover:text-cyan-400 transition-colors">{res.name}</h4>
               <ExternalLink className="w-5 h-5 text-slate-700" />
            </a>
          ))}
       </div>
    </div>
  </div>
);

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
        <p className="text-slate-500 mb-16 font-medium text-xl">Identity verification required to initialize <br />Neural Sync Protocols.</p>
        
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
              <img src="https://www.google.com/favicon.ico" className="w-6 h-6 group-hover:scale-110 group-hover:brightness-110 transition-transform" />
              <span>Access Identity Hub</span>
            </>
          )}
        </motion.button>
        
        <p className="mt-12 text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mono">Secure Encryption: SHA-256 via Firebase</p>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [history, setHistory] = useState<ViewState[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<CareerMatch | null>(null);
  const [assessmentScores, setAssessmentScores] = useState<AssessmentScores | null>(null);

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

  const processResults = async (scores: AssessmentScores) => {
    setLoading(true);
    setAssessmentScores(scores);
    
    let topCareer = CAREER_PROFILES[0];
    let maxScore = -1;
    CAREER_PROFILES.forEach(profile => {
      let currentScore = 0;
      Object.entries(profile.weights).forEach(([cat, weight]) => {
        const val = (scores.interests[cat] || scores.aptitude[cat] || 0);
        currentScore += val * (weight as number);
      });
      if (currentScore > maxScore) { maxScore = currentScore; topCareer = profile; }
    });

    const aiData = await getCareerRecommendations(scores, topCareer.name);
    setMatchResult({
      career: topCareer.name,
      score: Math.min(Math.round((maxScore / 4) * 100), 100),
      description: aiData.description || "",
      strengths: aiData.strengths || [],
      gaps: aiData.gaps || [],
      roadmap: aiData.roadmap || [],
      resources: aiData.resources || []
    });
    setLoading(false);
    handleSetView('results');
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
               <p className="text-slate-600 font-bold mt-6 uppercase tracking-[0.6em] mono">Accessing Global Vacancy Feed v9.2</p>
            </motion.div>
          ) : (
            <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {view === 'landing' && <LandingPage onStart={() => handleSetView(user ? 'assessment' : 'login')} onExplore={() => handleSetView('trends')} />}
              {view === 'login' && <LoginPage onLogin={handleLogin} />}
              {view === 'trends' && <MarketTrends />}
              {view === 'assessment' && (
                <div className="pt-48 pb-32 max-w-4xl mx-auto px-6">
                   <div className="glass-card rounded-[64px] p-20 shadow-4xl border border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 text-[10px] font-black text-slate-700 uppercase tracking-widest mono">Protocol_Sync_Interface</div>
                      <AssessmentPageWrapper onComplete={processResults} />
                   </div>
                </div>
              )}
              {view === 'results' && matchResult && assessmentScores && (
                <div className="pt-48 pb-32 max-w-7xl mx-auto px-6">
                   <ResultsDashboard match={matchResult} scores={assessmentScores} setView={handleSetView} />
                </div>
              )}
              {view === 'roadmap' && matchResult && (
                <RoadmapView match={matchResult} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const AssessmentPageWrapper: React.FC<{ onComplete: (s: AssessmentScores) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<Record<string, number>>({});
  const [aptitude, setAptitude] = useState<Record<string, number>>({});
  const [skills, setSkills] = useState<SkillEntry[]>([
    { name: 'Python Engineering', level: 'Beginner' },
    { name: 'Neural Logic', level: 'Beginner' },
    { name: 'Strategic Analysis', level: 'Beginner' }
  ]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete({ interests, aptitude, skills });
  };

  return (
    <div className="space-y-16">
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div animate={{ width: `${(step/3)*100}%` }} className="h-full bg-gradient-to-r from-cyan-500 to-violet-600 shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
      </div>
      
      {step === 1 && (
        <div className="space-y-12">
           <div>
              <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.4em] mb-4 block mono">PHASE 01 // COGNITIVE DNA</span>
              <h3 className="text-4xl font-black mb-2 text-white">Passion Vectors</h3>
           </div>
           {INTEREST_QUESTIONS.slice(0, 4).map(q => (
             <div key={q.id}>
                <p className="text-xl font-bold mb-6 text-slate-300">{q.text}</p>
                <div className="flex gap-5">
                   {[1,2,3,4,5].map(v => (
                     <button 
                       key={v} 
                       onClick={() => setInterests(p => ({...p, [q.category]: v}))} 
                       className={`w-16 h-16 rounded-2xl border-2 transition-all font-black text-xl flex items-center justify-center ${
                         interests[q.category] === v 
                           ? 'bg-cyan-500 border-cyan-400 text-white shadow-xl glow-cyan scale-110' 
                           : 'bg-white/5 border-white/5 text-slate-600 hover:border-white/20'
                       }`}
                     >
                       {v}
                     </button>
                   ))}
                </div>
             </div>
           ))}
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-12">
          <div>
            <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.4em] mb-4 block mono">PHASE 02 // LOGIC SYNTHESIS</span>
            <h3 className="text-4xl font-black mb-2 text-white">Neural Verification</h3>
          </div>
          {APTITUDE_QUESTIONS.slice(0, 3).map(q => (
             <div key={q.id}>
                <p className="text-xl font-bold mb-6 text-slate-300">{q.text}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                   {q.options?.map(opt => (
                     <button 
                       key={opt.label} 
                       onClick={() => setAptitude(p => ({...p, [q.category]: opt.value}))} 
                       className={`w-full text-left p-8 rounded-3xl border-2 transition-all font-bold text-lg ${
                         aptitude[q.category] === opt.value 
                           ? 'bg-gradient-to-br from-cyan-500 to-violet-600 border-cyan-400 text-white shadow-2xl' 
                           : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-400'
                       }`}
                     >
                       {opt.label}
                     </button>
                   ))}
                </div>
             </div>
          ))}
        </div>
      )}
      
      {step === 3 && (
        <div className="space-y-12">
           <div>
              <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.4em] mb-4 block mono">PHASE 03 // ASSET DEPLOYMENT</span>
              <h3 className="text-4xl font-black mb-2 text-white">Inventory Scan</h3>
           </div>
           <div className="grid gap-8">
             {skills.map((s, i) => (
               <div key={i} className="flex flex-col gap-6 p-10 glass-card rounded-[40px] border border-white/10">
                  <span className="font-black text-2xl text-white">{s.name}</span>
                  <div className="flex gap-4">
                     {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map(l => (
                       <button 
                         key={l} 
                         onClick={() => {const n=[...skills]; n[i].level=l; setSkills(n)}} 
                         className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border-2 transition-all mono ${
                           s.level === l 
                             ? 'bg-white text-slate-950 border-white' 
                             : 'bg-white/5 border-white/5 text-slate-600'
                         }`}
                       >
                         {l}
                       </button>
                     ))}
                  </div>
               </div>
             ))}
           </div>
        </div>
      )}
      
      <div className="pt-16 flex gap-6">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="flex-1 bg-white/5 py-8 rounded-3xl font-black text-slate-500 hover:bg-white/10 transition-all uppercase tracking-widest text-xs mono">Recall Protocol</button>
        )}
        <button onClick={handleNext} className="flex-[2] bg-gradient-to-r from-cyan-500 to-violet-600 py-8 rounded-3xl font-black text-white hover:scale-[1.02] active:scale-95 shadow-4xl transition-all uppercase tracking-widest text-xs mono">
          {step === 3 ? "Finalize Sync" : "Deploy Phase"}
        </button>
      </div>
    </div>
  );
};

const ResultsDashboard: React.FC<{ match: CareerMatch, scores: AssessmentScores, setView: (v: ViewState) => void }> = ({ match, scores, setView }) => {
  const radarData = Object.entries(scores.interests).map(([subject, A]) => ({ subject, A }));
  return (
    <div className="space-y-24">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-16">
        <div className="max-w-4xl">
          <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.6em] mb-6 block mono">NEURAL SYNTHESIS COMPLETE // V4.2</span>
          <h1 className="text-8xl font-black text-white leading-[0.85] tracking-tighter mb-12">Match Detected: <br /><span className="gradient-text italic">{match.career}</span></h1>
          <p className="text-2xl text-slate-400 leading-relaxed font-medium mb-12">{match.description}</p>
          <div className="flex gap-6">
            <button onClick={() => setView('roadmap')} className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white px-16 py-8 rounded-3xl font-black hover:scale-105 transition-all shadow-4xl flex items-center gap-5 uppercase tracking-widest text-xs mono">
              Launch Roadmap <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => setView('assessment')} className="bg-white/5 text-white border border-white/10 px-16 py-8 rounded-3xl font-black hover:bg-white/10 transition-all uppercase tracking-widest text-xs mono">
              Recalibrate DNA
            </button>
          </div>
        </div>
        <div className="glass-card p-16 rounded-[64px] text-center border-2 border-cyan-500/40 min-w-[350px] relative overflow-hidden group">
           <div className="absolute inset-0 bg-cyan-500/5 blur-[50px] animate-pulse" />
           <div className="text-[12rem] font-black text-white mb-2 leading-none tracking-tighter relative z-10">{match.score}<span className="text-cyan-500 text-6xl">%</span></div>
           <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em] mono relative z-10">Neural Compatibility Index</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-card p-20 rounded-[64px] border border-white/10">
          <div className="flex justify-between items-center mb-16">
            <h3 className="text-3xl font-black text-white flex items-center gap-6 uppercase tracking-tight"><Target className="text-cyan-400 w-10 h-10" /> Resonance Map</h3>
            <span className="text-[10px] font-black text-slate-600 mono uppercase tracking-widest">Active Vectors: {radarData.length}</span>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" strokeWidth={2} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: '900', letterSpacing: '0.1em' }} />
                <Radar 
                  name="DNA" 
                  dataKey="A" 
                  stroke="#06b6d4" 
                  fill="url(#colorCyan)" 
                  fillOpacity={0.5} 
                  strokeWidth={5} 
                />
                <defs>
                  <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-card p-20 rounded-[64px] border border-white/10 space-y-12">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-black text-white flex items-center gap-6 uppercase tracking-tight"><ShieldCheck className="text-violet-400 w-10 h-10" /> Competitive Edge</h3>
              <Star className="text-yellow-500 w-8 h-8 fill-yellow-500 animate-pulse" />
           </div>
           <div className="space-y-8">
             {match.strengths.slice(0, 4).map((s, i) => (
               <div key={i} className="flex items-center gap-8 bg-white/5 p-8 rounded-[40px] border border-white/5 group hover:border-cyan-500/50 transition-all">
                  <div className="w-4 h-4 rounded-full bg-cyan-500 glow-cyan group-hover:scale-125 transition-transform" />
                  <span className="font-black text-slate-200 text-xl tracking-tight">{s}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
