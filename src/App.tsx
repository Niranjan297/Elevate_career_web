
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
import Dashboard from './Dashboard';
import ResumeBuilder from './components/ResumeBuilder';

import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

/**
 * CORE MODULES & TYPES
 */
import { ViewState, User, CareerProfile, SkillGapReport } from './types';
import { calculateCareerPath, analyzeSkillGap } from './utils/logic';
import { getQuickMarketPulse, searchGlobalMarketData } from '../geminiService';
import MarketInsights from './MarketInsights';


// --- SHARED UI COMPONENTS ---

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    // Fixed mobile positioning: smaller padding and pushed up slightly on phones
    className="fixed top-20 left-4 md:top-28 md:left-10 z-[60] flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-slate-400 hover:text-cyan-400 transition-all group"
  >
    <div className="p-1 bg-white/5 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
      <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
    </div>
    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mono hidden sm:block">Back</span>
  </motion.button>
);

const Navbar: React.FC<{ user: User | null, onLogin: () => void, onLogout: () => void }> = ({ user, onLogin, onLogout }) => (
  <nav className="fixed top-0 left-0 right-0 z-[100] p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-[#020617] via-[#020617]/80 to-transparent pointer-events-none">
    <div className="flex items-center gap-2 pointer-events-auto">
      <div className="bg-gradient-to-br from-cyan-500 to-violet-600 text-white font-black p-1.5 md:p-2 rounded-lg text-[10px] md:text-xs leading-none shadow-lg shadow-cyan-500/20">
        01<br />10
      </div>
      <span className="text-white font-black text-lg md:text-xl tracking-tighter italic drop-shadow-md uppercase">Elevate</span>
    </div>

    <div className="pointer-events-auto">
      {user ? (
        <div className="flex items-center gap-3 md:gap-4 bg-white/5 border border-white/10 p-1.5 pr-4 md:p-2 md:pr-4 rounded-full backdrop-blur-md shadow-lg">
          <img src={user.photoURL} alt="Profile" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-cyan-500/50" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-[10px] md:text-xs truncate max-w-[80px] md:max-w-none">{user.name.split(" ")[0]}</span>
            <button onClick={onLogout} className="text-slate-400 text-[8px] md:text-[10px] uppercase font-bold text-left hover:text-rose-400 transition-colors">

              logout
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onLogin}
          className="bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-cyan-400 hover:text-white transition-all shadow-lg flex items-center gap-2"
        >
          <UserIcon className="w-3 h-3 md:w-4 md:h-4" /> Login
        </button>
      )}
    </div>
  </nav>
);

const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.9)]"
        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        animate={{ y: [0, -80], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
        transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 5 }}
      />
    ))}
  </div>
);

