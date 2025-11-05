import type { JSX } from "react";
import type { SetURLSearchParams } from "react-router-dom";
import EmptyState from "../../../components/shared/EmptyState";
import { NoDataFound } from "../../../components/shared/NoDataFound";
import { Tabs, TabsContent } from "../../../components/ui/tabs";
import type { Product } from "../../admin-panel/admin-products/components/ProductsList";
import type { ArticlesResponse } from "../../articles/components/ArticlesList";
import type { StatusKey } from "../../my-entries/MyEntriesPage";
import PendingArticleCard from "./PendingArticleCard";
import SkeletonArticleCard from "./SkeletonArticleCard";

interface User {
  _id: string;
  name: string;
  surname: string;
}

export interface StatusItem {
  key: StatusKey;
  label: string;
  icon: JSX.Element;
}

interface PendingArticlesListProps {
  statuses: StatusItem[];
  articles?: ArticlesResponse;
  products: Product[];
  users: User[];
  userPermissions: string[];
  currentStatus: "approved" | "pending" | "rejected" | "draft";
  isLoading: boolean;
  hasFilters: boolean;
  setSearchParams: SetURLSearchParams;
  onArticleAprove: (articleId: string) => void;
  onArticleReject: (articleId: string) => void;
}

const PendingArticlesList = ({
  statuses,
  articles,
  products,
  users,
  userPermissions,
  currentStatus,
  isLoading,
  hasFilters,
  setSearchParams,
  onArticleAprove,
  onArticleReject,
}: PendingArticlesListProps) => {
  return (
    <Tabs value={currentStatus} className="w-full">
      {statuses.map(({ key }) => (
        <TabsContent key={key} value={key} className="p-0">
          <div className=" rounded-xl overflow-hidden">
            {isLoading || !users || !products ? (
              <ul className="divide-y divide-border ">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <SkeletonArticleCard key={i} withSpinner={i === 0} />
                  ))}
              </ul>
            ) : articles?.data.length === 0 ? (
              hasFilters ? (
                <EmptyState onReset={() => setSearchParams(new URLSearchParams({ status: currentStatus }))} />
              ) : (
                <NoDataFound title="Brak artykułów" description="Nie znaleziono żadnych artykułów w tej sekcji." />
              )
            ) : (
              <ul className="divide-y divide-border border bg-card rounded-xl ">
                {articles?.data.map((article) => (
                  <PendingArticleCard
                    key={article._id}
                    article={article}
                    onApprove={onArticleAprove}
                    onReject={onArticleReject}
                    userPermissions={userPermissions}
                  />
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PendingArticlesList;
