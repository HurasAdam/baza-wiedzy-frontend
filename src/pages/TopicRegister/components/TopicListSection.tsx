import type { SetURLSearchParams } from "react-router-dom";
import EmptyState from "../../../components/shared/EmptyState";
import type { ITopic } from "../../../types/topic";
import RegisterTopicCard from "./register-topic-card";
import RegisterTopicSkeletonCards from "./register-topic-skeleton-cards";

interface TopicListSectionProps {
  isTopicsLoading: boolean;
  topics: ITopic[];
  title: string;
  setParams: SetURLSearchParams;
}

const TopicListSection = ({ isTopicsLoading, topics, title, setParams }: TopicListSectionProps) => {
  return (
    <div className="flex w-full gap-6">
      <div className="space-y-3.5 flex-1 pb-10">
        {isTopicsLoading ? (
          // ---- Loading skeletons -----
          <RegisterTopicSkeletonCards itemsCount={8} />
        ) : topics?.length === 0 && !title ? (
          <EmptyState
            onReset={() => {}}
            resetLabel="+ Dodaj temat"
            title="Brak tematów"
            description="Wygląda na to, że dla tego produktu nie dodano jeszcze żadnych tematów"
          />
        ) : topics?.length === 0 ? (
          <EmptyState onReset={() => setParams({})} />
        ) : (
          topics.map((topic) => <RegisterTopicCard key={topic._id} topic={topic} />)
        )}
      </div>
    </div>
  );
};

export default TopicListSection;
