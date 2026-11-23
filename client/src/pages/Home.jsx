import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/products/categories')
      .then((data) => setCategories(data.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    setLoading(true);
    api(`/products?${params.toString()}`)
      .then((data) => {
        setProducts(data.products);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <main className="container">
      <section className="hero">
        <h1>Shop Smart, Live Better</h1>
        <p>Electronics, fashion, home essentials and fitness gear — delivered to your door.</p>
      </section>

      <section className="filters">
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products"
        />
        <div className="category-pills">
          <button
            type="button"
            className={category === '' ? 'pill active' : 'pill'}
            onClick={() => setCategory('')}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={category === c ? 'pill active' : 'pill'}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="alert alert-error">{error} — is the API server running?</p>}
      {loading ? (
        <p className="muted">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="muted">No products match your search.</p>
      ) : (
        <section className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </section>
      )}
    </main>
  );
}
