import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Broke N Beauty</div>
        <ul className="flex space-x-4">
          <li><a href="/" className="text-white hover:text-gray-200">Home</a></li>
          <li><a href="/products" className="text-white hover:text-gray-200">Products</a></li>
          <li><a href="/cart" className="text-white hover:text-gray-200">Cart</a></li>
          <li><a href="/profile" className="text-white hover:text-gray-200">Profile</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;