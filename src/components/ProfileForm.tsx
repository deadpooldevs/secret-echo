
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface UserPreferences {
  showLastSeen: boolean;
  showTypingIndicator: boolean;
  messageStorage: 'permanent' | 'disappearing';
  mediaQuality: 'normal' | 'hd';
  anonymousMode: boolean;
  pushNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
}

const ProfileForm = () => {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [preferences, setPreferences] = useState<UserPreferences>({
    showLastSeen: true,
    showTypingIndicator: true,
    messageStorage: 'permanent',
    mediaQuality: 'normal',
    anonymousMode: false,
    pushNotifications: true,
    theme: 'system',
  });

  useEffect(() => {
    // Load username from localStorage
    const storedUsername = localStorage.getItem('username') || 'anonymous_user';
    setUsername(storedUsername);
    setNewUsername(storedUsername);

    // Load preferences from localStorage or use defaults
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      try {
        setPreferences(JSON.parse(storedPreferences));
      } catch (e) {
        console.error('Error parsing stored preferences:', e);
      }
    }
  }, []);

  const savePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // Handle username update if changed
    if (newUsername && newUsername !== username && newUsername.trim() !== '') {
      localStorage.setItem('username', newUsername);
      setUsername(newUsername);
      toast.success('Profile updated successfully');
    } else if (newUsername.trim() === '') {
      toast.error('Username cannot be empty');
      setNewUsername(username);
    } else {
      toast.success('Preferences updated successfully');
    }
  };

  const handleToggle = (key: keyof UserPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleChange = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Username
          </label>
          <input 
            type="text" 
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">
            This is your public display name. Others can find you by typing your exact username.
          </p>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Privacy Settings</h4>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Show Last Seen</label>
            <p className="text-xs text-muted-foreground">
              Allow others to see when you were last active
            </p>
          </div>
          <Switch 
            checked={preferences.showLastSeen}
            onCheckedChange={(checked) => handleToggle('showLastSeen', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Typing Indicator</label>
            <p className="text-xs text-muted-foreground">
              Show when you are typing a message
            </p>
          </div>
          <Switch 
            checked={preferences.showTypingIndicator}
            onCheckedChange={(checked) => handleToggle('showTypingIndicator', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Anonymous Mode</label>
            <p className="text-xs text-muted-foreground">
              Enhanced privacy mode - your activity will be limited
            </p>
          </div>
          <Switch 
            checked={preferences.anonymousMode}
            onCheckedChange={(checked) => handleToggle('anonymousMode', checked)}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Message Settings</h4>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Message Storage</label>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                id="permanent" 
                name="messageStorage" 
                value="permanent"
                checked={preferences.messageStorage === 'permanent'}
                onChange={() => handleChange('messageStorage', 'permanent')}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="permanent" className="text-sm">Permanent</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                id="disappearing" 
                name="messageStorage" 
                value="disappearing"
                checked={preferences.messageStorage === 'disappearing'}
                onChange={() => handleChange('messageStorage', 'disappearing')}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="disappearing" className="text-sm">Disappearing (24h)</label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Media Quality</label>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                id="normal" 
                name="mediaQuality" 
                value="normal"
                checked={preferences.mediaQuality === 'normal'}
                onChange={() => handleChange('mediaQuality', 'normal')}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="normal" className="text-sm">Normal (Compressed)</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                id="hd" 
                name="mediaQuality" 
                value="hd"
                checked={preferences.mediaQuality === 'hd'}
                onChange={() => handleChange('mediaQuality', 'hd')}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="hd" className="text-sm">HD Quality</label>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Push Notifications</label>
            <p className="text-xs text-muted-foreground">
              Receive notifications for new messages
            </p>
          </div>
          <Switch 
            checked={preferences.pushNotifications}
            onCheckedChange={(checked) => handleToggle('pushNotifications', checked)}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Appearance</h4>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Theme</label>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                id="light" 
                name="theme" 
                value="light"
                checked={preferences.theme === 'light'}
                onChange={() => handleChange('theme', 'light')}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="light" className="text-sm">Light</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                id="dark" 
                name="theme" 
                value="dark"
                checked={preferences.theme === 'dark'}
                onChange={() => handleChange('theme', 'dark')}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="dark" className="text-sm">Dark</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                id="system" 
                name="theme" 
                value="system"
                checked={preferences.theme === 'system'}
                onChange={() => handleChange('theme', 'system')}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="system" className="text-sm">System Default</label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={savePreferences}>Save Changes</Button>
      </div>
    </div>
  );
};

export default ProfileForm;
