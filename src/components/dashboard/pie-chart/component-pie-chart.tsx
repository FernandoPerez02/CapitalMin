"use client";
import { ResponsivePie } from "@nivo/pie";
import type { CategoryBreakdownItem } from "@/lib/dashboard-metrics";

interface ComponentPieChartProps {
  data: CategoryBreakdownItem[];
}

export default function ComponentPieChart({ data }: ComponentPieChartProps) {
  const pieData = data.map((item) => ({
    id: item.label,
    label: item.label,
    value: item.amount,
    color: item.color,
  }));

  return (
    <div className="h-[220px]">
      <ResponsivePie
        data={pieData}
        colors={{ datum: "data.color" }}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        innerRadius={0.6}
        padAngle={0.6}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        enableArcLinkLabels={false}
        enableArcLabels={false}
      />
    </div>
  );
}
