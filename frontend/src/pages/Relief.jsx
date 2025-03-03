import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, Network } from "lucide-react";
import axios from "axios";

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
  const [donors, setDonors] = useState([]); // State to store donor data
  const [resources, setResources] = useState([]); // State to store resource data
  const [loadingDonors, setLoadingDonors] = useState(true); // State to track loading status for donors
  const [loadingResources, setLoadingResources] = useState(true); // State to track loading status for resources
  const [errorDonors, setErrorDonors] = useState(null); // State to handle errors for donors
  const [errorResources, setErrorResources] = useState(null); // State to handle errors for resources
  const [totalDonatedAmount, setTotalDonatedAmount] = useState(0); // Initialize with 0
  const [loadingDonatedAmount, setLoadingDonatedAmount] = useState(true); // State to track loading status for donated amount
  const [errorDonatedAmount, setErrorDonatedAmount] = useState(null); // State to handle errors for donated amount

  // Fetch donor data from the backend
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/donor");
        console.log("Donor API Response:", response.data); // Log the response
        if (response.data.success) {
          setDonors(response.data.donors); // Set the fetched donor data
        } else {
          setErrorDonors("Failed to fetch donor data.");
        }
      } catch (error) {
        console.error("Error fetching donor data:", error);
        setErrorDonors("An error occurred while fetching donor data.");
      } finally {
        setLoadingDonors(false); // Set loading to false after the request completes
      }
    };

    fetchDonors();
  }, []);

  // Fetch resource data from the backend
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/resources");
        console.log("Resource API Response:", response.data); // Log the response
        if (response.data.success) {
          setResources(response.data.Donations); // Use the correct key: Donations
        } else {
          setErrorResources("Failed to fetch resource data.");
        }
      } catch (error) {
        console.error("Error fetching resource data:", error);
        setErrorResources("An error occurred while fetching resource data.");
      } finally {
        setLoadingResources(false); // Set loading to false after the request completes
      }
    };

    fetchResources();
  }, []);

  // Fetch total donated amount from the backend
  useEffect(() => {
    const fetchDonatedAmount = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/donatedMoney");
        console.log("Donated Money API Response:", response.data); // Log the response
        if (response.data.success) {
          // Access totalDonatedMoney from the DonatedAmount object
          const donatedAmount = response.data.DonatedAmount?.totalDonatedMoney || 0;
          setTotalDonatedAmount(donatedAmount); // Set the total donated amount
        } else {
          setErrorDonatedAmount("Failed to fetch donated amount.");
        }
      } catch (error) {
        console.error("Error fetching donated amount:", error);
        setErrorDonatedAmount("An error occurred while fetching donated amount.");
      } finally {
        setLoadingDonatedAmount(false); // Set loading to false after the request completes
      }
    };

    fetchDonatedAmount();
  }, []);

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 cards at a time
    slidesToScroll: 1, // Scroll 1 card at a time
    arrows: true,
    prevArrow: <CustomPrevArrow />, // Custom previous arrow
    nextArrow: <CustomNextArrow />, // Custom next arrow
    responsive: [
      {
        breakpoint: 1024, // Tablets
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // Mobile devices
        settings: {
          slidesToShow: 1,
        },
      },
    ],
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

      <div className="container mx-auto px-6 py-10">
        {/* <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Tell us your location"
            className="border border-gray-300 p-4 rounded-xl w-full max-w-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          />
        </div> */}

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
          ) : (
            <div className="relative">
              <Slider {...settings}>
                {Array.isArray(resources) &&
                  resources.map((resource, index) => (
                    <div key={index} className="p-5">
                      <div className="bg-gray-100 border border-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                        <p className="font-bold text-gray-800 text-2xl">{resource.itemDescription}</p>
                        <p className="text-gray-600 text-lg">
                          Quantity: <span className="font-medium text-amber-600">{resource.quantity}</span>
                        </p>
                        <p className="text-gray-600 text-lg font-semibold">Location: {resource.pickUpLocation}</p>
                        <button className="bg-[#311B08] text-[#EBB380] px-5 py-2 mt-4 rounded-xl text-lg font-semibold hover:underline transition-colors duration-300">
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
          ) : (
            <div className="relative">
              <Slider {...settings}>
                {Array.isArray(donors) &&
                  donors.map((donor, index) => (
                    <div key={index} className="p-5">
                      <div className="bg-gray-100 border border-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                        <p className="font-bold text-gray-800 text-2xl mb-1">{donor.donorName}</p>
                        <p className="text-gray-600 text-lg font-bold">
                          Blood Type: <span className="font-medium text-amber-600">{donor.blood_group}</span>
                        </p>
                        <p className="text-gray-600 text-lg">Contact: {donor.donorPhone}</p>
                        <p className="text-gray-600 text-lg font-semibold">
                          Location: {donor.district}, {donor.division}
                        </p>
                        <button className="bg-[#311B08] text-[#EBB380] px-5 py-2 text-lg mt-4 rounded-xl font-semibold hover:underline transition-colors duration-300">
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