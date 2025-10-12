// src/utils.js
export const getStatusColor = (status) => {
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

export const getAutomationColor = (type) => {
  switch (type) {
    case "Auto":
      return "bg-green-100 text-green-700";
    case "Manual":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
