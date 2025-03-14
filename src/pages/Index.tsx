
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ChatList from '@/components/ChatList';
import MessageContainer from '@/components/MessageContainer';
import { Chat, Message, generateMockChats, generateMockMessage } from '@/utils/messageUtils';
import { PageTransition } from '@/components/Transitions';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Load username from localStorage once on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'anonymous_user';
    setUsername(storedUsername);
  }, []);

  // Load chats once on component mount
  useEffect(() => {
    const loadChats = () => {
      // Simulate loading chats from API
      const timer = setTimeout(() => {
        const mockChats = generateMockChats(15);
        setChats(mockChats);
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    };

    loadChats();
  }, []);
  
  // Load messages when active chat changes
  const loadMessages = useCallback((chatId: string) => {
    const activeChat = chats.find(chat => chat.id === chatId);
    if (!activeChat) return;
    
    // Simulate loading messages for the active chat
    const mockMessages: Message[] = [];
    const messageCount = Math.floor(Math.random() * 20) + 5;
    const otherUser = activeChat.participants.find(p => p.id !== 'current');
    
    if (otherUser) {
      for (let i = 0; i < messageCount; i++) {
        if (Math.random() > 0.5) {
          mockMessages.push(generateMockMessage('current', otherUser.id));
        } else {
          mockMessages.push(generateMockMessage(otherUser.id, 'current'));
        }
      }
      
      mockMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      setMessages(mockMessages);
      
      // Mark messages as read
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        )
      );
    }
  }, [chats]);
  
  // Effect to load messages when active chat changes
  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
    }
  }, [activeChatId, loadMessages]);
  
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };
  
  const handleNewChat = () => {
    toast.info("Creating a new conversation");
    // Generate a new chat with a random user
    const newChat = generateMockChats(1)[0];
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
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
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update the last message in the chat
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === activeChatId ? { 
          ...chat, 
          lastMessage: newMessage 
        } : chat
      )
    );
    
    // Simulate message being delivered after 1 second
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
      
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChatId && chat.lastMessage?.id === newMessage.id ? { 
            ...chat, 
            lastMessage: { ...newMessage, status: 'delivered' } 
          } : chat
        )
      );
    }, 1000);
    
    // Simulate message being read after 2 seconds
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      );
      
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChatId && chat.lastMessage?.id === newMessage.id ? { 
            ...chat, 
            lastMessage: { ...newMessage, status: 'read' } 
          } : chat
        )
      );
    }, 2000);
    
    // Simulate reply after 3 seconds
    setTimeout(() => {
      if (Math.random() > 0.3) {
        const replyMessages = [
          "That's interesting!",
          "I see what you mean.",
          "Thanks for sharing that.",
          "I'll think about it.",
          "Great point!",
          "What else is on your mind?",
          "I appreciate you telling me.",
          "That makes sense.",
          "I hadn't thought of it that way.",
          "Let's discuss this more."
        ];
        
        const replyContent = replyMessages[Math.floor(Math.random() * replyMessages.length)];
        
        const replyMessage: Message = {
          id: `msg_${Date.now()}`,
          content: replyContent,
          senderId: otherUser.id,
          receiverId: 'current',
          timestamp: new Date(),
          status: 'sent',
          isDeleted: false
        };
        
        setMessages(prev => [...prev, replyMessage]);
        
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === activeChatId ? { 
              ...chat, 
              lastMessage: replyMessage 
            } : chat
          )
        );
      }
    }, 3000);
  };
  
  const handleDeleteMessage = (messageId: string) => {
    // Update the message in the messages array
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isDeleted: true } : msg
      )
    );
    
    // If the deleted message is the last message in the chat, update the chat
    const activeChat = chats.find(chat => chat.id === activeChatId);
    if (activeChat?.lastMessage?.id === messageId) {
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChatId ? { 
            ...chat, 
            lastMessage: { ...chat.lastMessage!, isDeleted: true } 
          } : chat
        )
      );
    }
    
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
            ) : (
              <ChatList 
                chats={chats}
                activeChat={activeChatId || undefined}
                onSelectChat={handleSelectChat}
              />
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
