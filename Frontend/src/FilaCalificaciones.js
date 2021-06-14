import React from "react";

const FilaCalificaciones = ({
  calificacion,
  setDataFormulario,
  showFormulario,
  setCalificaciones,
}) => {
  const modificaCalificacion = () => {
    setDataFormulario({
      noBoleta: calificacion.noBoleta,
      nombre: calificacion.nombre,
      apellidos: calificacion.apellidos,
      calif1: calificacion.calif1,
      calif2: calificacion.calif2,
      calif3: calificacion.calif3,
      califTotal: calificacion.califTotal,
    });
    showFormulario(true);
  };

  const DELETECalificacion = async () => {
    await fetch(`http://localhost:3001/calificaciones/${calificacion.noBoleta}`, {
      method: "DELETE",
    });
    let response = await fetch("http://localhost:3001/calificaciones");
    let data = await response.json();
    setCalificaciones(data);
  };

  return (
    <tr>
      <td>
        <i
          id="delete"
          className="fas fa-trash-alt"
          onClick={() => DELETECalificacion()}
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
