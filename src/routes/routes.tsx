import { PAGES } from "../pages";
import { PROTECTED_ROUTES } from "./common/routePaths";

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.DASHBOARD, element: <PAGES.DashboardPage /> },
  { path: PROTECTED_ROUTES.ARTICLES, element: <PAGES.ArticlesPage /> },
  {
    path: PROTECTED_ROUTES.REGISTER_TOPIC,
    element: <PAGES.TopicRegisterPage />,
  },
];
