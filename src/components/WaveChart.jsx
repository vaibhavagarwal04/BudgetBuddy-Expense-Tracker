import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const WaveChart = ({ labels, dataPoints }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Monthly Income",
        data: dataPoints,
        fill: true,
        borderColor: "#10b981", 
        backgroundColor: "rgba(16,185,129,0.2)",
        pointRadius: 4,
        tension: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px] bg-white rounded-2xl shadow p-4">
      <Line data={data} options={options} />
    </div>
  );
};

export default WaveChart;
