/**
 * Analytics utility for Google Analytics 4 and Matomo
 * Handles tracking events, pageviews, and e-commerce data
 */

import { seoConfig } from '../config/seo';

class Analytics {
  constructor() {
    this.gaId = seoConfig.analytics.googleAnalytics;
    this.matomoUrl = seoConfig.analytics.matomoUrl;
    this.matomoSiteId = seoConfig.analytics.matomoSiteId;
    this.fbPixelId = seoConfig.analytics.facebookPixel;
    this.isProduction = import.meta.env.VITE_ENVIRONMENT === 'production';
    this.isDebug = import.meta.env.VITE_DEBUG === 'true';
    
    // Initialize dataLayer for Google Analytics
    window.dataLayer = window.dataLayer || [];
  }

  /**
   * Log analytics messages in development
   */
  log(message, data = {}) {
    if (this.isDebug) {
      console.log(`[Analytics] ${message}`, data);
    }
  }

  /**
   * Initialize Google Analytics 4
   */
  initGA() {
    if (!this.gaId) {
      this.log('Google Analytics ID not configured');
      return;
    }

    if (!this.isProduction) {
      this.log('Google Analytics disabled in development');
      return;
    }

    try {
      // Define gtag function
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;

      // Initialize GA
      gtag('js', new Date());
      gtag('config', this.gaId, {
        page_title: document.title,
        page_location: window.location.href,
        // Enhanced ecommerce settings
        send_page_view: true,
        anonymize_ip: true,
        allow_google_signals: false, // GDPR compliance
        allow_ad_personalization: false
      });

      // Load GA script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
      document.head.appendChild(script);

      this.log('Google Analytics initialized', { gaId: this.gaId });
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  /**
   * Initialize Matomo Analytics
   */
  initMatomo() {
    if (!this.matomoUrl || !this.matomoSiteId) {
      this.log('Matomo configuration missing');
      return;
    }

    if (!this.isProduction) {
      this.log('Matomo disabled in development');
      return;
    }

    try {
      window._paq = window._paq || [];
      
      // Configure Matomo
      window._paq.push(['trackPageView']);
      window._paq.push(['enableLinkTracking']);
      window._paq.push(['setTrackerUrl', `${this.matomoUrl}/matomo.php`]);
      window._paq.push(['setSiteId', this.matomoSiteId]);

      // Load Matomo script
      const script = document.createElement('script');
      script.async = true;
      script.src = `${this.matomoUrl}/matomo.js`;
      document.head.appendChild(script);

      this.log('Matomo Analytics initialized', { 
        url: this.matomoUrl, 
        siteId: this.matomoSiteId 
      });
    } catch (error) {
      console.error('Failed to initialize Matomo:', error);
    }
  }

  /**
   * Initialize Facebook Pixel
   */
  initFacebookPixel() {
    if (!this.fbPixelId || !this.isProduction) {
      this.log('Facebook Pixel disabled or not configured');
      return;
    }

    try {
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      window.fbq('init', this.fbPixelId);
      window.fbq('track', 'PageView');

      this.log('Facebook Pixel initialized', { pixelId: this.fbPixelId });
    } catch (error) {
      console.error('Failed to initialize Facebook Pixel:', error);
    }
  }

  /**
   * Track page views
   */
  trackPageView(path, title) {
    if (!this.isProduction) {
      this.log('Page view tracked (dev mode)', { path, title });
      return;
    }

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', this.gaId, {
        page_path: path,
        page_title: title,
        page_location: `${window.location.origin}${path}`
      });
      this.log('GA page view tracked', { path, title });
    }

    // Matomo
    if (window._paq) {
      window._paq.push(['setCustomUrl', path]);
      window._paq.push(['setDocumentTitle', title]);
      window._paq.push(['trackPageView']);
      this.log('Matomo page view tracked', { path, title });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }

  /**
   * Track custom events
   */
  trackEvent(eventName, parameters = {}) {
    if (!this.isProduction) {
      this.log('Event tracked (dev mode)', { eventName, parameters });
      return;
    }

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
      this.log('GA event tracked', { eventName, parameters });
    }

