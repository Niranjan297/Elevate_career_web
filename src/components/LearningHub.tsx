import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Loader2, PlayCircle, Activity, CheckCircle } from 'lucide-react';
import { fetchCareerVideos } from '../utils/youtubeService';

interface LearningHubProps {
  careerTitle: string;
}

const LearningHub: React.FC<LearningHubProps> = ({ careerTitle }) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: Tracking State
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);

  // 1. Load Videos AND Saved Progress
  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      const data = await fetchCareerVideos(careerTitle);
      if (isMounted) {
        setVideos(data);
        setLoading(false);
      }
    };
    
    // Load saved progress from memory based on the specific career
    const savedProgress = localStorage.getItem(`pathmind_progress_${careerTitle.replace(/\s+/g, '_')}`);
    if (savedProgress) {
      setCompletedVideos(JSON.parse(savedProgress));
    }

    loadContent();
    return () => { isMounted = false; };
  }, [careerTitle]);

  // 2. Toggle Completion Function
  const toggleComplete = (videoId: string) => {
    let newCompleted;
    if (completedVideos.includes(videoId)) {
      // Remove it (uncheck)
      newCompleted = completedVideos.filter(id => id !== videoId);
    } else {
      // Add it (check)
      newCompleted = [...completedVideos, videoId];
    }
    
    setCompletedVideos(newCompleted);
    // Save to memory instantly
    localStorage.setItem(`pathmind_progress_${careerTitle.replace(/\s+/g, '_')}`, JSON.stringify(newCompleted));
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center relative z-20">
        <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mono italic drop-shadow-md">Indexing Syllabus...</h2>
      </div>
    );
  }

  // Calculate Progress Percentage safely
  const progressPercent = videos.length > 0 ? Math.round((completedVideos.length / videos.length) * 100) : 0;

  return (
    <div className="pt-10 pb-20 animate-in fade-in duration-700 relative z-20">
      
      {/* HEADER & PROGRESS BAR */}
      <div className="mb-16 text-left glass-card bg-[#020617]/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[48px] shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-3 bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-xl border border-cyan-500/20 mb-6 backdrop-blur-md">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] mono">Direct Training Stream</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight drop-shadow-lg">
              Training <br /><span className="bg-gradient-to-r from-cyan-400 to-violet-600 bg-clip-text text-transparent italic">Modules.</span>
            </h1>
          </div>
          
          {/* THE TRACKER STATS */}
          <div className="bg-[#020617]/80 border border-white/10 p-6 rounded-3xl text-center min-w-[200px] shadow-inner">
            <div className="text-5xl font-black text-white mb-2 tracking-tighter drop-shadow-md">{progressPercent}%</div>
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] mono">Syllabus Complete</div>
          </div>
        </div>

        {/* THE TRACKER BAR */}
        <div className="h-3 bg-[#020617] rounded-full overflow-hidden border border-white/5 shadow-inner relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-violet-600 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
          />
        </div>
      </div>

      {/* VIDEO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {videos.map((video, i) => {
          const isDone = completedVideos.includes(video.id);

          return (
            <motion.div 
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`glass-card rounded-[40px] border overflow-hidden group transition-all duration-300 backdrop-blur-xl relative flex flex-col
                ${isDone 
                  ? 'border-emerald-500/30 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]' 
                  : 'border-white/10 bg-[#020617]/60 hover:border-cyan-500/40 shadow-lg'}
              `}
            >
              {/* Video Player Area */}
              <div className="aspect-video relative bg-black border-b border-white/10 shrink-0">
                <iframe
                  className={`w-full h-full transition-all duration-500 ${isDone ? 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 0 }}
                ></iframe>
                
                {/* Completed Overlay Badge */}
                {isDone && (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-4 right-4 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-2 z-10"
                  >
                    <CheckCircle className="w-3 h-3" /> Mastered
                  </motion.div>
                )}
              </div>

              {/* Video Details Area */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className={`text-xl font-bold transition-colors line-clamp-2 mb-6 ${isDone ? 'text-emerald-400/70' : 'text-white group-hover:text-cyan-400'}`}>
                  {video.title}
                </h3>
                
                {/* Bottom Controls */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${isDone ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-white/5 text-rose-500 border-white/10'}`}>
                      <Youtube className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500 mono max-w-[120px] truncate">
                      {video.channel}
                    </span>
                  </div>

                  {/* MARK AS COMPLETE BUTTON */}
                  <button 
                    onClick={() => toggleComplete(video.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                      isDone 
                        ? 'bg-transparent text-slate-500 border border-slate-700 hover:text-rose-400 hover:border-rose-500/50' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    }`}
                  >
                    {isDone ? 'Undo' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningHub;