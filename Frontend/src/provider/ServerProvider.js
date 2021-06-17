import { useRef, useState } from "react";
import ServerContext from './ServerContext';

class PingError extends Error {
  constructor(message) {
    super(message);
    this.name = "PingError";
  }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

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
  const masterServer = useRef("http://localhost:5000/");
  const [servers, setServers] = useState([]);

  const fetchNewMasterServer = async () => {
    const slave_servers = servers.find(el => !el.maestro);
    const slave_url = `http://${slave_servers.ip}:${slave_servers.puerto}/`;
    console.log(`Slave url is ${slave_url}`);
    fetchServerList(slave_url);
  };

  const pingMasterServer = async (fetch_server = masterServer.current) => {
    const url = `${fetch_server}servidores/ping`;
    let timeOut = 0;

    await fetch(url)
      .then( response => {
        if (!response.ok) { throw PingError(response); }
      })
      .catch( err => {
        timeOut = 1000;
        fetchNewMasterServer();
        console.log("Ping error ", err);
      })
    return delay(timeOut);
  };
  
  const fetchServerList = async (fetch_server = masterServer.current) => {
    await pingMasterServer(fetch_server);
    const url = `${fetch_server}servidores`;
    fetch(url)
      .then( response => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then( json => {
        const master_answer = json.find(el => el.maestro);
        masterServer.current = `http://${master_answer.ip}:${master_answer.puerto}/`;
        console.log("New master: ", masterServer.current)
        setServers(json);
      })
      .catch( err => {
        console.log(err);
      })
  };

  const fetchCalificaciones = async () => {
    await pingMasterServer();
    const url = `${masterServer.current}calificaciones`;
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
    await pingMasterServer();
    const url = `${masterServer.current}calificaciones`;
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
    await pingMasterServer();
    const url = `${masterServer.current}calificaciones/${id}`;
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
    await pingMasterServer();
    const url = `${masterServer.current}calificaciones/${id}`;
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