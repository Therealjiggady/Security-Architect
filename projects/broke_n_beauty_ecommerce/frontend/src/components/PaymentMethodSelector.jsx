import React, { useState } from 'react';

// Payment method constants
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

const PaymentMethodSelector = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Handle payment method selection
  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    const method = PAYMENT_METHODS.find(m => m.id === methodId);
    console.log('Payment method selected:', {
      id: method.id,
      name: method.name,
      provider: method.provider,
      fees: method.fees
    });
  };

  // Handle proceed action
  const handleProceed = () => {
    if (!selectedMethod) {
      console.log('No payment method selected');
      return;
    }

    const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);
    console.log('Proceeding with payment:', {
      method: method.name,
      provider: method.provider,
      timestamp: new Date().toISOString()
    });

    // Update DOM output
    const outputDiv = document.getElementById('payment-output');
    if (outputDiv) {
      outputDiv.innerHTML = `
        <div style="padding: 16px; background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; margin-top: 16px;">
          <h4 style="margin: 0 0 8px 0; color: #0ea5e9;">Payment Method Selected</h4>
          <p style="margin: 4px 0;"><strong>Method:</strong> ${method.name}</p>
          <p style="margin: 4px 0;"><strong>Provider:</strong> ${method.provider}</p>
          <p style="margin: 4px 0;"><strong>Fees:</strong> ${method.fees}</p>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">
            Selected at: ${new Date().toLocaleString()}
          </p>
        </div>
      `;
    }
  };

  return (
    <div className="payment-method-selector max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Select Payment Method</h3>

      <div className="payment-methods-grid grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {PAYMENT_METHODS.map((method) => (
          <div
            key={method.id}
            className={`payment-method-card p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleMethodSelect(method.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="method-icon text-2xl">{method.icon}</div>
              <div className="method-info flex-1">
                <h4 className="font-semibold text-gray-800">{method.name}</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
                <small className="text-xs text-gray-500">
                  Provider: {method.provider} | Fees: {method.fees}
                </small>
              </div>
              <div className="selection-indicator">
                {selectedMethod === method.id && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleProceed}
        disabled={!selectedMethod}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
          selectedMethod
            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Proceed with {selectedMethod ? PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name : 'Payment'}
      </button>

      <div id="payment-output" className="output-display mt-4"></div>
    </div>
  );
};

export default PaymentMethodSelector;