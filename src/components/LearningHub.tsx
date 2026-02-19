// src/components/LearningHub.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Loader2, PlayCircle, GraduationCap, ArrowLeft } from 'lucide-react';
import { fetchCareerVideos } from '../utils/youtubeService';

interface LearningHubProps {
  careerTitle: string;
}

const LearningHub: React.FC<LearningHubProps> = ({ careerTitle }) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      const data = await fetchCareerVideos(careerTitle);
      if (isMounted) {
        setVideos(data);
        setLoading(false);
      }
    };
    loadContent();
    return () => { isMounted = false; };
  }, [careerTitle]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mb-6" />
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mono italic">Indexing Syllabus...</h2>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 animate-in fade-in duration-700">
      <div className="mb-16 text-left">
        <div className="inline-flex items-center gap-3 bg-rose-500/10 text-rose-500 px-4 py-2 rounded-xl border border-rose-500/20 mb-6">
          <Youtube className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] mono">Direct Training Stream</span>
        </div>
        <h1 className="text-7xl font-black text-white tracking-tighter leading-tight">
          Training <br /><span className="gradient-text italic">Modules.</span>
        </h1>
        <p className="text-slate-400 text-xl mt-4 font-medium max-w-2xl border-l-2 border-white/10 pl-6">
          The system has localized 4 critical knowledge modules for your trajectory as a <span className="text-white">{careerTitle}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {videos.map((video, i) => (
          <motion.div 
            key={video.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="glass-card rounded-[40px] border border-white/10 overflow-hidden group hover:border-cyan-500/40 transition-all"
          >
            <div className="aspect-video relative bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 0 }}
              ></iframe>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {video.title}
                </h3>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-rose-500">
                  <PlayCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{video.channel}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LearningHub;