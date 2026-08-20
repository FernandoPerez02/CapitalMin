import type { Goal } from "@/types/goal";
import { formatCurrency } from "@/lib/format-currency";

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-page-bg text-xl"
        aria-hidden="true"
      >
        {goal.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="m-0 text-sm text-text">{goal.name}</p>
        <p className="m-0 text-lg font-semibold text-primary">{pct}%</p>
        <div className="my-1 h-1.5 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
        <p className="m-0 text-xs text-text-muted tabular-nums">
          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
        </p>
      </div>
    </div>
  );
}
