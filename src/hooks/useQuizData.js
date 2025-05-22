import { useState, useEffect } from "react";
import quizService from "../services/quizService";

const useQuizData = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await quizService.fetchQuizQuestions();
        setQuestions(data);
      } catch (err) {
        console.error("Error in useQuizData:", err);
        setError(err.message || "Došlo je do greške pri dohvaćanju pitanja");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    getQuestions();
  }, []);

  return { questions, loading, error };
};

export default useQuizData;