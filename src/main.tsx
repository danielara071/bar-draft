import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { SessionProvider } from "./shared/context/SessionContext";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <SessionProvider>
        <App />
      </SessionProvider>
    </StrictMode>
  </BrowserRouter>,
);
