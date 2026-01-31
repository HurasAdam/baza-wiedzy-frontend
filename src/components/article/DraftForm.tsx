"use client";

import { useState } from "react";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/lib/utils";

const paymentMethod = [
  { value: "1", label: "Credit Card" },
  { value: "2", label: "PayPal" },
  { value: "3", label: "Apple Pay" },
  { value: "4", label: "Google Pay" },
  { value: "5", label: "Bank Transfer" },
  { value: "6", label: "Bitcoin" },
  { value: "7", label: "Cash on Delivery" },
];

const FormSchema = z.object({
  method: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    {
      required_error: "Payment method is required.",
    },
  ),
});

const DraftForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  function onSubmit() {
    toast.success("OK");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => {
            console.log("field", field);
            return (
              <FormItem>
                <FormLabel>Select your payment method</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full max-w-xs justify-between"
                        aria-label="Payment method combobox"
                      >
                        {field.value ? (
                          paymentMethod.find((method) => method.label === field.value.label)?.label
                        ) : (
                          <span className="text-muted-foreground">Select a payment method...</span>
                        )}
                        <ChevronsUpDownIcon className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
                    <Command>
                      <CommandInput placeholder="Search payment method..." />
                      <CommandList>
                        <CommandEmpty>No payment method found.</CommandEmpty>
                        <CommandGroup>
                          {paymentMethod.map((method) => (
                            <CommandItem
                              key={method.value}
                              value={method.label}
                              onSelect={() => {
                                setValue(method.value);
                                field.onChange(method);
                                setOpen(false);
                              }}
                            >
                              {method.label}
                              <CheckIcon
                                className={cn("ml-auto", value === method.value ? "opacity-100" : "opacity-0")}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>Select your preferred payment method.</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type="submit">Continue</Button>
      </form>
    </Form>
  );
};

export default DraftForm;
