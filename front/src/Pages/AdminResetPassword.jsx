import React, { useState } from 'react';
import '../style/d_style.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { db_resetPassword } from '../redux/slice/auth.slice';
import { toast } from 'react-toastify';

export default function AdminResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setError('Password must be at least 6 characters, include uppercase, lowercase, number, and special character');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const phone_number = localStorage.getItem('db_admin_forgot_phone');

    if (!phone_number) {
      toast.error('Phone number not found. Please try again.');
      return;
    }

    try {
      const res = await dispatch(db_resetPassword({ phone_number, newPassword })).unwrap();
      toast.success(res.message || 'Password reset successful');
      localStorage.removeItem('db_admin_forgot_phone');
      window.location.href = '/AdminLogin';
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
    }
  };

  return (
    <div className="d_auth_wrap">
      <div className="d_auth_container">
        <div className="d_auth_card">
          <img src={require('../Image/ki.png')} alt="Logo" className="d_auth_logo" />
          <p className="d_auth_subtitle fs-5">Reset Password</p>
          <form onSubmit={handleSubmit}>
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
              <span className="d_auth_toggle_icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

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
              <span className="d_auth_toggle_icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
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
