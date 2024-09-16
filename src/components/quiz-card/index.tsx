import { Quiz } from "../../types/quiz";
import { Link } from "react-router-dom";

type CardProps = {
  quiz: Quiz;
  onEdit: (quiz: Quiz) => void;
};

export default function QuizCard({ quiz, onEdit }: CardProps) {
  console.log(quiz);
  return (
    <div className="flex flex-col space-y-1.5 p-6 rounded-xl border shadow text-gray-500 capitalize">
      <p className="font-semibold leading-none tracking-tight text-xl text-black">
        {quiz.title}
      </p>

      <p>{quiz.description}</p>

      <p>Created At: {quiz.created}</p>

      {quiz?.modified && (
        <p>Modified At: {quiz.modified}</p>
      )}

      {quiz.score !== null && (
        <p>
          Score: {quiz.score} / {quiz.questions_answers.length}
        </p>
      )}

      <div className="flex items-end gap-2 w-full pt-4 flex-grow">
        <Link to={`/quiz/${quiz.id}`} className="btn w-full !py-1 !text-base">
          Take Quiz
        </Link>
        <button onClick={() => onEdit(quiz)} className="btn w-full !py-1 !text-base">
          Edit Quiz
        </button>
      </div>
    </div>
  );
}
