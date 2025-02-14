import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState({
        userName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    });

    const [activeTab, setActiveTab] = useState('profile');
    const [editName, setEditName] = useState(user.userName);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    return (
        <div className="container mx-auto py-5">
            {/* Profile Section */}
            <div className="bg-[#311B08] px-8 py-6 rounded-lg shadow-md max-w-auto mx-auto text-center">
                <div className="flex flex-col items-center">
                    <img
                        src={user.profilePic}
                        alt="Profile"
                        className="w-40 h-40 rounded-full object-cover border-4 border-gray-300"
                    />
                    <h2 className="text-2xl font-bold mt-2 text-white">{user.userName}</h2>
                    <p className="text-lg text-gray-400">{user.email}</p>
                    <div className="w-32 border-b-2 border-[#EBB380] mt-2"></div>
                </div>

                {/* Navigation Buttons */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <button
                        className={`bg-[#EBB380] text-[#311B08] text-lg py-3 rounded-md font-semibold ${
                            activeTab === 'profile' ? 'bg-amber-600 text-white' : ''
                        }`}
                        onClick={() => setActiveTab('profile')}
                    >
                        User Information
                    </button>
                    <button
                        className={`bg-[#EBB380] text-[#311B08] text-lg py-3 rounded-md font-semibold ${
                            activeTab === 'reports' ? 'bg-amber-600 text-white' : ''
                        }`}
                        onClick={() => setActiveTab('reports')}
                    >
                        My Reports
                    </button>
                    <button
                        className={`bg-[#EBB380] text-[#311B08] text-lg py-3 rounded-md font-semibold ${
                            activeTab === 'edit' ? 'bg-amber-600 text-white' : ''
                        }`}
                        onClick={() => setActiveTab('edit')}
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Log Out Button */}
                <div className="mt-4">
                    <button
                        className="h-auto bg-[#EBB380] text-[#311B08] py-3 text-lg rounded-md font-semibold w-full hover:bg-amber-600 hover:text-white"
                        onClick={() => navigate('/')}
                    >
                        Log Out
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="mt-8 max-w-auto mx-auto">
                {activeTab === 'profile' && (
                    <div className="text-lg bg-[#EBB380] border border-[#311B08] px-8 py-6 rounded-lg shadow-md">
                        <h2 className="text-4xl font-bold text-[#311B08] mb-4">Profile Information:</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xl font-bold text-[#311B08]">Name:</label>
                                <textarea
                                    readOnly
                                    value={user.userName}
                                    className="bg-white font-semibold text-lg w-full border rounded-lg text-[#311B08] h-13 px-3 py-3 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xl font-bold text-[#311B08]">Email:</label>
                                <textarea
                                    readOnly
                                    value={user.email}
                                    className="bg-white font-semibold text-lg w-full p-3 border rounded-lg text-[#311B08] h-13 px-3 py-3 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xl font-bold text-[#311B08]">Mobile No:</label>
                                <textarea
                                    readOnly
                                    value={user.phone}
                                    className="bg-white font-semibold text-lg w-full p-3 border rounded-lg text-[#311B08] h-13 px-3 py-3 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="text-lg bg-[#EBB380] border border-[#311B08] px-8 py-6 rounded-lg shadow-md">
                        <h2 className="text-4xl font-bold text-[#311B08] mb-4">My Reports:</h2>
                        <ul className="list-disc list-inside text-xl font-bold text-[#311B08]">
                            <li>Report 1: Flood alert in XYZ area</li>
                            <li>Report 2: Power outage in ABC district</li>
                            <li>Report 3: Emergency medical request in LMN region</li>
                        </ul>
                    </div>
                )}

                {activeTab === 'edit' && (
                    <div className="bg-[#EBB380] border border-[#311B08] px-8 py-6 rounded-lg shadow-md">
                        <h2 className="text-4xl font-bold text-[#311B08] mb-4">Edit Profile:</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xl font-bold text-[#311B08]">Name:</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="h-13 px-3 py-3 bg-white font-semibold text-lg w-full border rounded-lg text-[#311B08]"
                                />
                            </div>
                            <div>
                                <label className="block text-xl font-bold text-[#311B08]">Old Password:</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="h-13 px-3 py-3 bg-white font-semibold w-full border rounded-lg text-[#311B08]"
                                />
                            </div>
                            <div>
                                <label className="block text-xl font-bold text-[#311B08]">New Password:</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="h-13 px-3 py-3 bg-white font-semibold w-full border rounded-lg text-[#311B08]"
                                />
                            </div>
                            <button
                                className="h-13 w-full bg-[#311B08] text-[#EBB380] font-semibold text-lg px-4 py-2 rounded-lg hover:bg-amber-600 hover:text-[#311B08]"
                                onClick={() => alert('Profile Updated')}
                            >
                                Save Changes
                            </button>
                            <button
                                className="h-13 w-full bg-gray-300 text-black border border-black font-semibold text-lg px-4 py-2 rounded-lg hover:bg-gray-400"
                                onClick={() => setActiveTab('profile')}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
