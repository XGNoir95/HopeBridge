import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, Network } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

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
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Fetch districts
  useEffect(() => {
    axios.get("https://bdapis.com/api/v1.2/districts")
      .then((response) => {
        const districtNames = response.data.data.map((item) => item.district);
        setDistricts(districtNames);
      })
      .catch((error) => console.error("Error fetching districts:", error));
  }, []);

  // Fetch donor data
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get("/api/donor");
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
        const response = await axios.get("/api/resources");
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
        const response = await axios.get("/api/donatedMoney");
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
        const response = await axios.get("/api/volunteer");
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

  // Filter data based on the selected district
  const filteredResources = selectedDistrict
    ? resources.filter((resource) =>
        resource.pickUpLocation.toLowerCase().includes(selectedDistrict.toLowerCase())
      )
    : resources;

  const filteredDonors = selectedDistrict
    ? donors.filter((donor) =>
        donor.district.toLowerCase().includes(selectedDistrict.toLowerCase())
      )
    : donors;

  const filteredVolunteers = selectedDistrict
    ? volunteers.filter((volunteer) =>
        volunteer.District.toLowerCase().includes(selectedDistrict.toLowerCase())
      )
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

  // Handle reset button click
  const handleReset = () => {
    setSelectedDistrict(""); // Clear the selected district
    window.location.reload(); // Reload the page
  };

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

      {/* District Dropdown and Reset Button */}
      <div className="my-10 flex justify-center mb-10 gap-4">
        <select
          className="border border-gray-300 p-4 rounded-xl w-full max-w-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
        >
          <option value="" disabled>Select District</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>

        <button
          onClick={handleReset}
          className="bg-[#311B08] text-[#EBB380] px-6 py-2 rounded-xl font-semibold hover:bg-amber-900 transition-colors duration-300"
        >
          Reset
        </button>
      </div>

      <div className="container mx-auto px-6 py-auto">
        {/* Total Donated Amount Section */}
        <div className="bg-[#311B08] text-white p-6 rounded-xl shadow-lg mb-10 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Total Funds Raised till now: </h2>
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
          <h2 className="mx-6 text-3xl font-extrabold text-gray-800">Available Resources:</h2>
          {loadingResources ? (
            <p className="text-center text-gray-600">Loading resource data...</p>
          ) : errorResources ? (
            <p className="text-center text-red-500">{errorResources}</p>
          ) : filteredResources.length === 0 ? (
            <p className="text-center text-gray-600 font-semibold text-2xl">No matching resources found.</p>
          ) : (
            <div className="relative">
              <Slider {...getSliderSettings(filteredResources.length)}>
                {filteredResources.map((resource, index) => (
                  <div key={index} className="p-5">
                    <div className="bg-gray-100 border border-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                      <p className="font-bold text-gray-800 text-2xl">{resource.itemDescription}</p>
                      <p className="text-gray-600 text-lg">
                        Quantity: <span className="font-medium text-amber-600">{resource.quantity}</span>
                      </p>
                      <p className="text-gray-600 text-lg font-semibold">Location: {resource.pickUpLocation}</p>
                      <button
                        onClick={() => navigate("/contact-us")} // Redirect to ContactUs page
                        className="bg-[#311B08] text-[#EBB380] px-5 py-2 mt-4 rounded-xl text-lg font-semibold hover:underline transition-colors duration-300"
                      >
                        Request
                      </button>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </section>

        {/* Available Blood Donors */}
        <section className="mb-10">
          <h2 className="mx-6 text-3xl font-extrabold text-gray-800">Available Blood Donors:</h2>
          {loadingDonors ? (
            <p className="text-center text-gray-600">Loading donor data...</p>
          ) : errorDonors ? (
            <p className="text-center text-red-500">{errorDonors}</p>
          ) : filteredDonors.length === 0 ? (
            <p className="text-center text-gray-600 font-semibold text-2xl">No matching donors found.</p>
          ) : (
            <div className="relative">
              <Slider {...getSliderSettings(filteredDonors.length)}>
                {filteredDonors.map((donor, index) => (
                  <div key={index} className="p-5">
                    <div className="bg-gray-100 border border-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                      <p className="font-bold text-gray-800 text-2xl mb-1">{donor.donorName}</p>
                      <p className="text-gray-600 text-lg font-bold">
                        Blood Type: <span className="font-medium text-amber-600">{donor.blood_group}</span>
                      </p>
                      <p className="text-gray-600 text-lg">Contact: {donor.donorPhone}</p>
                      <p className="text-gray-600 text-lg font-semibold">
                        Location: {donor.district}
                      </p>
                      <button
                        onClick={() => navigate("/contact-us")} // Redirect to ContactUs page
                        className="bg-[#311B08] text-[#EBB380] px-5 py-2 text-lg mt-4 rounded-xl font-semibold hover:underline transition-colors duration-300"
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
                    <div className="bg-gray-100 border border-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                      <p className="font-bold text-gray-800 text-2xl mb-1">{volunteer.volunteerName}</p>
                      <p className="text-gray-600 text-lg">Email: {volunteer.volunteerMail}</p>
                      <p className="text-gray-600 text-lg font-bold">
                        Blood Type: <span className="font-medium text-amber-600">{volunteer.BloodGroup}</span>
                      </p>
                      <p className="text-gray-600 text-lg font-semibold">
                        Location: {volunteer.District}
                      </p>
                      <button
                        onClick={() => navigate("/contact-us")} // Redirect to ContactUs page
                        className="bg-[#311B08] text-[#EBB380] px-5 py-2 text-lg mt-4 rounded-xl font-semibold hover:underline transition-colors duration-300"
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