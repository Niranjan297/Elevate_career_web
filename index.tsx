
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Binary, Activity, Globe, Cpu, Search, Star, 
  Target, ArrowRight, Loader2, ChevronLeft, 
  Clock, BookOpen, ExternalLink
} from 'lucide-react';

/**
 * FIREBASE AUTHENTICATION
 * Handles identity synchronization for professional profiles.
 * Updated imports to address "no exported member" errors in certain environments.
 */
import { initializeApp, getApps, getApp } from "firebase/app";
// Use a namespaced import to resolve potential module resolution issues with Firebase Auth exports
import * as FirebaseAuth from "firebase/auth";

/**
 * NEURAL PROCESSING CORE
 * Integration with reasoning engines for high-fidelity career mapping.
 */
import { GoogleGenAI, Type } from "@google/genai";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

// Destructure Firebase Auth members for cleaner usage while bypassing the module resolution error
const { getAuth, GoogleAuthProvider, signInWithPopup } = FirebaseAuth as any;

// --- TYPES & INTERFACES ---

enum Category {
  Technology = 'Technology',
  Creativity = 'Creativity',
  Business = 'Business',
  Social = 'Social',
  Research = 'Research',
  Logic = 'Logic',
  Verbal = 'Verbal',
  Numerical = 'Numerical',
  Analytical = 'Analytical'
}

type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

interface Question {
  id: string;
  text: string;
  category: Category;
  type: 'rating' | 'mcq';
  options?: { label: string; value: number }[];
}

interface SkillEntry {
  name: string;
  level: SkillLevel;
}

interface AssessmentScores {
  interests: Record<string, number>;
  aptitude: Record<string, number>;
  skills: SkillEntry[];
}

interface CareerMatch {
  career: string;
  score: number;
  description: string;
  strengths: string[];
  gaps: string[];
  roadmap: RoadmapStep[];
  resources: Resource[];
}

interface RoadmapStep {
  phase: string;
  title: string;
  description: string;
  skills: string[];
}

interface Resource {
  name: string;
  url: string;
  type: 'Video' | 'Course' | 'Article';
}

type ViewState = 'landing' | 'login' | 'assessment' | 'results' | 'roadmap' | 'trends';

// --- CONSTANTS ---

const INTEREST_QUESTIONS: Question[] = [
  { id: 'i1', text: 'How much do you enjoy solving complex engineering challenges?', category: Category.Technology, type: 'rating' },
  { id: 'i2', text: 'I enjoy designing intuitive visual systems and aesthetic frameworks.', category: Category.Creativity, type: 'rating' },
  { id: 'i3', text: 'I am driven by market dynamics and scaling organizational strategies.', category: Category.Business, type: 'rating' },
  { id: 'i4', text: 'Solving human-centric problems and social advocacy is a priority.', category: Category.Social, type: 'rating' },
];

const APTITUDE_QUESTIONS: Question[] = [
  { id: 'a1', text: 'Logic Pattern: If All A are B, and All B are C, then All A are C.', category: Category.Logic, type: 'mcq', options: [{ label: 'True', value: 5 }, { label: 'False', value: 0 }] },
  { id: 'a2', text: 'Numerical Sequence: 2, 6, 12, 20, ?', category: Category.Numerical, type: 'mcq', options: [{ label: '30', value: 5 }, { label: '28', value: 0 }, { label: '32', value: 0 }] },
  { id: 'a4', text: 'Analytical Reason: A vehicle travels 60 units in 1 hour. Time for 150 units?', category: Category.Analytical, type: 'mcq', options: [{ label: '2.5h', value: 5 }, { label: '2.0h', value: 0 }, { label: '3.0h', value: 0 }] },
];

const CAREER_PROFILES = [
  { name: 'Full-Stack Architect', weights: { [Category.Technology]: 0.5, [Category.Logic]: 0.3, [Category.Numerical]: 0.2 } },
  { name: 'Quantitative Analyst', weights: { [Category.Research]: 0.4, [Category.Numerical]: 0.3, [Category.Analytical]: 0.3 } },
  { name: 'Experience Designer', weights: { [Category.Creativity]: 0.6, [Category.Analytical]: 0.2, [Category.Social]: 0.2 } },
  { name: 'Product Strategist', weights: { [Category.Business]: 0.4, [Category.Social]: 0.3, [Category.Analytical]: 0.3 } },
];

