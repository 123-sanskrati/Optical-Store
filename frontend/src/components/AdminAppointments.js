import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');

      // ✅ 1. TOKEN CHECK
      const token = localStorage.getItem('token');
      console.log('🔑 Token present?', token ? '✅ Yes' : '❌ No');
      
      // ✅ 2. API CALL
      console.log('📅 Fetching all appointments...');
      const res = await API.get('/appointments/all');
      
      // ✅ 3. RESPONSE CHECK
      console.log('✅ Response Status:', res.status);
      console.log('✅ Response Data:', res.data);
      
      // ✅ 4. DATA SET
      if (Array.isArray(res.data)) {
        setAppointments(res.data);
      } else {
        console.warn('⚠️ Data is not an array:', res.data);
        setAppointments([]);
      }
      
    } catch (err) {
      console.error('❌ Error:', err);
      
      let msg = 'Failed to load appointments.';
      if (err.response) {
        console.error('❌ Server Response:', err.response.status, err.response.data);
        if (err.response.status === 401) msg = 'Session expired. Please login again.';
        else if (err.response.status === 403) msg = 'You are not authorized as Admin.';
        else if (err.response.data?.message) msg = err.response.data.message;
      } else {
        msg = 'Network error. Is backend running?';
      }
      
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/appointments/${id}`, { status: newStatus });
      toast.success(`✅ Status updated to ${newStatus}`);
      fetchAppointments(); // Refresh list
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // UI HELPERS
  const statusColors = { pending: 'warning', confirmed: 'primary', completed: 'success', cancelled: 'danger' };
  const statusBadge = (status) => `bg-${statusColors[status] || 'secondary'}`;

  // LOADING
  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="container text-center py-5">
        <h4 className="text-danger">❌ {error}</h4>
        <button className="btn btn-primary mt-3" onClick={fetchAppointments}>Retry</button>
      </div>
    );
  }

  // EMPTY
  if (appointments.length === 0) {
    return (
      <div className="container text-center py-5">
        <h3>📭 No appointments found</h3>
        <p>Ask a customer to book an appointment first!</p>
        <a href="/appointment" className="btn btn-primary">+ Book Appointment</a>
      </div>
    );
  }

  // RENDER TABLE
  return (
    <div className="container my-4">
      <h2 className="mb-4">📋 All Appointments <span className="badge bg-secondary">{appointments.length}</span></h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt, i) => (
              <tr key={apt._id || i}>
                <td>{i + 1}</td>
                <td><b>{apt.fullName || 'N/A'}</b></td>
                <td>{apt.email || 'N/A'}</td>
                <td>{apt.phone || 'N/A'}</td>
                <td>{apt.date ? new Date(apt.date).toLocaleDateString() : 'N/A'}</td>
                <td>{apt.time || 'N/A'}</td>
                <td>{apt.type || 'N/A'}</td>
                <td>
                  <span className={`badge ${statusBadge(apt.status)}`}>
                    {(apt.status || 'pending').toUpperCase()}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={apt.status || 'pending'}
                    onChange={(e) => updateStatus(apt._id, e.target.value)}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="confirmed">✅ Confirmed</option>
                    <option value="completed">🎯 Completed</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAppointments;