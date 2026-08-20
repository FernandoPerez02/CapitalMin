import type { Goal } from "@/types/goal";
import GoalCard from "./goal-card";

interface GoalsListProps {
  goals: Goal[];
}

export default function GoalsList({ goals }: GoalsListProps) {
  if (goals.length === 0) {
    return <p className="text-sm text-text-muted">No tenés metas activas todavía.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}
