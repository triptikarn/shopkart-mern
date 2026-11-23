import { Link } from 'react-router-dom';
import { formatINR } from '../api/client';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, setQty, remove } = useCart();

  if (cart.items.length === 0) {
    return (
      <main className="container narrow center">
        <h1>Your cart is empty</h1>
        <p className="muted">Browse the store and add something you like.</p>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.product} className="cart-row">
              <img src={item.image} alt={item.name} />
              <div className="cart-row-info">
                <strong>{item.name}</strong>
                <span className="muted">{formatINR(item.price)} each</span>
              </div>
              <div className="qty-controls">
                <button type="button" onClick={() => setQty(item.product, item.qty - 1)}>
                  −
                </button>
                <span>{item.qty}</span>
                <button type="button" onClick={() => setQty(item.product, item.qty + 1)}>
                  +
                </button>
              </div>
              <strong>{formatINR(item.lineTotal)}</strong>
              <button type="button" className="btn btn-ghost" onClick={() => remove(item.product)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <aside className="card summary">
          <h2>Order Summary</h2>
          <p>
            Items: <strong>{cart.count}</strong>
          </p>
          <p>
            Subtotal: <strong>{formatINR(cart.subtotal)}</strong>
          </p>
          <p className="muted">Delivery is free on all orders.</p>
          <Link to="/checkout" className="btn btn-primary btn-block">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}
