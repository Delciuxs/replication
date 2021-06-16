const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const Servidor = require("../model/servidoresModel");

//Obtener todas las calificaciones
router.get("/", async (req, res) => {
  try {
    const servidores = await Servidor.find();
    const host = req.headers.host.split(":");
    const servidorMaster = servidores.filter(servidor => servidor.maestro)[0];
    if(host[0] == servidorMaster.ip && host[1] == servidorMaster.puerto && req.query != undefined){
      const { ip, puerto, prioridad } = req.query;
      if(ip != undefined && puerto != undefined && prioridad != undefined){
        //const servidoresCaidos = [];
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
          }).catch(error => servidoresCaidos.push(servidoresEsclavos[servidorEsclavoIndex]));
        }
        if(servidoresCaidos.length > 0){
          /*const servidoresActivos = servidoresActualizados.filter(servidor => !servidor.maestro && !servidoresCaidos.includes(servidor));
          for(var servidorCaidoIndex in servidoresCaidos){
            const servidorCaido = servidoresCaidos[servidorCaidoIndex];
            Servidor.remove(servidorCaido,(err) => console.log("Servidor caido removido"));
            for(var servidorActivoIndex in servidoresActivos){
              const servidorActivo = servidoresActivos[servidorActivoIndex];

            }
          }*/
        }
      }
    }
    res.json(servidores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/ping", async (req, res) => {
  try {
    res.status(201).json();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const servidor = new Servidor(req.body);
    await servidor.save();
    res.status(201).json(servidor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/coordinar", async (req, res) => {
  try {
    await Servidor.deleteMany({}, function(err) { 
      console.log('collection removed') 
    });
    for(var index in req.body){
      const servidor = new Servidor(req.body[index]);
      await servidor.save();
    }
    res.status(201).json(servidor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
