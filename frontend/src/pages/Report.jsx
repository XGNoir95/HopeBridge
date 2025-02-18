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
    setFormData({ ...formData, files: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token"); // Ensure token is stored
    if (!token) {
      setMessage("Authentication required!");
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "files") {
        Array.from(formData.files).forEach((file) => {
          data.append("files[]", file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post("http://localhost:8000/api/create-post", data, {
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
    <div>
      <h2>Report an Incident</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="text" name="division" placeholder="Division" value={formData.division} onChange={handleChange} required />
        <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} required />
        <input type="date" name="event_date" value={formData.event_date} onChange={handleChange} />
        <input type="time" name="event_time" value={formData.event_time} onChange={handleChange} />
        <input type="file" name="files" multiple accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
      </form>
    </div>
  );
};

export default ReportIncident;
