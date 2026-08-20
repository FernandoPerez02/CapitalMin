interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <div
      className="w-full rounded-[10px] bg-surface p-4 shadow-[0_1px_2px_rgba(16,21,28,0.04),0_4px_12px_rgba(16,21,28,0.06)]"
      role="status"
      aria-label="Cargando datos"
    >
      <div className="mb-4 h-4 w-2/5 rounded bg-page-bg" />
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div className="flex gap-3 py-2" key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <span
              key={colIndex}
              className="h-3.5 flex-1 animate-[table-skeleton-shimmer_1.4s_ease-in-out_infinite] rounded bg-[linear-gradient(90deg,var(--color-page-bg)_25%,var(--color-border)_50%,var(--color-page-bg)_75%)] bg-[length:200%_100%] motion-reduce:animate-none motion-reduce:bg-page-bg"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
