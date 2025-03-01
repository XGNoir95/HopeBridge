import React, { useState } from 'react';

const UploadVlogs = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/admin/upload-vlog', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload vlog');
            }

            const data = await response.json();
            setMessage(data.message || 'Vlog uploaded successfully!');
        } catch (error) {
            console.error('Error uploading vlog:', error);
            setMessage('Failed to upload vlog.');
        }
    };

    return (
        <div className="text-lg bg-[#EBB380] border border-[#311B08] px-8 py-6 rounded-lg shadow-md">
            <h2 className="text-4xl font-bold text-[#311B08] mb-4">Add Vlogs/Videos:</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block text-xl font-bold text-[#311B08]">Select File:</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="mt-2"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-[#311B08] text-[#EBB380] px-4 py-2 rounded-lg hover:bg-amber-600 hover:text-white"
                >
                    Upload
                </button>
            </form>
            {message && <p className="mt-4 text-xl text-[#311B08]">{message}</p>}
        </div>
    );
};

export default UploadVlogs;