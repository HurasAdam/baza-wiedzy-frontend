import queryClient from "@/config/query.client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "../components/ui/tooltip";
import { SocketProvider } from "./socket-provider";
import { SoundProvider } from "./sound-provider";
import { ThemeProvider } from "./theme-provider";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SoundProvider>
        <SocketProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TooltipProvider delayDuration={300}>
              <Toaster position="top-center" richColors={true} />

              {children}
            </TooltipProvider>
          </ThemeProvider>
        </SocketProvider>
      </SoundProvider>
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
