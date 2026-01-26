import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ICONS } from "../../../constants/faq-icons";
import { useFindFaqQuery } from "../../../hooks/faq/use-faq";
import ProductTabCard from "../admin-product-details/components/ProductTabCard";
import { FaqDetailtsTab } from "./components/FaqDetailtsTab";
import { FaqQuestionsAndAnswersTab } from "./components/FaqQuestionsAndAnswersTab";

export const AdminFaqDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: faq, isLoading: isProductLoading } = useFindFaqQuery(id!);

  const [activeTab, setActiveTab] = useState<"details" | "questionsAndAnswers" | "topics">("details");

  const tabs: { key: "details" | "questionsAndAnswers" | "topics"; label: string }[] = [
    { key: "details", label: "Szczegóły" },
    { key: "questionsAndAnswers", label: "Pytania i odpowiedzi" },
  ];

  if (isProductLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="w-full h-full flex justify-center items-center text-muted-foreground">
        Produkt nie został znaleziony.
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-1 space-y-6 pb-10">
      <div className="sticky top-0 z-20 bg-background border-b">
        {/* Back button */}
        <div className="px-2 pt-0">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-2 py-1 rounded-md transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Powrót</span>
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 gap-4">
          <div className="flex items-center gap-3">
            <div
              className=" w-10 h-10 rounded-md border flex justify-center items-center"
              style={{ backgroundColor: faq.labelColor }}
            >
              {(() => {
                const Icon = ICONS[faq.iconKey] || ICONS.HelpCircle; // fallback, jeśli brak ikony
                return <Icon className="w-5 h-5 text-white" />;
              })()}
            </div>
            <h1 className="text-2xl font-bold">{faq.title}</h1>
          </div>

          <div className="flex gap-3">
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Usuń FAQ
            </Button>
          </div>
        </div>

        {/* Tab options */}
        <div className="w-full md:w-3/4   lg:w-[46%] grid grid-cols-3 border-b">
          {tabs.map((tab, index) => (
            <ProductTabCard
              key={index}
              onClick={() => setActiveTab(tab.key)}
              isActive={activeTab === tab.key}
              name={tab.label}
            />
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 py-6 min-h-[400px]">
        {activeTab === "details" && <FaqDetailtsTab faq={faq} />}

        {activeTab === "questionsAndAnswers" && faq && (
          <FaqQuestionsAndAnswersTab questions={faq.items} faqId={faq._id} />
        )}
      </div>
    </div>
  );
};
