# Day 43: SEO & Analytics Setup

## Overview
Implement comprehensive SEO optimization and analytics setup for the Broken Beauty e-commerce platform. Focus on localhost-compatible implementations with preparation for production deployment.

**Objective:** Optimize the website for search engines and prepare analytics tracking while maintaining localhost development environment.

## SEO Implementation Strategy

### Localhost vs Production SEO
```yaml
Can Do on Localhost:
  - Meta tags and OpenGraph data ✅
  - Sitemap.xml and robots.txt generation ✅
  - Structured data (JSON-LD) ✅
  - Page title optimization ✅
  - Lighthouse SEO testing ✅
  - Analytics code setup ✅

Requires Production Domain:
  - Google Search Console submission ❌
  - Real sitemap submission ❌
  - Social media meta preview testing ❌
  - Actual search indexing ❌
```

## Meta Tags & OpenGraph Implementation

### HTML Head Optimization

#### Base Meta Tags
```html
<!-- Basic SEO Meta Tags -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="Premium activewear and fitness clothing designed for performance and style. Shop leggings, sports bras, and workout gear." />
<meta name="keywords" content="activewear, fitness clothing, leggings, sports bras, workout gear, athleisure" />
<meta name="author" content="Broken Beauty" />
<meta name="robots" content="index, follow" />

<!-- Canonical URL -->
<link rel="canonical" href="https://brokenbeauty.com/" />

<!-- Language -->
<html lang="en" />
```

#### OpenGraph Tags (Social Media)
```html
<!-- OpenGraph Meta Tags -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Broken Beauty" />
<meta property="og:title" content="Broken Beauty - Premium Activewear" />
<meta property="og:description" content="Discover premium activewear and fitness clothing designed for performance and style." />
<meta property="og:image" content="https://brokenbeauty.com/og-image.jpg" />
<meta property="og:url" content="https://brokenbeauty.com/" />
<meta property="og:locale" content="en_US" />

<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@brokenbeauty" />
<meta name="twitter:title" content="Broken Beauty - Premium Activewear" />
<meta name="twitter:description" content="Discover premium activewear and fitness clothing designed for performance and style." />
<meta name="twitter:image" content="https://brokenbeauty.com/twitter-card.jpg" />
```

#### Product Page Meta Tags
```html
<!-- Product-specific OpenGraph -->
<meta property="og:type" content="product" />
<meta property="product:brand" content="Broken Beauty" />
<meta property="product:availability" content="in stock" />
<meta property="product:condition" content="new" />
<meta property="product:price:amount" content="24.99" />
<meta property="product:price:currency" content="USD" />
```

### SEO Configuration Management

#### Frontend SEO Config
```javascript
// src/config/seo.js
export const seoConfig = {
  defaultTitle: "Broken Beauty - Premium Activewear",
  titleTemplate: "%s | Broken Beauty",
  defaultDescription: "Discover premium activewear and fitness clothing designed for performance and style. Shop leggings, sports bras, and workout gear.",
  siteUrl: import.meta.env.VITE_SITE_URL || "http://localhost:5173",
  defaultImage: "/og-image.jpg",
  
  // Social Media
  social: {
    twitter: "@brokenbeauty",
    instagram: "@brokenbeauty",
    facebook: "brokenbeauty"
  },
  
  // Brand Information
  brand: {
    name: "Broken Beauty",
    description: "Premium activewear and fitness clothing",
    logo: "/logo.png",
    foundingDate: "2024",
    email: "support@brokenbeauty.com",
    phone: "+1-555-123-4567"
  },
  
  // Product Categories
  categories: [
    "Activewear",
    "Fitness Clothing", 
    "Leggings",
    "Sports Bras",
    "Workout Gear",
    "Athleisure"
  ]
};
```

