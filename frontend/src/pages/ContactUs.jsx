import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="flex-1 bg-gray-100 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Contact Us</h1>
        {/* Sentence Section */}
        <p className="text-center text-2xl font-bold text-[#5A3E2B] mb-8">
          Together, we can build a bridge of hope and resilience in times of need.
        </p>
        <div className="flex justify-center">
          {/* Expanded Contact Information Card with Black Border */}
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl border-2 border-black">
            <h2 className="text-2xl font-bold mb-6 text-center">Contact Information</h2>
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#311B08] rounded-full text-[#EBB380] hover:bg-[#EBB380] hover:text-[#311B08] transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Email</p>
                  <p className="text-gray-600">support@disasterrelief.org</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#311B08] rounded-full text-[#EBB380] hover:bg-[#EBB380] hover:text-[#311B08] transition-colors">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Phone</p>
                  <p className="text-gray-600">+1 (123) 456-7890</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#311B08] rounded-full text-[#EBB380] hover:bg-[#EBB380] hover:text-[#311B08] transition-colors">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Address</p>
                  <p className="text-gray-600">
                    123 Disaster Relief Ave, City, Country
                  </p>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#311B08] rounded-full text-[#EBB380] hover:bg-[#EBB380] hover:text-[#311B08] transition-colors">
                  <Facebook size={24} />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Facebook</p>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#EBB380] transition-colors"
                  >
                    facebook.com/hopebridge
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#311B08] rounded-full text-[#EBB380] hover:bg-[#EBB380] hover:text-[#311B08] transition-colors">
                  <Instagram size={24} />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Instagram</p>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#EBB380] transition-colors"
                  >
                    instagram.com/hopebridge
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#311B08] rounded-full text-[#EBB380] hover:bg-[#EBB380] hover:text-[#311B08] transition-colors">
                  <Twitter size={24} />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Twitter</p>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#EBB380] transition-colors"
                  >
                    twitter.com/hopebridge
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#311B08] rounded-full text-[#EBB380] hover:bg-[#EBB380] hover:text-[#311B08] transition-colors">
                  <Youtube size={24} />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">YouTube</p>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#EBB380] transition-colors"
                  >
                    youtube.com/hopebridge
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;