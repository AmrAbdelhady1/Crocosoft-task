import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Quiz } from "../types/quiz";
// import { BASE_URL } from "../constants";

const useQuizDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [quizDetails, setQuizDetails] = useState<Quiz | null>(null);

  const fetchQuizDetails = async () => {
    try {
      // const response = await fetch(`${BASE_URL}/quizzes/${params.id}`);
      // const data = await response.json();
      
      const response = localStorage.getItem("quizzes");
      if (response) {
        const data: Quiz = JSON.parse(response).filter(
          (item: Quiz) => item.id === params.id
        )[0];
        setQuizDetails(data);
      }
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  useEffect(() => {
    if (params.id) fetchQuizDetails();
  }, [params]);

  return { quizDetails };
};

export default useQuizDetails;
