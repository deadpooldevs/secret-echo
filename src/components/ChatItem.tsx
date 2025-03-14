
import React from 'react';
import { Clock, ShieldAlert, Check, CheckCheck, Lock } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { cn } from '@/lib/utils';
import { Chat, formatMessageTime } from '@/utils/messageUtils';
import { StaggerItem } from './Transitions';

interface ChatItemProps {
  chat: Chat;
  isActive?: boolean;
  onClick: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isActive = false, onClick }) => {
  const otherUser = chat.participants.find(p => p.id !== 'current');
  
  if (!otherUser) return null;
  
  const { lastMessage, unreadCount } = chat;
  const messageStatus = lastMessage?.status;
  const messageTime = lastMessage ? formatMessageTime(lastMessage.timestamp) : '';
  const isOwnMessage = lastMessage?.senderId === 'current';

  const statusIcon = (() => {
    if (!isOwnMessage) return null;
    
    switch (messageStatus) {
      case 'sent':
        return <Check size={14} className="text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-muted-foreground" />;
      case 'read':
        return <CheckCheck size={14} className="text-primary" />;
      default:
        return <Clock size={14} className="text-muted-foreground" />;
    }
  })();

  return (
    <StaggerItem>
      <div 
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer",
          isActive 
            ? "bg-primary/10 dark:bg-primary/20" 
            : "hover:bg-secondary/80 dark:hover:bg-secondary/20"
        )}
        onClick={onClick}
      >
        <UserAvatar 
          username={otherUser.username} 
          status={otherUser.status}
          size="md"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <div className="font-medium truncate">{otherUser.username}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
              {messageTime}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-sm text-muted-foreground truncate max-w-[180px] md:max-w-[240px]">
              {chat.isAnonymous && (
                <Lock size={12} className="shrink-0 text-primary/80" />
              )}
              
              {lastMessage?.isDeleted ? (
                <span className="italic">Message deleted</span>
              ) : (
                <>
                  {isOwnMessage && <span className="shrink-0">You: </span>}
                  {lastMessage?.content || "Start a conversation"}
                </>
              )}
            </div>
            
            <div className="flex items-center gap-1.5 ml-2">
              {statusIcon}
              
              {unreadCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </StaggerItem>
  );
};

export default ChatItem;
