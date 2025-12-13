import { useState } from "react";
import { FunnyMessageModal } from "../../components/funny-messages/funny-message-modal";
import { useAuthQuery } from "../../hooks/auth/use-auth";
import { useFindFunnyMessagesQuery } from "../../hooks/funny-messages/use-funny-messages";
import { useFindUsersForSelect } from "../../hooks/users/use-users";
import FunnyMessagesFilterBar from "./components/Funny-messages-filter-bar";
import { FunnyMessagesList } from "./components/funny-messages-list";
import FunnyMessagesHeader from "./components/FunnyMessagesHeader";

export const FunnyMessages = () => {
  const { data: user } = useAuthQuery();
  const { data: usersData } = useFindUsersForSelect();
  const userPermissions = user?.role?.permissions || [];
  const [isCreatingFunnyMessage, setIsCreatingFunnyMessage] = useState<boolean>(false);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [sortDateDesc] = useState<boolean>(true);

  const filerParams = {
    ...(filterTitle && { title: filterTitle }),
    ...(filterAuthor && { author: filterAuthor }),
    sortByDate: sortDateDesc ? "desc" : "asc", // dodaj parametr do zapytania
  };
  const { data: funnyMessages, isLoading: isFunnyMessagesLoading } = useFindFunnyMessagesQuery(filerParams);

  const onCreateFunnyMessage = (): void => {
    setIsCreatingFunnyMessage(true);
  };

  const onResetAllFilters = () => {
    setFilterTitle("");
    setFilterAuthor("");
  };

  return (
    <div className="flex w-full pb-12 max-w-[1440px] mx-auto ">
      <div className="w-full">
        <FunnyMessagesHeader onCreateFunnyMessage={onCreateFunnyMessage} userPermissions={userPermissions} />

        {usersData && (
          <FunnyMessagesFilterBar
            selectedTitle={filterTitle}
            selectedAuthor={filterAuthor}
            authors={usersData}
            onTitleChange={(e) => setFilterTitle(e.target.value)}
            onAuthorChange={(id) => setFilterAuthor(id)}
            onResetAll={onResetAllFilters}
            resultsCount={funnyMessages?.data.length ?? 0}
          />
        )}
        <FunnyMessagesList isLoading={isFunnyMessagesLoading} messages={funnyMessages?.data ?? []} />
      </div>

      <FunnyMessageModal
        isCreatingFunnyMessage={isCreatingFunnyMessage}
        setIsCreatingFunnyMessage={setIsCreatingFunnyMessage}
      />
    </div>
  );
};
