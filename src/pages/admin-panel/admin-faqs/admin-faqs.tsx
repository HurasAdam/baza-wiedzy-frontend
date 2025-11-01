import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import queryClient from "../../../config/query.client";
import { useFindFaqsQuery, useSetDefaultFaqMutaton } from "../../../hooks/faq/use-faq";
import FaqsHeader from "./components/FaqsHeader";
import FaqsList from "./components/FaqsList";

export const AdminFaqsListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append("title", searchTerm);
    return searchParams;
  }, [searchTerm]);

  const { data: faqs = [], isLoading, isError, error } = useFindFaqsQuery(params);
  const { mutate } = useSetDefaultFaqMutaton();

  const onSetFaqAsDefault = (faqId: string) => {
    mutate(faqId, {
      onSuccess: () => {
        toast.success("Ustawiono nowe domyślne FAQ");
        queryClient.invalidateQueries({ queryKey: ["faq"] });
      },
    });
  };

  return (
    <div className="mx-auto pb-6">
      <FaqsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        foundFaqsValue={faqs.length}
        navigate={navigate}
      />

      <FaqsList
        faqs={faqs}
        isLoading={isLoading}
        isError={isError}
        error={error}
        navigate={navigate}
        onSetFaqAsDefault={onSetFaqAsDefault}
      />
    </div>
  );
};
