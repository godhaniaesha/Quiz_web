import React, { useState, useEffect } from 'react';

const quizData = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Management Language"],
        correct: 0
    },
    {
        question: "Which CSS property is used to change the text color?",
        options: ["font-color", "text-color", "color", "background-color"],
        correct: 2
    },
    {
        question: "What is the correct HTML tag for the largest heading?",
        options: ["<h6>", "<heading>", "<h1>", "<header>"],
        correct: 2
    },
    {
        question: "Which JavaScript method is used to add an element to the end of an array?",
        options: ["push()", "add()", "append()", "insert()"],
        correct: 0
    },
    {
        question: "What does CSS stand for?",
        options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
        correct: 1
    },
    {
        question: "Which HTML attribute specifies an alternate text for an image?",
        options: ["title", "src", "alt", "longdesc"],
        correct: 2
    },
    {
        question: "What is the correct way to create a function in JavaScript?",
        options: ["function = myFunction() {}", "function myFunction() {}", "create myFunction() {}", "def myFunction() {}"],
        correct: 1
    },
    {
        question: "Which CSS property controls the text size?",
        options: ["text-style", "font-size", "text-size", "font-style"],
        correct: 1
    },
    {
        question: "What is the correct HTML tag for inserting a line break?",
        options: ["<break>", "<lb>", "<br>", "<newline>"],
        correct: 2
    },
    {
        question: "Which operator is used to assign a value to a variable in JavaScript?",
        options: ["*", "=", "x", "-"],
        correct: 1
    },
    {
        question: "What is the correct CSS syntax for making all <p> elements bold?",
        options: ["p {text-size:bold;}", "p {font-weight:bold;}", "<p style='bold'>", "p {font:bold;}"],
        correct: 1
    },
    {
        question: "Which HTML tag is used to define an internal style sheet?",
        options: ["<css>", "<script>", "<style>", "<link>"],
        correct: 2
    },
    {
        question: "What is the correct way to write a JavaScript array?",
        options: ["var colors = 'red', 'green', 'blue'", "var colors = (1:'red', 2:'green', 3:'blue')", "var colors = ['red', 'green', 'blue']", "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')"],
        correct: 2
    },
    {
        question: "Which CSS property is used to change the background color?",
        options: ["bgcolor", "background-color", "color", "bg-color"],
        correct: 1
    },
    {
        question: "What is the correct HTML tag for creating a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correct: 1
    },
    {
        question: "Which JavaScript event occurs when the user clicks on an HTML element?",
        options: ["onchange", "onclick", "onmouseclick", "onmouseover"],
        correct: 1
    },
    {
        question: "What does the 'box-sizing' property in CSS control?",
        options: ["The size of text boxes", "How the total width and height are calculated", "The border thickness", "The margin spacing"],
        correct: 1
    },
    {
        question: "Which HTML tag is used to create an unordered list?",
        options: ["<ol>", "<ul>", "<list>", "<li>"],
        correct: 1
    },
    {
        question: "What is the correct way to include an external JavaScript file?",
        options: ["<script href='xxx.js'>", "<script name='xxx.js'>", "<script src='xxx.js'>", "<javascript src='xxx.js'>"],
        correct: 2
    },
    {
        question: "Which CSS selector is used to select elements with a specific class?",
        options: ["#", ".", "*", "&"],
        correct: 1
    },
    {
        question: "What is the correct HTML tag for making text italic?",
        options: ["<italic>", "<i>", "<it>", "<em>"],
        correct: 1
    },
    {
        question: "Which JavaScript method is used to remove the last element from an array?",
        options: ["pop()", "remove()", "delete()", "splice()"],
        correct: 0
    },
    {
        question: "What does the 'display: flex' CSS property do?",
        options: ["Makes text flexible", "Creates a flexible layout container", "Displays text in multiple columns", "Hides the element"],
        correct: 1
    },
    {
        question: "Which HTML attribute is used to define inline styles?",
        options: ["class", "style", "styles", "font"],
        correct: 1
    },
    {
        question: "What is the correct way to write a JavaScript comment?",
        options: ["// This is a comment", "<!-- This is a comment -->", "/* This is a comment", "# This is a comment"],
        correct: 0
    },
    {
        question: "Which CSS property is used to make text bold?",
        options: ["font-style", "text-decoration", "font-weight", "text-weight"],
        correct: 2
    },
    {
        question: "What is the correct HTML tag for the smallest heading?",
        options: ["<h1>", "<h6>", "<heading>", "<small>"],
        correct: 1
    },
    {
        question: "Which JavaScript keyword is used to declare a variable?",
        options: ["variable", "var", "v", "declare"],
        correct: 1
    },
    {
        question: "What does the 'z-index' property in CSS control?",
        options: ["The zoom level", "The stacking order of elements", "The font size", "The element's position"],
        correct: 1
    },
    {
        question: "Which HTML tag is used to create a table?",
        options: ["<table>", "<tab>", "<tr>", "<td>"],
        correct: 0
    }
];

