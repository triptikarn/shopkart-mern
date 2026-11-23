import { Link, useNavigate } from 'react-router-dom';
import { formatINR } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { add } = useCart();
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await add(product._id, 1);
  };

  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product._id}`} className="product-name">
          {product.name}
        </Link>
        <div className="product-meta">
          <span className="product-price">{formatINR(product.price)}</span>
          <span className="product-rating">★ {product.rating?.toFixed(1) ?? '4.0'}</span>
        </div>
        <button type="button" className="btn btn-primary btn-block" onClick={handleAdd}>
          Add to Cart
        </button>
      </div>
    </article>
  );
}
