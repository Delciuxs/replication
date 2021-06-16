import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ServerProvider from "./provider/ServerProvider";

ReactDOM.render(
  <React.StrictMode>
    <ServerProvider>
      <App />
    </ServerProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
