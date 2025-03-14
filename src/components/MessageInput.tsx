
import React, { useState, useRef } from 'react';
import { Send, Paperclip, Clock, Smile, X, Image, FileText, Video } from 'lucide-react';
import { SlideUp } from './Transitions';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onAttachFile: (type: 'image' | 'video' | 'file') => void;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onAttachFile,
  placeholder = 'Type a message...',
}) => {
  const [message, setMessage] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="p-3 border-t bg-background/90 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-end bg-secondary/50 rounded-2xl transition-all focus-within:bg-background focus-within:ring-1 focus-within:ring-primary/50">
          <button
            type="button"
            className="flex items-center justify-center p-3 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
          >
            {showAttachMenu ? <X size={20} /> : <Paperclip size={20} />}
          </button>
          
          <textarea
            ref={textareaRef}
            className="flex-1 max-h-32 px-3 py-3 bg-transparent border-none resize-none focus:outline-none"
            placeholder={placeholder}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          
          <button
            type="button"
            className="flex items-center justify-center p-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Smile size={20} />
          </button>
          
          <button
            type="submit"
            className={`flex items-center justify-center p-3 text-primary transition-colors ${
              message.trim() ? 'opacity-100' : 'opacity-70'
            }`}
            disabled={!message.trim()}
          >
            <Send size={20} />
          </button>
        </div>
        
        {showAttachMenu && (
          <SlideUp className="absolute -top-16 left-0 right-0 flex items-center gap-2 p-2 bg-background rounded-xl border shadow-md">
            <button
              type="button"
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => {
                onAttachFile('image');
                setShowAttachMenu(false);
              }}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                <Image size={18} />
              </div>
              <span className="text-xs">Image</span>
            </button>
            
            <button
              type="button"
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => {
                onAttachFile('video');
                setShowAttachMenu(false);
              }}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 rounded-full">
                <Video size={18} />
              </div>
              <span className="text-xs">Video</span>
            </button>
            
            <button
              type="button"
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => {
                onAttachFile('file');
                setShowAttachMenu(false);
              }}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300 rounded-full">
                <FileText size={18} />
              </div>
              <span className="text-xs">File</span>
            </button>
            
            <button
              type="button"
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary transition-colors ml-auto"
              onClick={() => setShowAttachMenu(false)}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-muted text-muted-foreground rounded-full">
                <X size={18} />
              </div>
              <span className="text-xs">Cancel</span>
            </button>
          </SlideUp>
        )}
      </form>
      
      <div className="flex items-center justify-between mt-2 px-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>Messages disappear after 24h</span>
        </div>
        
        <div>HD quality: on</div>
      </div>
    </div>
  );
};

export default MessageInput;
