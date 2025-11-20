import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

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
  const [selectedMethod, setSelectedMethod] = useState('');

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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
        <CardDescription>Choose your preferred payment method to complete your purchase.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={handleMethodSelect} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {PAYMENT_METHODS.map((method) => (
            <div key={method.id}>
              <label
                htmlFor={method.id}
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-border/80'
                }`}
              >
                <RadioGroupItem value={method.id} id={method.id} />
                <div className="flex items-center space-x-3 flex-1">
                  <div className="method-icon text-2xl">{method.icon}</div>
                  <div className="method-info flex-1">
                    <h4 className="font-semibold">{method.name}</h4>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    <small className="text-xs text-muted-foreground">
                      Provider: {method.provider} | Fees: {method.fees}
                    </small>
                  </div>
                  <div className="selection-indicator">
                    {selectedMethod === method.id && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </label>
            </div>
          ))}
        </RadioGroup>

        <Button
          onClick={handleProceed}
          disabled={!selectedMethod}
          className="w-full"
        >
          Proceed with {selectedMethod ? PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name : 'Payment'}
        </Button>

        <div id="payment-output" className="output-display mt-4"></div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;