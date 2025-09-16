import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Volunteers = () => {
  const [formData, setFormData] = useState({
    volunteerName: "",
    volunteerMail: "",
    blood_group: "",
    division: "",
    district: "",
  });
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          throw new Error("No token found in localStorage");
        }
        
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.uid;
        
        if (!userId) {
          throw new Error("User ID not found in token");
        }

        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData((prevData) => ({
          ...prevData,
          volunteerName: response.data.userName,
          volunteerMail: response.data.userMail,
          blood_group: response.data.blood_group,
          division: response.data.division,
          district: response.data.district,
        }));

        if (response.data.division) {
          fetchDistricts(response.data.division);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Failed to fetch user data. Please try again.");
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  // Fetch divisions from API
  useEffect(() => {
    if (token) {
      axios
        .get("https://bdapis.com/api/v1.2/divisions")
        .then((response) => setDivisions(response.data.data))
        .catch((error) => {
          console.error("Error fetching divisions:", error);
          setMessage("Failed to fetch divisions. Please try again later.");
        });
    }
  }, [token]);

  // Fetch districts from API
  const fetchDistricts = (division) => {
    axios
      .get(`https://bdapis.com/api/v1.2/division/${division}`)
      .then((response) => {
        const districtNames = response.data.data.map((item) => item.district);
        setDistricts(districtNames);
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
        setMessage("Failed to fetch districts. Please try again later.");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === "division") {
      setFormData({ ...formData, division: value, district: "" });
      fetchDistricts(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("Authentication required!");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        volunteerName: formData.volunteerName,
        volunteerMail: formData.volunteerMail,
        blood_group: formData.blood_group,
        division: formData.division,
        district: formData.district,
      };

      const response = await axios.post(
        "http://localhost:8000/api/create-volunteer",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessage("Volunteer registration successful!");
        setFormData({
          volunteerName: "",
          volunteerMail: "",
          blood_group: "",
          division: "",
          district: "",
        });
      } else {
        setMessage("Failed to register. Please try again.");
      }
    } catch (error) {
      setMessage("Failed to register. Please try again.");
      console.error(error);
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="flex min-h-screen">
        {/* Right Sidebar - Hidden on mobile */}
        <div className="hidden lg:flex lg:w-[40%] bg-[#311B08] flex-col items-center justify-center p-8 text-white">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold mb-4 text-amber-500">Welcome Back</h1>
            <p className="text-2xl opacity-90">
              Join our volunteer community and make a difference
            </p>
            <p className="text-xl opacity-75">
              Together we can help those in need during disasters.
            </p>
          </div>
        </div>
        {/* Left Content - Full width on mobile, 60% on desktop */}
        <div className="w-full lg:w-[60%] flex items-center justify-center bg-gray-50 p-4 lg:p-8">
          <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg max-w-xl w-full text-center">
            <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              You need to be logged in to join as a volunteer.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#311B08] text-amber-500 text-lg hover:underline font-semibold px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all mb-4"
            >
              Log In
            </button>
            <p className="text-gray-600 text-lg">
              Don't have an account?{" "}
              <span
                className="text-[#311B08] cursor-pointer hover:underline font-semibold"
                onClick={() => navigate("/register")}
              >
                Create one
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-auto">
      {/* Left Form Section - Full width on mobile, 60% on desktop */}
      <div className="w-full lg:w-[60%] bg-gray-50 py-20 lg:py-24">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-10 lg:py-14 w-full max-w-4xl mx-auto">
            {/* Mobile header - only visible on small screens */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center mb-3">
                <Users size={50} className="text-amber-500" />
              </div>
              <h1 className="text-3xl font-bold text-[#311B08] mb-3">Join as a Volunteer</h1>
              <p className="text-lg text-gray-600 px-2">
                Make a difference in your community during disasters.
              </p>
            </div>

            {/* Back arrow and Join volunteer header */}
            <div className="flex items-center mb-6 lg:mb-8">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="mt-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h2 className="text-xl lg:text-[1.7rem] font-bold text-[#311B08]">Join as a Volunteer</h2>
            </div>

            {message && (
              <div className={`text-center p-3 mb-6 rounded-lg ${message.includes('successful') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              {/* Name */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="volunteerName"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base bg-gray-100"
                  placeholder="Enter your name"
                  value={formData.volunteerName}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="volunteerMail"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base bg-gray-100"
                  placeholder="Enter your email"
                  value={formData.volunteerMail}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Blood Group
                </label>
                <input
                  type="text"
                  name="blood_group"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#311B08] focus:border-transparent outline-none transition-colors text-base bg-gray-100"
                  placeholder="Enter your blood group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#311B08] text-lg font-semibold text-amber-500 hover:bg-[#EBB380] hover:text-[#311B08] p-4 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Join as Volunteer"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Hidden on mobile and tablet, visible on large screens */}
      <div className="hidden lg:flex lg:w-[40%] bg-[#311B08] items-center justify-center p-8 text-white py-20 lg:py-24">
        <div className="text-center space-y-6 flex flex-col items-center justify-center">
          {/* Icon */}
          <div className="flex justify-center">
            <Users size={80} className="text-gray-300" />
          </div>
          <h1 className="text-3xl xl:text-4xl font-bold text-amber-500">Join as a Volunteer</h1>
          <p className="text-lg xl:text-xl opacity-90 leading-relaxed mx-8">
            Volunteer registration enables community members to offer their time, skills, and resources to assist during disaster response and recovery efforts, creating a network of prepared and willing helpers.
          </p>
          <div className="space-y-4 text-left w-full max-w-md">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xl opacity-85">Help coordinate relief efforts in your community</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xl opacity-85">Provide essential support during emergencies</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xl opacity-85">Connect with local disaster response teams</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xl opacity-85">Make a meaningful difference when it matters most</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteers;
