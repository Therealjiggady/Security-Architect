import React, { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data to demonstrate JOIN query results
  // In a real app, this would come from your backend API
  useEffect(() => {
    // Simulate API call with JOIN query results
    const mockProducts = [
      {
        id: 1,
        name: 'BnB Sport Bra – Black',
        description: 'Comfortable sports bra with excellent support for all-day wear',
        sku: 'BNB-SB-BLK',
        price: 11.99,
        categories: ['Sports Bras', 'Activewear'],
        image: 'https://images.unsplash.com/photo-1599050751795-5f9a2b2f1f1a?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 2,
        name: 'BnB Biker Short – Navy',
        description: 'High-waisted biker shorts perfect for workouts and casual wear',
        sku: 'BNB-BS-NVY',
        price: 9.99,
        categories: ['Biker Shorts', 'Activewear'],
        image: 'https://images.unsplash.com/photo-1618354691438-25e8c4a7cb68?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 3,
        name: 'BnB Unisex Scrub Top',
        description: 'Professional scrub top suitable for healthcare workers',
        sku: 'BNB-ST-UNI',
        price: 33.99,
        categories: ['Scrubs'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 4,
        name: 'BnB Compression Leggings',
        description: 'Moisture-wicking compression leggings for intense workouts',
        sku: 'BNB-CL-BLK',
        price: 24.99,
        categories: ['Leggings', 'Activewear'],
        image: 'https://images.unsplash.com/photo-1506629905607-0b5ab9a9e21a?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 5,
        name: 'BnB Yoga Tank Top',
        description: 'Breathable tank top designed for yoga and pilates',
        sku: 'BNB-YT-GRY',
        price: 15.99,
        categories: ['Tank Tops', 'Activewear'],
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop'
      }
    ];

    const mockCategories = [
      { id: 1, name: 'Sports Bras', description: 'Supportive and comfortable sports bras' },
      { id: 2, name: 'Biker Shorts', description: 'High-waisted shorts for workouts' },
      { id: 3, name: 'Scrubs', description: 'Professional medical apparel' },
      { id: 4, name: 'Leggings', description: 'Compression and yoga leggings' },
      { id: 5, name: 'Tank Tops', description: 'Breathable tank tops' },
      { id: 6, name: 'Activewear', description: 'General athletic clothing' }
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setCategories(mockCategories);
      setLoading(false);
    }, 500);
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.categories.includes(selectedCategory));

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

          {/* Category Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* JOIN Query Demonstration */}
          <div className="bg-zinc-800/50 rounded-lg p-4 mb-6 border border-zinc-700">
            <h3 className="text-lg font-semibold mb-2 text-emerald-300">🔗 JOIN Query Demonstration</h3>
            <p className="text-sm text-zinc-300 mb-2">
              This page demonstrates a JOIN between products and categories tables:
            </p>
            <code className="block bg-zinc-900 p-3 rounded text-xs text-zinc-200 font-mono">
              SELECT p.*, GROUP_CONCAT(c.name) as categories<br/>
              FROM products p<br/>
              LEFT JOIN product_categories pc ON p.id = pc.product_id<br/>
              LEFT JOIN categories c ON pc.category_id = c.id<br/>
              GROUP BY p.id
            </code>
            <p className="text-xs text-zinc-400 mt-2">
              This query shows the many-to-many relationship between products and categories
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <span className="text-emerald-300 font-semibold">${product.price}</span>
                </div>
                <p className="text-sm text-zinc-300 mb-3">{product.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-block bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400">No products found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
}