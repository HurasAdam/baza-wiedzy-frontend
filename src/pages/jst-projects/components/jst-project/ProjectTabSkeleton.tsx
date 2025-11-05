interface ProjectTabsSkeletonProps {
  tabsCount?: number;
}

export const ProjectTabsSkeleton = ({ tabsCount = 5 }: ProjectTabsSkeletonProps) => {
  return (
    <div className="flex flex-wrap gap-2 border-b mb-8">
      {Array.from({ length: tabsCount }).map((_, idx) => (
        <ProjectTabCardSkeleton key={idx} />
      ))}
    </div>
  );
};

const ProjectTabCardSkeleton = () => {
  return <div className="h-9 w-32 rounded-t-md bg-card animate-pulse" />;
};
