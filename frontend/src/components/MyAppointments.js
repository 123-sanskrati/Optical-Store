import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/appointments/my-appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Failed to load your appointments.');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = { pending: 'warning', confirmed: 'primary', completed: 'success', cancelled: 'danger' };
  const statusBadge = (status) => `bg-${statusColors[status] || 'secondary'}`;

  const statusMessage = (status) => {
    switch (status) {
      case 'pending': return '⏳ Waiting for doctor confirmation';
      case 'confirmed': return '✅ Confirmed by doctor';
      case 'completed': return '🎯 Appointment completed';
      case 'cancelled': return '❌ Appointment cancelled';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading your appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-5">
        <h4 className="text-danger">❌ {error}</h4>
        <button className="btn btn-primary mt-3" onClick={fetchMyAppointments}>Retry</button>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="container text-center py-5">
        <h3>📭 No appointments yet</h3>
        <p>Book your first appointment now!</p>
        <a href="/appointment" className="btn btn-primary">+ Book Appointment</a>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4">📋 My Appointments</h2>
      <div className="row">
        {appointments.map((apt) => (
          <div className="col-md-6 mb-3" key={apt._id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title mb-0">{apt.type || 'Appointment'}</h5>
                  <span className={`badge ${statusBadge(apt.status)}`}>
                    {(apt.status || 'pending').toUpperCase()}
                  </span>
                </div>
                <p className="mb-1"><b>📅 Date:</b> {apt.date ? new Date(apt.date).toLocaleDateString() : 'N/A'}</p>
                <p className="mb-1"><b>🕒 Time:</b> {apt.time || 'N/A'}</p>
                <p className="mb-1"><b>📞 Phone:</b> {apt.phone || 'N/A'}</p>
                {apt.notes && <p className="mb-1"><b>📝 Notes:</b> {apt.notes}</p>}
                <hr />
                <p className="mb-0 fw-semibold">{statusMessage(apt.status)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointments;