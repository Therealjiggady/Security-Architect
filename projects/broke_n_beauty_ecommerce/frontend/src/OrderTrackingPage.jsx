import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { useUser } from './contexts/UserContext';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTrackingInfo();
    fetchOrderDetails();
  }, [user, orderId, navigate]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch('http://localhost:8000/orders/me', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const orders = await response.json();
        const foundOrder = orders.find(o => o.id === parseInt(orderId));
        setOrder(foundOrder);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
    }
  };

  const fetchTrackingInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8000/orders/${orderId}/tracking`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch tracking information');
      }

      const data = await response.json();
      setTrackingInfo(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('delivered')) return '✓';
    if (statusLower.includes('transit') || statusLower.includes('shipped')) return '🚚';
    if (statusLower.includes('label') || statusLower.includes('created')) return '📦';
    return '⏳';
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('delivered')) return 'text-green-500';
    if (statusLower.includes('transit') || statusLower.includes('shipped')) return 'text-blue-500';
    if (statusLower.includes('label') || statusLower.includes('created')) return 'text-yellow-500';
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading tracking information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Card className="border border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => navigate('/orders')} className="mt-4">
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (trackingInfo?.message) {
    return (
      <div className="container mx-auto p-8">
        <Card className="border border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Order #{orderId}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{trackingInfo.message}</p>
            <Button onClick={() => navigate('/orders')} className="mt-4">
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/orders')}>
          ← Back to Orders
        </Button>
      </div>

      <div className="space-y-6">
        {/* Order Summary */}
        <Card className="border border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Order #{orderId}</CardTitle>
            <CardDescription>
              Tracking Number: {trackingInfo.tracking_number}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Carrier</div>
                <div className="font-semibold">{trackingInfo.carrier}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className={`font-semibold ${getStatusColor(trackingInfo.status)}`}>
                  {getStatusIcon(trackingInfo.status)} {trackingInfo.status}
                </div>
              </div>
              {trackingInfo.est_delivery_date && (
                <div>
                  <div className="text-sm text-muted-foreground">Estimated Delivery</div>
                  <div className="font-semibold">
                    {new Date(trackingInfo.est_delivery_date).toLocaleDateString()}
                  </div>
                </div>
              )}
              {order && (
                <div>
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                  <div className="font-semibold">${order.total_amount.toFixed(2)}</div>
                </div>
              )}
            </div>

            {trackingInfo.tracking_url && (
              <div>
                <Button
                  variant="outline"
                  onClick={() => window.open(trackingInfo.tracking_url, '_blank')}
                  className="w-full"
                >
                  View on Carrier Website →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tracking Timeline */}
        {trackingInfo.tracking_details && trackingInfo.tracking_details.length > 0 && (
          <Card className="border border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle>Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackingInfo.tracking_details.map((detail, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}
                      >
                        {getStatusIcon(detail.status)}
                      </div>
                    </div>
                    <div className="flex-1 pb-4 border-l-2 border-muted pl-4 ml-5 -ml-5">
                      <div className="font-semibold">{detail.message || detail.status}</div>
                      {detail.datetime && (
                        <div className="text-sm text-muted-foreground">
                          {new Date(detail.datetime).toLocaleString()}
                        </div>
                      )}
                      {detail.tracking_location && (
                        <div className="text-sm text-muted-foreground">
                          {detail.tracking_location.city}, {detail.tracking_location.state}{' '}
                          {detail.tracking_location.zip}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Last Updated */}
        {trackingInfo.last_updated && (
          <div className="text-sm text-muted-foreground text-center">
            Last updated: {new Date(trackingInfo.last_updated).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
