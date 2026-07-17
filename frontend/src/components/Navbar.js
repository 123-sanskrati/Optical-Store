import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{
      background: 'rgba(255, 255, 255, 0.92)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      padding: '12px 0'
    }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" style={{
          fontSize: '1.6rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
        LensWorld
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/" style={{ color: '#4a4a6a' }}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/products" style={{ color: '#4a4a6a' }}>🕶️ Frames</Link>
            </li>
            <li className='nav-item'>
              <link className='nav-link fw-medium' to='/contact-us' style={{ color: '#4a4a6a' }}>📞 Contact Us</link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/cart" style={{ color: '#4a4a6a' }}>
                🛒 Cart 
                {getTotalItems() > 0 && (
                  <span className="badge rounded-pill ms-1" style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '4px 10px'
                  }}>{getTotalItems()}</span>
                )}
              </Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-medium" to="/orders" style={{ color: '#4a4a6a' }}>📦 Orders</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-medium" to="/appointment" style={{ color: '#4a4a6a' }}>📅 Appointment</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-medium" to="/my-appointments" style={{ color: '#4a4a6a' }}>📋 My Appointments</Link>
                </li>
                {user?.role === 'admin' && (
                  <>
                  <li className="nav-item">
                    <Link className="nav-link fw-medium" to="/admin-appointments" style={{ color: '#4a4a6a' }}>⚙️ Manage</Link>
                  </li>
<li className="nav-item">
      <Link className="nav-link fw-medium" to="/admin-orders" style={{ color: '#4a4a6a' }}>📦 Manage Orders</Link>
    </li>
    </>
                )}
                <li className="nav-item">
                  <span className="nav-link fw-semibold" style={{ 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    padding: '4px 12px'
                  }}>
                    👋 {user.name}
                  </span>
                </li>
<li className="nav-item">
  <Link className="nav-link fw-medium" to="/change-password" style={{ color: '#4a4a6a' }}>🔒 Change Password</Link>
</li>






                <li className="nav-item">
                  <button
                    className="btn btn-sm rounded-pill px-4"
                    onClick={handleLogout}
                    style={{
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      border: 'none',
                      fontWeight: '600'
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-medium" to="/login" style={{ color: '#4a4a6a' }}>Login</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link
                    className="btn btn-primary btn-sm rounded-pill px-4 fw-semibold"
                    to="/register"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none'
                    }}
                  >
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;