import { PAGES } from "../pages";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./common/routePaths";

export const authRoutePaths = [
  { path: AUTH_ROUTES.LOGIN, element: <PAGES.LoginPage /> },
  { path: AUTH_ROUTES.FORGOT_PASSWORD, element: <PAGES.ForgotPasswordPage /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.DASHBOARD, element: <PAGES.DashboardPage /> },
  { path: PROTECTED_ROUTES.ARTICLES, element: <PAGES.ArticlesPage /> },
  {
    path: PROTECTED_ROUTES.REGISTER_TOPIC,
    element: <PAGES.TopicRegisterPage />,
  },
];
