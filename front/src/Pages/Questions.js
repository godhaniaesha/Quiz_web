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
    {
      id: 1,
      question: "What is the difference between let, const, and var in JavaScript?",
      technology: "JavaScript",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 2,
      question: "Explain the concept of closures in JavaScript with examples.",
      technology: "JavaScript",
      difficulty: "Hard",
      status: "Active"
    },
    {
      id: 3,
      question: "What are React hooks and how do they work?",
      technology: "React",
      difficulty: "Medium",
      status: "Active"
    },
    {
      id: 4,
      question: "Describe the Virtual DOM in React and its benefits.",
      technology: "React",
      difficulty: "Medium",
      status: "Draft"
    },
    {
      id: 5,
      question: "What is the difference between synchronous and asynchronous programming?",
      technology: "Programming",
      difficulty: "Easy",
      status: "Active"
    },
    {
      id: 6,
      question: "Explain the concept of promises in JavaScript.",
      technology: "JavaScript",
      difficulty: "Medium",
      status: "Inactive"
    }
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
        <div className="row align-items-center mb-3 z_gap">
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
          <div className="col-md-3">
            <select
              className="Z_filter_select w-100"
              value={filterTechnology}
              onChange={(e) => setFilterTechnology(e.target.value)}
            >
              {technologies.map(technology => (
                <option key={technology} value={technology}>
                  {technology === "all" ? "All Technologies" : technology}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Questions Table */}
        <div className="Z_table_container">
          {loading ? (
            <div className="Z_loading">
              <div className="Z_spinner"></div>
              <p>Loading questions...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="Z_empty_state">
              <div className="Z_empty_icon">📝</div>
              <h3 className="Z_empty_title">No questions found</h3>
              <p className="Z_empty_message">
                {searchTerm || filterTechnology !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by adding your first question"
                }
              </p>
            </div>
          ) : (
            <table className="Z_table">
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