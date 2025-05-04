import React from "react";

const ProfileModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {user?.name ? user.name[0].toUpperCase() : "?"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{user?.name || "Not available"}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium">{user?.isAdmin ? "Administrator" : "User"}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
