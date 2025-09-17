import React, { useEffect, useState, useCallback, useRef } from "react";
import { MapPinIcon, MapPin, Loader, Check, Filter, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Shelter = () => {
  // ========== STATE MANAGEMENT ==========
  const [userLocation, setUserLocation] = useState(null);
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [shelters, setShelters] = useState([]);
  const [allShelters, setAllShelters] = useState([]);
  const [loadingShelters, setLoadingShelters] = useState(false);
  const [selectedFacilityTypes, setSelectedFacilityTypes] = useState([]);
  const [facilitiesByType, setFacilitiesByType] = useState({});
  const [map, setMap] = useState(null);
  const [highlightedMarker, setHighlightedMarker] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  
  // ========== REFS FOR MAP MANAGEMENT ==========
  const mapInitialized = useRef(false);
  const mapContainerRef = useRef(null);
  const isMounted = useRef(true);
  const navigate = useNavigate();
  
  // ========== FACILITY TYPES CONFIGURATION ==========
  const facilityTypes = [
    { key: 'hospital', label: 'Hospitals', color: '#dc2626' },
    { key: 'clinic', label: 'Medical Clinics', color: '#e11d48' },
    { key: 'fire_station', label: 'Fire Stations', color: '#f59e0b' },
    { key: 'police', label: 'Police Stations', color: '#3b82f6' },
    { key: 'community_centre', label: 'Emergency Shelters', color: '#10b981' },
    { key: 'hotel', label: 'Hotels', color: '#8b5cf6' },
    { key: 'hostel', label: 'Hostels', color: '#6366f1' },
    { key: 'school', label: 'Schools (Shelters)', color: '#7c3aed' }
  ];

  // ========== MAP INITIALIZATION ==========
  const initializeMap = useCallback(() => {
    if (mapInitialized.current || !mapContainerRef.current || !isMounted.current) return;
    
    try {
      const newMap = L.map(mapContainerRef.current).setView([23.685, 90.3563], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(newMap);
      
      if (isMounted.current) {
        setMap(newMap);
        mapInitialized.current = true;
      }
    } catch (error) {
      console.error("Map initialization error:", error);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    
    const timer = setTimeout(() => {
      if (isMounted.current) {
        initializeMap();
      }
    }, 100);

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
      if (map) {
        try {
          map.remove();
        } catch (error) {
          console.warn("Error removing map:", error);
        }
        setMap(null);
        mapInitialized.current = false;
      }
    };
  }, []);

  // ========== GEOLOCATION HANDLING ==========
  const getCurrentLocation = useCallback(() => {
    if (!isMounted.current) return;
    
    setLoadingLocation(true);
    
    if (!navigator.geolocation) {
      setLoadingLocation(false);
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (isMounted.current) {
          const location = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(location);
          setLoadingLocation(false);
          if (map) map.setView([location.lat, location.lng], 15);
        }
      },
      (error) => {
        if (isMounted.current) {
          setLoadingLocation(false);
          console.error("Geolocation error:", error);
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              alert("Location access denied. Please enable location permissions and try again.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information unavailable. Please check your GPS/location services.");
              break;
            case error.TIMEOUT:
              alert("Location request timed out. Please try again.");
              break;
            default:
              alert("Unable to get your location. Please check your browser settings and try again.");
              break;
          }
        }
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000,
        maximumAge: 60000 
      }
    );
  }, [map]);

  const confirmAndSearch = useCallback(async () => {
    if (!isMounted.current || !userLocation) return;
    
    setLocationConfirmed(true);
    await searchShelters(userLocation.lat, userLocation.lng);
  }, [userLocation]);

  // ========== FACILITY DATA PROCESSING ==========
  const getFacilityName = useCallback((element) => {
    const tags = element.tags || {};
    if (tags.name) return tags.name;
    if (tags.brand) return tags.brand;
    
    const amenity = tags.amenity;
    if (amenity === 'hospital') return 'Medical Hospital';
    if (amenity === 'clinic') return 'Medical Clinic';
    if (amenity === 'fire_station') return 'Fire Station';
    if (amenity === 'police') return 'Police Station';
    if (amenity === 'community_centre') return 'Emergency Shelter';
    if (amenity === 'school') return 'School/Shelter';
    if (tags.tourism === 'hotel') return 'Hotel';
    if (tags.tourism === 'hostel') return 'Hostel';
    
    return null;
  }, []);

  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // ========== API SEARCH FUNCTIONALITY - FIXED ==========
  const searchShelters = useCallback(async (lat, lng) => {
    if (!isMounted.current) return;
    
    setLoadingShelters(true);
    
    const overpassQuery = `
      [out:json][timeout:30];
      (
        node["amenity"~"^(hospital|clinic|fire_station|police|community_centre|school)$"](around:6000,${lat},${lng});
        node["tourism"~"^(hotel|hostel)$"](around:6000,${lat},${lng});
        way["amenity"~"^(hospital|clinic|fire_station|police|community_centre|school)$"](around:6000,${lat},${lng});
        way["tourism"~"^(hotel|hostel)$"](around:6000,${lat},${lng});
      );
      out center;
    `.trim();

    // Use GET request for better reliability
    const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(overpassQuery);

    try {
      const response = await axios.get(url, { timeout: 35000 });

      if (!isMounted.current) return;

      if (response.data.elements?.length > 0) {
        const shelterData = response.data.elements
          .map(element => {
            const lon = element.lon || element.center?.lon;
            const lat_el = element.lat || element.center?.lat;
            const facilityName = getFacilityName(element);
            
            if (!lon || !lat_el || !facilityName) return null;
            
            const facilityType = element.tags?.amenity || element.tags?.tourism || 'facility';
            const distance = calculateDistance(lat, lng, lat_el, lon);
            
            return {
              id: `${lon}_${lat_el}_${Date.now()}_${Math.random()}`,
              geometry: { coordinates: [lon, lat_el] },
              properties: {
                name: facilityName,
                type: facilityType,
                distance: distance.toFixed(1)
              }
            };
          })
          .filter(Boolean)
          .sort((a, b) => parseFloat(a.properties.distance) - parseFloat(b.properties.distance))
          .slice(0, 80);

        const grouped = shelterData.reduce((acc, facility) => {
          const type = facility.properties.type;
          if (!acc[type]) acc[type] = [];
          acc[type].push(facility);
          return acc;
        }, {});

        if (isMounted.current) {
          setAllShelters(shelterData);
          setShelters(shelterData);
          setFacilitiesByType(grouped);
          updateMapMarkersWithTypes(lat, lng, shelterData, []);
        }
      } else {
        if (isMounted.current) {
          alert("No facilities found within 6km radius. Try searching in a different area.");
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      
      // Fallback to POST request if GET fails
      try {
        const responsePost = await axios.post('https://overpass-api.de/api/interpreter', overpassQuery, {
          headers: { 'Content-Type': 'text/plain' },
          timeout: 35000
        });

        if (!isMounted.current) return;

        if (responsePost.data.elements?.length > 0) {
          const shelterData = responsePost.data.elements
            .map(element => {
              const lon = element.lon || element.center?.lon;
              const lat_el = element.lat || element.center?.lat;
              const facilityName = getFacilityName(element);
              
              if (!lon || !lat_el || !facilityName) return null;
              
              const facilityType = element.tags?.amenity || element.tags?.tourism || 'facility';
              const distance = calculateDistance(lat, lng, lat_el, lon);
              
              return {
                id: `${lon}_${lat_el}_${Date.now()}_${Math.random()}`,
                geometry: { coordinates: [lon, lat_el] },
                properties: {
                  name: facilityName,
                  type: facilityType,
                  distance: distance.toFixed(1)
                }
              };
            })
            .filter(Boolean)
            .sort((a, b) => parseFloat(a.properties.distance) - parseFloat(b.properties.distance))
            .slice(0, 80);

          const grouped = shelterData.reduce((acc, facility) => {
            const type = facility.properties.type;
            if (!acc[type]) acc[type] = [];
            acc[type].push(facility);
            return acc;
          }, {});

          if (isMounted.current) {
            setAllShelters(shelterData);
            setShelters(shelterData);
            setFacilitiesByType(grouped);
            updateMapMarkersWithTypes(lat, lng, shelterData, []);
          }
        } else {
          if (isMounted.current) {
            alert("No facilities found within 6km radius. Try searching in a different area.");
          }
        }
      } catch (fallbackError) {
        if (isMounted.current) {
          console.error("Fallback search error:", fallbackError);
          alert("Unable to search for facilities at this time. Please check your internet connection and try again.");
        }
      }
    } finally {
      if (isMounted.current) {
        setLoadingShelters(false);
      }
    }
  }, [getFacilityName, calculateDistance]);

  // ========== MAP MARKER MANAGEMENT ==========
  const updateMapMarkersWithTypes = useCallback((searchLat, searchLng, sheltersToShow, filterTypes) => {
    if (!map || !isMounted.current) return;

    try {
      // Clear existing facility and search markers
      map.eachLayer(layer => {
        if (layer.options?.isShelterMarker || layer.options?.isSearchMarker) {
          map.removeLayer(layer);
        }
      });

      // Add user location marker
      const searchIcon = L.divIcon({
        className: 'custom-search-marker',
        html: '<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      L.marker([searchLat, searchLng], { icon: searchIcon, isSearchMarker: true })
        .bindPopup('<b>Your Location</b>')
        .addTo(map);

      // Apply filtering - empty array means show all
      const filteredShelters = filterTypes.length > 0 
        ? sheltersToShow.filter(shelter => filterTypes.includes(shelter.properties.type))
        : sheltersToShow;

      // Add facility markers
      filteredShelters.forEach(shelter => {
        const [lng_shelter, lat_shelter] = shelter.geometry.coordinates;
        const { name, type, distance } = shelter.properties;
        
        const facilityConfig = facilityTypes.find(f => f.key === type);
        const markerColor = facilityConfig?.color || '#6b7280';

        const customIcon = L.divIcon({
          className: 'custom-shelter-marker',
          html: `<div style="background-color: ${markerColor}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
          iconSize: [15, 15],
          iconAnchor: [7.5, 7.5]
        });
        
        const marker = L.marker([lat_shelter, lng_shelter], { 
          icon: customIcon, 
          isShelterMarker: true,
          facilityId: shelter.id
        })
          .bindPopup(`
            <div style="font-family: Arial, sans-serif; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${name}</h3>
              <p style="margin: 4px 0; color: #666; font-size: 14px;"><strong>Type:</strong> ${facilityConfig?.label || type}</p>
              <p style="margin: 4px 0; color: #666; font-size: 14px;"><strong>Distance:</strong> ${distance} km</p>
            </div>
          `)
          .addTo(map);

        shelter.marker = marker;
      });

      // Auto-zoom to show all facilities with better bounds
      if (filteredShelters.length > 0) {
        const group = new L.featureGroup([
          L.marker([searchLat, searchLng]),
          ...filteredShelters.map(shelter => 
            L.marker([shelter.geometry.coordinates[1], shelter.geometry.coordinates[0]])
          )
        ]);
        map.fitBounds(group.getBounds().pad(0.05), { 
          maxZoom: 14,
          minZoom: 12 
        });
      }

      if (isMounted.current) {
        setShelters(filteredShelters);
      }
    } catch (error) {
      console.error("Error updating map markers:", error);
    }
  }, [map, facilityTypes]);

  // ========== FILTER MANAGEMENT ==========
  const toggleFacilityType = useCallback((type) => {
    if (!isMounted.current) return;
    
    setSelectedFacilityTypes(prev => {
      const newTypes = prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type];
      
      // Use setTimeout to ensure state update is processed
      setTimeout(() => {
        if (userLocation && allShelters.length > 0) {
          updateMapMarkersWithTypes(userLocation.lat, userLocation.lng, allShelters, newTypes);
        }
      }, 0);
      
      return newTypes;
    });
  }, [userLocation, allShelters, updateMapMarkersWithTypes]);

  const toggleSection = useCallback((sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  }, []);

  // ========== CARD INTERACTION ==========
  const handleCardClick = useCallback((facility) => {
    if (!isMounted.current) return;
    
    // Scroll to map section
    mapContainerRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });

    // Add permanent highlight marker
    if (map && facility.geometry?.coordinates) {
      const [lng, lat] = facility.geometry.coordinates;
      
      // Remove previous highlight
      if (highlightedMarker) {
        try {
          map.removeLayer(highlightedMarker);
        } catch (error) {
          console.warn("Error removing highlight marker:", error);
        }
      }

      const currentZoom = map.getZoom();
      const targetZoom = Math.max(currentZoom, 15);
      map.setView([lat, lng], targetZoom);

      try {
        const highlightIcon = L.divIcon({
          className: 'highlight-marker',
          html: '<div style="background-color: #fbbf24; width: 25px; height: 25px; border-radius: 50%; border: 4px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.4);"></div>',
          iconSize: [25, 25],
          iconAnchor: [12.5, 12.5]
        });

        const marker = L.marker([lat, lng], { icon: highlightIcon }).addTo(map);
        setHighlightedMarker(marker);
      } catch (error) {
        console.error("Error adding highlight marker:", error);
      }
    }
  }, [map, highlightedMarker]);

  // ========== RESET FUNCTIONALITY ==========
  const handleReset = useCallback(() => {
    if (!isMounted.current) return;
    
    setUserLocation(null);
    setLocationConfirmed(false);
    setShelters([]);
    setAllShelters([]);
    setFacilitiesByType({});
    setSelectedFacilityTypes([]);
    setExpandedSections({});
    
    if (highlightedMarker && map) {
      try {
        map.removeLayer(highlightedMarker);
      } catch (error) {
        console.warn("Error removing highlight on reset:", error);
      }
      setHighlightedMarker(null);
    }
    
    if (map) {
      try {
        map.eachLayer(layer => {
          if (layer.options?.isShelterMarker || layer.options?.isSearchMarker) {
            map.removeLayer(layer);
          }
        });
        map.setView([23.685, 90.3563], 7);
      } catch (error) {
        console.warn("Error resetting map:", error);
      }
    }
  }, [highlightedMarker, map]);

  // ========== RENDER COMPONENT ==========
  return (
    <div className="bg-white min-h-screen">
      {/* ========== HEADER SECTION ========== */}
      <header className="bg-[url('/login3.png')] text-white py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 flex justify-center items-center gap-2">
          <MapPinIcon size={45} className="text-amber-500" />
          Emergency Shelters & Services
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Connecting communities in need with shelter. Find available shelters within proximity of your location and find assistance in your area. Together, we can build a stronger, more resilient community.
        </p>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* ========== NAVIGATION TABS ========== */}
        <div className="flex justify-center mb-8 text-[1.2rem]">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => navigate("/relief")}
              className="px-10 py-3 rounded-lg font-semibold text-gray-600 hover:text-gray-800 transition-colors duration-300"
            >
              Resources & Donors
            </button>
            <span className="px-10 py-3 rounded-lg font-semibold bg-[#311B08] text-amber-500">
              Emergency Shelters
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* ========== LOCATION INPUT SECTION ========== */}
          {!locationConfirmed && (
            <div className="bg-gray-100 border border-gray-800 text-white p-8 rounded-xl shadow-lg">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <h3 className="text-[1.9rem] font-extrabold text-[#311B08]">Find Emergency Facilities</h3>
                </div>
                
                <div className="flex-1 flex justify-center lg:justify-end">
                  {!userLocation ? (
                    <button
                      onClick={getCurrentLocation}
                      disabled={loadingLocation}
                      className="bg-[#311B08] text-amber-500 px-8 py-3 rounded-xl text-xl font-semibold hover:underline transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingLocation ? <Loader className="animate-spin" size={20} /> : <MapPin size={20} />}
                      {loadingLocation ? "Getting Location..." : "Get My Location"}
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="bg-green-600 px-8 py-3 rounded-lg">
                        <p className="text-white font-semibold text-xl">
                          Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                        </p>
                      </div>
                      <button
                        onClick={confirmAndSearch}
                        className="bg-[#311B08] text-amber-500 px-8 py-3 rounded-xl text-xl font-semibold hover:underline transition-colors duration-300 flex items-center gap-2"
                      >
                        <Check size={20} />
                        Search Facilities
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========== LOADING INDICATOR ========== */}
          {loadingShelters && (
            <div className="bg-gray-100 p-6 rounded-xl border border-gray-800 text-center">
              <Loader className="animate-spin text-amber-600 mx-auto mb-4" size={48} />
              <p className="text-[#311B08] font-bold text-xl">
                Searching for facilities within 6km radius...
              </p>
            </div>
          )}

          {/* ========== FILTER CONTROLS ========== */}
          {shelters.length > 0 && (
            <div className="bg-gray-100 border border-gray-400 p-8 rounded-xl shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-2xl font-bold text-[#311B08] flex items-center gap-2 mb-4 sm:mb-0">
                  <Filter size={24} />
                  Filter by Facility Type (Within 6km)
                </h3>
                <button
                  onClick={handleReset}
                  className="bg-[#311B08] text-amber-500 text-xl px-10 py-2 rounded-xl font-semibold hover:underline transition-colors duration-300"
                >
                  Reset
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {facilityTypes.map(type => {
                  const count = facilitiesByType[type.key]?.length || 0;
                  const isSelected = selectedFacilityTypes.includes(type.key);
                  
                  return count > 0 ? (
                    <button
                      key={type.key}
                      onClick={() => toggleFacilityType(type.key)}
                      className={`px-9 py-2 rounded-lg text-[1.0rem] font-semibold transition-colors duration-300 flex items-center gap-2 ${
                        isSelected ? 'bg-[#311B08] text-amber-500' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                      {type.label} ({count})
                    </button>
                  ) : null;
                })}
              </div>
              
              <p className="ml-1 text-lg text-gray-600">
                Showing {shelters.length} of {allShelters.length} facilities
              </p>
            </div>
          )}

          {/* ========== INTERACTIVE MAP ========== */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div 
              ref={mapContainerRef}
              className="w-full h-[600px]" 
            />
          </div>

          {/* ========== FACILITY CARDS DISPLAY ========== */}
          {Object.keys(facilitiesByType).length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-4xl flex justify-center font-bold text-[#311B08] mb-6">
                Emergency Facilities
              </h3>
              
              {facilityTypes.map(type => {
                const facilities = facilitiesByType[type.key] || [];
                if (facilities.length === 0 || (selectedFacilityTypes.length > 0 && !selectedFacilityTypes.includes(type.key))) return null;
                
                const isExpanded = expandedSections[type.key] || false;
                const maxRows = 2;
                const cardsPerRow = 3;
                const maxInitialCards = maxRows * cardsPerRow;
                const facilitiesToShow = isExpanded ? facilities : facilities.slice(0, maxInitialCards);
                
                return (
                  <div key={type.key} className="mb-8">
                    <h4 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: type.color }} />
                      {type.label} ({facilities.length})
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {facilitiesToShow.map((facility, index) => (
                        <div
                          key={facility.id || index}
                          onClick={() => handleCardClick(facility)}
                          className="bg-gray-100 border border-gray-300 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                        >
                          <div className="text-center">
                            <h5 className="font-bold text-gray-800 text-xl mb-2">
                              {facility.properties.name}
                            </h5>
                            <p className="text-gray-600 text-lg mb-2 flex items-center justify-center gap-1">
                              <MapPin size={16} className="text-amber-600" />
                              <span className="font-medium text-amber-600">{facility.properties.distance} km away</span>
                            </p>
                            <p className="text-gray-600 text-lg font-semibold">
                              {facilityTypes.find(f => f.key === facility.properties.type)?.label || facility.properties.type}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Show More/Less Button */}
                    {facilities.length > maxInitialCards && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => toggleSection(type.key)}
                          className="bg-[#311B08] text-lg text-amber-500 px-8 py-3 rounded-xl font-semibold hover:underline transition-colors duration-300 flex items-center gap-2 mx-auto"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp size={20} />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown size={20} />
                              Show {facilities.length - maxInitialCards} More {type.label}
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shelter;
