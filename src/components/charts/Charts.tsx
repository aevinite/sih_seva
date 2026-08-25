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

export const PALETTE = {
  teal: "#0d9488",
  amber: "#f59e0b",
  blue: "#2563eb",
  green: "#16a34a",
  red: "#dc2626",
  purple: "#7c3aed",
  grid: "rgba(128,128,128,.15)",
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
