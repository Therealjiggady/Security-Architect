/**
 * SEO Configuration for Broken Beauty E-commerce Platform
 * Centralized configuration for meta tags, OpenGraph, and structured data
 */

export const seoConfig = {
  // Default meta information
  defaultTitle: "Broken Beauty - Premium Activewear & Fitness Clothing",
  titleTemplate: "%s | Broken Beauty",
  defaultDescription: "Discover premium activewear and fitness clothing designed for performance and style. Shop leggings, sports bras, workout gear, and athleisure wear with fast shipping.",
  
  // Site information
  siteUrl: import.meta.env.VITE_SITE_URL || "http://localhost:5173",
  siteName: "Broken Beauty",
  defaultImage: "/images/og-image.jpg",
  defaultImageAlt: "Broken Beauty - Premium Activewear Collection",
  
  // Favicon and icons
  favicon: "/favicon.ico",
  appleTouchIcon: "/apple-touch-icon.png",
  
  // Social media handles
  social: {
    twitter: "@brokenbeauty",
    instagram: "@brokenbeauty", 
    facebook: "brokenbeauty",
    tiktok: "@brokenbeauty"
  },
  
  // Brand information for structured data
  brand: {
    name: "Broken Beauty",
    description: "Premium activewear and fitness clothing brand",
    logo: "/images/logo.png",
    foundingDate: "2024",
    email: "support@brokenbeauty.com",
    phone: "+1-555-123-4567",
    address: {
      streetAddress: "123 Fashion Avenue",
      addressLocality: "Style City", 
      addressRegion: "CA",
      postalCode: "90210",
      addressCountry: "US"
    }
  },
  
  // Product categories for SEO
  categories: [
    "Activewear",
    "Fitness Clothing",
    "Leggings", 
    "Sports Bras",
    "Workout Gear",
    "Athleisure",
    "Yoga Wear",
    "Running Apparel"
  ],
  
  // Keywords by page type
  keywords: {
    homepage: [
      "premium activewear",
      "fitness clothing",
      "workout gear",
      "athleisure wear",
      "sports apparel",
      "broken beauty"
    ],
    products: [
      "leggings",
      "sports bras", 
      "workout tops",
      "athletic shorts",
      "yoga pants",
      "gym wear"
    ],
    about: [
      "activewear brand",
      "fitness fashion",
      "sustainable clothing",
      "premium quality"
    ]
  },
  
  // OpenGraph defaults
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Broken Beauty',
  },
  
  // Twitter Card defaults
  twitter: {
    cardType: 'summary_large_image',
    site: '@brokenbeauty',
    creator: '@brokenbeauty'
  },
  
  // Analytics IDs
  analytics: {
    googleAnalytics: import.meta.env.VITE_GA_ID,
    matomoUrl: import.meta.env.VITE_MATOMO_URL,
    matomoSiteId: import.meta.env.VITE_MATOMO_SITE_ID,
    facebookPixel: import.meta.env.VITE_FB_PIXEL_ID
  },
  
  // Page-specific SEO configurations
  pages: {
    home: {
      title: "Premium Activewear & Fitness Clothing | Broken Beauty",
      description: "Discover premium activewear and fitness clothing designed for performance and style. Shop leggings, sports bras, and workout gear with fast shipping.",
      keywords: "premium activewear, fitness clothing, leggings, sports bras, workout gear, athleisure"
    },
    products: {
      title: "Shop Premium Activewear Collection",
      description: "Browse our complete collection of premium activewear including leggings, sports bras, workout tops, and athleisure wear. Free shipping on orders over $50.",
      keywords: "activewear collection, leggings, sports bras, workout clothing, fitness apparel"
    },
    about: {
      title: "About Broken Beauty - Premium Activewear Brand",
      description: "Learn about Broken Beauty's mission to create premium activewear that combines performance, style, and sustainability for modern athletes.",
      keywords: "about broken beauty, activewear brand, premium fitness clothing, sustainable fashion"
    },
    contact: {
      title: "Contact Broken Beauty - Customer Service & Support",
      description: "Get in touch with Broken Beauty customer service for questions about orders, sizing, returns, or general inquiries. We're here to help!",
      keywords: "contact us, customer service, support, broken beauty help"
    }
  }
};

/**
 * Generate page-specific SEO data
 * @param {string} pageKey - Key from seoConfig.pages
 * @param {Object} customData - Custom data to override defaults
 * @returns {Object} SEO data object for the page
 */
export const getPageSEO = (pageKey, customData = {}) => {
  const pageConfig = seoConfig.pages[pageKey] || {};
  const defaultConfig = {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    image: `${seoConfig.siteUrl}${seoConfig.defaultImage}`,
    url: seoConfig.siteUrl,
    type: 'website'
  };
  
  return {
    ...defaultConfig,
    ...pageConfig,
    ...customData,
    // Ensure URL and image are absolute
    url: customData.url || `${seoConfig.siteUrl}${pageConfig.path || ''}`,
    image: customData.image?.startsWith('http') 
      ? customData.image 
      : `${seoConfig.siteUrl}${customData.image || pageConfig.image || seoConfig.defaultImage}`
  };
};

/**
 * Generate product-specific SEO data
 * @param {Object} product - Product object
 * @returns {Object} SEO data for product page
 */
export const getProductSEO = (product) => {
  const title = `${product.name} - Premium Activewear`;
  const description = product.description 
    ? `${product.description.substring(0, 140)}... Shop now at Broken Beauty with fast shipping.`
    : `${product.name} - Premium activewear from Broken Beauty. $${product.price} with fast shipping and easy returns.`;
  
  return {
    title,
    description,
    image: product.image_url,
    url: `${seoConfig.siteUrl}/products/${product.id}`,
    type: 'product',
    product: {
      brand: seoConfig.brand.name,
      availability: product.stock > 0 ? 'in stock' : 'out of stock',
      condition: 'new',
      price: parseFloat(product.price),
      currency: 'USD',
      sku: product.sku
    }
  };
};

/**
 * Generate breadcrumb data for SEO
 * @param {Array} breadcrumbs - Array of breadcrumb objects {name, url}
 * @returns {Array} Formatted breadcrumb data
 */
export const generateBreadcrumbs = (breadcrumbs) => {
  return breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url.startsWith('http') ? crumb.url : `${seoConfig.siteUrl}${crumb.url}`
  }));
};

export default seoConfig;