import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Activity } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await fetch('http://localhost:8000/api/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send JWT token
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data); // Update state with user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex-1 bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="text-center">
              <img 
                src={user.profile_picture} 
                alt={user.userName}
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-2xl font-bold mb-2">{user.userName}</h2>
              <p className="text-gray-600 mb-4">{user.city}, {user.district}</p>
              <div className="space-y-2">
                <button className="w-full hover:bg-[#EBB380] hover:text-[#311B08] bg-[#311B08] text-[#EBB380] px-4 py-2 rounded">
                  Edit Profile
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('token'); // Clear token on logout
                    navigate("/login"); // Redirect to login page
                  }}
                  className="w-full border border-[#EBB380] text-[#311B08] px-4 py-2 rounded hover:bg-orange-50">
                  Log Out
                </button>
              </div>
            </div>

            {/* Profile Information */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-6">Profile Information:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-600">Full Name</label>
                    <div className="flex items-center mt-1">
                      <span className="text-lg">{user.userName}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600">Email</label>
                    <div className="flex items-center mt-1">
                      <Mail className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{user.userMail}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600">Mobile No</label>
                    <div className="flex items-center mt-1">
                      <Phone className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{user.userPhone}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-600">City</label>
                    <div className="flex items-center mt-1">
                      <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{user.city}, {user.district}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600">Blood Group</label>
                    <div className="flex items-center mt-1">
                      <Activity className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{user.blood_group}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
