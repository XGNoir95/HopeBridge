// ProfileInfo.js
import React from 'react';

const ProfileInfo = ({ user }) => {
    return (
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
    );
};

export default ProfileInfo;