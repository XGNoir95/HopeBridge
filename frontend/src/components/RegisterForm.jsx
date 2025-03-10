import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import axios from "axios";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    userName: "",
    userMail: "",
    password: "",
    confirmPassword: "",
    userPhone: "",
    blood_group: "",
    district: "",
    city: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        userName: formData.userName,
        userMail: formData.userMail,
        password: formData.password,
        userPhone: formData.userPhone,
        blood_group: formData.blood_group,
        district: formData.district,
        city: formData.city,
      });

      if (response.status === 200 || response.data.success) {
        // setSuccess("Registration successful! Redirecting to login...");
        // setTimeout(() => {
        //    // Redirect to login page after 2 seconds
        // }, 2000);
        navigate("/login");
      } else {
        setError(response.data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="bg-white px-12 py-20 rounded-3xl border border-gray-300 shadow-lg h-auto w-[500px] max-w-lg">
      <h1 className="text-4xl font-semibold text-[#311B08]">Create an Account</h1>
      <p className="font-medium text-lg text-gray-500 mt-4">Enter your details to sign up.</p>
      <div className="mt-8">
        {page === 1 ? (
          <>
            <div>
              <label className="text-lg font-medium text-gray-700">Full Name</label>
              <input
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-violet-500 transition-all"
                placeholder="Enter your full name"
              />
            </div>
            <div className="mt-4">
              <label className="text-lg font-medium text-gray-700">Email</label>
              <input
                name="userMail"
                value={formData.userMail}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-violet-500 transition-all"
                placeholder="Enter your email"
              />
            </div>
            <div className="mt-4">
              <label className="text-lg font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-violet-500 transition-all"
                placeholder="Create a password"
              />
            </div>
            <div className="mt-4">
              <label className="text-lg font-medium text-gray-700">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-violet-500 transition-all"
                placeholder="Confirm your password"
              />
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setPage(2)}
                className="bg-[#311B08] text-white text-lg font-bold py-3 px-4 rounded-xl transition-all flex items-center gap-2"
              >
                Next <FaArrowRight />
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-lg font-medium text-gray-700">Phone</label>
              <input
                name="userPhone"
                value={formData.userPhone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-violet-500 transition-all"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="mt-4">
              <label className="text-lg font-medium text-gray-700">Blood Group</label>
              <input
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-violet-500 transition-all"
                placeholder="Enter your blood group"
              />
            </div>
            <div className="mt-4">
              <label className="text-lg font-medium text-gray-700">District</label>
              <input
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-violet-500 transition-all"
                placeholder="Enter your district"
              />
            </div>
            <div className="mt-4">
              <label className="text-lg font-medium text-gray-700">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-violet-500 transition-all"
                placeholder="Enter your city"
              />
            </div>
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setPage(1)}
                className="bg-gray-400 text-white text-lg font-bold py-3 px-4 rounded-xl transition-all flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#EBB380] text-[#311B08] hover:bg-[#311B08] hover:text-[#EBB380] text-lg font-bold py-3 px-4 rounded-xl transition-all"
              >
                Sign Up
              </button>
            </div>
          </>
        )}
      </div>
      {error && (
        <div className="text-red-500 text-center mt-4">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="text-green-600 text-center mt-4">
          <p>{success}</p>
        </div>
      )}
    </div>
  );
}