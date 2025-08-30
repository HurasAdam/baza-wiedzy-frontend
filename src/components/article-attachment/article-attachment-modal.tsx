import { zodResolver } from "@hookform/resolvers/zod";
import { File as FileIcon, FileText, Image as ImageIcon, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import queryClient from "../../config/query.client";
import { useUploadArticleAttachmentMutation } from "../../hooks/attachments/use-article-attachments";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const DEFAULT_MAX_MB = 15;
const ACCEPTED_MIMES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const fileSchema = z.custom<File>((val) => val instanceof File, { message: "Nieprawidłowy plik" });

const attachmentSchema = z.object({
  title: z.string().trim().max(120, "Maks. 120 znaków").optional(),
  note: z.string().trim().max(1000, "Maks. 1000 znaków").optional(),
  files: z.array(fileSchema).min(1, "Dodaj przynajmniej jeden plik"),
});

type AttachmentForm = z.infer<typeof attachmentSchema>;

export interface ArticleAttachmentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  articleId: string;
  onUploaded?: () => void;
  maxSizeMB?: number;
  acceptedMimes?: string[];
}

export const ArticleAttachmentModal = ({
  isOpen,
  onOpenChange,
  articleId,
  onUploaded,
  maxSizeMB = DEFAULT_MAX_MB,
  acceptedMimes = ACCEPTED_MIMES,
}: ArticleAttachmentModalProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { mutate: uploadArticleAttachmentMutate } = useUploadArticleAttachmentMutation();

  const form = useForm<AttachmentForm>({
    resolver: zodResolver(attachmentSchema),
    defaultValues: { title: "", note: "", files: [] },
    mode: "onChange",
  });

  const humanAccept = ".pdf, .png, .jpg, .jpeg, .webp, .txt, .docx, .pptx";

  const onFilesPicked = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0]; // tylko pierwszy plik
    const tooBig = f.size > maxSizeMB * 1024 * 1024;
    const typeOk = acceptedMimes.includes(f.type);

    if (tooBig || !typeOk) {
      toast.error(
        `Plik odrzucony: ${f.name} ${tooBig ? `(>${maxSizeMB} MB)` : ""} ${!typeOk ? "(niedozwolony typ)" : ""}`
      );
      return;
    }

    form.setValue("files", [f], { shouldValidate: true, shouldDirty: true });
  };

  const removeFile = () => {
    form.setValue("files", [], { shouldValidate: true, shouldDirty: true });
  };

  const iconFor = (f: File) => {
    if (f.type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
    if (f.type === "application/pdf") return <FileText className="w-4 h-4" />;
    return <FileIcon className="w-4 h-4" />;
  };

  const onSubmit = async (values: AttachmentForm) => {
    if (!values.files[0]) return toast.error("Dodaj plik");

    try {
      setIsUploading(true);
      setUploadProgress(5);

      const formData = new FormData();
      formData.append("articleId", articleId);
      values.title && formData.append("title", values.title);
      values.note && formData.append("note", values.note);
      formData.append("file", values.files[0]); // tylko jeden plik

      for (let p = 5; p <= 95; p += 10) {
        await new Promise((r) => setTimeout(r, 60));
        setUploadProgress(p);
      }

      uploadArticleAttachmentMutate(
        { articleId, formData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["articles-attachments", articleId] });
          },
        }
      );

      setUploadProgress(100);
      toast.success("Załącznik dodany 🎉");
      form.reset({ title: "", note: "", files: [] });
      onOpenChange(false);
      onUploaded?.();
    } catch (e) {
      console.error(e);
      toast.error("Nie udało się dodać załącznika. Spróbuj ponownie.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 300);
    }
  };

  const close = () => onOpenChange(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[680px] scrollbar-custom">
        <DialogHeader className="mb-3">
          <DialogTitle>Dodaj załącznik do Artykułu</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł (opcjonalnie)</FormLabel>
                  <Input placeholder="Np. Wzór pisma" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notatka dla zespołu (opcjonalnie)</FormLabel>
                  <Textarea rows={3} placeholder="Krótki opis zawartości pliku…" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="files"
              render={() => (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    onFilesPicked(e.dataTransfer.files);
                  }}
                  className="border border-dashed rounded-2xl p-6 text-center bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="mt-3 text-sm font-medium">Przeciągnij i upuść plik tutaj</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    lub{" "}
                    <button type="button" className="mx-1 underline" onClick={() => inputRef.current?.click()}>
                      wybierz z dysku
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Dozwolone: {humanAccept}. Maks: {maxSizeMB} MB.
                  </div>

                  <input
                    ref={inputRef}
                    type="file"
                    multiple={false} // TYLKO JEDEN PLIK
                    accept={acceptedMimes.join(",")}
                    className="hidden"
                    onChange={(e) => onFilesPicked(e.target.files)}
                  />

                  {form.watch("files")?.length ? (
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-background px-3 py-2 border">
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-muted p-2">{iconFor(form.watch("files")[0])}</div>
                        <div>
                          <div className="text-sm font-medium max-w-[300px] truncate">
                            {form.watch("files")[0].name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {(form.watch("files")[0].size / 1024 / 1024).toFixed(2)} MB •{" "}
                            {form.watch("files")[0].type || "nieznany typ"}
                          </div>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={removeFile}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : null}

                  <FormMessage className="mt-2" />
                </div>
              )}
            />

            {isUploading && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Wgrywanie…</span>
                <Badge variant="outline" className="text-xs">
                  {uploadProgress}%
                </Badge>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={close} disabled={isUploading}>
                Anuluj
              </Button>
              <Button type="submit" disabled={isUploading || !form.formState.isValid}>
                Zapisz załącznik
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
