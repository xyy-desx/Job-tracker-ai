import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Applications from "./Pages/Applications";
import Reports from "./Pages/Reports"; // ✅ Capitalize folder name for consistency
import Automations from "./Pages/Automations";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [applications, setApplications] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(250); // ✅ Track sidebar width

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

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ✅ Sidebar with callback to adjust content margin */}
      <Sidebar onToggleWidth={setSidebarWidth} />

      {/* ✅ Main Content Area */}
      <main
        className="flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 p-6"
        style={{ marginLeft: `${sidebarWidth}px` }} // dynamically adjust based on sidebar
      >
        <Routes>
          <Route path="/" element={<Dashboard applications={applications} />} />
          <Route
            path="/applications"
            element={
              <Applications
                applications={applications}
                onDelete={handleDelete}
                onAdd={handleAdd}
              />
            }
          />
          <Route path="/reports" element={<Reports />} />
          <Route path="/automations" element={<Automations />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
