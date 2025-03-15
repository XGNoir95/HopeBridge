import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Book } from "lucide-react"; // Import the book icon

const VlogDetails = () => {
  const { id } = useParams(); // Extract the article ID from the URL
  const navigate = useNavigate();
  const [article, setArticle] = useState(null); // State to store the fetched article
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({
    title: "",
    articleDescription: "",
    files: [],
  }); // State for form data

  // Check if the user is an admin
  const isAdmin = localStorage.getItem("role") === "admin";

  // Fetch article details from the backend
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/articles/${id}`);
        if (response.data.success && response.data.newsArticle) {
          // Extract the first article from the array (since the API returns an array)
          setArticle(response.data.newsArticle[0]);
          setFormData({
            title: response.data.newsArticle[0].title,
            articleDescription: response.data.newsArticle[0].articleDescription,
            files: response.data.newsArticle[0].files,
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
      console.log("Sending update request with data:", formData); // Debugging
      const response = await axios.post(
        `/api/articles/${id}/update`,
        {
          title: formData.title,
          articleDescription: formData.articleDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Update response:", response.data); // Debugging
  
      if (response.data.success) {
        // Update the article state with the new data
        setArticle(response.data.newsArticle);
        setIsEditing(false); // Exit edit mode
        alert("Vlog updated successfully!"); // Notify the user
      } else {
        setError("Failed to update vlog");
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
      files: article.files,
    });
  };

  // Parse images correctly
  let images = [];
  try {
    images = article?.files ? JSON.parse(article.files.replace(/\\/g, "")) : [];
  } catch (e) {
    console.error("Error parsing images:", e);
    images = [];
  }

  // Handle errors
  if (error) return <div className="px-12 py-8 text-red-500">{error}</div>;

  // Show loading state
  if (loading) return <div className="px-12 py-8">Loading...</div>;

  // Redirect if no article is found after loading
  if (!loading && !article) {
    console.log("No article found, redirecting to /safeguard...");
    navigate("/safeguard");
    return null;
  }

  return (
    <div className="bg-white min-h-screen">
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

      {/* Vlog Details Section */}
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
                    Description
                  </label>
                  <textarea
                    name="articleDescription"
                    value={formData.articleDescription}
                    onChange={handleInputChange}
                    className="text-lg my-2 w-full p-2 border border-gray-300 rounded-lg"
                    rows="4"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-500 text-white text-xl font-semibold px-6 py-2 rounded-lg hover:bg-green-900"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white text-xl font-semibold px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // Display Article Details
              <>
                <h1 className="text-3xl lg:text-5xl font-bold mb-8">{article.title}</h1>
                <p className="text-2xl lg:text-2xl text-gray-700 mb-1">
                  <strong>About this vlog:</strong>
                </p>
                <p className="text-2xl lg:text-xl text-gray-700 text-justify">
                  {article.articleDescription}
                </p>

                {/* Buttons */}
                <div className="flex gap-4 mt-6">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-green-500 text-white text-xl font-semibold px-6 py-2 rounded-lg hover:bg-green-900"
                      >
                        Update Vlog
                      </button>
                      <button
                        onClick={() => navigate("/safeguard")}
                        className="bg-[#311B08] text-[#EBB380] text-xl font-semibold px-6 py-2 rounded-lg hover:underline"
                      >
                        Back to Safeguard
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => navigate("/safeguard")}
                      className="bg-[#311B08] text-[#EBB380] text-xl font-semibold px-6 py-2 rounded-lg hover:underline"
                    >
                      Back to Safeguard
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VlogDetails;