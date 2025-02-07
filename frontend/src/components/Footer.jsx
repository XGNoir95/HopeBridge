// Footer.jsx
import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
            
    <footer className="bg-[#3E2723] text-white mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          {/* Logo and Tagline */}
          <div className="mb-4">
            <h3 className="text-xl font-bold">HOPE BRIDGE</h3>
            <p className="text-sm">IN RESCUING WE BELIEVE</p>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-blue-500 transition-colors">
              <Facebook size={24} />
            </a>
            <a href="#" className="hover:text-pink-500 transition-colors">
              <Instagram size={24} />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              <Twitter size={24} />
            </a>
            <a href="#" className="hover:text-red-500 transition-colors">
              <Youtube size={24} />
            </a>
          </div>

          {/* Footer Links */}
          <div className="flex justify-center space-x-4 text-sm mb-4">
            <a href="#" className="hover:text-orange-300 transition-colors">About</a>
            <span>|</span>
            <a href="#" className="hover:text-orange-300 transition-colors">Privacy</a>
            <span>|</span>
            <a href="#" className="hover:text-orange-300 transition-colors">Terms of Use</a>
            <span>|</span>
            <a href="#" className="hover:text-orange-300 transition-colors">Contact Us</a>
          </div>

          {/* Copyright */}
          <p className="text-sm mt-4">© 2024 All rights reserved by HopeBridge</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;