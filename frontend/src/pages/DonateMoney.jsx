import React, { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const DonateMoney = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    amount: "",
    method: "",
  });

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          throw new Error("No token found in localStorage");
        }

        const decodedToken = jwtDecode(token);
        const userIdFromToken = decodedToken.uid;

        if (!userIdFromToken) {
          throw new Error("User ID not found in token");
        }

        setUserId(userIdFromToken);

        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData((prevData) => ({
          ...prevData,
          fullName: response.data.userName,
          email: response.data.userMail,
          phone: response.data.userPhone,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again.");
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError(null);

    if (!token) {
      setMessage("Authentication required!");
      setLoading(false);
      return;
    }

    if (!userId) {
      setMessage("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        id: userId,
        amount: formData.amount,
        paymentMethod: formData.method,
      };

      const response = await axios.post(
        "http://localhost:8000/api/create-moneyDonation",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        setMessage("Thank you for your donation!");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          amount: "",
          method: "",
        });
      } else {
        setMessage("Failed to process the donation. Please try again.");
      }
    } catch (error) {
      setMessage("Failed to process the donation. Please try again.");
      console.error(error);
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-[40%] bg-[#311B08] flex-col items-center justify-center p-8 text-white">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
            <p className="text-lg opacity-90">
              Support disaster relief efforts through monetary donations
            </p>
            <p className="text-sm opacity-75">
              Every contribution helps communities recover and rebuild.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[60%] flex items-center justify-center bg-gray-50 p-4 lg:p-8">
          <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              You need to be logged in to make a donation.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#311B08] text-white font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all mb-4"
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
    <div className="flex min-h-screen lg:h-screen overflow-hidden">
      {/* Left Sidebar - Fixed width with proper constraints */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#311B08] flex-col items-center justify-center p-6 text-white overflow-hidden">
        <div className="text-center flex flex-col items-center justify-center h-full max-w-full">
          {/* Icon and Title in the same row */}
          <div className="flex items-center justify-center mb-3">
            <DollarSign size={60} className="text-gray-300 mr-3 flex-shrink-0" />
            <h1 className="text-2xl xl:text-3xl font-bold text-amber-500">Donate Money</h1>
          </div>

          {/* Description */}
          <p className="text-[1.3rem] opacity-90 leading-relaxed mx-4 text-center mb-4">
            Your financial support provides relief and long-term recovery resources.
            Every donation helps communities rebuild and become more resilient to disasters.
          </p>

          {/* Image with no extra spacing */}
          <div className="w-[85%] h-[65%] flex items-center justify-center">
            <img
              src="/money.png"
              alt="Donation Support"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Description at the bottom */}
          <p className="text-[1.3rem] opacity-90 leading-relaxed mx-4 text-center mt-4">
            Join thousands of generous donors making a difference through financial support to bridge hope with action.
          </p>
        </div>
      </div>

      {/* Right Form Section - Fixed width with proper constraints */}
      <div className="w-full lg:w-[55%] bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center py-2 sm:py-4 lg:py-8 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-10 lg:py-15 w-full max-h-full overflow-y-auto">

              {/* Mobile header - only visible on small screens */}
              <div className="lg:hidden text-center mb-4 sm:mb-6">
                <div className="flex justify-center mb-3">
                  <DollarSign size={40} className="text-amber-500" />
                </div>
                <h1 className="text-[1.8rem] font-bold text-[#311B08] mb-2">Donate Money</h1>
                <p className="text-lg font-semibold text-gray-600 px-2">
                  Support disaster relief efforts through monetary donations.
                </p>
              </div>

              {/* Back arrow and Create donation header */}
              <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg className="lg:mt-1 lg:w-6 lg:h-6 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h2 className="text-[1.3rem] lg:text-xl xl:text-[1.9rem] font-bold text-[#311B08] flex-1 min-w-0">
                  Make your donation
                </h2>
              </div>

              {message && (
                <div className={`text-center p-4 mb-4 sm:mb-6 rounded-lg ${message.includes('Thank you') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {message}
                </div>
              )}

              {error && (
                <div className="text-center p-4 mb-4 sm:mb-6 rounded-lg bg-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base bg-gray-100"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    readOnly
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base bg-gray-100"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    readOnly
                    required
                  />
                </div>

                {/* Phone and Amount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Amount (TK)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base"
                      placeholder="Amount (TK)"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    name="method"
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base"
                    value={formData.method}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Payment Method</option>
                    <option value="bkash">Bkash</option>
                    <option value="nagad">Nagad</option>
                    <option value="credit">Credit Card</option>
                    <option value="rocket">Rocket</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="pt-2 sm:pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#311B08] text-lg lg:text-xl font-semibold text-amber-500 py-4 lg:py-5 px-6 rounded-lg hover:bg-[#EBB380] hover:text-[#311B08] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : "Donate Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateMoney;
