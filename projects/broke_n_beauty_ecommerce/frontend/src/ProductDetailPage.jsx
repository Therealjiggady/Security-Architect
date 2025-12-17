import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import { useCart } from './contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import ReviewSection from './components/ReviewSection';
import InventoryAlertButton from './components/InventoryAlertButton';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:8000/products/`);
      if (!response.ok) throw new Error('Failed to load product');

      const products = await response.json();
      const foundProduct = products.find(p => p.id === parseInt(productId));

      if (!foundProduct) {
        setError('Product not found');
        setLoading(false);
        return;
      }

      setProduct(foundProduct);
      setSelectedImage(getImageUrl(foundProduct));

      // Select first available variant by default
      if (foundProduct.variants && foundProduct.variants.length > 0) {
        setSelectedVariant(foundProduct.variants[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (product) => {
    if (product.image_url) {
      if (product.image_url.startsWith('/static/images/')) {
        return 'http://localhost:8000' + product.image_url;
      }
      return product.image_url;
    }
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop';
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select a size');
      return;
    }

    addToCart({
      ...product,
      selectedVariant: selectedVariant
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const getMaterialInfo = (product) => {
    // Extract material info from description or provide default
    if (product.name.toLowerCase().includes('bra')) {
      return 'Premium blend: 80% Polyester, 20% Spandex. Moisture-wicking fabric with 4-way stretch for maximum comfort and support.';
    } else if (product.name.toLowerCase().includes('short')) {
      return 'High-performance fabric: 85% Nylon, 15% Spandex. Quick-dry technology with built-in compression.';
    } else if (product.name.toLowerCase().includes('scrub')) {
      return 'Professional grade: 65% Polyester, 35% Cotton. Breathable, wrinkle-resistant fabric designed for all-day comfort.';
    } else if (product.name.toLowerCase().includes('legging')) {
      return 'Buttery soft: 87% Polyester, 13% Elastane. Non-see-through, squat-proof with compression support.';
    } else if (product.name.toLowerCase().includes('tank')) {
      return 'Lightweight blend: 90% Polyester, 10% Spandex. Breathable mesh panels for enhanced ventilation.';
    }
    return 'Premium quality materials designed for performance and comfort. Machine washable, tumble dry low.';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Product not found'}</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate('/products')}
          className="mb-6"
        >
          ← Back to Products
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Thumbnail Images - if we had multiple images */}
            <div className="grid grid-cols-4 gap-2">
              <div
                className="aspect-square cursor-pointer overflow-hidden rounded-lg border-2 border-primary"
                onClick={() => setSelectedImage(getImageUrl(product))}
              >
                <img
                  src={getImageUrl(product)}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Title & Price */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.sku && (
                  <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
                )}
              </div>
            </div>

            {/* Product Description */}
            <Card className="border border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{product.description}</p>
              </CardContent>
            </Card>

            {/* Material Information */}
            <Card className="border border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Material & Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{getMaterialInfo(product)}</p>
                <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                  <p>• Machine wash cold with like colors</p>
                  <p>• Tumble dry low or hang dry</p>
                  <p>• Do not bleach or iron</p>
                  <p>• Do not dry clean</p>
                </div>
              </CardContent>
            </Card>

            {/* Size Selection */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Select Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-white/10 bg-white/5 hover:border-primary/50'
                      } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={variant.stock === 0}
                    >
                      {variant.size}
                      {variant.color && ` - ${variant.color}`}
                      {variant.stock === 0 && ' (Out of Stock)'}
                    </button>
                  ))}
                </div>
                {selectedVariant && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedVariant.stock > 0
                      ? `${selectedVariant.stock} in stock`
                      : 'Out of stock'}
                  </p>
                )}
              </div>
            )}

            {/* Add to Cart / Inventory Alert */}
            <div className="space-y-3">
              {selectedVariant && selectedVariant.stock > 0 ? (
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full text-lg py-6"
                >
                  {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                </Button>
              ) : (
                selectedVariant && (
                  <InventoryAlertButton
                    productVariantId={selectedVariant.id}
                    stock={selectedVariant.stock}
                  />
                )
              )}

              <Button
                variant="outline"
                onClick={() => {
                  if (user) {
                    // Add to wishlist logic
                    alert('Added to wishlist!');
                  } else {
                    navigate('/login');
                  }
                }}
                size="lg"
                className="w-full"
              >
                Add to Wishlist
              </Button>
            </div>

            {/* Features */}
            <Card className="border border-white/10 bg-white/5">
              <CardContent className="pt-6">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Free shipping on orders over $50</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>30-day returns & exchanges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Secure checkout</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Premium quality guarantee</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <ReviewSection productId={parseInt(productId)} />
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
