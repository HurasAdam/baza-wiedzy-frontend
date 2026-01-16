import AccountOnboardingLayout from "@/layouts/account-onboarding/account-onboarding-layout";
import AppLayout from "@/layouts/app/app.layout";
import BaseLayout from "@/layouts/base/base.layout";
import { PAGES } from "@/pages";
import { OnboardingPage } from "@/pages/onboarding/OnboardingPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/admin/admin.layout";
import Articlev2Layout from "../layouts/articlev2/articlev2-layout";
import WorkspaceLayout from "../layouts/workspace/workspace.layout";
import AdminDashboard from "../pages/admin-panel/admin-dashboard";
import { AccountOnboardingRoute } from "./account.onboarding.route";
import AdminProtectedRoute from "./admin.protected.route";
import { AuthRoute } from "./auth.route";
import ProtectedRoute from "./protected.route";
import { protectedRoutePaths } from "./routes";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publiczne ścieżki dostępne TYLKO dla niezalogowanych */}
        <Route element={<AuthRoute />}>
          <Route path="auth" element={<BaseLayout />}>
            <Route path="login" element={<PAGES.LoginPage />} />
            <Route path="forgot-password" element={<PAGES.ForgotPasswordPage />} />

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
          <Route path="/not-found" element={<PAGES.GlobalNotFoundPage />} />

          <Route path="/bad-request" element={<PAGES.GlobalBadRequestPage />} />
          <Route path="/server-error" element={<PAGES.GlobalServerErrorPage />} />

          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {protectedRoutePaths.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            {/*  404 dla zalogowanych na nieznane ścieżki */}
            <Route path="*" element={<PAGES.NotFoundPage />} />

            {/* article V2 */}

            <Route path="/articles/:id" element={<Articlev2Layout />}>
              <Route index element={<PAGES.Articlev2MainPage />} /> {/* /articles/:id */}
              <Route path="attachments" element={<PAGES.Articlev2AttachmentsPage />} />{" "}
              {/* /articles/:id/attachments */}
              <Route path="history" element={<PAGES.Articlev2HistoryPage />} /> {/* /articles/:id/history */}
              <Route path="edit" element={<PAGES.ArticleEditPage />} /> {/* /articles/:id/history */}
              <Route path="history/:historyId" element={<PAGES.Articlev2HistoryDetailPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/workspace/:workspaceId" element={<WorkspaceLayout />}>
          <Route index element={<PAGES.WorkspaceOverviewPage />} />
          <Route path="folders/:folderId" element={<PAGES.WorkspaceFolderPage />} />
          <Route path="new-article" element={<PAGES.CreateWorkspaceArticlePage />} />
          <Route path="folders/:folderId/articles/:articleId" element={<PAGES.WorkspaceArticlePage />} />
          <Route path="folders" element={<PAGES.WorkspaceManageFoldersPage />} />
          <Route path="members" element={<PAGES.WorkspaceManageMembersPage />} />
          <Route path="settings" element={<PAGES.WorkspaceManageSettingsPage />} />
        </Route>

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="manage-users" element={<PAGES.UsersPage />} />
            <Route path="manage-users/:id" element={<PAGES.AdminUserDetailsPage />} />
            <Route path="manage-products" element={<PAGES.ProductsPage />} />
            <Route path="manage-products/:id" element={<PAGES.AdminProductDetailsPage />} />
            <Route path="manage-tags" element={<PAGES.TagsPage />} />
            <Route path="manage-jstprojects" element={<PAGES.JstAdminProjectsPage />} />

            <Route path="logs" element={<PAGES.AdminLogsPage />} />

            <Route path="manage-registertopics" element={<PAGES.AdminTopicsPage />} />

            <Route path="manage-faqs" element={<PAGES.AdminFaqsListPage />} />
            <Route path="manage-faqs/create" element={<PAGES.CreateFaqPage />} />
            <Route path="manage-faqs/:id" element={<PAGES.AdminFaqDetailsPage />} />
            <Route path="manage-admins" element={<PAGES.AdminAccountsPage />} />
            <Route path="manage-roles" element={<PAGES.AdminRolesPage />} />
            <Route path="manage-roles/create" element={<PAGES.CreateRolePage />} />
            <Route path="manage-roles/:id" element={<PAGES.EditRolePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
