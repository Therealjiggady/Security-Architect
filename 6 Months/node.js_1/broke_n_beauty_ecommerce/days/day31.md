# Day 31: Order History Page with Real-Time Status Updates

## Overview
Implemented a comprehensive order history page that displays user orders with live status tracking, progress bars, and auto-refresh functionality. The page demonstrates advanced JavaScript concepts including DOM manipulation via element IDs, onMouseOver event handlers, array iteration with `.map()`, and interval-based polling with automatic cleanup.

## Implementation Details

### 1. Order History Page Component
Created [`frontend/src/OrderHistoryPage.jsx`](../frontend/src/OrderHistoryPage.jsx:1) with the following features:

**Key Components:**
- State management for orders, loading states, and errors
- Real-time order fetching from backend API
- Progress bars with DOM-based updates
- Interactive tooltips on hover
- Auto-refresh mechanism with interval management
- Responsive design using Tailwind CSS and shadcn/ui components

### 2. DOM Updates via Element ID

#### Progress Bar Updates
The page uses `document.getElementById()` to update progress bar widths dynamically based on order status:

```javascript
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
```

**Progress Bar Mapping:**
- `pending` → 33% width (yellow)
- `shipped` → 66% width (blue)
- `delivered` → 100% width (green)

#### HTML Structure
Each order card includes a progress bar with a unique ID:

```jsx
<div
  id={`progress-${order.id}`}
  className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(order.status)}`}
  style={{ width: '0%' }}
></div>
```

The unique ID format `progress-${order.id}` allows for targeted DOM manipulation of individual order progress bars.

### 3. OnMouseOver Handler

#### Interactive Tooltips
The page implements `onMouseOver` and `onMouseOut` handlers to show detailed tracking information:

```javascript
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
```

**Tooltip Display:**
When users hover over an order card, a popup displays:
- Order ID
- Current Status (color-coded)
- Order Date
- Estimated Delivery Date
- Total Amount

The tooltip is positioned dynamically above the order card using calculated coordinates.

### 4. Auto-Refresh Interval

#### 60-Second Polling Mechanism
The page uses `setInterval()` to automatically refresh order status every 60 seconds:

```javascript
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
```

**Key Features:**
- Only refreshes when there are undelivered orders
- Automatically clears interval when all orders are delivered
- Proper cleanup on component unmount
- Uses `useRef` to maintain interval reference across renders

#### Conditional Interval Clearing
```javascript
// Clear interval when all orders are delivered
useEffect(() => {
  if (orders.length > 0 && !hasUndeliveredOrders() && intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
}, [orders]);
```

The interval stops polling when:
- All orders have status "delivered"
- Component unmounts
- User navigates away from the page

### 5. Array Iteration

#### Using `.map()` to Display Multiple Orders
The page uses the `.map()` method to iterate over the orders array and render each order:

```javascript
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
    {/* Progress bar and order items */}
  </Card>
))}
```

**Nested Array Iteration:**
Each order's items are also iterated using `.map()`:

```javascript
{order.items && order.items.map((item) => (
  <div key={item.id} className="flex justify-between text-sm">
    <span>
      Variant ID: {item.product_variant_id} (Qty: {item.quantity})
    </span>
    <span>${item.price_at_purchase.toFixed(2)}</span>
  </div>
))}
```

## Additional Features

### 1. Authentication Check
The page verifies user authentication on mount:

```javascript
useEffect(() => {
  if (!user) {
    navigate('/login');
    return;
  }
  fetchOrders();
}, [user, navigate]);
```

### 2. Loading States
Displays a loading spinner while fetching orders:

```jsx
{loading && (
  <div className="text-center">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    <p className="mt-4 text-gray-600">Loading your orders...</p>
  </div>
)}
```

### 3. Empty State Handling
Shows a helpful message when no orders exist:

```jsx
{orders.length === 0 && (
  <Card>
    <CardContent className="pt-6">
      <p className="text-center text-gray-600">You haven't placed any orders yet.</p>
      <div className="text-center mt-4">
        <button onClick={() => navigate('/products')}>
          Start Shopping
        </button>
      </div>
    </CardContent>
  </Card>
)}
```

### 4. Error Handling
Displays error messages with retry functionality:

```jsx
{error && (
  <div className="text-center">
    <p className="text-red-600 text-lg">{error}</p>
    <button onClick={fetchOrders}>Try Again</button>
  </div>
)}
```

### 5. Visual Status Indicators
Color-coded status display for quick recognition:

```javascript
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
```

## Routing Integration

### Updated [`frontend/src/App.jsx`](../frontend/src/App.jsx:1)
Added route for the order history page:

```javascript
import OrderHistoryPage from './OrderHistoryPage'

