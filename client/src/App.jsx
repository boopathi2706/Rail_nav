import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./Page/MainPage";
import StationList from "./Page/StationList";
import AboutWebsite from "./Page/AboutWebsite";
import ChatBot from "./Page/ChatBot";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./Page/NotFound";

import GoogleMapNavigation from "./components/GoogleMapNavigation";
import Register from "./Page/Register";
import VerifyOTP from "./Page/VerifyOTP";
import Login from "./Page/Login";
import ForgotPassword from "./page/ForgotPassword.jsx";
import VerifyForgotPassword from "./Page/VerifyForgotPassword";
import OfficerLogin from "./Page/OfficerLogin";
import OfficerCreate from "./Page/OfficerCreate";
import AdminLogin from "./Page/AdminLogin";
import StationCreate from "./Page/StationCreate";
import StationLogin from "./Page/StationLogin";
import OfficerDashboard from "./Page/officer/OfficerDashboard";
import StationDashboard from "./Page/station/StationDashboard";
import AdminDashboard from "./Page/admin/AdminDashboard";
import UserDashboard from "./Page/user/UserDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main single-page scroll layout */}
        <Route path="/" element={<MainPage />} />

        {/* Subpages wrapped in standard layout */}
        <Route
          path="/stations"
          element={
            <div className="flex min-h-screen flex-col bg-slate-50">
              <Navbar />
              <main className="flex-grow">
                <StationList />
              </main>
              <Footer />
            </div>
          }
        />

        <Route
          path="/about"
          element={
            <div className="flex min-h-screen flex-col bg-slate-50">
              <Navbar />
              <main className="flex-grow">
                <AboutWebsite />
              </main>
              <Footer />
            </div>
          }
        />

        <Route
          path="/chatbot"
          element={
            <div className="flex min-h-screen flex-col bg-slate-50">
              <Navbar />
              <main className="flex-grow">
                <ChatBot />
              </main>
              <Footer />
            </div>
          }
        />
        <Route path="/map" element={<GoogleMapNavigation />} />

        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* OTP + new password */}
        <Route
          path="/verify-forgot-password"
          element={<VerifyForgotPassword />}
        />
        <Route
          path="/user_main"
          element={
            <UserDashboard />
          }
        />

        <Route path="/officer-login" element={<OfficerLogin />} />

        <Route path="/officer-main" element={<OfficerDashboard />} />
        <Route path="/officer-create" element={<OfficerCreate />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-main" element={<AdminDashboard />} />
        <Route path="/station-create" element={<StationCreate />} />
        <Route path="/station-login" element={<StationLogin />} />

        <Route path="/station-main" element={<StationDashboard />} />
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
