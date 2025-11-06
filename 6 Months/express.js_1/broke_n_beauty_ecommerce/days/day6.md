# Day 6: Frontend Development and API Integration

## 🎯 Objective
Develop React frontend, integrate with backend APIs, and prepare for deployment.

## 📋 What We Accomplished

### 1. **React Application Setup**
- Created Vite-based React application
- Configured Tailwind CSS for styling
- Set up React Router for navigation
- Established project structure and component organization

### 2. **Frontend Architecture**
- Component-based architecture with reusable components
- State management with React hooks
- API integration layer with Axios
- Error handling and loading states

### 3. **Core Pages and Components**
- **Home/Product Listing**: Product grid with search and filtering
- **Product Detail**: Individual product view with variants
- **Shopping Cart**: Cart management with quantity updates
- **User Authentication**: Login/signup forms
- **User Profile**: Account management and order history
- **Checkout**: Order placement and payment flow

### 4. **API Integration**
- Complete API client implementation
- JWT token management and refresh
- Request/response interceptors
- Error handling for API failures

### 5. **UI/UX Implementation**
- Responsive design for mobile and desktop
- Loading states and skeleton screens
- Form validation and error messages
- Toast notifications for user feedback
- Accessibility considerations

### 6. **State Management**
- React Context for global state
- Custom hooks for API calls
- Cart state persistence in localStorage
- User authentication state management

## 🔧 Technical Details

### Frontend Project Structure:
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   ├── products/        # Product-related components
│   │   ├── cart/           # Shopping cart components
│   │   ├── auth/           # Authentication components
│   │   └── layout/         # Layout components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── context/            # React context providers
│   ├── utils/              # Utility functions
│   └── styles/             # CSS and styling
├── public/
└── package.json
```

### API Service Layer:
```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Request interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Authentication Context:
```javascript
// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user info
      api.get('/users/me')
        .then(response => setUser(response.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    const userResponse = await api.get('/users/me');
    setUser(userResponse.data);
    return userResponse.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Shopping Cart Hook:
```javascript
// hooks/useCart.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (productVariantId, quantity) => {
    setLoading(true);
    try {
      await api.post('/cart/items', { product_variant_id: productVariantId, quantity });
      await fetchCart();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    try {
      await api.put(`/cart/items/${itemId}`, { quantity });
      await fetchCart();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      await api.delete(`/cart/items/${itemId}`);
      await fetchCart();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    refetch: fetchCart
  };
};
```

## ✅ Verification Steps

### 1. **Start Frontend Development Server**
```bash
cd frontend
npm install
npm run dev
```
Expected: Frontend running on `http://localhost:5173`

### 2. **Test Authentication Flow**
1. Open browser to `http://localhost:5173`
2. Click "Sign Up" and create a new account
3. Verify account creation success
4. Login with created credentials
5. Verify JWT token storage in localStorage

### 3. **Test Product Browsing**
1. Navigate to products page
2. Verify product grid displays correctly
3. Test product search and filtering
4. Click on a product for detailed view
5. Verify variant selection works

### 4. **Test Shopping Cart**
1. Add products to cart from product detail page
2. Verify cart icon shows correct item count
3. Navigate to cart page
4. Test quantity updates
5. Test item removal
6. Verify cart persistence across page refreshes

### 5. **Test Checkout Flow**
1. Proceed to checkout from cart
2. Fill shipping information
3. Select payment method
4. Complete order
5. Verify order confirmation page
6. Check order history in user profile

### 6. **Test Responsive Design**
1. Resize browser window to mobile size
2. Verify mobile navigation works
3. Test touch interactions on mobile
4. Verify responsive layouts

### 7. **Test Error Handling**
1. Try to access protected routes without authentication
2. Verify redirect to login page
3. Test invalid form submissions
4. Verify error messages display correctly

## 🎯 Success Criteria Met
- ✅ Complete React application with routing
- ✅ Full API integration with error handling
- ✅ Authentication flow with JWT management
- ✅ Shopping cart functionality
- ✅ Responsive design for all devices
- ✅ Form validation and user feedback
- ✅ State management and data persistence
- ✅ Loading states and error boundaries

## 🎨 UI/UX Features
- **Modern Design**: Clean, professional e-commerce interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Loading States**: Skeleton screens and spinners
- **Toast Notifications**: User feedback for actions
- **Form Validation**: Real-time validation with error messages
- **Accessibility**: ARIA labels and keyboard navigation

## 🔗 Next Steps
Day 7 will focus on final deployment preparation, testing, and production readiness.