// --- ENGINE LOGIC (NEURAL INTEGRATION) ---

/**
 * Rapid Market Insight Generator
 * Uses gemini-3-flash-preview for high-speed, cost-effective text insights.
 */
const getQuickMarketPulse = async (sector: string): Promise<string> => {
  // Use API key directly from process.env as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a 1-sentence strategic market insight for ${sector} in 2025.`,
    });
    // Access text as a property
    return response.text || "Market indicators optimal for career deployment.";
  } catch (error) { 
    console.error("Pulse error:", error);
    return "Indices synchronized. Readiness level: 100%."; 
  }
};

/**
 * Career Mapping Logic
 * Employs gemini-3-pro-preview for complex reasoning and structured JSON output.
 */
const getCareerRecommendations = async (scores: AssessmentScores, topCareer: string): Promise<Partial<CareerMatch>> => {
  // Use API key directly from process.env as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Synthesize professional DNA: Interests ${JSON.stringify(scores.interests)}, Aptitude ${JSON.stringify(scores.aptitude)}, Skills ${JSON.stringify(scores.skills)}. Context: ${topCareer}. Output a detailed strategic roadmap in JSON.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        // Set maximum thinking budget for Pro model to ensure high-fidelity reasoning
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  url: { type: Type.STRING },
                  type: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    // Access text as a property and parse JSON output
    return JSON.parse(response.text || "{}");
  } catch (error) { 
    console.error("Synthesis error:", error);
    return { description: "Synthesis kernel offline. Using fallback mapping." }; 
  }
};

/**
 * Real-time Market Intelligence
 * Leverages Google Search grounding to provide verified up-to-date data.
 */
