#!/usr/bin/env node
/**
 * Script to generate sitemap.xml and robots.txt files
 * Run with: npm run seo:generate
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock product data for sitemap generation
const mockProducts = [
  { id: 1, name: 'Premium Leggings', created_at: '2024-01-15', updated_at: '2024-01-20' },
  { id: 2, name: 'Sports Bra Black', created_at: '2024-01-16', updated_at: '2024-01-21' },
  { id: 3, name: 'Workout Top Grey', created_at: '2024-01-17', updated_at: '2024-01-22' },
  { id: 4, name: 'Yoga Pants', created_at: '2024-01-18', updated_at: '2024-01-23' },
  { id: 5, name: 'Athletic Shorts', created_at: '2024-01-19', updated_at: '2024-01-24' },
  { id: 6, name: 'Tank Top White', created_at: '2024-01-20', updated_at: '2024-01-25' }
];

// SEO configuration (inline for script)
const seoConfig = {
  siteUrl: process.env.VITE_SITE_URL || 'http://localhost:5173',
  siteName: 'Broken Beauty',
  brand: {
    name: 'Broken Beauty',
    email: 'support@brokenbeauty.com'
  }
};

const isProduction = process.env.VITE_ENVIRONMENT === 'production';

/**
 * Sitemap Generator (simplified for script)
 */
class SitemapGenerator {
  constructor(baseUrl = seoConfig.siteUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.urls = [];
  }

  addUrl(url, options = {}) {
    const defaultOptions = {
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: new Date().toISOString().split('T')[0]
    };

    const cleanUrl = url.startsWith('/') ? url : `/${url}`;

    this.urls.push({
      url: `${this.baseUrl}${cleanUrl}`,
      ...defaultOptions,
      ...options
    });
  }

  generateStaticUrls() {
    this.addUrl('/', { priority: '1.0', changefreq: 'daily' });
    this.addUrl('/products', { priority: '0.9', changefreq: 'daily' });
    this.addUrl('/about', { priority: '0.6', changefreq: 'monthly' });
    this.addUrl('/contact', { priority: '0.6', changefreq: 'monthly' });
    this.addUrl('/login', { priority: '0.3', changefreq: 'yearly' });
    this.addUrl('/register', { priority: '0.3', changefreq: 'yearly' });
    this.addUrl('/privacy', { priority: '0.2', changefreq: 'yearly' });
    this.addUrl('/terms', { priority: '0.2', changefreq: 'yearly' });
  }

  generateProductUrls(products) {
    products.forEach(product => {
      this.addUrl(`/products/${product.id}`, {
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: product.updated_at || product.created_at || new Date().toISOString().split('T')[0]
      });
    });
  }

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

  escapeXml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  generateSitemap(products = []) {
    this.urls = [];
    this.generateStaticUrls();
    this.generateProductUrls(products);
    return this.generateXML();
  }
}

/**
 * Robots.txt Generator (simplified for script)
 */
class RobotsGenerator {
  constructor(baseUrl = seoConfig.siteUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  generate() {
    if (!isProduction) {
      return `# Robots.txt for ${this.baseUrl}
# Development environment - not for crawling

User-agent: *
Disallow: /

# This is a development/staging environment
# Please do not index or crawl this site`;
    }

    return `# Robots.txt for ${this.baseUrl}
# Generated on ${new Date().toISOString()}

User-agent: *
Allow: /

# Disallow private/admin areas
Disallow: /api/
Disallow: /admin/
Disallow: /account/
Disallow: /profile/
Disallow: /cart/
Disallow: /checkout/
Disallow: /orders/
Disallow: /login/
Disallow: /register/

# Disallow search parameters
Disallow: /*?*
Disallow: *?utm_*
Disallow: *?ref=*

# Allow important files
Allow: /favicon.ico
Allow: /robots.txt
Allow: /sitemap.xml
Allow: *.css
Allow: *.js
Allow: *.png
Allow: *.jpg
Allow: *.svg

# Crawl-delay
Crawl-delay: 1

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml

# Contact
# For questions about this robots.txt, contact: ${seoConfig.brand.email}`;
  }
}

/**
 * Main generation function
 */
async function generateSEOFiles() {
  try {
    console.log('🔍 Generating SEO files...');
    console.log(`Environment: ${process.env.VITE_ENVIRONMENT || 'development'}`);
    console.log(`Site URL: ${seoConfig.siteUrl}`);

    // Initialize generators
    const sitemapGenerator = new SitemapGenerator();
    const robotsGenerator = new RobotsGenerator();

    // Generate content
    const sitemap = sitemapGenerator.generateSitemap(mockProducts);
    const robots = robotsGenerator.generate();

    // Determine output directory
    const outputDir = path.join(__dirname, '..', 'public');
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`Created directory: ${outputDir}`);
    }

    // Write sitemap.xml
    const sitemapPath = path.join(outputDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`✅ Generated sitemap.xml (${sitemapGenerator.urls.length} URLs)`);

    // Write robots.txt
    const robotsPath = path.join(outputDir, 'robots.txt');
    fs.writeFileSync(robotsPath, robots);
    console.log(`✅ Generated robots.txt`);

    // Generate stats
    const stats = {
      totalUrls: sitemapGenerator.urls.length,
      files: ['sitemap.xml', 'robots.txt'],
      lastGenerated: new Date().toISOString(),
      environment: process.env.VITE_ENVIRONMENT || 'development'
    };

    // Write stats file for debugging
    const statsPath = path.join(outputDir, 'seo-stats.json');
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
    console.log(`📊 Generated seo-stats.json`);

    console.log('\n🎉 SEO files generated successfully!');
    console.log(`Files created in: ${outputDir}`);
    console.log(`- sitemap.xml (${stats.totalUrls} URLs)`);
    console.log(`- robots.txt`);
    console.log(`- seo-stats.json`);

  } catch (error) {
    console.error('❌ Error generating SEO files:', error);
    process.exit(1);
  }
}

// Run the generator
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSEOFiles();
}

export { generateSEOFiles };