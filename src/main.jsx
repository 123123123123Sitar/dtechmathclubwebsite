import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { DpotdAuthProvider } from "./context/DpotdAuthContext";
import "./index.css";
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DpotdAuthProvider>
      <BrowserRouter>
        <App />
        <Analytics />
      </BrowserRouter>
    </DpotdAuthProvider>
  </React.StrictMode>,
);
