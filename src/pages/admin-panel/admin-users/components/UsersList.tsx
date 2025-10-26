import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import UserListItemCard, { type IUser } from "./userList-item-card";

interface UsersListProps {
  users: IUser[];
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  onRequestReset: (user: IUser) => void;
  onRequestToggle: (user: IUser) => void;
}

export const UsersList = ({ users, isLoading, isError, error, onRequestReset, onRequestToggle }: UsersListProps) => {
  return (
    <Card className="bg-transparent shadow-none pr-4">
      <CardContent className="p-0">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin w-6 h-6" />
          </div>
        )}

        {isError && (
          <p className="text-destructive text-center mt-10">
            {error?.message || "Błąd podczas ładowania użytkowników"}
          </p>
        )}

        {!isLoading && !isError && users.length === 0 && (
          <p className="text-center mt-10">Nie znaleziono użytkowników</p>
        )}

        {!isLoading && !isError && users.length > 0 && (
          <ul className="space-y-4">
            {users.map((user) => (
              <UserListItemCard
                key={user._id}
                user={user}
                onRequestResetPassword={onRequestReset}
                onRequestAccountStatustoggle={onRequestToggle}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
