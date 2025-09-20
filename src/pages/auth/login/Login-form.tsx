import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/validation/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Origami } from "lucide-react";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import type z from "zod";

interface LoginFormProps {
  onSubmit: (values: LoginFormData) => void;
  isLoading: boolean;
}

export type LoginFormData = z.infer<typeof loginSchema>;
const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="minh-screen flex flex-col items-center bg-card/5 rounded-xl p-4">
      <Card className="max-w-md  min-w-md w-full shadow-xl">
        <CardHeader className="text-center">
          <Origami className="mx-auto w-9 h-9 text-sidebar-logo/70" />
          <CardTitle className="text-2xl font-bold text-foreground">Baza Wiedzy</CardTitle>

          <CardDescription className="text-sm text-muted-foreground mt-1.5">
            Wprowadź swoje dane, aby uzyskać dostęp do bazy wiedzy i szablonów odpowiedzi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* ----- EMAIL ----- */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <FormControl>
                      <Input className="border-ring" {...field} placeholder="jan.nowak@librus.pl" type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ----- PASSWORD ----- */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-foreground">Hasło</FormLabel>
                      {/* <Link
                        to="/auth/forgot-password"
                        className="text-xs text-muted-foreground hover:text-secondary-foreground"
                      >
                        Przypomnij hasło
                      </Link> */}
                    </div>
                    <FormControl>
                      <Input
                        className="text-foreground border-ring"
                        {...field}
                        placeholder="********"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full cursor-pointer">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    Logowanie
                    <Loader2 className="animate-spin" />
                  </span>
                ) : (
                  "Zaloguj"
                )}
              </Button>
            </form>
          </Form>
          <CardFooter className="flex items-center justify-center mt-5">
            <div className="flex items-center justify-end w-full">
              <Link
                to="/auth/forgot-password"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-secondary-foreground transition-colors"
              >
                <KeyRound size={14} className="text-muted-foreground" />
                <span>Przypomnij hasło</span>
              </Link>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
