import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode// For decoding the JWT token

const DonateBlood = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    phone: "",
    bloodGroup: "",
    division: "", // City data will be displayed here
    district: "",
    gender: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check if the user is logged in

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          throw new Error("No token found in localStorage");
        }

        // Fetch user data from the API
        const response = await axios.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });

        // Update formData with the user's data
        setFormData((prevData) => ({
          ...prevData,
          name: response.data.userName,
          mail: response.data.userMail,
          phone: response.data.userPhone,
          bloodGroup: response.data.blood_group,
          division: response.data.city, // City data is displayed as division
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

    // Check if the user is logged in
    if (!token) {
      alert("You need to log in to register for blood donation.");
      navigate("/login"); // Redirect to the login page
      return;
    }

    try {
      // Decode the JWT token to get the user_id
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.uid; // Assuming `uid` is the key for user_id in the token

      // Prepare the payload for the API request
      const payload = {
        id: userId, // Pass the user_id from the token
        division: formData.division,
        district: formData.district,
        gender: formData.gender,
      };

      // Send the data to the backend
      const response = await axios.post(
        "/api/create-donor",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        }
      );

      if (response.data.success) {
        setIsSubmitted(true); // Show success message
      } else {
        setError("Failed to submit donation. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError("An error occurred. Please check your input and try again.");
    }
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
            {error && <p className="text-red-500 text-center">{error}</p>}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              readOnly // Make the field non-editable
              required
            />
            <input
              type="email"
              name="mail"
              placeholder="Email Address"
              value={formData.mail}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              readOnly // Make the field non-editable
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              readOnly // Make the field non-editable
              required
            />
            <input
              type="text"
              name="bloodGroup"
              placeholder="Blood Group"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              readOnly // Make the field non-editable
              required
            />
            <input
              type="text"
              name="division"
              placeholder="Division (City)"
              value={formData.division}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              readOnly // Make the field non-editable
              required
            />
            <input
              type="text"
              name="district"
              placeholder="District"
              value={formData.district}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              readOnly // Make the field non-editable
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
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