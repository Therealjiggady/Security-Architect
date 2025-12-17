import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card.tsx';
import { Button } from './ui/button.tsx';

/**
 * DreamWishlistCard Component
 * Displays a single dream product with "Notify Me" functionality
 */
const DreamWishlistCard = ({ product, isInterested, onToggleInterest }) => {
  const handleImageError = (e) => {
    // If image fails to load, hide it and show fallback
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'flex';
  };

  return (
    <Card className="group overflow-hidden rounded-2xl border border-border bg-card/5 hover:bg-card/10 transition-all duration-300">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.placeholderImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
        />
        {/* Fallback gradient if image fails */}
        <div
          className="hidden absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 items-center justify-center"
          style={{ display: 'none' }}
        >
          <div className="text-center p-4">
            <div className="text-4xl mb-2">✨</div>
            <p className="text-sm font-medium text-muted-foreground">{product.name}</p>
          </div>
        </div>

        {/* Coming Soon Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {product.category}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <p className="mt-3 text-lg font-bold text-primary">
          {product.points} points
        </p>
      </CardContent>

      {/* Footer with Action Button */}
      <CardFooter className="pt-0">
        <Button
          onClick={() => onToggleInterest(product.id)}
          variant={isInterested ? "secondary" : "default"}
          className="w-full"
        >
          {isInterested ? (
            <>
              <span className="mr-2">✓</span>
              You're Interested!
            </>
          ) : (
            <>
              <span className="mr-2">🔔</span>
              Notify Me
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DreamWishlistCard;
