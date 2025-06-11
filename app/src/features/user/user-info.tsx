import { UserAvatar } from "./user-avatar";

export const UserInfo = ({
  user,
  size = "md",
}: {
  user: { name: string; email: string; image?: string };
  size: "lg" | "md";
}) => {
  const map = {
    md: (
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row items-center gap-4">
          <UserAvatar src={user.image} className="h-15 w-15" alt="user" />
          <div className="flex flex-col gap-2">
            <p className="text-foreground/90 text-bold text-lg">{user.name}</p>
            <p className="text-foreground/70 text-sm">{user.email}</p>
          </div>
        </div>
      </div>
    ),
    lg: (
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row items-center gap-4">
          <UserAvatar
            src={user.image}
            className="h-15 w-15 md:h-18 md:w-18 lg:h-20 lg:w-20"
            alt="user"
          />
          <div className="flex flex-col gap-2">
            <p className="text-foreground/90 text-bold text-lg md:text-xl lg:text-2xl">
              {user.name}
            </p>
            <p className="text-foreground/70 md:text-md text-sm lg:text-lg">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    ),
  };
  return map[size];
};
