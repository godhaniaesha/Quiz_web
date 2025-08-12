import React, { useState, useEffect } from "react";
import "../style/z_style.css";
import Layout from "../component/Layout";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { db_getAllQuizzes } from "../redux/slice/quiz.slice";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

const Quizzes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { quizzes } = useSelector((state) => state.quiz);

  // 🟢 Log raw Redux quizzes
  console.log("🟢 Redux quizzes (raw):", quizzes);

  useEffect(() => {
    dispatch(db_getAllQuizzes());
  }, [dispatch]);

  const statuses = ["all", "Active", "Inactive", "Draft"];

  const handleEdit = (id) => console.log("Edit quiz:", id);
  const handleDelete = (id) => console.log("Delete quiz:", id);
  const handleView = (id) => console.log("View quiz:", id);

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

  // 🔵 Map quizzes
  // 🔵 Map quizzes
  const mappedQuizzes = Array.isArray(quizzes)
    ? quizzes.map((quiz) => ({
      id: quiz._id || "N/A",
      title: quiz.tech_Id?.map((t) => t.name).join(", ") || "N/A",
      description: `Quiz for ${quiz.email || "N/A"}`,
      category: quiz.tech_Id?.map((t) => t.name).join(", ") || "N/A",
      difficulty: quiz.difficulty || "N/A",
      questionsCount: quiz.questions?.length ?? 0,
      timeLimit: quiz.timeLimit ?? 30,
      status:
        quiz.status?.toLowerCase() === "active"
          ? "Active"
          : quiz.status?.toLowerCase() === "inactive"
            ? "Inactive"
            : "Draft",
      createdDate: quiz.createdAt
        ? new Date(quiz.createdAt).toISOString().slice(0, 10)
        : "N/A",
      totalParticipants: quiz.totalParticipants ?? 0,
      // 🟢 Use the score from backend
      avgScore:
        quiz.questions?.length > 0
          ? Math.round((quiz.score / quiz.questions.length) * 100)
          : 0,
      lastModified: quiz.updatedAt
        ? new Date(quiz.updatedAt).toISOString().slice(0, 10)
        : "N/A",
    }))
    : [];

  const reversedQuizzes = mappedQuizzes.slice().reverse();

  console.log("🔵 Mapped quizzes:", mappedQuizzes);

  // 🟡 Filter quizzes
  console.log("🔵 Reversed & Mapped quizzes:", reversedQuizzes);

  // 🟡 Filter quizzes
  const filteredQuizzes = reversedQuizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || quiz.status === filterStatus;
    return matchesSearch && matchesStatus;
  });


  console.log("🟡 Filtered quizzes (after search & status):", filteredQuizzes);

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuizzes = filteredQuizzes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  console.log("🟠 Paginated quizzes (final table data):", paginatedQuizzes);

  return (
    <Layout>
      <div className="Z_container">
        {/* Page Header */}
        <div className="Z_page_header">
          <h1 className="Z_page_title">Quiz Management</h1>
          <p className="Z_page_subtitle">
            Create, organize, and manage your interview quizzes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="Z_stats_container">
          <div className="Z_stat_card">
            <div className="Z_stat_number">{mappedQuizzes.length}</div>
            <div className="Z_stat_label">Total Quizzes</div>
          </div>
          <div className="Z_stat_card">
            <div className="Z_stat_number">
              {mappedQuizzes.filter((q) => q.status === "Active").length}
            </div>
            <div className="Z_stat_label">Active Quizzes</div>
          </div>
          <div className="Z_stat_card">
            <div className="Z_stat_number">
              {mappedQuizzes.filter((q) => q.status === "Inactive").length}
            </div>
            <div className="Z_stat_label">INActive Quizzes</div>
          </div>

        </div>

        {/* Controls */}
        <div className="row align-items-center mb-3 z_gap">
          <div className="col-sm-auto">
            <button
              className="Z_add_new_btn w-100"
              onClick={() => navigate("/register")}
            >
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
              {statuses.map((status) => (
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
                  : "Get started by creating your first quiz"}
              </p>
            </div>
          ) : (
            <div className="Z_table_wrapper">
              <table
                className="Z_table"
                style={{ tableLayout: "auto", width: "100%" }}
              >
                <thead className="Z_table_header">
                  <tr>
                    <th>Quiz Title</th>
                    <th>Category</th>
                    <th>Questions</th>
                    <th>Time Limit</th>
                    <th>Status</th>

                    <th>Avg Score</th>
                    <th>Last Modified</th>

                  </tr>
                </thead>
                <tbody className="Z_table_body">
                  {paginatedQuizzes.map((quiz, idx) => {
                    console.log(`📄 Row ${idx + 1} data:`, quiz);
                    return (
                      <tr key={quiz.id}>
                        <td>
                          <div>
                            <div
                              style={{
                                fontWeight: "600",
                                marginBottom: "4px",
                              }}
                            >
                              {quiz.title}
                            </div>
                            <div
                              style={{
                                fontSize: "0.8rem",
                                color: "#6c757d",
                                maxWidth: "200px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {quiz.description}
                            </div>
                          </div>
                        </td>
                        <td>{quiz.category}</td>

                        <td>{quiz.questionsCount}</td>
                        <td>{quiz.timeLimit} min</td>
                        <td>{getStatusBadge(quiz.status)}</td>

                        <td>{quiz.avgScore}%</td>
                        <td>
                          {new Date(quiz.lastModified).toLocaleDateString()}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginTop: "16px",
            }}
          >
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
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
              onClick={() => setCurrentPage((prev) => prev - 1)}
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
                cursor:
                  currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
              onClick={() => setCurrentPage((prev) => prev + 1)}
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
