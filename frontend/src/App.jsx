// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const App = () => {
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         axios.get('http://127.0.0.1:8000/api/tests')
//             .then(response => {
//                 setMessage(response.data.message);
//             })
//             .catch(error => {
//                 console.error('Error connecting to backend:', error);
//             });
//     }, []);

//     return (
//         <div>
//             <h1>Joy Bangla Laravel Website for pedophiles</h1>
//             <p>{message || 'Connecting...'}</p>
//         </div>
//     );
// };

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
};

export default App;
