import React, { Fragment, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Menu, Transition } from "@headlessui/react";
import AddTask from "./AddTask";
import AddSubTask from "./AddSubTask";
import axios from "axios";

const TaskDialog = ({ task, onTaskUpdated }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Strict admin check
  const isAdmin = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      // Check both isAdmin flag and email
      return user?.isAdmin === true && user?.email === "himachal123@gmail.com";
    } catch (err) {
      console.error('Error checking admin status:', err);
      return false;
    }
  };

  const handleDelete = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.put(
        `http://localhost:5000/api/task/trash/${task._id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setShowDeleteModal(false);
      
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (err) {
      console.log("Error moving task to trash:", err);
      alert("Failed to move task to trash");
    }
  };

  // Basic menu items (for all users)
  const menuItems = [
    {
      label: "Open Task",
      icon: <AiTwotoneFolderOpen className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: () => navigate(`/task/${task._id}`, { state: { value: task } })
    }
  ];

  return (
    <>
      <div>
        <Menu as='div' className='relative inline-block text-left'>
          <Menu.Button className='inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600'>
            <BsThreeDots />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
              {/* Regular user options */}
              <div className='px-1 py-1 space-y-2'>
                {menuItems.map((item) => (
                  <Menu.Item key={item.label}>
                    {({ active }) => (
                      <button
                        onClick={item.onClick}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>

              {/* Admin-only options */}
              {isAdmin() && (
                <>
                  <div className='px-1 py-1 space-y-2'>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setOpenEdit(true)}
                          className={`${
                            active ? "bg-blue-500 text-white" : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <MdOutlineEdit className='mr-2 h-5 w-5' aria-hidden='true' />
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setOpen(true)}
                          className={`${
                            active ? "bg-blue-500 text-white" : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <MdAdd className='mr-2 h-5 w-5' aria-hidden='true' />
                          Add Sub-Task
                        </button>
                      )}
                    </Menu.Item>
                  </div>

                  {/* Delete option */}
                  <div className='px-1 py-1'>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className={`${
                            active ? "bg-blue-500 text-white" : "text-red-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <RiDeleteBin6Line
                            className='mr-2 h-5 w-5 text-red-400'
                            aria-hidden='true'
                          />
                          Move to Trash
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Admin-only modals */}
      {isAdmin() && (
        <>
          <AddTask
            open={openEdit}
            setOpen={setOpenEdit}
            task={task}
            key={new Date().getTime()}
          />
          <AddSubTask open={open} setOpen={setOpen} />
        </>
      )}

      {/* Delete modal */}
      {showDeleteModal && isAdmin() && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <RiDeleteBin6Line className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Move to Trash</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to move this task to trash? You can restore it later.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskDialog;
