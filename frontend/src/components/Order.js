import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

function Orders() {
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
      
      // ✅ Token check
      const token = localStorage.getItem('token');
      console.log('🔑 Token present?', token ? '✅ Yes' : '❌ No');
      
      console.log('📦 Fetching orders...');
      const res = await API.get('/orders/my-orders');
      
      console.log('✅ Response Status:', res.status);
      console.log('✅ Orders data:', res.data);
      
      // ✅ Data set
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
        console.warn('⚠️ Orders data is not an array');
      }
      
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      
      let msg = 'Failed to load orders.';
      if (err.response?.status === 401) {
        msg = '⛔ Please login again.';
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOADING
  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading orders...</p>
      </div>
    );
  }

  // ✅ ERROR
  if (error) {
    return (
      <div className="container text-center py-5">
        <h4 className="text-danger">❌ {error}</h4>
        <button className="btn btn-primary mt-3" onClick={fetchOrders}>
          Retry
        </button>
      </div>
    );
  }

  // ✅ EMPTY
  if (orders.length === 0) {
    return (
      <div className="container text-center py-5">
        <h3>📦 No orders yet</h3>
        <p>Start shopping and place your first order!</p>
        <a href="/products" className="btn btn-primary">
          Browse Products 🛍️
        </a>
      </div>
    );
  }

  // ✅ ORDERS DISPLAY
  return (
    <div className="container my-4">
      <h2 className="mb-4">📦 My Orders</h2>

      {orders.map((order) => (
        <div className="card mb-4 shadow-sm" key={order._id}>
          <div className="card-header bg-light">
            <div className="row align-items-center">
              <div className="col-md-3">
                <strong>Order ID:</strong> #{order._id?.slice(-6) || 'N/A'}
              </div>
              <div className="col-md-3">
                <strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
              </div>
              <div className="col-md-3">
                <strong>Total:</strong> ₹{order.totalAmount || 0}
              </div>
              <div className="col-md-3">
                <span className={`badge bg-${
                  order.orderStatus === 'delivered' ? 'success' :
                  order.orderStatus === 'confirmed' ? 'primary' :
                  order.orderStatus === 'shipped' ? 'info' :
                  order.orderStatus === 'cancelled' ? 'danger' : 'warning'
                }`}>
                  {(order.orderStatus || 'pending').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <h6>Items:</h6>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <img
                        src={item.image || 'https://via.placeholder.com/50'}
                        alt={item.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                      />
                      <div>
                        <p className="mb-0">{item.name} × {item.quantity}</p>
                        <small className="text-muted">₹{item.price} each</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No items</p>
                )}
              </div>
              <div className="col-md-4">
                <h6>Shipping Address:</h6>
                <p className="mb-0">{order.shippingAddress?.fullName || 'N/A'}</p>
                <p className="mb-0">{order.shippingAddress?.address || 'N/A'}</p>
                <p className="mb-0">{order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'}</p>
                <p className="mb-0">Pincode: {order.shippingAddress?.pincode || 'N/A'}</p>
                <p className="mb-0">Phone: {order.shippingAddress?.phone || 'N/A'}</p>
                <p className="mt-2">
                  <small className="text-muted">
                    Payment: {(order.paymentMethod || 'N/A').toUpperCase()}
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Orders;