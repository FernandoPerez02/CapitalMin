"use client";
import Tablet from "@/components/tables/tablet";
import dynamic from "next/dynamic";
const ComponentPieChart = dynamic(() => import("@/components/dashboard/pie-chart/component-pie-chart"), {
  ssr: false,
});

export const data = [
    {
      date: "2023-10-01", typeMovement: "Ingreso", description: "Compra de equipos", amount: 1000, status: "Pendiente"
    },
    {
      date: "2023-10-02", typeMovement: "Egreso", description: "Venta de equipos", amount: 1000, status: "Pendiente"
    },
    {
      date: "2023-10-03", typeMovement: "Ingreso", description: "Compra de equipos", amount: 1000, status: "Pendiente"
    },
    {
      date: "2023-10-04", typeMovement: "Egreso", description: "Venta de equipos", amount: 1000, status: "Pendiente"
    },
  ]

export default function Prueba() {
  const dataHead = [ "Fecha", "Tipo", "Descripción", "Cantidad", "Estado" ];
  
  return (
    <Tablet tableTitle="Movimientos" dataHead={dataHead} dataBody={data}/>
  );
}
