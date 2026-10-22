import React, { useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import AdminHome from "../../components/admin/AdminHome";
import CreateStation from "../../components/admin/CreateStation";
import AdminStations from "../../components/admin/AdminStations";
import AdminOfficers from "../../components/admin/AdminOfficers";
import AdminUsers from "../../components/admin/AdminUsers";
import AdminComplaints from "../../components/admin/AdminComplaints";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <AdminHome />;

      case "stations":
        return <AdminStations />;

      case "create-station":
        return <CreateStation />;

      case "officers":
        return <AdminOfficers />;

      case "users":
        return <AdminUsers />;

      case "complaints":
        return <AdminComplaints />;

      default:
        return <AdminHome />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:pl-72">

        <AdminNavbar
          setSidebarOpen={setSidebarOpen}
        />

        <main className="min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>

      </div>
    </div>
  );
};

export default AdminDashboard;