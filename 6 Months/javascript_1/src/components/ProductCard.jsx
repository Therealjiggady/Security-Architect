import React from 'react';

const ProductCard = ({ product }) => {
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

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
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
        {product.sku && (
          <p className="text-xs text-zinc-400 mb-2">SKU: {product.sku}</p>
        )}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-zinc-400 mb-2">Available options:</p>
            <div className="flex flex-wrap gap-1">
              {product.variants.slice(0, 3).map((variant) => (
                <span
                  key={variant.id}
                  className="inline-block bg-zinc-700 text-zinc-300 text-xs px-2 py-1 rounded"
                >
                  {variant.size} {variant.color && `(${variant.color})`}
                </span>
              ))}
              {product.variants.length > 3 && (
                <span className="inline-block bg-zinc-700 text-zinc-300 text-xs px-2 py-1 rounded">
                  +{product.variants.length - 3} more
                </span>
              )}
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
  );
};

export default ProductCard;