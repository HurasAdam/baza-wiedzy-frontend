export interface AttachmentListItem {
  _id: string;
  filename: string;
  title?: string;
  description?: string;
  path: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  ownerType: "User" | "Article" | "Workspace" | "Loose";
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ArticleAttachment {
  _id: string;
  filename: string;
  title: string;
  description?: string;
  path: string;
  mimeType: string;
  size: number;
  uploadedBy: {
    _id: string;
    name: string;
    surname: string;
    email: string;
    profilePicture?: {
      _id: string;
      filename: string;
      path: string;
    };
  };
  ownerType: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
