import React, { useState, useEffect } from 'react';
import '../style/d_style.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { db_loginUser } from '../redux/slice/auth.slice'; // adjust path as needed
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { authUser, loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
            if (!passwordRegex.test(formData.password)) {
                newErrors.password = 'Password must include uppercase, lowercase, number, and special character';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            dispatch(db_loginUser(formData));
        }
    };

    useEffect(() => {
        if (authUser) {
            // Save full user object and userId to localStorage
            localStorage.setItem('user', JSON.stringify(authUser.data));
            localStorage.setItem('userId', authUser.data?._id);

            toast.success('Login successful!');
            navigate('/');
        }
    }, [authUser, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(typeof error === 'string' ? error : 'Login failed. Try again.');
        }
    }, [error]);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="d_auth_wrap">
            <div className="d_auth_container">
                <div className="d_auth_card d_auth_card_login">
                    <img src={require('../Image/ki.png')} alt="Logo" className="d_auth_logo" />
                    <p className="d_auth_subtitle">Admin Access Only — Please Sign In to Continue</p>

                    <form onSubmit={handleSubmit}>
                        <div className="d_auth_group">
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

                        <div className="d_auth_group position-relative mt-3">
                            <label className="d_auth_label">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter password"
                                className="d_auth_input"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                            <span className="d_auth_toggle_icon" onClick={togglePassword}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            {errors.password && <small className="d_auth_error">{errors.password}</small>}
                        </div>

                        {error && (
                            <div className="d_auth_error mt-2 text-danger text-center">
                                {typeof error === 'string' ? error : 'Login failed. Try again.'}
                            </div>
                        )}

                        <div className="d-flex justify-content-end align-items-center mt-2">
                            <a href="/AdminForgotPassword" className="small" style={{ color: '#6159a1', textDecoration: 'none' }}>
                                Forgot Password?
                            </a>
                        </div>

                        <button type="submit" className="d_auth_btn mt-3" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="d-flex justify-content-center align-items-center mt-2">
                            <a href="/AdminRegister" className="small" style={{ color: '#6159a1', textDecoration: 'none' }}>
                                Don’t have an account? Register
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
