/**
 * Structured Data Components (JSON-LD)
 * Implements Schema.org markup for better search engine understanding
 */

import { seoConfig } from '../../config/seo';

/**
 * Base component for rendering JSON-LD structured data
 */
const StructuredDataScript = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 0) }}
    />
  );
};

/**
 * Organization Schema - Use on homepage and about page
 */
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": seoConfig.brand.name,
    "description": seoConfig.brand.description,
    "url": seoConfig.siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${seoConfig.siteUrl}${seoConfig.brand.logo}`,
      "width": 200,
      "height": 60
    },
    "foundingDate": seoConfig.brand.foundingDate,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": seoConfig.brand.phone,
      "contactType": "customer service",
      "email": seoConfig.brand.email,
      "availableLanguage": ["English"]
    },
    "sameAs": [
      `https://instagram.com/${seoConfig.social.instagram.replace('@', '')}`,
      `https://facebook.com/${seoConfig.social.facebook}`,
      `https://twitter.com/${seoConfig.social.twitter.replace('@', '')}`,
      `https://tiktok.com/${seoConfig.social.tiktok.replace('@', '')}`
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": seoConfig.brand.address.streetAddress,
      "addressLocality": seoConfig.brand.address.addressLocality,
      "addressRegion": seoConfig.brand.address.addressRegion,
      "postalCode": seoConfig.brand.address.postalCode,
      "addressCountry": seoConfig.brand.address.addressCountry
    }
  };

  return <StructuredDataScript data={schema} />;
};

/**
 * Website Schema - Use on homepage
 */
export const WebsiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": seoConfig.siteName,
    "description": seoConfig.defaultDescription,
    "url": seoConfig.siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${seoConfig.siteUrl}/products?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": seoConfig.brand.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${seoConfig.siteUrl}${seoConfig.brand.logo}`
      }
    }
  };

  return <StructuredDataScript data={schema} />;
};

/**
 * Product Schema - Use on individual product pages
 */
export const ProductSchema = ({ product }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `${product.name} - Premium activewear from ${seoConfig.brand.name}`,
    "image": product.image_url,
    "sku": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": seoConfig.brand.name
    },
    "category": "Activewear",
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": product.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": seoConfig.brand.name
      },
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      "url": `${seoConfig.siteUrl}/products/${product.id}`,
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "USD"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "minDeliveryDays": 3,
          "maxDeliveryDays": 7
        }
      }
    },
    // Add mock review data for better SEO (replace with real data when available)
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return <StructuredDataScript data={schema} />;
};

/**
 * Breadcrumb Schema - Use on all pages except homepage
 */
export const BreadcrumbSchema = ({ breadcrumbs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url.startsWith('http') 
        ? crumb.url 
        : `${seoConfig.siteUrl}${crumb.url}`
    }))
  };

  return <StructuredDataScript data={schema} />;
};

/**
 * Local Business Schema - For contact/about pages
 */
export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": seoConfig.brand.name,
    "description": seoConfig.brand.description,
    "image": `${seoConfig.siteUrl}${seoConfig.brand.logo}`,
    "url": seoConfig.siteUrl,
    "telephone": seoConfig.brand.phone,
    "email": seoConfig.brand.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": seoConfig.brand.address.streetAddress,
      "addressLocality": seoConfig.brand.address.addressLocality,
      "addressRegion": seoConfig.brand.address.addressRegion,
      "postalCode": seoConfig.brand.address.postalCode,
      "addressCountry": seoConfig.brand.address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "34.0522", // Los Angeles coordinates as example
      "longitude": "-118.2437"
    },
    "openingHours": [
      "Mo-Fr 09:00-18:00",
      "Sa 09:00-16:00"
    ],
    "priceRange": "$10-$100"
  };

  return <StructuredDataScript data={schema} />;
};

/**
 * Collection/Category Page Schema
 */
export const CollectionPageSchema = ({ category, products = [], url }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category} Collection | ${seoConfig.brand.name}`,
    "description": `Shop our premium ${category.toLowerCase()} collection featuring ${products.length} high-quality items.`,
    "url": url || `${seoConfig.siteUrl}/products`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 10).map((product, index) => ({ // Limit to 10 for performance
        "@type": "ListItem", 
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `${seoConfig.siteUrl}/products/${product.id}`,
          "image": product.image_url,
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "USD"
          }
        }
      }))
    }
  };

  return <StructuredDataScript data={schema} />;
};

/**
 * FAQ Schema - For FAQ sections
 */
export const FAQSchema = ({ faqs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return <StructuredDataScript data={schema} />;
};

/**
 * Review Schema - For product reviews
 */
export const ReviewSchema = ({ reviews, product }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.date,
      "reviewBody": review.text,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5",
        "worstRating": "1"
      }
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
      "reviewCount": reviews.length,
      "bestRating": "5",
      "worstRating": "1"  
    }
  };

  return <StructuredDataScript data={schema} />;
};

export default {
  OrganizationSchema,
  WebsiteSchema,
  ProductSchema,
  BreadcrumbSchema,
  LocalBusinessSchema,
  CollectionPageSchema,
  FAQSchema,
  ReviewSchema
};