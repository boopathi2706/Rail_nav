import React, { useState } from "react";

import UserSidebar from "../../components/user/UserSidebar";
import UserNavbar from "../../components/user/UserNavbar";
import UserHome from "../../components/user/UserHome";
import UserComplaints from "../../components/user/UserComplaints";
import CreateComplaint from "../../components/user/CreateComplaint";
import UserProfile from "../../components/user/UserProfile";
import LogoutModal from "../../components/user/LogoutModal";

const UserDashboard = () => {
  const [activePage, setActivePage] = useState("home");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [showLogout, setShowLogout] =
    useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshUserData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <UserHome
            refreshKey={refreshKey}
          />
        );

      case "complaints":
        return (
          <UserComplaints
            refreshKey={refreshKey}
          />
        );

      case "create":
        return (
          <CreateComplaint
            onComplaintCreated={
              refreshUserData
            }
          />
        );

      case "profile":
        return <UserProfile />;

      default:
        return (
          <UserHome
            refreshKey={refreshKey}
          />
        );
    }
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">

      <UserSidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        mobileOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
        onLogout={() =>
          setShowLogout(true)
        }
      />

      <div className="flex min-w-0 flex-1 flex-col lg:ml-72">

        <UserNavbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
          onProfileClick={() =>
            setActivePage("profile")
          }
          onLogout={() =>
            setShowLogout(true)
          }
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>

      </div>

      {showLogout && (
        <LogoutModal
          onClose={() =>
            setShowLogout(false)
          }
        />
      )}

    </div>
  );
};

export default UserDashboard;