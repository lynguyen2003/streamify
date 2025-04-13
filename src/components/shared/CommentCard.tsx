import { IComment, IPost } from "@/types";
import { formatTimestamp } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_COMMENTS } from "@/graphql/queries";
import Loader from "./Loader";

type CommentCardProps = {
    post: IPost;
}

const CommentCard = ({ post }: CommentCardProps) => {
    const [showReplies, setShowReplies] = useState(true);

    const { data, loading } = useQuery(GET_COMMENTS, {
        variables: {
            postId: post._id
        }
    })

    if(loading) 
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Loader />
        </div>
    )

    return (
        <div className="w-full">
            <ul className="flex flex-col w-full gap-5 overflow-y-auto custom-scrollbar-hidden px-2">
                {!data?.comments?.length ? (
                    <p className="subtle-regular text-light-3">No comments yet</p>
                ) : (
                    data?.comments.map((comment: IComment) => (
                        <li key={comment._id} className="flex flex-col gap-2">
                            <div className="flex flex-row items-center justify-between w-full gap-2 min-w-0">
                                <img
                                    src={comment.author.imageUrl}
                                    alt={comment.author.username}
                                    width={36}
                                    height={36}
                                    className="rounded-full flex-shrink-0 cursor-pointer"
                                />

                                <div className="w-full flex flex-col gap-1">
                                    <div className="flex flex-row items-center gap-2">
                                        <p className="small-medium text-light-3 whitespace-nowrap overflow-hidden text-ellipsis hover:text-light-4 cursor-pointer">{comment.author.username}</p>
                                        <p className="small-medium text-light-2 max-w-[200px] overflow-hidden">{comment.content}</p>
                                    </div>
                                    <div className="flex flex-row gap-1">
                                        <p className="tiny-medium text-light-3 whitespace-nowrap overflow-hidden">
                                            {comment.createdAt ? formatTimestamp(parseInt(comment.createdAt), 'relative') : ''}
                                        </p>
                                        <div className="flex flex-row gap-1">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M5.85103 3.77414C6.02188 3.94499 6.02188 4.222 5.85103 4.39286L3.68122 6.56266L8.45833 6.56266C9.01445 6.56266 9.8389 6.7259 10.5369 7.22845C11.2572 7.74706 11.8125 8.60757 11.8125 9.91683C11.8125 10.1585 11.6166 10.3543 11.375 10.3543C11.1334 10.3543 10.9375 10.1585 10.9375 9.91683C10.9375 8.89275 10.5206 8.29493 10.0256 7.93854C9.50832 7.56609 8.87443 7.43766 8.45833 7.43766L3.68122 7.43766L5.85103 9.60747C6.02188 9.77833 6.02188 10.0553 5.85103 10.2262C5.68017 10.397 5.40316 10.397 5.23231 10.2262L2.31564 7.30952C2.14479 7.13867 2.14479 6.86166 2.31564 6.6908L5.23231 3.77414C5.40316 3.60328 5.68017 3.60328 5.85103 3.77414Z" fill="#FFB620"/>
                                            </svg>
                                            <p className="tiny-medium text-light-2 hover:underline cursor-pointer">Reply</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row justify-end gap-1 flex-shrink-0 ">
                                    <img src="/assets/icons/like.svg" alt="like" width={16} height={16} className="cursor-pointer hover:scale-110 transition-all duration-100"/>
                                    <p className="tiny-medium text-light-3">{comment?.likes?.length}</p>
                                </div>
                            </div>
                            {showReplies && (
                                <div className="flex flex-row items-center ml-10">
                                    <div className="w-5 h-[1px] bg-light-3 mr-2"></div>
                                    <button className="flex items-center gap-1 text-xs text-light-3">
                                        <span>View replies ({comment.replies?.length || 0})</span>
                                    </button>
                                </div>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}

export default CommentCard;
