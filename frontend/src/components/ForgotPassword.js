import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleCheckEmail = async () => {
    setError('');
    setSuccess('');

    if (!email) {
      setError('Vui lòng nhập email!');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/check-email/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Email hợp lệ! Nhập mật khẩu mới.');
        setShowReset(true);
      } else {
        setError(data.error || 'Email không tồn tại.');
      }
    } catch {
      setError('Lỗi kết nối đến server.');
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');

    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới!');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Đặt lại mật khẩu thành công! Chuyển hướng đến đăng nhập...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.error || 'Không thể đặt lại mật khẩu.');
      }
    } catch {
      setError('Lỗi kết nối đến server.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Quên Mật Khẩu</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        
        {!showReset ? (
          <>
            <div className="form-group">
              <input type="email" placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button onClick={handleCheckEmail}>Xác Nhận</button>
          </>
        ) : (
          <>
            <div className="form-group">
              <input type="password" placeholder="Nhập mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <button onClick={handleResetPassword}>Đặt lại mật khẩu</button>
          </>
        )}
        <p><a href="/login">Quay lại đăng nhập</a></p>
      </div>
    </div>
  );
};

export default ForgotPassword;
