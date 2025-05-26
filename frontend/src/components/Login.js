import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Chatbot.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Đăng nhập thành công! Chuyển hướng...');
        localStorage.setItem('userToken', data.token);
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.error || 'Đăng nhập thất bại.');
      }
    } catch {
      setError('Lỗi kết nối đến server.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">Đăng Nhập</div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="password" name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit">Đăng Nhập</button>
        </form>
        <p>
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </p>
        <p>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
      </div>
    </div>
  );
};

export default Login;
