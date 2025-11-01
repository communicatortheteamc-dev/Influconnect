"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

interface Campaign {
  status: string;
}

export default function InsightsGraph({ campaigns }: { campaigns?: Campaign[] }) {
  // Ensure campaigns is always an array
  const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];

  const statusCounts = {
    Pending: safeCampaigns.filter((c) => c.status === "Pending").length,
    "In Progress": safeCampaigns.filter((c) => c.status === "In Progress").length,
    Completed: safeCampaigns.filter((c) => c.status === "Completed").length,
  };

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Campaigns",
        data: Object.values(statusCounts),
        backgroundColor: ["#f59e0b", "#3b82f6", "#10b981"],
        borderRadius: 6,
        borderWidth: 1,
      },
    ],
  };
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: "#374151",
        font: { size: 12 },
      },
    },
    title: {
      display: true,
      text: "Campaign Progress Overview",
      font: { size: 14, weight: 700 }, // Use numeric value for font weight
      color: "#1f2937",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1, color: "#4b5563" },
      grid: { color: "#e5e7eb" },
    },
    x: {
      ticks: { color: "#4b5563" },
      grid: { display: false },
    },
  },
} satisfies import("chart.js").ChartOptions<"bar">;


  if (!safeCampaigns.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow text-center text-gray-500">
        No campaign data available
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full h-[320px]">
      <Bar data={data} options={options} />
    </div>
  );
}
