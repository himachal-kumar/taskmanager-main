import React from "react";
import TaskCard from "./TaskCard";

const BoardView = ({ tasks }) => {
  // If tasks is an array (filtered view), convert it to the expected format
  const taskData = Array.isArray(tasks) ? {
    todo: tasks,
    'in progress': [],
    completed: []
  } : tasks;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="bg-gray-50/50 rounded-lg p-4 min-h-[200px]">
        <h3 className="font-semibold mb-6 text-gray-700 text-lg">To Do</h3>
        <div className="space-y-4">
          {taskData.todo.map(task => (
            <div key={task._id} className="transform transition-all duration-200 hover:-translate-y-1">
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50/50 rounded-lg p-4 min-h-[200px]">
        <h3 className="font-semibold mb-6 text-gray-700 text-lg">In Progress</h3>
        <div className="space-y-4">
          {taskData['in progress'].map(task => (
            <div key={task._id} className="transform transition-all duration-200 hover:-translate-y-1">
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50/50 rounded-lg p-4 min-h-[200px]">
        <h3 className="font-semibold mb-6 text-gray-700 text-lg">Completed</h3>
        <div className="space-y-4">
          {taskData.completed.map(task => (
            <div key={task._id} className="transform transition-all duration-200 hover:-translate-y-1">
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardView;
