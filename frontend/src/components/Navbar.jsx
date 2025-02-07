import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Shield, LifeBuoy } from 'lucide-react';
import logo from '../assets/logo.png'; 

const Navbar = () => {
  return (
    <nav className="bg-[#3E2723] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Hope Bridge Logo" className="h-15" />
          <span className="text-2xl font-bold"></span>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link to="/" className="flex items-center space-x-1 hover:text-orange-300 transition-colors">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/relief" className="flex items-center space-x-1 hover:text-orange-300 transition-colors">
            <LifeBuoy size={18} />
            <span>Relief</span>
          </Link>
          <Link to="/safeguard" className="flex items-center space-x-1 hover:text-orange-300 transition-colors">
            <Shield size={18} />
            <span>Safeguard</span>
          </Link>
          <Link to="/profile" className="flex items-center space-x-1 hover:text-orange-300 transition-colors">
            <User size={18} />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
