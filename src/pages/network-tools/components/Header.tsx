import { Network } from "lucide-react";

const Header = () => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Network className="w-6 h-6 text-foreground" />
      <h1 className="text-[22px]  font-semibold tracking-tight">Narzędzia sieciowe</h1>
    </div>
  );
};

export default Header;
