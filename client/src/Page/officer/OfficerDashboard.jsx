import React, { useState } from "react";
import { Menu } from "lucide-react";

import OfficerSidebar from "../../components/officer/OfficerSidebar";
import OfficerNavbar from "../../components/officer/OfficerNavbar";
import OfficerHome from "../../components/officer/OfficerHome";
import OfficerComplaints from "../../components/officer/OfficerComplaints";
import OfficerProfile from "../../components/officer/OfficerProfile";

const OfficerDashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <OfficerHome />;

      case "complaints":
        return <OfficerComplaints />;

      case "profile":
        return <OfficerProfile />;

      default:
        return <OfficerHome />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <OfficerSidebar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          setSidebarOpen(false);
        }}
        sidebarOpen={sidebarOpen}
      />

      {/* Main area */}
      <div className="min-h-screen lg:ml-72">
        <OfficerNavbar />

        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-5 left-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl lg:hidden"
        >
          <Menu size={22} />
        </button>

        <main className="p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default OfficerDashboard;