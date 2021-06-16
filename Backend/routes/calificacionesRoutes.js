const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const Calificacion = require("../model/calificacionesModel");

async function getMasterAndSlaveServers(port) {
  let servers = null;

  try {
    const url = `http://localhost:${port}/servidores`;
    const responseGetServers = await fetch(url);
    servers = await responseGetServers.json();
  } catch (error) {
    console.log("Cant get servers table");
    console.log(error);
  }

  const servidorMaster = servers.filter((servidor) => servidor.maestro)[0];
  const servidoresEsclavo = servers.filter((servidor) => !servidor.maestro);

  return [servidorMaster, servidoresEsclavo];
}

//Obtener todas las calificaciones
router.get("/", async (req, res) => {
  try {
    const calificaciones = await Calificacion.find();
    res.json(calificaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Obtener una calificacion
router.get("/:id", getCalificacion, (req, res) => {
  res.json(res.calificacion);
});

//Añadir calificacion
router.post("/", async (req, res) => {
  let data = {
    noBoleta: req.body.noBoleta,
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    calif1: req.body.calif1,
    calif2: req.body.calif2,
    calif3: req.body.calif3,
    califTotal: req.body.califTotal,
    fechaModificacion: req.body.fechaModificacion,
  };
  const calificacion = new Calificacion(data);
  try {
    const newCalificacion = await calificacion.save();
    res.status(201).json(newCalificacion);

    //=======================================================
    //REPLICANDO
    //=======================================================

    const host = req.headers.host.split(":");
    servers = await getMasterAndSlaveServers(host[1]);

    const servidorMaster = servers[0];
    const servidoresEsclavo = servers[1];

    if (host[0] == servidorMaster.ip && host[1] == servidorMaster.puerto) {
      for (let servidorEsclavo of servidoresEsclavo) {
        let urlPost = `http://${servidorEsclavo.ip}:${servidorEsclavo.puerto}/calificaciones`;
        try {
          await fetch(urlPost, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(calificacion),
          });
        } catch (error) {
          console.log(
            "Cant replicate POST to port" +
              servidoresEsclavo[servidorEsclavoIndex].puerto
          );
          console.log(error);
        }
      }
    }

    //=======================================================
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

    const host = req.headers.host.split(":");
    servers = await getMasterAndSlaveServers(host[1]);

    const servidorMaster = servers[0];
    const servidoresEsclavo = servers[1];

    if (host[0] == servidorMaster.ip && host[1] == servidorMaster.puerto) {
      for (let servidorEsclavo of servidoresEsclavo) {
        let urlPatch = `http://${servidorEsclavo.ip}:${servidorEsclavo.puerto}/calificaciones/${res.calificacion.noBoleta}`;
        try {
          await fetch(urlPatch, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCalificacion),
          });
        } catch (error) {
          console.log(
            "Cant replicate PATCH to port" +
              servidoresEsclavo[servidorEsclavoIndex].puerto
          );
          console.log(error);
        }
      }
    }
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

    const host = req.headers.host.split(":");
    servers = await getMasterAndSlaveServers(host[1]);

    const servidorMaster = servers[0];
    const servidoresEsclavo = servers[1];

    if (host[0] == servidorMaster.ip && host[1] == servidorMaster.puerto) {
      for (let servidorEsclavo of servidoresEsclavo) {
        let urlDelete = `http://${servidorEsclavo.ip}:${servidorEsclavo.puerto}/calificaciones/${res.calificacion.noBoleta}`;
        try {
          await fetch(urlDelete, {
            method: "DELETE",
          });
        } catch (error) {
          console.log(
            "Cant replicate DELETE to port" +
              servidoresEsclavo[servidorEsclavoIndex].puerto
          );
          console.log(error);
        }
      }
    }
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
