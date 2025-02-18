import React, { useState } from "react";
import axios from "axios";

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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Authentication required!");
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "files") {
        formData.files.forEach((file) => {
          data.append("files[]", file);
        });
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
    } catch (error) {
      setMessage("Failed to report incident. Please try again.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[550px] max-w-[960px] py-5 flex-1">
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
                <input type="text" name="division" className="form-input flex-1 rounded-xl bg-gray-100 h-14 p-[15px] text-base" placeholder="Division" value={formData.division} onChange={handleChange} required />
                <input type="text" name="district" className="form-input flex-1 rounded-xl bg-gray-100 h-14 p-[15px] text-base" placeholder="District" value={formData.district} onChange={handleChange} required />
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

              {formData.files.length > 0 && (
                <div className="px-4 flex flex-wrap gap-2">
                  {formData.files.map((file, index) => (
                    <div key={index} className="w-28 h-28 border rounded-lg p-1 bg-white shadow-md">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex px-4 py-5 justify-center">
                <button type="submit" disabled={loading} className="text-white flex w-[220px] h-14 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-amber-900 to-amber-600 text-lg font-bold hover:scale-105 transition-all">
                  {loading ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;
