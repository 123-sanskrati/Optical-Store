import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  // ✅ FIX: navigate() ko useEffect me rakho
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  if (cart.length === 0) {
    return (
      <div className="container text-center py-5">
        <h3>🛒 Your cart is empty</h3>
        <p>Browse our collection and add items you love!</p>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping 🛍️
        </Link>
      </div>
    );
  }

  const handleRemove = (id, name) => {
    removeFromCart(id);
    toast.info(`❌ ${name} removed from cart`);
  };

  const handleQuantityChange = (id, newQty) => {
    updateQuantity(id, newQty);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">🛒 Shopping Cart</h2>
      <div className="row">
        <div className="col-md-8">
          {cart.map((item) => (
            <div className="card mb-3" key={item._id}>
              <div className="row g-0">
                <div className="col-md-3">
                  <img
                    src={item.image}
                    className="img-fluid rounded-start"
                    alt={item.name}
                    style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-9">
                  <div className="card-body">
                    <h5>{item.name}</h5>
                    <p className="text-muted">{item.brand}</p>
                    <p className="fw-bold">₹{item.price}</p>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="fw-bold">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-danger btn-sm ms-3"
                        onClick={() => handleRemove(item._id, item.name)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>Order Summary</h5>
            <hr />
            <p>Items: {getTotalItems()}</p>
            <h5>Total: ₹{getTotalPrice()}</h5>
            <Link to="/checkout" className="btn btn-success w-100 mt-3">
              Proceed to Checkout 💳
            </Link>
            <button
              className="btn btn-outline-danger w-100 mt-2"
              onClick={() => {
                clearCart();
                toast.info('Cart cleared!');
              }}
            >
              Clear Cart 🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;