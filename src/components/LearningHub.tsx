import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, CheckCircle2, PlayCircle, BookOpen, Loader2, Award, Globe, ExternalLink, GraduationCap } from 'lucide-react';
import { fetchCareerVideos } from '../utils/youtubeService';
import { CareerProfile } from '../types';

// --- FIREBASE IMPORTS ---
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

interface LearningHubProps {
  profile: CareerProfile;
}

const getPlatformIcon = (provider: string) => {
  const p = provider.toLowerCase();
  if (p.includes('udemy')) return "https://www.vectorlogo.zone/logos/udemy/udemy-icon.svg";
  if (p.includes('coursera')) return "https://www.vectorlogo.zone/logos/coursera/coursera-icon.svg";
  if (p.includes('google')) return "https://www.vectorlogo.zone/logos/google/google-icon.svg";
  if (p.includes('wikipedia')) return "https://www.vectorlogo.zone/logos/wikipedia/wikipedia-icon.svg";
  if (p.includes('linkedin')) return "https://www.vectorlogo.zone/logos/linkedin/linkedin-icon.svg";
  if (p.includes('edx')) return "https://www.vectorlogo.zone/logos/edx/edx-icon.svg";
  if (p.includes('yale') || p.includes('university')) return "https://www.vectorlogo.zone/logos/framer/framer-icon.svg";
  return null;
};

const LearningHub: React.FC<LearningHubProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'courses' | 'sites'>('videos');
  const [videos, setVideos] = useState<any[]>([]);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const careerTitle = profile.title;

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
        const localKey = `elevate_videos_${careerTitle.replace(/\s+/g, '_')}`;

        if (user) {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists() && docSnap.data().learningProgress?.[careerTitle]) {
            setCompletedVideos(docSnap.data().learningProgress[careerTitle]);
          } else {
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

    const localKey = `elevate_videos_${careerTitle.replace(/\s+/g, '_')}`;
    localStorage.setItem(localKey, JSON.stringify(updated));

    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, { learningProgress: { [careerTitle]: updated } }, { merge: true });
      } catch (error) { console.error("Error saving progress:", error); }
    }
  };

  const videoProgress = videos.length === 0 ? 0 : Math.round((completedVideos.length / videos.length) * 100);

  return (
    <div className="w-full relative z-20 py-10 animate-in fade-in slide-in-from-bottom-10 duration-700">

      {/* Header Section */}
      <div className="glass-card bg-[#020617]/60 backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-white/10 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-cyan-500/20 mb-6 mono">
            <GraduationCap className="w-4 h-4" /> Academic Ecosystem
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Mastery Hub</h2>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Personalized curriculum for <strong className="text-white italic">{careerTitle}</strong>.
            From foundational logic to certified expertise.
          </p>
        </div>

        {/* Unified Tab Switcher */}
        <div className="bg-[#020617]/50 p-2 rounded-2xl border border-white/10 flex flex-wrap gap-2 relative z-10">
          {[
            { id: 'videos', label: 'Free Content', icon: <Youtube className="w-4 h-4" /> },
            { id: 'courses', label: 'Certified Courses', icon: <Award className="w-4 h-4" /> },
            { id: 'sites', label: 'Expert Reference', icon: <Globe className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* VIDEO SECTION */}
        {activeTab === 'videos' && (
          <motion.div key="videos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                <Youtube className="text-rose-500 w-6 h-6" /> Curated Masterclass
              </h3>
              <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progress: {videoProgress}%</span>
                <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-rose-500" initial={{ width: 0 }} animate={{ width: `${videoProgress}%` }} />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Scanning Global Index...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {videos.map((video, idx) => {
                  const isCompleted = completedVideos.includes(video.id);
                  return (
                    <div key={idx} className={`glass-card rounded-[32px] overflow-hidden border transition-all duration-500 ${isCompleted ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-[#020617]/60 border-white/10 hover:border-cyan-500/30 shadow-xl'}`}>
                      <div className="relative pt-[56.25%] w-full bg-black">
                        <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${video.id}`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      </div>
                      <div className="p-8">
                        <h4 className="text-xl font-bold text-white mb-3 line-clamp-1 leading-tight">{video.title}</h4>
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm text-slate-400 flex items-center gap-2 font-medium">
                            <BookOpen className="w-4 h-4 text-cyan-400" /> {video.channel}
                          </p>
                          <button
                            onClick={() => toggleVideoCompletion(video.id)}
                            className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all ${isCompleted ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
                          >
                            {isCompleted ? <><CheckCircle2 className="w-4 h-4" /> Done</> : <><PlayCircle className="w-4 h-4" /> Complete</>}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* COURSES SECTION */}
        {activeTab === 'courses' && (
          <motion.div key="courses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 px-4">
              <Award className="text-amber-500 w-6 h-6" /> Industry Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.courses?.map((course, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedCourse(course)}
                  className="glass-card bg-[#020617]/60 p-8 rounded-[32px] border border-white/10 hover:border-amber-500/30 transition-all group flex flex-col justify-between shadow-xl cursor-pointer"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(course.provider) && (
                          <img src={getPlatformIcon(course.provider)!} alt="Logo" className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all" />
                        )}
                        <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${course.type === 'Certified' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'}`}>
                          {course.type}
                        </div>
                      </div>
                      <Award className="text-slate-600 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <h4 className="text-2xl font-black text-white mb-2 leading-tight">{course.title}</h4>
                    <p className="text-slate-400 text-sm font-medium mb-8">Provider: {course.provider}</p>
                  </div>
                  <div className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 group-hover:bg-amber-500 group-hover:text-black transition-all">
                    Explore Platforms <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SITES SECTION */}
        {activeTab === 'sites' && (
          <motion.div key="sites" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 px-4">
              <Globe className="text-blue-500 w-6 h-6" /> Information Architectures
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.externalResources?.map((res, idx) => (
                <div key={idx} className="glass-card bg-[#020617]/60 p-8 rounded-[32px] border border-white/10 hover:border-blue-500/30 transition-all group shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase italic">{res.title}</h4>
                    {getPlatformIcon(res.title) && (
                      <img src={getPlatformIcon(res.title)!} alt="Logo" className="w-5 h-5 object-contain opacity-50 group-hover:opacity-100 transition-all" />
                    )}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">{res.description}</p>
                  <a href={res.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">
                    Visit Website <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PLATFORM SELECTION MODAL */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto py-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#020617] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"></div>

              <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-amber-500/20 mb-6 mono">
                  Domain Master
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">Global Certification Hub</h3>
                <p className="text-slate-400">Select a platform to explore specialized courses for <br /><strong className="text-white italic">{selectedCourse.title}</strong></p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { name: 'Coursera', icon: 'coursera', url: `https://www.coursera.org/search?query=${encodeURIComponent(selectedCourse.title)}` },
                  { name: 'edX', icon: 'edx', url: `https://www.edx.org/search?q=${encodeURIComponent(selectedCourse.title)}` },
                  { name: 'Udemy', icon: 'udemy', url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(selectedCourse.title)}` },
                  { name: 'Google Career Certificates', icon: 'google', url: `https://www.google.com/search?q=google+career+certificates+${encodeURIComponent(selectedCourse.title)}` },
                  { name: 'LinkedIn Learning', icon: 'linkedin', url: `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(selectedCourse.title)}` }
                ].map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <img src={getPlatformIcon(platform.icon)!} alt={platform.name} className="w-8 h-8 object-contain" />
                      <span className="text-white font-bold tracking-tight">{platform.name}</span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                className="w-full mt-10 py-4 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-colors"
              >
                Close Portal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningHub;
