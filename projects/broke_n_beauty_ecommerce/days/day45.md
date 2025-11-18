# Day 45: Accessibility & UX Audit

## Overview
Comprehensive accessibility audit and UX improvements for the Broken Beauty e-commerce platform, focusing on localhost testing and WCAG compliance.

**Objective:** Ensure the website is accessible to all users, including those with disabilities, while maintaining excellent user experience.

## Accessibility Implementation Strategy

### Localhost vs Production Accessibility
```yaml
Can Do on Localhost:
  - axe DevTools accessibility scanning ✅
  - Lighthouse accessibility audits ✅
  - Color contrast testing ✅
  - ARIA labels implementation ✅
  - Keyboard navigation testing ✅
  - Focus states enhancement ✅
  - Alt text implementation ✅
  - Skip-to-content links ✅

No Difference for Production:
  - All accessibility features work identically ✅
  - Screen reader testing ✅
  - Keyboard-only navigation ✅
```

## WCAG 2.1 Compliance Checklist

### Level A Compliance (Basic) ✅
- [ ] Images have appropriate alt text
- [ ] Page has proper heading structure (h1, h2, h3)
- [ ] Links have meaningful text
- [ ] Forms have labels
- [ ] Content is keyboard accessible
- [ ] Page has a title
- [ ] Language is identified

### Level AA Compliance (Standard) ✅  
- [ ] Color contrast ratio ≥ 4.5:1 (normal text)
- [ ] Color contrast ratio ≥ 3:1 (large text)
- [ ] Text can be resized to 200% without horizontal scrolling
- [ ] Focus indicators are clearly visible
- [ ] Error messages are clearly identified
- [ ] Form labels are properly associated
- [ ] Headings describe content

### Level AAA Compliance (Enhanced) ⭐
- [ ] Color contrast ratio ≥ 7:1 (normal text)
- [ ] Color contrast ratio ≥ 4.5:1 (large text)  
- [ ] No content flashes more than 3 times per second
- [ ] Users can pause auto-playing content
- [ ] Help text available for forms

## Accessibility Testing Tools Setup

