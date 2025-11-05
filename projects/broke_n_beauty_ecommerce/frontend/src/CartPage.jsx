import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import { useCart } from './contexts/CartContext';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

function StripeCheckout({ clientSecret, orderId, onPaid, email }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleConfirm = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: { email }
          }
        },
        redirect: 'if_required',
      });
      if (error) {
        setErrorMsg(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaid(orderId);
      } else {
        setErrorMsg('Payment not completed. Please try again.');
      }
    } catch (e) {
      console.error('Payment error', e);
      setErrorMsg('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      {errorMsg && <p className="text-destructive text-sm">{errorMsg}</p>}
      <button
        disabled={loading || !stripe}
        onClick={handleConfirm}
        className="w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 font-medium transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Processing…' : 'Pay now'}
      </button>
    </div>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { cart: cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState(null);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const stripePromise = useMemo(() => {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    return key ? loadStripe(key) : null;
  }, []);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!user) {
      alert('Please log in to checkout');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      // Create order (pending)
      const token = localStorage.getItem('token');
      const orderData = {
        items: cartItems.map(item => ({
          product_variant_id: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price
        })),
        total_amount: total,
        shipping_address: "123 Main St", // Placeholder
        payment_method: "card" // Placeholder
      };

      const response = await fetch('http://localhost:8000/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Checkout failed: ${error.detail || 'Please try again'}`);
        return;
      }

      const createdOrder = await response.json();
      const orderId = createdOrder.id;
      setCreatedOrderId(orderId);

      // Create PaymentIntent for total amount (in cents) and this order
      const intentRes = await fetch('http://localhost:8000/payments/intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Math.round(total * 100), currency: 'usd', order_id: orderId })
      });
      if (!intentRes.ok) {
        const err = await intentRes.json();
        alert(`Failed to initiate payment: ${err.detail || 'Please try again'}`);
        return;
      }
      const { client_secret } = await intentRes.json();
      setClientSecret(client_secret);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  const handlePaid = async () => {
    // On payment success: clear cart and navigate to orders
    alert('Payment successful! 🎉');
    clearCart();
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur border-b border-border bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/20 ring-1 ring-primary/40 grid place-items-center">
              <span className="text-primary font-bold">BnB</span>
            </div>
            <span className="font-semibold tracking-wide">Broken Beauty</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a className="hover:text-foreground" href="/">Home</a>
            <a className="hover:text-foreground" href="/products">Products</a>
            <a className="hover:text-primary" href="/cart">Cart ({cartItems.length})</a>
            <a className="hover:text-foreground" href="/profile">Profile</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {!cartItems || cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-zinc-400 mb-6">Add some products to get started!</p>
            <a
              href="/products"
              className="inline-block rounded-2xl px-6 py-3 font-medium transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-card/50 rounded-lg border border-border">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description || 'Product details'}
                    </p>
                    <p className="text-primary font-semibold">${item.price}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded bg-muted hover:bg-muted/80 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded bg-muted hover:bg-muted/80 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive/80 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-card/50 rounded-lg border border-border p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              {!clientSecret ? (
                <>
                  <button
                    onClick={handleCheckout}
                    className="w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 font-medium transition-colors hover:bg-primary/90"
                  >
                    Proceed to Checkout
                  </button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {shipping === 0 ? 'Free shipping on orders over $50!' : 'Add $50+ for free shipping'}
                  </p>
                </>
              ) : (
                stripePromise ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripeCheckout clientSecret={clientSecret} orderId={createdOrderId} onPaid={handlePaid} email={user?.email} />
                  </Elements>
                ) : (
                  <p className="text-destructive">Stripe publishable key missing. Set VITE_STRIPE_PUBLISHABLE_KEY.</p>
                )
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}