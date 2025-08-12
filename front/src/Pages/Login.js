import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/d_style.css";
import { db_loginQuiz } from "../redux/slice/quiz.slice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, currentQuiz } = useSelector((state) => state.quiz);

  const [email, setEmail] = useState("");

  // ✅ Handle login result or error
  useEffect(() => {
    if (currentQuiz) {
      localStorage.setItem("quizEmail", email);
      localStorage.setItem("quizId", currentQuiz?.user?._id);
  
      toast.success("Login successful!");
      setTimeout(() => navigate("/quiz"), 1500);
    }
  }, [currentQuiz, navigate, email]);
  
  useEffect(() => {
    if (error && !loading) {
      toast.error(error?.message || error);
    }
  }, [error, loading]);
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Please enter your email");
      return;
    }

    dispatch(db_loginQuiz({ email }));
  };

  return (
    <div className="d_auth_wrap">
      <ToastContainer />
      <div className="d_auth_container">
        <div className="d_auth_card d_auth_card_login">
          <img
            src={require("../Image/ki.png")}
            alt="Logo"
            className="d_auth_logo"
          />
          <p className="d_auth_subtitle">Ready to Begin? Enter Your Email!</p>
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

            <button type="submit" className="d_auth_btn mt-3" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <p className="d_auth_footer">
              Don’t have an account?{" "}
              <a href="/register" className="text-info">
                Create Account
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
