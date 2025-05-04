import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useState, useEffect } from "react";

export const Chart = () => {
  const [chartData, setChartData] = useState([]);

  const getChartData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/task/totaltask");
      const tasks = response.data.data;

      // Process tasks to get counts by priority
      const priorityCounts = tasks.reduce((acc, task) => {
        const priority = task.priority.toLowerCase();
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {});

      // Convert to format needed for chart
      const data = Object.entries(priorityCounts).map(([name, total]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
        total
      }));

      setChartData(data);
    } catch (err) {
      console.log("Error fetching chart data:", err);
    }
  };

  useEffect(() => {
    getChartData();
  }, []);

  return (
    <div className='w-full h-[400px] mt-8'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='total' fill='#8884d8' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
