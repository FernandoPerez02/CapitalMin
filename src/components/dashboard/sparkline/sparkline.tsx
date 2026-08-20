interface SparklineProps {
  data: number[];
}

export default function Sparkline({ data }: SparklineProps) {
  if (data.length < 2) return null;

  const width = 100;
  const height = 28;
  const min = Math.min(...data, 0);
  const max = Math.max(...data, 0);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });
  const [lastX, lastY] = points[points.length - 1].split(",").map(Number);

  return (
    <svg
      className="block h-7 w-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        strokeWidth="2"
        className="stroke-border-strong"
      />
      <circle cx={lastX} cy={lastY} r="2.5" className="fill-primary" />
    </svg>
  );
}
