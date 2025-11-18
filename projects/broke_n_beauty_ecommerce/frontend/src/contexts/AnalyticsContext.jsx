/**
 * AnalyticsContext - Manages analytics tracking throughout the app
 * Provides hooks for tracking e-commerce events, page views, and user actions
 */

import { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Analytics implementation for localhost testing
class LocalAnalytics {
  constructor() {
    this.events = [];
    this.isLocalhost = window.location.hostname === 'localhost';
    this.isDebug = import.meta.env.VITE_DEBUG_ANALYTICS === 'true';
    
    // Setup debug mode for localhost
    if (this.isLocalhost) {
      this.setupDebugMode();
    }
  }

  setupDebugMode() {
    console.log('📊 Analytics Debug Mode Enabled (Localhost)');
    
    // Create debug panel
    this.createDebugPanel();
    
    // Make debug functions global
    window.analyticsDebug = {
      showEvents: () => this.showEventLog(),
      clearEvents: () => this.clearEventLog(),
      getEvents: () => this.events,
      getSummary: () => this.getEventSummary()
    };
  }

  createDebugPanel() {
    // Remove existing panel if any
    const existing = document.getElementById('analytics-debug-panel');
    if (existing) existing.remove();

    const debugPanel = document.createElement('div');
    debugPanel.id = 'analytics-debug-panel';
    debugPanel.innerHTML = `
      <div style="
        position: fixed; 
        top: 20px; 
        right: 20px; 
        background: #1a1a1a; 
        color: #fff; 
        padding: 12px 16px; 
        border-radius: 8px; 
        font-family: monospace; 
        font-size: 12px; 
        z-index: 10000;
        max-width: 280px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        border: 1px solid #333;
      ">
        <div style="font-weight: bold; margin-bottom: 8px; color: #4CAF50;">📊 Analytics Debug</div>
        <div id="analytics-events-count">Events: 0</div>
        <div id="analytics-status">Status: Ready</div>
        <div style="margin-top: 10px;">
          <button onclick="window.analyticsDebug.showEvents()" style="
            background: #4CAF50; 
            color: #fff; 
            border: none; 
            padding: 6px 10px; 
            border-radius: 4px; 
            cursor: pointer;
            font-size: 11px;
            margin-right: 6px;
          ">View Events</button>
          <button onclick="window.analyticsDebug.clearEvents()" style="
            background: #f44336; 
            color: #fff; 
            border: none; 
            padding: 6px 10px; 
            border-radius: 4px; 
            cursor: pointer;
            font-size: 11px;
          ">Clear</button>
        </div>
      </div>
    `;
    document.body.appendChild(debugPanel);
  }

  updateDebugPanel() {
    const countElement = document.getElementById('analytics-events-count');
    const statusElement = document.getElementById('analytics-status');
    
    if (countElement) {
      countElement.textContent = `Events: ${this.events.length}`;
    }
    
    if (statusElement) {
      const latestEvent = this.events[this.events.length - 1];
      if (latestEvent) {
        statusElement.textContent = `Latest: ${latestEvent.type}`;
        statusElement.style.color = '#FFD700';
      }
    }
  }

  logEvent(type, data = {}) {
    const event = {
      type,
      data,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    this.events.push(event);
    
    // Console logging for localhost
    if (this.isLocalhost) {
      console.log(`📊 [Analytics] ${type}:`, data);
      this.updateDebugPanel();
      
      // Visual notification for important events
      if (['purchase', 'add_to_cart', 'begin_checkout'].includes(type)) {
        this.showEventNotification(type, data);
      }
    }
  }

  showEventNotification(type, data) {
    const notification = document.createElement('div');
    const eventEmojis = {
      purchase: '🎉',
      add_to_cart: '🛒',
      begin_checkout: '💳',
      view_item: '👀'
    };
    
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 10px 15px;
        border-radius: 6px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 13px;
        z-index: 10001;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${eventEmojis[type] || '📊'} <strong>${type.replace('_', ' ').toUpperCase()}</strong> tracked!
        ${data.value ? `($${data.value})` : ''}
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Tracking methods
  trackPageView(path, title) {
    this.logEvent('page_view', {
      page_path: path,
      page_title: title,
      page_location: window.location.href
    });
  }

  trackProductView(product) {
    this.logEvent('view_item', {
      currency: 'USD',
      value: parseFloat(product.price),
      items: [{
        item_id: product.sku || product.id,
        item_name: product.name,
        category: 'Activewear',
        price: parseFloat(product.price)
      }]
    });
  }

  trackAddToCart(product, quantity = 1) {
    this.logEvent('add_to_cart', {
      currency: 'USD',
      value: parseFloat(product.price) * quantity,
      items: [{
        item_id: product.sku || product.id,
        item_name: product.name,
        category: 'Activewear',
        quantity: quantity,
        price: parseFloat(product.price)
      }]
    });
  }

  trackBeginCheckout(items, value) {
    this.logEvent('begin_checkout', {
      currency: 'USD',
      value: parseFloat(value),
      items: items.map(item => ({
        item_id: item.sku || item.id,
        item_name: item.name,
        category: 'Activewear',
        quantity: item.quantity,
        price: parseFloat(item.price)
      }))
    });
  }

  trackPurchase(orderId, value, items) {
    this.logEvent('purchase', {
      transaction_id: orderId,
      currency: 'USD',
      value: parseFloat(value),
      items: items.map(item => ({
        item_id: item.sku || item.id,
        item_name: item.name,
        category: 'Activewear', 
        quantity: item.quantity,
        price: parseFloat(item.price)
      }))
    });
  }

  trackUserRegistration() {
    this.logEvent('sign_up', {
      method: 'email'
    });
  }

  trackLogin() {
    this.logEvent('login', {
      method: 'email'
    });
  }

  trackSearch(searchTerm, results = 0) {
    this.logEvent('search', {
      search_term: searchTerm,
      search_results: results
    });
  }

  showEventLog() {
    console.group('📊 Analytics Event Log');
    this.events.forEach((event, index) => {
      console.log(`${index + 1}. [${event.timestamp}] ${event.type}:`, event.data);
    });
    console.groupEnd();
  }

  clearEventLog() {
    this.events = [];
    console.log('🗑️ Analytics event log cleared');
    this.updateDebugPanel();
  }

  getEventSummary() {
    const eventTypes = {};
    this.events.forEach(event => {
      eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
    });
    
    return {
      totalEvents: this.events.length,
      eventTypes,
      lastEvent: this.events[this.events.length - 1],
      sessionStart: this.events[0]?.timestamp,
      events: this.events
    };
  }
}

// Global analytics instance
const localAnalytics = new LocalAnalytics();

// Analytics Context
const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const location = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      localAnalytics.trackPageView(location.pathname, document.title);
      initialized.current = true;
      
      if (window.location.hostname === 'localhost') {
        console.log('📊 Analytics tracking initialized for localhost testing');
      }
    }
  }, []);

  useEffect(() => {
    // Track page views on route change
    localAnalytics.trackPageView(location.pathname, document.title);
  }, [location]);

  const value = {
    trackProductView: (product) => localAnalytics.trackProductView(product),
    trackAddToCart: (product, quantity) => localAnalytics.trackAddToCart(product, quantity),
    trackBeginCheckout: (items, total) => localAnalytics.trackBeginCheckout(items, total),
    trackPurchase: (orderId, value, items) => localAnalytics.trackPurchase(orderId, value, items),
    trackUserRegistration: () => localAnalytics.trackUserRegistration(),
    trackLogin: () => localAnalytics.trackLogin(),
    trackSearch: (term, results) => localAnalytics.trackSearch(term, results),
    
    // Debug functions
    getDebugInfo: () => localAnalytics.getEventSummary(),
    clearEvents: () => localAnalytics.clearEventLog()
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};

export default AnalyticsContext;