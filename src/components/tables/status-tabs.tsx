import Link from "next/link";
import { cx } from "@/lib/cx";

export type RecordStatus = "active" | "inactive";

export function isRecordStatus(value: string | undefined): value is RecordStatus {
  return value === "active" || value === "inactive";
}

const TAB_CLASSES =
  "flex min-h-9 items-center rounded-full border border-border bg-surface py-1.5 px-4 text-sm font-medium text-text-muted no-underline";
const TAB_ACTIVE_CLASSES = "border-primary bg-primary text-text-inverse";

interface StatusTabsProps {
  basePath: string;
  status: RecordStatus;
  extraQuery?: Record<string, string>;
}

export default function StatusTabs({ basePath, status, extraQuery }: StatusTabsProps) {
  const buildHref = (target: RecordStatus) => {
    const params = new URLSearchParams({ ...extraQuery, status: target });
    return `${basePath}?${params.toString()}`;
  };

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Filtrar por estado">
      <Link
        href={buildHref("active")}
        aria-current={status === "active" ? "page" : undefined}
        className={cx(TAB_CLASSES, status === "active" && TAB_ACTIVE_CLASSES)}
      >
        Activos
      </Link>
      <Link
        href={buildHref("inactive")}
        aria-current={status === "inactive" ? "page" : undefined}
        className={cx(TAB_CLASSES, status === "inactive" && TAB_ACTIVE_CLASSES)}
      >
        Inactivos
      </Link>
    </nav>
  );
}
