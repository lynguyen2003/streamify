import { IPost } from "@/types";
import { Link } from "react-router-dom";

type GridPostListProps = {
  posts: IPost[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {

  return (
    <>
      {posts.map((post) => (
        <li key={post._id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post._id}`} className="grid-post_link">
            <img
              src={post.mediaUrls[0]}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>
        
          <div className="grid-post_user">
              <div className="flex items-center justify-between gap-2 flex-1">
                {showUser && (
                  <div className="flex items-center gap-2 flex-1">
                    <img
                      src={
                        post.author.imageUrl ||
                        "/assets/icons/profile-placeholder.svg"
                      }
                      alt="creator"
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="line-clamp-1">{post.author.username}</p>
                  </div>
                )}

                {showStats && (
                  <div className="flex gap-2 mr-5">
                    <img
                      src="/assets/icons/like.svg"
                      alt="like"
                      width={20}
                      height={20}
                      className="cursor-pointer"
                    />
                    <p className="small-medium lg:base-medium my-auto">
                      {post.likeCount}
                    </p>
                  </div>
                )}
              </div>
          </div>
        </li>
      ))}
    </>
  );
};

export default GridPostList;
