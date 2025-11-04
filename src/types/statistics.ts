export const UserStatsContext = {
  ARTICLES_ADDED: "articlesAdded",
  ARTICLES_EDITED: "articlesEdited",
  CONVERSATION_TOPICS: "conversationTopics",
} as const;

export type UserStatsContextEnum = (typeof UserStatsContext)[keyof typeof UserStatsContext];
