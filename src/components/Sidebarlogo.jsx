import React from "react";
import logo from "../assets/logo.png"; // ✅ Ensure this path is correct

const SidebarLogo = ({ isOpen }) => {
  return (
    <div className="flex items-center gap-3 px-2">
      {/* 🔹 Logo Image */}
      <img
        src={logo}
        alt="Job Tracker AI Logo"
        className="w-9 h-9 object-contain rounded-md shadow-sm transition-transform duration-300 hover:scale-105"
      />

      {/* 🔹 App Name (only visible when sidebar is open) */}
      {isOpen && (
        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold text-gray-800">
            Job-Tracker
          </span>
          <span className="text-xs text-gray-500 tracking-wide">AI</span>
        </div>
      )}
    </div>
  );
};

export default SidebarLogo;
