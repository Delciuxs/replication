import React from "react";
import { useRef, useContext } from "react";

import ServerContext from './provider/ServerContext';

import "./Formulario.scss";

function isNumeric(str) {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

const Formulario = () => {
  const context = useContext(ServerContext);

  const noBoletaRef = useRef();
  const nombreRef = useRef();
  const apellidosRef = useRef();
  const calif1Ref = useRef();
  const calif2Ref = useRef();
  const calif3Ref = useRef();
  const califTotalRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const hideForm = () => {
    context.showFormulario(false);
    context.dataFormulario(context.default_data);
  };

  const calcCalifTotal = () => {
    let calif1 = calif1Ref.current.value;
    let calif2 = calif2Ref.current.value;
    let calif3 = calif3Ref.current.value;
    if (isNumeric(calif1) && isNumeric(calif2) && isNumeric(calif3)) {
      let califTotal = Math.round(
        (parseInt(calif1) + parseInt(calif2) + parseInt(calif3)) / 3
      );
      califTotalRef.current.value = califTotal;
    }
  };

  const save = () => {
    let noBoleta = noBoletaRef.current.value;
    let nombre = nombreRef.current.value;
    let apellidos = apellidosRef.current.value;
    let calif1 = calif1Ref.current.value;
    let calif2 = calif2Ref.current.value;
    let calif3 = calif3Ref.current.value;
    let califTotal = califTotalRef.current.value;

    if (
      noBoleta !== "" &&
      nombre !== "" &&
      apellidos !== "" &&
      calif1 !== "" &&
      calif2 !== "" &&
      calif3 !== "" &&
      califTotal !== ""
    ) {
      if (context.data.noBoleta === "") {
        context.POSTCalificacion({
          noBoleta: noBoleta,
          nombre: nombre,
          apellidos: apellidos,
          calif1: calif1,
          calif2: calif2,
          calif3: calif3,
          califTotal: califTotal,
          fechaModificacion: Date.now(),
        });
      } else {
        context.PATCHCalificacion(context.data.noBoleta, {
          noBoleta: noBoleta,
          nombre: nombre,
          apellidos: apellidos,
          calif1: calif1,
          calif2: calif2,
          calif3: calif3,
          califTotal: califTotal,
          fechaModificacion: Date.now(),
        });
      }
      hideForm();
    }
  };

  return (
    <div className="formulario">
      {context.data.noBoleta === "" ? <h1>Nueva Entrada</h1> : <h1>Modificando Entrada</h1>}
      <form onSubmit={handleSubmit} className="form-content">
        <div className="input-form">
          <label htmlFor="noBoleta">No Boleta </label>
          <input
            autoComplete="off"
            type="text"
            name="noBoleta"
            defaultValue={context.data.noBoleta}
            ref={noBoletaRef}
            disabled={context.data.noBoleta !== "" ? true : false}
          />
        </div>
        <div className="input-form">
          <label htmlFor="noBoleta">Nombres </label>
          <input
            autoComplete="off"
            type="text"
            name="nombre"
            defaultValue={context.data.nombre}
            ref={nombreRef}
          />
        </div>
        <div className="input-form">
          <label htmlFor="apellidos">Apellidos </label>
          <input
            autoComplete="off"
            type="text"
            name="apellidos"
            defaultValue={context.data.apellidos}
            ref={apellidosRef}
          />
        </div>
        <div className="input-form">
          <label htmlFor="calif1">Calificacion 1 </label>
          <input
            autoComplete="off"
            type="text"
            name="calif1"
            defaultValue={context.data.calif1}
            ref={calif1Ref}
            onChange={() => calcCalifTotal()}
          />
        </div>
        <div className="input-form">
          <label htmlFor="calif2">Calificacion 2 </label>
          <input
            autoComplete="off"
            type="text"
            name="calif2"
            defaultValue={context.data.calif2}
            ref={calif2Ref}
            onChange={() => calcCalifTotal()}
          />
        </div>
        <div className="input-form">
          <label htmlFor="calif3">Calificacion 3 </label>
          <input
            autoComplete="off"
            type="text"
            name="calif3"
            defaultValue={context.data.calif3}
            ref={calif3Ref}
            onChange={() => calcCalifTotal()}
          />
        </div>
        <div className="input-form">
          <label htmlFor="califTotal">Total </label>
          <input
            autoComplete="off"
            type="text"
            name="califTotal"
            defaultValue={context.data.califTotal}
            ref={califTotalRef}
            disabled={true}
          />
        </div>
        <div className="form-actions">
          <button id="cancelar" onClick={() => hideForm()}>
            Cancelar
          </button>
          <button id="guardar" type="submit" onClick={() => save()}>
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Formulario;
