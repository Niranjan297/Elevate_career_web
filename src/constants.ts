import { 
  Question, QuestionType, CareerStream, CareerBranch, 
  PersonalityTrait, Archetype, CareerProfile 
} from './types';

export const QUESTIONS: Question[] = [
  
  // ========================================================================
  // PHASE 1: CORE NATURE (The "Who are you?" Layer)
  // Weight: 2 (Medium Impact)
  // ========================================================================

  {
    id: 'core_1',
    text: 'A Zombie Apocalypse has started! What is your role in the survivor group?',
    type: QuestionType.Direction,
    weight: 2,
    options: [
      { 
        label: 'The Builder: Fortifying walls, fixing cars, and making weapons.', 
        scores: { 
          archetype: { [Archetype.TheBuilder]: 3 },
          stream: { [CareerStream.Engineering]: 2, [CareerStream.Vocational]: 1 },
          branch: { [CareerBranch.Mech]: 2, [CareerBranch.Civil]: 2 },
          trait: { [PersonalityTrait.HandsOn]: 2 }
        }
      },
      { 
        label: 'The Medic: Healing the wounded and managing medicine supplies.', 
        scores: { 
          archetype: { [Archetype.TheCaregiver]: 3 },
          stream: { [CareerStream.Medical]: 3 },
          branch: { [CareerBranch.MBBS]: 2, [CareerBranch.Pharma]: 1 },
          trait: { [PersonalityTrait.Empathetic]: 2 }
        }
      },
      { 
        label: 'The Leader: Making tough decisions and keeping order.', 
        scores: { 
          archetype: { [Archetype.TheLeader]: 3 },
          stream: { [CareerStream.PublicService]: 2, [CareerStream.Business]: 2 },
          branch: { [CareerBranch.CivilServices]: 2 },
          trait: { [PersonalityTrait.Social]: 2 }
        }
      },
      { 
        label: 'The Scavenger: Finding hidden paths and mapping the area.', 
        scores: { 
          archetype: { [Archetype.TheExplorer]: 2 },
          trait: { [PersonalityTrait.RiskTaker]: 2, [PersonalityTrait.Solo]: 1 }
        }
      }
    ]
  },
  {
    id: 'core_2',
    text: 'You win ₹10 Crores in a lottery. How do you spend your life?',
    type: QuestionType.Direction,
    weight: 2,
    options: [
      { 
        label: 'Build a high-tech lab to invent cool gadgets.', 
        scores: { 
          archetype: { [Archetype.TheBuilder]: 3 },
          stream: { [CareerStream.Engineering]: 3 },
          branch: { [CareerBranch.CS]: 1, [CareerBranch.Elec]: 1 }
        }
      },
      { 
        label: 'Start a business empire and multiply the money.', 
        scores: { 
          archetype: { [Archetype.TheLeader]: 3 },
          stream: { [CareerStream.Business]: 3, [CareerStream.Commerce]: 2 },
          branch: { [CareerBranch.Finance]: 2 }
        }
      },
      { 
        label: 'Travel the world, write books, and make movies.', 
        scores: { 
          archetype: { [Archetype.TheCreator]: 3, [Archetype.TheExplorer]: 2 },
          stream: { [CareerStream.Creative]: 3 },
          branch: { [CareerBranch.Film]: 2, [CareerBranch.Journalism]: 1 }
        }
      },
      { 
        label: 'Open a free hospital or school for the needy.', 
        scores: { 
          archetype: { [Archetype.TheCaregiver]: 3 },
          stream: { [CareerStream.PublicService]: 2, [CareerStream.Medical]: 1 },
          trait: { [PersonalityTrait.Empathetic]: 3 }
        }
      }
    ]
  },
  {
    id: 'core_3',
    text: 'It’s the school Science Fair. Which project sounds most fun?',
    type: QuestionType.Direction,
    weight: 2,
    options: [
      { 
        label: 'Building a working robot or drone.', 
        scores: { 
          archetype: { [Archetype.TheBuilder]: 2 },
          stream: { [CareerStream.Engineering]: 3 },
          branch: { [CareerBranch.Elec]: 2, [CareerBranch.Mech]: 1 }
        }
      },
      { 
        label: 'Coding a website or app for the school.', 
        scores: { 
          archetype: { [Archetype.TheBuilder]: 2 },
          branch: { [CareerBranch.CS]: 3 },
          trait: { [PersonalityTrait.Logical]: 2 }
        }
      },
      { 
        label: 'Analyzing local crime rates and proposing laws.', 
        scores: { 
          archetype: { [Archetype.TheGuardian]: 3 },
          branch: { [CareerBranch.Law]: 2, [CareerBranch.CivilServices]: 1 }
        }
      },
      { 
        label: 'Designing the posters and editing the event video.', 
        scores: { 
          archetype: { [Archetype.TheCreator]: 3 },
          branch: { [CareerBranch.Design]: 2, [CareerBranch.Marketing]: 1 }
        }
      }
    ]
  },
  {
    id: 'core_4',
    text: 'You witness a car accident. What is your first instinct?',
    type: QuestionType.Direction,
    weight: 2,
    options: [
      { 
        label: 'Check if the people are hurt and apply First Aid.', 
        scores: { 
          archetype: { [Archetype.TheCaregiver]: 3 },
          stream: { [CareerStream.Medical]: 3 },
          branch: { [CareerBranch.MBBS]: 2 }
        }
      },
      { 
        label: 'Analyze who was at fault and document the evidence.', 
        scores: { 
          archetype: { [Archetype.TheGuardian]: 2, [Archetype.TheAnalyst]: 1 },
          branch: { [CareerBranch.Law]: 2, [CareerBranch.CivilServices]: 1 }
        }
      },
      { 
        label: 'Check the damage to the engine and the car structure.', 
        scores: { 
          archetype: { [Archetype.TheBuilder]: 1 },
          branch: { [CareerBranch.Mech]: 2 }
        }
      },
      { 
        label: 'Call 911 and manage the crowd.', 
        scores: { 
          archetype: { [Archetype.TheLeader]: 2 },
          trait: { [PersonalityTrait.Social]: 2 }
        }
      }
    ]
  },

  // ========================================================================
  // PHASE 2: WORK PERSONALITY (The "How" Layer)
  // Weight: 1 (Filters out bad fits)
  // ========================================================================

  {
    id: 'pers_1',
    text: 'Ideally, how do you want to work?',
    type: QuestionType.Personality,
    weight: 1,
    options: [
      { 
        label: 'Solo, deep focus, headphones on.', 
        scores: { 
          trait: { [PersonalityTrait.Solo]: 3 },
          branch: { [CareerBranch.CS]: 1, [CareerBranch.Design]: 1, [CareerBranch.Finance]: 1 }
        }
      },
      { 
        label: 'In a busy team, debating and collaborating.', 
        scores: { 
          trait: { [PersonalityTrait.Social]: 3 },
          branch: { [CareerBranch.Marketing]: 2, [CareerBranch.Law]: 1, [CareerBranch.Hospitality]: 1 }
        }
      },
      { 
        label: 'Outdoors, moving around, getting my hands dirty.', 
        scores: { 
          trait: { [PersonalityTrait.HandsOn]: 3 },
          branch: { [CareerBranch.Civil]: 2, [CareerBranch.Defense]: 2, [CareerBranch.Film]: 1 }
        }
      }
    ]
  },
  {
    id: 'pers_2',
    text: 'How do you handle strict rules?',
    type: QuestionType.Personality,
    weight: 1,
    options: [
      { 
        label: 'I follow them perfectly. Structure is safe.', 
        scores: { 
          trait: { [PersonalityTrait.Stable]: 3 },
          branch: { [CareerBranch.CA]: 2, [CareerBranch.CivilServices]: 2, [CareerBranch.Defense]: 2 }
        }
      },
      { 
        label: 'I argue if they don’t make sense.', 
        scores: { 
          trait: { [PersonalityTrait.Logical]: 2 },
          branch: { [CareerBranch.Law]: 3, [CareerBranch.Journalism]: 2 }
        }
      },
      { 
        label: 'I ignore them. I prefer freedom.', 
        scores: { 
          trait: { [PersonalityTrait.RiskTaker]: 2 },
          stream: { [CareerStream.Business]: 1, [CareerStream.Creative]: 2 }
        }
      }
    ]
  },
  {
    id: 'pers_3',
    text: 'How long are you willing to study before earning money?',
    type: QuestionType.Personality,
    weight: 1,
    options: [
      { 
        label: '5-8 Years (Doctor/Scientist level).', 
        scores: { 
          stream: { [CareerStream.Medical]: 3 },
          branch: { [CareerBranch.MBBS]: 2, [CareerBranch.CivilServices]: 1 }
        }
      },
      { 
        label: '4 Years (Standard Degree).', 
        scores: { 
          stream: { [CareerStream.Engineering]: 2, [CareerStream.Commerce]: 2 }
        }
      },
      { 
        label: '1-2 Years (I want to start working ASAP).', 
        scores: { 
          stream: { [CareerStream.Vocational]: 3, [CareerStream.Creative]: 2 },
          branch: { [CareerBranch.Design]: 1, [CareerBranch.Marketing]: 1 }
        }
      }
    ]
  },
  {
    id: 'pers_4',
    text: 'What kind of homework did you actually enjoy?',
    type: QuestionType.Personality,
    weight: 1,
    options: [
      { 
        label: 'Math problems and Logic puzzles.', 
        scores: { 
          archetype: { [Archetype.TheAnalyst]: 2 },
          stream: { [CareerStream.Engineering]: 1, [CareerStream.Commerce]: 1 }
        }
      },
      { 
        label: 'Writing essays and stories.', 
        scores: { 
          archetype: { [Archetype.TheCreator]: 2 },
          branch: { [CareerBranch.Journalism]: 2, [CareerBranch.Law]: 1, [CareerBranch.Psychology]: 1 }
        }
      },
      { 
        label: 'Art projects or making presentations.', 
        scores: { 
          archetype: { [Archetype.TheCreator]: 2 },
          stream: { [CareerStream.Creative]: 2 },
          branch: { [CareerBranch.Marketing]: 1 }
        }
      },
      { 
        label: 'Biology labs and experiments.', 
        scores: { 
          archetype: { [Archetype.TheExplorer]: 2 },
          stream: { [CareerStream.Medical]: 2 }
        }
      }
    ]
  },

  // ========================================================================
  // PHASE 3: DEEP DIVE (The "Specifics" Layer)
  // Weight: 3 (High Signal - Determines Branch)
  // ========================================================================

  {
    id: 'deep_1',
    text: 'Your Wi-Fi stops working. What is your first instinct?',
    type: QuestionType.DeepDive,
    weight: 3,
    options: [
      { 
        label: 'Log into the router admin panel to check settings.', 
        scores: { 
          branch: { [CareerBranch.CS]: 3 },
          trait: { [PersonalityTrait.Logical]: 2 }
        }
      },
      { 
        label: 'Check the physical cables and lights on the box.', 
        scores: { 
          branch: { [CareerBranch.Elec]: 3 },
          trait: { [PersonalityTrait.HandsOn]: 2 }
        }
      },
      { 
        label: 'Call customer support immediately.', 
        scores: { 
          trait: { [PersonalityTrait.Social]: 1 }
        }
      }
    ]
  },
  {
    id: 'deep_2',
    text: 'You see a massive Skyscraper. What do you wonder about?',
    type: QuestionType.DeepDive,
    weight: 3,
    options: [
      { 
        label: ' "How deep is the foundation to hold that weight?" ', 
        scores: { 
          branch: { [CareerBranch.Civil]: 3 },
          archetype: { [Archetype.TheBuilder]: 1 }
        }
      },
      { 
        label: ' "The glass design is beautiful." ', 
        scores: { 
          branch: { [CareerBranch.Design]: 2 } // Architecture
        }
      },
      { 
        label: ' "I wonder how much it cost to build." ', 
        scores: { 
          branch: { [CareerBranch.Finance]: 3 },
          archetype: { [Archetype.TheAnalyst]: 1 }
        }
      }
    ]
  },
  {
    id: 'deep_3',
    text: 'You are watching "Shark Tank". Who do you agree with?',
    type: QuestionType.DeepDive,
    weight: 3,
    options: [
      { 
        label: 'The investor asking about Tech & Patents.', 
        scores: { 
          branch: { [CareerBranch.CS]: 1, [CareerBranch.Mech]: 1 }
        }
      },
      { 
        label: 'The investor asking about Sales & Profits.', 
        scores: { 
          branch: { [CareerBranch.Finance]: 3, [CareerBranch.CA]: 2 }
        }
      },
      { 
        label: 'The investor asking about the Brand Story.', 
        scores: { 
          branch: { [CareerBranch.Marketing]: 3, [CareerBranch.Design]: 1 }
        }
      }
    ]
  },
  {
    id: 'deep_4',
    text: 'In a Hospital Drama, which character are you?',
    type: QuestionType.DeepDive,
    weight: 3,
    options: [
      { 
        label: 'The Surgeon performing complex operations.', 
        scores: { 
          branch: { [CareerBranch.MBBS]: 3 },
          trait: { [PersonalityTrait.HandsOn]: 2, [PersonalityTrait.RiskTaker]: 2 }
        }
      },
      { 
        label: 'The Therapist listening to patients.', 
        scores: { 
          branch: { [CareerBranch.Psychology]: 3 },
          trait: { [PersonalityTrait.Empathetic]: 3 }
        }
      },
      { 
        label: 'The Scientist finding a cure in the lab.', 
        scores: { 
          branch: { [CareerBranch.Pharma]: 3 },
          trait: { [PersonalityTrait.Theoretical]: 3 }
        }
      }
    ]
  },
  {
    id: 'deep_5',
    text: 'You need to win an argument. How do you do it?',
    type: QuestionType.DeepDive,
    weight: 3,
    options: [
      { 
        label: 'I use logic, facts, and evidence.', 
        scores: { 
          branch: { [CareerBranch.Law]: 2, [CareerBranch.CS]: 1 },
          trait: { [PersonalityTrait.Logical]: 2 }
        }
      },
      { 
        label: 'I appeal to emotions and feelings.', 
        scores: { 
          branch: { [CareerBranch.Psychology]: 2, [CareerBranch.Marketing]: 2 },
          trait: { [PersonalityTrait.Empathetic]: 2 }
        }
      },
      { 
        label: 'I speak louder and more confidently.', 
        scores: { 
          branch: { [CareerBranch.CivilServices]: 1, [CareerBranch.Defense]: 1 },
          trait: { [PersonalityTrait.Social]: 1 }
        }
      }
    ]
  },
  {
    id: 'deep_6',
    text: 'You are building a Gaming PC. What matters most?',
    type: QuestionType.DeepDive,
    weight: 3,
    options: [
      { 
        label: 'Installing the OS and optimizing software speed.', 
        scores: { 
          branch: { [CareerBranch.CS]: 3 }
        }
      },
      { 
        label: 'Picking the hardware parts (CPU/GPU) for max power.', 
        scores: { 
          branch: { [CareerBranch.Elec]: 2, [CareerBranch.Mech]: 1 }
        }
      },
      { 
        label: 'Making it look aesthetic with lights and cable management.', 
        scores: { 
          branch: { [CareerBranch.Design]: 2 }
        }
      }
    ]
  },
  {
    id: 'deep_7',
    text: 'Traffic in your city is terrible. How would you fix it?',
    type: QuestionType.DeepDive,
    weight: 3,
    options: [
      { 
        label: 'Build a new flyover or tunnel system.', 
        scores: { 
          branch: { [CareerBranch.Civil]: 3 }
        }
      },
      { 
        label: 'Pass a law to ban cars on weekends.', 
        scores: { 
          branch: { [CareerBranch.CivilServices]: 3, [CareerBranch.Law]: 1 }
        }
      },
      { 
        label: 'Program smart traffic lights that adapt to flow.', 
        scores: { 
          branch: { [CareerBranch.CS]: 2, [CareerBranch.Elec]: 1 }
        }
      }
    ]
  }
];

