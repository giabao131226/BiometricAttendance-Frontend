import { useState } from "react";
import Sidebar from "../Sidebar/sidebar";
import Header from "../Header/header";
import "./home.css";

function Home({ children, role = "university" }) {
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
        role={role}
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
      />

      <Header onToggleSidebar={handleToggleSidebar} />

      <main className="home-main-content">
        {children}
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
