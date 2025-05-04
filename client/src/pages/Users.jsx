import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmationDialog, { UserAction } from "../components/Dialogs"; // Fixed typo
import AddUser from "../components/AddUser";
import axios from "axios";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserData = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/user/get-team");
      setSummary(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setErrorMessage("Failed to load users.");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleUserAdded = (newUser) => {
    setSummary([...summary, newUser]);
    setPopupMessage("User added successfully!");
  };

  const confirmDelete = (id) => {
    setUserToDelete(id);
    setOpenDialog(true);
  };

  const deleteHandler = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:5000/api/user/delete/${userToDelete}`);

      if (response.data.status) {
        setSummary(summary.filter((user) => user._id !== userToDelete));
        setPopupMessage(response.data.message);
        setUserToDelete(null);
      } else {
        setErrorMessage(response.data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        "Error deleting user. Please try again."
      );
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleEdit = (user) => {
    setSelected(user);
    setOpen(true);
  };

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Team Members" />
          <Button
            label="Add New User"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
            onClick={() => setOpen(true)}
          />
        </div>

        {popupMessage && (
          <div className="bg-green-200 text-green-800 px-4 py-2 rounded mb-4">
            {popupMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-200 text-red-800 px-4 py-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <thead className="border-b border-gray-300">
                <tr className="text-black text-left">
                  <th className="py-2">Full Name</th>
                  <th className="py-2">Title</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Active</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((user) => (
                  <tr key={user._id} className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
                    <td className="p-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
                          <span className="text-xs md:text-sm text-center">{getInitials(user.name)}</span>
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="p-2">{user.title}</td>
                    <td className="p-2">{user.email || "user.email.com"}</td>
                    <td className="p-2">{user.role}</td>
                    <td>
                      <button
                        className={clsx(
                          "w-fit px-4 py-1 rounded-full",
                          user?.isActive ? "bg-blue-200" : "bg-yellow-100"
                        )}
                      >
                        {user?.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="p-2 flex gap-4 justify-end">
                      <Button
                        className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
                        label="Edit"
                        type="button"
                        onClick={() => handleEdit(user)}
                      />
                      <Button
                        className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
                        label="Delete"
                        type="button"
                        onClick={() => confirmDelete(user._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser open={open} setOpen={setOpen} userData={selected} onUserAdded={handleUserAdded} />

      <ConfirmationDialog open={openDialog} setOpen={setOpenDialog} onClick={deleteHandler} loading={loading} />
    </>
  );
};

export default Users;
