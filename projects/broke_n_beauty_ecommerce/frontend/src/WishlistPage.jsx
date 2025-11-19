import React, { useState, useEffect } from 'react';
import { useUser } from './contexts/UserContext';
import { API_URL } from './config';

const API_BASE = API_URL;

export default function WishlistPage() {
  const { user } = useUser();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`${API_BASE}/wishlist/`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      const data = await response.json();
      setWishlistItems(data);
      console.log('Wishlist items:', data); // DOM outputs: log to console
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistItemId) => {
    try {
      const response = await fetch(`${API_BASE}/wishlist/remove/${wishlistItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }
      setWishlistItems(items => items.filter(item => item.id !== wishlistItemId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Please log in to view your wishlist.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur border-b border-border bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/20 ring-1 ring-primary/40 grid place-items-center">
              <span className="text-primary font-bold">BnB</span>
            </div>
            <span className="font-semibold tracking-wide">Broke N Beauty</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a className="hover:text-foreground" href="/">Home</a>
            <a className="hover:text-foreground" href="/products">Products</a>
            <a className="hover:text-foreground" href="/cart">Cart</a>
            <a className="hover:text-primary" href="/wishlist">Wishlist ({wishlistItems.length})</a>
            <a className="hover:text-foreground" href="/profile">Profile</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save products for later!</p>
            <a
              href="/products"
              className="inline-block rounded-2xl px-6 py-3 font-medium transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group overflow-hidden rounded-2xl border border-border bg-card/5 hover:bg-card/10 transition-colors">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={`http://localhost:8000/static/images/default-product.jpg`}
                    alt="Product"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-lg">Product {item.product_id}</h3>
                    <span className="text-primary font-semibold">$XX.XX</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Saved for later</p>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors">
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="rounded-xl border border-destructive/20 px-3 py-2 text-sm hover:bg-destructive/10 transition-colors text-destructive"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}