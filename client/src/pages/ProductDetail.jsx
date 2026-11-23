import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, formatINR } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const { user } = useAuth();
  const { add } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api(`/products/${id}`)
      .then((data) => setProduct(data.product))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <main className="container">
        <p className="alert alert-error">{error}</p>
      </main>
    );
  }
  if (!product) {
    return (
      <main className="container">
        <p className="muted">Loading…</p>
      </main>
    );
  }

  const handleAdd = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await add(product._id, qty);
    setAdded(true);
  };

  return (
    <main className="container">
      <div className="detail">
        <img src={product.image} alt={product.name} className="detail-img" />
        <div className="detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-rating">★ {product.rating?.toFixed(1) ?? '4.0'} · {product.stock} in stock</p>
          <p className="detail-price">{formatINR(product.price)}</p>
          <p className="detail-desc">{product.description}</p>
          <div className="detail-actions">
            <label>
              Qty
              <input
                type="number"
                min="1"
                max="10"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
            <button type="button" className="btn btn-primary" onClick={handleAdd}>
              Add to Cart
            </button>
            {added && (
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/cart')}>
                Go to Cart →
              </button>
            )}
          </div>
          {added && <p className="alert alert-success">Added to your cart.</p>}
        </div>
      </div>
    </main>
  );
}
