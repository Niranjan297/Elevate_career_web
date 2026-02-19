// src/types.ts

// --- LAYER 0: THE ARCHETYPE (The Core Personality) ---
export enum Archetype {
  TheBuilder = 'The Builder',       // Engineers, Architects, Mechanics
  TheAnalyst = 'The Analyst',       // Data Scientists, CAs, Researchers
  TheCaregiver = 'The Caregiver',   // Doctors, Psychologists, HR
  TheLeader = 'The Leader',         // Managers, IAS, Entrepreneurs
  TheCreator = 'The Creator',       // Designers, Writers, Filmmakers
  TheExplorer = 'The Explorer',     // Journalists, Scientists, Pilots
  TheGuardian = 'The Guardian',     // Lawyers, Defense, Cybersecurity
  TheUndefined = 'Undetermined'     // Needs more data
}

// --- LAYER 1: THE BROAD DIRECTION (Stream) ---
export enum CareerStream {
  Engineering = 'Engineering & Tech',
  Medical = 'Medical & Psychology',
  Commerce = 'Finance & Law',
  Creative = 'Arts & Media',
  PublicService = 'Government & Defense',
  Vocational = 'Skilled Trade',
  Business = 'Business & Management',
  Humanities = 'Humanities & Social Sci'
}

// --- LAYER 2: THE SPECIFIC PATH (Branch) ---
export enum CareerBranch {
  // Engineering
  CS = 'Computer Science',
  Mech = 'Mechanical',
  Civil = 'Civil',
  Elec = 'Electronics',
  
  // Medical/Humanities
  MBBS = 'Doctor (MBBS)',
  Psychology = 'Psychology',
  Pharma = 'Pharmacy',
  Teaching = 'Teaching/Education',

  // Commerce/Law
  CA = 'Chartered Accountancy',
  Law = 'Law/Judiciary',
  Finance = 'Investment Banking',
  Marketing = 'Marketing/Sales',

  // Creative/Media
  Design = 'UI/UX & Graphics',
  Journalism = 'Journalism/Media',
  Film = 'Filmmaking',
  
  // Service/Govt
  Hospitality = 'Hotel Management',
  CivilServices = 'UPSC/IAS',
  Defense = 'Defense/Army',
  
  // Vocational
  Technician = 'Technician',
  Freelance = 'Digital Freelance'
}

// --- LAYER 3: WORK PERSONALITY ---
export enum PersonalityTrait {
  Solo = 'Solo Worker',
  Social = 'People Person',
  RiskTaker = 'Risk Taker',
  Stable = 'Stability Seeker',
  HandsOn = 'Hands-On',
  Theoretical = 'Theoretical',
  Empathetic = 'Empathetic',
  Logical = 'Logical'
}

// --- SCORING SYSTEM ---
export interface ScoreImpact {
  archetype?: Partial<Record<Archetype, number>>; // NEW: Archetype points
  stream?: Partial<Record<CareerStream, number>>;
  branch?: Partial<Record<CareerBranch, number>>;
  trait?: Partial<Record<PersonalityTrait, number>>;
}

export interface Option {
  label: string;
  scores: ScoreImpact;
}

// --- QUESTION STRUCTURE ---
export enum QuestionType {
  Direction = 'Direction',
  DeepDive = 'DeepDive',
  Personality = 'Personality'
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  weight: 1 | 2 | 3; // 1=Low, 2=Med, 3=High (Confidence Weighting)
  options: Option[];
}

// --- SKILL MANAGEMENT ---
export type SkillImportance = 'Critical' | 'Important' | 'Optional';

export interface SkillRequirement {
  name: string;
  importance: SkillImportance;
  estimatedWeeksToLearn: number; // Time to close the gap
}

// --- FINAL PROFILE STRUCTURE ---
export interface CareerProfile {
  title: string;
  archetype: Archetype; // The Core Persona
  stream: CareerStream;
  branch: CareerBranch;
  description: string;
  
  // Power Features (Intelligence)
  salaryRange: string;
  timeline: string;
  aiAutomationRisk: 'Low' | 'Medium' | 'High';
  marketDemand: 'Stable' | 'Growing' | 'Future-Proof' | 'Competitive';

  matchScore: number;
  matchReason: string[]; // The "Why?" Engine
  roadmap: string[];
  
  // NEW: Skill Requirements
  requiredSkills: SkillRequirement[]; // The standard to measure against
}

// --- SKILL GAP ANALYSIS ---
export interface SkillGapReport {
  career: string;
  matchedSkills: SkillRequirement[];
  criticalGaps: SkillRequirement[];
  importantGaps: SkillRequirement[];
  optionalGaps: SkillRequirement[];
  totalWeeksToClose: number; // The timeline to become employable
}