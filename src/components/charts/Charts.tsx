"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler
);
ChartJS.defaults.font.family = "Inter, sans-serif";
ChartJS.defaults.plugins.legend.labels.usePointStyle = true;

// Midnight Fintech palette (names kept stable for existing dashboards)
export const PALETTE = {
  teal: "#7c5cff",   // primary series -> electric violet
  amber: "#22d3ee",  // secondary/forecast -> cyan
  blue: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  purple: "#a78bfa",
  grid: "rgba(130,130,170,.16)",
};

const base: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { boxWidth: 12, boxHeight: 12 } } },
};

export function LineChart({ data, options }: { data: ChartData<"line">; options?: ChartOptions<"line"> }) {
  return <Line data={data} options={{ ...(base as ChartOptions<"line">), ...options }} />;
}
export function BarChart({ data, options }: { data: ChartData<"bar">; options?: ChartOptions<"bar"> }) {
  return <Bar data={data} options={{ ...(base as ChartOptions<"bar">), ...options }} />;
}
export function DoughnutChart({ data, options }: { data: ChartData<"doughnut">; options?: ChartOptions<"doughnut"> }) {
  return <Doughnut data={data} options={{ ...(base as ChartOptions<"doughnut">), cutout: "62%", ...options }} />;
}
