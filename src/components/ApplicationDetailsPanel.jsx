import { motion } from "framer-motion";
import { X, MapPin, Mail } from "lucide-react";

const ApplicationDetailsPanel = ({ app, onClose }) => {
  if (!app) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-40 p-6 overflow-y-auto"
    >
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        onClick={onClose}
      >
        <X size={20} />
      </button>

      <h2 className="text-xl font-semibold mb-1">{app.company || "N/A"}</h2>
      <p className="text-gray-500 mb-3">{app.position || "N/A"}</p>

      <div className="space-y-2 text-sm">
        <p>
          <strong>Salary:</strong> {app.salary ? `₱${app.salary}` : "N/A"}
        </p>
        <p className="flex items-center gap-1">
          <MapPin size={14} /> {app.location || "N/A"}
        </p>
        <p>
          <strong>Source:</strong> {app.source || "N/A"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              app.status === "Applied"
                ? "bg-yellow-100 text-yellow-700"
                : app.status === "Interview"
                ? "bg-blue-100 text-blue-700"
                : app.status === "Offer"
                ? "bg-green-100 text-green-700"
                : app.status === "Rejected"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {app.status || "N/A"}
          </span>
        </p>
        <p>
          <strong>Automation:</strong>{" "}
          <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              app.automation === "Auto"
                ? "bg-green-100 text-green-700"
                : app.automation === "Manual"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {app.automation || "N/A"}
          </span>
        </p>

        <div className="mt-4 border-t pt-3">
          <p className="font-medium">Recruiter Info:</p>
          <p>{app.recruiter?.name || "N/A"}</p>
          <p className="flex items-center gap-1 text-blue-600">
            <Mail size={14} /> {app.recruiter?.email || "N/A"}
          </p>
        </div>

        {app.tags?.length > 0 && (
          <div className="mt-4">
            <p className="font-medium">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {app.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {app.notes && (
          <div className="mt-4">
            <p className="font-medium">Notes:</p>
            <p>{app.notes}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ApplicationDetailsPanel;
