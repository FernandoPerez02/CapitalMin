"use client";
import "./pie-chart.css"
import { ResponsivePie } from "@nivo/pie";

const data = [
  { id: "php", label: "php", value: 343, color: "hsl(175, 70%, 50%)" },
  { id: "stylus", label: "stylus", value: 122, color: "hsl(207, 70%, 50%)" },
  { id: "elixir", label: "elixir", value: 404, color: "hsl(261, 70%, 50%)" },
  { id: "sass", label: "sass", value: 374, color: "hsl(11, 70%, 50%)" },
  { id: "haskell", label: "haskell", value: 407, color: "hsl(175, 70%, 50%)" },
];

export default function ComponentPieChart() {
  return (
    <div className="container-pie-chart">
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.6}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            translateY: 53,
            itemWidth: 90,
            itemHeight: 18,
            symbolShape: "square",
          },
        ]}
      />
    </div>
  );
}
