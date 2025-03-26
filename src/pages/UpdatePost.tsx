import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { toast } from "sonner";

import { GET_POST_BY_ID } from "@/graphql/queries";
import { IPost } from "@/types";
import PostForm from "@/components/forms/PostForm";
import { Loader } from "@/components/shared";
import { Button } from "@/components/ui";

const UpdatePost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<IPost | null>(null);

  const [getPost, { loading }] = useLazyQuery(GET_POST_BY_ID, {
    variables: { postId: id },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data && data.post) {
        setPost(data.post);
      }
    },
    onError: (error) => {
      toast.error("Error loading post: " + error.message);
      navigate("/");
    }
  });

  useEffect(() => {
    if (id) {
      getPost();
    }
  }, [id, getPost]);

  if (loading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="edit-post-container">
      <div className="edit-post-header">
        <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        <Button 
          variant="ghost" 
          className="shad-button_ghost"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </div>

      {post ? (
        <PostForm post={post} action="Update" />
      ) : (
        <div className="flex-center w-full h-full">
          <p className="text-light-4">Post not found</p>
        </div>
      )}
    </div>
  );
};

export default UpdatePost; 