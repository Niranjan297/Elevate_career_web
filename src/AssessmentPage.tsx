import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Layers, ArrowRight, ScanLine, Activity, Cpu } from 'lucide-react';
import { QUESTIONS } from './constants';

// --- COMPONENT: ROBUST TYPEWRITER ---
const TypewriterText = ({ text, delay = 0, speed = 30, onComplete }: { text: string, delay?: number, speed?: number, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStartTyping(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!startTyping) return;
    
    let i = 0;
    setDisplayedText(''); 
    
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed); 
    
    return () => clearInterval(timer);
  }, [text, startTyping]);

  return <span>{displayedText}<span className="animate-pulse text-cyan-400">_</span></span>;
};

interface AssessmentProps {
  onComplete: (answers: Record<string, number>) => void;
}

const AssessmentPage = ({ onComplete }: AssessmentProps) => {
  const allQuestions = QUESTIONS;
  const [bootSequence, setBootSequence] = useState(0); // 0:Init, 1:Title, 2:Subtitle, 3:Ready
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion = allQuestions[currentIndex];
  const progress = ((currentIndex + 1) / allQuestions.length) * 100;

  // Boot Sequence Logic
  useEffect(() => {
    if (hasStarted) return;
    const t1 = setTimeout(() => setBootSequence(1), 500);  // Title starts
    const t2 = setTimeout(() => setBootSequence(2), 1500); // Subtitle starts
    const t3 = setTimeout(() => setBootSequence(3), 2500); // Button appears
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [hasStarted]);

  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);

    const updatedAnswers = { ...userAnswers, [currentQuestion.id]: optionIndex };
    setUserAnswers(updatedAnswers);

    setTimeout(() => {
        if (currentIndex < allQuestions.length - 1) {
          setDirection(1);
          setCurrentIndex(prev => prev + 1);
          setSelectedOption(null); 
        } else {
          onComplete(updatedAnswers);
        }
    }, 400);
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50 } },
    exit: { opacity: 0, x: -20 }
  };

  return (
    // STRIPPED OUT bg-[#020617] and min-h-screen so it floats over the global grid
    <div className="w-full flex flex-col items-center justify-center py-10 relative font-sans text-left">
      
      <AnimatePresence mode="wait">
        
        {/* --- STATE 1: SYSTEM BOOT (THE INTRO) --- */}
        {!hasStarted ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-xl"
          >
            {/* Upgraded Glass Container */}
            <div className="bg-[#020617]/60 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
                
                {/* Top Scanner Line */}
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" 
                />

                <div className="relative z-10 space-y-8">
                    
                    {/* Header Tag */}
                    <div className="flex justify-between items-center">
                       <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                          <Terminal className="w-3 h-3 text-cyan-400" />
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">System Boot // v4.2</span>
                       </div>
                       <Cpu className="w-4 h-4 text-cyan-500/50 animate-pulse" />
                    </div>

                    {/* Main Title Sequence */}
                    <div className="min-h-[120px]">
                      {bootSequence >= 1 && (
                        <motion.h1 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-2"
                        >
                           <span className="text-slate-400 block text-2xl mb-2 font-medium">Not sure what to do?</span>
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                             Let's figure out <br/>what you're built for.
                           </span>
                        </motion.h1>
                      )}
                    </div>

                    {/* Value Props (Fade In) */}
                    {bootSequence >= 2 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="space-y-6"
                      >
                         <p className="text-slate-300 text-lg font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="text-cyan-400 font-bold">Analysis Protocol:</span> We will map your natural instincts, hidden talents, and work personality to find your ideal career path.
                         </p>

                         <div className="flex gap-2 flex-wrap">
                            {['Interests', 'Thinking Style', 'Archetype', 'Salary Potential'].map((tag, i) => (
                              <span key={i} className="px-3 py-1 rounded-md bg-[#020617]/50 border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider backdrop-blur-md">
                                {tag}
                              </span>
                            ))}
                         </div>
                         
                         {/* The "Identity Hook" */}
                         <div className="flex items-center gap-2 text-yellow-500/90 text-xs font-bold bg-yellow-500/10 px-4 py-3 rounded-xl border border-yellow-500/20 w-fit">
                            <ScanLine className="w-4 h-4" />
                            Built for students and early professionals exploring their path.
                         </div>
                      </motion.div>
                    )}

                    {/* Action Area */}
                    {bootSequence >= 3 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-4"
                      >
                        <div className="flex flex-col gap-4">
                          <p className="text-center text-xs font-bold text-cyan-400/70 uppercase tracking-widest animate-pulse mono">
                            Takes 90 seconds. No login required.
                          </p>
                          <button
                              onClick={() => setHasStarted(true)}
                              className="group w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] active:scale-95 text-white font-black text-lg py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 uppercase tracking-widest"
                          >
                              Start My Career Scan <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                </div>
            </div>
          </motion.div>
        ) : (
          
          /* --- STATE 2: THE QUESTIONS (Now inside a beautiful floating glass card) --- */
          <motion.div 
            key="assessment"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl relative z-10 flex flex-col glass-card bg-[#020617]/60 backdrop-blur-2xl rounded-[48px] p-8 md:p-16 border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
          >
            {/* Header (Fixed) */}
            <div className="mb-10 shrink-0">
              <div className="flex justify-between items-end text-xs font-black tracking-[0.2em] text-slate-500 mb-5 uppercase mono">
                <span className="flex items-center gap-3 text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/20">
                   <Layers className="w-4 h-4"/>
                   PHASE: {currentQuestion.type}
                </span>
                <span className="bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-slate-400"> <span className="text-white">{currentIndex + 1}</span> / {allQuestions.length}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 bg-[#020617] border border-white/5 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-violet-600 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progress}%` }} 
                  transition={{ duration: 0.5, ease: "circOut" }} 
                />
              </div>
            </div>

            {/* Question Card (Content Flows Naturally) */}
            <div className="relative flex-1"> 
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div 
                  key={currentIndex}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="w-full"
                >
                  <div className="mb-10 min-h-[80px]">
                      <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
                        <TypewriterText text={currentQuestion.text} delay={100} speed={20} />
                      </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4"> 
                    {currentQuestion.options?.map((opt, idx) => (
                      <motion.button 
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(idx)} 
                        className={`relative p-6 rounded-2xl text-left border transition-all duration-300 group shadow-lg
                          ${selectedOption === idx 
                              ? 'bg-cyan-500/20 border-cyan-400 ring-1 ring-cyan-400 z-10 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                              : 'bg-white/5 border-white/10 hover:bg-cyan-500/10 hover:border-cyan-500/30'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className={`text-lg font-bold transition-colors ${selectedOption === idx ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                              {opt.label}
                          </span>
                          {selectedOption === idx && (
                             <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  
                  <div className="mt-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mono bg-white/5 w-fit px-4 py-2 rounded-lg border border-white/5">
                      <Activity className="w-4 h-4 animate-pulse text-cyan-500" /> 
                      <span>Awaiting Input...</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssessmentPage;