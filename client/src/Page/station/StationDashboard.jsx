import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import StationSidebar from "../../components/station/StationSidebar";
import StationNavbar from "../../components/station/StationNavbar";
import StationHome from "../../components/station/StationHome";
import StationOfficers from "../../components/station/StationOfficers";
import CreateOfficer from "../../components/station/CreateOfficer";
import StationComplaints from "../../components/station/StationComplaints";
import StationProfile from "../../components/station/StationProfile";

const StationDashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stationData, setStationData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("station") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("stationToken");

    if (!token) {
      window.location.href = "/station-login";
    }
  }, []);

  const refreshStationData = () => {
    try {
      const data = JSON.parse(
        localStorage.getItem("station") || "null"
      );

      setStationData(data);
      console.log("Station data refreshed:", data);
    } catch {
      setStationData(null);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <StationHome
            stationData={stationData}
            onNavigate={setActivePage}
          />
        );

      case "officers":
        return (
          <StationOfficers
            stationData={stationData}
          />
        );

      case "create-officer":
        return (
          <CreateOfficer
            stationData={stationData}
            onCreated={() => setActivePage("officers")}
          />
        );

      case "complaints":
        return (
          <StationComplaints
            stationData={stationData}
          />
        );

      case "profile":
        return (
          <StationProfile
            stationData={stationData}
            onUpdated={refreshStationData}
          />
        );

      default:
        return (
          <StationHome
            stationData={stationData}
            onNavigate={setActivePage}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <StationSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        stationData={stationData}
      />

      <div className="lg:pl-72">
        <StationNavbar
          stationData={stationData}
          setSidebarOpen={setSidebarOpen}
          setActivePage={setActivePage}
        />

        <main className="min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {renderPage()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default StationDashboard;