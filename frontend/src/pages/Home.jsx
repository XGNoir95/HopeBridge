import React from 'react';
import { Megaphone, Heart, HandshakeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Hero from '../components/Hero';
import Map from '../components/Map';

const Home = () => {
  return (
    <div className="flex-1">

      <Hero />


      <div className="container mx-auto py-16 px-4">
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

          <Link to="/join" className="block transform transition duration-300 hover:scale-105">
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


      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-5xl font-bold text-center mb-12">Our Partner Organizations:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <img src="irc.png" alt="IRC" className="h-70 md:h-57 object-contain mx-auto" />
            <img src="g1.png" alt="G1" className="h-70 md:h-57 object-contain mx-auto" />
            <img src="rc.png" alt="Red Cross" className="h-70 md:h-57 object-contain mx-auto" />
            <img src="who.png" alt="WHO" className="h-70 md:h-57 object-contain mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
