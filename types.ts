export enum QuestionLevel {
  KNOW = 'Nhận biết',
  UNDERSTAND = 'Thông hiểu',
  APPLY = 'Vận dụng',
}

export interface QuestionMC {
  id: number;
  question: string;
  options: string[];
  answer: string;
  requirement: string;
  level: QuestionLevel;
}

export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE';

export interface Question {
  id: number;
  type: QuestionType;
  content: string;
  correctAnswer: string | boolean;
  options?: string[];
  level?: QuestionLevel;
  requirement?: string;
  // Legacy/Complex TF support
  statements?: { [key: string]: string };
  answers?: { [key: string]: boolean };
  explanations?: { [key: string]: string };
  explanation?: string;
}

export interface SuggestedQuestion {
  id?: number;
  content: string;
  type: QuestionType;
}

export interface QuestionTF {
  id: number;
  question: string;
  answer: boolean;
  requirement: string;
  level: QuestionLevel;
  // Format mới: Câu hỏi Đúng/Sai với 4 phát biểu a, b, c, d
  statements?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  answers?: {
    a: boolean;
    b: boolean;
    c: boolean;
    d: boolean;
  };
  explanations?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
}

export interface MemberAssignment {
    memberName: string;
    mcQuestions: number[];
    tfQuestions: number[];
}