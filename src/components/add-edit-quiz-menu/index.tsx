import { useEffect, useState } from "react";

import FormInput from "./form-input";

import { BASE_URL } from "../../constants";
import { CirclePlus, CircleX, Trash2 } from "lucide-react";
import { QuestionAndAnswers } from "../../types/question-and-answers";
import { Quiz } from "../../types/quiz";

type QuizFormMenuProps = {
  isOpen: boolean;
  closeMenu: () => void;
  selectedQuiz: Quiz | undefined;
  refresh: () => void;
};

const questionAndAnswersValues = {
  id: 1,
  text: "",
  feedback_true: "",
  feedback_false: "",
  answers: [{ id: 1, is_true: true, text: "" }],
};

const quizDetailsValues = {
  title: "",
  url: "",
  description: "",
};

export default function QuizFormMenu({
  isOpen,
  closeMenu,
  selectedQuiz,
  refresh,
}: QuizFormMenuProps) {
  const [quizDetails, setQuizDetails] = useState(quizDetailsValues);
  const [questionAndAnswers, setQuestionAndAnswers] = useState<
    QuestionAndAnswers[]
  >([questionAndAnswersValues]);

  useEffect(() => {
    setQuizDetails({
      title: selectedQuiz?.title ?? "",
      url: selectedQuiz?.url ?? "",
      description: selectedQuiz?.description ?? "",
    });
    setQuestionAndAnswers(
      selectedQuiz?.questions_answers ?? [questionAndAnswersValues]
    );
  }, [selectedQuiz]);

  function quizDetailsHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setQuizDetails((prevValue) => ({
      ...prevValue,
      [event.target.name]: event.target.value,
    }));
  }

  function addNewQuestionInputsHandler() {
    setQuestionAndAnswers((prevValue) => [
      ...prevValue,
      {
        id: questionAndAnswers.length + 1,
        text: "",
        feedback_true: "",
        feedback_false: "",
        answers: [{ id: 1, is_true: true, text: "" }],
      },
    ]);
  }

  function addNewAnswerInputHandler(questionId: number) {
    setQuestionAndAnswers((prevValue) =>
      prevValue.map((item) =>
        item.id === questionId
          ? {
              ...item,
              answers: [
                ...item.answers,
                {
                  id: item.answers.length + 1,
                  is_true: false,
                  text: "",
                },
              ],
            }
          : { ...item }
      )
    );
  }

  function removeAnswerInputHandler(
    questionAndAnswerId: number,
    answerInputId: number
  ) {
    setQuestionAndAnswers((prevValue) => {
      return prevValue.map((item) => {
        if (item.id === questionAndAnswerId) {
          const newAnswerInputs = item.answers.filter(
            (item) => item.id !== answerInputId
          );
          return { ...item, answers: newAnswerInputs };
        } else return item;
      });
    });
  }

  function questionDetailsHandler(
    questionAndAnswerId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setQuestionAndAnswers((prevValue) => {
      return prevValue.map((item) => {
        if (item.id === questionAndAnswerId) {
          return { ...item, [event.target.name]: event.target.value };
        } else return item;
      });
    });
  }

  function answerDetailsHandler(
    questionAndAnswerId: number,
    answerInputId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setQuestionAndAnswers((prevValue) => {
      return prevValue.map((item) => {
        if (item.id === questionAndAnswerId) {
          return {
            ...item,
            answers: item.answers.map((answer) =>
              answer.id === answerInputId
                ? { ...answer, [event.target.name]: event.target.value }
                : { ...answer }
            ),
          };
        } else return item;
      });
    });
  }

  function handleAnswerToggle(questionAndAnswerId: number, answerId: number) {
    setQuestionAndAnswers((prevValue) => {
      return prevValue.map((item) => {
        if (item.id === questionAndAnswerId) {
          const newAnswers = item.answers.map((ans) => {
            return { ...ans, is_true: ans.id === answerId };
          });
          return { ...item, answers: newAnswers };
        } else {
          return item;
        }
      });
    });
  }

  function removeQuestionInputsHandler(questionId: number) {
    setQuestionAndAnswers((prevValue) =>
      prevValue.filter((item) => item.id !== questionId)
    );
  }

  async function createNewQuizHandler() {
    try {
      const newQuizPayload = {
        id: Date.now().toString(),
        title: quizDetails.title,
        description: quizDetails.description,
        url: quizDetails.url,
        created: new Date().toLocaleString(),
        modified: "",
        score: null,
        questions_answers: questionAndAnswers.map((question) => ({
          id: question.id,
          text: question.text,
          feedback_false: question.feedback_false,
          feedback_true: question.feedback_true,
          answers: question.answers
            .filter((answer) => answer.text !== "")
            .map((answer) => ({
              id: answer.id,
              is_true: answer.is_true,
              text: answer.text,
            })),
        })),
      };
      await fetch(`${BASE_URL}/quizzes`, {
        body: JSON.stringify(newQuizPayload),
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function editQuizHandler() {
    try {
      const editQuizPayload = {
        id: selectedQuiz?.id,
        title: quizDetails.title,
        description: quizDetails.description,
        url: quizDetails.url,
        modified: new Date().toLocaleString(),
        created: selectedQuiz?.created,
        score: selectedQuiz?.score,
        questions_answers: questionAndAnswers.map((question) => ({
          id: question.id,
          text: question.text,
          feedback_false: question.feedback_false,
          feedback_true: question.feedback_true,
          answers: question.answers
            .filter((answer) => answer.text !== "")
            .map((answer) => ({
              id: answer.id,
              is_true: answer.is_true,
              text: answer.text,
            })),
        })),
      };
      await fetch(`${BASE_URL}/quizzes/${selectedQuiz?.id}`, {
        body: JSON.stringify(editQuizPayload),
        method: "PUT",
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function onSubmitHandler() {
    if (selectedQuiz) {
      editQuizHandler();
    } else {
      createNewQuizHandler();
    }
    closeMenu();
    refresh();
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

      <div className="space-y-6">
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
      </div>

      <button onClick={onSubmitHandler} className="btn w-full">
        Save
      </button>
    </div>
  );
}
