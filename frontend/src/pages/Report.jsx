import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

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
  const navigate = useNavigate(); // Initialize useNavigate

  const token = localStorage.getItem("token"); // Check if the user is logged in

  useEffect(() => {
    if (token) {
      axios.get("https://corsproxy.io/?https://bdapis.com/api/v1.2/divisions")
        .then((response) => setDivisions(response.data.data))
        .catch((error) => console.error("Error fetching divisions:", error));
    }
  }, [token]);

  const fetchDistricts = (division) => {
    axios.get(`https://corsproxy.io/?https://bdapis.com/api/v1.2/division/${division}`)
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, files });

    // Generate image previews
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
      await axios.post("/api/create-post", data, {
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
      setImagePreviews([]); // Clear image previews after submission
    } catch (error) {
      setMessage("Failed to report incident. Please try again.");
      console.error(error);
    }
    setLoading(false);
  };

  // If the user is not logged in, display a message within a card
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#311B08] h-100 max-w-200 w-full text-center flex flex-col justify-center">
    <p className="text-2xl font-bold text-gray-900 mb-4">
            You need to be logged in to report a disaster.
          </p>
          <button
            onClick={() => navigate("/login")} // Redirect to the login page
            className="mx-67 w-50 bg-[#311B08] text-[#EBB380] font-semibold px-6 py-2 rounded-lg hover:bg-amber-600 hover:text-white transition-all"
          >
            Log In
          </button>
          <p className="mt-4 text-gray-600 font-semibold">
            Don't have an account?{" "}
            <span
              className="text-amber-600 cursor-pointer hover:underline"
              onClick={() => navigate("/register")} // Redirect to the registration page
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden bg-gray-100">
      <div className="layout-container flex h-full grow flex-col items-center py-10">
        {/* Wider Card Container */}
        <div className="w-[780px] max-w-[1024px] py-5 border border-amber-900 rounded-xl shadow-lg bg-white p-8">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-[32px] font-bold leading-tight text-gray-900">Report an Incident</p>
          </div>

          {message && <p className="text-center text-red-500">{message}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="text-lg font-bold px-4 pb-2">Title</label>
            <input type="text" name="title" className="form-input w-full rounded-xl bg-gray-100 h-14 p-[15px] text-base" placeholder="Title" value={formData.title} onChange={handleChange} required />

            <label className="text-lg font-bold px-4 pb-2 mt-4">Description</label>
            <textarea name="description" className="form-input w-full resize-none rounded-xl bg-gray-100 p-[15px] text-base min-h-36" placeholder="Describe the incident" value={formData.description} onChange={handleChange} required></textarea>

            <label className="text-lg font-bold px-4 pb-2 mt-4">Location</label>
            <div className="flex gap-4">
              <select name="division" className="w-full rounded-xl bg-gray-100 h-14 p-[15px] text-base" value={formData.division} onChange={handleChange} required>
                <option value="" disabled>Select Division</option>
                {divisions.map((division, index) => (
                  <option key={index} value={division.division}>
                    {division.division}
                  </option>
                ))}
              </select>

              <select name="district" className="w-full rounded-xl bg-gray-100 h-14 p-[15px] text-base disabled:bg-gray-300" value={formData.district} onChange={handleChange} required disabled={!formData.division}>
                <option value="" disabled>Select District</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <label className="text-lg font-bold px-4 pb-2 mt-4">Date and Time</label>
            <div className="flex gap-4">
              <input type="date" name="event_date" className="form-input flex-1 rounded-xl bg-gray-100 h-14 p-[15px] text-base" value={formData.event_date} onChange={handleChange} />
              <input type="time" name="event_time" className="form-input flex-1 rounded-xl bg-gray-100 h-14 p-[15px] text-base" value={formData.event_time} onChange={handleChange} />
            </div>

            <label className="text-lg font-bold px-4 pb-2 mt-4">Upload Evidence</label>
            <div className="px-4 py-3 flex justify-center">
              <label className="w-full cursor-pointer">
                <div className="border-2 border-dashed border-amber-900 bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-amber-600 font-medium">Drag & Drop or Click to Upload</p>
                  <input type="file" name="files" multiple accept="image/*, video/*, audio/*" className="hidden" onChange={handleFileChange} />
                </div>
              </label>
            </div>

            {/* Image Previews */}
            <div className="flex flex-wrap gap-4 mt-4">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img src={src} alt="preview" className="h-24 w-24 object-cover rounded-lg" />
                  <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">✕</button>
                </div>
              ))}
            </div>

            <div className="flex px-4 py-5 justify-center">
              <button type="submit" disabled={loading} className="text-white flex w-[220px] h-14 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-amber-900 to-amber-600 text-lg font-bold hover:scale-105 transition-all">
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;