export interface WorkspaceArticle {
  _id: string;
  title: string;
  workspaceId: string;
  createdBy: ArticleAuthor;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  folder: ArticleFolder;
  responseVariants: ArticleResponseVariant[];
  __v: number;
}

export interface ArticleAuthor {
  _id: string;
  name: string;
  surname: string;
}

export interface ArticleFolder {
  _id: string;
  name: string;
}

export interface ArticleResponseVariant {
  _id: string;
  variantName: string;
  variantContent: string;
}