export default function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(45);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);

    useEffect(() => {
        if (timeLeft > 0 && !isAnswered && !quizCompleted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isAnswered) {
            handleTimeOut();
        }
    }, [timeLeft, isAnswered, quizCompleted]);

    const handleTimeOut = () => {
        setAnswers([...answers, { questionIndex: currentQuestion, selectedAnswer: null, correct: false }]);
        nextQuestion();
    };

    const handleAnswerSelect = (answerIndex) => {
        if (isAnswered) return;

        setSelectedAnswer(answerIndex);
        setIsAnswered(true);

        const isCorrect = answerIndex === quizData[currentQuestion].correct;
        if (isCorrect) {
            setScore(score + 1);
        }

        setAnswers([...answers, {
            questionIndex: currentQuestion,
            selectedAnswer: answerIndex,
            correct: isCorrect
        }]);

        setTimeout(() => {
            nextQuestion();
        }, 2000);
    };

    const nextQuestion = () => {
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setTimeLeft(45);
            setIsAnswered(false);
        } else {
            setQuizCompleted(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setTimeLeft(45);
        setScore(0);
        setAnswers([]);
        setQuizCompleted(false);
        setIsAnswered(false);
    };

    const getProgressPercentage = () => ((currentQuestion + 1) / quizData.length) * 100;
    const getTimerColor = () => timeLeft <= 10 ? 'danger' : timeLeft <= 20 ? 'warning' : 'success';

    if (quizCompleted) {
        return (
            <div className="d_quiz-wrapper d-flex justify-content-center align-items-center">
                <div className="d_quiz-container ">
                    <div className="container">
                        <div className="d_result-card card mx-auto text-center p-4">
                            <div className="d_result-logo-wrapper mb-3">
                                <img src={require('../Image/ki.png')} alt="Logo" className="d_quiz-logo mb-3" />
                            </div>
                            <h2 className="d_title mb-3">🎉 Quiz Completed! 🎉</h2>
                            <div className="d_result-score-box mx-auto mb-3">
                                <h3 className="mb-1">Your Score</h3>
                                <div className="d_score-percentage">
                                    {score} / {quizData.length} <span>({Math.round((score / quizData.length) * 100)}%)</span>
                                </div>
                            </div>
                            <div className="d_performance-message mt-3">
                                {score >= 24 && <p className="text-success">🌟 Excellent!</p>}
                                {score >= 18 && score < 24 && <p className="text-info">👏 Good job!</p>}
                                {score >= 12 && score < 18 && <p className="text-warning">💪 Keep practicing!</p>}
                                {score < 12 && <p className="text-danger">📚 Study harder!</p>}
                            </div>
                            <button className="btn d_btn-primary btn-lg mt-4" onClick={resetQuiz}>Restart Quiz</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="d_quiz-wrapper d-flex justify-content-center align-items-center">
                <div className="d_quiz-container ">
                    <div className="container">
                        <div className="d_top-bar">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-md-3 gap-2">
                                <img src={require('../Image/ki.png')} alt="Logo" className="d_quiz-logo" />
                                <h5 className="d_quiz-title mb-0">Tech Quiz Challenge</h5>

                                <div className="d_progress-section flex-grow-1 mx-3">
                                    <div className="d_progress-text">Question {currentQuestion + 1} of {quizData.length}</div>
                                    <div className="progress d_progress-bar">
                                        <div className="progress-bar bg-success" style={{ width: `${getProgressPercentage()}%` }}></div>
                                    </div>
                                </div>
                                <div className="d_timer-section text-end">
                                    <div className="d_timer-display mb-1">
                                        <i className="fas fa-clock me-2"></i>
                                        <span className={`badge bg-${getTimerColor()} d_timer-badge`}>{timeLeft}s</span>
                                    </div>
                                    <div className="d_score-display">Score: {score}/{quizData.length}</div>
                                </div>
                            </div>
                        </div>

                        <div className="d_question-card card mx-auto mt-4">
                            <div className="card-body">
                                <div className="d_question-header mb-4">
                                    <span className="badge d_question-number">Q{currentQuestion + 1}</span>
                                    <h4 className="d_question-text">{quizData[currentQuestion].question}</h4>
                                </div>

                                <div className="d_options-container">
                                    {quizData[currentQuestion].options.map((option, index) => {
                                        let buttonClass = 'btn d_option-btn';
                                        if (isAnswered) {
                                            if (index === quizData[currentQuestion].correct) buttonClass += ' d_correct-answer';
                                            else if (index === selectedAnswer) buttonClass += ' d_wrong-answer';
                                            else buttonClass += ' d_disabled-option';
                                        } else if (selectedAnswer === index) {
                                            buttonClass += ' d_selected-option';
                                        }

                                        return (
                                            <button key={index} className={`${buttonClass} mb-3`} onClick={() => handleAnswerSelect(index)} disabled={isAnswered}>
                                                <div className="d_option-content">
                                                    <span className="d_option-letter">{String.fromCharCode(65 + index)}</span>
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
                                                <i className="fas fa-times-circle me-2"></i> {selectedAnswer === null ? "Time's up!" : "Incorrect!"} Correct answer: {quizData[currentQuestion].options[quizData[currentQuestion].correct]}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    );
}