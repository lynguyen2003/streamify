import { useParams, Navigate } from 'react-router-dom';
import { useGetConversation } from '@/lib/api/react-queries';
import { Loader } from '@/components/shared';
import ConversationsList from '@/components/shared/ConversationsList';
import ChatMessages from '@/components/shared/ChatMessages';
import MessageInput from '@/components/shared/MessageInput';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, Phone, Video } from 'lucide-react';

const Chat = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  
  // Fetch conversation details if ID is provided
  const { data: conversation, isLoading } = useGetConversation(conversationId || '');
  
  if (!conversationId) {
    return (
      <div className="h-screen w-full flex">
        <div className="w-80 border-r border-dark-4 h-full">
          <ConversationsList />
        </div>
        
        <div className="flex-1 flex-center flex-col text-light-3">
          <img 
            src="/assets/icons/chat-placeholder.svg" 
            alt="Select a conversation" 
            className="w-24 h-24 mb-4 opacity-50"
          />
          <h2 className="text-xl font-bold mb-2">Your Messages</h2>
          <p className="text-center max-w-md">
            Select a conversation or start a new one to send private messages to friends
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-1">
      {/* Sidebar */}
      <div className="w-80 border-r border-dark-4 h-full hidden md:block">
        <ConversationsList />
      </div>
      
      {/* Main chat area */}
      <div className="flex flex-col w-full h-full">
        {isLoading ? (
          <div className="flex-center h-full">
            <Loader />
          </div>
        ) : !conversation ? (
          <Navigate to="/chat" replace />
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-dark-4">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 md:hidden"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                
                <div className="flex items-center">
                  <img 
                    src={
                      conversation.type === 'direct'
                        ? conversation.participants.find((p: any) => 
                            p._id !== localStorage.getItem('userInfo')
                          )?.imageUrl || '/assets/icons/profile-placeholder.svg'
                        : '/assets/icons/group-chat.svg'
                    }
                    alt="Avatar"
                    className="w-9 h-9 rounded-full mr-3"
                  />
                  
                  <div>
                    <h3 className="font-semibold">
                        {conversation.type === 'direct'
                        ? conversation.participants.find((p: any) => 
                            p._id !== localStorage.getItem('userInfo')
                          )?.username
                        : conversation.name}
                    </h3>
                    <p className="text-xs text-light-3">
                      {conversation.type === 'direct' ? 'Online' : `${conversation.participants.length} members`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Messages area */}
            <div className="flex-1 overflow-hidden">
              <ChatMessages conversationId={conversationId} />
            </div>
            
            {/* Message input */}
            <MessageInput conversationId={conversationId} />
          </>
        )}
      </div>
    </div>
  );
};

export default Chat; 