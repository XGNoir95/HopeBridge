import React from 'react';

const AdminInfo = ({ adminData }) => {
    return (
        <div className="text-lg bg-[#EBB380] border border-[#311B08] px-8 py-6 rounded-lg shadow-md">
            <h2 className="text-4xl font-bold text-[#311B08] mb-4">Admin Information:</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-xl font-bold text-[#311B08]">Name:</label>
                    <textarea
                        readOnly
                        value={adminData.adminName}
                        className="bg-white font-semibold text-lg w-full border rounded-lg text-[#311B08] h-13 px-3 py-3 resize-none"
                    />
                </div>
                <div>
                    <label className="block text-xl font-bold text-[#311B08]">Email:</label>
                    <textarea
                        readOnly
                        value={adminData.adminMail}
                        className="bg-white font-semibold text-lg w-full p-3 border rounded-lg text-[#311B08] h-13 px-3 py-3 resize-none"
                    />
                </div>
                <div>
                    <label className="block text-xl font-bold text-[#311B08]">Mobile No:</label>
                    <textarea
                        readOnly
                        value={adminData.adminPhone}
                        className="bg-white font-semibold text-lg w-full p-3 border rounded-lg text-[#311B08] h-13 px-3 py-3 resize-none"
                    />
                </div>
                <div>
                    <label className="block text-xl font-bold text-[#311B08]">City:</label>
                    <textarea
                        readOnly
                        value={`${adminData.city}, ${adminData.district}`}
                        className="bg-white font-semibold text-lg w-full p-3 border rounded-lg text-[#311B08] h-13 px-3 py-3 resize-none"
                    />
                </div>
                <div>
                    <label className="block text-xl font-bold text-[#311B08]">Blood Group:</label>
                    <textarea
                        readOnly
                        value={adminData.blood_group}
                        className="bg-white font-semibold text-lg w-full p-3 border rounded-lg text-[#311B08] h-13 px-3 py-3 resize-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminInfo;