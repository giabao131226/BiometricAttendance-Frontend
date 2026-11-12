import { useState } from "react";
import Sidebar from "../Sidebar/sidebar";
import Header from "../Header/header";
import "./home.css";
import { Outlet } from "react-router-dom";

function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 767) {
      setIsMobileSidebarOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => !prev);
    }
  };

  const handleCloseSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className={`home-dashboard-container ${isSidebarCollapsed ? "home-sidebar-collapsed" : ""}`}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
      />

      <Header onToggleSidebar={handleToggleSidebar} />

      <main className="home-main-content">
          <Outlet />
      </main>

      {isMobileSidebarOpen && (
        <div
          className="home-sidebar-overlay"
          onClick={handleCloseSidebar}
        />
      )}
    </div>
  );
}

export default Home;