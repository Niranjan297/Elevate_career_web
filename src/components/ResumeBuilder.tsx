import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, User, Briefcase, GraduationCap,
    Terminal, Download, Share2, Sparkles,
    ChevronRight, ChevronLeft, Plus, Trash2,
    ShieldCheck, BrainCircuit, Globe, Mail, Phone
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CareerProfile } from '../types';

interface ResumeBuilderProps {
    profile: CareerProfile;
}

interface ResumeData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        linkedin: string;
        website: string;
    };
    summary: string;
    experience: Array<{
        id: string;
        company: string;
        role: string;
        period: string;
        description: string;
    }>;
    education: Array<{
        id: string;
        school: string;
        degree: string;
        period: string;
    }>;
    skills: string[];
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ profile }) => {
    const [step, setStep] = useState(0);
    const [resumeData, setResumeData] = useState<ResumeData>({
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            website: '',
        },
        summary: '',
        experience: [],
        education: [],
        skills: profile.requiredSkills.map(s => s.name),
    });

    const previewRef = useRef<HTMLDivElement>(null);

    // AI Generation Simulation for Summary
    useEffect(() => {
        const aiSummary = `Technically proficient ${profile.title} with a deep understanding of ${profile.stream}. Highly adept in ${profile.requiredSkills.slice(0, 3).map(s => s.name).join(', ')}, committed to architecting innovative solutions and driving market-ready excellence. Possess a strategic mindset for problem-solving within ${profile.branch} architectures.`;
        setResumeData(prev => ({ ...prev, summary: aiSummary }));
    }, [profile]);

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [name]: value }
        }));
    };

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, { id: Date.now().toString(), company: '', role: '', period: '', description: '' }]
        }));
    };

    const updateExperience = (id: string, field: string, value: string) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
        }));
    };

    const removeExperience = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };

    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, { id: Date.now().toString(), school: '', degree: '', period: '' }]
        }));
    };

    const updateEducation = (id: string, field: string, value: string) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
        }));
    };

    const removeEducation = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    const downloadPDF = async () => {
        if (!previewRef.current) return;

        // Temporarily apply clean styles for PDF
        const element = previewRef.current;
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Elevate_Resume_${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`);
    };

    const steps = [
        { title: 'Identity', icon: <User className="w-5 h-5" /> },
        { title: 'Narrative', icon: <Sparkles className="w-5 h-5" /> },
        { title: 'Trajectory', icon: <Briefcase className="w-5 h-5" /> },
        { title: 'Academics', icon: <GraduationCap className="w-5 h-5" /> },
        { title: 'Final Review', icon: <FileText className="w-5 h-5" /> }
    ];

    return (
        <div className="w-full relative z-20 py-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">

            {/* Header */}
            <div className="glass-card bg-[#020617]/60 p-8 md:p-12 rounded-[40px] border border-white/10 mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20 mb-6 mono">
                        <BrainCircuit className="w-4 h-4" /> AI Resume Forge
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Architecture of You</h2>
                    <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                        Constructing an ATS-optimized tactical resume for the role of <strong className="text-white italic">{profile.title}</strong>.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 relative z-10">
                    <button
                        onClick={downloadPDF}
                        className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5"
                    >
                        <Download className="w-4 h-4" /> Export Protocol
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

                {/* WIZARD FORM */}
                <div className="space-y-8">

                    {/* Progress Swatch */}
                    <div className="flex justify-between items-center bg-[#020617]/80 p-2 rounded-3xl border border-white/10 backdrop-blur-md">
                        {steps.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setStep(i)}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all ${step === i ? 'bg-indigo-500 text-white font-black' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {s.icon} <span className="hidden md:block text-[9px] uppercase tracking-tighter">{s.title}</span>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass-card bg-[#020617]/40 p-8 rounded-[32px] border border-white/5 space-y-6"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">Personal Protocol</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Full Name</label>
                                        <input name="fullName" value={resumeData.personalInfo.fullName} onChange={handlePersonalInfoChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all outline-none" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Email Address</label>
                                        <input name="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all outline-none" placeholder="john@gmail.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Phone Logic</label>
                                        <input name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all outline-none" placeholder="+91 9999999999" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Geographic Origin</label>
                                        <input name="location" value={resumeData.personalInfo.location} onChange={handlePersonalInfoChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all outline-none" placeholder="Maharashtra, IN" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">LinkedIn Alias</label>
                                        <input name="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalInfoChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all outline-none" placeholder="linkedin.com/in/johndoe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Digital Portfolio</label>
                                        <input name="website" value={resumeData.personalInfo.website} onChange={handlePersonalInfoChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all outline-none" placeholder="johndoe.com" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass-card bg-[#020617]/40 p-8 rounded-[32px] border border-white/5 space-y-6"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-white uppercase italic">Strategic Summary</h3>
                                    <div className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">AI Optimized</div>
                                </div>
                                <textarea
                                    rows={6}
                                    value={resumeData.summary}
                                    onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-6 text-slate-300 focus:border-indigo-500 transition-all outline-none resize-none text-sm leading-relaxed"
                                />

                                <div className="space-y-4 pt-6">
                                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Neural Skills Matched</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeData.skills.map((s, i) => (
                                            <span key={i} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-4 py-2 rounded-xl text-[10px] font-bold">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass-card bg-[#020617]/40 p-8 rounded-[32px] border border-white/5 space-y-6"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-white uppercase italic">Career Trajectory</h3>
                                    <button onClick={addExperience} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {resumeData.experience.map((exp) => (
                                        <div key={exp.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 relative group">
                                            <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Nexus Corp" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none" />
                                                <input value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="Senior Architect" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none" />
                                                <input value={exp.period} onChange={(e) => updateExperience(exp.id, 'period', e.target.value)} placeholder="2022 - Present" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none" />
                                            </div>
                                            <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} placeholder="Engineered high-load React architectures..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-400 outline-none resize-none h-24" />
                                        </div>
                                    ))}
                                    {resumeData.experience.length === 0 && (
                                        <div className="text-center py-10 text-slate-500 text-sm italic">No data logged. Start your trajectory map.</div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass-card bg-[#020617]/40 p-8 rounded-[32px] border border-white/5 space-y-6"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-white uppercase italic">Academic Foundations</h3>
                                    <button onClick={addEducation} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {resumeData.education.map((edu) => (
                                        <div key={edu.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 relative group">
                                            <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} placeholder="Stanford University" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none col-span-2" />
                                                <input value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="M.Sc. Computer Science" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none" />
                                                <input value={edu.period} onChange={(e) => updateEducation(edu.id, 'period', e.target.value)} placeholder="2018 - 2022" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="glass-card bg-emerald-500/5 p-8 rounded-[32px] border border-emerald-500/20">
                                    <div className="flex items-center gap-4 mb-4 text-emerald-400">
                                        <ShieldCheck className="w-8 h-8" />
                                        <h3 className="font-black text-xl uppercase tracking-widest">ATS Integration Complete</h3>
                                    </div>
                                    <p className="text-emerald-400/70 text-sm leading-relaxed">
                                        Your resume has been synthetically aligned with industry standards for <strong className="text-emerald-400 italic">{profile.title}</strong>. Keywords have been optimized for high neural score matching in corporate recruitment systems.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                        <Terminal className="text-indigo-400 mb-2 w-5 h-5" />
                                        <div className="text-[10px] font-black uppercase text-slate-500">Complexity Score</div>
                                        <div className="text-2xl font-black text-white">94/100</div>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                        <Globe className="text-cyan-400 mb-2 w-5 h-5" />
                                        <div className="text-[10px] font-black uppercase text-slate-500">Global Searchability</div>
                                        <div className="text-2xl font-black text-white">Top 2%</div>
                                    </div>
                                </div>

                                <button
                                    onClick={downloadPDF}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Finalize & Export PDF
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setStep(prev => Math.max(0, prev - 1))}
                            className={`flex-1 py-4 rounded-xl border border-white/10 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${step === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5'}`}
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                        <button
                            onClick={() => setStep(prev => Math.min(steps.length - 1, prev + 1))}
                            className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${step === steps.length - 1 ? 'bg-emerald-500/10 text-emerald-400 opacity-30 cursor-not-allowed' : 'bg-white text-black hover:bg-indigo-500 hover:text-white'}`}
                        >
                            Next Phase <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* REAL-TIME PREVIEW */}
                <div className="sticky top-10">
                    <div className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-4 flex items-center gap-3 justify-center">
                        <Sparkles className="w-4 h-4 text-indigo-400" /> Neural Preview Monitor
                    </div>

                    <div className="glass-card bg-white p-0 rounded-[40px] shadow-2xl overflow-hidden border border-white/20 transform scale-[0.95] origin-top">
                        <div ref={previewRef} className="bg-white text-slate-900 p-12 w-full min-h-[800px] flex flex-col font-sans">

                            {/* PDF HEADER */}
                            <div className="border-b-4 border-slate-900 pb-8 mb-10 flex justify-between items-end">
                                <div className="space-y-2">
                                    <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">{resumeData.personalInfo.fullName || 'IDENTITY UNKNOWN'}</h1>
                                    <p className="text-xl font-bold text-indigo-600 tracking-tight">{profile.title}</p>
                                </div>
                                <div className="text-[10px] font-bold text-right space-y-1 uppercase tracking-widest leading-loose">
                                    <div>{resumeData.personalInfo.email}</div>
                                    <div>{resumeData.personalInfo.phone}</div>
                                    <div>{resumeData.personalInfo.location}</div>
                                    <div className="text-slate-400">{resumeData.personalInfo.linkedin}</div>
                                </div>
                            </div>

                            {/* SUMMARY */}
                            <div className="mb-10">
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-indigo-600 border-b border-indigo-100 pb-2">Profile Synthesis</h2>
                                <p className="text-sm leading-relaxed text-slate-700">{resumeData.summary}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-10">

                                {/* SIDEBAR: SKILLS */}
                                <div className="col-span-1 space-y-8">
                                    <div>
                                        <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-indigo-600 border-b border-indigo-100 pb-2">Technical Core</h2>
                                        <ul className="space-y-3">
                                            {resumeData.skills.map((s, i) => (
                                                <li key={i} className="text-[11px] font-bold flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-indigo-600 border-b border-indigo-100 pb-2">Education</h2>
                                        <div className="space-y-6">
                                            {resumeData.education.map((edu) => (
                                                <div key={edu.id} className="space-y-1">
                                                    <div className="text-[11px] font-black uppercase leading-tight">{edu.school || 'ACADEMY'}</div>
                                                    <div className="text-[10px] font-bold text-slate-500 italic">{edu.degree}</div>
                                                    <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest pt-1">{edu.period}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* MAIN: EXPERIENCE */}
                                <div className="col-span-2 space-y-8">
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-indigo-600 border-b border-indigo-100 pb-2">Career Trajectory</h2>
                                    <div className="space-y-10">
                                        {resumeData.experience.map((exp) => (
                                            <div key={exp.id} className="space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-sm font-black uppercase">{exp.role || 'ROLE IDENTIFIER'}</div>
                                                        <div className="text-xs font-bold text-indigo-500">{exp.company || 'ORGANIZATION'}</div>
                                                    </div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">{exp.period}</div>
                                                </div>
                                                <p className="text-[11px] text-slate-600 leading-relaxed italic">{exp.description}</p>
                                            </div>
                                        ))}
                                        {resumeData.experience.length === 0 && (
                                            <div className="py-10 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 text-[10px] font-black uppercase tracking-widest">
                                                Awaiting data entry...
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>

                            {/* FOOTER */}
                            <div className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">
                                <div>Elevate Synthetic Resume Logic</div>
                                <div>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default ResumeBuilder;
