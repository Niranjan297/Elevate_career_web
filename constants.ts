
import { Category, Question } from './types';

export const INTEREST_QUESTIONS: Question[] = [
  { id: 'i1', text: 'How much do you enjoy solving complex coding problems?', category: Category.Technology, type: 'rating' },
  { id: 'i2', text: 'I enjoy designing visuals and working with color palettes.', category: Category.Creativity, type: 'rating' },
  { id: 'i3', text: 'I like understanding how markets work and building business strategies.', category: Category.Business, type: 'rating' },
  { id: 'i4', text: 'Helping people solve their problems makes me feel fulfilled.', category: Category.Social, type: 'rating' },
  { id: 'i5', text: 'I love digging into data to find hidden patterns.', category: Category.Research, type: 'rating' },
  { id: 'i6', text: 'I am fascinated by how new technologies like AI are built.', category: Category.Technology, type: 'rating' },
  { id: 'i7', text: 'Writing stories or creating digital art is a hobby of mine.', category: Category.Creativity, type: 'rating' },
  { id: 'i8', text: 'I enjoy leading a team toward a common goal.', category: Category.Business, type: 'rating' },
];

export const APTITUDE_QUESTIONS: Question[] = [
  { id: 'a1', text: 'If All A are B, and All B are C, then All A are C.', category: Category.Logic, type: 'mcq', options: [{ label: 'True', value: 5 }, { label: 'False', value: 0 }] },
  { id: 'a2', text: 'Complete the sequence: 2, 6, 12, 20, ?', category: Category.Numerical, type: 'mcq', options: [{ label: '30', value: 5 }, { label: '28', value: 0 }, { label: '32', value: 0 }] },
  { id: 'a3', text: 'Select the synonym for "Exuberant":', category: Category.Verbal, type: 'mcq', options: [{ label: 'Depressed', value: 0 }, { label: 'Cheerful', value: 5 }, { label: 'Tired', value: 0 }] },
  { id: 'a4', text: 'Analyze this: A car travels 60 miles in 1 hour. How long for 150 miles?', category: Category.Analytical, type: 'mcq', options: [{ label: '2h', value: 0 }, { label: '2.5h', value: 5 }, { label: '3h', value: 0 }] },
  { id: 'a5', text: 'Which word does not belong?', category: Category.Logic, type: 'mcq', options: [{ label: 'Apple', value: 0 }, { label: 'Carrot', value: 5 }, { label: 'Banana', value: 0 }] },
];

export const CAREER_PROFILES = [
  {
    name: 'Software Engineering',
    weights: { [Category.Technology]: 0.5, [Category.Logic]: 0.3, [Category.Numerical]: 0.2 },
  },
  {
    name: 'Data Science',
    weights: { [Category.Research]: 0.4, [Category.Numerical]: 0.3, [Category.Analytical]: 0.3 },
  },
  {
    name: 'UI/UX Design',
    weights: { [Category.Creativity]: 0.6, [Category.Analytical]: 0.2, [Category.Social]: 0.2 },
  },
  {
    name: 'Product Management',
    weights: { [Category.Business]: 0.4, [Category.Social]: 0.3, [Category.Analytical]: 0.3 },
  },
  {
    name: 'Cybersecurity',
    weights: { [Category.Technology]: 0.4, [Category.Logic]: 0.4, [Category.Analytical]: 0.2 },
  },
  {
    name: 'Business Analyst',
    weights: { [Category.Business]: 0.5, [Category.Numerical]: 0.3, [Category.Analytical]: 0.2 },
  }
];
