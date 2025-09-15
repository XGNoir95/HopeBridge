import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

function Register() {
  return (
    <div className="flex h-auto min-h-screen">
      {/* Left Form Section - Full width on mobile, 50% on desktop */}
      <div className="w-full lg:w-[50%] bg-gray-50 flex items-center justify-center py-8 lg:py-12">
        <div className="px-4 sm:px-6 lg:px-8 w-full">
          <RegisterForm />
        </div>
      </div>

      {/* Right Section with Dark Brown Background - Hidden on mobile and tablet, visible on large screens */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#311B08] flex-col items-center justify-center p-8 min-h-screen">
        {/* Welcome Text */}
        <h1 className="text-4xl xl:text-[2.7rem] font-bold text-amber-500 mb-4 text-center mb-2">
          Welcome To HopeBridge
        </h1>
        
        {/* Description Text */}
<p className="text-[1.2rem] text-gray-300 opacity-90 mb-8 text-center px-8 max-w-7xl">
  Join our disaster response community and become a certified volunteer helper in your area.
  Register today to access emergency alerts and coordinate with local relief teams.
</p>

        
        {/* Image */}
        <img
          src="/login.png"
          alt="Disaster Relief"
          className="w-[85%] h-[60%] object-cover rounded-lg"
        />
        <p className="mt-8 text-[1.2rem] text-gray-300 opacity-90 mb-8 text-center px-8 max-w-8xl">
          Be the bridge between crisis and hope. Register today and become part of our emergency response community.
        </p>

      </div>
    </div>
  );
}

export default Register;
