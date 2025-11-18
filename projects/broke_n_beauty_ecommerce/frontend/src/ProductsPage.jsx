import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import SizeRecommender from './components/SizeRecommender';
import { Button } from './components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from './components/ui/navigation-menu';
import { cn } from './lib/utils';
import { Link } from 'react-router-dom';
import { API_URL } from './config';
import { MetaTags } from './components/SEO/MetaTags';
import { CollectionPageSchema, BreadcrumbSchema } from './components/SEO/StructuredData';
import { getPageSEO } from './config/seo';

const API_BASE = API_URL;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Starting fetch for products from:', `${API_BASE}/products/`);
        const response = await fetch(`${API_BASE}/products/`);
        console.log('Response status:', response.status, 'OK:', response.ok, 'Headers:', Object.fromEntries(response.headers.entries()));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Parsed data:', data, 'Type:', typeof data, 'Is array:', Array.isArray(data));
        setProducts(data);
      } catch (err) {
        console.error('Error in fetchProducts:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading products...</p>
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

  // SEO data for products page
  const seoData = getPageSEO('products', {
    description: `Browse our complete collection of ${products.length} premium activewear items including leggings, sports bras, workout tops, and athleisure wear.`
  });

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* SEO Meta Tags */}
      <MetaTags
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
      />
      
      {/* Structured Data */}
      <CollectionPageSchema
        category="Activewear"
        products={products}
        url={`${seoData.url}/products`}
      />
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur border-b border-border bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/20 ring-1 ring-primary/40 grid place-items-center">
              <span className="text-primary font-bold">BnB</span>
            </div>
            <span className="font-semibold tracking-wide">Broken Beauty</span>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link className={cn(navigationMenuTriggerStyle(), "cursor-pointer")} to="/">
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a className={cn(navigationMenuTriggerStyle(), "cursor-pointer text-primary")} href="/products">
                    Products
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link className={cn(navigationMenuTriggerStyle(), "cursor-pointer")} to="/cart">
                    Cart
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link className={cn(navigationMenuTriggerStyle(), "cursor-pointer")} to="/profile">
                    Profile
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="sm"
                  variant="outline"
                >
                  Size Recommender
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Premium Activewear Collection</h1>
          <p className="text-muted-foreground text-lg">
            Discover our complete range of high-performance activewear designed for style and comfort.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available.</p>
          </div>
        )}
      </main>

      <SizeRecommender isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}