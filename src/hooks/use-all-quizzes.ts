import { useEffect, useState } from "react";
import { BASE_URL } from "../constants";
import { Quiz } from "../types/quiz";

const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const fetchAllQuizzes = async () => {
    setIsloading(true);
    try {
      const response = await fetch(`${BASE_URL}/quizzes`);
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  return { quizzes, isLoading, fetchAllQuizzes };
};

export default useQuizzes;
