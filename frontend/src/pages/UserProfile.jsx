import React from 'react';
import { Mail, Phone, MapPin, Activity } from 'lucide-react';

const UserProfile = () => {
  const user = {
    name: 'John Doe',
    address: 'San Francisco, CA',
    email: 'johndoe456@gmail.com',
    phone: '+1 (555) 123-4567',
    city: 'San Francisco',
    bloodGroup: 'O +ve',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  };

  return (
    <div className="flex-1 bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="text-center">
              <img 
                src={user.image} 
                alt={user.name}
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
              <p className="text-gray-600 mb-4">{user.address}</p>
              <div className="space-y-2">
                <button className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                  Edit Profile
                </button>
                <button className="w-full border border-orange-500 text-orange-500 px-4 py-2 rounded hover:bg-orange-50">
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
                      <span className="text-lg">{user.name}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600">Email</label>
                    <div className="flex items-center mt-1">
                      <Mail className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600">Mobile No</label>
                    <div className="flex items-center mt-1">
                      <Phone className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-600">City</label>
                    <div className="flex items-center mt-1">
                      <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{user.city}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600">Blood Group</label>
                    <div className="flex items-center mt-1">
                      <Activity className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{user.bloodGroup}</span>
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

export default UserProfile;