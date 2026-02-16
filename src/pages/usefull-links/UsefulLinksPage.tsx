import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { BadgePlus, Folder, LinkIcon, Plus, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Alert } from "../../components/shared/alert-modal";
import { LinkCategoryModal } from "../../components/useful-link/link-category.modal";
import { UsefulLinkModal } from "../../components/useful-link/useful-link.modal";
import queryClient from "../../config/query.client";
import * as animation from "../../constants/animations";
import { useDeleteUsefulLinkMutation, useFindUsefulLinksQuery } from "../../hooks/useful-links/use-useful-links";
import { LinkRow } from "./components/LinkRow";

export const UsefulLinksPage = () => {
  const [search, setSearch] = useState("");
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [isCreateLinkFolderModalOpen, setIsCreateLinkFolderModalOpen] = useState(false);
  const { mutate: deleteusefulLinkMutate, isPending: isDeleteUsefulLinkLoading } = useDeleteUsefulLinkMutation();

  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

  const { data: apiLinks } = useFindUsefulLinksQuery();

  const onAddLinkRequest = () => setIsCreateLinkModalOpen(true);
  const onAddFolderRequest = () => setIsCreateLinkFolderModalOpen(true);
  const onDeleteLinkRequest = (linkId: string) => setDeletingLinkId(linkId);

  const onDeleteRequestCancel = () => setDeletingLinkId(null);

  const onDeleteLinkConfirm = () => {
    if (!deletingLinkId) return;
    deleteusefulLinkMutate(deletingLinkId, {
      onSuccess: () => {
        toast.success("Zmiany zostały zapisane", {
          position: "bottom-right",
          description: "Link do zasobu został usunięty",
        });
        onDeleteRequestCancel();
        queryClient.invalidateQueries({ queryKey: ["useful-links"] });
      },
    });
  };

  // --- Przygotowanie danych ---
  const links = useMemo(() => {
    if (!apiLinks) return [];
    return apiLinks.map((link) => ({
      ...link,
      categoryName: link.linkCategory?.name || "Bez kategorii",
    }));
  }, [apiLinks]);

  const filtered = useMemo(() => {
    return links.filter(
      (l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.url.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, links]);

  const categories = useMemo(() => Array.from(new Set(filtered.map((l) => l.categoryName))), [filtered]);

  const featuredLinks = filtered.filter((l) => l.isFeatured);

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="flex flex-col h-full w-full py-6 px-10 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Przydatne linki</h1>
          <p className="text-sm text-muted-foreground">Szybki dostęp do dokumentów i plików</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Dodaj
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onAddLinkRequest} className="gap-2">
              <LinkIcon className="w-4 h-4" />
              Dodaj link
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onAddFolderRequest} className="gap-2">
              <BadgePlus className="w-4 h-4" />
              Dodaj kategorię
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Wyszukaj plik..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-8">
        {/* Wyróżnione */}
        {featuredLinks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-500" />
              <h2 className="font-semibold">Wyróżnione</h2>
            </div>

            <div className="space-y-2">
              {featuredLinks.map((link) => (
                <LinkRow key={link._id} link={link} />
              ))}
            </div>
          </section>
        )}

        {/* Kategorie */}
        {categories.map((cat) => (
          <section key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <Folder className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold">{cat}</h2>
            </div>

            <div className="space-y-2">
              {filtered
                .filter((l) => l.categoryName === cat)
                .map((link) => (
                  <LinkRow key={link._id} link={link} onDelete={onDeleteLinkRequest} />
                ))}
            </div>
          </section>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground py-20">Brak wyników dla podanej frazy</div>
        )}
      </div>

      {/* Modals */}
      {isCreateLinkModalOpen && (
        <UsefulLinkModal isOpen={isCreateLinkModalOpen} setIsOpen={setIsCreateLinkModalOpen} onSave={() => {}} />
      )}

      <LinkCategoryModal isOpen={isCreateLinkFolderModalOpen} setIsOpen={setIsCreateLinkFolderModalOpen} />

      <Alert
        isOpen={!!deletingLinkId} // true, jeśli ID istnieje
        isLoading={isDeleteUsefulLinkLoading}
        type="warning"
        title="Usunięcie linku do zasobu"
        onCancel={onDeleteRequestCancel}
        onConfirm={onDeleteLinkConfirm}
        requireConfirmation={true}
        isConfirmEnabled={true}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-base text-foreground">Czy na pewno chcesz usunąć ten link?</span>
            <span className="text-sm text-muted-foreground leading-relaxed">
              Link do zasobu:{" "}
              <a
                href={`${links.find((l) => l._id === deletingLinkId)?.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {links.find((l) => l._id === deletingLinkId)?.url}
              </a>
            </span>
          </div>

          <div className="flex items-start gap-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground font-medium leading-snug">
              Operacja jest nieodwracalna. Upewnij się, że chcesz trwale usunąć ten link.
            </span>
          </div>
        </div>
      </Alert>
    </motion.div>
  );
};
