const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost/calificaciones1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Master database connected"));

const calificacionesMasterRouter = require("./routes/calificacionesMasterRoutes");
app.use("/calificaciones", calificacionesMasterRouter);

app.listen(3001, () => {
  console.log("Master Server started on port 3001");
});
