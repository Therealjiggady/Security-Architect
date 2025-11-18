/**
 * MetaTags Component
 * Manages HTML head meta tags using react-helmet-async
 */

import { Helmet } from 'react-helmet-async';
import { seoConfig } from '../../config/seo';

export const MetaTags = ({ 
  title, 
  description, 
  image, 
  url, 
  type = "website",
  keywords,
  product = null,
  noIndex = false,
  canonicalUrl 
}) => {
  // Generate final values with fallbacks
  const pageTitle = title 
    ? (title.includes(seoConfig.brand.name) ? title : `${title} | ${seoConfig.brand.name}`)
    : seoConfig.defaultTitle;
  
  const pageDescription = description || seoConfig.defaultDescription;
  const pageImage = image?.startsWith('http') 
    ? image 
    : `${seoConfig.siteUrl}${image || seoConfig.defaultImage}`;
  const pageUrl = url || seoConfig.siteUrl;
  const pageKeywords = keywords || seoConfig.keywords.homepage.join(', ');
  const canonical = canonicalUrl || pageUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={seoConfig.brand.name} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Robots */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Language */}
      <meta httpEquiv="content-language" content="en" />
      
      {/* Viewport (should be in base HTML but ensuring it's here) */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* OpenGraph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:alt" content={`${title || 'Page'} - ${seoConfig.brand.name}`} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:locale" content="en_US" />
      
      {/* Image dimensions for better sharing */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={seoConfig.social.twitter} />
      <meta name="twitter:creator" content={seoConfig.social.twitter} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:alt" content={`${title || 'Page'} - ${seoConfig.brand.name}`} />
      
      {/* Product-specific OpenGraph tags */}
      {product && (
        <>
          <meta property="product:brand" content={seoConfig.brand.name} />
          <meta property="product:availability" content={product.stock > 0 ? "in stock" : "out of stock"} />
          <meta property="product:condition" content="new" />
          <meta property="product:price:amount" content={product.price} />
          <meta property="product:price:currency" content="USD" />
          
          {/* Additional Twitter product card */}
          <meta name="twitter:label1" content="Price" />
          <meta name="twitter:data1" content={`$${product.price}`} />
          <meta name="twitter:label2" content="Availability" />
          <meta name="twitter:data2" content={product.stock > 0 ? "In Stock" : "Out of Stock"} />
        </>
      )}
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Additional Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    </Helmet>
  );
};

/**
 * Simple meta tags for basic pages
 */
export const BasicMetaTags = ({ title, description }) => {
  return (
    <MetaTags 
      title={title}
      description={description}
      type="website"
    />
  );
};

/**
 * Product page specific meta tags
 */
export const ProductMetaTags = ({ product }) => {
  const title = `${product.name} - Premium Activewear`;
  const description = product.description 
    ? `${product.description}. Shop ${product.name} at Broken Beauty with fast shipping.`
    : `${product.name} - Premium activewear from Broken Beauty. $${product.price} with fast shipping and easy returns.`;
  
  return (
    <MetaTags 
      title={title}
      description={description}
      image={product.image_url}
      url={`${seoConfig.siteUrl}/products/${product.id}`}
      type="product"
      keywords={`${product.name}, activewear, fitness clothing, ${seoConfig.keywords.products.join(', ')}`}
      product={product}
    />
  );
};

/**
 * Collection/Category page meta tags
 */
export const CategoryMetaTags = ({ category, products = [] }) => {
  const title = `${category} Collection - Premium Activewear`;
  const description = `Shop our premium ${category.toLowerCase()} collection. ${products.length} high-quality items with fast shipping and easy returns.`;
  
  return (
    <MetaTags 
      title={title}
      description={description}
      url={`${seoConfig.siteUrl}/products?category=${category.toLowerCase()}`}
      keywords={`${category}, ${seoConfig.keywords.products.join(', ')}`}
    />
  );
};

export default MetaTags;