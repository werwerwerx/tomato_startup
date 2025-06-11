import { UserAvatar } from "./user-avatar";

export const UserInfo = ({
  user,
}: {
  user: { name: string; email: string; image?: string };
}) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex flex-row items-center gap-4">
        <UserAvatar src={user.image} className="h-15 w-15" alt="user" />
        <div className="flex flex-col gap-2">
          <p className="text-foreground/90 text-bold text-lg">{user.name}</p>
          <p className="text-foreground/70 text-sm">{user.email}</p>
        </div>
      </div>
    </div>
  );
};
