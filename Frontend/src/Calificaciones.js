import React from "react";

import TablaCalificaciones from "./TablaCalificaciones";
import "./Calificaciones.scss";

const Calificaciones = ({
  calificaciones,
  showFormulario,
  setDataFormulario,
  setCalificaciones,
}) => {
  return (
    <div className="lista-calificaciones">
      <div className="header">
        <h1>Lista de Calificaciones</h1>
        <button onClick={() => showFormulario(true)}>Añadir</button>
      </div>
      <TablaCalificaciones
        calificaciones={calificaciones}
        setDataFormulario={setDataFormulario}
        showFormulario = {showFormulario}
        setCalificaciones={setCalificaciones}
      />
    </div>
  );
};

export default Calificaciones;
