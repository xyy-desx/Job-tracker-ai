import React from "react";
import { Trash2, Edit } from "lucide-react";

// Status color mapping
const getStatusColor = (status) => {
  switch (status) {
    case "Applied":
      return "bg-yellow-100 text-yellow-700";
    case "Interview":
      return "bg-blue-100 text-blue-700";
    case "Offer":
      return "bg-green-100 text-green-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Automation color mapping
const getAutomationColor = (type) => {
  switch (type) {
    case "Auto":
      return "bg-green-100 text-green-700";
    case "Manual":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/**
 * @param {Array} data - applications array from parent
 * @param {Function} onSelect - callback when row is clicked
 * @param {Function} onDelete - callback when delete button clicked
 * @param {Function} onEdit - callback when edit button clicked
 */
const ApplicationTable = ({ data, onSelect, onDelete, onEdit }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Applications</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600 text-xs">
              <th className="p-2">Company</th>
              <th className="p-2">Job Title</th>
              <th className="p-2">Source</th>
              <th className="p-2">Date Applied</th>
              <th className="p-2">Salary</th>
              <th className="p-2">Location</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Automation</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((app) => (
              <tr
                key={app.id}
                className="border-b last:border-0 hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="p-2 text-gray-700" onClick={() => onSelect?.(app)}>
                  {app.company}
                </td>
                <td className="p-2 text-gray-700" onClick={() => onSelect?.(app)}>
                  {app.position}
                </td>
                <td className="p-2 text-gray-700" onClick={() => onSelect?.(app)}>
                  {app.source}
                </td>
                <td className="p-2 text-gray-700" onClick={() => onSelect?.(app)}>
                  {app.date}
                </td>
                <td className="p-2 text-gray-700" onClick={() => onSelect?.(app)}>
                  {app.salary ? `₱${app.salary}` : "N/A"}
                </td>
                <td className="p-2 text-gray-700" onClick={() => onSelect?.(app)}>
                  {app.location || "N/A"}
                </td>
                <td className="p-2 text-center">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="p-2 text-center">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getAutomationColor(
                      app.automation
                    )}`}
                  >
                    {app.automation}
                  </span>
                </td>
                <td className="p-2 text-center flex justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(app);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(app.id);
                    }}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-gray-400 p-4">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationTable;
