
import { useEffect } from "react";
import "./components-table.css";
import { calcularFilasVisibles } from "./fuctions-table";
interface TabletProps {
  tableTitle: string;
  dataHead: string[];
  dataBody: Record<string, string | number>[];
}

export default function Tablet({
  dataBody,
  tableTitle,
  dataHead,
}: TabletProps) {
  const keys = dataBody.length > 0 ? Object.keys(dataBody[0]) : dataHead;
  return (
    <table className="table-auto w-150 border-collapse text-center tablet-container">
      <thead>
        <tr>
          <th colSpan={5} className="text-center text-lg py-4 title-table">
            {tableTitle}
          </th>
        </tr>
        <tr>
          {dataHead.map((headTitle, index) => (
            <th key={index} className="tablet-head">
              {headTitle}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="tablet-body">
        {!dataBody || dataBody.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center text-lg py-4">
              No hay registros para mostrar
            </td>
          </tr>
        ) : (
          dataBody.map((row, index) => (
            <tr key={index}>
              {keys.map((key) => (
                <td
                  key={key.toString()}
                  className="row-body"
                  style={{
                    color:
                      row.typeMovement === "Ingreso" ? "#14BD2D" : "#8E0909",
                  }}
                >
                  {row[key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={5} className="text-center text-lg py-4">
            <button className="btn-ver">Ver Más</button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

/* import { useEffect, useRef, useState } from "react";
import "./components-table.css"; // Aquí defines estilos base

interface TabletProps {
  tableTitle: string;
  dataHead: string[];
  dataBody: Record<string, string | number>[];
}

export default function Tablet({ tableTitle, dataHead, dataBody }: TabletProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);
  const [visibleRows, setVisibleRows] = useState(dataBody);
  const [fontSize, setFontSize] = useState("1rem");

  const keys = dataBody.length > 0 ? Object.keys(dataBody[0]) : dataHead;

  useEffect(() => {
    const ajustarTabla = () => {
      const container = tableRef.current;
      const row = rowRef.current;

      if (!container || !row) return;

      const containerHeight = container.clientHeight;
      const rowHeight = row.clientHeight || 1;

      // Espacio ocupado por header y footer (ajusta según tu estilo)
      const espacioFijo = 120;
      const disponible = containerHeight - espacioFijo;

      const maxFilas = Math.floor(disponible / rowHeight);
      setVisibleRows(dataBody.slice(0, maxFilas));

      // Escala el texto según el tamaño del contenedor
      const heightRatio = containerHeight / 1200; // 600px como altura base ideal
      const newFontSize = Math.max(0.6, Math.min(1, heightRatio)).toFixed(2); // entre 0.6rem y 1rem
      setFontSize(`${newFontSize}rem`);
    };

    ajustarTabla();
    window.addEventListener("resize", ajustarTabla);
    return () => window.removeEventListener("resize", ajustarTabla);
  }, [dataBody]);

  return (
    <div ref={tableRef} className="tablet-wrapper" style={{ height: "100%", width: "100%", overflow: "hidden" }}>
      <table className="tablet-table" style={{ fontSize }}>
        <thead>
          <tr>
            <th colSpan={keys.length} className="title-table">
              {tableTitle}
            </th>
          </tr>
          <tr>
            {dataHead.map((headTitle, index) => (
              <th key={index} className="tablet-head">
                {headTitle}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.length === 0 ? (
            <tr>
              <td colSpan={keys.length} className="empty-row">
                No hay registros para mostrar
              </td>
            </tr>
          ) : (
            visibleRows.map((row, i) => (
              <tr key={i} ref={i === 0 ? rowRef : null}>
                {keys.map((key, j) => (
                  <td
                    key={j}
                    className="row-body"
                    style={{ color: row.typeMovement === "Ingreso" ? "#14BD2D" : "#8E0909" }}
                  >
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={keys.length}>
              <button className="btn-ver">Ver Más</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
} */
