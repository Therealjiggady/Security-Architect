#!/usr/bin/env node
/**
 * SEO Testing Script for localhost development
 * Tests meta tags, structured data, and SEO best practices
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const BASE_URL = 'http://localhost:5173';
const PAGES_TO_TEST = [
  { path: '/', name: 'Homepage' },
  { path: '/products', name: 'Products Page' },
  { path: '/products/1', name: 'Product Detail' },
  { path: '/about', name: 'About Page' },
  { path: '/contact', name: 'Contact Page' }
];

/**
 * SEO Test Class
 */
class SEOTester {
  constructor() {
    this.results = {};
  }

  /**
   * Check if development server is running
   */
  async checkServerRunning() {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      try {
        const response = await fetch(BASE_URL);
        return response.ok;
      } catch (error) {
        return false;
      }
    }
  }

  /**
   * Test a single page for SEO elements
   */
  async testPage(pagePath) {
    const url = `${BASE_URL}${pagePath}`;
    const pageResults = {
      url,
      tests: {},
      score: 0,
      maxScore: 0
    };

    try {
      console.log(`🔍 Testing: ${url}`);

      // Use Lighthouse programmatically if available
      try {
        const { stdout } = await execAsync(`lighthouse ${url} --only-categories=seo --output=json --quiet --chrome-flags="--headless --no-sandbox"`);
        const lightouseResult = JSON.parse(stdout);
        const seoScore = Math.round(lightouseResult.categories.seo.score * 100);
        
        pageResults.tests['Lighthouse SEO Score'] = {
          score: seoScore >= 90 ? 10 : Math.round(seoScore / 10),
          maxScore: 10,
          message: `${seoScore}/100 (target: ≥90)`,
          pass: seoScore >= 90
        };

        // Extract specific audit results
        const audits = lightouseResult.audits;
        
        if (audits['document-title']) {
          pageResults.tests['Page Title'] = {
            score: audits['document-title'].score ? 10 : 0,
            maxScore: 10,
            message: audits['document-title'].title,
            pass: audits['document-title'].score > 0
          };
        }

        if (audits['meta-description']) {
          pageResults.tests['Meta Description'] = {
            score: audits['meta-description'].score ? 10 : 0,
            maxScore: 10,
            message: audits['meta-description'].title,
            pass: audits['meta-description'].score > 0
          };
        }

        if (audits['image-alt']) {
          pageResults.tests['Image Alt Text'] = {
            score: audits['image-alt'].score ? 10 : 0,
            maxScore: 10,
            message: audits['image-alt'].title,
            pass: audits['image-alt'].score > 0
          };
        }

      } catch (lighthouseError) {
        console.log(`⚠️ Lighthouse not available or failed: ${lighthouseError.message}`);
        pageResults.tests['Lighthouse'] = {
          score: 0,
          maxScore: 10,
          message: 'Lighthouse CLI not available',
          pass: false
        };
      }

      // Calculate total score
      pageResults.score = Object.values(pageResults.tests).reduce((sum, test) => sum + test.score, 0);
      pageResults.maxScore = Object.values(pageResults.tests).reduce((sum, test) => sum + test.maxScore, 0);

    } catch (error) {
      console.error(`❌ Error testing ${url}:`, error.message);
      pageResults.error = error.message;
    }

    return pageResults;
  }

  /**
   * Test all configured pages
   */
  async testAllPages() {
    console.log('🧪 Starting SEO Tests');
    console.log('='.repeat(50));

    // Check if server is running
    const serverRunning = await this.checkServerRunning();
    if (!serverRunning) {
      console.error('❌ Development server not running at http://localhost:5173');
      console.log('Please start the server with: npm run dev');
      process.exit(1);
    }

    console.log('✅ Development server is running');
    console.log('');

    // Test each page
    for (const page of PAGES_TO_TEST) {
      const result = await this.testPage(page.path);
      this.results[page.name] = result;
      
      // Display results for this page
      console.log(`📄 ${page.name} (${page.path})`);
      console.log('-'.repeat(30));
      
      if (result.error) {
        console.log(`❌ Error: ${result.error}`);
      } else {
        Object.entries(result.tests).forEach(([testName, test]) => {
          const status = test.pass ? '✅' : '❌';
          console.log(`   ${status} ${testName}: ${test.message}`);
        });
        
        const percentage = result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0;
        console.log(`   📊 Score: ${result.score}/${result.maxScore} (${percentage}%)`);
      }
      
      console.log('');
    }

    // Overall summary
    this.generateSummary();
  }

  /**
   * Generate test summary
   */
  generateSummary() {
    console.log('📊 SEO TEST SUMMARY');
    console.log('='.repeat(50));

    const allTests = Object.values(this.results).filter(r => !r.error);
    const totalScore = allTests.reduce((sum, result) => sum + result.score, 0);
    const maxTotalScore = allTests.reduce((sum, result) => sum + result.maxScore, 0);
    
    if (maxTotalScore > 0) {
      const overallPercentage = Math.round((totalScore / maxTotalScore) * 100);
      
      console.log(`Overall Score: ${totalScore}/${maxTotalScore} (${overallPercentage}%)`);
      
      if (overallPercentage >= 90) {
        console.log('🎉 Excellent! SEO score meets target (≥90%)');
      } else if (overallPercentage >= 70) {
        console.log('⚠️ Good, but room for improvement (target: ≥90%)');
      } else {
        console.log('❌ SEO score below target. Review implementation.');
      }
    } else {
      console.log('❌ No successful tests to summarize');
    }

    // Individual page results
    console.log('\nPage Scores:');
    Object.entries(this.results).forEach(([pageName, result]) => {
      if (!result.error && result.maxScore > 0) {
        const percentage = Math.round((result.score / result.maxScore) * 100);
        const status = percentage >= 90 ? '✅' : percentage >= 70 ? '⚠️' : '❌';
        console.log(`  ${status} ${pageName}: ${percentage}%`);
      }
    });

    // Recommendations
    console.log('\n💡 Recommendations:');
    console.log('- Install Lighthouse CLI for detailed audits: npm install -g lighthouse');
    console.log('- Run full Lighthouse audit: npm run seo:audit');
    console.log('- Test meta tags with browser dev tools');
    console.log('- Validate structured data: https://search.google.com/test/rich-results');
    
    console.log('\n⚡ Quick Commands:');
    console.log('- Generate sitemap/robots: npm run seo:generate');
    console.log('- Full Lighthouse audit: npm run seo:audit');
    console.log('- Install dependencies: npm install react-helmet-async');
  }
}

/**
 * Main function
 */
async function main() {
  const tester = new SEOTester();
  await tester.testAllPages();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ SEO testing failed:', error);
    process.exit(1);
  });
}

export { SEOTester, main };