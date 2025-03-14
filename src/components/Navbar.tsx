
import React, { useState } from 'react';
import { Search, Plus, Settings, Menu, X } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { cn } from '@/lib/utils';
import { SlideUp } from './Transitions';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  username: string;
  onNewChat: () => void;
  onSettings: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, onNewChat, onSettings }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/settings');
    onSettings();
  };

  return (
    <div className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-secondary transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <X size={18} /> : <Menu size={18} />}
          </button>

          <SlideUp>
            <div className="text-lg font-medium">Echo</div>
          </SlideUp>
        </div>

        <div 
          className={cn(
            "absolute md:static left-0 right-0 top-16 md:top-auto bg-background/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b md:border-b-0 transition-all duration-300 ease-in-out",
            isExpanded ? "h-[120px] opacity-100" : "h-0 opacity-0 md:opacity-100 md:h-auto pointer-events-none md:pointer-events-auto"
          )}
        >
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3 p-4 md:p-0">
            <div className="relative w-full md:w-64 lg:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-muted-foreground" />
              </div>
              <input
                type="search"
                className="w-full py-2 pl-10 pr-4 text-sm bg-secondary/50 border-none rounded-full focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                className="flex items-center justify-center p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                onClick={onNewChat}
              >
                <Plus size={18} />
              </button>

              <button
                className="flex items-center justify-center p-2 rounded-full hover:bg-secondary transition-colors"
                onClick={handleSettingsClick}
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>

        <UserAvatar 
          username={username} 
          status="online" 
          size="sm" 
          onClick={handleSettingsClick}
        />
      </div>
    </div>
  );
};

export default Navbar;