// --- LANDING PAGE ---
const LandingPage: React.FC<{ onStart: () => void; onExplore: () => void }> = ({ onStart, onExplore }) => {
  const [marketPulse, setMarketPulse] = useState("Synchronizing intelligence...");

  useEffect(() => {
    getQuickMarketPulse("Future of Work").then(setMarketPulse);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 md:py-20 px-4 md:px-6 relative z-10">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-7xl text-center w-full">
        <div className="inline-flex items-center gap-2 md:gap-4 bg-[#020617]/50 text-cyan-400 px-4 py-2 md:px-8 md:py-3 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-8 md:mb-12 border border-cyan-500/30 backdrop-blur-xl mono shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <Activity className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
          <span>{marketPulse}</span>
        </div>

        {/* Mobile text scaling: 5xl on phones, up to 10rem on desktops */}
        <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black text-white mb-6 md:mb-10 leading-[1.1] md:leading-[0.85] tracking-tighter drop-shadow-2xl">
          Architect Your <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 bg-clip-text text-transparent italic">
            Absolute Legacy.
          </span>
        </h1>

        <p className="text-base md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 md:mb-16 leading-relaxed font-medium bg-[#020617]/40 backdrop-blur-sm p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5">
          Elevate utilizes <span className="text-cyan-400 font-bold">Multi-Dimensional Neural Logic</span> to map your personality, skills, and life direction to a precise career trajectory.
        </p>

        {/* Buttons stack vertically on mobile (flex-col), side-by-side on tablet (sm:flex-row) */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-center w-full px-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onStart} className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 md:px-16 py-4 md:py-6 rounded-2xl text-sm md:text-lg font-black transition-all flex items-center justify-center gap-3 md:gap-4 group uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20">
            Initialize Protocol <ArrowRight className="group-hover:translate-x-2 transition-transform w-5 h-5 md:w-6 md:h-6" />
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onExplore} className="w-full sm:w-auto px-8 md:px-16 py-4 md:py-6 rounded-2xl text-sm md:text-lg font-bold text-white bg-[#020617]/50 border border-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-3 md:gap-4 uppercase tracking-[0.2em] hover:border-cyan-500/50">
            <Globe className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" /> Intelligence Feed
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// --- RESULTS DASHBOARD ---
const ResultsDashboard: React.FC<{ profile: CareerProfile, setView: (v: ViewState) => void }> = ({ profile, setView }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'intel'>('overview');

  return (
    <div className="pt-6 md:pt-10 pb-20 space-y-8 md:space-y-10 text-left animate-in fade-in slide-in-from-bottom-10 duration-1000 relative z-10 max-w-6xl mx-auto">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 border-b border-white/10 pb-6 md:pb-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
            <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 md:px-4 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] border border-cyan-500/30 backdrop-blur-md mono">Stream: {profile.stream}</span>
            <span className="bg-violet-500/10 text-violet-400 px-3 py-1 md:px-4 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] border border-violet-500/30 backdrop-blur-md mono">Branch: {profile.branch}</span>
          </div>
          {/* Scaled down text for mobile */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-4 drop-shadow-lg">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 bg-clip-text text-transparent italic">{profile.title}</span>
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-2xl bg-[#020617]/40 backdrop-blur-sm p-4 rounded-xl border-l-2 border-cyan-500">{profile.description}</p>
        </div>

        <div className="w-full md:w-auto glass-card bg-[#020617]/60 backdrop-blur-xl p-4 md:p-6 rounded-[24px] md:rounded-[32px] text-center border border-cyan-500/30 min-w-[160px] shadow-[0_0_30px_rgba(6,182,212,0.15)] shrink-0 flex md:flex-col justify-between md:justify-center items-center">
          <div>
            <div className="text-3xl md:text-5xl font-black text-white tracking-tighter drop-shadow-md">{profile.matchScore}<span className="text-xl md:text-2xl text-cyan-500">%</span></div>
            <p className="text-[9px] md:text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mono mt-1 md:mt-2">Match Index</p>
          </div>
          <Target className="w-8 h-8 text-cyan-500/30 md:hidden" />
        </div>
      </div>

      {/* Tabs with hidden scrollbar for mobile sliding */}
      <div className="flex items-center gap-2 bg-[#020617]/50 p-1.5 md:p-2 rounded-xl md:rounded-2xl border border-white/10 backdrop-blur-md w-full md:w-fit overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden">
        {['overview', 'roadmap', 'intel'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            {tab === 'intel' ? 'Intelligence' : tab}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              <div className="lg:col-span-7 space-y-6">
                <div className="glass-card bg-[#020617]/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl md:rounded-[40px] border border-white/10 shadow-lg">
                  <h4 className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-widest mb-4 md:mb-6 mono">Profile Breakdown</h4>
                  <div className="space-y-3 md:space-y-4">
                    <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center justify-between border border-white/5">
                      <span className="text-slate-400 text-xs md:text-sm font-medium">Personality Archetype</span>
                      <span className="text-white font-bold text-xs md:text-sm bg-violet-500/20 text-violet-300 px-3 py-1 rounded-lg">{profile.personalityFit || "Analytical"}</span>
                    </div>
                    {profile.matchReason?.map((reason, idx) => (
                      <div key={idx} className="flex gap-3 md:gap-4 items-start bg-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/5">
                        <Target className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="glass-card bg-gradient-to-br from-[#020617]/90 to-[#0f172a]/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl md:rounded-[40px] border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col justify-center space-y-3 md:space-y-4">
                  <h4 className="text-lg md:text-xl font-black text-white mb-2 md:mb-6 uppercase italic flex items-center gap-2 md:gap-3">
                    <Layers className="text-cyan-400 w-4 h-4 md:w-5 md:h-5" /> Action Center
                  </h4>
                  <button onClick={() => setView('learning-hub')} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all"><Youtube className="w-4 h-4" /> Access Learning Hub</button>
                  <button onClick={() => setView('skill-gap')} className="w-full bg-white/5 border border-white/10 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold uppercase text-[10px] md:text-xs hover:bg-white/10 transition-all">Analyze Skill Gaps</button>
                  <button onClick={() => setView('trends')} className="w-full bg-transparent border border-white/10 text-slate-400 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold uppercase text-[10px] md:text-xs hover:bg-white/5 transition-all">Live Market Data</button>
                  <button onClick={() => setView('assessment')} className="w-full bg-transparent border border-rose-500/20 text-rose-400 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold uppercase text-[10px] md:text-xs hover:bg-rose-500/10 transition-all">Retake Assessment</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'roadmap' && (
            <motion.div key="roadmap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="glass-card bg-[#020617]/60 backdrop-blur-xl p-6 md:p-14 rounded-3xl md:rounded-[40px] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                <div className="flex justify-between items-center mb-8 md:mb-12 border-b border-white/10 pb-6 md:pb-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3 md:gap-4 uppercase tracking-tight mb-2">
                      <Map className="text-cyan-400 w-6 h-6 md:w-8 md:h-8" /> Tactical Roadmap
                    </h3>
                    <p className="text-slate-400 font-medium text-xs md:text-sm">Step-by-step execution protocol for your trajectory.</p>
                  </div>
                </div>
                <div className="space-y-8 md:space-y-12 relative">
                  <div className="absolute left-4 md:left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500/50 via-violet-600/30 to-transparent" />
                  {profile.roadmap.map((step, i) => {
                    const isString = typeof step === 'string';
                    const title = isString ? step : (step as any).title;
                    const desc = isString ? "Focus on mastering the core fundamentals of this phase before advancing." : (step as any).description;
                    const timeframe = isString ? `Phase 0${i + 1}` : (step as any).timeframe;

                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative pl-12 md:pl-20 group">
                        <div className="absolute left-0 md:left-0 top-0 w-8 h-8 md:w-12 md:h-12 bg-[#020617] border-2 border-cyan-500/50 group-hover:border-cyan-400 rounded-full flex items-center justify-center z-10 transition-all duration-300">
                          <span className="text-cyan-400 font-black text-xs md:text-sm">{i + 1}</span>
                        </div>
                        <div className="bg-white/5 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 hover:border-cyan-500/40 hover:bg-[#020617]/40 transition-all backdrop-blur-md">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-3 md:mb-4">
                            <h4 className="text-lg md:text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">{title}</h4>
                            <span className="inline-block bg-[#020617] text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest mono px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/10 w-fit shrink-0">
                              ⏱ {timeframe}
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-0 md:mb-6">{desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'intel' && (
            <motion.div key="intel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="glass-card bg-[#020617]/60 backdrop-blur-xl p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                <div className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 md:mb-3 mono">Expected Compensation</div>
                <div className="text-3xl md:text-4xl font-black text-white">{profile.salaryRange || "₹8L - ₹15L"}</div>
                <div className="text-slate-500 text-xs md:text-sm mt-1 md:mt-2 font-medium">Average starting base pay</div>
              </div>
              <div className="glass-card bg-[#020617]/60 backdrop-blur-xl p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)]">
                <div className="text-[9px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 md:mb-3 mono">Market Demand</div>
                <div className="text-3xl md:text-4xl font-black text-white">{profile.marketDemand || "High Growth"}</div>
                <div className="text-slate-500 text-xs md:text-sm mt-1 md:mt-2 font-medium">Industry hiring trajectory</div>
              </div>
              <div className="glass-card bg-[#020617]/60 backdrop-blur-xl p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.05)]">
                <div className="text-[9px] md:text-[10px] font-black text-violet-500 uppercase tracking-widest mb-2 md:mb-3 mono">AI Automation Risk</div>
                <div className="text-3xl md:text-4xl font-black text-white">{profile.aiAutomationRisk || "Low Risk"}</div>
                <div className="text-slate-500 text-xs md:text-sm mt-1 md:mt-2 font-medium">Requires high human intuition</div>
              </div>
              <div className="glass-card bg-[#020617]/60 backdrop-blur-xl p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
                <div className="text-[9px] md:text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-2 md:mb-3 mono">Estimated Timeline</div>
                <div className="text-3xl md:text-4xl font-black text-white">{profile.timeline || "6-8 Months"}</div>
                <div className="text-slate-500 text-xs md:text-sm mt-1 md:mt-2 font-medium">To reach baseline employability</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-12 md:pt-16 flex justify-center pb-10">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6,182,212,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setView('dashboard')}
          className="bg-white text-[#0b0c0e] px-8 md:px-12 py-5 md:py-8 rounded-3xl font-black uppercase text-xs md:text-sm tracking-[0.3em] md:tracking-[0.5em] shadow-2xl flex items-center gap-4 group border-4 border-cyan-500/20"
        >
          <div className="p-2 md:p-3 bg-[#0d59f2] text-white rounded-xl group-hover:bg-[#06b6d4] transition-colors shadow-lg">
            <span className="material-symbols-outlined !text-xl md:text-2xl">grid_view</span>
          </div>
          Explore Intelligence Dashboard
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
        </motion.button>
      </div>
    </div>
  );
};

// --- MARKET TRENDS ---
const MarketTrends: React.FC<{ onBack: () => void, careerProfile: CareerProfile | null, setView: (v: ViewState) => void }> = ({ onBack, careerProfile, setView }) => {
  const [query, setQuery] = useState(careerProfile?.title || 'AI & Machine Learning Engineer');
  const [data, setData] = useState<{ text: string, sources: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'dashboard' | 'search'>('dashboard');

  const fetchTrends = async (q: string) => {
    setLoading(true);
    try {
      const res = await searchGlobalMarketData(q);
      setData(res);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchTrends(query); }, []);

  if (viewMode === 'dashboard') {
    return (
      <div className="relative z-10 animate-in fade-in duration-700">
        <div className="fixed top-24 right-8 z-[60]">
          <button
            onClick={() => setViewMode('search')}
            className="bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md transition-all shadow-xl"
          >
            Switch to AI Search
          </button>
        </div>
        <MarketInsights query={query} careerProfile={careerProfile} onBack={onBack} setView={setView} />
      </div>
    );
  }

  return (
    <div className="pt-6 md:pt-10 pb-20 md:pb-32 max-w-7xl mx-auto px-4 md:px-6 text-left relative z-10">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => setViewMode('dashboard')}
          className="bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md transition-all"
        >
          View Industry Dashboard
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 md:gap-20 items-start">
        <div className="flex-1 space-y-8 md:space-y-16 w-full">
          <div>
            <span className="bg-[#020617]/50 border border-cyan-500/30 text-cyan-400 font-black text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] mb-4 md:mb-6 inline-block mono px-3 py-1.5 md:px-4 md:py-2 rounded-lg backdrop-blur-md">GROUNDING PROTOCOL ACTIVE</span>
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-tight drop-shadow-xl">Market <br /><span className="bg-gradient-to-r from-cyan-400 to-violet-600 bg-clip-text text-transparent italic">Grounding.</span></h2>
          </div>
          <div className="relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-[24px] md:rounded-[40px] blur opacity-25 group-focus-within:opacity-100 transition duration-1000" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTrends(query)}
              className="w-full bg-[#020617]/80 backdrop-blur-xl border border-white/10 p-6 md:p-10 pr-20 md:pr-32 rounded-[24px] md:rounded-[40px] text-white focus:outline-none focus:border-cyan-500 transition-all font-medium placeholder:text-slate-700 text-sm md:text-xl relative z-10 shadow-2xl"
            />
            <button
              onClick={() => fetchTrends(query)}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-violet-600 p-4 md:p-6 rounded-2xl md:rounded-3xl text-white hover:scale-105 transition-all z-10 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <Search className="w-5 h-5 md:w-8 md:h-8" />
            </button>
          </div>
        </div>
        <div className="w-full lg:w-[700px] glass-card rounded-3xl md:rounded-[64px] border border-white/10 overflow-hidden min-h-[400px] md:min-h-[700px] flex flex-col relative bg-[#020617]/60 backdrop-blur-2xl shadow-2xl">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 md:p-20 text-center">
              <Loader2 className="w-12 h-12 md:w-20 md:h-20 text-cyan-500 animate-spin mb-6 md:mb-10" />
              <p className="text-white font-black text-lg md:text-2xl uppercase tracking-widest mono drop-shadow-md">Scanning Global Index...</p>
            </div>
          ) : data ? (
            <div className="p-6 md:p-16 space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex items-center gap-3 md:gap-4 bg-cyan-500/10 text-cyan-400 px-4 py-2 md:px-6 md:py-3 rounded-full w-fit border border-cyan-500/20 backdrop-blur-md">
                <Activity className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest mono">Data Verified</span>
              </div>
              <div className="prose prose-sm md:prose-2xl prose-invert max-w-none text-slate-300 leading-relaxed font-medium">
                {data.text.split('\n').map((para, i) => para.trim() && <p key={i} className="mb-6 md:mb-10">{para}</p>)}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 md:p-20 text-center text-slate-700 opacity-30">
              <Binary className="w-20 h-20 md:w-32 md:h-32 mb-6 md:mb-10" />
              <p className="text-lg md:text-2xl font-black uppercase tracking-[0.5em] mono">Initialize Scan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- LOGIN PAGE ---
const LoginPage: React.FC<{ onLogin: (isGuest?: boolean) => void }> = ({ onLogin }) => (
  <div className="w-full flex items-center justify-center py-20 px-4 md:px-6 relative z-10">
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-xl glass-card p-10 md:p-20 rounded-[40px] md:rounded-[64px] border border-white/10 text-center backdrop-blur-2xl bg-[#020617]/60 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <div className="bg-gradient-to-br from-cyan-500 to-violet-600 w-24 h-24 md:w-32 md:h-32 rounded-3xl md:rounded-[40px] flex items-center justify-center mx-auto mb-10 md:mb-16 shadow-[0_0_40px_rgba(6,182,212,0.4)]">
        <Terminal className="text-white w-12 h-12 md:w-16 md:h-16" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tighter uppercase italic drop-shadow-lg">Elevate<span className="text-cyan-400 not-italic">AI</span></h1>
      <p className="text-slate-400 mb-10 md:mb-16 font-medium text-sm md:text-xl bg-white/5 p-4 rounded-2xl border border-white/5">Identity verification required for <br />Protocol Access.</p>

      <div className="flex flex-col gap-4">
        <button onClick={() => onLogin(false)} className="w-full flex items-center justify-center gap-4 md:gap-6 p-6 md:p-8 rounded-2xl md:rounded-3xl font-black uppercase text-[10px] md:text-sm tracking-[0.3em] bg-white text-slate-950 hover:bg-cyan-400 hover:text-white transition-all shadow-xl group border border-white/10">
          <Cpu className="w-5 h-5 md:w-6 md:h-6" /> Identity Hub Login
        </button>

        <button onClick={() => onLogin(true)} className="w-full flex items-center justify-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl md:rounded-3xl font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all border border-white/10">
          Continue as Guest
        </button>
      </div>
    </motion.div>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [history, setHistory] = useState<ViewState[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [careerProfile, setCareerProfile] = useState<CareerProfile | null>(null);
  const [topRecommendations, setTopRecommendations] = useState<CareerProfile[]>([]);
  const [gapReport, setGapReport] = useState<SkillGapReport | null>(null);

  /**
   * 1. CLOUD SYNC: Save user data to Firestore
   */
  const saveToFirestore = async (userId: string, data: CareerProfile, gaps?: SkillGapReport) => {
    if (!db) return;
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        careerProfile: data,
        skillGaps: gaps || gapReport,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Firestore Save Error:", error);
    }
  };

  /**
   * 2. AUTH LISTENER & REAL-TIME CLOUD SYNC
   */
  useEffect(() => {
    if (!auth) {
      console.log("Auth State: Firebase Auth instance not found (check .env).");
      return;
    }

    console.log("Initializing Auth state listener...");
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      // Cleanup previous snapshot listener if it exists
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (currentUser) {
        console.log("Auth State: User is logged in", currentUser.uid);
        const loggedInUser: User = {
          id: currentUser.uid,
          name: currentUser.displayName || 'Explorer',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || ''
        };
        setUser(loggedInUser);

        // REAL-TIME SYNC
        if (db) {
          console.log("Setting up real-time Firestore sync...");
          const userRef = doc(db, "users", currentUser.uid);
          unsubscribeSnapshot = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              console.log("Real-time Update Received:", data);

              if (data.careerProfile) {
                setCareerProfile(data.careerProfile);
                // If they have a profile, dashboard is home
                if (view === 'landing' || view === 'login') {
                  setView('dashboard');
                }
              } else {
                // If they log in but have NO profile, go straight to assessment
                if (view === 'landing' || view === 'login') {
                  setView('assessment');
                }
              }
              if (data.skillGaps) {
                setGapReport(data.skillGaps);
              }
            } else {
              // New user (no doc yet) -> go to assessment
              if (view === 'landing' || view === 'login') {
                setView('assessment');
              }

              // Check local storage as fallback
              const local = localStorage.getItem(`elevate_profile_${currentUser.uid}`);
              if (local) {
                const parsed = JSON.parse(local);
                setCareerProfile(parsed);
                setView('dashboard'); // If they have local data, they are returning
                saveToFirestore(currentUser.uid, parsed);
              }
            }
          }, (err) => {
            console.error("Real-time sync error:", err);
          });
        }
      } else {
        console.log("Auth State: No user session found.");
        setUser(null);
        setCareerProfile(null);
        setGapReport(null);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
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

  const handleLoginClick = async (isGuest = false) => {
    if (isGuest) {
      console.log("Initiating Guest Mode...");
      const guestUser: User = {
        id: 'guest_user',
        name: 'Guest operative',
        email: 'guest@elevate.io',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'
      };
      setUser(guestUser);
      handleSetView('assessment'); // Direct guests to assessment immediately
      return;
    }

    if (!auth || !googleProvider) {
      alert("Google Auth is not configured! \n\n1. Create a .env file in the root folder. \n2. Copy keys from your Firebase Console. \n3. Restart your 'npm run dev' terminal. \n\nUse 'Continue as Guest' for now to explore the app.");
      return;
    }

    try {
      console.log("Initiating Google Login...");
      const result = await signInWithPopup(auth, googleProvider);

      const loggedInUser = result.user;
      console.log("Login Successful:", loggedInUser);

      if (db) {
        const userRef = doc(db, "users", loggedInUser.uid);
        await setDoc(userRef, {
          name: loggedInUser.displayName,
          email: loggedInUser.email,
          photoURL: loggedInUser.photoURL,
          lastLogin: serverTimestamp()
        }, { merge: true });
        console.log("Firestore sync complete.");
      }
    } catch (error: any) {
      console.error("FULL AUTH ERROR OBJECT:", error);
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);

      alert(`Login Failed: ${error.code}\n${error.message}`);

      if (error.code === 'auth/unauthorized-domain') {
        console.error("CRITICAL: 192.168.56.1 is not in your Firebase Authorized Domains.");
      }
    }
  };

  const handleLogout = async () => {
    if (!auth) {
      setUser(null);
      setCareerProfile(null);
      handleSetView('landing');
      return;
    }
    try { await signOut(auth); } catch (e) { }
    setUser(null);
    setCareerProfile(null);
    handleSetView('landing');
  };

  /**
   * 3. ASSESSMENT HANDLER (ASYNC ENABLED)
   */
  const handleAssessmentComplete = (answers: Record<string, number>) => {
    setLoading(true);
    setTimeout(async () => {
      const results = calculateCareerPath(answers);
      setTopRecommendations(results);
      setLoading(false);
      handleSetView('results');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        <Particles />
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-cyan-500/10 blur-[100px] md:blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] bg-violet-600/10 blur-[100px] md:blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {view !== 'dashboard' && <Navbar user={user} onLogin={handleLoginClick} onLogout={handleLogout} />}
        {view !== 'landing' && view !== 'dashboard' && <BackButton onClick={handleGoBack} />}

        <main className={`flex-grow flex flex-col justify-center ${view === 'dashboard' ? '' : 'pt-24 md:pt-32 pb-12'} w-full overflow-hidden`}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full w-full py-20 relative z-20">
                <Loader2 className="w-16 h-16 md:w-24 md:h-24 text-cyan-500 animate-spin mb-6 md:mb-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic text-center">Synthesizing<br className="md:hidden" /> DNA...</h2>
                <p className="text-cyan-400 font-bold mt-4 md:mt-6 text-[10px] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.6em] mono bg-[#020617]/50 px-4 py-2 md:px-6 md:py-2 rounded-full border border-cyan-500/20 backdrop-blur-sm">Mapping Trajectory</p>
              </motion.div>
            ) : (
              <motion.div key={view} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="w-full h-full flex flex-col">

                {view === 'landing' && (
                  <LandingPage
                    onStart={() => {
                      if (!user) handleSetView('login');
                      else if (careerProfile) handleSetView('dashboard');
                      else handleSetView('assessment');
                    }}
                    onExplore={() => handleSetView('trends')}
                  />
                )}

                {view === 'dashboard' && (
                  <Dashboard
                    user={user}
                    careerProfile={careerProfile}
                    gapReport={gapReport}
                    onViewChange={handleSetView}
                    onLogout={handleLogout}
                  />
                )}

                {view === 'login' && <LoginPage onLogin={handleLoginClick} />}
                {view === 'trends' && (
                  <div className="w-full">
                    <MarketTrends
                      onBack={handleGoBack}
                      careerProfile={careerProfile}
                      setView={handleSetView}
                    />
                  </div>
                )}

                {view === 'assessment' && (
                  <div className="w-full max-w-5xl mx-auto px-4 md:px-6 relative z-20 py-6 md:py-10">
                    <AssessmentPage onComplete={handleAssessmentComplete} />
                  </div>
                )}

                {view === 'results' && topRecommendations.length > 0 && (
                  <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
                    <div className="pt-10 pb-20 max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                      <div className="text-center mb-16">
                        <span className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-cyan-500/20 mb-6 inline-block mono">NEURAL MATCH COMPLETE</span>
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">Your Expert <span className="bg-gradient-to-r from-cyan-400 to-violet-600 bg-clip-text text-transparent italic">Trajectories.</span></h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">We've identified the top 3 high-probability paths for your specific neural profile.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {topRecommendations.map((profile, i) => (
                          <motion.div
                            key={profile.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            onClick={() => {
                              setCareerProfile(profile);
                              const initialGapReport = analyzeSkillGap([], profile);
                              setGapReport(initialGapReport);
                              if (auth?.currentUser) {
                                saveToFirestore(auth.currentUser.uid, profile, initialGapReport);
                              }
                              handleSetView('dashboard');
                            }}
                            className="glass-card bg-[#020617]/60 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 hover:border-cyan-500/50 transition-all group flex flex-col justify-between shadow-2xl relative overflow-hidden cursor-pointer h-full"
                          >
                            <div className="absolute top-0 right-0 p-8">
                              <div className="text-4xl font-black text-white/10 group-hover:text-cyan-500/20 transition-colors uppercase italic tracking-tighter">0{i + 1}</div>
                            </div>

                            <div>
                              <div className="flex items-center gap-3 mb-8">
                                <div className="text-3xl font-black text-cyan-400 tracking-tighter">{profile.matchScore}%</div>
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Match<br />Index</div>
                              </div>

                              <h3 className="text-3xl font-black text-white mb-4 leading-[0.9] tracking-tighter uppercase italic">{profile.title}</h3>
                              <p className="text-sm text-slate-400 mb-8 line-clamp-4 leading-relaxed">{profile.description}</p>

                              <div className="space-y-2 mb-10">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                  <span>Market Demand</span>
                                  <span className="text-emerald-400">{profile.marketDemand}</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500/50" style={{ width: profile.matchScore + '%' }} />
                                </div>
                              </div>
                            </div>

                            <button className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                              Select Trajectory <ArrowRight className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {view === 'career-report' && careerProfile && (
                  <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
                    <ResultsDashboard profile={careerProfile} setView={handleSetView} />
                  </div>
                )}

                {view === 'learning-hub' && careerProfile && (
                  <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
                    <LearningHub profile={careerProfile} />
                  </div>
                )}

                {view === 'skill-gap' && careerProfile && (
                  <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
                    <SkillGapAnalyzer
                      profile={careerProfile}
                      onGeneratePlan={(report) => {
                        setGapReport(report);
                        if (auth?.currentUser) {
                          saveToFirestore(auth.currentUser.uid, careerProfile, report);
                        }
                        handleSetView('execution-plan');
                      }}
                    />
                  </div>
                )}

                {view === 'execution-plan' && gapReport && (
                  <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
                    <ExecutionPlanDashboard report={gapReport} />
                  </div>
                )}

                {view === 'resume-builder' && careerProfile && (
                  <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
                    <ResumeBuilder profile={careerProfile} />
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