import { QuestionAndAnswers } from "./question-and-answers";

export type Quiz = {
  id: number;
  title: string;
  description: string;
  url: string;
  created: string;
  modified: string;
  questions_answers: QuestionAndAnswers[];
  score: number | null;
};
