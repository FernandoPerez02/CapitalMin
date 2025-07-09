"use client"
import "./budget-form.css";
export default function BudgetForm() {
    return (
        <div className="container-form-budget">
            <h2>Nuevo Presupuesto</h2>
            <form action="#" className="form-budget">
                <div className="form-group">
                    <input type="text" id="date" placeholder=" " onFocus={(e) => (e.currentTarget.type = 'date')} onBlur={(e) => { if (!e.currentTarget.value) e.currentTarget.type = 'text'; }} required/>
                    <label htmlFor="date">Fecha</label>
                </div>
                <div className="form-group">
                    <input type="text" id="period" placeholder=" "/>
                    <label htmlFor="period">Periodo</label>
                </div>
                <div className="form-group">
                    <select id="status" name="status" required>
                        <option value="" hidden></option>
                        <option value="0">Confirmado</option>
                        <option value="1">Pendiente</option>
                        <option value="2">Procesado</option>
                        <option value="3">Rechazado</option>
                        <option value="4">Programado</option>
                        <option value="5">Revertido</option>
                    </select>
                    <label htmlFor="status">Estado</label>
                </div>
                <div className="form-group">
                    <input type="text" id="amount" placeholder=" "/>
                    <label htmlFor="amount">Monto</label>
                </div>
                <div className="form-group">
                    <textarea name="description" id="description" placeholder=" "/>
                    <label htmlFor="description">Descripción</label>
                </div>
            </form>
            <div className="group-btn">
                <button type="submit" className="border border-gray-300 rounded-md p-2 text-lg w-32">Guardar</button>
                <button type="reset" className="border border-gray-300 rounded-md p-2 text-lg w-32">Cancelar</button>
            </div>
        </div>
    );
}