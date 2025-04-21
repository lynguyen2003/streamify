import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader } from '@/components/shared';
import { Search, X } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { IUser } from '@/types';
import { useCreateConversationMutation, useSearchUsers } from '@/lib/api/react-queries';
import useDebounce from '@/hooks/useDebounce';

interface NewConversationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewConversationDialog = ({ isOpen, onClose }: NewConversationDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { data: searchResults, isLoading: isSearching } = useSearchUsers(debouncedSearchQuery);
  
  const { createConversation, loading: isCreating } = useCreateConversationMutation();
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleSelectUser = (selectedUser: IUser) => {
    setSelectedUsers(prev => [...prev, selectedUser]);
    setSearchQuery('');
  };
  
  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u._id !== userId));
  };
  
  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      const response = await createConversation({
        participantIds: selectedUsers.map(u => u._id),
        type: isGroupChat ? 'group' : 'direct',
        name: isGroupChat ? groupName : undefined,
        initialMessage: initialMessage || undefined
      });
      
      const conversation = response?.data?.createConversation;
      if (conversation && conversation._id) {
        navigate(`/chat/${conversation._id}`);
        onClose();
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };
  
  // Filter out already selected users
  const filteredResults = searchResults?.filter((user: IUser) => 
    !selectedUsers.some(selected => selected._id === user._id)
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            {isGroupChat 
              ? 'Create a group chat with multiple people' 
              : 'Start a conversation with someone'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedUsers.map(user => (
              <div 
                key={user._id}
                className="flex items-center gap-1 bg-dark-3 px-2 py-1 rounded-full"
              >
                <img 
                  src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt={user.username}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-sm">{user.username}</span>
                <button 
                  type="button"
                  onClick={() => handleRemoveUser(user._id)}
                  className="text-light-3 hover:text-red"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-2.5 text-light-3">
              <Search className="h-4 w-4" />
            </div>
            <Input
              placeholder="Search for people..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 bg-dark-3 border-none"
            />
          </div>
          
          {isSearching ? (
            <div className="flex-center py-4">
              <Loader />
            </div>
          ) : filteredResults && filteredResults.length > 0 ? (
            <div className="mt-2 max-h-40 overflow-y-auto">
              {filteredResults.map((user: IUser) => (
                <div 
                  key={user._id}
                  className="flex items-center gap-2 p-2 hover:bg-dark-3 rounded-md cursor-pointer"
                  onClick={() => handleSelectUser(user)}
                >
                  <img 
                    src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-light-3">{user.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : debouncedSearchQuery && !isSearching ? (
            <p className="text-center text-light-3 my-4">No users found</p>
          ) : null}
          
          {selectedUsers.length > 1 && (
            <div className="flex items-center gap-2 mt-4">
              <Button
                type="button"
                variant={isGroupChat ? "default" : "outline"}
                onClick={() => setIsGroupChat(true)}
                className="h-8 px-3"
              >
                Group Chat
              </Button>
              <Button
                type="button"
                variant={!isGroupChat ? "default" : "outline"}
                onClick={() => setIsGroupChat(false)}
                className="h-8 px-3"
              >
                Direct Message
              </Button>
            </div>
          )}
          
          {isGroupChat && (
            <div className="mt-4">
              <Input
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-dark-3 border-none mb-2"
              />
            </div>
          )}
          
          <div className="mt-4">
            <Textarea
              placeholder="Send a message (optional)"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              className="bg-dark-3 border-none resize-none h-20"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateConversation}
            disabled={selectedUsers.length === 0 || isCreating || (isGroupChat && !groupName)}
          >
            {isCreating ? <Loader /> : 'Start Chat'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog; 