import React from "react";

const Hero = () => {
  return (
    <div className="w-full min-h-[710px] flex items-center justify-center">
      <div
        className="w-full h-auto min-h-[710px] md:h-[710px] bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: "url('/hero.png')" }}
        role="img"
        aria-label="Hero background"
      ></div>
    </div>
  );
};

export default Hero;
