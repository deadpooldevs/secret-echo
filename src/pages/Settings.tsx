
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Shield, BellRing, Palette, Lock, User } from 'lucide-react';
import { toast } from "sonner";
import { PageTransition } from '@/components/Transitions';
import ProfileForm from '@/components/ProfileForm';

const Settings = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('username');
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  const handleBack = () => {
    navigate('/');
  };

  return (
    <PageTransition className="min-h-screen bg-background">
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>
          
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock size={16} />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <BellRing size={16} />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette size={16} />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield size={16} />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <TabsContent value="profile" className="mt-0">
              <ProfileForm />
            </TabsContent>
            
            <TabsContent value="privacy" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-medium">Privacy Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage how your information is handled and who can contact you.
                </p>
              </div>
              
              <div className="py-4">
                <p className="text-muted-foreground text-center">
                  Privacy settings coming soon in the next update.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Control which notifications you receive and how.
                </p>
              </div>
              
              <div className="py-4">
                <p className="text-muted-foreground text-center">
                  Notification settings coming soon in the next update.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  Customize how AnonyChat looks and feels.
                </p>
              </div>
              
              <div className="py-4">
                <p className="text-muted-foreground text-center">
                  Theme customization coming soon in the next update.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-medium">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your account security and recovery options.
                </p>
              </div>
              
              <div className="py-4">
                <p className="text-muted-foreground text-center">
                  Security settings coming soon in the next update.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Settings;
