/**
 * Skip to Content Link
 * Provides keyboard users with ability to skip navigation and go directly to main content
 */

import React from 'react';

export const SkipToContent = ({ targetId = "main-content" }) => {
  return (
    <a
      href={`#${targetId}`}
      className="skip-to-content"
      style={{
        position: 'absolute',
        top: '-100px',
        left: '0',
        background: '#1D4ED8',
        color: 'white',
        padding: '12px 16px',
        textDecoration: 'none',
        fontWeight: 'bold',
        zIndex: 10000,
        transition: 'top 0.3s ease',
        borderRadius: '0 0 4px 0'
      }}
      onFocus={(e) => {
        e.target.style.top = '0';
      }}
      onBlur={(e) => {
        e.target.style.top = '-100px';
      }}
      onClick={(e) => {
        // Ensure the target gets focus after clicking
        setTimeout(() => {
          const target = document.getElementById(targetId);
          if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }}
    >
      Skip to main content
    </a>
  );
};

/**
 * Main Content Wrapper
 * Provides semantic main landmark and focus target for skip link
 */
export const MainContent = ({ children, id = "main-content" }) => {
  return (
    <main 
      id={id}
      role="main"
      tabIndex="-1"
      style={{ outline: 'none' }}
      aria-label="Main content"
    >
      {children}
    </main>
  );
};

export default SkipToContent;