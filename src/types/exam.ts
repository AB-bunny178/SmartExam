export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  explanation?: string;
}

export interface ExamConfig {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // minutes
  totalQuestions: number;
  questionsPerLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  timeSpent: number;
}

export interface ExamSession {
  id: string;
  examConfigId: string;
  questions: Question[];
  startTime: Date;
  endTime?: Date;
  answers: UserAnswer[];
  currentQuestionIndex: number;
  isCompleted: boolean;
}

export interface ExamResult {
  id: string;
  examConfigId: string;
  examTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage
  timeSpent: number; // minutes
  completedAt: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  performanceByLevel: {
    easy: { correct: number; total: number };
    medium: { correct: number; total: number };
    hard: { correct: number; total: number };
  };
}

export interface UserProgress {
  totalExamsTaken: number;
  averageScore: number;
  strongSubjects: string[];
  weakSubjects: string[];
  recentResults: ExamResult[];
}