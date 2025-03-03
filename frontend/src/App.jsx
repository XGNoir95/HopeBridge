import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
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
import ProfileInfo from "./components/ProfileInfo";
import MyReports from "./components/MyReports";
import EditProfile from "./components/EditProfile";
import AdminProfile from "./pages/AdminProfile";
import AdminInfo from "./components/AdminInfo";
import AllReports from "./components/AllReports";
import UploadVlogs from "./components/UploadVlogs";
import VlogDetails from "./pages/VlogDetails";
import Volunteers from "./pages/Volunteers";
import ContactUs from "./pages/ContactUs"; // Import the ContactUs component

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
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
          <Route path="/disaster-posts/:post_id" element={<DisasterPostDetail />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/profile-info" element={<ProfileInfo />} />
          <Route path="/admin-dashboard" element={<AdminProfile />} />
          <Route path="/admin-info" element={<AdminInfo />} />
          <Route path="/all-reports" element={<AllReports />} />
          <Route path="/upload-vlogs" element={<UploadVlogs />} />
          <Route path="/vlog-details/:id" element={<VlogDetails />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/contact-us" element={<ContactUs />} /> {/* Add the ContactUs route */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;