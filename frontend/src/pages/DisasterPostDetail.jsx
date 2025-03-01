import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react"; // Import the close icon

function DisasterPostDetail() {
  const { post_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(location.state?.post || null);
  const [loading, setLoading] = useState(!location.state?.post);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Track the selected image for the modal

  useEffect(() => {
    if (!post) {
      const token = localStorage.getItem("token");
      axios
        .get(`http://localhost:8000/api/user/posts/${post_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setPost(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching post details:", error);
          setError("Failed to load post details");
          setLoading(false);
        });
    }
  }, [post_id, post]);

  const openModal = (image) => {
    setSelectedImage(image); // Set the selected image
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedImage(null); // Reset the selected image
  };

  if (error) return <div className="px-12 py-8 text-red-500">{error}</div>;
  if (!post) {
    navigate("/alerts");
    return null;
  }

  const images = post.files ? JSON.parse(post.files) : [];

  return (
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
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">
            {post.title}
          </h1>
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
  );
}

export default DisasterPostDetail;