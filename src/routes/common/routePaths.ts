export function isAuthRoute(pathname: string): boolean {
  return Object.values(AUTH_ROUTES).includes(pathname);
}

export const AUTH_ROUTES = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
};

export const PROTECTED_ROUTES = {
  DASHBOARD: "/dashboard",
  ARTICLES: "/articles",
  REGISTER_TOPIC: "/register-topic",
};
