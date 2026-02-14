
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
  category: Category;
  type: 'rating' | 'mcq';
  options?: { label: string; value: number }[];
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

export type ViewState = 'landing' | 'login' | 'assessment' | 'results' | 'roadmap' | 'trends';
export interface CareerProfile {
  name: string;
  weights: Partial<Record<Category, number>>;
}