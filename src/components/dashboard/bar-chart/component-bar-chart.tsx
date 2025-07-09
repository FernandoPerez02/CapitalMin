"use client";
import "./bar-chart.css"
import { ResponsiveBar } from "@nivo/bar";
export default function ComponentBarChart() {
  const data = [
    {
      "Month": "Jan",
      "Sales": 100,
      "Profit": 210,
    },
    {
      "Month": "Feb",
      "Sales": 120,
      "Profit": 300,
    },
    {
      "Month": "Mar",
      "Sales": 140,
      "Profit": 400,
    },
  ]
  return (
  <div className="container-bar-chart">
    <ResponsiveBar data={data}
      keys={["Sales", "Profit"]}
      indexBy="Month"
      margin={{ top: 40, right: 0, bottom: 40, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "spectral" }}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Sales",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Profit",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 10,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      animate={true} 
    />
  </div>
  );
}