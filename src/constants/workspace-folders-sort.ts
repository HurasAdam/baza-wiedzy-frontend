export const FolderSort = {
  NEWEST: "newest",
  OLDEST: "oldest",
} as const;

export type FolderSortType = (typeof FolderSort)[keyof typeof FolderSort];
