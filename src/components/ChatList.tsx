
import React from 'react';
import ChatItem from './ChatItem';
import { Chat } from '@/utils/messageUtils';
import { StaggerContainer } from './Transitions';

interface ChatListProps {
  chats: Chat[];
  activeChat?: string;
  onSelectChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, activeChat, onSelectChat }) => {
  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
        <div className="mb-2 text-4xl">👋</div>
        <p className="mb-1 text-lg font-medium">No conversations yet</p>
        <p className="text-sm">Start chatting by creating a new conversation</p>
      </div>
    );
  }

  return (
    <StaggerContainer className="space-y-1 overflow-y-auto">
      {chats.filter(chat => {
        // Filter out chats without valid participants
        const otherUser = chat.participants.find(p => p.id !== 'current');
        return otherUser !== undefined;
      }).map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeChat}
          onClick={() => onSelectChat(chat.id)}
        />
      ))}
    </StaggerContainer>
  );
};

export default ChatList;
