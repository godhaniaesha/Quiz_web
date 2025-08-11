import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/d_style.css";
import Layout from "../component/Layout";
import { fetchTechs } from "../redux/slice/tech.slice";
import { db_generateQuiz } from "../redux/slice/quiz.slice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { techs, loading: techLoading, error: techError } = useSelector(
    (state) => state.tech || {}
  );
  const { loading: quizLoading, error: quizError, result } = useSelector(
    (state) => state.quiz || {}
  );

  const [selectedTech, setSelectedTech] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(fetchTechs());
  }, [dispatch]);

  useEffect(() => {
    if (quizError) {
      toast.error(quizError);
    }
  }, [quizError]);

useEffect(() => {
  if (result && !quizLoading) {
    toast.success("Quiz generated successfully!");
    
    // Reset form
    setEmail("");
    setSelectedTech([]);
    setSearchText("");

    // Redirect after short delay so toast is visible
    setTimeout(() => {
      navigate("/quizzes");
    }, 1500);
  }
}, [result, quizLoading, navigate]);

  const handleCheckboxToggle = (lang) => {
    setSelectedTech((prev) =>
      prev.includes(lang)
        ? prev.filter((item) => item !== lang)
        : [...prev, lang]
    );
  };

  const handleRemoveSelected = (lang) => {
    setSelectedTech((prev) => prev.filter((item) => item !== lang));
  };

  const techLanguages =
    Array.isArray(techs) && techs.length > 0
      ? techs.map((t) => ({ id: t._id, name: t.name }))
      : Array.isArray(techs?.result)
      ? techs.result.map((t) => ({ id: t._id, name: t.name }))
      : [];

  const filteredLanguages = techLanguages.filter((t) =>
    t.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Please enter your email");
      return;
    }
    if (selectedTech.length === 0) {
      toast.warning("Please select at least one technology");
      return;
    }

    const selectedIds = techLanguages
      .filter((t) => selectedTech.includes(t.name))
      .map((t) => t.id);

    dispatch(
      db_generateQuiz({
        email,
        tech_Id: selectedIds,
      })
    );
  };

  return (
    <Layout>
      <ToastContainer></ToastContainer>
      <div className="d_auth_wrap">
        <div className="d_auth_container">
          <div className="d_auth_card">
            <img
              src={require("../Image/ki.png")}
              alt="Logo"
              className="d_auth_logo"
            />

            <form onSubmit={handleSubmit}>
              <div className="d_auth_group">
                <label className="d_auth_label">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="d_auth_input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="d_auth_group mt-3">
                <label className="d_auth_label">Select Tech Languages</label>

                {techLoading && <p>Loading tech languages...</p>}
                {techError && toast.error(techError)}

                <input
                  type="text"
                  placeholder="Search tech..."
                  className="d_auth_input mb-2"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />

                <div className="d_custom_checkbox_group">
                  {filteredLanguages.map((t) => {
                    const isActive = selectedTech.includes(t.name);
                    return (
                      <div
                        key={t.id}
                        className={`d_custom_checkbox_box ${
                          isActive ? "active" : ""
                        }`}
                        onClick={() => handleCheckboxToggle(t.name)}
                      >
                        <span className="checkbox-indicator">
                          {isActive ? "✔" : ""}
                        </span>
                        <span>{t.name}</span>
                      </div>
                    );
                  })}
                </div>

                {selectedTech.length > 0 && (
                  <div className="d_selected_tech_list mt-3">
                    <label className="d_auth_label">Selected Languages:</label>
                    <div className="d_selected_tags">
                      {selectedTech.map((lang) => (
                        <span className="d_selected_tag" key={lang}>
                          {lang}
                          <button
                            type="button"
                            className="d_remove_btn"
                            onClick={() => handleRemoveSelected(lang)}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="d_auth_btn mt-4"
                disabled={quizLoading}
              >
                {quizLoading ? "Generating Quiz..." : "Generate Quiz"}
              </button>

              <p className="d_auth_footer">
                Already have an account?{" "}
                <a href="/login" className="text-info">
                  Sign In
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      
    </Layout>
  );
}
