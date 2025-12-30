import {
  Archive,
  ArrowLeft,
  Bell,
  BellOff,
  History,
  Info,
  MoreVertical,
  RefreshCw,
  SquarePen,
  Star,
  StarOff,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { cn } from "../../../../lib/utils";
import { ArticleStatusLabel } from "./ArticleStatusLabel";

export const ArticleMainPageHeader = ({ article, userPermissions, actions }) => {
  const { handleFollowToggle, openExtraInfoModal, handleUnmarkAsImportant, handleMarkAsImportant, refetch } = actions;

  const views = [
    { label: "Dane", path: "", icon: Info },
    { label: "Załączniki", path: "attachments", icon: Archive },
    userPermissions.includes("VIEW_ARTICLE_HISTORY") && { label: "Historia", path: "history", icon: History },
  ].filter(Boolean);

  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className=" w-16 h-16 hover:bg-muted/30 flex  items-center justify-center rounded-lg bg-background"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-8 h-8" />
        </Button>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold max-w-[740px] break-words flex items-start  gap-1.5 text-foreground/95">
            {/* {article.isImportant && <Star className="w-4 h-4 mt-1.5 text-amber-500/65 shrink-0" />} */}
            {article.title}
          </h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              Status: <ArticleStatusLabel status={article.status} isVisible={article.isVisible} />
            </span>
            • <span>Produkt: {article.product.name}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <NavLink
                key={view.path}
                to={view.path}
                end={view.path === ""}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all",
                    "text-muted-foreground hover:text-foreground",
                    isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50"
                  )
                }
              >
                <Icon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{view.label}</span>
              </NavLink>
            );
          })}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuItem onClick={() => handleFollowToggle(article._id, article.isFollowed)}>
              {article.isFollowed ? <BellOff className="mr-1.5" /> : <Bell className="mr-1.5" />}
              {article.isFollowed ? "Przestań obserwować" : "Obserwuj"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openExtraInfoModal}>
              <Info className="w-4 h-4 mr-1.5" /> Informacje
            </DropdownMenuItem>
            {userPermissions.includes("EDIT_ARTICLE") && (
              <DropdownMenuItem asChild>
                <NavLink to={`/articles/v2/${article._id}/edit`}>
                  <div className="flex items-center gap-2">
                    <SquarePen className="w-4 h-4 mr-1.5" /> Edytuj
                  </div>
                </NavLink>
              </DropdownMenuItem>
            )}
            {userPermissions.includes("ARCHIVE_ARTICLE") && (
              <DropdownMenuItem onClick={() => console.log("Archiwizuj")}>
                <Archive className="w-4 h-4 mr-2" /> Archiwizuj
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={refetch}>
              <RefreshCw className="w-4 h-4 mr-1.5" /> Odśwież
            </DropdownMenuItem>
            {article.isImportant ? (
              <DropdownMenuItem onClick={() => handleUnmarkAsImportant(article._id)}>
                <StarOff className="w-4 h-4 mr-2 text-destructive" /> Usuń priorytet
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleMarkAsImportant(article._id)}>
                <Star className="w-4 h-4 mr-2 text-primary" /> Oznacz jako priorytetowy
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
