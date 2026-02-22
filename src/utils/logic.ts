import { QUESTIONS, CAREER_PROFILES } from '../constants';
import { CareerBranch, CareerProfile, CareerStream, PersonalityTrait, SkillGapReport, SkillRequirement } from '../types';

interface Scoreboard {
  streams: Record<string, number>;
  branches: Record<string, number>;
  archetypes: Record<string, number>;
  traits: Record<string, number>;
}

export const calculateCareerPath = (userAnswers: Record<string, number>): CareerProfile[] => {

  // 1. Initialize Scoreboard
  const scores: Scoreboard = {
    streams: {},
    branches: {},
    archetypes: {},
    traits: {}
  };

  const addPoints = (target: Record<string, number>, incoming: Partial<Record<string, number>> | undefined, weight: number) => {
    if (!incoming) return;
    Object.entries(incoming).forEach(([key, value]) => {
      target[key] = (target[key] || 0) + (value * weight);
    });
  };

  // 2. Process Answers
  Object.entries(userAnswers).forEach(([questionId, optionIndex]) => {
    const question = QUESTIONS.find(q => q.id === questionId);
    if (!question) return;

    const selectedOption = question.options[optionIndex];
    const weight = question.weight || 1;

    addPoints(scores.streams, selectedOption.scores.stream, weight);
    addPoints(scores.branches, selectedOption.scores.branch, weight);
    addPoints(scores.traits, selectedOption.scores.trait, weight);
    addPoints(scores.archetypes, (selectedOption.scores as any).archetype, weight);
  });

  const totalMaxScore = QUESTIONS.reduce((acc, q) => acc + (q.weight || 1) * 20, 0);

  // 3. Find Matches for ALL profiles
  const allMatches = CAREER_PROFILES.map(profile => {
    let rawScore = 0;

    // Vector 1: Stream Alignment (Weight: 1.0)
    rawScore += (scores.streams[profile.stream] || 0);

    // Vector 2: Branch Alignment (Weight: 1.2 - Higher specificity)
    rawScore += (scores.branches[profile.branch] || 0) * 1.2;

    // Vector 3: Archetype Alignment (Weight: 1.5 - High psychological validity)
    rawScore += (scores.archetypes[profile.personalityFit] || 0) * 1.5;

    // Vector 4: Trait Alignment (Weight: 0.8 - Complementary)
    if (profile.traits) {
      profile.traits.forEach(trait => {
        rawScore += (scores.traits[trait] || 0) * 0.8;
      });
    }

    // Calculate Confidence % using a sigmoid-like scaling
    // We want a match of 0 points to be ~30% and a perfect match towards 99%
    const normalizedScore = Math.min(Math.max(Math.round((rawScore / totalMaxScore) * 100), 40), 99);

    // Explanation Engine
    const reasons: string[] = [];
    const dominantTrait = Object.entries(scores.traits).sort(([, a], [, b]) => b - a)[0];

    if (scores.archetypes[profile.personalityFit] > 15) {
      reasons.push(`Perfectly aligns with your "${profile.personalityFit}" behavioral archetype.`);
    }

    if (dominantTrait && profile.traits?.includes(dominantTrait[0] as any)) {
      reasons.push(`Matches your dominant strength in ${dominantTrait[0]}.`);
    }

    if (scores.streams[profile.stream] > 10) {
      reasons.push(`Strong compatibility with your interest in ${profile.stream}.`);
    }

    // Roadmap Adapter
    const detailedRoadmap = profile.roadmap.map((step: any, index: number) => {
      if (typeof step === 'string') {
        return {
          title: step,
          description: `Master the core fundamentals of ${step.toLowerCase()}.`,
          timeframe: `Months ${index * 2 + 1}-${index * 2 + 2}`
        };
      }
      return step;
    });

    return {
      ...profile,
      roadmap: detailedRoadmap,
      matchScore: normalizedScore,
      matchReason: reasons.slice(0, 3) // Keep top 3 reasons
    } as CareerProfile;
  });

  // 4. Sort and return top 3
  return allMatches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
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