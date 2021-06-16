import React, { useContext } from "react";

import ServerContext from './provider/ServerContext';

import "./TablaCalificaciones.scss";
import FilaCalificaciones from "./FilaCalificaciones";

const TablaCalificaciones = () => {
  const context = useContext(ServerContext);

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
        {context.calificaciones &&
          context.calificaciones.map((calificacion, index) => (
            <FilaCalificaciones
              key={index}
              calificacion={calificacion}
            />
          ))}
      </tbody>
    </table>
  );
};

export default TablaCalificaciones;