#### Dynamic Meta Tags Component
```javascript
// src/components/SEO/MetaTags.jsx
import { Helmet } from 'react-helmet-async';
import { seoConfig } from '../config/seo';

export const MetaTags = ({ 
  title, 
  description, 
  image, 
  url, 
  type = "website",
  product = null 
}) => {
  const pageTitle = title 
    ? `${title} | ${seoConfig.brand.name}`
    : seoConfig.defaultTitle;
  
  const pageDescription = description || seoConfig.defaultDescription;
  const pageImage = image || `${seoConfig.siteUrl}${seoConfig.defaultImage}`;
  const pageUrl = url || seoConfig.siteUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />
      
      {/* OpenGraph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={seoConfig.brand.name} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      {seoConfig.social.twitter && (
        <meta name="twitter:site" content={seoConfig.social.twitter} />
      )}
      
      {/* Product-specific meta tags */}
      {product && (
        <>
          <meta property="product:brand" content={seoConfig.brand.name} />
          <meta property="product:availability" content={product.stock > 0 ? "in stock" : "out of stock"} />
          <meta property="product:condition" content="new" />
          <meta property="product:price:amount" content={product.price} />
          <meta property="product:price:currency" content="USD" />
        </>
      )}
    </Helmet>
  );
};
```

### Structured Data (JSON-LD)

