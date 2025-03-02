import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { X, AlertTriangle } from "lucide-react"; // Import the close icon and AlertTriangle

function DisasterPostDetail() {
  const { post_id } = useParams(); // Extract post_id from the URL
  const navigate = useNavigate();
  const [post, setPost] = useState(null); // State to store the fetched post
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedImage, setSelectedImage] = useState(null); // Selected image for modal
  const [userRole, setUserRole] = useState(""); // State to store user role
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({
    title: "",
    district: "",
    division: "",
    description: "",
  }); // State for form data

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
        const districtNames = response.data.data.map((item) => item.district);
        setDistricts(districtNames);
      })
      .catch((error) => console.error("Error fetching districts:", error));
  };

  // Fetch post details from the backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // Fetch role from localStorage

    if (!token) {
      console.error("No token found, redirecting to login...");
      navigate("/login");
      return;
    }

    if (!post_id) {
      console.error("No post_id found in URL, redirecting to /alerts...");
      navigate("/alerts");
      return;
    }

    if (role) {
      setUserRole(role); // Set user role from localStorage
    }

    // Fetch post details
    axios
      .get(`http://localhost:8000/api/user/posts/${post_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("API Response:", response.data); // Debugging
        if (response.data.user_post) {
          setPost(response.data.user_post);
          setFormData({
            title: response.data.user_post.title,
            district: response.data.user_post.district,
            division: response.data.user_post.division,
            description: response.data.user_post.description,
          });
          // Fetch districts for the current division
          fetchDistricts(response.data.user_post.division);
          setLoading(false);
        } else {
          setError("Post data not found in response");
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

  // Handle delete post
  const handleDelete = () => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8000/api/disaster-posts/${post_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        navigate("/alerts"); // Redirect to alerts page after deletion
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        setError("Failed to delete post");
      });
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
        setPost(response.data.user_post); // Update the post state with new data
        setIsEditing(false); // Exit edit mode
        window.location.reload(); // Reload the page to reflect changes
      })
      .catch((error) => {
        console.error("Error updating post:", error);
        setError("Failed to update post");
      });
  };

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    window.location.reload(); // Reload the page to reset the form
  };

  // Handle donate button click
  const handleDonate = () => {
    navigate("/donate"); // Redirect to the donation page
  };

  // Handle errors
  if (error) return <div className="px-12 py-8 text-red-500">{error}</div>;

  // Show loading state
  if (loading) return <div className="px-12 py-8">Loading...</div>;

  // Redirect to alerts page if no post is found after loading
  if (!loading && !post) {
    console.log("No post found, redirecting to /alerts...");
    navigate("/alerts");
    return null;
  }

  // Parse images correctly
  let images = [];
  try {
    images = post.files ? JSON.parse(post.files.replace(/\\/g, "")) : [];
  } catch (e) {
    console.error("Error parsing images:", e);
    images = [];
  }
  console.log("Parsed images:", images); // Debugging

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <header className="bg-[url('/details.png')] text-white py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 flex justify-center items-center gap-2">
          <AlertTriangle size={45} className="text-amber-500" />
          Disaster Briefings
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Stay informed about recent disasters and emergencies. Check alerts, provide assistance,
          and help affected communities recover. Together, we can make a difference.
        </p>
      </header>

      <div className="mx-18 my-20 h-full bg-white text-black px-4 md:px-10">
        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-12">
          {/* Image Container */}
          <div className="flex-grow lg:w-1/2">
            <div className="w-full">
              {images.length > 0 && (
                <img
                  src={images[0]}
                  alt="Main Image"
                  className="w-full h-auto max-h-[500px] object-cover rounded-lg cursor-pointer"
                  onClick={() => openModal(images[0])} // Open modal with the main image
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
                    onClick={() => openModal(image)} // Open modal with the clicked image
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex-grow lg:w-1/2 p-4">
            {isEditing ? (
              // Edit Form
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-2xl font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="text-lg my-2 w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-2xl font-medium text-gray-700">
                    Division
                  </label>
                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleDivisionChange}
                    className="text-lg my-2 w-full p-2 border border-gray-300 rounded-lg"
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
                  <label className="block text-2xl font-medium text-gray-700">
                    District
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    className="text-lg my-2 w-full p-2 border border-gray-300 rounded-lg"
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
                <div>
                  <label className="block text-2xl font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="text-lg my-2 w-full p-2 border border-gray-300 rounded-lg"
                    rows="4"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-500 text-lg font-semibold text-white px-4 py-2 rounded-lg hover:bg-green-900 transition duration-300"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-lg font-semibold text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // Display Post Details
              <>
                <h1 className="text-3xl lg:text-5xl font-bold mb-4">{post.title}</h1>
                <p className="text-xl lg:text-2xl text-gray-700 mb-6">
                  <strong>Location:</strong> {post.district}, {post.division}
                </p>
                <p className="text-xl lg:text-2xl text-gray-700 mb-6">
                  <strong>Time:</strong> {post.event_time}, {post.event_date}
                </p>
                <p className="text-xl lg:text-2xl text-gray-700 mb-6">
                  <strong>Description:</strong>
                </p>
                <p className="text-lg lg:text-xl text-gray-700 text-justify">
                  {post.description}
                </p>

                {/* Admin Buttons */}
                {userRole === "admin" && (
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-green-500 text-xl font-semibold text-white px-8 py-2 rounded-lg hover:bg-green-900 transition duration-300"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-500 text-xl font-semibold text-white px-8 py-2 rounded-lg hover:bg-red-900 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* Donate Button for Users */}
                {userRole === "user" && (
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handleDonate}
                      className="bg-[#311B08] text-xl font-semibold text-[#EBB380] px-8 py-2 rounded-lg hover:underline transition duration-300"
                      >
                      Donate
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
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
                <X size={24} className="text-gray-800" /> {/* Close icon */}
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