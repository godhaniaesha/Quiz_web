import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  db_getAllQuestions,
  db_deleteQuestion,
  db_updateQuestion
} from "../redux/slice/question.slice";
import "../style/z_style.css";
import Layout from "../component/Layout";
import { fetchTechs } from "../redux/slice/tech.slice";

const Questions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { questions, loading } = useSelector((state) => state.ques);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const { techs } = useSelector((state) => state.tech);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);

  // New state for View Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewQuestion, setViewQuestion] = useState(null);

  useEffect(() => {
    dispatch(db_getAllQuestions());
    dispatch(fetchTechs());
  }, [dispatch]);

  const handleTechnologyToggle = (techName) => {
    setSelectedTechnologies((prev) =>
      prev.includes(techName)
        ? prev.filter((t) => t !== techName)
        : [...prev, techName]
    );
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.Question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tech_Id?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTechnology =
      selectedTechnologies.length === 0 ||
      selectedTechnologies.includes(q.tech_Id?.name);
    return matchesSearch && matchesTechnology;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleEdit = (id) => {
    navigate(`/EditQuestion/${id}`);
  };

  const handleDeleteClick = (id) => {
    setQuestionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (questionToDelete) {
      dispatch(db_deleteQuestion(questionToDelete));
      setShowDeleteModal(false);
      setQuestionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  // New handleView function
  const handleView = (id) => {
    const selectedQ = questions.find((q) => q._id === id);
    setViewQuestion(selectedQ);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewQuestion(null);
  };

  const handleStatusToggle = (id, currentStatus) => {
    dispatch(
      db_updateQuestion({ id, updatedData: { active: !currentStatus } })
    );
  };

  const getStatusSwitch = (active, id) => (
    <div className="Z_status_switch_container">
      <label className="Z_status_switch">
        <input
          type="checkbox"
          checked={active}
          onChange={() => handleStatusToggle(id, active)}
          className="Z_status_switch_input"
        />
        <span className="Z_status_switch_slider"></span>
      </label>
    </div>
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return { color: "#28a745" };
      case "medium":
        return { color: "#ffc107" };
      case "hard":
        return { color: "#dc3545" };
      default:
        return { color: "#6c757d" };
    }
  };

  return (
    <Layout>
      <div className="Z_container">
        <div className="Z_page_header">
          <h1 className="Z_page_title">Interview Questions Management</h1>
          <p className="Z_page_subtitle">
            Create, edit, and manage interview questions for your quiz platform
          </p>
        </div>

        {/* Stats */}
        <div className="Z_stats_container">
          <div className="Z_stat_card">
            <div className="Z_stat_number">{questions.length}</div>
            <div className="Z_stat_label">Total Questions</div>
          </div>
          <div className="Z_stat_card">
            <div className="Z_stat_number">
              {questions.filter((q) => q.active).length}
            </div>
            <div className="Z_stat_label">Active Questions</div>
          </div>
          <div className="Z_stat_card">
            <div className="Z_stat_number">
              {questions.filter((q) => !q.active).length}
            </div>
            <div className="Z_stat_label">Inactive Questions</div>
          </div>
        </div>

        {/* Controls */}
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

        {/* Tech Filters */}
        <div className="z_technology-filters">
          {techs?.map((tech) => (
            <div
              key={tech._id}
              className={`filter-box ${
                selectedTechnologies.includes(tech.name) ? "active" : ""
              }`}
              onClick={() => handleTechnologyToggle(tech.name)}
            >
              {selectedTechnologies.includes(tech.name) && (
                <span className="z_check">✓</span>
              )}
              <span>{tech.name}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="Z_table_container">
          {loading ? (
            <div className="Z_loading">
              <div className="Z_spinner"></div>
              <p>Loading questions...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="Z_empty_state">
              <h3 className="Z_empty_title">No questions found</h3>
              <p className="Z_empty_message">
                {searchTerm || selectedTechnologies.length > 0
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by adding your first question"}
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
                  <tr key={question._id}>
                    <td style={{ maxWidth: "400px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {question.Question}
                    </td>
                    <td>{question.tech_Id?.name || "N/A"}</td>
                    <td style={getDifficultyColor(question.difficulty)}>
                      {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                    </td>
                    <td>{getStatusSwitch(question.active, question._id)}</td>
                    <td>
                      <div className="Z_action_buttons">
                        <button className="Z_btn Z_btn_primary" onClick={() => handleView(question._id)}>
                          <FaEye />
                        </button>
                        <button className="Z_btn Z_btn_warning" onClick={() => handleEdit(question._id)}>
                          <FaEdit />
                        </button>
                        <button className="Z_btn Z_btn_danger" onClick={() => handleDeleteClick(question._id)}>
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "16px" }}>
            <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>
              <FaAngleDoubleLeft />
            </button>
            <span>{currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages}>
              <FaAngleDoubleRight />
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="Z_modal_overlay">
          <div className="Z_modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this question?</p>
            <div className="Z_modal_actions">
              <button className="Z_btn Z_btn_danger" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="Z_btn Z_btn_secondary" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Question Modal */}
      {showViewModal && viewQuestion && (
        <div className="Z_modal_overlay">
          <div className="Z_modal" style={{ maxWidth: "600px" }}>
            <h3>Question Details</h3>
            <p><strong>Question:</strong> {viewQuestion.Question}</p>

          {viewQuestion.options && viewQuestion.options.length > 0 && (
  <div style={{ marginTop: "15px" }}>
    <strong>Options:</strong>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "5px" }}>
      {viewQuestion.options.map((opt, idx) => (
        <div
          key={idx}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: opt === viewQuestion.answer ? "#d4edda" : "#f8f9fa",
            color: opt === viewQuestion.answer ? "#155724" : "#212529",
            fontWeight: opt === viewQuestion.answer ? "600" : "400",
          }}
        >
          {String.fromCharCode(65 + idx)}. {opt} {/* Shows A., B., C., D. */}
        </div>
      ))}
    </div>
  </div>
)}

            {viewQuestion.answer && (
              <p style={{ marginTop: "10px", color: "green" }}>
                <strong>Correct Answer:</strong> {viewQuestion.answer}
              </p>
            )}

            <div className="Z_modal_actions">
              <button className="Z_btn Z_btn_secondary" onClick={closeViewModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Questions;
