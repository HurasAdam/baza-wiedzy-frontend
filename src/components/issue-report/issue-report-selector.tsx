import { Bug, Lightbulb } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const IssueReportSelector = ({
  onSelect,
}: {
  onSelect: (type: "bug" | "proposal") => void;
}) => (
  <div className="flex flex-col items-center justify-center h-full p-12 bg-background">
    <h2 className="text-3xl font-bold text-muted-foreground mb-12 tracking-tight">
      Wybierz rodzaj zgłoszenia
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 h-full w-full">
      {/* Kafelek zgłoszenia błędu */}
      <Card
        onClick={() => onSelect("bug")}
        className="group relative cursor-pointer bg-background backdrop-blur-md rounded-2xl 
        shadow-md transition-transform duration-300 transform overflow-hidden hover:shadow-lg hover:scale-[1.03] ring-1 ring-transparent group-hover:ring-rose-300"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-red-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10 flex flex-col items-center text-center p-8">
          <div className="p-4 bg-rose-300/10 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110">
            <Bug
              size={44}
              className="text-rose-600 transition-colors duration-300 group-hover:text-rose-700"
            />
          </div>
          <CardContent className="space-y-6 relative z-10">
            <h3 className="text-xl font-semibold text-foreground">
              Zgłoś błąd
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Aby ułatwić nam rozwiązanie problemu, podaj:
            </p>
            <div className="rounded-lg p-4 space-y-3 mt-2">
              {[
                "Kroki prowadzące do błędu",
                "Oczekiwane zachowanie",
                "Aktualny rezultat",
                "Zrzut ekranu (opcjonalnie)",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <svg
                    className="text-rose-500 w-4 h-4 mt-0.5 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-4 border-rose-500/25 text-rose-500 hover:bg-transparent"
            >
              Prześlij zgłoszenie
            </Button>
          </CardContent>
        </div>
      </Card>

      {/* Kafelek zgłoszenia propozycji */}
      <Card
        onClick={() => onSelect("proposal")}
        className="group relative cursor-pointer bg-background backdrop-blur-md rounded-2xl 
        shadow-md transition-transform duration-300 transform overflow-hidden hover:shadow-lg hover:scale-[1.03] ring-1 ring-transparent group-hover:ring-amber-300"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-amber-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10 flex flex-col items-center text-center p-8">
          <div className="p-4 bg-amber-300/10 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110">
            <Lightbulb
              size={44}
              className="text-amber-600 transition-colors duration-300 group-hover:text-amber-700"
            />
          </div>
          <CardContent className="space-y-6 relative z-10">
            <h3 className="text-xl font-semibold text-foreground">
              Zgłoś propozycję
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Chcesz zaproponować nowe rozwiązanie? Opisz:
            </p>
            <div className=" rounded-lg p-4 space-y-3 mt-2">
              {[
                "Opis funkcji lub usprawnienia",
                "Korzyści dla użytkowników",
                "Przykład zastosowania (opcjonalnie)",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <svg
                    className="text-amber-500 w-4 h-4 mt-0.5 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-4 border-amber-500/25 text-amber-500"
            >
              Prześlij pomysł
            </Button>
          </CardContent>
        </div>
      </Card>
    </div>
  </div>
);

export default IssueReportSelector;
