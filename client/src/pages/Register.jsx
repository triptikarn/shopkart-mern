import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
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
        <h1>Create your account</h1>
        <p className="muted">Join ShopKart in under a minute.</p>
        {error && <p className="alert alert-error">{error}</p>}
        <label>
          Full name
          <input type="text" name="name" value={form.name} onChange={onChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={onChange} required />
        </label>
        <label>
          Password (min. 6 characters)
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            minLength={6}
            required
          />
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Creating account…' : 'Sign Up'}
        </button>
        <p className="muted center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
