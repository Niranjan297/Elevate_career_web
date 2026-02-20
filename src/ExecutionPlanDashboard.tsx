import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, Rocket, Calendar, Code, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { SkillGapReport } from './types';

// --- FIREBASE IMPORTS ---
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

interface ExecutionPlanProps {
  report: SkillGapReport;
}

const ExecutionPlanDashboard: React.FC<ExecutionPlanProps> = ({ report }) => {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  
  // Initialize Firebase instances
  const auth = getAuth();
  const db = getFirestore();

  // 1. CLOUD RETRIEVAL: Load Saved Progress on Mount
  useEffect(() => {
    const loadProgress = async () => {
      const user = auth.currentUser;
      const localKey = `pathmind_execution_${report.career.replace(/\s+/g, '_')}`;

      if (user) {
        try {
          // Check the cloud first
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists() && docSnap.data().executionPlans?.[report.career]) {
            setCompletedTasks(docSnap.data().executionPlans[report.career]);
            return;
          }
        } catch (error) {
          console.error("Error fetching execution plan from cloud:", error);
        }
      }

      // Fallback to LocalStorage if offline or no cloud data
      const saved = localStorage.getItem(localKey);
      if (saved) {
        setCompletedTasks(JSON.parse(saved));
      }
    };

    loadProgress();
  }, [report.career]);

  // 2. CLOUD SYNC: Toggle Task and Auto-Save
  const toggleTask = async (taskName: string) => {
    let updatedTasks: string[] = [];
    
    setCompletedTasks(prev => {
      updatedTasks = prev.includes(taskName) 
        ? prev.filter(t => t !== taskName) 
        : [...prev, taskName];
      return updatedTasks;
    });

    const localKey = `pathmind_execution_${report.career.replace(/\s+/g, '_')}`;
    localStorage.setItem(localKey, JSON.stringify(updatedTasks)); // Keep local backup

    // Push instantly to Firebase Cloud
    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, {
          executionPlans: {
            [report.career]: updatedTasks
          }
        }, { merge: true }); // Merge ensures we don't delete their other data!
      } catch (error) {
        console.error("Error saving progress to cloud:", error);
      }
    }
  };

  // Combine Optional Skills with the hardcoded Launch tasks
  const launchTasks = [
    ...report.optionalGaps.map(skill => skill.name),
    'Build 2 Capstone Projects', 
    'Optimize LinkedIn Profile', 
    'Apply to 10 Junior Roles/Internships'
  ];

  const calculateProgress = () => {
    const totalTasks = report.criticalGaps.length + report.importantGaps.length + launchTasks.length;
    if (totalTasks === 0) return 100;
    return Math.round((completedTasks.length / totalTasks) * 100);
  };

  const isComplete = calculateProgress() === 100;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 relative z-20">
      
      {/* --- HEADER --- */}
      <div className="text-center max-w-3xl mx-auto mb-16 pt-10">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-violet-500/20 mb-6 mono backdrop-blur-md">
          <Target className="w-4 h-4" /> Tactical Deployment
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight drop-shadow-md">
          Your 90-Day <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 italic">
            Execution Protocol
          </span>
        </h2>
        <p className="text-slate-400 text-lg bg-[#020617]/50 w-fit mx-auto px-6 py-2 rounded-full border border-white/5 backdrop-blur-sm">
          Target Role: <span className="text-white font-bold">{report.career}</span>
        </p>
      </div>

      {/* --- PROGRESS BAR --- */}
      <div className={`glass-card bg-[#020617]/60 backdrop-blur-xl p-8 rounded-[32px] border transition-all duration-500 mb-12 ${isComplete ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-white/10'}`}>
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className={`text-[10px] font-black uppercase tracking-widest mono transition-colors ${isComplete ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isComplete ? 'Mission Accomplished' : 'Mission Progress'}
            </div>
            <div className="text-4xl font-black text-white drop-shadow-md">{calculateProgress()}%</div>
          </div>
          <div className="text-slate-400 text-sm font-medium bg-white/5 px-4 py-2 rounded-lg border border-white/5">
            {report.totalWeeksToClose} Weeks Total
          </div>
        </div>
        <div className="h-4 bg-[#020617] border border-white/5 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className={`h-full ${isComplete ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-gradient-to-r from-cyan-500 to-violet-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]'}`}
            initial={{ width: 0 }}
            animate={{ width: `${calculateProgress()}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* --- THE 3 PHASES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PHASE 1: FOUNDATION */}
        <div className="glass-card bg-[#020617]/60 backdrop-blur-xl p-8 rounded-[32px] border border-rose-500/20 relative overflow-hidden group hover:border-rose-500/40 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(244,63,94,0.1)]">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Code className="w-32 h-32 text-rose-500" /></div>
          <div className="text-[10px] text-rose-400 font-black uppercase tracking-widest mb-2 mono">Month 1</div>
          <h3 className="text-2xl font-black text-white mb-6">Foundation</h3>
          
          <div className="space-y-4 relative z-10">
            {report.criticalGaps.length > 0 ? report.criticalGaps.map((skill, i) => (
              <div 
                key={i} 
                onClick={() => toggleTask(skill.name)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex gap-4 ${completedTasks.includes(skill.name) ? 'bg-emerald-500/10 border-emerald-500/30 opacity-60' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-rose-500/30'}`}
              >
                <div className="mt-1">{completedTasks.includes(skill.name) ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 rounded-full border border-slate-600 transition-colors group-hover:border-rose-500" />}</div>
                <div>
                  <div className={`font-bold text-sm ${completedTasks.includes(skill.name) ? 'text-emerald-400 line-through' : 'text-white'}`}>{skill.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{skill.estimatedWeeksToLearn} weeks immersion</div>
                </div>
              </div>
            )) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5" /> Foundation already mastered!
              </div>
            )}
          </div>
        </div>

        {/* PHASE 2: CORE COMPETENCY */}
        <div className="glass-card bg-[#020617]/60 backdrop-blur-xl p-8 rounded-[32px] border border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Calendar className="w-32 h-32 text-amber-500" /></div>
          <div className="text-[10px] text-amber-400 font-black uppercase tracking-widest mb-2 mono">Month 2</div>
          <h3 className="text-2xl font-black text-white mb-6">Core Skills</h3>
          
          <div className="space-y-4 relative z-10">
            {report.importantGaps.length > 0 ? report.importantGaps.map((skill, i) => (
              <div 
                key={i} 
                onClick={() => toggleTask(skill.name)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex gap-4 ${completedTasks.includes(skill.name) ? 'bg-emerald-500/10 border-emerald-500/30 opacity-60' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-500/30'}`}
              >
                <div className="mt-1">{completedTasks.includes(skill.name) ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 rounded-full border border-slate-600" />}</div>
                <div>
                  <div className={`font-bold text-sm ${completedTasks.includes(skill.name) ? 'text-emerald-400 line-through' : 'text-white'}`}>{skill.name}</div>
                  <div className="text-xs text-slate-500 mt-1">Specialization Focus</div>
                </div>
              </div>
            )) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5" /> Core skills verified!
              </div>
            )}
          </div>
        </div>

        {/* PHASE 3: LAUNCH */}
        <div className="glass-card bg-[#020617]/60 backdrop-blur-xl p-8 rounded-[32px] border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Rocket className="w-32 h-32 text-cyan-500" /></div>
          <div className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-2 mono">Month 3</div>
          <h3 className="text-2xl font-black text-white mb-6">Launch</h3>
          
          <div className="space-y-4 relative z-10">
            {launchTasks.map((task, i) => (
              <div 
                key={i} 
                onClick={() => toggleTask(task)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex gap-4 ${completedTasks.includes(task) ? 'bg-emerald-500/10 border-emerald-500/30 opacity-60' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/30'}`}
              >
                <div className="mt-1 shrink-0">{completedTasks.includes(task) ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 rounded-full border border-slate-600" />}</div>
                <div className={`font-bold text-sm leading-snug ${completedTasks.includes(task) ? 'text-emerald-400 line-through' : 'text-white'}`}>{task}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- SUCCESS REWARD STATE --- */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
            className="mt-12 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 p-10 rounded-[40px] text-center relative backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#020617] p-4 rounded-full border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <Trophy className="w-8 h-8 text-emerald-400" />
              </div>
              
              <h3 className="text-4xl font-black text-white mb-4 mt-6 flex items-center justify-center gap-3 drop-shadow-md">
                <Sparkles className="w-8 h-8 text-emerald-400" /> You Are Ready.
              </h3>
              
              <p className="text-emerald-100/80 mb-10 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
                You have completely executed your 90-day trajectory. You are now prepared to enter the market as a highly competitive candidate in your field.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  Export Plan to PDF <ArrowRight className="w-4 h-4" />
                </button>
                <button className="bg-[#020617]/50 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                  Find Entry-Level Jobs
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default ExecutionPlanDashboard;