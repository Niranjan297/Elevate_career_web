import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, AlertOctagon, AlertTriangle, Clock, ArrowRight, BrainCircuit } from 'lucide-react';
import { CareerProfile, SkillGapReport } from './types';
import { analyzeSkillGap } from './utils/logic'; // The logic function we just wrote

interface SkillGapAnalyzerProps {
  profile: CareerProfile;
  onGeneratePlan: (report: SkillGapReport) => void; // Moves to the 90-Day Plan
}

const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({ profile, onGeneratePlan }) => {
  const [step, setStep] = useState<'audit' | 'report'>('audit');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [report, setReport] = useState<SkillGapReport | null>(null);

  // Fallback skills if the profile hasn't been updated with requiredSkills yet
  const fallbackSkills = profile.requiredSkills || [
    { name: 'Domain Basics', importance: 'Critical', estimatedWeeksToLearn: 4 },
    { name: 'Core Tooling (Software/Equipment)', importance: 'Critical', estimatedWeeksToLearn: 6 },
    { name: 'Communication & Presentation', importance: 'Important', estimatedWeeksToLearn: 2 },
    { name: 'Advanced Theory', importance: 'Optional', estimatedWeeksToLearn: 8 },
  ];

  const toggleSkill = (skillName: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillName) 
        ? prev.filter(s => s !== skillName)
        : [...prev, skillName]
    );
  };

  const handleAnalyze = () => {
    // We pass a dummy profile if requiredSkills is missing, just to keep it safe
    const targetProfile = { ...profile, requiredSkills: fallbackSkills };
    const generatedReport = analyzeSkillGap(selectedSkills, targetProfile);
    setReport(generatedReport);
    setStep('report');
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-10">
      
      <AnimatePresence mode="wait">
        {step === 'audit' ? (
          <motion.div 
            key="audit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-10 md:p-16 rounded-[48px] border border-white/10"
          >
            <div className="mb-10 text-center">
              <BrainCircuit className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-white mb-4">Skill Calibration</h2>
              <p className="text-slate-400 text-lg">
                To build your 90-Day Execution Plan for <span className="text-white font-bold">{profile.title}</span>, we need to know your baseline. 
                <br/>Select the skills you already possess.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              {fallbackSkills.map((skill, idx) => {
                const isSelected = selectedSkills.includes(skill.name);
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSkill(skill.name)}
                    className={`px-6 py-4 rounded-2xl font-bold transition-all border ${
                      isSelected 
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-slate-500" />}
                      {skill.name}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <button 
              onClick={handleAnalyze}
              className="w-full max-w-md mx-auto block bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-cyan-400 hover:text-white transition-all shadow-xl"
            >
              Analyze Skill Gap
            </button>
          </motion.div>

        ) : (

          <motion.div 
            key="report"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-8 rounded-[32px] border border-cyan-500/30 bg-cyan-500/5 relative overflow-hidden">
                 <Target className="absolute -right-4 -bottom-4 w-32 h-32 text-cyan-500/10" />
                 <div className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-2 mono">Career Readiness</div>
                 <div className="text-5xl font-black text-white">
                   {Math.round((report!.matchedSkills.length / fallbackSkills.length) * 100)}%
                 </div>
              </div>
              <div className="glass-card p-8 rounded-[32px] border border-rose-500/30 bg-rose-500/5 md:col-span-2 flex items-center justify-between">
                 <div>
                    <div className="text-[10px] text-rose-400 font-black uppercase tracking-widest mb-2 mono">Estimated Time to Employability</div>
                    <div className="text-5xl font-black text-white flex items-baseline gap-2">
                      {report?.totalWeeksToClose} <span className="text-2xl text-slate-400">Weeks</span>
                    </div>
                 </div>
                 <Clock className="w-16 h-16 text-rose-500/50" />
              </div>
            </div>

            {/* The Gap Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1: Critical Gaps */}
              <div className="glass-card p-8 rounded-[32px] border border-white/10">
                <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                  <AlertOctagon className="w-5 h-5 text-rose-500" /> Critical Gaps
                </h3>
                {report?.criticalGaps.length === 0 ? (
                  <p className="text-slate-500 text-sm font-medium">No critical gaps. Excellent foundation.</p>
                ) : (
                  <div className="space-y-4">
                    {report?.criticalGaps.map((skill, i) => (
                      <div key={i} className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex justify-between items-center">
                        <span className="text-rose-200 font-bold text-sm">{skill.name}</span>
                        <span className="text-xs text-rose-400 font-bold mono bg-rose-500/20 px-2 py-1 rounded-md">{skill.estimatedWeeksToLearn}w</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Column 2: Important Gaps */}
              <div className="glass-card p-8 rounded-[32px] border border-white/10">
                <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500" /> Important
                </h3>
                {report?.importantGaps.length === 0 ? (
                  <p className="text-slate-500 text-sm font-medium">All important skills verified.</p>
                ) : (
                  <div className="space-y-4">
                    {report?.importantGaps.map((skill, i) => (
                      <div key={i} className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex justify-between items-center">
                        <span className="text-amber-200 font-bold text-sm">{skill.name}</span>
                        <span className="text-xs text-amber-400 font-bold mono bg-amber-500/20 px-2 py-1 rounded-md">{skill.estimatedWeeksToLearn}w</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Column 3: Matched / Baseline */}
              <div className="glass-card p-8 rounded-[32px] border border-white/10">
                <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Current Arsenal
                </h3>
                {report?.matchedSkills.length === 0 ? (
                  <p className="text-slate-500 text-sm font-medium">Starting from scratch. That's okay!</p>
                ) : (
                  <div className="space-y-4">
                    {report?.matchedSkills.map((skill, i) => (
                      <div key={i} className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex justify-between items-center opacity-70">
                        <span className="text-emerald-200 font-bold text-sm">{skill.name}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Trigger for 90-Day Plan */}
            <div className="pt-8 flex justify-end">
              <button 
                onClick={() => onGeneratePlan(report!)}
                className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl flex items-center gap-3"
              >
                Generate 90-Day Plan <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillGapAnalyzer;
