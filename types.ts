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

export interface QuestionTF {
  id: number;
  question: string;
  answer: boolean;
  requirement: string;
  level: QuestionLevel;
}

export interface MemberAssignment {
    memberName: string;
    mcQuestions: number[];
    tfQuestions: number[];
}