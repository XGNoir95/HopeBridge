import React, { useState, useEffect } from "react";
import axios from "axios";

const Volunteers = () => {
  const [formData, setFormData] = useState({
    volunteerName: "",
    volunteerMail: "",
    blood_group: "",
    division: "",
    district: "",
  });

  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch divisions from API
  useEffect(() => {
    axios
      .get("https://bdapis.com/api/v1.2/divisions")
      .then((response) => setDivisions(response.data.data))
      .catch((error) => {
        console.error("Error fetching divisions:", error);
        setMessage("Failed to fetch divisions. Please try again later.");
      });
  }, []);

  // Fetch districts from API
  const fetchDistricts = (division) => {
    axios
      .get(`https://bdapis.com/api/v1.2/division/${division}`)
      .then((response) => {
        const districtNames = response.data.data.map((item) => item.district);
        setDistricts(districtNames);
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
        setMessage("Failed to fetch districts. Please try again later.");
      });
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

    try {
      // Simulate API call for submission
      console.log("Form Submitted", formData);
      setMessage("Volunteer registration successful!");
      setFormData({
        volunteerName: "",
        volunteerMail: "",
        blood_group: "",
        division: "",
        district: "",
      });
    } catch (error) {
      setMessage("Failed to register. Please try again.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden bg-gray-100">
      <div className="layout-container flex h-full grow flex-col items-center py-10">
        {/* Wider Card Container */}
        <div className="w-full md:w-[780px] max-w-[1024px] py-5 border border-amber-900 rounded-xl shadow-lg bg-white p-4 md:p-8">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-2xl md:text-[32px] font-bold leading-tight text-gray-900 text-center md:text-left">
              Join as a Volunteer
            </p>
          </div>

          {message && <p className="text-center text-green-500">{message}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="text-lg font-bold px-4 pb-2">Name</label>
            <input
              type="text"
              name="volunteerName"
              className="form-input w-full rounded-xl bg-gray-100 h-12 md:h-14 p-3 md:p-[15px] text-base"
              placeholder="Enter your name"
              value={formData.volunteerName}
              onChange={handleChange}
              required
            />

            <label className="text-lg font-bold px-4 pb-2 mt-4">Email</label>
            <input
              type="email"
              name="volunteerMail"
              className="form-input w-full rounded-xl bg-gray-100 h-12 md:h-14 p-3 md:p-[15px] text-base"
              placeholder="Enter your email"
              value={formData.volunteerMail}
              onChange={handleChange}
              required
            />

            <label className="text-lg font-bold px-4 pb-2 mt-4">Blood Group</label>
            <input
              type="text"
              name="blood_group"
              className="form-input w-full rounded-xl bg-gray-100 h-12 md:h-14 p-3 md:p-[15px] text-base"
              placeholder="Enter your blood group"
              value={formData.blood_group}
              onChange={handleChange}
              required
            />

            <label className="text-lg font-bold px-4 pb-2 mt-4">Location</label>
            <div className="flex flex-col md:flex-row gap-4">
              <select
                name="division"
                className="w-full rounded-xl bg-gray-100 h-12 md:h-14 p-3 md:p-[15px] text-base"
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
                className="w-full rounded-xl bg-gray-100 h-12 md:h-14 p-3 md:p-[15px] text-base disabled:bg-gray-300"
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
            </div>

            <div className="flex px-4 py-5 justify-center">
              <button
                type="submit"
                disabled={loading}
                className="text-white flex w-full md:w-[220px] h-12 md:h-14 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-amber-900 to-amber-600 text-lg font-bold hover:scale-105 transition-all"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Volunteers;