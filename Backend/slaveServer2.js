const express = require("express");
var cors = require('cors');
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost/calificaciones3", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Slave2 database connected"));

const calificacionesSlaveRouter = require("./routes/calificacionesSlaveRoutes");
app.use("/calificaciones", calificacionesSlaveRouter);

app.listen(3003, () => {
  console.log("Slave2 Server started on port 3003");
});
