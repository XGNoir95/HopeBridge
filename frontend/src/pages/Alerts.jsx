import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, Filter, Heart, MapPin, Clock, Eye } from "lucide-react";
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
        // Sort by newest first
        const sortedPosts = response.data.disaster_posts.sort((a, b) => {
          const dateA = new Date(a.created_at || a.updated_at);
          const dateB = new Date(b.created_at || b.updated_at);
          return dateB - dateA;
        });
        
        setDisasterPosts(sortedPosts);
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

  // Helper function to get relative time (e.g., "2 hours ago")
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours-6} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    
    return postDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
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
        {/* Search and Filters with Filter Icon */}
        <div className="mt-4 mb-8">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-2">
              <Filter size={35} className="text-amber-600 mr-1" />
              <span className="text-4xl font-bold text-[#311B08]">Filter & Search</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input - spans 2 columns on large screens */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search for Disaster Alerts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-lg"
              />
            </div>

            {/* Division Filter */}
            <div>
              <select
                className="text-lg w-full p-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
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
            </div>

            {/* District Filter */}
            <div>
              <select
                className="text-lg w-full p-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
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
          </div>
        </div>

        {/* Display Disaster Posts */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              <AlertTriangle size={64} className="mx-auto mb-4 text-amber-800" />
              <p className="text-2xl">No disaster posts found.</p>
              <p className="text-lg mt-2">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 group"
              >
                {/* Image Section */}
                {post.files && (
                  <div className="relative h-56 overflow-hidden">
                    {(() => {
                      try {
                        const images = JSON.parse(post.files.replace(/\\/g, ""));
                        return (
                          <div className="relative">
                            <img
                              src={images[0]}
                              alt="Disaster"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            {images.length > 1 && (
                              <div className="absolute bottom-3 right-3 bg-[#311B08]/80 text-amber-400 text-sm px-3 py-1 rounded-full font-medium">
                                +{images.length - 1} more
                              </div>
                            )}
                          </div>
                        );
                      } catch (e) {
                        return (
                          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                            <AlertTriangle size={48} className="text-amber-600" />
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}

                {/* Content Section */}
                <div className="p-6">
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-[#311B08] mb-3 line-clamp-2 leading-tight">
                    {post.title}
                  </h2>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 mb-4 text-lg text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={20} className="text-amber-600" />
                      <span>{getRelativeTime(post.created_at || post.updated_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={20} className="text-amber-600" />
                      <span>{post.district}, {post.division}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-gray-700 mb-6 line-clamp-3 leading-relaxed">
                    {post.description.length > 120 ? `${post.description.slice(0, 120)}...` : post.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      to={`/disaster-posts/${post.post_id}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold transition-all duration-200 text-center flex items-center justify-center gap-2 group"
                    >
                      <Eye size={20} />
                      <span>View Details</span>
                    </Link>
                    <Link
                      to="/donate"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 text-center flex items-center justify-center gap-2 shadow-md"
                    >
                      <Heart size={20} />
                      <span>Donate</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Alerts;
