"use client";
import "./movements-form.css"
export default function MovementsForms() {
    return (
        <div className="container-form-movements">
            <h2>Nuevo Movimiento</h2>
            <form action="" className="form-movements">
                <div className="form-group">
                    <input type="text" id="date" placeholder=" " onFocus={(e) => (e.currentTarget.type = 'date')} onBlur={(e) => { if (!e.currentTarget.value) e.currentTarget.type = 'text'; }} required/>
                    <label htmlFor="date">Fecha</label>
                </div>
                <div className="form-group">
                    <select id="type" name="type" required>
                        <option value="" hidden></option>
                        <option value="1">Entrada</option>
                        <option value="2">Salida</option>
                    </select>
                    <label htmlFor="type">Tipo</label>
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
                    <textarea name="description" id="description" placeholder=" " required></textarea>
                    <label htmlFor="description">Descripción</label>
                </div>
            </form>
            <div className="group-btn ">
                <button type="submit" className="border border-gray-300 rounded-md p-2 text-lg w-32">Guardar</button>
                <button type="reset" className="border border-gray-300 rounded-md p-2 text-lg w-32">Cancelar</button>
            </div>
        </div>
    )
}