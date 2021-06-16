import React, { useContext } from "react";

import ServerContext from './provider/ServerContext';

import TablaCalificaciones from "./TablaCalificaciones";
import "./Calificaciones.scss";

const Calificaciones = () => {
  const context = useContext(ServerContext);

  return (
    <div className="lista-calificaciones">
      <div className="header">
        <h1>Lista de Calificaciones</h1>
        <button onClick={() => context.showFormulario(true)}>Añadir</button>
      </div>
      <TablaCalificaciones/>
    </div>
  );
};

export default Calificaciones;
