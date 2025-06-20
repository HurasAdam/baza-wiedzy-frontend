import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";

import queryClient from "@/config/query.client";
import { ThemeProvider } from "./theme-provider";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster position="top-center" richColors={true} />

        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