// ... (Keep your CAREER_PROFILES export the same)

// Minimal career profiles used by the logic engine and UI
export const CAREER_PROFILES: CareerProfile[] = [
  {
    title: 'Computer Science Engineer (CSE)',
    archetype: Archetype.TheBuilder,
    stream: CareerStream.Engineering,
    branch: CareerBranch.CS,
    description: 'Designs and builds software systems and applications.',
    salaryRange: '$40k - $120k',
    timeline: '4 years (Degree) + 1-2 years experience',
    aiAutomationRisk: 'Medium',
    marketDemand: 'Growing',
    matchScore: 0,
    matchReason: [],
    roadmap: ['Learn programming fundamentals', 'Build projects', 'Apply for internships']
  },
  {
    title: 'Mechanical Engineer',
    archetype: Archetype.TheBuilder,
    stream: CareerStream.Engineering,
    branch: CareerBranch.Mech,
    description: 'Works on machines, systems and physical designs.',
    salaryRange: '$35k - $100k',
    timeline: '4 years (Degree)',
    aiAutomationRisk: 'Low',
    marketDemand: 'Stable',
    matchScore: 0,
    matchReason: [],
    roadmap: ['Study core mechanics', 'Practice CAD & prototyping', 'Internship']
  },
  {
    title: 'Doctor (MBBS)',
    archetype: Archetype.TheCaregiver,
    stream: CareerStream.Medical,
    branch: CareerBranch.MBBS,
    description: 'Provides clinical care and medical expertise to patients.',
    salaryRange: '$50k - $200k',
    timeline: '5-8 years (Medical training)',
    aiAutomationRisk: 'Low',
    marketDemand: 'Stable',
    matchScore: 0,
    matchReason: [],
    roadmap: ['Complete medical school', 'House job / residency', 'Specialize']
  }
];