import { CircleCheck, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

const RegisterTopicForm = ({ topic }) => {
  const [feedback, setFeedback] = useState<null | "call" | "message">(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      description: "",
      topic: topic ? topic?._id : "",
    },
  });

  const isPending = false;

  return (
    <form className="flex items-center space-x-3 w-1/2 my-auto">
      <Input
        placeholder="Notatka (opcjonalnie)"
        {...register("description")}
        className="h-11"
      />
      <Input type="hidden" value={topic?._id} {...register("topic")} />

      <div className=" flex  items-center pr-1 ">
        <div>
          {feedback ? (
            <div className="flex items-center justify-center h-11 w-[96px] rounded-md  text-green-600 bg-background border">
              <CircleCheck className="w-6 h-6" />
            </div>
          ) : (
            <div className="flex gap-2 h-11 w-[96px]">
              <Button
                type="button"
                // onClick={onSubmit("call")}
                disabled={isPending}
                className="flex items-center justify-center group hover:bg-primary "
                variant="outline"
                aria-label="Call"
              >
                {isPending ? (
                  <div className="animate-spin ">
                    <Phone className="w-4 h-4 text-foreground group-hover:text-secondary-foreground" />
                  </div>
                ) : (
                  <Phone className="w-4 h-4 text-foreground group-hover:text-secondary-foreground" />
                )}
              </Button>
              <Button
                type="button"
                // onClick={onSubmit("message")}
                disabled={isPending}
                className=" flex items-center justify-center group hover:bg-primary"
                variant="outline"
                aria-label="Message"
              >
                {isPending ? (
                  <div className="animate-spin">
                    <Mail className="w-4 h-4 text-foreground group-hover:text-secondary-foreground" />
                  </div>
                ) : (
                  <Mail className="w-4 h-4 text-foreground group-hover:text-secondary-foreground" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default RegisterTopicForm;
