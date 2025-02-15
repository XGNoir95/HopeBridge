import React from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();

  return (
    <div className="bg-white px-12 py-20 rounded-3xl border border-gray-300 shadow-lg h-[880px] w-[500px] max-w-lg">
      <h1 className="text-4xl font-semibold text-[#311B08]">Create an Account</h1>
      <p className="font-medium text-lg text-gray-500 mt-4">
        Enter your details to sign up.
      </p>
      <div className="mt-8">
        <div>
          <label className="text-lg font-medium text-gray-700">Full Name</label>
          <input
            className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-violet-500 transition-all"
            placeholder="Enter your full name"
          />
        </div>
        <div className="mt-4">
          <label className="text-lg font-medium text-gray-700">Email</label>
          <input
            className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-violet-500 transition-all"
            placeholder="Enter your email"
          />
        </div>
        <div className="mt-4">
          <label className="text-lg font-medium text-gray-700">Password</label>
          <input
            className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-violet-500 transition-all"
            placeholder="Create a password"
            type="password"
          />
        </div>
        <div className="mt-4">
          <label className="text-lg font-medium text-gray-700">Confirm Password</label>
          <input
            className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-violet-500 transition-all"
            placeholder="Confirm your password"
            type="password"
          />
        </div>
        <div className="mt-4">
          <label className="text-lg font-medium text-gray-700">Address</label>
          <input
            className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-violet-500 transition-all"
            placeholder="Enter your address"
          />
        </div>

        <div className="mt-8 flex flex-col gap-y-4">
          <button 
            onClick={() => navigate("/profile")} 
            className="bg-[#EBB380] text-[#311B08] hover:bg-[#311B08] hover:text-[#EBB380] text-lg font-bold py-3 rounded-xl transition-all">
            Sign Up
          </button>
        </div>
        <div className="mt-8 flex justify-center items-center">
          <p className="font-medium text-gray-700">Already have an account?</p>
          <button
            onClick={() => navigate("/login")} 
            className="text-[#311B08] font-medium ml-2 hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
