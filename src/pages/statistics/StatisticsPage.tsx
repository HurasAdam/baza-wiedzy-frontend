import { NoDataFound } from "../../components/shared/NoDataFound";

export const StatisticsPage = () => {
  return (
    <div>
      <NoDataFound
        title="Brak danych do wyśietlenia"
        description="Dodaj dane, żeby wyświetlić szczegóły"
        buttonText="Dodaj"
        buttonAction={() => {}}
      />
    </div>
  );
};
