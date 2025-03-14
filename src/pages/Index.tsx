
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ChatList from '@/components/ChatList';
import MessageContainer from '@/components/MessageContainer';
import { Chat, Message } from '@/utils/messageUtils';
import { PageTransition } from '@/components/Transitions';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Load username from localStorage once on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'anonymous_user';
    setUsername(storedUsername);
    setLoading(false);
  }, []);
  
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    
    // Find the chat and its messages
    const activeChat = chats.find(chat => chat.id === chatId);
    if (!activeChat) return;
    
    // Load the messages for this chat
    // In a real app, you would fetch these from your backend
    const chatMessages = activeChat.messages || [];
    setMessages(chatMessages);
    
    // Mark messages as read
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
  };
  
  const handleNewChat = () => {
    // Get username of the current user
    const currentUsername = localStorage.getItem('username') || 'anonymous_user';
    
    // In a real app, you would create a new chat with another user
    // For demo purposes, create a chat with "Echo Bot"
    const newChatId = `chat_${Date.now()}`;
    
    const newChat: Chat = {
      id: newChatId,
      type: 'direct',
      participants: [
        { id: 'current', username: currentUsername, status: 'online' },
        { id: 'echo_bot', username: 'Echo Bot', status: 'online' }
      ],
      unreadCount: 0,
      createdAt: new Date(),
      messages: [],
      isAnonymous: true,
    };
    
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    setMessages([]);
    
    toast.info("Created a new conversation with Echo Bot");
  };
  
  const handleSettings = () => {
    navigate('/settings');
  };
  
  const handleSendMessage = (content: string) => {
    if (!activeChatId) return;
    
    const activeChat = chats.find(chat => chat.id === activeChatId);
    if (!activeChat) return;
    
    const otherUser = activeChat.participants.find(p => p.id !== 'current');
    if (!otherUser) return;
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content,
      senderId: 'current',
      receiverId: otherUser.id,
      timestamp: new Date(),
      status: 'sent',
      isDeleted: false
    };
    
    // Add message to messages list
    setMessages(prev => [...prev, newMessage]);
    
    // Update the messages in the chat
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === activeChatId) {
          const updatedMessages = [...(chat.messages || []), newMessage];
          return { 
            ...chat, 
            messages: updatedMessages,
            lastMessage: newMessage 
          };
        }
        return chat;
      })
    );
    
    // Simulate message being delivered after 1 second
    setTimeout(() => {
      const deliveredMessage = { ...newMessage, status: 'delivered' };
      updateMessageStatus(deliveredMessage);
    }, 1000);
    
    // Simulate message being read after 2 seconds
    setTimeout(() => {
      const readMessage = { ...newMessage, status: 'read' };
      updateMessageStatus(readMessage);
      
      // For Echo Bot, generate a reply
      if (otherUser.id === 'echo_bot') {
        setTimeout(() => {
          sendEchoBotReply(content, otherUser.id);
        }, 1000);
      }
    }, 2000);
  };
  
  const updateMessageStatus = (updatedMessage: Message) => {
    // Update in messages array
    setMessages(prev => 
      prev.map(msg => 
        msg.id === updatedMessage.id ? updatedMessage : msg
      )
    );
    
    // Update in chats array
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === activeChatId) {
          const updatedMessages = (chat.messages || []).map(msg => 
            msg.id === updatedMessage.id ? updatedMessage : msg
          );
          
          return { 
            ...chat, 
            messages: updatedMessages,
            lastMessage: chat.lastMessage?.id === updatedMessage.id ? 
              updatedMessage : chat.lastMessage
          };
        }
        return chat;
      })
    );
  };
  
  const sendEchoBotReply = (originalContent: string, botId: string) => {
    // Generate Echo Bot reply
    let replyContent = `You said: "${originalContent}"`;
    
    const replyMessage: Message = {
      id: `msg_${Date.now()}`,
      content: replyContent,
      senderId: botId,
      receiverId: 'current',
      timestamp: new Date(),
      status: 'sent',
      isDeleted: false
    };
    
    // Add to messages
    setMessages(prev => [...prev, replyMessage]);
    
    // Update in chats
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === activeChatId) {
          const updatedMessages = [...(chat.messages || []), replyMessage];
          return { 
            ...chat, 
            messages: updatedMessages,
            lastMessage: replyMessage 
          };
        }
        return chat;
      })
    );
  };
  
  const handleDeleteMessage = (messageId: string) => {
    // Update the message in the messages array
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isDeleted: true } : msg
      )
    );
    
    // Update in chats array
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === activeChatId) {
          const updatedMessages = (chat.messages || []).map(msg => 
            msg.id === messageId ? { ...msg, isDeleted: true } : msg
          );
          
          return { 
            ...chat, 
            messages: updatedMessages,
            lastMessage: chat.lastMessage?.id === messageId ? 
              { ...chat.lastMessage, isDeleted: true } : chat.lastMessage
          };
        }
        return chat;
      })
    );
    
    toast.success("Message deleted");
  };
  
  const activeChat = chats.find(chat => chat.id === activeChatId);
  const receiver = activeChat?.participants.find(p => p.id !== 'current');

  return (
    <PageTransition className="flex flex-col h-screen max-h-screen">
      <Navbar 
        username={username}
        onNewChat={handleNewChat}
        onSettings={handleSettings}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`border-r bg-background ${
          isMobile && activeChatId ? 'hidden' : 'w-full md:w-80 lg:w-96'
        }`}>
          <div className="p-4 border-b">
            <h2 className="text-xl font-medium">Messages</h2>
          </div>
          
          <div className="h-[calc(100vh-8rem)] overflow-y-auto p-2">
            {loading ? (
              <div className="flex flex-col space-y-3 p-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-secondary rounded animate-pulse mb-2" />
                      <div className="h-3 w-32 bg-secondary rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : chats.length > 0 ? (
              <ChatList 
                chats={chats}
                activeChat={activeChatId || undefined}
                onSelectChat={handleSelectChat}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-muted-foreground mb-4">No conversations yet</p>
                <Button 
                  onClick={handleNewChat}
                  size="sm"
                  variant="outline"
                >
                  Start a new conversation
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Message area */}
        <div className={`flex-1 bg-background ${
          isMobile && !activeChatId ? 'hidden' : 'block'
        }`}>
          {activeChatId && receiver ? (
            <MessageContainer 
              messages={messages}
              receiver={receiver}
              onSendMessage={handleSendMessage}
              onBack={() => setActiveChatId(null)}
              onDeleteMessage={handleDeleteMessage}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="w-16 h-16 mb-4 bg-secondary/50 rounded-full flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-primary"
                >
                  <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                  <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                </svg>
              </div>
              <h2 className="text-2xl font-medium mb-2">Select a chat to start messaging</h2>
              <p className="text-muted-foreground">
                Choose an existing conversation or start a new one
              </p>
              <button 
                className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                onClick={handleNewChat}
              >
                Start a new conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
