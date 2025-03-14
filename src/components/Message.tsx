
import React from 'react';
import { cn } from '@/lib/utils';
import { Message as MessageType, formatMessageTime, User } from '@/utils/messageUtils';
import { Check, CheckCheck, Clock, Trash2, Forward, Reply, ShieldAlert } from 'lucide-react';
import { SlideIn } from './Transitions';

interface MessageProps {
  message: MessageType;
  isOwn: boolean;
  showAvatar?: boolean;
  sender?: User;
  onDelete?: () => void;
  onReply?: () => void;
  onForward?: () => void;
}

const Message: React.FC<MessageProps> = ({
  message,
  isOwn,
  showAvatar = false,
  sender,
  onDelete,
  onReply,
  onForward,
}) => {
  const [showActions, setShowActions] = React.useState(false);
  
  const { content, timestamp, status, isDeleted, isForwarded, reactions } = message;
  
  const formattedTime = formatMessageTime(timestamp);
  
  // Determine if message can be deleted (within 15 minutes)
  const isWithinDeleteWindow = Date.now() - timestamp.getTime() < 15 * 60 * 1000;
  
  const statusIcon = (() => {
    if (!isOwn) return null;
    
    switch (status) {
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
    <SlideIn direction={isOwn ? 'right' : 'left'}>
      <div 
        className={cn(
          "flex items-end gap-2 group max-w-[85%] my-1",
          isOwn ? "ml-auto" : "mr-auto"
        )}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div
          className={cn(
            "flex flex-col",
            isOwn ? "order-2" : "order-1"
          )}
        >
          <div 
            className={cn(
              "px-4 py-2 rounded-t-2xl text-sm break-words relative",
              isOwn 
                ? "bg-primary text-primary-foreground rounded-bl-2xl rounded-br-sm" 
                : "bg-secondary dark:bg-secondary/80 rounded-br-2xl rounded-bl-sm",
              isDeleted && "italic opacity-70"
            )}
          >
            {isForwarded && (
              <div className="text-xs opacity-70 mb-1 flex items-center gap-1">
                <Forward size={12} />
                <span>Forwarded</span>
              </div>
            )}
            
            {isDeleted ? "This message was deleted" : content}

            <div 
              className={cn(
                "absolute -bottom-5 flex items-center text-xs whitespace-nowrap gap-1",
                isOwn ? "right-0" : "left-0"
              )}
            >
              <span className="text-muted-foreground">{formattedTime}</span>
              {statusIcon}
            </div>
          </div>

          {reactions && reactions.length > 0 && (
            <div 
              className={cn(
                "flex gap-1 mt-1 mb-2",
                isOwn ? "justify-end" : "justify-start"
              )}
            >
              {reactions.map((reaction, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center justify-center bg-secondary/80 rounded-full px-2 py-1 text-xs"
                >
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}
        </div>

        <div 
          className={cn(
            "flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pb-6",
            isOwn ? "order-1" : "order-2"
          )}
        >
          <button 
            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
            onClick={onReply}
          >
            <Reply size={14} />
          </button>
          
          <button 
            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
            onClick={onForward}
          >
            <Forward size={14} />
          </button>
          
          {isOwn && isWithinDeleteWindow && (
            <button 
              className="p-1.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={onDelete}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </SlideIn>
  );
};

export default Message;
