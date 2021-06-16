const mongoose = require("mongoose");

const servidoresSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  puerto: {
    type: Number,
    required: true,
  },
  prioridad: {
    type: Number,
    required: true,
  },
  maestro: {
    type: Boolean,
    required: true,
  }
});

module.exports = mongoose.model("Servidor", servidoresSchema);
