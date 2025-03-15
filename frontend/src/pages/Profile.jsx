// Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileInfo from '../components/ProfileInfo';
import MyReports from '../components/MyReports';
import EditProfile from '../components/EditProfile';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        userName: '',
        email: '',
        phone: '',
        profilePic: '',
        city: '',
        district: '',
        blood_group: '',
    });

    const [activeTab, setActiveTab] = useState('profile');
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editBloodGroup, setEditBloodGroup] = useState('');
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUser({
                    userName: data.userName,
                    email: data.userMail,
                    phone: data.userPhone,
                    profilePic: data.profile_picture,
                    city: data.city,
                    district: data.district,
                    blood_group: data.blood_group,
                });
                setEditName(data.userName);
                setEditEmail(data.userMail);
                setEditPhone(data.userPhone);
                setEditBloodGroup(data.blood_group);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (activeTab === 'reports') {
            const fetchUserPosts = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('/api/user/posts', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch user posts');
                    }

                    const data = await response.json();
                    if (data.success && Array.isArray(data.user_posts)) {
                        setUserPosts(data.user_posts);
                    } else {
                        console.error('Expected an array but got:', data);
                        setUserPosts([]);
                    }
                } catch (error) {
                    console.error("Error fetching user posts:", error);
                    setUserPosts([]);
                }
            };

            fetchUserPosts();
        }
    }, [activeTab]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.dispatchEvent(new Event("storage"));
        navigate("/");
    };

    if (!user.userName) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div className="container mx-auto py-5">
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

                <div className="grid grid-cols-3 gap-4 mt-6">
                    <button
                        className={`bg-[#EBB380] text-[#311B08] text-lg py-3 rounded-md font-semibold ${activeTab === 'profile' ? 'bg-amber-600 text-white' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        User Information
                    </button>
                    <button
                        className={`bg-[#EBB380] text-[#311B08] text-lg py-3 rounded-md font-semibold ${activeTab === 'reports' ? 'bg-amber-600 text-white' : ''}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        My Reports
                    </button>
                    <button
                        className={`bg-[#EBB380] text-[#311B08] text-lg py-3 rounded-md font-semibold ${activeTab === 'edit' ? 'bg-amber-600 text-white' : ''}`}
                        onClick={() => setActiveTab('edit')}
                    >
                        Edit Profile
                    </button>
                </div>

                <div className="mt-4">
                    <button
                        className="h-auto bg-[#EBB380] text-[#311B08] py-3 text-lg rounded-md font-semibold w-full hover:bg-amber-600 hover:text-white"
                        onClick={handleLogout}
                    >
                        Log Out
                    </button>
                </div>
            </div>

            <div className="mt-8 max-w-auto mx-auto">
                {activeTab === 'profile' && <ProfileInfo user={user} />}
                {activeTab === 'reports' && <MyReports userPosts={userPosts} navigate={navigate} setUserPosts={setUserPosts} />}
                {activeTab === 'edit' && (
                    <EditProfile
                        user={user}
                        setUser={setUser}
                        editName={editName}
                        setEditName={setEditName}
                        editEmail={editEmail}
                        setEditEmail={setEditEmail}
                        editPhone={editPhone}
                        setEditPhone={setEditPhone}
                        editBloodGroup={editBloodGroup}
                        setEditBloodGroup={setEditBloodGroup}
                        setActiveTab={setActiveTab}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;