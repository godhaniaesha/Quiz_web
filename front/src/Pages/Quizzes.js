import React, { useState } from "react";
import "../style/z_style.css";
import Layout from "../component/Layout";
import { useNavigate } from "react-router-dom";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaEdit, FaEye, FaTrash } from "react-icons/fa";

const Quizzes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Mock data for quizzes
  const [quizzes] = useState([
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.",
      category: "Programming",
      difficulty: "Beginner",
      questionsCount: 25,
      timeLimit: 30,
      status: "Active",
      createdDate: "2024-01-15",
      totalParticipants: 1250,
      avgScore: 78,
      lastModified: "2024-01-20"
    },
    {
      id: 2,
      title: "React Development",
      description: "Advanced React concepts including hooks, context, and performance optimization.",
      category: "Web Development",
      difficulty: "Advanced",
      questionsCount: 40,
      timeLimit: 45,
      status: "Active",
      createdDate: "2024-01-10",
      totalParticipants: 890,
      avgScore: 65,
      lastModified: "2024-01-18"
    },
    {
      id: 3,
      title: "CSS Layout Mastery",
      description: "Master CSS Grid, Flexbox, and responsive design principles.",
      category: "Web Development",
      difficulty: "Intermediate",
      questionsCount: 30,
      timeLimit: 35,
      status: "Active",
      createdDate: "2024-01-12",
      totalParticipants: 2100,
      avgScore: 82,
      lastModified: "2024-01-19"
    },
    {
      id: 4,
      title: "Data Structures & Algorithms",
      description: "Test your understanding of fundamental data structures and algorithms.",
      category: "Computer Science",
      difficulty: "Advanced",
      questionsCount: 50,
      timeLimit: 60,
      status: "Draft",
      createdDate: "2024-01-08",
      totalParticipants: 0,
      avgScore: 0,
      lastModified: "2024-01-15"
    },
    {
      id: 5,
      title: "HTML5 & Semantic Markup",
      description: "Learn modern HTML5 features and semantic markup best practices.",
      category: "Web Development",
      difficulty: "Beginner",
      questionsCount: 20,
      timeLimit: 25,
      status: "Active",
      createdDate: "2024-01-05",
      totalParticipants: 3200,
      avgScore: 91,
      lastModified: "2024-01-16"
    },
    {
      id: 6,
      title: "Node.js Backend Development",
      description: "Server-side JavaScript with Node.js, Express, and database integration.",
      category: "Backend Development",
      difficulty: "Intermediate",
      questionsCount: 35,
      timeLimit: 40,
      status: "Inactive",
      createdDate: "2024-01-03",
      totalParticipants: 750,
      avgScore: 58,
      lastModified: "2024-01-12"
    }
  ]);

  const categories = ["all", "Programming", "Web Development", "Computer Science", "Backend Development", "Frontend Development"];
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"];
  const statuses = ["all", "Active", "Inactive", "Draft"];

  // Filter and search quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || quiz.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuizzes = filteredQuizzes.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (id) => {
    console.log("Edit quiz:", id);
    // Add edit functionality
  };

  const handleDelete = (id) => {
    console.log("Delete quiz:", id);
    // Add delete functionality
  };

  const handleView = (id) => {
    console.log("View quiz:", id);
    // Add view functionality
  };

  const handleDuplicate = (id) => {
    console.log("Duplicate quiz:", id);
    // Add duplicate functionality
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <span className="Z_status_active">{status}</span>;
      case "Inactive":
        return <span className="Z_status_inactive">{status}</span>;
      case "Draft":
        return <span className="Z_status_draft">{status}</span>;
      default:
        return <span className="Z_status_inactive">{status}</span>;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return { color: "#28a745" };
      case "Intermediate":
        return { color: "#ffc107" };
      case "Advanced":
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
          <h1 className="Z_page_title">Quiz Management</h1>
          <p className="Z_page_subtitle">Create, organize, and manage your interview quizzes</p>
        </div>

        {/* Stats Cards */}
        <div className="Z_stats_container">
          <div className="Z_stat_card">
            <div className="Z_stat_number">{quizzes.length}</div>
            <div className="Z_stat_label">Total Quizzes</div>
          </div>
          <div className="Z_stat_card">
            <div className="Z_stat_number">{quizzes.filter(q => q.status === "Active").length}</div>
            <div className="Z_stat_label">Active Quizzes</div>
          </div>
          <div className="Z_stat_card">
            <div className="Z_stat_number">{quizzes.reduce((acc, q) => acc + q.totalParticipants, 0).toLocaleString()}</div>
            <div className="Z_stat_label">Total Participants</div>
          </div>
          <div className="Z_stat_card">
            <div className="Z_stat_number">{Math.round(quizzes.reduce((acc, q) => acc + q.avgScore, 0) / quizzes.filter(q => q.avgScore > 0).length)}%</div>
            <div className="Z_stat_label">Avg Score</div>
          </div>
        </div>

        {/* Controls Row - All in One Line */}
        <div className="row align-items-center mb-3 z_gap">
          <div className="col-sm-auto">
            {/* Add New Button */}
            <button className="Z_add_new_btn w-100"
              onClick={() => navigate("/register")}>
              <span>+</span>
              Create New Quiz
            </button>
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Search quizzes..."
              className="Z_search_input w-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-sm-auto">
            <select
              className="Z_filter_select w-100"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status}
                </option>
              ))}
            </select>
          </div>
        </div>




        {/* Quizzes Table */}
        <div className="Z_table_container">
          {loading ? (
            <div className="Z_loading">
              <div className="Z_spinner"></div>
              <p>Loading quizzes...</p>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="Z_empty_state">
              <div className="Z_empty_icon">📊</div>
              <h3 className="Z_empty_title">No quizzes found</h3>
              <p className="Z_empty_message">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first quiz"
                }
              </p>
            </div>
          ) : (
            <div className="Z_table_wrapper">
              <table className="Z_table" style={{ tableLayout: "auto", width: "100%" }}>
                <thead className="Z_table_header">
                  <tr>
                    <th >Quiz Title</th>
                    <th >Category</th>
                    <th >Difficulty</th>
                    <th >Questions</th>
                    <th >Time Limit</th>
                    <th >Status</th>
                    <th >Participants</th>
                    <th >Avg Score</th>
                    <th >Last Modified</th>
                    <th >Actions</th>
                  </tr>
                </thead>
                <tbody className="Z_table_body">
                  {paginatedQuizzes.map((quiz) => (
                    <tr key={quiz.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                            {quiz.title}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#6c757d", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {quiz.description}
                          </div>
                        </div>
                      </td>
                      <td>{quiz.category}</td>
                      <td style={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </td>
                      <td>{quiz.questionsCount}</td>
                      <td>{quiz.timeLimit} min</td>
                      <td>{getStatusBadge(quiz.status)}</td>
                      <td>{quiz.totalParticipants.toLocaleString()}</td>
                      <td>{quiz.avgScore}%</td>
                      <td>{new Date(quiz.lastModified).toLocaleDateString()}</td>
                      <td>
                        <div className="Z_action_buttons">
                          <button
                            className="Z_btn Z_btn_primary"
                            onClick={() => handleView(quiz.id)}
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="Z_btn Z_btn_warning"
                            onClick={() => handleEdit(quiz.id)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="Z_btn Z_btn_danger"
                            onClick={() => handleDelete(quiz.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "16px" }}>
            <button
              style={{
                border: "1px solid #ddd",
                background: "white",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.5 : 1
              }}
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
            >
              <FaAngleDoubleLeft />
            </button>

            <span style={{ fontSize: "16px", fontWeight: "500" }}>
              {currentPage} of {totalPages}
            </span>

            <button
              style={{
                border: "1px solid #ddd",
                background: "white",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
            >
              <FaAngleDoubleRight />
            </button>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Quizzes;