    // Matomo
    if (window._paq) {
      const { category = 'General', action = eventName, name, value } = parameters;
      window._paq.push(['trackEvent', category, action, name, value]);
      this.log('Matomo event tracked', { category, action, name, value });
    }
  }

  /**
   * Track e-commerce purchase
   */
  trackPurchase(orderId, value, items) {
    if (!this.isProduction) {
      this.log('Purchase tracked (dev mode)', { orderId, value, items });
      return;
    }

    // Google Analytics 4 Enhanced Ecommerce
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        value: parseFloat(value),
        currency: 'USD',
        items: items.map(item => ({
          item_id: item.sku || item.id,
          item_name: item.name,
          category: item.category || 'Activewear',
          quantity: item.quantity,
          price: parseFloat(item.price)
        }))
      });
      this.log('GA purchase tracked', { orderId, value, items });
    }

    // Matomo Ecommerce
    if (window._paq) {
      items.forEach(item => {
        window._paq.push(['addEcommerceItem',
          item.sku || item.id,
          item.name,
          item.category || 'Activewear',
          parseFloat(item.price),
          item.quantity
        ]);
      });
      window._paq.push(['trackEcommerceOrder', orderId, parseFloat(value)]);
      this.log('Matomo purchase tracked', { orderId, value, items });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: parseFloat(value),
        currency: 'USD'
      });
    }
  }

  /**
   * Track add to cart events
   */
  trackAddToCart(item) {
    if (!this.isProduction) {
      this.log('Add to cart tracked (dev mode)', item);
      return;
    }

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: parseFloat(item.price),
        items: [{
          item_id: item.sku || item.id,
          item_name: item.name,
          category: item.category || 'Activewear',
          price: parseFloat(item.price),
          quantity: 1
        }]
      });
    }

    // Matomo
    if (window._paq) {
      window._paq.push(['trackEvent', 'Ecommerce', 'Add to Cart', item.name, parseFloat(item.price)]);
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        value: parseFloat(item.price),
        currency: 'USD',
        content_name: item.name,
        content_category: item.category || 'Activewear',
        content_ids: [item.sku || item.id],
        content_type: 'product'
      });
    }

    this.log('Add to cart tracked', item);
  }

  /**
   * Track product view
   */
  trackProductView(product) {
    if (!this.isProduction) {
      this.log('Product view tracked (dev mode)', product);
      return;
    }

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'USD',
        value: parseFloat(product.price),
        items: [{
          item_id: product.sku || product.id,
          item_name: product.name,
          category: product.category || 'Activewear',
          price: parseFloat(product.price)
        }]
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        value: parseFloat(product.price),
        currency: 'USD',
        content_name: product.name,
        content_category: product.category || 'Activewear',
        content_ids: [product.sku || product.id], 
        content_type: 'product'
      });
    }

    this.log('Product view tracked', product);
  }

  /**
   * Track search events
   */
  trackSearch(searchTerm, results = 0) {
    this.trackEvent('search', {
      search_term: searchTerm,
      search_results: results
    });
  }

  /**
   * Track form submissions
   */
  trackFormSubmit(formName, formData = {}) {
    this.trackEvent('form_submit', {
      form_name: formName,
      ...formData
    });
  }

  /**
   * Track newsletter signups
   */
  trackNewsletterSignup(email) {
    this.trackEvent('sign_up', {
      method: 'newsletter'
    });

    // Facebook Pixel
    if (window.fbq && this.isProduction) {
      window.fbq('track', 'CompleteRegistration', {
        content_name: 'Newsletter Signup'
      });
    }
  }

  /**
   * Initialize all analytics services
   */
  init() {
    this.initGA();
    this.initMatomo();
    this.initFacebookPixel();
    this.log('All analytics services initialized');
  }
}

// Create and export a singleton instance
export const analytics = new Analytics();

// Export the class for testing/custom instances
export default Analytics;