### 1. axe DevTools Integration
```javascript
// frontend/src/utils/accessibilityTest.js
/**
 * Accessibility testing utilities for localhost development
 */

export class AccessibilityTester {
  constructor() {
    this.isLocalhost = window.location.hostname === 'localhost';
    this.violations = [];
  }

  async runAxeAudit() {
    if (!this.isLocalhost) {
      console.log('Accessibility audit available in development mode only');
      return;
    }

    try {
      // Check if axe-core is available
      if (typeof axe === 'undefined') {
        console.log('Installing axe-core for accessibility testing...');
        await this.loadAxeCore();
      }

      console.log('🔍 Running axe accessibility audit...');
      
      const results = await axe.run();
      
      this.violations = results.violations;
      this.displayResults(results);
      
      return results;
      
    } catch (error) {
      console.error('Accessibility audit failed:', error);
      return null;
    }
  }

  async loadAxeCore() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  displayResults(results) {
    console.group('♿ Accessibility Audit Results');
    
    // Summary
    console.log(`Total violations: ${results.violations.length}`);
    console.log(`Passes: ${results.passes.length}`);
    console.log(`Incomplete: ${results.incomplete.length}`);
    
    // Violations by impact
    const violationsByImpact = results.violations.reduce((acc, violation) => {
      acc[violation.impact] = (acc[violation.impact] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Violations by impact:', violationsByImpact);
    
    // Detailed violations
    if (results.violations.length > 0) {
      console.group('🔴 Violations Details');
      results.violations.forEach((violation, index) => {
        console.group(`${index + 1}. ${violation.id} (${violation.impact})`);
        console.log('Description:', violation.description);
        console.log('Help:', violation.helpUrl);
        console.log('Elements affected:', violation.nodes.length);
        violation.nodes.forEach((node, nodeIndex) => {
          console.log(`  ${nodeIndex + 1}. ${node.target[0]}`);
          console.log(`     ${node.failureSummary}`);
        });
        console.groupEnd();
      });
      console.groupEnd();
    } else {
      console.log('🎉 No accessibility violations found!');
    }
    
    console.groupEnd();
    
    // Create visual report
    this.createVisualReport(results);
  }

  createVisualReport(results) {
    // Remove existing report
    const existingReport = document.getElementById('accessibility-report');
    if (existingReport) existingReport.remove();

    const report = document.createElement('div');
    report.id = 'accessibility-report';
    report.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        color: black;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 500px;
        max-height: 600px;
        overflow: auto;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="margin: 0; color: #333;">♿ Accessibility Audit</h3>
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
          ">Close</button>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="display: flex; gap: 15px;">
            <div style="text-align: center;">
              <div style="font-size: 24px; color: ${results.violations.length === 0 ? '#28a745' : '#dc3545'};">
                ${results.violations.length}
              </div>
              <div style="font-size: 12px;">Violations</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 24px; color: #28a745;">
                ${results.passes.length}
              </div>
              <div style="font-size: 12px;">Passes</div>
            </div>
          </div>
        </div>
        
        ${results.violations.length > 0 ? `
          <div style="background: #f8d7da; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
            <strong>Issues Found:</strong><br/>
            ${results.violations.map(v => `• ${v.id} (${v.impact})`).join('<br/>')}
          </div>
        ` : `
          <div style="background: #d4edda; padding: 10px; border-radius: 4px;">
            🎉 No accessibility violations found!
          </div>
        `}
        
        <div style="margin-top: 15px; font-size: 12px; color: #666;">
          <strong>Next Steps:</strong><br/>
          1. Fix violations listed above<br/>
          2. Test keyboard navigation<br/>
          3. Verify screen reader compatibility<br/>
          4. Run Lighthouse accessibility audit
        </div>
      </div>
    `;
    
    document.body.appendChild(report);
  }

  // Test specific accessibility features
  testKeyboardNavigation() {
    console.log('⌨️ Testing keyboard navigation...');
    
    // Find all interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [tabindex], [role="button"], [role="link"]'
    );
    
    console.log(`Found ${interactiveElements.length} interactive elements`);
    
    // Check if they're keyboard accessible
    const elementsWithoutTabIndex = Array.from(interactiveElements).filter(el => {
      return el.tabIndex < 0 && !el.hasAttribute('tabindex');
    });
    
    if (elementsWithoutTabIndex.length > 0) {
      console.warn(`⚠️ ${elementsWithoutTabIndex.length} elements may not be keyboard accessible`);
      console.log('Elements:', elementsWithoutTabIndex);
    } else {
      console.log('✅ All interactive elements appear keyboard accessible');
    }
    
    return {
      totalInteractive: interactiveElements.length,
      potentialIssues: elementsWithoutTabIndex.length,
      elements: Array.from(interactiveElements).map(el => ({
        tag: el.tagName,
        id: el.id,
        className: el.className,
        tabIndex: el.tabIndex
      }))
    };
  }

  testColorContrast() {
    console.log('🎨 Testing color contrast...');
    
    // This would require a color contrast library
    // For now, we'll provide manual testing guidance
    console.log(`
Manual Color Contrast Testing:
1. Use browser dev tools color picker
2. Check foreground vs background colors
3. Minimum ratios:
   - Normal text: 4.5:1
   - Large text (18pt/24px): 3:1
   - UI components: 3:1

Tools to use:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools: Inspect element → Computed → Color contrast
- axe DevTools browser extension
    `);
  }

  generateA11yReport() {
    const keyboardTest = this.testKeyboardNavigation();
    
    return {
      violations: this.violations,
      keyboardAccessibility: keyboardTest,
      testDate: new Date().toISOString(),
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.violations.length > 0) {
      recommendations.push('Fix axe-core violations');
      
      // Specific recommendations based on violation types
      const violationTypes = this.violations.map(v => v.id);
      
      if (violationTypes.includes('color-contrast')) {
        recommendations.push('Improve color contrast ratios');
      }
      
      if (violationTypes.includes('label')) {
        recommendations.push('Add proper labels to form elements');
      }
      
      if (violationTypes.includes('keyboard')) {
        recommendations.push('Fix keyboard accessibility issues');
      }
    }
    
    return recommendations;
  }
}

