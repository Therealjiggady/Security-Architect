/**
 * Accessibility testing utilities for localhost development
 * Provides automated testing for WCAG compliance
 */

export class AccessibilityTester {
  constructor() {
    this.isLocalhost = window.location.hostname === 'localhost';
    this.violations = [];
    this.testResults = {};
  }

  async runAxeAudit() {
    if (!this.isLocalhost) {
      console.log('♿ Accessibility audit available in development mode only');
      return null;
    }

    try {
      // Load axe-core if not available
      if (typeof window.axe === 'undefined') {
        console.log('📦 Loading axe-core for accessibility testing...');
        await this.loadAxeCore();
      }

      console.log('🔍 Running axe accessibility audit...');
      
      const results = await window.axe.run();
      
      this.violations = results.violations;
      this.displayAxeResults(results);
      
      return results;
      
    } catch (error) {
      console.error('❌ Accessibility audit failed:', error);
      return null;
    }
  }

  async loadAxeCore() {
    return new Promise((resolve, reject) => {
      if (window.axe) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js';
      script.onload = () => {
        console.log('✅ axe-core loaded successfully');
        resolve();
      };
      script.onerror = () => {
        console.error('❌ Failed to load axe-core');
        reject(new Error('Failed to load axe-core'));
      };
      document.head.appendChild(script);
    });
  }

  displayAxeResults(results) {
    console.group('♿ axe Accessibility Audit Results');
    
    // Summary
    const summary = {
      violations: results.violations.length,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      inapplicable: results.inapplicable.length
    };
    
    console.log('📊 Summary:', summary);
    
    // Violations by impact level
    const violationsByImpact = results.violations.reduce((acc, violation) => {
      const impact = violation.impact || 'unknown';
      acc[impact] = (acc[impact] || 0) + 1;
      return acc;
    }, {});
    
    if (Object.keys(violationsByImpact).length > 0) {
      console.log('🎯 Violations by impact:', violationsByImpact);
    }
    
    // Detailed violations
    if (results.violations.length > 0) {
      console.group('🔴 Violations (need fixing)');
      results.violations.forEach((violation, index) => {
        console.group(`${index + 1}. ${violation.id} (${violation.impact} impact)`);
        console.log('📝 Description:', violation.description);
        console.log('🔗 Learn more:', violation.helpUrl);
        console.log('🎯 Elements affected:', violation.nodes.length);
        
        violation.nodes.forEach((node, nodeIndex) => {
          console.log(`   ${nodeIndex + 1}. Target: ${node.target[0]}`);
          console.log(`      Issue: ${node.failureSummary}`);
          if (node.element) {
            console.log('      Element:', node.element);
          }
        });
        console.groupEnd();
      });
      console.groupEnd();
      
      // Show quick fix suggestions
      this.showQuickFixes(results.violations);
    } else {
      console.log('🎉 No accessibility violations found! Great job!');
    }
    
    console.groupEnd();
    
    // Create visual report for easy viewing
    this.createAxeVisualReport(results);
  }

  showQuickFixes(violations) {
    console.group('💡 Quick Fix Suggestions');
    
    violations.forEach(violation => {
      switch (violation.id) {
        case 'color-contrast':
          console.log('🎨 Color Contrast: Use darker colors or add background');
          console.log('   → Check contrast ratio: https://webaim.org/resources/contrastchecker/');
          break;
        case 'image-alt':
          console.log('🖼️ Image Alt Text: Add meaningful alt="" attributes to images');
          console.log('   → Use alt="" for decorative images, descriptive text for content images');
          break;
        case 'label':
          console.log('🏷️ Form Labels: Associate labels with form controls using htmlFor/id');
          break;
        case 'button-name':
          console.log('🔘 Button Name: Add aria-label or visible text to buttons');
          break;
        case 'link-name':
          console.log('🔗 Link Name: Add meaningful text to links (avoid "click here")');
          break;
        case 'keyboard':
          console.log('⌨️ Keyboard: Ensure all interactive elements are keyboard accessible');
          break;
        default:
          console.log(`🔧 ${violation.id}: Check documentation at ${violation.helpUrl}`);
      }
    });
    
    console.groupEnd();
  }

