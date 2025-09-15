import React from "react";
import Form from "../components/Form";

function Login() {
  return (
    <div className="flex h-auto min-h-screen">
      {/* Left Section with Dark Brown Background - Hidden on mobile and tablet, visible on large screens */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#311B08] flex-col items-center justify-center p-8 min-h-screen">
        {/* Welcome Text */}
        <h1 className="text-4xl xl:text-[2.7rem] font-bold text-amber-500 mb-4 text-center mb-2">
          Welcome To HopeBridge
        </h1>
        
        {/* Description Text */}
<p className="mt-8 text-[1.2rem] text-gray-300 opacity-90 mb-8 text-center px-8 max-w-8xl">
  Sign in to continue your mission of helping communities during disasters and emergencies.
  Your dedicated service connects people in crisis with the support they need most.
</p>
        
        {/* Image */}
        <img
          src="/login.png"
          alt="Disaster Relief"
          className="w-[85%] h-[65%] object-cover rounded-lg"
        />
        
        <p className="mt-8 text-[1.2rem] text-gray-300 opacity-90 mb-8 text-center px-8 max-w-8xl">
          Your community needs you. Log in and continue making a difference in disaster response.
        </p>
      </div>

      {/* Right Form Section - Full width on mobile, 50% on desktop */}
      <div className="w-full lg:w-[50%] bg-gray-50 flex items-center justify-center py-8 lg:py-12">
        <div className="px-4 sm:px-6 lg:px-8 w-full">
          <Form />
        </div>
      </div>
    </div>
  );
}

export default Login;
