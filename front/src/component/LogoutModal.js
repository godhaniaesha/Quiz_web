import React from "react";
import "../style/x_app.css";
import { useDispatch } from "react-redux";
import { db_logoutUser } from "../redux/slice/auth.slice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LogoutModal = ({ open, onCancel }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(db_logoutUser());
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    toast.success("Logged out successfully");
    navigate("/adminlogin"); // redirect to admin login page
  };

  if (!open) return null;

  return (
    <div className="x_modal-overlay">
      <div className="x_modal">
        <div className="x_modal-title">Log Out</div>
        <div className="x_modal-subtitle">
          Are you sure you want to logout your ID?
        </div>
        <div className="x_modal-actions">
          <button className="x_btn x_btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="x_btn x_btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
