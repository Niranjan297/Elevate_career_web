import { 
  Question, QuestionType, Archetype, CareerStream, 
  CareerBranch, PersonalityTrait, CareerProfile 
} from './types';

/// --- THE ASSESSMENT ENGINE (Psychological & Habit-Based) ---
export const QUESTIONS: Question[] = [
  // --- BUCKET 1: NATURAL INSTINCTS ---
  {
    id: 'q1', text: 'You buy a complicated piece of IKEA furniture. What is your first move?', type: QuestionType.Personality, weight: 2,
    options: [
      { label: 'Read the manual cover-to-cover, organize the screws, and follow the steps.', scores: { trait: { [PersonalityTrait.Theoretical]: 10, [PersonalityTrait.Logical]: 5 }, stream: { [CareerStream.Engineering]: 5 } } },
      { label: 'Throw the manual away, look at the picture on the box, and just start building.', scores: { trait: { [PersonalityTrait.HandsOn]: 10, [PersonalityTrait.RiskTaker]: 5 }, archetype: { [Archetype.TheBuilder]: 10 } } },
      { label: 'Convince your friends or siblings to help you put it together.', scores: { trait: { [PersonalityTrait.Social]: 10 }, archetype: { [Archetype.TheLeader]: 5 }, stream: { [CareerStream.Business]: 5 } } },
      { label: 'Modify the pieces to build something cooler than what’s on the box.', scores: { archetype: { [Archetype.TheCreator]: 10 }, stream: { [CareerStream.Creative]: 5 } } }
    ]
  },
  {
    id: 'q2', text: 'Think back to when you were 10 years old. What absorbed your attention the most?', type: QuestionType.Direction, weight: 3,
    options: [
      { label: 'Taking apart toys to see how they worked, or playing with Legos/puzzles.', scores: { stream: { [CareerStream.Engineering]: 10 }, branch: { [CareerBranch.Mech]: 5, [CareerBranch.CS]: 5 } } },
      { label: 'Drawing, making up stories, or creating your own games.', scores: { stream: { [CareerStream.Creative]: 10 }, branch: { [CareerBranch.Design]: 10 } } },
      { label: 'Trading cards, negotiating rules in games, or organizing the neighborhood kids.', scores: { stream: { [CareerStream.Business]: 10, [CareerStream.Commerce]: 5 }, archetype: { [Archetype.TheLeader]: 10 } } },
      { label: 'Taking care of pets, helping younger kids, or acting as the peacemaker.', scores: { stream: { [CareerStream.Medical]: 10, [CareerStream.Humanities]: 5 }, archetype: { [Archetype.TheCaregiver]: 10 } } }
    ]
  },

  // --- BUCKET 2: SOCIAL DYNAMICS ---
  {
    id: 'q3', text: 'Your friend group is planning a big road trip. What role do you naturally fall into?', type: QuestionType.Personality, weight: 2,
    options: [
      { label: 'The Navigator: I mapped out the exact route, the budget, and the schedule.', scores: { archetype: { [Archetype.TheAnalyst]: 10 }, trait: { [PersonalityTrait.Logical]: 10, [PersonalityTrait.Stable]: 5 } } },
      { label: 'The Hype Person: I made the playlist, brought the energy, and kept everyone laughing.', scores: { stream: { [CareerStream.Creative]: 5 }, trait: { [PersonalityTrait.Social]: 10 } } },
      { label: 'The Driver/Fixer: I just want to control the wheel and handle any flat tires.', scores: { archetype: { [Archetype.TheBuilder]: 10 }, trait: { [PersonalityTrait.Solo]: 5, [PersonalityTrait.HandsOn]: 10 } } },
      { label: 'The Medic: I made sure everyone had snacks, water, and wasn’t getting carsick.', scores: { archetype: { [Archetype.TheCaregiver]: 10 }, trait: { [PersonalityTrait.Empathetic]: 10 } } }
    ]
  },
  {
    id: 'q4', text: 'You are in a heated argument. How do you usually win?', type: QuestionType.DeepDive, weight: 2,
    options: [
      { label: 'I use cold, hard facts and point out the logical flaws in their statement.', scores: { stream: { [CareerStream.Commerce]: 5, [CareerStream.Engineering]: 5 }, branch: { [CareerBranch.Law]: 10 } } },
      { label: 'I appeal to their emotions and try to find a middle ground.', scores: { stream: { [CareerStream.Humanities]: 10 }, trait: { [PersonalityTrait.Empathetic]: 10 } } },
      { label: 'I speak with absolute confidence and charisma until they back down.', scores: { stream: { [CareerStream.Business]: 10 }, branch: { [CareerBranch.Marketing]: 10 } } },
      { label: 'I don’t argue. I just walk away and prove them wrong with my actions.', scores: { trait: { [PersonalityTrait.Solo]: 10, [PersonalityTrait.Stable]: 5 } } }
    ]
  },

  // --- BUCKET 3: PROBLEM SOLVING ---
  {
    id: 'q5', text: 'You encounter a complex puzzle in a video game or an escape room. What goes through your mind?', type: QuestionType.DeepDive, weight: 3,
    options: [
      { label: '"Let me find the underlying pattern or mathematical rule here."', scores: { stream: { [CareerStream.Engineering]: 10 }, branch: { [CareerBranch.CS]: 10 }, trait: { [PersonalityTrait.Theoretical]: 5 } } },
      { label: '"I will just try every possible combination until something clicks."', scores: { trait: { [PersonalityTrait.HandsOn]: 10, [PersonalityTrait.RiskTaker]: 5 } } },
      { label: '"I am going to look at the visual clues and the design of the room for a hint."', scores: { stream: { [CareerStream.Creative]: 10 }, branch: { [CareerBranch.Design]: 10 } } },
      { label: '"I will ask my teammates what they think and coordinate our efforts."', scores: { trait: { [PersonalityTrait.Social]: 10 }, archetype: { [Archetype.TheLeader]: 10 } } }
    ]
  },
  {
    id: 'q6', text: 'When you look at a highly successful company like Apple or Tesla, what fascinates you the most?', type: QuestionType.Direction, weight: 2,
    options: [
      { label: 'The groundbreaking technology and how the physical products actually work.', scores: { stream: { [CareerStream.Engineering]: 10 }, archetype: { [Archetype.TheBuilder]: 10 } } },
      { label: 'The massive profit margins, stock valuation, and global market strategy.', scores: { stream: { [CareerStream.Commerce]: 10, [CareerStream.Business]: 10 }, branch: { [CareerBranch.Finance]: 10 } } },
      { label: 'The sleek aesthetics, the branding, and how it makes people feel.', scores: { stream: { [CareerStream.Creative]: 10 }, branch: { [CareerBranch.Design]: 10, [CareerBranch.Marketing]: 5 } } },
      { label: 'How they organize thousands of employees and manage a global supply chain.', scores: { archetype: { [Archetype.TheLeader]: 10, [Archetype.TheAnalyst]: 5 } } }
    ]
  },

  // --- BUCKET 4: LIFESTYLE & MOTIVATION ---
  {
    id: 'q7', text: 'If money was not an issue, what would your ideal Tuesday look like?', type: QuestionType.Personality, weight: 2,
    options: [
      { label: 'Sitting quietly with a coffee, deeply focused on a personal project or hobby.', scores: { trait: { [PersonalityTrait.Solo]: 10, [PersonalityTrait.Stable]: 5 } } },
      { label: 'Traveling to a new city, meeting strangers, and experiencing something unpredictable.', scores: { trait: { [PersonalityTrait.RiskTaker]: 10 }, archetype: { [Archetype.TheExplorer]: 10 } } },
      { label: 'Volunteering at a shelter, helping a friend out, or giving advice.', scores: { archetype: { [Archetype.TheCaregiver]: 10 }, trait: { [PersonalityTrait.Empathetic]: 10 } } },
      { label: 'Leading a team of passionate people to launch something massive.', scores: { archetype: { [Archetype.TheLeader]: 10 }, trait: { [PersonalityTrait.Social]: 10 } } }
    ]
  },
  {
    id: 'q8', text: 'How do you react to strict rules and heavy structure (like strict school schedules)?', type: QuestionType.Personality, weight: 2,
    options: [
      { label: 'I like it. It gives me a clear framework of what I need to do to succeed.', scores: { trait: { [PersonalityTrait.Stable]: 10, [PersonalityTrait.Logical]: 5 } } },
      { label: 'I hate it. I feel suffocated and constantly want to break or bend the rules.', scores: { trait: { [PersonalityTrait.RiskTaker]: 10 }, archetype: { [Archetype.TheCreator]: 5 } } },
      { label: 'I tolerate it, but I usually find a highly efficient loophole to do less work.', scores: { archetype: { [Archetype.TheAnalyst]: 10 }, trait: { [PersonalityTrait.Theoretical]: 5 } } },
      { label: 'I ignore the rules completely if they don\'t make sense to me.', scores: { archetype: { [Archetype.TheLeader]: 5 }, trait: { [PersonalityTrait.HandsOn]: 5 } } }
    ]
  },

  // --- BUCKET 5: THE ULTIMATE CHOICE ---
  {
    id: 'q9', text: 'Which of these sounds like the absolute worst nightmare job for you?', type: QuestionType.DeepDive, weight: 3,
    options: [
      { label: 'Doing the exact same repetitive data-entry task alone in a cubicle forever.', scores: { trait: { [PersonalityTrait.RiskTaker]: 10, [PersonalityTrait.Social]: 10 } } }, // Hates boredom/isolation
      { label: 'Having to cold-call strangers and aggressively sell them things all day.', scores: { trait: { [PersonalityTrait.Solo]: 10, [PersonalityTrait.Empathetic]: 10 } } }, // Hates aggressive social interaction
      { label: 'Being a manager who has to fire people and deal with endless office drama.', scores: { trait: { [PersonalityTrait.Logical]: 10, [PersonalityTrait.Theoretical]: 10 } } }, // Hates drama/managing emotions
      { label: 'A job with zero creative freedom where you must follow orders blindly.', scores: { archetype: { [Archetype.TheCreator]: 10 }, stream: { [CareerStream.Creative]: 5 } } } // Hates lack of autonomy
    ]
  },
  {
    id: 'q10', text: 'Forget the job title. What is the actual impact you want to have on the world?', type: QuestionType.Direction, weight: 3,
    options: [
      { label: '"I want to invent or build systems that push humanity forward."', scores: { stream: { [CareerStream.Engineering]: 10 }, archetype: { [Archetype.TheBuilder]: 10 } } },
      { label: '"I want to create wealth, build an empire, and have total financial freedom."', scores: { stream: { [CareerStream.Business]: 10, [CareerStream.Commerce]: 10 }, trait: { [PersonalityTrait.RiskTaker]: 5 } } },
      { label: '"I want to leave behind art, stories, or designs that inspire people long after I’m gone."', scores: { stream: { [CareerStream.Creative]: 10 }, archetype: { [Archetype.TheCreator]: 10 } } },
      { label: '"I want to directly heal, protect, or educate people who need help right now."', scores: { stream: { [CareerStream.Medical]: 10, [CareerStream.PublicService]: 10 }, archetype: { [Archetype.TheCaregiver]: 10 } } }
    ]
  }
];
// --- THE MASTER CAREER DATABASE (Multi-Industry) ---
export const CAREER_PROFILES: CareerProfile[] = [
  // --- TECH & ENGINEERING ---
  {
    title: 'AI & Machine Learning Engineer',
    description: 'Design, build, and deploy intelligent algorithms that allow systems to learn from data. You are the architect behind predictive models and neural networks.',
    stream: CareerStream.Engineering,
    branch: CareerBranch.CS,
    personalityFit: Archetype.TheAnalyst,
    salaryRange: '₹12L - ₹25L+',
    timeline: '8-12 Months',
    aiAutomationRisk: 'Low',
    marketDemand: 'Future-Proof',
    matchScore: 0,
    matchReason: [],
    roadmap: [
      { title: 'Master Python & Linear Algebra', description: 'Master Python syntax, Pandas, NumPy, and core math (Calculus, Probability).', timeframe: 'Months 1-3' },
      { title: 'Machine Learning Foundations', description: 'Build models using Scikit-Learn. Understand regression and clustering from scratch.', timeframe: 'Months 4-6' },
      { title: 'Deep Learning & Neural Networks', description: 'Dive into TensorFlow or PyTorch. Build Convolutional Neural Networks (CNNs).', timeframe: 'Months 7-9' },
      { title: 'MLOps & Deployment', description: 'Learn Docker and AWS/GCP to deploy your models into real-world production environments.', timeframe: 'Months 10-12' }
    ],
    requiredSkills: [
      { name: 'Python (Advanced)', importance: 'Critical', estimatedWeeksToLearn: 8 },
      { name: 'Linear Algebra & Calculus', importance: 'Critical', estimatedWeeksToLearn: 6 },
      { name: 'PyTorch / TensorFlow', importance: 'Important', estimatedWeeksToLearn: 10 }
    ]
  },

  // --- COMMERCE & FINANCE ---
  {
    title: 'Investment Banker / Financial Analyst',
    description: 'You analyze market trends, build complex financial models, and advise corporations on mergers, acquisitions, and raising capital. High stakes, high reward.',
    stream: CareerStream.Commerce,
    branch: CareerBranch.Finance,
    personalityFit: Archetype.TheLeader,
    salaryRange: '₹15L - ₹30L+',
    timeline: '12-18 Months',
    aiAutomationRisk: 'Medium',
    marketDemand: 'Competitive',
    matchScore: 0,
    matchReason: [],
    roadmap: [
      { title: 'Financial Accounting', description: 'Master the three core financial statements: Income Statement, Balance Sheet, and Cash Flow.', timeframe: 'Months 1-3' },
      { title: 'Excel & Financial Modeling', description: 'Learn advanced Excel (VLOOKUPs, macros) and build DCF (Discounted Cash Flow) models from scratch.', timeframe: 'Months 4-6' },
      { title: 'Market Valuation & Strategy', description: 'Understand how companies are valued. Study past Mergers & Acquisitions (M&A) case studies.', timeframe: 'Months 7-9' },
      { title: 'Networking & Interviews', description: 'Finance is about who you know. Start aggressively networking and doing mock technical interviews.', timeframe: 'Months 10-12' }
    ],
    requiredSkills: [
      { name: 'Advanced Excel & Macros', importance: 'Critical', estimatedWeeksToLearn: 6 },
      { name: 'Financial Modeling (DCF)', importance: 'Critical', estimatedWeeksToLearn: 8 },
      { name: 'Corporate Valuation', importance: 'Important', estimatedWeeksToLearn: 6 }
    ]
  },

  // --- MEDICAL & PSYCHOLOGY ---
  {
    title: 'Clinical Psychologist',
    description: 'You diagnose and treat mental, emotional, and behavioral disorders. You use deep empathy and scientific frameworks to help people navigate trauma and improve their lives.',
    stream: CareerStream.Medical,
    branch: CareerBranch.Psychology,
    personalityFit: Archetype.TheCaregiver,
    salaryRange: '₹6L - ₹15L',
    timeline: '5-7 Years',
    aiAutomationRisk: 'Low',
    marketDemand: 'Growing',
    matchScore: 0,
    matchReason: [],
    roadmap: [
      { title: 'Foundational Psychology', description: 'Complete your Bachelor’s degree. Understand cognitive, developmental, and abnormal psychology.', timeframe: 'Years 1-3' },
      { title: 'Master’s & Specialization', description: 'Pursue a Master’s degree. Choose a focus area like Clinical, Child, or Cognitive Behavioral Therapy (CBT).', timeframe: 'Years 4-5' },
      { title: 'Supervised Clinical Practice', description: 'Work under a licensed psychologist to gain real-world hours diagnosing and treating patients.', timeframe: 'Year 6' },
      { title: 'Licensing & Certification', description: 'Pass national board exams (like RCI in India) to get your official license to practice independently.', timeframe: 'Year 7' }
    ],
    requiredSkills: [
      { name: 'Cognitive Behavioral Therapy', importance: 'Critical', estimatedWeeksToLearn: 24 },
      { name: 'Active Listening & Empathy', importance: 'Critical', estimatedWeeksToLearn: 12 },
      { name: 'Psychological Assessment', importance: 'Important', estimatedWeeksToLearn: 16 }
    ]
  },

  // --- LAW & PUBLIC SERVICE ---
  {
    title: 'Corporate Lawyer',
    description: 'You protect companies from legal risks, draft ironclad contracts, and navigate complex corporate laws. You are the ultimate shield and strategist for businesses.',
    stream: CareerStream.Commerce,
    branch: CareerBranch.Law,
    personalityFit: Archetype.TheGuardian,
    salaryRange: '₹10L - ₹25L+',
    timeline: '3-5 Years',
    aiAutomationRisk: 'Medium',
    marketDemand: 'Stable',
    matchScore: 0,
    matchReason: [],
    roadmap: [
      { title: 'Legal Foundations (LLB)', description: 'Master constitutional, criminal, and fundamental corporate law. Focus on analytical reading.', timeframe: 'Years 1-3' },
      { title: 'Moot Courts & Debates', description: 'Participate heavily in mock trials. Learn how to argue logically and find loopholes in case files.', timeframe: 'Years 2-4' },
      { title: 'Corporate Internships', description: 'Intern at top-tier law firms. Focus on contract drafting, due diligence, and intellectual property.', timeframe: 'Years 4-5' },
      { title: 'Bar Exam & Firm Placement', description: 'Clear the Bar Council exam and secure a junior associate role at a corporate firm.', timeframe: 'Year 5' }
    ],
    requiredSkills: [
      { name: 'Contract Drafting', importance: 'Critical', estimatedWeeksToLearn: 12 },
      { name: 'Legal Research & Analysis', importance: 'Critical', estimatedWeeksToLearn: 10 },
      { name: 'Negotiation Strategy', importance: 'Important', estimatedWeeksToLearn: 8 }
    ]
  },

  // --- CREATIVE & MEDIA ---
  {
    title: 'Brand Strategist / Creative Director',
    description: 'You dictate how the world perceives a company. You combine psychology, art, and market data to build unforgettable brand identities and ad campaigns.',
    stream: CareerStream.Creative,
    branch: CareerBranch.Marketing,
    personalityFit: Archetype.TheCreator,
    salaryRange: '₹7L - ₹18L',
    timeline: '6-12 Months',
    aiAutomationRisk: 'Low',
    marketDemand: 'Competitive',
    matchScore: 0,
    matchReason: [],
    roadmap: [
      { title: 'Consumer Psychology', description: 'Study why people buy things. Understand behavioral economics and emotional triggers in advertising.', timeframe: 'Months 1-3' },
      { title: 'Visual & Copywriting Basics', description: 'You don\'t need to be a designer, but you must know how to write killer copy and judge good design.', timeframe: 'Months 4-6' },
      { title: 'Data-Driven Marketing', description: 'Learn how to read analytics. Understand SEO, CAC (Customer Acquisition Cost), and ad performance metrics.', timeframe: 'Months 7-9' },
      { title: 'Build a Pitch Portfolio', description: 'Create 3 fake brand redesigns or ad campaigns. Pitch them as if you were presenting to a CEO.', timeframe: 'Months 10-12' }
    ],
    requiredSkills: [
      { name: 'Copywriting & Storytelling', importance: 'Critical', estimatedWeeksToLearn: 8 },
      { name: 'Consumer Behavioral Analysis', importance: 'Critical', estimatedWeeksToLearn: 6 },
      { name: 'Digital Analytics (Google/Meta)', importance: 'Important', estimatedWeeksToLearn: 6 }
    ]
  }
];