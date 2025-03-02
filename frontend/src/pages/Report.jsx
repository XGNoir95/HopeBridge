import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const DonateBlood = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bloodGroup: "",
    division: "",
    district: "",
    gender: "",
  });

  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get("https://bdapis.com/api/v1.2/divisions")
        .then((response) => setDivisions(response.data.data))
        .catch((error) => console.error("Error fetching divisions:", error));
    }
  }, [token]);

  const fetchDistricts = (division) => {
    axios
      .get(`https://bdapis.com/api/v1.2/division/${division}`)
      .then((response) => {
        const districtNames = response.data.data.map((item) => item.district);
        setDistricts(districtNames);
      })
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "division") {
      setFormData({ ...formData, division: value, district: "" });
      fetchDistricts(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("Authentication required!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/donate-blood",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage("Thank you for registering to donate blood!");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          bloodGroup: "",
          division: "",
          district: "",
          gender: "",
        });
      }
    } catch (error) {
      setMessage("Failed to submit the form. Please try again.");
      console.error(error);
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#311B08] h-100 max-w-200 w-full text-center flex flex-col justify-center">
          <p className="text-2xl font-bold text-gray-900 mb-4">
            You need to be logged in to register for blood donation.
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
        Donate Blood
      </h2>
      <p className="text-center mb-6 text-[#5A3A22]">
        Register for a blood donation drive near you.
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
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              value={formData.email}
              onChange={handleChange}
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
              type="text"
              name="bloodGroup"
              placeholder="Blood Group"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
            />
            <select
              name="division"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              value={formData.division}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Division
              </option>
              {divisions.map((division, index) => (
                <option key={index} value={division.division}>
                  {division.division}
                </option>
              ))}
            </select>
            <select
              name="district"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all disabled:bg-gray-300"
              value={formData.district}
              onChange={handleChange}
              required
              disabled={!formData.division}
            >
              <option value="" disabled>
                Select District
              </option>
              {districts.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <select
              name="gender"
              className="w-full p-4 rounded-xl bg-white text-[#311B08] border border-[#EBB380] focus:outline-none focus:ring-2 focus:ring-[#311B08] transition-all"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
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
                disabled={loading}
                className="w-1/2 bg-[#311B08] text-white p-4 rounded-xl hover:bg-[#4a2c12] transition-transform transform hover:scale-105"
              >
                {loading ? "Submitting..." : "Register Now"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DonateBlood;