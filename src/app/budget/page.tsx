import Tablet from "@/components/tables/tablet";
import HomeLayout from "../home/layout";
import BudgetForm from "./forms/budget-form";

export default function BudgetPage() {
  const titleTb = "Ultimos Presupuestos";
  const headTb = ["Fecha", "Tipo", "Descripción", "Monto", "Estado"];
  const dataTb = [];
  return (
    <HomeLayout>
      <div className="flex gap-10 m-10">
        <BudgetForm />
        <Tablet tableTitle={titleTb} dataHead={headTb} dataBody={[]} />
      </div>
    </HomeLayout>
  );
}
