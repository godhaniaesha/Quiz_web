// src/components/Quiz.js
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db_getQuizById, db_resetQuizState, db_submitQuiz } from "../redux/slice/quiz.slice";

export default function Quiz() {
  const dispatch = useDispatch();
  const { currentQuiz, loading, error } = useSelector((state) => state.quiz);

  // Local UI state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime] = useState(new Date().toISOString());
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  // ✅ Fetch quiz on mount
  useEffect(() => {
    const quizId = localStorage.getItem("quizId");
    if (quizId) {
      dispatch(db_resetQuizState());
      dispatch(db_getQuizById(quizId));
    } else {
      window.location.href = "/login";
    }
  }, [dispatch]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(db_resetQuizState());
    };
  }, [dispatch]);

  // ✅ Load saved state from localStorage
  useEffect(() => {
    const savedQuizState = localStorage.getItem("quizState");
    if (savedQuizState) {
      try {
        const parsed = JSON.parse(savedQuizState);
        setCurrentQuestion(parsed.currentQuestion || 0);
        setScore(parsed.score || 0);
        setAnswers(parsed.answers || []);
        setUserAnswers(parsed.userAnswers || []);
        setQuizCompleted(parsed.quizCompleted || false);
        setSelectedAnswer(parsed.selectedAnswer ?? null);
        setIsAnswered(parsed.isAnswered || false);
        setTimeLeft(parsed.timeLeft ?? 45); // ✅ Load saved timer value
      } catch {
        // Ignore invalid storage data
      }
    }
  }, []);

  // ✅ Save state to localStorage (now includes timeLeft)
  useEffect(() => {
    const stateToSave = {
      currentQuestion,
      score,
      answers,
      userAnswers,
      quizCompleted,
      selectedAnswer,
      isAnswered,
      timeLeft, // ✅ Save timer
    };
    localStorage.setItem("quizState", JSON.stringify(stateToSave));
  }, [
    currentQuestion,
    score,
    answers,
    userAnswers,
    quizCompleted,
    selectedAnswer,
    isAnswered,
    timeLeft,
  ]);

  // ✅ Safe backend data map
  const quizData = useMemo(() => {
    if (!Array.isArray(currentQuiz?.questions)) return [];
    return currentQuiz.questions.map((q) => ({
      question: q.question_id?.Question || "",
      options: q.question_id?.options || [],
      correct: q.question_id?.answer
        ? q.question_id.answer.trim().toLowerCase().charCodeAt(0) - 97
        : null,
    }));
  }, [currentQuiz]);

  // ✅ Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeOut();
    }
  }, [timeLeft, isAnswered, quizCompleted]);

  const handleTimeOut = () => {
    setUserAnswers((prev) => [...prev, null]);
    setAnswers((prev) => [
      ...prev,
      { questionIndex: currentQuestion, selectedAnswer: null, correct: false },
    ]);
    nextQuestion();
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const answerLetter = String.fromCharCode(65 + answerIndex);
    setUserAnswers((prev) => [...prev, answerLetter]);

    const isCorrect = answerIndex === quizData[currentQuestion].correct;
    if (isCorrect) setScore((prev) => prev + 1);

    setAnswers((prev) => [
      ...prev,
      { questionIndex: currentQuestion, selectedAnswer: answerIndex, correct: isCorrect },
    ]);

    setTimeout(() => nextQuestion(), 2000);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(45);
      setIsAnswered(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);

    const quizSubmissionData = {
      _id: currentQuiz._id || localStorage.getItem("quizId"),
      answers: userAnswers,
      startTime: startTime,
    };

    dispatch(db_submitQuiz(quizSubmissionData));
  };
 
  useEffect(() => {
    const disableCopy = (e) => e.preventDefault();
    document.addEventListener("copy", disableCopy);
    document.addEventListener("cut", disableCopy);
    document.addEventListener("contextmenu", disableCopy);
    return () => {
      document.removeEventListener("copy", disableCopy);
      document.removeEventListener("cut", disableCopy);
      document.removeEventListener("contextmenu", disableCopy);
    };
  }, []);
   useEffect(() => {
    const handleTabChange = () => {
      if (document.hidden && !quizCompleted) {
        setTabSwitchCount((prevCount) => {
          const newCount = prevCount + 1;

          if (newCount === 1) {
            alert("⚠️ Warning: Do not switch tabs during the quiz!");
          } else if (newCount >= 2) {
            alert("🚫 You switched tabs again. So the quiz has been submitted. ");
            completeQuiz();
          }

          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleTabChange);
    return () =>
      document.removeEventListener("visibilitychange", handleTabChange);
  }, [quizCompleted]);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setTimeLeft(45);
    setScore(0);
    setAnswers([]);
    setUserAnswers([]);
    setQuizCompleted(false);
    setIsAnswered(false);
    localStorage.removeItem("quizState");
  };

  const getProgressPercentage = () =>
    ((currentQuestion + 1) / quizData.length) * 100;

  const getTimerColor = () =>
    timeLeft <= 10 ? "danger" : timeLeft <= 20 ? "warning" : "success";

  // ✅ Loading
  if (loading) {
    return <div className="text-center mt-5">Loading quiz...</div>;
  }

  // ✅ Error
  if (error) {
    const errorMessage =
      typeof error === "string" ? error : error?.message || JSON.stringify(error);
    return (
      <div className="text-center mt-5">
        <div className="alert alert-danger w-50 mx-auto shadow-sm">
          <h5 className="mb-3">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Oops! Something went wrong
          </h5>
          <p className="mb-4">{errorMessage}</p>
          <button
            className="btn btn-lg btn-success px-4 shadow"
            style={{ borderRadius: "30px" }}
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            <i className="fas fa-sign-in-alt me-2"></i> Re-login
          </button>
        </div>
      </div>
    );
  }

  // ✅ No data
  if (!quizData.length) {
    return <div className="text-center mt-5">No quiz data found</div>;
  }

  // ✅ Completed UI
  if (quizCompleted) {
    return (
      <div className="d_quiz-wrapper d-flex justify-content-center align-items-center">
        <div className="d_quiz-container">
          <div className="container">
            <div className="d_result-card card mx-auto text-center p-4">
              <div className="d_result-logo-wrapper mb-3">
                <img src={require("../Image/ki.png")} alt="Logo" className="d_quiz-logo mb-3" />
              </div>
              <h2 className="d_title mb-3">🎉 Quiz Completed! 🎉</h2>
              <div className="d_result-score-box mx-auto mb-3">
                <h3 className="mb-1">Your Score</h3>
                <div className="d_score-percentage">
                  {score} / {quizData.length}{" "}
                  <span>({Math.round((score / quizData.length) * 100)}%)</span>
                </div>
              </div>
              <div className="d_performance-message mt-3">
                {score >= 24 && (
                  <p className="text-success">
                    <img src="https://media.istockphoto.com/id/2166921455/vector/quality-or-certified-ribbon-icon-vector-design.jpg" style={{ width: "35px" }} /> Excellent!
                  </p>
                )}
                {score >= 18 && score < 24 && (
                  <p className="text-info">
                    <img src="https://cdn-icons-png.flaticon.com/512/3712/3712146.png" style={{ width: "35px" }} /> Good job!
                  </p>
                )}
                {score >= 12 && score < 18 && (
                  <p className="text-warning">
                    <img src="https://media.istockphoto.com/id/2166921455/vector/quality-or-certified-ribbon-icon-vector-design.jpg" style={{ width: "35px" }} /> Keep practicing!
                  </p>
                )}
                {score < 12 && (
                  <p className="text-danger">
                    <img src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png" style={{ width: "35px" }} /> Study harder!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Active Quiz UI
  return (
    <div className="d_quiz-wrapper d-flex justify-content-center align-items-center">
      <div className="d_quiz-container">
        <div className="container">
          <div className="w-100 text-center mb-4">
            <img src={require("../Image/ki.png")} alt="Logo" className="mx-auto d_quiz-logo" />
          </div>

          <div className="d_top-bar">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-md-3 gap-2">
              <h5 className="d_quiz-title mb-0">Tech Quiz Challenge</h5>
              <div className="d_progress-section flex-grow-1 mx-3">
                <div className="d_progress-text">
                  Question {currentQuestion + 1} of {quizData.length}
                </div>
                <div className="progress d_progress-bar">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
              <div className="d_timer-section text-end">
                <div className="d_timer-display mb-1">
                  <i className="fas fa-clock me-2"></i>
                  <span className={`badge bg-${getTimerColor()} d_timer-badge`}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="d_score-display">
                  Score: {score}/{quizData.length}
                </div>
              </div>
            </div>
          </div>

          <div className="d_question-card card mx-auto mt-4">
            <div className="card-body">
              <div className="d_question-header mb-4">
                <span className="badge d_question-number">Q{currentQuestion + 1}</span>
                <h4 className="d_question-text">{quizData[currentQuestion]?.question}</h4>
              </div>

              <div className="d_options-container">
                {quizData[currentQuestion]?.options.map((option, index) => {
                  let buttonClass = "btn d_option-btn";
                  if (isAnswered) {
                    if (index === quizData[currentQuestion].correct)
                      buttonClass += " d_correct-answer";
                    else if (index === selectedAnswer)
                      buttonClass += " d_wrong-answer";
                    else buttonClass += " d_disabled-option";
                  } else if (selectedAnswer === index) {
                    buttonClass += " d_selected-option";
                  }

                  return (
                    <button
                      key={index}
                      className={`${buttonClass} mb-3`}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={isAnswered}
                    >
                      <div className="d_option-content">
                        <span className="d_option-letter">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="d_option-text">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="d_answer-feedback mt-4">
                  {selectedAnswer === quizData[currentQuestion].correct ? (
                    <div className="alert alert-success d_feedback-alert">
                      <i className="fas fa-check-circle me-2"></i> Correct! Well done!
                    </div>
                  ) : (
                    <div className="alert alert-danger d_feedback-alert">
                      <i className="fas fa-times-circle me-2"></i>
                      {selectedAnswer === null ? "Time's up!" : "Incorrect!"}{" "}
                      Correct answer:{" "}
                      {quizData[currentQuestion].options[
                        quizData[currentQuestion].correct
                      ]}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
