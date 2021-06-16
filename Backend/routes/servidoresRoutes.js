const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
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

router.post("/", async (req, res) => {
  try {
    const servidor = new Servidor(req.body);
    servidor = await servidor.save();
    res.status(201).json(servidor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
