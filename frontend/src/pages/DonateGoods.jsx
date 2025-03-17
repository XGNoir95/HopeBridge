//Donate Goods

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import data from "../data.json";

const DonateGoods = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    itemDescription: "",
    quantity: "",
    pickUpLocation: "", // Renamed from district to pickUpLocation
  });
  const [error, setError] = useState(null);
  const [districts, setDistricts] = useState([]); // State for districts

  // Fetch user data and districts on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve the JWT token from localStorage using the correct key
        const token = localStorage.getItem("token"); // Use "token" as the key
        if (!token) {
          throw new Error("No token found in localStorage");
        }

        // Fetch user data from the API
        const response = await axios.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });

        // Update formData with the user's name and email
        setFormData((prevData) => ({
          ...prevData,
          name: response.data.userName,
          mail: response.data.userMail,
        }));

        // Use static data for districts
        const allDistricts = data.divisions
        .flatMap((division) => division.districts)
        .sort((a, b) => a.localeCompare(b)); // Sort alphabetically
        setDistricts(allDistricts);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again.");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("Submitting form with data:", formData);

    try {
      const response = await axios.post(
        "/api/create-resources",
        formData
      );
      console.log("API Response:", response.data);
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

  return (
    <div className="bg-gradient-to-r from-[#F9F5F0] to-[#F0E6D8] min-h-screen py-16 px-4">
      <h2 className="text-4xl font-bold text-center mb-8 text-[#311B08]">
        Donate Goods
      </h2>
      <p className="text-center mb-6 text-[#5A3A22]">
        Provide essential goods to those in need by filling the form below.
      </p>
      <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#FFFFFF] to-[#F9F5F0] p-8 rounded-2xl shadow-2xl border border-[#EBB380]">
        {isSubmitted ? (
          <div className="text-center">
            <p className="text-green-600 font-semibold mb-4 text-2xl">
              Thank you for donating goods!
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
            />
            <input
              type="email"
              name="mail"
              placeholder="Email Address"
              value={formData.mail}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              readOnly // Make the field non-editable
            />
            <input
              type="text"
              name="itemDescription"
              placeholder="Item Description"
              value={formData.itemDescription}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              required
            />
            {/* District Dropdown (renamed as Pickup Location) */}
            <select
              name="pickUpLocation"
              value={formData.pickUpLocation}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              required
            >
              <option value="" disabled>Select Pickup Location</option>
              {districts.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
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
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DonateGoods;