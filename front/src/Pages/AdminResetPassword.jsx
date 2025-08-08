import React, { useState } from 'react';
import '../style/d_style.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('All fields are required');
    } else if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
    } else if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      const email = localStorage.getItem('db_admin_forgot_email');
      console.log('Password reset for:', email);
      window.location.href = '/AdminLogin';
    }
  };

  return (
    <div className="d_auth_wrap">
      <div className="d_auth_container">
        <div className="d_auth_card">
            <img src={require('../Image/ki.png')} alt="Logo" className="d_auth_logo" />
                 <p className="d_auth_subtitle fs-5">Reset Password</p>
        
          <form onSubmit={handleSubmit}>

            {/* New Password Field */}
            <div className="d_auth_group position-relative">
              <label className="d_auth_label">New Password</label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="d_auth_input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
              />
              <span className="d_auth_toggle_icon" onClick={toggleNewPassword}>
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password Field */}
            <div className="d_auth_group position-relative mt-3">
              <label className="d_auth_label">Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="d_auth_input"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
              />
              <span className="d_auth_toggle_icon" onClick={toggleConfirmPassword}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {error && <small className="d_auth_error">{error}</small>}
            </div>

            <button type="submit" className="d_auth_btn mt-3">Reset Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
