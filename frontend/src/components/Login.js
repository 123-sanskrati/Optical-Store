import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success('Logged in!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">🔐 Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" className="form-control mb-2" placeholder="Email"
            value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
          <input type="password" className="form-control mb-2" placeholder="Password"
            value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="mt-3 text-center">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

export default Login;