import { ArticlePage } from "../pages/article/ArticlePage";
import { AdminAccountsPage } from "./admin-panel/admin-admin-accounts/admin-admin-accounts";
import { ArchivedArticleEditPage } from "./admin-panel/admin-archived-article-details/subpages/ArchivedArticleEditPage/ArchivedArticleEditPage";
import { ArchivedArticleHistoryPage } from "./admin-panel/admin-archived-article-details/subpages/ArchivedArticleHistoryPage/ArchivedArticleHistoryPage";
import { ArchivedArticleMainPage } from "./admin-panel/admin-archived-article-details/subpages/ArchivedArticleMainPage/ArchivedArticleMainPage";
import { AdminArchivedArticlesPage } from "./admin-panel/admin-archived-articles/AdminArchivedArticles";
import { AdminFaqDetailsPage } from "./admin-panel/admin-faq-details/admin-faq-details";
import { AdminFaqsListPage } from "./admin-panel/admin-faqs/admin-faqs";
import { AdminIssueReportDetailsPage } from "./admin-panel/admin-issue-reports/admin-issue-report-detailsPage";
import { AdminUserReportsPage } from "./admin-panel/admin-issue-reports/admin-issue-reports";
import { JstAdminProjectsPage } from "./admin-panel/admin-jst-projects/admin-jst-projects";
import { JstDetailsPage } from "./admin-panel/admin-jstProject-details/components/JstDetailsPage";
import { AdminProductDetailsPage } from "./admin-panel/admin-product-details/admin-product-details";
import { ProductsPage } from "./admin-panel/admin-products/admin-products";
import { AdminRolesPage } from "./admin-panel/admin-roles/admin-roles";
import { TagsPage } from "./admin-panel/admin-tags/admin-tags";
import { AdminTopicsPage } from "./admin-panel/admin-topics/admin-topics";
import { AdminUserDetailsPage } from "./admin-panel/admin-user-details/admin-user-details";
import { UsersPage } from "./admin-panel/admin-users/admin-users";
import { ArticleAttachmentsPage } from "./article/ArticleAttachmentsPage";
import { ArticleHistoryDetailPage } from "./article/ArticleHistoryDetailPage";
import { ArticleHistoryPage } from "./article/ArticleHistoryPage";
import { ArticleMainPage } from "./article/ArticleMainPage";
import { ArticlesPage } from "./articles/ArticlesPage";
import { Articlev2AttachmentsPage } from "./articlev2/ArticleAttachmentsPage/Articlev2AttachmentsPage";
import { ArticleEditPage } from "./articlev2/ArticleEditPage/ArticleEditPage";
import { Articlev2HistoryDetailPage } from "./articlev2/ArticleHistoryDetailsPage/ArticleHistoryDetailsPage";
import { Articlev2HistoryPage } from "./articlev2/ArticleHistoryPage/Articlev2HistoryPage";
import { Articlev2MainPage } from "./articlev2/ArticleMainPage/Articlev2MainPage";
import { ForgotPasswordPage } from "./auth/forgot-password/ForgotPasswordPage";
import { LoginPage } from "./auth/login/LoginPage";
import { CreateArticlePage } from "./create-article/CreateArticlePage";
import { CreateFaqPage } from "./create-faq/CreateFaqPage";
import { CreateRolePage } from "./create-role/CreateRolePage";
import { CreateWorkspaceArticlePage } from "./create-workspace-article/CreateWorkspaceArticle";
import { DashboardPage } from "./dashboard/DashboardPage";
import { EditRolePage } from "./edit-role/EditRolePage";
import { GlobalBadRequestPage } from "./errors/GlobalBadRequestPage";
import { GlobalNotFoundPage } from "./errors/GlobalNotFoundPage";
import { GlobalServerErrorPage } from "./errors/GlobalServerErrorPage";
import { FaqPage } from "./faq/FaqPage";
import { FavoritesArticlesPage } from "./favorites-articles/FavoritesArticlesPage";
import { FlaggedArticlesPage } from "./flagged-articles/FlaggedArticlesPage";
import { FunnyMessages } from "./funny-messages/FunnyMessages";
import { JstProjectsPage } from "./jst-projects/JstProjectsPage";
import { MyEntriesPage } from "./my-entries/MyEntriesPage";
import { MyFlagsPage } from "./my-flags/MyFlagsPage";
import { MyWorkspaces } from "./my-workspaces/MyWorkspaces";
import { NetworkToolsPage } from "./network-tools/NetworkToolsPage";
import { NotFoundPage } from "./notFound/NotFoungPage";
import { OnboardingPage } from "./onboarding/OnboardingPage";
import { PendingArticles } from "./pending-articles/PendingArticles";
import { ReportDetailsPage } from "./report/ReportDetailsPage";
import { ReportsPage } from "./reports/ReportsPage";
import { StatisticsPage } from "./statistics/StatisticsPage";
import { TopicRegisterPage } from "./TopicRegister/TopicRegisterPage";
import { UsefulLinksPage } from "./usefull-links/UsefulLinksPage";
import { WorkspaceArticlePage } from "./workspace-article/WorkspaceArticlePage";
import { WorkspaceFolderPage } from "./workspace-folder-page/WorkspaceFolderPage";
import { WorkspaceManageFoldersPage } from "./workspace-manage-folders/WorkspaceManageFoldersPage";
import { WorkspaceManageMembersPage } from "./workspace-manage-members/WorkspaceManageMembersPage";
import { WorkspaceManageSettingsPage } from "./workspace-manage-settings/WorkspaceManageSettingsPage";
import { WorkspaceOverviewPage } from "./workspace-overview/WorkspaceOverviewPage";
export const PAGES = {
  LoginPage,
  ForgotPasswordPage,
  DashboardPage,
  ArticlesPage,
  FlaggedArticlesPage,
  ArticlePage,
  ArticleMainPage,
  ArticleAttachmentsPage,
  ArticleHistoryPage,
  ArticleHistoryDetailPage,
  ArticleEditPage,
  TopicRegisterPage,
  NotFoundPage,
  JstProjectsPage,
  StatisticsPage,
  ArchivedArticleEditPage,
  MyEntriesPage,
  FunnyMessages,
  CreateArticlePage,
  PendingArticles,
  FavoritesArticlesPage,
  UsersPage,
  ProductsPage,
  TagsPage,
  JstAdminProjectsPage,
  AdminUserReportsPage,
  AdminFaqsListPage,
  AdminTopicsPage,
  AdminIssueReportDetailsPage,
  AdminAccountsPage,
  AdminRolesPage,
  OnboardingPage,
  AdminProductDetailsPage,
  FaqPage,
  CreateRolePage,
  EditRolePage,
  CreateFaqPage,
  AdminFaqDetailsPage,
  AdminUserDetailsPage,
  AdminArchivedArticlesPage,
  WorkspaceFolderPage,
  CreateWorkspaceArticlePage,
  WorkspaceManageFoldersPage,
  WorkspaceManageMembersPage,
  WorkspaceManageSettingsPage,
  WorkspaceOverviewPage,
  WorkspaceArticlePage,
  MyFlagsPage,
  ReportsPage,
  MyWorkspaces,
  Articlev2MainPage,
  Articlev2HistoryPage,
  Articlev2AttachmentsPage,
  GlobalNotFoundPage,
  GlobalServerErrorPage,
  GlobalBadRequestPage,
  Articlev2HistoryDetailPage,
  ReportDetailsPage,
  JstDetailsPage,
  ArchivedArticleMainPage,
  ArchivedArticleHistoryPage,
  UsefulLinksPage,
  NetworkToolsPage,
};
