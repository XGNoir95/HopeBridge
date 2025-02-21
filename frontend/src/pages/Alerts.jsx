import React, { useEffect, useState } from "react";
import axios from "axios";

function Alerts() {
  const [disasterPosts, setDisasterPosts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]); 
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(""); 

  // Fetch disaster posts from the backend
  useEffect(() => {
    const token = localStorage.getItem("token"); 
    axios
      .get("http://localhost:8000/api/disaster-posts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setDisasterPosts(response.data.disaster_posts);
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching disaster posts:", error);
        setError("Failed to load disaster posts"); 
        setLoading(false);
      });
  }, []);

  // Fetch divisions from the API
  useEffect(() => {
    axios
      .get("https://bdapis.com/api/v1.2/divisions")
      .then((response) => {
        setDivisions(response.data.data); // Set divisions
      })
      .catch((error) => {
        console.error("Error fetching divisions:", error);
      });
  }, []);

  // Fetch districts based on selected division
  useEffect(() => {
    if (selectedDivision) {
      axios
        .get(`https://bdapis.com/api/v1.2/division/${selectedDivision}`)
        .then((response) => {
          const districtNames = response.data.data.map((item) => item.district);
          setDistricts(districtNames); // Set districts
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
        });
    }
  }, [selectedDivision]);

  // Filter disaster posts based on search query, division, and district
  const filteredPosts = disasterPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDivision = selectedDivision ? post.division === selectedDivision : true;
    const matchesDistrict = selectedDistrict ? post.district === selectedDistrict : true;
    return matchesSearch && matchesDivision && matchesDistrict;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Alerts</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Division and District Dropdowns */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Division</label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setSelectedDistrict(""); // Reset district when division changes
            }}
          >
            <option value="">Select Division</option>
            {divisions.map((division, index) => (
              <option key={index} value={division.division}>
                {division.division}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">District</label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedDivision}
          >
            <option value="">Select District</option>
            {districts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display Disaster Posts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.length === 0 ? (
          <p>No disaster posts found.</p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p className="text-gray-600 mt-2"><strong>Description: </strong>{post.description}</p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Location:</strong> {post.district}, {post.division}
              </p>
              {/* <p className="text-sm text-gray-500 mt-2">
                <strong>Disaster Type:</strong> {post.disaster_type}
              </p> */}
              {/* <p className="text-sm text-gray-500 mt-2">
                <strong>Status:</strong> {post.status}
              </p> */}
              {post.files && (
                <div className="mt-4">
                  {JSON.parse(post.files).map((file, index) => (
                    <img
                      key={index}
                      src={file}
                      alt="Disaster"
                      className="w-full h-40 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Alerts;