// Global accessibility tester for localhost
window.a11yTest = new AccessibilityTester();

// Quick test function
window.testAccessibility = () => {
  return window.a11yTest.runAxeAudit();
};

export default AccessibilityTester;
```

## Color Contrast Fixes

### 1. Enhanced CSS for Better Contrast
```css
/* frontend/src/accessibility.css */
/* Accessibility improvements for better contrast and usability */

/* High contrast focus states */
*:focus {
  outline: 3px solid #4F46E5 !important;
  outline-offset: 2px !important;
}

*:focus:not(:focus-visible) {
  outline: none;
}

*:focus-visible {
  outline: 3px solid #4F46E5 !important;
  outline-offset: 2px !important;
}

/* Enhanced button contrast */
.btn-primary {
  background-color: #1D4ED8 !important; /* Higher contrast blue */
  color: white !important;
}

.btn-primary:hover {
  background-color: #1E40AF !important;
}

.btn-primary:focus {
  background-color: #1E40AF !important;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.3) !important;
}

/* Enhanced secondary button contrast */
.btn-secondary {
  background-color: #374151 !important; /* Darker gray */
  color: white !important;
}

.btn-secondary:hover {
  background-color: #1F2937 !important;
}

/* Link contrast improvements */
a {
  color: #1D4ED8 !important; /* High contrast blue */
}

a:hover {
  color: #1E40AF !important;
  text-decoration: underline !important;
}

a:visited {
  color: #7C3AED !important; /* High contrast purple */
}

/* Text contrast improvements */
.text-muted-foreground {
  color: #4B5563 !important; /* Higher contrast gray */
}

.text-secondary {
  color: #374151 !important; /* Darker gray */
}

/* Form input contrast */
input, select, textarea {
  border: 2px solid #D1D5DB !important;
  background-color: white !important;
  color: #1F2937 !important;
}

input:focus, select:focus, textarea:focus {
  border-color: #4F46E5 !important;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2) !important;
}

/* Error states */
.error {
  color: #DC2626 !important; /* High contrast red */
  border-color: #DC2626 !important;
}

/* Success states */
.success {
  color: #059669 !important; /* High contrast green */
  border-color: #059669 !important;
}

/* Skip to content link */
.skip-to-content {
  position: absolute;
  top: -100px;
  left: 0;
  background: #1D4ED8;
  color: white;
  padding: 10px 15px;
  text-decoration: none;
  font-weight: bold;
  z-index: 10000;
  transition: top 0.3s ease;
}

.skip-to-content:focus {
  top: 0;
}

/* Ensure interactive elements have minimum size (44px) */
button, a, input[type="submit"], input[type="button"] {
  min-height: 44px !important;
  min-width: 44px !important;
  padding: 8px 12px !important;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  * {
    border-color: currentColor !important;
  }
  
  .btn-primary {
    background-color: #000080 !important;
    border: 2px solid #000080 !important;
  }
  
  .btn-secondary {
    background-color: #000000 !important;
    border: 2px solid #000000 !important;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus trap for modals */
.focus-trap {
  position: relative;
}

.focus-trap::before,
.focus-trap::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
```

### 2. Skip-to-Content Implementation
```javascript
// frontend/src/components/Accessibility/SkipToContent.jsx
export const SkipToContent = () => {
  return (
    <a 
      href="#main-content" 
      className="skip-to-content"
      style={{
        position: 'absolute',
        top: '-100px',
        left: '0',
        background: '#1D4ED8',
        color: 'white',
        padding: '10px 15px',
        textDecoration: 'none',
        fontWeight: 'bold',
        zIndex: 10000,
        transition: 'top 0.3s ease'
      }}
      onFocus={(e) => {
        e.target.style.top = '0';
      }}
      onBlur={(e) => {
        e.target.style.top = '-100px';
      }}
    >
      Skip to main content
    </a>
  );
};
```

### 3. ARIA Labels Enhancement
```javascript
// frontend/src/components/Accessibility/ARIAEnhanced.jsx
import React from 'react';

// Enhanced Button with ARIA
export const AccessibleButton = ({ 
  children, 
  onClick, 
  ariaLabel, 
  ariaDescribedBy,
  isLoading = false,
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || children}
      aria-describedby={ariaDescribedBy}
      aria-busy={isLoading}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="sr-only">Loading...</span>
          <span aria-hidden="true">⏳</span>
        </>
      ) : children}
    </button>
  );
};

