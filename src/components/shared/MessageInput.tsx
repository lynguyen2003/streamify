import { useState, FormEvent, KeyboardEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Image, X } from 'lucide-react';
import { useSendMessageMutation } from '@/lib/api/react-queries';

interface MessageInputProps {
  conversationId: string;
}

const MessageInput = ({ conversationId }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { sendMessage, loading: isSending } = useSendMessageMutation();
  
  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    if (!message.trim() && !mediaUrl) return;
    
    try {
      await sendMessage({
        conversationId,
        content: message,
        contentType,
        mediaUrl: mediaUrl || undefined
      });
      
      // Reset form
      setMessage('');
      setMediaUrl(null);
      setPreviewUrl(null);
      setContentType('text');
      setIsAttaching(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For now, let's handle only images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // In a real app, you would upload the file to a server and get back a URL
      // For this example, we'll just use the data URL
      setMediaUrl(URL.createObjectURL(file));
      setContentType('image');
    }
  };
  
  const handleRemoveAttachment = () => {
    setPreviewUrl(null);
    setMediaUrl(null);
    setContentType('text');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-dark-4">
      {previewUrl && (
        <div className="relative mb-2 inline-block">
          <img 
            src={previewUrl} 
            alt="Attachment preview" 
            className="max-h-20 rounded-md"
          />
          <button
            type="button"
            onClick={handleRemoveAttachment}
            className="absolute top-0 right-0 bg-red rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
          >
            <X className="h-3 w-3 text-white" />
          </button>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="resize-none min-h-[40px] max-h-[200px] bg-dark-3 border-none focus-visible:ring-primary-500"
            disabled={isSending}
          />
        </div>
        
        <div className="flex gap-1">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
            className="text-light-3 hover:text-primary-500 hover:bg-transparent"
          >
            <Image className="h-5 w-5" />
          </Button>
          
          <Button
            type="submit"
            size="icon"
            disabled={isSending || (!message.trim() && !mediaUrl)}
            className="bg-primary-500 hover:bg-primary-600"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput; 