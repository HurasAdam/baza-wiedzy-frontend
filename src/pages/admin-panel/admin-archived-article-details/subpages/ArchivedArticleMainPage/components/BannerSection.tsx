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

import { ArchivedBanner } from "./ArchivedBanner";

interface ArticleActions {
  RESTORE_ARTICLE: () => void;
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
  isArchived: boolean;
}

interface Props {
  articleData: ArticleData;
  userPermissions: string[];
  actions: ArticleActions;
}

export const BannerSection = ({ articleData, userPermissions, actions }: Props) => {
  const { isArchived } = articleData;

  if (isArchived)
    return (
      <ArchivedBanner
        userPermissions={userPermissions}
        actions={{
          RESTORE_ARTICLE: actions.RESTORE_ARTICLE,
        }}
      />
    );

  return false;
};
