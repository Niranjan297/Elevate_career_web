import { QUESTIONS, CAREER_PROFILES } from '../constants';
import { CareerBranch, CareerProfile, CareerStream, PersonalityTrait, SkillGapReport, SkillRequirement } from '../types';

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
  const totalWeight = QUESTIONS.reduce((acc, q) => acc + ((q as any).weight || 1), 0);
  const normalizedScore = Math.min(Math.max(Math.round((maxScore / Math.max(1, totalWeight)) * 10) + 50, 40), 99);

  // 7. SMART ADAPTER: Upgrade Roadmap Strings to Detailed Objects
  // This ensures the new Tactical UI works flawlessly even if your database uses old strings
  const detailedRoadmap = bestProfile.roadmap.map((step: any, index: number) => {
    if (typeof step === 'string') {
      return {
        title: step,
        description: `Dedicate specific focus to mastering the core fundamentals of ${step.toLowerCase()} before advancing to the next phase. Build practical projects to solidify this knowledge.`,
        timeframe: `Months ${index * 2 + 1}-${index * 2 + 2}` // Automatically creates "Months 1-2", "Months 3-4", etc.
      };
    }
    return step; // If it's already an object, leave it alone
  });

  return {
    ...bestProfile,
    roadmap: detailedRoadmap, // Inject the upgraded roadmap
    matchScore: normalizedScore,
    matchReason: reasons
  } as CareerProfile & { matchReason?: string[] };
};

export const analyzeSkillGap = (userSkills: string[], targetProfile: CareerProfile): SkillGapReport => {
  const matched: SkillRequirement[] = [];
  const critical: SkillRequirement[] = [];
  const important: SkillRequirement[] = [];
  const optional: SkillRequirement[] = [];
  
  let totalWeeks = 0;

  // Normalize user skills for easy comparison (lowercase, trim)
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());

  targetProfile.requiredSkills.forEach(skill => {
    // Check if the user already has this skill
    const hasSkill = normalizedUserSkills.includes(skill.name.toLowerCase().trim());

    if (hasSkill) {
      matched.push(skill);
    } else {
      // If missing, sort it into the correct gap bucket and add to timeline
      if (skill.importance === 'Critical') {
        critical.push(skill);
        totalWeeks += skill.estimatedWeeksToLearn;
      } else if (skill.importance === 'Important') {
        important.push(skill);
        totalWeeks += skill.estimatedWeeksToLearn;
      } else if (skill.importance === 'Optional') {
        optional.push(skill);
        // We typically don't add optional skills to the baseline timeline
      }
    }
  });

  return {
    career: targetProfile.title,
    matchedSkills: matched,
    criticalGaps: critical,
    importantGaps: important,
    optionalGaps: optional,
    totalWeeksToClose: totalWeeks
  };
};