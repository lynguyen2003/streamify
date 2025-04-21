import { useAuthContext } from '@/context/AuthContext';
import { IConversation } from '@/types';
import { formatTimestamp } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ConversationItemProps {
  conversation: IConversation;
  isActive?: boolean;
}

const ConversationItem = ({ conversation, isActive = false }: ConversationItemProps) => {
  const { user } = useAuthContext();
  
  // Get the other participant(s) in the conversation
  const otherParticipants = conversation.participants.filter(
    participant => participant._id !== user?._id
  );
  
  const displayName = conversation.type === 'group' && conversation.name 
    ? conversation.name 
    : otherParticipants[0]?.username;
  
  // Use first other participant's image for direct chat
  const displayImage = conversation.type === 'direct'
    ? otherParticipants[0]?.imageUrl || '/assets/icons/profile-placeholder.svg'
    : '/assets/icons/group-chat.svg';
  
  // Create a preview of the last message
  const messagePreview = conversation.lastMessage 
    ? conversation.lastMessage.contentType === 'text'
      ? conversation.lastMessage.content.length > 40
        ? conversation.lastMessage.content.substring(0, 37) + '...'
        : conversation.lastMessage.content
      : conversation.lastMessage.contentType === 'image'
        ? '🖼️ Image'
        : conversation.lastMessage.contentType === 'video'
          ? '🎥 Video'
          : conversation.lastMessage.contentType === 'audio'
            ? '🔊 Audio'
            : 'Message'
    : 'Start a conversation';
    
  return (
    <Link to={`/chat/${conversation._id}`}>
      <div 
        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
          isActive 
            ? 'bg-primary-500 bg-opacity-20' 
            : 'hover:bg-dark-3'
        }`}
      >
        <div className="relative">
          <img
            src={displayImage}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover"
          />
          {conversation.unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red rounded-full w-5 h-5 flex-center">
              <span className="text-[10px] text-white font-bold">
                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
              </span>
            </div>
          )}
        </div>
        
        <div className="ml-3 flex-1 overflow-hidden">
          <div className="flex justify-between items-center">
            <h4 className={`font-semibold truncate ${
              conversation.unreadCount > 0 ? 'text-light-1' : 'text-light-2'
            }`}>
              {displayName}
            </h4>
            {conversation.lastMessage?.createdAt && (
              <span className="text-xs text-light-3 whitespace-nowrap">
                {formatTimestamp(parseInt(conversation.lastMessage.createdAt), 'auto')}
              </span>
            )}
          </div>
          
          <p className={`text-sm truncate mt-1 ${
            conversation.unreadCount > 0 
              ? 'text-light-2 font-medium' 
              : 'text-light-3'
          }`}>
            {conversation.lastMessage?.sender._id === user?._id && 'You: '}
            {messagePreview}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ConversationItem; 