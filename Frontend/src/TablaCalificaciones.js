import React from "react";

import "./TablaCalificaciones.scss";
import FilaCalificaciones from "./FilaCalificaciones";

const TablaCalificaciones = ({
  calificaciones,
  setDataFormulario,
  showFormulario,
  setCalificaciones,
}) => {
  return (
    <table>
      <tbody>
        <tr>
          <th>Acciones</th>
          <th>No Boleta</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Calificacion 1</th>
          <th>Calificacion 2</th>
          <th>Calificacion 3</th>
          <th>Total</th>
        </tr>
        {calificaciones &&
          calificaciones.map((calificacion, index) => (
            <FilaCalificaciones
              key={index}
              calificacion={calificacion}
              setDataFormulario={setDataFormulario}
              showFormulario={showFormulario}
              setCalificaciones={setCalificaciones}
            />
          ))}
      </tbody>
    </table>
  );
};

export default TablaCalificaciones;
