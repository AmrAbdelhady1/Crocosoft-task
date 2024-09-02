import { useState } from "react";
import useQuizzes from "../../hooks/use-all-quizzes";

import { QuizCard, QuizFormMenu } from "../../components";
import { Quiz } from "../../types/quiz";

export default function Quizzes() {
  const { quizzes, isLoading, fetchAllQuizzes } = useQuizzes();
  const [openQuizForm, setOpenQuizForm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | undefined>();

  function handleOpenQuizForm() {
    setOpenQuizForm((prevState) => !prevState);
  }

  function handleEditQuiz(quiz: Quiz) {
    setSelectedQuiz(quiz);
    handleOpenQuizForm();
  }

  function handleAddQuiz() {
    setSelectedQuiz(undefined);
    handleOpenQuizForm();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-primary font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-10">
      <div className="flex items-center justify-between gap-2">
        <h1 className="md:text-3xl font-bold">Quizzes</h1>
        <button onClick={handleAddQuiz} className="btn">
          Add New Quiz
        </button>
      </div>

      {quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz?.id} quiz={quiz} onEdit={handleEditQuiz} />
          ))}
        </div>
      ) : (
        <p className="text-center text-primary font-semibold">
          No quizzes found
        </p>
      )}

      <QuizFormMenu
        isOpen={openQuizForm}
        closeMenu={handleOpenQuizForm}
        selectedQuiz={selectedQuiz}
        refresh={fetchAllQuizzes}
      />

      {openQuizForm && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/40 z-40"
          onClick={handleOpenQuizForm}
        />
      )}
    </section>
  );
}
