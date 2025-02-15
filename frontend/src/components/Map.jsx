import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const Map = () => {
  useEffect(() => {
    const disasterData = [
      { division: "Dhaka", lat: 23.8103, lng: 90.4125, type: "Flood", impact: 120 },
      { division: "Chittagong", lat: 22.3569, lng: 91.7832, type: "Cyclone", impact: 90 },
      { division: "Rajshahi", lat: 24.3636, lng: 88.6241, type: "Drought", impact: 50 },
      { division: "Khulna", lat: 22.8456, lng: 89.5403, type: "Cyclone", impact: 70 },
      { division: "Barisal", lat: 22.701, lng: 90.3535, type: "Flood", impact: 80 },
      { division: "Sylhet", lat: 24.8949, lng: 91.8687, type: "Landslide", impact: 60 },
      { division: "Rangpur", lat: 25.7439, lng: 89.2752, type: "Earthquake", impact: 30 },
      { division: "Mymensingh", lat: 24.7471, lng: 90.4203, type: "Flood", impact: 40 },
    ];

    // Initialize the map
    const map = L.map('map').setView([23.685, 90.3563], 7); // Center on Bangladesh

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
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
  }, []);

  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="text-[#311B08] font-bold text-5xl mb-4">Disaster Heatmap of Bangladesh</h1>
      <p className="text-gray-600 mb-8 text-xl">
        Visualizing disaster data across different divisions in Bangladesh.
      </p>
      <div id="map" style={{ height: '700px', width: '100%', maxWidth: '1200px' }}></div>
    </div>
  );
};

export default Map;
