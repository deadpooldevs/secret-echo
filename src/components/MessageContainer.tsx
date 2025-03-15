
import React, { useEffect, useRef, useState } from 'react';
import Message from './Message';
import { User, Message as MessageType } from '@/utils/messageUtils';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import UserAvatar from './UserAvatar';
import MessageInput from './MessageInput';
import { toast } from "sonner";
import { FadeIn } from './Transitions';

interface MessageContainerProps {
  chatId: string;
  username: string;
  messages?: MessageType[];
  receiver?: User;
  onSendMessage?: (content: string) => void;
  onBack?: () => void;
  onDeleteMessage?: (id: string) => void;
}

const MessageContainer: React.FC<MessageContainerProps> = ({
  chatId,
  username,
  messages = [],
  receiver = { id: 'placeholder', username: 'User', status: 'offline' },
  onSendMessage = () => toast.info("Sending messages not implemented yet"),
  onBack = () => {},
  onDeleteMessage = () => toast.info("Delete message functionality not implemented yet"),
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (content: string) => {
    onSendMessage(content);
  };
  
  const handleAttachFile = (type: 'image' | 'video' | 'file') => {
    toast.info(`${type} attachment functionality coming soon`);
  };

  // For now, just display a placeholder when in development
  if (!receiver.username || receiver.username === 'User') {
    return (
      <div className="flex flex-col h-full max-h-screen">
        <div className="sticky top-0 z-10 flex items-center justify-between p-3 border-b bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-secondary transition-colors"
              onClick={onBack}
            >
              <ArrowLeft size={18} />
            </button>
            
            <UserAvatar username={receiver.username} status={receiver.status} />
            
            <div>
              <div className="font-medium">{receiver.username}</div>
              <div className="text-xs text-muted-foreground">
                {receiver.status === 'online' ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <Phone size={18} />
            </button>
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <Video size={18} />
            </button>
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
        
        <FadeIn className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <div className="mb-3 text-4xl">👋</div>
            <p className="mb-1 text-lg font-medium">Select a chat to start messaging</p>
            <p className="text-sm">This is chat ID: {chatId}</p>
          </div>
        </FadeIn>
        
        <MessageInput
          onSendMessage={handleSendMessage}
          onAttachFile={handleAttachFile}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="sticky top-0 z-10 flex items-center justify-between p-3 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-secondary transition-colors"
            onClick={onBack}
          >
            <ArrowLeft size={18} />
          </button>
          
          <UserAvatar username={receiver.username} status={receiver.status} />
          
          <div>
            <div className="font-medium">{receiver.username}</div>
            <div className="text-xs text-muted-foreground">
              {receiver.status === 'online' ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Phone size={18} />
          </button>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Video size={18} />
          </button>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
      
      <FadeIn className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <div className="mb-3 text-4xl">👋</div>
            <p className="mb-1 text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start the conversation by sending a message</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isOwn={message.senderId === 'current'}
                onDelete={() => onDeleteMessage(message.id)}
                onReply={() => toast.info("Reply functionality coming soon")}
                onForward={() => toast.info("Forward functionality coming soon")}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </FadeIn>
      
      <MessageInput
        onSendMessage={handleSendMessage}
        onAttachFile={handleAttachFile}
      />
    </div>
  );
};

export default MessageContainer;
