import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Link as LinkIcon, Plus, Search, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { EditPinnedLinkModal } from "../../components/pinned-link/edit-pinned-link.modal";
import { PinnedLinkModal } from "../../components/pinned-link/pinned-link.modal";
import { Alert } from "../../components/shared/alert-modal";
import queryClient from "../../config/query.client";
import * as animation from "../../constants/animations";
import { useDeletePinnedLinkMutation, useFindUserPinnedLinksQuery } from "../../hooks/pinned-links/use-pinned-links";
import type { AuthUserData } from "../../types/user";

function normalizeUrl(url: string) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

export function DashboardPinnedLinksPage() {
  const navigate = useNavigate();
  const [isCreatePinnedLinkModalOpen, setIsCreatePinnedLinkModalOpen] = useState<boolean>(false);
  const { userData } = useOutletContext<{ onOpenCreateIssueReport: () => void; userData: AuthUserData }>();
  const { data: pinnedLinks = [] } = useFindUserPinnedLinksQuery(userData._id);

  const { mutate: deletePinnedLinkMutation, isPending: isDeleting } = useDeletePinnedLinkMutation();

  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  const [editedLinkId, setEditedLinkId] = useState<string | null>(null);

  const onDeletePinnedLinkRequest = (id: string) => setDeletingLinkId(id);
  const onDeletePinnedLinkCancel = () => setDeletingLinkId(null);

  const onDeletePinnedLinkConfirm = () => {
    if (!deletingLinkId) return;
    deletePinnedLinkMutation(deletingLinkId, {
      onSuccess: () => {
        toast.success("Zmiany zostały zapisane", {
          position: "bottom-right",
          description: "Link został usunięty",
        });
        setDeletingLinkId(null);
        queryClient.invalidateQueries({ queryKey: ["pinned-links", userData._id] });
      },
    });
  };

  const onEditPinnedLinkRequest = (id: string) => {
    setEditedLinkId(id);
  };

  const [search, setSearch] = useState("");

  const filteredLinks = useMemo(
    () => pinnedLinks.filter((link) => `${link.name} ${link.url}`.toLowerCase().includes(search.toLowerCase())),
    [search, pinnedLinks],
  );

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-background p-6"
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Strzałka wstecz */}
            <Button
              variant="outline"
              className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-muted/30 bg-background"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>

            {/* Tytuł i opis */}
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold text-foreground/95 break-words">Moje przypięte linki</h1>
              <p className="text-sm text-muted-foreground">Zarządzaj przypiętymi linkami na tablicy</p>
            </div>
          </div>

          {/* Przycisk dodawania linku */}
          <Button onClick={() => setIsCreatePinnedLinkModalOpen(true)} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Dodaj link
          </Button>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj linków..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl h-9"
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
          {filteredLinks.length === 0 && (
            <div className="col-span-full text-sm text-muted-foreground py-10 text-center border rounded-xl">
              Brak linków
            </div>
          )}

          {filteredLinks.map((link) => (
            <Card
              key={link._id}
              className="relative rounded-2xl border bg-card hover:shadow-lg transition-all duration-200 group"
            >
              {/* Kropka dla wyróżnionych */}
              {link.isFeatured && <Star className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full text-primary/90" />}

              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/60 shrink-0">
                    <LinkIcon className="w-5 h-5 text-primary/75" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{link.name}</p>
                    <a
                      href={normalizeUrl(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary truncate flex items-center gap-1"
                    >
                      {link.url}
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                  <Button
                    onClick={() => onEditPinnedLinkRequest(link._id)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onDeletePinnedLinkRequest(link._id)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <PinnedLinkModal
        isOpen={isCreatePinnedLinkModalOpen}
        setIsOpen={setIsCreatePinnedLinkModalOpen}
        onSave={() => {}}
      />

      {/* Alert do potwierdzenia usunięcia */}
      <Alert
        isOpen={!!deletingLinkId}
        isLoading={isDeleting}
        type="warning"
        title="Usunięcie przypiętego linku"
        onCancel={onDeletePinnedLinkCancel}
        onConfirm={onDeletePinnedLinkConfirm}
        requireConfirmation={true}
        isConfirmEnabled={true}
      >
        <div className="flex flex-col gap-4">
          {deletingLinkId &&
            (() => {
              const link = pinnedLinks.find((l) => l._id === deletingLinkId);
              if (!link) return null;

              return (
                <>
                  <span className="font-semibold text-base text-foreground">
                    Czy na pewno chcesz usunąć przypięty link <span className="italic ">* {link.name} *</span> ?
                  </span>

                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Adres:{" "}
                    <a
                      href={normalizeUrl(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {link.url}
                    </a>
                  </span>

                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Po usunięciu link do zasobu nie będzie już widoczny na Twojej tablicy.
                  </span>
                </>
              );
            })()}
        </div>
      </Alert>

      {editedLinkId && (
        <EditPinnedLinkModal isOpen={!!editedLinkId} setIsOpen={setEditedLinkId} editedLinkId={editedLinkId} />
      )}
    </motion.div>
  );
}
