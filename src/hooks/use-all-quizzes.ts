import { useEffect, useState } from "react";
import { Quiz } from "../types/quiz";
// import { BASE_URL } from "../constants";

const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const fetchAllQuizzes = async () => {
    try {
      // const response = await fetch(`${BASE_URL}/quizzes`);
      // const data = await response.json();
      const response = localStorage.getItem("quizzes");
      const data: Quiz[] = response ? JSON.parse(response) : [];
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