#### Organization Schema
```javascript
// src/components/SEO/StructuredData.jsx
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Broken Beauty",
    "description": "Premium activewear and fitness clothing",
    "url": "https://brokenbeauty.com",
    "logo": "https://brokenbeauty.com/logo.png",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "email": "support@brokenbeauty.com"
    },
    "sameAs": [
      "https://facebook.com/brokenbeauty",
      "https://instagram.com/brokenbeauty",
      "https://twitter.com/brokenbeauty"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Fashion Ave",
      "addressLocality": "Style City",
      "addressRegion": "CA",
      "postalCode": "90210",
      "addressCountry": "US"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

#### Product Schema
```javascript
export const ProductSchema = ({ product }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image_url,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "Broken Beauty"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": product.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Broken Beauty"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "128"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

#### Breadcrumb Schema
```javascript
export const BreadcrumbSchema = ({ breadcrumbs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

## Sitemap & Robots.txt Generation

### Dynamic Sitemap Generator
```javascript
// src/utils/sitemap.js
export class SitemapGenerator {
  constructor(baseUrl = "https://brokenbeauty.com") {
    this.baseUrl = baseUrl;
    this.urls = [];
  }

  addUrl(url, options = {}) {
    const defaultOptions = {
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: new Date().toISOString().split('T')[0]
    };

    this.urls.push({
      url: `${this.baseUrl}${url}`,
      ...defaultOptions,
      ...options
    });
  }

  generateStaticUrls() {
    // Static pages
    this.addUrl('/', { priority: '1.0', changefreq: 'daily' });
    this.addUrl('/products', { priority: '0.9', changefreq: 'daily' });
    this.addUrl('/about', { priority: '0.6', changefreq: 'monthly' });
    this.addUrl('/contact', { priority: '0.6', changefreq: 'monthly' });
    this.addUrl('/privacy', { priority: '0.3', changefreq: 'yearly' });
    this.addUrl('/terms', { priority: '0.3', changefreq: 'yearly' });
  }

  async generateProductUrls(products) {
    products.forEach(product => {
      this.addUrl(`/products/${product.id}`, {
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: product.updated_at || product.created_at
      });
    });
  }

  generateXML() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    this.urls.forEach(urlData => {
      xml += `
  <url>
    <loc>${urlData.url}</loc>
    <lastmod>${urlData.lastmod}</lastmod>
    <changefreq>${urlData.changefreq}</changefreq>
    <priority>${urlData.priority}</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    return xml;
  }

  async generateSitemap(products = []) {
    this.urls = []; // Reset
    this.generateStaticUrls();
    await this.generateProductUrls(products);
    return this.generateXML();
  }
}
```

### Robots.txt Generator
```javascript
// src/utils/robots.js
export class RobotsGenerator {
  constructor(baseUrl = "https://brokenbeauty.com") {
    this.baseUrl = baseUrl;
  }

  generate(isProduction = false) {
    if (!isProduction) {
      // Development/localhost - block all crawlers
      return `User-agent: *
Disallow: /

# Local development - not for crawling`;
    }

    // Production robots.txt
    return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /cart
Disallow: /checkout
Disallow: /profile
Disallow: /orders
Disallow: *?add-to-cart=*
Disallow: *?utm_*
Disallow: *?ref=*

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Specific bots
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1`;
  }
}
```

### Build-time Generation
```javascript
// vite.config.js - Add sitemap/robots generation plugin
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom plugin to generate SEO files
const seoPlugin = () => {
  return {
    name: 'seo-generator',
    generateBundle() {
      // This will be called during build
      // Generate sitemap.xml and robots.txt
      console.log('Generating SEO files...');
    }
  };
};

export default defineConfig({
  plugins: [
    react(),
    seoPlugin()
  ],
  // ... rest of config
});
```

## Analytics Implementation

### Google Analytics 4 Setup
```javascript
// src/utils/analytics.js
export class Analytics {
  constructor() {
    this.gaId = import.meta.env.VITE_GA_ID;
    this.matomoUrl = import.meta.env.VITE_MATOMO_URL;
    this.matomoId = import.meta.env.VITE_MATOMO_ID;
    this.isProduction = import.meta.env.VITE_ENVIRONMENT === 'production';
  }

  // Google Analytics 4
  initGA() {
    if (!this.gaId || !this.isProduction) return;

    // Load gtag script
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', this.gaId, {
      page_title: document.title,
      page_location: window.location.href
    });

    // Load GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(script);
  }

  // Matomo Analytics
  initMatomo() {
    if (!this.matomoUrl || !this.matomoId || !this.isProduction) return;

    window._paq = window._paq || [];
    window._paq.push(['trackPageView']);
    window._paq.push(['enableLinkTracking']);
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `${this.matomoUrl}/matomo.js`;
    document.head.appendChild(script);
  }

  // Track page views
  trackPageView(path, title) {
    if (!this.isProduction) return;

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', this.gaId, {
        page_path: path,
        page_title: title
      });
    }

    // Matomo
    if (window._paq) {
      window._paq.push(['setCustomUrl', path]);
      window._paq.push(['setDocumentTitle', title]);
      window._paq.push(['trackPageView']);
    }
  }

  // Track e-commerce events
  trackPurchase(orderId, value, items) {
    if (!this.isProduction) return;

    // Google Analytics 4 Enhanced Ecommerce
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        value: value,
        currency: 'USD',
        items: items.map(item => ({
          item_id: item.sku,
          item_name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price
        }))
      });
    }

    // Matomo Ecommerce
    if (window._paq) {
      window._paq.push(['trackEcommerceOrder', orderId, value]);
    }
  }

  trackAddToCart(item) {
    if (!this.isProduction) return;

    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: item.price,
        items: [{
          item_id: item.sku,
          item_name: item.name,
          price: item.price,
          quantity: 1
        }]
      });
    }
  }
}

// Initialize analytics
export const analytics = new Analytics();
```

### Analytics Context Provider
```javascript
// src/contexts/AnalyticsContext.jsx
import { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../utils/analytics';

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize analytics
    analytics.initGA();
    analytics.initMatomo();
  }, []);

  useEffect(() => {
    // Track page views on route change
    analytics.trackPageView(location.pathname, document.title);
  }, [location]);

  const trackEvent = (eventName, parameters = {}) => {
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  };

  const trackPurchase = (orderId, value, items) => {
    analytics.trackPurchase(orderId, value, items);
  };

  const trackAddToCart = (item) => {
    analytics.trackAddToCart(item);
  };

  return (
    <AnalyticsContext.Provider value={{
      trackEvent,
      trackPurchase,
      trackAddToCart
    }}>
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
```

## Page-Specific SEO Optimization

### Homepage SEO
```javascript
// src/pages/HomePage.jsx
import { MetaTags } from '../components/SEO/MetaTags';
import { OrganizationSchema } from '../components/SEO/StructuredData';

export const HomePage = () => {
  return (
    <>
      <MetaTags 
        title="Premium Activewear & Fitness Clothing"
        description="Discover premium activewear and fitness clothing designed for performance and style. Shop leggings, sports bras, and workout gear with fast shipping."
        type="website"
      />
      <OrganizationSchema />
      
      <div className="homepage">
        {/* Homepage content */}
      </div>
    </>
  );
};
```

### Product Page SEO
```javascript
// src/pages/ProductPage.jsx
import { MetaTags } from '../components/SEO/MetaTags';
import { ProductSchema, BreadcrumbSchema } from '../components/SEO/StructuredData';

export const ProductPage = ({ product }) => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.name, url: `/products/${product.id}` }
  ];

  return (
    <>
      <MetaTags 
        title={product.name}
        description={product.description || `${product.name} - Premium activewear from Broken Beauty. ${product.price} with fast shipping.`}
        image={product.image_url}
        type="product"
        product={product}
      />
      <ProductSchema product={product} />
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      
      <div className="product-page">
        {/* Product page content */}
      </div>
    </>
  );
};
```

### Collection Page SEO
```javascript
// src/pages/ProductsPage.jsx
export const ProductsPage = () => {
  return (
    <>
      <MetaTags 
        title="Premium Activewear Collection"
        description="Browse our complete collection of premium activewear including leggings, sports bras, workout tops, and athleisure wear. Free shipping on orders over $50."
      />
      
      <div className="products-page">
        {/* Products grid */}
      </div>
    </>
  );
};
```

## Localhost SEO Testing

### Lighthouse SEO Audit
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run SEO audit on localhost
lighthouse http://localhost:5173 --only-categories=seo --chrome-flags="--headless"

# Generate full report
lighthouse http://localhost:5173 --output html --output-path ./seo-report.html

# Target SEO score: ≥ 90
```

### SEO Checklist for Localhost Testing
```markdown
## Technical SEO ✅
- [ ] Page titles unique and descriptive (< 60 characters)
- [ ] Meta descriptions compelling (< 160 characters)  
- [ ] H1 tags present on all pages
- [ ] Heading hierarchy proper (H1 → H2 → H3)
- [ ] Images have alt text
- [ ] Internal linking structure
- [ ] URL structure clean and descriptive
- [ ] Canonical tags implemented
- [ ] Robots meta tags appropriate

## Content SEO ✅
- [ ] Keyword research completed
- [ ] Target keywords in titles
- [ ] Keywords in meta descriptions
- [ ] Keywords in headings
- [ ] Keywords in content (natural usage)
- [ ] Content length appropriate (300+ words)
- [ ] Content quality high
- [ ] Unique content (no duplication)

## Structured Data ✅
- [ ] Organization schema
- [ ] Product schema  
- [ ] Breadcrumb schema
- [ ] Review schema (future)
- [ ] FAQ schema (future)

## Social Media ✅
- [ ] OpenGraph tags complete
- [ ] Twitter Card tags
- [ ] Social media images optimized
- [ ] Brand consistency

## Performance Impact ✅
- [ ] Meta tags don't slow page load
- [ ] Analytics scripts load asynchronously
- [ ] Structured data doesn't block rendering
- [ ] Images optimized with alt text
```

### SEO Testing Tools (Localhost)
```javascript
// src/utils/seoTest.js
export class SEOTester {
  constructor() {
    this.tests = [];
  }

  testPageTitle() {
    const title = document.title;
    const test = {
      name: 'Page Title',
      pass: title && title.length > 0 && title.length <= 60,
      message: title 
        ? `Title: "${title}" (${title.length} chars)`
        : 'No title found',
      score: title && title.length > 0 && title.length <= 60 ? 10 : 0
    };
    this.tests.push(test);
    return test;
  }

  testMetaDescription() {
    const metaDesc = document.querySelector('meta[name="description"]');
    const content = metaDesc?.getAttribute('content') || '';
    const test = {
      name: 'Meta Description',
      pass: content && content.length > 0 && content.length <= 160,
      message: content 
        ? `Description: "${content}" (${content.length} chars)`
        : 'No meta description found',
      score: content && content.length > 0 && content.length <= 160 ? 10 : 0
    };
    this.tests.push(test);
    return test;
  }

  testH1Tags() {
    const h1Tags = document.querySelectorAll('h1');
    const test = {
      name: 'H1 Tags',
      pass: h1Tags.length === 1,
      message: `Found ${h1Tags.length} H1 tags (should be 1)`,
      score: h1Tags.length === 1 ? 10 : 0
    };
    this.tests.push(test);
    return test;
  }

  testImageAltText() {
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
    const test = {
      name: 'Image Alt Text',
      pass: imagesWithoutAlt.length === 0,
      message: `${imagesWithoutAlt.length} images missing alt text out of ${images.length}`,
      score: imagesWithoutAlt.length === 0 ? 10 : Math.max(0, 10 - imagesWithoutAlt.length * 2)
    };
    this.tests.push(test);
    return test;
  }

  testCanonicalUrl() {
    const canonical = document.querySelector('link[rel="canonical"]');
    const test = {
      name: 'Canonical URL',
      pass: canonical && canonical.href,
      message: canonical 
        ? `Canonical: ${canonical.href}`
        : 'No canonical URL found',
      score: canonical && canonical.href ? 10 : 0
    };
    this.tests.push(test);
    return test;
  }

  testStructuredData() {
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    const test = {
      name: 'Structured Data',
      pass: jsonLdScripts.length > 0,
      message: `Found ${jsonLdScripts.length} structured data blocks`,
      score: Math.min(jsonLdScripts.length * 5, 10)
    };
    this.tests.push(test);
    return test;
  }

  runAllTests() {
    this.tests = []; // Reset
    
    this.testPageTitle();
    this.testMetaDescription();
    this.testH1Tags();
    this.testImageAltText();
    this.testCanonicalUrl();
    this.testStructuredData();

    const totalScore = this.tests.reduce((sum, test) => sum + test.score, 0);
    const maxScore = this.tests.length * 10;
    const percentage = Math.round((totalScore / maxScore) * 100);

    return {
      tests: this.tests,
      totalScore,
      maxScore,
      percentage
    };
  }
}

// Usage in development
if (import.meta.env.DEV) {
  window.seoTest = () => {
    const tester = new SEOTester();
    const results = tester.runAllTests();
    console.log('SEO Test Results:', results);
    return results;
  };
}
```

## Implementation Roadmap

### Phase 1: Basic SEO (Localhost Ready) ✅
1. **Meta Tags Setup**
   - Install react-helmet-async
   - Create MetaTags component
   - Add to all pages

2. **Structured Data**
   - Organization schema
   - Product schema
   - Breadcrumb schema

3. **Content Optimization**
   - Page titles
   - Meta descriptions
   - Heading structure
   - Image alt text

### Phase 2: Advanced SEO (Localhost Ready) ✅
1. **Sitemap Generation**
   - Dynamic sitemap creation
   - Build-time generation
   - Product URL inclusion

2. **Robots.txt**
   - Development vs production
   - Proper disallow rules
   - Sitemap reference

3. **Analytics Setup**
   - Google Analytics 4 code
   - Matomo setup
   - Event tracking
   - E-commerce tracking

### Phase 3: Production SEO (Requires Domain) ❌
1. **Search Console**
   - Domain verification
   - Sitemap submission
   - Performance monitoring

2. **Social Media**
   - OpenGraph testing
   - Twitter Card validation
   - Image optimization

3. **Advanced Analytics**
   - Goal setup
   - Conversion tracking
   - Custom events

## Performance Considerations

### SEO Impact on Performance
```javascript
// Lazy load analytics
const loadAnalytics = () => {
  // Load analytics only after page load
  window.addEventListener('load', () => {
    analytics.initGA();
    analytics.initMatomo();
  });
};

// Optimize structured data
const optimizeJsonLd = (schema) => {
  // Minify JSON-LD
  return JSON.stringify(schema).replace(/\s+/g, ' ');
};
```

### Bundle Size Management
```javascript
// Code split SEO components
const MetaTags = lazy(() => import('./components/SEO/MetaTags'));
const StructuredData = lazy(() => import('./components/SEO/StructuredData'));
```

## Testing & Validation

### Local SEO Testing Commands
```bash
# Install dependencies
npm install react-helmet-async

# Run SEO tests
npm run seo:test

# Generate sitemap
npm run seo:sitemap

# Validate structured data
npm run seo:validate

# Lighthouse audit
npm run seo:audit
```

### SEO Testing Script
```bash
#!/bin/bash
# seo-test.sh

echo "🔍 Running SEO Tests"
echo "===================="

# Start dev server if not running
if ! curl -s http://localhost:5173 > /dev/null; then
    echo "Starting development server..."
    npm run dev &
    sleep 5
fi

# Run Lighthouse SEO audit
echo "Running Lighthouse SEO audit..."
lighthouse http://localhost:5173 \
  --only-categories=seo \
  --output=json \
  --output-path=./seo-audit.json \
  --chrome-flags="--headless --no-sandbox"

# Parse results
node -e "
const results = require('./seo-audit.json');
const seoScore = results.categories.seo.score * 100;
console.log(\`SEO Score: \${seoScore}/100\`);
if (seoScore >= 90) {
  console.log('✅ SEO Score Target Met!');
  process.exit(0);
} else {
  console.log('❌ SEO Score Below Target (90)');
  process.exit(1);
}
"
```

## Success Metrics

### SEO KPIs (Localhost Testable)
- **Lighthouse SEO Score:** ≥ 90/100
- **Page Load Speed:** < 3 seconds
- **Meta Tags Coverage:** 100% of pages
- **Structured Data:** All product pages
- **Image Alt Text:** 100% coverage
- **Heading Structure:** Proper hierarchy

### Analytics KPIs (Production)
- **Organic Traffic Growth:** Month-over-month
- **Search Console Impressions:** Increasing trend
- **Click-through Rate:** > 2%
- **Page Sessions:** > 2 pages/session
- **Bounce Rate:** < 60%

## Future Enhancements

### Advanced SEO Features
- **Schema Markup Extensions**
  - Review schema
  - FAQ schema
  - How-to schema
  - Video schema

- **Content Marketing**
  - Blog integration
  - Content calendar
  - Keyword research tools
  - Content optimization

- **Local SEO** (if applicable)
  - Local business schema
  - Google My Business
  - Location pages

### Advanced Analytics
- **Custom Dimensions**
  - User segments
  - Product categories
  - Traffic sources

- **Enhanced Ecommerce**
  - Funnel analysis
  - Product performance
  - Cart abandonment tracking

## Resources & Tools

### SEO Testing Tools
- **Lighthouse:** `npm install -g lighthouse`
- **React Helmet Async:** Meta tag management
- **Structured Data Validator:** Google's testing tool
- **PageSpeed Insights:** Google performance tool

### Analytics Platforms
- **Google Analytics 4:** Free web analytics
- **Matomo:** Privacy-focused analytics
- **Google Search Console:** Search performance
- **Google Tag Manager:** Tag management

### Development Tools
- **SEO Browser Extensions:** SEO meta in 1 click
- **Structured Data Validator:** Browser extension  
- **OpenGraph Debugger:** Facebook sharing debugger
- **Twitter Card Validator:** Twitter card testing

---

**SEO and analytics setup prepared for both localhost development and future production deployment. All components ready for immediate testing and optimization.**