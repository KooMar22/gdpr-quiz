import { useReducer, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useQuizData from "../../hooks/useQuizData";
import quizService from "../../services/quizService";

const quizReducer = (state, action) => {
  switch (action.type) {
    case "SET_QUESTIONS":
      return {
        ...state,
        questions: action.payload,
        totalQuestions: action.payload.length,
        loading: false,
      };
    case "SET_ANSWER":
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [state.currentQuestionIndex]: action.payload,
        },
      };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };
    case "PREVIOUS_QUESTION":
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
      };
    case "FINISH_QUIZ":
      return {
        ...state,
        isFinished: true,
        score: action.payload,
      };
    case "RESET_QUIZ":
      return {
        ...initialState,
        questions: state.questions,
        totalQuestions: state.totalQuestions,
        loading: false,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "SET_SAVING":
      return {
        ...state,
        saving: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  questions: [],
  totalQuestions: 0,
  currentQuestionIndex: 0,
  userAnswers: {},
  isFinished: false,
  score: 0,
  loading: true,
  saving: false,
  error: null,
};

const Quiz = () => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const { questions, loading, error } = useQuizData();

  useEffect(() => {
    if (questions.length > 0) {
      dispatch({ type: "SET_QUESTIONS", payload: questions });
    }
  }, [questions]);

  useEffect(() => {
    if (error) {
      dispatch({ type: "SET_ERROR", payload: error });
    }
  }, [error]);

  const handleAnswerSelect = (answerId) => {
    dispatch({ type: "SET_ANSWER", payload: answerId });
  };

  const handleNextQuestion = () => {
    if (state.currentQuestionIndex < state.totalQuestions - 1) {
      dispatch({ type: "NEXT_QUESTION" });
    }
  };

  const handlePreviousQuestion = () => {
    dispatch({ type: "PREVIOUS_QUESTION" });
  };

  const calculateScore = useCallback(() => {
    return Object.keys(state.userAnswers).reduce((score, questionIndex) => {
      const question = state.questions[questionIndex];
      const correctAnswerId = question.answers.find((a) => a.isCorrect).id;
      return state.userAnswers[questionIndex] === correctAnswerId
        ? score + 1
        : score;
    }, 0);
  }, [state.userAnswers, state.questions]);

  const handleFinishQuiz = async () => {
    const score = calculateScore();

    dispatch({ type: "SET_SAVING", payload: true });

    try {
      await quizService.saveQuizResults({
        score,
        totalQuestions: state.totalQuestions,
        answers: Object.entries(state.userAnswers).map(
          ([questionIndex, answerId]) => ({
            questionId: state.questions[questionIndex].id,
            answerId,
          })
        ),
      });

      dispatch({ type: "FINISH_QUIZ", payload: score });
    } catch (error) {
      console.error("Error saving quiz results:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Greška pri spremanju rezultata kviza",
      });
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  };

  const handleResetQuiz = () => {
    dispatch({ type: "RESET_QUIZ" });
  };

  if (loading) {
    return (
      <div className="quiz">
        <h1>Učitavanje pitanja...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz">
        <h1>Greška pri učitavanju kviza</h1>
        <p>{error}</p>
        <Link to="/" className="btn" id="home-btn">
          Natrag na početnu
        </Link>
      </div>
    );
  }

  if (state.isFinished) {
    return (
      <div className="quiz quiz-results">
        <h1>Rezultati kviza</h1>
        <div className="score-container">
          <p className="score">
            Vaš rezultat: <span>{state.score}</span> / {state.totalQuestions}
          </p>
        </div>
        <div className="quiz-actions">
          <button className="btn" onClick={handleResetQuiz}>
            Ponovi kviz
          </button>
          <Link to="/statistics" className="btn">
            Pogledaj statistiku
          </Link>
        </div>
      </div>
    );
  }

  if (state.questions.length === 0) {
    return (
      <div className="quiz">
        <h1>Nema dostupnih pitanja</h1>
        <Link to="/" className="btn" id="home-btn">
          Natrag na početnu
        </Link>
      </div>
    );
  }

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const selectedAnswerId = state.userAnswers[state.currentQuestionIndex];
  const isLastQuestion =
    state.currentQuestionIndex === state.totalQuestions - 1;
  const allQuestionsAnswered =
    Object.keys(state.userAnswers).length === state.totalQuestions;

  return (
    <div className="quiz">
      <h1>GDPR Kviz</h1>
      <div className="quiz-progress">
        <p>
          Pitanje {state.currentQuestionIndex + 1} od {state.totalQuestions}
        </p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${
                ((state.currentQuestionIndex + 1) / state.totalQuestions) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      <div className="question-container">
        <h2>{currentQuestion.text}</h2>
        <div className="answers-list">
          {currentQuestion.answers.map((answer) => (
            <div
              key={answer.id}
              className={`answer-item ${
                selectedAnswerId === answer.id ? "selected" : ""
              }`}
              onClick={() => handleAnswerSelect(answer.id)}
            >
              {answer.text}
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        {state.currentQuestionIndex > 0 && (
          <button className="btn nav-btn" onClick={handlePreviousQuestion}>
            Prethodno
          </button>
        )}

        {!isLastQuestion ? (
          <button
            className="btn nav-btn"
            onClick={handleNextQuestion}
            disabled={!selectedAnswerId}
          >
            Sljedeće
          </button>
        ) : (
          <button
            className="btn finish-btn"
            onClick={handleFinishQuiz}
            disabled={!allQuestionsAnswered || state.saving}
          >
            {state.saving ? "Spremanje..." : "Završi kviz"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;