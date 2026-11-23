import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container narrow">
      <form className="card form" onSubmit={onSubmit}>
        <h1>Welcome back</h1>
        <p className="muted">Login to your ShopKart account. Demo: demo@shopkart.in / demo123</p>
        {error && <p className="alert alert-error">{error}</p>}
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={onChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={onChange} required />
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Logging in…' : 'Login'}
        </button>
        <p className="muted center">
          New to ShopKart? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
