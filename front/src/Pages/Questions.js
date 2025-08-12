import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
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
  const [filterTechnology, setFilterTechnology] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const { techs } = useSelector((state) => state.tech);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);


  useEffect(() => {
    dispatch(db_getAllQuestions());
    dispatch(fetchTechs())
  }, [dispatch]);

  const uniqueTechnologies = [
    "all",
    ...new Set(questions.map((q) => q.tech_Id?.name).filter(Boolean))
  ];


  const handleTechnologyToggle = (techName) => {
  setSelectedTechnologies((prev) => {
    if (prev.includes(techName)) {
      return prev.filter((t) => t !== techName); // remove if already selected
    } else {
      return [...prev, techName]; // add if not selected
    }
  });
};
  // const filteredQuestions = questions.filter((q) => {
  //   const matchesSearch =
  //     q.Question.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     q.tech_Id?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesTechnology =
  //     filterTechnology === "all" || q.tech_Id?.name === filterTechnology;
  //   return matchesSearch && matchesTechnology;
  // });

  const filteredQuestions = questions.filter((q) => {
  const matchesSearch =
    q.Question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.tech_Id?.name?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesTechnology =
    selectedTechnologies.length === 0 || selectedTechnologies.includes(q.tech_Id?.name);

  return matchesSearch && matchesTechnology;
});


  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage);

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

  const handleView = (id) => {
    console.log("View question:", id);
  };

  const handleStatusToggle = (id, currentStatus) => {
    dispatch(db_updateQuestion({ id, updatedData: { active: !currentStatus } }));
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

        <div className="Z_stats_container">
          <div className="Z_stat_card">
            <div className="Z_stat_number">{questions.length}</div>
            <div className="Z_stat_label">Total Questions</div>
          </div>
          <div className="Z_stat_card">
            <div className="Z_stat_number">{questions.filter((q) => q.active).length}</div>
            <div className="Z_stat_label">Active Questions</div>
          </div>
          <div className="Z_stat_card">
            <div className="Z_stat_number">{questions.filter((q) => !q.active).length}</div>
            <div className="Z_stat_label">Inactive Questions</div>
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

        {/* <div className="z_technology-filters">
          {techs?.map((tech) => (
            <div
              key={tech._id}
              className={`filter-box ${filterTechnology === tech.name ? 'active' : ''}`}
              onClick={() => setFilterTechnology(tech.name)}
            >
              {filterTechnology === tech.name && <span className="z_check">✓</span>}
              <span>{tech.name}</span>
            </div>
          ))}
        </div> */}

        <div className="z_technology-filters">
          {techs?.map((tech) => (
            <div
              key={tech._id}
              className={`filter-box ${selectedTechnologies.includes(tech.name) ? 'active' : ''}`}
              onClick={() => handleTechnologyToggle(tech.name)}
            >
              {selectedTechnologies.includes(tech.name) && <span className="z_check">✓</span>}
              <span>{tech.name}</span>
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
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="40" cy="40" r="40" fill="#f0f0f0" />
                <circle cx="40" cy="30" r="14" fill="#ccc" />
                <path
                  d="M20 64c0-11 9-20 20-20s20 9 20 20"
                  fill="#ccc"
                />
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
                    <td>
                      <div
                        style={{
                          maxWidth: "400px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {question.Question}
                      </div>
                    </td>
                    <td>{question.tech_Id?.name || "N/A"}</td>
                    <td style={getDifficultyColor(question.difficulty)}>
                      {question.difficulty.charAt(0).toUpperCase() +
                        question.difficulty.slice(1)}
                    </td>
                    <td>{getStatusSwitch(question.active, question._id)}</td>
                    <td>
                      <div className="Z_action_buttons">
                        <button
                          className="Z_btn Z_btn_primary"
                          onClick={() => handleView(question._id)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="Z_btn Z_btn_warning"
                          onClick={() => handleEdit(question._id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="Z_btn Z_btn_danger"
                          onClick={() => handleDeleteClick(question._id)}
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

      {/* ✅ Delete Confirmation Modal */}
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
    </Layout>
  );
};

export default Questions;
