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
var esMaestro = false;

conectarBaseDeDatos(ipServidor, puertoServidor);
Servidor.deleteMany({}, function(err) { 
  console.log('collection removed') 
});
if(ipMaestro == undefined && puertoMaestro == undefined){
  iniciarMaestro(ipServidor, puertoServidor, prioridadServidor);
  esMaestro = true;
}
else{
  conectarMaestro(ipServidor, puertoServidor, ipMaestro, puertoMaestro, prioridadServidor);
}

console.log(ipServidor);
console.log(puertoServidor);
console.log(parseInt(puertoServidor));
console.log(prioridadServidor);
console.log(ipMaestro);
console.log(puertoMaestro);

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
  try {
    fetch("http://" + ipMaestro + ":" + puertoMaestro + "/servidores?ip=" + ipServidor + "&puerto=" + puertoServidor + "&prioridad=" + prioridadServidor).then(response => response.json()).then(async datosServidores => {
      for(var datosServidorIndex in datosServidores){
        const servidor = new Servidor(datosServidores[datosServidorIndex]);
        await servidor.save();
      } 
    });
  } catch (error) {
    console.log("Error conectando al maestro, suicidandome");
    exit();
  }
}