import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db_registerUser } from '../redux/slice/auth.slice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/d_style.css';

export default function AdminRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, authUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (authUser) {
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(authUser.data));
      localStorage.setItem('userId', JSON.stringify(authUser.data._id));

      toast.success('Registration successful');

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        phone_number: '',
      });

      // Redirect after a delay
      setTimeout(() => navigate('/'), 1500);
    }
  }, [authUser, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Registration failed');
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error on field change
    setErrors({ ...errors, [name]: '' });
  };

 const validate = () => {
  const newErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
    newErrors.name = 'Name must only contain letters';
  }

  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = 'Invalid email format';
  }

  if (!formData.phone_number.trim()) {
    newErrors.phone_number = 'Phone number is required';
  } else if (!phoneRegex.test(formData.phone_number)) {
    newErrors.phone_number = 'Phone number must be 10 digits';
  }

if (!formData.password.trim()) {
    newErrors.password = 'Password is required';
  } else {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must include uppercase, lowercase, number, and special character';
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('email', formData.email);
    submissionData.append('password', formData.password);
    submissionData.append('phone_number', formData.phone_number);

    dispatch(db_registerUser(submissionData));
  };

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="d_auth_wrap">
      <ToastContainer />
      <div className="d_auth_container">
        <div className="d_auth_card d_auth_card_login">
          <img src={require('../Image/ki.png')} alt="Logo" className="d_auth_logo" />
          <p className="d_auth_subtitle">Admin Access Only — Please Sign Up to Continue</p>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="d_auth_group">
              <label className="d_auth_label">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                className="d_auth_input"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <small className="d_auth_error">{errors.name}</small>}
            </div>

            <div className="d_auth_group mt-3">
              <label className="d_auth_label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="d_auth_input"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <small className="d_auth_error">{errors.email}</small>}
            </div>

            <div className="d_auth_group mt-3">
              <label className="d_auth_label">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                placeholder="Enter 10-digit phone number"
                className="d_auth_input"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {errors.phone_number && (
                <small className="d_auth_error">{errors.phone_number}</small>
              )}
            </div>

            <div className="d_auth_group mt-3 position-relative">
              <label className="d_auth_label">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                className="d_auth_input"
                value={formData.password}
                onChange={handleChange}
              />
              <span className="d_auth_toggle_icon" onClick={togglePassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && <small className="d_auth_error">{errors.password}</small>}
            </div>

            <button type="submit" className="d_auth_btn mt-3" disabled={loading}>
              {loading ? 'Registering...' : 'Sign Up'}
            </button>

            <p className="d_auth_footer mt-3">
              Already have an account?{' '}
              <a href="/AdminLogin" className="text-info">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
