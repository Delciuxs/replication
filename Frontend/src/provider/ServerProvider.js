import { useState } from "react";
import ServerContext from './ServerContext';

const DEFAULT_DATA_FORMULARIO = {
  noBoleta: "",
  nombre: "",
  apellidos: "",
  calif1: "",
  calif2: "",
  calif3: "",
  califTotal: "",
};

const ServerProvider = ({children, dispatch}) => {
  const [calificaciones, setCalificaciones] = useState(null);
  const [showFormulario, setShowFormulario] = useState(false);
  const [dataFormulario, setDataFormulario] = useState(DEFAULT_DATA_FORMULARIO);
  const [masterServer, setMasterServer] = useState("http://localhost:5000/");
  const [servers, setServers] = useState([]);
  
  const fetchServerList = async () => {
    let url = `${masterServer}servidores`;
    fetch(url)
      .then( response => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then( json => {
        const master_answer = json.find(el => el.maestro);
        setMasterServer(`http://${master_answer.ip}:${master_answer.puerto}/`);
        setServers(json);
      })
      .catch( err => {
        console.log(err);
      })
  };

  const fetchCalificaciones = async () => {
    let url = `${masterServer}calificaciones`;
    fetch(url)
      .then( response => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then( json => {
        setCalificaciones(json);
      })
      .catch( err => {
        console.log(err);
      })
  };

  const POSTCalificacion = async (data) => {
    let url = `${masterServer}calificaciones`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then( () => {
        fetchCalificaciones();
      })
      .catch( err => {
        console.log(err);
      })
  };

  const PATCHCalificacion = async (id, data) => {
    let url = `${masterServer}calificaciones/${id}`;
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then( () => {
        fetchCalificaciones();
      })
      .catch( err => {
        console.log(err);
      })
  };

  const DELETECalificacion = async (id) => {
    let url = `${masterServer}calificaciones/${id}`;
    fetch(url, {
      method: "DELETE",
    })
    .then( () => {
      fetchCalificaciones();
    })
    .catch( err => {
      console.log(err);
    })
  };

  return (
    <ServerContext.Provider
      value={{
        server: masterServer,
        serversList: servers,
        fetchServerList: fetchServerList,
        default_data: DEFAULT_DATA_FORMULARIO,
        calificaciones: calificaciones,
        fetchCalificaciones: fetchCalificaciones,
        POSTCalificacion: POSTCalificacion,
        PATCHCalificacion: PATCHCalificacion,
        DELETECalificacion: DELETECalificacion,
        formulario: showFormulario,
        showFormulario: setShowFormulario,
        data: dataFormulario,
        dataFormulario: setDataFormulario,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export default ServerProvider;