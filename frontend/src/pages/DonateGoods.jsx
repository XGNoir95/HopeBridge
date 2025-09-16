import React, { useState, useEffect } from "react";
import { Package } from "lucide-react";  
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const DonateGoods = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    itemDescription: "",
    quantity: "",
    pickUpLocation: "",
    expirationDate: ""
  });
  const [error, setError] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Get current date in Bangladesh timezone (UTC+6)
  const getCurrentBDTDate = () => {
    const now = new Date();
    const bdtOffset = 6 * 60; // 6 hours in minutes
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const bdtTime = new Date(utc + (bdtOffset * 60000));
    return bdtTime.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Fetch user data and divisions on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          throw new Error("No token found in localStorage");
        }

        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData((prevData) => ({
          ...prevData,
          name: response.data.userName,
          mail: response.data.userMail,
        }));

        // Fetch divisions from the BD API
        const divisionsResponse = await axios.get("https://bdapi.vercel.app/api/v.1/division");
        setDivisions(divisionsResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again.");
      }
    };

    fetchUserData();
  }, [token]);

  // Fetch districts when a division is selected
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedDivision) return;
      
      try {
        const division = divisions.find(div => div.name === selectedDivision);
        if (division) {
          const districtsResponse = await axios.get(
            `https://bdapi.vercel.app/api/v.1/district/${division.id}`
          );
          setDistricts(districtsResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
        setError("Failed to load districts. Please try again.");
      }
    };

    fetchDistricts();
  }, [selectedDivision, divisions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDivisionChange = (e) => {
    setSelectedDivision(e.target.value);
    setFormData({ ...formData, pickUpLocation: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate expiration date is not in the past (BDT)
    const currentBDTDate = getCurrentBDTDate();
    
    if (formData.expirationDate < currentBDTDate) {
      setError("Expiration date cannot be in the past.");
      return;
    }

    try {
      // Prepare data for backend (include pickUpDate as current date)
      const submitData = {
        ...formData,
        pickUpDate: getCurrentBDTDate() // Set current BDT date as pickup date
      };

      const response = await axios.post(
        "http://localhost:8000/api/create-resources",
        submitData
      );
      if (response.data.success) {
        setIsSubmitted(true);
      } else {
        setError("Failed to submit donation. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError("An error occurred. Please check your input and try again.");
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-[40%] bg-[#311B08] flex-col items-center justify-center p-8 text-white">
          <div className="text-center space-y-6">
            <h1 className="text-5xl text-amber-500 font-bold mb-4">Welcome Back</h1>
            <p className="text-2xl opacity-90">
              Support disaster relief efforts by donating essential goods
            </p>
            <p className="text-xl opacity-75">
              Your donations provide immediate relief to those in need.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[60%] flex items-center justify-center bg-gray-50 p-4 lg:p-8">
          <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg max-w-xl w-full text-center">
            <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              You need to be logged in to donate goods.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#311B08] text-amber-500 hover:underline text-lg font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all mb-4"
            >
              Log In
            </button>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <span
                className="text-[#311B08] cursor-pointer hover:underline font-semibold"
                onClick={() => navigate("/register")}
              >
                Create one
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Fixed width with proper constraints */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#311B08] flex-col items-center justify-center p-6 text-white overflow-hidden">
        <div className="text-center flex flex-col items-center justify-center h-full max-w-full">
          {/* Icon and Title in the same row */}
          <div className="flex items-center justify-center mb-3">
            <Package size={60} className="text-gray-300 mr-3 flex-shrink-0" />
            <h1 className="text-2xl xl:text-3xl font-bold text-amber-500">Donate Goods</h1>
          </div>

          {/* Description */}
          <p className="text-[1.3rem] opacity-90 leading-relaxed mx-4 text-center mb-6">
            Your essential goods donations provide immediate relief to families in crisis.
            Every item you donate helps someone rebuild their life after disaster strikes.
          </p>

          {/* Image with no extra spacing */}
          <div className="w-[85%] h-[65%] flex items-center justify-center">
            <img
              src="/goods.png"
              alt="Goods Donation"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Description at the bottom */}
          <p className="text-[1.3rem] opacity-90 leading-relaxed mx-4 text-center mt-4">
            Join compassionate donors providing essential supplies to communities in their time of greatest need.
          </p>
        </div>
      </div>

      {/* Right Form Section - Fixed width with proper constraints */}
      <div className="w-full lg:w-[55%] bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center py-2 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 w-full">

              {/* Mobile header - only visible on small screens */}
              <div className="lg:hidden text-center mb-4 sm:mb-6">
                <div className="flex justify-center mb-3">
                  <Package size={40} className="text-amber-500" />
                </div>
                <h1 className="text-[1.8rem] font-bold text-[#311B08] mb-2">Donate Goods</h1>
                <p className="text-xl font-semibold text-gray-600 px-2">
                  Provide essential goods to those in need.
                </p>
              </div>

              {/* Back arrow and Create donation header */}
              <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg className="lg:mt-1 w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h2 className="text-[1.3rem] xl:text-[1.9rem] font-bold text-[#311B08] flex-1 min-w-0">
                  Donate your goods
                </h2>
              </div>

              {isSubmitted && (
                <div className="text-center py-8 sm:py-12 mb-6 sm:mb-8 rounded-lg bg-green-100 text-green-600">
                  <p className="text-2xl font-semibold mb-4">Thank you for donating goods!</p>
                  <Link
                    to="/donate"
                    className="inline-block bg-[#311B08] font-semibold hover:text-white text-amber-500 px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
                  >
                    Back to Donation Page
                  </Link>
                </div>
              )}

              {error && (
                <div className="text-center p-4 mb-4 sm:mb-6 rounded-lg bg-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {!isSubmitted && (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-base text-lg font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full px-3 px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base bg-gray-100"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      readOnly
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-base text-lg font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="mail"
                      className="w-full px-3 px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base bg-gray-100"
                      placeholder="Email Address"
                      value={formData.mail}
                      onChange={handleChange}
                      readOnly
                      required
                    />
                  </div>

                  {/* Item Description and Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base text-lg font-semibold text-gray-700 mb-2">
                        Item Description
                      </label>
                      <input
                        type="text"
                        name="itemDescription"
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base"
                        placeholder="e.g., Rice, Medicine, Clothes"
                        value={formData.itemDescription}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base"
                        placeholder="Enter quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Expiration Date - Full Width */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Expiration Date <span className="text-red-500">*</span> <span className="text-sm text-gray-500">(BDT)</span>
                    </label>
                    <input
                      type="date"
                      name="expirationDate"
                      min={getCurrentBDTDate()}
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base"
                      value={formData.expirationDate}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Please specify when this item will expire to help us distribute it effectively
                    </p>
                  </div>

                  {/* Division and District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Division
                      </label>
                      <select
                        name="division"
                        value={selectedDivision}
                        onChange={handleDivisionChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base"
                        required
                      >
                        <option value="" disabled>Select Division</option>
                        {divisions.map((division) => (
                          <option key={division.id} value={division.name}>
                            {division.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Pickup Location
                      </label>
                      <select
                        name="pickUpLocation"
                        value={formData.pickUpLocation}
                        onChange={handleChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base disabled:bg-gray-100"
                        required
                        disabled={!selectedDivision}
                      >
                        <option value="" disabled>Select Pickup Location</option>
                        {districts.map((district) => (
                          <option key={district.id} value={district.name}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 sm:pt-3">
                    <button
                      type="submit"
                      className="w-full bg-[#311B08] text-lg lg:text-xl font-semibold text-amber-500 py-4 lg:py-4 px-6 rounded-lg hover:bg-[#EBB380] hover:text-[#311B08] transition-all"
                    >
                      Submit Donation
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateGoods;
