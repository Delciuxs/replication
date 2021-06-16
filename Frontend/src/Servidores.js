import React, { useContext } from "react";

import ServerContext from './provider/ServerContext';

import TablaServidores from "./TablaServidores";
import "./Servidores.scss";

const Servidores = () => {
  const context = useContext(ServerContext);

  return (
    <div className="lista-servidores">
      <div className="header">
        <h1>Lista de Servidores</h1>
        <button disabled={true} className="text" >Servidor Maestro</button>
        <button className="button" onClick={() => context.fetchServerList()} ><i className="fas fa-sync"></i></button>
      </div>
      <TablaServidores/>
    </div>
  );
};

export default Servidores;
