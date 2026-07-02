import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app";
import EditModeProvider from "./edit-mode-provider";
import "./styles.css";
import { ThemeProvider } from "./theme/theme-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <EditModeProvider>
        <App />
      </EditModeProvider>
    </ThemeProvider>
  </StrictMode>,
);
