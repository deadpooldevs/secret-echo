
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ChatList from '@/components/ChatList';
import MessageContainer from '@/components/MessageContainer';
import { Chat, Message } from '@/utils/messageUtils';
import { PageTransition } from '@/components/Transitions';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { user } = session;
        const storedUsername = localStorage.getItem('username') || user.email || 'anonymous_user';
        setUsername(storedUsername);
      } else {
        const storedUsername = localStorage.getItem('username') || 'anonymous_user';
        setUsername(storedUsername);
      }

      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };
  
  const handleNewChat = () => {
    toast.info("Creating a new conversation");
    // We'll implement real chat creation with Supabase later
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
      status: 'sent' as const,
      isDeleted: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update in the chats list
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === activeChatId ? { 
          ...chat, 
          lastMessage: newMessage 
        } : chat
      )
    );

    // Update message status after delay (simulate delivery)
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
        )
      );
      
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChatId && chat.lastMessage?.id === newMessage.id ? { 
            ...chat, 
            lastMessage: { ...newMessage, status: 'delivered' as const } 
          } : chat
        )
      );
    }, 1000);
  };
  
  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isDeleted: true } : msg
      )
    );
    
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
              <h2 className="text-2xl font-medium mb-2">No conversations yet</h2>
              <p className="text-muted-foreground">
                Start a new conversation to begin chatting
              </p>
              <Button 
                className="mt-6"
                onClick={handleNewChat}
              >
                Start a new conversation
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
