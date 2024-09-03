import FormInput from "./form-input";

import { CirclePlus, CircleX, Trash2 } from "lucide-react";
import { Quiz } from "../../types/quiz";
import useQuizForm from "../../hooks/use-quiz-form";

type QuizFormMenuProps = {
  isOpen: boolean;
  closeMenu: () => void;
  selectedQuiz: Quiz | undefined;
  refresh: () => void;
};

export default function QuizFormMenu({
  isOpen,
  closeMenu,
  selectedQuiz,
  refresh,
}: QuizFormMenuProps) {
  const {
    quizDetails,
    questionAndAnswers,
    quizDetailsHandler,
    onSubmitHandler,
    questionDetailsHandler,
    answerDetailsHandler,
    handleAnswerToggle,
    addNewQuestionInputsHandler,
    removeQuestionInputsHandler,
    removeAnswerInputHandler,
    addNewAnswerInputHandler,
  } = useQuizForm(selectedQuiz);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isValid = await onSubmitHandler();
    if (isValid) {
      closeMenu();
      refresh();
    }
  }

  return (
    <div
      className={`h-screen w-full max-w-[600px] bg-white p-4 fixed z-50 top-0 space-y-6 overflow-y-scroll hide-scrollbar ${
        isOpen ? "right-0" : "-right-full"
      } duration-500`}
    >
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">
          {selectedQuiz ? "Edit" : "Add"} Quiz
        </p>
        <CircleX
          size={28}
          strokeWidth={1.5}
          onClick={closeMenu}
          className="cursor-pointer"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Title"
          name="title"
          value={quizDetails?.title}
          placeholder="Quiz Title"
          onChange={quizDetailsHandler}
        />

        <FormInput
          label="Youtube"
          name="url"
          value={quizDetails?.url}
          placeholder="Youtube Video Link"
          onChange={quizDetailsHandler}
        />

        <FormInput
          label="Description"
          name="description"
          value={quizDetails?.description}
          placeholder="Quiz Description"
          onChange={quizDetailsHandler}
        />

        {questionAndAnswers.map((question, questionIndex) => (
          <div key={questionIndex} className="space-y-4">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-xl">
                Question {questionIndex + 1}
              </p>
              {questionIndex !== 0 && (
                <Trash2
                  className="cursor-pointer"
                  onClick={() => removeQuestionInputsHandler(question?.id)}
                />
              )}
            </div>

            <FormInput
              label="Question"
              name="text"
              placeholder="Enter Question"
              value={question?.text}
              onChange={(e) => questionDetailsHandler(question?.id, e)}
            />

            <FormInput
              label="Feedback True"
              name="feedback_true"
              placeholder="Enter Feedback True"
              value={question?.feedback_true}
              onChange={(e) => questionDetailsHandler(question?.id, e)}
            />

            <FormInput
              label="Feedback False"
              name="feedback_false"
              placeholder="Enter Feedback False"
              value={question?.feedback_false}
              onChange={(e) => questionDetailsHandler(question?.id, e)}
            />

            {question?.answers?.map((answer, index) => (
              <div key={index} className="flex items-center gap-2">
                {index === question?.answers?.length - 1 && (
                  <CirclePlus
                    onClick={() => addNewAnswerInputHandler(question?.id)}
                    cursor={"pointer"}
                  />
                )}
                <input
                  type="text"
                  name="text"
                  value={answer?.text}
                  placeholder="Answer"
                  className="input"
                  onChange={(e) =>
                    answerDetailsHandler(question?.id, answer?.id, e)
                  }
                />
                {index !== 0 && (
                  <Trash2
                    className="cursor-pointer text-red-500"
                    onClick={() =>
                      removeAnswerInputHandler(question?.id, answer?.id)
                    }
                  />
                )}
                <input
                  type="checkbox"
                  name="is_true"
                  checked={answer?.is_true}
                  onChange={() => handleAnswerToggle(question?.id, answer?.id)}
                />
              </div>
            ))}
          </div>
        ))}

        <button
          type="button"
          className="btn"
          onClick={addNewQuestionInputsHandler}
        >
          Add New Question
        </button>

        <button type="submit" className="btn w-full">
          Save
        </button>
      </form>
    </div>
  );
}
