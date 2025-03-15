import React, { useState, useEffect } from "react";
import { Book } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link for navigation

const Safeguard = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [newsArticles, setNewsArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleArticles, setVisibleArticles] = useState(3); // Number of articles to show initially
  const [visibleVideos, setVisibleVideos] = useState(3); // Number of videos to show initially

  // Check if the user is an admin
  const isAdmin = localStorage.getItem("role") === "admin";

  // Fetch news articles
  const fetchNewsArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/articles");
      if (!response.ok) {
        throw new Error("Failed to fetch news articles");
      }
      const data = await response.json();
      setNewsArticles(data.newsArticle || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch videos
  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/show-videos");
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      const data = await response.json();
      setVideos(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "news") {
      fetchNewsArticles();
    } else if (activeTab === "videos") {
      fetchVideos();
    }
  }, [activeTab]);

  // Handle "Browse more" button click
  const handleBrowseMore = () => {
    if (activeTab === "news") {
      setVisibleArticles((prev) => prev + 3); // Show 3 more articles
    } else if (activeTab === "videos") {
      setVisibleVideos((prev) => prev + 3); // Show 3 more videos
    }
  };

  // Handle delete article
  const handleDeleteArticle = async (articleId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete article");
      }
      // Remove the deleted article from the state
      window.alert("Vlog Deleted Successfully");
      setNewsArticles((prev) => prev.filter((article) => article.articleId !== articleId));
    } catch (err) {
      console.error("Error deleting article:", err);
      setError("Failed to delete article");
    }
  };

  // Handle delete video
  const handleDeleteVideo = async (videoId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete video");
      }
      // Remove the deleted video from the state
      window.alert("Video Deleted Successfully");
      setVideos((prev) => prev.filter((video) => video.video_id !== videoId));
    } catch (err) {
      console.error("Error deleting video:", err);
      setError("Failed to delete video");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <header className="bg-[url('/safeguard.png')] text-white py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 flex justify-center items-center gap-2">
          <Book size={45} className="text-red-500" />
          Disaster Preparedness & Safeguard
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Disaster preparedness involves proactive planning and training to minimize risks and ensure a swift response during emergencies. Effective preparedness and safeguards enhance resilience, enabling communities to recover quickly from disasters.
        </p>
      </header>

      {/* News and Videos Tabs */}
      <div className="py-8 px-6 md:px-16 text-center">
        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`py-2 px-6 rounded-lg text-lg font-medium ${
              activeTab === "news"
                ? "bg-[#311B08] text-[#EBB380]"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("news")}
          >
            News Articles
          </button>
          <button
            className={`py-2 px-6 rounded-lg text-lg font-medium ${
              activeTab === "videos"
                ? "bg-[#311B08] text-[#EBB380]"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : activeTab === "news" ? (
          <>
            {newsArticles.slice(0, visibleArticles).map((article) => (
              <div
                key={article.articleId}
                className="mx-25 flex flex-col md:flex-row items-center justify-between bg-gray-100 p-6 rounded-lg mb-6 shadow-md"
              >
                <div className="md:w-2/3 text-left">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-xl text-gray-600 line-clamp-3">
                    {article.articleDescription}
                  </p>
                  <div className="flex gap-4 mt-4">
                    <Link
                      to={`/vlog-details/${article.articleId}`} // Link to the VlogDetails page
                      className="bg-[#311B08] text-[#EBB380] text-xl py-2 px-4 rounded-lg hover:underline transition duration-300"
                    >
                      Read more
                    </Link>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteArticle(article.articleId)}
                        className="bg-red-500 text-white text-xl py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {article.files && JSON.parse(article.files).length > 0 && (
                  <img
                    src={JSON.parse(article.files)[0]} // Display the first image
                    alt="News Article"
                    className="w-48 h-32 object-cover rounded-lg mt-4 md:mt-0"
                  />
                )}
              </div>
            ))}
            {visibleArticles < newsArticles.length && (
              <button
                onClick={handleBrowseMore}
                className="px-6 py-3 rounded-lg text-xl mt-6 bg-[#311B08] text-[#EBB380] font-medium hover:underline"
              >
                Browse more
              </button>
            )}
          </>
        ) : (
          <>
            <div className="mx-25 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.slice(0, visibleVideos).map((video) => (
                <div
                  key={video.video_id}
                  className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                        video.video_link
                      )}/0.jpg`}
                      alt="Video Thumbnail"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h4 className="text-xl font-semibold text-[#311B08] mb-3">
                    {video.title}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {video.description}
                  </p>
                  <div className="flex gap-4">
                    <a
                      href={video.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 bg-[#311B08] text-[#EBB380] py-2 px-6 rounded-lg hover:underline transition duration-300"
                    >
                      View
                    </a>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteVideo(video.video_id)}
                        className="mt-2 bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {visibleVideos < videos.length && (
              <button
                onClick={handleBrowseMore}
                className="px-6 py-3 rounded-lg text-xl mt-6 bg-[#311B08] text-[#EBB380] font-medium hover:underline"
              >
                Browse more →
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default Safeguard;