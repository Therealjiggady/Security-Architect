# Payment Method Selector Component Design

## Overview
A React component for selecting payment methods in the Broke & Beauty e-commerce checkout process. Based on the Stripe vs PayPal comparison, Stripe is the recommended payment processor.

## Component Structure

### Constants
```javascript
const PAYMENT_METHODS = [
  {
    id: 'stripe',
    name: 'Credit/Debit Card',
    description: 'Pay securely with your card',
    icon: '💳',
    provider: 'Stripe',
    fees: '2.9% + $0.30'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: '🅿️',
    provider: 'PayPal',
    fees: '2.9% + $0.30'
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    description: 'Quick and secure payment',
    icon: '📱',
    provider: 'Stripe',
    fees: '2.9% + $0.30'
  },
  {
    id: 'google_pay',
    name: 'Google Pay',
    description: 'Fast checkout with Google',
    icon: '🎯',
    provider: 'Stripe',
    fees: '2.9% + $0.30'
  }
];
```

### State Management
- `selectedMethod`: Currently selected payment method ID
- `methods`: Array of available payment methods (from constants)

### Event Handlers
- `handleMethodSelect`: Updates selected method and logs to console
- `handleProceed`: Processes selection and outputs to DOM

### UI Structure
```jsx
<div className="payment-method-selector">
  <h3>Select Payment Method</h3>
  <div className="payment-methods-grid">
    {PAYMENT_METHODS.map(method => (
      <div
        key={method.id}
        className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
        onClick={() => handleMethodSelect(method.id)}
      >
        <div className="method-icon">{method.icon}</div>
        <div className="method-info">
          <h4>{method.name}</h4>
          <p>{method.description}</p>
          <small>Provider: {method.provider} | Fees: {method.fees}</small>
        </div>
        <div className="selection-indicator">
          {selectedMethod === method.id && '✓'}
        </div>
      </div>
    ))}
  </div>
  <button
    onClick={handleProceed}
    disabled={!selectedMethod}
    className="proceed-button"
  >
    Proceed with {selectedMethod ? PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name : 'Payment'}
  </button>
  <div id="payment-output" className="output-display"></div>
</div>
```

## Functionality Requirements

### Array Iteration
- Use `map()` to render payment method cards
- Iterate through `PAYMENT_METHODS` constant array
- Display method details dynamically

### onClick Handlers
- `handleMethodSelect(id)`: Updates state and logs selection
- `handleProceed()`: Validates selection and outputs to DOM

### Console Output
- Log selected method details on selection
- Log proceed action with method info

### DOM Output
- Display selected method in dedicated output div
- Show method name, provider, and fees
- Update in real-time as selections change

## Implementation Notes

### Styling Approach
- Use Tailwind CSS classes for responsive design
- Highlight selected method with visual indicators
- Ensure accessibility with proper ARIA labels

### Data Flow
1. User clicks payment method card
2. `handleMethodSelect` updates state and logs to console
3. UI re-renders to show selection
4. User clicks "Proceed" button
5. `handleProceed` validates and outputs to DOM

### Integration Points
- Connect to existing cart/order context
- Prepare for Stripe Elements integration
- Support for future payment method additions

## Testing Scenarios
1. Select different payment methods and verify console logs
2. Click proceed without selection (should be disabled)
3. Verify DOM output updates correctly
4. Test responsive layout on different screen sizes