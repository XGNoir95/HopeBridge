import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DonateBlood = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check if the user is logged in

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the user is logged in
    if (!token) {
      alert("You need to log in to register for blood donation.");
      navigate("/login"); // Redirect to the login page
      return;
    }

    // If logged in, proceed with submission
    setIsSubmitted(true);
  };

  // If the user is not logged in, display a message and redirect options
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#311B08] max-w-md w-full text-center">
          <p className="text-2xl font-bold text-gray-900 mb-4">
            You need to be logged in to register for blood donation.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-[#311B08] text-[#EBB380] font-semibold px-6 py-2 rounded-lg hover:bg-amber-600 hover:text-white transition-all"
          >
            Log In
          </button>
          <p className="mt-4 text-gray-600 font-semibold">
            Don't have an account?{" "}
            <span
              className="text-amber-600 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#F9F5F0] to-[#F0E6D8] min-h-screen py-16 px-4">
      <h2 className="text-4xl font-bold text-center mb-8 text-[#311B08]">
        Donate Blood
      </h2>
      <p className="text-center mb-6 text-[#5A3A22]">
        Register for a blood donation drive near you.
      </p>
      <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#FFFFFF] to-[#F9F5F0] p-8 rounded-2xl shadow-2xl border border-[#EBB380]">
        {isSubmitted ? (
          <div className="text-center">
            <p className="text-green-600 font-semibold mb-4 text-2xl">
              Thank you for registering to donate blood!
            </p>
            <Link
              to="/donate"
              className="inline-block bg-[#311B08] text-white px-6 py-3 rounded-lg hover:bg-[#4a2c12] transition-transform transform hover:scale-105"
            >
              Back to Donation Page
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              required
            />
            <input
              type="text"
              placeholder="Blood Group"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              required
            />
            <select
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              required
            >
              <option value="">Select Division</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Khulna">Khulna</option>
              <option value="Barisal">Barisal</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Mymensingh">Mymensingh</option>
            </select>
            <input
              type="text"
              placeholder="District"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              required
            />
            <select
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <div className="flex justify-between gap-6">
              <Link
                to="/donate"
                className="w-1/2 bg-[#5A3A22] text-white p-4 rounded-xl hover:bg-[#4a2c12] transition-transform transform hover:scale-105 text-center"
              >
                Back
              </Link>
              <button
                type="submit"
                className="w-1/2 bg-[#311B08] text-white p-4 rounded-xl hover:bg-[#4a2c12] transition-transform transform hover:scale-105"
              >
                Register Now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DonateBlood;