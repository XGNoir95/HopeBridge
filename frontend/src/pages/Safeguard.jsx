import React, { useState, useEffect } from "react";
import { Book, Play, Eye, Trash2, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Safeguard = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [newsArticles, setNewsArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleArticles, setVisibleArticles] = useState(6);
  const [visibleVideos, setVisibleVideos] = useState(6);

  // Admin authentication check
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

  // API Functions
  const fetchNewsArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/articles");
      if (!response.ok) {
        throw new Error("Failed to fetch news articles");
      }
      const data = await response.json();
      
      // Sort articles by newest first
      const sortedArticles = (data.newsArticle || []).sort((a, b) => {
        const dateA = new Date(a.created_at || a.updated_at);
        const dateB = new Date(b.created_at || b.updated_at);
        return dateB - dateA;
      });
      
      setNewsArticles(sortedArticles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/show-videos");
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      const data = await response.json();
      
      // Sort videos by newest first
      const sortedVideos = (data || []).sort((a, b) => {
        const dateA = new Date(a.created_at || a.updated_at);
        const dateB = new Date(b.created_at || b.updated_at);
        return dateB - dateA;
      });
      
      setVideos(sortedVideos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Data fetching on tab change
  useEffect(() => {
    if (activeTab === "news") {
      fetchNewsArticles();
    } else if (activeTab === "videos") {
      fetchVideos();
    }
  }, [activeTab]);

  // Pagination Functions
  const handleBrowseMore = () => {
    if (activeTab === "news") {
      setVisibleArticles((prev) => prev + 6);
    } else if (activeTab === "videos") {
      setVisibleVideos((prev) => prev + 6);
    }
  };

  // Delete Functions
  const handleDeleteArticle = async (articleId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/api/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete article");
      }
      window.alert("Article Deleted Successfully");
      setNewsArticles((prev) => prev.filter((article) => article.articleId !== articleId));
    } catch (err) {
      setError("Failed to delete article");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/api/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete video");
      }
      window.alert("Video Deleted Successfully");
      setVideos((prev) => prev.filter((video) => video.video_id !== videoId));
    } catch (err) {
      setError("Failed to delete video");
    }
  };

  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
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

      <div className="container mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              className={`px-10 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                activeTab === "news"
                  ? "bg-[#311B08] text-amber-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("news")}
            >
              News Articles
            </button>
            <button
              className={`px-10 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                activeTab === "videos"
                  ? "bg-[#311B08] text-amber-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("videos")}
            >
              Educational Videos
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="text-center text-gray-600 py-12">Loading content...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <>
            {/* News Articles Section */}
            {activeTab === "news" ? (
              <section className="mb-10">
                <h2 className="mx-1 text-4xl font-extrabold text-gray-800 mb-6">Latest Articles:</h2>
                {newsArticles.slice(0, visibleArticles).length === 0 ? (
                  <p className="text-center text-gray-600 font-semibold text-2xl">No articles found.</p>
                ) : (
                  <div className="space-y-6">
                    {newsArticles.slice(0, visibleArticles).map((article) => (
                      <div
                        key={article.articleId}
                        className="bg-gray-100 p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                      >
                        <div className="flex flex-col md:flex-row items-start justify-between gap-6 h-full">
                          {/* Article Content - Added flex column and justify-between */}
                          <div className="md:w-2/3 flex flex-col justify-between h-full">
                            <div className="flex-grow">
                              <h3 className="font-bold text-gray-800 text-2xl mb-2">
                                {article.title}
                              </h3>
                              <div className="flex items-center gap-2 mb-3 text-lg text-gray-600">
                                <Clock size={20} className="text-amber-600 " />
                                <span>{getRelativeTime(article.created_at || article.updated_at)}</span>
                              </div>
                              <p className="text-gray-600 text-lg mb-4 line-clamp-3">
                                {article.articleDescription}
                              </p>
                            </div>
                            
                            {/* Action Buttons - This will always be at the bottom */}
                            <div className="flex gap-4 mt-auto">
                              <Link
                                to={`/vlog-details/${article.articleId}`}
                                className="bg-[#311B08] text-[#EBB380] px-5 py-2 rounded-xl text-lg font-semibold hover:underline transition-colors duration-300 flex items-center gap-2"
                              >
                                <Eye size={18} />
                                Read Article
                              </Link>
                              {isAdmin && (
                                <button
                                  onClick={() => handleDeleteArticle(article.articleId)}
                                  className="bg-red-500 text-white px-5 py-2 rounded-xl text-lg font-semibold hover:bg-red-600 transition-colors duration-300 flex items-center gap-2"
                                >
                                  <Trash2 size={18} />
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Article Image */}
                          {article.files && JSON.parse(article.files).length > 0 && (
                            <div className="md:w-1/3 overflow-hidden rounded-xl">
                              <img
                                src={JSON.parse(article.files)[0]}
                                alt="News Article"
                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Load More Button for Articles */}
                {visibleArticles < newsArticles.length && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleBrowseMore}
                      className="bg-[#311B08] text-amber-500 px-8 py-4 rounded-xl font-semibold hover:underline text-lg transition-colors duration-300"
                    >
                      Load More Articles
                    </button>
                  </div>
                )}
              </section>
            ) : (
              /* Videos Section */
              <section className="mb-10">
                <h2 className="mx-6 text-3xl font-extrabold text-gray-800 mb-6">Educational Videos:</h2>
                {videos.slice(0, visibleVideos).length === 0 ? (
                  <p className="text-center text-gray-600 font-semibold text-2xl">No videos found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.slice(0, visibleVideos).map((video) => (
                      <div
                        key={video.video_id}
                        className="bg-gray-100 p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group flex flex-col h-full"
                      >
                        {/* Video Thumbnail */}
                        <div className="w-full h-48 bg-gray-300 rounded-xl mb-4 overflow-hidden">
                          <img
                            src={`https://img.youtube.com/vi/${getYouTubeVideoId(video.video_link)}/0.jpg`}
                            alt="Video Thumbnail"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        
                        {/* Video Content - Added flex-grow */}
                        <div className="flex-grow flex flex-col">
                          <h4 className="font-bold text-gray-800 text-xl mb-2">
                            {video.title}
                          </h4>
                          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                            <Clock size={16} className="text-amber-600" />
                            <span>{getRelativeTime(video.created_at || video.updated_at)}</span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                            {video.description}
                          </p>
                          
                          {/* Video Action Buttons - mt-auto pushes to bottom */}
                          <div className="flex gap-4 mt-auto">
                            <a
                              href={video.video_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#311B08] text-[#EBB380] px-5 py-2 rounded-xl text-lg font-semibold hover:underline transition-colors duration-300 flex items-center gap-2 flex-1 justify-center"
                            >
                              <Play size={18} />
                              Watch
                            </a>
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteVideo(video.video_id)}
                                className="bg-red-500 text-white px-5 py-2 rounded-xl text-lg font-semibold hover:bg-red-600 transition-colors duration-300 flex items-center justify-center"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Load More Button for Videos */}
                {visibleVideos < videos.length && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleBrowseMore}
                      className="bg-[#311B08] text-amber-500 px-8 py-4 rounded-xl font-semibold hover:underline text-lg transition-colors duration-300"
                    >
                      Load More Videos
                    </button>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Safeguard;
