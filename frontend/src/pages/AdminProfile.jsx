import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminInfo from '../components/AdminInfo';
import AllReports from '../components/AllReports';
import UploadVlogs from '../components/UploadVlogs';

const AdminProfile = () => {
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState({
        adminName: '',
        adminMail: '',
        profile_picture: '',
    });

    const [activeTab, setActiveTab] = useState('adminInfo'); // State to manage active tab

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8000/api/admin', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch admin data');
                }

                const data = await response.json();
                setAdminData({
                    adminName: data.adminName,
                    adminMail: data.adminMail,
                    adminPhone: data.adminPhone || "Not Available",
                    profilePic: data.profilePic ,
                    city: data.city || "Not Available",
                    district: data.district || "Not Available",
                    blood_group: data.blood_group || "Not Available",
                });
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };

        fetchAdminProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };

    if (!adminData.adminName) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div className="container mx-auto py-5">
            <div className="bg-[#311B08] px-8 py-6 rounded-lg shadow-md max-w-auto mx-auto text-center">
                <div className="flex flex-col items-center">
                    <img
                        src={adminData.profilePic}
                        alt="Profile"
                        className="w-40 h-40 rounded-full object-cover border-4 border-gray-300"
                    />
                    <h2 className="text-2xl font-bold mt-2 text-white">{adminData.adminName}</h2>
                    <p className="text-lg text-gray-400">{adminData.adminMail}</p>
                    <div className="w-32 border-b-2 border-[#EBB380] mt-2"></div>
                </div>

                {/* Buttons for Admin Information, All Reports, and Add Vlogs/Videos */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <button
                        className={`bg-[#EBB380] text-[#311B08] text-lg py-3 rounded-md font-semibold ${activeTab === 'adminInfo' ? 'bg-amber-600 text-white' : ''}`}
                        onClick={() => setActiveTab('adminInfo')}
                    >
                        Admin Information
                    </button>
                    <button
                        className={`bg-[#EBB380] text-[#311B08] text-lg py-3 rounded-md font-semibold ${activeTab === 'allReports' ? 'bg-amber-600 text-white' : ''}`}
                        onClick={() => setActiveTab('allReports')}
                    >
                        All Reports
                    </button>
                    <button
                        className={`bg-[#EBB380] text-[#311B08] text-lg py-3 rounded-md font-semibold ${activeTab === 'addVlogs' ? 'bg-amber-600 text-white' : ''}`}
                        onClick={() => setActiveTab('addVlogs')}
                    >
                        Add Vlogs/Videos
                    </button>
                </div>

                {/* Logout Button */}
                <div className="mt-4">
                    <button
                        className="h-auto bg-[#EBB380] text-[#311B08] py-3 text-lg rounded-md font-semibold w-full hover:bg-amber-600 hover:text-white"
                        onClick={handleLogout}
                    >
                        Log Out
                    </button>
                </div>
            </div>

            {/* Content based on active tab */}
            <div className="mt-8 max-w-auto mx-auto">
                {activeTab === 'adminInfo' && <AdminInfo adminData={adminData} />}
                {activeTab === 'allReports' && <AllReports />}
                {activeTab === 'addVlogs' && <UploadVlogs />}
            </div>
        </div>
    );
};

export default AdminProfile;