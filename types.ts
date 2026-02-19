
export enum Category {
  Technology = 'Technology',
  Creativity = 'Creativity',
  Business = 'Business',
  Social = 'Social',
  Research = 'Research',
  Logic = 'Logic',
  Verbal = 'Verbal',
  Numerical = 'Numerical',
  Analytical = 'Analytical'
}

// --- LAYER 0: THE ARCHETYPE (The Core Personality) ---
export enum Archetype {
  TheBuilder = 'The Builder',
  TheAnalyst = 'The Analyst',
  TheCaregiver = 'The Caregiver',
  TheLeader = 'The Leader',
  TheCreator = 'The Creator',
  TheExplorer = 'The Explorer',
  TheGuardian = 'The Guardian',
  TheUndefined = 'Undetermined'
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
  CS = 'Computer Science',
  Mech = 'Mechanical',
  Civil = 'Civil',
  Elec = 'Electronics',
  MBBS = 'Doctor (MBBS)',
  Psychology = 'Psychology',
  Pharma = 'Pharmacy',
  Teaching = 'Teaching/Education',
  CA = 'Chartered Accountancy',
  Law = 'Law/Judiciary',
  Finance = 'Investment Banking',
  Marketing = 'Marketing/Sales',
  Design = 'UI/UX & Graphics',
  Journalism = 'Journalism/Media',
  Film = 'Filmmaking',
  Hospitality = 'Hotel Management',
  CivilServices = 'UPSC/IAS',
  Defense = 'Defense/Army',
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
  archetype?: Partial<Record<Archetype, number>>;
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

export interface QuestionNew {
  id: string;
  text: string;
  type: QuestionType;
  weight: 1 | 2 | 3;
  options: Option[];
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export interface Question {
  id: string;
  text: string;
  category?: Category;
  type: 'rating' | 'mcq' | QuestionType;
  weight?: 1 | 2 | 3;
  options?: { label: string; value?: number; scores?: ScoreImpact }[];
}

export interface SkillEntry {
  name: string;
  level: SkillLevel;
}

export interface AssessmentScores {
  interests: Record<string, number>;
  aptitude: Record<string, number>;
  skills: SkillEntry[];
}

export interface CareerProfile {
  title: string;
  name?: string; // Legacy support
  archetype: Archetype;
  stream: CareerStream;
  branch: CareerBranch;
  description: string;
  salaryRange: string;
  timeline: string;
  aiAutomationRisk: string;
  marketDemand: string;
  matchScore: number;
  matchReason: string[];
  roadmap: string[];
  weights?: Record<string, number>; // Legacy support
}

export interface CareerMatch {
  career: string;
  score: number;
  description: string;
  strengths: string[];
  gaps: string[];
  roadmap: RoadmapStep[];
  resources: Resource[];
}

export interface RoadmapStep {
  phase: string;
  title: string;
  description: string;
  skills: string[];
  imageUrl?: string;
}

export interface Resource {
  name: string;
  url: string;
  type: 'Video' | 'Course' | 'Article';
}

export type ViewState = 'landing' | 'login' | 'assessment' | 'results' | 'roadmap' | 'trends' | 'skill-gap' | 'execution-plan';

