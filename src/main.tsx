import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "rsuite/dist/rsuite.min.css";
import Home from "./pages/Home/Home.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
