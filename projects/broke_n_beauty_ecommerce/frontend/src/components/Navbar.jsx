import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Navbar = () => {
  const { user, logout } = useUser();

  return (
    <nav className="bg-primary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-primary-foreground font-bold text-xl">Broke N Beauty</div>
        <ul className="flex space-x-4">
          <li><Link to="/" className="text-primary-foreground hover:text-primary-foreground/80">Home</Link></li>
          <li><Link to="/products" className="text-primary-foreground hover:text-primary-foreground/80">Products</Link></li>
          <li><Link to="/cart" className="text-primary-foreground hover:text-primary-foreground/80">Cart</Link></li>
          {user && (
            <li><Link to="/orders" className="text-primary-foreground hover:text-primary-foreground/80">Orders</Link></li>
          )}
          <li><Link to="/profile" className="text-primary-foreground hover:text-primary-foreground/80">Profile</Link></li>
          {user ? (
            <li><button onClick={logout} className="text-primary-foreground hover:text-primary-foreground/80">Logout</button></li>
          ) : (
            <>
              <li><Link to="/login" className="text-primary-foreground hover:text-primary-foreground/80">Login</Link></li>
              <li><Link to="/register" className="text-primary-foreground hover:text-primary-foreground/80">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;