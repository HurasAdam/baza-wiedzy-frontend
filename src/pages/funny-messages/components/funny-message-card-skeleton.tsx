interface IFunnyMessageCardsSkeletonProps {
  count?: number;
}
const FunnyMessageCardsSkeleton = ({
  count = 5,
}: IFunnyMessageCardsSkeletonProps) => {
  return (
    <div className="space-y-8">
      {Array.from({ length: count }).map((_, index: number) => {
        return <FunnyMessageCardSkeleton key={index} />;
      })}
    </div>
  );
};

const FunnyMessageCardSkeleton = () => {
  return (
    <article className="rounded-lg bg-card border border-border shadow-sm animate-pulse">
      <header className="flex justify-between items-center px-6 py-3 border-b border-border">
        <div className="h-5 bg-muted rounded w-1/3"></div>
        <div className="h-3 bg-muted rounded w-20"></div>
      </header>
      <div className="px-5 py-4 space-y-4">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    </article>
  );
};

export default FunnyMessageCardsSkeleton;
