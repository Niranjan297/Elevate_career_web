import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Zap, ArrowRight, Target, Activity, Loader2 } from 'lucide-react';
import { CareerProfile, SkillGapReport } from './types';
import { analyzeSkillGap } from './utils/logic';

interface SkillGapAnalyzerProps {
  profile: CareerProfile;
  onGeneratePlan: (report: SkillGapReport) => void;
}

const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({ profile, onGeneratePlan }) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(prev => prev.filter(s => s !== skillName));
    } else {
      setSelectedSkills(prev => [...prev, skillName]);
    }
  };

  const handleAnalyze = () => {
    setIsScanning(true);
    
    // 1.5 second dramatic pause for the "AI Diagnostic" effect
    setTimeout(() => {
      const report = analyzeSkillGap(selectedSkills, profile);
      onGeneratePlan(report);
    }, 1500);
  };

  if (isScanning) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center relative z-20">
        <Loader2 className="w-24 h-24 text-cyan-500 animate-spin mb-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-lg">
          Compiling Gaps...
        </h2>
        <p className="text-cyan-400 font-bold mt-6 uppercase tracking-[0.6em] mono bg-[#020617]/50 px-6 py-2 rounded-full border border-cyan-500/20 backdrop-blur-sm">
          Generating Execution Plan
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full relative z-20"
    >
      <div className="glass-card bg-[#020617]/60 backdrop-blur-2xl rounded-[48px] p-8 md:p-16 border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        
        {/* HEADER */}
        <div className="mb-12 border-b border-white/10 pb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-3 bg-violet-500/10 text-violet-400 px-4 py-2 rounded-xl border border-violet-500/20 mb-6 backdrop-blur-md">
            <Target className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] mono">Diagnostic Scan</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-md">
            Baseline <span className="bg-gradient-to-r from-cyan-400 to-violet-600 bg-clip-text text-transparent italic">Calibration.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium max-w-2xl">
            To generate your precise execution plan for <strong className="text-white">{profile.title}</strong>, we need to know what you already bring to the table.
          </p>
        </div>

        {/* SKILL CHECKLIST */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white uppercase tracking-widest">Select Existing Competencies</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.requiredSkills.map((skill, idx) => {
              const isSelected = selectedSkills.includes(skill.name);
              
              // Color code the importance badges
              const badgeColor = 
                skill.importance === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                skill.importance === 'Important' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-slate-500/10 text-slate-400 border-slate-500/20';

              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSkill(skill.name)}
                  className={`relative p-5 rounded-2xl text-left border transition-all duration-300 flex items-center justify-between group
                    ${isSelected 
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/30'
                    }
                  `}
                >
                  <div className="flex flex-col gap-2">
                    <span className={`text-lg font-bold transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      {skill.name}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border w-fit ${badgeColor}`}>
                      {skill.importance}
                    </span>
                  </div>

                  {/* The Checkbox Icon */}
                  <div className="shrink-0 ml-4">
                    {isSelected ? (
                      <CheckCircle2 className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    ) : (
                      <Circle className="w-8 h-8 text-slate-600 group-hover:text-cyan-500/50 transition-colors" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ACTION FOOTER */}
        <div className="bg-[#020617]/80 p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mono">
            <Activity className="w-4 h-4 animate-pulse text-cyan-500" /> 
            <span>{selectedSkills.length} Skills Verified</span>
          </div>

          <button
            onClick={handleAnalyze}
            className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] active:scale-95 text-white font-black text-sm py-4 px-8 rounded-xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            Compute Skill Gap <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default SkillGapAnalyzer;