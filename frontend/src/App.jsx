import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ChatBot from "./components/ChatBot";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

// Import all your pages
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
import ContactUs from "./pages/ContactUs"; 
import Shelter from "./pages/Shelter";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          {/* Public Routes - Accessible to everyone */}
          <Route path="/" element={<Home />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/relief" element={<Relief />} />
          <Route path="/safeguard" element={<Safeguard />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/donate-money" element={<DonateMoney />} />
          <Route path="/donate-blood" element={<DonateBlood />} />
          <Route path="/donate-goods" element={<DonateGoods />} />
          <Route path="/disaster-posts/:post_id" element={<DisasterPostDetail />} />
          <Route path="/vlog-details/:id" element={<VlogDetails />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/shelter" element={<Shelter />} />

          {/* Guest Only Routes - Only for unauthenticated users */}
          <Route 
            path="/login" 
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            } 
          />

          {/* USER ONLY Routes - Only for regular users */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['user']} fallbackPath="/admin-dashboard">
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile-info" 
            element={
              <ProtectedRoute allowedRoles={['user']} fallbackPath="/admin-dashboard">
                <ProfileInfo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-profile" 
            element={
              <ProtectedRoute allowedRoles={['user']} fallbackPath="/admin-dashboard">
                <EditProfile />
              </ProtectedRoute>
            } 
          />

          {/* SHARED Routes - Both user and admin can access */}
          <Route 
            path="/report" 
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <Report />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-reports" 
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <MyReports />
              </ProtectedRoute>
            } 
          />

          {/* ADMIN ONLY Routes - Only for admin users */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']} fallbackPath="/profile">
                <AdminProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-info" 
            element={
              <ProtectedRoute allowedRoles={['admin']} fallbackPath="/profile">
                <AdminInfo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/all-reports" 
            element={
              <ProtectedRoute allowedRoles={['admin']} fallbackPath="/profile">
                <AllReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload-vlogs" 
            element={
              <ProtectedRoute allowedRoles={['admin']} fallbackPath="/profile">
                <UploadVlogs />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Footer />
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;
