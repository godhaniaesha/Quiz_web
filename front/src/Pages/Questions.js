import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "../style/z_style.css";
import Layout from "../component/Layout";

const Questions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTechnology, setFilterTechnology] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Mock data for questions
  const [questions, setQuestions] = useState([
    // JavaScript Questions
    {
      id: 1,
      question: "What is the difference between let, const, and var in JavaScript?",
      technology: "JavaScript",
      difficulty: "Easy",
      status: "Active"
    },
    {
      id: 2,
      question: "Explain the concept of closures in JavaScript with examples.",
      technology: "JavaScript",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 3,
      question: "What is the event loop in JavaScript and how does it work?",
      technology: "JavaScript",
      difficulty: "Hard",
      status: "Active"
    },
    {
      id: 4,
      question: "Explain the difference between Promise and async/await.",
      technology: "JavaScript",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 5,
      question: "What is hoisting in JavaScript and how does it work?",
      technology: "JavaScript",
      difficulty: "Easy",
      status: "Active"
    },

    // Python Questions
    {
      id: 6,
      question: "What is the difference between list and tuple in Python?",
      technology: "Python",
      difficulty: "Easy",
      status: "Active"
    },
    {
      id: 7,
      question: "Explain Python decorators and their practical use cases.",
      technology: "Python",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 8,
      question: "What is metaclass in Python and how does it work?",
      technology: "Python",
      difficulty: "Hard",
      status: "Active"
    },
    {
      id: 9,
      question: "Explain Python's garbage collection mechanism.",
      technology: "Python",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 10,
      question: "What is the difference between shallow copy and deep copy in Python?",
      technology: "Python",
      difficulty: "Easy",
      status: "Active"
    },

    // Java Questions
    {
      id: 11,
      question: "What is the difference between interface and abstract class in Java?",
      technology: "Java",
      difficulty: "Easy",
      status: "Active"
    },
    {
      id: 12,
      question: "Explain Java's memory management and garbage collection.",
      technology: "Java",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 13,
      question: "What is the difference between synchronized and volatile in Java?",
      technology: "Java",
      difficulty: "Hard",
      status: "Active"
    },
    {
      id: 14,
      question: "Explain Java's exception handling mechanism.",
      technology: "Java",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 15,
      question: "What is the difference between HashMap and TreeMap in Java?",
      technology: "Java",
      difficulty: "Easy",
      status: "Active"
    },

    // C++ Questions
    {
      id: 16,
      question: "What is the difference between stack and heap memory in C++?",
      technology: "C++",
      difficulty: "Easy",
      status: "Active"
    },
    {
      id: 17,
      question: "Explain C++ templates and their practical use cases.",
      technology: "C++",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 18,
      question: "What is RAII in C++ and how does it work?",
      technology: "C++",
      difficulty: "Hard",
      status: "Active"
    },
    {
      id: 19,
      question: "Explain C++ smart pointers and their advantages.",
      technology: "C++",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 20,
      question: "What is the difference between const and constexpr in C++?",
      technology: "C++",
      difficulty: "Easy",
      status: "Active"
    },

    // Ruby Questions
    {
      id: 21,
      question: "What is the difference between class and module in Ruby?",
      technology: "Ruby",
      difficulty: "Easy",
      status: "Active"
    },
    {
      id: 22,
      question: "Explain Ruby's method_missing and its practical use cases.",
      technology: "Ruby",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 23,
      question: "What is Ruby's metaprogramming and how does it work?",
      technology: "Ruby",
      difficulty: "Hard",
      status: "Active"
    },
    {
      id: 24,
      question: "Explain Ruby's block, proc, and lambda differences.",
      technology: "Ruby",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 25,
      question: "What is the difference between include and extend in Ruby?",
      technology: "Ruby",
      difficulty: "Easy",
      status: "Active"
    },

    // PHP Questions
    {
      id: 26,
      question: "What is the difference between require and include in PHP?",
      technology: "PHP",
      difficulty: "Easy",
      status: "Active"
    },
    {
      id: 27,
      question: "Explain PHP's object-oriented programming concepts.",
      technology: "PHP",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 28,
      question: "What is the difference between session and cookie in PHP?",
      technology: "PHP",
      difficulty: "Hard",
      status: "Active"
    },
    {
      id: 29,
      question: "Explain PHP's magic methods and their usage.",
      technology: "PHP",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 30,
      question: "What is the difference between POST and GET in PHP?",
      technology: "PHP",
      difficulty: "Easy",
      status: "Active"
    },

    // C# Questions
    {
      id: 31,
      question: "What is the difference between abstract and virtual in C#?",
      technology: "C#",
      difficulty: "Easy",
      status: "Active"
    },
    {
      id: 32,
      question: "Explain C#'s LINQ and its practical use cases.",
      technology: "C#",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 33,
      question: "What is the difference between async and await in C#?",
      technology: "C#",
      difficulty: "Hard",
      status: "Active"
    },
    {
      id: 34,
      question: "Explain C#'s garbage collection mechanism.",
      technology: "C#",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 35,
      question: "What is the difference between struct and class in C#?",
      technology: "C#",
      difficulty: "Easy",
      status: "Active"
    },
  ]);

  const technologies = ["all", "JavaScript", "React", "Programming", "CSS", "HTML"];
  const difficulties = ["all", "Easy", "Medium", "Hard"];

  // Filter and search questions
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.technology.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTechnology = filterTechnology === "all" || question.technology === filterTechnology;
    return matchesSearch && matchesTechnology;
  });

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (id) => {
    console.log("Edit question:", id);
    // Add edit functionality
  };

  const handleDelete = (id) => {
    console.log("Delete question:", id);
    // Add delete functionality
  };

  const handleView = (id) => {
    console.log("View question:", id);
    // Add view functionality
  };

  const handleStatusToggle = (id) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(question =>
        question.id === id
          ? { ...question, status: question.status === "Active" ? "Inactive" : "Active" }
          : question
      )
    );
  };

  const getStatusSwitch = (status, id) => {
    const isActive = status === "Active";
    return (
      <div className="Z_status_switch_container">
        <label className="Z_status_switch">
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => handleStatusToggle(id)}
            className="Z_status_switch_input"
          />
          <span className="Z_status_switch_slider"></span>
        </label>
        {/* <span className="Z_status_text">{status}</span> */}
      </div>
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return { color: "#28a745" };
      case "Medium":
        return { color: "#ffc107" };
      case "Hard":
        return { color: "#dc3545" };
      default:
        return { color: "#6c757d" };
    }
  };

  return (
    <Layout>
      <div className="Z_container">
        {/* Page Header */}
        <div className="Z_page_header">
          <h1 className="Z_page_title">Interview Questions Management</h1>
          <p className="Z_page_subtitle">Create, edit, and manage interview questions for your quiz platform</p>
        </div>

        {/* Stats Cards */}
        <div className="Z_stats_container">
          <div className="Z_stat_card">
            <div className="Z_stat_number">{questions.length}</div>
            <div className="Z_stat_label">Total Questions</div>
          </div>
          <div className="Z_stat_card">
            <div className="Z_stat_number">{questions.filter(q => q.status === "Active").length}</div>
            <div className="Z_stat_label">Active Questions</div>
          </div>
          <div className="Z_stat_card">
            <div className="Z_stat_number">{questions.filter(q => q.status === "Draft").length}</div>
            <div className="Z_stat_label">Draft Questions</div>
          </div>
          <div className="Z_stat_card">
            <div className="Z_stat_number">{questions.filter(q => q.technology === "JavaScript").length}</div>
            <div className="Z_stat_label">JavaScript Questions</div>
          </div>
        </div>

        {/* Controls Row - All in One Line */}
        <div className="row align-items-center mb-3 z_gap justify-content-between">
          <div className="col-md-3">
            <button
              className="Z_add_new_btn w-100"
              onClick={() => navigate("/AddQuestion")}
            >
              <FaPlus />
              Add New Question
            </button>
          </div>
          <div className="col-md-6">
            <div className="Z_search_wrapper">
              <FaSearch className="Z_search_icon" />
              <input
                type="text"
                placeholder="Search questions..."
                className="Z_search_input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="z_technology-filters">
          {[
            'JavaScript',
            'Python',
            'Java',
            'C++',
            'Ruby',
            'PHP',
            'C#',
            'Swift'
          ]
            .map((tech) => (
              <div
                key={tech}
                className={`filter-box ${filterTechnology === tech ? 'active' : ''}`}
                onClick={() => setFilterTechnology(tech)}
              >
                {filterTechnology === tech && <span className="z_check">✓</span>}
                <span>{tech}</span>
              </div>
            ))}
        </div>


        {/* Questions Table */}
        <div className="Z_table_container">
          {loading ? (
            <div className="Z_loading">
              <div className="Z_spinner"></div>
              <p>Loading questions...</p>
            </div>
          ) : filterTechnology === "Swift" ? (
            <div className="Z_empty_state">
              <svg
                className="Z_empty_icon"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="#999" strokeWidth="1.5" fill="#f5f5f5" />
                <path
                  d="M12 7.5c1.38 0 2.5 1.12 2.5 2.5 0 .98-.59 1.82-1.43 2.22-.37.18-.57.58-.57 1.03v.25"
                  stroke="#999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="12" cy="17" r="1" fill="#999" />
              </svg>

              <h3 className="Z_empty_title">No Questions Available</h3>
              <p className="Z_empty_message">No questions available for Swift technology</p>
            </div>

          ) : filteredQuestions.length === 0 ? (
            <div className="Z_empty_state">
              <div className="Z_empty_icon">

                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z"
                    fill="#f5f5f5"
                    stroke="#999"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M14 2v6h6"
                    stroke="#999"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <line x1="8" y1="13" x2="16" y2="13" stroke="#999" strokeWidth="1.2" />
                  <line x1="8" y1="16" x2="14" y2="16" stroke="#999" strokeWidth="1.2" />
                </svg>
              </div>
              <h3 className="Z_empty_title">No questions found</h3>
              <p className="Z_empty_message">
                {searchTerm || filterTechnology !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by adding your first question"
                }
              </p>
            </div>
          ) : (
            <table className="Z_table" style={{ tableLayout: "auto", width: "100%" }}>
              <thead className="Z_table_header">
                <tr>
                  <th>Question</th>
                  <th>Technology</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="Z_table_body">
                {paginatedQuestions.map((question) => (
                  <tr key={question.id}>
                    <td>
                      <div style={{ maxWidth: "400px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {question.question}
                      </div>
                    </td>
                    <td>{question.technology}</td>
                    <td style={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </td>
                    <td>{getStatusSwitch(question.status, question.id)}</td>
                    <td>
                      <div className="Z_action_buttons">
                        <button
                          className="Z_btn Z_btn_primary"
                          onClick={() => handleView(question.id)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="Z_btn Z_btn_warning"
                          onClick={() => handleEdit(question.id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="Z_btn Z_btn_danger"
                          onClick={() => handleDelete(question.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="Z_pagination">
            <button
              className="Z_pagination_btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaAnglesLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`Z_pagination_btn ${currentPage === page ? 'Z_pagination_btn_active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="Z_pagination_btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaAnglesRight />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Questions;