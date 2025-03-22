import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { RootState } from '@/store';
import { IPost } from '@/types';

type PostCommentsProps = {
    post: IPost;
    onCommentSubmit: (comment: string) => Promise<void>;
};

const PostComments = ({ post, onCommentSubmit }: PostCommentsProps) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authUser = useAppSelector((state: RootState) => state.auth);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (onCommentSubmit) {
        await onCommentSubmit(comment);
      }
      setComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
        <form onSubmit={handleSubmitComment} className="flex items-center gap-2 p-2 rounded-lg">
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                    src={authUser?.user?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
            </div>
            
            {/* Comment Input */}
            <div className="flex-grow relative">
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full bg-dark-3 border-light-4 placeholder:text-light-4 text-light-2 rounded-lg py-2 px-4 focus:outline-none"
                > 
                </input>
                <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 disabled:opacity-50 p-2 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.1194 3.02553C14.1445 3.19897 12.83 3.63535 10.9852 4.25026L6.80919 5.64228C5.32583 6.13674 4.25143 6.49541 3.49256 6.81817C2.69917 7.15561 2.41693 7.39083 2.32527 7.5485C2.04293 8.03416 2.04293 8.63397 2.32527 9.11962C2.41693 9.27729 2.69917 9.51251 3.49256 9.84995C4.25143 10.1727 5.32583 10.5314 6.80919 11.0258C6.83261 11.0336 6.85574 11.0413 6.87858 11.0489C7.28372 11.1837 7.59869 11.2885 7.86963 11.4699C8.13067 11.6446 8.35491 11.8688 8.52966 12.1299C8.71104 12.4008 8.81581 12.7158 8.95058 13.1209C8.95817 13.1438 8.96587 13.1669 8.97368 13.1903C9.46813 14.6737 9.8268 15.7481 10.1496 16.507C10.487 17.3003 10.7222 17.5826 10.8799 17.6742C11.3655 17.9566 11.9654 17.9566 12.451 17.6742C12.6087 17.5826 12.8439 17.3003 13.1813 16.507C13.5041 15.7481 13.8628 14.6737 14.3572 13.1903L15.7492 9.01427C16.3642 7.16953 16.8005 5.85506 16.974 4.88008C17.1482 3.90046 17.0151 3.48433 16.7651 3.23439C16.5152 2.98444 16.0991 2.85126 15.1194 3.02553ZM14.8952 1.76481C15.9803 1.57177 16.9577 1.61601 17.6706 2.32893C18.3835 3.04184 18.4277 4.01919 18.2347 5.10435C18.0428 6.18296 17.5749 7.58663 16.9825 9.36375L15.5618 13.6261C15.0797 15.0722 14.7051 16.196 14.3597 17.0081C14.0265 17.7915 13.6565 18.4546 13.0946 18.7813C12.2111 19.2949 11.1198 19.2949 10.2363 18.7813C9.67436 18.4546 9.3044 17.7915 8.9712 17.0081C8.62577 16.196 8.25121 15.0723 7.76916 13.6261L7.75888 13.5953C7.58999 13.0886 7.53851 12.9512 7.46558 12.8422C7.38396 12.7203 7.27921 12.6156 7.15729 12.5339C7.04834 12.461 6.91091 12.4095 6.40425 12.2406L6.37339 12.2303C4.92723 11.7483 3.80353 11.3737 2.99138 11.0283C2.20798 10.6951 1.54493 10.3251 1.21824 9.76319C0.704597 8.87967 0.704598 7.78846 1.21824 6.90493C1.54493 6.34298 2.20798 5.97301 2.99138 5.63981C3.80354 5.29438 4.92725 4.91982 6.37344 4.43776L10.6358 3.01698C12.4129 2.42459 13.8166 1.95669 14.8952 1.76481ZM14.7336 5.27094C14.9822 5.52235 14.98 5.92773 14.7286 6.17638L11.3139 9.55343C11.0625 9.80208 10.6571 9.79983 10.4084 9.54842C10.1598 9.297 10.162 8.89162 10.4135 8.64297L13.8282 5.26592C14.0796 5.01727 14.485 5.01952 14.7336 5.27094Z" fill="#877EFF" fill-opacity="0.937255"/>
                    </svg>
                </button>
            </div>
        </form>
    </>
  );
};

export default PostComments;