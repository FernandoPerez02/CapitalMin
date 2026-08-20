"use client";

import { useState, type ReactNode } from "react";
import { CARD_VIEW, TABLE, TABLE_TOGGLE, TABLE_WRAPPER } from "./tablet-classes";

interface TableRowsToggleProps {
  initialCount: number;
  tableHead: ReactNode;
  tableRows: ReactNode[];
  cardRows: ReactNode[];
}

// Client Component chico: solo esto necesita estado. Recibe nodos ya
// renderizados por Tablet (Server Component) — nunca funciones, que no se
// pueden pasar de un Server a un Client Component.
export default function TableRowsToggle({
  initialCount,
  tableHead,
  tableRows,
  cardRows,
}: TableRowsToggleProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleTableRows = expanded ? tableRows : tableRows.slice(0, initialCount);
  const visibleCardRows = expanded ? cardRows : cardRows.slice(0, initialCount);

  return (
    <>
      <div className={TABLE_WRAPPER}>
        <table className={TABLE}>
          {tableHead}
          <tbody>{visibleTableRows}</tbody>
        </table>
      </div>
      <div className={CARD_VIEW}>{visibleCardRows}</div>
      <button type="button" className={TABLE_TOGGLE} onClick={() => setExpanded((v) => !v)}>
        {expanded ? "Ver menos" : "Ver más"}
      </button>
    </>
  );
}
