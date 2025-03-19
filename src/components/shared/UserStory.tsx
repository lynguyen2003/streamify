import { IUser } from "@/types";

type UserStoryProps = {
  user: IUser;
};

const UserStory = ({ user }: UserStoryProps) => {
  return (
    <>
      <div className="flex flex-col items-center relative cursor-pointer">
        <div className="rounded-full bg-avatar-gradient p-[3px]">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="Avatar"
            width={60}
            height={60}
            className="object-cover border-2 border-dark-1 rounded-full"
          />
        </div>
        <p className="subtle-semibold text-light-1 text-center w-14 mt-1 line-clamp-1">
          {user.username}
        </p>
      </div>
    </>
  );
};

export default UserStory;
