import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2023 Broke N Beauty. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="/about" className="hover:text-muted-foreground">About</a>
          <a href="/contact" className="hover:text-muted-foreground">Contact</a>
          <a href="/privacy" className="hover:text-muted-foreground">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;