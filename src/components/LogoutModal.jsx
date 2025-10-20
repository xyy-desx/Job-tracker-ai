import React from "react";
import { FaSignOutAlt } from "react-icons/fa";

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
        <FaSignOutAlt className="mx-auto text-3xl text-red-500 mb-2" />
        <h2 className="text-xl font-bold mb-2 text-blue-700">Log Out?</h2>
        <div className="text-gray-700 mb-6">
          Before you go, did you make progress on your career goals today?<br />
          You can always come back to keep tracking!
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-shadow shadow"
          >
            Yes, Log Me Out
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-shadow shadow"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
