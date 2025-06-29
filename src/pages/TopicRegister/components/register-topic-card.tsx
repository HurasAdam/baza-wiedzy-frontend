import { Card, CardContent } from "../../../components/ui/card";
import type { ITopic } from "../../../types/topic";
import RegisterTopicForm from "../forms/register-topic-form";

interface RegisterTopicCardProps {
  topic: ITopic;
}

const RegisterTopicCard = ({ topic }: RegisterTopicCardProps) => {
  return (
    <Card
      key={topic._id}
      className="w-full shadow-sm hover:shadow-md py-0 transition-shadow rounded-base px-0.5"
    >
      <CardContent className="flex items-start justify-between px-4 py-1.5 w-full">
        {/* LEFT SIDE */}
        <div className="flex flex-col px-1.5 space-y-0.5">
          <div className="flex items-center py-2.5  gap-1.5">
            <div
              className=" text-xs uppercase text-muted-foreground w-3.5 h-3.5 rounded-xs"
              style={{ backgroundColor: topic.product.labelColor }}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {topic.product.name}
            </span>
          </div>
          <div className="flex-1 pr-4 pb-[1px]">
            <h3 className="text-base font-semibold text-foreground/85">
              {topic.title}
            </h3>
          </div>
        </div>
        {/* RIGHT SIDE*/}
        <RegisterTopicForm topic={topic} />
      </CardContent>
    </Card>
  );
};

export default RegisterTopicCard;
