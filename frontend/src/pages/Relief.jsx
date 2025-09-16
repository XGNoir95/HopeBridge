import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, Network, Clock, AlertTriangle, Filter, Droplet } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Custom Arrow Components
const CustomPrevArrow = (props) => (
  <button
    {...props}
    className="absolute left-0 z-10 p-3 bg-[#311B08] rounded-full text-white hover:bg-amber-900 transition-colors duration-300"
    style={{ top: "50%", transform: "translateY(-50%)" }}
  >
    <ChevronLeft size={24} />
  </button>
);

const CustomNextArrow = (props) => (
  <button
    {...props}
    className="absolute right-0 z-10 p-3 bg-[#311B08] rounded-full text-white hover:bg-amber-900 transition-colors duration-300"
    style={{ top: "50%", transform: "translateY(-50%)" }}
  >
    <ChevronRight size={24} />
  </button>
);

const Relief = () => {
  const [donors, setDonors] = useState([]);
  const [resources, setResources] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loadingDonors, setLoadingDonors] = useState(true);
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);
  const [errorDonors, setErrorDonors] = useState(null);
  const [errorResources, setErrorResources] = useState(null);
  const [errorVolunteers, setErrorVolunteers] = useState(null);
  const [totalDonatedAmount, setTotalDonatedAmount] = useState(0);
  const [loadingDonatedAmount, setLoadingDonatedAmount] = useState(true);
  const [errorDonatedAmount, setErrorDonatedAmount] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [resourceFilter, setResourceFilter] = useState("available");
  
  const navigate = useNavigate();
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Get current date in Bangladesh timezone (UTC+6)
  const getCurrentBDTDate = () => {
    const now = new Date();
    const bdtOffset = 6 * 60; // 6 hours in minutes
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const bdtTime = new Date(utc + (bdtOffset * 60000));
    return bdtTime.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Check if item is expired
  const isExpired = (expirationDate) => {
    if (!expirationDate) return false;
    const currentDate = getCurrentBDTDate();
    return expirationDate <= currentDate;
  };

  // Get days until expiry
  const getDaysUntilExpiry = (expirationDate) => {
    if (!expirationDate) return null;
    const currentDate = new Date(getCurrentBDTDate());
    const expiryDate = new Date(expirationDate);
    const timeDifference = expiryDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No expiry date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fetch divisions and districts
  useEffect(() => {
    const fetchDivisionsAndDistricts = async () => {
      try {
        const divisionsResponse = await axios.get("https://bdapi.vercel.app/api/v.1/division");
        setDivisions(divisionsResponse.data.data);
        
        const allDistrictsData = [];
        for (const division of divisionsResponse.data.data) {
          const districtsResponse = await axios.get(
            `https://bdapi.vercel.app/api/v.1/district/${division.id}`
          );
          
          const districtsWithDivision = districtsResponse.data.data.map(district => ({
            ...district,
            divisionId: division.id,
            divisionName: division.name
          }));
          
          allDistrictsData.push(...districtsWithDivision);
        }

        setAllDistricts(allDistrictsData);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDivisionsAndDistricts();
  }, []);

  // Update districts when division changes
  useEffect(() => {
    if (selectedDivision) {
      const selectedDivisionObj = divisions.find(div => div.name === selectedDivision);
      if (selectedDivisionObj) {
        const filteredDistricts = allDistricts.filter(district => 
          district.divisionId === selectedDivisionObj.id
        );
        setDistricts(filteredDistricts.map(district => district.name));
      }
    } else {
      setDistricts([]);
    }
    setSelectedDistrict(""); // Reset district when division changes
  }, [selectedDivision, allDistricts, divisions]);

  // Fetch donor data
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/donor");
        if (response.data.success) {
          setDonors(response.data.donors);
        } else {
          setErrorDonors("Failed to fetch donor data.");
        }
      } catch (error) {
        console.error("Error fetching donor data:", error);
        setErrorDonors("An error occurred while fetching donor data.");
      } finally {
        setLoadingDonors(false);
      }
    };

    fetchDonors();
  }, []);

  // Fetch resource data
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/resources");
        if (response.data.success) {
          setResources(response.data.Donations);
        } else {
          setErrorResources("Failed to fetch resource data.");
        }
      } catch (error) {
        console.error("Error fetching resource data:", error);
        setErrorResources("An error occurred while fetching resource data.");
      } finally {
        setLoadingResources(false);
      }
    };

    fetchResources();
  }, []);

  // Fetch total donated amount
  useEffect(() => {
    const fetchDonatedAmount = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/donatedMoney");
        if (response.data.success) {
          const donatedAmount = response.data.DonatedAmount?.totalDonatedMoney || 0;
          setTotalDonatedAmount(donatedAmount);
        } else {
          setErrorDonatedAmount("Failed to fetch donated amount.");
        }
      } catch (error) {
        console.error("Error fetching donated amount:", error);
        setErrorDonatedAmount("An error occurred while fetching donated amount.");
      } finally {
        setLoadingDonatedAmount(false);
      }
    };

    fetchDonatedAmount();
  }, []);

  // Fetch volunteer data
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/volunteer");
        if (response.data.success) {
          setVolunteers(response.data.volunteer);
        } else {
          setErrorVolunteers("Failed to fetch volunteer data.");
        }
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
        setErrorVolunteers("An error occurred while fetching volunteer data.");
      } finally {
        setLoadingVolunteers(false);
      }
    };

    fetchVolunteers();
  }, []);

  // Filter data based on selections and expiry status
  const getFilteredResources = () => {
    let filtered = resources;

    // Apply location filters
    if (selectedDivision || selectedDistrict) {
      filtered = filtered.filter((resource) => {
        const divisionMatch = selectedDivision && !selectedDistrict
          ? resource.pickUpLocation.toLowerCase().includes(selectedDivision.toLowerCase())
          : true;
        const districtMatch = selectedDistrict
          ? resource.pickUpLocation.toLowerCase().includes(selectedDistrict.toLowerCase())
          : divisionMatch;
        return districtMatch;
      });
    }

    // Apply expiry filter
    if (resourceFilter === "available") {
      filtered = filtered.filter(resource => !isExpired(resource.expirationDate));
    }
    // For "all" filter, we don't filter anything (show both expired and non-expired)

    return filtered;
  };

  const filteredResources = getFilteredResources();

  const filteredDonors = selectedDivision || selectedDistrict || selectedBloodType
    ? donors.filter((donor) => {
        const divisionMatch = selectedDivision && !selectedDistrict
          ? donor.district.toLowerCase().includes(selectedDivision.toLowerCase()) ||
            allDistricts.some(dist => 
              dist.name.toLowerCase() === donor.district.toLowerCase() && 
              divisions.some(div => div.id === dist.divisionId && div.name === selectedDivision)
            )
          : true;
        const districtMatch = selectedDistrict
          ? donor.district.toLowerCase().includes(selectedDistrict.toLowerCase())
          : divisionMatch;
        const bloodMatch = selectedBloodType
          ? donor.blood_group === selectedBloodType
          : true;
        return districtMatch && bloodMatch;
      })
    : donors;

  const filteredVolunteers = selectedDivision || selectedDistrict
    ? volunteers.filter((volunteer) => {
        const divisionMatch = selectedDivision && !selectedDistrict
          ? volunteer.District.toLowerCase().includes(selectedDivision.toLowerCase()) ||
            allDistricts.some(dist => 
              dist.name.toLowerCase() === volunteer.District.toLowerCase() && 
              divisions.some(div => div.id === dist.divisionId && div.name === selectedDivision)
            )
          : true;
        const districtMatch = selectedDistrict
          ? volunteer.District.toLowerCase().includes(selectedDistrict.toLowerCase())
          : divisionMatch;
        return districtMatch;
      })
    : volunteers;

  // Slider settings
  const getSliderSettings = (itemCount) => ({
    dots: true,
    infinite: itemCount > 1,
    speed: 500,
    slidesToShow: Math.min(itemCount, 3),
    slidesToScroll: 1,
    arrows: itemCount > 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(itemCount, 2),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  // Handle reset
  const handleReset = () => {
    setSelectedDivision("");
    setSelectedDistrict("");
    setSelectedBloodType("");
    setResourceFilter("available"); // Reset to default
  };

  // Get count of expired vs available resources
  const getResourceCounts = () => {
    const allResources = selectedDivision || selectedDistrict
      ? resources.filter((resource) => {
          const divisionMatch = selectedDivision && !selectedDistrict
            ? resource.pickUpLocation.toLowerCase().includes(selectedDivision.toLowerCase())
            : true;
          const districtMatch = selectedDistrict
            ? resource.pickUpLocation.toLowerCase().includes(selectedDistrict.toLowerCase())
            : divisionMatch;
          return districtMatch;
        })
      : resources;

    const availableCount = allResources.filter(resource => !isExpired(resource.expirationDate)).length;
    const expiredCount = allResources.filter(resource => isExpired(resource.expirationDate)).length;
    
    return { availableCount, expiredCount, totalCount: allResources.length };
  };

  // Get donor counts by blood type
  const getDonorCounts = () => {
    const locationFilteredDonors = selectedDivision || selectedDistrict
      ? donors.filter((donor) => {
          const divisionMatch = selectedDivision && !selectedDistrict
            ? donor.district.toLowerCase().includes(selectedDivision.toLowerCase()) ||
              allDistricts.some(dist => 
                dist.name.toLowerCase() === donor.district.toLowerCase() && 
                divisions.some(div => div.id === dist.divisionId && div.name === selectedDivision)
              )
            : true;
          const districtMatch = selectedDistrict
            ? donor.district.toLowerCase().includes(selectedDistrict.toLowerCase())
            : divisionMatch;
          return districtMatch;
        })
      : donors;

    const totalCount = locationFilteredDonors.length;
    const bloodTypeCount = selectedBloodType 
      ? locationFilteredDonors.filter(donor => donor.blood_group === selectedBloodType).length
      : totalCount;

    return { totalCount, bloodTypeCount, selectedBloodType };
  };

  const resourceCounts = getResourceCounts();
  const donorCounts = getDonorCounts();

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <header className="bg-[url('/login3.png')] text-white py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 flex justify-center items-center gap-2">
          <Network size={45} className="text-amber-500" />
          The Relief Network
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Connecting communities in need with resources and support. Find available resources, blood donors, and relief assistance in your area. Together, we can build a stronger, more resilient community.
        </p>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation to Shelter Page */}
        <div className="flex justify-center mb-8 text-[1.2rem]">
          <div className="bg-gray-100 p-1 rounded-lg">
            <span className="px-10 py-3 rounded-lg font-semibold bg-[#311B08] text-amber-500">
              Resources & Donors
            </span>
            <button
              onClick={() => navigate("/shelter")}
              className="px-10 py-3 rounded-lg font-semibold text-gray-600 hover:text-gray-800 transition-colors duration-300"
            >
              Emergency Shelters
            </button>
          </div>
        </div>

        {/* Division and District Filters */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <select
              className="border border-gray-300 p-4 rounded-xl flex-1 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
            >
              <option value="">All Divisions</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.name}>
                  {division.name}
                </option>
              ))}
            </select>

            <select
              className="border border-gray-300 p-4 rounded-xl flex-1 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedDivision}
            >
              <option value="">{selectedDivision ? "All Districts" : "Select Division First"}</option>
              {districts.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>

            <button
              onClick={handleReset}
              className="bg-[#311B08] text-amber-500 px-8 py-4 rounded-xl font-semibold hover:underline text-lg transition-colors duration-300 whitespace-nowrap"
            >
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Total Donated Amount Section */}
        <div className="bg-[#311B08] text-white p-6 rounded-xl shadow-lg mb-10 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Total Funds Raised till now:</h2>
          {loadingDonatedAmount ? (
            <p className="text-gray-300">Loading donated amount...</p>
          ) : errorDonatedAmount ? (
            <p className="text-red-300">{errorDonatedAmount}</p>
          ) : (
            <p className="text-4xl font-bold text-amber-500">
              ৳{totalDonatedAmount.toLocaleString()}
            </p>
          )}
        </div>

        {/* Available Resources */}
        <section className="mb-10">
          {/* Section Header with Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="mx-6 text-3xl font-extrabold text-gray-800">Available Resources:</h2>
            
            {/* Resource Filter */}
            <div className="flex items-center gap-3 mx-6">
              <Filter size={20} className="text-[#311B08] font-bold" />
              <div className="bg-gray-100 p-1 rounded-lg flex">
                <button
                  onClick={() => setResourceFilter("available")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 flex items-center gap-2 ${
                    resourceFilter === "available"
                      ? "bg-green-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Clock size={16} />
                  Available ({resourceCounts.availableCount})
                </button>
                <button
                  onClick={() => setResourceFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 flex items-center gap-2 ${
                    resourceFilter === "all"
                      ? "bg-[#311B08] text-amber-500 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Filter size={16} />
                  All Products ({resourceCounts.totalCount})
                </button>
              </div>
              
              {/* Filter Info */}
              <div className="text-[1.0rem] text-gray-500 hidden lg:block">
                {resourceFilter === "available" 
                  ? `Showing ${resourceCounts.availableCount} available items`
                  : `Showing all ${resourceCounts.totalCount} items (${resourceCounts.expiredCount} expired)`
                }
              </div>
            </div>
          </div>

          {loadingResources ? (
            <p className="text-center text-gray-600">Loading resource data...</p>
          ) : errorResources ? (
            <p className="text-center text-red-500">{errorResources}</p>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 font-semibold text-2xl mb-2">
                {resourceFilter === "available" ? "No available resources found." : "No matching resources found."}
              </p>
              {resourceFilter === "available" && resourceCounts.expiredCount > 0 && (
                <p className="text-gray-500 text-lg">
                  Try viewing "All Products" to see {resourceCounts.expiredCount} expired items.
                </p>
              )}
            </div>
          ) : (
            <div className="relative">
              <Slider {...getSliderSettings(filteredResources.length)}>
                {filteredResources.map((resource, index) => {
                  const expired = isExpired(resource.expirationDate);
                  const daysUntilExpiry = getDaysUntilExpiry(resource.expirationDate);
                  
                  return (
                    <div key={index} className="p-5">
                      <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center relative ${
                        expired 
                          ? 'bg-red-50 border-2 border-red-200' 
                          : 'bg-gray-100 hover:scale-105 transition-all duration-300'
                      }`}>
                        
                        {/* Expired Badge */}
                        {expired && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <AlertTriangle size={14} />
                            EXPIRED
                          </div>
                        )}

                        {/* Expiring Soon Badge */}
                        {!expired && daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
                          <div className="absolute top-2 right-2 bg-[#311B08] text-amber-500 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Clock size={14} />
                            {daysUntilExpiry}d left
                          </div>
                        )}

                        <p className={`font-bold text-2xl mb-2 ${expired ? 'text-red-800' : 'text-gray-800'}`}>
                          {resource.itemDescription}
                        </p>
                        
                        <p className={`text-lg mb-2 ${expired ? 'text-red-800' : 'text-gray-600'}`}>
                          Quantity: <span className={`font-medium ${expired ? 'text-red-800' : 'text-amber-600'}`}>
                            {resource.quantity}
                          </span>
                        </p>
                        
                        <p className={`text-lg font-semibold mb-3 ${expired ? 'text-red-800' : 'text-gray-600'}`}>
                          Location: {resource.pickUpLocation}
                        </p>

                        {/* Expiry Date Display */}
                        <div className={`mb-4 p-3 rounded-lg ${
                          expired 
                            ? 'bg-red-100 border border-red-300' 
                            : daysUntilExpiry !== null && daysUntilExpiry <= 7 
                              ? 'bg-amber-100' 
                              : 'bg-amber-100'
                        }`}>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Clock size={16} className={
                              expired 
                                ? 'text-red-900' 
                                : daysUntilExpiry !== null && daysUntilExpiry <= 7 
                                  ? 'text-[#311B08]' 
                                  : 'text-[#311B08]'
                            } />
                            <span className={`font-semibold text-lg ${
                              expired 
                                ? 'text-red-900' 
                                : daysUntilExpiry !== null && daysUntilExpiry <= 7 
                                  ? 'text-[#311B08]' 
                                  : 'text-[#311B08]'
                            }`}>
                              {expired ? 'Expired on:' : 'Expires on:'}
                            </span>
                          </div>
                          <p className={`font-bold ${
                            expired 
                              ? 'text-red-900' 
                              : daysUntilExpiry !== null && daysUntilExpiry <= 7 
                                ? 'text-orange-800' 
                                : 'text-orange-800'
                          }`}>
                            {formatDate(resource.expirationDate)}
                          </p>
                        </div>

                        <button
                          onClick={() => navigate("/contact-us")}
                          disabled={expired}
                          className={`px-8 py-2 rounded-xl text-lg font-semibold transition-colors duration-300 ${
                            expired
                              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                              : 'bg-[#311B08] text-amber-500 hover:underline'
                          }`}
                        >
                          {expired ? 'No longer available' : 'Request'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          )}
        </section>

        {/* Available Blood Donors */}
        <section className="mb-10">
          {/* Section Header with Blood Type Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="mx-6 text-3xl font-extrabold text-gray-800">Available Blood Donors:</h2>
            
            {/* Blood Type Filter */}
            <div className="flex items-center gap-3 mx-6">
              <Droplet size={20} className="text-red-500 font-bold" />
              <div className="bg-gray-100 p-1 rounded-lg flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedBloodType("")}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors duration-300 ${
                    selectedBloodType === ""
                      ? "bg-red-500 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  All ({donorCounts.totalCount})
                </button>
                {bloodTypes.map((type) => {
                  const typeCount = donors.filter(donor => {
                    const locationMatch = selectedDivision || selectedDistrict
                      ? (selectedDivision && !selectedDistrict
                          ? donor.district.toLowerCase().includes(selectedDivision.toLowerCase()) ||
                            allDistricts.some(dist => 
                              dist.name.toLowerCase() === donor.district.toLowerCase() && 
                              divisions.some(div => div.id === dist.divisionId && div.name === selectedDivision)
                            )
                          : true) && (selectedDistrict
                          ? donor.district.toLowerCase().includes(selectedDistrict.toLowerCase())
                          : true)
                      : true;
                    return donor.blood_group === type && locationMatch;
                  }).length;

                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedBloodType(type)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors duration-300 ${
                        selectedBloodType === type
                          ? "bg-[#311B08] text-amber-500 shadow-md"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {type} ({typeCount})
                    </button>
                  );
                })}
              </div>
              
              {/* Filter Info */}
              <div className="text-[1.0rem] text-gray-500 hidden xl:block">
                {selectedBloodType 
                  ? `Showing ${donorCounts.bloodTypeCount} ${selectedBloodType} donors`
                  : `Showing all ${donorCounts.totalCount} donors`
                }
              </div>
            </div>
          </div>

          {loadingDonors ? (
            <p className="text-center text-gray-600">Loading donor data...</p>
          ) : errorDonors ? (
            <p className="text-center text-red-500">{errorDonors}</p>
          ) : filteredDonors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 font-semibold text-2xl mb-2">No matching donors found.</p>
              {selectedBloodType && (
                <p className="text-gray-500 text-lg">
                  Try selecting "All" to see {donorCounts.totalCount} available donors.
                </p>
              )}
            </div>
          ) : (
            <div className="relative">
              <Slider {...getSliderSettings(filteredDonors.length)}>
                {filteredDonors.map((donor, index) => (
                  <div key={index} className="p-5">
                    <div className="bg-gray-100 p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center">
                      <p className="font-bold text-gray-800 text-2xl mb-1">{donor.donorName}</p>
                      <p className="text-gray-600 text-lg font-bold">
                        Blood Type: <span className="font-medium text-red-600">{donor.blood_group}</span>
                      </p>
                      <p className="text-gray-600 text-lg">Contact: {donor.donorPhone}</p>
                      <p className="text-gray-600 text-lg font-semibold">
                        Location: {donor.district}
                      </p>
                      <button
                        onClick={() => navigate("/contact-us")}
                        className="bg-[#311B08] text-amber-500 px-8 py-2 text-lg mt-4 rounded-xl font-semibold hover:underline transition-colors duration-300"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </section>

        {/* Available Volunteers */}
        <section className="mb-10">
          <h2 className="mx-6 text-3xl font-extrabold text-gray-800">Available Volunteers:</h2>
          {loadingVolunteers ? (
            <p className="text-center text-gray-600">Loading volunteer data...</p>
          ) : errorVolunteers ? (
            <p className="text-center text-red-500">{errorVolunteers}</p>
          ) : filteredVolunteers.length === 0 ? (
            <p className="text-center text-gray-600 font-semibold text-2xl">No matching volunteers found.</p>
          ) : (
            <div className="relative">
              <Slider {...getSliderSettings(filteredVolunteers.length)}>
                {filteredVolunteers.map((volunteer, index) => (
                  <div key={index} className="p-5">
                    <div className="bg-gray-100 p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center">
                      <p className="font-bold text-gray-800 text-2xl mb-1">{volunteer.volunteerName}</p>
                      <p className="text-gray-600 text-lg">Email: {volunteer.volunteerMail}</p>
                      <p className="text-gray-600 text-lg font-bold">
                        Blood Type: <span className="font-medium text-red-600">{volunteer.BloodGroup}</span>
                      </p>
                      <p className="text-gray-600 text-lg font-semibold">
                        Location: {volunteer.District}
                      </p>
                      <button
                        onClick={() => navigate("/contact-us")}
                        className="bg-[#311B08] text-amber-500 px-8 py-2 text-lg mt-4 rounded-xl font-semibold hover:underline transition-colors duration-300"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Relief;