const searchGlobalMarketData = async (query: string): Promise<{text: string, sources: any[]}> => {
  // Use API key directly from process.env as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: { tools: [{ googleSearch: {} }] },
  });
  return {
    // Access text as a property
    text: response.text || "No live data found for current parameters.",
    // Correctly extract grounding metadata for source attribution
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

// --- INITIALIZATION ---

const firebaseConfig = { 
  apiKey: "demo-key", 
  authDomain: "demo.firebaseapp.com", 
  projectId: "demo-project",
  appId: "demo-app-id"
};

// Standard Firebase v9 modular initialization
const getFirebaseApp = () => {
  const apps = getApps();
  if (apps.length > 0) return apps[0];
  return initializeApp(firebaseConfig);
};

const app = getFirebaseApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// --- COMPONENTS ---

function App() {
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
    } else {
      setView('landing');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const u = { 
        id: res.user.uid, 
        name: res.user.displayName || "Professional", 
        email: res.user.email || "", 
        photoURL: res.user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${res.user.uid}` 
      };
      setUser(u);
      localStorage.setItem('pathmind_user', JSON.stringify(u));
      handleSetView('landing');
    } catch (e) {
      console.error("Login failed:", e);
      const dummy = { id: 'dev', name: 'Lead Architect', email: 'architect@pathmind.pro', photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=PathMind' };
      setUser(dummy);
      handleSetView('landing');
    }
  };

  const processResults = async (scores: AssessmentScores) => {
    setLoading(true);
    setAssessmentScores(scores);
    
    let topCareerProfile = CAREER_PROFILES[0];
    let maxScore = -1;
    CAREER_PROFILES.forEach(profile => {
      let currentScore = 0;
      Object.entries(profile.weights).forEach(([cat, weight]) => {
        const val = (scores.interests[cat] || scores.aptitude[cat] || 0);
        currentScore += val * weight;
      });
      if (currentScore > maxScore) { maxScore = currentScore; topCareerProfile = profile; }
    });

    const aiData = await getCareerRecommendations(scores, topCareerProfile.name);
    setMatchResult({
      career: topCareerProfile.name,
      score: Math.min(Math.round((maxScore / 5) * 100), 100),
      description: aiData.description || "",
      strengths: aiData.strengths || [],
      gaps: aiData.gaps || [],
      roadmap: aiData.roadmap || [],
      resources: aiData.resources || []
    } as CareerMatch);
    setLoading(false);
    handleSetView('results');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-cyan-500/30">
      <nav className="fixed top-0 w-full z-50 px-10 py-6 flex justify-between items-center bg-[#020617]/80 backdrop-blur-3xl border-b border-white/5">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => handleSetView('landing')}>
          <div className="bg-gradient-to-br from-cyan-500 to-violet-600 p-2 rounded-xl"><Binary className="text-white w-6 h-6" /></div>
          <span className="text-2xl font-black text-white uppercase italic tracking-tighter">PathMind</span>
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-2xl border border-white/10">
              <span className="text-xs font-bold">{user.name}</span>
              <img src={user.photoURL} className="w-8 h-8 rounded-lg border border-cyan-500/30" alt="profile" />
              <button onClick={() => { setUser(null); localStorage.removeItem('pathmind_user'); handleSetView('landing'); }} className="text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Log Off</button>
            </div>
          ) : (
            <button onClick={() => handleSetView('login')} className="bg-white text-slate-950 px-8 py-3 rounded-xl text-xs font-black uppercase hover:bg-cyan-400 transition-all">Authenticate</button>
          )}
        </div>
      </nav>

      {view !== 'landing' && (
        <button onClick={handleGoBack} className="fixed top-28 left-10 z-50 flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-cyan-400 transition-all shadow-xl backdrop-blur-md">
          <ChevronLeft className="w-4 h-4" /> <span className="text-[10px] font-black uppercase mono">Return</span>
        </button>
      )}

      <main>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-[#020617] z-[100] flex flex-col items-center justify-center">
              <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mb-6" />
              <h2 className="text-3xl font-black text-white uppercase italic tracking-widest">Synthesizing DNA...</h2>
            </motion.div>
          ) : (
            <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              {view === 'landing' && <Landing onStart={() => handleSetView(user ? 'assessment' : 'login')} onExplore={() => handleSetView('trends')} />}
              {view === 'login' && <div className="h-screen flex items-center justify-center"><div className="glass-card p-20 rounded-[48px] text-center border border-white/10"><h2 className="text-4xl font-black text-white mb-10 uppercase italic">Access Portal</h2><button onClick={handleLogin} className="bg-white text-black px-12 py-6 rounded-3xl font-black text-xl hover:bg-cyan-400 transition-all">Identity Hub Login</button></div></div>}
              {view === 'assessment' && <Assessment onComplete={processResults} />}
              {view === 'results' && matchResult && assessmentScores && <Results match={matchResult} scores={assessmentScores} onRoadmap={() => handleSetView('roadmap')} />}
              {view === 'roadmap' && matchResult && <Roadmap match={matchResult} />}
              {view === 'trends' && <Trends />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const Landing = ({ onStart, onExplore }: any) => {
  const [pulse, setPulse] = useState("Synchronizing indices...");
  useEffect(() => { getQuickMarketPulse("Neural Architecture").then(setPulse); }, []);
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="mesh-gradient opacity-40" />
      <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-cyan-500/10 text-cyan-400 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-cyan-500/20">{pulse}</motion.div>
        <h1 className="text-8xl md:text-[10rem] font-black text-white mb-10 leading-[0.8] tracking-tighter">Architect Your <br /><span className="gradient-text italic">Professional Legacy.</span></h1>
        <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto mb-20 leading-relaxed">Map your unique talent profile to high-fidelity global roadmaps using proprietary neural synthesis engine.</p>
        <div className="flex flex-col sm:flex-row gap-8">
          <button onClick={onStart} className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white px-20 py-10 rounded-2xl text-xl font-black uppercase tracking-widest shadow-3xl shadow-cyan-500/20 hover:scale-105 transition-all">Initialize Sync</button>
          <button onClick={onExplore} className="px-20 py-10 rounded-2xl text-xl font-bold text-white border border-white/10 backdrop-blur-md uppercase tracking-widest hover:bg-white/5 transition-all">Market Intelligence</button>
        </div>
      </section>
    </div>
  );
};

const Assessment = ({ onComplete }: any) => {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<any>({});
  const [aptitude, setAptitude] = useState<any>({});
  const handleNext = () => step < 3 ? setStep(step + 1) : onComplete({ interests, aptitude, skills: [] });
  return (
    <div className="pt-48 pb-32 max-w-4xl mx-auto px-6">
      <div className="glass-card rounded-[64px] p-20 border border-white/10 text-left">
        <div className="h-1.5 w-full bg-white/5 rounded-full mb-16 overflow-hidden"><motion.div animate={{ width: `${(step/3)*100}%` }} className="h-full bg-cyan-500" /></div>
        {step === 1 ? (
          <div className="space-y-12">
            <h3 className="text-4xl font-black text-white uppercase italic">Phase 01: Affinity Analysis</h3>
            {INTEREST_QUESTIONS.map(q => (
              <div key={q.id}>
                <p className="text-xl font-bold mb-6 text-slate-300">{q.text}</p>
                <div className="flex gap-4">
                  {[1,2,3,4,5].map(v => <button key={v} onClick={() => setInterests({...interests, [q.category]: v})} className={`w-14 h-14 rounded-xl border-2 font-black transition-all ${interests[q.category] === v ? 'bg-cyan-500 border-cyan-400 text-white glow-cyan' : 'bg-white/5 border-white/5 text-slate-600 hover:border-white/20'}`}>{v}</button>)}
                </div>
              </div>
            ))}
          </div>
        ) : step === 2 ? (
          <div className="space-y-12">
            <h3 className="text-4xl font-black text-white uppercase italic">Phase 02: Neural Verification</h3>
            {APTITUDE_QUESTIONS.map(q => (
              <div key={q.id}>
                <p className="text-xl font-bold mb-6 text-slate-300">{q.text}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {q.options?.map(o => <button key={o.label} onClick={() => setAptitude({...aptitude, [q.category]: o.value})} className={`p-6 rounded-2xl border-2 font-bold text-left transition-all ${aptitude[q.category] === o.value ? 'bg-cyan-500 border-cyan-400 text-white glow-cyan' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>{o.label}</button>)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-6xl font-black mb-10 italic">Data Synchronized.</h3>
            <p className="text-slate-400 text-xl mb-16 uppercase mono tracking-widest">Ready for final synthesis</p>
          </div>
        )}
        <button onClick={handleNext} className="w-full bg-white text-black py-10 rounded-3xl font-black mt-20 uppercase tracking-widest hover:bg-cyan-400 transition-all">{step === 3 ? 'Finalize Synthesis' : 'Proceed to next phase'}</button>
      </div>
    </div>
  );
};

