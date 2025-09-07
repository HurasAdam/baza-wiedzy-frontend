import { Pin } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import type { ITopic } from "../../../types/topic";
import { RegisterTopicForm } from "../forms/register-topic-form";

interface RegisterTopicCardProps {
  topic: ITopic;
}

const RegisterTopicCard = ({ topic }: RegisterTopicCardProps) => {
  return (
    <Card
      key={topic._id}
      className="w-full shadow hover:shadow-md transition-shadow rounded-lg py-0.5 relative overflow-visible"
    >
      <div
        className="absolute -left-10 top-1/2 transform -translate-y-1/2 rounded-sm  h-9 w-9 flex items-center justify-center transition-all duration-200 hover:shadow-md"
        style={{ backgroundColor: `${topic.product.labelColor}20` }}
      >
        <Pin style={{ color: `${topic.product.labelColor}` }} className="w-4.5 h-4.5 text-foreground/80" />
      </div>

      <CardContent className="flex items-center justify-between px-4 py-1.5 w-full min-h-[40px]">
        <div className="flex flex-col ml-3 min-w-0 flex-1">
          <h3 className="text-base font-medium text-foreground/90 truncate">{topic.title}</h3>
          <span className="text-xs font-base text-muted-foreground truncate">{topic.product.name}</span>
        </div>

        <RegisterTopicForm topic={topic} />
      </CardContent>
    </Card>
  );
};

export default RegisterTopicCard;
