import { Origami } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useAuthQuery } from "../../hooks/auth/use-auth";

const AccountOnboardingLayout = () => {
  const { data: authData } = useAuthQuery();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background">
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-16 relative">
        <div className="absolute inset-0 bg-background/10 rounded-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-md text-center">
          {/* Logo */}
          <div className="mb-10 text-primary">
            <Origami className="mx-auto w-24 h-24 text-primary/80" />
          </div>

          <h1 className="text-6xl font-extrabold mb-4 text-foreground leading-tight">Baza Wiedzy</h1>

          {authData && <p className="text-foreground text-xl font-semibold mb-4">Witaj, {authData.name}!</p>}

          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mt-4">
            Baza Wiedzy usprawnia codzienną pracę, umożliwiając szybkie znalezienie potrzebnych informacji i procedur w
            jednym miejscu, w prosty i przejrzysty sposób.
          </p>

          <p className="text-muted-foreground text-base mt-6">
            Zacznij od konfiguracji swojego konta, aby w pełni korzystać z funkcji aplikacji.
          </p>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8">
        <div className="w-full max-w-lg">
          {/* Mobile header */}
          <div className="mb-8 text-center lg:hidden">
            <h1 className="text-4xl font-bold text-foreground mb-2">Witaj!</h1>
            <p className="text-muted-foreground text-base">Skonfiguruj swoje konto w kilku krokach</p>
          </div>

          {/* Onboarding steps */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountOnboardingLayout;
