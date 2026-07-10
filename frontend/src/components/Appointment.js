import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

function Appointment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    type: 'eye-checkup',
    prescriptionAvailable: false,
    notes: ''
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/appointments', form);
      console.log('✅ Appointment booked:', res.data);
      toast.success('📅 Appointment booked successfully!');
      navigate('/');
    } catch (err) {
      console.error('❌ Appointment error:', err);
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 shadow">
            <h2 className="text-center mb-4">📅 Book Appointment</h2>
            <p className="text-center text-muted">Schedule an eye checkup or frame fitting</p>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
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
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Appointment Type</label>
                    <select
                      name="type"
                      className="form-control"
                      value={form.type}
                      onChange={handleChange}
                    >
                      <option value="eye-checkup">👁️ Eye Checkup</option>
                      <option value="frame-fitting">👓 Frame Fitting</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={form.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      name="time"
                      className="form-control"
                      value={form.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="prescriptionAvailable"
                    className="form-check-input"
                    checked={form.prescriptionAvailable}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">I have a prescription</label>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Additional Notes</label>
                <textarea
                  name="notes"
                  className="form-control"
                  rows="3"
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Booking...
                  </>
                ) : (
                  'Book Appointment 📅'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointment;