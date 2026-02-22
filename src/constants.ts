import {
  Question, QuestionType, Archetype, CareerStream,
  CareerBranch, PersonalityTrait, CareerProfile
} from './types';

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
    ],
    traits: [PersonalityTrait.Logical, PersonalityTrait.Theoretical, PersonalityTrait.Solo, PersonalityTrait.HandsOn],
    courses: [
      { title: 'Machine Learning A-Z™: AI, Python & R', provider: 'Udemy', link: 'https://www.udemy.com/course/machinelearning/', type: 'Certified' },
      { title: 'Deep Learning Specialization', provider: 'DeepLearning.AI via Coursera', link: 'https://www.coursera.org/specializations/deep-learning', type: 'Certified' },
      { title: 'AI for Everyone', provider: 'DeepLearning.AI', link: 'https://www.coursera.org/learn/ai-for-everyone', type: 'Free' }
    ],
    externalResources: [
      { title: 'Artificial Intelligence - Wikipedia', description: 'Comprehensive foundational overview of AI history and concepts.', link: 'https://en.wikipedia.org/wiki/Artificial_intelligence' },
      { title: 'ArXiv Satellite - ML Research', description: 'Stay updated with the latest peer-reviewed AI research papers.', link: 'https://arxiv.org/list/cs.LG/recent' },
      { title: 'Towards Data Science', description: 'Expert articles on AI, ML, and Data Science implementation.', link: 'https://towardsdatascience.com/' }
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
    ],
    traits: [PersonalityTrait.Logical, PersonalityTrait.RiskTaker, PersonalityTrait.Social, PersonalityTrait.Stable],
    courses: [
      { title: 'The Complete Investment Banking Course', provider: 'Udemy', link: 'https://www.udemy.com/course/investment-banking-course/', type: 'Certified' },
      { title: 'FMVA® Certification', provider: 'Corporate Finance Institute (CFI)', link: 'https://corporatefinanceinstitute.com/', type: 'Certified' },
      { title: 'Financial Markets', provider: 'Yale University via Coursera', link: 'https://www.coursera.org/learn/financial-markets-global', type: 'Free' }
    ],
    externalResources: [
      { title: 'Investment Banking - Wikipedia', description: 'Deep dive into the structural and operational pillars of IB.', link: 'https://en.wikipedia.org/wiki/Investment_banking' },
      { title: 'Investopedia', description: 'The ultimate encyclopedia for financial terms and concepts.', link: 'https://www.investopedia.com/' },
      { title: 'Wall Street Prep', description: 'Real-world skill training for professional financial analysts.', link: 'https://www.wallstreetprep.com/' }
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
    ],
    traits: [PersonalityTrait.Empathetic, PersonalityTrait.Social, PersonalityTrait.Theoretical, PersonalityTrait.Stable],
    courses: [
      { title: 'Introduction to Psychology', provider: 'Udemy / Yale', link: 'https://www.udemy.com/course/introduction-to-psychology/', type: 'Free' },
      { title: 'The Science of Well-Being', provider: 'Yale University', link: 'https://www.coursera.org/learn/the-science-of-well-being', type: 'Free' },
      { title: 'Clinical Psychology Certification', provider: 'University of Queensland', link: 'https://www.edx.org/learn/clinical-psychology', type: 'Certified' }
    ],
    externalResources: [
      { title: 'Clinical Psychology - Wikipedia', description: 'Scientific overview of clinical assessment and treatment methods.', link: 'https://en.wikipedia.org/wiki/Clinical_psychology' },
      { title: 'Psychology Today', description: 'Insights into the human mind and latest psychological research.', link: 'https://www.psychologytoday.com/' },
      { title: 'APA Learning Center', description: 'Professional development resources for psychologists.', link: 'https://www.apa.org/education-career' }
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
    ],
    traits: [PersonalityTrait.Logical, PersonalityTrait.Stable, PersonalityTrait.Social, PersonalityTrait.Theoretical],
    courses: [
      { title: 'Law for Entrepreneurs and Managers', provider: 'Udemy', link: 'https://www.udemy.com/course/law-for-entrepreneurs-and-managers/', type: 'Certified' },
      { title: 'Introduction to Corporate Law', provider: 'UPenn via Coursera', link: 'https://www.coursera.org/learn/corporate-law', type: 'Certified' },
      { title: 'English Common Law', provider: 'University of London', link: 'https://www.coursera.org/learn/commonlaw', type: 'Free' }
    ],
    externalResources: [
      { title: 'Corporate Law - Wikipedia', description: 'Legal framework governing corporations and business entities.', link: 'https://en.wikipedia.org/wiki/Corporate_law' },
      { title: 'Law.com Industry Insights', description: 'Analysis of global legal trends and firm news.', link: 'https://www.law.com/' },
      { title: 'The Legal 500', description: 'Comprehensive guide to the world’s leading law firms.', link: 'https://www.legal500.com/' }
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
    ],
    traits: [PersonalityTrait.Social, PersonalityTrait.RiskTaker, PersonalityTrait.HandsOn, PersonalityTrait.Logical],
    courses: [
      { title: 'Brand Strategy & Management', provider: 'Udemy', link: 'https://www.udemy.com/course/brand-management-branding-strategy/', type: 'Certified' },
      { title: 'Brand Strategy Specialization', provider: 'Section School of Business', link: 'https://www.sectionschool.com/', type: 'Certified' },
      { title: 'Digital Marketing Foundations', provider: 'Google Digital Garage', link: 'https://learndigital.withgoogle.com/digitalgarage', type: 'Free' }
    ],
    externalResources: [
      { title: 'Brand Management - Wikipedia', description: 'The application of marketing techniques to a specific product or brand.', link: 'https://en.wikipedia.org/wiki/Brand_management' },
      { title: 'Behance Branding Gallery', description: 'Visual inspiration from the world\'s top brand designers.', link: 'https://www.behance.net/galleries/branding' },
      { title: 'AdAge Marketer’s Brief', description: 'The latest news and data on brand marketing strategy.', link: 'https://adage.com/' }
    ]
  }
];

/// --- THE ASSESSMENT ENGINE (Psychological & Habit-Based) ---
export const QUESTIONS: Question[] = [
  // --- BUCKET 1: NATURAL INSTINCTS ---
  {
    id: 'q1', text: 'You just downloaded a complex new app or strategy game. What is your first move?', type: QuestionType.Personality, weight: 2,
    options: [
      { label: 'Play the tutorial carefully to understand the mechanics and rules.', scores: { trait: { [PersonalityTrait.Theoretical]: 10, [PersonalityTrait.Logical]: 5 }, stream: { [CareerStream.Engineering]: 5 } } },
      { label: 'Skip the tutorial immediately and figure it out by pushing buttons.', scores: { trait: { [PersonalityTrait.HandsOn]: 10, [PersonalityTrait.RiskTaker]: 5 }, archetype: { [Archetype.TheBuilder]: 10 } } },
      { label: 'Jump straight into multiplayer to see what other people are doing.', scores: { trait: { [PersonalityTrait.Social]: 10 }, archetype: { [Archetype.TheLeader]: 5 }, stream: { [CareerStream.Business]: 5 } } },
      { label: 'Go into the settings to customize my avatar, interface, and layout.', scores: { archetype: { [Archetype.TheCreator]: 10 }, stream: { [CareerStream.Creative]: 5 } } }
    ]
  },
  {
    id: 'q2', text: 'When you completely lose track of time (the "flow state"), what are you usually doing?', type: QuestionType.Direction, weight: 3,
    options: [
      { label: 'Fixing a bug, solving a puzzle, or figuring out how a system works.', scores: { stream: { [CareerStream.Engineering]: 10 }, branch: { [CareerBranch.Mech]: 5, [CareerBranch.CS]: 5 } } },
      { label: 'Designing something visual, editing media, or writing a story.', scores: { stream: { [CareerStream.Creative]: 10 }, branch: { [CareerBranch.Design]: 10 } } },
      { label: 'Researching a new topic, analyzing trends, or mapping out a strategy.', scores: { stream: { [CareerStream.Commerce]: 10, [CareerStream.Business]: 5 }, archetype: { [Archetype.TheAnalyst]: 10 } } },
      { label: 'Having a deep conversation or helping someone work through a problem.', scores: { stream: { [CareerStream.Medical]: 10, [CareerStream.Humanities]: 5 }, archetype: { [Archetype.TheCaregiver]: 10 } } }
    ]
  },

  // --- BUCKET 2: SOCIAL DYNAMICS ---
  {
    id: 'q3', text: 'Your team is falling way behind on a major project. How do you step up?', type: QuestionType.Personality, weight: 2,
    options: [
      { label: 'I completely restructure the timeline and assign clear tasks to everyone.', scores: { archetype: { [Archetype.TheLeader]: 10 }, trait: { [PersonalityTrait.Logical]: 5, [PersonalityTrait.Stable]: 5 } } },
      { label: 'I isolate myself and speed-run the hardest technical parts alone.', scores: { stream: { [CareerStream.Engineering]: 5 }, trait: { [PersonalityTrait.Solo]: 10, [PersonalityTrait.HandsOn]: 10 } } },
      { label: 'I brainstorm a creative shortcut or a better way to present what we have.', scores: { archetype: { [Archetype.TheCreator]: 10 }, stream: { [CareerStream.Creative]: 10 } } },
      { label: 'I check in on my teammates to make sure no one is burning out or panicking.', scores: { archetype: { [Archetype.TheCaregiver]: 10 }, trait: { [PersonalityTrait.Empathetic]: 10 } } }
    ]
  },
  {
    id: 'q4', text: 'You need to convince a group to go with your idea. What is your strategy?', type: QuestionType.DeepDive, weight: 2,
    options: [
      { label: 'I bring data, facts, and a logical breakdown of why my idea is the smartest.', scores: { stream: { [CareerStream.Commerce]: 5, [CareerStream.Engineering]: 5 }, archetype: { [Archetype.TheAnalyst]: 10 } } },
      { label: 'I read the room, find common ground, and make everyone feel heard.', scores: { stream: { [CareerStream.Humanities]: 10 }, trait: { [PersonalityTrait.Empathetic]: 10 } } },
      { label: 'I pitch it with absolute confidence, energy, and a compelling vision.', scores: { stream: { [CareerStream.Business]: 10 }, branch: { [CareerBranch.Marketing]: 10 }, trait: { [PersonalityTrait.Social]: 10 } } },
      { label: 'I just build a quick prototype or example to prove that it works.', scores: { trait: { [PersonalityTrait.HandsOn]: 10 }, archetype: { [Archetype.TheBuilder]: 10 } } }
    ]
  },

  // --- BUCKET 3: PROBLEM SOLVING ---
  {
    id: 'q5', text: 'A sudden crisis hits: the internet drops 10 minutes before a massive deadline. What goes through your mind?', type: QuestionType.DeepDive, weight: 3,
    options: [
      { label: '"Let me check the router logs, restart the DNS, and diagnose the network error."', scores: { stream: { [CareerStream.Engineering]: 10 }, branch: { [CareerBranch.CS]: 10 }, trait: { [PersonalityTrait.Theoretical]: 5 } } },
      { label: '"I will immediately grab my phone, turn on the hotspot, and reroute my connection."', scores: { trait: { [PersonalityTrait.HandsOn]: 10, [PersonalityTrait.RiskTaker]: 5 } } },
      { label: '"I will draft a highly professional emergency email to send the second I get a signal."', scores: { stream: { [CareerStream.Business]: 5 }, branch: { [CareerBranch.Law]: 5 }, archetype: { [Archetype.TheLeader]: 5 } } },
      { label: '"I will quickly call my teammates to coordinate a backup submission plan."', scores: { trait: { [PersonalityTrait.Social]: 10 }, archetype: { [Archetype.TheCaregiver]: 5 } } }
    ]
  },
  {
    id: 'q6', text: 'When you look at a massively successful tech startup, what fascinates you the most?', type: QuestionType.Direction, weight: 2,
    options: [
      { label: 'The complex underlying architecture and the engineering challenges they solved.', scores: { stream: { [CareerStream.Engineering]: 10 }, archetype: { [Archetype.TheBuilder]: 10 } } },
      { label: 'Their revenue models, funding rounds, and global growth strategy.', scores: { stream: { [CareerStream.Commerce]: 10, [CareerStream.Business]: 10 }, branch: { [CareerBranch.Finance]: 10 } } },
      { label: 'The beautiful UI, the brand identity, and how addictive the product feels.', scores: { stream: { [CareerStream.Creative]: 10 }, branch: { [CareerBranch.Design]: 10, [CareerBranch.Marketing]: 5 } } },
      { label: 'How the founders manage a massive team and scale their company culture.', scores: { archetype: { [Archetype.TheLeader]: 10, [Archetype.TheAnalyst]: 5 } } }
    ]
  },

  // --- BUCKET 4: LIFESTYLE & MOTIVATION ---
  {
    id: 'q7', text: 'If money was completely unlimited, what would your ideal Tuesday look like?', type: QuestionType.Personality, weight: 2,
    options: [
      { label: 'Deeply focused on mastering a complex new skill or personal project in a quiet room.', scores: { trait: { [PersonalityTrait.Solo]: 10, [PersonalityTrait.Stable]: 5 } } },
      { label: 'Flying to a new city, chasing a high-stakes opportunity, and risking it all.', scores: { trait: { [PersonalityTrait.RiskTaker]: 10 }, archetype: { [Archetype.TheLeader]: 10 } } },
      { label: 'Mentoring people, funding charities, and actively solving community problems.', scores: { archetype: { [Archetype.TheCaregiver]: 10 }, trait: { [PersonalityTrait.Empathetic]: 10 } } },
      { label: 'Collaborating with brilliant artists or engineers to launch something game-changing.', scores: { archetype: { [Archetype.TheCreator]: 10 }, trait: { [PersonalityTrait.Social]: 10 } } }
    ]
  },
  {
    id: 'q8', text: 'How do you operate when given a project with strict, rigid guidelines?', type: QuestionType.Personality, weight: 2,
    options: [
      { label: 'I thrive. It gives me a clear, logical framework of exactly what needs to be done.', scores: { trait: { [PersonalityTrait.Stable]: 10, [PersonalityTrait.Logical]: 5 } } },
      { label: 'I feel suffocated. I constantly want to bend the rules to make it more unique.', scores: { trait: { [PersonalityTrait.RiskTaker]: 10 }, archetype: { [Archetype.TheCreator]: 5 } } },
      { label: 'I map out the rules, then find the most efficient loophole to do the work faster.', scores: { archetype: { [Archetype.TheAnalyst]: 10 }, trait: { [PersonalityTrait.Theoretical]: 5 } } },
      { label: 'I usually ignore the guidelines if I think my way produces a better end result.', scores: { archetype: { [Archetype.TheLeader]: 5 }, trait: { [PersonalityTrait.HandsOn]: 5 } } }
    ]
  },

  // --- BUCKET 5: THE ULTIMATE CHOICE ---
  {
    id: 'q9', text: 'Which of these sounds like the absolute worst nightmare job for you?', type: QuestionType.DeepDive, weight: 3,
    options: [
      { label: 'Doing the exact same repetitive data-entry task alone in a cubicle every day.', scores: { trait: { [PersonalityTrait.RiskTaker]: 10, [PersonalityTrait.Social]: 10 } } },
      { label: 'Having to cold-call strangers and aggressively sell them products all day.', scores: { trait: { [PersonalityTrait.Solo]: 10, [PersonalityTrait.Empathetic]: 10 } } },
      { label: 'Being a manager who has to fire people and deal with endless office politics.', scores: { trait: { [PersonalityTrait.Logical]: 10, [PersonalityTrait.Theoretical]: 10 } } },
      { label: 'A job with zero creative freedom where you must follow instructions blindly.', scores: { archetype: { [Archetype.TheCreator]: 10 }, stream: { [CareerStream.Creative]: 5 } } }
    ]
  },
  {
    id: 'q10', text: 'Forget the job title for a second. What is the actual impact you want to leave behind?', type: QuestionType.Direction, weight: 3,
    options: [
      { label: '"I want to architect and build digital or physical systems that push humanity forward."', scores: { stream: { [CareerStream.Engineering]: 10 }, archetype: { [Archetype.TheBuilder]: 10 } } },
      { label: '"I want to scale a massive business, generate wealth, and dominate a market."', scores: { stream: { [CareerStream.Business]: 10, [CareerStream.Commerce]: 10 }, trait: { [PersonalityTrait.RiskTaker]: 5 } } },
      { label: '"I want to create designs, content, or media that inspire people and shift culture."', scores: { stream: { [CareerStream.Creative]: 10 }, archetype: { [Archetype.TheCreator]: 10 } } },
      { label: '"I want to protect, heal, or educate people directly and improve their daily lives."', scores: { stream: { [CareerStream.Medical]: 10, [CareerStream.PublicService]: 10 }, archetype: { [Archetype.TheCaregiver]: 10 } } }
    ]
  }
];