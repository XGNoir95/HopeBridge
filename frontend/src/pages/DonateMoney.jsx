import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

const DonateMoney = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    amount: "",
    method: "",
  });

  const [userId, setUserId] = useState(null); // State to store the user ID
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

        // Decode the token to get the user ID
        const decodedToken = jwtDecode(token);
        const userIdFromToken = decodedToken.uid; // Assuming `uid` is the key for user_id in the token

        if (!userIdFromToken) {
          throw new Error("User ID not found in token");
        }

        // Set the user ID
        setUserId(userIdFromToken);

        // Fetch user data from the API
        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update formData with the user's name, email, and phone
        setFormData((prevData) => ({
          ...prevData,
          fullName: response.data.userName,
          email: response.data.userMail,
          phone: response.data.userPhone, // Assuming the API returns the phone number
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
        id: userId, // Include the user ID in the payload
        amount: formData.amount,
        paymentMethod: formData.method, // Map `method` to `paymentMethod`
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#311B08] h-100 max-w-200 w-full text-center flex flex-col justify-center">
          <p className="text-2xl font-bold text-gray-900 mb-4">
            You need to be logged in to make a donation.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mx-67 w-50 bg-[#311B08] text-[#EBB380] font-semibold px-6 py-2 rounded-lg hover:bg-amber-600 hover:text-white transition-all"
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
        Donate Money
      </h2>
      <p className="text-center mb-6 text-[#5A3A22]">
        Choose your preferred payment method to support relief efforts.
      </p>
      <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#FFFFFF] to-[#F9F5F0] p-8 rounded-2xl shadow-2xl border border-[#EBB380]">
        {message ? (
          <div className="text-center">
            <p className="text-green-600 font-semibold mb-4 text-2xl">
              {message}
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
              name="fullName"
              placeholder="Full Name"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              value={formData.fullName}
              onChange={handleChange}
              readOnly // Make the field non-editable
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              value={formData.email}
              onChange={handleChange}
              readOnly // Make the field non-editable
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount (TK)"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <select
              name="method"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              value={formData.method}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Payment Method
              </option>
              <option value="bkash">Bkash</option>
              <option value="nagad">Nagad</option>
              <option value="credit">Credit Card</option>
              <option value="rocket">Rocket</option>
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
                disabled={loading}
                className="w-1/2 bg-[#311B08] text-white p-4 rounded-xl hover:bg-[#4a2c12] transition-transform transform hover:scale-105"
              >
                {loading ? "Processing..." : "Donate Now"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DonateMoney;