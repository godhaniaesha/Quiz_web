import React, { useState } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "../style/z_style.css";
import Layout from "../component/Layout";

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTechnology, setFilterTechnology] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const resultsData = [
    {
      id: 1,
      email: "user1@example.com",
      technology: ["JavaScript", "HTML", ' CSS', ' React', ' Node.js', ' Python', ' PHP', ' Java', ' C#', ' C++', ' Rust', ' TypeScript', ' Scala', ' Perl', ' Dart', ' Haskell', ' Elixir', ' Lua', ' R', ' Objective-C'],
      // technology: "JavaScript, HTML, CSS, React, Node.js, Python, PHP, Java, C#, C++",
      score: 24,
      timeTaken: "12m 30s",
      status: "Pass",
    },
    {
      id: 2,
      email: "user2@example.com",
      technology: ["React"],
      score: 18,
      timeTaken: "15m 10s",
      status: "Fail",
    },
    {
      id: 3,
      email: "user3@example.com",
      technology: ["CSS", "HTML"],
      score: 27,
      timeTaken: "10m 45s",
      status: "Pass",
    },
    {
      id: 4,
      email: "user4@example.com",
      technology: ["JavaScript"],
      score: 22,
      timeTaken: "13m 25s",
      status: "Pass",
    },
    {
      id: 5,
      email: "user5@example.com",
      technology: ["React", "JavaScript"],
      score: 17,
      timeTaken: "14m 50s",
      status: "Fail",
    },
    {
      id: 6,
      email: "user6@example.com",
      technology: ["HTML"],
      score: 29,
      timeTaken: "9m 30s",
      status: "Pass",
    }
  ];


  const technologies = ["all", "JavaScript", "React", "CSS", "HTML"];

  const filteredResults = resultsData.filter((result) => {
    const emailMatch = result.email.toLowerCase().includes(searchTerm.toLowerCase());

    const techMatch = result.technology.some(tech =>
      tech.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesSearch = emailMatch || techMatch;

    const matchesTechnology =
      filterTechnology === "all" || result.technology.includes(filterTechnology);

    return matchesSearch && matchesTechnology;
  });


  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults
    .slice(startIndex, startIndex + itemsPerPage)
    .map((result) => ({
      ...result,
      percentage: ((result.score / 30) * 100).toFixed(2) + "%",
    }));

  return (
    <Layout>
      <div className="Z_container">
        {/* Page Header */}
        <div className="Z_page_header">
          <h1 className="Z_page_title">Quiz Results Management</h1>
          <p className="Z_page_subtitle">Review and track quiz results of all users</p>
        </div>

        {/* Controls Row */}
        <div className="row align-items-center mb-3 z_gap">
          <div className="col-md-6">
            <div className="Z_search_wrapper">
              <FaSearch className="Z_search_icon" />
              <input
                type="text"
                placeholder="Search by email or technology..."
                className="Z_search_input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3 offset-md-3">
            <select
              className="Z_filter_select w-100"
              value={filterTechnology}
              onChange={(e) => setFilterTechnology(e.target.value)}
            >
              {technologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech === "all" ? "All Technologies" : tech}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div className="Z_table_container">
          {loading ? (
            <div className="Z_loading">
              <div className="Z_spinner"></div>
              <p>Loading results...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="Z_empty_state">
              <div className="Z_empty_icon">📊</div>
              <h3 className="Z_empty_title">No results found</h3>
              <p className="Z_empty_message">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <table className="Z_table">
              <thead className="Z_table_header">
                <tr>
                  <th>Email</th>
                  <th>Technology</th>
                  <th>Score</th>
                  <th>Time Taken</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody className="Z_table_body">
                {paginatedResults.map((result) => (
                  <tr key={result.id}>
                    <td>{result.email}</td>
                    <td>
                      {result.technology.map((tech, index) => (
                        <span key={index} className="Z_tech_badge">{tech}</span>
                      ))}
                    </td>

                    <td>{result.score}/30</td>
                    <td>{result.timeTaken}</td>
                    <td>{result.percentage}</td>

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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`Z_pagination_btn ${currentPage === page ? "Z_pagination_btn_active" : ""}`}
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

export default Results;
