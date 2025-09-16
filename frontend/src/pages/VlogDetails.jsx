import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { X, Book, Calendar, Edit2, Trash2, Eye, Clock } from "lucide-react";

const VlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    articleDescription: "",
  });

  // Check if the user is an admin
  const isAdmin = localStorage.getItem("role") === "admin";

  // Helper function to get relative time
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const TIMEZONE_OFFSET_MINUTES = 6 * 60;
    const rawDiffInMinutes = Math.floor((now - postDate) / (1000 * 60));
    const diffInMinutes = rawDiffInMinutes - TIMEZONE_OFFSET_MINUTES;
    
    if (diffInMinutes < 0) return 'Just published';
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
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

  // Fetch article details from the backend
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8000/api/articles/${id}`);
        if (response.data.success && response.data.newsArticle) {
          const articleData = response.data.newsArticle[0];
          setArticle(articleData);
          setFormData({
            title: articleData.title,
            articleDescription: articleData.articleDescription,
          });
        } else {
          setError("Article not found");
        }
      } catch (err) {
        console.error("Error fetching article details:", err);
        setError("Failed to load article details");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission for updating article
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:8000/api/articles/${id}/update`,
        {
          title: formData.title,
          articleDescription: formData.articleDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setArticle(response.data.newsArticle);
        setIsEditing(false);
        alert("Article updated successfully!");
      } else {
        setError("Failed to update article");
      }
    } catch (err) {
      console.error("Error updating article:", err);
      setError("Failed to update article");
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      title: article.title,
      articleDescription: article.articleDescription,
    });
  };

  // Handle delete article
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://localhost:8000/api/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate("/safeguard");
      } catch (err) {
        console.error("Error deleting article:", err);
        setError("Failed to delete article");
      }
    }
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

  // Handle errors
  if (error) return <div className="px-12 py-8 text-red-500">{error}</div>;

  // Show loading state
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#311B08] mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Loading article...</p>
      </div>
    </div>
  );

  // Redirect if no article is found after loading
  if (!loading && !article) {
    navigate("/safeguard");
    return null;
  }

  // Parse images correctly
  let images = [];
  try {
    images = article?.files ? JSON.parse(article.files.replace(/\\/g, "")) : [];
  } catch (e) {
    console.error("Error parsing images:", e);
    images = [];
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="bg-[url('/safeguard.png')] text-white py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 flex justify-center items-center gap-2">
          <Book size={45} className="text-red-500" />
          Vlog Details
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Explore the details of this vlog to gain insights and knowledge about disaster preparedness and safeguard measures.
        </p>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-8xl">
        {/* ========== TOP SECTION: IMAGES ========== */}
        <div className="mb-12">
          <div className="w-full">
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt="Main Article Image"
                className="w-full h-auto max-h-[500px] object-cover rounded-2xl cursor-pointer shadow-lg"
                onClick={() => openModal(images[0])}
              />
            ) : (
              <div className="w-full h-[400px] bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center shadow-lg">
                <Book size={80} className="text-amber-600" />
              </div>
            )}
          </div>
          {/* Additional Images */}
          {images.length > 1 && (
            <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
              {images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-xl cursor-pointer border-2 border-gray-200 hover:border-amber-400 transition-colors duration-200 flex-shrink-0"
                  onClick={() => openModal(image)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ========== BOTTOM SECTION: DETAILS ========== */}
        <div className="">
          {isEditing ? (
            // Edit Form
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-[#311B08] mb-8 flex items-center gap-3">
                <Edit2 size={32} className="text-amber-600" />
                Edit Article
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
                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xl font-bold text-gray-800 mb-3">
                    Description
                  </label>
                  <textarea
                    name="articleDescription"
                    value={formData.articleDescription}
                    onChange={handleInputChange}
                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300"
                    rows="8"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-[#311B08] text-amber-500 text-xl px-10 py-3 rounded-xl font-semibold hover:bg-amber-800 transition-colors duration-300"
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
            // Display Article Details
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              {/* Title Section */}
              <div className="p-8 pb-4 border-b border-gray-200">
                <h1 className="text-3xl lg:text-[2.5rem] font-bold text-[#311B08] mb-4">
                  {article.title}
                </h1>
              </div>

              {/* Info Cards Section */}
              <div className="p-8 bg-gray-50">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Publication Date Card */}
                  <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#311B08] rounded-lg">
                        <Calendar size={23} className="text-amber-500" />
                      </div>
                      <h3 className="text-[1.6rem] font-bold text-[#311B08]">Published</h3>
                    </div>
                    <p className="text-[1.3rem] text-gray-700">
                      {getRelativeTime(article.created_at || article.updated_at)}
                    </p>
                  </div>

                  {/* Category Card */}
                  <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#311B08] rounded-lg">
                        <Book size={23} className="text-amber-500" />
                      </div>
                      <h3 className="text-[1.6rem] font-bold text-[#311B08]">Category</h3>
                    </div>
                    <p className="text-[1.3rem] text-gray-700">Disaster Preparedness</p>
                  </div>
                </div>

                {/* Description Section */}
                <div className="bg-white border border-gray-200 p-8 py-7 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#311B08] rounded-lg">
                      <Eye size={23} className="text-amber-500" />
                    </div>
                    <h3 className="text-[1.6rem] font-bold text-[#311B08]">Article Content</h3>
                  </div>
                  <p className="text-[1.3rem] text-gray-700 leading-relaxed text-justify">
                    {article.articleDescription}
                  </p>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="p-8 bg-white border-t border-gray-200">
                {isAdmin ? (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-[#311B08] text-amber-500 text-xl px-10 py-3 rounded-xl font-semibold hover:bg-amber-800 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <Edit2 size={20} />
                      Update Article
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 bg-red-500 text-white text-xl px-10 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={20} />
                      Delete Article
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/safeguard")}
                    className="w-full bg-[#311B08] text-amber-500 text-xl px-8 py-4 rounded-xl font-semibold hover:bg-amber-800 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <Book size={20} />
                    Back to Safeguard
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
};

export default VlogDetails;
