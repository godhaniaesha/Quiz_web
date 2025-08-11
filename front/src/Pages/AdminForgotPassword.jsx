import React, { useState } from 'react';
import '../style/d_style.css';
import { useDispatch } from 'react-redux';
import { db_sendOTP } from '../redux/slice/auth.slice';
import { toast } from 'react-toastify';

export default function AdminForgotPassword() {
  const [phone_number, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone_number.trim()) {
      setError('Phone number is required');
      return;
    }

    try {
      const res = await dispatch(db_sendOTP({ phone_number })).unwrap();
      localStorage.setItem('db_admin_forgot_phone', phone_number);
      toast.success(res.message || 'OTP sent successfully');
      window.location.href = '/AdminVerifyOTP';
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    }
  };

  return (
    <div className="d_auth_wrap">
      <div className="d_auth_container">
        <div className="d_auth_card">
          <img src={require('../Image/ki.png')} alt="Logo" className="d_auth_logo" />
          <p className="d_auth_subtitle fs-5">Forgot Password</p>
          <form onSubmit={handleSubmit}>
            <div className="d_auth_group">
              <label className="d_auth_label">Enter your phone number</label>
              <input
                type="tel"
                className="d_auth_input"
                placeholder="Enter your registered phone number"
                value={phone_number}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setError('');
                }}
              />
              {error && <small className="d_auth_error">{error}</small>}
            </div>
            <button type="submit" className="d_auth_btn mt-3">Send OTP</button>
          </form>
        </div>
      </div>
    </div>
  );
}
