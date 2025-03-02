import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const Map = () => {
  const [disasterData, setDisasterData] = useState([]);

  useEffect(() => {
    const fetchDisasterData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/disaster-posts/RedZone');
        const data = await response.json();

        console.log("Received API Response:", data);

        if (data.success && data.disasterData) {
          const postCounts = JSON.parse(data.disasterData);
          console.log("Parsed Post Counts:", postCounts);

          const updatedDisasterData = [
            { division: "Dhaka", lat: 23.8103, lng: 90.4125, impact: postCounts["Dhaka"] || 0 },
            { division: "Chattogram", lat: 22.3569, lng: 91.7832, impact: postCounts["Chattogram"] || 0 },
            { division: "Rajshahi", lat: 24.3636, lng: 88.6241, impact: postCounts["Rajshahi"] || 0 },
            { division: "Khulna", lat: 22.8456, lng: 89.5403, impact: postCounts["Khulna"] || 0 },
            { division: "Barishal", lat: 22.701, lng: 90.3535, impact: postCounts["Barishal"] || 0 },
            { division: "Sylhet", lat: 24.8949, lng: 91.8687, impact: postCounts["Sylhet"] || 0 },
            { division: "Rangpur", lat: 25.7439, lng: 89.2752, impact: postCounts["Rangpur"] || 0 },
            { division: "Mymensingh", lat: 24.7471, lng: 90.4203, impact: postCounts["Mymensingh"] || 0 },
          ];

          console.log("Updated Disaster Data:", updatedDisasterData);
          setDisasterData(updatedDisasterData);
        } else {
          console.error("Invalid API response format", data);
        }
      } catch (error) {
        console.error("Error fetching disaster data:", error);
      }
    };

    fetchDisasterData();
  }, []);

  useEffect(() => {
    if (disasterData.length === 0) return;

    // Initialize the map
    const map = L.map('map').setView([23.685, 90.3563], 7); // Center on Bangladesh

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© Adnan Shahriar',
    }).addTo(map);

    // Prepare heatmap data
    const heatmapData = disasterData.map((disaster) => [
      disaster.lat,
      disaster.lng,
      disaster.impact,
    ]);

    // Add heatmap layer
    L.heatLayer(heatmapData, {
      radius: 70,
      blur: 30,
      maxZoom: 13,
     // minOpacity: 0.1,
    }).addTo(map);

    // Add markers for each division
    disasterData.forEach((disaster) => {
      L.marker([disaster.lat, disaster.lng])
        .bindPopup(`<b>${disaster.division}</b><br>Disaster: ${disaster.type}<br>Impact Level: ${disaster.impact}`)
        .addTo(map);
    });

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, [disasterData]);

  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="text-[#311B08] font-bold text-5xl mb-4">Disaster Heatmap of Bangladesh</h1>
      <p className="text-gray-600 mb-8 text-xl">
        Visualizing disaster data across different divisions in Bangladesh.
      </p>
      <div id="map" style={{ height: '700px', width: '100%', maxWidth: '1200px', borderRadius: '10px', overflow: 'hidden' }}></div>
    </div>
  );
};

export default Map;
