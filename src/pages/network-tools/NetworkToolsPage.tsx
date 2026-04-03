import { motion } from "framer-motion";
import { useState } from "react";
import * as animation from "../../constants/animations";
import { useSendNetworkQuery } from "../../hooks/network-tools/use.network-tools";
import RecordsContent from "./components/Content";
import FilterBar from "./components/FilterBar";
import Header from "./components/Header";

type FormValues = {
  domain: string;
  resolver: string;
  recordType: string;
};

export const NetworkToolsPage = () => {
  const [queryParams, setQueryParams] = useState<FormValues | null>(null);
  const { data, isFetching, isError, error, refetch } = useSendNetworkQuery(queryParams ?? undefined);

  const onSubmit = (values: FormValues) => {
    setQueryParams(values);
  };

  const recordsToDisplay =
    data && queryParams && queryParams?.recordType.toUpperCase() !== "ALL"
      ? { [queryParams.recordType]: data[queryParams.recordType] }
      : data;

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-6 h-full w-full py-6 px-10 max-w-6xl mx-auto "
    >
      <Header />

      <FilterBar isLoading={isFetching} onSubmit={onSubmit} />

      <RecordsContent
        isError={isError}
        queryParams={queryParams}
        error={error}
        content={recordsToDisplay}
        refetch={refetch}
      />
    </motion.div>
  );
};
