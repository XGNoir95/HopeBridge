import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

function Alerts() {
  const [disasterPosts, setDisasterPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

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

  useEffect(() => {
    if (selectedDivision) {
      const divisionId = divisions.find(div => div.name === selectedDivision)?.id;
      if (divisionId) {
        axios
          .get(`https://bdapi.vercel.app/api/v.1/district/${divisionId}`)
          .then((response) => {
            setDistricts(response.data.data);
          })
          .catch((error) => {
            console.error("Error fetching districts:", error);
          });
      }
    }
  }, [selectedDivision, divisions]);

  const filteredPosts = disasterPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDivision = selectedDivision ? post.division === selectedDivision : true;
    const matchesDistrict = selectedDistrict ? post.district === selectedDistrict : true;
    return matchesSearch && matchesDivision && matchesDistrict;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white min-h-screen">
      <header className="bg-[url('/login3.png')] text-white py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 flex justify-center items-center gap-2">
          <AlertTriangle size={45} className="text-red-500" />
          Disaster Alerts & Updates
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Stay informed about recent disasters and emergencies. Check alerts, provide assistance,
          and help affected communities recover. Together, we can make a difference.
        </p>
      </header>

      <div className="container mx-auto p-6">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center">
          <input
            type="text"
            placeholder="Search for Disaster Alerts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-2/3 lg:w-3/4 p-3 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          />

          <select
            className="p-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setSelectedDistrict("");
            }}
          >
            <option value="">Select Division</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.name}>
                {division.name}
              </option>
            ))}
          </select>

          <select
            className="p-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedDivision}
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        {/* Display Disaster Posts */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.length === 0 ? (
            <p className="text-center text-gray-500">No disaster posts found.</p>
          ) : (
            filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/disaster-posts/${post.post_id}`}
                className="bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between border-2 border-gray-200"
              >
                <h2 className="text-2xl font-bold text-amber-900 text-center">{post.title}</h2>
                <p className="text-lg text-gray-600 mt-2 line-clamp-3">
                  <strong>Description: </strong>
                  {post.description.length > 150 ? `${post.description.slice(0, 150)}...` : post.description}
                </p>
                <p className="text-lg text-gray-600 mt-2">
                  <strong>Location:</strong> {post.district}, {post.division}
                </p>
                {post.files && (
                  <div className="mt-4">
                    {(() => {
                      try {
                        const images = JSON.parse(post.files.replace(/\\/g, ""));
                        return (
                          <>
                            <img
                              src={images[0]}
                              alt="Disaster"
                              className="w-full h-48 object-cover rounded-md"
                              key={`${post.id}-main`}
                            />
                            {images.length > 1 && (
                              <div className="flex gap-2 mt-2">
                                {images.slice(1, 9).map((file, index) => (
                                  <img
                                    key={`${post.id}-${index}`}
                                    src={file}
                                    alt="Additional"
                                    className="w-16 h-16 object-cover rounded-md"
                                  />
                                ))}
                              </div>
                            )}
                          </>
                        );
                      } catch (e) {
                        console.error("Error parsing images:", e);
                        return null;
                      }
                    })()}
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Alerts;