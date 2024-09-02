export type Answer = {
  id: number;
  is_true: boolean;
  text: string;
}

export type QuestionAndAnswers = {
  id: number;
  text: string;
  feedback_false: string;
  feedback_true: string;
  answers: Answer[];
}
