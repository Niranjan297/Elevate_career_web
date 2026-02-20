import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, CheckCircle2, PlayCircle, BookOpen, Loader2 } from 'lucide-react';
import { fetchCareerVideos } from '../utils/youtubeService';

// --- FIREBASE IMPORTS ---
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

interface LearningHubProps {
  careerTitle: string;
}

const LearningHub: React.FC<LearningHubProps> = ({ careerTitle }) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Firebase instances
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        // Fetch videos from the YouTube Service
        const vids = await fetchCareerVideos(careerTitle);
        setVideos(vids);

        // Load progress from Firebase or LocalStorage
        const user = auth.currentUser;
        const localKey = `pathmind_videos_${careerTitle.replace(/\s+/g, '_')}`;

        if (user) {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists() && docSnap.data().learningProgress?.[careerTitle]) {
            setCompletedVideos(docSnap.data().learningProgress[careerTitle]);
          } else {
            // Check local fallback
            const saved = localStorage.getItem(localKey);
            if (saved) setCompletedVideos(JSON.parse(saved));
          }
        } else {
           const saved = localStorage.getItem(localKey);
           if (saved) setCompletedVideos(JSON.parse(saved));
        }

      } catch (error) {
        console.error("Failed to load videos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [careerTitle]);

  const toggleVideoCompletion = async (videoId: string) => {
    let updated: string[] = [];
    
    setCompletedVideos(prev => {
      updated = prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId];
      return updated;
    });

    const localKey = `pathmind_videos_${careerTitle.replace(/\s+/g, '_')}`;
    localStorage.setItem(localKey, JSON.stringify(updated));

    // Save to Firebase Cloud
    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, {
          learningProgress: {
            [careerTitle]: updated
          }
        }, { merge: true });
      } catch (error) {
        console.error("Error saving video progress to cloud:", error);
      }
    }
  };

  const progressPercentage = videos.length === 0 ? 0 : Math.round((completedVideos.length / videos.length) * 100);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-32 z-20 relative">
        <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mb-6" />
        <h3 className="text-2xl font-black text-white uppercase tracking-widest">Loading Masterclass...</h3>
      </div>
    );
  }

  return (
    <div className="w-full relative z-20 py-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
      
      {/* Header & Progress */}
      <div className="glass-card bg-[#020617]/60 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] border border-rose-500/20 mb-4 mono">
            <Youtube className="w-4 h-4" /> Video Curriculum
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">Learning Hub</h2>
          <p className="text-slate-400">Curated foundational modules for <strong className="text-white">{careerTitle}</strong></p>
        </div>

        <div className="bg-[#020617]/80 p-6 rounded-3xl border border-white/5 min-w-[200px] text-center shadow-inner">
          <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Curriculum Progress</div>
          <div className="text-4xl font-black text-white mb-3">{progressPercentage}%</div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video, idx) => {
          const isCompleted = completedVideos.includes(video.id);
          return (
            <div key={idx} className={`glass-card rounded-3xl overflow-hidden border transition-all duration-300 ${isCompleted ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-[#020617]/60 border-white/10 hover:border-cyan-500/30'}`}>
              
              {/* Video Player Embed */}
              <div className="relative pt-[56.25%] w-full bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Video Controls */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">{video.title}</h3>
                <p className="text-sm text-slate-400 mb-6 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> {video.channel}
                </p>

                <button
                  onClick={() => toggleVideoCompletion(video.id)}
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                    isCompleted 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20' 
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {isCompleted ? (
                    <><CheckCircle2 className="w-5 h-5" /> Module Completed</>
                  ) : (
                    <><PlayCircle className="w-5 h-5" /> Mark as Complete</>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default LearningHub;