// Types pour les collections Firestore
export interface UserData {
  pseudo: string;
  isMod: boolean;
}

export interface QuizSession {
  moderatorId: string;
  participants: string[];
  status: 'waiting' | 'in_progress' | 'ended';
  quizId: string | null;
  createdAt: Date;
}

export interface Quiz {
  title: string;
  description: string;
  questions: string[]; // Références aux IDs des questions
}

export interface Question {
  text: string;
  options: string[];
  correctAnswers: number[]; // Index des bonnes réponses
  quizId: string;
}

export interface QuizResponse {
  userId: string;
  sessionId: string;
  answers: {
    [questionId: string]: number[]; // Réponses par question
  };
  score: number;
}