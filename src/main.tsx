import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// @ts-ignore
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import { Auth } from "./components/Auth";
import { RegisterView } from "./components/RegisterView"; // Import nowego rejestratora
import { Regulamin } from "./Regulamin";
import "./index.css";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/regulamin" element={<Regulamin />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
