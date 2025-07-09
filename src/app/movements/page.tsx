import Tablet from "@/components/tables/tablet";
import HomeLayout from "../home/layout";
import MovementsForms from "./forms/movements-forms";

export default function MovementsPage() {
    const data = [
        {
            date: "2023-10-01",
            typeMovement: "Ingreso",
            description: "Compra de equipos",
            amount: 1000,
            status: "Pendiente",
        },
    ]
    return (
        <HomeLayout>
            <div className="flex m-10 gap-10">
                <MovementsForms/>
        <Tablet tableTitle="Ultimos Movimientos" dataHead={["Fecha", "Tipo", "Descripción", "Monto", "Estado"]} dataBody={[]}/>
            </div>
        </HomeLayout>
    );
}