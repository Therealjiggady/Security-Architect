/**
 * Sitemap generation utility
 * Creates XML sitemaps for better search engine crawling
 */

import { seoConfig } from '../config/seo';

export class SitemapGenerator {
  constructor(baseUrl = seoConfig.siteUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.urls = [];
  }

  /**
   * Add a URL to the sitemap
   * @param {string} url - The URL path (without domain)
   * @param {Object} options - URL options (priority, changefreq, lastmod)
   */
  addUrl(url, options = {}) {
    const defaultOptions = {
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: new Date().toISOString().split('T')[0]
    };

    // Ensure URL starts with /
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;

    this.urls.push({
      url: `${this.baseUrl}${cleanUrl}`,
      ...defaultOptions,
      ...options
    });
  }

  /**
   * Generate static page URLs
   */
  generateStaticUrls() {
    // Homepage - highest priority
    this.addUrl('/', { 
      priority: '1.0', 
      changefreq: 'daily' 
    });
    
    // Main navigation pages
    this.addUrl('/products', { 
      priority: '0.9', 
      changefreq: 'daily' 
    });
    
    this.addUrl('/about', { 
      priority: '0.6', 
      changefreq: 'monthly' 
    });
    
    this.addUrl('/contact', { 
      priority: '0.6', 
      changefreq: 'monthly' 
    });

    // Auth pages (lower priority)
    this.addUrl('/login', { 
      priority: '0.3', 
      changefreq: 'yearly' 
    });
    
    this.addUrl('/register', { 
      priority: '0.3', 
      changefreq: 'yearly' 
    });

    // Legal pages
    this.addUrl('/privacy', { 
      priority: '0.2', 
      changefreq: 'yearly' 
    });
    
    this.addUrl('/terms', { 
      priority: '0.2', 
      changefreq: 'yearly' 
    });

    // Category pages (if you have them)
    const categories = [
      'leggings',
      'sports-bras',
      'workout-tops',
      'activewear'
    ];

    categories.forEach(category => {
      this.addUrl(`/products/category/${category}`, {
        priority: '0.7',
        changefreq: 'weekly'
      });
    });
  }

  /**
   * Generate product URLs from products array
   * @param {Array} products - Array of product objects
   */
  generateProductUrls(products) {
    products.forEach(product => {
      this.addUrl(`/products/${product.id}`, {
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: product.updated_at || product.created_at || new Date().toISOString().split('T')[0]
      });
    });
  }

  /**
   * Generate blog URLs (if you have a blog)
   * @param {Array} posts - Array of blog post objects
   */
  generateBlogUrls(posts = []) {
    if (posts.length === 0) return;

    // Blog index
    this.addUrl('/blog', {
      priority: '0.7',
      changefreq: 'daily'
    });

    // Individual posts
    posts.forEach(post => {
      this.addUrl(`/blog/${post.slug}`, {
        priority: '0.6',
        changefreq: 'monthly',
        lastmod: post.updated_at || post.created_at
      });
    });
  }

