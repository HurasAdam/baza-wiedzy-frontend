import { Copy } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

const WorkspaceInviteLinkSection = ({ inviteCode }: { inviteCode: string }) => (
  <Card>
    <CardHeader className="pb-2">
      <h2 className="text-sm font-medium text-muted-foreground">Kod zaproszenia</h2>
    </CardHeader>
    <CardContent className="flex items-center gap-2">
      <Input readOnly value={inviteCode} className="flex-1" />
      <Button variant="outline" size="icon">
        <Copy className="w-4 h-4" />
      </Button>
    </CardContent>
  </Card>
);
export default WorkspaceInviteLinkSection;
