import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

import type { AxiosError } from "axios";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useCreateTopicMutation } from "../../hooks/topics/use-topics";
import type { IProduct } from "../../types/product";
import { topicSchema } from "../../validation/topic.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CreateWorkspaceProps {
  isCreatingTopic: boolean;
  setIsCreatingTopic: (isCreatingWorkspace: boolean) => void;
  closeOnOutsideClick?: boolean;
  products: IProduct[];
}

// Define 8 predefined colors
export const colorOptions = [
  "#FF5733", // Red-Orange
  "#33C1FF", // Blue
  "#28A745", // Green
  "#FFC300", // Yellow
  "#8E44AD", // Purple
  "#E67E22", // Orange
  "#2ECC71", // Light Green
  "#34495E", // Navy
];

export type topicForm = z.infer<typeof topicSchema>;

export const TopicModal = ({
  isCreatingTopic,
  setIsCreatingTopic,
  closeOnOutsideClick = false,
  products,
}: CreateWorkspaceProps) => {
  const form = useForm<topicForm>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: "",
      product: "",
    },
  });

  const { mutate } = useCreateTopicMutation();

  const onSubmit = (data: topicForm) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        setIsCreatingTopic(false);
        toast.success("Temat rozmowy został dodany");
        queryClient.invalidateQueries({ queryKey: ["topics"] });
      },
      onError: (error) => {
        const { status } = error as AxiosError;

        if (status === 409) {
          toast.error(
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontFamily: "Inter, sans-serif",
                color: "#991b1b",
                fontSize: "14px",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>
                  Błąd: Duplikat tematu
                </div>
                <div style={{ opacity: 0.8 }}>
                  Dla wybranego produtku istnieje już temat rozmowy o tej
                  nazwie.
                </div>
              </div>
            </div>,
            { duration: 7000 }
          );
          return;
        }
        toast.error("Wystapił błąd, spróbuj ponownie");
      },
    });
  };

  return (
    <Dialog
      open={isCreatingTopic}
      onOpenChange={setIsCreatingTopic}
      modal={true}
    >
      <DialogContent
        {...(!closeOnOutsideClick
          ? { onInteractOutside: (e) => e.preventDefault() }
          : {})}
        className="max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Utwórz temat rozmowy</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produkt</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-- Wybierz produkt --" />
                        </SelectTrigger>
                        <SelectContent side="bottom">
                          {products?.map((product) => (
                            <SelectItem key={product?._id} value={product?._id}>
                              {product?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nazwa tematu" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button className="cursor-pointer" type="submit">
                Utwórz
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
