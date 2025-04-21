import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteMessages, useMarkConversationAsReadMutation } from '@/lib/api/react-queries';
import MessageItem from './MessageItem';
import { Loader } from '@/components/shared';
import useDebounce from '@/hooks/useDebounce';
import { IMessage } from '@/types';

interface ChatMessagesProps {
  conversationId: string;
}

const ChatMessages = ({ conversationId }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();
  const debouncedInView = useDebounce(inView, 300);
  const { markConversationAsRead } = useMarkConversationAsReadMutation();
  
  const {
    data: messagesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteMessages(conversationId);
  
  // Mark conversation as read when opened
  /* useEffect(() => {
    const markAsRead = async () => {
      if (conversationId) {
        await markConversationAsRead(conversationId);
      }
    };
    
    markAsRead();
  }, [conversationId, markConversationAsRead]); */
  
  // Fetch more messages when scrolling to the top
  useEffect(() => {
    if (debouncedInView && hasNextPage) {
      fetchNextPage();
    }
  }, [debouncedInView, fetchNextPage, hasNextPage]);
  
  // Scroll to bottom when first message loads
  useEffect(() => {
    if (messagesData && !isLoading && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesData, isLoading]);
  
  if (isLoading) {
    return (
      <div className="flex-center h-full">
        <Loader />
      </div>
    );
  }
  
  // Check if there are messages to display
  const hasMessages = messagesData?.pages.some(page => page.edges.length > 0);
  
  if (!hasMessages) {
    return (
      <div className="flex-center h-full text-light-3">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col-reverse h-full overflow-y-auto px-4 py-2">
      <div ref={messagesEndRef} />
      
      {messagesData?.pages.map((page, pageIndex) => (
        <div key={`page_${pageIndex}`}>
          {page.edges.map((edge: { node: IMessage }) => (
            <MessageItem key={edge.node._id} message={edge.node} />
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <div ref={ref} className="flex-center py-2">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default ChatMessages; 