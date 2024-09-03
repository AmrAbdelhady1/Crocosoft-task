import { useEffect, useState } from "react";
// import { BASE_URL } from "../constants";
import { Quiz } from "../types/quiz";

const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const fetchAllQuizzes = async () => {
    try {
      const response = await fetch(`https://restful-api-vercel.vercel.app/posts`);
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setIsloading(true);
    setTimeout(() => {
      fetchAllQuizzes();
      setIsloading(false);
    }, 1000);
  }, []);

  return { quizzes, isLoading, fetchAllQuizzes };
};

export default useQuizzes;
