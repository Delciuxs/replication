const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const Calificacion = require("../model/calificacionesModel");
const Servidor = require("../model/servidoresModel");

//Obtener todas las calificaciones
router.get("/", async (req, res) => {
  try {
    const servidores = await Servidor.find();
    const { ip, puerto, prioridad } = req.query;
    const host = req.headers.host.split(":");
    const servidorMaster = servidores.filter(servidor => servidor.maestro)[0];
    if(host[0] == servidorMaster.ip && host[1] == servidorMaster.puerto){
      if(ip != undefined && puerto != undefined && prioridad != undefined){
        var nuevoServidor = new Servidor({ip, puerto, prioridad, maestro: false});
        nuevoServidor = await nuevoServidor.save();
        const servidoresActualizados = [...servidores];
        servidoresActualizados.push(nuevoServidor);
        const servidoresEsclavos = servidoresActualizados.filter(servidor => !servidor.maestro);
        for(var servidorEsclavoIndex in servidoresEsclavos){
          await fetch("http://" + servidoresEsclavos[servidorEsclavoIndex].ip + ":" + servidoresEsclavos[servidorEsclavoIndex].puerto + "/servidores", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoServidor),
          });
        }
      }
    }
    res.json(servidores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Obtener una calificacion
router.get("/:id", getCalificacion, (req, res) => {
  res.json(res.calificacion);
});

router.post("/", async (req, res) => {
  try {
    const servidor = new Servidor(req.body);
    servidor = await servidor.save();
    res.status(201).json(servidor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Actualizando calificacion
router.patch("/:id", getCalificacion, async (req, res) => {
  if (req.body.noBoleta != null) {
    res.calificacion.noBoleta = req.body.noBoleta;
  }
  if (req.body.nombre != null) {
    res.calificacion.nombre = req.body.nombre;
  }
  if (req.body.apellidos != null) {
    res.calificacion.apellidos = req.body.apellidos;
  }
  if (req.body.calif1 != null) {
    res.calificacion.calif1 = req.body.calif1;
  }
  if (req.body.calif2 != null) {
    res.calificacion.calif2 = req.body.calif2;
  }
  if (req.body.calif3 != null) {
    res.calificacion.calif3 = req.body.calif3;
  }
  if (req.body.califTotal != null) {
    res.calificacion.califTotal = req.body.califTotal;
  }
  if (req.body.fechaModificacion != null) {
    res.calificacion.fechaModificacion = req.body.fechaModificacion;
  }
  try {
    const updatedCalificacion = await res.calificacion.save();
    res.json(updatedCalificacion);
    //=======================================================
    //REPLICANDO
    //=======================================================

    //Servidor esclavo 1
    await fetch(`http://localhost:3002/calificaciones/${res.calificacion.noBoleta}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCalificacion),
    });
    //Servidor esclavo 2
    await fetch(`http://localhost:3003/calificaciones/${res.calificacion.noBoleta}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCalificacion),
    });
    //=======================================================
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Borrando calificacion
router.delete("/:id", getCalificacion, async (req, res) => {
  try {
    await res.calificacion.remove();
    res.json({
      message: "Calificacion eliminada",
    });
    //=======================================================
    //REPLICANDO
    //=======================================================

    //Servidor esclavo 1
    await fetch(
      `http://localhost:3002/calificaciones/${res.calificacion.noBoleta}`,
      {
        method: "DELETE",
      }
    );
    //Servidor esclavo 2
    await fetch(
      `http://localhost:3003/calificaciones/${res.calificacion.noBoleta}`,
      {
        method: "DELETE",
      }
    );
    //=======================================================
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

async function getCalificacion(req, res, next) {
  let calificacion;
  try {
    calificacion = await Calificacion.find({ noBoleta: req.params.id });
    if (calificacion[0] == null) {
      return res.status(404).json({
        message: "No se encontro esa calificacion",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
  res.calificacion = calificacion[0];
  next();
}

module.exports = router;
