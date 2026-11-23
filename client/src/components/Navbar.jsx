import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Shop<span>Kart</span>
      </Link>
      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        {user ? (
          <>
            <NavLink to="/orders">My Orders</NavLink>
            <NavLink to="/cart" className="cart-link">
              Cart
              {cart.count > 0 && <span className="cart-badge">{cart.count}</span>}
            </NavLink>
            <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" className="btn btn-primary btn-small">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
