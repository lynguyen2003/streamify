import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteConversations } from '@/lib/api/react-queries';
import ConversationItem from './ConversationItem';
import { Loader, SearchBox } from '@/components/shared';
import { useParams } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import NewConversationDialog from '@/components/dialog/NewConversationDialog';

const ConversationsList = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const { ref, inView } = useInView();
  const debouncedInView = useDebounce(inView, 300);
  
  const {
    data: conversationsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteConversations();
  
  // For handling search results from backend
  // const { data: searchResults, isFetching: isSearching } = useSearchConversations(debouncedSearch);
  
  // Fetch more conversations when scrolling
  useEffect(() => {
    if (debouncedInView && hasNextPage) {
      fetchNextPage();
    }
  }, [debouncedInView, fetchNextPage, hasNextPage]);
  
  // Client-side filtering
  const filteredConversations = debouncedSearch
    ? conversationsData?.pages.flatMap(page => 
        page.edges.filter((edge: { node: any }) => {
          const conversation = edge.node;
          const participantNames = conversation.participants.map((p: { username: string }) => 
            p.username.toLowerCase()
          ).join(' ');
          const name = conversation.name?.toLowerCase() || '';
          const lastMessage = conversation.lastMessage?.content.toLowerCase() || '';
          
          return participantNames.includes(debouncedSearch.toLowerCase()) || 
                 name.includes(debouncedSearch.toLowerCase()) ||
                 lastMessage.includes(debouncedSearch.toLowerCase());
        })
      )
    : null;
  
  const hasConversations = conversationsData?.pages.some(page => page.edges.length > 0);
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-dark-4">
        <h2 className="text-xl font-bold">Messages</h2>
        <Button 
          size="icon" 
          onClick={() => setIsNewChatOpen(true)}
          className="h-8 w-8"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="p-3">
        <SearchBox
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-dark-3"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex-center p-4">
            <Loader />
          </div>
        ) : !hasConversations ? (
          <div className="text-center text-light-3 p-4">
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Start a new chat with the + button</p>
          </div>
        ) : debouncedSearch && filteredConversations ? (
          // Show search results
          filteredConversations.length > 0 ? (
            <div className="py-2">
              {filteredConversations.map(edge => (
                <ConversationItem 
                  key={edge.node._id} 
                  conversation={edge.node} 
                  isActive={edge.node._id === conversationId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-light-3 p-4">
              <p>No conversations match your search</p>
            </div>
          )
        ) : (
          // Show all conversations
          <div className="py-2">
            {conversationsData?.pages.map((page, i) => (
              <div key={i}>
                {page.edges.map((edge: { node: any }) => (
                  <ConversationItem 
                    key={edge.node._id} 
                    conversation={edge.node} 
                    isActive={edge.node._id === conversationId}
                  />
                ))}
              </div>
            ))}
            
            {hasNextPage && (
              <div ref={ref} className="flex-center p-4">
                <Loader />
              </div>
            )}
          </div>
        )}
      </div>
      
      {isNewChatOpen && (
        <NewConversationDialog
          isOpen={isNewChatOpen}
          onClose={() => setIsNewChatOpen(false)}
        />
      )}
    </div>
  );
};

export default ConversationsList; 