import React from "react";
import "../style/x_app.css";

const LogoutModal = ({ open, onCancel, onLogout }) => {
  if (!open) return null;
  return (
    <div className="x_modal-overlay">
      <div className="x_modal">
        <div className="x_modal-title">LogOut</div>
        <div className="x_modal-subtitle">Are you sure you want to logout your ID?</div>
        <div className="x_modal-actions">
          <button className="x_btn x_btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="x_btn x_btn-logout" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;