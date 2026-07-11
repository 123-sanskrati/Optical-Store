import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    phone: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await API.post('/auth/forgot-password', {
        email: form.email,
        phone: form.phone,
        newPassword: form.newPassword
      });
      toast.success('✅ Password reset successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow-lg border-0" style={{ maxWidth: '400px', width: '100%', borderRadius: '20px' }}>
        <h3 className="text-center mb-2">🔑 Forgot Password</h3>
        <p className="text-center text-muted small mb-4">Enter your registered email & phone to reset</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="form-control"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <p className="mt-3 text-center small">
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;