import { QUESTIONS, CAREER_PROFILES } from '../constants';
import { CareerBranch, CareerProfile, CareerStream, PersonalityTrait } from '../types';

interface Scoreboard {
  streams: Record<string, number>;
  branches: Record<string, number>;
  traits: Record<string, number>;
}

export const calculateCareerPath = (userAnswers: Record<string, number>): CareerProfile => {
  
  // 1. Initialize Scoreboard
  const scores: Scoreboard = {
    streams: {},
    branches: {},
    traits: {}
  };

  const addPoints = (target: Record<string, number>, incoming: Partial<Record<string, number>> | undefined, weight: number) => {
    if (!incoming) return;
    Object.entries(incoming).forEach(([key, value]) => {
      // MULTIPLY BY WEIGHT (Confidence System)
      target[key] = (target[key] || 0) + (value * weight);
    });
  };

  // 2. Process Answers
  Object.entries(userAnswers).forEach(([questionId, optionIndex]) => {
    const question = QUESTIONS.find(q => q.id === questionId);
    if (!question) return;

    const selectedOption = question.options[optionIndex];
    const weight = (question as any).weight || 1; 

    addPoints(scores.streams, selectedOption.scores.stream, weight);
    addPoints(scores.branches, selectedOption.scores.branch, weight);
    addPoints(scores.traits, selectedOption.scores.trait, weight);
  });

  // 3. REJECTION LOGIC (The "Safety Valve")
  // We filter out careers that fundamentally clash with the user's personality.
  
  const riskScore = scores.traits[PersonalityTrait.RiskTaker] || 0;
  const stableScore = scores.traits[PersonalityTrait.Stable] || 0;
  const socialScore = scores.traits[PersonalityTrait.Social] || 0;
  const soloScore = scores.traits[PersonalityTrait.Solo] || 0;

  let validProfiles = CAREER_PROFILES;

  // Rule 1: If user HATES risk (Stable > Risk + 5), remove Business
  if (stableScore > riskScore + 5) {
    validProfiles = validProfiles.filter(p => p.stream !== CareerStream.Business);
  }

  // Rule 2: If user is extremely Solo (Solo > Social + 5), remove Hospitality/Sales
  if (soloScore > socialScore + 5) {
    validProfiles = validProfiles.filter(p => p.branch !== CareerBranch.Marketing);
  }

  // 4. Find Best Fit among valid profiles
  // Formula: Stream + Branch (archetype removed to match current data model)
  let bestProfile = validProfiles[0];
  let maxScore = -Infinity;

  validProfiles.forEach(profile => {
    let score = 0;
    score += (scores.streams[profile.stream] || 0);
    score += (scores.branches[profile.branch] || 0);

    if (score > maxScore) {
      maxScore = score;
      bestProfile = profile;
    }
  });

  // 5. EXPLANATION ENGINE (Generate "Why?")
  const reasons: string[] = [];
  
  // Role Reason
  reasons.push(`Detected optimal role: "${bestProfile.title}" based on your responses.`);

  // Trait Reason
  const dominantTrait = Object.entries(scores.traits).sort(([,a], [,b]) => b - a)[0];
  if (dominantTrait) {
    reasons.push(`Your strongest trait is "${dominantTrait[0]}", a key skill for this career.`);
  }

  // Work Style Reason
  if (scores.traits[PersonalityTrait.Solo] > scores.traits[PersonalityTrait.Social]) {
    reasons.push("You prefer independent work with high focus.");
  } else {
    reasons.push("You thrive in collaborative, team-based environments.");
  }

  // 6. Calculate Confidence %
  // Based on how "Dominant" the winner was compared to the total possible points
  const totalWeight = QUESTIONS.reduce((acc, q) => acc + ((q as any).weight || 1), 0);
  // Normalize between 40-99 depending on dominance
  const normalizedScore = Math.min(Math.max(Math.round((maxScore / Math.max(1, totalWeight)) * 10) + 50, 40), 99);

  return {
    ...bestProfile,
    matchScore: normalizedScore,
    matchReason: reasons
  } as CareerProfile & { matchReason?: string[] };
};