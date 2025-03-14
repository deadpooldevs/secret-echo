
import React from 'react';
import { cn } from "@/lib/utils";
import { SlideUp } from './Transitions';

interface UserAvatarProps {
  username: string;
  status?: 'online' | 'offline' | 'away';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showStatus?: boolean;
  onClick?: () => void;
}

const getInitials = (username: string): string => {
  return username.substring(0, 2).toUpperCase();
};

const getRandomColor = (username: string): string => {
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-green-100 text-green-600',
    'bg-amber-100 text-amber-600',
    'bg-rose-100 text-rose-600',
    'bg-sky-100 text-sky-600',
    'bg-indigo-100 text-indigo-600',
  ];
  
  const index = username.charCodeAt(0) % colors.length;
  return colors[index];
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  username,
  status = 'offline',
  size = 'md',
  className,
  showStatus = true,
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
  };

  return (
    <SlideUp>
      <div 
        className={cn(
          "relative rounded-full flex items-center justify-center font-medium transition-all duration-200",
          sizeClasses[size],
          getRandomColor(username),
          onClick && "cursor-pointer hover:shadow-md hover:scale-105",
          className
        )}
        onClick={onClick}
      >
        {getInitials(username)}
        
        {showStatus && (
          <span 
            className={cn(
              "absolute block rounded-full ring-2 ring-white dark:ring-gray-900",
              size === 'sm' ? 'w-2 h-2 bottom-0 right-0' : 
              size === 'md' ? 'w-2.5 h-2.5 bottom-0 right-0' : 
              'w-3 h-3 bottom-0.5 right-0.5',
              statusColors[status]
            )}
          />
        )}
      </div>
    </SlideUp>
  );
};

export default UserAvatar;
