import React from 'react';
import DreamWishlistCard from './components/DreamWishlistCard';
import { dreamWishlistProducts } from './data/dreamWishlistProducts';
import { useDreamWishlistInterest } from './hooks/useDreamWishlistInterest';
import { MetaTags } from './components/SEO/MetaTags';
import { getPageSEO } from './config/seo';

export default function DreamWishlistPage() {
  const { toggleInterest, isInterested } = useDreamWishlistInterest();

  // Get SEO data for this page
  const seo = getPageSEO('dreamWishlist');

  return (
    <>
      {/* SEO Meta Tags */}
      <MetaTags
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        url={seo.url}
      />

      <div className="min-h-screen bg-background text-foreground">
        <main className="mx-auto max-w-6xl px-4 py-8">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Dream Wishlist
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a sneak peek at our upcoming Broken Beauty collection! These are products we're dreaming of creating.
              Click "Notify Me" to show your interest and help us prioritize what to launch next!
            </p>
          </div>

          {/* Products Grid */}
          {dreamWishlistProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dreamWishlistProducts.map((product) => (
                <DreamWishlistCard
                  key={product.id}
                  product={product}
                  isInterested={isInterested(product.id)}
                  onToggleInterest={toggleInterest}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No dream products yet. Check back soon!
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center p-8 rounded-2xl border border-border bg-card/5">
            <h2 className="text-2xl font-bold mb-3">
              Can't wait for these products?
            </h2>
            <p className="text-muted-foreground mb-6">
              Check out our current collection while you wait!
            </p>
            <a
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8"
            >
              Shop Current Collection
            </a>
          </div>
        </main>
      </div>
    </>
  );
}
