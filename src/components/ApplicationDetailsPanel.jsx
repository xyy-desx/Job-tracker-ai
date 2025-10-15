import { motion } from "framer-motion";
import { X, MapPin, Mail, Building2, Tag } from "lucide-react";

const statusStyles = {
  Applied: "bg-yellow-100 text-yellow-700",
  Interview: "bg-blue-100 text-blue-700",
  Offer: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Default: "bg-gray-100 text-gray-700",
};

const automationStyles = {
  Auto: "bg-green-100 text-green-700",
  Manual: "bg-yellow-100 text-yellow-700",
  Default: "bg-gray-100 text-gray-700",
};

const ApplicationDetailsPanel = ({ app, onClose }) => {
  if (!app) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-0 overflow-y-auto flex flex-col"
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow transition z-10"
        onClick={onClose}
      >
        <X size={22} />
      </button>

      {/* Header/Card */}
      <div className="bg-gradient-to-br from-blue-100 to-blue-300 flex items-center gap-4 py-6 px-6 border-b rounded-t-xl">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow border">
          <Building2 size={28} className="text-blue-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-800 mb-1">{app.position || "N/A"}</h2>
          <p className="font-medium text-blue-800 mb-1">{app.company || "N/A"}</p>
          <div className="flex gap-3 mt-2">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow ${statusStyles[app.status] || statusStyles.Default}`}>
              {app.status || "N/A"}
            </span>
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow ${automationStyles[app.automation] || automationStyles.Default}`}>
              {app.automation || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1 px-6 py-4 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 text-sm">
            <MapPin size={18} className="text-gray-400" />
            <span className="font-semibold">Location:</span>
            <span className="ml-1 text-gray-700">{app.location || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold">Salary:</span>
            <span className="ml-1 text-gray-700">{app.salary ? `₱${app.salary}` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold">Source:</span>
            <span className="ml-1 text-gray-700">{app.source || "N/A"}</span>
          </div>
        </div>
        {/* Recruiter Section */}
        <div className="bg-gray-50 border rounded-lg px-4 py-3">
          <p className="font-semibold mb-1">Recruiter Info</p>
          <p className="mb-1">{app.recruiter?.name || "N/A"}</p>
          <div className="flex items-center gap-2 text-blue-600">
            <Mail size={16} /> <span>{app.recruiter?.email || "N/A"}</span>
          </div>
        </div>
        {/* Tags */}
        {app.tags?.length > 0 && (
          <div className="mb-3">
            <p className="font-semibold mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {app.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-bold"
                >
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Notes */}
        {app.notes && (
          <div className="bg-blue-50 rounded-lg p-4 shadow-sm mt-2">
            <p className="font-semibold mb-2 text-blue-700">Notes</p>
            <p className="text-sm text-blue-900">{app.notes}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ApplicationDetailsPanel;
