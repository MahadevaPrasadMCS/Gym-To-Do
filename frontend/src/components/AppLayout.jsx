import React, { useState, useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Menu,
  LayoutDashboard,
  CalendarRange,
  Apple,
  LogOut,
  Dumbbell,
} from "lucide-react";

export default function AppLayout() {
  const { logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold transition-all 
    ${isActive 
      ? "bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]" 
      : "text-gray-300 hover:bg-white/10 hover:text-white"}`;

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 p-6
        bg-[#0b0f1a]/60 backdrop-blur-xl border-r border-white/10
        transform transition-transform z-50 md:static
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Branding */}
        <div className="flex items-center gap-3 mb-6">
          <Dumbbell className="w-7 h-7 text-violet-400" />
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Fitness Tracker</h2>
            <p className="text-[10px] text-gray-400 font-medium">Gain smart. Track daily.</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mt-4">
          <NavLink to="/" className={linkClass}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>

          <NavLink to="/daily-log/today" className={linkClass}>
            <CalendarRange size={20} /> Daily Log
          </NavLink>

          <NavLink to="/foods" className={linkClass}>
            <Apple size={20} /> Foods
          </NavLink>

          <NavLink to="/weekly-checkin" className={linkClass}>
            📅 Weekly Check-In
          </NavLink>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-10 bg-red-600 hover:bg-red-500 w-full rounded-xl 
          py-2 font-bold tracking-wide shadow-lg active:scale-95 transition-all"
        >
          <div className="flex items-center justify-center gap-2">
            <LogOut size={18} /> Logout
          </div>
        </button>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#0c1220] border-b border-white/10 px-4 py-4 shadow-lg flex items-center">
          <button
            className="md:hidden mr-4"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-7 h-7 text-white" />
          </button>
          <h1 className="text-lg font-bold tracking-wide text-white/90">
            Dashboard
          </h1>
        </header>

        {/* Main */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
