
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/Transitions';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search as SearchIcon, User, UserPlus } from 'lucide-react';
import { generateRandomUser } from '@/utils/messageUtils';
import UserAvatar from '@/components/UserAvatar';
import { toast } from 'sonner';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{id: string; username: string; status: 'online' | 'offline' | 'away'}>>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a username to search');
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, we'll generate random users if the search query is long enough
      if (searchQuery.length >= 3) {
        const results = [];
        // 50% chance of exact match
        if (Math.random() > 0.5) {
          results.push({
            id: `user_${Math.random().toString(36).substring(2, 10)}`,
            username: searchQuery,
            status: Math.random() > 0.5 ? 'online' : 'offline'
          });
        }
        
        // Add some similar results
        for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
          const user = generateRandomUser();
          results.push({
            id: user.id,
            username: `${searchQuery}_${user.username.split('_')[1]}`,
            status: user.status
          });
        }
        
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      
      setIsSearching(false);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleStartChat = (userId: string, username: string) => {
    toast.success(`Starting chat with ${username}`);
    // In a real app, we would create a new chat with this user
    // and navigate to it
    navigate('/');
  };
  
  const handleBack = () => {
    navigate('/');
  };

  return (
    <PageTransition className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-lg">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">Find Users</h1>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 bg-muted/50 border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-background transition-colors"
            placeholder="Enter exact username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            className="absolute inset-y-0 right-0 px-4 rounded-l-none"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          {searchResults.length === 0 ? (
            <div className="py-12 px-4 text-center">
              {isSearching ? (
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
                  <p className="text-muted-foreground">Searching for users...</p>
                </div>
              ) : searchQuery ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <User size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No results found</h3>
                  <p className="text-muted-foreground text-sm">
                    We couldn't find any users matching "{searchQuery}"
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <SearchIcon size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Search for users</h3>
                  <p className="text-muted-foreground text-sm">
                    Enter a username to find someone to chat with
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="p-4 border-b">
                <h3 className="text-sm font-medium">Search Results</h3>
              </div>
              <ul>
                {searchResults.map((user) => (
                  <li key={user.id} className="border-b last:border-0">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar username={user.username} status={user.status} />
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.status === 'online' ? 'Online' : 'Offline'}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => handleStartChat(user.id, user.username)}
                      >
                        <UserPlus size={16} />
                        <span>Chat</span>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Search;
