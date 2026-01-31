import { Copy, Eye, EyeOff, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

interface WorkspaceInviteLinkSectionProps {
  inviteCode?: string;
}

const WorkspaceInviteLinkSection = ({ inviteCode }: WorkspaceInviteLinkSectionProps) => {
  const [showCode, setShowCode] = useState(false);

  const onCopyInviteCode = (inviteCode: string) => {
    navigator.clipboard.writeText(inviteCode);
    toast.info("Kod zaproszenia został skopiowany do schowka", {
      position: "bottom-right",
    });
  };

  if (!inviteCode) {
    return (
      <Card className="w-full  mx-auto border border-muted-foreground/20 bg-gradient-to-r from-muted/5 via-muted/10 to-muted/5 shadow-md rounded-xl animate-fade-in">
        <CardHeader className="flex items-center gap-3 pb-2">
          <div className="bg-muted/10 p-2 rounded-full">
            <Info className="w-6 h-6 text-primary/70 animate-bounce-slow" />
          </div>
          <CardTitle className="text-lg font-semibold text-gray-700">Kod zaproszenia niedostępny</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm text-gray-500 leading-relaxed">
            Tylko właściciel tej kolekcji może zobaczyć i udostępnić kod zaproszenia. ✨
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full  mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Kod zaproszenia</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Udostępnij ten kod, aby inni mogli dołączyć do kolekcji.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Input type={showCode ? "text" : "password"} readOnly value={inviteCode} className="flex-1" />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowCode(!showCode)}
          title={showCode ? "Ukryj kod" : "Pokaż kod"}
        >
          {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={() => onCopyInviteCode(inviteCode)} title="Skopiuj kod">
          <Copy className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkspaceInviteLinkSection;
