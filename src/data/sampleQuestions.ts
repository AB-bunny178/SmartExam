import { Question } from '@/types/exam';

export const sampleQuestions: Question[] = [
  // Easy Questions
  {
    id: '1',
    question: 'Who is known as the Father of the Indian Constitution?',
    options: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
    correctAnswer: 1,
    difficulty: 'easy',
    subject: 'Indian Polity',
    explanation: 'Dr. B.R. Ambedkar is known as the Father of the Indian Constitution as he was the chairman of the drafting committee.'
  },
  {
    id: '2',
    question: 'Which article of the Indian Constitution deals with the Right to Equality?',
    options: ['Article 12', 'Article 14', 'Article 16', 'Article 18'],
    correctAnswer: 1,
    difficulty: 'easy',
    subject: 'Indian Polity',
    explanation: 'Article 14 guarantees equality before law and equal protection of laws.'
  },
  {
    id: '3',
    question: 'The Tropic of Cancer passes through which of the following states?',
    options: ['Maharashtra', 'Gujarat', 'Rajasthan', 'All of the above'],
    correctAnswer: 3,
    difficulty: 'easy',
    subject: 'Geography',
    explanation: 'The Tropic of Cancer passes through Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram.'
  },
  {
    id: '4',
    question: 'Which is the highest peak in India?',
    options: ['Mount Everest', 'Kanchenjunga', 'Nanda Devi', 'K2'],
    correctAnswer: 1,
    difficulty: 'easy',
    subject: 'Geography',
    explanation: 'Kanchenjunga is the highest peak entirely within India at 8,586 meters.'
  },

  // Medium Questions
  {
    id: '5',
    question: 'The concept of "Judicial Review" in the Indian Constitution is borrowed from which country?',
    options: ['United Kingdom', 'United States', 'Canada', 'Australia'],
    correctAnswer: 1,
    difficulty: 'medium',
    subject: 'Indian Polity',
    explanation: 'The concept of Judicial Review is borrowed from the United States Constitution.'
  },
  {
    id: '6',
    question: 'Which amendment act is known as the "Mini Constitution"?',
    options: ['42nd Amendment', '44th Amendment', '52nd Amendment', '73rd Amendment'],
    correctAnswer: 0,
    difficulty: 'medium',
    subject: 'Indian Polity',
    explanation: 'The 42nd Amendment (1976) is called the Mini Constitution due to the extensive changes it made.'
  },
  {
    id: '7',
    question: 'The Western Ghats are also known as:',
    options: ['Sahyadri', 'Nilgiris', 'Cardamom Hills', 'Palani Hills'],
    correctAnswer: 0,
    difficulty: 'medium',
    subject: 'Geography',
    explanation: 'The Western Ghats are locally known as Sahyadri in Maharashtra and Karnataka.'
  },
  {
    id: '8',
    question: 'Which river is known as the "Sorrow of Bengal"?',
    options: ['Ganges', 'Damodar', 'Hooghly', 'Teesta'],
    correctAnswer: 1,
    difficulty: 'medium',
    subject: 'Geography',
    explanation: 'Damodar river was called the "Sorrow of Bengal" due to frequent floods before the construction of dams.'
  },

  // Hard Questions
  {
    id: '9',
    question: 'The doctrine of "Severability" is related to which aspect of the Constitution?',
    options: ['Fundamental Rights', 'Constitutional Amendments', 'Emergency Provisions', 'Judicial Review'],
    correctAnswer: 1,
    difficulty: 'hard',
    subject: 'Indian Polity',
    explanation: 'Severability doctrine allows courts to strike down only the invalid part of a constitutional amendment while keeping the valid parts intact.'
  },
  {
    id: '10',
    question: 'In which case did the Supreme Court establish the "Basic Structure Doctrine"?',
    options: ['Golaknath Case', 'Kesavananda Bharati Case', 'Minerva Mills Case', 'Maneka Gandhi Case'],
    correctAnswer: 1,
    difficulty: 'hard',
    subject: 'Indian Polity',
    explanation: 'The Basic Structure Doctrine was established in the Kesavananda Bharati vs State of Kerala case (1973).'
  },
  {
    id: '11',
    question: 'The concept of "Neo-determinism" in geography is associated with:',
    options: ['Ratzel', 'Huntington', 'Griffith Taylor', 'Semple'],
    correctAnswer: 2,
    difficulty: 'hard',
    subject: 'Geography',
    explanation: 'Griffith Taylor proposed the concept of Neo-determinism or Stop-and-Go determinism.'
  },
  {
    id: '12',
    question: 'Which of the following is NOT a biodiversity hotspot in India?',
    options: ['Western Ghats', 'Eastern Himalayas', 'Indo-Burma', 'Deccan Plateau'],
    correctAnswer: 3,
    difficulty: 'hard',
    subject: 'Geography',
    explanation: 'The Deccan Plateau is not recognized as a biodiversity hotspot. India has four hotspots: Western Ghats, Eastern Himalayas, Indo-Burma, and Sundaland.'
  }
];

export const examConfigs = [
  {
    id: 'upsc-prelims-1',
    title: 'UPSC Prelims Mock Test 1',
    description: 'Comprehensive test covering Indian Polity, Geography, and Current Affairs',
    difficulty: 'easy' as const,
    duration: 30,
    totalQuestions: 6,
    questionsPerLevel: { easy: 4, medium: 2, hard: 0 }
  },
  {
    id: 'upsc-prelims-2',
    title: 'UPSC Prelims Mock Test 2',
    description: 'Intermediate level test for serious aspirants',
    difficulty: 'medium' as const,
    duration: 45,
    totalQuestions: 8,
    questionsPerLevel: { easy: 2, medium: 4, hard: 2 }
  },
  {
    id: 'upsc-prelims-3',
    title: 'UPSC Prelims Mock Test 3',
    description: 'Advanced level test for final preparation',
    difficulty: 'hard' as const,
    duration: 60,
    totalQuestions: 10,
    questionsPerLevel: { easy: 2, medium: 4, hard: 4 }
  }
];