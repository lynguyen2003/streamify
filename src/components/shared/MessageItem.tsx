import { useState } from 'react';
import { IMessage } from '@/types';
import { useAuthContext } from '@/context/AuthContext';
import { formatTimestamp } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useDeleteMessageMutation } from '@/lib/api/react-queries';

interface MessageItemProps {
  message: IMessage;
}

const MessageItem = ({ message }: MessageItemProps) => {
  const { user } = useAuthContext();
  const { deleteMessage } = useDeleteMessageMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isCurrentUser = user?._id === message.sender._id;
  const formattedTime = formatTimestamp(parseInt(message.createdAt), 'auto');
  
  const handleDeleteMessage = async () => {
    if (!message._id) return;
    
    setIsDeleting(true);
    try {
      await deleteMessage(message._id);
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (message.deleted) {
    return (
      <div className={`flex w-full my-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`px-4 py-2 rounded-xl max-w-[70%] bg-dark-4 text-light-4 italic`}>
          <p className="text-sm">This message was deleted</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex w-full my-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && (
        <img 
          src={message.sender.imageUrl || '/assets/icons/profile-placeholder.svg'} 
          alt={message.sender.username} 
          className="w-8 h-8 rounded-full object-cover mr-2"
        />
      )}
      
      <div className="flex flex-col">
        <div className={`flex items-start ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div 
            className={`px-4 py-2 rounded-xl ${
              isCurrentUser 
                ? 'bg-primary-500 text-light-1 rounded-tr-none' 
                : 'bg-dark-4 text-light-1 rounded-tl-none'
            }`}
          >
            {!isCurrentUser && (
              <p className="text-xs text-primary-500 font-semibold mb-1">
                {message.sender.username}
              </p>
            )}
            
            {message.contentType === 'text' && <p>{message.content}</p>}
            
            {message.contentType === 'image' && message.mediaUrl && (
              <div className="my-1">
                <img 
                  src={message.mediaUrl} 
                  alt="Shared image" 
                  className="max-w-xs rounded-md" 
                />
                {message.content && <p className="mt-1">{message.content}</p>}
              </div>
            )}
          </div>
          
          {isCurrentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-red flex items-center gap-2"
                  onClick={handleDeleteMessage}
                  disabled={isDeleting}
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <p className={`text-xs text-light-4 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          {formattedTime}
        </p>
      </div>
    </div>
  );
};

export default MessageItem; 