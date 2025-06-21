import { Loader2 } from "lucide-react";

export const Loader = ({ message = "Ładowanie..." }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-muted-foreground  duration-300">
      <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
      <p className="text-sm font-medium tracking-wide">{message}</p>
    </div>
  );
};
