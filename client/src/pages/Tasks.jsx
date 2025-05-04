import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import { tasks } from "../assets/data";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import axios from "axios";

const Tasks = () => {
  const TABS = [
    { title: "Board View", icon: <MdGridView /> },
    { title: "List View", icon: <FaList /> },
  ];

  const TASK_TYPE = {
    todo: "bg-blue-600",
    "in progress": "bg-yellow-600",
    completed: "bg-green-600",
  };

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [totalTask, setTotalTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const status = params?.status || "";

  // Updated admin check
  const isAdmin = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.isAdmin === true && user?.email === "himachal123@gmail.com";
    } catch (err) {
      console.error('Error checking admin status:', err);
      return false;
    }
  };

  const getUserData = async () => {
    setLoading(true);
    try {
      let response;
      if (status) {
        response = await axios.get(`http://localhost:5000/api/task/tasks?stage=${status}`);
        setTotalTask(response.data.tasks || []);
      } else {
        response = await axios.get("http://localhost:5000/api/task/totaltask");
        setTotalTask(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTotalTask([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, [status]); // Only re-fetch when status changes

  const refreshTasks = async () => {
    await getUserData();
  };

  const handleTaskAdded = async () => {
    await refreshTasks();
    setOpen(false); // Close modal after task is added
  };

  // Filter tasks based on stage for board view
  const todoTasks = totalTask.filter(task => task.stage?.toLowerCase() === 'todo');
  const inProgressTasks = totalTask.filter(task => task.stage?.toLowerCase() === 'in progress');
  const completedTasks = totalTask.filter(task => task.stage?.toLowerCase() === 'completed');

  const tasksForBoard = status ? totalTask : {
    todo: todoTasks,
    'in progress': inProgressTasks,
    completed: completedTasks
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />
        {isAdmin() && (
          <Button
            onClick={() => setOpen(true)}
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
            <TaskTitle label='To Do' className={TASK_TYPE.todo} count={todoTasks.length} />
            <TaskTitle label='In Progress' className={TASK_TYPE["in progress"]} count={inProgressTasks.length} />
            <TaskTitle label='Completed' className={TASK_TYPE.completed} count={completedTasks.length} />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView 
            tasks={tasksForBoard} 
            onTaskUpdated={refreshTasks}
          />
        ) : (
          <div className='w-full'>
            <Table 
              tasks={totalTask} 
              onTaskUpdated={refreshTasks}
            />
          </div>
        )}
      </Tabs>

      <AddTask 
        open={open} 
        setOpen={setOpen} 
        onTaskAdded={handleTaskAdded}
      />
    </div>
  );
};

export default Tasks;
