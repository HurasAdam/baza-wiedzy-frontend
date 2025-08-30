import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/card";
import { generateMockHistory, getEventConfig } from "../../../utils/article-event";

const ArticleHistoryTab = () => {
  const mockHistory = useMemo(() => generateMockHistory(20), []);

  return (
    <div>
      <Card className="mt-6 bg-transparent shadow-none pr-4">
        <CardContent className="p-0">
          <ul className="relative border-l-2 border-border">
            {mockHistory.map((item) => {
              const { Icon, bgClass } = getEventConfig(item.type);

              return (
                <li key={item.id} className="mb-3 ml-8">
                  {/* Ikona na osi czasu */}
                  <span
                    className={`
                          absolute -left-4 flex items-center justify-center
                          w-8 h-8 ${bgClass} rounded-full
                          ring-4 ring-background shadow-lg
                        `}
                  >
                    <Icon className="w-4 h-4 text-primary-foreground" />
                  </span>

                  {/* Karta */}
                  <div className="relative bg-card p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-1">
                      {/* Event action + user */}
                      <div className="flex flex-col">
                        {/* Akcja (np. "Edycja artykułu") */}
                        <div className="flex items-center space-x-1 text-sm font-medium text-foreground">
                          <Icon className="w-4 h-4" />
                          <span>{item.action}</span>
                        </div>
                        {/* Nazwisko niżej, mniejsze */}
                        <span className="mt-1 text-xs text-muted-foreground">{item.user}</span>
                      </div>

                      {/* Data i szczegóły */}
                      <div className="flex items-center space-x-2">
                        <time className="text-xs text-muted-foreground">{item.date}</time>
                        <Link
                          to={`/articles/history/${item.id}`}
                          className="text-primary text-sm hover:text-primary/80"
                          aria-label="Zobacz szczegóły"
                        >
                          →
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleHistoryTab;
