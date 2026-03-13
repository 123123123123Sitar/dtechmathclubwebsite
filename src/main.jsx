import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { DpotdAuthProvider } from "./context/DpotdAuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DpotdAuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DpotdAuthProvider>
  </React.StrictMode>,
);
