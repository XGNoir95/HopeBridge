import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DisasterPosts() {
  const [disasterPosts, setDisasterPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from local storage:", localStorage.getItem("token"));

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Disaster Posts</h1>
      {disasterPosts.length === 0 ? (
        <p>No disaster posts found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {disasterPosts.map((post) => (
            <div key={post.id} className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600 mt-2">{post.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Location:</strong> {post.city}, {post.district}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Disaster Type:</strong> {post.disaster_type}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Status:</strong> {post.status}
              </p>
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
          ))}
        </div>
      )}
    </div>
  );
}
