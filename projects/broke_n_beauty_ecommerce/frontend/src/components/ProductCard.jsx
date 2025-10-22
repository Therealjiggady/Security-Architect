import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';

const ProductCard = ({ product }) => {
  const { user } = useUser();
  const [saved, setSaved] = useState(false);

  // Organize functions: Create addToWishlist(productId, userId) returning success/fail
  const addToWishlist = async (productId, userId) => {
    try {
      const response = await fetch('http://localhost:8000/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      if (response.ok) {
        return true;
      } else {
        console.error('Failed to add to wishlist');
        return false;
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  // Use actual image URL from database, or fallback to placeholder
  const getImageUrl = (product) => {
    if (product.image_url) {
      // Handle local image paths by prefixing with backend URL
      if (product.image_url.startsWith('/static/images/')) {
        return 'http://localhost:8000' + product.image_url;
      }
      // Return external URLs as-is
      return product.image_url;
    }
    // Fallback placeholder based on product name
    if (product.name.toLowerCase().includes('bra')) {
      return 'https://images.unsplash.com/photo-1599050751795-5f9a2b2f1f1a?q=80&w=800&auto=format&fit=crop';
    } else if (product.name.toLowerCase().includes('short')) {
      return 'https://images.unsplash.com/photo-1618354691438-25e8c4a7cb68?q=80&w=800&auto=format&fit=crop';
    } else if (product.name.toLowerCase().includes('scrub')) {
      return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop';
    } else if (product.name.toLowerCase().includes('legging')) {
      return 'https://images.unsplash.com/photo-1506629905607-0b5ab9a9e21a?q=80&w=800&auto=format&fit=crop';
    } else if (product.name.toLowerCase().includes('tank')) {
      return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop';
    } else {
      return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop';
    }
  };

  const imageUrl = getImageUrl(product);

  const handleSaveToWishlist = async () => {
    if (!user) return;
    // Onclick reaction: Trigger wishlist add function
    const success = await addToWishlist(product.id, user.id);
    if (success) {
      setSaved(true);
      // Add attributes dynamically: Add data-saved="true" when user clicks save
      // Note: In React, we use state instead, but for DOM attribute, could use ref
    }
  };

  return (
    <Card className={`group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors ${saved ? 'data-saved="true"' : ''}`} data-saved={saved ? "true" : undefined}>
      <CardHeader>
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-lg">{product.name}</h3>
          <span className="text-primary font-semibold">${product.price}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
        {product.sku && (
          <p className="text-xs text-muted-foreground mb-2">SKU: {product.sku}</p>
        )}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Available options:</p>
            <div className="flex flex-wrap gap-1">
              {product.variants.slice(0, 3).map((variant) => (
                <span
                  key={variant.id}
                  className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded"
                >
                  {variant.size} {variant.color && `(${variant.color})`}
                </span>
              ))}
              {product.variants.length > 3 && (
                <span className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                  +{product.variants.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 w-full">
          <Button className="flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors">
            Add to Cart
          </Button>
          <Button
            onClick={handleSaveToWishlist}
            variant={saved ? "destructive" : "outline"}
            className="rounded-xl px-3 py-2 text-sm transition-colors"
            disabled={!user}
          >
            {saved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;