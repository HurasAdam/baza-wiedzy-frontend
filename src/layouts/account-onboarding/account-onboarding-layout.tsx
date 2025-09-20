// layouts/onboarding/onboarding.layout.tsx
import { Origami } from "lucide-react";
import { Outlet } from "react-router-dom";

const AccountOnboardingLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center bg-gradient-to-br from-primary/10 via-background to-background p-12">
        <div className="max-w-md mx-auto text-center">
          {/* Logo / Icon */}
          <div className="mb-6 text-primary">
            <Origami className="mx-auto w-12 h-12 text-sidebar-logo/65 " />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-primary">Witaj w Bazie Wiedzy</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Zanim zaczniesz, skonfiguruj swoje konto, aby w pełni korzystać z zasobów.
          </p>
        </div>
      </div>

      {/* Right Side*/}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-lg">
          {/* Header for mobile */}
          <div className="mb-6 text-center lg:hidden">
            <h1 className="text-2xl font-bold text-primary">Witaj!</h1>
            <p className="text-muted-foreground text-sm">Skonfiguruj swoje konto w kilku krokach</p>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountOnboardingLayout;
