import React from "react";
import { Link } from "react-router-dom";
import { Heart, DollarSign, Droplet, Gift, ArrowRight } from "lucide-react";

const DonationPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <header className="bg-[url('/donate.png')] text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 flex justify-center items-center gap-2">
          <Heart size={40} className="text-red-500" />
          Donate to Make a Difference
        </h1>
        <p className="text-lg max-w-3xl mx-auto">
          Your generosity can bring hope to those in need. Support disaster relief through financial
          contributions or blood donations and help save lives today. Together, we can rebuild stronger
          communities.
        </p>
      </header>

      <main className="container mx-auto py-16 px-4 max-w-8xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-[#311B08] mb-4">How You Can Help</h2>
          <p className="text-2xl text-gray-600 max-w-5xl mx-auto">
            Choose from three meaningful ways to support disaster relief efforts and make a lasting impact
          </p>
        </div>

        {/* Donation Options */}
        <div className="space-y-12">
          
          {/* Money Donation */}
          <Link to="/donate-money" className="group block">
            <div className="flex flex-col lg:flex-row items-center gap-8 p-10 border border-gray-300 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:bg-amber-100 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-[#311B08] rounded-full flex items-center group-hover:bg-green-700 justify-center transition-colors">
                  <DollarSign size={48} className="text-amber-500 group-hover:text-green-100" />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl font-bold text-gray-800 mb-3">Financial Contributions</h3>
                <p className="text-gray-600 text-xl leading-relaxed mb-4">
                  Support relief efforts by donating funds to help communities rebuild after disasters. 
                  Your financial contribution provides immediate assistance for emergency supplies, 
                  temporary shelter, and long-term recovery programs.
                </p>
                <div className="text-xl flex items-center justify-end lg:justify-end text-green-600 font-bold group-hover:gap-3 transition-all">
                  <span>Donate Money</span>
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Blood Donation */}
          <Link to="/donate-blood" className="group block">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8 p-10 border border-gray-300 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:bg-amber-100">
               <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-[#311B08] rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                  <Droplet size={48} className="text-amber-500 group-hover:text-red-100" />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-right">
                <h3 className="text-3xl font-bold text-gray-800 mb-3">Blood Donation</h3>
                <p className="text-gray-600 text-xl leading-relaxed mb-4">
                  Help save lives by donating blood for emergency medical needs during disasters. 
                  Blood supplies often run critically low during emergencies, and your donation 
                  can be the difference between life and death for someone in need.
                </p>
                <div className="flex text-xl items-center lg:justify-start text-red-600 font-bold group-hover:gap-3 transition-all">
                  <ArrowRight size={20} className="mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  <span>Donate Blood</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Goods Donation */}
          <Link to="/donate-goods" className="group block">
            <div className="flex flex-col lg:flex-row items-center gap-8 p-10 bg-gray-300 border border-gray-300 hover:bg-amber-100 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full flex items-center bg-[#311B08] justify-center group-hover:bg-amber-600 transition-colors">
                  <Gift size={48} className="text-amber-500 group-hover:text-amber-100" />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl font-bold text-gray-800 mb-3">Essential Goods</h3>
                <p className="text-gray-600 text-xl leading-relaxed mb-4">
                  Provide essential items such as food, clothing, blankets, and medical supplies 
                  to those affected by disasters. Physical donations help meet immediate basic needs 
                  and provide comfort during the most challenging times.
                </p>
                <div className="flex text-xl items-center lg:justify-end text-amber-600 font-bold group-hover:gap-3 transition-all">
                  <span>Donate Goods</span>
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-12 bg-[#311B08] rounded-2xl">
          <h3 className="text-4xl font-bold text-amber-500 mb-4">Ready to Make a Difference?</h3>
          <p className="text-gray-100 mb-6 max-w-5xl text-xl mx-auto">
            Every contribution, no matter the size, helps us provide critical support to communities in need. 
            Your generosity creates hope and rebuilds lives.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-amber-100 px-4 py-2 rounded-full text-lg text-[#311B08] font-semibold border">✓ 100% of donations go to relief efforts</span>
            <span className="bg-amber-100 px-4 py-2 rounded-full text-lg text-[#311B08] font-semibold border">✓ Tax-deductible contributions</span>
            <span className="bg-amber-100 px-4 py-2 rounded-full text-lg text-[#311B08] font-semibold border">✓ Secure donation process</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonationPage;