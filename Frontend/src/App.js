import React, { useContext, useEffect } from "react";
import "./App.scss";

import ServerContext from './provider/ServerContext';

import Calificaciones from "./Calificaciones";
import Formulario from "./Formulario";

const App = () => {
  const context = useContext(ServerContext);

  useEffect(() => {
    context.fetchServerList();
    context.fetchCalificaciones();
  }, [context.masterServer]);

  return (
    <div className="content">
      {context.formulario === true ? (
        <Formulario/>
      ) : (
        <Calificaciones/>
      )}
    </div>
  );
};

export default App;
