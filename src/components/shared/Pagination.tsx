export type Props = {
  currentPage: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, pages, onPageChange }: Props) => {
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center pb-5 w-full">
      <ul className="flex border-slate-300">
        {pageNumbers.map((number) => {
          const active = currentPage === number;
          return (
            <li
              key={number}
              className={`rounded-md mx-[1.5px] border text-slate-700 w-[30px] h-[30px] flex items-center justify-center transition-all hover:border-primary/90 ${
                active ? "bg-primary border-primary/85 text-white " : ""
              }`}
            >
              <button className="w-full h-full" onClick={() => onPageChange(number)}>
                {number}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Pagination;
