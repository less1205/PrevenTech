import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "../styles/layout.css";

function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;