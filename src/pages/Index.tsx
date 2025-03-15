
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ChatList from '@/components/ChatList';
import MessageContainer from '@/components/MessageContainer';
import { PageTransition } from '@/components/Transitions';
import { toast } from 'sonner';
import NewChatDialog from '@/components/NewChatDialog';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<any[]>([]);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!data.session) {
          navigate('/login');
          return;
        }
        
        // Get username from local storage or profile
        const storedUsername = localStorage.getItem('username');
        
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', data.session.user.id)
              .single();
              
            if (profileError && profileError.code !== 'PGRST116') throw profileError;
            
            if (profileData) {
              setUsername(profileData.username);
              localStorage.setItem('username', profileData.username);
            } else {
              // Fallback username
              const fallbackUsername = data.session.user.email?.split('@')[0] || 'user';
              setUsername(fallbackUsername);
              localStorage.setItem('username', fallbackUsername);
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
            const fallbackUsername = data.session.user.email?.split('@')[0] || 'user';
            setUsername(fallbackUsername);
            localStorage.setItem('username', fallbackUsername);
          }
        }
      } catch (error) {
        console.error('Session error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // In a real app, we would fetch chats from the database here
    // For now, we're just setting an empty array
    setChats([]);
  }, [navigate]);

  const handleOpenNewChat = () => {
    setNewChatOpen(true);
  };

  const handleSettings = () => {
    // Navigation is handled in the Navbar component
  };

  const handleCreateChat = (recipient: string) => {
    // In a real app, we would create a new chat in the database
    // and then add it to the chats array
    toast.success(`Chat with ${recipient} created!`);
    setNewChatOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageTransition className="flex flex-col min-h-screen bg-background">
      <Navbar 
        username={username} 
        onNewChat={handleOpenNewChat} 
        onSettings={handleSettings} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-80 lg:w-96 border-r overflow-y-auto">
          {chats.length > 0 ? (
            <ChatList 
              chats={chats} 
              selectedChatId={selectedChat} 
              onChatSelect={setSelectedChat} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="bg-primary/10 p-3 rounded-full text-primary mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-lg mb-2">No chats yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Start a new conversation by clicking the + button
              </p>
              <button 
                onClick={handleOpenNewChat}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New Chat
              </button>
            </div>
          )}
        </div>
        
        {selectedChat ? (
          <MessageContainer chatId={selectedChat} username={username} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a chat to start messaging</h3>
              <p className="text-muted-foreground text-sm">
                Choose an existing conversation or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
      
      <NewChatDialog
        open={newChatOpen}
        onOpenChange={setNewChatOpen}
        onCreateChat={handleCreateChat}
      />
    </PageTransition>
  );
};

export default Index;
