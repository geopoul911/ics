// Built-ins
import React from "react";
import ReactDOM from "react-dom";

// Modules / Functions
import SimpleReactLightbox from "simple-react-lightbox";

// CSS
import "./index.css";
import "semantic-ui-css/semantic.min.css";

// Custom Made Components
import App from "./App";

// Main
ReactDOM.render(
  <SimpleReactLightbox>
    <App />
  </SimpleReactLightbox>,
  document.getElementById("root")
);
