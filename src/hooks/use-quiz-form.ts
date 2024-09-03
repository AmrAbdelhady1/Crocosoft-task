import { useEffect, useState } from "react";

import { Quiz } from "../types/quiz";
import { QuestionAndAnswers } from "../types/question-and-answers";
import { validYoutubeUrlRegex } from "../constants";
// import { BASE_URL } from "../constants";

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

const useQuizForm = (selectedQuiz: Quiz | undefined) => {
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
      // await fetch(`${BASE_URL}/quizzes`, {
      //   body: JSON.stringify(newQuizPayload),
      //   method: "POST",
      // });
      const response = localStorage.getItem("quizzes");
      const data = response ? JSON.parse(response) : [];
      data.push(newQuizPayload);
      localStorage.setItem("quizzes", JSON.stringify(data));
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
      // await fetch(`${BASE_URL}/quizzes/${selectedQuiz?.id}`, {
      //   body: JSON.stringify(editQuizPayload),
      //   method: "PUT",
      // });
      const response = localStorage.getItem("quizzes");
      if (response) {
        const data = JSON.parse(response);
        const updatedData = data.map((item: Quiz) => {
          if (item.id === editQuizPayload?.id) {
            return { ...editQuizPayload };
          }
          return item;
        });
        localStorage.setItem("quizzes", JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function onSubmitHandler() {
    if (quizDetails.url.match(validYoutubeUrlRegex)) {
      if (selectedQuiz) {
        editQuizHandler();
      } else {
        createNewQuizHandler();
      }

      return true;
    } else {
      alert("Please enter a valid youtube url");
      return false;
    }
  }

  return {
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
  };
};

export default useQuizForm;
