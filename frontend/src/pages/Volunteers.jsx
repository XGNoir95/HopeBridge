import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // For decoding the JWT token

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
  const token = localStorage.getItem("token"); // Get the JWT token from local storage

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          throw new Error("No token found in localStorage");
        }

        // Decode the token to get the user ID
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.uid; // Assuming `uid` is the key for user_id in the token

        if (!userId) {
          throw new Error("User ID not found in token");
        }

        // Fetch user data from the API
        const response = await axios.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update formData with the user's data
        setFormData((prevData) => ({
          ...prevData,
          volunteerName: response.data.userName,
          volunteerMail: response.data.userMail,
          blood_group: response.data.blood_group,
          division: response.data.division,
          district: response.data.district,
        }));

        // Fetch districts for the user's division
        if (response.data.division) {
          fetchDistricts(response.data.division);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Failed to fetch user data. Please try again.");
      }
    };

    fetchUserData();
  }, [token]);

  // Fetch divisions from API
  useEffect(() => {
    axios
      .get("https://bdapis.com/api/v1.2/divisions")
      .then((response) => setDivisions(response.data.data))
      .catch((error) => {
        console.error("Error fetching divisions:", error);
        setMessage("Failed to fetch divisions. Please try again later.");
      });
  }, []);

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
      // Prepare the payload for the API request
      const payload = {
        volunteerName: formData.volunteerName,
        volunteerMail: formData.volunteerMail,
        blood_group: formData.blood_group,
        division: formData.division,
        district: formData.district,
      };

      // Submit the data to the backend
      const response = await axios.post(
        "/api/create-volunteer",
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

  return (
    <div className="py-20 relative flex size-full min-h-screen flex-col overflow-x-hidden bg-gray-100">
      <div className="layout-container flex h-full grow flex-col items-center py-10">
        {/* Wider Card Container */}
        <div className="w-full md:w-[780px] max-w-[1024px] py-5 border border-amber-900 rounded-xl shadow-lg bg-white p-4 md:p-8">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-2xl md:text-[32px] font-bold leading-tight text-gray-900 text-center md:text-left">
              Join as a Volunteer
            </p>
          </div>

          {message && <p className="text-center text-green-500">{message}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="text-lg font-bold px-4 pb-2">Name</label>
            <input
              type="text"
              name="volunteerName"
              className="form-input w-full rounded-xl bg-gray-100 h-12 md:h-14 p-3 md:p-[15px] text-base"
              placeholder="Enter your name"
              value={formData.volunteerName}
              onChange={handleChange}
              required
              readOnly // Make the field non-editable
            />

            <label className="text-lg font-bold px-4 pb-2 mt-4">Email</label>
            <input
              type="email"
              name="volunteerMail"
              className="form-input w-full rounded-xl bg-gray-100 h-12 md:h-14 p-3 md:p-[15px] text-base"
              placeholder="Enter your email"
              value={formData.volunteerMail}
              onChange={handleChange}
              required
              readOnly // Make the field non-editable
            />

            <label className="text-lg font-bold px-4 pb-2 mt-4">Blood Group</label>
            <input
              type="text"
              name="blood_group"
              className="form-input w-full rounded-xl bg-gray-100 h-12 md:h-14 p-3 md:p-[15px] text-base"
              placeholder="Enter your blood group"
              value={formData.blood_group}
              onChange={handleChange}
              required
              readOnly // Make the field non-editable
            />

            {/* <label className="text-lg font-bold px-4 pb-2 mt-4">Location</label>
            <div className="flex flex-col md:flex-row gap-4">
              <select
                name="division"
                className="w-full rounded-xl bg-gray-100 h-12 md:h-14 p-3 md:p-[15px] text-base"
                value={formData.division}
                onChange={handleChange}
                required
                readOnly // Make the field non-editable
              >
                <option value="" disabled>
                  Select Division
                </option>
                {divisions.map((division, index) => (
                  <option key={index} value={division.division}>
                    {division.division}
                  </option>
                ))}
              </select>

              <select
                name="district"
                className="w-full rounded-xl bg-gray-100 h-12 md:h-14 p-3 md:p-[15px] text-base disabled:bg-gray-300"
                value={formData.district}
                onChange={handleChange}
                required
                readOnly // Make the field non-editable
              >
                <option value="" disabled>
                  Select District
                </option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div> */}

            <div className="flex px-4 py-5 justify-center">
              <button
                type="submit"
                disabled={loading}
                className="text-white flex w-full md:w-[220px] h-12 md:h-14 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-amber-900 to-amber-600 text-lg font-bold hover:scale-105 transition-all"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Volunteers;