import { Loader, GridPostList } from '@/components/shared';
import { useGetUserLikedPosts } from '@/lib/api/react-queries';

interface LikedPostsProps {
  userId: string;
}

const LikedPosts = ({ userId }: LikedPostsProps) => {
  const { data, isLoading } = useGetUserLikedPosts(userId);

  const likedPosts = data?.filter((post: any) =>  
    post.author._id !== userId
  );
  
  if (isLoading) {
    return (
      <div className="flex-center w-full h-60">
        <Loader />
      </div>
    );
  }

  if (!likedPosts || likedPosts.length === 0) {
    return (
      <div className="flex-center flex-col gap-4 h-full w-full py-10">
        <p className="text-light-3 text-xl font-medium">No posts liked yet</p>
        <p className="text-light-4">Your liked posts will appear here</p>
      </div>
    );
  }

  return (
    <ul className="user-grid">
      <GridPostList posts={likedPosts} showUser={true} />
    </ul>
  );
};

export default LikedPosts;