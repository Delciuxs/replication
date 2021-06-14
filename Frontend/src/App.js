import React from "react";
import { useState, useEffect } from "react";
import "./App.scss";

import Calificaciones from "./Calificaciones";
import Formulario from "./Formulario";

export const DEFAULT_DATA_FORMULARIO = {
  noBoleta: "",
  nombre: "",
  apellidos: "",
  calif1: "",
  calif2: "",
  calif3: "",
  califTotal: "",
};

const App = () => {
  const [calificaciones, setCalificaciones] = useState(null);
  const [showFormulario, setShowFormulario] = useState(false);
  const [dataFormulario, setDataFormulario] = useState(DEFAULT_DATA_FORMULARIO);

  useEffect(() => {
    const fetchCalificaciones = async () => {
      let url = "http://localhost:3001/calificaciones";
      let response = await fetch(url);
      let data = await response.json();
      setCalificaciones(data);
    };
    fetchCalificaciones();
  }, []);

  return (
    <div className="content">
      {showFormulario === true ? (
        <Formulario
          data={dataFormulario}
          showFormulario={setShowFormulario}
          dataFormulario={setDataFormulario}
          setCalificaciones={setCalificaciones}
        />
      ) : (
        <Calificaciones
          calificaciones={calificaciones}
          showFormulario={setShowFormulario}
          setDataFormulario={setDataFormulario}
          setCalificaciones={setCalificaciones}
        />
      )}
    </div>
  );
};

export default App;
