import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Layers, ArrowRight, Sparkles, Cpu, ScanLine, Activity } from 'lucide-react';
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

// --- COMPONENT: NEURAL BACKGROUND (The "Brain Scan" Vibe) ---
const NeuralBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* 1. Moving Grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    
    {/* 2. Ambient Glows */}
    <motion.div 
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity }}
      className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]" 
    />
    <motion.div 
      animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[120px]" 
    />

    {/* 3. Floating Neural Nodes */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
        initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: 0 }}
        animate={{ 
          y: [null, Math.random() * -100], 
          opacity: [0, 1, 0] 
        }}
        transition={{ 
          duration: Math.random() * 5 + 5, 
          repeat: Infinity, 
          delay: Math.random() * 5 
        }}
      />
    ))}
  </div>
);

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden relative font-sans text-left bg-[#020617]">
      
      <NeuralBackground />

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
            {/* Glass Container */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                
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
                       <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                          <Terminal className="w-3 h-3 text-cyan-400" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Boot // v4.2</span>
                       </div>
                       <Cpu className="w-4 h-4 text-slate-600 animate-pulse" />
                    </div>

                    {/* Main Title Sequence */}
                    <div className="min-h-[120px]">
                      {bootSequence >= 1 && (
                        <motion.h1 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-2"
                        >
                           <span className="text-slate-500 block text-2xl mb-2">Not sure what to do?</span>
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
                         <p className="text-slate-400 text-lg font-medium leading-relaxed">
                            <span className="text-cyan-400">Analysis Protocol:</span> We will map your natural instincts, hidden talents, and work personality to find your ideal career path.
                         </p>

                         <div className="flex gap-3 flex-wrap">
                            {['Interests', 'Thinking Style', 'Archetype', 'Salary Potential'].map((tag, i) => (
                              <span key={i} className="px-3 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                {tag}
                              </span>
                            ))}
                         </div>
                         
                         {/* The "Identity Hook" */}
                         <div className="flex items-center gap-2 text-yellow-500/80 text-xs font-bold bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20 w-fit">
                            <ScanLine className="w-3 h-3" />
                            Built for students and early professionals still exploring their path.
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
                        <div className="flex flex-col gap-3">
                          <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
                            Takes 90 seconds. No login required.
                          </p>
                          <button
                              onClick={() => setHasStarted(true)}
                              className="group w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] active:scale-95 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3"
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
          
          /* --- STATE 2: THE QUESTIONS (Maintained your existing logic) --- */
          <motion.div 
            key="assessment"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl relative z-10 flex flex-col h-[85vh]"
          >
            {/* Header (Fixed) */}
            <div className="mb-6 shrink-0">
              <div className="flex justify-between items-end text-xs font-bold tracking-[0.2em] text-slate-500 mb-4 uppercase">
                <span className="flex items-center gap-2 text-cyan-400">
                   <Layers className="w-4 h-4"/>
                   PHASE: {currentQuestion.type}
                </span>
                <span className="text-slate-400"> <span className="text-white">{currentIndex + 1}</span> / {allQuestions.length}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progress}%` }} 
                  transition={{ duration: 0.5, ease: "circOut" }} 
                />
              </div>
            </div>

            {/* Question Card (Scrollable) */}
            <div className="relative flex-1 min-h-0"> 
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div 
                  key={currentIndex}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="absolute inset-0 overflow-y-auto pr-2 pb-20 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                >
                  <div className="mb-8 min-h-[80px]">
                      <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        <TypewriterText text={currentQuestion.text} delay={100} speed={20} />
                      </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3"> 
                    {currentQuestion.options?.map((opt, idx) => (
                      <motion.button 
                        key={idx}
                        whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.08)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(idx)} 
                        className={`relative p-5 rounded-xl text-left border transition-all duration-200 group
                          ${selectedOption === idx 
                              ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500 z-10' 
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-base font-medium transition-colors ${selectedOption === idx ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                              {opt.label}
                          </span>
                          {selectedOption === idx && (
                             <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                      <Activity className="w-3 h-3 animate-pulse text-cyan-500" /> 
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