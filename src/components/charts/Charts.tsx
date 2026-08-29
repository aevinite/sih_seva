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
import { useTheme } from "@/lib/providers";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler
);
ChartJS.defaults.font.family = "Inter, sans-serif";
ChartJS.defaults.plugins.legend.labels.usePointStyle = true;

export const PALETTE = {
  teal: "#7c5cff",
  amber: "#22d3ee",
  blue: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  purple: "#a78bfa",
  grid: "rgba(130,130,170,.16)",
};

function cssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/** Reads theme colors and applies them to Chart.js defaults; returns a key that
 *  changes on theme flip so charts re-mount and recolor live. */
function useChartTheme() {
  const { theme } = useTheme();
  const fg = cssVar("--muted-foreground", theme === "dark" ? "#9b99c6" : "#5a5876");
  const grid = theme === "dark" ? "rgba(230,230,255,.10)" : "rgba(20,18,40,.08)";
  ChartJS.defaults.color = fg;
  ChartJS.defaults.borderColor = grid;
  return { key: theme, fg, grid };
}

function withGrid<K extends "line" | "bar">(options: ChartOptions<K> | undefined, grid: string): ChartOptions<K> {
  const o = { responsive: true, maintainAspectRatio: false, ...(options || {}) } as ChartOptions<K>;
  const scales = (o as { scales?: Record<string, { grid?: { color?: string } }> }).scales;
  if (scales) {
    for (const k of Object.keys(scales)) {
      if (scales[k]?.grid) scales[k].grid!.color = grid;
    }
  }
  return o;
}

export function LineChart({ data, options }: { data: ChartData<"line">; options?: ChartOptions<"line"> }) {
  const { key, grid } = useChartTheme();
  return <Line key={key} data={data} options={withGrid<"line">(options, grid)} />;
}
export function BarChart({ data, options }: { data: ChartData<"bar">; options?: ChartOptions<"bar"> }) {
  const { key, grid } = useChartTheme();
  return <Bar key={key} data={data} options={withGrid<"bar">(options, grid)} />;
}
export function DoughnutChart({ data, options }: { data: ChartData<"doughnut">; options?: ChartOptions<"doughnut"> }) {
  const { key } = useChartTheme();
  return <Doughnut key={key} data={data} options={{ responsive: true, maintainAspectRatio: false, cutout: "62%", ...options }} />;
}
