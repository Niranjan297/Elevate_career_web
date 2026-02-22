import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Search,
    Bell,
    Settings,
    Share2,
    Download,
    DollarSign,
    Shield,
    AlertCircle,
    MapPin,
    ArrowRight,
    ChevronRight,
    Filter
} from 'lucide-react';

interface MarketInsightsProps {
    query?: string;
    careerProfile?: any;
    onBack?: () => void;
    setView?: (v: any) => void;
}

const MarketInsights: React.FC<MarketInsightsProps> = ({ query = "AI & Machine Learning Engineer", careerProfile, onBack, setView }) => {
    const [activeTab, setActiveTab] = useState('1Y');

    // Dynamically derive stats from careerProfile if available
    const stats = [
        {
            label: 'MEDIAN SALARY',
            value: careerProfile?.salaryRange || '$142,500',
            change: '+5.2%',
            isPositive: true,
            icon: <DollarSign className="w-5 h-5" />,
            subtext: 'Based on 12k+ recent listings',
            color: 'cyan'
        },
        {
            label: '5-YEAR GROWTH',
            value: careerProfile?.marketDemand === 'Future-Proof' ? '+24%' : '+15%',
            change: 'Above Avg',
            isPositive: true,
            icon: <TrendingUp className="w-5 h-5" />,
            subtext: 'Projection based on industry shifts',
            color: 'emerald'
        },
        {
            label: 'AUTOMATION RISK',
            value: careerProfile?.aiAutomationRisk || 'Low',
            change: 'Resilient',
            isPositive: true,
            icon: <Shield className="w-5 h-5" />,
            subtext: '12% task automation probability',
            color: 'orange'
        }
    ];

    const hotspots = [
        { city: 'San Francisco, CA', velocity: 'High', velocityVal: 90, salary: '$185,000', competition: 'INTENSE', compColor: 'orange' },
        { city: 'Austin, TX', velocity: 'Fast', velocityVal: 70, salary: '$155,000', competition: 'MODERATE', compColor: 'cyan' },
        { city: 'Berlin, DE', velocity: 'Steady', velocityVal: 45, salary: '€95,000', competition: 'LOW', compColor: 'emerald' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#0b0c0e] text-slate-100 font-sans pb-20">
            {/* Top Header */}
            <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-[#0b0c0e]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={onBack}>
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black tracking-tight uppercase hidden md:block">Elevate</span>
                    </div>

                    <div className="relative flex-1 max-w-md hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search roles, skills, or markets"
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs w-full focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-4 md:gap-8 items-center mr-4 hidden md:flex">
                        <span onClick={() => setView?.('dashboard')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white cursor-pointer transition-colors">Dashboard</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 border-b-2 border-indigo-400 pb-1 cursor-pointer">Market Insights</span>
                        <span onClick={() => setView?.('skill-gap')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white cursor-pointer transition-colors">Skill Gap</span>
                        <span onClick={() => setView?.('learning-hub')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white cursor-pointer transition-colors">Resources</span>
                    </div>

                    <button className="p-2 text-slate-400 hover:bg-white/5 rounded-full relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0b0c0e]"></span>
                    </button>
                    <Settings className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
                    <span>Dashboard</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-300">Market Intelligence Insights</span>
                </div>

                {/* Title Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">Market Intelligence Insights</h1>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="material-symbols-outlined !text-xs">calendar_today</span>
                            Last updated: Oct 24, 2023 • Data sourced from Global Labor Indexes
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <Download className="w-4 h-4" /> Export Report
                        </button>
                    </div>
                </div>

                {/* Top Intelligence Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="group bg-white/5 border border-white/10 p-6 md:p-8 rounded-[24px] hover:border-white/20 transition-all relative overflow-hidden">
                            <div className={`absolute top-0 right-0 p-6 opacity-20 text-${stat.color}-500`}>
                                {stat.icon}
                            </div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{stat.label}</div>
                            <div className="flex items-baseline gap-3 mb-1">
                                <div className="text-3xl md:text-4xl font-black text-white">{stat.value}</div>
                                <div className={`text-xs font-bold ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {stat.isPositive ? '↗' : '↘'} {stat.change}
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 italic mt-2">{stat.subtext}</div>
                            <div className="mt-6 w-full h-1 relative overflow-hidden rounded-full bg-white/5">
                                <div className={`absolute left-0 h-full w-[40%] bg-${stat.color}-500 opacity-50`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Intelligence Body */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
                    {/* Demand Trends Chart Box */}
                    <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Demand Trends</h3>
                                <p className="text-sm text-slate-500">Hiring volume and role availability over time</p>
                            </div>
                            <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                                {['1M', '6M', '1Y', 'ALL'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${activeTab === tab ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mock Chart Area */}
                        <div className="h-[400px] w-full relative group">
                            {/* Tooltip Mockup */}
                            <div className="absolute top-1/4 left-[55%] z-20 bg-slate-900/90 border border-indigo-500/50 p-4 rounded-xl backdrop-blur-md shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">July 2023</div>
                                <div className="text-white font-bold">Demand: 4.2k</div>
                                <div className="text-emerald-400 text-[10px] font-bold">+18% YoY</div>
                            </div>

                            {/* Svg Path for Chart */}
                            <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,350 Q100,340 200,300 T400,200 T600,150 T800,120 L1000,80 L1000,400 L0,400 Z"
                                    fill="url(#chartGrad)"
                                />
                                <path
                                    d="M0,350 Q100,340 200,300 T400,200 T600,150 T800,120 L1000,80"
                                    fill="none"
                                    stroke="#4f46e5"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                            </svg>

                            {/* X-Axis labels */}
                            <div className="flex justify-between items-center mt-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                                {['JAN', 'MAR', 'MAY', 'JUL', 'SEP', 'NOV'].map(m => <span key={m}>{m}</span>)}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Hiring Giants */}
                        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                            <h3 className="text-lg font-bold text-white mb-8">Hiring Giants</h3>
                            <div className="space-y-6 mb-8">
                                {[
                                    { name: 'Apex Dynamics', openings: '142 Openings', color: 'bg-indigo-500/20 text-indigo-400' },
                                    { name: 'NextGen Labs', openings: '89 Openings', color: 'bg-emerald-500/20 text-emerald-400' },
                                    { name: 'Quantum Core', openings: '64 Openings', color: 'bg-orange-500/20 text-orange-400' }
                                ].map((co, i) => (
                                    <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-all">
                                        <div className={`w-10 h-10 rounded-xl ${co.color} flex items-center justify-center font-black text-sm`}>
                                            {co.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{co.name}</div>
                                            <div className="text-[10px] text-slate-500">{co.openings}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">
                                View all hiring companies
                            </button>
                        </div>

                        {/* Skill Gap Alert */}
                        <div className="bg-indigo-600 rounded-[32px] p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform"></div>
                            <h3 className="text-lg font-black text-white mb-4">Skill Gap Alert</h3>
                            <p className="text-sm text-indigo-100 mb-8 leading-relaxed">
                                Markets are shifting towards 'Generative AI Architecture'. Update your profile to stay ahead.
                            </p>
                            <button
                                onClick={() => setView?.('skill-gap')}
                                className="w-full bg-white text-indigo-600 font-black uppercase tracking-widest py-3.5 rounded-2xl text-[10px] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Analyze My Skills
                            </button>
                            {/* Decorative Bolt */}
                            <div className="absolute bottom-4 right-4 text-white opacity-20 transform rotate-12">
                                <TrendingUp className="w-12 h-12" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hotspots Table */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Regional Market Hotspots</h3>
                        <button className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 group">
                            View Global Map <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                    <th className="px-8 py-6">Market Location</th>
                                    <th className="px-8 py-6">Hiring Velocity</th>
                                    <th className="px-8 py-6">Avg. Salary Offer</th>
                                    <th className="px-8 py-6">Competition Level</th>
                                    <th className="px-8 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {hotspots.map((row, i) => (
                                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-4 h-4 text-indigo-500" />
                                                <span className="font-bold text-white">{row.city}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${row.velocityVal}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-300">{row.velocity}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-white">{row.salary}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 bg-${row.compColor}-500/10 text-${row.compColor}-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-${row.compColor}-500/20`}>
                                                {row.competition}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="text-xs font-black text-indigo-400 hover:text-white transition-colors">Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Footer Branding */}
            <footer className="max-w-7xl mx-auto w-full px-8 py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    © 2026 Elevate Intel • Privacy Policy • Data Methodology
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">All Systems Operational</span>
                </div>
            </footer>
        </div>
    );
};

export default MarketInsights;
