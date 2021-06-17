const express = require("express");
var cors = require("cors");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const Servidor = require("./model/servidoresModel");
const app = express();
app.use(express.json());
app.use(cors());

const ipServidor = process.argv[3];
const puertoServidor = process.argv[4];
const prioridadServidor = process.argv[5];
const ipMaestro = process.argv[6];
const puertoMaestro = process.argv[7];

conectarBaseDeDatos(ipServidor, puertoServidor);
Servidor.deleteMany({}, function(err) { 
  console.log('collection removed') 
});
if(ipMaestro == undefined && puertoMaestro == undefined){
  iniciarMaestro(ipServidor, puertoServidor, prioridadServidor);
}
else{
  conectarMaestro(ipServidor, puertoServidor, ipMaestro, puertoMaestro, prioridadServidor);
  setTimeout(() => monitorizarMaestro(ipServidor, puertoServidor, ipMaestro, puertoMaestro, prioridadServidor), 1000);
}

const calificacionesRouter = require("./routes/calificacionesRoutes");
app.use("/calificaciones", calificacionesRouter);
const servidoresRouter = require("./routes/servidoresRoutes");
app.use("/servidores", servidoresRouter);

app.listen(parseInt(puertoServidor), () => {
  console.log("Server started on port " + puertoServidor);
});

function conectarBaseDeDatos(ip, puerto){
  mongoose.connect("mongodb://" + ip + "/calificaciones" + puerto, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", (error) => console.log(error));
  db.once("open", () => console.log("Master database connected"));  
}

async function iniciarMaestro(ip, puerto, prioridad){
  let data = {
    ip: ip,
    puerto: puerto,
    prioridad: prioridad,
    maestro: true,
  };
  const servidor = new Servidor(data);
  await servidor.save();
}

async function conectarMaestro(ipServidor, puertoServidor, ipMaestro, puertoMaestro, prioridadServidor){
  fetch("http://" + ipMaestro + ":" + puertoMaestro + "/servidores?ip=" + ipServidor + "&puerto=" + puertoServidor + "&prioridad=" + prioridadServidor).then(response => response.json()).then(async datosServidores => {
    for(var datosServidorIndex in datosServidores){
      const servidor = new Servidor(datosServidores[datosServidorIndex]);
      await servidor.save();
    } 
  }).catch(error => {
    console.log("Error conectando al maestro, suicidandome",error);
    process.exit(1);
  });
}

async function monitorizarMaestro(ipServidor, puertoServidor, ipMaestro, puertoMaestro, prioridadServidor){
  fetch("http://" + ipMaestro + ":" + puertoMaestro + "/servidores/ping").then(response => {
    if(response.status == 201)
      setTimeout(() => monitorizarMaestro(ipServidor, puertoServidor, ipMaestro, puertoMaestro, prioridadServidor), 1000);
  }).catch(async error => {
    console.log("Maestro caido");
    const servidores = await Servidor.find()
    const servidoresRestantes = servidores.filter(servidor => !(servidor.ip == ipMaestro && servidor.puerto == puertoMaestro));
    const servidoresCandidatosMaestro = servidoresRestantes.filter(servidor => 
      !(servidor.ip == ipServidor && servidor.puerto == puertoServidor) && servidor.prioridad > prioridadServidor);
    var servidorPrioritarioActivo = await existeServidorPrioritarioActivo(servidoresCandidatosMaestro);
    if(!servidorPrioritarioActivo){
      console.log("Soy el nuevo maestro");
      const esteServidor = servidoresRestantes.filter(servidor => servidor.ip == ipServidor && servidor.puerto == puertoServidor)[0];
      esteServidor.maestro = true;
      const servidoresActivos = await obtenerServidoresActivos(servidoresRestantes);
      await actualizarListaServidores(servidoresActivos)
      const servidoresNotificar = servidoresRestantes.filter(servidor => !(servidor.ip == ipServidor && servidor.puerto == puertoServidor) && servidoresActivos.includes(servidor));
      await notificarNuevoMaestro(servidoresNotificar, servidoresActivos);
    } 
  });
}

async function existeServidorPrioritarioActivo(servidoresCandidatosMaestro){
  for(var servidorIndex in servidoresCandidatosMaestro){
    const ip = servidoresCandidatosMaestro[servidorIndex].ip;
    const puerto = servidoresCandidatosMaestro[servidorIndex].puerto;
    const activo = await fetch("http://" + ip + ":" + puerto + "/servidores/ping")
                        .then(response => {return response.status == 201})
                        .catch(() => false);
    if(activo) return true;
    else console.log("Servidor candidato a maestro caido: " + ip + ":" + puerto);
  }
  return false;
}

async function actualizarListaServidores(servidoresActivos){
  const servidores = [];
  for(var servidorIndex in servidoresActivos){
    var servidor = {
      ip: servidoresActivos[servidorIndex].ip,
      puerto: servidoresActivos[servidorIndex].puerto,
      prioridad: servidoresActivos[servidorIndex].prioridad,
      maestro: servidoresActivos[servidorIndex].maestro,
      _id: servidoresActivos[servidorIndex]._id,
    }
    servidores.push(servidor);
  }
  await Servidor.deleteMany({}, function(err) { 
    console.log('collection removed') 
  });
  for(var servidorIndex in servidores){
    const servidor = new Servidor(servidores[servidorIndex]);
    await servidor.save();
  }
}

async function obtenerServidoresActivos(servidoresRestantes){
  const servidoresActivos = [];
  for(var servidorIndex in servidoresRestantes){
    const ip = servidoresRestantes[servidorIndex].ip;
    const puerto = servidoresRestantes[servidorIndex].puerto;
    const activo = await fetch("http://" + ip + ":" + puerto + "/servidores/ping")
                        .then(response => {return response.status == 201})
                        .catch(() => false);
    if(activo) servidoresActivos.push(servidoresRestantes[servidorIndex]);
    else console.log("Servidor caido fitlrado: " + ip + ":" + puerto);
  }
  return servidoresActivos;
}

async function notificarNuevoMaestro(servidoresNotificar, servidoresActivos){
  for(var servidorIndex in servidoresNotificar){
    const ip = servidoresNotificar[servidorIndex].ip;
    const puerto = servidoresNotificar[servidorIndex].puerto;
    await fetch("http://" + ip + ":" + puerto + "/servidores/coordinar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(servidoresActivos),
    }).catch(() => console.log("Servidor caido durante reorganizacion: " + ip + ":" + puerto));
  }
}