  createAxeVisualReport(results) {
    // Remove existing report
    const existingReport = document.getElementById('axe-accessibility-report');
    if (existingReport) existingReport.remove();

    const report = document.createElement('div');
    report.id = 'axe-accessibility-report';
    
    const violationColor = results.violations.length === 0 ? '#059669' : '#DC2626';
    const violationIcon = results.violations.length === 0 ? '🎉' : '⚠️';
    
    report.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        color: #1F2937;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 600px;
        max-height: 80vh;
        overflow: auto;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        border: 1px solid #E5E7EB;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0; color: #1F2937; font-size: 20px; font-weight: bold;">
            ♿ axe Accessibility Report
          </h3>
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: #DC2626;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 12px;
            cursor: pointer;
            font-weight: bold;
          " aria-label="Close accessibility report">×</button>
        </div>
        
        <div style="
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
          gap: 16px; 
          margin-bottom: 20px;
        ">
          <div style="text-align: center; padding: 12px; background: ${violationColor}; color: white; border-radius: 8px;">
            <div style="font-size: 32px;">${violationIcon}</div>
            <div style="font-size: 24px; font-weight: bold;">${results.violations.length}</div>
            <div style="font-size: 14px;">Violations</div>
          </div>
          <div style="text-align: center; padding: 12px; background: #059669; color: white; border-radius: 8px;">
            <div style="font-size: 32px;">✅</div>
            <div style="font-size: 24px; font-weight: bold;">${results.passes.length}</div>
            <div style="font-size: 14px;">Passes</div>
          </div>
          <div style="text-align: center; padding: 12px; background: #D97706; color: white; border-radius: 8px;">
            <div style="font-size: 32px;">⏳</div>
            <div style="font-size: 24px; font-weight: bold;">${results.incomplete.length}</div>
            <div style="font-size: 14px;">Incomplete</div>
          </div>
        </div>
        
        ${results.violations.length > 0 ? `
          <div style="background: #FEF2F2; border: 1px solid #FECACA; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #DC2626; font-size: 16px;">🔴 Issues Found:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              ${results.violations.map(v => 
                `<li style="margin-bottom: 8px;">
                  <strong>${v.id}</strong> (${v.impact}) - ${v.description}
                  <br/>
                  <small style="color: #6B7280;">
                    ${v.nodes.length} element${v.nodes.length !== 1 ? 's' : ''} affected
                  </small>
                </li>`
              ).join('')}
            </ul>
          </div>
        ` : `
          <div style="background: #ECFDF5; border: 1px solid #BBF7D0; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <h4 style="margin: 0; color: #059669; font-size: 16px;">🎉 No accessibility violations found!</h4>
            <p style="margin: 8px 0 0 0; color: #047857;">Your website meets axe-core accessibility standards.</p>
          </div>
        `}
        
        <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; font-size: 14px;">
          <h4 style="margin: 0 0 12px 0; color: #374151;">📋 Next Steps:</h4>
          <ol style="margin: 0; padding-left: 20px; color: #6B7280;">
            <li>Fix any violations listed above</li>
            <li>Test keyboard navigation (Tab key)</li>
            <li>Test with screen reader (if available)</li>
            <li>Run Lighthouse accessibility audit</li>
            <li>Test with different user preferences (high contrast, reduced motion)</li>
          </ol>
        </div>
        
        <div style="margin-top: 16px; text-align: center;">
          <button onclick="window.testKeyboardNav()" style="
            background: #4F46E5;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 8px;
            font-weight: bold;
          ">Test Keyboard Navigation</button>
          <button onclick="window.auditImages()" style="
            background: #7C3AED;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
          ">Audit Images</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(report);
    
    // Auto-close after 30 seconds if no violations
    if (results.violations.length === 0) {
      setTimeout(() => {
        if (report.parentNode) {
          report.parentNode.removeChild(report);
        }
      }, 30000);
    }
  }

  testColorContrast() {
    console.log('🎨 Color Contrast Testing Guide');
    console.log('='.repeat(40));
    console.log(`
Manual Color Contrast Testing:

1. **Use Browser DevTools:**
   - Right-click any text → Inspect
   - Go to Computed tab
   - Look for "Contrast" ratio

2. **Minimum Requirements:**
   - Normal text: 4.5:1 ratio
   - Large text (18pt/24px): 3:1 ratio
   - UI components: 3:1 ratio

3. **Tools to Use:**
   - WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
   - Chrome DevTools built-in contrast checker
   - Color Oracle (color blindness simulator)

4. **Common Issues:**
   - Gray text on white background
   - Light colors on light backgrounds  
   - Insufficient button contrast
   - Link colors too similar to text

5. **Quick Fixes:**
   - Use darker shades (#374151 instead of #9CA3AF)
   - Add background colors to improve contrast
   - Use our accessibility.css for high-contrast colors
    `);
  }

