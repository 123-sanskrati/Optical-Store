import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/orders/all');
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('❌ Error:', err);
      let msg = 'Failed to load orders.';
      if (err.response?.status === 403) msg = 'You are not authorized as Admin.';
      else if (err.response?.data?.message) msg = err.response.data.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/orders/${id}`, { orderStatus: newStatus });
      toast.success(`✅ Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const statusColors = { pending: 'warning', confirmed: 'primary', shipped: 'info', delivered: 'success', cancelled: 'danger' };
  const statusBadge = (status) => `bg-${statusColors[status] || 'secondary'}`;

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-5">
        <h4 className="text-danger">❌ {error}</h4>
        <button className="btn btn-primary mt-3" onClick={fetchOrders}>Retry</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container text-center py-5">
        <h3>📭 No orders found</h3>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4">📦 All Orders <span className="badge bg-secondary">{orders.length}</span></h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order._id || i}>
                <td>{i + 1}</td>
                <td><b>{order.user?.name || order.shippingAddress?.fullName || 'N/A'}</b></td>
                <td>{order.user?.email || 'N/A'}</td>
                <td>₹{order.totalAmount || 0}</td>
                <td>{(order.paymentMethod || 'N/A').toUpperCase()}</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <span className={`badge ${statusBadge(order.orderStatus)}`}>
                    {(order.orderStatus || 'pending').toUpperCase()}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={order.orderStatus || 'pending'}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="confirmed">✅ Confirmed</option>
                    <option value="shipped">🚚 Shipped</option>
                    <option value="delivered">📦 Delivered</option>
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

export default AdminOrders;