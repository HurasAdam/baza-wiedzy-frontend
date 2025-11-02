const ArticleDrawerSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="h-6 bg-muted/20 rounded w-1/3 animate-pulse" />
    <div className="h-4 bg-muted/20 rounded w-full animate-pulse" />
    <div className="h-[60vh] bg-muted/10 rounded animate-pulse" />
  </div>
);

export default ArticleDrawerSkeleton;
