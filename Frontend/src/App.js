import React, { useContext, useEffect } from "react";
import "./App.scss";

import ServerContext from './provider/ServerContext';

import Calificaciones from "./Calificaciones";
import Formulario from "./Formulario";
import Servidores from "./Servidores";

const App = () => {
  const context = useContext(ServerContext);

  useEffect(() => {
    context.fetchServerList();
    context.fetchCalificaciones();
  }, []);

  return (
    <div className="content">
      {context.formulario === true ? (
        <Formulario/>
      ) : (
        <Calificaciones/>
      )}
      <hr/>
      <Servidores/>
    </div>
  );
};

export default App;
