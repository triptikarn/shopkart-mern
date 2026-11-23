import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, formatINR } from '../api/client';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const placedOrderId = location.state?.placedOrderId;

  useEffect(() => {
    api('/orders', { auth: true })
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container">
      <h1>My Orders</h1>
      {placedOrderId && (
        <p className="alert alert-success">
          Order placed successfully! Order ID: <strong>{placedOrderId}</strong>
        </p>
      )}
      {error && <p className="alert alert-error">{error}</p>}
      {loading ? (
        <p className="muted">Loading your orders…</p>
      ) : orders.length === 0 ? (
        <p className="muted">You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order._id} className="card order-card">
              <div className="order-head">
                <div>
                  <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                  <span className="muted">
                    {' '}
                    · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.product}>
                    {item.name} × {item.qty} — {formatINR(item.price * item.qty)}
                  </li>
                ))}
              </ul>
              <p>
                Total: <strong>{formatINR(order.total)}</strong> · Payment: {order.paymentMethod} ·
                Deliver to: {order.shippingAddress.city}, {order.shippingAddress.pincode}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
