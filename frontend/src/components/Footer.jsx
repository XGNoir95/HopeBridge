import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Footer = () => {
  return (
    <footer className="bg-[#311B08] text-white mt-auto shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center text-center">

          <div className="mb-4">
            <img src="FLogo.png" alt="Hope Bridge Logo" className="h-18 sm:h-24 object-contain mx-auto" />
          </div>

          <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 mb-4">
            <a href="#" className="hover:text-blue-500 transition-colors">
              <Facebook size={26} />
            </a>
            <a href="#" className="hover:text-pink-500 transition-colors">
              <Instagram size={26} />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              <Twitter size={26} />
            </a>
            <a href="#" className="hover:text-red-500 transition-colors">
              <Youtube size={26} />
            </a>
          </div>

          <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4 text-lg mb-4">
            <Link to="/contact-us" className="hover:text-amber-500 transition-colors">About</Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/contact-us" className="hover:text-amber-500 transition-colors">Privacy</Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/contact-us" className="hover:text-amber-500 transition-colors">Terms of Use</Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/contact-us" className="hover:text-amber-500 transition-colors">Contact Us</Link>
          </div>

          <p className="text-sm mt-4 text-gray-300">© 2024 All rights reserved by HopeBridge</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
