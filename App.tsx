
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Compass, 
  BarChart2, 
  BookOpen, 
  CheckCircle2, 
  Star, 
  Loader2,
  Trophy,
  LogIn,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Briefcase
} from 'lucide-react';
import { ViewState, AssessmentScores, CareerMatch, SkillEntry, SkillLevel, User } from './types';
import { INTEREST_QUESTIONS, APTITUDE_QUESTIONS, CAREER_PROFILES } from './constants';
import { getCareerRecommendations, generateCareerImage } from './geminiService';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

// --- Auth Service Mock ---
const authService = {
  signInWithGoogle: async (): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '123',
          name: 'Shubham Khatke',
          email: 'alex.j@example.com',
          photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
        });
      }, 1000);
    });
  }
};

// --- Animations Variants ---
// Using "easeOut" for better type compatibility with Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

// --- Components ---

const Navbar: React.FC<{ 
  currentView: ViewState; 
  setView: (v: ViewState) => void;
  user: User | null;
  onLogout: () => void;
}> = ({ currentView, setView, user, onLogout }) => (
  <motion.nav 
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-white/10 z-50 px-6 py-4 flex justify-between items-center"
  >
    <div 
      className="flex items-center gap-2 cursor-pointer group" 
      onClick={() => setView('landing')}
    >
      <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
        <Compass className="text-white w-5 h-5" />
      </div>
      <span className="text-xl font-extrabold text-slate-900 tracking-tight">CareerCompass</span>
    </div>
    
    <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
      <button onClick={() => setView('landing')} className={`hover:text-blue-600 transition-colors ${currentView === 'landing' ? 'text-blue-600' : ''}`}>Discovery</button>
      <button onClick={() => setView('assessment')} className={`hover:text-blue-600 transition-colors ${currentView === 'assessment' ? 'text-blue-600' : ''}`}>Assessment</button>
      <button onClick={() => setView('trends')} className={`hover:text-blue-600 transition-colors ${currentView === 'trends' ? 'text-blue-600' : ''}`}>Market Intel</button>
    </div>

    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
            <button onClick={onLogout} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">Terminate Session</button>
          </div>
          <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm" />
        </div>
      ) : (
        <button 
          onClick={() => setView('login')}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
        >
          <LogIn className="w-4 h-4" />
          Access Portal
        </button>
      )}
    </div>
  </motion.nav>
);

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="relative min-h-screen overflow-hidden">
    {/* Background Video Layer */}
    <div className="video-docker">
      <div className="absolute inset-0 bg-slate-950/80 z-[1]" />
      <video autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80">
        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-blue-lines-background-27772-large.mp4" type="video/mp4" />
      </video>
    </div>

    <section className="relative z-10 max-w-7xl mx-auto px-6 pt-48 pb-32 flex flex-col items-center text-center">
      <motion.div 
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="inline-flex items-center gap-3 bg-blue-500/10 text-blue-400 px-5 py-2 rounded-full text-[12px] font-black uppercase tracking-[0.2em] mb-10 border border-blue-500/20 shadow-2xl backdrop-blur-md"
      >
        <Sparkles className="w-4 h-4 fill-blue-400" />
        <span>Synthesized Career Intelligence</span>
      </motion.div>

      <motion.h1 
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter"
      >
        Architecting Your <br />
        <span className="gradient-text">Future Excellence</span>
      </motion.h1>

      <motion.p 
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
      >
        We fuse psychometric data with neural-mapped career paths to construct the most sophisticated professional blueprints ever developed for global talent.
      </motion.p>
      
      <motion.div 
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-6 items-center"
      >
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="bg-blue-600 text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-blue-700 transition-all flex items-center gap-3 group shadow-2xl shadow-blue-500/20 active:scale-95"
        >
          Initialize Discovery
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
        <button className="px-10 py-5 rounded-2xl text-lg font-bold text-white hover:bg-white/10 border border-white/20 backdrop-blur-md transition-all">
          Explore Intel
        </button>
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-5xl opacity-40 grayscale contrast-125"
      >
        {['FORBES', 'TECHCRUNCH', 'MIT REVIEW', 'WIRED'].map((brand, i) => (
          <motion.div key={brand} variants={fadeInUp} className="text-center font-black text-2xl tracking-tighter italic text-white">
            {brand}
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* Feature Grid with Entrance Animations */}
    <section className="bg-slate-950 py-32 text-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {[
            { icon: Target, title: 'Psychometric Precision', desc: 'Calibrated using elite academic models to map your cognitive DNA.' },
            { icon: Sparkles, title: 'Neural Roadmapping', desc: 'Dynamic learning sequences generated via live global market sentiment.' },
            { icon: Briefcase, title: 'Market Integration', desc: 'Direct pipeline to industry-leading fellowships and talent incubators.' }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-10 rounded-[40px] hover:border-blue-500/50 transition-colors group"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  </div>
);

const RoadmapPage: React.FC<{ match: CareerMatch }> = ({ match }) => {
  const [images, setImages] = useState<Record<number, string>>({});
  const [generating, setGenerating] = useState<Record<number, boolean>>({});

  const generateImg = async (idx: number, prompt: string) => {
    setGenerating(prev => ({ ...prev, [idx]: true }));
    const img = await generateCareerImage(prompt);
    if (img) {
      setImages(prev => ({ ...prev, [idx]: img }));
    }
    setGenerating(prev => ({ ...prev, [idx]: false }));
  };

  useEffect(() => {
    if (match.roadmap.length > 0 && !images[0]) {
      generateImg(0, `${match.career} ${match.roadmap[0].title}`);
    }
  }, [match]);

  return (
    <div className="pt-32 pb-20 max-w-6xl mx-auto px-6">
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] mb-4 inline-block bg-blue-500/5 px-4 py-1.5 rounded-full border border-blue-500/10">Strategic Blueprint</span>
        <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Mastering {match.career}</h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">Your AI-curated sequence for transitioning from ambition to industry-leading expertise.</p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          {match.roadmap.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute left-[-2rem] top-0 bottom-[-4rem] w-px bg-white/10 group-last:bg-transparent" />
              <div className="absolute left-[-2.5rem] top-2 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-950 shadow-[0_0_15px_rgba(37,99,235,0.5)] z-10" />
              
              <div className="glass-card rounded-[40px] p-10 hover:border-white/20 transition-all">
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="flex-1">
                    <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 inline-block">{step.phase}</span>
                    <h3 className="text-3xl font-black text-white mb-4 leading-tight">{step.title}</h3>
                    <p className="text-slate-400 mb-8 leading-relaxed text-lg">{step.description}</p>
                    
                    <div className="flex flex-wrap gap-3">
                      {step.skills.map(skill => (
                        <span key={skill} className="px-4 py-2 bg-white/5 text-slate-300 border border-white/10 rounded-xl text-sm font-bold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:w-64 shrink-0">
                    <div className="aspect-[4/3] bg-white/5 rounded-3xl overflow-hidden border border-white/10 group relative">
                      {images[idx] ? (
                        <motion.img 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          src={images[idx]} 
                          className="w-full h-full object-cover" 
                          alt="Vision" 
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                          {generating[idx] ? (
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="w-6 h-6 text-slate-500 mb-2" />
                              <button 
                                onClick={() => generateImg(idx, `${match.career} ${step.title}`)}
                                className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300"
                              >
                                Synthesize Vision
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white rounded-[40px] p-10 text-slate-950 shadow-2xl sticky top-32"
           >
              <h2 className="text-2xl font-black mb-8">Elite Resources</h2>
              <div className="space-y-6">
                {match.resources.map((res, idx) => (
                  <a 
                    key={idx} 
                    href={res.url} 
                    target="_blank" 
                    className="flex items-center gap-4 group p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm leading-tight group-hover:text-blue-600 transition-colors">{res.name}</h4>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{res.type}</p>
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-12 pt-10 border-t border-slate-100 text-center">
                 <p className="text-slate-500 text-xs font-bold leading-relaxed">
                   Request elite mentorship from a <br />
                   <span className="font-black text-blue-600 uppercase">Certified {match.career}</span>
                 </p>
                 <button className="mt-6 w-full bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-colors">
                   Apply for Fellowship
                 </button>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [assessmentScores, setAssessmentScores] = useState<AssessmentScores | null>(null);
  const [matchResult, setMatchResult] = useState<CareerMatch | null>(null);
  const [loading, setLoading] = useState(false);

  const processResults = async (scores: AssessmentScores) => {
    setLoading(true);
    setAssessmentScores(scores);

    let topCareer = CAREER_PROFILES[0];
    let maxScore = -1;

    CAREER_PROFILES.forEach(profile => {
      let currentScore = 0;
      Object.entries(profile.weights).forEach(([cat, weight]) => {
        const val = (scores.interests[cat] || scores.aptitude[cat] || 0);
        currentScore += val * weight;
      });
      if (currentScore > maxScore) {
        maxScore = currentScore;
        topCareer = profile;
      }
    });

    const normalizedScore = Math.min(Math.round((maxScore / 4.5) * 100), 100);
    const aiData = await getCareerRecommendations(scores, topCareer.name);
    
    setMatchResult({
      career: topCareer.name,
      score: normalizedScore,
      description: aiData.description || "",
      strengths: aiData.strengths || [],
      gaps: aiData.gaps || [],
      roadmap: aiData.roadmap || [],
      resources: aiData.resources || []
    });

    setLoading(false);
    setView('results');
  };

  useEffect(() => {
    const savedResult = localStorage.getItem('career_compass_result');
    const savedUser = localStorage.getItem('career_compass_user');
    if (savedResult) {
      const { scores, match } = JSON.parse(savedResult);
      setAssessmentScores(scores);
      setMatchResult(match);
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('career_compass_user', JSON.stringify(u));
    setView('landing');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('career_compass_user');
    setView('landing');
  };

  return (
    <div className="min-h-screen text-slate-100">
      {view !== 'login' && <Navbar currentView={view} setView={setView} user={user} onLogout={handleLogout} />}
      
      <main>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center text-center px-6"
            >
              <div className="relative">
                <div className="absolute -inset-20 bg-blue-500/10 blur-[100px] rounded-full animate-pulse-slow" />
                <Loader2 className="w-20 h-20 text-blue-500 animate-spin mb-8" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Synthesizing Profile</h2>
              <p className="text-slate-500 max-w-sm font-medium">Mapping psychometric vectors against global market indices...</p>
            </motion.div>
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              {view === 'landing' && <LandingPage onStart={() => setView(user ? 'assessment' : 'login')} />}
              {view === 'login' && <LoginPage onLogin={handleLogin} />}
              {view === 'assessment' && (
                <div className="pt-48 pb-32 max-w-3xl mx-auto px-6">
                   <div className="glass-card rounded-[50px] p-12 shadow-2xl">
                      <p className="text-center text-blue-500 uppercase tracking-[0.3em] font-black text-[10px] mb-12">Cognitive Analysis Engine</p>
                      <AssessmentPageWrapper onComplete={processResults} />
                   </div>
                </div>
              )}
              {view === 'results' && assessmentScores && matchResult && (
                <div className="pt-48 pb-32 max-w-7xl mx-auto px-6">
                   <ResultsDashboard scores={assessmentScores} match={matchResult} setView={setView} />
                </div>
              )}
              {view === 'roadmap' && matchResult && <RoadmapPage match={matchResult} />}
              {view === 'trends' && <MarketTrendsPage />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Placeholder for Auth/Login components to keep file consistent ---

const LoginPage: React.FC<{ onLogin: (u: User) => void }> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-950 relative overflow-hidden">
      <div className="video-docker">
        <div className="absolute inset-0 bg-slate-950/90 z-[1]" />
        <video autoPlay muted loop playsInline>
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-blue-lines-background-27772-large.mp4" type="video/mp4" />
        </video>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10 glass-card p-12 rounded-[50px]"
      >
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20">
            <Compass className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Identity Verification</h1>
          <p className="text-slate-500 font-medium">Access your personalized intelligence dashboard.</p>
        </div>
        <button 
          onClick={async () => {
            setLoading(true);
            const u = await authService.signInWithGoogle();
            onLogin(u);
          }}
          disabled={loading}
          className="w-full flex items-center justify-center gap-4 bg-white text-slate-950 p-5 rounded-3xl font-black hover:bg-blue-500 hover:text-white transition-all shadow-xl disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />}
          Sign-in with Google
        </button>
      </motion.div>
    </div>
  );
};

const MarketTrendsPage: React.FC = () => (
  <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 text-center">
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-5xl font-black text-white mb-16 tracking-tighter"
    >
      Global Market <span className="gradient-text">Sentiment</span>
    </motion.h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { title: 'Generative Architecture', value: '+412%', color: '#3b82f6' },
        { title: 'Neural Ethics', value: '+188%', color: '#8b5cf6' },
        { title: 'Cyber Defense', value: '+245%', color: '#2563eb' }
      ].map((trend, i) => (
        <motion.div 
          key={trend.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-10 rounded-[40px] text-center"
        >
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">{trend.title}</p>
          <h2 className="text-5xl font-black text-white">{trend.value}</h2>
          <p className="text-slate-500 text-xs mt-4 font-bold">Projected Opportunity Expansion</p>
        </motion.div>
      ))}
    </div>
  </div>
);

// --- Assessment Logic Wrapper (Simplified for file brevity) ---
const AssessmentPageWrapper: React.FC<{ onComplete: (s: AssessmentScores) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  return (
    <div className="space-y-12">
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(step/3)*100}%` }}
          className="h-full bg-blue-600"
        />
      </div>

      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-12"
      >
        <h3 className="text-3xl font-black text-white leading-tight">
          {step === 1 ? "Which environments catalyze your creative peak?" : step === 2 ? "Analyze the following logical sequence." : "Verify your domain proficiency."}
        </h3>
        <div className="grid grid-cols-1 gap-4">
           {[1,2,3,4,5].map(v => (
             <button 
              key={v}
              onClick={() => step < 3 ? setStep(step + 1) : onComplete({interests: {}, aptitude: {}, skills: []})}
              className="w-full text-left p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-blue-600 hover:border-blue-500 transition-all font-bold text-white group flex justify-between items-center"
             >
               Option Vector {v}
               <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
             </button>
           ))}
        </div>
      </motion.div>
    </div>
  );
};

// --- Results Visualization (Simplified for brevity) ---
const ResultsDashboard: React.FC<{ scores: AssessmentScores; match: CareerMatch; setView: (v: ViewState) => void }> = ({ match, setView }) => (
  <div className="space-y-16">
    <div className="flex flex-col md:flex-row justify-between items-end gap-12">
      <div className="max-w-2xl">
        <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] mb-4 inline-block">Analysis Complete</span>
        <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.85] mb-6">
          Optimal Path: <br /> <span className="gradient-text">{match.career}</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium leading-relaxed">{match.description}</p>
      </div>
      <div className="glass-card p-10 rounded-[50px] text-center min-w-[240px]">
        <div className="text-6xl font-black text-white mb-2">{match.score}%</div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Congruence</p>
        <button 
          onClick={() => setView('roadmap')}
          className="mt-10 bg-blue-600 text-white w-20 h-20 rounded-[30px] flex items-center justify-center mx-auto hover:rotate-90 transition-transform shadow-2xl shadow-blue-500/20"
        >
          <ArrowRight className="w-10 h-10" />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="glass-card p-12 rounded-[50px]">
        <h3 className="text-2xl font-black mb-8">Competitive Edge</h3>
        <div className="space-y-4">
          {match.strengths.map(s => (
            <div key={s} className="flex items-center gap-4 bg-white/5 p-5 rounded-3xl border border-white/5">
              <CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" />
              <span className="font-bold text-slate-200">{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-900 rounded-[50px] p-12 border border-white/5">
        <h3 className="text-2xl font-black mb-8 text-white">Market Positioning</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[{n: 'A', v: 40}, {n: 'B', v: 70}, {n: 'C', v: 45}, {n: 'D', v: 90}]}>
              <Area type="monotone" dataKey="v" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);
