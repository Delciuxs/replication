import React, { useContext } from "react";

import ServerContext from './provider/ServerContext';

import "./TablaServidores.scss";
import FilaServidores from "./FilaServidores";

const TablaServidores = () => {
  const context = useContext(ServerContext);

  return (
    <table>
      <tbody>
        <tr>
          <th>Dirección</th>
          <th>Puerto</th>
          <th>Prioridad</th>
          <th>Estado</th>
        </tr>
        {context.serversList &&
          context.serversList.map((server, index) => (
            <FilaServidores
              key={index}
              server={server}
            />
          ))}
      </tbody>
    </table>
  );
};

export default TablaServidores;
