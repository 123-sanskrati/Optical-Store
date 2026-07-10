import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../api';
import { toast } from 'react-toastify';

function Checkout() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Agar cart empty hai toh redirect
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: getTotalPrice(),
        shippingAddress: form,
        paymentMethod
      };

      console.log('📦 Order data:', orderData);

      const res = await API.post('/orders', orderData);
      console.log('✅ Order placed:', res.data);

      toast.success('🎉 Order placed successfully!');
      clearCart();
      navigate('/orders');

    } catch (err) {
      console.error('❌ Order error:', err);
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">📋 Checkout</h2>

      <div className="row">
        <div className="col-md-7">
          <div className="card p-4">
            <h5>Shipping Address</h5>
            <form onSubmit={handleSubmit}>
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

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      className="form-control"
                      value={form.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      className="form-control"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

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

              <div className="mb-3">
                <label className="form-label">Payment Method</label>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <label className="form-check-label">💵 Cash on Delivery</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <label className="form-check-label">💳 Card Payment</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <label className="form-check-label">📱 UPI</label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Placing Order...
                  </>
                ) : (
                  'Place Order 🚀'
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card p-4">
            <h5>Order Summary</h5>
            <hr />
            {cart.map((item) => (
              <div key={item._id} className="d-flex justify-content-between mb-2">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <hr />
            <h5>Total: ₹{getTotalPrice()}</h5>
            <p className="text-muted small">Items: {cart.reduce((acc, item) => acc + item.quantity, 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;