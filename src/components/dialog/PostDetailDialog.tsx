import {
    Dialog,
    DialogClose,
    DialogContent,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { formatTimestamp } from "@/lib/utils";
import { Link } from "react-router-dom";
import { IPost } from "@/types";
import { PostStats, PostComments, Loader, CommentCard } from "@/components/shared";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RootState } from "@/store";
import { Button } from "../ui";
import { useGetPostById } from "@/lib/api/react-queries";
import { DialogTitle } from "@radix-ui/react-dialog";

type PostDetailDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    id: string;
};
  
const PostDetailDialog = ({ isOpen, onOpenChange, id }: PostDetailDialogProps) => {
    const [ post, setPost ] = useState<IPost>();
    const authUser = useAppSelector((state: RootState) => state.auth);
    const { data, isPending } = useGetPostById(id);

    useEffect(() => {
        if (isOpen && data) {
            setPost(data);
        }
    }, [isOpen, data]);

    //const hasMultipleMedia = post?.mediaUrls && post?.mediaUrls.length > 1;

    const handleDeletePost = () => {
        
    }

    return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTitle className="sr-only">Post Details</DialogTitle>
        <DialogContent className="w-full h-full lg:h-auto max-w-md lg:max-w-5xl bg-dark-2 lg:p-3 border-dark-4">
        <div className="post_details-container">
            {isPending || !post ? (
                <Loader />
            ) : (
                <div className="post_details-card relative">
                    <DialogClose className="absolute top-2 right-2 flex px-2 py-2 lg:hidden justify-end bg-light-2 rounded-full focus:outline-none">
                        <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M41.2861 6.71387L24.0001 23.9999L6.70605 41.2939" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M41.298 41.298L6.70801 6.70801" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </DialogClose>
                    <img
                        src="/assets/images/side-img.svg"
                        alt="creator"
                        className="post_details-img"
                    />

                    <div className="post_details-info">
                        <div className="flex-between w-full">
                        <Link
                            to={`/profile/${post?.author._id}`}
                            className="flex items-center gap-3">
                            <img
                            src={
                                post?.author.imageUrl ||
                                "/assets/icons/profile-placeholder.svg"
                            }
                            alt="creator"
                            className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                            />
                            <div className="flex gap-1 flex-col">
                            <p className="base-medium lg:body-bold text-light-1">
                                {post?.author.username}
                            </p>
                            <div className="flex-center gap-2 text-light-3">
                                <p className="subtle-semibold lg:small-regular ">
                                {post?.createdAt ? formatTimestamp(parseInt(post.createdAt), 'dateTime') : ''}
                                </p>
                                •
                                <p className="subtle-semibold lg:small-regular">
                                {post?.location}
                                </p>
                            </div>
                            </div>
                        </Link>

                        <div className="flex-center gap-4">
                            <Link
                            to={`/update-post/${post?._id}`}
                            className={`${authUser.user?._id !== post?.author._id && "hidden"}`}>
                            <img
                                src={"/assets/icons/edit.svg"}
                                alt="edit"
                                width={24}
                                height={24}
                            />
                            </Link>

                            <Button
                            onClick={handleDeletePost}
                            variant="ghost"
                            className={`ost_details-delete_btn ${
                                authUser.user?._id !== post?.author._id && "hidden"
                            }`}>
                            <img
                                src={"/assets/icons/delete.svg"}
                                alt="delete"
                                width={24}
                                height={24}
                            />
                            </Button>
                        </div>
                        </div>

                        <div className="flex flex-col w-full small-medium lg:base-regular">
                        <p>{post?.caption}</p>
                        <ul className="flex gap-1 mt-2">
                            {post?.tags.map((tag: string, index: number) => (
                            <li
                                key={`${tag}${index}`}
                                className="text-light-3 small-regular">
                                #{tag}
                            </li>
                            ))}
                        </ul>
                        </div>

                        <hr className="border w-full border-dark-4/80" />

                        <div className="w-full flex-1 bg-dark-2 rounded-lg">
                            <CommentCard post={post} />
                        </div>

                        <div className="w-full">
                            <PostStats post={post} />
                        </div>
                        <div className="w-full">
                            <PostComments post={post} />
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-5xl">
                <hr className="border w-full border-dark-4/80" />

                <h3 className="body-bold md:h3-bold w-full my-10">
                More Related Posts
                </h3>
                {isPending || !post ? (
                    <Loader />
                ) : (
                    <p>No related posts</p>
                )}
            </div>
        </div>
        </DialogContent>
    </Dialog>
    );
};

export default PostDetailDialog; 