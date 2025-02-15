import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";  
import Relief from "./pages/Relief";
import Safeguard from "./pages/Safeguard";
import Alerts from "./pages/Alerts";
import Report from "./pages/Report";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/relief" element={<Relief />} />
          <Route path="/safeguard" element={<Safeguard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/report" element={<Report />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
