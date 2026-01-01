import { Pin } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import type { ITopic } from "../../../types/topic";
import { RegisterTopicForm } from "../forms/register-topic-form";

interface RegisterTopicCardProps {
  topic: ITopic;
}

const RegisterTopicCard = ({ topic }: RegisterTopicCardProps) => {
  return (
    <Card className="w-full hover:shadow-md shadow-xs transition-shadow rounded-lg border  py-1 relative overflow-visible bg-card/70">
      <CardContent className="flex items-center justify-between px-4 py-1 gap-3 w-full min-h-[50px]">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md border bg-background/90 hover:shadow-sm transition-all"
            style={{ color: topic.product.labelColor }}
          >
            <Pin className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-semibold text-foreground/90 truncate" title={topic.title}>
              {topic.title}
            </h3>
            <span
              className="inline-flex items-center px-2 py-[1px] mt-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide w-fit"
              style={{
                backgroundColor: `${topic.product.labelColor}1A`,
                color: topic.product.labelColor,
                border: `1px solid ${topic.product.labelColor}33`,
                opacity: 0.85,
              }}
              title={topic.product.name}
            >
              {topic.product.name}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <RegisterTopicForm topic={topic} />
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterTopicCard;