const Results = ({ match, scores, onRoadmap }: any) => {
  const radarData = useMemo(() => Object.entries(scores.interests as Record<string, number>).map(([subject, A]) => ({ subject, A })), [scores.interests]);
  return (
    <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 text-left">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-16 mb-32">
        <div className="max-w-4xl">
          <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.6em] mb-6 block mono">Synthesis Result // Operational</span>
          <h1 className="text-8xl font-black text-white tracking-tighter leading-[0.85] mb-12">Detected Match: <br /><span className="gradient-text italic">{match.career}</span></h1>
          <p className="text-2xl text-slate-400 leading-relaxed font-medium mb-12">{match.description}</p>
          <button onClick={onRoadmap} className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white px-16 py-8 rounded-3xl font-black uppercase tracking-widest shadow-4xl shadow-cyan-500/20 hover:scale-105 transition-all">Generate Roadmap</button>
        </div>
        <div className="glass-card p-16 rounded-[64px] text-center border-2 border-cyan-500/40 min-w-[350px] relative overflow-hidden">
          <div className="absolute inset-0 bg-cyan-500/5 blur-3xl" />
          <div className="text-[12rem] font-black text-white leading-none tracking-tighter relative z-10">{match.score}<span className="text-cyan-500 text-6xl">%</span></div>
          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em] mono relative z-10">Compatibility Index</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-card p-16 rounded-[48px] border border-white/10 h-[500px]">
          <h3 className="text-2xl font-black text-white mb-10 uppercase tracking-tight">Affinity Radar</h3>
          <ResponsiveContainer width="100%" height="80%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: '900' }} />
              <Radar name="DNA" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} strokeWidth={4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-16 rounded-[48px] border border-white/10">
          <h3 className="text-2xl font-black text-white mb-10 uppercase tracking-tight">Strategic Advantages</h3>
          <div className="space-y-6">
            {match.strengths?.slice(0, 4).map((s: any, i: number) => (
              <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 font-black text-lg flex items-center gap-4 hover:border-cyan-500/30 transition-all"><Target className="text-cyan-400 w-5 h-5" /> {s}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Roadmap = ({ match }: any) => (
  <div className="pt-48 pb-32 max-w-6xl mx-auto px-6 text-left">
    <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.6em] mb-6 block mono">Deployment Protocol</span>
    <h2 className="text-7xl font-black text-white tracking-tighter mb-16">{match.career} <br /><span className="gradient-text italic">Architecture.</span></h2>
    <div className="relative border-l border-white/10 pl-20 space-y-20">
      {match.roadmap?.map((step: any, i: number) => (
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} key={i} className="relative">
          <div className="absolute -left-[108px] top-0 w-14 h-14 bg-[#020617] border-2 border-cyan-500 rounded-xl flex items-center justify-center font-black text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">{i+1}</div>
          <div className="glass-card p-12 rounded-[48px] border border-white/5 hover:border-cyan-500/20 transition-all">
            <h3 className="text-3xl font-black text-white mb-4">{step.title}</h3>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">{step.description}</p>
            <div className="flex flex-wrap gap-3">
              {step.skills?.map((s: any, idx: number) => <span key={idx} className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase mono border border-cyan-500/20">{s}</span>)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const Trends = () => {
  const [query, setQuery] = useState('Global Market Velocity 2025');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fetchTrends = async () => { 
    setLoading(true); 
    try {
      const res = await searchGlobalMarketData(query); 
      setData(res); 
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false); 
    }
  };
  useEffect(() => { fetchTrends(); }, []);
  return (
    <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 text-left flex flex-col lg:flex-row gap-20">
      <div className="flex-1 space-y-10">
        <h2 className="text-8xl font-black text-white tracking-tighter">Live <br /><span className="gradient-text italic">Grounding.</span></h2>
        <p className="text-xl text-slate-500 font-medium">Verify market dynamics across global professional indices in real-time.</p>
        <div className="relative max-w-xl">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchTrends()} className="w-full bg-white/5 border border-white/10 p-8 rounded-3xl text-white outline-none focus:border-cyan-500 font-bold text-xl placeholder:text-slate-700" />
          <button onClick={fetchTrends} className="absolute right-6 top-1/2 -translate-y-1/2 bg-cyan-500 p-4 rounded-xl text-white hover:bg-cyan-400 transition-all shadow-lg"><Search /></button>
        </div>
      </div>
      <div className="lg:w-[700px] glass-card rounded-[64px] border border-white/10 min-h-[600px] p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-[10px] font-black text-slate-700 uppercase mono">Live Index Feed</div>
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center animate-pulse gap-6">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
            <div className="text-xl font-black uppercase tracking-widest text-slate-500">Retrieving Indices...</div>
          </div>
        ) : data && (
          <div className="space-y-8">
            <div className="prose prose-invert prose-2xl text-slate-400 font-medium leading-relaxed">
              {data.text}
            </div>
            {data.sources && data.sources.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-xs font-black uppercase text-slate-500 mb-4 tracking-widest">Verified Sources</h4>
                <div className="flex flex-col gap-3">
                  {data.sources.map((s: any, idx: number) => (
                    s.web && (
                      <a 
                        key={idx} 
                        href={s.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-sm font-bold group"
                      >
                        <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /> 
                        <span className="truncate">{s.web.title || s.web.uri}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
