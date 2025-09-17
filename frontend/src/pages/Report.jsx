import React, { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReportIncident = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    division: "",
    district: "",
    event_date: "",
    event_time: "",
    files: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios.get("https://bdapi.vercel.app/api/v.1/division")
        .then((response) => {
          setDivisions(response.data.data);
        })
        .catch((error) => console.error("Error fetching divisions:", error));
    }
  }, [token]);

  const fetchDistricts = (divisionId) => {
    axios.get(`https://bdapi.vercel.app/api/v.1/district/${divisionId}`)
      .then((response) => {
        setDistricts(response.data.data);
      })
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "division") {
      const selectedDivision = divisions.find(div => div.name === value);
      if (selectedDivision) {
        setFormData({ ...formData, division: value, district: "" });
        fetchDistricts(selectedDivision.id);
      }
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const updatedFiles = formData.files.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData({ ...formData, files: updatedFiles });
    setImagePreviews(updatedPreviews);
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

    const formattedTime = formData.event_time ? `${formData.event_time}:00` : "";

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "files") {
        formData.files.forEach((file) => data.append("files[]", file));
      } else if (key === "event_time") {
        data.append("event_time", formattedTime);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await axios.post("http://localhost:8000/api/create-post", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Incident reported successfully!");
      setFormData({
        title: "",
        description: "",
        division: "",
        district: "",
        event_date: "",
        event_time: "",
        files: [],
      });
      setImagePreviews([]);
    } catch (error) {
      setMessage("Failed to report incident. Please try again.");
      console.error(error);
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="flex min-h-screen">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden lg:flex lg:w-[40%] bg-[#311B08] flex-col items-center justify-center p-8 text-white">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
            <p className="text-lg opacity-90">
              Welcome back! Please log in to report a disaster and help your community.
            </p>
            <p className="text-sm opacity-75">
              Login to access your account and contribute to disaster relief efforts.
            </p>
          </div>
        </div>

        {/* Right Content - Full width on mobile, 60% on desktop */}
        <div className="w-full lg:w-[60%] flex items-center justify-center bg-gray-50 p-4 lg:p-8">
          <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              You need to be logged in to report a disaster.
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
    <div className="flex min-h-screen">
      {/* Left Sidebar - Hidden on mobile and tablet, visible on large screens */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#311B08] flex-col items-center justify-center p-8 text-white">
        <div className="text-center space-y-6 flex flex-col items-center justify-center h-full">
          {/* Icon and Title in the same row */}
          <div className="flex items-center justify-center mb-6">
            <Megaphone size={80} className="text-gray-300 mr-4" />
            <h1 className="text-3xl xl:text-4xl font-bold text-amber-500">Report Incident</h1>
          </div>
          {/* Description at the bottom */}
<p className="text-lg xl:text-xl opacity-90 leading-relaxed mx-8 text-center">
  Report incidents and connect with emergency responders in your area.
  Together we build stronger communities ready to face any crisis.
</p>


          {/* Image in the center with specified dimensions */}
          <img
            src="/login.png"
            alt="Disaster Relief"
            className="w-[85%] h-[65%] object-cover rounded-lg mb-6"
          />

          {/* Description at the bottom */}
          <p className="text-lg xl:text-xl opacity-90 leading-relaxed mx-8 text-center">
            Join thousands of community heroes making a difference one report at a time to bridge the gap between danger and safety.
          </p>

        </div>
      </div>

      {/* Right Form Section - Full width on mobile, 60% on desktop */}
      <div className="w-full lg:w-[55%] bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto">

            {/* Mobile header - only visible on small screens */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center mb-3">
                <Megaphone size={50} className="text-amber-500" />
              </div>
              <h1 className="text-3xl font-bold text-[#311B08] mb-3">Report Incident</h1>
              <p className="text-lg text-gray-600 px-2">
                Document and report disaster-related incidents to facilitate emergency response.
              </p>
            </div>

            {/* Back arrow and Create report header */}
            <div className="flex items-center mb-6 lg:mb-8">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="mt-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h2 className="text-xl lg:text-[1.7rem] font-bold text-[#311B08]">Create your report</h2>
            </div>

            {message && (
              <div className={`text-center p-3 mb-6 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              {/* Title */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base"
                  placeholder="Enter incident title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors resize-none text-base"
                  placeholder="Describe the incident in detail"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    name="division"
                    className="px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base"
                    value={formData.division}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Division</option>
                    {divisions.map((division) => (
                      <option key={division.id} value={division.name}>
                        {division.name}
                      </option>
                    ))}
                  </select>

                  <select
                    name="district"
                    className="px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors disabled:bg-gray-100 text-base"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    disabled={!formData.division}
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

              {/* Date and Time */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Date and Time
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="date"
                    name="event_date"
                    className="px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base"
                    value={formData.event_date}
                    onChange={handleChange}
                  />
                  <input
                    type="time"
                    name="event_time"
                    className="px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base"
                    value={formData.event_time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Upload Evidence
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 lg:p-6 text-center hover:border-[#311B08] transition-colors">
                  <label className="cursor-pointer">
                    <div className="space-y-2">
                      <svg className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 text-sm lg:text-base">
                        <span className="font-medium text-[#311B08]">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">PNG, JPG, MP4 up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      name="files"
                      multiple
                      accept="image/*, video/*, audio/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={src}
                          alt="preview"
                          className="w-full h-16 lg:h-20 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#311B08] text-lg font-semibold text-amber-500 font-semibold py-2 lg:py-4 px-4 lg:px-6 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;
