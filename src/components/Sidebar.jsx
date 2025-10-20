import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBars, FaCode, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarLogo from "./SidebarLogo";
import { sidebarItems } from "./SidebarItems";
import LogoutModal from "./LogoutModal"; // Import the modal

const Sidebar = ({ onToggleWidth }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile && onToggleWidth) {
      onToggleWidth(isOpen ? 250 : 90);
    }
  }, [isOpen, isMobile, onToggleWidth]);

  const handleItemClick = (path) => {
    navigate(path);
    if (isMobile) setIsOpen(false);
  };

  // Show modal instead of direct logout
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setShowLogoutModal(false);
    if (isMobile) setIsOpen(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <motion.aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg flex flex-col justify-between overflow-visible z-40 transition-all rounded-r-3xl
        ${isMobile ? (isOpen ? "w-64" : "w-0") : isOpen ? "w-64" : "w-[90px]"}`}
        initial={{ width: 90 }}
        animate={{ width: isMobile ? (isOpen ? 250 : 0) : isOpen ? 250 : 90 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-10">
            <SidebarLogo isOpen={isOpen} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaBars />
            </button>
          </div>

          <nav className="flex flex-col space-y-2">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleItemClick(item.path)}
                  className={`flex items-center relative cursor-pointer rounded-xl px-4 py-3 transition-all group ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-2 bottom-2 w-1.5 bg-blue-500 rounded-r-md"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <Icon className="text-lg" />
                  {isOpen && <span className="ml-3 text-sm whitespace-nowrap">{item.name}</span>}
                  {!isOpen && !isMobile && (
                    <div className="absolute left-[80px] top-1/2 -translate-y-1/2 z-50 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md pointer-events-auto whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Profile menu item */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              onClick={() => handleItemClick("/profile")}
              className={`flex items-center relative cursor-pointer rounded-xl px-4 py-3 transition-all group ${
                location.pathname === "/profile"
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {location.pathname === "/profile" && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-2 bottom-2 w-1.5 bg-blue-500 rounded-r-md"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <FaUser className="text-lg" />
              {isOpen && <span className="ml-3 text-sm whitespace-nowrap">Profile</span>}
              {!isOpen && !isMobile && (
                <div className="absolute left-[80px] top-1/2 -translate-y-1/2 z-50 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md pointer-events-auto whitespace-nowrap">
                  Profile
                </div>
              )}
            </motion.div>

            {/* Logout menu item using modal */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              onClick={handleLogout}
              className={`flex items-center relative cursor-pointer rounded-xl px-4 py-3 transition-all group text-gray-700 hover:bg-gray-100`}
            >
              <FaSignOutAlt className="text-lg" />
              {isOpen && <span className="ml-3 text-sm whitespace-nowrap text-red-500 font-semibold">Logout</span>}
              {!isOpen && !isMobile && (
                <div className="absolute left-[80px] top-1/2 -translate-y-1/2 z-50 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md pointer-events-auto whitespace-nowrap">
                  Logout
                </div>
              )}
            </motion.div>
          </nav>
        </div>

        <motion.div
          className="p-4 border-t border-gray-200 flex items-center justify-center text-gray-500 text-xs whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <FaCode className="text-sm" />
          {isOpen && (
            <span className="ml-2">
              Job-Tracker AI |{" "}
              <span className="font-semibold text-gray-700">Desxzor</span>
            </span>
          )}
        </motion.div>
      </motion.aside>

      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30"
        ></div>
      )}

      {/* MODAL: Logout */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </>
  );
};

export default Sidebar;
