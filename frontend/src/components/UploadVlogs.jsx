import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadVlogs = () => {
    const [message, setMessage] = useState('');
    const [uploadType, setUploadType] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [files, setFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const navigate = useNavigate();

    const handleFilesChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        // Generate image previews
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        setImagePreviews(updatedPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (uploadType === 'vlog') {
            if (!title || !description || files.length === 0) {
                setMessage('Please fill all fields and select at least one image.');
                return;
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('articleDescription', description);
            files.forEach((file) => {
                formData.append('files[]', file);
            });

            try {
                const response = await fetch('/api/create-article', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.message || 'Failed to upload vlog');
                }

                setMessage('Vlog uploaded successfully!');
                resetForm();
                window.alert('Vlog uploaded successfully!');
                window.location.reload();
            } catch (error) {
                console.error('Error uploading vlog:', error);
                setMessage(error.message || 'Failed to upload vlog.');
            }
        } else if (uploadType === 'video') {
            if (!title || !description || !videoLink) {
                setMessage('Please fill all fields.');
                return;
            }

            try {
                const response = await fetch('/api/create-video', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        video_link: videoLink,
                    }),
                });

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.message || 'Failed to upload video');
                }

                setMessage('Video uploaded successfully!');
                resetForm();
                window.alert('Video uploaded successfully!');
                window.location.reload(); // Redirect to admin info screen
            } catch (error) {
                console.error('Error uploading video:', error);
                setMessage(error.message || 'Failed to upload video.');
            }
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setVideoLink('');
        setFiles([]);
        setImagePreviews([]);
    };

    return (
        <div className="text-lg bg-[#EBB380] border border-[#311B08] px-8 py-6 rounded-lg shadow-md">
            <h2 className="text-4xl font-bold text-[#311B08] mb-4">Add Vlogs/Videos:</h2>
            {!uploadType ? (
                <div>
                    <button
                        onClick={() => setUploadType('vlog')}
                        className="mt-4 bg-[#311B08] text-[#EBB380] px-4 py-2 rounded-lg hover:bg-amber-600 hover:text-white mr-4"
                    >
                        Upload Vlog
                    </button>
                    <button
                        onClick={() => setUploadType('video')}
                        className="mt-4 bg-[#311B08] text-[#EBB380] px-4 py-2 rounded-lg hover:bg-amber-600 hover:text-white"
                    >
                        Upload Video
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xl font-bold text-[#311B08]">Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-white border border-black mt-2 p-2 w-full rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xl font-bold text-[#311B08]">Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-white border border-black mt-2 p-2 w-full rounded-lg"
                            required
                        />
                    </div>
                    {uploadType === 'vlog' ? (
                        <>
                            <label className="text-lg font-bold px-4 pb-2 mt-4">Upload Images</label>
                            <div className="px-4 py-3 flex justify-center">
                                <label className="w-full cursor-pointer">
                                    <div className="border-2 border-dashed border-amber-900 bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                        <p className="text-amber-600 font-medium">Drag & Drop or Click to Upload</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFilesChange}
                                            multiple
                                            className="hidden"
                                            required
                                        />
                                    </div>
                                </label>
                            </div>

                            {/* Image Previews */}
                            <div className="flex flex-wrap gap-4 mt-4">
                                {imagePreviews.map((src, index) => (
                                    <div key={index} className="relative">
                                        <img src={src} alt="preview" className="h-24 w-24 object-cover rounded-lg" />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block text-xl font-bold text-[#311B08]">Video Link:</label>
                            <input
                                type="text"
                                value={videoLink}
                                onChange={(e) => setVideoLink(e.target.value)}
                                className="bg-white border border-black mt-2 p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                    )}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="mt-4 bg-[#311B08] text-[#EBB380] px-4 py-2 rounded-lg hover:bg-amber-600 hover:text-white"
                        >
                            Upload
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setUploadType(null);
                                resetForm();
                            }}
                            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Back
                        </button>
                    </div>
                </form>
            )}
            {message && <p className="mt-4 text-xl text-[#311B08]">{message}</p>}
        </div>
    );
};

export default UploadVlogs;