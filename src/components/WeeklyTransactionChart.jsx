import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function WeeklyTransactionChart({ chartData }) {
  const enhancedData = {
    ...chartData,
    datasets: chartData.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor:
        dataset.label === "Income"
          ? "#3B82F6"
          : dataset.label === "Expense"
          ? "#EF4444"
          : "#10B981",
      borderRadius: 6,
      barThickness: 30,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#4B5563",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#4B5563",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: "#4B5563",
        },
        grid: {
          color: "#E5E7EB",
        },
      },
    },
  };

  return <Bar data={enhancedData} options={options} />;
}

export default WeeklyTransactionChart;
