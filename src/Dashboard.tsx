import React from 'react';
import { motion } from 'framer-motion';
import { User, CareerProfile, SkillGapReport, ViewState } from './types';

interface DashboardProps {
    user: User | null;
    careerProfile: CareerProfile | null;
    gapReport: SkillGapReport | null;
    onViewChange: (view: ViewState) => void;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, careerProfile, gapReport, onViewChange, onLogout }) => {
    // Brand Colors
    const primaryCyan = "#06b6d4";
    const primaryViolet = "#8b5cf6";
    const bgDeep = "#020617";
    const surfaceDark = "rgba(255, 255, 255, 0.03)";
    const borderDark = "rgba(255, 255, 255, 0.08)";

    return (
        <div className={`flex h-screen overflow-hidden text-slate-100 font-sans`} style={{ backgroundColor: bgDeep }}>
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r flex flex-col z-20" style={{ backgroundColor: bgDeep, borderColor: borderDark }}>
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded flex items-center justify-center text-white shadow-lg shadow-cyan-500/20" style={{ background: `linear-gradient(135deg, ${primaryCyan} 0%, ${primaryViolet} 100%)` }}>
                        <span className="material-symbols-outlined !text-xl">cognition</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tight text-white uppercase italic">Elevate</span>
                        <span className="text-[9px] uppercase tracking-widest font-black" style={{ color: primaryCyan }}>Intelligence v1.0</span>
                    </div>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    <div
                        onClick={() => onViewChange('dashboard')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group"
                        style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: primaryCyan, borderRight: `2px solid ${primaryCyan}` }}
                    >
                        <span className="material-symbols-outlined !text-[20px]">grid_view</span>
                        <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
                    </div>

                    <div
                        onClick={() => onViewChange('assessment')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        <span className="material-symbols-outlined !text-[20px]">assignment</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Assessment</span>
                    </div>

                    <div
                        onClick={() => onViewChange('results')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        <span className="material-symbols-outlined !text-[20px]">psychology</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Career Report</span>
                    </div>

                    <div
                        onClick={() => onViewChange('trends')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        <span className="material-symbols-outlined !text-[20px]">trending_up</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Market Insights</span>
                    </div>

                    <div
                        onClick={() => onViewChange('skill-gap')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        <span className="material-symbols-outlined !text-[20px]">unfold_more_double</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Skill Gap</span>
                    </div>

                    <div
                        onClick={() => onViewChange('execution-plan')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        <span className="material-symbols-outlined !text-[20px]">calendar_today</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Execution Plan</span>
                    </div>

                    <div
                        onClick={onLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 mt-auto"
                    >
                        <span className="material-symbols-outlined !text-[20px]">logout</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Disconnect</span>
                    </div>
                </nav>

                <div className="p-4 border-t" style={{ borderColor: borderDark }}>
                    <button
                        onClick={() => onViewChange('assessment')}
                        className="w-full flex items-center justify-center gap-2 text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-cyan-500/20"
                        style={{ background: `linear-gradient(135deg, ${primaryCyan} 0%, ${primaryViolet} 100%)` }}
                    >
                        <span className="material-symbols-outlined !text-lg">add_circle</span>
                        New Assessment
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="h-16 flex items-center justify-between px-8 border-b backdrop-blur-xl z-10" style={{ backgroundColor: `${bgDeep}cc`, borderColor: borderDark }}>
                    <div className="flex-1 max-w-xl">
                        <div className="relative flex items-center group">
                            <span className="material-symbols-outlined absolute left-3 text-slate-500 group-focus-within:text-cyan-400 transition-colors">search</span>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-500 caret-cyan-400"
                                placeholder="Search intelligence database..."
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-all relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-[#020617]" style={{ backgroundColor: primaryCyan }}></span>
                        </button>

                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-[11px] font-black text-white uppercase tracking-tighter">{user?.name || 'Operative'}</p>
                                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: primaryCyan }}>{careerProfile?.title || 'Mapping Protocol'}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full border flex items-center justify-center overflow-hidden" style={{ borderColor: `${primaryCyan}4d`, backgroundColor: `${primaryCyan}1a` }}>
                                <img
                                    className="w-full h-full object-cover"
                                    src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=guest"}
                                    alt="Profile"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: primaryCyan }}>
                                <span className="material-symbols-outlined !text-xs">bolt</span>
                                Neural Sync Active
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-white italic">Welcome Back, {user?.name?.split(' ')[0] || 'User'}</h1>
                            <p className="text-slate-400 mt-1 text-sm font-medium">Trajectory synchronized with <span className="text-white font-bold italic">AI Market Core</span>. Analyzing growth vectors.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-2xl border backdrop-blur-md" style={{ borderColor: borderDark }}>
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#10b981' }}></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Status: Optimal</span>
                        </div>
                    </div>

                    {/* Quick Action Tiles */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Career Report', icon: 'psychology', desc: 'Neural analysis of your trajectory.', view: 'career-report' },
                            { title: 'Market Intelligence', icon: 'trending_up', desc: 'Live market grounding data.', view: 'trends' },
                            { title: 'Skill Gap DNA', icon: 'target', desc: 'Bridge technical growth areas.', view: 'skill-gap' },
                            { title: 'Resume Builder', icon: 'description', desc: 'Generate ATS-optimized resume.', view: 'resume-builder' }
                        ].map((tile, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5, borderColor: primaryCyan }}
                                onClick={() => onViewChange(tile.view as any)}
                                className="group relative bg-white/5 border p-6 rounded-[24px] transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
                                style={{ borderColor: borderDark }}
                            >
                                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl transition-all group-hover:bg-cyan-500/10" style={{ backgroundColor: 'rgba(6, 182, 212, 0.03)' }}></div>
                                <span className="material-symbols-outlined mb-4 !text-3xl transition-transform group-hover:scale-110 duration-300" style={{ color: primaryCyan }}>{tile.icon}</span>
                                <h3 className="text-lg font-black mb-1 text-white uppercase italic tracking-tighter">{tile.title}</h3>
                                <p className="text-xs text-slate-400 mb-5 font-medium leading-relaxed">{tile.desc}</p>
                                <div className="flex items-center text-[10px] font-black gap-2 uppercase tracking-[0.2em]" style={{ color: primaryCyan }}>
                                    Access Protocol <span className="material-symbols-outlined !text-xs transition-transform group-hover:translate-x-1">arrow_forward</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em] italic pl-1">Vitals Overview</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/5 border rounded-3xl p-6 backdrop-blur-sm" style={{ borderColor: borderDark }}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Compensation Range</p>
                                            <h4 className="text-3xl font-black mt-1 text-white italic tracking-tighter">{careerProfile?.salaryRange || '₹ -- --'}</h4>
                                        </div>
                                        <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                                            <span className="material-symbols-outlined text-emerald-400 !text-xl">payments</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-12 rounded-xl flex items-end px-1 gap-1 overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                        {[30, 45, 35, 60, 50, 80, 100].map((h, i) => (
                                            <div key={i} className="flex-1 rounded-t-lg transition-all duration-1000" style={{ height: `${h}%`, background: i === 6 ? `linear-gradient(to top, ${primaryCyan}, ${primaryViolet})` : `${primaryCyan}33` }}></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white/5 border rounded-3xl p-6 backdrop-blur-sm" style={{ borderColor: borderDark }}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Role Viability</p>
                                            <h4 className="text-3xl font-black mt-1 text-white italic tracking-tighter">{careerProfile?.marketDemand || 'Active'}</h4>
                                        </div>
                                        <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', borderColor: 'rgba(6, 182, 212, 0.2)' }}>
                                            <span className="material-symbols-outlined text-cyan-400 !text-xl">target</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <span>Match Index</span>
                                            <span style={{ color: primaryCyan }}>{careerProfile?.matchScore || 0}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${careerProfile?.matchScore || 0}%` }}
                                                className="h-full rounded-full"
                                                style={{ background: `linear-gradient(90deg, ${primaryCyan}, ${primaryViolet})` }}
                                            ></motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skill Gaps */}
                            <div className="bg-[#ffffff03] border rounded-[32px] overflow-hidden backdrop-blur-sm" style={{ borderColor: borderDark }}>
                                <div className="px-8 py-5 border-b flex items-center justify-between" style={{ borderColor: borderDark }}>
                                    <h3 className="font-black text-xs text-white uppercase tracking-widest italic">Core Skill Gaps</h3>
                                    <span className="text-[9px] font-black uppercase bg-white/5 border px-3 py-1 rounded-full tracking-widest" style={{ color: primaryCyan, borderColor: `${primaryCyan}33` }}>Attention Required</span>
                                </div>
                                <div className="p-0 divide-y" style={{ divideColor: borderDark }}>
                                    {(gapReport?.criticalGaps || []).length > 0 ? (
                                        gapReport?.criticalGaps.slice(0, 3).map((skill, idx) => (
                                            <div key={idx} className="flex items-center gap-5 px-8 py-5 hover:bg-white/5 transition-colors">
                                                <div className="w-11 h-11 border rounded-2xl flex items-center justify-center font-black text-xs italic" style={{ borderColor: `${primaryCyan}33`, color: primaryCyan, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                                    {skill.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-black text-white italic tracking-tight">{skill.name}</p>
                                                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">Missing for {careerProfile?.title}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-white uppercase tracking-tighter">Critical</p>
                                                    <p className="text-[9px] font-black uppercase mt-0.5 animate-pulse" style={{ color: primaryViolet }}>Protocol Gap</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-8 py-12 text-center text-slate-500 text-xs italic font-medium uppercase tracking-widest">
                                            Intelligence Check: No critical gaps found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* roadmap Column */}
                        <div className="space-y-6">
                            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em] italic pl-1">Execution</h2>

                            <div className="bg-white/5 border rounded-[32px] p-8 relative overflow-hidden backdrop-blur-sm" style={{ borderColor: borderDark }}>
                                <div className="absolute top-0 left-0 w-1 h-full shadow-[0_0_15px_rgba(6,182,212,0.3)]" style={{ backgroundColor: primaryCyan }}></div>
                                <h4 className="text-xs font-black mb-8 flex items-center gap-3 text-white uppercase italic tracking-widest">
                                    <span className="material-symbols-outlined !text-cyan-400 !text-lg">hub</span>
                                    Current Protocol
                                </h4>

                                <div className="space-y-10">
                                    {careerProfile?.roadmap.slice(0, 3).map((step, idx) => (
                                        <div key={idx} className="relative pl-7 pb-2 border-l" style={{ borderColor: borderDark }}>
                                            <div className={`absolute -left-[6px] top-0 w-3 h-3 rounded-full transition-all duration-500 ${idx === 0 ? 'animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]' : ''}`} style={{ backgroundColor: idx === 0 ? primaryCyan : 'rgba(255,255,255,0.1)' }}></div>
                                            <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 ${idx === 0 ? '' : 'text-slate-500'}`} style={{ color: idx === 0 ? primaryCyan : '' }}>
                                                {idx === 0 ? 'Executing Now' : `Phase 0${idx + 1}`}
                                            </p>
                                            <p className="text-sm font-black mb-1.5 text-white italic tracking-tight leading-tight">{step.title}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{step.timeframe}</p>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => onViewChange('execution-plan')}
                                    className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 border text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                                    style={{ borderColor: borderDark }}
                                >
                                    Full Strategy Plan
                                </button>
                            </div>

                            {/* Target Readiness */}
                            <div className="bg-white/5 border rounded-[32px] p-8 text-center backdrop-blur-sm shadow-xl" style={{ borderColor: borderDark }}>
                                <div className="relative w-36 h-36 mx-auto mb-6">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle className="text-black/30" cx="72" cy="72" fill="transparent" r="66" stroke="currentColor" strokeWidth="10"></circle>
                                        <motion.circle
                                            initial={{ strokeDashoffset: 414.7 }}
                                            animate={{ strokeDashoffset: 414.7 - (414.7 * (careerProfile?.matchScore || 0)) / 100 }}
                                            cx="72" cy="72"
                                            fill="transparent"
                                            r="66"
                                            stroke="url(#grad)"
                                            strokeWidth="10"
                                            strokeDasharray="414.7"
                                            strokeLinecap="round"
                                        ></motion.circle>
                                        <defs>
                                            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor={primaryCyan} />
                                                <stop offset="100%" stopColor={primaryViolet} />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-black text-white italic tracking-tighter">{careerProfile?.matchScore || 0}%</span>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Ready</span>
                                    </div>
                                </div>
                                <h4 className="font-black text-xs text-white uppercase italic tracking-widest">Protocol Index</h4>
                                <p className="text-xs font-bold mt-2 truncate" style={{ color: primaryCyan }}>{careerProfile?.title || 'Protocol Analysis Required'}</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>


            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${primaryCyan}33;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
