# Day 27: Interactive Checkout Page with Order Summary

## Overview
Built a comprehensive checkout page with order summary, payment method selection, and interactive DOM features including proper element selection, CSS highlighting, tooltips, and checkout process triggering.

## Features Implemented

### Checkout Page with Order Summary
- **Order Summary Sidebar**: Real-time cart items display with quantities and prices
- **Total Calculations**: Subtotal, tax (8.25%), discount, and final total
- **Item Details**: Product names, sizes, quantities, and individual prices
- **Responsive Layout**: Sidebar on desktop, stacked on mobile

### Interactive DOM Features

#### DOM Selection
```javascript
// ID for form
const checkoutForm = document.getElementById('checkout-form');

// Class for buttons
const paymentButtons = document.querySelectorAll('.payment-method-btn');

// Tag for inputs
const formInputs = document.querySelectorAll('input');
```

#### CSS Highlighting
```css
.payment-method-btn.selected {
  background-color: #10b981; /* emerald-500 */
  border-color: #10b981;
  color: #0f172a; /* zinc-950 */
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.payment-method-btn:hover {
  background-color: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.5);
}
```

#### Tooltips on Hover
```javascript
const showTooltip = (element, text) => {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = text;
  element.appendChild(tooltip);
  tooltip.style.display = 'block';
};

paymentButtons.forEach(btn => {
  btn.addEventListener('mouseover', (e) => {
    const method = e.target.dataset.method;
    const tooltipText = getTooltipText(method);
    showTooltip(e.target, tooltipText);
  });
  
  btn.addEventListener('mouseout', (e) => {
    const tooltip = e.target.querySelector('.tooltip');
    if (tooltip) tooltip.remove();
  });
});
```

#### Checkout Process Trigger
```javascript
const handleCheckout = async () => {
  const formData = new FormData(checkoutForm);
  const checkoutData = {
    cart_id: cartId,
    payment_method: selectedPaymentMethod,
    shipping_address: Object.fromEntries(formData),
    billing_address: useShippingAsBilling ? shippingAddress : billingFormData
  };

  try {
    // Initiate checkout
    const response = await fetch('/checkout/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutData)
    });

    if (response.ok) {
      const { checkout_session } = await response.json();
      
      // Process payment
      const paymentResult = await processPayment(checkout_session.id);
      
      if (paymentResult.success) {
        // Redirect to success page
        window.location.href = `/order-confirmation/${paymentResult.order_id}`;
      } else {
        showError('Payment failed. Please try again.');
      }
    }
  } catch (error) {
    console.error('Checkout error:', error);
    showError('Checkout failed. Please try again.');
  }
};
```

## Technical Implementation

### Component Structure
```jsx
function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [checkoutSession, setCheckoutSession] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load cart data on mount
  useEffect(() => {
    loadCartItems();
  }, []);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-form-section">
          <form id="checkout-form" onSubmit={handleCheckout}>
            {/* Shipping Address */}
            <div className="form-section">
              <h3>Shipping Address</h3>
              <input type="text" name="first_name" required />
              <input type="text" name="last_name" required />
              <input type="text" name="address" required />
              <input type="text" name="city" required />
              <input type="text" name="state" required />
              <input type="text" name="zip_code" required />
            </div>

            {/* Payment Method Selection */}
            <div className="form-section">
              <h3>Payment Method</h3>
              <div className="payment-methods">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.id}
                    type="button"
                    className={`payment-method-btn ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                    data-method={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    onMouseOver={(e) => showTooltip(e, method.description)}
                    onMouseOut={hideTooltip}
                  >
                    <span className="method-icon">{method.icon}</span>
                    <span className="method-name">{method.name}</span>
                    <span className="method-fees">{method.fees}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="checkout-btn"
              disabled={isProcessing || !selectedPaymentMethod}
            >
              {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-items">
            {cart.map(item => (
              <div key={item.id} className="order-item">
                <div className="item-details">
                  <h4>{item.product_name}</h4>
                  <p>Size: {item.size} | Qty: {item.quantity}</p>
                </div>
                <div className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="total-row">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="total-row discount">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## API Integration

### Checkout Initiation
**POST /checkout/initiate**
```json
{
  "cart_id": 1,
  "payment_method": "stripe",
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001"
  }
}
```

### Payment Processing
**POST /checkout/process**
```json
{
  "checkout_session_id": "cs_test_123",
  "payment_token": "tok_visa"
}
```

## Interactive Features

### Payment Method Selection
- **Visual Feedback**: Selected buttons highlight with emerald color
- **Hover Tooltips**: Show detailed information about each payment method
- **Click Handling**: Updates selected state and triggers validation

### Form Validation
- **Real-time Validation**: Input fields validate as user types
- **Visual Indicators**: Invalid fields show red borders
- **Error Messages**: Clear feedback for required fields

### Checkout Process
- **Loading States**: Button shows "Processing..." during payment
- **Error Handling**: Failed payments show user-friendly messages
- **Success Redirect**: Completed orders redirect to confirmation page

## Files Created/Modified

### Frontend
- `frontend/src/CheckoutPage.jsx` - Main checkout page component
- `frontend/src/components/OrderSummary.jsx` - Reusable order summary component
- `frontend/src/components/PaymentMethodSelector.jsx` - Enhanced with tooltips and highlighting
- `frontend/src/contexts/CheckoutContext.jsx` - Checkout state management
- `frontend/src/App.jsx` - Added `/checkout` route

### Backend Integration
- Connected to existing checkout API endpoints
- Integrated with cart system for real-time updates
- Added order creation and payment processing

## Key Features
- ✅ **DOM Selection**: ID for form, class for buttons, tag for inputs
- ✅ **CSS Changes**: Highlight selected payment method buttons
- ✅ **Onmouseover**: Show tooltips for payment options
- ✅ **Onclick**: Trigger complete checkout process
- ✅ **Order Summary**: Real-time cart display with totals
- ✅ **Payment Integration**: Connected to backend payment API
- ✅ **Responsive Design**: Mobile-friendly checkout flow
- ✅ **Error Handling**: Comprehensive validation and user feedback

This implementation provides a complete, production-ready checkout experience with all the interactive features requested.