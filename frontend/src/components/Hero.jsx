import React from "react";

const Hero = () => {
  return (
    <div className="w-full min-h-[710px] flex items-center justify-center">
      <div className="relative w-full h-full min-h-[710px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-no-repeat bg-center bg-gray-500"
          style={{ backgroundImage: "url('/hero2.png')" }}
        />
          
        {/* Text Content - Fixed centering for all devices */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* Main Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.7rem] font-bold text-white mb-4 leading-tight">
              <span className="block">From Crisis to Recovery,</span>
              <span className="block">We're Here for You</span>
            </h1>
          </div>
          
          {/* Description */}
          <div className="text-center max-w-5xl mx-auto">
            <p className="text-lg sm:text-xl md:text-[1.5rem] text-white leading-relaxed opacity-90">
              Providing urgent relief, long-term support, and essential resources to communities affected by 
              disasters. Through collective action and compassion, we strive to rebuild lives and restore hope where 
              it's needed most.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
