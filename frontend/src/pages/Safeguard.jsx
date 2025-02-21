import React, { useState } from "react";

const Safeguard = () => {
  const [activeTab, setActiveTab] = useState("news");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Section with Background Image */}
      

      {/* News and Videos Tabs */}
      <div className="py-8 px-6 md:px-16 text-center">
        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`py-2 px-6 rounded-lg text-lg font-medium ${
              activeTab === "news"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("news")}
          >
            News Articles
          </button>
          <button
            className={`py-2 px-6 rounded-lg text-lg font-medium ${
              activeTab === "videos"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
        </div>

        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Discover the latest news and updates from around the country
        </h2>

        {activeTab === "news" ? (
          [1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex flex-col md:flex-row items-center justify-between bg-gray-100 p-6 rounded-lg mb-6 shadow-md"
            >
              <div className="md:w-2/3 text-left">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Hurricane Preparedness: Tips for staying safe during hurricane season
                </h3>
                <p className="text-gray-600">
                  Hurricanes are powerful and destructive storms that can pose serious risks to people, property, and infrastructure. As hurricane season approaches, it's important to be prepared and informed about how to stay safe in the event of a storm.
                </p>
                <button className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300">
                  Read more
                </button>
              </div>

              <img
                src="/safeguard-news.png"
                alt="Hurricane News"
                className="w-48 h-32 object-cover rounded-lg mt-4 md:mt-0"
              />
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((video) => (
              <div
                key={video}
                className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center"
              >
                <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-600">Video Player Placeholder</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Disaster Recovery Insights
                </h4>
                <p className="text-gray-600 text-sm">
                  Learn essential tips and techniques on how communities recover after major disasters.
                </p>
              </div>
            ))}
          </div>
        )}

        <button className="mt-6 text-orange-500 font-medium hover:underline">Browse more →</button>
      </div>

      {/* Footer Section */}
      
    </div>
  );
};

export default Safeguard;
