import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [formData, setFormData] = useState({
    userName: "",
    userMail: "",
    password: "",
    confirmPassword: "",
    userPhone: "",
    blood_group: "",
    city: "", // This will store division
    district: "", // This will store district
  });

  // Valid blood groups list
  const validBloodGroups = [
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
  ];

  // Fetch divisions on component mount
  useEffect(() => {
    axios
      .get("https://bdapi.vercel.app/api/v.1/division")
      .then((response) => {
        setDivisions(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching divisions:", error);
      });
  }, []);

  // Fetch districts when city (division) changes
  const fetchDistricts = (divisionId) => {
    axios
      .get(`https://bdapi.vercel.app/api/v.1/district/${divisionId}`)
      .then((response) => {
        setDistricts(response.data.data);
        setFormData(prev => ({ ...prev, district: "" })); // Reset district when division changes
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If city (division) changes, fetch districts
    if (name === "city") {
      const selectedDivision = divisions.find(div => div.name === value);
      if (selectedDivision) {
        fetchDistricts(selectedDivision.id);
      }
    }
  };

  const validateBloodGroup = (bloodGroup) => {
    return validBloodGroups.includes(bloodGroup.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    console.log("Form submission started"); // Debug log

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate blood group
    if (!validateBloodGroup(formData.blood_group)) {
      setError("Please enter a valid blood group (A+, A-, B+, B-, AB+, AB-, O+, O-).");
      return;
    }

    try {
      console.log("Sending registration request..."); // Debug log
      
      const response = await axios.post("http://localhost:8000/api/register", {
        userName: formData.userName,
        userMail: formData.userMail,
        password: formData.password,
        userPhone: formData.userPhone,
        blood_group: formData.blood_group.toUpperCase(),
        district: formData.district, // District value
        city: formData.city, // Division value (stored in city field)
      });

      console.log("Registration response:", response); // Debug log

      // Check multiple success conditions
      if (response.status === 200 || response.status === 201 || response.data?.success) {
        console.log("Registration successful, navigating to login..."); // Debug log
        setSuccess("Registration successful! Redirecting to login...");
        
        // Use setTimeout to ensure state update and then navigate
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 100);
        
      } else {
        console.log("Registration failed:", response.data); // Debug log
        setError(response.data?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err); // Debug log
      console.error("Error response:", err.response); // Debug log
      
      if (err.response?.status === 201) {
        // Sometimes 201 is thrown as an error
        console.log("Registration successful (201), navigating to login..."); // Debug log
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 100);
      } else {
        setError(err.response?.data?.message || "An error occurred during registration. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white px-8 py-12 rounded-3xl border border-gray-300 shadow-lg h-auto w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-[#311B08] text-center">Create an Account</h1>
      <p className="font-medium text-xl text-gray-500 mt-4 text-center">Enter your details to sign up.</p>
      
      <form onSubmit={handleSubmit} className="mt-8">
        {/* Grid Layout for Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="text-lg font-semibold text-gray-700">Full Name</label>
            <input
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-[#311B08] focus:border-transparent transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="text-lg font-medium text-gray-700">Email</label>
            <input
              name="userMail"
              type="email"
              value={formData.userMail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-[#311B08] focus:border-transparent transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-lg font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-[#311B08] focus:border-transparent transition-all"
              placeholder="Create a password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-lg font-medium text-gray-700">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-[#311B08] focus:border-transparent transition-all"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-lg font-medium text-gray-700">Phone</label>
            <input
              name="userPhone"
              type="tel"
              value={formData.userPhone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-[#311B08] focus:border-transparent transition-all"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="text-lg font-medium text-gray-700">Blood Group</label>
            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-[#311B08] focus:border-transparent transition-all"
              required
            >
              <option value="" disabled>Select Blood Group</option>
              {validBloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* City (Division) */}
          <div>
            <label className="text-lg font-medium text-gray-700">City (Division)</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-[#311B08] focus:border-transparent transition-all"
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

          {/* District */}
          <div>
            <label className="text-lg font-medium text-gray-700">District</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-[#311B08] focus:border-transparent transition-all disabled:bg-gray-200"
              required
              disabled={!formData.city}
            >
              <option value="" disabled>Select District</option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-[#311B08] text-amber-500 hover:bg-[#EBB380] hover:text-[#311B08] text-xl font-bold p-4 rounded-xl transition-all"
          >
            Sign Up
          </button>
        </div>

        {/* Login Link */}
        <div className="text-lg mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#311B08] cursor-pointer hover:underline font-bold"
            >
              Sign in
            </span>
          </p>
        </div>
      </form>

      {error && (
        <div className="text-red-500 text-center mt-4 p-3 bg-red-50 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="text-green-600 text-center mt-4 p-3 bg-green-50 rounded-lg">
          <p>{success}</p>
        </div>
      )}
    </div>
  );
}
