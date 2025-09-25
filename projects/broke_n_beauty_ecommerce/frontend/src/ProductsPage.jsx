import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur border-b border-white/10 bg-zinc-950/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-400/40 grid place-items-center">
              <span className="text-emerald-300 font-bold">BnB</span>
            </div>
            <span className="font-semibold tracking-wide">Broke N Beauty</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
            <a className="hover:text-white" href="/">Home</a>
            <a className="hover:text-white text-emerald-300" href="/products">Products</a>
            <a className="hover:text-white" href="/cart">Cart</a>
            <a className="hover:text-white" href="/profile">Profile</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Our Products</h1>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <div className="aspect-[4/3] overflow-hidden bg-zinc-800">
                {/* Placeholder for image */}
                <div className="h-full w-full flex items-center justify-center text-zinc-400">
                  <span className="text-4xl">📦</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <span className="text-emerald-300 font-semibold">${product.price}</span>
                </div>
                <p className="text-sm text-zinc-300 mb-3">{product.description}</p>
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-zinc-400 mb-2">Available sizes:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.variants.map((variant) => (
                        <span
                          key={variant.id}
                          className="inline-block bg-zinc-700 text-zinc-300 text-xs px-2 py-1 rounded"
                        >
                          {variant.size} {variant.color && `(${variant.color})`} - {variant.stock} in stock
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 transition-colors">
                    Add to Cart
                  </button>
                  <button className="rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/10 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400">No products available.</p>
          </div>
        )}
      </main>
    </div>
  );
}