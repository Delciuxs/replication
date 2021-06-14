const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const Calificacion = require("../model/calificacionesModel");

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

    //Servidor esclavo 1
    await fetch("http://localhost:3002/calificaciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    //Servidor esclavo 2
    await fetch("http://localhost:3003/calificaciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
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
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

async function getCalificacion(req, res, next) {
  let calificacion;
  try {
    calificacion = await Calificacion.findById(req.params.id);
    if (calificacion == null) {
      return res.status(404).json({
        message: "No se encontro esa calificacion",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
  res.calificacion = calificacion;
  next();
}

module.exports = router;
