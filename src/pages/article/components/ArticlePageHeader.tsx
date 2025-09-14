// pages/article/components/ArticlePageHeader.tsx
import { cn } from "@/lib/utils"; // helper do łączenia klas
import { ArrowLeft } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import type { Article } from "../../../types/article";
import ArticleBannerSection from "./ArticleBannerSection";

interface Props {
  article: Article;
  returnUrl: string;
}

export const ArticlePageHeader: React.FC<Props> = ({ article, returnUrl }) => {
  const navigate = useNavigate();

  const tabs = [
    { label: "Dane główne", path: "" },
    { label: "Załączniki", path: "attachments" },
    { label: "Historia zmian", path: "history" },
  ];

  return (
    <>
      <div className="flex items-center justify-between py-4 px-4 bg-background border-b border-border ">
        <div>
          {/* Lewy przycisk Wróć */}
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted rounded-md transition"
            onClick={() => navigate(returnUrl)}
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć
          </button>

          {/* Nagłówek */}
          <h1 className="text-xl font-semibold text-foreground truncate max-w-xs md:max-w-2xl text-center">
            {article.title}
          </h1>
        </div>

        {/* Zakładki po prawej */}
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === ""}
              state={{ from: returnUrl }}
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
      {/* {article.status === "rejected" && (
        <RejectedArticleBanner article={article} isResubmitting={isApproveLoading} onResubmit={onArticleAprove} />
      )}

      {["pending"].includes(article.status) && (
        <ArticleVerificationBanner status={article.status} onApprove={onArticleAprove} onReject={onArticleReject} />
      )}
      {["draft"].includes(article.status) && (
        <ArticleDraftBanner status={article.status} onApprove={onArticleAprove} onReject={onArticleReject} />
      )} */}

      <ArticleBannerSection article={article} />
    </>
  );
};
