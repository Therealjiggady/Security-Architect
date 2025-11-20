import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Navbar = () => {
  const { user, logout } = useUser();

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Broke N Beauty</div>
        <ul className="flex space-x-4">
          <li><Link to="/" className="text-white hover:text-gray-200">Home</Link></li>
          <li><Link to="/products" className="text-white hover:text-gray-200">Products</Link></li>
          <li><Link to="/cart" className="text-white hover:text-gray-200">Cart</Link></li>
          <li><Link to="/profile" className="text-white hover:text-gray-200">Profile</Link></li>
          {user ? (
            <li><button onClick={logout} className="text-white hover:text-gray-200">Logout</button></li>
          ) : (
            <>
              <li><Link to="/login" className="text-white hover:text-gray-200">Login</Link></li>
              <li><Link to="/register" className="text-white hover:text-gray-200">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;