import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { MissionProvider } from "./context/MissionContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MissionProvider>
          <TooltipProvider>
            <Toaster />
            <App />
          </TooltipProvider>
        </MissionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
