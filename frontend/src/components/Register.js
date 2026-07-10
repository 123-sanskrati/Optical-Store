import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

function Register({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success('🎉 Registered!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    }}>
      <div className="card p-4 shadow-lg border-0" style={{ 
        maxWidth: '400px', 
        width: '100%',
        borderRadius: '24px',
        background: 'white'
      }}>
        <h2 className="text-center mb-3" style={{ 
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📝 Create Account
        </h2>
        <p className="text-center text-muted small mb-3">Join us and start shopping!</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label small fw-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label small fw-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label small fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label small fw-semibold">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Role</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-semibold" style={{
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            border: 'none',
            padding: '10px',
            borderRadius: '50px'
          }}>
            Register 🚀
          </button>
        </form>

        <p className="mt-3 text-center small">
          Already have an account? <Link to="/login" style={{ 
            fontWeight: '600',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;