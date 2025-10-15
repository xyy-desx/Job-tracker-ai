import { useState, useEffect } from "react";
import { Plus, Download } from "lucide-react";
import axios from "axios";
import ApplicationTable from "../components/ApplicationTable";
import AddApplicationModal from "../components/AddApplicationModal";
import EditApplicationModal from "../components/EditApplicationModal";
import ApplicationDetailsPanel from "../components/ApplicationDetailsPanel";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  // Fetch applications when component mounts
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("/api/automations/recent-applications");
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      }
    };
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    setApplications((prev) => prev.filter((app) => app.id !== id));
    try {
      await axios.delete(`/api/automations/recent-applications/${id}`);
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  };

  const handleExport = () => {
    const csvRows = [
      ["Company", "Position", "Source", "Date", "Status", "Automation", "Salary", "Notes"],
      ...applications.map((app) => [
        app.company,
        app.position,
        app.source,
        app.date,
        app.status,
        app.automation,
        app.salary,
        app.notes,
      ]),
    ];
    const csvContent = csvRows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "applications.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (app) => setEditingApp(app);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border-b border-gray-100 rounded-xl shadow p-4 mb-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
          Applications
        </h1>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base transition font-medium shadow"
          >
            <Plus size={18} /> Add Application
          </button>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm sm:text-base transition font-medium shadow"
          >
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="flex flex-col min-h-[200px] items-center justify-center py-20 bg-white border rounded-xl shadow space-y-3 animate-in fade-in">
          <span className="text-6xl mb-2">📄</span>
          <p className="mb-2 text-gray-500 font-medium">No applications yet.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 font-semibold transition"
          >
            <Plus size={18} className="inline mr-2" /> Add Your First Application
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-100 p-1">
          <ApplicationTable
            data={applications}
            onSelect={setSelectedApp}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      )}

      {/* Add Modal */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={(newApp) => setApplications((prev) => [newApp, ...prev])}
      />

      {/* Edit Modal */}
      <EditApplicationModal
        isOpen={!!editingApp}
        app={editingApp}
        onClose={() => setEditingApp(null)}
        onUpdated={(updatedApp) =>
          setApplications((prev) =>
            prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
          )
        }
      />

      {/* Details Panel */}
      <ApplicationDetailsPanel
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
};

export default Applications;
