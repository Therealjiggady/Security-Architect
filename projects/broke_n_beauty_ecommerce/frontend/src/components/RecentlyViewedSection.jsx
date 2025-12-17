import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import ProductCard from './ProductCard';

const RecentlyViewedSection = () => {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentlyViewed();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRecentlyViewed = async () => {
    try {
      const response = await fetch('http://localhost:8000/recently-viewed/', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching recently viewed products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show section if user is not logged in or has no recently viewed items
  if (!user || (!loading && products.length === 0)) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recently Viewed</h2>
        {products.length > 0 && (
          <button
            onClick={async () => {
              try {
                const response = await fetch('http://localhost:8000/recently-viewed/clear', {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${user.token}`
                  }
                });
                if (response.ok) {
                  setProducts([]);
                }
              } catch (error) {
                console.error('Error clearing recently viewed:', error);
              }
            }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Clear History
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4" style={{ minWidth: 'fit-content' }}>
            {products.map((product) => (
              <div key={product.id} className="w-64 flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentlyViewedSection;
