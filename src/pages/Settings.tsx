
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/Transitions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import UserAvatar from '@/components/UserAvatar';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Bell, 
  Eye, 
  Lock, 
  Paintbrush, 
  Save, 
  Trash, 
  UserRound 
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const storedUsername = localStorage.getItem('username') || '';
  
  const [username, setUsername] = useState(storedUsername);
  const [settings, setSettings] = useState({
    notifications: true,
    lastSeen: true,
    typingIndicators: true,
    anonymousMode: false,
    darkTheme: window.matchMedia('(prefers-color-scheme: dark)').matches
  });
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleSave = () => {
    // Save username to localStorage
    localStorage.setItem('username', username);
    
    // In a real app, you would save these settings to a database
    toast.success('Settings saved successfully');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
    toast.info('You have been logged out');
  };
  
  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  return (
    <PageTransition className="flex flex-col min-h-screen bg-background">
      <Navbar 
        username={username}
        onNewChat={() => navigate('/')}
        onSettings={() => {}}
      />
      
      <div className="container max-w-md mx-auto p-4 flex-1">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack}
            className="p-2 mr-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <UserAvatar username={username} size="lg" />
              <div>
                <h2 className="font-medium">{username}</h2>
                <p className="text-sm text-muted-foreground">Anonymous User</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center">
              <UserRound className="w-5 h-5 mr-3 text-primary" />
              <h3 className="text-lg font-medium">Profile</h3>
            </div>
            
            <div className="space-y-3 pl-8">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-3 text-primary" />
              <h3 className="text-lg font-medium">Notifications</h3>
            </div>
            
            <div className="space-y-3 pl-8">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex-1">Push notifications</Label>
                <Switch 
                  id="notifications" 
                  checked={settings.notifications} 
                  onCheckedChange={() => handleToggle('notifications')}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-3 text-primary" />
              <h3 className="text-lg font-medium">Privacy</h3>
            </div>
            
            <div className="space-y-3 pl-8">
              <div className="flex items-center justify-between">
                <Label htmlFor="lastSeen" className="flex-1">Last seen status</Label>
                <Switch 
                  id="lastSeen" 
                  checked={settings.lastSeen} 
                  onCheckedChange={() => handleToggle('lastSeen')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="typingIndicators" className="flex-1">Typing indicators</Label>
                <Switch 
                  id="typingIndicators" 
                  checked={settings.typingIndicators} 
                  onCheckedChange={() => handleToggle('typingIndicators')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="anonymousMode" className="flex-1">
                  <div className="space-y-0.5">
                    <div>Anonymous mode</div>
                    <div className="text-xs text-muted-foreground">Become untraceable except to active chats</div>
                  </div>
                </Label>
                <Switch 
                  id="anonymousMode" 
                  checked={settings.anonymousMode} 
                  onCheckedChange={() => handleToggle('anonymousMode')}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Paintbrush className="w-5 h-5 mr-3 text-primary" />
              <h3 className="text-lg font-medium">Appearance</h3>
            </div>
            
            <div className="space-y-3 pl-8">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkTheme" className="flex-1">Dark theme</Label>
                <Switch 
                  id="darkTheme" 
                  checked={settings.darkTheme} 
                  onCheckedChange={() => handleToggle('darkTheme')}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="pt-4 space-y-4">
            <Button 
              onClick={handleSave} 
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleLogout} 
              className="w-full"
            >
              <Lock className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Settings;
