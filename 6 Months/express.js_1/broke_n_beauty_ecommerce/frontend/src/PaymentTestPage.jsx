import React from 'react';
import PaymentMethodSelector from './components/PaymentMethodSelector';

const PaymentTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Method Selector Test</h1>
          <p className="text-gray-600">Test the payment method selection component with console and DOM output</p>
        </div>

        <PaymentMethodSelector />

        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Testing Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Select different payment methods by clicking on the cards</li>
            <li>Check the browser console for selection logs</li>
            <li>Click the "Proceed" button to see DOM output below the component</li>
            <li>Verify that the selected method details are displayed correctly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentTestPage;