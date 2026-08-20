import type { ReactNode } from "react";
import Card from "@/components/ui/card";
import TableRowsToggle from "./table-rows-toggle";
import {
  BODY_CELL,
  CARD_VIEW,
  EMPTY_ICON,
  EMPTY_STATE,
  EMPTY_TEXT,
  HEAD_CELL,
  ROW_CARD_CLASSES,
  ROW_CARD_FIELD,
  ROW_CARD_LABEL,
  ROW_CARD_VALUE,
  TABLE,
  TABLE_WRAPPER,
  TABLET_TITLE,
} from "./tablet-classes";

export type TableColumnAlign = "left" | "center" | "right";

export type TableColumn<T> =
  | {
      key: string;
      header: string;
      accessor: keyof T;
      render?: never;
      align?: TableColumnAlign;
    }
  | {
      key: string;
      header: string;
      accessor?: never;
      render: (row: T) => ReactNode;
      align?: TableColumnAlign;
    };

interface TabletProps<T> {
  tableTitle: string;
  columns: TableColumn<T>[];
  rows: T[];
  getRowKey?: (row: T, index: number) => string | number;
  initialRowsToShow?: number;
  emptyMessage?: string;
}

function cellValue<T>(column: TableColumn<T>, row: T): ReactNode {
  return column.render ? column.render(row) : String(row[column.accessor]);
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className={EMPTY_STATE}>
      <i className={`bi bi-inbox ${EMPTY_ICON}`} aria-hidden="true" />
      <p className={EMPTY_TEXT}>{message}</p>
    </div>
  );
}

export default function Tablet<T>({
  tableTitle,
  columns,
  rows,
  getRowKey = (_row, index) => index,
  initialRowsToShow,
  emptyMessage = "No hay registros para mostrar",
}: TabletProps<T>) {
  const tableHead = (
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column.key} className={HEAD_CELL} style={{ textAlign: column.align }}>
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );

  if (rows.length === 0) {
    return (
      <div className="w-full">
        <p className={TABLET_TITLE}>{tableTitle}</p>
        <div className={TABLE_WRAPPER}>
          <table className={TABLE}>
            {tableHead}
            <tbody>
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={CARD_VIEW}>
          <EmptyState message={emptyMessage} />
        </div>
      </div>
    );
  }

  // Estas filas se renderizan acá (server-side cuando el llamador es un
  // Server Component) — los `render` de cada columna se ejecutan en este
  // punto, nunca cruzan al cliente como función; solo el ReactNode ya
  // resuelto cruza, cuando hace falta el toggle interactivo.
  const tableRowNodes = rows.map((row, index) => (
    <tr key={getRowKey(row, index)}>
      {columns.map((column) => (
        <td key={column.key} className={BODY_CELL} style={{ textAlign: column.align }}>
          {cellValue(column, row)}
        </td>
      ))}
    </tr>
  ));

  const cardRowNodes = rows.map((row, index) => (
    <Card key={getRowKey(row, index)} padding="sm" className={ROW_CARD_CLASSES}>
      {columns.map((column) => (
        <div key={column.key} className={ROW_CARD_FIELD}>
          <span className={ROW_CARD_LABEL}>{column.header}</span>
          <span className={ROW_CARD_VALUE}>{cellValue(column, row)}</span>
        </div>
      ))}
    </Card>
  ));

  const needsToggle = initialRowsToShow != null && rows.length > initialRowsToShow;

  return (
    <div className="w-full">
      <p className={TABLET_TITLE}>{tableTitle}</p>
      {needsToggle ? (
        <TableRowsToggle
          initialCount={initialRowsToShow}
          tableHead={tableHead}
          tableRows={tableRowNodes}
          cardRows={cardRowNodes}
        />
      ) : (
        <>
          <div className={TABLE_WRAPPER}>
            <table className={TABLE}>
              {tableHead}
              <tbody>{tableRowNodes}</tbody>
            </table>
          </div>
          <div className={CARD_VIEW}>{cardRowNodes}</div>
        </>
      )}
    </div>
  );
}
