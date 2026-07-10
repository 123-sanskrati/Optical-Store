import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import API from '../api';
import { toast } from 'react-toastify';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      console.log('📦 Products fetched:', res.data);
      setProducts(res.data);
      setError('');
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    console.log('🛒 Clicked Add to Cart:', product.name);
    addToCart(product);
    toast.success(`🛒 ${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-5">
        <h4>❌ {error}</h4>
        <button className="btn btn-primary mt-3" onClick={fetchProducts}>
          Retry
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container text-center py-5">
        <h4>🕶️ No products found</h4>
        <p>Add products to your database to see them here.</p>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">👓 Our Collection</h2>

      <div className="row g-4">
        {products.map((product) => (
          <div className="col-md-3 col-6" key={product._id}>
            <div className="card h-100 shadow-sm">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <div className="card-body">
                <h6 className="card-title" style={{ fontSize: '14px' }}>
                  {product.name}
                </h6>
                <p className="text-muted small mb-1">{product.brand}</p>
                <p className="fw-bold mb-0">₹{product.price}</p>
                {product.originalPrice && (
                  <del className="text-muted small">₹{product.originalPrice}</del>
                )}
                {product.rating > 0 && (
                  <div className="mt-1">
                    <span className="text-warning">⭐</span>
                    <span className="small">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                )}
                <button
                  className="btn btn-primary btn-sm w-100 mt-2"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;