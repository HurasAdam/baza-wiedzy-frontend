import { useNavigate } from "react-router-dom";
import { NoDataFound } from "../../components/shared/NoDataFound";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <NoDataFound
        title="Ups! Strona nie została znaleziona."
        description=" Strona której szukasz nie istnieje."
        buttonText="Wróć na stronę główną"
        buttonAction={() => navigate("/dashboard")}
      />
    </div>
  );
};
