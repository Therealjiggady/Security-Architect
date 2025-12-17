import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';

const InventoryAlertButton = ({ productVariantId, stock }) => {
  const { user } = useUser();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    if (user && stock === 0) {
      checkExistingSubscription();
    } else {
      setCheckingSubscription(false);
    }
  }, [user, productVariantId, stock]);

  const checkExistingSubscription = async () => {
    try {
      const response = await fetch('http://localhost:8000/inventory-alerts/me', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const alerts = await response.json();
        const exists = alerts.some(alert => alert.product_variant_id === productVariantId);
        setSubscribed(exists);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      alert('Please log in to receive stock notifications');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/inventory-alerts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ product_variant_id: productVariantId })
      });

      if (response.ok) {
        setSubscribed(true);
        alert('You will be notified when this item is back in stock!');
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to subscribe to restock notification');
      }
    } catch (error) {
      console.error('Error subscribing to restock alert:', error);
      alert('Failed to subscribe to restock notification');
    } finally {
      setLoading(false);
    }
  };

  // Don't show button if item is in stock
  if (stock > 0) {
    return null;
  }

  // Show loading state while checking subscription
  if (checkingSubscription) {
    return (
      <Button variant="outline" disabled className="w-full">
        Checking...
      </Button>
    );
  }

  // Show subscribed state
  if (subscribed) {
    return (
      <Button variant="outline" disabled className="w-full">
        ✓ You'll be notified when back in stock
      </Button>
    );
  }

  // Show subscribe button
  return (
    <Button
      variant="outline"
      onClick={handleSubscribe}
      disabled={loading}
      className="w-full"
    >
      {loading ? 'Subscribing...' : 'Notify Me When Back in Stock'}
    </Button>
  );
};

export default InventoryAlertButton;
