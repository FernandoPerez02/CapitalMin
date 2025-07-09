"use client";
import ComponentBarChart from "@/components/dashboard/bar-chart/component-bar-chart";
import "./components-home.css"
import Tablet from "@/components/tables/tablet";
import { Card, CardContent, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { data } from "../pruebas/page";

const ComponentPieChart = dynamic(() => import("@/components/dashboard/pie-chart/component-pie-chart"), {
  ssr: false,
});

export default function Home() {
    const headTable = ["Fecha", "Tipo", "Estado", "Monto", "Descripción"];
    const bodyTable = data;
    return (
        <div className="container-home">
            <div className="container-cards-filter">
                <div className="container-cards">
                <Card className="summary-card" sx={{ backgroundColor: "#203A43", borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ color: "#fff", fontSize: 16}}>Saldo Disponible</Typography>
                        <Typography variant="body2" sx={{ color: "#fff", fontSize: 15}}>
                            <span>$</span>1000
                        </Typography>
                    </CardContent>
                </Card>
                <Card className="summary-card" sx={{ backgroundColor: "#203A43", borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ color: "#fff", fontSize: 16}}>
                            Ingresos Mes
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#fff", fontSize: 15}}>
                            <span>$</span>1000
                        </Typography>
                    </CardContent>
                </Card>
                <Card className="summary-card" sx={{ backgroundColor: "#203A43", borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ color: "#fff", fontSize: 16}}>
                            Egresos Mes
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#fff", fontSize: 15}}>
                            <span>$</span>1000
                        </Typography>
                    </CardContent>
                </Card>
            </div>
                <div className="container-filter">
                    <div className="icon-tooltip">
                        <i className="bi bi-filter-square-fill text-white"/>
                        <span className="tooltip-text">Graficar</span>
                    </div>
                    <div className="groups-options">
                        <div className="group-filter">
                        <select name="Movimientos" id="Movimientos" required>
                            <option value="" hidden></option>
                        <option value="0">Todos</option>
                        <option value="1">Ingresos</option>
                        <option value="2">Egresos</option>
                    </select>
                    <label htmlFor="Movimientos">Movimientos</label>
                    </div>
                    <div className="group-filter">
                        <select name="ranges" id="ranges" required>
                            <option value="" hidden></option>
                            <option value={0}>Dia</option>
                            <option value={1}>Semana</option>
                            <option value={2}>Mes</option>
                            <option value={3}>Año</option>
                        </select>
                        <label htmlFor="ranges">Rango</label>
                    </div>
                    <div className="group-filter" hidden>
                        <select name="months" id="months" required>
                            <option value="" hidden></option>
                            <option value={0}>Todos</option>
                            <option value={1}>Enero</option>
                            <option value={2}>Febrero</option>
                            <option value={3}>Marzo</option>
                            <option value={4}>Abril</option>
                            <option value={5}>Mayo</option>
                            <option value={6}>Junio</option>
                            <option value={7}>Julio</option>
                            <option value={8}>Agosto</option>
                            <option value={9}>Septiembre</option>
                            <option value={10}>Octubre</option>
                            <option value={11}>Noviembre</option>
                            <option value={12}>Diciembre</option>
                        </select>
                        <label htmlFor="months">Mes</label>
                    </div>
                    </div>                
                </div>
            </div>
            <div className="container-chart">
                <div className="chart">
                    <ComponentBarChart/>
                </div>
                <div className="chart">
                    <ComponentPieChart />
                </div>
            </div>
            <div className="container-tablet">
                <Tablet tableTitle="Movimientos Recientes" dataHead={headTable} dataBody={data} />
            </div>          
        </div>
    )
};