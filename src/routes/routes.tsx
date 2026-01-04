import { PAGES } from "../pages";
import { PROTECTED_ROUTES } from "./common/routePaths";

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.ONBOARDING, element: <PAGES.OnboardingPage /> },
  { path: PROTECTED_ROUTES.DASHBOARD, element: <PAGES.DashboardPage /> },
  { path: PROTECTED_ROUTES.ARTICLES, element: <PAGES.ArticlesPage /> },
  { path: PROTECTED_ROUTES.FLAGGED_ARTICLES, element: <PAGES.FlaggedArticlesPage /> },
  { path: PROTECTED_ROUTES.ARTICLE, element: <PAGES.ArticlePage /> },
  { path: PROTECTED_ROUTES.JST_PROJECTS, element: <PAGES.JstProjectsPage /> },
  { path: PROTECTED_ROUTES.FAQ, element: <PAGES.FaqPage /> },
  {
    path: PROTECTED_ROUTES.PENDING_ARTICLES,
    element: <PAGES.PendingArticles />,
  },
  {
    path: PROTECTED_ROUTES.FAVORITES_ARTICLES,
    element: <PAGES.FavoritesArticlesPage />,
  },
  {
    path: PROTECTED_ROUTES.REGISTER_TOPIC,
    element: <PAGES.TopicRegisterPage />,
  },
  { path: PROTECTED_ROUTES.STATISTICS, element: <PAGES.StatisticsPage /> },
  { path: PROTECTED_ROUTES.MY_ENTRIES, element: <PAGES.MyEntriesPage /> },
  { path: PROTECTED_ROUTES.MY_WORKSPACES, element: <PAGES.MyWorkspaces /> },
  { path: PROTECTED_ROUTES.MY_FLAGS, element: <PAGES.MyFlagsPage /> },
  { path: PROTECTED_ROUTES.REPORTS, element: <PAGES.ReportsPage /> },
  { path: PROTECTED_ROUTES.REPORTS_ID, element: <PAGES.ReportDetailsPage /> },
  { path: PROTECTED_ROUTES.FUNNY_MESSAGES, element: <PAGES.FunnyMessages /> },
  {
    path: PROTECTED_ROUTES.CREATE_ARTICLE,
    element: <PAGES.CreateArticlePage />,
  },
  {
    path: PROTECTED_ROUTES.CREATE_FAQ,
    element: <PAGES.CreateFaqPage />,
  },
];
