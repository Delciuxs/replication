import React, { useContext } from "react";

import ServerContext from './provider/ServerContext';

const FilaCalificaciones = ({ calificacion }) => {
  const context = useContext(ServerContext);

  const modificaCalificacion = () => {
    context.dataFormulario({
      noBoleta: calificacion.noBoleta,
      nombre: calificacion.nombre,
      apellidos: calificacion.apellidos,
      calif1: calificacion.calif1,
      calif2: calificacion.calif2,
      calif3: calificacion.calif3,
      califTotal: calificacion.califTotal,
    });
    context.showFormulario(true);
  };

  return (
    <tr>
      <td>
        <i
          id="delete"
          className="fas fa-trash-alt"
          onClick={() => context.DELETECalificacion(calificacion.noBoleta)}
        ></i>
        <i
          id="edit"
          className="fas fa-pencil-alt"
          onClick={() => modificaCalificacion()}
        ></i>
      </td>
      <td>{calificacion.noBoleta}</td>
      <td>{calificacion.nombre}</td>
      <td>{calificacion.apellidos}</td>
      <td>{calificacion.calif1}</td>
      <td>{calificacion.calif2}</td>
      <td>{calificacion.calif3}</td>
      <td>{calificacion.califTotal}</td>
    </tr>
  );
};

export default FilaCalificaciones;
