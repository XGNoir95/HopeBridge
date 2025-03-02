import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Home, Shirt, PlusCircle, Users, ChevronLeft, ChevronRight } from "lucide-react";

// Custom Arrow Components
const CustomPrevArrow = (props) => (
  <button
    {...props}
    className="absolute left-0 z-10 p-3 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition-colors duration-300"
    style={{ top: "50%", transform: "translateY(-50%)" }}
  >
    <ChevronLeft size={24} />
  </button>
);

const CustomNextArrow = (props) => (
  <button
    {...props}
    className="absolute right-0 z-10 p-3 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition-colors duration-300"
    style={{ top: "50%", transform: "translateY(-50%)" }}
  >
    <ChevronRight size={24} />
  </button>
);

const Relief = () => {
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 cards at a time
    slidesToScroll: 1, // Scroll 1 card at a time
    arrows: true,
    prevArrow: <CustomPrevArrow />, // Custom previous arrow
    nextArrow: <CustomNextArrow />, // Custom next arrow
    responsive: [
      {
        breakpoint: 1024, // Tablets
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // Mobile devices
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const donors = [
    { name: "John Doe", bloodType: "O+", contact: "+1 (555) 123-4567", location: "San Francisco, CA" },
    { name: "Emma Smith", bloodType: "A-", contact: "+1 (555) 987-6543", location: "New York, NY" },
    { name: "Liam Johnson", bloodType: "B+", contact: "+1 (555) 456-7890", location: "Chicago, IL" },
    { name: "Sophia Williams", bloodType: "AB+", contact: "+1 (555) 741-2589", location: "Seattle, WA" },
    { name: "Michael Brown", bloodType: "O-", contact: "+1 (555) 852-9632", location: "Austin, TX" },
  ];

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">Relief Network</h1>

      {/* Location Search Bar */}
      <div className="flex justify-center mb-10">
        <input 
          type="text" 
          placeholder="Tell us your location" 
          className="border border-gray-300 p-4 rounded-xl w-full max-w-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        />
      </div>

      {/* Nearby Shelters */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Nearby Shelters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <img src="/shelter1.jpg" alt="Shelter 1" className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300" />
          <img src="/shelter2.jpg" alt="Shelter 2" className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300" />
          <img src="/shelter3.jpg" alt="Shelter 3" className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300" />
          <img src="/shelter4.jpg" alt="Shelter 4" className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300" />
        </div>
      </section>

      {/* Available Resources */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Available Resources</h2>
        <div className="flex justify-center space-x-12 text-gray-900">
          <Users strokeWidth={1.5} className="w-24 h-24 transition-transform duration-300 hover:scale-110" />
          <Shirt strokeWidth={1.5} className="w-24 h-24 transition-transform duration-300 hover:scale-110" />
          <PlusCircle strokeWidth={1.5} className="w-24 h-24 transition-transform duration-300 hover:scale-110" />
          <Home strokeWidth={1.5} className="w-24 h-24 transition-transform duration-300 hover:scale-110" />
        </div>
        
      </section>

      {/* Available Blood Donors */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Available Blood Donors</h2>
        <div className="relative">
          <Slider {...settings}>
            {donors.map((donor, index) => (
              <div key={index} className="p-5">
                <div className="bg-orange-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                  <p className="font-bold text-gray-800 text-xl">{donor.name}</p>
                  <p className="text-gray-600">Blood Type: <span className="font-medium text-orange-600">{donor.bloodType}</span></p>
                  <p className="text-gray-600">Contact: {donor.contact}</p>
                  <p className="text-gray-600">Location: {donor.location}</p>
                  <button className="bg-orange-500 text-white px-5 py-2 mt-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-300">
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
};

export default Relief;