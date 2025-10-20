import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Applications from "./Pages/Applications";
import Reports from "./Pages/Reports";
import Automations from "./Pages/Automations";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [applications, setApplications] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const location = useLocation();

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get("/api/automations/recent-applications");
      setApplications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await axios.delete(`/api/automations/recent-applications/${id}`);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  };

  const handleAdd = (newApp) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  // Only show sidebar on protected (main) pages
  const showSidebar = !['/login', '/signup'].includes(location.pathname);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {showSidebar && <Sidebar onToggleWidth={setSidebarWidth} />}
      <main
        className={`flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 p-6 ${!showSidebar ? "flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white" : ""}`}
        style={showSidebar ? { marginLeft: `${sidebarWidth}px` } : {}}
      >
        <Routes>
          {/* Public access routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard applications={applications} />
            </ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute>
              <Applications
                applications={applications}
                onDelete={handleDelete}
                onAdd={handleAdd}
              />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/automations" element={
            <ProtectedRoute>
              <Automations />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
