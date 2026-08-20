import Card from "@/components/ui/card";

interface InsightCardProps {
  sentence: string;
}

export default function InsightCard({ sentence }: InsightCardProps) {
  return (
    <Card tone="insight" padding="md" className="flex items-start gap-3">
      <span className="shrink-0 text-xl" aria-hidden="true">
        ✨
      </span>
      <p className="m-0 text-sm leading-normal">{sentence}</p>
    </Card>
  );
}
