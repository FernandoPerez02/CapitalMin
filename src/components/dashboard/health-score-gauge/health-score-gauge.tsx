const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface HealthScoreGaugeProps {
  score: number;
  band: "danger" | "warning" | "success";
}

const BAND_COLOR_VAR: Record<HealthScoreGaugeProps["band"], string> = {
  danger: "var(--color-danger)",
  warning: "var(--color-warning)",
  success: "var(--color-success)",
};

export default function HealthScoreGauge({ score, band }: HealthScoreGaugeProps) {
  const offset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div className="relative inline-flex h-[120px] w-[120px] items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        width="120"
        height="120"
        role="img"
        aria-label={`Salud financiera: ${score} de 100`}
        className="[&_circle]:transition-[stroke-dashoffset] [&_circle]:duration-300 [&_circle]:ease-in-out"
      >
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={BAND_COLOR_VAR[band]}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-semibold tabular-nums">{score}</span>
        <span className="text-xs text-text-muted">de 100</span>
      </div>
    </div>
  );
}
