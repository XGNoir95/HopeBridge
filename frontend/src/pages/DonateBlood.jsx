import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const DonateBlood = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    phone: "",
    bloodGroup: "",
    division: "",
    district: "",
    gender: "",
  });
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

        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData((prevData) => ({
          ...prevData,
          name: response.data.userName,
          mail: response.data.userMail,
          phone: response.data.userPhone,
          bloodGroup: response.data.blood_group,
          division: response.data.city,
          district: response.data.district,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again.");
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You need to log in to register for blood donation.");
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.uid;

      const payload = {
        id: userId,
        division: formData.division,
        district: formData.district,
        gender: formData.gender,
      };

      const response = await axios.post(
        "http://localhost:8000/api/create-donor",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        <div className="w-full lg:w-[60%] flex items-center justify-center bg-gray-50 p-4 lg:p-8">
          <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg max-w-xl w-full text-center">
            <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              You need to be logged in to register for blood donation.
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

        <div className="hidden lg:flex lg:w-[40%] bg-[#311B08] flex-col items-center justify-center p-8 text-white">
          <div className="text-center space-y-6">
            <h1 className="text-5xl text-amber-500 font-bold mb-4">Save Lives Today</h1>
            <p className="text-2xl opacity-90">
              Register as a blood donor and help save lives in your community
            </p>
            <p className="text-xl opacity-75">
              Your donation can make the difference between life and death.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen lg:h-screen overflow-hidden">
      {/* Left Form Section - Fixed width with proper constraints */}
      <div className="w-full lg:w-[55%] bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center py-2 sm:py-4 lg:py-8 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-10 w-full max-h-full overflow-y-auto">

              {/* Mobile header - only visible on small screens */}
              <div className="lg:hidden text-center mb-4 sm:mb-6">
                <div className="flex justify-center mb-3">
                  <Heart size={40} className="text-red-500" />
                </div>
                <h1 className="text-[1.8rem] font-bold text-[#311B08] mb-2">Donate Blood</h1>
                <p className="text-xl font-semibold text-gray-600 px-2">
                  Register as a blood donor and help save lives.
                </p>
              </div>

              {/* Back arrow and Register header */}
              <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg className="mt-1.5 lg:w-6 lg:h-6 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h2 className="text-[1.3rem] lg:text-xl xl:text-[1.9rem] font-bold text-[#311B08] flex-1 min-w-0">
                  Register as Blood Donor
                </h2>
              </div>

              {isSubmitted && (
                <div className="text-center py-8 sm:py-15 p-4 mb-4 sm:mb-6 rounded-lg bg-green-100 text-green-600">
                  <p className="text-2xl font-semibold mb-4">Thank you for registering to donate blood!</p>
                  <Link
                    to="/donate"
                    className="inline-block bg-[#311B08] hover:text-white text-lg text-amber-500 px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all"
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
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base bg-gray-100"
                      placeholder="Full Name"
                      value={formData.name}
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
                      name="mail"
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base bg-gray-100"
                      placeholder="Email Address"
                      value={formData.mail}
                      onChange={handleChange}
                      readOnly
                      required
                    />
                  </div>

                  {/* Phone and Blood Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base bg-gray-100"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        readOnly
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Blood Group
                      </label>
                      <input
                        type="text"
                        name="bloodGroup"
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base bg-gray-100"
                        placeholder="Blood Group"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        readOnly
                        required
                      />
                    </div>
                  </div>

                  {/* Division and District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Division (City)
                      </label>
                      <input
                        type="text"
                        name="division"
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base bg-gray-100"
                        placeholder="Division (City)"
                        value={formData.division}
                        onChange={handleChange}
                        readOnly
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        District
                      </label>
                      <input
                        type="text"
                        name="district"
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base bg-gray-100"
                        placeholder="District"
                        value={formData.district}
                        onChange={handleChange}
                        readOnly
                        required
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 sm:pt-4">
                    <button
                      type="submit"
                      className="w-full bg-[#311B08] text-lg lg:text-xl font-semibold text-amber-500 hover:bg-[#EBB380] hover:text-[#311B08] p-4 rounded-lg hover:bg-opacity-90 transition-all"
                    >
                      Register Now
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Fixed width with proper constraints */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#311B08] flex-col items-center justify-center p-6 text-white overflow-hidden">
        <div className="text-center flex flex-col items-center justify-center h-full max-w-full">
          {/* Icon and Title in the same row */}
          <div className="flex items-center justify-center mb-4">
            <Heart size={60} className="text-gray-300 mr-3 flex-shrink-0" />
            <h1 className="text-2xl xl:text-3xl font-bold text-amber-500">Donate Blood</h1>
          </div>

          {/* Description */}
          <p className="text-[1.2rem] opacity-90 leading-relaxed mx-4 text-center mb-4">
            Your blood donation can save lives and provide hope to families in crisis.
            Join our community of life-savers and make a difference with every donation.
          </p>

          {/* Image with no extra spacing */}
          <div className="w-[85%] h-[65%] flex items-center justify-center">
            <img
              src="/blood.png"
              alt="Blood Donation"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Description at the bottom */}
          <p className="text-[1.2rem] opacity-90 leading-relaxed mx-6 text-center mt-4">
            Be a hero in someone's story. Every drop counts when it comes to saving lives and giving hope.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonateBlood;
