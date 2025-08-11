import React, { useState } from 'react';
import '../style/d_style.css';
import { useDispatch } from 'react-redux';
import { db_verifyOTP } from '../redux/slice/auth.slice';
import { toast } from 'react-toastify';

export default function AdminVerifyOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    const phone_number = localStorage.getItem('db_admin_forgot_phone'); // ⬅️ use phone number

    if (!phone_number) {
      toast.error('Phone number not found. Please go back and try again.');
      return;
    }

    try {
      const res = await dispatch(db_verifyOTP({ phone_number, otp })).unwrap();
      toast.success(res.message || 'OTP verified');
      window.location.href = '/AdminResetPassword';
    } catch (err) {
      toast.error(err.message || 'Invalid OTP');
    }
  };

  return (
    <div className="d_auth_wrap">
      <div className="d_auth_container">
        <div className="d_auth_card">
          <img src={require('../Image/ki.png')} alt="Logo" className="d_auth_logo" />
          <p className="d_auth_subtitle fs-5">Verify OTP</p>
          <form onSubmit={handleSubmit}>
            <div className="d_auth_group">
              <label className="d_auth_label">Enter the 6-digit OTP</label>
              <input
                type="text"
                className="d_auth_input"
                placeholder="Enter your 6 digit OTP"
                maxLength="6"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError('');
                }}
              />
              {error && <small className="d_auth_error">{error}</small>}
            </div>
            <button type="submit" className="d_auth_btn mt-3">Verify</button>
          </form>
        </div>
      </div>
    </div>
  );
}
