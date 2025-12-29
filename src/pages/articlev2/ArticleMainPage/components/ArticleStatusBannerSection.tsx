/**
 * Wrapper dla bannerów artykułu.
 * Zwraca odpowiedni komponent banneru w zależności od statusu artykułu i flagi `isVisible`.
 *
 * @param status - Aktualny status artykułu (np. "draft", "pending", "rejected").
 * @param isVisible - Flaga określająca, czy artykuł jest widoczny w wyszukiwarce artykułów w aplikacji.
 * @param userPermissions - Lista uprawnień dla roli użytkownika w aplikacji.
 * @param actions - Funkcje do obsługi akcji artykułu (zatwierdź, odrzuć, poproś o weryfikację).
 * @returns Wybrany banner lub `false`, jeśli status nie pasuje.
 */

import { DraftBanner } from "./DraftBanner";
import { EditedDraftBanner } from "./EditedDraftBanner";
import { PendingBanner } from "./PendingBanner";
import { RejectedBanner } from "./RejectedBanner";

interface ArticleActions {
  APPROVE_ARTICLE: () => void;
  REJECT_ARTICLE: () => void;
  REQUEST_ARTICLE_REVIEW: () => void;
}

interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
}

export interface RejectionNote {
  text: string;
  createdBy: User;
  createdAt: string;
  targetUser?: User;
}

export interface ArticleData {
  status: string;
  isVisible: boolean;
  rejectionNote: RejectionNote;
}

interface Props {
  articleData: ArticleData;
  userPermissions: string[];
  actions: ArticleActions;
}

export const ArticleStatusBannerSection = ({ articleData, userPermissions, actions }: Props) => {
  const { status, isVisible } = articleData;

  if (status === "draft" && !isVisible)
    return (
      <DraftBanner
        userPermissions={userPermissions}
        actions={{
          APPROVE_ARTICLE: actions.APPROVE_ARTICLE,
          REJECT_ARTICLE: actions.REJECT_ARTICLE,
        }}
      />
    );

  if (status === "draft" && isVisible) {
    return (
      <EditedDraftBanner
        userPermissions={userPermissions}
        actions={{
          APPROVE_ARTICLE: actions.APPROVE_ARTICLE,
          REJECT_ARTICLE: actions.REJECT_ARTICLE,
        }}
      />
    );
  }

  if (status === "rejected")
    return (
      <RejectedBanner
        userPermissions={userPermissions}
        actions={{
          REQUEST_ARTICLE_REVIEW: actions.REQUEST_ARTICLE_REVIEW,
        }}
        articleData={articleData}
      />
    );

  if (status === "pending")
    return (
      <PendingBanner
        userPermissions={userPermissions}
        actions={{
          APPROVE_ARTICLE: actions.APPROVE_ARTICLE,
        }}
      />
    );

  return false;
};
