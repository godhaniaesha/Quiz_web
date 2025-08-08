import React, { useState } from "react";
import "../style/z_style.css";
import Layout from "../component/Layout";
import { useNavigate } from "react-router-dom";

const Quizzes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [email, setEmail] = useState("");
  const [quizzes, setQuizzes] = useState([]);

  const languages = ["HTML", "CSS", "JavaScript", "PHP", "React", "Node.js"];
  const statuses = ["all", "Active", "Inactive", "Draft"];

  const handleLanguageToggle = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : [...prev, lang]
    );
  };

  const handleCreateQuiz = () => {
    if (selectedLanguages.length === 0 || !email.trim()) {
      alert("Please select at least one language and enter an email.");
      return;
    }

    const timestamp = new Date().toISOString();

    const newQuizzes = selectedLanguages.map((lang, index) => ({
      id: quizzes.length + index + 1,
      title: `${lang} Quiz`,
      description: `Quiz for ${lang} technology - all levels.`,
      category: lang,
      difficulty: "Mixed",
      questionsCount: 30,
      timeLimit: 30,
      status: "Active",
      createdDate: timestamp,
      totalParticipants: 0,
      avgScore: 0,
      lastModified: timestamp,
      email
    }));

    setQuizzes((prev) => [...prev, ...newQuizzes]);
    setShowModal(false);
    setSelectedLanguages([]);
    setEmail("");
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || quiz.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuizzes = filteredQuizzes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Layout>
      <div className="Z_container">
        <div className="Z_page_header">
          <h1 className="Z_page_title">Quiz Management</h1>
          <p className="Z_page_subtitle">Create quizzes based on selected technologies</p>
        </div>

        <div className="row align-items-center mb-3 z_gap">
          <div className="col-sm-auto">
            <button className="Z_add_new_btn w-100" onClick={() => setShowModal(true)}>
              <span>+</span> Create New Quiz
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

        {/* Quiz Table */}
        <div className="Z_table_container">
          {loading ? (
            <div className="Z_loading">Loading...</div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="Z_empty_state">No quizzes found</div>
          ) : (
            <table className="Z_table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Questions</th>
                  <th>Status</th>
                  <th>Email</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {paginatedQuizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>{quiz.title}</td>
                    <td>{quiz.category}</td>
                    <td>{quiz.difficulty}</td>
                    <td>{quiz.questionsCount}</td>
                    <td>{quiz.status}</td>
                    <td>{quiz.email}</td>
                    <td>{new Date(quiz.createdDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="Z_pagination">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={currentPage === page ? "Z_pagination_btn_active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next →
            </button>
          </div>
        )}

        {/* Create Quiz Modal */}
        {showModal && (
          <div className="Z_modal_backdrop">
            <div className="Z_modal">
              <h2>Select Technologies</h2>
              <div className="Z_modal_languages">
                {languages.map((lang) => (
                  <label key={lang} className="Z_checkbox_label">
                    <input
                      type="checkbox"
                      value={lang}
                      checked={selectedLanguages.includes(lang)}
                      onChange={() => handleLanguageToggle(lang)}
                    />
                    {lang}
                  </label>
                ))}
              </div>
              <input
                type="email"
                placeholder="Enter employee email"
                className="Z_modal_input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="Z_modal_buttons">
                <button className="Z_btn Z_btn_primary" onClick={handleCreateQuiz}>
                  Create Quiz
                </button>
                <button className="Z_btn Z_btn_danger" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Quizzes;
