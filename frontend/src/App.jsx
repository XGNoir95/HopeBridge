import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; // Import this
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Alerts from "./pages/Alerts";
import Relief from "./pages/Relief";
import Safeguard from "./pages/Safeguard";
import Report from "./pages/Report";
import DonationPage from "./pages/DonationPage";
import DonateMoney from "./pages/DonateMoney";
import DonateBlood from "./pages/DonateBlood";
import DonateGoods from "./pages/DonateGoods";
import DisasterPostDetail from "./pages/DisasterPostDetail";

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* Add this here */}
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/relief" element={<Relief />} />
          <Route path="/safeguard" element={<Safeguard />} />
          <Route path="/report" element={<Report />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/donate-money" element={<DonateMoney />} />
          <Route path="/donate-blood" element={<DonateBlood />} />
          <Route path="/donate-goods" element={<DonateGoods />} />
          <Route path="/disaster-posts/:id" element={<DisasterPostDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
