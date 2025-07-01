import { Plus, Smile } from "lucide-react";
import { useState } from "react";
import { Dropdown } from "../../components/Dropdown";
import { FunnyMessageModal } from "../../components/funny-messages/funny-message-modal";
import { Button } from "../../components/ui/button";
import { useFindFunnyMessagesQuery } from "../../hooks/funny-messages/use-funny-messages";
import { FunnyMessagesList } from "./components/funny-messages-list";

export const FunnyMessages = () => {
  const [isCreatingFunnyMessage, setIsCreatingFunnyMessage] =
    useState<boolean>(false);

  const { data: funnyMessages, isLoading: isFunnyMessagesLoading } =
    useFindFunnyMessagesQuery();

  const onCreateFunnyMessage = (): void => {
    setIsCreatingFunnyMessage(true);
  };

  const dropdownOptions = [
    {
      label: "Dodaj wiadomość",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => {
        onCreateFunnyMessage();
      },
    },
  ];

  const triggerBtn = (
    <Button
      variant="default"
      className="flex items-center gap-1 cursor-pointer"
    >
      Dodaj <Plus className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="flex w-full ">
      <div className="w-full">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-1.5">
            <Smile className="w-6 h-6" /> Złote myśli
          </h1>

          <Dropdown
            triggerBtn={triggerBtn}
            options={dropdownOptions}
            position={{ align: "end" }}
          />
          {/* Tabs */}
        </div>
        <FunnyMessagesList
          isLoading={isFunnyMessagesLoading}
          messages={funnyMessages?.data ?? []}
        />
      </div>

      <FunnyMessageModal
        isCreatingFunnyMessage={isCreatingFunnyMessage}
        setIsCreatingFunnyMessage={setIsCreatingFunnyMessage}
      />
    </div>
  );
};
