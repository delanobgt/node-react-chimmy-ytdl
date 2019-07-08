import React from "react";
import ReactDOM from "react-dom";
import HttpsRedirect from "react-https-redirect";
import "./index.css";
import App from "./Components/App";

ReactDOM.render(
  <HttpsRedirect>
    <App />
  </HttpsRedirect>,
  document.getElementById("root")
);