// Enhanced Form Input with ARIA
export const AccessibleInput = ({ 
  label, 
  error, 
  helpText, 
  required = false,
  ...props 
}) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helpId = helpText ? `${inputId}-help` : undefined;

  return (
    <div className="form-group">
      <label 
        htmlFor={inputId}
        className="form-label"
        style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}
      >
        {label}
        {required && <span aria-label="required" style={{ color: '#DC2626' }}>*</span>}
      </label>
      
      <input
        id={inputId}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      
      {helpText && (
        <div id={helpId} className="help-text" style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
          {helpText}
        </div>
      )}
      
      {error && (
        <div 
          id={errorId} 
          role="alert" 
          className="error-text"
          style={{ fontSize: '14px', color: '#DC2626', marginTop: '4px' }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

// Enhanced Product Card with ARIA
export const AccessibleProductCard = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <article 
      className="product-card"
      role="article"
      aria-labelledby={`product-title-${product.id}`}
    >
      <div className="product-image">
        <img 
          src={product.image_url} 
          alt={`${product.name} - Premium activewear product image`}
          role="img"
        />
      </div>
      
      <div className="product-info">
        <h3 id={`product-title-${product.id}`}>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-price" aria-label={`Price: $${product.price}`}>
          <span aria-hidden="true">${product.price}</span>
          <span className="sr-only">Price: ${product.price} dollars</span>
        </div>
        
        <div className="product-actions">
          <AccessibleButton
            onClick={() => onAddToCart(product)}
            ariaLabel={`Add ${product.name} to cart`}
            className="btn-primary"
          >
            Add to Cart
          </AccessibleButton>
          
          <AccessibleButton
            onClick={() => onViewDetails(product)}
            ariaLabel={`View details for ${product.name}`}
            className="btn-secondary"
          >
            View Details
          </AccessibleButton>
        </div>
      </div>
    </article>
  );
};

// Screen Reader Only Text
export const ScreenReaderOnly = ({ children }) => (
  <span className="sr-only" style={{
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0
  }}>
    {children}
  </span>
);

export default {
  AccessibleButton,
  AccessibleInput, 
  AccessibleProductCard,
  ScreenReaderOnly
};
```

## Focus State Enhancement

### Enhanced Focus Styles
```css
/* frontend/src/focus-styles.css */

/* Global focus improvements */
:root {
  --focus-color: #4F46E5;
  --focus-width: 3px;
  --focus-offset: 2px;
}

/* Remove default focus styles */
*:focus {
  outline: none;
}

/* Custom focus styles */
*:focus-visible {
  outline: var(--focus-width) solid var(--focus-color);
  outline-offset: var(--focus-offset);
  border-radius: 2px;
}

/* Button focus styles */
button:focus-visible {
  outline: var(--focus-width) solid var(--focus-color);
  outline-offset: var(--focus-offset);
  box-shadow: 0 0 0 1px var(--focus-color);
}

/* Link focus styles */
a:focus-visible {
  outline: var(--focus-width) solid var(--focus-color);
  outline-offset: var(--focus-offset);
  background-color: rgba(79, 70, 229, 0.1);
  border-radius: 2px;
}

/* Input focus styles */
input:focus,
select:focus,
textarea:focus {
  outline: var(--focus-width) solid var(--focus-color);
  outline-offset: 1px;
  border-color: var(--focus-color);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

/* Card/container focus styles */
.card:focus-within {
  box-shadow: 0 0 0 2px var(--focus-color);
  border-radius: 8px;
}

/* Navigation menu focus */
.nav-item:focus-visible {
  background-color: rgba(79, 70, 229, 0.1);
  outline: var(--focus-width) solid var(--focus-color);
  outline-offset: -2px;
}

/* Modal/dialog focus trap */
.modal {
  focus-trap: auto;
}

/* Skip link focus */
.skip-to-content:focus {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  outline: var(--focus-width) solid white;
  outline-offset: -2px;
}

/* High contrast mode enhancements */
@media (prefers-contrast: high) {
  *:focus-visible {
    outline-color: highlight;
    outline-width: 4px;
  }
  
  button:focus-visible {
    outline-color: highlight;
    box-shadow: 0 0 0 2px highlight;
  }
}

/* Reduce motion for focus transitions */
@media (prefers-reduced-motion: reduce) {
  *:focus-visible {
    transition: none !important;
  }
}
```

## Image Alt Text Audit

### Image Accessibility Enhancement
```javascript
// frontend/src/utils/imageAudit.js
export class ImageAccessibilityAuditor {
  constructor() {
    this.images = [];
    this.issues = [];
  }

  auditAllImages() {
    const allImages = document.querySelectorAll('img');
    
    console.log(`🖼️ Auditing ${allImages.length} images for accessibility`);
    
    this.images = Array.from(allImages).map(img => {
      const issues = [];
      
      // Check for alt text
      if (!img.alt) {
        issues.push('Missing alt attribute');
      } else if (img.alt.trim() === '') {
        issues.push('Empty alt text (should be null for decorative images or descriptive for content images)');
      } else if (img.alt.length > 125) {
        issues.push(`Alt text too long (${img.alt.length} chars, recommended < 125)`);
      }
      
      // Check for title attribute (often redundant)
      if (img.title && img.title === img.alt) {
        issues.push('Title attribute duplicates alt text (remove title)');
      }
      
      // Check for loading attribute
      if (!img.loading) {
        issues.push('Missing loading attribute (add loading="lazy" for performance)');
      }
      
      return {
        src: img.src,
        alt: img.alt,
        title: img.title,
        loading: img.loading,
        issues,
        element: img
      };
    });
    
    // Generate report
    this.generateImageReport();
    
    return this.images;
  }

  generateImageReport() {
    const imagesWithIssues = this.images.filter(img => img.issues.length > 0);
    
    console.group('🖼️ Image Accessibility Report');
    console.log(`Total images: ${this.images.length}`);
    console.log(`Images with issues: ${imagesWithIssues.length}`);
    
    if (imagesWithIssues.length > 0) {
      console.group('Issues found:');
      imagesWithIssues.forEach((img, index) => {
        console.group(`${index + 1}. ${img.src.split('/').pop()}`);
        console.log('Alt text:', img.alt || 'MISSING');
        console.log('Issues:', img.issues);
        console.groupEnd();
      });
      console.groupEnd();
    } else {
      console.log('🎉 All images have proper alt text!');
    }
    
    console.groupEnd();

    // Provide fix suggestions
    this.suggestFixes(imagesWithIssues);
  }

  suggestFixes(imagesWithIssues) {
    if (imagesWithIssues.length === 0) return;

    console.group('💡 Suggested Fixes');
    
    imagesWithIssues.forEach((img, index) => {
      console.log(`${index + 1}. ${img.src.split('/').pop()}:`);
      
      img.issues.forEach(issue => {
        if (issue.includes('Missing alt')) {
          console.log('   → Add alt="descriptive text" or alt="" for decorative images');
        }
        if (issue.includes('Empty alt text')) {
          console.log('   → Use alt="" for decorative images or add description for content images');
        }
        if (issue.includes('too long')) {
          console.log('   → Shorten alt text to < 125 characters, move detailed description to caption');
        }
        if (issue.includes('loading attribute')) {
          console.log('   → Add loading="lazy" for better performance');
        }
      });
    });
    
    console.groupEnd();
  }

  // Automated alt text suggestions for e-commerce
  suggestAltText(product) {
    const baseName = product.name || 'Product';
    const category = product.category || 'activewear';
    const color = product.color ? ` in ${product.color}` : '';
    
    return `${baseName}${color} - ${category} product image showing style and fit`;
  }
}

// Global image audit function
window.auditImages = () => {
  const auditor = new ImageAccessibilityAuditor();
  return auditor.auditAllImages();
};
```

## Keyboard Navigation Implementation

### 1. Focus Management System
```javascript
// frontend/src/utils/focusManagement.js
export class FocusManager {
  constructor() {
    this.focusStack = [];
    this.trapStack = [];
  }

  // Save current focus to return to later
  saveFocus() {
    const activeElement = document.activeElement;
    this.focusStack.push(activeElement);
  }

  // Restore previously saved focus
  restoreFocus() {
    const lastFocus = this.focusStack.pop();
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  // Trap focus within a container (for modals)
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab (backward)
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab (forward)
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    this.trapStack.push({ container, handler: handleTabKey });

    // Focus the first element
    firstElement.focus();
  }

  // Release focus trap
  releaseFocus() {
    const trapped = this.trapStack.pop();
    if (trapped) {
      trapped.container.removeEventListener('keydown', trapped.handler);
    }
  }

  // Test keyboard navigation
  testKeyboardNav() {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    console.log(`⌨️ Found ${focusableElements.length} keyboard-focusable elements`);

    // Test tab order
    const tabOrder = Array.from(focusableElements).map((el, index) => ({
      index,
      element: el.tagName,
      id: el.id,
      class: el.className,
      tabIndex: el.tabIndex,
      ariaLabel: el.getAttribute('aria-label'),
      text: el.textContent?.substring(0, 30) || ''
    }));

    console.table(tabOrder);
    
    return tabOrder;
  }
}

export const focusManager = new FocusManager();

// Global testing function
window.testKeyboardNav = () => focusManager.testKeyboardNav();
```

### 2. Enhanced Modal with Focus Trap
```javascript
// frontend/src/components/Accessibility/AccessibleModal.jsx
import { useEffect, useRef } from 'react';
import { focusManager } from '../../utils/focusManagement';

export const AccessibleModal = ({ 
  isOpen, 
  onClose, 
  title,
  children 
}) => {
  const modalRef = useRef();
  const closeButtonRef = useRef();

  useEffect(() => {
    if (isOpen) {
      // Save current focus
      focusManager.saveFocus();
      
      // Trap focus in modal
      if (modalRef.current) {
        focusManager.trapFocus(modalRef.current);
      }

      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        focusManager.releaseFocus();
        focusManager.restoreFocus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        ref={modalRef}
        className="modal-content"
        role="document"
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
      >
        <header className="modal-header">
          {title && (
            <h2 id="modal-title" className="modal-title">
              {title}
            </h2>
          )}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close modal"
            className="modal-close"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </header>
        
        <main className="modal-body">
          {children}
        </main>
      </div>
    </div>
  );
};
```

## Localhost Accessibility Testing

### 1. Automated Testing Script
```javascript
// frontend/test-accessibility-localhost.js
#!/usr/bin/env node
/**
 * Accessibility testing for localhost development
 * Tests WCAG compliance and generates report
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const BASE_URL = 'http://localhost:5173';

class AccessibilityAuditor {
  constructor() {
    this.testResults = {};
  }

  async checkServerRunning() {
    try {
      const response = await fetch(BASE_URL);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async runLighthouseA11yAudit() {
    console.log('♿ Running Lighthouse Accessibility Audit...');
    
    try {
      const { stdout } = await execAsync(
        `lighthouse ${BASE_URL} --only-categories=accessibility --output=json --quiet --chrome-flags="--headless --no-sandbox"`
      );
      
      const results = JSON.parse(stdout);
      const a11yScore = Math.round(results.categories.accessibility.score * 100);
      
      console.log(`\nLighthouse Accessibility Score: ${a11yScore}/100`);
      
      // Detailed audit results
      const audits = results.audits;
      const a11yAudits = [
        'color-contrast',
        'image-alt',
        'label',
        'link-name',
        'button-name',
        'aria-allowed-attr',
        'aria-required-children',
        'keyboard',
        'focusable-controls',
        'focus-traps'
      ];
      
      console.log('\nDetailed Accessibility Results:');
      a11yAudits.forEach(auditId => {
        if (audits[auditId]) {
          const audit = audits[auditId];
          const status = audit.score === 1 ? '✅' : audit.score === 0 ? '❌' : '⚠️';
          console.log(`  ${status} ${audit.title}`);
          
          if (audit.details?.items?.length > 0) {
            console.log(`     Issues found: ${audit.details.items.length}`);
          }
        }
      });

      return {
        score: a11yScore,
        passed: a11yScore >= 90,
        audits: audits
      };

    } catch (error) {
      console.error('Lighthouse accessibility audit failed:', error);
      return {
        score: 0,
        passed: false,
        error: error.message
      };
    }
  }

  async testManualAccessibility() {
    console.log('\n🔍 Manual Accessibility Checks...');
    
    try {
      const response = await fetch(BASE_URL);
      const html = await response.text();
      
      const tests = {
        hasLang: html.includes('lang="'),
        hasSkipLink: html.includes('skip-to-content') || html.includes('Skip to'),
        hasMainLandmark: html.includes('<main') || html.includes('role="main"'),
        hasHeadingStructure: html.includes('<h1') && html.includes('<h2'),
        hasFormLabels: this.checkFormLabels(html),
        hasButtonText: this.checkButtonText(html),
        hasImageAlt: this.checkImageAlt(html)
      };

      console.log('Manual Test Results:');
      Object.entries(tests).forEach(([test, passed]) => {
        const status = passed ? '✅' : '❌';
        console.log(`  ${status} ${test}`);
      });

      return tests;

    } catch (error) {
      console.error('Manual accessibility test failed:', error);
      return {};
    }
  }

  checkFormLabels(html) {
    // Simple check for form labels
    const inputs = (html.match(/<input[^>]*>/g) || []);
    const labels = (html.match(/<label[^>]*>/g) || []);
    
    return labels.length >= inputs.length * 0.8; // 80% of inputs should have labels
  }

  checkButtonText(html) {
    // Check buttons have text content
    const buttons = html.match(/<button[^>]*>.*?<\/button>/g) || [];
    const buttonsWithoutText = buttons.filter(btn => 
      !btn.includes('aria-label') && !/>[^<]+</.test(btn)
    );
    
    return buttonsWithoutText.length === 0;
  }

  checkImageAlt(html) {
    // Check images have alt attributes
    const images = html.match(/<img[^>]*>/g) || [];
    const imagesWithoutAlt = images.filter(img => !img.includes('alt='));
    
    return imagesWithoutAlt.length === 0;
  }

  generateA11yReport() {
    const report = {
      testDate: new Date().toISOString(),
      url: BASE_URL,
      ...this.testResults,
      recommendations: this.generateRecommendations()
    };

    console.log('\n📄 Accessibility Audit Report Generated');
    console.log('Save this report for tracking improvements');
    
    return report;
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.testResults.lighthouse?.score < 90) {
      recommendations.push('Improve Lighthouse accessibility score to 90+');
    }

    if (!this.testResults.manual?.hasSkipLink) {
      recommendations.push('Add skip-to-content link for keyboard users');
    }

    if (!this.testResults.manual?.hasMainLandmark) {
      recommendations.push('Add main landmark for screen readers');
    }

    recommendations.push('Test with real screen reader (NVDA, JAWS, VoiceOver)');
    recommendations.push('Test keyboard-only navigation');
    recommendations.push('Test with high contrast mode');

    return recommendations;
  }

  async runCompleteAudit() {
    console.log('♿ Starting Complete Accessibility Audit');
    console.log('='.repeat(50));

    // Check server
    if (!(await this.checkServerRunning())) {
      console.error('❌ Development server not running');
      console.log('Start with: npm run dev');
      return false;
    }

    // Run tests
    this.testResults.lighthouse = await this.runLighthouseA11yAudit();
    this.testResults.manual = await this.testManualAccessibility();

    // Generate final report
    const report = this.generateA11yReport();
    
    // Overall score
    const overallScore = this.testResults.lighthouse?.score || 0;
    
    console.log('\n♿ ACCESSIBILITY AUDIT SUMMARY');
    console.log('='.repeat(50));
    console.log(`Overall Score: ${overallScore}/100`);
    
    if (overallScore >= 90) {
      console.log('🎉 Excellent accessibility! Ready for all users.');
    } else if (overallScore >= 70) {
      console.log('⚠️ Good accessibility, but improvements recommended.');
    } else {
      console.log('❌ Accessibility needs significant improvement.');
    }

    return overallScore >= 90;
  }
}

export { AccessibilityAuditor };

// For use in browser console
window.testA11y = () => {
  const auditor = new AccessibilityAuditor();
  return auditor.runCompleteAudit();
};
```

### 2. Keyboard Navigation Test
```bash
#!/bin/bash
# test-keyboard-localhost.sh

echo "⌨️ Keyboard Navigation Testing Guide for Localhost"
echo "=================================================="

echo "
🎯 Manual Keyboard Testing Checklist:

1. **Start at homepage (http://localhost:5173)**
   - Press Tab to navigate through all interactive elements
   - Verify focus indicators are clearly visible
   - Ensure logical tab order (top-to-bottom, left-to-right)

2. **Test Navigation Menu**
   - Use Tab to reach navigation menu
   - Use arrow keys to navigate menu items (if applicable)
   - Press Enter/Space to activate menu items
   - Verify submenus are keyboard accessible

3. **Test Product Browsing**
   - Navigate to Products page using keyboard only
   - Tab through product cards
   - Press Enter to view product details
   - Use Tab to reach 'Add to Cart' buttons
   - Press Space/Enter to add products

4. **Test Form Interactions**
   - Navigate to Login/Register page
   - Tab through form fields
   - Verify form labels are read by screen reader
   - Test form validation (submit empty form)
   - Verify error messages are accessible

5. **Test Shopping Cart**
   - Navigate to cart page
   - Tab through cart items
   - Test quantity update controls
   - Test remove item buttons
   - Navigate to checkout

6. **Test Modal/Dialog Interactions**
   - Open any modal (size recommender, etc.)
   - Verify focus is trapped within modal
   - Test Escape key to close
   - Verify focus returns to trigger element

7. **Test Search Functionality**
   - Navigate to search input
   - Enter search term
   - Tab through search results
   - Verify search is announced to screen reader

Expected Behavior:
✅ All interactive elements reachable by Tab
✅ Focus indicators clearly visible (blue outline)
✅ Logical tab order maintained
✅ Enter/Space activate buttons and links
✅ Escape closes modals/dropdowns
✅ Focus trapped in modals
✅ Focus returns after modal close
✅ Form validation accessible
✅ Error messages announced
"

echo "🛠️ Automated Testing:"
echo "Open browser console and run:"
echo "- window.testKeyboardNav()    // Test tab order"
echo "- window.testA11y()           // Full accessibility audit"
echo "- window.auditImages()        // Check image alt text"