  /**
   * Generate XML sitemap content
   * @returns {string} XML sitemap content
   */
  generateXML() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    this.urls.forEach(urlData => {
      xml += `
  <url>
    <loc>${this.escapeXml(urlData.url)}</loc>
    <lastmod>${urlData.lastmod}</lastmod>
    <changefreq>${urlData.changefreq}</changefreq>
    <priority>${urlData.priority}</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    return xml;
  }

  /**
   * Escape XML special characters
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  escapeXml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Generate complete sitemap with all URLs
   * @param {Array} products - Products array
   * @param {Array} posts - Blog posts array (optional)
   * @returns {string} Complete XML sitemap
   */
  async generateSitemap(products = [], posts = []) {
    // Reset URLs array
    this.urls = [];
    
    // Add all URL types
    this.generateStaticUrls();
    this.generateProductUrls(products);
    this.generateBlogUrls(posts);
    
    return this.generateXML();
  }

  /**
   * Get sitemap stats
   * @returns {Object} Sitemap statistics
   */
  getStats() {
    return {
      totalUrls: this.urls.length,
      urlsByChangefreq: this.urls.reduce((acc, url) => {
        acc[url.changefreq] = (acc[url.changefreq] || 0) + 1;
        return acc;
      }, {}),
      urlsByPriority: this.urls.reduce((acc, url) => {
        acc[url.priority] = (acc[url.priority] || 0) + 1;
        return acc;
      }, {}),
      lastGenerated: new Date().toISOString()
    };
  }
}

/**
 * Robots.txt generator
 */
export class RobotsGenerator {
  constructor(baseUrl = seoConfig.siteUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.isProduction = import.meta.env.VITE_ENVIRONMENT === 'production';
  }

  /**
   * Generate robots.txt content
   * @param {Object} options - Generation options
   * @returns {string} robots.txt content
   */
  generate(options = {}) {
    const {
      allowAll = this.isProduction,
      crawlDelay = 1,
      includeSitemap = true,
      customRules = []
    } = options;

    if (!allowAll) {
      // Development/localhost - block all crawlers
      return `# Robots.txt for ${this.baseUrl}
# Development environment - not for crawling

User-agent: *
Disallow: /

# This is a development/staging environment
# Please do not index or crawl this site`;
    }

    // Production robots.txt
    let robots = `# Robots.txt for ${this.baseUrl}
# Generated on ${new Date().toISOString()}

User-agent: *
Allow: /

# Disallow private/admin areas
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /account/
Disallow: /profile/
Disallow: /cart/
Disallow: /checkout/
Disallow: /orders/
Disallow: /login/
Disallow: /register/
Disallow: /reset-password/

# Disallow search result pages with parameters
Disallow: /*?*
Disallow: /*&*
Disallow: *?add-to-cart=*
Disallow: *?utm_*
Disallow: *?ref=*
Disallow: *?fbclid=*
Disallow: *?gclid=*

# Disallow temporary and development files
Disallow: /tmp/
Disallow: /temp/
Disallow: /.git/
Disallow: /node_modules/
Disallow: /build/
Disallow: /dist/

# Allow important files
Allow: /favicon.ico
Allow: /robots.txt
Allow: /sitemap.xml
Allow: *.css
Allow: *.js
Allow: *.png
Allow: *.jpg
Allow: *.jpeg
Allow: *.gif
Allow: *.svg
Allow: *.webp`;

    // Add crawl delay
    if (crawlDelay > 0) {
      robots += `\n\n# Crawl-delay
Crawl-delay: ${crawlDelay}`;
    }

    // Specific bot configurations
    robots += `\n
# Specific bot configurations
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /`;

    // Add sitemap reference
    if (includeSitemap) {
      robots += `\n\n# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml`;
    }

    // Add custom rules
    if (customRules.length > 0) {
      robots += '\n\n# Custom rules';
      customRules.forEach(rule => {
        robots += `\n${rule}`;
      });
    }

    robots += `\n\n# For questions about this robots.txt, contact: ${seoConfig.brand.email}`;

    return robots;
  }

  /**
   * Generate robots.txt for different environments
   */
  generateByEnvironment() {
    switch (import.meta.env.VITE_ENVIRONMENT) {
      case 'production':
        return this.generate({ allowAll: true });
      case 'staging':
        return this.generate({ 
          allowAll: false,
          customRules: ['# Staging environment - limited access'] 
        });
      default:
        return this.generate({ allowAll: false });
    }
  }
}

/**
 * SEO file manager - coordinates sitemap and robots.txt generation
 */
export class SEOFileManager {
  constructor() {
    this.sitemapGenerator = new SitemapGenerator();
    this.robotsGenerator = new RobotsGenerator();
  }

  /**
   * Generate all SEO files
   * @param {Array} products - Products for sitemap
   * @returns {Object} Generated files content
   */
  async generateAll(products = []) {
    const sitemap = await this.sitemapGenerator.generateSitemap(products);
    const robots = this.robotsGenerator.generateByEnvironment();
    
    return {
      sitemap,
      robots,
      stats: this.sitemapGenerator.getStats()
    };
  }

  /**
   * Save files (for build-time generation)
   * @param {Object} files - Files to save
   * @param {string} outputDir - Output directory
   */
  async saveFiles(files, outputDir = './public') {
    if (typeof window !== 'undefined') {
      console.warn('saveFiles is meant for build-time use only');
      return;
    }

    const fs = require('fs');
    const path = require('path');

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save sitemap.xml
    fs.writeFileSync(
      path.join(outputDir, 'sitemap.xml'), 
      files.sitemap
    );

    // Save robots.txt
    fs.writeFileSync(
      path.join(outputDir, 'robots.txt'), 
      files.robots
    );

    console.log('SEO files generated successfully:', files.stats);
  }
}

export default {
  SitemapGenerator,
  RobotsGenerator,
  SEOFileManager
};