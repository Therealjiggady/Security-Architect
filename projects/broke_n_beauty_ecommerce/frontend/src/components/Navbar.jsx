import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Navbar = () => {
  const { user, logout } = useUser();

  return (
    <nav className="bg-primary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-primary-foreground font-bold text-xl">Broken Beauty</div>
        <ul className="flex space-x-4">
          <li><Link to="/" className="text-primary-foreground">Home</Link></li>
          <li><Link to="/products" className="text-primary-foreground">Products</Link></li>
          <li><Link to="/dream-wishlist" className="text-primary-foreground">Dream Wishlist</Link></li>
          <li><Link to="/cart" className="text-primary-foreground">Cart</Link></li>
          <li><Link to="/chat" className="text-primary-foreground">Chat</Link></li>
          {user && (
            <li><Link to="/orders" className="text-primary-foreground">Orders</Link></li>
          )}
          <li><Link to="/profile" className="text-primary-foreground">Profile</Link></li>
          {user ? (
            <li><button onClick={logout} className="text-primary-foreground">Logout</button></li>
          ) : (
            <>
              <li><Link to="/login" className="text-primary-foreground">Login</Link></li>
              <li><Link to="/register" className="text-primary-foreground">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;