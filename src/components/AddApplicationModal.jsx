import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import axios from "axios";

// Source options for dropdown
const SOURCE_OPTIONS = [
  "JobStreet",
  "LinkedIn",
  "Indeed",
  "Glassdoor",
  "Kalibrr",
  "Other"
];

// Salary options in PHP (₱), starting from 18k upward
const SALARY_OPTIONS = [
  "18000",
  "20000",
  "25000",
  "30000",
  "35000",
  "40000",
  "45000",
  "50000",
  "55000",
  "60000",
  "65000",
  "70000",
  "75000",
  "80000",
  "85000",
  "90000",
  "95000",
  "100000",
  "Other"
];

const AddApplicationModal = ({ isOpen, onClose, onAdded }) => {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [source, setSource] = useState("");
  const [customSource, setCustomSource] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Applied");
  const [automation, setAutomation] = useState("Manual");
  const [salary, setSalary] = useState("");
  const [customSalary, setCustomSalary] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = date ? new Date(date).toISOString().split("T")[0] : null;

    // Source
    const finalSource = source === "Other" ? customSource : source;
    // Salary
    const finalSalary = salary === "Other" ? customSalary : salary;

    try {
      const { data: newApp } = await axios.post(
        "/api/automations/recent-applications",
        {
          company,
          position,
          source: finalSource,
          date: formattedDate,
          status,
          automation,
          salary: finalSalary,
          location,
          notes,
        }
      );

      onAdded(newApp);
      onClose();

      // Reset fields after submit
      setCompany("");
      setPosition("");
      setSource("");
      setCustomSource("");
      setDate("");
      setStatus("Applied");
      setAutomation("Manual");
      setSalary("");
      setCustomSalary("");
      setLocation("");
      setNotes("");
    } catch (err) {
      console.error("Error adding application:", err);
      alert("Failed to add application. Check console for details.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 sm:px-0"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <h2 className="text-lg sm:text-xl font-semibold mt-6 text-gray-800 text-center px-6">
          Add New Application
        </h2>

        {/* Scrollable Form Area */}
        <form
          className="flex-1 overflow-y-auto px-6 py-4 space-y-3"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Job Title"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {/* Source Dropdown */}
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select Source
            </option>
            {SOURCE_OPTIONS.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
          {/* Custom Source Field (Only if "Other" is selected) */}
          {source === "Other" && (
            <input
              type="text"
              placeholder="Enter source"
              value={customSource}
              onChange={(e) => setCustomSource(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
            <select
              value={automation}
              onChange={(e) => setAutomation(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Manual</option>
              <option>Auto</option>
            </select>
          </div>
          {/* Salary Dropdown and Custom Entry */}
          <select
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select Salary (PHP)
            </option>
            {SALARY_OPTIONS.map((amt) => (
              <option key={amt} value={amt}>
                {amt === "Other"
                  ? "Other"
                  : `₱${amt.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
              </option>
            ))}
          </select>
          {/* Custom Salary Field (Only if "Other" is selected) */}
          {salary === "Other" && (
            <input
              type="number"
              min={18000}
              placeholder="Enter Salary (PHP)"
              value={customSalary}
              onChange={(e) => setCustomSalary(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Save Button inside the form! */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Save Application
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddApplicationModal;
