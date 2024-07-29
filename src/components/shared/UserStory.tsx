import { Models } from "appwrite";

type UserStoryProps = {
  user: Models.Document;
};

const UserStory = ({ user }: UserStoryProps) => {
  return (
    <>
      <div className="flex flex-col relative gap-2 cursor-pointer">
        <div className="w-20 h-20 rounded-full bg-avatar-gradient p-[4px]">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="Avatar"
            className="w-full h-full object-cover border-2 border-dark-1 rounded-full"
          />
        </div>
        <p className="w-20 subtle-semibold text-light-1 text-center line-clamp-1">
          {user.username}
        </p>
      </div>
    </>
  );
};

export default UserStory;
