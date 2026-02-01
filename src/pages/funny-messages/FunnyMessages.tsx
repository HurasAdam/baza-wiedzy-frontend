import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { EditFunnyMessageModal } from "../../components/funny-messages/edit-funny-message-modal";
import { FunnyMessageModal } from "../../components/funny-messages/funny-message-modal";
import { Alert } from "../../components/shared/alert-modal";
import queryClient from "../../config/query.client";
import * as animation from "../../constants/animations";
import { useAuthQuery } from "../../hooks/auth/use-auth";
import {
  useDeleteOneFunnyMessageMutation,
  useFindFunnyMessagesQuery,
} from "../../hooks/funny-messages/use-funny-messages";
import { useFindUsersForSelect } from "../../hooks/users/use-users";
import type { IFunnyMessage } from "../../types/funny-message";
import FunnyMessagesFilterBar from "./components/Funny-messages-filter-bar";
import { FunnyMessagesList } from "./components/funny-messages-list";
import FunnyMessagesHeader from "./components/FunnyMessagesHeader";

export const FunnyMessages = () => {
  const { data: user } = useAuthQuery();
  const { data: usersData } = useFindUsersForSelect();

  const userPermissions = user?.role?.permissions || [];
  const [isCreatingFunnyMessage, setIsCreatingFunnyMessage] = useState<boolean>(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<IFunnyMessage | null>(null);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [sortDateDesc] = useState<boolean>(true);

  const filerParams = {
    ...(filterTitle && { title: filterTitle }),
    ...(filterAuthor && { author: filterAuthor }),
    sortByDate: sortDateDesc ? "desc" : "asc",
  };
  const { data: funnyMessages, isLoading: isFunnyMessagesLoading } = useFindFunnyMessagesQuery(filerParams);
  const { mutate, isPending: isDeleteLoading } = useDeleteOneFunnyMessageMutation();

  const onDeleteClick = (message: IFunnyMessage) => {
    setMessageToDelete(message);
  };

  const onDeleteConfirm = (messageId: string) => {
    if (!messageToDelete) return;
    mutate(messageId, {
      onSuccess: () => {
        onDeleteCancel();
        toast.success("Zmiany zostały zapisane", {
          position: "bottom-right",
          description: "Wiadomość została usunięta",
        });
        queryClient.invalidateQueries({ queryKey: ["funny-messages"] });
      },
    });
  };

  const onDeleteCancel = () => {
    setMessageToDelete(null);
  };

  const onCreateFunnyMessage = (): void => {
    setIsCreatingFunnyMessage(true);
  };

  const onEditFunnyMessage = (messageId: string) => {
    if (messageId) setSelectedMessageId(messageId);
  };

  const onResetAllFilters = () => {
    setFilterTitle("");
    setFilterAuthor("");
  };

  const hasMessages = (funnyMessages?.data?.length ?? 0) > 0;
  const hasFilters = !!filterTitle || !!filterAuthor;
  const showFilterBar = usersData && (hasMessages || hasFilters);

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="flex w-full pb-5 max-w-[1320px] mx-auto"
    >
      <div className="w-full">
        <FunnyMessagesHeader onCreateFunnyMessage={onCreateFunnyMessage} userPermissions={userPermissions} />

        {showFilterBar && (
          <FunnyMessagesFilterBar
            selectedTitle={filterTitle}
            selectedAuthor={filterAuthor}
            authors={usersData}
            onTitleChange={(e) => setFilterTitle(e.target.value)}
            onAuthorChange={(id) => setFilterAuthor(id)}
            onResetAll={onResetAllFilters}
            resultsCount={funnyMessages?.data?.length ?? 0}
          />
        )}
        <FunnyMessagesList
          isLoading={isFunnyMessagesLoading}
          messages={funnyMessages?.data ?? []}
          currentUserId={user?._id}
          onEdit={onEditFunnyMessage}
          onDelete={onDeleteClick}
          onCreate={onCreateFunnyMessage}
          canCreate={userPermissions.includes("ADD_FUN_MESSAGE")}
          canEdit={userPermissions.includes("EDIT_FUN_MESSAGE")}
          hasActiveFilters={hasFilters}
        />
      </div>

      <FunnyMessageModal
        isCreatingFunnyMessage={isCreatingFunnyMessage}
        setIsCreatingFunnyMessage={setIsCreatingFunnyMessage}
      />

      <EditFunnyMessageModal
        messageId={selectedMessageId}
        isOpen={!!selectedMessageId}
        setIsOpen={(open) => {
          if (!open) setSelectedMessageId(null);
        }}
      />

      {messageToDelete && (
        <Alert
          isOpen={!!messageToDelete}
          title="Usuń wiadomość"
          onCancel={onDeleteCancel}
          onConfirm={() => onDeleteConfirm(messageToDelete?._id)}
          isLoading={isDeleteLoading}
        >
          Czy na pewno chcesz usunąć wiadomość <strong>{messageToDelete?.title}</strong>?
        </Alert>
      )}
    </motion.div>
  );
};
