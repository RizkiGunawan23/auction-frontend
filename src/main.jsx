import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import {
  PrimeReactProvider,
  PrimeReactContext,
  PrimeIcons,
} from "primereact/api";
import "./index.css";
import "./flags.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeflex/primeflex.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
