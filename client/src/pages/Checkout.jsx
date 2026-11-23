import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, formatINR } from '../api/client';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cart, clearLocal } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    pincode: '',
    paymentMethod: 'COD',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { paymentMethod, ...shippingAddress } = form;
      const data = await api('/orders', {
        method: 'POST',
        auth: true,
        body: { shippingAddress, paymentMethod },
      });
      clearLocal();
      navigate('/orders', { state: { placedOrderId: data.order._id } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <main className="container narrow center">
        <h1>Nothing to check out</h1>
        <p className="muted">Your cart is empty — add a product first.</p>
      </main>
    );
  }

  return (
    <main className="container narrow">
      <form className="card form" onSubmit={onSubmit}>
        <h1>Checkout</h1>
        <p className="muted">
          {cart.count} item(s) · Total <strong>{formatINR(cart.subtotal)}</strong> · Free delivery
        </p>
        {error && <p className="alert alert-error">{error}</p>}
        <label>
          Full name
          <input name="fullName" value={form.fullName} onChange={onChange} required />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={onChange} required />
        </label>
        <label>
          Address
          <input name="addressLine" value={form.addressLine} onChange={onChange} required />
        </label>
        <div className="form-row">
          <label>
            City
            <input name="city" value={form.city} onChange={onChange} required />
          </label>
          <label>
            PIN code
            <input name="pincode" value={form.pincode} onChange={onChange} required />
          </label>
        </div>
        <label>
          Payment method
          <select name="paymentMethod" value={form.paymentMethod} onChange={onChange}>
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Placing order…' : `Place Order · ${formatINR(cart.subtotal)}`}
        </button>
      </form>
    </main>
  );
}
