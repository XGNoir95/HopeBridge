import React from 'react';
import { Megaphone, Heart, HandshakeIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Hero from '../components/Hero';
import Map from '../components/Map';

// Custom Arrow Components
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[#311B08] text-white hover:bg-amber-900 transition-colors duration-300"
  >
    <ChevronLeft size={24} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[#311B08] text-white hover:bg-amber-900 transition-colors duration-300"
  >
    <ChevronRight size={24} />
  </button>
);

const Home = () => {
  // Partner organizations data
  const partners = [
    { src: "irc.png", alt: "IRC" },
    { src: "g1.png", alt: "G1" },
    { src: "rc.png", alt: "Red Cross" },
    { src: "who.png", alt: "WHO" }
  ];

  // Slider settings
  const partnerSettings = {
    dots: false,              // No dots at bottom
    arrows: true,             // Show arrows only
    infinite: true,
    speed: 500,
    slidesToShow: 4,          // Four logos like your original layout
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="flex-1">
      <Hero />

      <div className="container mx-auto py-16 px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <Link to="/report" className="block transform transition duration-300 hover:scale-105">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg cursor-pointer">
              <div className="flex justify-center mb-4">
                <Megaphone size={60} className="text-[#311B08]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Report</h3>
              <p className="text-gray-800 p-4">
                Submit detailed reports about affected areas and immediate needs for efficient response coordination.
              </p>
            </div>
          </Link>

          <Link to="/donate" className="block transform transition duration-300 hover:scale-105">
            <div className="text-center p-6 bg-[#E49854] text-[#311B08] rounded-lg shadow-lg cursor-pointer">
              <div className="flex justify-center mb-4">
                <Heart size={60} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Donate</h3>
              <p className="p-4">
                Support our mission with financial contributions that directly impact relief efforts and recovery programs.
              </p>
            </div>
          </Link>

          <Link to="/volunteers" className="block transform transition duration-300 hover:scale-105">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg cursor-pointer">
              <div className="flex justify-center mb-4">
                <HandshakeIcon size={60} className="text-[#311B08]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Join</h3>
              <p className="text-gray-600 p-4">
                Become part of our volunteer network and help make a difference in disaster-affected communities.
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-gray-100 py-16 my-10">
        <Map />
      </div>

      {/* Partner Organizations Slider */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-5xl font-bold text-center mb-12">Our Partner Organizations:</h2>
          
          <div className="relative max-w-8xl mx-auto px-16">
            <Slider {...partnerSettings}>
              {partners.map((partner, index) => (
                <div key={index} className="px-4">
                  <div className="flex items-center justify-center h-64 md:h-72">
                    <img 
                      src={partner.src} 
                      alt={partner.alt} 
                      className="h-48 md:h-56 w-auto object-contain" 
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
