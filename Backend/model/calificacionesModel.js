const mongoose = require("mongoose");

const calificacionesSchema = new mongoose.Schema({
  noBoleta: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  calif1: {
    type: String,
    required: true,
  },
  calif2: {
    type: String,
    required: true,
  },
  calif3: {
    type: String,
    required: true,
  },
  califTotal: {
    type: String,
    required: true,
  },
  fechaModificacion: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Calificacion", calificacionesSchema);
