import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      {/* ✅ HERO SECTION */}
      <div className="hero-section text-white text-center">
        <div className="container">
          <h1 className="display-2 fw-bold mb-3" style={{ letterSpacing: '-1px' }}>
            See the World<br />in Style
          </h1>
          <p className="lead fs-4 mb-4" style={{ opacity: 0.9 }}>
            Premium eyewear & eye care products at best prices
          </p>
          <Link to="/products" className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-bold shadow">
            Shop Now 🛍️
          </Link>
        </div>
      </div>

      {/* ✅ CATEGORIES */}
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4" style={{ fontSize: '2rem', color: '#1a1a2e' }}>
          Shop by Category
        </h2>
        <div className="row g-4">
          {[
            { icon: '🕶️', name: 'Sunglasses', desc: 'UV protection' },
            { icon: '👓', name: 'Eyeglasses', desc: 'Clear vision' },
            { icon: '💻', name: 'Computer Glasses', desc: 'Blue cut' },
            { icon: '💧', name: 'Eye Drops', desc: 'Refresh eyes' }
          ].map((cat, i) => (
            <div className="col-md-3 col-6" key={i}>
              <div className="card text-center border-0 h-100 shadow-sm">
                <div className="card-body py-4">
                  <div style={{ fontSize: '3rem' }}>{cat.icon}</div>
                  <h5 className="mt-2 fw-bold">{cat.name}</h5>
                  <p className="text-muted small">{cat.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ FEATURES */}
      <div className="bg-light py-5" style={{ borderRadius: '40px 40px 0 0' }}>
        <div className="container">
          <div className="row text-center g-4">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹499' },
              { icon: '🔄', title: 'Easy Returns', desc: '30-day return policy' },
              { icon: '🔒', title: 'Secure Payment', desc: '100% secure' },
              { icon: '👁️', title: 'Expert Support', desc: '24/7 customer care' }
            ].map((feature, i) => (
              <div className="col-md-3 col-6" key={i}>
                <div className="p-3">
                  <div style={{ fontSize: '2.2rem' }}>{feature.icon}</div>
                  <h6 className="mt-2 fw-bold">{feature.title}</h6>
                  <small className="text-muted">{feature.desc}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;