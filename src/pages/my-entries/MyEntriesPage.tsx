import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CheckCircle, Clock, Loader, XCircle } from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";
import ArticleRejectionReasonModal from "../../components/my-entries/article-rejection-reason-modal";
import { NoDataFound } from "../../components/shared/NoDataFound";
import { useFindArticlesCreatedByUserQuery } from "../../hooks/articles/use-articles";
import MyEntryCard, { type Article } from "./components/MyEntryCard";
import StatusBar from "./components/StatusBar";

const statuses: { key: StatusKey; label: string; icon: JSX.Element }[] = [
  {
    key: "approved",
    label: "Zatwierdzone",
    icon: <CheckCircle className="w-4 h-4 mr-1" />,
  },
  {
    key: "pending",
    label: "Oczekujące",
    icon: <Clock className="w-4 h-4 mr-1" />,
  },
  {
    key: "rejected",
    label: "Odrzucone",
    icon: <XCircle className="w-4 h-4 mr-1" />,
  },
];

export type StatusKey = "approved" | "pending" | "rejected" | "draft";

export const MyEntriesPage = () => {
  const [currentStatus, setCurrentStatus] = useState<StatusKey>("approved");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [openRejectionReasonModal, setOpenRejectionReasonModal] =
    useState(false);

  const { data, isLoading, error } = useFindArticlesCreatedByUserQuery({
    status: currentStatus,
    limit: 50,
    page: 1,
  });

  const onOpenRejectionReason = (article: Article) => {
    setSelectedArticle(article);
    setOpenRejectionReasonModal(true);
  };

  const onCloseRejectionReasonModal = () => {
    setOpenRejectionReasonModal(false);
    setSelectedArticle(null);
  };

  return (
    <div className="mx-auto pb-10">
      <h1 className="text-xl font-bold mb-6.5 tracking-wide text-foreground">
        Moje artykuły
      </h1>

      <StatusBar
        currentStatus={currentStatus}
        setCurrentStatus={setCurrentStatus}
        statuses={statuses}
      />

      <Tabs value={currentStatus} className="w-full">
        {statuses.map(({ key }) => (
          <TabsContent
            key={key}
            value={key}
            className="p-0"
            style={{ backgroundColor: "var(--color-card)" }}
          >
            <div className=" border border-border  bg-card divide-y divide-border">
              {isLoading && (
                <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400">
                  <Loader className="animate-spin" />
                  <span>Ładowanie artykułów...</span>
                </div>
              )}

              {error && (
                <div className="p-6 text-center text-red-600 dark:text-red-400 font-medium">
                  <svg
                    className="inline-block mr-2 h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Wystąpił błąd podczas pobierania artykułów.
                </div>
              )}

              {!isLoading && data?.data?.length === 0 && (
                // <p className="p-6 text-center text-gray-500 dark:text-gray-400 italic">
                //   Brak artykułów do wyświetlenia.
                // </p>
                <NoDataFound
                  title="Brak wyników"
                  description="Brak artykułów do wyświetlenia."
                />
              )}

              {data?.data?.map((article: Article) => (
                <MyEntryCard
                  onOpenRejectionReason={onOpenRejectionReason}
                  article={article}
                  label={key}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div>More</div>
      {selectedArticle && (
        <ArticleRejectionReasonModal
          article={selectedArticle}
          open={openRejectionReasonModal}
          setOpen={onCloseRejectionReasonModal}
        />
      )}
    </div>
  );
};
