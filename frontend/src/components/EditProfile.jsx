// EditProfile.js
import React from 'react';

const EditProfile = ({
    user,
    setUser,
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    editPhone,
    setEditPhone,
    editBloodGroup,
    setEditBloodGroup,
    setActiveTab,
}) => {
    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('userName', editName);
            formData.append('userMail', editEmail);
            formData.append('userPhone', editPhone);
            formData.append('blood_group', editBloodGroup);

            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput && fileInput.files[0]) {
                formData.append('profile_picture', fileInput.files[0]);
            }

            const response = await fetch('/api/user/update-user', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update user profile');
            }

            const data = await response.json();
            if (data.success) {
                alert('Profile updated successfully');
                setUser({
                    ...user,
                    userName: data.user.userName,
                    email: data.user.userMail,
                    phone: data.user.userPhone,
                    blood_group: data.user.blood_group,
                    profilePic: data.user.profile_picture,
                });
                setActiveTab('profile');
                window.location.reload();
            } else {
                alert(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    return (
        <div className="bg-[#EBB380] border border-[#311B08] px-8 py-6 rounded-lg shadow-md">
            <h2 className="text-4xl font-bold text-[#311B08] mb-4">Edit Profile:</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-xl font-bold text-[#311B08]">Profile Picture:</label>
                    <div className="mt-2">
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
                                            profilePic: reader.result,
                                        }));
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        <div className="flex items-center gap-4">
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
                    <label className="block text-xl font-bold text-[#311B08]">Email:</label>
                    <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="h-13 px-3 py-3 bg-white font-semibold text-lg w-full border rounded-lg text-[#311B08]"
                    />
                </div>

                <div>
                    <label className="block text-xl font-bold text-[#311B08]">Phone:</label>
                    <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="h-13 px-3 py-3 bg-white font-semibold text-lg w-full border rounded-lg text-[#311B08]"
                    />
                </div>

                <div>
                    <label className="block text-xl font-bold text-[#311B08]">Blood Group:</label>
                    <input
                        type="text"
                        value={editBloodGroup}
                        onChange={(e) => setEditBloodGroup(e.target.value)}
                        className="h-13 px-3 py-3 bg-white font-semibold text-lg w-full border rounded-lg text-[#311B08]"
                    />
                </div>

                <button
                    className="h-13 w-full bg-[#311B08] text-[#EBB380] font-semibold text-lg px-4 py-2 rounded-lg hover:bg-amber-600 hover:text-white border border-[#311B08]"
                    onClick={handleSaveChanges}
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
    );
};

export default EditProfile;