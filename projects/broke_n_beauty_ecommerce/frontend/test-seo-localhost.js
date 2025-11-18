#!/usr/bin/env node
/**
 * Localhost SEO Testing Script
 * Tests SEO implementation on localhost:5173
 * Run with: node test-seo-localhost.js
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

const BASE_URL = 'http://localhost:5173';
const TEST_PAGES = [
  { path: '/', name: 'Homepage', expectedTitle: 'Premium Activewear & Fitness Clothing | Broken Beauty' },
  { path: '/products', name: 'Products Page', expectedTitle: 'Shop Premium Activewear Collection | Broken Beauty' },
  { path: '/login', name: 'Login Page', expectedTitle: 'Login | Broken Beauty' },
  { path: '/register', name: 'Register Page', expectedTitle: 'Register | Broken Beauty' }
];

class LocalhostSEOTester {
  constructor() {
    this.results = {};
    this.overallScore = 0;
  }

  async checkServerRunning() {
    try {
      console.log('🔍 Checking if development server is running...');
      const response = await fetch(BASE_URL);
      if (response.ok) {
        console.log('✅ Development server is running');
        return true;
      }
    } catch (error) {
      console.error('❌ Development server is not running at http://localhost:5173');
      console.log('Please start the server with: npm run dev');
      return false;
    }
  }

  async testBasicSEORequirements() {
    console.log('\n📋 Testing Basic SEO Requirements...');
    const testResults = [];

    for (const page of TEST_PAGES) {
      try {
        const url = `${BASE_URL}${page.path}`;
        console.log(`\n🔍 Testing: ${page.name} (${page.path})`);
        
        const response = await fetch(url);
        const html = await response.text();
        
        const pageResult = {
          name: page.name,
          path: page.path,
          tests: {}
        };

        // Test 1: Page Title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const hasTitle = titleMatch && titleMatch[1].trim().length > 0;
        pageResult.tests.title = {
          pass: hasTitle,
          found: titleMatch ? titleMatch[1] : 'No title found',
          expected: page.expectedTitle || 'Any title present'
        };

        // Test 2: Meta Description
        const descriptionMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
        const hasDescription = descriptionMatch && descriptionMatch[1].length > 0;
        pageResult.tests.description = {
          pass: hasDescription,
          found: descriptionMatch ? descriptionMatch[1].substring(0, 100) + '...' : 'No description found',
          length: descriptionMatch ? descriptionMatch[1].length : 0
        };

        // Test 3: Meta Keywords
        const keywordsMatch = html.match(/<meta\s+name="keywords"\s+content="([^"]+)"/i);
        pageResult.tests.keywords = {
          pass: keywordsMatch && keywordsMatch[1].length > 0,
          found: keywordsMatch ? 'Present' : 'Not found'
        };

        // Test 4: OpenGraph Tags
        const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
        const ogDescMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
        const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
        
        pageResult.tests.openGraph = {
          pass: ogTitleMatch && ogDescMatch && ogImageMatch,
          title: ogTitleMatch ? 'Present' : 'Missing',
          description: ogDescMatch ? 'Present' : 'Missing',
          image: ogImageMatch ? 'Present' : 'Missing'
        };

        // Test 5: Structured Data (JSON-LD)
        const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>.*?<\/script>/gi);
        pageResult.tests.structuredData = {
          pass: jsonLdMatches && jsonLdMatches.length > 0,
          count: jsonLdMatches ? jsonLdMatches.length : 0
        };

        // Test 6: Canonical URL
        const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
        pageResult.tests.canonical = {
          pass: canonicalMatch && canonicalMatch[1].length > 0,
          found: canonicalMatch ? canonicalMatch[1] : 'Not found'
        };

        testResults.push(pageResult);

      } catch (error) {
        console.error(`❌ Error testing ${page.name}: ${error.message}`);
      }
    }

    return testResults;
  }

  async runLighthouseAudit() {
    console.log('\n🔬 Running Lighthouse SEO Audit...');
    
    try {
      // Check if lighthouse is installed
      await execAsync('lighthouse --version');
      console.log('✅ Lighthouse CLI available');
      
      const { stdout } = await execAsync(
        `lighthouse ${BASE_URL} --only-categories=seo --output=json --quiet --chrome-flags="--headless --no-sandbox"`
      );
      
      const results = JSON.parse(stdout);
      const seoCategory = results.categories.seo;
      const seoScore = Math.round(seoCategory.score * 100);
      
      console.log(`\n📊 Lighthouse SEO Results:`);
      console.log(`Overall SEO Score: ${seoScore}/100`);
      
      // Individual audit results
      const audits = results.audits;
      const seoAudits = [
        'document-title',
        'meta-description', 
        'image-alt',
        'canonical',
        'structured-data'
      ];
      
      console.log('\nDetailed Results:');
      seoAudits.forEach(auditId => {
        if (audits[auditId]) {
          const audit = audits[auditId];
          const status = audit.score === 1 ? '✅' : audit.score === 0 ? '❌' : '⚠️';
          console.log(`  ${status} ${audit.title}`);
          if (audit.description) {
            console.log(`     ${audit.description}`);
          }
        }
      });

      return {
        score: seoScore,
        passed: seoScore >= 90,
        details: audits
      };

    } catch (error) {
      if (error.message.includes('lighthouse: command not found')) {
        console.log('⚠️ Lighthouse CLI not installed');
        console.log('Install with: npm install -g lighthouse');
        return {
          score: 0,
          passed: false,
          error: 'Lighthouse not available'
        };
      } else {
        console.error('❌ Lighthouse audit failed:', error.message);
        return {
          score: 0,
          passed: false,
          error: error.message
        };
      }
    }
  }

  async testStaticFiles() {
    console.log('\n📁 Testing Static SEO Files...');
    
    const files = [
      { name: 'robots.txt', path: 'frontend/public/robots.txt' },
      { name: 'sitemap.xml', path: 'frontend/public/sitemap.xml' }
    ];

    const fileResults = {};

    for (const file of files) {
      try {
        if (fs.existsSync(file.path)) {
          const content = fs.readFileSync(file.path, 'utf8');
          fileResults[file.name] = {
            exists: true,
            size: content.length,
            preview: content.substring(0, 200) + (content.length > 200 ? '...' : '')
          };
          console.log(`✅ ${file.name}: Found (${content.length} bytes)`);
        } else {
          fileResults[file.name] = {
            exists: false
          };
          console.log(`❌ ${file.name}: Not found`);
        }
      } catch (error) {
        console.log(`❌ ${file.name}: Error reading file`);
        fileResults[file.name] = {
          exists: false,
          error: error.message
        };
      }
    }

    return fileResults;
  }

  calculateOverallScore(pageResults, lighthouseResult, fileResults) {
    let totalScore = 0;
    let maxScore = 0;

    // Page SEO tests (60% weight)
    pageResults.forEach(page => {
      const pageScore = Object.values(page.tests).reduce((sum, test) => {
        return sum + (test.pass ? 1 : 0);
      }, 0);
      const pageMaxScore = Object.keys(page.tests).length;
      
      totalScore += pageScore * 10; // 10 points per test
      maxScore += pageMaxScore * 10;
    });

    // Lighthouse score (30% weight)
    if (lighthouseResult.score) {
      totalScore += lighthouseResult.score * 0.3;
      maxScore += 100 * 0.3;
    }

    // Static files (10% weight)
    const fileScore = Object.values(fileResults).reduce((sum, file) => {
      return sum + (file.exists ? 1 : 0);
    }, 0);
    totalScore += fileScore * 5;
    maxScore += Object.keys(fileResults).length * 5;

    return Math.round((totalScore / maxScore) * 100);
  }

  async runCompleteTest() {
    console.log('🧪 Starting Complete SEO Test Suite');
    console.log('='.repeat(50));

    // Check server
    const serverRunning = await this.checkServerRunning();
    if (!serverRunning) {
      process.exit(1);
    }

    // Run all tests
    const pageResults = await this.testBasicSEORequirements();
    const lighthouseResult = await this.runLighthouseAudit();
    const fileResults = await this.testStaticFiles();

    // Calculate overall score
    this.overallScore = this.calculateOverallScore(pageResults, lighthouseResult, fileResults);

    // Generate summary
    this.generateSummary(pageResults, lighthouseResult, fileResults);

    // Save results
    this.saveResults({
      timestamp: new Date().toISOString(),
      overallScore: this.overallScore,
      pageResults,
      lighthouseResult,
      fileResults
    });

    return this.overallScore >= 90;
  }

  generateSummary(pageResults, lighthouseResult, fileResults) {
    console.log('\n📊 SEO TEST SUMMARY');
    console.log('='.repeat(50));
    
    console.log(`Overall SEO Score: ${this.overallScore}/100`);
    
    if (this.overallScore >= 90) {
      console.log('🎉 Excellent! SEO implementation meets target');
    } else if (this.overallScore >= 70) {
      console.log('⚠️ Good, but room for improvement');
    } else {
      console.log('❌ SEO needs significant improvement');
    }

    console.log('\nPage-by-Page Results:');
    pageResults.forEach(page => {
      const passedTests = Object.values(page.tests).filter(t => t.pass).length;
      const totalTests = Object.keys(page.tests).length;
      const pageScore = Math.round((passedTests / totalTests) * 100);
      const status = pageScore >= 80 ? '✅' : pageScore >= 60 ? '⚠️' : '❌';
      
      console.log(`  ${status} ${page.name}: ${passedTests}/${totalTests} tests passed (${pageScore}%)`);
    });

    if (lighthouseResult.score !== undefined) {
      const status = lighthouseResult.score >= 90 ? '✅' : lighthouseResult.score >= 70 ? '⚠️' : '❌';
      console.log(`  ${status} Lighthouse Score: ${lighthouseResult.score}/100`);
    }

    console.log('\nStatic Files:');
    Object.entries(fileResults).forEach(([fileName, result]) => {
      const status = result.exists ? '✅' : '❌';
      console.log(`  ${status} ${fileName}: ${result.exists ? 'Present' : 'Missing'}`);
    });

    console.log('\n🔧 Next Steps:');
    if (this.overallScore < 90) {
      console.log('- Install dependencies: npm install react-helmet-async');
      console.log('- Fix missing meta tags on individual pages');
      console.log('- Add structured data to product pages');
      console.log('- Optimize image alt text');
    }
    console.log('- Run full Lighthouse audit: npm run seo:audit');
    console.log('- Generate fresh SEO files: npm run seo:generate');
  }

  saveResults(results) {
    try {
      const resultsPath = 'seo-test-results.json';
      fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
      console.log(`\n💾 Results saved to: ${resultsPath}`);
    } catch (error) {
      console.log('⚠️ Could not save results file');
    }
  }
}

/**
 * Main execution
 */
async function main() {
  const tester = new LocalhostSEOTester();
  
  try {
    const success = await tester.runCompleteTest();
    
    console.log('\n' + '='.repeat(50));
    if (success) {
      console.log('🎉 SEO test completed successfully!');
      process.exit(0);
    } else {
      console.log('⚠️ SEO improvements needed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ SEO testing failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}