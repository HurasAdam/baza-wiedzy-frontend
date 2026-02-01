import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { JstProjectModal } from "../../components/jst-project/jst-project-modal";
import { JstSchoolModal } from "../../components/jst-school/jst-school-modal";
import * as animation from "../../constants/animations";
import { useAuthQuery } from "../../hooks/auth/use-auth";
import { useFindJstProjectsQuery } from "../../hooks/jst-projects/use-jst-projects";
import { useFindJstSchoolsQuery } from "../../hooks/jst-schools/use-jst-schools";
import JstProjectsHeader from "./components/JstProjectsHeader";
import JstProjectsTabs from "./components/JstProjectsTabs";
import JstSchoolFilters from "./components/JstSchoolFilters";
import JstSchoolsList from "./components/JstSchoolList";

export type FilterField = "name" | "adres" | "email";

export const JstProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreatingJstSchool, setIsCreatingJstSchool] = useState<boolean>(false);
  const [isCreatingJstProject, setIsCreatingJstProject] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [filterField, setFilterField] = useState<FilterField>("name");
  const [filterQuery, setFilterQuery] = useState("");

  const { data: user } = useAuthQuery();

  const userPermissions = user?.role?.permissions || [];

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append("name", searchTerm);
    return searchParams;
  }, [searchTerm]);

  const { data: projects = [], isLoading } = useFindJstProjectsQuery(params);
  const { data: schools = [], isLoading: isSchoolsLoading } = useFindJstSchoolsQuery(selectedProjectId, {
    [filterField]: filterQuery,
  });

  useEffect(() => {
    if (projects.length && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  const onCreateJstSchool = () => setIsCreatingJstSchool(true);
  const onCreateJstProject = () => setIsCreatingJstProject(true);

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="flex w-full py-2 pb-5 max-w-[1320px] mx-auto"
    >
      <div className="w-full">
        <JstProjectsHeader
          onCreateJstProject={onCreateJstProject}
          onCreateJstSchool={onCreateJstSchool}
          userPermissions={userPermissions}
        />

        <JstProjectsTabs
          projects={projects}
          isLoading={isLoading}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />

        <JstSchoolFilters
          filterField={filterField}
          filterQuery={filterQuery}
          setFilterField={setFilterField}
          setFilterQuery={setFilterQuery}
        />

        <JstSchoolsList schools={schools} isLoading={!selectedProjectId || isSchoolsLoading} />
      </div>

      <JstSchoolModal
        projects={projects}
        isCreatingJstSchool={isCreatingJstSchool}
        setIsCreatingJstSchool={setIsCreatingJstSchool}
      />
      <JstProjectModal isCreatingJstProject={isCreatingJstProject} setIsCreatingJstProject={setIsCreatingJstProject} />
    </motion.div>
  );
};