  testKeyboardNavigation() {
    console.log('⌨️ Testing Keyboard Navigation...');
    
    // Find all focusable elements
    const focusableSelector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="link"]'
    ].join(', ');
    
    const focusableElements = document.querySelectorAll(focusableSelector);
    
    console.log(`Found ${focusableElements.length} keyboard-focusable elements`);
    
    // Check tab order
    const tabOrder = Array.from(focusableElements).map((el, index) => {
      const rect = el.getBoundingClientRect();
      return {
        index: index + 1,
        element: el.tagName.toLowerCase(),
        id: el.id || 'no-id',
        className: el.className || 'no-class',
        tabIndex: el.tabIndex,
        ariaLabel: el.getAttribute('aria-label') || 'none',
        text: (el.textContent || el.value || '').substring(0, 30).trim() || 'no-text',
        visible: rect.width > 0 && rect.height > 0,
        position: `${Math.round(rect.top)},${Math.round(rect.left)}`
      };
    });

    console.table(tabOrder);
    
    // Check for common issues
    const issues = [];
    
    // Check for elements without visible focus indicators
    focusableElements.forEach(el => {
      el.focus();
      const styles = window.getComputedStyle(el);
      if (styles.outline === 'none' && !styles.boxShadow.includes('outline')) {
        issues.push(`Element ${el.tagName}${el.id ? `#${el.id}` : ''} may not have visible focus indicator`);
      }
    });
    
    // Restore original focus
    if (document.body) document.body.focus();
    
    if (issues.length > 0) {
      console.warn('⚠️ Potential keyboard navigation issues:');
      issues.forEach(issue => console.warn(`   ${issue}`));
    } else {
      console.log('✅ Keyboard navigation appears to be working well');
    }
    
    return {
      totalFocusable: focusableElements.length,
      tabOrder,
      issues,
      recommendation: 'Test manually with Tab key to verify flow makes sense'
    };
  }

  auditImages() {
    console.log('🖼️ Auditing Images for Accessibility...');
    
    const images = document.querySelectorAll('img');
    console.log(`Found ${images.length} images`);
    
    const imageAudit = Array.from(images).map((img, index) => {
      const issues = [];
      
      // Check alt text
      if (!img.hasAttribute('alt')) {
        issues.push('Missing alt attribute');
      } else {
        const alt = img.alt.trim();
        if (alt === '') {
          // Empty alt is OK for decorative images
        } else if (alt.length > 125) {
          issues.push(`Alt text too long (${alt.length} chars, keep under 125)`);
        } else if (alt.toLowerCase().includes('image') || alt.toLowerCase().includes('picture')) {
          issues.push('Alt text mentions "image" (avoid redundant terms)');
        }
      }
      
      // Check for title attribute (often redundant)
      if (img.title && img.alt && img.title === img.alt) {
        issues.push('Title duplicates alt text (remove title attribute)');
      }
      
      // Check loading attribute
      if (!img.loading) {
        issues.push('Missing loading attribute (add loading="lazy")');
      }
      
      return {
        index: index + 1,
        src: img.src.split('/').pop(),
        alt: img.alt || 'MISSING',
        altLength: (img.alt || '').length,
        hasTitle: !!img.title,
        hasLoading: !!img.loading,
        issues,
        element: img
      };
    });
    
    const imagesWithIssues = imageAudit.filter(img => img.issues.length > 0);
    
    console.table(imageAudit);
    
    if (imagesWithIssues.length > 0) {
      console.warn(`⚠️ ${imagesWithIssues.length} images have accessibility issues:`);
      imagesWithIssues.forEach(img => {
        console.warn(`   ${img.src}: ${img.issues.join(', ')}`);
      });
    } else {
      console.log('✅ All images have proper accessibility attributes!');
    }
    
    return {
      totalImages: images.length,
      imagesWithIssues: imagesWithIssues.length,
      issues: imageAudit,
      passed: imagesWithIssues.length === 0
    };
  }

  testARIAImplementation() {
    console.log('🏷️ Testing ARIA Implementation...');
    
    const ariaTests = {
      'Elements with ARIA labels': document.querySelectorAll('[aria-label]').length,
      'Elements with ARIA described by': document.querySelectorAll('[aria-describedby]').length,
      'Form controls with labels': document.querySelectorAll('input[aria-labelledby], input + label, label input').length,
      'Live regions': document.querySelectorAll('[aria-live]').length,
      'Landmarks': document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], main, nav, header, footer').length,
      'Buttons with accessible names': document.querySelectorAll('button[aria-label], button:not(:empty)').length,
      'Links with accessible names': document.querySelectorAll('a[aria-label], a:not(:empty)').length
    };
    
    console.table(ariaTests);
    
    // Check for common ARIA mistakes
    const ariaIssues = [];
    
    // Empty ARIA labels
    const emptyAriaLabels = document.querySelectorAll('[aria-label=""], [aria-label=" "]');
    if (emptyAriaLabels.length > 0) {
      ariaIssues.push(`${emptyAriaLabels.length} elements have empty aria-label attributes`);
    }
    
    // Redundant ARIA labels
    const redundantLabels = Array.from(document.querySelectorAll('[aria-label]')).filter(el => {
      return el.textContent.trim() === el.getAttribute('aria-label').trim();
    });
    if (redundantLabels.length > 0) {
      ariaIssues.push(`${redundantLabels.length} elements have redundant aria-label (same as visible text)`);
    }
    
    if (ariaIssues.length > 0) {
      console.warn('⚠️ ARIA Implementation Issues:');
      ariaIssues.forEach(issue => console.warn(`   ${issue}`));
    } else {
      console.log('✅ ARIA implementation looks good!');
    }
    
    return { ariaTests, ariaIssues };
  }

  async runCompleteA11yAudit() {
    console.log('♿ Starting Complete Accessibility Audit');
    console.log('='.repeat(50));
    
    // Check server
    if (!(await this.checkServerRunning())) {
      console.error('❌ Development server not running at http://localhost:5173');
      console.log('Start with: npm run dev');
      return false;
    }
    
    console.log('✅ Development server is running\n');
    
    const results = {};
    
    // Run axe audit
    results.axe = await this.runAxeAudit();
    
    // Run keyboard navigation test
    results.keyboard = this.testKeyboardNavigation();
    
    // Run image audit
    results.images = this.auditImages();
    
    // Test ARIA implementation
    results.aria = this.testARIAImplementation();
    
    // Calculate overall score
    const scores = {
      axe: results.axe ? (results.axe.violations.length === 0 ? 100 : Math.max(50, 100 - results.axe.violations.length * 10)) : 0,
      keyboard: results.keyboard.issues.length === 0 ? 100 : 75,
      images: results.images.passed ? 100 : Math.max(0, 100 - results.images.imagesWithIssues * 20),
      aria: results.aria.ariaIssues.length === 0 ? 100 : 75
    };
    
    const overallScore = Math.round(
      (scores.axe * 0.4 + scores.keyboard * 0.2 + scores.images * 0.2 + scores.aria * 0.2)
    );
    
    // Generate summary
    console.log('\n♿ ACCESSIBILITY AUDIT SUMMARY');
    console.log('='.repeat(50));
    console.log(`Overall Accessibility Score: ${overallScore}/100`);
    console.log(`\nComponent Scores:`);
    Object.entries(scores).forEach(([component, score]) => {
      const status = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌';
      console.log(`  ${status} ${component}: ${score}/100`);
    });
    
    if (overallScore >= 90) {
      console.log('\n🎉 Excellent accessibility! Your site is ready for all users.');
    } else if (overallScore >= 70) {
      console.log('\n⚠️ Good accessibility, but improvements recommended.');
    } else {
      console.log('\n❌ Accessibility needs significant improvement before deployment.');
    }
    
    // Save results for future reference
    this.saveAuditResults({
      timestamp: new Date().toISOString(),
      overallScore,
      componentScores: scores,
      detailedResults: results
    });
    
    return overallScore >= 90;
  }

  async checkServerRunning() {
    try {
      const response = await fetch(BASE_URL);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  saveAuditResults(results) {
    // Save to sessionStorage for development
    try {
      sessionStorage.setItem('accessibility-audit-results', JSON.stringify(results));
      console.log('💾 Audit results saved to sessionStorage');
    } catch (error) {
      console.log('⚠️ Could not save audit results');
    }
  }
}

// Create global instance
const accessibilityTester = new AccessibilityTester();

// Export for use in other modules
export default AccessibilityTester;

// Global functions for browser console
window.testA11y = () => accessibilityTester.runCompleteA11yAudit();
window.testAxe = () => accessibilityTester.runAxeAudit();
window.testKeyboardNav = () => accessibilityTester.testKeyboardNavigation();
window.auditImages = () => accessibilityTester.auditImages();
window.testColorContrast = () => accessibilityTester.testColorContrast();