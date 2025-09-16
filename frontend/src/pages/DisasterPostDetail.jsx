import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { X, AlertTriangle, MapPin, Calendar, Edit2, Trash2, Heart } from "lucide-react";

function DisasterPostDetail() {
  const { post_id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    district: "",
    division: "",
    description: "",
  });

  // State for divisions and districts
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Fetch divisions from the API
  useEffect(() => {
    axios
      .get("https://bdapis.com/api/v1.2/divisions")
      .then((response) => setDivisions(response.data.data))
      .catch((error) => console.error("Error fetching divisions:", error));
  }, []);

  // Fetch districts based on the selected division
  const fetchDistricts = (division) => {
    axios
      .get(`https://bdapis.com/api/v1.2/division/${division}`)
      .then((response) => {
        console.log("District API Response:", response.data);
        const data = response.data.data;

        const districtNames = Array.isArray(data)
          ? data.map((item) => item.district)
          : Object.values(data).map((item) => item.district);

        setDistricts(districtNames);
      })
      .catch((error) => console.error("Error fetching districts:", error));
  };

  // Fetch post details from the backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !post_id) {
      navigate("/login");
      return;
    }

    if (role) {
      setUserRole(role);
    }

    axios
      .get(`http://localhost:8000/api/user/posts/${post_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        if (response.data.user_post) {
          const postData = response.data.user_post[0];
          setPost(postData);
          setFormData({
            title: postData.title,
            district: postData.district,
            division: postData.division,
            description: postData.description,
          });
          fetchDistricts(postData.division);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching post details:", error);
        setError("Failed to load post details");
        setLoading(false);
      });
  }, [post_id, navigate]);

  // Handle division change
  const handleDivisionChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, division: value, district: "" });
    fetchDistricts(value);
  };

  // Handle district change
  const handleDistrictChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, district: value });
  };

  // Handle delete post
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const token = localStorage.getItem("token");
      axios
        .delete(`http://localhost:8000/api/disaster-posts/${post_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          navigate("/alerts");
        })
        .catch((error) => {
          console.error("Error deleting post:", error);
          setError("Failed to delete post");
        });
    }
  };

  // Handle donate button click
  const handleDonate = () => {
    navigate("/donate");
  };

  // Open modal with the selected image
  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission for updating post
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .post(`http://localhost:8000/api/disaster-posts/${post_id}/update`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Post updated successfully:", response.data);
        setPost(response.data.user_post);
        setIsEditing(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating post:", error);
        setError("Failed to update post");
      });
  };

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    window.location.reload();
  };

  // Handle errors
  if (error) return <div className="px-12 py-8 text-red-500">{error}</div>;

  // Show loading state
  if (loading || !post) return <div className="px-12 py-8">Loading...</div>;

  // Parse images
  let images = [];
  try {
    images = post.files ? JSON.parse(post.files) : [];
  } catch (e) {
    console.error("Error parsing images:", e);
    images = [];
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <header className="bg-[url('/login3.png')] text-white py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 flex justify-center items-center gap-2">
          <AlertTriangle size={45} className="text-amber-500" />
          Disaster Briefings
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Stay informed about recent disasters and emergencies.
        </p>
      </header>

      <div className="mx-18 my-20 h-full bg-white text-black px-4 md:px-10">
        {/* ========== TOP SECTION: IMAGES ========== */}
        <div className="px-4 md:px-12 mb-12">
          <div className="w-full">
            {images.length > 0 && (
              <img
                src={images[0]}
                alt="Main Image"
                className="w-full h-auto max-h-[500px] object-cover rounded-lg cursor-pointer"
                onClick={() => openModal(images[0])}
              />
            )}
          </div>
          {/* Additional Images */}
          {images.length > 1 && (
            <div className="flex gap-4 mt-4">
              {images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-lg cursor-pointer border border-gray-300"
                  onClick={() => openModal(image)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ========== BOTTOM SECTION: DETAILS (IMPROVED) ========== */}
        <div className="px-4 md:px-12">
          {isEditing ? (
            // Edit Form - Improved
            <div className="bg-gray-100 border border-gray-800 p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-extrabold text-[#311B08] mb-6 flex items-center gap-3">
                <Edit2 size={32} />
                Edit Disaster Report
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xl font-bold text-gray-800 mb-3">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xl font-bold text-gray-800 mb-3">
                      Division
                    </label>
                    <select
                      name="division"
                      value={formData.division}
                      onChange={handleDivisionChange}
                      className="w-full p-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300"
                      required
                    >
                      <option value="" disabled>Select Division</option>
                      {divisions.map((division, index) => (
                        <option key={index} value={division.division}>
                          {division.division}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xl font-bold text-gray-800 mb-3">
                      District
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleDistrictChange}
                      className="w-full p-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300"
                      required
                      disabled={!formData.division}
                    >
                      <option value="" disabled>Select District</option>
                      {districts.map((district, index) => (
                        <option key={index} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xl font-bold text-gray-800 mb-3">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300"
                    rows="6"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-[#311B08] text-amber-500 text-xl px-10 py-3 rounded-xl font-semibold hover:underline transition-colors duration-300"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white text-xl px-10 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // Display Post Details - Improved
            <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
              {/* Title Section */}
              <div className="p-8 pb-4 border-b border-gray-300">
                <h1 className="text-3xl lg:text-[2.5rem] font-extrabold text-[#311B08] mb-4">
                  {post.title}
                </h1>
              </div>

              {/* Info Cards Section */}
              <div className="p-8 bg-gray-50">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Location Card */}
                  <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-3 bg-[#311B08] rounded-lg">
                        <MapPin size={22} className="text-amber-500" />
                      </div>
                      <h3 className="text-[1.7rem] font-bold text-[#311B08]">Location</h3>
                    </div>
                    <p className="text-[1.3rem] text-gray-700 mb-2">
                      {post.district}, {post.division}
                    </p>
                  </div>

                  {/* Time Card */}
                  <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-3 bg-[#311B08] rounded-lg">
                        <Calendar size={22} className="text-amber-500" />
                      </div>
                      <h3 className="text-[1.7rem] font-bold text-[#311B08]">Date & Time</h3>
                    </div>
                    <p className="text-[1.3rem] font-bold text-gray-700">
                      {post.event_date}
                    </p>
                    <p className="text-lg text-gray-700 mb-2">
                      {post.event_time}
                    </p>
                  </div>
                </div>

                {/* Description Section */}
                <div className="bg-white border border-gray-300 p-8 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#311B08] rounded-lg">
                      <AlertTriangle size={22} className="text-amber-500" />
                    </div>
                    <h3 className="text-[1.7rem] font-bold text-[#311B08]">Description</h3>
                  </div>
                  <p className="text-[1.3rem] text-gray-700 leading-relaxed text-justify">
                    {post.description}
                  </p>
                </div>

              </div>

              {/* Action Buttons Section */}
              <div className="p-8 bg-white border-t border-gray-200">
                {userRole === "admin" && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-[#311B08] text-amber-500 text-xl px-10 py-4 rounded-xl font-semibold hover:underline transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <Edit2 size={20} />
                      Update
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 bg-red-500 text-white text-xl px-10 py-4 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={20} />
                      Delete
                    </button>
                  </div>
                )}

                {userRole === "user" && (
                  <button
                    onClick={handleDonate}
                    className="w-full bg-[#311B08] text-amber-500 font-bold text-xl px-8 py-4 rounded-xl font-semibold hover:underline transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <Heart size={20} />
                    Donate Now
                  </button>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Modal for full-screen image view */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute -top-10 right-0 bg-white p-2 rounded-full hover:bg-gray-200 transition duration-300"
              >
                <X size={24} className="text-gray-800" />
              </button>
              {/* Display the selected image */}
              <img
                src={selectedImage}
                alt="Full Screen"
                className="object-cover rounded-lg max-w-[90vw] max-h-[90vh]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DisasterPostDetail;
