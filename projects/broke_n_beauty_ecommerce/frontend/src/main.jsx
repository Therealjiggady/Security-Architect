import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { UserProvider } from './contexts/UserContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import { AnalyticsProvider } from './contexts/AnalyticsContext.jsx'
import { analytics } from './utils/analytics.js'
import './index.css'

// Initialize analytics for production
if (import.meta.env.VITE_ENVIRONMENT === 'production') {
  analytics.init();
} else {
  console.log('📊 Analytics initialized in debug mode for localhost');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AnalyticsProvider>
          <UserProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </UserProvider>
        </AnalyticsProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
