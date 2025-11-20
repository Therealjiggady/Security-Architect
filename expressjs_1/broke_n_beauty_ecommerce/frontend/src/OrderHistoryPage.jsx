import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { useUser } from './contexts/UserContext';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredOrder, setHoveredOrder] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { user } = useUser();
  const intervalRef = useRef(null);

  // Function to fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8000/orders/me', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
      setError(null);

      // Update progress bars using document.getElementById()
      data.forEach(order => {
        updateProgressBar(order.id, order.status);
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to update progress bar width based on order status
  const updateProgressBar = (orderId, status) => {
    const progressElement = document.getElementById(`progress-${orderId}`);
    if (progressElement) {
      let width = 0;
      if (status === 'pending') {
        width = 33;
      } else if (status === 'shipped') {
        width = 66;
      } else if (status === 'delivered') {
        width = 100;
      }
      progressElement.style.width = `${width}%`;
    }
  };

  // Check if there are any undelivered orders
  const hasUndeliveredOrders = () => {
    return orders.some(order => order.status !== 'delivered');
  };

  // Initial fetch on component mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  // Set up auto-refresh interval (60 seconds)
  useEffect(() => {
    // Only set up interval if there are undelivered orders
    if (orders.length > 0 && hasUndeliveredOrders()) {
      intervalRef.current = setInterval(() => {
        fetchOrders();
      }, 60000); // 60 seconds
    }

    // Cleanup function to clear interval
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [orders]);

  // Clear interval when all orders are delivered
  useEffect(() => {
    if (orders.length > 0 && !hasUndeliveredOrders() && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [orders]);

  // onMouseOver handler to show tracking info popup
  const handleMouseOver = (event, order) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setHoveredOrder(order);
  };

  // onMouseOut handler to hide tooltip
  const handleMouseOut = () => {
    setHoveredOrder(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate estimated delivery date (7 days from created_at)
  const getEstimatedDelivery = (createdAt, status) => {
    if (status === 'delivered') return 'Delivered';
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'shipped':
        return 'text-blue-600';
      case 'delivered':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get progress bar color
  const getProgressColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Order History</h1>
        
        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">You haven't placed any orders yet.</p>
              <div className="text-center mt-4">
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Start Shopping
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Array iteration using .map() to display multiple orders */}
            {orders.map((order) => (
              <Card
                key={order.id}
                className="relative cursor-pointer hover:shadow-lg transition-shadow"
                onMouseOver={(e) => handleMouseOver(e, order)}
                onMouseOut={handleMouseOut}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order #{order.id}</CardTitle>
                      <CardDescription>
                        Placed on {formatDate(order.created_at)}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-lg ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progress bar with element ID for DOM updates */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Pending</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        id={`progress-${order.id}`}
                        className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(order.status)}`}
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Order Items:</h4>
                    {order.items && order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          Variant ID: {item.product_variant_id} (Qty: {item.quantity})
                        </span>
                        <span>${item.price_at_purchase.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Estimated delivery */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Estimated Delivery:</span>{' '}
                      {getEstimatedDelivery(order.created_at, order.status)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Auto-refresh indicator */}
        {orders.length > 0 && hasUndeliveredOrders() && (
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>🔄 Auto-refreshing every 60 seconds for order updates</p>
          </div>
        )}
      </main>

      {/* Tooltip popup for tracking information */}
      {hoveredOrder && (
        <div
          className="fixed z-50 bg-white border-2 border-gray-300 rounded-lg shadow-xl p-4 pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            minWidth: '250px',
          }}
        >
          <h3 className="font-bold text-lg mb-2">Tracking Information</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold">Order ID:</span> #{hoveredOrder.id}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{' '}
              <span className={getStatusColor(hoveredOrder.status)}>
                {hoveredOrder.status.toUpperCase()}
              </span>
            </p>
            <p>
              <span className="font-semibold">Order Date:</span> {formatDate(hoveredOrder.created_at)}
            </p>
            <p>
              <span className="font-semibold">Estimated Delivery:</span>{' '}
              {getEstimatedDelivery(hoveredOrder.created_at, hoveredOrder.status)}
            </p>
            <p>
              <span className="font-semibold">Total Amount:</span> ${hoveredOrder.total_amount.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrderHistoryPage;