import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const EditApplicationModal = ({ isOpen, onClose, app, onUpdated }) => {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Applied");
  const [automation, setAutomation] = useState("Manual");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // Populate form when modal opens or app changes
  useEffect(() => {
    if (app) {
      setCompany(app.company || "");
      setPosition(app.position || "");
      setSource(app.source || "");
      // Convert ISO date to yyyy-MM-dd for date input
      setDate(app.date ? new Date(app.date).toISOString().split("T")[0] : "");
      setStatus(app.status || "Applied");
      setAutomation(app.automation || "Manual");
      setSalary(app.salary || "");
      setLocation(app.location || "");
      setNotes(app.notes || "");
    }
  }, [app]);

  if (!isOpen || !app) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: updatedApp } = await axios.patch(
        `http://localhost:5000/api/automations/recent-applications/${app.id}`,
        {
          company,
          position,
          source,
          date,
          status,
          automation,
          salary,
          location,
          notes,
        }
      );

      onUpdated?.(updatedApp); // Update parent state
      onClose();
    } catch (err) {
      console.error("Failed to update application:", err);
      alert("Failed to update application. Check console for details.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 rounded-xl w-96 shadow-xl relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Edit Application
        </h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Job Title"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Source (LinkedIn, JobStreet...)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <select
            value={automation}
            onChange={(e) => setAutomation(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          >
            <option>Manual</option>
            <option>Auto</option>
          </select>
          <input
            type="number"
            placeholder="Salary (PHP)"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          />
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2 hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditApplicationModal;
