interface Props {
  tabsCount: number;
}

export const ProjectTabsSkeleton = ({ tabsCount }: Props) => {
  return Array.from({ length: tabsCount }).map((_, idx) => (
    <ProjectTabCardSkeleton key={idx} />
  ));
};

const ProjectTabCardSkeleton = () => {
  return <div className="h-9 w-32 rounded-t-md bg-card animate-pulse" />;
};
