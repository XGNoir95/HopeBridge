import React from 'react';
import { Megaphone, Heart, HandshakeIcon } from 'lucide-react';
import heroImage from '../assets/hero.png'; // Ensure this path is correct

const Home = () => {
  // Debugging: Log the image path to ensure it's correct
  console.log('Hero Image Path:', heroImage);

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <div 
        className="relative h-[500px] bg-cover bg-center" 
        style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="container mx-auto h-full flex items-center px-4">
            <div className="text-white max-w-2xl">
              <h1 className="text-5xl font-bold mb-4">From Crisis to Recovery,<br />We're Here for You</h1>
              <p className="text-lg mb-8">When disaster strikes, hope can seem distant. But together, we can rebuild lives and restore communities. Join our mission to provide immediate relief and long-term recovery support to those affected by natural disasters.</p>
              <button className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition">Join Us</button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-center mb-4">
              <Megaphone size={40} className="text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Report</h3>
            <p className="text-gray-600">Submit detailed reports about affected areas and immediate needs for efficient response coordination.</p>
          </div>
          <div className="text-center p-6 bg-orange-500 text-white rounded-lg shadow-lg">
            <div className="flex justify-center mb-4">
              <Heart size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">Donate</h3>
            <p>Support our mission with financial contributions that directly impact relief efforts and recovery programs.</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-center mb-4">
              <HandshakeIcon size={40} className="text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Join</h3>
            <p className="text-gray-600">Become part of our volunteer network and help make a difference in disaster-affected communities.</p>
          </div>
        </div>
      </div>

      {/* Partner Organizations */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Partner Organizations:</h2>
          <div className="grid grid-cols-4 gap-8 items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_the_Red_Cross.svg" alt="Red Cross" className="h-16 object-contain mx-auto" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_the_United_Nations.svg" alt="United Nations" className="h-16 object-contain mx-auto" />
            <img src="https://toppng.com/uploads/preview/who-world-health-organization-logo-vector-free-download-115742230129hethqdgqt.png" alt="WHO" className="h-16 object-contain mx-auto" />
            <img src="https://static.vecteezy.com/system/resources/previews/010/533/097/original/home-care-logo-stay-at-home-logo-nursing-home-logo-template-free-vector.jpg" alt="CARE" className="h-16 object-contain mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;