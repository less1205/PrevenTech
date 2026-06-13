import Sidebar from "../components/Sidebar";
import NotificationBell from "../components/NotificationBell";
import { Outlet } from "react-router-dom";
import "../styles/layout.css";

function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-right">
            <NotificationBell />
          </div>
        </header>

        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;