import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { useFindUser } from "../../../hooks/users/use-users";
import ProductTabCard from "../admin-product-details/components/ProductTabCard";
import { UserArticlesTab } from "./components/UserArticlesTab";
import { UserInfoTab } from "./components/UserInfoTab";

export const AdminUserDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const backendBase = import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:5000";
  //   const { data: faq, isLoading: isProductLoading } = useFindFaqQuery(id!);
  const { data: faq, isLoading: isProductLoading } = useFindUser(id!);

  const [activeTab, setActiveTab] = useState<"account" | "questionsAndAnswers" | "topics">("account");

  const tabs: { key: "account" | "questionsAndAnswers" | "topics"; label: string }[] = [
    { key: "account", label: "Dane konta" },
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
    <div className="flex flex-col">
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
            <Avatar className="w-18 h-18  ">
              <AvatarImage
                className="object-cover"
                src={
                  faq.profilePicture?.path
                    ? `${backendBase}${faq.profilePicture.path.replace(/^\/app/, "")}`
                    : undefined
                }
                alt={`${faq.name} ${faq.surname}`}
                crossOrigin="anonymous"
              />
              <AvatarFallback>{(faq.name?.[0] || "") + (faq.surname?.[0] || "U")}</AvatarFallback>
            </Avatar>

            <h1 className="text-2xl font-bold">
              {faq.name} {faq.surname}
            </h1>
          </div>

          <div className="flex gap-3">
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Usuń
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
        {activeTab === "account" && <UserInfoTab user={faq} />}

        {activeTab === "questionsAndAnswers" && faq && <UserArticlesTab faqId={faq._id} questions={[]} />}
      </div>
    </div>
  );
};
