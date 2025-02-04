import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const logo = "/hblogo.png"; // Use public directory path
  const [isOpen, setIsOpen] = useState(false);

  return (
    // <nav className="bg-[url('navbar.png')] text-white p-4 shadow-lg">
    <nav className="bg-[#311B08] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Hope Bridge Logo" className="w-auto h-14" />
          <span className="text-2xl font-bold"></span>
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`absolute md:static top-16 right-4 bg-[#311B08] w-48 md:w-auto rounded-lg md:flex md:space-x-10 p-4 md:p-0 shadow-lg md:shadow-none transition-all duration-300 ease-in-out ${isOpen ? 'block' : 'hidden'}`}>
          <Link to="/" className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0">
            Home
          </Link>
          <Link to="/" className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0">
            Alerts
          </Link>
          <Link to="/relief" className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0">
            Relief
          </Link>
          <Link to="/safeguard" className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0">
            Safeguard
          </Link>
          <Link to="/profile" className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
