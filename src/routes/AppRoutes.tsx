import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthRoute } from "./auth.route";
import { protectedRoutePaths } from "./routes";
import AppLayout from "@/layouts/app/app.layout";
import BaseLayout from "@/layouts/base/base.layout";
import { PAGES } from "@/pages";
import AdminLayout from "../layouts/admin/admin.layout";
import AdminDashboard from "../pages/admin-panel/admin-dashboard";
import AdminProtectedRoute from "./admin.protected.route";
import ProtectedRoute from "./protected.route";
import AccountOnboardingLayout from "@/layouts/account-onboarding/account-onboarding-layout";
import { OnboardingPage } from "@/pages/onboarding/OnboardingPage";
import { AccountOnboardingRoute } from "./account.onboarding.route";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publiczne ścieżki dostępne TYLKO dla niezalogowanych */}
        <Route element={<AuthRoute />}>
          <Route path="auth" element={<BaseLayout />}>
            <Route path="login" element={<PAGES.LoginPage />} />
            <Route
              path="forgot-password"
              element={<PAGES.ForgotPasswordPage />}
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        </Route>

        <Route element={<AccountOnboardingRoute />}>
          <Route element={<AccountOnboardingLayout />}>
            <Route path="/account-onboarding" element={<OnboardingPage />} />
          </Route>
        </Route>

        {/* Chronione ścieżki dostępne TYLKO dla zalogowanych */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {protectedRoutePaths.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            {/*  404 dla zalogowanych na nieznane ścieżki */}
            <Route path="*" element={<PAGES.NotFoundPage />} />
          </Route>
        </Route>

        {/* Ochrona admin panelu */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="manage-users" element={<PAGES.UsersPage />} />
            <Route path="manage-products" element={<PAGES.ProductsPage />} />
            <Route
              path="manage-products/:id"
              element={<PAGES.AdminProductDetailsPage />}
            />
            <Route path="manage-tags" element={<PAGES.TagsPage />} />
            <Route
              path="manage-jstprojects"
              element={<PAGES.JstAdminProjectsPage />}
            />
            <Route
              path="manage-reports"
              element={<PAGES.AdminUserReportsPage />}
            />
            <Route
              path="manage-reports/:id"
              element={<PAGES.AdminIssueReportDetailsPage />}
            />

            <Route
              path="manage-registertopics"
              element={<PAGES.AdminTopicsPage />}
            />
            <Route path="manage-admins" element={<PAGES.AdminAccountsPage />} />
            <Route path="manage-roles" element={<PAGES.AdminRolesPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
