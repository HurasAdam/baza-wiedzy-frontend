import EmptyState from "../../../components/shared/EmptyState";
import SchoolCard from "./jst-school/SchoolCard";
import SchoolSkeletonCards from "./jst-school/SchoolSkeletonCards";

type JstSchoolsListProps = {
  schools: IJstSchool[];
  isLoading: boolean;
};

const JstSchoolsList = ({ schools, isLoading }: JstSchoolsListProps) => {
  if (isLoading) return <SchoolSkeletonCards itemsCount={6} />;
  if (!schools?.length)
    return (
      <EmptyState
        resetLabel="Dodaj szkołę"
        title="Brak szkół do wyświetlenia"
        description="Wygląda na to że dla wybranego projektu nie dodano jeszcze żadnych szkół"
      />
    );

  return (
    <div className="flex flex-col gap-4 pb-14">
      {schools.map((school) => (
        <SchoolCard key={school._id} school={school} />
      ))}
    </div>
  );
};

export default JstSchoolsList;
