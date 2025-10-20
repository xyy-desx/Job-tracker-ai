import React from "react";

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 bg-white shadow-2xl rounded-3xl">
      <div className="flex flex-col items-center mb-8">
        {/* Profile Avatar (SVG placeholder) */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-300 via-blue-100 to-blue-50 flex items-center justify-center mb-4 shadow-xl border-4 border-white">
          <svg
            className="w-16 h-16 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="8" r="4" strokeWidth="2"></circle>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 20v-2a4 4 0 00-8 0v2"
            ></path>
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-blue-900 mb-1">
          {user ? user.name : "Guest"}
        </h2>
        <p className="text-blue-600 font-medium text-sm">
          {user ? user.email : "No email"}
        </p>
        <div className="mt-2 text-xs px-4 py-1 bg-green-100 text-green-700 rounded-full font-semibold shadow">
          Active User
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-white rounded-xl shadow p-6 space-y-4">
        <div className="flex items-center">
          <span className="font-semibold mr-2 text-blue-700">Full Name:</span>
          <span className="text-gray-800">
            {user ? user.name : "No name on file"}
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2 text-blue-700">Email:</span>
          <span className="text-gray-800">
            {user ? user.email : "No email on file"}
          </span>
        </div>
      </div>

      {!user && (
        <div className="mt-8 flex justify-center text-gray-400">
          Not logged in.
        </div>
      )}
    </div>
  );
}

export default Profile;
