import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ data }) {
    const colors = [
        "#4ADE80", "#60A5FA", "#FBBF24", "#F87171", "#A78BFA", "#34D399",
        "#F472B6", "#FCD34D", "#38BDF8", "#E879F9"
    ];

    const labels = Object.keys(data);
    const values = Object.values(data);

    const chartData = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: "#fff",
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "right",
                labels: {
                    color: "#374151",
                    font: {
                        size: 12,
                        family: "Inter, sans-serif",
                    },
                },
            },
        },
    };

    return (
        <div className="w-full h-64 md:h-80">
            <Pie data={chartData} options={options} />
        </div>
    );
}

export default PieChart;
