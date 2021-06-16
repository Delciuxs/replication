import React from "react";

const FilaServidores = ({ server }) => {
  return (
    <tr className={server.maestro ? "master-row" : "slave-row"}>
      <td>{server.ip}</td>
      <td>{server.puerto}</td>
      <td>
        <i
          id="status"
          className="fas fa-check-square"
        ></i>
      </td>
    </tr>
  );
};

export default FilaServidores;
