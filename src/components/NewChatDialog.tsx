
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, UserPlus } from 'lucide-react';

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateChat: (username: string) => void;
}

const NewChatDialog: React.FC<NewChatDialogProps> = ({ 
  open, 
  onOpenChange,
  onCreateChat
}) => {
  const [username, setUsername] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username to search');
      return;
    }
    
    setIsSearching(true);
    
    // Simulate searching for a user
    setTimeout(() => {
      setIsSearching(false);
      
      // For demo purposes, we'll always "find" the user
      onCreateChat(username);
      setUsername('');
      onOpenChange(false);
      
      toast.success(`Starting chat with ${username}`);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                placeholder="Enter exact username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              You must enter the exact username to find a user.
            </p>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Searching...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Start Chat
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
