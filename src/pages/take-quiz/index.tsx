import { useNavigate } from "react-router-dom";
import useQuizDetails from "../../hooks/use-quiz-details";
import { useState } from "react";
import { BASE_URL } from "../../constants";

export default function TakeQuiz() {
  const { quizDetails } = useQuizDetails();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  function selectAnswerHandler(selectedAnswerId: number) {
    const currentQuestion =
      quizDetails?.questions_answers[currentQuestionIndex];
    const trueAnswerObject = currentQuestion?.answers?.find(
      (answer) => answer.is_true
    );

    if (currentQuestion && !feedback) {
      if (trueAnswerObject?.id === selectedAnswerId) {
        setScore((prevValue) => (prevValue += 1));
        setFeedback(currentQuestion?.feedback_true);
        setIsCorrect(true);
      } else {
        setFeedback(currentQuestion?.feedback_false);
      }
    }
  }

  async function updateQuizScoreHandler() {
    const payload = { ...quizDetails, score };
    try {
      await fetch(`${BASE_URL}/quizzes/${quizDetails?.id}`, {
        body: JSON.stringify(payload),
        method: "PUT",
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function nextQuestionHandler() {
    setFeedback("");
    setIsCorrect(false);
    if (quizDetails?.questions_answers) {
      if (currentQuestionIndex < quizDetails?.questions_answers?.length - 1) {
        setCurrentQuestionIndex((prevValue) => prevValue + 1);
      } else {
        await updateQuizScoreHandler();
        navigate("/");
      }
    }
  }
  return (
    <section className="capitalize space-y-6">
      <div className="flex items-center justify-between">
        <p className="md:text-3xl font-bold">Score: {score}</p>
        <button className="btn" onClick={nextQuestionHandler}>
          Next
        </button>
      </div>

      <p className="font-medium text-lg">
        {quizDetails?.questions_answers[currentQuestionIndex].text}?
      </p>

      {feedback && (
        <p
          className={`btn border !text-black ${
            isCorrect
              ? "border-green-500 !bg-green-100"
              : "border-red-500 !bg-red-100"
          }`}
        >
          {feedback}
        </p>
      )}

      {quizDetails?.questions_answers[currentQuestionIndex].answers.map(
        (ans) => {
          return (
            <button
              key={ans.id}
              className="btn disabled:!bg-gray-600 w-full"
              onClick={() => selectAnswerHandler(ans.id)}
              disabled={!!feedback}
            >
              {ans.text}
            </button>
          );
        }
      )}
    </section>
  );
}
