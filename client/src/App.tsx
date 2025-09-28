import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ToastProvider";
import MarkdownConverter from "@/components/MarkdownConverter";

function App() {
  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastProvider>
          <MarkdownConverter />
        </ToastProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