function Orders() {
  return <OrderHistoryPage />
}

// In Routes:
<Route path="/orders" element={<Orders />} />
```

### Updated [`frontend/src/components/Navbar.jsx`](../frontend/src/components/Navbar.jsx:1)
Added "Orders" link to navigation (only visible when logged in):

```jsx
{user && (
  <li>
    <Link to="/orders" className="text-primary-foreground hover:text-primary-foreground/80">
      Orders
    </Link>
  </li>
)}
```

## API Integration

### Backend Endpoint Used
The page uses the existing orders API from Day 30:

**Endpoint:** `GET /orders/me`

**Headers:**
```
Content-Type: application/json
Cookie: access_token=<jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "cart_id": 5,
    "status": "shipped",
    "total_amount": 129.99,
    "created_at": "2025-10-22T10:30:00",
    "items": [
      {
        "id": 1,
        "order_id": 1,
        "product_variant_id": 10,
        "quantity": 2,
        "price_at_purchase": 64.99
      }
    ]
  }
]
```

## User Experience Flow

1. **User navigates to /orders**
   - Page checks authentication
   - Redirects to /login if not authenticated

2. **Initial load**
   - Fetches all user orders from backend
   - Displays loading spinner during fetch
   - Updates progress bars for each order via DOM manipulation

3. **Viewing orders**
   - Orders displayed in cards sorted by date (newest first)
   - Each card shows order details, status, and progress bar
   - Hover over any card to see detailed tracking information

4. **Auto-refresh (if undelivered orders exist)**
   - Page automatically refreshes every 60 seconds
   - Progress bars update smoothly with transitions
   - Visual indicator shows auto-refresh is active

5. **All orders delivered**
   - Auto-refresh stops automatically
   - Indicator disappears
   - User can manually refresh if needed

## Key Learning Points

### 1. DOM Manipulation via getElementById
- Direct DOM access from React for targeted updates
- Unique element IDs enable precise control
- Useful for animations and transitions that need direct style manipulation

### 2. Event Handlers (onMouseOver/onMouseOut)
- Interactive user feedback through hover events
- Dynamic positioning of tooltips/popups
- Calculating element positions with `getBoundingClientRect()`

### 3. Interval Management
- Using `setInterval()` for periodic actions
- Proper cleanup with `clearInterval()`
- Conditional interval execution based on state
- Using `useRef` to persist interval references

### 4. Array Iteration with .map()
- Rendering lists of components
- Nested iteration for related data
- Using unique keys for React reconciliation

### 5. React Hooks Integration
- `useState` for component state
- `useEffect` for side effects and lifecycle
- `useRef` for persistent mutable values
- Effect cleanup functions for resource management

## Testing the Feature

### 1. View Order History
1. Log in to your account
2. Navigate to "Orders" in the navbar
3. View your order history with status indicators

### 2. Test Progress Bars
1. Place a new order (status: pending)
2. Observe 33% progress bar (yellow)
3. Update order to shipped via backend
4. Wait for auto-refresh or manually refresh
5. Observe 66% progress bar (blue)

### 3. Test Hover Tooltips
1. Hover over any order card
2. Tooltip appears above the card with tracking details
3. Move mouse away
4. Tooltip disappears

### 4. Test Auto-Refresh
1. Have at least one undelivered order
2. Note the auto-refresh indicator at bottom
3. Wait 60 seconds
4. Observe automatic order status update
5. Mark all orders as delivered
6. Auto-refresh stops and indicator disappears

### 5. Test Empty State
1. Log in with account that has no orders
2. See empty state message with "Start Shopping" button
3. Click button to navigate to products page

## Files Modified

1. [`frontend/src/OrderHistoryPage.jsx`](../frontend/src/OrderHistoryPage.jsx:1) - Created new order history page component
2. [`frontend/src/App.jsx`](../frontend/src/App.jsx:1) - Added /orders route
3. [`frontend/src/components/Navbar.jsx`](../frontend/src/components/Navbar.jsx:1) - Added Orders navigation link
4. [`days/day31.md`](../days/day31.md:1) - Created this documentation

## Conclusion

The order history page provides a modern, interactive experience with:
- ✅ Real-time status updates via auto-refresh
- ✅ Visual progress indicators using DOM manipulation
- ✅ Interactive tooltips on hover
- ✅ Efficient array iteration for displaying orders
- ✅ Smart interval management with automatic cleanup
- ✅ Responsive design with Tailwind CSS
- ✅ Proper authentication and error handling
- ✅ Empty state and loading state handling
- ✅ Seamless integration with existing order API from Day 30

This implementation showcases advanced JavaScript concepts while maintaining clean, maintainable React code with proper separation of concerns and user experience best practices.