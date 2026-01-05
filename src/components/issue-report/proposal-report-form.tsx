import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Loader, Paperclip } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "../shared/fileUploader";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const validCategories = ["Interfejs (UI)", "Backend", "Wydajność", "Inne"] as const;

interface Props {
  onSend: (formData: any) => void;
  isLoading?: boolean;
}

const ProposalReportForm = ({ onSend, isLoading }: Props) => {
  const allowedFormats = ["image/svg+xml", "image/png", "image/jpeg", "image/gif"];
  const fileSchema = z
    .instanceof(File)
    .refine((file) => file.size <= 1024 * 1024 * 4, { message: "Maksymalny rozmiar pliku to 4 MB." })
    .refine((file) => allowedFormats.includes(file.type), {
      message: "Obsługiwane formaty plików: SVG, PNG, JPG, GIF.",
    });

  const dropZoneConfig = { maxFiles: 5, maxSize: 1024 * 1024 * 4, multiple: true };

  const formSchema = z.object({
    type: z.literal("proposal"),
    title: z.string().trim().min(3).max(120),
    category: z.enum(validCategories),
    currentBehavior: z.string().trim().min(6).max(9000),
    expectedBehavior: z.string().trim().min(6).max(9000).optional(),
    file: z.array(fileSchema).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "proposal",
      title: "",
      category: validCategories[0],
      currentBehavior: "",
      expectedBehavior: "",
      file: [],
    },
  });

  const [files, setFiles] = useState<File[]>([]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      onSend(values);
    } catch (err) {
      toast.error("Nie udało się wysłać zgłoszenia");
      console.error(err);
    }
  };

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span>
      {children} <span className="text-primary ml-0.5">*</span>
    </span>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 mx-auto rounded-xl px-6.5 pt-3 bg-background shadow-sm"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel>Tytuł propozycji</RequiredLabel>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Np. Dodanie filtra zadań" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategoria</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {validCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentBehavior"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel>Opis propozycji</RequiredLabel>
              </FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Opisz propozycję" className="min-h-[120px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expectedBehavior"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Przewidywana korzyść (opcjonalnie)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Co zyska użytkownik po wdrożeniu?" className="min-h-[80px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Dodaj załącznik <span className="text-foreground/65 text-xs">(Opcjonalnie)</span>
              </FormLabel>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={setFiles}
                  dropzoneOptions={dropZoneConfig}
                  className="rounded-lg border p-2"
                >
                  <FileInput id="fileInput">
                    <div className="flex flex-col items-center justify-center p-6 w-full">
                      <CloudUpload className="w-8 h-8 text-gray-500" />
                      <p className="text-xs text-gray-500">Kliknij lub przeciągnij plik tutaj (SVG, PNG, JPG, GIF)</p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {files.map((f, i) => (
                      <FileUploaderItem key={i} index={i}>
                        <Paperclip className="h-4 w-4" />
                        <span>{f.name}</span>
                      </FileUploaderItem>
                    ))}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end items-center">
          <Button disabled={isLoading} type="submit" className="px-8 bg-primary/80 hover:bg-primary/90">
            {isLoading && <Loader className="animate-spin mr-2" />} Wyślij propozycję
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProposalReportForm;
