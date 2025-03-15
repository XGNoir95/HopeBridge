import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AllReports = () => {
    const navigate = useNavigate();
    const [allReports, setAllReports] = useState([]);

    // Fetch all reports
    useEffect(() => {
        const fetchAllReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/disaster-posts', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch all reports');
                }

                const data = await response.json();
                setAllReports(data.disaster_posts); // Assuming the API returns an array of reports
            } catch (error) {
                console.error("Error fetching all reports:", error);
            }
        };

        fetchAllReports();
    }, []);

    // Handle Delete Button Click
    const handleDeleteReport = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/disaster-posts/${postId}`, {
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
            setAllReports((prevReports) =>
                prevReports.filter((post) => post.post_id !== postId)
            );
            alert('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete the post');
        }
    };

    return (
        <div className="text-lg bg-[#EBB380] border border-[#311B08] px-8 py-6 rounded-lg shadow-md">
            <h2 className="text-4xl font-bold text-[#311B08] mb-4">All Reports:</h2>
            <div className="grid grid-cols-1 gap-4">
                {Array.isArray(allReports) && allReports.length > 0 ? (
                    allReports.map((post, index) => (
                        <div key={post.post_id} className="bg-white p-4 rounded-lg shadow-md border border-[#311B08]">
                            <h3 className="text-2xl font-bold text-[#311B08]">Report {index + 1}: {post.title}</h3>
                            <p className="text-xl text-[#311B08] mt-2">{post.description}</p>
                            <p className="text-xl font-semibold text-[#311B08] mt-2">{post.district}, {post.division}</p>
                            <p className="text-lg font-semibold text-gray-500 mt-2">{new Date(post.created_at).toLocaleString()}</p>
                            <div className="flex gap-4 mt-4">
                                {/* View Button */}
                                <button
                                    className="w-30 bg-[#311B08] text-[#EBB380] px-4 py-2 rounded-lg hover:bg-amber-600 hover:text-white font-semibold"
                                    onClick={() => navigate(`/disaster-posts/${post.post_id}`)}
                                >
                                    View
                                </button>
                                {/* Delete Button */}
                                <button
                                    className="w-30 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-900"
                                    onClick={() => handleDeleteReport(post.post_id)}
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
    );
};

export default AllReports;
