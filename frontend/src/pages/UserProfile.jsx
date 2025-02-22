import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
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
    const [userPosts, setUserPosts] = useState([]); // Initialize as an empty array

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
                setUser({
                    userName: data.userName,
                    email: data.userMail,
                    phone: data.userPhone,
                    profilePic: data.profile_picture,
                    city: data.city,
                    district: data.district,
                    blood_group: data.blood_group,
                });
                // Pre-fill the edit fields with the fetched user data
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
                    const response = await fetch('http://localhost:8000/api/user/posts', {
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
                    console.log('API Response:', data); // Debugging: Log the API response

                    // Extract the `user_posts` array from the response
                    if (data.success && Array.isArray(data.user_posts)) {
                        setUserPosts(data.user_posts); // Set the posts array
                    } else {
                        console.error('Expected an array but got:', data);
                        setUserPosts([]); // Set to empty array if the response is not as expected
                    }
                } catch (error) {
                    console.error("Error fetching user posts:", error);
                    setUserPosts([]); // Set to empty array in case of error
                }
            };

            fetchUserPosts();
        }
    }, [activeTab]);

    if (!user.userName) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("storage"));
        navigate("/");
    };

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
                        className={`bg-[#EBB380] text-[#311B08] text-lg py-3 rounded-md font-semibold ${activeTab === 'profile' ? 'bg-amber-600 text-white' : ''
                            }`}
                        onClick={() => setActiveTab('profile')}
                    >
                        User Information
                    </button>
                    <button
                        className={`bg-[#EBB380] text-[#311B08] text-lg py-3 rounded-md font-semibold ${activeTab === 'reports' ? 'bg-amber-600 text-white' : ''
                            }`}
                        onClick={() => setActiveTab('reports')}
                    >
                        My Reports
                    </button>
                    <button
                        className={`bg-[#EBB380] text-[#311B08] text-lg py-3 rounded-md font-semibold ${activeTab === 'edit' ? 'bg-amber-600 text-white' : ''
                            }`}
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
                            <div>
                                <label className="block text-xl font-bold text-[#311B08]">City:</label>
                                <textarea
                                    readOnly
                                    value={`${user.city}, ${user.district}`}
                                    className="bg-white font-semibold text-lg w-full p-3 border rounded-lg text-[#311B08] h-13 px-3 py-3 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xl font-bold text-[#311B08]">Blood Group:</label>
                                <textarea
                                    readOnly
                                    value={user.blood_group}
                                    className="bg-white font-semibold text-lg w-full p-3 border rounded-lg text-[#311B08] h-13 px-3 py-3 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="text-lg bg-[#EBB380] border border-[#311B08] px-8 py-6 rounded-lg shadow-md">
                        <h2 className="text-4xl font-bold text-[#311B08] mb-4">My Reports:</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {Array.isArray(userPosts) && userPosts.length > 0 ? (
                                userPosts.map((post, index) => (
                                    <div key={post.post_id} className="bg-white p-4 rounded-lg shadow-md border border-[#311B08]">
                                        <h3 className="text-2xl font-bold text-[#311B08]">Report {index + 1}: {post.title}</h3>
                                        <p className="text-xl text-[#311B08] mt-2">{post.description}</p>
                                        <p className="text-xl font-semibold text-[#311B08] mt-2">{post.district}, {post.division}</p>
                                        <p className="text-lg font-semibold text-gray-500 mt-2">{new Date(post.created_at).toLocaleString()}</p>

                                        {/* Buttons for View and Delete */}
                                        <div className="flex gap-4 mt-4">
                                            {/* View Button */}
                                            <button
                                                className="w-30 bg-[#311B08] text-[#EBB380] px-4 py-2 rounded-lg hover:bg-amber-600 hover:text-white font-semibold"
                                                onClick={() => navigate(`/disaster-posts/${post.post_id}`)} // Navigate to the detailed view
                                            >
                                                View
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                className="w-30 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-900"
                                                onClick={async () => {
                                                    try {
                                                        const token = localStorage.getItem('token');
                                                        const response = await fetch(`http://localhost:8000/api/disaster-posts/${post.post_id}`, {
                                                            method: 'DELETE',
                                                            headers: {
                                                                'Authorization': `Bearer ${token}`,
                                                                'Content-Type': 'application/json',
                                                            },
                                                        });

                                                        if (!response.ok) {
                                                            throw new Error('Failed to delete the post');
                                                        }

                                                        // Remove the deleted post from the state
                                                        setUserPosts(userPosts.filter(p => p.post_id !== post.post_id));
                                                        alert('Post deleted successfully');
                                                    } catch (error) {
                                                        console.error('Error deleting post:', error);
                                                        alert('Failed to delete the post');
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-full w-full">
                                    <p className="text-xl text-black font-semibold">No reports found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'edit' && (
                    <div className="bg-[#EBB380] border border-[#311B08] px-8 py-6 rounded-lg shadow-md">
                        <h2 className="text-4xl font-bold text-[#311B08] mb-4">Edit Profile:</h2>
                        <div className="space-y-4">
                            {/* Profile Picture Upload */}
                            <div>
                                <label className="block text-xl font-bold text-[#311B08]">Profile Picture:</label>
                                <div className="mt-2">
                                    {/* File Input (Hidden) */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="profile-picture-upload"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setUser((prevUser) => ({
                                                        ...prevUser,
                                                        profilePic: reader.result, // Preview the selected image
                                                    }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    {/* Upload Button and Preview */}
                                    <div className="flex items-center gap-4">
                                        {/* Upload Button */}

                                        {/* Preview */}
                                        {user.profilePic && (
                                            <div className="w-28 h-28 border rounded-lg p-1 bg-white shadow-md">
                                                <img
                                                    src={user.profilePic}
                                                    alt="Profile Preview"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                        <label
                                            htmlFor="profile-picture-upload"
                                            className="cursor-pointer bg-[#311B08] text-[#EBB380] px-4 py-2 rounded-lg hover:bg-amber-600 hover:text-white border border-[#311B08] font-semibold"
                                        >
                                            Upload Photo
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Name Field */}
                            <div>
                                <label className="block text-xl font-bold text-[#311B08]">Name:</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="h-13 px-3 py-3 bg-white font-semibold text-lg w-full border rounded-lg text-[#311B08]"
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-xl font-bold text-[#311B08]">Email:</label>
                                <input
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="h-13 px-3 py-3 bg-white font-semibold text-lg w-full border rounded-lg text-[#311B08]"
                                />
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label className="block text-xl font-bold text-[#311B08]">Phone:</label>
                                <input
                                    type="text"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    className="h-13 px-3 py-3 bg-white font-semibold text-lg w-full border rounded-lg text-[#311B08]"
                                />
                            </div>

                            {/* Blood Group Field */}
                            <div>
                                <label className="block text-xl font-bold text-[#311B08]">Blood Group:</label>
                                <input
                                    type="text"
                                    value={editBloodGroup}
                                    onChange={(e) => setEditBloodGroup(e.target.value)}
                                    className="h-13 px-3 py-3 bg-white font-semibold text-lg w-full border rounded-lg text-[#311B08]"
                                />
                            </div>

                            {/* Save Changes Button */}
                            <button
                                className="h-13 w-full bg-[#311B08] text-[#EBB380] font-semibold text-lg px-4 py-2 rounded-lg hover:bg-amber-600 hover:text-white border border-[#311B08]"
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem('token');
                                        const formData = new FormData();

                                        // Append text fields
                                        formData.append('userName', editName);
                                        formData.append('userMail', editEmail);
                                        formData.append('userPhone', editPhone);
                                        formData.append('blood_group', editBloodGroup);

                                        // Append profile picture if selected
                                        const fileInput = document.querySelector('input[type="file"]');
                                        if (fileInput && fileInput.files[0]) {
                                            formData.append('profile_picture', fileInput.files[0]);
                                        }

                                        console.log('Sending form data:', formData); // Debugging: Log form data

                                        const response = await fetch('http://localhost:8000/api/user/update-user', {
                                            method: 'POST',
                                            headers: {
                                                'Authorization': `Bearer ${token}`,
                                            },
                                            body: formData, // Send as FormData
                                        });

                                        if (!response.ok) {
                                            throw new Error('Failed to update user profile');
                                        }

                                        const data = await response.json();
                                        console.log('Update Response:', data); // Debugging: Log the response

                                        if (data.success) {
                                            alert('Profile updated successfully');
                                            // Update the user state with the new data
                                            setUser((prevUser) => ({
                                                ...prevUser,
                                                userName: data.user.userName,
                                                email: data.user.userMail,
                                                phone: data.user.userPhone,
                                                blood_group: data.user.blood_group,
                                                profilePic: data.user.profile_picture, // Update profile picture
                                            }));
                                            // Switch back to the profile tab
                                            setActiveTab('profile');
                                            window.location.reload();


                                        } else {
                                            alert(data.message || 'Failed to update profile');
                                        }
                                    } catch (error) {
                                        console.error('Error updating profile:', error);
                                        alert('Failed to update profile');
                                    }
                                }}
                            >
                                Save Changes
                            </button>

                            {/* Cancel Button */}
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