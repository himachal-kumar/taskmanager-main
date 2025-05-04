import clsx from "clsx";
import React, { useState, useEffect } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import { tasks } from "../assets/data";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import AddUser from "../components/AddUser";
import ConfirmatioDialog from "../components/Dialogs";
import axios from "axios";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");
  const [trashedTasks, setTrashedTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrashedTasks = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get("http://localhost:5000/api/task/trash", {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      console.log("Trashed tasks:", response.data);
      setTrashedTasks(response.data.tasks || []);
    } catch (err) {
      console.log("Error fetching trashed tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedTasks();
  }, []);

  const handleRestore = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/task/delete-restore/${taskId}?actionType=restore`);
      fetchTrashedTasks();
      alert("Task restored successfully");
    } catch (err) {
      console.log("Error restoring task:", err);
    }
  };

  const handlePermanentDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/task/delete-restore/${taskId}?actionType=delete`);
      fetchTrashedTasks();
      alert("Task permanently deleted");
    } catch (err) {
      console.log("Error deleting task:", err);
    }
  };

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permenantly delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };

  const deleteRestoreHandler = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const endpoint = `http://localhost:5000/api/task/delete-restore/${selected}?actionType=${type}`;
      
      await axios.delete(endpoint, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      setOpenDialog(false);
      fetchTrashedTasks(); // Refresh the list
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black  text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Stage</th>
        <th className='py-2 line-clamp-1'>Modified On</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className='w-full line-clamp-2 text-base text-black'>
            {task?.title}
          </p>
        </div>
      </td>

      <td className='py-2 capitalize'>
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className=''>{task?.priority}</span>
        </div>
      </td>

      <td className='py-2 capitalize text-center md:text-start'>
        {task?.stage}
      </td>
      <td className='py-2 text-sm'>{new Date(task?.date).toDateString()}</td>

      <td className='py-2 flex gap-1 justify-end'>
        <Button
          icon={<MdOutlineRestore className='text-xl text-gray-500' />}
          onClick={() => handleRestore(task._id)}
        />
        <Button
          icon={<MdDelete className='text-xl text-red-600' />}
          onClick={() => handlePermanentDelete(task._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        {loading ? (
          <div>Loading...</div>
        ) : trashedTasks.length === 0 ? (
          <div className="text-center py-4">No tasks in trash</div>
        ) : (
          <>
            <div className='flex items-center justify-between mb-8'>
              <Title title='Trashed Tasks' />

              <div className='flex gap-2 md:gap-4 items-center'>
                <Button
                  label='Restore All'
                  icon={<MdOutlineRestore className='text-lg hidden md:flex' />}
                  className='flex flex-row-reverse gap-1 items-center  text-black text-sm md:text-base rounded-md 2xl:py-2.5'
                  onClick={() => restoreAllClick()}
                />
                <Button
                  label='Delete All'
                  icon={<MdDelete className='text-lg hidden md:flex' />}
                  className='flex flex-row-reverse gap-1 items-center  text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5'
                  onClick={() => deleteAllClick()}
                />
              </div>
            </div>
            <div className='bg-white px-2 md:px-6 py-4 shadow-md rounded'>
              <div className='overflow-x-auto'>
                <table className='w-full mb-5'>
                  <TableHeader />
                  <tbody>
                    {trashedTasks.map((task, index) => (
                      <TableRow 
                        key={task._id} 
                        task={task}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* <AddUser open={open} setOpen={setOpen} /> */}

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={deleteRestoreHandler}
      />
    </>
  );
};

export default Trash;
