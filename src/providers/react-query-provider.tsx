import queryClient from "@/config/query.client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "../components/ui/tooltip";
import { SoundProvider } from "./sound-provider";
import { ThemeProvider } from "./theme-provider";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SoundProvider>
          <TooltipProvider delayDuration={300}>
            <Toaster position="top-center" richColors={true} />

            {children}
          </TooltipProvider>
        </SoundProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
