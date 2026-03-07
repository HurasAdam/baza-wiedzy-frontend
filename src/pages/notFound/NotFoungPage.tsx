import { useNavigate } from "react-router-dom";
import { NoDataFound } from "../../components/shared/NoDataFound";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl  mx-auto py-9 px-10 " style={{ textAlign: "center", padding: "" }}>
      <NoDataFound
        title="Ups! Strona nie została znaleziona."
        description=" Strona której szukasz nie istnieje."
        buttonText="Wróć na stronę główną"
        buttonAction={() => navigate("/dashboard")}
      />
    </div>
  );
};
